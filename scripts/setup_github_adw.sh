#!/bin/bash

# ADW System GitHub Setup Script
# This script initializes Git and connects to GitHub for ADW integration

set -e  # Exit on error

echo "🚀 ADW System GitHub Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md" ]; then
    echo -e "${RED}Error: Not in the ozean-licht-ecosystem directory!${NC}"
    exit 1
fi

# Step 1: Check Git status
echo -e "${YELLOW}Step 1: Checking Git status...${NC}"
if [ -d .git ]; then
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
    git status --short
else
    echo "Initializing Git repository..."
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
fi

# Step 2: Create .gitignore if it doesn't exist
echo -e "${YELLOW}Step 2: Setting up .gitignore...${NC}"
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv
*.egg-info/
build/
dist/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local
*.env
!example.env

# ADW specific
worktrees/
trees/
agents/*/raw_output.jsonl
agents/*/adw_state.json
.ports.env
specs/plan-*.md
app_docs/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.cursor/

# OS
.DS_Store
Thumbs.db
Desktop.ini

# Logs
logs/
*.log
.npm/
.yarn/

# Temporary files
tmp/
temp/
*.tmp
*.bak
*.backup

# Database
*.sqlite
*.sqlite3
*.db

# MCP Gateway
.mcp_gateway.json
mcp_cache/

# Backups
backups/
*.backup
EOF
    echo -e "${GREEN}✓ .gitignore created${NC}"
else
    echo -e "${GREEN}✓ .gitignore already exists${NC}"
fi

# Step 3: Create example.env
echo -e "${YELLOW}Step 3: Creating example.env...${NC}"
cat > example.env << 'EOF'
# API Keys
ANTHROPIC_API_KEY=sk-ant-XXXXXXXX
OPENAI_API_KEY=sk-XXXXXXXX  # Optional
E2B_API_KEY=XXXXXXXX  # Optional

# GitHub Configuration
GITHUB_REPO_URL=https://github.com/USERNAME/ozean-licht-ecosystem
GITHUB_PAT=ghp_XXXXXXXX
GITHUB_WEBHOOK_SECRET=XXXXXXXX

# Claude Configuration
CLAUDE_CODE_PATH=/usr/local/bin/claude

# ADW Configuration
ADW_PORT_BACKEND_START=9100
ADW_PORT_FRONTEND_START=9200
ADW_MAX_CONCURRENT=15
ADW_DEFAULT_MODEL_SET=base

# Server Configuration
SERVER_IP=138.201.139.25
SERVER_SSH_KEY=~/.ssh/ozean-automation

# Services URLs
COOLIFY_URL=http://coolify.ozean-licht.dev:8000
MEM0_URL=http://mem0.ozean-licht.dev:8090
QDRANT_URL=http://qdrant.ozean-licht.dev:6333
N8N_URL=http://n8n.ozean-licht.dev:5678
EOF
echo -e "${GREEN}✓ example.env created${NC}"

# Step 4: Initial commit
echo -e "${YELLOW}Step 4: Creating initial commit...${NC}"
if [ -z "$(git log 2>/dev/null)" ]; then
    git add .gitignore example.env
    git add docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md
    git add adws/
    git add .claude/
    git commit -m "Initial commit: ADW System with MCP Gateway integration

- Added ADW scripts and modules
- Integrated MCP Gateway for tool access
- Created comprehensive integration checklist
- Set up project structure for Ozean Licht ecosystem"
    echo -e "${GREEN}✓ Initial commit created${NC}"
else
    echo -e "${GREEN}✓ Repository already has commits${NC}"
fi

# Step 5: GitHub CLI check
echo -e "${YELLOW}Step 5: Checking GitHub CLI...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI installed${NC}"

    # Check authentication
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✓ GitHub CLI authenticated${NC}"
    else
        echo -e "${YELLOW}GitHub CLI not authenticated. Running 'gh auth login'...${NC}"
        gh auth login
    fi
else
    echo -e "${RED}GitHub CLI not installed!${NC}"
    echo "Install with:"
    echo "  macOS: brew install gh"
    echo "  Linux: curl -sS https://cli.github.com/install.sh | sh"
    exit 1
fi

# Step 6: Create GitHub repository
echo -e "${YELLOW}Step 6: GitHub Repository Setup...${NC}"
echo ""
echo "Choose repository visibility:"
echo "1) Private (recommended for development)"
echo "2) Public"
echo "3) Skip (already have a repository)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Creating private repository..."
        gh repo create ozean-licht-ecosystem --private --source=. --remote=origin --description "Ozean Licht Ecosystem - Kids Ascension & Main Platform with ADW System"
        echo -e "${GREEN}✓ Private repository created${NC}"
        ;;
    2)
        echo "Creating public repository..."
        gh repo create ozean-licht-ecosystem --public --source=. --remote=origin --description "Ozean Licht Ecosystem - Kids Ascension & Main Platform with ADW System"
        echo -e "${GREEN}✓ Public repository created${NC}"
        ;;
    3)
        echo "Skipping repository creation..."
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Step 7: Verify remote
echo -e "${YELLOW}Step 7: Verifying Git remote...${NC}"
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✓ Remote 'origin' configured:${NC}"
    git remote -v
else
    echo -e "${YELLOW}No remote configured. Add manually with:${NC}"
    echo "  git remote add origin https://github.com/USERNAME/ozean-licht-ecosystem.git"
fi

# Step 8: Create first issue for testing
echo -e "${YELLOW}Step 8: Creating test issue...${NC}"
echo "Would you like to create a test issue for ADW? (y/n)"
read -p "Choice: " create_issue

if [ "$create_issue" = "y" ]; then
    gh issue create \
        --title "Test: ADW System Integration" \
        --body "This is a test issue for the ADW system.

## Task
Add a simple health check endpoint that returns:
- Status: 'ok'
- Timestamp: Current ISO-8601 timestamp
- Service: 'test-service'

## Labels
- adw-test
- chore

## Notes
This issue is for testing the ADW automated workflow system." \
        --label "adw-test,chore"

    echo -e "${GREEN}✓ Test issue created${NC}"
    echo "Run 'gh issue list' to see the issue number"
fi

# Step 9: Setup complete
echo ""
echo -e "${GREEN}=================================="
echo "✅ ADW GitHub Setup Complete!"
echo "==================================${NC}"
echo ""
echo "Next steps:"
echo "1. Set up your .env file with actual API keys:"
echo "   cp example.env .env"
echo "   nano .env  # Add your actual keys"
echo ""
echo "2. Test MCP integration:"
echo "   python adws/adw_modules/mcp_integration.py"
echo ""
echo "3. Run your first ADW agent:"
echo "   uv run adws/adw_plan_iso.py [issue-number]"
echo ""
echo "4. Monitor agent activity:"
echo "   tail -f agents/*/planner/raw_output.jsonl"
echo ""
echo -e "${YELLOW}Remember: The ADW system is powerful - always review generated code before merging!${NC}"