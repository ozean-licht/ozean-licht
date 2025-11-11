#!/bin/bash
# database.sh - PostgreSQL database operations
# Version: 1.0.0
# Description: Backup, restore, and database utilities

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="database"

# Check dependencies
require_command "psql"
require_command "pg_dump"

# Database configurations
declare -A DB_URLS=(
    ["kids_ascension_db"]="${POSTGRES_KA_URL:-}"
    ["ozean_licht_db"]="${POSTGRES_OL_URL:-}"
    ["shared_users_db"]="${POSTGRES_SHARED_URL:-}"
)

#######################################
# Backup Database
#######################################

backup_database() {
    local db_name="$1"
    local output_path="$2"

    if [[ -z "$db_name" ]] || [[ -z "$output_path" ]]; then
        handle_error 1 "Usage: backup_database <db_name> <output_path>"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_info "Backing up database: $db_name to $output_path"

    # Create output directory if needed
    mkdir -p "$(dirname "$output_path")"

    # Perform backup
    local start_time=$(date +%s)
    pg_dump "$db_url" > "$output_path" 2>&1
    local exit_code=$?
    local end_time=$(date +%s)
    local duration=$(( (end_time - start_time) * 1000 ))

    with_lock "state-file" record_execution "$TOOL_NAME" "pg_dump $db_name" "$exit_code" "$duration" ""

    if [[ $exit_code -eq 0 ]]; then
        local size=$(du -h "$output_path" | cut -f1)
        log_success "Backup completed: $size"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "healthy" "{\"message\": \"Backup of $db_name successful\"}"
        return 0
    else
        log_error "Backup failed"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "unhealthy" "{\"message\": \"Backup of $db_name failed\"}"
        return 1
    fi
}

#######################################
# Restore Database
#######################################

restore_database() {
    local db_name="$1"
    local backup_path="$2"

    if [[ -z "$db_name" ]] || [[ -z "$backup_path" ]]; then
        handle_error 1 "Usage: restore_database <db_name> <backup_path>"
    fi

    if [[ ! -f "$backup_path" ]]; then
        handle_error 1 "Backup file not found: $backup_path"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_warning "⚠️  This will restore database: $db_name from $backup_path"
    read -p "Are you sure? This is destructive! (yes/NO) " -r
    echo
    if [[ ! $REPLY == "yes" ]]; then
        log_info "Restore cancelled"
        return 1
    fi

    log_info "Restoring database: $db_name from $backup_path"

    # Perform restore
    local start_time=$(date +%s)
    psql "$db_url" < "$backup_path" 2>&1
    local exit_code=$?
    local end_time=$(date +%s)
    local duration=$(( (end_time - start_time) * 1000 ))

    with_lock "state-file" record_execution "$TOOL_NAME" "psql restore $db_name" "$exit_code" "$duration" ""

    if [[ $exit_code -eq 0 ]]; then
        log_success "Restore completed"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "healthy" "{\"message\": \"Restore of $db_name successful\"}"
        return 0
    else
        log_error "Restore failed"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "unhealthy" "{\"message\": \"Restore of $db_name failed\"}"
        return 1
    fi
}

#######################################
# Run Migrations
#######################################

run_migrations() {
    local app="$1"

    if [[ -z "$app" ]]; then
        handle_error 1 "App name required (e.g., admin, kids-ascension)"
    fi

    local app_dir="/opt/ozean-licht-ecosystem/apps/$app"

    if [[ ! -d "$app_dir" ]]; then
        handle_error 1 "App directory not found: $app_dir"
    fi

    log_info "Running migrations for app: $app"

    cd "$app_dir" || handle_error 1 "Could not change to app directory"

    # Check if using Prisma
    if [[ -f "prisma/schema.prisma" ]]; then
        log_info "Detected Prisma - running migrations"
        execute_and_record "$TOOL_NAME" npx prisma migrate deploy
    else
        log_warning "No Prisma schema found - checking for other migration systems"
        if [[ -f "package.json" ]] && grep -q "db:migrate" package.json; then
            execute_and_record "$TOOL_NAME" npm run db:migrate
        else
            log_error "No migration system detected"
            return 1
        fi
    fi

    if [[ $? -eq 0 ]]; then
        log_success "Migrations completed"
    else
        log_error "Migrations failed"
        return 1
    fi
}

#######################################
# Database Size
#######################################

database_size() {
    local db_name="$1"

    if [[ -z "$db_name" ]]; then
        handle_error 1 "Database name required"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_info "Getting size for database: $db_name"

    psql "$db_url" -c "
        SELECT
            pg_database.datname as database_name,
            pg_size_pretty(pg_database_size(pg_database.datname)) as size
        FROM pg_database
        WHERE datname = current_database();
    "

    log_success "Database size retrieved"
}

#######################################
# Active Connections
#######################################

active_connections() {
    local db_name="$1"

    if [[ -z "$db_name" ]]; then
        handle_error 1 "Database name required"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_info "Getting active connections for: $db_name"

    psql "$db_url" -c "
        SELECT
            pid,
            usename,
            application_name,
            client_addr,
            state,
            query_start,
            state_change
        FROM pg_stat_activity
        WHERE datname = current_database()
        ORDER BY query_start DESC;
    "

    log_success "Active connections listed"
}

#######################################
# Table Sizes
#######################################

table_sizes() {
    local db_name="$1"

    if [[ -z "$db_name" ]]; then
        handle_error 1 "Database name required"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_info "Getting table sizes for: $db_name"

    psql "$db_url" -c "
        SELECT
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
            pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) -
                          pg_relation_size(schemaname||'.'||tablename)) as indexes_size
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
        LIMIT 20;
    "

    log_success "Table sizes retrieved"
}

#######################################
# Vacuum Database
#######################################

vacuum_database() {
    local db_name="$1"
    local full="${2:-false}"

    if [[ -z "$db_name" ]]; then
        handle_error 1 "Database name required"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    if [[ "$full" == "true" ]]; then
        log_info "Running VACUUM FULL on: $db_name (this may take a while)"
        execute_and_record "$TOOL_NAME" psql "$db_url" -c "VACUUM FULL ANALYZE;"
    else
        log_info "Running VACUUM on: $db_name"
        execute_and_record "$TOOL_NAME" psql "$db_url" -c "VACUUM ANALYZE;"
    fi

    if [[ $? -eq 0 ]]; then
        log_success "Vacuum completed"
    else
        log_error "Vacuum failed"
        return 1
    fi
}

#######################################
# Query Execution
#######################################

execute_query() {
    local db_name="$1"
    shift
    local query="$*"

    if [[ -z "$db_name" ]] || [[ -z "$query" ]]; then
        handle_error 1 "Usage: execute_query <db_name> <query>"
    fi

    local db_url="${DB_URLS[$db_name]:-}"
    if [[ -z "$db_url" ]]; then
        handle_error 1 "Unknown database: $db_name"
    fi

    log_info "Executing query on: $db_name"
    log_debug "Query: $query"

    psql "$db_url" -c "$query"

    if [[ $? -eq 0 ]]; then
        log_success "Query executed"
    else
        log_error "Query failed"
        return 1
    fi
}

#######################################
# Main Function
#######################################

main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        backup_database)
            backup_database "$@"
            ;;
        restore_database)
            restore_database "$@"
            ;;
        run_migrations)
            run_migrations "$@"
            ;;
        database_size)
            database_size "$@"
            ;;
        active_connections)
            active_connections "$@"
            ;;
        table_sizes)
            table_sizes "$@"
            ;;
        vacuum_database)
            vacuum_database "$@"
            ;;
        execute_query)
            execute_query "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Database Operations Script - PostgreSQL Utilities
Version: 1.0.0

Usage: $0 <operation> [arguments]

Operations:
  backup_database <db> <output_path>     Backup database to file
  restore_database <db> <backup_path>    Restore database from backup
  run_migrations <app>                   Run database migrations for app
  database_size <db>                     Get database size
  active_connections <db>                Show active connections
  table_sizes <db>                       Show table sizes
  vacuum_database <db> [full]            Vacuum database (full=true for VACUUM FULL)
  execute_query <db> <query>             Execute SQL query
  help                                   Show this help message

Available Databases:
  - kids_ascension_db
  - ozean_licht_db
  - shared_users_db

Examples:
  # Backup
  $0 backup_database kids_ascension_db /backups/ka-backup.sql

  # Restore (destructive!)
  $0 restore_database kids_ascension_db /backups/ka-backup.sql

  # Migrations
  $0 run_migrations admin

  # Info
  $0 database_size kids_ascension_db
  $0 active_connections kids_ascension_db
  $0 table_sizes kids_ascension_db

  # Maintenance
  $0 vacuum_database kids_ascension_db
  $0 vacuum_database kids_ascension_db true

  # Query
  $0 execute_query kids_ascension_db "SELECT COUNT(*) FROM users;"

Environment Variables:
  POSTGRES_KA_URL      Kids Ascension database URL
  POSTGRES_OL_URL      Ozean Licht database URL
  POSTGRES_SHARED_URL  Shared users database URL

Safety Features:
  - Confirmation prompt for restore operations
  - State tracking for all operations
  - Error handling and logging

EOF
            ;;
        *)
            log_error "Unknown operation: $operation"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function if script is executed (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
