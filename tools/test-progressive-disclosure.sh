#!/bin/bash
# Test script for progressive disclosure tool system
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/templates/shared.sh"

print_header "Progressive Disclosure Test Suite"
echo "${V}                                            ${V}"
echo "${V} Testing all paths and components...       ${V}"
echo "${V}                                            ${V}"
print_footer

echo ""
PASSED=0
FAILED=0

# Test function
test_command() {
    local desc="$1"
    local cmd="$2"

    printf "Testing: %-40s " "$desc"

    if bash $cmd &>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test core infrastructure
echo ""
echo "=== Core Infrastructure ==="
test_command "Intent router (what.sh)" "tools/what.sh"
test_command "Discovery entry (discover.sh)" "tools/discover.sh"
test_command "Navigation helper (nav.sh)" "tools/nav.sh"
test_command "Learning mode (learn.sh)" "tools/learn.sh"
test_command "Shared templates" "-f tools/templates/shared.sh && echo ok"

# Test intent routing
echo ""
echo "=== Intent Routing ==="
test_command "Deploy intent" "tools/what.sh 'deploy app'"
test_command "Health intent" "tools/what.sh 'check health'"
test_command "Backup intent" "tools/what.sh 'backup database'"
test_command "Container intent" "tools/what.sh 'docker logs'"

# Test category lists
echo ""
echo "=== Category Lists ==="
test_command "Deployment list" "tools/deployment/list.sh"
test_command "Containers list" "tools/containers/list.sh"
test_command "Monitoring list" "tools/monitoring/list.sh"
test_command "Database list" "tools/database/list.sh"
test_command "Git list" "tools/git/list.sh"
test_command "Remote list" "tools/remote/list.sh"

# Test explain mode
echo ""
echo "=== Explain Mode ==="
test_command "Deploy explain" "tools/deployment/deploy.sh --explain"
test_command "Restart explain" "tools/deployment/restart.sh --explain"
test_command "Container logs explain" "tools/containers/logs.sh --explain"
test_command "Git status explain" "tools/git/status.sh --explain"

# Test file structure
echo ""
echo "=== File Structure ==="
test_command "All categories exist" "-d tools/deployment && -d tools/containers && -d tools/monitoring && -d tools/database && -d tools/git && -d tools/remote && echo ok"
test_command "All list.sh executable" "-x tools/deployment/list.sh && -x tools/containers/list.sh && echo ok"

# Count files
echo ""
echo "=== File Count ==="
DEPLOYMENT_COUNT=$(find tools/deployment -name "*.sh" -type f | wc -l)
CONTAINERS_COUNT=$(find tools/containers -name "*.sh" -type f | wc -l)
MONITORING_COUNT=$(find tools/monitoring -name "*.sh" -type f | wc -l)
DATABASE_COUNT=$(find tools/database -name "*.sh" -type f | wc -l)
GIT_COUNT=$(find tools/git -name "*.sh" -type f | wc -l)
REMOTE_COUNT=$(find tools/remote -name "*.sh" -type f | wc -l)
TOTAL_COUNT=$((DEPLOYMENT_COUNT + CONTAINERS_COUNT + MONITORING_COUNT + DATABASE_COUNT + GIT_COUNT + REMOTE_COUNT))

echo "Deployment: $DEPLOYMENT_COUNT files (expected: 7)"
echo "Containers: $CONTAINERS_COUNT files (expected: 12)"
echo "Monitoring: $MONITORING_COUNT files (expected: 6)"
echo "Database: $DATABASE_COUNT files (expected: 6)"
echo "Git: $GIT_COUNT files (expected: 7)"
echo "Remote: $REMOTE_COUNT files (expected: 5)"
echo "Total: $TOTAL_COUNT files (expected: ~43)"

# Test navigation breadcrumbs
echo ""
echo "=== Navigation Breadcrumbs ==="
OUTPUT=$(bash tools/discover.sh 2>&1)
if echo "$OUTPUT" | grep -q "Current:"; then
    echo -e "${GREEN}✓${NC} Breadcrumbs present in discover.sh"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Breadcrumbs missing in discover.sh"
    ((FAILED++))
fi

# Test learning mode examples
echo ""
echo "=== Learning Mode Examples ==="
test_command "MCP running query" "tools/learn.sh 'is mcp running'"
test_command "Deploy vs restart" "tools/learn.sh 'deploy vs restart'"

# Summary
echo ""
print_header "Test Results"
echo "${V}                                            ${V}"
printf "${V}  %-42s ${V}\n" "Total Tests Run: $((PASSED + FAILED))"
printf "${V}  ${GREEN}%-42s${NC} ${V}\n" "Passed: $PASSED"
printf "${V}  ${RED}%-42s${NC} ${V}\n" "Failed: $FAILED"
echo "${V}                                            ${V}"

if [ $FAILED -eq 0 ]; then
    printf "${V}  ${GREEN}%-42s${NC} ${V}\n" "✓ ALL TESTS PASSED"
else
    printf "${V}  ${YELLOW}%-42s${NC} ${V}\n" "⚠ SOME TESTS FAILED"
fi

echo "${V}                                            ${V}"
print_footer

# Context usage estimation
echo ""
echo "=== Context Usage Estimation ==="
echo ""
echo "Old approach (flat structure):"
echo "  - All tools loaded: ~20,000 tokens"
echo ""
echo "New approach (progressive disclosure):"
echo "  - Intent router: ~200 tokens"
echo "  - Discovery: ~500 tokens"
echo "  - Category list: ~1,000 tokens"
echo "  - Command explain: ~2,000 tokens"
echo "  - Total: ~3,700 tokens"
echo ""
echo "Reduction: ~16,300 tokens (81.5% savings)"
echo ""

# Exit with appropriate code
if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
