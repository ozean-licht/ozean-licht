#!/bin/bash
# Check Mem0 service health
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

# Handle explain mode
if [ "${1:-}" = "--explain" ]; then
    print_header "Health Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Check MCP Gateway connectivity       ${V}"
    echo "${V}   2. Check Mem0 service status            ${V}"
    echo "${V}   3. Check Qdrant vector DB connection    ${V}"
    echo "${V}   4. Measure response latency              ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Usage:                                    ${V}"
    echo "${V}   bash tools/memory/health.sh             ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 1-2 seconds             ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Related commands:                         ${V}"
    echo "${V}   stats.sh - Memory usage stats           ${V}"
    echo "${V}   Docker logs: docker logs mcp-gateway    ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → memory → health.sh" "tools/memory/list.sh" "execute or stats.sh"
    save_navigation "tools/memory/health.sh --explain"
    exit 0
fi

log_info "Checking Mem0 service health..."

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

PAYLOAD=$(cat <<EOF
{
  "operation": "health"
}
EOF
)

# Execute MCP request
start_time=$(date +%s%3N)
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)
end_time=$(date +%s%3N)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
latency=$((end_time - start_time))

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    status=$(echo "$body" | jq -r '.data.status // "unknown"' 2>/dev/null)
    qdrant=$(echo "$body" | jq -r '.data.qdrant // "unknown"' 2>/dev/null)
    service_latency=$(echo "$body" | jq -r '.data.latency // "unknown"' 2>/dev/null)

    if [ "$status" = "healthy" ]; then
        log_success "Mem0 service is healthy"
        echo ""

        print_header "Mem0 Health Status"
        echo "${V}                                            ${V}"
        echo "${V} Service Status: ${GREEN}●${NC} Healthy                ${V}"
        echo "${V} Qdrant Vector DB: ${GREEN}●${NC} $qdrant             ${V}"
        echo "${V} MCP Gateway Latency: ${latency}ms             ${V}"
        echo "${V} Service Latency: $service_latency                ${V}"
        echo "${V}                                            ${V}"
        print_footer

        echo ""
        echo "Next steps:"
        echo "  - View stats: bash tools/memory/stats.sh"
        echo "  - Search memories: bash tools/memory/search.sh \"query\""
        echo ""

        print_navigation "/ → memory → health.sh" "tools/memory/list.sh" "stats.sh or search.sh"
        save_navigation "tools/memory/health.sh"
        exit 0
    else
        log_error "Mem0 service is unhealthy"
        echo ""
        echo "Status: $status"
        echo "Qdrant: $qdrant"
        echo ""
        echo "Recovery options:"
        echo "  1. Check MCP Gateway logs: docker logs mcp-gateway"
        echo "  2. Restart MCP Gateway: docker restart mcp-gateway"
        echo "  3. Check Mem0 service: docker ps | grep mem0"
        exit 1
    fi
else
    log_error "Failed to connect to Mem0 service (HTTP $http_code)"
    echo ""

    if [ "$http_code" = "000" ]; then
        echo "Cannot reach MCP Gateway at localhost:8100"
        echo ""
        echo "Recovery options:"
        echo "  1. Check if MCP Gateway is running: docker ps | grep mcp-gateway"
        echo "  2. Start MCP Gateway: cd tools/mcp-gateway && npm run dev"
        echo "  3. Check container logs: docker logs mcp-gateway"
    else
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        echo ""
        echo "Recovery options:"
        echo "  1. Check MCP Gateway logs: docker logs mcp-gateway"
        echo "  2. Check Mem0 service: docker ps | grep mem0"
    fi

    exit 1
fi
