# Admin Dashboard - Developer Guide

**Context:** Ozean Licht Ecosystem Admin Dashboard
**Stack:** Next.js 14 + NextAuth v5 + TypeScript + MCP Gateway + Tailwind

---

## Core Principles

1. **MCP Gateway First** - All database operations via MCP Gateway (never direct DB)
2. **Server Components Default** - Use `'use client'` only when needed
3. **Type Safety** - Full TypeScript strict mode
4. **Route Protection** - All `/dashboard/*` routes require auth
5. **Audit Everything** - Log all admin actions

---

## Project Structure

```
app/
├── (auth)/              # Login
├── (dashboard)/         # Protected routes
│   ├── health/         # System health
│   ├── storage/        # MinIO management
│   ├── users/          # User management (Phase 1)
│   ├── ozean-licht/    # OL admin (Phase 2)
│   └── kids-ascension/ # KA admin (Phase 3)
└── api/                # API routes

components/             # React components
lib/
├── auth/              # NextAuth config
├── auth-utils.ts      # Server-side helpers
├── mcp-client/        # MCP Gateway client
└── utils.ts           # UI utilities

types/                 # TypeScript definitions
```

---

## Quick Patterns

### Protected Server Component
```typescript
import { requireAuth } from '@/lib/auth-utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';

export default async function UsersPage() {
  const session = await requireAuth();
  const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
  const users = await client.listAdminUsers();
  return <div>{/* Render users */}</div>;
}
```

### MCP Gateway Query
```typescript
const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
const user = await client.getAdminUserById(userId);
const health = await client.healthCheck();
```

### Protected API Route
```typescript
import { auth } from '@/lib/auth/config';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  // Your logic
  return Response.json({ data: 'result' });
}
```

### Client Component (Interactive)
```typescript
'use client';
import { useSession } from 'next-auth/react';

export function UserTable({ users }) {
  const { data: session } = useSession();
  if (!session) return <Unauthorized />;
  return <div>{/* Interactive table */}</div>;
}
```

### Form with Validation
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export function UserForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

---

## Navigation & Layout

### Breadcrumb Navigation
```typescript
// Automatically generated from route path
// Custom labels for dynamic routes:
import { useBreadcrumb } from '@/lib/contexts/BreadcrumbContext';

// In page component
const { setCustomLabel } = useBreadcrumb();
useEffect(() => {
  setCustomLabel('/dashboard/users/123', userName);
}, [userName]);
```

### Theme Switching
```typescript
// Automatic via toggle button in header
// Programmatic theme switching:
import { useTheme } from 'next-themes';

const { setTheme, theme } = useTheme();
setTheme('dark'); // or 'light', 'system'
```

### Keyboard Shortcuts
- **Esc** - Close sidebar/modal
- **g + h** - Go to dashboard home
- **/** - Open search (when implemented)

### Sidebar Collapse
Desktop users can collapse sidebar via toggle button. State persists in localStorage.

---

## Common Tasks

**Add Page:** Create `app/(dashboard)/feature/page.tsx` → Add to `Sidebar.tsx` → Add types

**Add MCP Query:** `lib/mcp-client/queries.ts` → `executeQuery({ query: 'SELECT...' })`

**Add API Route:** `app/api/endpoint/route.ts` → Check `auth()` → Return JSON

---

## Security

```typescript
// Check permissions
import { hasPermission } from '@/lib/auth-utils';
const canEdit = hasPermission(session.user.permissions, 'users.edit');

// Validate input
import { z } from 'zod';
const validated = z.string().email().parse(input);

// Audit admin actions
await client.createAuditLog({
  admin_id: session.user.id,
  action: 'user.create',
  resource_type: 'admin_users',
  resource_id: newUser.id,
});
```

---

## Branding (Ozean Licht)

```typescript
// Tailwind classes
bg-primary-500 text-primary-500    // Turquoise #0ec2bc
bg-cosmic-gradient                  // Dark gradient
font-serif font-sans                // Cinzel / Montserrat
glow animate-float                  // Special effects

// Example: <Button className="bg-primary-500 glow">Action</Button>
```

---

## Testing & Environment

```bash
# Tests
npm test                    # All tests
npm test -- mcp-client      # Specific tests

# .env.local
NEXTAUTH_URL=http://localhost:9200
NEXTAUTH_SECRET=your-secret-here
MCP_GATEWAY_URL=http://localhost:8100
DATABASE_NAME=shared-users-db
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Session not found | Check MCP Gateway running, verify `NEXTAUTH_URL` |
| Permission denied | Verify permissions in DB, check `hasPermission()` calls |
| MCP timeout | Increase client timeout or check MCP Gateway health |
| Build failures | Run `npm run type-check` for TypeScript errors |

---

## References

- **[Branding](./BRANDING.md)** - Colors, fonts, effects
- **[Design System](./design-system.md)** - Complete guidelines
- **[Roadmap](./specs/admin-dashboard-roadmap.md)** - Implementation phases
- **[API Reference](./README.md)** - MCP Client API
- **[Documentation](./docs/README.md)** - All docs
- **[Root CLAUDE.md](../../CLAUDE.md)** - Ecosystem rules

---

**Last Updated:** 2025-11-09 | **Phase:** Foundation | **Maintainer:** Platform Team
