#!/bin/bash
# List patterns grouped by category
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

CATEGORY=""
LIMIT=100

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --category=*)
            CATEGORY="${1#*=}"
            shift
            ;;
        --limit=*)
            LIMIT="${1#*=}"
            shift
            ;;
        --explain)
            print_header "Patterns Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. List all memories                    ${V}"
            echo "${V}   2. Group by category                    ${V}"
            echo "${V}   3. Show pattern counts                  ${V}"
            echo "${V}   4. Display recent patterns              ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/patterns.sh           ${V}"
            echo "${V}   bash tools/memory/patterns.sh \         ${V}"
            echo "${V}     --category=pattern                    ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Pattern Categories:                       ${V}"
            echo "${V}   • pattern  - Reusable implementations   ${V}"
            echo "${V}   • decision - Architecture choices       ${V}"
            echo "${V}   • solution - Problem-solution pairs     ${V}"
            echo "${V}   • error    - Error resolutions          ${V}"
            echo "${V}   • workflow - Successful sequences       ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 1-2 seconds             ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   search.sh - Find specific patterns      ${V}"
            echo "${V}   get.sh - Get all for user               ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

            print_navigation "/ → memory → patterns.sh" "tools/memory/list.sh" "execute or search.sh"
            save_navigation "tools/memory/patterns.sh --explain"
            exit 0
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

PAYLOAD=$(cat <<EOF
{
  "operation": "list",
  "options": {
    "limit": $LIMIT
  }
}
EOF
)

log_info "Loading patterns..."

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    total=$(echo "$body" | jq -r '.data.total // 0' 2>/dev/null)

    if [ "$total" -eq 0 ]; then
        echo -e "${YELLOW}No patterns found${NC}"
        echo ""
        echo "Suggestions:"
        echo "  - Save first pattern: bash tools/memory/save.sh \"content\""
        echo "  - View templates: cat tools/memory/PATTERNS.md"
        exit 0
    fi

    log_success "Found $total $([ $total -eq 1 ] && echo "pattern" || echo "patterns")"
    echo ""

    # If category specified, filter
    if [ -n "$CATEGORY" ]; then
        echo "Category: $CATEGORY"
        echo ""

        filtered=$(echo "$body" | jq ".data.memories | map(select(.metadata.category == \"$CATEGORY\"))" 2>/dev/null)
        filtered_count=$(echo "$filtered" | jq 'length' 2>/dev/null)

        if [ "$filtered_count" -eq 0 ]; then
            echo -e "${YELLOW}No patterns found in category: $CATEGORY${NC}"
            exit 0
        fi

        echo "$filtered" | jq -r '.[] |
            "ID: \(.id)\n" +
            "Content: \(.content)\n" +
            "Created: \(.created_at // "unknown")\n" +
            "---"' 2>/dev/null
    else
        # Show summary by category
        echo "Pattern Summary by Category:"
        echo ""

        for cat in "pattern" "decision" "solution" "error" "workflow" "general"; do
            count=$(echo "$body" | jq "[.data.memories[] | select(.metadata.category == \"$cat\")] | length" 2>/dev/null)
            if [ "$count" -gt 0 ]; then
                echo "  $cat: $count"
            fi
        done

        echo ""
        echo "Recent patterns (last 10):"
        echo ""

        echo "$body" | jq -r '.data.memories[:10] | .[] |
            "ID: \(.id)\n" +
            "Category: \(.metadata.category // "general")\n" +
            "Content: \(.content | .[0:100])\(if (.content | length) > 100 then "..." else "" end)\n" +
            "---"' 2>/dev/null
    fi

    echo ""
    echo "Next steps:"
    echo "  - Filter by category: bash tools/memory/patterns.sh --category=pattern"
    echo "  - Search: bash tools/memory/search.sh \"query\""
    echo "  - Save new: bash tools/memory/save.sh \"content\""
    echo ""

    print_navigation "/ → memory → patterns.sh" "tools/memory/list.sh" "search.sh or save.sh"
    save_navigation "tools/memory/patterns.sh"
    exit 0
else
    log_error "Failed to list patterns (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi
