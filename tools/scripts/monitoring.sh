#!/bin/bash
# monitoring.sh - System monitoring and health checks
# Version: 1.0.0
# Description: Comprehensive monitoring for all services in the ecosystem

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="monitoring"

# Check dependencies
require_command "curl"
require_command "jq"

# Service endpoints
declare -A SERVICE_ENDPOINTS=(
    ["mcp-gateway"]="http://localhost:8100/health"
    ["mcp-gateway-metrics"]="http://localhost:9090/metrics"
    ["coolify"]="http://coolify.ozean-licht.dev:8000/api/health"
    ["n8n"]="http://n8n.ozean-licht.dev:5678/healthz"
    ["mem0"]="http://mem0.ozean-licht.dev:8090/health"
    ["grafana"]="https://grafana.ozean-licht.dev/api/health"
    ["minio"]="http://138.201.139.25:9000/minio/health/live"
)

#######################################
# Health Check - Single Service
#######################################

health_check_service() {
    local service_name="$1"
    local timeout="${2:-5}"

    if [[ -z "$service_name" ]]; then
        handle_error 1 "Service name required"
    fi

    local endpoint="${SERVICE_ENDPOINTS[$service_name]:-}"

    if [[ -z "$endpoint" ]]; then
        log_warning "No health endpoint configured for: $service_name"
        echo "unknown"
        return 2
    fi

    log_info "Checking health of service: $service_name"

    local response=$(curl -s -w "\n%{http_code}" --max-time "$timeout" "$endpoint" 2>/dev/null)
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)

    if [[ "$http_code" == "200" ]]; then
        log_success "✓ $service_name is healthy"
        with_lock "state-file" update_tool_state "monitoring" "healthy" "{\"message\": \"$service_name responding\"}"
        echo "healthy"
        return 0
    else
        log_error "✗ $service_name is unhealthy (HTTP $http_code)"
        echo "unhealthy"
        return 1
    fi
}

#######################################
# Health Check - All Services
#######################################

health_check_all() {
    log_info "Checking health of all services"

    local healthy_count=0
    local unhealthy_count=0
    local unknown_count=0

    echo ""
    echo "Service Health Status:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    for service in "${!SERVICE_ENDPOINTS[@]}"; do
        local status=$(health_check_service "$service" 3)

        case "$status" in
            healthy)
                ((healthy_count++))
                printf "  %-25s ${GREEN}✓ Healthy${NC}\n" "$service"
                ;;
            unhealthy)
                ((unhealthy_count++))
                printf "  %-25s ${RED}✗ Unhealthy${NC}\n" "$service"
                ;;
            *)
                ((unknown_count++))
                printf "  %-25s ${YELLOW}? Unknown${NC}\n" "$service"
                ;;
        esac
    done

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    printf "Summary: ${GREEN}%d healthy${NC}, ${RED}%d unhealthy${NC}, ${YELLOW}%d unknown${NC}\n" \
        "$healthy_count" "$unhealthy_count" "$unknown_count"
    echo ""

    if [[ $unhealthy_count -eq 0 ]]; then
        log_success "All services are healthy"
        return 0
    else
        log_warning "$unhealthy_count service(s) are unhealthy"
        return 1
    fi
}

#######################################
# Get Prometheus Metrics
#######################################

get_metrics() {
    local service="${1:-mcp-gateway}"
    local metric_filter="${2:-}"

    log_info "Fetching Prometheus metrics for: $service"

    local metrics_url="${SERVICE_ENDPOINTS[${service}-metrics]:-http://localhost:9090/metrics}"

    local response=$(curl -s "$metrics_url" 2>/dev/null)

    if [[ -z "$response" ]]; then
        log_error "Failed to fetch metrics from $metrics_url"
        return 1
    fi

    if [[ -n "$metric_filter" ]]; then
        echo "$response" | grep "$metric_filter"
    else
        echo "$response"
    fi

    log_success "Metrics retrieved successfully"
}

#######################################
# Get Recent Errors from Logs
#######################################

get_logs_errors() {
    local service="$1"
    local minutes="${2:-60}"

    if [[ -z "$service" ]]; then
        handle_error 1 "Service name required"
    fi

    log_info "Fetching errors from $service logs (last $minutes minutes)"

    # Try Docker logs first
    if docker ps --format '{{.Names}}' | grep -q "$service"; then
        local since_time="${minutes}m"
        docker logs --since "$since_time" "$service" 2>&1 | grep -i "error\|fail\|exception" | tail -n 50
        log_success "Retrieved error logs for $service"
        return 0
    fi

    # Fall back to system logs if not a container
    if command -v journalctl &>/dev/null; then
        journalctl -u "$service" --since "${minutes} minutes ago" | grep -i "error\|fail\|exception" | tail -n 50
        log_success "Retrieved error logs for $service"
        return 0
    fi

    log_warning "Could not retrieve logs for $service (not a Docker container or systemd service)"
    return 1
}

#######################################
# Resource Usage
#######################################

resource_usage() {
    local output_format="${1:-human}"

    log_info "Gathering system resource usage"

    echo ""
    echo "System Resource Usage:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # CPU Usage
    if command -v top &>/dev/null; then
        local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
        printf "  CPU Usage:          %.1f%%\n" "$cpu_usage"
    fi

    # Memory Usage
    if command -v free &>/dev/null; then
        local mem_info=$(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
        local mem_used=$(free -h | awk 'NR==2{print $3}')
        local mem_total=$(free -h | awk 'NR==2{print $2}')
        printf "  Memory Usage:       %s / %s (%s)\n" "$mem_used" "$mem_total" "$mem_info"
    fi

    # Disk Usage
    if command -v df &>/dev/null; then
        local disk_info=$(df -h / | awk 'NR==2{print $5, $3, $2}')
        printf "  Disk Usage:         %s\n" "$disk_info"
    fi

    # Load Average
    if [[ -f /proc/loadavg ]]; then
        local load_avg=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
        printf "  Load Average:       %s (1m 5m 15m)\n" "$load_avg"
    fi

    # Docker Stats (if available)
    if command -v docker &>/dev/null && docker ps -q &>/dev/null; then
        echo ""
        echo "Docker Container Resources:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    log_success "Resource usage gathered"
}

#######################################
# Service Uptime
#######################################

service_uptime() {
    local service="$1"

    if [[ -z "$service" ]]; then
        handle_error 1 "Service name required"
    fi

    log_info "Getting uptime for service: $service"

    # Check if it's a Docker container
    if docker ps --format '{{.Names}}' | grep -q "^${service}$"; then
        local status=$(docker inspect --format='{{.State.StartedAt}}' "$service" 2>/dev/null)
        if [[ -n "$status" ]]; then
            echo "Container started: $status"

            local started_epoch=$(date -d "$status" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${status%.*}" +%s)
            local current_epoch=$(date +%s)
            local uptime_seconds=$((current_epoch - started_epoch))
            local uptime_days=$((uptime_seconds / 86400))
            local uptime_hours=$(((uptime_seconds % 86400) / 3600))
            local uptime_minutes=$(((uptime_seconds % 3600) / 60))

            echo "Uptime: ${uptime_days}d ${uptime_hours}h ${uptime_minutes}m"
            log_success "Retrieved uptime for $service"
            return 0
        fi
    fi

    # Check systemd service
    if command -v systemctl &>/dev/null; then
        if systemctl is-active --quiet "$service"; then
            systemctl status "$service" | grep "Active:"
            log_success "Retrieved uptime for $service"
            return 0
        fi
    fi

    log_warning "Could not determine uptime for $service"
    return 1
}

#######################################
# Network Connectivity Test
#######################################

connectivity_test() {
    local host="${1:-8.8.8.8}"
    local port="${2:-443}"

    log_info "Testing network connectivity to $host:$port"

    if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null; then
        log_success "✓ Connection to $host:$port successful"
        return 0
    else
        log_error "✗ Connection to $host:$port failed"
        return 1
    fi
}

#######################################
# Check Database Connections
#######################################

check_database_connections() {
    log_info "Checking database connections"

    local databases=("kids-ascension-db:5432" "ozean-licht-db:5431")
    local healthy=0
    local failed=0

    for db in "${databases[@]}"; do
        IFS=':' read -r name port <<< "$db"
        if connectivity_test "localhost" "$port"; then
            ((healthy++))
        else
            ((failed++))
        fi
    done

    echo ""
    echo "Database Connectivity: $healthy healthy, $failed failed"

    return $failed
}

#######################################
# Generate Health Report
#######################################

generate_health_report() {
    local output_file="${1:-/tmp/health-report-$(date +%Y%m%d-%H%M%S).txt}"

    log_info "Generating comprehensive health report"

    {
        echo "═══════════════════════════════════════════════════════"
        echo "  Ozean Licht Ecosystem - Health Report"
        echo "  Generated: $(date)"
        echo "═══════════════════════════════════════════════════════"
        echo ""

        echo "1. SERVICE HEALTH"
        echo "───────────────────────────────────────────────────────"
        health_check_all
        echo ""

        echo "2. RESOURCE USAGE"
        echo "───────────────────────────────────────────────────────"
        resource_usage
        echo ""

        echo "3. DATABASE CONNECTIVITY"
        echo "───────────────────────────────────────────────────────"
        check_database_connections
        echo ""

        echo "4. NETWORK CONNECTIVITY"
        echo "───────────────────────────────────────────────────────"
        connectivity_test "8.8.8.8" "443"
        connectivity_test "1.1.1.1" "443"
        echo ""

        echo "═══════════════════════════════════════════════════════"
        echo "  End of Report"
        echo "═══════════════════════════════════════════════════════"
    } > "$output_file"

    log_success "Health report saved to: $output_file"
    echo "Report location: $output_file"
}

#######################################
# Main Function
#######################################

main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        health_check_service)
            health_check_service "$@"
            ;;
        health_check_all)
            health_check_all "$@"
            ;;
        get_metrics)
            get_metrics "$@"
            ;;
        get_logs_errors)
            get_logs_errors "$@"
            ;;
        resource_usage)
            resource_usage "$@"
            ;;
        service_uptime)
            service_uptime "$@"
            ;;
        connectivity_test)
            connectivity_test "$@"
            ;;
        check_database_connections)
            check_database_connections "$@"
            ;;
        generate_health_report)
            generate_health_report "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Monitoring Script - System Health Checks
Version: 1.0.0

Usage: $0 <operation> [arguments]

Operations:
  health_check_service <name> [timeout]  Check specific service health
  health_check_all                       Check all services
  get_metrics [service] [filter]         Get Prometheus metrics
  get_logs_errors <service> [minutes]    Get recent error logs
  resource_usage [format]                Get system resource usage
  service_uptime <service>               Get service uptime
  connectivity_test <host> [port]        Test network connectivity
  check_database_connections             Check database connectivity
  generate_health_report [output_file]   Generate comprehensive report
  help                                   Show this help message

Examples:
  $0 health_check_all
  $0 health_check_service mcp-gateway
  $0 get_metrics mcp-gateway
  $0 get_logs_errors mcp-gateway 30
  $0 resource_usage
  $0 service_uptime mcp-gateway
  $0 connectivity_test google.com 443
  $0 generate_health_report

Monitored Services:
  - mcp-gateway (port 8100, metrics 9090)
  - coolify (port 8000)
  - n8n (port 5678)
  - mem0 (port 8090)
  - grafana (HTTPS)
  - minio (port 9000)

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
