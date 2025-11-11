# AI Agent Instructions - Ozean Licht Ecosystem

Monorepo for two Austrian associations: **Kids Ascension** (kids-ascension.dev) - educational platform, **Ozean Licht** (ozean-licht.dev) - content platform.

## Current Focus: Phase 1 - Admin Dashboard Deployment

**Priority:** Deploy admin dashboard to production via Coolify
- Admin dashboard: `apps/admin/` (NextAuth + MCP integration)
- Establish MCP Gateway patterns
- Validate authentication flow

**Migration Note:** Orchestrator system development paused until Phase 1 complete. Focus on admin dashboard first.

## Infrastructure Essentials

**Server:** Hetzner AX42 @ 138.201.139.25 (64GB RAM, 2×512GB NVMe)
**Orchestration:** Coolify - http://coolify.ozean-licht.dev:8000
**Monitoring:** Grafana - https://grafana.ozean-licht.dev
**Databases:** PostgreSQL multi-tenant (shared_users_db, kids_ascension_db, ozean_licht_db)
**Storage:** MinIO (hot) → Cloudflare R2 (cold) → Stream (CDN)

## Tool Selection - Progressive Disclosure System

**54+ commands** organized in 6 categories using progressive disclosure. Reduces context usage by 85%.

### Smart Discovery (Start Here)

**Intent Router** - Natural language to command mapping:
```bash
bash tools/what.sh "deploy application"
bash tools/what.sh "check system health"
bash tools/what.sh "backup database"
bash tools/what.sh "view container logs"
```

**Category Browser** - Explore all tool categories:
```bash
bash tools/discover.sh  # Shows 6 main categories
```

**Learning Mode** - Educational explanations:
```bash
bash tools/learn.sh "is mcp running"
bash tools/learn.sh "deploy vs restart"
```

### Six Tool Categories

**1. Deployment** (Coolify operations):
```bash
bash tools/deployment/list.sh          # List commands
bash tools/deployment/deploy.sh 3      # Deploy app
bash tools/deployment/status.sh 3      # Check status
bash tools/deployment/logs.sh 3 100    # View logs
bash tools/deployment/health.sh        # API health
```

**2. Containers** (Docker operations):
```bash
bash tools/containers/list.sh             # List commands
bash tools/containers/ps.sh               # List containers
bash tools/containers/logs.sh mcp-gateway 100  # View logs
bash tools/containers/restart.sh mcp-gateway   # Restart
bash tools/containers/stats.sh            # Resource usage
```

**3. Monitoring** (Health & metrics):
```bash
bash tools/monitoring/list.sh          # List commands
bash tools/monitoring/health-all.sh    # Check all services
bash tools/monitoring/resources.sh     # System resources
bash tools/monitoring/connectivity.sh  # Network tests
```

**4. Database** (PostgreSQL operations):
```bash
bash tools/database/list.sh            # List commands
bash tools/database/backup.sh kids_ascension_db /backups/ka.sql
bash tools/database/restore.sh kids_ascension_db /backups/ka.sql
bash tools/database/size.sh kids_ascension_db
```

**5. Git** (Version control):
```bash
bash tools/git/list.sh                 # List commands
bash tools/git/status.sh               # Working tree status
bash tools/git/commit.sh "feat: message"  # Commit changes
bash tools/git/push.sh                 # Push to remote
```

**6. Remote** (SSH operations):
```bash
bash tools/remote/list.sh              # List commands
bash tools/remote/exec.sh "docker ps"  # Execute command
bash tools/remote/upload.sh ./file /opt/file  # Upload file
bash tools/remote/test.sh              # Test connection
```

### Explain Mode

Every command supports `--explain` flag for detailed information:
```bash
bash tools/deployment/deploy.sh --explain
bash tools/containers/logs.sh --explain
bash tools/database/backup.sh --explain
```

### Legacy Scripts (Backwards Compatibility)

Old monolithic scripts still work but show deprecation notices:
```bash
bash tools/scripts/coolify.sh deploy_application 3
bash tools/scripts/docker.sh ps_containers
bash tools/scripts/monitoring.sh health_check_all
```

### Tier 2: API Scripts (Fast - 1-2s, 3x speedup)
**Use for:** Simple REST APIs with basic auth

```bash
# Coolify deployment
bash tools/scripts/coolify.sh deploy_application 3
bash tools/scripts/coolify.sh get_application_status 3
bash tools/scripts/coolify.sh list_applications
```

### Tier 3: MCP Services (Full Featured - 2-10s)
**Use for:** Complex auth, connection pooling, state management

```bash
# Database with connection pooling
mcp-postgres [db] query "SQL"

# Institutional memory with vector search
mcp-mem0 remember|search "text"

# GitHub App authentication
mcp-github create-pr|merge-pr [args]

# S3-compatible storage
mcp-minio upload|getUrl [bucket] [key]

# Multi-service CDN
mcp-cloudflare stream upload [path]

# Workflow state management
mcp-n8n trigger-workflow [id]

# Complex scraping
mcp-firecrawl scrape "url"

# Browser automation (local)
mcp-playwright, mcp-shadcn, mcp-magicui
```

### Decision Rules for AI Agents

**Use Scripts (Tier 1/2) when:**
- ✅ Operation is simple and one-shot
- ✅ Speed is important (< 2s required)
- ✅ No complex authentication needed
- ✅ Want transparency (see exact commands)
- ✅ Tool has stable CLI or simple REST API

**Use MCP (Tier 3) when:**
- ✅ Complex authentication (OAuth, GitHub App, JWT)
- ✅ Connection pooling required (databases)
- ✅ Stateful session management needed
- ✅ Protocol translation necessary
- ✅ Rate limiting and cost tracking essential

**Catalogs:**
- `tools/inventory/tool-catalog.json` - Master catalog (19 tools)
- `tools/inventory/docs/tool-selection-guide.md` - Complete decision tree
- `tools/mcp-gateway/config/mcp-catalog.json` - MCP-specific configs

## Memory & Pattern Recognition

Use Mem0 to build institutional memory. Save valuable patterns to reduce friction in future workflows.

**7. Memory** (Institutional memory):
```bash
bash tools/memory/list.sh                     # List commands
bash tools/memory/save.sh "content"           # Save pattern
bash tools/memory/search.sh "query"           # Search memories
bash tools/memory/patterns.sh --category=pattern  # List patterns
bash tools/memory/health.sh                   # Check service
```

### When to Save Memories

**Save a memory when you:**
- ✅ Solve a non-trivial problem that could recur
- ✅ Make an architectural decision with important trade-offs
- ✅ Discover a useful code pattern or implementation approach
- ✅ Resolve an error that wasn't immediately obvious
- ✅ Complete a complex workflow that worked well
- ✅ Learn something about the codebase structure

**Don't save when:**
- ❌ Following standard documented procedures
- ❌ Making trivial changes (typo fixes, formatting)
- ❌ Information already in documentation
- ❌ One-off, context-specific solutions

### How to Save Memories

**Quick Save (Recommended):**
```bash
# Save with auto-categorization
bash tools/memory/save.sh "Use connection pooling for database queries to avoid timeout errors"

# Save with specific category
bash tools/memory/save.sh "Admin dashboard uses NextAuth for authentication" --category=decision

# Save a pattern
bash tools/memory/save.sh "Pattern: Use progressive disclosure to reduce context usage by 85%" --category=pattern
```

**Structured Save (For Complex Learnings):**
```bash
# Use pattern templates from tools/memory/PATTERNS.md
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: MCP Gateway container failing health checks
Symptoms: 500 errors on /health endpoint, container restarts
Root Cause: PostgreSQL connection pool exhausted
Solution: Increased DB_POOL_MAX from 10 to 20 in .env
Prevention: Monitor pool metrics at /metrics endpoint
Files: tools/mcp-gateway/.env, tools/mcp-gateway/src/config/environment.ts
EOF
)" --category=solution
```

### How to Query Memories

**Before starting work, search for relevant patterns:**
```bash
# Semantic search
bash tools/memory/search.sh "database connection issues"
bash tools/memory/search.sh "authentication implementation"

# List patterns by category
bash tools/memory/patterns.sh --category=pattern
bash tools/memory/patterns.sh --category=solution

# Get all memories for current context
bash tools/memory/get.sh agent_claude_code
```

### Memory Best Practices

1. **Be Specific**: Include concrete details (file paths, error messages, tool versions)
2. **Add Context**: Explain when/why this matters
3. **Link Related Info**: Reference related patterns, files, or tools
4. **Use Categories**: Proper categorization improves retrieval
5. **Update Don't Duplicate**: Search first, update existing memories when appropriate
6. **Quality Over Quantity**: One good memory > five vague ones

**Pattern Categories:**
- `pattern` - Reusable implementation approaches
- `decision` - Architecture and design decisions
- `solution` - Problem-solution pairs for common issues
- `error` - Error patterns and their resolutions
- `workflow` - Successful workflow sequences

## Development Commands

```bash
# Start services (Phase 1 focus)
pnpm --filter admin dev                    # Admin dashboard (port 9200)
cd tools/mcp-gateway && npm run dev        # MCP Gateway (port 8100)

# Other apps (Phase 2+)
pnpm --filter @ka/web dev                  # Kids Ascension (port 3000)
pnpm --filter @ol/web dev                  # Ozean Licht (port 3001)

# Tests
pnpm test                                  # All tests
pnpm --filter admin test                   # Admin tests only
```

## Key Paths

```
apps/admin/          # PHASE 1: Admin dashboard (current focus)
apps/admin/app_docs/ # Admin feature specifications
tools/mcp-gateway/   # MCP service integration
tools/coolify/       # Deployment configs
specs/               # Architecture decisions
CONTEXT_MAP.md       # Navigation guide (read first!)
```

## Guidelines

1. **Phase 1 Focus:** Prioritize admin dashboard deployment over other features
2. **MCP Gateway:** Use for ALL external services (never direct API calls)
3. **Context Map:** Check `CONTEXT_MAP.md` for navigation before searching
4. **Deployments:** Use Coolify MCP tools, check dashboard for build status
5. **Multi-tenant:** Always validate entity access in JWT tokens
6. **Monorepo:** Use `pnpm --filter <package>` for package operations
7. **Secrets:** Never commit .env, credentials, or API keys to git
