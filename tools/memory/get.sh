#!/bin/bash
# Get all memories for a specific user/agent
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

USER_ID="${1:-}"
LIMIT=50
CATEGORY=""

# Parse arguments
shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --limit=*)
            LIMIT="${1#*=}"
            shift
            ;;
        --category=*)
            CATEGORY="${1#*=}"
            shift
            ;;
        --explain)
            print_header "Get Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. Connect to MCP Gateway               ${V}"
            echo "${V}   2. Retrieve all memories for user       ${V}"
            echo "${V}   3. Filter by category (optional)        ${V}"
            echo "${V}   4. Display with metadata                ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/get.sh <user_id>      ${V}"
            echo "${V}   bash tools/memory/get.sh agent_id \     ${V}"
            echo "${V}     --category=pattern --limit=20         ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Options:                                  ${V}"
            echo "${V}   --limit=N     - Max memories (def 50)   ${V}"
            echo "${V}   --category=X  - Filter by category      ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 1-2 seconds             ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   search.sh - Semantic search             ${V}"
            echo "${V}   patterns.sh - List by category          ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

            print_navigation "/ → memory → get.sh" "tools/memory/list.sh" "execute or search.sh"
            save_navigation "tools/memory/get.sh --explain"
            exit 0
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$USER_ID" ]; then
    echo -e "${RED}Error:${NC} User ID required"
    echo "Usage: $0 <user_id> [--limit=N] [--category=type]"
    echo ""
    echo "Examples:"
    echo "  bash tools/memory/get.sh agent_claude_code"
    echo "  bash tools/memory/get.sh agent_id --category=pattern"
    echo ""
    echo "Recovery options:"
    echo "  1. Go back: bash tools/memory/list.sh"
    exit 1
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

# Build request payload using jq for safe JSON escaping
PAYLOAD=$(jq -n \
  --arg user_id "$USER_ID" \
  --argjson limit "$LIMIT" \
  '{
    operation: "get-context",
    args: [$user_id],
    options: {
      limit: $limit
    }
  }')

log_info "Retrieving memories for: $USER_ID"

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    memory_count=$(echo "$body" | jq -r '.data.memoryCount // 0' 2>/dev/null)

    if [ "$memory_count" -eq 0 ]; then
        echo -e "${YELLOW}No memories found for user: $USER_ID${NC}"
        echo ""
        echo "Suggestions:"
        echo "  - Save first memory: bash tools/memory/save.sh \"content\""
        echo "  - Search all: bash tools/memory/search.sh \"query\""
        exit 0
    fi

    log_success "Found $memory_count $([ $memory_count -eq 1 ] && echo "memory" || echo "memories")"
    echo ""

    # Filter by category if specified
    if [ -n "$CATEGORY" ]; then
        echo "Filtering by category: $CATEGORY"
        echo ""
        filtered=$(echo "$body" | jq ".data.memories | map(select(.metadata.category == \"$CATEGORY\"))" 2>/dev/null)
        filtered_count=$(echo "$filtered" | jq 'length' 2>/dev/null)

        if [ "$filtered_count" -eq 0 ]; then
            echo -e "${YELLOW}No memories found in category: $CATEGORY${NC}"
            exit 0
        fi

        echo "Showing $filtered_count of $memory_count memories"
        echo ""

        # Display filtered results
        echo "$filtered" | jq -r '.[] |
            "Memory ID: \(.id)\n" +
            "Category: \(.metadata.category // "general")\n" +
            "Created: \(.created_at // "unknown")\n" +
            "Content: \(.content | .[0:150])\(if (.content | length) > 150 then "..." else "" end)\n" +
            "---"' 2>/dev/null
    else
        # Display all results
        echo "$body" | jq -r '.data.memories[] |
            "Memory ID: \(.id)\n" +
            "Category: \(.metadata.category // "general")\n" +
            "Created: \(.created_at // "unknown")\n" +
            "Content: \(.content | .[0:150])\(if (.content | length) > 150 then "..." else "" end)\n" +
            "---"' 2>/dev/null
    fi

    echo ""
    echo "Next steps:"
    echo "  - Search: bash tools/memory/search.sh \"query\""
    echo "  - List by category: bash tools/memory/patterns.sh"
    echo "  - Delete: bash tools/memory/delete.sh <memory_id>"
    echo ""

    print_navigation "/ → memory → get.sh" "tools/memory/list.sh" "search.sh or patterns.sh"
    save_navigation "tools/memory/get.sh $USER_ID"
    exit 0
else
    log_error "Failed to retrieve memories (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi
