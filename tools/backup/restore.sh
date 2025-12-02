#!/bin/bash
# restore.sh - Ozean Licht Restore System
# Version: 1.0.0

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ECOSYSTEM_ROOT="/opt/ozean-licht-ecosystem"

# Source configuration
source "${SCRIPT_DIR}/config.env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Export Borg environment
export BORG_REPO
export BORG_PASSPHRASE
export BORG_RSH

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

#######################################
# List Available Backups
#######################################
list_backups() {
    log_info "Available backups:"
    echo ""
    borg list "${BORG_REPO}" 2>&1
    echo ""
}

#######################################
# Show Backup Contents
#######################################
show_contents() {
    local archive="$1"

    if [[ -z "$archive" ]]; then
        log_error "Archive name required"
        echo "Usage: $0 contents <archive-name>"
        exit 1
    fi

    log_info "Contents of archive: ${archive}"
    borg list "${BORG_REPO}::${archive}" 2>&1 | head -50
    echo "..."
    log_info "(Showing first 50 entries)"
}

#######################################
# Extract Files
#######################################
extract_files() {
    local archive="$1"
    local target_dir="${2:-/tmp/ozean-restore}"
    local path_pattern="${3:-}"

    if [[ -z "$archive" ]]; then
        log_error "Archive name required"
        echo "Usage: $0 extract <archive-name> [target-dir] [path-pattern]"
        exit 1
    fi

    log_warning "This will extract files to: ${target_dir}"
    read -p "Continue? (yes/NO) " -r
    echo
    if [[ ! $REPLY == "yes" ]]; then
        log_info "Restore cancelled"
        exit 0
    fi

    mkdir -p "${target_dir}"
    cd "${target_dir}"

    log_info "Extracting archive: ${archive}"

    if [[ -n "$path_pattern" ]]; then
        borg extract "${BORG_REPO}::${archive}" "${path_pattern}" 2>&1
    else
        borg extract "${BORG_REPO}::${archive}" 2>&1
    fi

    log_success "Extraction completed to: ${target_dir}"
    ls -la "${target_dir}"
}

#######################################
# Restore Single File
#######################################
restore_file() {
    local archive="$1"
    local file_path="$2"
    local target="${3:-}"

    if [[ -z "$archive" ]] || [[ -z "$file_path" ]]; then
        log_error "Archive name and file path required"
        echo "Usage: $0 file <archive-name> <file-path> [target-path]"
        exit 1
    fi

    local temp_dir=$(mktemp -d)
    cd "${temp_dir}"

    log_info "Extracting file: ${file_path}"
    borg extract "${BORG_REPO}::${archive}" "${file_path}" 2>&1

    if [[ -n "$target" ]]; then
        log_info "Moving to target: ${target}"
        mv "${temp_dir}/${file_path}" "${target}"
    else
        log_info "File extracted to: ${temp_dir}/${file_path}"
    fi

    log_success "File restored successfully"
}

#######################################
# Restore Database
#######################################
restore_database() {
    local archive="$1"
    local db_name="$2"

    if [[ -z "$archive" ]] || [[ -z "$db_name" ]]; then
        log_error "Archive name and database name required"
        echo "Usage: $0 database <archive-name> <db-name>"
        echo "Available databases: kids_ascension, ozean_licht, shared_users"
        exit 1
    fi

    log_warning "!!! DESTRUCTIVE OPERATION !!!"
    log_warning "This will REPLACE the database: ${db_name}"
    read -p "Type 'RESTORE' to confirm: " -r
    echo
    if [[ ! $REPLY == "RESTORE" ]]; then
        log_info "Restore cancelled"
        exit 0
    fi

    # Load database URLs
    source "${ECOSYSTEM_ROOT}/.env"

    declare -A databases=(
        ["kids_ascension"]="${POSTGRES_KA_URL:-}"
        ["ozean_licht"]="${POSTGRES_OL_URL:-}"
        ["shared_users"]="${POSTGRES_SHARED_URL:-}"
    )

    local db_url="${databases[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        log_error "Unknown database: ${db_name}"
        exit 1
    fi

    # Extract database dump
    local temp_dir=$(mktemp -d)
    cd "${temp_dir}"

    log_info "Extracting database backup from archive..."
    borg extract "${BORG_REPO}::${archive}" "tmp/ozean-db-backups/${db_name}-*.sql.gz" 2>&1 || {
        log_error "Could not find database dump in archive"
        exit 1
    }

    local dump_file=$(find "${temp_dir}" -name "${db_name}-*.sql.gz" | head -1)
    if [[ -z "$dump_file" ]]; then
        log_error "Database dump file not found"
        exit 1
    fi

    log_info "Restoring database from: ${dump_file}"
    gunzip -c "$dump_file" | psql "$db_url" 2>&1

    log_success "Database ${db_name} restored successfully"

    # Cleanup
    rm -rf "${temp_dir}"
}

#######################################
# Mount Archive (FUSE)
#######################################
mount_archive() {
    local archive="$1"
    local mount_point="${2:-/mnt/borg-restore}"

    if [[ -z "$archive" ]]; then
        log_error "Archive name required"
        echo "Usage: $0 mount <archive-name> [mount-point]"
        exit 1
    fi

    mkdir -p "${mount_point}"

    log_info "Mounting archive at: ${mount_point}"
    log_info "Use 'fusermount -u ${mount_point}' to unmount"

    borg mount "${BORG_REPO}::${archive}" "${mount_point}" 2>&1

    log_success "Archive mounted at: ${mount_point}"
}

#######################################
# Diff Between Archives
#######################################
diff_archives() {
    local archive1="$1"
    local archive2="$2"

    if [[ -z "$archive1" ]] || [[ -z "$archive2" ]]; then
        log_error "Two archive names required"
        echo "Usage: $0 diff <archive1> <archive2>"
        exit 1
    fi

    log_info "Comparing archives: ${archive1} vs ${archive2}"
    borg diff "${BORG_REPO}::${archive1}" "${archive2}" 2>&1
}

#######################################
# Main
#######################################
main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        list)
            list_backups
            ;;
        contents)
            show_contents "$@"
            ;;
        extract)
            extract_files "$@"
            ;;
        file)
            restore_file "$@"
            ;;
        database|db)
            restore_database "$@"
            ;;
        mount)
            mount_archive "$@"
            ;;
        diff)
            diff_archives "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Ozean Licht Restore System
==========================

Usage: $0 <operation> [arguments]

Operations:
  list                          List all available backup archives
  contents <archive>            Show contents of an archive
  extract <archive> [dir]       Extract entire archive to directory
  file <archive> <path> [dest]  Restore a single file
  database <archive> <db>       Restore a database (DESTRUCTIVE!)
  mount <archive> [mountpoint]  Mount archive as FUSE filesystem
  diff <archive1> <archive2>    Show differences between archives
  help                          Show this help message

Examples:
  # List all backups
  $0 list

  # See what's in a backup
  $0 contents code-20241201-120000

  # Extract entire backup
  $0 extract code-20241201-120000 /tmp/restore

  # Restore a single config file
  $0 file code-20241201-120000 opt/ozean-licht-ecosystem/.env /tmp/.env.restored

  # Restore database (careful!)
  $0 database code-20241201-120000 kids_ascension

  # Mount and browse
  $0 mount code-20241201-120000 /mnt/backup
  ls /mnt/backup/
  fusermount -u /mnt/backup

EOF
            ;;
        *)
            log_error "Unknown operation: $operation"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"
