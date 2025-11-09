# AI Agent Instructions - Ozean Licht Ecosystem

Monorepo for two Austrian associations: **Kids Ascension** (kids-ascension.dev) - educational platform, **Ozean Licht** (ozean-licht.dev) - content platform.

**CRITICAL: TypeScript migration in progress** - See `CONTEXT_MAP_RESTRUCTURE_TEMP.md`

## Migration Warnings

❌ **DO NOT** use Python ADW scripts (`adws/adw_*.py`) or o-commands/a-commands (deprecated)
✅ **USE** Agent SDK (`@anthropic-ai/sdk`) + orchestrator_3_stream as foundation
✅ **TARGET:** Convert `adws/adw_modules/*.py` → `apps/orchestrator_3_stream/backend/modules/adw/*.ts`

## Infrastructure

**Server:** Hetzner AX42 (€50/mo) - AMD Ryzen 5, 64GB RAM, 2×512GB NVMe @ 138.201.139.25
**Orchestration:** Coolify (self-hosted PaaS) - http://coolify.ozean-licht.dev:8000
**Containers:** Docker + Docker Compose - all services containerized
**Storage:** MinIO (hot) → Cloudflare R2 (cold) → Stream (CDN)
**Databases:** PostgreSQL (multi-tenant) with connection pooling
**Monitoring:** Grafana (https://grafana.ozean-licht.dev) + Prometheus metrics

### Production Services
```
http://coolify.ozean-licht.dev:8000     # Coolify dashboard
http://n8n.ozean-licht.dev              # N8N automation
http://mem0.ozean-licht.dev             # Memory storage
https://grafana.ozean-licht.dev         # Monitoring
```

## Architecture

**Multi-Tenant DBs:** shared_users_db (auth), kids_ascension_db, ozean_licht_db, orchestrator_db
**ADW:** Git worktree isolation, ports 9100-9114 (backend), 9200-9214 (frontend), PostgreSQL state
**Monitoring:** Grafana dashboards at `tools/mcp-gateway/monitoring/grafana/dashboards/`

## MCP Gateway (Port 8100)

**11 services** - USE THESE instead of direct API calls

**Server (8):** postgres, mem0, cloudflare, github, n8n, minio, coolify, firecrawl
**Local (3):** playwright, shadcn, magicui

```bash
mcp-postgres [db] query "SQL"              # DB operations
mcp-mem0 remember|search "text"            # Memory ops
mcp-github create-pr|merge-pr [args]       # GitHub ops
mcp-minio upload|getUrl [bucket] [key]     # Storage ops
mcp-coolify deploy-application [id]        # Deploy ops
mcp-firecrawl scrape "url"                 # Web scraping
```

**Catalog:** `tools/mcp-gateway/config/mcp-catalog.json` (rate limits, token costs, all commands)

## Key Paths

```
apps/orchestrator_3_stream/  # MIGRATION TARGET - Agent SDK integration
apps/admin/                  # Admin dashboard (NextAuth + MCP)
apps/kids-ascension/         # Educational platform
apps/ozean-licht/            # Content platform
tools/mcp-gateway/           # MCP service (port 8100)
adws/                        # LEGACY - Python ADW (being migrated)
specs/                       # Architecture decisions
```

## Development

```bash
# Start services
pnpm --filter @ka/web dev                # Kids Ascension (3000)
pnpm --filter admin dev                  # Admin (9200)
cd tools/mcp-gateway && npm run dev      # MCP Gateway (8100)

# Tests
pnpm test                                # All tests
pnpm --filter @ka/web test:e2e           # E2E tests
```

## Docker Operations

```bash
# SSH to server (for agents with deployment permissions)
ssh -i ~/.ssh/ozean-automation root@138.201.139.25

# Docker commands
docker ps                              # List running containers
docker logs mcp-gateway -f             # View logs (follow)
docker logs --tail=100 mcp-gateway     # Last 100 lines
docker compose restart                 # Restart services
docker compose up -d                   # Start services detached
docker exec -it mcp-gateway sh         # Interactive shell

# Health checks
curl http://localhost:8100/health      # MCP Gateway health
curl http://localhost:9090/metrics     # Prometheus metrics
docker ps --format "{{.Names}}\t{{.Status}}"  # Service status
```

## Operational Hints

**Port Allocation:**
- 3000-3099: Local dev frontends
- 8000-8999: Infrastructure services (Coolify, MCP, etc.)
- 9100-9114: ADW worktree backends
- 9200-9214: ADW worktree frontends

**Deployment via Coolify:**
- Changes to main branch auto-deploy via Coolify webhooks
- Use `/mcp-coolify` commands for manual deployments
- Each app has separate Coolify application ID
- Check Coolify dashboard for build logs and status

**Git Worktree Management:**
```bash
git worktree list                      # List all worktrees
git worktree remove trees/{adw_id}     # Remove worktree
git worktree prune                     # Cleanup stale worktrees
lsof -i :9100-9114                     # Check backend ports
lsof -i :9200-9214                     # Check frontend ports
```

**Database Access:**
- Use MCP Gateway for queries (no direct psql needed)
- Connection pooling managed by MCP Gateway
- Each database is multi-tenant aware
- Always specify database name in mcp-postgres commands

**Environment Variables:**
- Main repo: `.env` file (not committed)
- Worktrees: `.ports.env` generated automatically
- Production: Managed via Coolify dashboard
- Never commit secrets or API keys

## Guidelines

1. **Migration:** Check status before modifying ADW code (see CONTEXT_MAP_RESTRUCTURE_TEMP.md)
2. **MCP Gateway:** Use for ALL external services (GitHub, Mem0, DBs, storage, deployments)
3. **Monorepo:** Use `pnpm --filter @scope/package` for package operations
4. **Worktrees:** Test ADW features in isolated worktrees, not main repo
5. **Documentation:** Document architectural decisions in specs/ directory
6. **Multi-tenant:** Always validate entity access in JWT tokens
7. **Authentication:** MCP has no auth from localhost, SSH key required for remote
8. **Docker:** All production services run in containers via Coolify
9. **Deployments:** Use Coolify MCP tools, not manual docker commands
10. **Secrets:** Never commit .env, credentials, or API keys to git
