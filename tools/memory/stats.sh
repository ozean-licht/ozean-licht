#!/bin/bash
# Show memory usage statistics
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

# Handle explain mode
if [ "$1" = "--explain" ]; then
    print_header "Stats Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Retrieve all memories                ${V}"
    echo "${V}   2. Calculate category breakdown          ${V}"
    echo "${V}   3. Show user/agent distribution          ${V}"
    echo "${V}   4. Display storage usage trends          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Usage:                                    ${V}"
    echo "${V}   bash tools/memory/stats.sh              ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 1-2 seconds             ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Related commands:                         ${V}"
    echo "${V}   health.sh - Check service health        ${V}"
    echo "${V}   patterns.sh - List by category          ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → memory → stats.sh" "tools/memory/list.sh" "execute or health.sh"
    save_navigation "tools/memory/stats.sh --explain"
    exit 0
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

PAYLOAD=$(cat <<EOF
{
  "operation": "list",
  "options": {
    "limit": 1000
  }
}
EOF
)

log_info "Calculating statistics..."

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    total=$(echo "$body" | jq -r '.data.total // 0' 2>/dev/null)

    log_success "Memory Statistics"
    echo ""

    print_header "Memory Usage Overview"
    echo "${V}                                            ${V}"
    echo "${V} Total Memories: $total                      ${V}"
    echo "${V}                                            ${V}"

    if [ "$total" -gt 0 ]; then
        echo "${V} Breakdown by Category:                   ${V}"
        echo "${V}                                            ${V}"

        for cat in "pattern" "decision" "solution" "error" "workflow" "general"; do
            count=$(echo "$body" | jq "[.data.memories[] | select(.metadata.category == \"$cat\")] | length" 2>/dev/null)
            if [ "$count" -gt 0 ]; then
                percentage=$((count * 100 / total))
                printf "${V}   %-12s: %3d (%2d%%)                  ${V}\n" "$cat" "$count" "$percentage"
            fi
        done

        echo "${V}                                            ${V}"

        # User distribution
        users=$(echo "$body" | jq -r '[.data.memories[].user_id] | unique | length' 2>/dev/null)
        echo "${V} Unique Users/Agents: $users                ${V}"
        echo "${V}                                            ${V}"

        # Most active users (top 5)
        echo "${V} Most Active Users:                        ${V}"
        echo "$body" | jq -r '[.data.memories[] | .user_id] | group_by(.) | map({user: .[0], count: length}) | sort_by(.count) | reverse | .[:5] | .[] | "   \(.user): \(.count) memories"' 2>/dev/null | while read line; do
            printf "${V} %-42s ${V}\n" "$line"
        done
    fi

    print_footer

    echo ""
    echo "Next steps:"
    echo "  - View patterns: bash tools/memory/patterns.sh"
    echo "  - Search: bash tools/memory/search.sh \"query\""
    echo "  - Health check: bash tools/memory/health.sh"
    echo ""

    print_navigation "/ → memory → stats.sh" "tools/memory/list.sh" "patterns.sh or health.sh"
    save_navigation "tools/memory/stats.sh"
    exit 0
else
    log_error "Failed to retrieve statistics (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi
