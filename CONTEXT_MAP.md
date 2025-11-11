# Context Map - Ozean Licht Ecosystem

> **Minimal navigation guide for AI agents**
>
> Two Austrian associations sharing infrastructure: Kids Ascension (educational) + Ozean Licht (content platform)

---

## Current Status & Roadmap

**Phase 1 (Current):** 🚀 **Admin Dashboard Deployment**
- Deploy admin dashboard to production via Coolify
- Establish MCP Gateway integration patterns
- Validate NextAuth authentication flow

**Phase 2:** 📦 **Ozean Licht Migration**
- Migrate `ozean-licht_OLD/` to megarepo structure
- Integrate with shared infrastructure
- Database schema migration

**Phase 3:** 📦 **Kids Ascension Migration**
- Migrate `kids-ascension_OLD/` to megarepo structure
- Integrate with shared infrastructure
- Database schema migration

**Phase 4:** 🔗 **Platform Integration**
- Connect Admin Dashboard to Kids Ascension
- Connect Admin Dashboard to Ozean Licht
- Unified authentication and authorization

---

## Entry Points

### 1. Apps (User-Facing Applications)

| App | Purpose | Port | Status |
|-----|---------|------|--------|
| **`apps/admin/`** | **Admin dashboard (NextAuth + MCP)** | **9200** | **🚀 Phase 1 - Deployment** |
| `apps/kids-ascension/` | Educational video platform (in megarepo) | 3000 | Active |
| `apps/ozean-licht/` | Content platform (in megarepo) | 3001 | Foundation |

**Migration Sources:**
- `apps/ozean-licht_OLD/` → Phase 2 migration target
- `apps/kids-ascension_OLD/` → Phase 3 migration target

**Start Development:**
```bash
pnpm --filter admin dev               # Admin dashboard (current focus)
pnpm --filter @ka/web dev              # Kids Ascension
cd tools/mcp-gateway && npm run dev    # MCP Gateway (8100)
```

---

### 2. Tool Inventory - Three-Tier Architecture

**19 Available Tools** across 3 tiers for optimal performance

**Choose the right tool tier:**
- **Tier 1 (Native Scripts):** 5x faster, direct CLI - Use for simple operations
- **Tier 2 (API Scripts):** 3x faster, REST wrappers - Use for simple APIs
- **Tier 3 (MCP Services):** Full featured - Use for complex auth/state

#### Tier 1: Native Scripts (Fastest - < 1s)

| Tool | Purpose | Example Command |
|------|---------|-----------------|
| **docker** | Container management | `bash tools/scripts/docker.sh ps_containers`<br>`bash tools/scripts/docker.sh logs_container mcp-gateway 100` |
| **git** | Version control | `bash tools/scripts/git.sh status_enhanced`<br>`bash tools/scripts/git.sh commit_with_state "feat: Add feature"` |
| **monitoring** | Health checks & metrics | `bash tools/scripts/monitoring.sh health_check_all`<br>`bash tools/scripts/monitoring.sh resource_usage` |
| **database** | PostgreSQL utilities | `bash tools/scripts/database.sh backup_database kids_ascension_db /backups/ka.sql`<br>`bash tools/scripts/database.sh run_migrations admin` |
| **ssh** | Remote operations | `bash tools/scripts/ssh.sh exec_remote "docker ps"`<br>`bash tools/scripts/ssh.sh file_upload ./config.json /opt/config.json` |

#### Tier 2: API Scripts (Fast - 1-2s)

| Tool | Purpose | Example Command |
|------|---------|-----------------|
| **coolify** | Deployment management | `bash tools/scripts/coolify.sh deploy_application 3`<br>`bash tools/scripts/coolify.sh get_application_status 3` |

#### Tier 3: MCP Services (Full Featured - 2-10s)

| Service | Purpose | Example Command |
|---------|---------|-----------------|
| **postgres** | Multi-tenant databases with pooling | `/mcp-postgres kids-ascension-db query "SELECT * FROM videos LIMIT 10"` |
| **mem0** | Institutional memory (vector search) | `/mcp-mem0 remember "Pattern: Use connection pooling"`<br>`/mcp-mem0 search "deployment patterns"` |
| **github** | PR/issue management (GitHub App) | `/mcp-github create-pr "title" "body"`<br>`/mcp-github merge-pr 123` |
| **minio** | S3-compatible storage | `/mcp-minio upload bucket key contentType`<br>`/mcp-minio getUrl bucket key` |
| **cloudflare** | Stream CDN + R2 storage | `/mcp-cloudflare stream upload /path/video.mp4` |
| **n8n** | Workflow automation | `/mcp-n8n execute workflow_id {data}` |
| **firecrawl** | Web scraping | `/mcp-firecrawl scrape "https://example.com"` |
| **playwright** | Browser automation (local) | `/mcp-playwright navigate url` |
| **shadcn** / **magicui** | UI components (local) | `/mcp-shadcn add button` |

**Tool Selection:**
- Use Scripts (Tier 1/2) when: Simple operations, speed matters, want transparency
- Use MCP (Tier 3) when: Complex auth, connection pooling, state management, protocol translation

**Catalogs:**
- `tools/inventory/tool-catalog.json` - Master catalog (19 tools)
- `tools/inventory/docs/tool-selection-guide.md` - Decision tree
- `tools/mcp-gateway/config/mcp-catalog.json` - MCP-specific configs

---

### 3. Infrastructure Tools

| Tool | Location | Purpose |
|------|----------|---------|
| **Tool Inventory** | `tools/inventory/` | Master catalog + script-based tools (19 tools) |
| **MCP Gateway** | `tools/mcp-gateway/` | MCP service interface (11 handlers) |
| **Coolify** | `tools/coolify/` | Self-hosted PaaS configs |
| **Docker** | `tools/docker/` | Container orchestration |
| **Automation** | `tools/automation/` | N8N workflows |

**Production Access:**
```bash
# Coolify Dashboard
http://coolify.ozean-licht.dev:8000

# Grafana Monitoring
https://grafana.ozean-licht.dev

# MCP Gateway Health
curl http://localhost:8100/health
```

---

### 4. Autonomous Development Workflows (ADW)

**Status:** Background system - Python-based automation in `adws/` directory

**Quick Reference:**
```bash
cd adws/
uv run adw_sdlc_iso.py 123              # Complete SDLC workflow
```

See `adws/README.md` for full documentation.

---

## Database Architecture

**Multi-Tenant PostgreSQL** (access via MCP Gateway):

| Database | Purpose | Access |
|----------|---------|--------|
| `shared_users_db` | Unified authentication | `/mcp-postgres shared-users-db query "..."` |
| `kids_ascension_db` | Educational content | `/mcp-postgres kids-ascension-db query "..."` |
| `ozean_licht_db` | Community/courses | `/mcp-postgres ozean-licht-db query "..."` |
| `orchestrator_db` | ADW state & worktrees | `/mcp-postgres orchestrator-db query "..."` |

**Connection Pooling**: 2-10 connections per database managed by MCP Gateway

---

## Storage Architecture

**Three-Tier System:**

1. **MinIO (Hot)** - Staging before moderation (~3000 MB/s local SSD)
2. **Cloudflare R2 (Cold)** - Permanent archive ($0.015/GB/month, zero egress)
3. **Cloudflare Stream (CDN)** - Video delivery (adaptive bitrate, global edge)

**Flow:** Upload → MinIO → Approval → R2 (original) + Stream (transcoded) → Users

---

## Key Files for Agents

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Engineering rules & guidelines |
| `README.md` | Quick start & overview |
| `tools/mcp-gateway/config/mcp-catalog.json` | Complete MCP service catalog (11 services) |
| `apps/admin/README.md` | Admin dashboard documentation |
| `apps/admin/app_docs/` | Admin feature specifications |
| `tools/coolify/` | Deployment configurations |
| `docs/architecture.md` | Complete system architecture (2900+ lines) |
| `.claude/commands/*.md` | Slash commands for development workflows |

---

## Multi-Root Workspace

**Recommended**: Open `ozean-licht-ecosystem.code-workspace` in VS Code

**Benefits:**
- ✅ Access all apps and tools simultaneously
- ✅ All slash commands discoverable across contexts
- ✅ Unified navigation across megarepo

**Setting:** `"claude.commands.scanWorkspace": true` enables command discovery across all folders

---

## Quick Reference

### Development Commands
```bash
# Install dependencies
pnpm install

# Start apps
pnpm --filter admin dev                # Admin (9200)
pnpm --filter @ka/web dev               # Kids Ascension (3000)

# Database migrations
pnpm --filter @ka/api prisma migrate dev

# Tests
pnpm test                               # All tests
pnpm --filter @ka/web test:e2e          # E2E tests
```

### Infrastructure Commands
```bash
# Docker operations
docker ps                               # List containers
docker logs mcp-gateway -f              # Follow logs
docker compose restart                  # Restart services

# Health checks
curl http://localhost:8100/health       # MCP Gateway
curl http://localhost:9090/metrics      # Prometheus

# Git worktrees
git worktree list                       # List ADW worktrees
git worktree remove trees/{adw_id}      # Clean up
```

---

## Infrastructure

**Server:** Hetzner AX42 (€50/month) @ 138.201.139.25
- AMD Ryzen 5, 64GB RAM, 2×512GB NVMe
- Docker + Coolify orchestration

**Monitoring:**
- Grafana: https://grafana.ozean-licht.dev
- Prometheus metrics: Port 9090
- Health checks: `/health` endpoints

---

## Navigation Philosophy

**For Agents:**
1. **Start here** - This context map provides entry points
2. **Check current phase** - Focus on Phase 1 (Admin Dashboard deployment)
3. **Use MCP Gateway** - For all external service calls (11 services available)
4. **Use Glob/Grep** - For specific file searches within apps
5. **Read key files** - CLAUDE.md for rules, app READMEs for details

**Current Focus Areas:**
- `apps/admin/` - Admin dashboard deployment and integration
- `tools/mcp-gateway/` - Service integration patterns
- `tools/coolify/` - Deployment configurations

---

**Last Updated:** 2025-11-09
**Status:** Phase 1 - Admin Dashboard Deployment
**Maintainer:** Ozean Licht Team + Autonomous Agents
