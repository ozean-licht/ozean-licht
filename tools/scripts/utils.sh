#!/bin/bash
# utils.sh - Shared utilities for Ozean Licht tool scripts
# Version: 1.0.0
# Description: Common functions for logging, state management, error handling, and more

# Enable strict error handling
set -euo pipefail

#######################################
# Configuration
#######################################

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INVENTORY_DIR="${SCRIPT_DIR}/../inventory"
STATE_FILE="${INVENTORY_DIR}/tool-state.json"
CATALOG_FILE="${INVENTORY_DIR}/tool-catalog.json"
LOCK_DIR="/tmp/ozean-tool-locks"

# Create lock directory if it doesn't exist
mkdir -p "${LOCK_DIR}"

# State retention (7 days in seconds)
STATE_RETENTION_SECONDS=604800

#######################################
# Logging Functions
#######################################

# Log info message
# Arguments:
#   $1 - Message to log
# Example:
#   log_info "Starting deployment"
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Log success message
# Arguments:
#   $1 - Message to log
# Example:
#   log_success "Deployment completed"
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Log warning message
# Arguments:
#   $1 - Message to log
# Example:
#   log_warning "Service is slow"
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Log error message
# Arguments:
#   $1 - Message to log
# Example:
#   log_error "Connection failed"
log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

# Log debug message
# Arguments:
#   $1 - Message to log
# Example:
#   log_debug "Variable value: $var"
log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${MAGENTA}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

#######################################
# Error Handling
#######################################

# Handle error with exit
# Arguments:
#   $1 - Exit code
#   $2 - Error message
# Example:
#   handle_error 1 "Failed to connect to server"
handle_error() {
    local exit_code="$1"
    local message="$2"
    log_error "$message"
    exit "$exit_code"
}

# Validate required command exists
# Arguments:
#   $1 - Command name
# Example:
#   require_command "jq"
require_command() {
    local cmd="$1"
    if ! command -v "$cmd" &> /dev/null; then
        handle_error 127 "Required command '$cmd' not found. Please install it."
    fi
}

# Validate required environment variable
# Arguments:
#   $1 - Variable name
# Example:
#   require_env "COOLIFY_API_TOKEN"
require_env() {
    local var_name="$1"
    if [[ -z "${!var_name:-}" ]]; then
        handle_error 1 "Required environment variable '$var_name' is not set"
    fi
}

#######################################
# File Locking
#######################################

# Acquire lock for file operation
# Arguments:
#   $1 - Lock name
# Returns:
#   0 if lock acquired, 1 if lock exists and wait exceeded
# Example:
#   acquire_lock "state-file" || exit 1
acquire_lock() {
    local lock_name="$1"
    local lock_file="${LOCK_DIR}/${lock_name}.lock"
    local max_wait=5
    local waited=0

    while [[ -f "$lock_file" ]] && [[ $waited -lt $max_wait ]]; do
        log_debug "Waiting for lock: $lock_name"
        sleep 1
        ((waited++))
    done

    if [[ -f "$lock_file" ]]; then
        log_warning "Could not acquire lock after ${max_wait}s: $lock_name"
        return 1
    fi

    echo $$ > "$lock_file"
    log_debug "Lock acquired: $lock_name"
    return 0
}

# Release lock
# Arguments:
#   $1 - Lock name
# Example:
#   release_lock "state-file"
release_lock() {
    local lock_name="$1"
    local lock_file="${LOCK_DIR}/${lock_name}.lock"

    if [[ -f "$lock_file" ]]; then
        rm -f "$lock_file"
        log_debug "Lock released: $lock_name"
    fi
}

# Execute with lock protection
# Arguments:
#   $1 - Lock name
#   $2 - Function to execute
#   $@ - Additional arguments for function
# Example:
#   with_lock "state-file" update_state_internal "docker" "healthy"
with_lock() {
    local lock_name="$1"
    shift
    local func="$1"
    shift

    if acquire_lock "$lock_name"; then
        trap "release_lock '$lock_name'" EXIT
        "$func" "$@"
        local result=$?
        release_lock "$lock_name"
        trap - EXIT
        return $result
    else
        return 1
    fi
}

#######################################
# JSON Parsing
#######################################

# Require jq for JSON operations
require_command "jq"

# Parse JSON file with query
# Arguments:
#   $1 - JSON file path
#   $2 - jq query
# Example:
#   parse_json "config.json" ".database.host"
parse_json() {
    local file="$1"
    local query="$2"

    if [[ ! -f "$file" ]]; then
        log_error "JSON file not found: $file"
        return 1
    fi

    jq -r "$query" "$file" 2>/dev/null || {
        log_error "Failed to parse JSON: $file (query: $query)"
        return 1
    }
}

# Update JSON file with new value
# Arguments:
#   $1 - JSON file path
#   $2 - jq update expression
# Example:
#   update_json "config.json" '.database.port = 5432'
update_json() {
    local file="$1"
    local expression="$2"
    local tmp_file="${file}.tmp"

    if [[ ! -f "$file" ]]; then
        log_error "JSON file not found: $file"
        return 1
    fi

    jq "$expression" "$file" > "$tmp_file" && mv "$tmp_file" "$file" || {
        rm -f "$tmp_file"
        log_error "Failed to update JSON: $file"
        return 1
    }
}

#######################################
# State Management
#######################################

# Initialize tool state if not exists
# Arguments:
#   $1 - Tool name
# Example:
#   init_tool_state "docker"
init_tool_state() {
    local tool_name="$1"

    if ! parse_json "$STATE_FILE" ".tools.${tool_name}" &>/dev/null || \
       [[ "$(parse_json "$STATE_FILE" ".tools.${tool_name}")" == "null" ]]; then

        log_debug "Initializing state for tool: $tool_name"

        local init_state='{
            "health": {
                "status": "unknown",
                "lastCheck": null,
                "message": null,
                "consecutive_failures": 0
            },
            "execution_history": [],
            "metrics": {
                "total_executions": 0,
                "successful_executions": 0,
                "failed_executions": 0,
                "avg_duration": 0,
                "last_execution": null
            }
        }'

        update_json "$STATE_FILE" ".tools.${tool_name} = ${init_state}"
    fi
}

# Update tool state
# Arguments:
#   $1 - Tool name
#   $2 - Health status (healthy|unhealthy|unknown)
#   $3 - Additional metadata (JSON string, optional)
# Example:
#   update_tool_state "docker" "healthy" '{"message": "All containers running"}'
update_tool_state() {
    local tool_name="$1"
    local health_status="$2"
    local metadata="${3:-{}}"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    log_debug "Updating state for tool: $tool_name (status: $health_status)"

    # Initialize if needed
    init_tool_state "$tool_name"

    # Parse metadata
    local message=$(echo "$metadata" | jq -r '.message // empty' 2>/dev/null || echo "")

    # Update health
    update_json "$STATE_FILE" "
        .tools.${tool_name}.health.status = \"${health_status}\" |
        .tools.${tool_name}.health.lastCheck = \"${timestamp}\" |
        .tools.${tool_name}.health.message = \"${message}\" |
        .tools.${tool_name}.health.consecutive_failures = (
            if \"${health_status}\" == \"unhealthy\" then
                (.tools.${tool_name}.health.consecutive_failures // 0) + 1
            else
                0
            end
        ) |
        .metadata.lastUpdated = \"${timestamp}\"
    "
}

# Record tool execution
# Arguments:
#   $1 - Tool name
#   $2 - Command executed
#   $3 - Exit code
#   $4 - Duration in milliseconds
#   $5 - Error message (optional)
# Example:
#   record_execution "docker" "ps -a" 0 1234 ""
record_execution() {
    local tool_name="$1"
    local command="$2"
    local exit_code="$3"
    local duration="$4"
    local error="${5:-}"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local success="false"

    if [[ $exit_code -eq 0 ]]; then
        success="true"
    fi

    log_debug "Recording execution for tool: $tool_name (exit: $exit_code, duration: ${duration}ms)"

    # Initialize if needed
    init_tool_state "$tool_name"

    # Create execution entry
    local execution_entry=$(jq -n \
        --arg ts "$timestamp" \
        --arg cmd "$command" \
        --argjson code "$exit_code" \
        --argjson dur "$duration" \
        --argjson succ "$success" \
        --arg err "$error" \
        '{
            timestamp: $ts,
            command: $cmd,
            exitCode: $code,
            duration: $dur,
            success: $succ,
            error: (if $err == "" then null else $err end)
        }')

    # Add to history and update metrics
    update_json "$STATE_FILE" "
        .tools.${tool_name}.execution_history += [${execution_entry}] |
        .tools.${tool_name}.execution_history = (.tools.${tool_name}.execution_history | .[-50:]) |
        .tools.${tool_name}.metrics.total_executions += 1 |
        .tools.${tool_name}.metrics.successful_executions += (if ${success} then 1 else 0 end) |
        .tools.${tool_name}.metrics.failed_executions += (if ${success} then 0 else 1 end) |
        .tools.${tool_name}.metrics.last_execution = \"${timestamp}\" |
        .tools.${tool_name}.metrics.avg_duration = (
            ((.tools.${tool_name}.metrics.avg_duration // 0) * (.tools.${tool_name}.metrics.total_executions - 1) + ${duration}) /
            .tools.${tool_name}.metrics.total_executions
        ) |
        .metadata.totalExecutions += 1
    "
}

# Get tool state
# Arguments:
#   $1 - Tool name
# Returns:
#   JSON object with tool state
# Example:
#   get_tool_state "docker"
get_tool_state() {
    local tool_name="$1"
    parse_json "$STATE_FILE" ".tools.${tool_name}" || echo "null"
}

# Check tool health
# Arguments:
#   $1 - Tool name
# Returns:
#   0 if healthy, 1 if unhealthy or unknown
# Example:
#   check_tool_health "docker" && echo "Healthy"
check_tool_health() {
    local tool_name="$1"
    local health_status=$(parse_json "$STATE_FILE" ".tools.${tool_name}.health.status" 2>/dev/null || echo "unknown")

    if [[ "$health_status" == "healthy" ]]; then
        return 0
    else
        return 1
    fi
}

# Cleanup old state entries
# Arguments:
#   None
# Example:
#   cleanup_old_state
cleanup_old_state() {
    local cutoff_timestamp=$(date -u -d "-7 days" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v-7d +"%Y-%m-%dT%H:%M:%SZ")

    log_info "Cleaning up state entries older than 7 days (before $cutoff_timestamp)"

    # This is complex in jq, so we'll keep recent entries (last 50 per tool)
    # The update_json with history truncation in record_execution handles this

    update_json "$STATE_FILE" ".metadata.lastCleanup = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\""

    log_success "State cleanup completed"
}

#######################################
# Dependency Checking
#######################################

# Check if tool dependencies are met
# Arguments:
#   $1 - Tool name
# Returns:
#   0 if all dependencies met, 1 otherwise
# Example:
#   check_dependencies "docker" || exit 1
check_dependencies() {
    local tool_name="$1"
    local deps=$(parse_json "$CATALOG_FILE" ".tools.${tool_name}.dependencies[]" 2>/dev/null)

    if [[ -z "$deps" ]]; then
        return 0
    fi

    log_debug "Checking dependencies for tool: $tool_name"

    local missing_deps=()
    while IFS= read -r dep; do
        if [[ -n "$dep" ]]; then
            if ! command -v "$dep" &> /dev/null; then
                missing_deps+=("$dep")
            fi
        fi
    done <<< "$deps"

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing dependencies for $tool_name: ${missing_deps[*]}"
        return 1
    fi

    return 0
}

#######################################
# Remote Execution (SSH)
#######################################

# Execute command on remote server
# Arguments:
#   $1 - Command to execute
#   $2 - SSH host (optional, uses SSH_HOST env var if not provided)
#   $3 - SSH user (optional, uses SSH_USER env var if not provided)
# Example:
#   execute_remote "docker ps" "138.201.139.25" "root"
execute_remote() {
    local command="$1"
    local host="${2:-${SSH_HOST:-}}"
    local user="${3:-${SSH_USER:-root}}"
    local key_path="${SSH_KEY_PATH:-$HOME/.ssh/id_rsa}"

    if [[ -z "$host" ]]; then
        handle_error 1 "SSH host not specified (use SSH_HOST env var or pass as argument)"
    fi

    log_debug "Executing remote command on ${user}@${host}: $command"

    ssh -i "$key_path" -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
        "${user}@${host}" "$command" 2>&1
}

#######################################
# HTTP Utilities
#######################################

# Make HTTP request with curl
# Arguments:
#   $1 - Method (GET, POST, etc.)
#   $2 - URL
#   $3 - Headers (optional, format: "Header1: Value1" "Header2: Value2")
#   $4 - Data (optional, for POST/PUT)
# Example:
#   http_request "GET" "http://example.com/api" "Authorization: Bearer token"
http_request() {
    local method="$1"
    local url="$2"
    local headers="${3:-}"
    local data="${4:-}"

    require_command "curl"

    local curl_args=(-X "$method" -s -w "\n%{http_code}")

    if [[ -n "$headers" ]]; then
        while IFS= read -r header; do
            curl_args+=(-H "$header")
        done <<< "$headers"
    fi

    if [[ -n "$data" ]]; then
        curl_args+=(-d "$data")
    fi

    curl "${curl_args[@]}" "$url"
}

#######################################
# Performance Measurement
#######################################

# Measure execution time of a command
# Arguments:
#   $@ - Command to execute
# Returns:
#   Duration in milliseconds
# Example:
#   duration=$(measure_execution docker ps)
measure_execution() {
    local start_ms=$(date +%s%3N)
    "$@"
    local exit_code=$?
    local end_ms=$(date +%s%3N)
    local duration=$((end_ms - start_ms))

    echo "$duration"
    return $exit_code
}

# Execute command and record in state
# Arguments:
#   $1 - Tool name
#   $@ - Command to execute
# Example:
#   execute_and_record "docker" docker ps
execute_and_record() {
    local tool_name="$1"
    shift
    local command="$*"

    log_debug "Executing: $command"

    local start_ms=$(date +%s%3N)
    local output
    local exit_code=0

    output=$("$@" 2>&1) || exit_code=$?

    local end_ms=$(date +%s%3N)
    local duration=$((end_ms - start_ms))

    # Record execution
    with_lock "state-file" record_execution "$tool_name" "$command" "$exit_code" "$duration" "${output}"

    # Update health based on exit code
    if [[ $exit_code -eq 0 ]]; then
        with_lock "state-file" update_tool_state "$tool_name" "healthy" "{\"message\": \"Last execution successful\"}"
    else
        with_lock "state-file" update_tool_state "$tool_name" "unhealthy" "{\"message\": \"Last execution failed: $output\"}"
    fi

    echo "$output"
    return $exit_code
}

#######################################
# Initialization
#######################################

# Ensure state file exists
if [[ ! -f "$STATE_FILE" ]]; then
    log_warning "State file not found, creating: $STATE_FILE"
    mkdir -p "$(dirname "$STATE_FILE")"
    echo '{"version":"1.0.0","updated":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","schema":{"description":"Tool execution state and health tracking","retention":"7 days"},"tools":{},"metadata":{"totalExecutions":0,"lastCleanup":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}}' > "$STATE_FILE"
fi

# Export functions for sourcing scripts
export -f log_info log_success log_warning log_error log_debug
export -f handle_error require_command require_env
export -f acquire_lock release_lock with_lock
export -f parse_json update_json
export -f init_tool_state update_tool_state record_execution get_tool_state check_tool_health cleanup_old_state
export -f check_dependencies execute_remote http_request
export -f measure_execution execute_and_record

log_debug "Utils library loaded successfully"
