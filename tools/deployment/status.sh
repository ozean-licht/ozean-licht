#!/bin/bash
# Check deployment status
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

APP_ID="${1:-}"

# Handle explain mode
if [ "$1" = "--explain" ] || [ "$2" = "--explain" ]; then
    print_header "Status Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Connect to Coolify API               ${V}"
    echo "${V}   2. Fetch application status             ${V}"
    echo "${V}   3. Display formatted JSON output        ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Information shown:                        ${V}"
    echo "${V}   - Application name                      ${V}"
    echo "${V}   - Current status (running/stopped)      ${V}"
    echo "${V}   - Repository information                ${V}"
    echo "${V}   - Deployment settings                   ${V}"
    echo "${V}   - Container details                     ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 1-2 seconds             ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → status.sh" "tools/deployment/list.sh" "execute"
    save_navigation "tools/deployment/status.sh --explain"
    exit 0
fi

# Validate parameters
if [ -z "$APP_ID" ]; then
    echo -e "${RED}Error:${NC} App ID required"
    echo "Usage: $0 <app_id> [--explain]"
    echo ""
    echo "Recovery options:"
    echo "  1. List apps: bash tools/deployment/list-apps.sh"
    echo "  2. Go back: bash tools/deployment/list.sh"
    exit 1
fi

# Check environment
COOLIFY_API_URL="${COOLIFY_API_URL:-http://coolify.ozean-licht.dev:8000/api/v1}"

if [ -z "$COOLIFY_API_TOKEN" ]; then
    echo -e "${RED}Error:${NC} COOLIFY_API_TOKEN not set"
    echo ""
    echo "Recovery options:"
    echo "  1. Set token: export COOLIFY_API_TOKEN='your-token'"
    echo "  2. Go back: bash tools/deployment/list.sh"
    exit 1
fi

# Execute status check
log_info "Getting status for application ID: $APP_ID"

response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications/${APP_ID}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" == "200" ]]; then
    echo "$body" | jq '.'
    log_success "Retrieved application $APP_ID status"

    echo ""
    print_navigation "/ → deployment → status.sh" "tools/deployment/list.sh" "deploy.sh $APP_ID or logs.sh $APP_ID"
    save_navigation "tools/deployment/status.sh $APP_ID"
    exit 0
else
    log_error "Failed to get application $APP_ID status (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. List apps: bash tools/deployment/list-apps.sh"
    echo "  2. Check API health: bash tools/deployment/health.sh"
    echo "  3. Go back: bash tools/deployment/list.sh"
    exit 1
fi
