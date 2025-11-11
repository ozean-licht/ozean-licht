#!/bin/bash
# Update existing memory
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

MEMORY_ID="${1:-}"
NEW_CONTENT="${2:-}"

# Parse remaining arguments
shift 2 2>/dev/null || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --explain)
            print_header "Update Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. Connect to MCP Gateway               ${V}"
            echo "${V}   2. Update memory content                ${V}"
            echo "${V}   3. Preserve metadata                    ${V}"
            echo "${V}   4. Update timestamp                     ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/update.sh <id> \      ${V}"
            echo "${V}     \"new content\"                        ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 1 second                ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   search.sh - Find memory ID              ${V}"
            echo "${V}   delete.sh - Delete memory               ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

            print_navigation "/ → memory → update.sh" "tools/memory/list.sh" "execute"
            save_navigation "tools/memory/update.sh --explain"
            exit 0
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$MEMORY_ID" ] || [ -z "$NEW_CONTENT" ]; then
    echo -e "${RED}Error:${NC} Memory ID and new content required"
    echo "Usage: $0 <memory_id> <new_content>"
    echo ""
    echo "Example:"
    echo "  bash tools/memory/update.sh mem_abc123 \"Updated content\""
    echo ""
    echo "Recovery options:"
    echo "  1. Search for ID: bash tools/memory/search.sh \"query\""
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

# Build request payload using jq for safe JSON escaping
PAYLOAD=$(jq -n \
  --arg memory_id "$MEMORY_ID" \
  --arg content "$NEW_CONTENT" \
  '{
    operation: "update",
    args: [$memory_id, $content]
  }')

log_info "Updating memory: $MEMORY_ID"

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    log_success "Memory updated successfully"
    echo ""
    echo "Memory ID: $MEMORY_ID"
    echo "New content: $(echo "$NEW_CONTENT" | head -c 100)$([ ${#NEW_CONTENT} -gt 100 ] && echo "...")"
    echo ""

    echo "Next steps:"
    echo "  - View updated: bash tools/memory/search.sh \"$MEMORY_ID\""
    echo "  - List all: bash tools/memory/patterns.sh"
    echo ""

    print_navigation "/ → memory → update.sh" "tools/memory/list.sh" "search.sh or patterns.sh"
    save_navigation "tools/memory/update.sh $MEMORY_ID"
    exit 0
else
    log_error "Failed to update memory (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check memory exists: bash tools/memory/search.sh \"$MEMORY_ID\""
    echo "  2. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  3. Go back: bash tools/memory/list.sh"
    exit 1
fi
