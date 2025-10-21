#!/bin/bash
# Setup script for Python and Node environments in correct locations
# Ozean Licht Ecosystem

set -e

echo "🔧 Setting Up Development Environments"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md" ]; then
    echo -e "${RED}Error: Not in the ozean-licht-ecosystem directory!${NC}"
    exit 1
fi

# Step 1: Python Environment
echo -e "${YELLOW}Step 1: Setting up Python environment...${NC}"
if [ -d "infrastructure/python-env/.venv" ]; then
    echo -e "${GREEN}✓ Python venv already exists${NC}"
else
    # Check for uv
    if command -v uv &> /dev/null; then
        echo "Creating Python virtual environment with uv..."
        cd infrastructure/python-env
        uv venv .venv
        cd ../..
        echo -e "${GREEN}✓ Python venv created with uv${NC}"
    else
        # Fallback to standard venv
        echo "Creating Python virtual environment with venv..."
        python3 -m venv infrastructure/python-env/.venv
        echo -e "${GREEN}✓ Python venv created${NC}"
    fi
fi

# Activate Python environment and install dependencies
echo "Installing Python dependencies..."
source infrastructure/python-env/.venv/bin/activate

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    cat > requirements.txt << 'EOF'
# ADW Core Dependencies
anthropic>=0.39.0
openai>=1.0.0
click>=8.1.0
rich>=13.0.0
python-dotenv>=1.0.0

# Claude Code SDK
claude-code-sdk>=0.1.0

# Git operations
gitpython>=3.1.0

# Utilities
pydantic>=2.0.0
httpx>=0.25.0
tenacity>=8.2.0
aiofiles>=23.2.0

# Testing
pytest>=7.0.0
pytest-asyncio>=0.21.0

# Optional: E2B integration
e2b-code-interpreter>=0.1.0

# Database
asyncpg>=0.29.0

# API clients
qdrant-client>=1.7.0
EOF
    echo -e "${GREEN}✓ requirements.txt created${NC}"
fi

# Install Python packages
if command -v uv &> /dev/null; then
    uv pip install -r requirements.txt
else
    pip install -r requirements.txt
fi
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Step 2: Node Environment
echo -e "${YELLOW}Step 2: Setting up Node.js environment...${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not installed! Please install Node.js first.${NC}"
    echo "Visit: https://nodejs.org/"
else
    # Update package.json to use new node_modules location
    if [ -f "package.json" ]; then
        # Create new package.json in tools/node-env
        cat > tools/node-env/package.json << 'EOF'
{
  "name": "ozean-licht-node-deps",
  "version": "1.0.0",
  "description": "Node.js dependencies for Ozean Licht Ecosystem",
  "private": true,
  "dependencies": {
    "@anthropic-ai/claude-code": "latest",
    "@e2b/code-interpreter": "latest",
    "@modelcontextprotocol/server-filesystem": "latest",
    "@modelcontextprotocol/server-github": "latest",
    "@modelcontextprotocol/server-postgres": "latest",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
        echo -e "${GREEN}✓ package.json created in tools/node-env${NC}"

        # Install Node modules
        cd tools/node-env
        if [ -d "node_modules" ]; then
            echo -e "${GREEN}✓ Node modules already exist${NC}"
        else
            echo "Installing Node.js dependencies..."
            npm install
            echo -e "${GREEN}✓ Node dependencies installed${NC}"
        fi
        cd ../..
    fi
fi

# Step 3: Create convenience symlinks (optional)
echo -e "${YELLOW}Step 3: Creating convenience symlinks...${NC}"

# Create .venv symlink for compatibility
if [ ! -L ".venv" ]; then
    ln -s infrastructure/python-env/.venv .venv
    echo -e "${GREEN}✓ Created .venv symlink${NC}"
fi

# Create node_modules symlink for compatibility
if [ ! -L "node_modules" ]; then
    ln -s tools/node-env/node_modules node_modules
    echo -e "${GREEN}✓ Created node_modules symlink${NC}"
fi

# Step 4: Update .gitignore
echo -e "${YELLOW}Step 4: Updating .gitignore...${NC}"
if ! grep -q "infrastructure/python-env/.venv" .gitignore 2>/dev/null; then
    cat >> .gitignore << 'EOF'

# Environment directories (new locations)
infrastructure/python-env/.venv/
tools/node-env/node_modules/

# Convenience symlinks
.venv
node_modules
EOF
    echo -e "${GREEN}✓ Updated .gitignore${NC}"
fi

# Step 5: Create activation helper
echo -e "${YELLOW}Step 5: Creating activation helper...${NC}"
cat > activate << 'EOF'
#!/bin/bash
# Quick activation helper
source scripts/activate_env.sh
EOF
chmod +x activate
echo -e "${GREEN}✓ Created activation helper${NC}"

# Summary
echo ""
echo -e "${GREEN}======================================"
echo "✅ Environment Setup Complete!"
echo "======================================${NC}"
echo ""
echo "Environments are now organized:"
echo "  Python: infrastructure/python-env/.venv"
echo "  Node:   tools/node-env/node_modules"
echo ""
echo "To activate environments, run:"
echo -e "${YELLOW}  source scripts/activate_env.sh${NC}"
echo "Or use the shortcut:"
echo -e "${YELLOW}  source activate${NC}"
echo ""
echo "Next steps:"
echo "1. Activate the environment"
echo "2. Run: ./scripts/setup_github_adw.sh"
echo "3. Test: python adw_tests/test_first_agent.py"