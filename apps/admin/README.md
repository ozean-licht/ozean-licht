# Admin Dashboard

> NextAuth v5 admin interface for Ozean Licht platform with RBAC and MCP Gateway database operations.

## Quick Nav

**Entry:** `app/page.tsx` | **Auth:** `lib/auth/` | **Database:** `lib/mcp-client/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add dashboard page | `app/dashboard/` | Create `[area]/[feature]/page.tsx` → Add to `Sidebar.tsx` → Add RBAC check |
| Add API endpoint | `app/api/` | Create `[resource]/route.ts` → Use `auth()` → Call MCP client |
| Add database query | `lib/mcp-client/queries.ts` | Add method → Use `this.query()` → Export from `index.ts` |
| Protect route by role | Page component | Import `requireAnyRole` from `lib/auth-utils.ts` → Call at top |
| Check system health | `app/dashboard/system/health/` | View page → Check `actions.ts` for health checks |
| Add UI component | `components/` | `admin/` for admin-specific, `ui/` for shadcn primitives |
| Debug auth issues | `lib/auth/config.ts` | Check credentials flow → Verify JWT callbacks → Check `middleware.ts` |

## Structure

```
.
├── app/                      # Next.js App Router [→](./app/)
│   ├── (auth)/               # Auth pages (login)
│   ├── dashboard/            # Protected dashboard routes
│   │   ├── access/           # User management, permissions
│   │   ├── system/           # Health monitoring
│   │   └── page.tsx          # Dashboard home
│   └── api/                  # API routes [→](./app/api/)
├── lib/                      # Core libraries [→](./lib/)
│   ├── auth/                 # NextAuth config + utilities
│   ├── mcp-client/           # MCP Gateway client
│   └── rbac/                 # Role-based access control
├── components/               # UI components [→](./components/)
│   ├── admin/                # Admin-specific (skeletons, forms)
│   ├── ui/                   # shadcn primitives
│   ├── dashboard/            # Layout (Sidebar, Header)
│   └── rbac/                 # Role/Entity badges
├── types/                    # TypeScript definitions
├── tests/                    # Jest + Playwright tests
└── docs/                     # Documentation
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `middleware.ts` | Route protection, redirects unauthenticated to `/login`, enforces RBAC | ●●● |
| `lib/auth/config.ts` | NextAuth configuration, credentials provider, JWT callbacks | ●●● |
| `lib/mcp-client/queries.ts` | Database operations via MCP Gateway (list users, update, audit) | ●●● |
| `lib/auth-utils.ts` | Auth helpers: `requireAuth()`, `requireAnyRole()`, `hasPermission()` | ●●● |
| `lib/rbac/constants.ts` | Role definitions, route permissions, `canAccessRoute()` | ●● |
| `components/dashboard/Sidebar.tsx` | Navigation sidebar, add new routes here | ●● |
| `app/dashboard/layout.tsx` | Dashboard shell with auth check and providers | ●● |
| `types/admin.ts` | Core types: `AdminRole`, `AdminUser`, `Permission` | ●● |

## Needs Deeper Mapping

- [ ] `app/` — 25+ routes, complex nested structure with API and dashboard
- [ ] `components/` — 50+ components across admin, ui, dashboard, rbac
- [ ] `lib/` — 15+ files, auth and mcp-client are distinct subsystems

## Related

- **L2 Cache:** `.claude/CLAUDE.md` — Detailed dev patterns for this app
- **Setup:** `docs/admin-setup-reference.md` — Credentials, env vars, deployment
- **Specs:** `specs/` — Implementation specifications

---

*Mapped: 2025-11-26 | Priority: high | Files: 155*
