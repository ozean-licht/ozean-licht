#!/bin/bash
#
# Cursor Server Cache Cleanup Script
# Automatically cleans Cursor workspace storage, logs, and extension cache
# Safe to run - checks if Cursor is active before cleanup
#
# Usage:
#   ./cursor-cache-cleanup.sh [--force]
#
# Options:
#   --force    Skip Cursor running check (use with caution)
#
# Cron Example (weekly on Sunday at 3 AM):
#   0 3 * * 0 /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh >> /var/log/cursor-cleanup.log 2>&1
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CURSOR_SERVER_DIR="/root/.cursor-server"
LOG_FILE="/var/log/cursor-cleanup.log"
DRY_RUN=false
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✅ $*" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ⚠️  $*" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ❌ $*" | tee -a "$LOG_FILE"
}

# Check if running as root (required for /root/.cursor-server)
if [[ $EUID -ne 0 ]] && [[ -d "/root/.cursor-server" ]]; then
    log_error "This script must be run as root to clean /root/.cursor-server"
    log "Try: sudo $0 $*"
    exit 1
fi

log "════════════════════════════════════════════════════════════"
log "Cursor Server Cache Cleanup"
log "════════════════════════════════════════════════════════════"

# Check if Cursor server directory exists
if [[ ! -d "$CURSOR_SERVER_DIR" ]]; then
    log_warning "Cursor server directory not found: $CURSOR_SERVER_DIR"
    exit 0
fi

# Check if Cursor is currently running
CURSOR_RUNNING=$(pgrep -f "cursor-server" | wc -l)

if [[ $CURSOR_RUNNING -gt 0 ]] && [[ $FORCE == false ]]; then
    log_warning "Cursor server is currently running ($CURSOR_RUNNING processes)"
    log_warning "Cleanup skipped for safety. Close Cursor or use --force flag."
    log_warning "Active processes:"
    pgrep -fa "cursor-server" | head -5 | tee -a "$LOG_FILE"
    exit 0
fi

if [[ $CURSOR_RUNNING -gt 0 ]] && [[ $FORCE == true ]]; then
    log_warning "Cursor is running but --force flag provided. Proceeding with cleanup..."
fi

# Calculate sizes before cleanup
log "Calculating current cache sizes..."

WORKSPACE_SIZE=0
LOGS_SIZE=0
CACHE_SIZE=0

if [[ -d "$CURSOR_SERVER_DIR/data/User/workspaceStorage" ]]; then
    WORKSPACE_SIZE=$(du -sb "$CURSOR_SERVER_DIR/data/User/workspaceStorage" 2>/dev/null | cut -f1 || echo 0)
fi

if [[ -d "$CURSOR_SERVER_DIR/data/logs" ]]; then
    LOGS_SIZE=$(du -sb "$CURSOR_SERVER_DIR/data/logs" 2>/dev/null | cut -f1 || echo 0)
fi

if [[ -d "$CURSOR_SERVER_DIR/data/CachedData" ]]; then
    CACHE_SIZE=$(du -sb "$CURSOR_SERVER_DIR/data/CachedData" 2>/dev/null | cut -f1 || echo 0)
fi

# Human-readable sizes
format_bytes() {
    numfmt --to=iec-i --suffix=B "$1" 2>/dev/null || echo "$1 bytes"
}

log "Current cache sizes:"
log "  - Workspace Storage: $(format_bytes $WORKSPACE_SIZE)"
log "  - Logs: $(format_bytes $LOGS_SIZE)"
log "  - Cached Data: $(format_bytes $CACHE_SIZE)"
log "  - Total: $(format_bytes $((WORKSPACE_SIZE + LOGS_SIZE + CACHE_SIZE)))"

# Dry run check
if [[ $DRY_RUN == true ]]; then
    log_warning "DRY RUN MODE - No changes will be made"
    log "Would clean the following directories:"
    log "  - $CURSOR_SERVER_DIR/data/User/workspaceStorage/*"
    log "  - $CURSOR_SERVER_DIR/data/logs/*"
    log "  - $CURSOR_SERVER_DIR/data/CachedData/* (if older than 7 days)"
    exit 0
fi

# Perform cleanup
log "Starting cleanup..."

# 1. Clean workspace storage (extension state, workspace cache)
if [[ -d "$CURSOR_SERVER_DIR/data/User/workspaceStorage" ]]; then
    log "Cleaning workspace storage..."
    WORKSPACE_COUNT=$(find "$CURSOR_SERVER_DIR/data/User/workspaceStorage" -mindepth 1 -maxdepth 1 | wc -l)

    if [[ $WORKSPACE_COUNT -gt 0 ]]; then
        rm -rf "${CURSOR_SERVER_DIR}/data/User/workspaceStorage/"* 2>/dev/null || true
        log_success "Cleaned $WORKSPACE_COUNT workspace cache directories"
    else
        log "No workspace cache to clean"
    fi
fi

# 2. Clean old logs (keep last 3 days)
if [[ -d "$CURSOR_SERVER_DIR/data/logs" ]]; then
    log "Cleaning old logs (keeping last 3 days)..."
    OLD_LOGS=$(find "$CURSOR_SERVER_DIR/data/logs" -type f -mtime +3 | wc -l)

    if [[ $OLD_LOGS -gt 0 ]]; then
        find "$CURSOR_SERVER_DIR/data/logs" -type f -mtime +3 -delete 2>/dev/null || true
        log_success "Removed $OLD_LOGS old log files"
    else
        log "No old logs to clean"
    fi
fi

# 3. Clean cached extension data (older than 7 days)
if [[ -d "$CURSOR_SERVER_DIR/data/CachedData" ]]; then
    log "Cleaning cached data (older than 7 days)..."
    OLD_CACHE=$(find "$CURSOR_SERVER_DIR/data/CachedData" -type f -mtime +7 | wc -l)

    if [[ $OLD_CACHE -gt 0 ]]; then
        find "$CURSOR_SERVER_DIR/data/CachedData" -type f -mtime +7 -delete 2>/dev/null || true
        log_success "Removed $OLD_CACHE cached files"
    else
        log "No old cached data to clean"
    fi
fi

# 4. Clean temporary files
if [[ -d "$CURSOR_SERVER_DIR/data/tmp" ]]; then
    log "Cleaning temporary files..."
    TMP_COUNT=$(find "$CURSOR_SERVER_DIR/data/tmp" -type f | wc -l)

    if [[ $TMP_COUNT -gt 0 ]]; then
        rm -rf "${CURSOR_SERVER_DIR}/data/tmp/"* 2>/dev/null || true
        log_success "Cleaned $TMP_COUNT temporary files"
    fi
fi

# Calculate sizes after cleanup
log "Calculating sizes after cleanup..."

WORKSPACE_SIZE_AFTER=0
LOGS_SIZE_AFTER=0
CACHE_SIZE_AFTER=0

if [[ -d "$CURSOR_SERVER_DIR/data/User/workspaceStorage" ]]; then
    WORKSPACE_SIZE_AFTER=$(du -sb "$CURSOR_SERVER_DIR/data/User/workspaceStorage" 2>/dev/null | cut -f1 || echo 0)
fi

if [[ -d "$CURSOR_SERVER_DIR/data/logs" ]]; then
    LOGS_SIZE_AFTER=$(du -sb "$CURSOR_SERVER_DIR/data/logs" 2>/dev/null | cut -f1 || echo 0)
fi

if [[ -d "$CURSOR_SERVER_DIR/data/CachedData" ]]; then
    CACHE_SIZE_AFTER=$(du -sb "$CURSOR_SERVER_DIR/data/CachedData" 2>/dev/null | cut -f1 || echo 0)
fi

# Calculate freed space
FREED_SPACE=$((WORKSPACE_SIZE + LOGS_SIZE + CACHE_SIZE - WORKSPACE_SIZE_AFTER - LOGS_SIZE_AFTER - CACHE_SIZE_AFTER))

log "════════════════════════════════════════════════════════════"
log_success "Cleanup complete!"
log "Freed space: $(format_bytes $FREED_SPACE)"
log "New total: $(format_bytes $((WORKSPACE_SIZE_AFTER + LOGS_SIZE_AFTER + CACHE_SIZE_AFTER)))"
log "════════════════════════════════════════════════════════════"

# Clean up empty directories
find "$CURSOR_SERVER_DIR/data" -type d -empty -delete 2>/dev/null || true

exit 0
