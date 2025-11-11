#!/bin/bash
# coolify.sh - Coolify API wrapper for deployment operations
# Version: 1.0.0
# Description: Lightweight script for Coolify deployment management

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="coolify"
COOLIFY_API_URL="${COOLIFY_API_URL:-http://coolify.ozean-licht.dev:8000/api/v1}"

# Check dependencies
require_command "curl"
require_command "jq"
require_env "COOLIFY_API_TOKEN"

#######################################
# API Request Helper
#######################################

coolify_api_request() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"

    local url="${COOLIFY_API_URL}${endpoint}"
    local headers="Authorization: Bearer ${COOLIFY_API_TOKEN}
Content-Type: application/json"

    log_debug "Coolify API request: $method $endpoint"

    if [[ -n "$data" ]]; then
        http_request "$method" "$url" "$headers" "$data"
    else
        http_request "$method" "$url" "$headers"
    fi
}

#######################################
# List Applications
#######################################

list_applications() {
    log_info "Listing all Coolify applications"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "GET" "/applications")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        echo "$body" | jq '.'
        log_success "Listed applications successfully"
        return 0
    else
        log_error "Failed to list applications (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Deploy Application
#######################################

deploy_application() {
    local app_id="$1"

    if [[ -z "$app_id" ]]; then
        handle_error 1 "Application ID required"
    fi

    log_info "Deploying application: $app_id"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "POST" "/applications/${app_id}/deploy")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" =~ ^(200|201|202)$ ]]; then
        echo "$body" | jq '.'
        log_success "Deployment triggered for application $app_id"
        return 0
    else
        log_error "Failed to deploy application $app_id (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Restart Application
#######################################

restart_application() {
    local app_id="$1"

    if [[ -z "$app_id" ]]; then
        handle_error 1 "Application ID required"
    fi

    log_info "Restarting application: $app_id"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "POST" "/applications/${app_id}/restart")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" =~ ^(200|201|202)$ ]]; then
        echo "$body" | jq '.'
        log_success "Application $app_id restarted"
        return 0
    else
        log_error "Failed to restart application $app_id (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Get Application Status
#######################################

get_application_status() {
    local app_id="$1"

    if [[ -z "$app_id" ]]; then
        handle_error 1 "Application ID required"
    fi

    log_info "Getting status for application: $app_id"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "GET" "/applications/${app_id}")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        echo "$body" | jq '.'
        log_success "Retrieved application $app_id status"
        return 0
    else
        log_error "Failed to get application $app_id status (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# List Databases
#######################################

list_databases() {
    log_info "Listing all Coolify databases"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "GET" "/databases")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        echo "$body" | jq '.'
        log_success "Listed databases successfully"
        return 0
    else
        log_error "Failed to list databases (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Get Logs
#######################################

get_logs() {
    local app_id="$1"
    local lines="${2:-50}"

    if [[ -z "$app_id" ]]; then
        handle_error 1 "Application ID required"
    fi

    log_info "Fetching logs for application: $app_id (last $lines lines)"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "GET" "/applications/${app_id}/logs?lines=${lines}")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        echo "$body"
        log_success "Retrieved logs for application $app_id"
        return 0
    else
        log_error "Failed to get logs for application $app_id (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Get Version
#######################################

get_version() {
    log_info "Getting Coolify version"

    local response=$(execute_and_record "$TOOL_NAME" coolify_api_request "GET" "/version")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        echo "$body" | jq '.'
        log_success "Retrieved Coolify version"
        return 0
    else
        log_error "Failed to get Coolify version (HTTP $http_code)"
        echo "$body"
        return 1
    fi
}

#######################################
# Health Check
#######################################

health_check() {
    log_info "Checking Coolify health"

    local response=$(coolify_api_request "GET" "/health" 2>&1)
    local http_code=$(echo "$response" | tail -n1)

    if [[ "$http_code" == "200" ]]; then
        log_success "Coolify is healthy"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "healthy" '{"message": "API responding"}'
        return 0
    else
        log_error "Coolify health check failed (HTTP $http_code)"
        with_lock "state-file" update_tool_state "$TOOL_NAME" "unhealthy" '{"message": "API not responding"}'
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
        list_applications)
            list_applications "$@"
            ;;
        deploy_application)
            deploy_application "$@"
            ;;
        restart_application)
            restart_application "$@"
            ;;
        get_application_status)
            get_application_status "$@"
            ;;
        list_databases)
            list_databases "$@"
            ;;
        get_logs)
            get_logs "$@"
            ;;
        get_version)
            get_version "$@"
            ;;
        health_check)
            health_check "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Coolify CLI Script - Deployment Management
Version: 1.0.0

Usage: $0 <operation> [arguments]

Operations:
  list_applications              List all applications
  deploy_application <app_id>    Deploy application
  restart_application <app_id>   Restart application
  get_application_status <app_id> Get application status
  list_databases                 List all databases
  get_logs <app_id> [lines]      Get application logs (default: 50 lines)
  get_version                    Get Coolify version
  health_check                   Check Coolify API health
  help                           Show this help message

Examples:
  $0 list_applications
  $0 deploy_application 3
  $0 restart_application 3
  $0 get_application_status 3
  $0 get_logs 3 100
  $0 health_check

Environment Variables:
  COOLIFY_API_URL       Coolify API URL (default: http://coolify.ozean-licht.dev:8000/api/v1)
  COOLIFY_API_TOKEN     Coolify API authentication token (required)

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
