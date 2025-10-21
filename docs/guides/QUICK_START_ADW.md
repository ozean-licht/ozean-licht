# 🚀 Quick Start: Run Your First ADW Agent

Welcome to your ADW (Autonomous Development Workflow) system integrated with MCP Gateway!

## ✅ What We've Set Up

1. **Created Comprehensive Integration Checklist**
   - `docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md`
   - Complete guide for ADW system integration

2. **MCP Gateway Integration**
   - `adws/adw_modules/mcp_integration.py`
   - Connects ADW agents to your MCP tools (GitHub, PostgreSQL, Mem0, etc.)

3. **Setup Scripts** (in `scripts/` directory)
   - `setup_github_adw.sh` - Initialize Git and GitHub
   - `setup_environments.sh` - Configure Python and Node environments
   - `activate_env.sh` - Activate all development environments

4. **Test Scripts** (in `adw_tests/` directory)
   - `test_first_agent.py` - Test your ADW system

5. **Organized Environment Structure**
   - Python venv: `infrastructure/python-env/.venv`
   - Node modules: `tools/node-env/node_modules`

## 🎯 Step-by-Step: Run Your First Agent

### Step 1: Set Up Environment Variables

```bash
# Create your .env file
cp example.env .env

# Edit .env with your actual API keys
nano .env
# Add at minimum:
# - ANTHROPIC_API_KEY (from https://console.anthropic.com/)
# - GITHUB_PAT (from GitHub Settings → Developer settings → Personal access tokens)
```

### Step 2: Set Up Development Environments

```bash
# First, set up Python and Node environments in correct locations
./scripts/setup_environments.sh

# Activate the environments
source scripts/activate_env.sh
# OR use the shortcut:
source activate
```

### Step 3: Initialize Git & GitHub

```bash
# Run the setup script
./scripts/setup_github_adw.sh

# This will:
# 1. Initialize Git repository
# 2. Create .gitignore
# 3. Make initial commit
# 4. Set up GitHub repository (if you choose)
# 5. Create a test issue
```

### Step 4: Test MCP Integration

```bash
# Make sure environments are activated
source scripts/activate_env.sh

# Run the test script
python adw_tests/test_first_agent.py

# This will:
# 1. Check environment configuration
# 2. Test MCP Gateway connections
# 3. Create a test ADW workflow
# 4. Generate monitoring scripts
```

### Step 5: Run Your First Real Agent

```bash
# Create a GitHub issue (if you haven't already)
gh issue create --title "Add health check endpoint" \
                --body "Create /health endpoint returning status and timestamp" \
                --label "chore"

# Note the issue number (e.g., #1)

# Run ADW planning phase
uv run adws/adw_plan_iso.py 1

# This creates:
# - Isolated worktree in trees/{adw_id}/
# - Implementation plan in specs/
# - Initial state in agents/{adw_id}/

# Get the ADW ID from output, then run build
ADW_ID="abc12345"  # Replace with actual ID
uv run adws/adw_build_iso.py 1 $ADW_ID

# Run full SDLC (careful - this does everything!)
# uv run adws/adw_sdlc_iso.py 1
```

### Step 6: Monitor Agent Activity

```bash
# Use the monitoring script
./monitor_adw.sh

# Or watch agent logs in real-time
tail -f agents/*/planner/raw_output.jsonl

# Check worktrees
git worktree list

# Check port usage
lsof -i :9100-9214
```

## 🧠 Understanding MCP Tool Usage

Your agents can now use these MCP tools:

### Database Operations
```python
# Agents can query databases through MCP
"/mcp-postgres kids-ascension-db list tables"
"/mcp-postgres ozean-licht-db query 'SELECT * FROM users LIMIT 5'"
```

### Memory Storage
```python
# Store and retrieve learnings
"/mcp-mem0 remember 'User prefers TypeScript for all projects'"
"/mcp-mem0 search 'coding preferences'"
```

### GitHub Integration
```python
# Create PRs and manage issues
"/mcp-github create-pr 'feat: Add health check' 'Implements health endpoint'"
"/mcp-github list-issues --label=bug"
```

## ⚠️ Important Notes

1. **Always Review Generated Code**
   - ADW is powerful but not perfect
   - Check generated code before merging

2. **Start with Simple Tasks**
   - Begin with `/chore` tasks
   - Progress to `/feature` and `/bug` fixes

3. **Monitor Resource Usage**
   - Clean up worktrees: `git worktree prune`
   - Remove old agent states: `rm -rf agents/old_id/`

4. **MCP Gateway Benefits**
   - Unified tool access
   - Consistent authentication
   - Rate limiting and monitoring
   - Memory persistence across agents

## 🆘 Troubleshooting

### Issue: "Claude SDK not available"
```bash
pip install claude-code-sdk
# or
uv pip install claude-code-sdk
```

### Issue: "Git repository not initialized"
```bash
./scripts/setup_github_adw.sh
```

### Issue: "MCP tools not working"
```bash
# Check MCP services are running
curl http://mem0.ozean-licht.dev:8090/health
curl http://n8n.ozean-licht.dev:5678/healthz
```

### Issue: "Port conflicts"
```bash
# Kill processes on ADW ports
for port in {9100..9114} {9200..9214}; do
  lsof -ti:$port | xargs kill -9 2>/dev/null
done
```

## 📚 Next Steps

1. **Read the Full Documentation**
   - `docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md`

2. **Customize ADW Commands**
   - Edit `.claude/commands/*.md` for your specific needs
   - Add project-specific patterns and templates

3. **Set Up Automation**
   - Configure N8N workflows for ADW triggers
   - Set up cron jobs for continuous monitoring

4. **Scale Up**
   - Run multiple agents in parallel
   - Enable ZTE (Zero Touch Engineering) for trusted workflows

---

**Remember**: You're learning an advanced system. Take time to understand each component before enabling full automation.

**Support**: Check the masterchecklist for detailed troubleshooting and best practices.

Good luck with your autonomous development journey! 🎉