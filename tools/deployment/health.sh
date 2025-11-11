#!/bin/bash
# Check Coolify API health
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"
source "${SCRIPT_DIR}/../scripts/utils.sh"

# Handle explain mode
if [ "$1" = "--explain" ]; then
    print_header "Health Check - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Connect to Coolify API health        ${V}"
    echo "${V}   2. Verify API is responding             ${V}"
    echo "${V}   3. Update tool state                    ${V}"
    echo "${V}                                            ${V}"
    echo "${V} This checks:                              ${V}"
    echo "${V}   - API accessibility                     ${V}"
    echo "${V}   - Authentication validity               ${V}"
    echo "${V}   - Network connectivity                  ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: < 1 second              ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Run this before:                          ${V}"
    echo "${V}   - Deploying applications                ${V}"
    echo "${V}   - Troubleshooting deployment issues     ${V}"
    echo "${V}   - Verifying Coolify setup               ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""

    print_navigation "/ → deployment → health.sh" "tools/deployment/list.sh" "execute"
    save_navigation "tools/deployment/health.sh --explain"
    exit 0
fi

# Check environment
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

# Execute health check
log_info "Checking Coolify health"

response=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/health" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [[ "$http_code" == "200" ]]; then
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    log_success "Coolify is healthy"

    echo ""
    echo "All systems operational. You can proceed with:"
    echo "  - Deploy: bash tools/deployment/deploy.sh <app_id>"
    echo "  - List apps: bash tools/deployment/list-apps.sh"
    echo ""

    print_navigation "/ → deployment → health.sh" "tools/deployment/list.sh" "deploy.sh or list-apps.sh"
    save_navigation "tools/deployment/health.sh"
    exit 0
else
    log_error "Coolify health check failed (HTTP $http_code)"
    echo "$body"

    echo ""
    echo "Recovery options:"
    echo "  1. Check Coolify is running: bash tools/containers/ps.sh coolify"
    echo "  2. Restart Coolify: docker restart coolify"
    echo "  3. Check system health: bash tools/monitoring/health-all.sh"
    echo "  4. Verify API URL: echo \$COOLIFY_API_URL"
    exit 1
fi
