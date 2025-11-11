#!/bin/bash
# Hook Installation Verification Script

echo "=================================="
echo "Claude Code Hooks - Verification"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

success=0
failed=0

# Test 1: Check settings.json exists
echo -n "1. Checking settings.json... "
if [ -f "/opt/ozean-licht-ecosystem/.claude/settings.json" ]; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

# Test 2: Check bash wrappers are executable
echo -n "2. Checking bash wrappers... "
all_executable=true
for hook in pre-tool-use post-tool-use stop session-start session-end user-prompt-submit pre-compact; do
    if [ ! -x "/opt/ozean-licht-ecosystem/.claude/hooks/$hook" ]; then
        all_executable=false
        break
    fi
done
if $all_executable; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

# Test 3: Check TypeScript compiled
echo -n "3. Checking TypeScript build... "
if [ -d "/opt/ozean-licht-ecosystem/.claude/hooks/dist" ] && [ -f "/opt/ozean-licht-ecosystem/.claude/hooks/dist/handlers/session-start.js" ]; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

# Test 4: Check .env configuration
echo -n "4. Checking .env file... "
if [ -f "/opt/ozean-licht-ecosystem/.claude/hooks/.env" ]; then
    log_level=$(grep "^LOG_LEVEL=" /opt/ozean-licht-ecosystem/.claude/hooks/.env | cut -d= -f2)
    echo -e "${GREEN}✓${NC} (LOG_LEVEL=$log_level)"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

# Test 5: Test hook execution
echo -n "5. Testing hook execution... "
output=$(echo '{}' | /opt/ozean-licht-ecosystem/.claude/hooks/session-start 2>/dev/null)
if echo "$output" | grep -q '"continue":true'; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC} ($output)"
    ((failed++))
fi

# Test 6: Check MCP Gateway connectivity
echo -n "6. Checking MCP Gateway... "
if curl -s http://localhost:8100/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} (reachable)"
    ((success++))
else
    echo -e "${YELLOW}⚠${NC} (not running - optional)"
    ((success++))
fi

# Test 7: Check tool catalog
echo -n "7. Checking tool catalog... "
if [ -f "/opt/ozean-licht-ecosystem/tools/inventory/tool-catalog.json" ]; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

# Test 8: Validate settings.json syntax
echo -n "8. Validating settings.json... "
if cat /opt/ozean-licht-ecosystem/.claude/settings.json | jq '.' >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    ((success++))
else
    echo -e "${RED}✗${NC}"
    ((failed++))
fi

echo ""
echo "=================================="
echo "Results: ${GREEN}$success passed${NC}, ${RED}$failed failed${NC}"
echo "=================================="
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ Hooks are fully operational!${NC}"
    echo ""
    echo "The hooks will automatically execute during Claude Code sessions:"
    echo "  • SessionStart: When you start a new session"
    echo "  • PreToolUse: Before every tool execution"
    echo "  • PostToolUse: After every tool execution"
    echo "  • UserPromptSubmit: When you submit a prompt"
    echo "  • Stop: When Claude finishes responding"
    echo "  • PreCompact: Before context compaction"
    echo "  • SessionEnd: When session closes"
    echo ""
    echo "Current log level: $log_level (change in .claude/hooks/.env)"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Review errors above.${NC}"
    exit 1
fi
