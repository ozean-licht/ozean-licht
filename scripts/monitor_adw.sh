#!/bin/bash
# ADW Agent Monitor - Comprehensive monitoring for ADW system

echo "🔍 ADW Agent Monitor"
echo "===================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for active worktrees
echo -e "\n${BLUE}📁 Active Worktrees:${NC}"
if command -v git &> /dev/null; then
    git worktree list 2>/dev/null || echo "No worktrees found"
else
    echo "Git not available"
fi

# Check for agent states
echo -e "\n${BLUE}🤖 Agent States:${NC}"
if [ -d "agents" ]; then
    for agent in agents/*/; do
        if [ -f "${agent}adw_state.json" ]; then
            echo -e "${GREEN}Agent: $(basename $agent)${NC}"
            cat "${agent}adw_state.json" | jq . 2>/dev/null | head -10 || echo "Invalid JSON"
            echo ""
        fi
    done
else
    echo -e "${YELLOW}No agents directory found${NC}"
fi

# Check port usage
echo -e "\n${BLUE}🔌 Port Usage (9100-9214):${NC}"
port_in_use=false
for port in {9100..9114} {9200..9214}; do
    if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
        echo -e "${GREEN}Port $port: IN USE${NC}"
        port_in_use=true
    fi
done
if [ "$port_in_use" = false ]; then
    echo -e "${YELLOW}No ADW ports currently in use${NC}"
fi

# Check recent logs
echo -e "\n${BLUE}📝 Recent Agent Activity:${NC}"
if [ -d "agents" ]; then
    log_files=$(find agents -name "*.jsonl" -type f 2>/dev/null)
    if [ -n "$log_files" ]; then
        for log in $log_files; do
            if [ -s "$log" ]; then
                echo -e "${GREEN}Log: $log${NC}"
                tail -1 "$log" | jq . 2>/dev/null | head -5 || tail -1 "$log"
                echo ""
            fi
        done | head -20
    else
        echo -e "${YELLOW}No agent logs found${NC}"
    fi
else
    echo -e "${YELLOW}No agents directory found${NC}"
fi

# Check MCP services connectivity
echo -e "\n${BLUE}🔗 MCP Service Status:${NC}"

# Check Mem0
if curl -s --max-time 2 http://mem0.ozean-licht.dev:8090/health &>/dev/null; then
    echo -e "${GREEN}✓ Mem0: ONLINE${NC}"
else
    echo -e "${RED}✗ Mem0: OFFLINE or unreachable${NC}"
fi

# Check N8N
if curl -s --max-time 2 http://n8n.ozean-licht.dev:5678/healthz &>/dev/null; then
    echo -e "${GREEN}✓ N8N: ONLINE${NC}"
else
    echo -e "${RED}✗ N8N: OFFLINE or unreachable${NC}"
fi

# Check Qdrant
if curl -s --max-time 2 http://qdrant.ozean-licht.dev:6333/health &>/dev/null; then
    echo -e "${GREEN}✓ Qdrant: ONLINE${NC}"
else
    echo -e "${RED}✗ Qdrant: OFFLINE or unreachable${NC}"
fi

# Check environment status
echo -e "\n${BLUE}🔧 Environment Status:${NC}"
if [ -d "infrastructure/python-env/.venv" ]; then
    echo -e "${GREEN}✓ Python venv: Available${NC}"
    echo "  Location: infrastructure/python-env/.venv"
else
    echo -e "${RED}✗ Python venv: Not found${NC}"
    echo "  Run: ./scripts/setup_environments.sh"
fi

if [ -d "tools/node-env/node_modules" ]; then
    echo -e "${GREEN}✓ Node modules: Available${NC}"
    echo "  Location: tools/node-env/node_modules"
else
    echo -e "${RED}✗ Node modules: Not found${NC}"
    echo "  Run: ./scripts/setup_environments.sh"
fi

# Check for .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file: Present${NC}"
    # Check for critical keys (without showing values)
    if grep -q "ANTHROPIC_API_KEY" .env; then
        echo -e "  ${GREEN}✓ ANTHROPIC_API_KEY set${NC}"
    else
        echo -e "  ${RED}✗ ANTHROPIC_API_KEY missing${NC}"
    fi
    if grep -q "GITHUB_PAT" .env; then
        echo -e "  ${GREEN}✓ GITHUB_PAT set${NC}"
    else
        echo -e "  ${RED}✗ GITHUB_PAT missing${NC}"
    fi
else
    echo -e "${RED}✗ .env file: Not found${NC}"
    echo "  Run: cp example.env .env"
fi

echo -e "\n${BLUE}📊 System Summary:${NC}"
echo "===================="
echo "Project: Ozean Licht Ecosystem"
echo "ADW System: Integrated with MCP Gateway"
echo "Server: 138.201.139.25"
echo ""
echo -e "${YELLOW}Quick Commands:${NC}"
echo "  Activate env:  source scripts/activate_env.sh"
echo "  Test system:   python adw_tests/test_first_agent.py"
echo "  Plan issue:    uv run adws/adw_plan_iso.py [issue-number]"
echo "  Full SDLC:     uv run adws/adw_sdlc_iso.py [issue-number]"