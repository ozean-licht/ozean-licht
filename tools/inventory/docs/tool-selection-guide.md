# Tool Selection Guide

> **Decision Tree for Choosing Between MCP Services and Script-Based Tools**
>
> **Last Updated:** 2025-11-11
> **Version:** 1.0.0

---

## Quick Decision Flowchart

```
Need to use a tool?
│
├─ Is it simple CLI or REST API?
│  ├─ YES → Use Script (Tier 1/2) ✓ 3-5x faster
│  └─ NO  → Continue below
│
├─ Does it require complex authentication?
│  ├─ OAuth, GitHub App, JWT → Use MCP (Tier 3)
│  └─ Simple Bearer token → Use Script (Tier 2)
│
├─ Does it need connection pooling?
│  ├─ YES (Database, persistent connections) → Use MCP (Tier 3)
│  └─ NO  → Use Script (Tier 1/2)
│
├─ Is it stateful or requires session management?
│  ├─ YES → Use MCP (Tier 3)
│  └─ NO  → Use Script (Tier 1/2)
│
└─ Does it need protocol translation?
   ├─ YES → Use MCP (Tier 3)
   └─ NO  → Use Script (Tier 1/2)
```

---

## Three-Tier Architecture

### Tier 1: Native Scripts (Fastest)

**When to Use:**
- ✅ Tool has stable, well-documented CLI
- ✅ No complex authentication required
- ✅ Direct system access available
- ✅ Operation is one-shot or stateless
- ✅ Speed is critical

**Characteristics:**
- **Execution Time:** < 1s
- **Speedup:** 5x faster than MCP
- **Overhead:** None - direct CLI invocation
- **Debugging:** Transparent - see exact commands
- **Learning Curve:** Minimal - standard CLI tools

**Tools in Tier 1:**
- `docker.sh` - Container management
- `git.sh` - Version control operations
- `monitoring.sh` - Health checks and metrics
- `database.sh` - PostgreSQL utilities
- `ssh.sh` - Remote execution

**Example:**
```bash
# Tier 1: Direct Docker CLI (< 1s)
bash tools/scripts/docker.sh ps_containers

# vs MCP equivalent (2-5s)
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"docker.ps","id":"1"}'
```

---

### Tier 2: API Scripts (Fast)

**When to Use:**
- ✅ Tool has REST API with simple authentication
- ✅ State is managed server-side
- ✅ Lightweight HTTP wrapper is sufficient
- ✅ No connection pooling needed
- ✅ Want faster execution than MCP

**Characteristics:**
- **Execution Time:** 1-2s
- **Speedup:** 3x faster than MCP
- **Overhead:** Single HTTP request
- **Debugging:** Easy - inspect curl commands
- **Learning Curve:** Low - basic API knowledge

**Tools in Tier 2:**
- `coolify.sh` - Deployment management

**Example:**
```bash
# Tier 2: Coolify API script (1-2s)
bash tools/scripts/coolify.sh deploy_application 3

# vs MCP equivalent (3-5s)
# (MCP adds protocol overhead + authentication layer)
```

---

### Tier 3: MCP Services (Full Featured)

**When to Use:**
- ✅ Complex authentication (OAuth, GitHub App, JWT)
- ✅ Connection pooling required (databases)
- ✅ Stateful session management needed
- ✅ Protocol translation necessary
- ✅ Rate limiting and cost tracking essential
- ✅ Multi-step workflows with state

**Characteristics:**
- **Execution Time:** 2-10s
- **Features:** Full protocol support, auth, pooling
- **Overhead:** JSON-RPC + authentication + routing
- **Debugging:** Check MCP Gateway logs
- **Learning Curve:** Moderate - understand MCP protocol

**Tools in Tier 3:**
- `postgres` - Database with connection pooling
- `mem0` - Vector search and memory
- `cloudflare` - Multi-service CDN/DNS
- `github` - GitHub App authentication
- `n8n` - Workflow state management
- `minio` - S3 protocol + presigned URLs
- `firecrawl` - Complex web scraping
- `playwright` - Browser automation
- `shadcn` / `magicui` - Component generation

**Example:**
```bash
# Tier 3: PostgreSQL with connection pooling
# Use MCP for proper connection management
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "postgres",
      "database": "kids-ascension-db",
      "operation": "query",
      "sql": "SELECT * FROM users WHERE created_at > $1",
      "params": ["2025-01-01"]
    },
    "id": "1"
  }'
```

---

## Decision Matrix

| Criteria | Script (Tier 1/2) | MCP (Tier 3) |
|----------|-------------------|--------------|
| **Speed** | ✅ 3-5x faster | ⚠️ Baseline |
| **Simplicity** | ✅ Direct CLI/API | ⚠️ Protocol layer |
| **Transparency** | ✅ See exact commands | ⚠️ Abstracted |
| **Authentication** | ⚠️ Simple only | ✅ Complex (OAuth, JWT) |
| **Connection Pooling** | ❌ No support | ✅ Full support |
| **State Management** | ⚠️ Limited | ✅ Full support |
| **Rate Limiting** | ❌ Manual | ✅ Automatic |
| **Cost Tracking** | ❌ No tracking | ✅ Token costs tracked |
| **Protocol Translation** | ❌ No support | ✅ Full support |

---

## Use Case Examples

### Deployment Operations

**Scenario:** Deploy application to production

**Recommended:** Script (Tier 2)
```bash
# Fast and direct
bash tools/scripts/coolify.sh deploy_application 3

# Then check status
bash tools/scripts/coolify.sh get_application_status 3
```

**Why Script:**
- Simple REST API with Bearer token
- No connection pooling needed
- Fast execution (1-2s vs 3-5s)
- Transparent debugging

---

### Database Backup

**Scenario:** Backup Kids Ascension database

**Recommended:** Script (Tier 1)
```bash
# Direct pg_dump
bash tools/scripts/database.sh backup_database \
  kids_ascension_db \
  /backups/ka-$(date +%Y%m%d).sql
```

**Why Script:**
- Standard PostgreSQL CLI tool
- One-shot operation, no pooling needed
- Fast and reliable
- No authentication complexity

---

### Complex Database Query

**Scenario:** Run parameterized query across multiple tables

**Recommended:** MCP (Tier 3)
```bash
# Use MCP for connection pooling and safety
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "postgres",
      "database": "kids-ascension-db",
      "operation": "query",
      "sql": "SELECT u.*, COUNT(v.id) as video_count FROM users u LEFT JOIN video_progress v ON u.id = v.user_id WHERE u.created_at > $1 GROUP BY u.id LIMIT $2",
      "params": ["2025-01-01", 100]
    },
    "id": "1"
  }'
```

**Why MCP:**
- Connection pooling prevents exhaustion
- Parameterized queries prevent SQL injection
- Transaction management
- Automatic cleanup

---

### Container Management

**Scenario:** Check container health, restart if needed

**Recommended:** Script (Tier 1)
```bash
# Fast local operations
bash tools/scripts/docker.sh health_check mcp-gateway

# If unhealthy, restart
bash tools/scripts/docker.sh restart_container mcp-gateway
```

**Why Script:**
- Docker CLI is standard and fast
- No authentication needed for local access
- Transparent - see exact docker commands
- < 1s execution time

---

### GitHub PR Management

**Scenario:** Create pull request with automated checks

**Recommended:** MCP (Tier 3)
```bash
# Use MCP for GitHub App authentication
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "github",
      "operation": "create-pr",
      "title": "feat: Add new feature",
      "body": "Implementation details...",
      "base": "main",
      "head": "feature/new-feature"
    },
    "id": "1"
  }'
```

**Why MCP:**
- GitHub App requires JWT token management
- Installation ID handling
- Private key signing
- Rate limit tracking

---

### System Monitoring

**Scenario:** Check health of all services

**Recommended:** Script (Tier 1)
```bash
# Fast parallel health checks
bash tools/scripts/monitoring.sh health_check_all

# Get detailed metrics
bash tools/scripts/monitoring.sh resource_usage
```

**Why Script:**
- Simple HTTP health checks
- Parallel execution for speed
- No state management needed
- Clear, formatted output

---

## Migration Guide

### When to Migrate from MCP to Script

If you're currently using an MCP service, consider migrating to a script if:

1. **You're doing simple operations** - No complex auth or state needed
2. **Speed is important** - Need < 2s response times
3. **Debugging is difficult** - Want to see exact commands executed
4. **MCP overhead is noticeable** - Experiencing latency issues

**Example Migration:**
```bash
# Before: MCP for Coolify (3-5s)
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"coolify.deploy","params":{"appId":3},"id":"1"}'

# After: Script (1-2s)
bash tools/scripts/coolify.sh deploy_application 3
```

### When to Migrate from Script to MCP

Consider MCP if you encounter:

1. **Connection exhaustion** - Too many concurrent database connections
2. **Authentication complexity** - OAuth flows, token refreshing
3. **Rate limiting issues** - Need centralized rate management
4. **State requirements** - Multi-step workflows need state tracking

---

## Best Practices

### For Scripts (Tier 1/2)

✅ **Do:**
- Use for one-shot operations
- Leverage for fast, simple tasks
- Prefer when transparency is needed
- Use for local operations
- Implement proper error handling

❌ **Don't:**
- Use for operations requiring connection pooling
- Use for complex authentication flows
- Use when state management is critical
- Bypass security for convenience

### For MCP (Tier 3)

✅ **Do:**
- Use for complex authentication
- Use for connection pooling
- Use for stateful operations
- Use for rate-limited APIs
- Use for protocol translation

❌ **Don't:**
- Use for simple CLI operations
- Use when scripts would be faster
- Over-engineer simple tasks
- Ignore performance implications

---

## Performance Comparison

### Real-World Benchmarks

| Operation | Script Time | MCP Time | Speedup |
|-----------|-------------|----------|---------|
| List Docker containers | 0.3s | 2.1s | 7x |
| Deploy via Coolify | 1.2s | 4.3s | 3.6x |
| Check service health | 0.5s | 2.8s | 5.6x |
| Git status | 0.2s | N/A | Direct |
| Database backup | 3.5s | N/A | Direct |
| PostgreSQL query | N/A | 1.8s | Pooled |
| GitHub create PR | N/A | 3.2s | Auth |
| Mem0 vector search | N/A | 2.5s | Managed |

---

## Troubleshooting

### Script Issues

**Problem:** "Command not found"
```bash
# Solution: Check dependencies
command -v docker >/dev/null || echo "Install docker"
command -v jq >/dev/null || echo "Install jq"
```

**Problem:** Permission denied
```bash
# Solution: Make scripts executable
chmod +x tools/scripts/*.sh
```

**Problem:** Remote execution fails
```bash
# Solution: Verify SSH configuration
export SSH_HOST="138.201.139.25"
export SSH_KEY_PATH="~/.ssh/ozean-automation"
bash tools/scripts/ssh.sh test_connection
```

### MCP Issues

**Problem:** Connection timeout
```bash
# Solution: Check MCP Gateway health
curl http://localhost:8100/health

# Restart if needed
docker restart mcp-gateway
```

**Problem:** Authentication errors
```bash
# Solution: Verify environment variables
echo $COOLIFY_API_TOKEN
echo $GITHUB_APP_ID
```

---

## Summary

**Choose Scripts when:**
- Speed matters (3-5x faster)
- Operations are simple and stateless
- You want transparency and easy debugging
- No complex authentication required

**Choose MCP when:**
- Complex authentication (OAuth, GitHub App)
- Connection pooling required
- Stateful workflows needed
- Protocol translation necessary
- Rate limiting and cost tracking essential

**Remember:** This is additive, not exclusive. Use both as needed for optimal performance and capability.

---

**See Also:**
- [Tool Catalog](../tool-catalog.json) - Complete list of available tools
- [Script Development Guide](./script-development-guide.md) - Create new scripts
- [State Management](./state-management.md) - How state tracking works
- [Inventory README](../README.md) - System overview
