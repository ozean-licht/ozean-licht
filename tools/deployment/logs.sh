#!/bin/bash
# View deployment logs
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

APP_ID="${1:-}"
LINES="${2:-50}"

# Handle explain mode
if [ "$1" = "--explain" ] || [ "$2" = "--explain" ] || [ "$3" = "--explain" ]; then
    print_header "Logs Command - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Connect to Coolify API               ${V}"
    echo "${V}   2. Fetch application logs               ${V}"
    echo "${V}   3. Display last ${LINES} lines                 ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Usage:                                    ${V}"
    echo "${V}   $0 <app_id> [lines]              ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Examples:                                  ${V}"
    echo "${V}   $0 3          (last 50 lines)    ${V}"
    echo "${V}   $0 3 100      (last 100 lines)   ${V}"
    echo "${V}   $0 3 200      (last 200 lines)   ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 2-5 seconds             ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Note: For real-time logs, use:            ${V}"
    echo "${V}   bash tools/containers/logs.sh \\          ${V}"
    echo "${V}     <container_name> 50 follow             ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → logs.sh" "tools/deployment/list.sh" "execute"
    save_navigation "tools/deployment/logs.sh --explain"
    exit 0
fi

# Validate parameters
if [ -z "$APP_ID" ]; then
    echo -e "${RED}Error:${NC} App ID required"
    echo "Usage: $0 <app_id> [lines] [--explain]"
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

# Execute logs fetch
log_info "Fetching logs for application ID: $APP_ID (last $LINES lines)"

response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications/${APP_ID}/logs?lines=${LINES}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" == "200" ]]; then
    echo "$body"
    log_success "Retrieved logs for application $APP_ID"

    echo ""
    print_navigation "/ → deployment → logs.sh" "tools/deployment/list.sh" "status.sh $APP_ID"
    save_navigation "tools/deployment/logs.sh $APP_ID $LINES"
    exit 0
else
    log_error "Failed to get logs for application $APP_ID (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check app status: bash tools/deployment/status.sh $APP_ID"
    echo "  2. Try container logs: bash tools/containers/logs.sh <container>"
    echo "  3. Go back: bash tools/deployment/list.sh"
    exit 1
fi
