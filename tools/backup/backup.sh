#!/bin/bash
# backup.sh - Ozean Licht Backup System using BorgBackup
# Version: 1.0.0
# Target: Hetzner Storage Box BX21

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ECOSYSTEM_ROOT="/opt/ozean-licht-ecosystem"

# Source configuration
source "${SCRIPT_DIR}/config.env"

# Source shared utilities if available
if [[ -f "${ECOSYSTEM_ROOT}/tools/scripts/utils.sh" ]]; then
    source "${ECOSYSTEM_ROOT}/tools/scripts/utils.sh"
else
    # Minimal logging fallback
    log_info() { echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1"; }
    log_success() { echo "[SUCCESS] $(date '+%Y-%m-%d %H:%M:%S') - $1"; }
    log_warning() { echo "[WARNING] $(date '+%Y-%m-%d %H:%M:%S') - $1"; }
    log_error() { echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2; }
fi

# Export Borg environment
export BORG_REPO
export BORG_PASSPHRASE
export BORG_RSH

# Create log directory
mkdir -p "${LOG_DIR}"
LOG_FILE="${LOG_DIR}/backup-$(date '+%Y-%m-%d').log"

# Redirect output to log file and stdout
exec > >(tee -a "${LOG_FILE}") 2>&1

#######################################
# Backup Databases
#######################################
backup_databases() {
    log_info "Starting database backup..."

    local timestamp=$(date '+%Y%m%d-%H%M%S')
    mkdir -p "${DB_BACKUP_DIR}"

    # Load database URLs from main .env
    if [[ -f "${ECOSYSTEM_ROOT}/.env" ]]; then
        source "${ECOSYSTEM_ROOT}/.env"
    fi

    local db_success=0
    local db_failed=0

    # Backup each database
    declare -A databases=(
        ["kids_ascension"]="${POSTGRES_KA_URL:-}"
        ["ozean_licht"]="${POSTGRES_OL_URL:-}"
        ["shared_users"]="${POSTGRES_SHARED_URL:-}"
    )

    for db_name in "${!databases[@]}"; do
        local db_url="${databases[$db_name]}"
        if [[ -n "$db_url" ]]; then
            local dump_file="${DB_BACKUP_DIR}/${db_name}-${timestamp}.sql.gz"
            log_info "Backing up database: ${db_name}"

            if pg_dump "$db_url" 2>/dev/null | gzip > "$dump_file"; then
                local size=$(du -h "$dump_file" | cut -f1)
                log_success "Database ${db_name} backed up: ${size}"
                ((db_success++))
            else
                log_warning "Failed to backup database: ${db_name}"
                ((db_failed++))
            fi
        else
            log_warning "No URL configured for database: ${db_name}"
        fi
    done

    log_info "Database backup complete: ${db_success} successful, ${db_failed} failed"

    # Return success if at least one database was backed up
    [[ $db_success -gt 0 ]]
}

#######################################
# Backup Code and Configs
#######################################
backup_code() {
    log_info "Starting code/config backup..."

    local archive_name="code-$(date '+%Y%m%d-%H%M%S')"

    # Build exclude arguments
    local exclude_args=""
    for pattern in "${BACKUP_EXCLUDES[@]}"; do
        exclude_args+=" --exclude=${pattern}"
    done

    log_info "Creating Borg archive: ${archive_name}"

    if borg create \
        --verbose \
        --stats \
        --compression zstd,3 \
        ${exclude_args} \
        "${BORG_REPO}::${archive_name}" \
        "${BACKUP_CODE_PATH}" \
        "${DB_BACKUP_DIR}" 2>&1; then

        log_success "Code backup completed: ${archive_name}"
        return 0
    else
        log_error "Code backup failed"
        return 1
    fi
}

#######################################
# Prune Old Backups
#######################################
prune_backups() {
    log_info "Pruning old backups..."

    if borg prune \
        --verbose \
        --list \
        --keep-hourly="${KEEP_HOURLY}" \
        --keep-daily="${KEEP_DAILY}" \
        --keep-weekly="${KEEP_WEEKLY}" \
        --keep-monthly="${KEEP_MONTHLY}" \
        "${BORG_REPO}" 2>&1; then

        log_success "Backup pruning completed"
        return 0
    else
        log_error "Backup pruning failed"
        return 1
    fi
}

#######################################
# Compact Repository
#######################################
compact_repo() {
    log_info "Compacting repository..."

    if borg compact "${BORG_REPO}" 2>&1; then
        log_success "Repository compacted"
        return 0
    else
        log_warning "Repository compaction failed (non-critical)"
        return 0
    fi
}

#######################################
# Check Repository
#######################################
check_repo() {
    log_info "Verifying repository integrity..."

    if borg check --repository-only "${BORG_REPO}" 2>&1; then
        log_success "Repository integrity verified"
        return 0
    else
        log_error "Repository integrity check failed!"
        return 1
    fi
}

#######################################
# List Backups
#######################################
list_backups() {
    log_info "Listing backups..."
    borg list "${BORG_REPO}" 2>&1
}

#######################################
# Repository Info
#######################################
repo_info() {
    log_info "Repository information..."
    borg info "${BORG_REPO}" 2>&1
}

#######################################
# Cleanup Temp Files
#######################################
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "${DB_BACKUP_DIR}"/*.sql.gz 2>/dev/null || true

    # Clean old logs
    find "${LOG_DIR}" -name "backup-*.log" -mtime "+${LOG_RETENTION_DAYS}" -delete 2>/dev/null || true

    log_success "Cleanup completed"
}

#######################################
# Send Notification (optional)
#######################################
send_notification() {
    local status="$1"
    local message="$2"

    if [[ "${TELEGRAM_ENABLED}" == "true" ]] && [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
        curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d chat_id="${TELEGRAM_CHAT_ID}" \
            -d text="[Ozean Backup] ${status}: ${message}" \
            -d parse_mode="Markdown" >/dev/null 2>&1 || true
    fi
}

#######################################
# Full Backup
#######################################
full_backup() {
    local start_time=$(date +%s)
    log_info "=========================================="
    log_info "Starting full backup: $(date)"
    log_info "=========================================="

    local status="SUCCESS"
    local errors=()

    # Step 1: Backup databases
    if ! backup_databases; then
        errors+=("Database backup failed")
    fi

    # Step 2: Backup code and configs
    if ! backup_code; then
        errors+=("Code backup failed")
        status="FAILED"
    fi

    # Step 3: Prune old backups
    if ! prune_backups; then
        errors+=("Pruning failed")
    fi

    # Step 4: Compact repository
    compact_repo

    # Step 5: Cleanup
    cleanup

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "=========================================="
    log_info "Backup completed in ${duration} seconds"
    log_info "Status: ${status}"
    if [[ ${#errors[@]} -gt 0 ]]; then
        log_warning "Errors: ${errors[*]}"
    fi
    log_info "=========================================="

    send_notification "${status}" "Backup completed in ${duration}s"

    [[ "${status}" == "SUCCESS" ]]
}

#######################################
# Database-Only Backup (for hourly)
#######################################
db_backup() {
    local start_time=$(date +%s)
    log_info "Starting database-only backup: $(date)"

    if backup_databases && backup_code; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log_success "Database backup completed in ${duration} seconds"
        return 0
    else
        log_error "Database backup failed"
        return 1
    fi
}

#######################################
# Main
#######################################
main() {
    local operation="${1:-full}"

    case "$operation" in
        full)
            full_backup
            ;;
        db|database)
            db_backup
            ;;
        prune)
            prune_backups
            ;;
        compact)
            compact_repo
            ;;
        check)
            check_repo
            ;;
        list)
            list_backups
            ;;
        info)
            repo_info
            ;;
        help|--help|-h)
            cat <<EOF
Ozean Licht Backup System
=========================

Usage: $0 <operation>

Operations:
  full        Full backup (databases + code + prune)
  db          Database-only backup (hourly)
  prune       Prune old backups according to retention policy
  compact     Compact the repository to free space
  check       Verify repository integrity
  list        List all backup archives
  info        Show repository information
  help        Show this help message

Backup Schedule (recommended):
  Hourly:  0 * * * *     $0 db
  Daily:   0 3 * * *     $0 full

Configuration: ${SCRIPT_DIR}/config.env
Logs: ${LOG_DIR}/

EOF
            ;;
        *)
            log_error "Unknown operation: $operation"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main
main "$@"
