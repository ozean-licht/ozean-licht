# Tool Inventory System

> **Version:** 1.0.0
> **Status:** Active
> **Last Updated:** 2025-11-11

Comprehensive tool catalog and state management for the Ozean Licht Ecosystem. Provides unified access to MCP services, script-based tools, and native utilities.

---

## Overview

The Tool Inventory System maintains a **three-tier architecture** for tool access:

| Tier | Type | Description | Use When |
|------|------|-------------|----------|
| **Tier 1** | Native Scripts | Direct CLI execution | Tool has stable CLI, no complex auth |
| **Tier 2** | API Scripts | Curl-based REST wrappers | Simple API with basic auth |
| **Tier 3** | MCP Services | Complex integrations | Connection pooling, OAuth, state management |

### Benefits

- **Performance:** 3-5x faster execution for script-based tools
- **Simplicity:** Self-documenting shell scripts vs MCP protocol
- **Flexibility:** Choose optimal tool based on context
- **Transparency:** Direct access shows exactly what's happening
- **Compatibility:** Additive approach - MCP services remain available

---

## Quick Start

### View Tool Catalog

```bash
# List all available tools
jq '.tools | keys' tools/inventory/tool-catalog.json

# Get tool details
jq '.tools.docker' tools/inventory/tool-catalog.json

# Filter by tier
jq '.tools | to_entries | map(select(.value.tier == "tier1-native"))' tools/inventory/tool-catalog.json

# Count tools by type
jq '.aggregates' tools/inventory/tool-catalog.json
```

### Execute Tools

```bash
# Tier 1: Native Scripts (fastest)
bash tools/scripts/docker.sh ps_containers
bash tools/scripts/git.sh status_enhanced
bash tools/scripts/monitoring.sh health_check_all

# Tier 2: API Scripts (fast)
bash tools/scripts/coolify.sh list_applications
bash tools/scripts/coolify.sh deploy_application 3

# Tier 3: MCP Services (when needed)
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{"service":"postgres","operation":"list-tables"},"id":"1"}'
```

### Check Tool Health

```bash
# View tool states
jq '.' tools/inventory/tool-state.json

# Check specific tool health
jq '.tools.docker' tools/inventory/tool-state.json

# Get execution history
jq '.tools.docker.execution_history | .[-5:]' tools/inventory/tool-state.json
```

---

## File Structure

```
tools/inventory/
├── tool-catalog.json          # Master tool catalog (19 tools)
├── tool-state.json            # Execution state and health tracking
├── README.md                  # This file
└── docs/
    ├── tool-selection-guide.md      # Decision tree for tool selection
    ├── script-development-guide.md  # Guidelines for creating scripts
    └── state-management.md          # State tracking system docs
```

---

## Tool Catalog Schema

### Tool Entry Structure

```json
{
  "toolName": {
    "name": "Display Name",
    "type": "mcp | script-native | script-api",
    "tier": "tier1-native | tier2-api | tier3-mcp",
    "description": "What the tool does",
    "location": "local | server",
    "version": "1.0.0",
    "status": "active | inactive | deprecated",
    "scriptPath": "path/to/script.sh",
    "dependencies": ["dep1", "dep2"],
    "capabilities": ["cap1", "cap2"],
    "commands": [
      {
        "command": "actual command syntax",
        "description": "What it does",
        "example": "concrete example",
        "parameters": {
          "paramName": {
            "type": "string | number | boolean",
            "required": true | false,
            "default": "value"
          }
        },
        "exitCodes": {
          "0": "Success",
          "1": "Error"
        }
      }
    ],
    "healthCheck": {
      "method": "http | cli",
      "endpoint": "url or command",
      "interval": 60
    },
    "performance": {
      "avgExecutionTime": "1-2s",
      "speedup": "3-5x faster than MCP"
    },
    "rationale": "Why this tier was chosen"
  }
}
```

---

## Tool State Schema

### State Entry Structure

```json
{
  "tools": {
    "toolName": {
      "health": {
        "status": "healthy | unhealthy | unknown",
        "lastCheck": "2025-11-11T12:00:00Z",
        "message": "Health check message",
        "consecutive_failures": 0
      },
      "execution_history": [
        {
          "timestamp": "2025-11-11T12:00:00Z",
          "command": "command executed",
          "exitCode": 0,
          "duration": 1234,
          "success": true,
          "error": null
        }
      ],
      "metrics": {
        "total_executions": 150,
        "successful_executions": 148,
        "failed_executions": 2,
        "avg_duration": 1200,
        "last_execution": "2025-11-11T12:00:00Z"
      }
    }
  },
  "metadata": {
    "totalExecutions": 1000,
    "lastCleanup": "2025-11-04T00:00:00Z"
  }
}
```

---

## Available Tools

### Tier 1: Native Scripts (5 tools)

**Fastest execution - Direct CLI access**

| Tool | Description | Primary Use |
|------|-------------|-------------|
| `docker` | Container management | ps, logs, stats, restart |
| `git` | Version control | status, commit, push |
| `monitoring` | Health checks | service health, metrics |
| `database` | PostgreSQL ops | backup, restore, migrations |
| `ssh` | Remote operations | exec, file transfer, tunnels |

### Tier 2: API Scripts (1 tool)

**Fast execution - Simple REST API wrappers**

| Tool | Description | Primary Use |
|------|-------------|-------------|
| `coolify` | Deployment management | deploy, restart, logs |

### Tier 3: MCP Services (11 tools)

**Complex integrations - Full protocol support**

| Tool | Description | Primary Use |
|------|-------------|-------------|
| `postgres` | Database queries | Multi-tenant DB access |
| `mem0` | Persistent memory | Vector search, context |
| `cloudflare` | CDN & DNS | Stream, DNS, Workers |
| `github` | Code management | PRs, issues, workflows |
| `n8n` | Automation | Workflow execution |
| `minio` | Object storage | S3 operations |
| `coolify-mcp` | Deployment (MCP) | Available via MCP too |
| `firecrawl` | Web scraping | Content extraction |
| `playwright` | Browser automation | Testing, screenshots |
| `shadcn` | UI components | Component generation |
| `magicui` | Enhanced UI | Animated components |

---

## Usage Guidelines

### When to Use Scripts vs MCP

**Use Scripts (Tier 1/2) when:**
- ✅ Operation is simple and one-shot
- ✅ Tool has stable CLI or REST API
- ✅ No complex authentication required
- ✅ Speed is important
- ✅ You want transparency (see exact commands)

**Use MCP (Tier 3) when:**
- ✅ Complex authentication (OAuth, GitHub App, JWT)
- ✅ Connection pooling required
- ✅ Stateful session management needed
- ✅ Protocol translation necessary
- ✅ Rate limiting and cost tracking essential
- ✅ Multi-step workflows with state

### Performance Expectations

| Tier | Avg Execution | Speedup | Example |
|------|--------------|---------|---------|
| Tier 1 | < 1s | 5x | `docker ps` |
| Tier 2 | 1-2s | 3x | Coolify API call |
| Tier 3 | 2-10s | baseline | MCP protocol + auth |

---

## State Management

### Automatic State Updates

All script-based tools automatically update state in `tool-state.json`:

- **Health Status:** Updated on each execution
- **Execution History:** Last 50 executions retained
- **Metrics:** Aggregated statistics
- **Cleanup:** Entries older than 7 days pruned

### Manual State Queries

```bash
# Source utilities
source tools/scripts/utils.sh

# Get tool state
get_tool_state "docker"

# Update tool state
update_tool_state "docker" "healthy" '{"executions": 10}'

# Check tool health
check_tool_health "docker"
```

---

## Health Monitoring

### Automated Health Checks

Health checks run at configured intervals (default: 60s for services, 300s for CLI tools).

```bash
# Run health check for all tools
bash tools/scripts/monitoring.sh health_check_all

# Check specific tool
bash tools/scripts/monitoring.sh health_check_service mcp-gateway
```

### Health Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| `healthy` | Tool is operational | None |
| `unhealthy` | Tool is failing | Investigate logs |
| `unknown` | Health check not run yet | Run check |
| `degraded` | Partial functionality | Monitor closely |

---

## Examples

### Example 1: Deploy Application

```bash
# Option 1: Script (Tier 2) - Fast
bash tools/scripts/coolify.sh deploy_application 3

# Option 2: MCP (Tier 3) - Full protocol
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "coolify",
      "operation": "deploy-application",
      "appId": 3
    },
    "id": "1"
  }'
```

### Example 2: Check System Health

```bash
# Quick health check (Tier 1)
bash tools/scripts/monitoring.sh health_check_all

# Detailed with metrics
bash tools/scripts/monitoring.sh resource_usage
bash tools/scripts/docker.sh stats_containers
```

### Example 3: Database Operations

```bash
# Backup database (Tier 1)
bash tools/scripts/database.sh backup_database \
  kids_ascension_db \
  /backups/ka-$(date +%Y%m%d).sql

# Complex query (Tier 3 - MCP)
# Use MCP for connection pooling and parameterized queries
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "postgres",
      "database": "kids-ascension-db",
      "operation": "query",
      "sql": "SELECT * FROM users WHERE created_at > $1 LIMIT 100",
      "params": ["2025-01-01"]
    },
    "id": "1"
  }'
```

---

## Dependencies

### Required Utilities

All scripts require these utilities:

```bash
# Check dependencies
command -v jq >/dev/null || echo "Install: sudo apt install jq"
command -v curl >/dev/null || echo "Install: sudo apt install curl"
command -v docker >/dev/null || echo "Install: docker.io"
command -v ssh >/dev/null || echo "Install: openssh-client"
command -v git >/dev/null || echo "Install: git"
command -v psql >/dev/null || echo "Install: postgresql-client"
```

### Environment Variables

```bash
# Coolify API
export COOLIFY_API_URL="http://coolify.ozean-licht.dev:8000/api/v1"
export COOLIFY_API_TOKEN="your_token_here"

# SSH (for remote operations)
export SSH_KEY_PATH="$HOME/.ssh/ozean-automation"
export SSH_HOST="138.201.139.25"
export SSH_USER="root"

# Database connections
export POSTGRES_KA_URL="postgresql://..."
export POSTGRES_OL_URL="postgresql://..."
```

---

## Troubleshooting

### Script Not Found

```bash
# Ensure scripts are executable
chmod +x tools/scripts/*.sh

# Check script path
ls -la tools/scripts/coolify.sh
```

### State File Locked

```bash
# If state file is locked (rare), wait 1s and retry
# Lock is automatically released after operation

# Check for stale locks
find tools/inventory -name "*.lock" -mmin +5 -delete
```

### Health Check Failing

```bash
# View recent errors
jq '.tools.docker.execution_history | .[-5:]' tools/inventory/tool-state.json

# Run health check manually
bash tools/scripts/monitoring.sh health_check_service docker
```

### Permission Denied

```bash
# For remote operations, ensure SSH key is set up
ssh -i ~/.ssh/ozean-automation root@138.201.139.25 echo "Connection OK"

# For Docker operations, ensure user is in docker group
sudo usermod -aG docker $USER
```

---

## Maintenance

### Cleanup Old State

```bash
# Manual cleanup (removes entries >7 days old)
jq 'del(.tools[].execution_history[] | select(.timestamp < (now - 604800 | strftime("%Y-%m-%dT%H:%M:%SZ"))))' \
  tools/inventory/tool-state.json > /tmp/state.json && \
  mv /tmp/state.json tools/inventory/tool-state.json
```

### Validate Catalog

```bash
# Check JSON validity
jq empty tools/inventory/tool-catalog.json && echo "✅ Catalog is valid"

# Check for required fields
jq '.tools | to_entries | map(select(.value.type == null))' tools/inventory/tool-catalog.json
```

### Add New Tool

1. Add entry to `tool-catalog.json`
2. Create script in `tools/scripts/` if needed
3. Test script execution
4. Update documentation
5. Commit changes

---

## Security Considerations

- **API Tokens:** Store in environment variables only, never commit to git
- **SSH Keys:** Use dedicated automation key with limited permissions
- **State File:** Permissions set to 600 (owner read/write only)
- **Remote Execution:** All commands logged in state for audit trail
- **Sensitive Data:** Never logged in state or script output

---

## Performance Monitoring

### Track Tool Performance

```bash
# View metrics for all tools
jq '.tools | to_entries | map({tool: .key, executions: .value.metrics.total_executions, avg_duration: .value.metrics.avg_duration})' \
  tools/inventory/tool-state.json

# Compare script vs MCP performance
jq '.tools | to_entries | map(select(.value.tier == "tier1-native")) | map({tool: .key, avg_duration: .value.metrics.avg_duration})' \
  tools/inventory/tool-state.json
```

---

## Migration from MCP

This system is **additive, not replacive**:

- ✅ All existing MCP services remain operational
- ✅ Scripts provide alternative access path
- ✅ Choose optimal tool based on context
- ✅ No breaking changes to existing workflows
- ✅ Gradual adoption of script-based tools

---

## Future Enhancements

1. Auto-generate tool catalog from script annotations
2. Tool usage analytics and recommendations
3. Automatic script vs MCP routing based on performance
4. Tool dependency graph visualization
5. Distributed state management (Redis/PostgreSQL)
6. Tool versioning and compatibility checks
7. Generated TypeScript/Python clients for scripts
8. Web UI for tool catalog exploration

---

## References

- **MCP Catalog:** `tools/mcp-gateway/config/mcp-catalog.json`
- **MCP Gateway README:** `tools/mcp-gateway/README.md`
- **Tool Selection Guide:** `tools/inventory/docs/tool-selection-guide.md`
- **Script Development Guide:** `tools/inventory/docs/script-development-guide.md`
- **State Management:** `tools/inventory/docs/state-management.md`

---

## Support

For questions or issues:
1. Check the tool catalog: `jq '.tools' tools/inventory/tool-catalog.json`
2. Review execution history: `jq '.tools.TOOLNAME.execution_history' tools/inventory/tool-state.json`
3. Run health check: `bash tools/scripts/monitoring.sh health_check_service TOOLNAME`
4. Check script source for inline documentation

---

**Last Updated:** 2025-11-11
**Maintainer:** Ozean Licht Infrastructure Team
**Status:** ✅ Production Ready (Phase 1 Complete)
