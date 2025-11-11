#!/bin/bash
# docker.sh - Docker container management script
# Version: 1.0.0
# Description: Native Docker CLI wrapper for container operations

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="docker"
REMOTE_MODE=false

# Check dependencies
require_command "docker"

# Parse flags
while [[ $# -gt 0 ]]; do
    case $1 in
        --remote)
            REMOTE_MODE=true
            shift
            ;;
        *)
            break
            ;;
    esac
done

#######################################
# Docker Command Wrapper
#######################################

docker_cmd() {
    if [[ "$REMOTE_MODE" == "true" ]]; then
        execute_remote "docker $*"
    else
        docker "$@"
    fi
}

#######################################
# List Containers
#######################################

ps_containers() {
    local filter="${1:-}"
    local format="${2:-table}"

    log_info "Listing Docker containers$([ -n "$filter" ] && echo " (filter: $filter)")"

    local cmd="ps -a"
    if [[ -n "$filter" ]]; then
        cmd="$cmd --filter name=$filter"
    fi

    if [[ "$format" == "json" ]]; then
        cmd="$cmd --format '{{json .}}'"
    fi

    execute_and_record "$TOOL_NAME" docker_cmd $cmd
}

#######################################
# Container Logs
#######################################

logs_container() {
    local container="$1"
    local lines="${2:-50}"
    local follow="${3:-false}"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Fetching logs for container: $container (last $lines lines)"

    local cmd="logs --tail $lines"
    if [[ "$follow" == "true" ]]; then
        cmd="$cmd -f"
    fi
    cmd="$cmd $container"

    execute_and_record "$TOOL_NAME" docker_cmd $cmd
}

#######################################
# Container Stats
#######################################

stats_containers() {
    local no_stream="${1:-true}"

    log_info "Getting container resource statistics"

    local cmd="stats"
    if [[ "$no_stream" == "true" ]]; then
        cmd="$cmd --no-stream"
    fi

    execute_and_record "$TOOL_NAME" docker_cmd $cmd
}

#######################################
# Restart Container
#######################################

restart_container() {
    local container="$1"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Restarting container: $container"

    execute_and_record "$TOOL_NAME" docker_cmd restart "$container"

    if [[ $? -eq 0 ]]; then
        log_success "Container $container restarted successfully"
    else
        log_error "Failed to restart container $container"
        return 1
    fi
}

#######################################
# Execute Command in Container
#######################################

exec_container() {
    local container="$1"
    shift
    local command="$*"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    if [[ -z "$command" ]]; then
        handle_error 1 "Command required"
    fi

    log_info "Executing command in container $container: $command"

    execute_and_record "$TOOL_NAME" docker_cmd exec "$container" $command
}

#######################################
# Health Check
#######################################

health_check() {
    local container="${1:-}"

    if [[ -z "$container" ]]; then
        log_info "Checking Docker daemon health"

        if docker_cmd info &>/dev/null; then
            log_success "Docker daemon is healthy"
            with_lock "state-file" update_tool_state "$TOOL_NAME" "healthy" '{"message": "Docker daemon running"}'
            return 0
        else
            log_error "Docker daemon is not running"
            with_lock "state-file" update_tool_state "$TOOL_NAME" "unhealthy" '{"message": "Docker daemon not running"}'
            return 1
        fi
    else
        log_info "Checking health of container: $container"

        local health=$(docker_cmd inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)

        if [[ -z "$health" ]]; then
            log_warning "Container $container has no health check defined"
            echo "no-healthcheck"
            return 0
        elif [[ "$health" == "healthy" ]]; then
            log_success "Container $container is healthy"
            return 0
        else
            log_error "Container $container health status: $health"
            return 1
        fi
    fi
}

#######################################
# Inspect Container
#######################################

inspect_container() {
    local container="$1"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Inspecting container: $container"

    execute_and_record "$TOOL_NAME" docker_cmd inspect "$container"
}

#######################################
# Stop Container
#######################################

stop_container() {
    local container="$1"
    local timeout="${2:-10}"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Stopping container: $container (timeout: ${timeout}s)"

    execute_and_record "$TOOL_NAME" docker_cmd stop -t "$timeout" "$container"

    if [[ $? -eq 0 ]]; then
        log_success "Container $container stopped successfully"
    else
        log_error "Failed to stop container $container"
        return 1
    fi
}

#######################################
# Start Container
#######################################

start_container() {
    local container="$1"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Starting container: $container"

    execute_and_record "$TOOL_NAME" docker_cmd start "$container"

    if [[ $? -eq 0 ]]; then
        log_success "Container $container started successfully"
    else
        log_error "Failed to start container $container"
        return 1
    fi
}

#######################################
# Container Top
#######################################

top_container() {
    local container="$1"

    if [[ -z "$container" ]]; then
        handle_error 1 "Container name required"
    fi

    log_info "Getting processes for container: $container"

    execute_and_record "$TOOL_NAME" docker_cmd top "$container"
}

#######################################
# Prune Resources
#######################################

prune() {
    local resource="${1:-all}"

    log_info "Pruning Docker $resource"

    case "$resource" in
        containers)
            execute_and_record "$TOOL_NAME" docker_cmd container prune -f
            ;;
        images)
            execute_and_record "$TOOL_NAME" docker_cmd image prune -f
            ;;
        volumes)
            execute_and_record "$TOOL_NAME" docker_cmd volume prune -f
            ;;
        networks)
            execute_and_record "$TOOL_NAME" docker_cmd network prune -f
            ;;
        all)
            execute_and_record "$TOOL_NAME" docker_cmd system prune -f
            ;;
        *)
            handle_error 1 "Unknown resource type: $resource"
            ;;
    esac

    log_success "Docker $resource pruned successfully"
}

#######################################
# Main Function
#######################################

main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        ps_containers)
            ps_containers "$@"
            ;;
        logs_container)
            logs_container "$@"
            ;;
        stats_containers)
            stats_containers "$@"
            ;;
        restart_container)
            restart_container "$@"
            ;;
        exec_container)
            exec_container "$@"
            ;;
        health_check)
            health_check "$@"
            ;;
        inspect_container)
            inspect_container "$@"
            ;;
        stop_container)
            stop_container "$@"
            ;;
        start_container)
            start_container "$@"
            ;;
        top_container)
            top_container "$@"
            ;;
        prune)
            prune "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Docker CLI Script - Container Management
Version: 1.0.0

Usage: $0 [--remote] <operation> [arguments]

Flags:
  --remote              Execute commands on remote server via SSH

Operations:
  ps_containers [filter] [format]        List containers (format: table|json)
  logs_container <name> [lines] [follow] Get container logs
  stats_containers [no-stream]           Get resource usage statistics
  restart_container <name>               Restart a container
  exec_container <name> <command>        Execute command in container
  health_check [name]                    Check Docker daemon or container health
  inspect_container <name>               Inspect container details
  stop_container <name> [timeout]        Stop a container
  start_container <name>                 Start a container
  top_container <name>                   Show container processes
  prune <type>                           Prune resources (containers|images|volumes|networks|all)
  help                                   Show this help message

Examples:
  # Local operations
  $0 ps_containers
  $0 ps_containers mcp-gateway json
  $0 logs_container mcp-gateway 100
  $0 stats_containers
  $0 restart_container mcp-gateway
  $0 exec_container mcp-gateway 'npm --version'
  $0 health_check
  $0 health_check mcp-gateway

  # Remote operations
  $0 --remote ps_containers
  $0 --remote logs_container mcp-gateway 50
  $0 --remote health_check

Environment Variables:
  SSH_HOST              Remote SSH host (for --remote)
  SSH_USER              Remote SSH user (default: root)
  SSH_KEY_PATH          SSH private key path (default: ~/.ssh/id_rsa)

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
