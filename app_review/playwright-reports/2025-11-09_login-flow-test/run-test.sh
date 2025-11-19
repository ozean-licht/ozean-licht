#!/bin/bash

###############################################################################
# Admin Dashboard Login Flow Test Runner
#
# This script prepares the environment and runs the Playwright test
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="/opt/ozean-licht-ecosystem"

echo "=================================="
echo "Admin Login Flow Test"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if admin dashboard is running
echo "Checking if admin dashboard is running on port 9200..."
if curl -s http://localhost:9200 > /dev/null; then
    echo -e "${GREEN}✓${NC} Admin dashboard is running"
else
    echo -e "${RED}✗${NC} Admin dashboard is NOT running"
    echo ""
    echo "Start the admin dashboard with:"
    echo "  cd $PROJECT_ROOT"
    echo "  pnpm --filter admin dev"
    echo ""
    exit 1
fi

# Check if MCP Gateway is running
echo "Checking if MCP Gateway is running on port 8100..."
if curl -s http://localhost:8100/health > /dev/null; then
    echo -e "${GREEN}✓${NC} MCP Gateway is running"
else
    echo -e "${YELLOW}⚠${NC} MCP Gateway is NOT running (optional for this test)"
fi

echo ""
echo "=================================="
echo "Running Playwright Test"
echo "=================================="
echo ""

# Check if Playwright is installed
if ! command -v npx &> /dev/null; then
    echo -e "${RED}✗${NC} npx not found. Please install Node.js and npm"
    exit 1
fi

# Install Playwright if needed
if ! npx playwright --version &> /dev/null; then
    echo "Installing Playwright..."
    npm install -D @playwright/test
    npx playwright install
fi

# Run the test
cd "$SCRIPT_DIR"
echo "Executing automated test..."
npx playwright test automated-login-test.js --headed

# Check if test passed
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=================================="
    echo "✓ Test Completed Successfully"
    echo "==================================${NC}"
    echo ""
    echo "Results location:"
    echo "  $SCRIPT_DIR"
    echo ""
    echo "Generated files:"
    echo "  - playwright-report-admin-login-flow.md (full report)"
    echo "  - test-results.json (structured data)"
    echo "  - 01-initial-login-page.png"
    echo "  - 02-form-filled.png"
    echo "  - 03-after-submit.png"
    echo "  - 04-post-login-page.png"
    echo "  - 05-auth-state.png"
    echo ""
else
    echo ""
    echo -e "${RED}=================================="
    echo "✗ Test Failed"
    echo "==================================${NC}"
    echo ""
    echo "Check the test output above for details"
    echo ""
    exit 1
fi
