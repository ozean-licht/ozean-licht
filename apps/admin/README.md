# Admin Dashboard

> NextAuth v5 admin interface for Ozean Licht platform — RBAC-protected dashboard with direct PostgreSQL access, course builder, project management, and cloud storage.

## Quick Nav

**Entry:** `app/page.tsx` | **Auth:** `lib/auth/config.ts` | **Database:** `lib/db/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add dashboard page | `app/dashboard/` | Create `[area]/[feature]/page.tsx` → Add to `Sidebar.tsx` → Add RBAC check |
| Add API endpoint | `app/api/` | Create `[resource]/route.ts` → Check auth → Call `lib/db/` functions |
| Add database query | `lib/db/` | Add function to entity module → Use `query()` or `execute()` |
| Protect route by role | Page component | Import `requireAnyRole` from `lib/auth-utils.ts` → Call at top |
| Add UI component | `components/` | Check `@shared/ui` first → Use `components/ui/` for shadcn primitives |
| Debug auth issues | `lib/auth/config.ts` | Check credentials flow → Verify JWT callbacks → Check `middleware.ts` |
| Add course content | `lib/db/courses.ts` | Use CRUD functions → Update via API routes |
| Manage storage | `lib/storage/s3-client.ts` | Create S3 client → Use presigned URLs for uploads |

## Structure

```
.
├── app/                      # Next.js App Router [→](./app/)
│   ├── (auth)/               # Auth pages (login)
│   ├── dashboard/            # Protected routes (28 pages)
│   │   ├── access/           # Users, permissions [→](./app/dashboard/access/)
│   │   ├── tools/            # Cloud, projects, tasks [→](./app/dashboard/tools/)
│   │   ├── courses/          # Course builder
│   │   ├── content/          # Blog, videos
│   │   └── system/           # Health monitoring
│   └── api/                  # API routes (24 endpoints) [→](./app/api/)
├── lib/                      # Core libraries [→](./lib/)
│   ├── auth/                 # NextAuth config + JWT
│   ├── db/                   # PostgreSQL queries (27 modules)
│   ├── rbac/                 # Role-based access control
│   └── storage/              # S3 client (Hetzner)
├── components/               # UI components (87 files) [→](./components/)
│   ├── admin/                # Admin-specific (forms, skeletons)
│   ├── ui/                   # shadcn primitives
│   ├── dashboard/            # Layout (Sidebar, Header)
│   ├── courses/              # Course editor modals
│   ├── projects/             # Project/task widgets
│   └── data-table/           # TanStack table wrappers
├── types/                    # TypeScript definitions (17 files)
└── tests/                    # Jest + Playwright
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `middleware.ts` | Route protection, redirects unauthenticated to `/login`, enforces RBAC via `canAccessRoute()` | ●●● |
| `lib/auth/config.ts` | NextAuth config, credentials provider, JWT callbacks with role/permissions | ●●● |
| `lib/db/index.ts` | PostgreSQL pool, `query()` and `execute()` functions, transaction support | ●●● |
| `lib/auth-utils.ts` | Auth helpers: `requireAuth()`, `requireAnyRole()`, `hasPermission()` | ●●● |
| `types/index.ts` | Core types: `AdminRole`, `AdminUser`, `Permission`, re-exports all domain types | ●●● |
| `lib/rbac/constants.ts` | Role definitions, route permissions map, `canAccessRoute()` | ●● |
| `components/dashboard/Sidebar.tsx` | Navigation sidebar, route definitions, add new menu items here | ●● |
| `lib/db/projects.ts` | Project CRUD: `getAllProjects()`, `createProject()`, `updateProject()` | ●● |
| `lib/db/tasks.ts` | Task CRUD with kanban support: status transitions, assignees, comments | ●● |
| `lib/storage/s3-client.ts` | Hetzner S3 client, presigned URLs, bucket operations | ●● |

## Deeper Maps

- [x] `app/` — 28 pages + 24 API routes [→](./app/README.md)
- [x] `components/` — 87 components across 11 subdirectories [→](./components/README.md)
- [x] `lib/db/` — 27 entity modules with CRUD operations [→](./lib/db/README.md)

---

*Mapped: 2025-12-03 | Priority: high | Files: 273*
