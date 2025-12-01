# Ozean Licht Ecosystem

Megarepo: Ozean Licht Akademie (spiritual e-learning) + Kids Ascension (children's education)
Stack: Next.js 14 | TypeScript | MCP Gateway | Tailwind | PostgreSQL

## Cache Hierarchy (Where To Look)

| Layer | Location | When |
|-------|----------|------|
| L2 | `apps/<app>/.claude/CLAUDE.md` | Working in specific app |
| L3 | `*/README.md` | Need directory navigation |
| Docs | `ai_docs/*.md` | Need API/SDK reference |
| Specs | `specs/`, `apps/*/specs/` | Need implementation plans |
| Memory | `tools/memory/` | Need historical decisions |

## Invariants (Always True)

1. **Database**: Direct PostgreSQL connections for application code (`pg` package with connection pooling)
2. **MCP Gateway**: For AI agent tool access ONLY, not for application database queries
3. **Components**: `@ozean-licht/shared-ui` first, local `components/ui/` second
4. **Auth**: NextAuth (admin only)
5. **Commits**: Conventional commits, no `--force`, no `--amend` without checking authorship

## Agentic Layer

### Slash Commands (Hot)
```
/prime          → Load codebase context (start here)
/plan <prompt>  → Generate implementation spec
/build <spec>   → Execute from spec file
/review         → Validate changes
/commit         → Conventional commit
```

### Skills
```
context-mapper  → Generate README.md navigation maps
```

### Sub-Agents
```
Explore         → Fast codebase search (haiku)
Plan            → Architecture planning (sonnet)
build-agent     → Single file implementation
review-agent    → Git diff validation
```

## Hot Paths

| Task | Command/Location |
|------|------------------|
| Start session | `/prime` |
| Find files | `Explore` agent or `Glob` tool |
| Understand directory | Read its `README.md` |
| Database query | `tools/mcp-gateway/README.md` |
| Add component | `shared/ui/README.md` |
| Check health | `bash tools/monitoring/health-all.sh` |
| Deploy | `tools/deployment/README.md` |

## Structure (Pointers Only)

```
apps/
├── admin/          → L2: .claude/CLAUDE.md (NextAuth + RBAC)
├── ozean-licht/    → L2: Main platform
├── kids-ascension/ → L2: Waitlist system
└── storybook/      → Component docs

shared/
├── ui/             → L3: Shared React components
├── assets/         → Branding, logos
└── database/       → Multi-tenant utilities

tools/
├── mcp-gateway/    → L3: Database + services (port 8100)
├── deployment/     → Coolify operations
└── monitoring/     → Health checks
```

## MCP Gateway Services (For AI Agents Only)

Port `8100` | Endpoint pattern: `/mcp/<service>/<operation>`

**IMPORTANT**: MCP Gateway is for AI agent tool access, NOT for application database queries.
Applications should use direct PostgreSQL connections via `lib/db/index.ts`.

Services: `postgres`, `minio`, `github`, `telegram`, `mem0`

Quick test: `curl http://localhost:8100/health`

---
*L1 Cache | 90 LOC max | Last: 2025-11-26*
