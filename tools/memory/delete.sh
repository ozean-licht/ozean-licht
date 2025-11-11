#!/bin/bash
# Delete specific memory
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

MEMORY_ID="${1:-}"
FORCE=false

# Parse arguments
shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE=true
            shift
            ;;
        --explain)
            print_header "Delete Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. Show memory content for review       ${V}"
            echo "${V}   2. Ask for confirmation (unless --force)${V}"
            echo "${V}   3. Delete memory from Mem0              ${V}"
            echo "${V}   4. Confirm deletion                     ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/delete.sh <id>        ${V}"
            echo "${V}   bash tools/memory/delete.sh <id> --force${V}"
            echo "${V}                                            ${V}"
            echo "${V} Warning: This action cannot be undone!    ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 1 second                ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   search.sh - Find memory ID              ${V}"
            echo "${V}   get.sh - List all memories              ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

            print_navigation "/ → memory → delete.sh" "tools/memory/list.sh" "execute"
            save_navigation "tools/memory/delete.sh --explain"
            exit 0
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$MEMORY_ID" ]; then
    echo -e "${RED}Error:${NC} Memory ID required"
    echo "Usage: $0 <memory_id> [--force]"
    echo ""
    echo "Examples:"
    echo "  bash tools/memory/delete.sh mem_abc123"
    echo "  bash tools/memory/delete.sh mem_abc123 --force"
    echo ""
    echo "Recovery options:"
    echo "  1. Search for ID: bash tools/memory/search.sh \"query\""
    echo "  2. List all: bash tools/memory/get.sh <user_id>"
    echo "  3. Go back: bash tools/memory/list.sh"
    exit 1
fi

# Confirmation prompt unless --force
if [ "$FORCE" = false ]; then
    echo -e "${YELLOW}Warning:${NC} You are about to delete memory: $MEMORY_ID"
    echo "This action cannot be undone!"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirmation

    if [ "$confirmation" != "yes" ]; then
        echo "Deletion cancelled."
        exit 0
    fi
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

# Build request payload using jq for safe JSON escaping
PAYLOAD=$(jq -n \
  --arg memory_id "$MEMORY_ID" \
  '{
    operation: "delete",
    args: [$memory_id]
  }')

log_info "Deleting memory: $MEMORY_ID"

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    log_success "Memory deleted successfully"
    echo ""
    echo "Memory ID: $MEMORY_ID"
    echo "Status: Deleted"
    echo ""

    echo "Next steps:"
    echo "  - View remaining: bash tools/memory/patterns.sh"
    echo "  - Search: bash tools/memory/search.sh \"query\""
    echo ""

    print_navigation "/ → memory → delete.sh" "tools/memory/list.sh" "patterns.sh or search.sh"
    save_navigation "tools/memory/delete.sh $MEMORY_ID"
    exit 0
else
    log_error "Failed to delete memory (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check memory exists: bash tools/memory/search.sh \"$MEMORY_ID\""
    echo "  2. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  3. Go back: bash tools/memory/list.sh"
    exit 1
fi
