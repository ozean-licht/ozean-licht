# Ozean Licht Ecosystem

> Megarepo for two Austrian associations: Ozean Licht Akademie (spiritual e-learning) + Kids Ascension (free children's education)

## Quick Nav

**Agent Config:** `.claude/CLAUDE.md` | **Apps:** `apps/` | **Tools:** `tools/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Start development | `pnpm install` | Install deps → `pnpm --filter <app> dev` → Open localhost |
| Deploy to production | `tools/deployment/` | Check status → Deploy → Verify health |
| Add shared component | `shared/ui/` | Create component → Add story → Export from index |
| Run MCP service | `tools/mcp-gateway/` | `npm run dev` → Call `/mcp/*` endpoints |
| Check system health | `tools/monitoring/` | `bash tools/monitoring/health-all.sh` |
| Understand agent setup | `.claude/CLAUDE.md` | Read rules → Check commands → Use tools |

## Structure

```
.
├── apps/                    # Applications [→](./apps/)
│   ├── admin/               # Admin dashboard (NextAuth + RBAC) [→](./apps/admin/)
│   ├── ozean-licht/         # Main platform (Next.js 14) [→](./apps/ozean-licht/)
│   ├── kids-ascension/      # Educational platform [→](./apps/kids-ascension/)
│   ├── storybook/           # Component documentation [→](./apps/storybook/)
│   └── orchestrator_ts/     # Agent orchestration (paused)
├── shared/                  # Shared libraries [→](./shared/)
│   ├── ui/                  # React components (@ozean-licht/shared-ui)
│   ├── assets/              # Logos, fonts, branding
│   └── database/            # Multi-tenant PostgreSQL utilities
├── tools/                   # Progressive disclosure tool system [→](./tools/)
│   ├── mcp-gateway/         # MCP service interface (port 8100)
│   ├── deployment/          # Coolify operations
│   ├── containers/          # Docker management
│   ├── monitoring/          # Health & metrics
│   └── memory/              # Institutional memory (Mem0)
├── .claude/                 # Agent configuration
│   ├── CLAUDE.md            # Agent instructions
│   ├── commands/            # Slash commands
│   └── agents/              # Sub-agent definitions
├── ai_docs/                 # AI documentation cache
├── specs/                   # Architecture decisions
└── docs/                    # Human documentation
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `.claude/CLAUDE.md` | AI agent instructions, tool selection rules, development guidelines | ●●● |
| `package.json` | Root workspace dependencies, shared dev tooling (React, Radix, Storybook) | ●●● |
| `pnpm-workspace.yaml` | Workspace config: `apps/*`, `shared/*`, `tools/*` | ●●● |
| `design-system.md` | Design tokens: turquoise branding, glass morphism, typography | ●● |
| `example.env` | Environment template for all services | ●● |
| `.mcp.json` | MCP server configuration for Claude Code | ●● |
| `vitest.config.ts` | Root test configuration | ● |

## Needs Deeper Mapping

- [x] `apps/admin/` — 16 dirs, Phase 1 focus, NextAuth + RBAC + MCP client
- [x] `apps/ozean-licht/` — 13 dirs, main platform, see `docs/blueprint.md`
- [x] `tools/` — 18 items, progressive disclosure system (54+ commands)
- [x] `tools/mcp-gateway/` — MCP service handlers (11 services)
- [x] `shared/ui/` — Shared React component library
- [x] `shared/assets/` — Branding and logo assets
- [x] `shared/database/` — Multi-tenant PostgreSQL utilities
- [ ] `.claude/` — Agent config, commands, hooks, skills

## Infrastructure

| Service | URL | Purpose |
|---------|-----|---------|
| Coolify | http://coolify.ozean-licht.dev:8000 | Deployment orchestration |
| Grafana | https://grafana.ozean-licht.dev | Monitoring dashboards |
| MCP Gateway | localhost:8100 | Service proxy |

**Server:** Hetzner AX42 @ 138.201.139.25 (64GB RAM, 2x512GB NVMe)

## Current Phase

**Phase 1:** Admin Dashboard Deployment — Deploy via Coolify, establish MCP Gateway patterns, validate NextAuth flow.

---

*Mapped: 2025-11-25 | Priority: high | Files: 14 root, 400+ total*
