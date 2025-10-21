#!/bin/bash
# Activation script for Python and Node environments
# Ozean Licht Ecosystem - Environment Activation

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔧 Activating Ozean Licht Development Environment"
echo "================================================="

# Activate Python virtual environment
if [ -d "infrastructure/python-env/.venv" ]; then
    echo -e "${YELLOW}Activating Python virtual environment...${NC}"
    source infrastructure/python-env/.venv/bin/activate
    echo -e "${GREEN}✅ Python environment activated${NC}"
    echo "   Python: $(python --version)"
    echo "   Location: infrastructure/python-env/.venv"
else
    echo -e "${YELLOW}⚠️  Python virtual environment not found!${NC}"
    echo "   Run: uv venv infrastructure/python-env/.venv"
fi

# Set Node modules path
if [ -d "tools/node-env/node_modules" ]; then
    echo -e "${YELLOW}Setting Node.js module path...${NC}"
    export NODE_PATH="$(pwd)/tools/node-env/node_modules:$NODE_PATH"
    export PATH="$(pwd)/tools/node-env/node_modules/.bin:$PATH"
    echo -e "${GREEN}✅ Node.js environment configured${NC}"
    echo "   Node: $(node --version 2>/dev/null || echo 'Not installed')"
    echo "   NPM: $(npm --version 2>/dev/null || echo 'Not installed')"
    echo "   Modules: tools/node-env/node_modules"
else
    echo -e "${YELLOW}⚠️  Node modules not found!${NC}"
    echo "   Run: npm install --prefix tools/node-env"
fi

# Load environment variables
if [ -f ".env" ]; then
    echo -e "${YELLOW}Loading environment variables...${NC}"
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
else
    echo -e "${YELLOW}⚠️  No .env file found!${NC}"
    echo "   Copy from example: cp example.env .env"
fi

echo ""
echo -e "${GREEN}Environment ready! You can now run ADW commands.${NC}"
echo ""
echo "Quick commands:"
echo "  Test system:  python adw_tests/test_first_agent.py"
echo "  Plan issue:   uv run adws/adw_plan_iso.py [issue-number]"
echo "  Monitor:      ./scripts/monitor_adw.sh"