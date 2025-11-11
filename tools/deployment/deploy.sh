#!/bin/bash
# Deploy application to production
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

APP_ID="${1:-}"

# Handle explain mode
if [ "$1" = "--explain" ] || [ "$2" = "--explain" ]; then
    print_header "Deploy Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Validate COOLIFY_API_TOKEN           ${V}"
    echo "${V}   2. Connect to Coolify API               ${V}"
    echo "${V}   3. Trigger deployment for app ${APP_ID:-(ID)}        ${V}"
    echo "${V}   4. Pull latest code from repository     ${V}"
    echo "${V}   5. Rebuild Docker image                 ${V}"
    echo "${V}   6. Recreate containers                  ${V}"
    echo "${V}   7. Report success/failure               ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Requirements:                             ${V}"
    echo "${V}   ✓ COOLIFY_API_TOKEN environment var     ${V}"
    echo "${V}   ✓ Network connectivity                  ${V}"
    echo "${V}   ✓ Valid app ID                         ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 45-90 seconds           ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Related commands:                         ${V}"
    echo "${V}   status.sh ${APP_ID:-(ID)} - Check status           ${V}"
    echo "${V}   logs.sh ${APP_ID:-(ID)} - View logs                 ${V}"
    echo "${V}   restart.sh ${APP_ID:-(ID)} - Quick restart (no rebuild)${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → deploy.sh" "tools/deployment/list.sh" "execute or status.sh"
    save_navigation "tools/deployment/deploy.sh --explain"
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
    echo "  3. Get help: bash tools/deployment/list.sh"
    exit 1
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

# Execute deployment
log_info "Deploying application ID: $APP_ID"

response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications/${APP_ID}/deploy")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" =~ ^(200|201|202)$ ]]; then
    echo "$body" | jq '.'
    log_success "Deployment triggered for application $APP_ID"

    echo ""
    echo "Next steps:"
    echo "  - Check status: bash tools/deployment/status.sh $APP_ID"
    echo "  - View logs: bash tools/deployment/logs.sh $APP_ID"
    echo ""

    print_navigation "/ → deployment → deploy.sh" "tools/deployment/list.sh" "status.sh $APP_ID"
    save_navigation "tools/deployment/deploy.sh $APP_ID"
    exit 0
else
    log_error "Failed to deploy application $APP_ID (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check API health: bash tools/deployment/health.sh"
    echo "  2. Check app exists: bash tools/deployment/list-apps.sh"
    echo "  3. View logs: bash tools/deployment/logs.sh $APP_ID"
    echo "  4. Go back: bash tools/deployment/list.sh"
    exit 1
fi
