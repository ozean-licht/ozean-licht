#!/bin/bash
# Search memories using semantic search
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

QUERY="${1:-}"
LIMIT=10
USER_ID=""

# Parse arguments
shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --limit=*)
            LIMIT="${1#*=}"
            shift
            ;;
        --user-id=*|--agent-id=*)
            USER_ID="${1#*=}"
            shift
            ;;
        --explain)
            print_header "Search Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. Send query to MCP Gateway            ${V}"
            echo "${V}   2. Perform semantic vector search       ${V}"
            echo "${V}   3. Rank results by relevance            ${V}"
            echo "${V}   4. Display with preview & scores        ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/search.sh \"query\"    ${V}"
            echo "${V}   bash tools/memory/search.sh \"query\" \  ${V}"
            echo "${V}     --limit=5 --user-id=agent_id          ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Options:                                  ${V}"
            echo "${V}   --limit=N     - Max results (default 10)${V}"
            echo "${V}   --user-id=ID  - Filter by user/agent    ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 2-4 seconds             ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   save.sh - Save new memory               ${V}"
            echo "${V}   get.sh - Get all for user               ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

            print_navigation "/ → memory → search.sh" "tools/memory/list.sh" "execute or save.sh"
            save_navigation "tools/memory/search.sh --explain"
            exit 0
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$QUERY" ]; then
    echo -e "${RED}Error:${NC} Query required"
    echo "Usage: $0 <query> [--limit=N] [--user-id=id]"
    echo ""
    echo "Examples:"
    echo "  bash tools/memory/search.sh \"database connection\""
    echo "  bash tools/memory/search.sh \"auth\" --limit=5"
    echo ""
    echo "Recovery options:"
    echo "  1. List all patterns: bash tools/memory/patterns.sh"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

# Build request payload using jq for safe JSON escaping
if [ -n "$USER_ID" ]; then
  PAYLOAD=$(jq -n \
    --arg query "$QUERY" \
    --arg user_id "$USER_ID" \
    --argjson limit "$LIMIT" \
    '{
      operation: "search",
      args: [$query],
      options: {
        limit: $limit,
        user_id: $user_id
      }
    }')
else
  PAYLOAD=$(jq -n \
    --arg query "$QUERY" \
    --argjson limit "$LIMIT" \
    '{
      operation: "search",
      args: [$query],
      options: {
        limit: $limit
      }
    }')
fi

log_info "Searching memories..."

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    result_count=$(echo "$body" | jq -r '.data.resultCount // 0' 2>/dev/null)

    if [ "$result_count" -eq 0 ]; then
        echo -e "${YELLOW}No memories found matching: \"$QUERY\"${NC}"
        echo ""
        echo "Suggestions:"
        echo "  - Try broader search terms"
        echo "  - List all patterns: bash tools/memory/patterns.sh"
        echo "  - Save new memory: bash tools/memory/save.sh \"content\""
        exit 0
    fi

    log_success "Found $result_count matching $([ $result_count -eq 1 ] && echo "memory" || echo "memories")"
    echo ""

    # Display results
    echo "$body" | jq -r '.data.results[] |
        "Memory ID: \(.id)\n" +
        "Relevance: \(.relevance)\n" +
        "Content: \(.content | .[0:150])\(if (.content | length) > 150 then "..." else "" end)\n" +
        "Category: \(.metadata.category // "general")\n" +
        "---"' 2>/dev/null

    echo ""
    echo "Next steps:"
    echo "  - View full memory: bash tools/memory/get.sh <user_id>"
    echo "  - Save similar: bash tools/memory/save.sh \"content\""
    echo ""

    print_navigation "/ → memory → search.sh" "tools/memory/list.sh" "get.sh or save.sh"
    save_navigation "tools/memory/search.sh \"$QUERY\""
    exit 0
else
    log_error "Failed to search memories (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi
