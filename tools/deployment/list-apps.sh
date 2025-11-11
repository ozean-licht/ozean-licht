#!/bin/bash
# List all Coolify applications
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

# Handle explain mode
if [ "$1" = "--explain" ]; then
    print_header "List Applications - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Connect to Coolify API               ${V}"
    echo "${V}   2. Fetch all applications               ${V}"
    echo "${V}   3. Display as formatted JSON            ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Requirements:                             ${V}"
    echo "${V}   ✓ COOLIFY_API_TOKEN environment var     ${V}"
    echo "${V}   ✓ Network connectivity to Coolify       ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 1-2 seconds             ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → list-apps.sh" "tools/deployment/list.sh" "execute"
    save_navigation "tools/deployment/list-apps.sh --explain"
    exit 0
fi

# Check environment
TOOL_NAME="coolify"
COOLIFY_API_URL="${COOLIFY_API_URL:-http://coolify.ozean-licht.dev:8000/api/v1}"

if [ -z "$COOLIFY_API_TOKEN" ]; then
    echo -e "${RED}Error:${NC} COOLIFY_API_TOKEN not set"
    echo ""
    echo "Recovery options:"
    echo "  1. Set token: export COOLIFY_API_TOKEN='your-token'"
    echo "  2. Check env: env | grep COOLIFY"
    echo "  3. Go back: bash tools/deployment/list.sh"
    exit 1
fi

# Execute command
log_info "Listing all Coolify applications"

response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" == "200" ]]; then
    echo "$body" | jq '.'
    log_success "Listed applications successfully"

    echo ""
    print_navigation "/ → deployment → list-apps.sh" "tools/deployment/list.sh" "deploy.sh <app_id>"
    save_navigation "tools/deployment/list-apps.sh"
    exit 0
else
    log_error "Failed to list applications (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check API health: bash tools/deployment/health.sh"
    echo "  2. Verify token: echo \$COOLIFY_API_TOKEN"
    echo "  3. Go back: bash tools/deployment/list.sh"
    exit 1
fi
