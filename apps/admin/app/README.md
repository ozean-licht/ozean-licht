# App Directory

> Next.js 14 App Router — 28 pages + 24 API routes organized by functional areas with server-first rendering and RBAC protection.

## Quick Nav

**Entry:** `page.tsx` | **Dashboard:** `dashboard/` | **API:** `api/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add dashboard page | `dashboard/[area]/` | Create folder → Add `page.tsx` → Add to Sidebar |
| Add API endpoint | `api/[resource]/` | Create `route.ts` → Check `auth()` → Call `lib/db/` |
| Add nested route | `dashboard/[area]/[id]/` | Create `[id]/page.tsx` → Handle params |
| Add layout wrapper | `dashboard/[area]/` | Create `layout.tsx` → Wrap children |
| Protect by role | Page component | Call `requireAnyRole()` at top |
| Add loading state | Any route folder | Create `loading.tsx` with skeleton |
| Add error boundary | Any route folder | Create `error.tsx` with fallback UI |

## Structure

```
.
├── (auth)/                   # Auth group (no layout nesting)
│   └── login/page.tsx        # Login form, redirects if authenticated
├── dashboard/                # Protected area (28 pages)
│   ├── layout.tsx            # Shell: Sidebar + Header + auth check
│   ├── page.tsx              # Home: stats, activity, permissions
│   ├── access/               # User management
│   │   ├── users/            # User list, detail, permissions
│   │   └── permissions/      # Permission matrix
│   ├── tools/                # Internal tools
│   │   ├── cloud/            # Ozean Cloud storage
│   │   ├── projects/         # Project management
│   │   ├── tasks/            # Task kanban
│   │   └── templates/        # Process templates
│   ├── courses/              # Course builder
│   ├── content/              # Blog, videos
│   ├── commerce/             # Orders, products, transactions
│   ├── calendar/             # Events
│   ├── system/               # Health monitoring
│   └── account/              # Profile, settings, inbox
├── api/                      # API routes (24 endpoints)
│   ├── auth/                 # NextAuth handlers
│   ├── projects/             # Project CRUD
│   ├── tasks/                # Task CRUD
│   ├── courses/              # Course + modules + lessons
│   ├── permissions/          # Permission checks
│   └── storage/              # File preview proxy
├── layout.tsx                # Root: providers, fonts, metadata
└── page.tsx                  # Landing: redirects to /dashboard
```

## Dashboard Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | `page.tsx` | Home with stats, activity chart, permissions list |
| `/dashboard/access/users` | `UsersDataTable` | Admin user list with search, filters |
| `/dashboard/access/users/[id]` | `AdminUserForm` | User detail and role editing |
| `/dashboard/access/permissions` | `PermissionMatrix` | Role-permission grid editor |
| `/dashboard/tools/cloud` | `StoragePageClient` | Ozean Cloud file browser |
| `/dashboard/tools/projects` | `ProjectsDashboard` | Project cards with filters |
| `/dashboard/tools/projects/[id]` | `ProjectDetailClient` | Project detail with tasks |
| `/dashboard/tools/tasks` | `TasksKanban` | Kanban board for all tasks |
| `/dashboard/courses` | `CoursesPageClient` | Course gallery + data table |
| `/dashboard/courses/[slug]` | `CourseDetailClient` | Course editor with modules |
| `/dashboard/content/blog` | `BlogWriter` | Blog post editor |
| `/dashboard/system/health` | Health cards | Server, DB, MCP status |

## API Routes

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/[id]` | GET, PATCH, DELETE | Project CRUD |
| `/api/projects/[id]/comments` | GET, POST | Project comments |
| `/api/tasks` | GET, POST | List/create tasks |
| `/api/tasks/[id]` | GET, PATCH, DELETE | Task CRUD |
| `/api/tasks/[id]/comments` | GET, POST | Task comments |
| `/api/courses/[id]` | GET, PATCH, DELETE | Course CRUD |
| `/api/courses/[id]/modules` | GET, POST | Course modules |
| `/api/courses/[id]/modules/reorder` | POST | Reorder modules |
| `/api/courses/[id]/modules/[moduleId]/lessons` | GET, POST | Module lessons |
| `/api/permissions` | GET | List all permissions |
| `/api/permissions/check` | POST | Check user permission |
| `/api/permissions/matrix` | GET, POST | Permission matrix data |
| `/api/admin-users/[id]` | GET, PATCH | Admin user CRUD |
| `/api/storage/preview/[bucket]/[...path]` | GET | File preview proxy |

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `layout.tsx` | Root layout, ThemeProvider, ToastProvider, fonts | ●●● |
| `dashboard/layout.tsx` | Dashboard shell, auth check, entity scope | ●●● |
| `dashboard/layout-client.tsx` | Client shell with Sidebar, Header, Breadcrumb | ●●● |
| `api/auth/[...nextauth]/route.ts` | NextAuth route handlers | ●●● |
| `dashboard/page.tsx` | Dashboard home with stats and charts | ●● |
| `api/projects/route.ts` | Project list/create pattern | ●● |

## Patterns

### Server Component Page
```typescript
import { requireAnyRole } from '@/lib/auth-utils'

export default async function Page() {
  await requireAnyRole(['super_admin', 'ol_admin'])
  // Fetch data server-side
  return <div>...</div>
}
```

### API Route
```typescript
import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Handle request
}
```

### Dynamic Route
```typescript
export default async function Page({ params }: { params: { id: string } }) {
  const item = await getById(params.id)
  if (!item) notFound()
  return <DetailView item={item} />
}
```

---

*Mapped: 2025-12-02 | Pages: 28 | API Routes: 24 | Layouts: 14*
