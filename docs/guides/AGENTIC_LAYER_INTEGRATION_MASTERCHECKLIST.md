# 🤖 Agentic Layer Integration Masterchecklist
**Ozean Licht Ecosystem - ADW System Implementation with MCP Gateway**

---

## ⚠️ Critical Context
**You're implementing an advanced ADW (Autonomous Development Workflow) system integrated with MCP Gateway**
- This is a learning journey - take time to understand each component
- The system enables autonomous agents to work in isolated Git worktrees
- Full Zero Touch Engineering (ZTE) capability when properly configured
- MCP Gateway provides unified tool access for all agents
- Claude SDKs (Python & TypeScript) already installed

---

## 📊 Integration Status Dashboard

### System Components
| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| Git Repository | ❌ Not Initialized | CRITICAL | Project needs Git initialization |
| GitHub Remote | ❌ Not Connected | CRITICAL | No remote repository configured |
| ADW Scripts | ✅ Copied | HIGH | All Python scripts present in `/adws/` |
| Claude Commands | ✅ Copied | HIGH | All commands in `.claude/commands/` |
| Anthropic API | ⚠️ Unknown | CRITICAL | Need to verify API key configuration |
| E2B Integration | ❌ Not Configured | MEDIUM | Optional but powerful for sandboxing |
| Mem0 Integration | ✅ Deployed | LOW | Available at mem0.ozean-licht.dev |
| Port Allocation | ⚠️ Not Tested | HIGH | Ports 9100-9114, 9200-9214 reserved |

---

## 🔌 MCP Gateway Integration Architecture

### Available MCP Services
Your infrastructure provides these MCP tools through a unified gateway:

| Service | Purpose | Key Commands | ADW Usage |
|---------|---------|--------------|-----------|
| **postgres** | Database operations | `/mcp-postgres [db] query` | Agent data queries |
| **mem0** | Persistent memory | `/mcp-mem0 remember`, `/mcp-mem0 search` | Store agent learnings |
| **github** | Repository management | `/mcp-github create-pr`, `/mcp-github list-issues` | PR creation, issue tracking |
| **n8n** | Workflow automation | `/mcp-n8n execute [workflow_id]` | Trigger automation |
| **cloudflare** | CDN & streaming | `/mcp-cloudflare stream upload` | Video pipeline |
| **playwright** | Browser automation | `/mcp-playwright navigate` | E2E testing |
| **shadcn/magicui** | UI components | `/mcp-shadcn add [component]` | Frontend development |

### ADW-MCP Integration Strategy

```python
# Updated ADW module to use MCP Gateway
# File: adw_modules/mcp_integration.py

from typing import Dict, Any
import httpx
from claude_code_sdk import query, ClaudeCodeOptions

class MCPEnabledADW:
    """ADW system integrated with MCP Gateway."""

    def __init__(self):
        self.mcp_config = {
            "mcpServers": {
                "postgres": {
                    "command": "mcp-postgres",
                    "env": {"DB_CONTAINERS": {
                        "kids-ascension": "iccc0wo0wkgsws4cowk4440c",
                        "ozean-licht": "zo8g4ogg8g0gss0oswkcs84w"
                    }}
                },
                "mem0": {
                    "command": "mcp-mem0",
                    "endpoint": "http://mem0.ozean-licht.dev:8090"
                },
                "github": {
                    "command": "mcp-github",
                    "env": {"GITHUB_TOKEN": "${GITHUB_PAT}"}
                },
                "n8n": {
                    "command": "mcp-n8n",
                    "endpoint": "http://n8n.ozean-licht.dev:5678"
                }
            }
        }

    async def execute_with_mcp(self, prompt: str, allowed_tools: list):
        """Execute ADW task with MCP tools."""
        options = ClaudeCodeOptions(
            mcp_config=self.mcp_config,
            allowed_tools=allowed_tools,
            permission_mode="acceptEdits",
            max_turns=10
        )

        async for message in query(prompt=prompt, options=options):
            # Process agent responses
            if message.get("type") == "tool_use":
                tool_name = message.get("tool_name")
                if tool_name.startswith("mcp__"):
                    # MCP tool was used
                    print(f"Agent used MCP tool: {tool_name}")
            yield message
```

### Configuring ADW Commands for MCP

Each ADW command needs to be updated to use MCP tools:

```python
# Example: Updated /implement command
# File: .claude/commands/implement.md

When implementing code:
1. Use `/mcp-postgres kids-ascension-db list tables` to understand schema
2. Use `/mcp-mem0 search "implementation patterns"` to find past solutions
3. Implement the feature
4. Use `/mcp-mem0 remember "Implementation: [description]"` to store learnings
5. Use `/mcp-github create-pr "[title]" "[body]"` when ready
```

---

## 🚀 Phase 1: Foundation Setup [IMMEDIATE - Day 1]

### 1.1 Git Repository Initialization
```bash
# Initialize Git repository
cd /Users/serg/Dev/ozean-licht-ecosystem
git init

# Create initial .gitignore
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

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local
*.env

# ADW specific
worktrees/
trees/
agents/*/raw_output.jsonl
.ports.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Build
dist/
build/
*.egg-info/
EOF

# Initial commit
git add .
git commit -m "Initial commit: ADW system integration for Ozean Licht ecosystem"
```

### 1.2 GitHub Repository Creation
```bash
# Install GitHub CLI if not present
brew install gh  # macOS
# or: curl -sS https://cli.github.com/install.sh | sh

# Authenticate with GitHub
gh auth login

# Create repository (choose one approach)
# Option A: Public repository
gh repo create ozean-licht-ecosystem --public --source=. --remote=origin --push

# Option B: Private repository (recommended initially)
gh repo create ozean-licht-ecosystem --private --source=. --remote=origin --push

# Verify remote
git remote -v
```

### 1.3 Environment Configuration
```bash
# Create comprehensive .env file
cat > .env << 'EOF'
# API Keys
ANTHROPIC_API_KEY=sk-ant-XXXXXXXX  # Get from https://console.anthropic.com/
OPENAI_API_KEY=sk-XXXXXXXX         # Optional: for comparison
E2B_API_KEY=XXXXXXXX               # Optional: from https://e2b.dev/dashboard

# GitHub Configuration
GITHUB_REPO_URL=https://github.com/USERNAME/ozean-licht-ecosystem
GITHUB_PAT=ghp_XXXXXXXX            # Personal Access Token with repo, workflow permissions
GITHUB_WEBHOOK_SECRET=XXXXXXXX     # For webhook automation

# Claude Configuration
CLAUDE_CODE_PATH=/usr/local/bin/claude  # Verify with: which claude
CLAUDE_CODE_USE_BEDROCK=0
CLAUDE_CODE_USE_VERTEX=0

# ADW Configuration
ADW_PORT_BACKEND_START=9100
ADW_PORT_FRONTEND_START=9200
ADW_MAX_CONCURRENT=15
ADW_DEFAULT_MODEL_SET=base

# Server Configuration (from infrastructure)
SERVER_IP=138.201.139.25
SERVER_SSH_KEY=~/.ssh/ozean-automation

# Services URLs
COOLIFY_URL=http://coolify.ozean-licht.dev:8000
MEM0_URL=http://mem0.ozean-licht.dev:8090
QDRANT_URL=http://qdrant.ozean-licht.dev:6333
N8N_URL=http://n8n.ozean-licht.dev:5678

# Project Specific
PROJECT_NAME=ozean-licht-ecosystem
ENVIRONMENT=development
LOG_LEVEL=DEBUG
EOF

# Secure the .env file
chmod 600 .env
```

### 1.4 Python Environment Setup
```bash
# Install uv (modern Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment
uv venv

# Activate environment
source .venv/bin/activate  # Unix/macOS
# or: .venv\Scripts\activate  # Windows

# Install ADW dependencies
uv pip install -r requirements.txt

# If requirements.txt doesn't exist, create it:
cat > requirements.txt << 'EOF'
# ADW Core
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

# Testing
pytest>=7.0.0
pytest-asyncio>=0.21.0

# Optional: E2B integration
e2b-code-interpreter>=0.1.0

# Optional: Memory layer
qdrant-client>=1.7.0
EOF

uv pip install -r requirements.txt
```

---

## 📋 Phase 2: ADW System Adaptation [Day 1-2]

### 2.1 Customize ADW Commands for Your Projects

#### Update `/chore` Command
```python
# .claude/commands/chore.md
# Add project-specific chore patterns:
- Database migrations for Kids Ascension
- Coolify deployment updates
- Mem0 knowledge base maintenance
- Server health monitoring scripts
```

#### Update `/feature` Command
```python
# .claude/commands/feature.md
# Add domain-specific features:
- Kids Ascension: video upload, moderation queue
- Ozean Licht: course platform, member area
- Infrastructure: monitoring dashboards
```

#### Create Custom Commands
```bash
# Create Kids Ascension specific command
cat > .claude/commands/ka_video.md << 'EOF'
# Kids Ascension Video Pipeline Command

Deploy this when working on video-related features for Kids Ascension.

## Usage
/ka_video <feature_description>

## Workflow
1. Set up MinIO staging bucket
2. Configure Cloudflare R2 archive
3. Integrate Cloudflare Stream
4. Create moderation queue
5. Test upload pipeline

## Context
- Max file size: 500MB
- Staging: MinIO on server
- Archive: Cloudflare R2
- Delivery: Cloudflare Stream
- Moderation: Admin approval required
EOF

# Create infrastructure command
cat > .claude/commands/infra_deploy.md << 'EOF'
# Infrastructure Deployment Command

Deploy changes to Coolify-managed services.

## Usage
/infra_deploy <service_name>

## Services
- PostgreSQL (Kids Ascension): iccc0wo0wkgsws4cowk4440c
- PostgreSQL (Ozean Licht): zo8g4ogg8g0gss0oswkcs84w
- Mem0: mem0-uo8gc0kc0gswcskk44gc8wks
- Qdrant: qdrant-posgccgk4gw84ss8oockoksc
- N8N: n8n-k088ko800k8wg0sc40sw8k4g
EOF
```

### 2.2 Configure ADW Modules
```python
# Update adw_modules/config.py
ADW_CONFIG = {
    "projects": {
        "kids_ascension": {
            "db_container": "iccc0wo0wkgsws4cowk4440c",
            "backend_port_base": 9100,
            "frontend_port_base": 9200,
            "domain": "kids-ascension.dev"
        },
        "ozean_licht": {
            "db_container": "zo8g4ogg8g0gss0oswkcs84w",
            "backend_port_base": 9110,
            "frontend_port_base": 9210,
            "domain": "ozean-licht.dev"
        }
    },
    "infrastructure": {
        "server_ip": "138.201.139.25",
        "ssh_key": "~/.ssh/ozean-automation",
        "coolify_url": "http://coolify.ozean-licht.dev:8000"
    }
}
```

### 2.3 Test Basic ADW Operations
```bash
# Test planning (creates worktree)
uv run adws/adw_plan_iso.py --help

# Create test issue
echo "Test: Implement health check endpoint" > test_issue.md

# Run planning phase (dry run)
uv run adws/adw_plan_iso.py test_issue --dry-run

# Check worktree creation
git worktree list
```

---

## 🔧 Phase 3: Integration Testing [Day 2-3]

### 3.1 GitHub Issues Integration
```bash
# Create test issue on GitHub
gh issue create \
  --title "Test: ADW Integration" \
  --body "Testing automated workflow with ADW system" \
  --label "adw-test"

# List issues to get number
gh issue list

# Test ADW with real issue (replace 1 with actual issue number)
uv run adws/adw_plan_iso.py 1
```

### 3.2 Memory Layer Integration
```python
# Test script for Mem0 integration
cat > test_mem0.py << 'EOF'
import httpx
import json
from datetime import datetime

MEM0_URL = "http://mem0.ozean-licht.dev:8090"

# Add ADW learning
memory = {
    "user_id": "adw_system",
    "content": "Successfully initialized ADW system for Ozean Licht ecosystem",
    "metadata": {
        "type": "system_event",
        "timestamp": datetime.utcnow().isoformat(),
        "component": "adw_integration"
    }
}

response = httpx.post(f"{MEM0_URL}/memory/add", json=memory)
print(f"Memory added: {response.json()}")

# Search memories
search = {"query": "ADW", "user_id": "adw_system"}
response = httpx.post(f"{MEM0_URL}/memory/search", json=search)
print(f"Search results: {response.json()}")
EOF

python test_mem0.py
```

### 3.3 Port Allocation Testing
```bash
# Test port allocation system
cat > test_ports.py << 'EOF'
import hashlib
from typing import Tuple

def get_ports_for_adw(adw_id: str) -> Tuple[int, int]:
    """Allocate unique ports based on ADW ID."""
    hash_val = int(hashlib.md5(adw_id.encode()).hexdigest()[:8], 16)
    index = hash_val % 15
    backend_port = 9100 + index
    frontend_port = 9200 + index
    return backend_port, frontend_port

# Test allocation
test_ids = ["abc12345", "def67890", "test123"]
for adw_id in test_ids:
    backend, frontend = get_ports_for_adw(adw_id)
    print(f"ADW {adw_id}: Backend={backend}, Frontend={frontend}")
EOF

python test_ports.py
```

---

## 🚦 Phase 4: First Automated Agent Run [Day 3-4]

### 4.1 Prepare Simple Task
```bash
# Create GitHub issue for first agent task
gh issue create \
  --title "Add health check endpoint to Kids Ascension API" \
  --body "Create /health endpoint that returns { status: 'ok', timestamp: ISO-8601 }" \
  --label "kids-ascension,chore"

# Note the issue number (e.g., #2)
```

### 4.2 Run Planning Phase
```bash
# Run planning workflow (creates worktree, generates spec)
uv run adws/adw_plan_iso.py 2

# Check results
ls trees/  # Should show new worktree
cat agents/*/planner/raw_output.jsonl  # Check planning output
cat specs/plan-*.md  # Review generated plan
```

### 4.3 Run Build Phase
```bash
# Get ADW ID from planning phase output
ADW_ID="abc12345"  # Replace with actual ID

# Run build phase
uv run adws/adw_build_iso.py 2 $ADW_ID

# Check implementation
cd trees/$ADW_ID
git status
git diff
```

### 4.4 Run Test Phase
```bash
# Run tests in isolated worktree
uv run adws/adw_test_iso.py 2 $ADW_ID

# Check test results
cat agents/$ADW_ID/tester/raw_output.jsonl
```

### 4.5 Complete Workflow
```bash
# Run review phase
uv run adws/adw_review_iso.py 2 $ADW_ID

# Generate documentation
uv run adws/adw_document_iso.py 2 $ADW_ID

# Check documentation
ls app_docs/features/
```

---

## 📈 Phase 5: Advanced Integration [Week 2]

### 5.1 E2B Sandbox Integration
```python
# Install E2B
uv pip install e2b-code-interpreter

# Test E2B with ADW
cat > adw_e2b_test.py << 'EOF'
from e2b_code_interpreter import Sandbox
import os

# Test code execution in sandbox
with Sandbox() as sandbox:
    # Run test
    result = sandbox.run_code("""
import json
import datetime

# Simulate health check endpoint
def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "service": "kids-ascension-api"
    }

print(json.dumps(health_check(), indent=2))
""")

    print(f"Sandbox test result:\n{result.text}")
EOF

python adw_e2b_test.py
```

### 5.2 Automated Triggers
```bash
# Set up cron trigger for continuous monitoring
cat > adw_triggers/start_monitoring.sh << 'EOF'
#!/bin/bash
cd /Users/serg/Dev/ozean-licht-ecosystem
source .venv/bin/activate
python adw_triggers/trigger_cron.py
EOF

chmod +x adw_triggers/start_monitoring.sh

# Add to crontab (runs every 5 minutes)
# crontab -e
# */5 * * * * /Users/serg/Dev/ozean-licht-ecosystem/adw_triggers/start_monitoring.sh
```

### 5.3 N8N Workflow Integration
```javascript
// Create N8N workflow for ADW triggers
// Access N8N at http://n8n.ozean-licht.dev:5678

const workflow = {
  "name": "ADW GitHub Issue Monitor",
  "nodes": [
    {
      "name": "GitHub Webhook",
      "type": "n8n-nodes-base.githubTrigger",
      "parameters": {
        "events": ["issues.opened", "issue_comment.created"],
        "repository": "ozean-licht-ecosystem"
      }
    },
    {
      "name": "Check for ADW keyword",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{$json.comment.body}}",
            "operation": "contains",
            "value2": "adw"
          }]
        }
      }
    },
    {
      "name": "Trigger ADW",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "cd /path/to/project && uv run adw_sdlc_iso.py {{$json.issue.number}}"
      }
    }
  ]
}
```

---

## 🎯 Phase 6: Production Readiness [Week 3-4]

### 6.1 Complete SDLC Pipeline
```bash
# Test full SDLC workflow
uv run adws/adw_sdlc_iso.py 3  # Issue number

# Test with auto-ship (ZTE - be careful!)
# uv run adws/adw_sdlc_zte_iso.py 4  # Only for non-critical changes
```

### 6.2 Monitoring & Observability
```python
# Create monitoring dashboard
cat > monitor_adw.py << 'EOF'
import subprocess
import json
from pathlib import Path

def check_adw_status():
    """Monitor ADW system health."""

    status = {
        "worktrees": [],
        "active_agents": [],
        "port_usage": [],
        "recent_completions": []
    }

    # Check worktrees
    result = subprocess.run(["git", "worktree", "list"],
                          capture_output=True, text=True)
    status["worktrees"] = result.stdout.strip().split("\n")

    # Check agent states
    agents_dir = Path("agents")
    if agents_dir.exists():
        for agent_dir in agents_dir.iterdir():
            if agent_dir.is_dir():
                state_file = agent_dir / "adw_state.json"
                if state_file.exists():
                    with open(state_file) as f:
                        state = json.load(f)
                        status["active_agents"].append({
                            "id": agent_dir.name,
                            "issue": state.get("issue_number"),
                            "status": state.get("status", "unknown")
                        })

    # Check port usage
    for port in range(9100, 9115):
        result = subprocess.run(["lsof", "-i", f":{port}"],
                              capture_output=True)
        if result.returncode == 0:
            status["port_usage"].append(port)

    return status

if __name__ == "__main__":
    import json
    print(json.dumps(check_adw_status(), indent=2))
EOF

python monitor_adw.py
```

### 6.3 Backup & Recovery
```bash
# Backup ADW state
cat > backup_adw.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="backups/adw_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup agent states
cp -r agents/ $BACKUP_DIR/

# Backup specifications
cp -r specs/ $BACKUP_DIR/

# Backup app documentation
cp -r app_docs/ $BACKUP_DIR/

# Create manifest
cat > $BACKUP_DIR/manifest.json << JSON
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "worktrees": $(git worktree list --porcelain | jq -Rs '.')
}
JSON

echo "Backup created: $BACKUP_DIR"
EOF

chmod +x backup_adw.sh
```

---

## 📚 Key Learnings & Best Practices

### For Learning the ADW System

1. **Start Small**: Begin with simple chore tasks before complex features
2. **Review Generated Code**: Always review what agents produce
3. **Use Dry Runs**: Test with `--dry-run` flag initially
4. **Monitor Resource Usage**: Watch for orphaned worktrees and processes
5. **Incremental Adoption**: Don't enable ZTE (zero-touch) until confident

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port conflicts | Check `lsof -i :PORT` and kill processes |
| Worktree errors | Run `git worktree prune` |
| API rate limits | Implement delays between agent runs |
| Memory leaks | Regularly clean up `agents/` directory |
| Failed tests | Use `adw_test_iso.py` with `--debug` flag |

### Integration Tips

1. **GitHub First**: Ensure GitHub is properly configured before running agents
2. **API Keys**: Store securely, never commit to repository
3. **Model Selection**: Start with `base` model set, upgrade to `heavy` for complex tasks
4. **Parallel Execution**: Limit to 5 concurrent workflows initially
5. **Documentation**: Always run document phase for knowledge capture

---

## 🔄 Continuous Improvement

### Weekly Tasks
- [ ] Review agent-generated code quality
- [ ] Analyze ADW performance metrics
- [ ] Update command templates based on patterns
- [ ] Clean up old worktrees and agent states
- [ ] Backup ADW configurations and states

### Monthly Tasks
- [ ] Refine issue classification rules
- [ ] Optimize model selection criteria
- [ ] Update test coverage requirements
- [ ] Review and improve documentation templates
- [ ] Analyze cost vs productivity metrics

---

## 🆘 Support & Troubleshooting

### Debug Commands
```bash
# Check ADW system health
./adw_modules/health_check.sh

# View recent agent activity
tail -f agents/*/planner/raw_output.jsonl

# Check worktree status
git worktree list --verbose

# Monitor port usage
netstat -an | grep -E "9[12][0-9]{2}"

# Check API connectivity
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages \
     -H "anthropic-version: 2023-06-01"
```

### Emergency Recovery
```bash
# Kill all ADW processes
pkill -f "adw_"

# Clean up all worktrees
git worktree prune
rm -rf trees/*

# Reset agent states
rm -rf agents/*

# Clear ports
for port in {9100..9214}; do
  lsof -ti:$port | xargs kill -9 2>/dev/null
done
```

---

## ✅ Success Criteria

You'll know the ADW integration is successful when:

1. ✅ Can create GitHub issues and agents automatically pick them up
2. ✅ Agents successfully create isolated worktrees for parallel work
3. ✅ Code is generated, tested, and documented automatically
4. ✅ Pull requests are created without manual intervention
5. ✅ Memory layer captures and reuses learnings
6. ✅ Can run 3+ agents in parallel without conflicts
7. ✅ Server resources remain stable during agent execution
8. ✅ Documentation is automatically generated and useful

---

## 🎉 Next Steps After Success

1. **Scale Up**: Increase concurrent agent limit
2. **Add Projects**: Integrate Media Translation component
3. **Custom Agents**: Build domain-specific agents
4. **Optimize Costs**: Fine-tune model selection
5. **Production Deployment**: Enable ZTE for production
6. **Knowledge Graph**: Build comprehensive LiteRAG replacement with Mem0

---

**Remember**: This is a powerful system that can autonomously modify code and create pull requests. Always maintain proper access controls and review generated code before merging to main branches.

**Created**: 2024-10-21
**For**: Ozean Licht Ecosystem ADW Integration
**By**: Integration Assistant
**Status**: ACTIVE CHECKLIST 🚀