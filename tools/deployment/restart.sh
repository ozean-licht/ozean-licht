#!/bin/bash
# Restart running application
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

APP_ID="${1:-}"

# Handle explain mode
if [ "$1" = "--explain" ] || [ "$2" = "--explain" ]; then
    print_header "Restart Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Connect to Coolify API               ${V}"
    echo "${V}   2. Stop application containers          ${V}"
    echo "${V}   3. Start application containers          ${V}"
    echo "${V}   4. Report success/failure               ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Requirements:                             ${V}"
    echo "${V}   ✓ COOLIFY_API_TOKEN environment var     ${V}"
    echo "${V}   ✓ Network connectivity                  ${V}"
    echo "${V}   ✓ Valid app ID                         ${V}"
    echo "${V}   ✓ Application already deployed          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 5-10 seconds            ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Restart vs Deploy:                        ${V}"
    echo "${V}   - Restart: Stops/starts containers      ${V}"
    echo "${V}     (no code pull, no rebuild)            ${V}"
    echo "${V}   - Deploy: Full rebuild from source      ${V}"
    echo "${V}     (pulls code, rebuilds image)          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Use restart when:                         ${V}"
    echo "${V}   - App is stuck or unresponsive          ${V}"
    echo "${V}   - Config changes need reload            ${V}"
    echo "${V}   - No code changes were made             ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → restart.sh" "tools/deployment/list.sh" "execute or status.sh"
    save_navigation "tools/deployment/restart.sh --explain"
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

# Execute restart
log_info "Restarting application ID: $APP_ID"

response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications/${APP_ID}/restart")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201|202)$ ]]; then
    echo "$body" | jq '.'
    log_success "Application $APP_ID restarted"

    echo ""
    echo "Next steps:"
    echo "  - Check status: bash tools/deployment/status.sh $APP_ID"
    echo "  - View logs: bash tools/deployment/logs.sh $APP_ID"
    echo ""

    print_navigation "/ → deployment → restart.sh" "tools/deployment/list.sh" "status.sh $APP_ID"
    save_navigation "tools/deployment/restart.sh $APP_ID"
    exit 0
else
    log_error "Failed to restart application $APP_ID (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Try deploy instead: bash tools/deployment/deploy.sh $APP_ID"
    echo "  2. Check API health: bash tools/deployment/health.sh"
    echo "  3. View logs: bash tools/deployment/logs.sh $APP_ID"
    exit 1
fi
