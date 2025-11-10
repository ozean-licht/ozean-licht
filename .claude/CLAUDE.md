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

## MCP Gateway (Port 8100)

**11 services** - Use these instead of direct API calls:

```bash
# Server services (8)
mcp-postgres [db] query "SQL"              # DB operations
mcp-mem0 remember|search "text"            # Institutional memory
mcp-github create-pr|merge-pr [args]       # GitHub operations
mcp-minio upload|getUrl [bucket] [key]     # Hot storage
mcp-cloudflare stream upload [path]        # CDN & cold storage
mcp-coolify deploy-application [id]        # Deployment
mcp-firecrawl scrape "url"                 # Web scraping
mcp-n8n trigger-workflow [id]              # Automation

# Local services (3)
mcp-playwright, mcp-shadcn, mcp-magicui    # Browser/UI tools
```

**Catalog:** `tools/mcp-gateway/config/mcp-catalog.json`

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
