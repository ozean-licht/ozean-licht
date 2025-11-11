#!/bin/bash
# Save memory with pattern categorization
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

CONTENT="${1:-}"
CATEGORY=""
USER_ID="agent_claude_code"

# Check for explain first
if [ "$1" = "--explain" ]; then
            print_header "Save Command - Explanation Mode"
            echo "${V}                                            ${V}"
            echo "${V} What this will do:                        ${V}"
            echo "${V}   1. Connect to MCP Gateway (localhost)   ${V}"
            echo "${V}   2. Send memory to Mem0 service          ${V}"
            echo "${V}   3. Add structured metadata               ${V}"
            echo "${V}   4. Store with semantic indexing          ${V}"
            echo "${V}   5. Return memory ID                      ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Pattern Categories:                       ${V}"
            echo "${V}   • pattern  - Reusable implementations    ${V}"
            echo "${V}   • decision - Architecture choices        ${V}"
            echo "${V}   • solution - Problem-solution pairs      ${V}"
            echo "${V}   • error    - Error resolutions           ${V}"
            echo "${V}   • workflow - Successful sequences        ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Usage:                                    ${V}"
            echo "${V}   bash tools/memory/save.sh \"content\"    ${V}"
            echo "${V}   bash tools/memory/save.sh \"content\" \  ${V}"
            echo "${V}     --category=pattern                     ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Typical duration: 1-2 seconds             ${V}"
            echo "${V}                                            ${V}"
            echo "${V} Related commands:                         ${V}"
            echo "${V}   search.sh - Find similar memories       ${V}"
            echo "${V}   patterns.sh - List by category          ${V}"
            print_footer

            echo ""
            echo "Ready to proceed? Remove --explain flag to execute"
            echo ""

    print_navigation "/ → memory → save.sh" "tools/memory/list.sh" "execute or search.sh"
    save_navigation "tools/memory/save.sh --explain"
    exit 0
fi

# Parse arguments
shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --category=*)
            CATEGORY="${1#*=}"
            shift
            ;;
        --user-id=*|--agent-id=*)
            USER_ID="${1#*=}"
            shift
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$CONTENT" ]; then
    echo -e "${RED}Error:${NC} Content required"
    echo "Usage: $0 <content> [--category=type] [--user-id=id]"
    echo ""
    echo "Examples:"
    echo "  bash tools/memory/save.sh \"Use connection pooling\""
    echo "  bash tools/memory/save.sh \"Decision: NextAuth\" --category=decision"
    echo ""
    echo "Recovery options:"
    echo "  1. See pattern templates: cat tools/memory/PATTERNS.md"
    echo "  2. Go back: bash tools/memory/list.sh"
    exit 1
fi

# Validate category if provided
if [ -n "$CATEGORY" ]; then
    case "$CATEGORY" in
        pattern|decision|solution|error|workflow)
            # Valid category
            ;;
        *)
            echo -e "${YELLOW}Warning:${NC} Unknown category '$CATEGORY'"
            echo "Valid categories: pattern, decision, solution, error, workflow"
            echo "Continuing with custom category..."
            ;;
    esac
fi

# Prepare MCP Gateway request
MCP_URL="http://localhost:8100/mcp/mem0"

# Build request payload using jq for safe JSON escaping
PAYLOAD=$(jq -n \
  --arg content "$CONTENT" \
  --arg user_id "$USER_ID" \
  --arg category "${CATEGORY:-general}" \
  --arg timestamp "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '{
    operation: "remember",
    args: [$content],
    options: {
      user_id: $user_id,
      metadata: {
        category: $category,
        source: "memory-cli",
        timestamp: $timestamp
      }
    }
  }')

log_info "Saving memory..."

# Execute MCP request
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$MCP_URL" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201)$ ]]; then
    # Parse response
    memory_id=$(echo "$body" | jq -r '.data.memory.id // "unknown"' 2>/dev/null)

    log_success "Memory saved successfully"
    echo ""
    echo "Memory ID: $memory_id"
    echo "User ID: $USER_ID"
    [ -n "$CATEGORY" ] && echo "Category: $CATEGORY"
    echo ""
    echo "Content preview:"
    echo "  $(echo "$CONTENT" | head -c 100)$([ ${#CONTENT} -gt 100 ] && echo "...")"
    echo ""

    echo "Next steps:"
    echo "  - Search: bash tools/memory/search.sh \"query\""
    echo "  - List patterns: bash tools/memory/patterns.sh"
    echo "  - Get all: bash tools/memory/get.sh $USER_ID"
    echo ""

    print_navigation "/ → memory → save.sh" "tools/memory/list.sh" "search.sh or patterns.sh"
    save_navigation "tools/memory/save.sh"
    exit 0
else
    log_error "Failed to save memory (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check MCP Gateway: bash tools/memory/health.sh"
    echo "  2. Check Mem0 service: docker logs mcp-gateway"
    echo "  3. Go back: bash tools/memory/list.sh"
    exit 1
fi
