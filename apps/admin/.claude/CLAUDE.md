# Ozean Licht Admin Dashboard - AI Agent Development Guide

**Context**: Ozean Licht Platform Admin Dashboard
**Stack**: Next.js 14 + NextAuth v5 + TypeScript + MCP Gateway + Tailwind
**Scope**: Ozean Licht platform ONLY (Kids Ascension has separate admin dashboard)

---

## Agentic Navigation Patterns

### Route Discovery

**Always start here when navigating the admin codebase:**

```bash
# List all pages
find apps/admin/app -name "page.tsx" -type f | grep -v node_modules

# List all API routes
find apps/admin/app/api -name "route.ts" -type f

# Find specific feature
find apps/admin/app/dashboard -name "*user*" -type f
```

### Functional Area Organization

The admin dashboard is organized into **functional areas** for easy navigation:

```
/dashboard
├── /access      # User management, permissions, RBAC
├── /system      # Health monitoring, configuration
├── /content     # Course management, content publishing (future)
├── /members     # Member management, subscriptions (future)
└── /analytics   # Platform analytics, insights (future)
```

**When implementing features:**
- **User/permission features** → Place in `/dashboard/access/`
- **System/infrastructure features** → Place in `/dashboard/system/`
- **Content management features** → Place in `/dashboard/content/`
- **Member management features** → Place in `/dashboard/members/`
- **Analytics features** → Place in `/dashboard/analytics/`

### Finding Relevant Code

```bash
# Find where a component is used
grep -r "RoleBadge" apps/admin/app --include="*.tsx"

# Find all files importing from MCP client
grep -r "from '@/lib/mcp-client'" apps/admin --include="*.ts" --include="*.tsx"

# Find pages requiring specific role
grep -r "requireAnyRole" apps/admin/app/dashboard

# Find API endpoints
ls apps/admin/app/api/
```

---

## Core Development Patterns

### 1. Creating Server Component Pages

**Default pattern** - use unless you need client interactivity:

```typescript
// app/dashboard/access/users/page.tsx
import { requireAuth } from '@/lib/auth-utils'
import { requireAnyRole } from '@/lib/auth-utils'
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

const client = new MCPGatewayClientWithQueries({ database: 'ozean-licht-db' })

export default async function UsersPage() {
  // ALWAYS check auth first
  await requireAnyRole(['super_admin', 'ol_admin'])

  // Fetch data on server
  const users = await client.listAdminUsers()

  // Render with data
  return <div>{/* Your UI */}</div>
}
```

**Pattern breakdown:**
1. Import auth utilities
2. Check authentication/authorization at TOP of component
3. Fetch data via MCP client
4. Render server component with data
5. Pass data to client components if interactivity needed

### 2. Creating Client Components

**When you need interactivity** (forms, real-time updates, event handlers):

```typescript
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function UserForm({ initialData }) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    setLoading(true)
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setLoading(false)
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

**Use client components for:**
- Forms with validation
- Interactive tables (search, filter, sort)
- Real-time updates
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

### 3. Direct PostgreSQL Database Operations

**ALWAYS use direct PostgreSQL connections** for application database access:

```typescript
// For projects, tasks, templates - use lib/db modules
import { getAllProjects, getProjectById } from '@/lib/db/projects'
import { getAllTasks, updateTask } from '@/lib/db/tasks'

// Query operations
const { projects, total } = await getAllProjects({ status: 'active', limit: 50 })
const task = await getTaskById(taskId)

// Mutations
await updateTask(taskId, { status: 'done', is_done: true })

// For auth operations - use lib/db/auth-pool
import { getAuthPool } from '@/lib/db/auth-pool'
const pool = getAuthPool()
const result = await pool.query('SELECT * FROM admin_users WHERE id = $1', [userId])
```

**IMPORTANT**: MCP Gateway is for AI agent tool access, NOT for application database queries.
The `lib/mcp-client/` module exists for AI agent compatibility but should not be used by application code.

### 4. RBAC Enforcement

**Route protection (middleware)** - automatic for `/dashboard/*`:
```typescript
// middleware.ts already protects all dashboard routes
// No action needed - just works
```

**Page-level protection:**
```typescript
import { requireAnyRole } from '@/lib/auth-utils'

export default async function MyPage() {
  // Redirect if user doesn't have required role
  await requireAnyRole(['super_admin', 'ol_admin'])

  // ... rest of page
}
```

**Component-level checks:**
```typescript
import { useSession } from 'next-auth/react'

export function EditButton() {
  const { data: session } = useSession()

  // Only show to super_admin or ol_admin
  if (!['super_admin', 'ol_admin'].includes(session?.user?.adminRole)) {
    return null
  }

  return <button>Edit</button>
}
```

**Permission checks:**
```typescript
import { hasPermission } from '@/lib/auth-utils'

const canDelete = hasPermission(session.user.permissions, 'users.delete')
const canEditAny = hasPermission(session.user.permissions, 'users.*')
const isSuperAdmin = hasPermission(session.user.permissions, '*')
```

### 5. Creating API Endpoints

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'
import { z } from 'zod'

const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' })

// Validation schema
const updateUserSchema = z.object({
  adminRole: z.enum(['super_admin', 'ol_admin', 'ol_editor', 'support']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Check auth
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Check permissions (only super_admin or ol_admin can modify users)
  if (!['super_admin', 'ol_admin'].includes(session.user.adminRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Validate input
  const body = await request.json()
  const validated = updateUserSchema.parse(body)

  // 4. Perform operation
  const updated = await client.updateAdminUser(params.id, validated)

  // 5. Audit log
  await client.createAuditLog({
    adminUserId: session.user.adminUserId,
    action: 'user.update',
    entityType: 'admin_users',
    entityId: params.id,
    metadata: validated,
  })

  // 6. Return response
  return NextResponse.json({ success: true, user: updated })
}
```

---

## Component Patterns

### UI Components
```typescript
// Use shared UI components (Ozean Licht design system)
import { Button } from '@ozean-licht/shared-ui'
import { Card } from '@ozean-licht/shared-ui'
import { Badge } from '@ozean-licht/shared-ui'

// Use shadcn/ui components
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'

// Use admin-specific components
import { RoleBadge } from '@/components/rbac/RoleBadge'
import { EntityBadge } from '@/components/rbac/EntityBadge'
```

### Forms
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

---

## Common Tasks

### Task: Add New Page

1. **Determine functional area** (access/system/content/members/analytics)
2. **Create page file**:
   ```bash
   touch apps/admin/app/dashboard/[area]/[feature]/page.tsx
   ```
3. **Implement server component** with auth checks
4. **Add to navigation** in `components/dashboard/Sidebar.tsx`
5. **Update routes.md** with new route documentation

### Task: Add Database Query

1. **Open or create db module** (`lib/db/[entity].ts`)
2. **Add query function** using `query()` or `execute()` from `lib/db/index.ts`
3. **Add TypeScript types** for parameters and return values
4. **Write unit test** in `tests/unit/db/`

Example:
```typescript
// lib/db/myentity.ts
import { query, execute } from './index'

export async function getMyEntity(id: string): Promise<MyEntity | null> {
  const rows = await query<MyEntity>('SELECT * FROM my_entity WHERE id = $1', [id])
  return rows[0] || null
}
```

### Task: Add API Endpoint

1. **Create route file**: `app/api/[resource]/route.ts`
2. **Export HTTP method** function (GET, POST, PATCH, DELETE)
3. **Check auth** with `await auth()`
4. **Validate input** with Zod schema
5. **Call db functions** from `lib/db/` for database operations
6. **Return JSON** response

### Task: Implement RBAC

1. **Add route protection** in page:
   ```typescript
   await requireAnyRole(['super_admin', 'ol_admin'])
   ```
2. **Hide UI elements** for unauthorized roles:
   ```typescript
   {session?.user?.adminRole === 'super_admin' && <EditButton />}
   ```
3. **Protect API endpoint** with role checks
4. **Add audit logging** for sensitive operations

---

## Security Checklist

Before committing code, verify:

- [ ] All `/dashboard/*` pages use `requireAuth()` or `requireAnyRole()`
- [ ] All API routes check `await auth()` for session
- [ ] Sensitive operations (delete, role change) restricted to super_admin or ol_admin
- [ ] User inputs validated with Zod schemas
- [ ] SQL queries parameterized (using $1, $2 placeholders)
- [ ] Audit logs created for admin actions
- [ ] No credentials or secrets in code
- [ ] No console.log() with sensitive data

---

## Testing Patterns

### Unit Tests
```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

describe('User Queries', () => {
  let client: MCPGatewayClientWithQueries

  beforeEach(() => {
    client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' })
  })

  it('should list admin users', async () => {
    const users = await client.listAdminUsers()
    expect(users).toBeInstanceOf(Array)
  })
})
```

### Integration Tests
```typescript
import { GET } from '@/app/api/users/route'

describe('Users API', () => {
  it('should require authentication', async () => {
    const response = await GET()
    expect(response.status).toBe(401)
  })
})
```

---

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -p 32771 -U postgres -d ozean-licht-db -c "SELECT 1"

# Check environment variables
cat apps/admin/.env.local | grep POSTGRES
```

### Authentication Not Working
```bash
# Check environment variables
cat apps/admin/.env.local | grep NEXTAUTH

# Verify secret is set
echo $NEXTAUTH_SECRET
```

### TypeScript Errors
```bash
# Type check
cd apps/admin
npm run typecheck

# Rebuild types
rm -rf .next
npm run build
```

---

## Reference

**Key Files:**
- `middleware.ts` - Route protection
- `lib/auth/config.ts` - NextAuth configuration
- `lib/auth-utils.ts` - Auth helper functions
- `lib/db/` - Database operations (direct PostgreSQL)
- `components/dashboard/Sidebar.tsx` - Navigation
- `types/admin.ts` - Admin-specific types

**Documentation:**
- [routes.md](../docs/routes.md) - Route map
- [architecture.md](../docs/architecture.md) - Architecture overview
- [design-system.md](../../../design-system.md) - Ozean Licht design system
- [README.md](../README.md) - Setup and quick start
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) - Developer quick reference

---

**Last Updated**: 2025-11-24
**Purpose**: AI agent development guide for Ozean Licht Admin Dashboard
**Audience**: Claude Code, autonomous agents, developers
**Scope**: Ozean Licht platform only (Kids Ascension has separate admin dashboard)
