# app/

> Next.js 14 App Router - pages, layouts, and API routes for the admin dashboard.

## Quick Nav

**Root:** `layout.tsx` | **Dashboard:** `dashboard/` | **API:** `api/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add dashboard page | `dashboard/[area]/` | Create `[feature]/page.tsx` → Add `requireAnyRole()` → Update Sidebar |
| Add API endpoint | `api/` | Create `[resource]/route.ts` → Export GET/POST/PATCH → Use `auth()` |
| Add route group layout | `dashboard/[area]/` | Create `layout.tsx` → Wrap children → Add breadcrumbs if needed |
| Protect page by role | Page file | `await requireAnyRole(['super_admin', 'ol_admin'])` at top |
| Add login customization | `(auth)/login/page.tsx` | Modify form → Update validation → Style with design system |
| Debug routing | `layout.tsx` chain | Root → Dashboard → Area → Page (each can have layout) |

## Structure

```
.
├── layout.tsx                # Root: fonts, ThemeProvider, ToastProvider
├── page.tsx                  # Redirects to /dashboard
├── globals.css               # Tailwind + design system styles
├── (auth)/                   # Auth route group (no /auth in URL)
│   ├── layout.tsx            # Centered card layout
│   └── login/page.tsx        # Login form with credentials
├── dashboard/                # Protected routes
│   ├── layout.tsx            # Auth check + Sidebar/Header shell
│   ├── page.tsx              # Dashboard home with stats
│   ├── access/               # User & permission management
│   │   ├── users/            # User list, detail, permissions
│   │   └── permissions/      # System permissions matrix
│   └── system/               # System administration
│       └── health/           # Health monitoring dashboard
└── api/                      # API routes
    ├── auth/[...nextauth]/   # NextAuth handlers
    ├── admin-users/          # User CRUD operations
    └── permissions/          # Permission management
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `layout.tsx` | Root layout: Google fonts, ThemeProvider, ToastProvider | ●●● |
| `globals.css` | Tailwind base + Ozean Licht design tokens + glass morphism | ●●● |
| `dashboard/layout.tsx` | Auth check via `requireAuth()`, renders Sidebar/Header shell | ●●● |
| `dashboard/page.tsx` | Dashboard home: welcome, stats cards, permissions list | ●● |
| `(auth)/login/page.tsx` | Login form with email/password credentials | ●● |
| `api/auth/[...nextauth]/route.ts` | NextAuth GET/POST handlers (uses config from lib/auth) | ●● |

## Route Map

| URL | File | Auth | Purpose |
|-----|------|------|---------|
| `/` | `page.tsx` | No | Redirect to /dashboard |
| `/login` | `(auth)/login/page.tsx` | No | Login form |
| `/dashboard` | `dashboard/page.tsx` | Yes | Home with stats |
| `/dashboard/access/users` | `dashboard/access/users/page.tsx` | Yes | User list |
| `/dashboard/access/users/[id]` | `dashboard/access/users/[id]/page.tsx` | Yes | User detail |
| `/dashboard/access/permissions` | `dashboard/access/permissions/page.tsx` | Yes | Permissions matrix |
| `/dashboard/system/health` | `dashboard/system/health/page.tsx` | Yes | Health monitoring |

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/*` | GET/POST | NextAuth authentication |
| `/api/admin-users/[id]` | GET/PATCH/DELETE | User CRUD |
| `/api/admin-users/[id]/permissions` | GET/PATCH | User permissions |
| `/api/permissions` | GET | List all permissions |
| `/api/permissions/check` | POST | Check if user has permission |
| `/api/permissions/matrix` | GET | Full permissions matrix |

---

*Mapped: 2025-11-26 | Priority: high | Files: 29*
