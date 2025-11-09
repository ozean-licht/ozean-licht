# Admin App Context Map

> **Quick navigation guide for the Admin Dashboard codebase**

---

## 🎯 What Is This?

The Admin Dashboard is a Next.js 14 app providing unified administration for Kids Ascension and Ozean Licht. It uses NextAuth for authentication and MCP Gateway for backend operations.

**Tech Stack**: Next.js 14 (App Router) + TypeScript + NextAuth + Tailwind + MCP Gateway Client

---

## 🗺️ Quick Navigation

### I want to...

| Task | Start Here | Key Files |
|------|-----------|-----------|
| **Add a new page** | `app/(dashboard)/` | Create `new-page/page.tsx` |
| **Add API endpoint** | `app/api/` | Create `endpoint/route.ts` |
| **Modify auth flow** | `lib/auth/` | `config.ts`, `adapter.ts` |
| **Add UI component** | `components/` | Use shadcn/ui patterns |
| **Query database** | `lib/mcp-client/` | `queries.ts`, `client.ts` |
| **Update types** | `types/` | Modify relevant `.ts` file |
| **Write tests** | `tests/` | Mirror source structure |

---

## 📁 Directory Structure (75 files, ~5k LOC)

```
apps/admin/
├── app/                           # Next.js 14 App Router
│   ├── (auth)/                    # Auth routes (login)
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── health/                # System health monitoring
│   │   ├── storage/               # MinIO file management
│   │   └── page.tsx               # Dashboard home
│   └── api/                       # API routes
│       ├── auth/[...nextauth]/    # NextAuth handlers
│       └── storage/               # Storage operations
│
├── components/                    # React components
│   ├── auth/                      # Login/logout components
│   ├── dashboard/                 # Layout components (Header, Sidebar)
│   ├── health/                    # Health monitoring cards
│   ├── storage/                   # File upload/list components
│   └── ui/                        # shadcn/ui primitives
│
├── lib/                           # Business logic
│   ├── auth/                      # Authentication core
│   │   ├── config.ts              # NextAuth configuration
│   │   ├── adapter.ts             # Database adapter
│   │   ├── utils.ts               # Password hashing, tokens
│   │   └── constants.ts           # Auth constants
│   ├── auth-utils.ts              # Server-side auth helpers
│   ├── mcp-client/                # MCP Gateway client
│   │   ├── client.ts              # HTTP client
│   │   ├── queries.ts             # Database queries
│   │   ├── health.ts              # Health checks
│   │   └── storage.ts             # MinIO operations
│   └── utils.ts                   # General utilities
│
├── types/                         # TypeScript types
│   ├── admin.ts                   # Admin user types
│   ├── database.ts                # Database schemas
│   ├── health.ts                  # Health check types
│   ├── storage.ts                 # Storage types
│   ├── mcp.ts                     # MCP client types
│   └── next-auth.d.ts             # NextAuth type extensions
│
└── tests/                         # Test suite
    ├── lib/mcp-client/            # MCP client tests
    ├── unit/auth/                 # Auth unit tests
    └── integration/               # E2E tests
```

---

## 🔑 Key Entry Points

### 1. Authentication Flow
**Start**: `lib/auth/config.ts:30` (NextAuth config)

```typescript
// How auth works:
1. User visits /login → app/(auth)/login/page.tsx
2. Submit credentials → POST /api/auth/callback/credentials
3. NextAuth calls authorize() → lib/auth/config.ts:45
4. Verify with MCP Gateway → lib/mcp-client/queries.ts:120
5. Create session → lib/auth/adapter.ts:80
6. Redirect to /dashboard
```

**Related Files**:
- `lib/auth/adapter.ts:40-200` - Custom NextAuth adapter
- `lib/auth/utils.ts:18-76` - Password hashing/verification
- `middleware.ts:10-30` - Route protection

---

### 2. MCP Gateway Integration
**Start**: `lib/mcp-client/client.ts:20` (HTTP client)

```typescript
// How MCP requests work:
1. Component calls query → lib/mcp-client/queries.ts
2. Query builds request → lib/mcp-client/client.ts:60
3. HTTP POST to MCP Gateway → http://localhost:8100/mcp-postgres
4. Response parsed → lib/mcp-client/client.ts:120
5. Return typed data
```

**Database Queries**: `lib/mcp-client/queries.ts`
- Lines 20-50: User management
- Lines 60-90: Session management
- Lines 100-130: Audit logging
- Lines 140-170: Storage operations

---

### 3. Dashboard Layout
**Start**: `app/(dashboard)/layout.tsx:15` (Dashboard wrapper)

```typescript
// Component hierarchy:
<DashboardLayout>              // app/(dashboard)/layout.tsx
  <LayoutClient>               // app/(dashboard)/layout-client.tsx
    <Header>                   // components/dashboard/Header.tsx
      <EntitySwitcher>         // components/dashboard/EntitySwitcher.tsx
    <Sidebar>                  // components/dashboard/Sidebar.tsx
    <main>{children}</main>    // Page content
```

**Navigation Items**: `components/dashboard/Sidebar.tsx:25-50`

---

### 4. Health Monitoring
**Start**: `app/(dashboard)/health/page.tsx:20` (Health page)

```typescript
// Health check flow:
1. Page loads → fetch health data (server action)
2. Server action → app/(dashboard)/health/actions.ts:15
3. MCP client calls → lib/mcp-client/health.ts:20-100
4. Display cards → components/health/*Card.tsx
```

**Monitored Services**: `lib/mcp-client/health.ts`
- Lines 25-45: MCP Gateway health
- Lines 50-70: Database connections
- Lines 75-95: Server metrics

---

### 5. Storage Management
**Start**: `app/(dashboard)/storage/page.tsx:18` (Storage page)

```typescript
// File upload flow:
1. User uploads → components/storage/FileUploadForm.tsx:40
2. POST /api/storage/upload → app/api/storage/upload/route.ts:15
3. MCP client → lib/mcp-client/storage.ts:25
4. MinIO upload → MCP Gateway → MinIO server
5. Update UI → components/storage/FileList.tsx
```

**Storage Operations**: `lib/mcp-client/storage.ts`
- Lines 20-50: Upload files
- Lines 55-80: List files
- Lines 85-110: Delete files
- Lines 115-140: Get metadata

---

## 🧪 Testing Strategy

### Test Organization
```
tests/
├── lib/mcp-client/           # Unit tests for MCP client
│   ├── client.test.ts        # HTTP client tests
│   ├── health.test.ts        # Health check tests
│   └── storage.test.ts       # Storage tests
├── unit/auth/                # Auth utility tests
│   └── utils.test.ts         # Password, permissions
└── integration/              # E2E tests
    └── e2e.test.ts           # Full user flows
```

**Run Tests**:
```bash
npm test                      # All tests
npm test -- mcp-client        # MCP tests only
npm test -- auth              # Auth tests only
```

---

## 🛠️ Common Tasks

### Add a New Dashboard Page

1. **Create page**: `app/(dashboard)/new-feature/page.tsx`
```typescript
import { requireAuth } from '@/lib/auth-utils';

export default async function NewFeaturePage() {
  const session = await requireAuth();
  return <div>New Feature</div>;
}
```

2. **Add to sidebar**: `components/dashboard/Sidebar.tsx:35`
```typescript
{ name: 'New Feature', href: '/new-feature', icon: IconName }
```

3. **Add types**: `types/new-feature.ts`

---

### Add MCP Gateway Query

1. **Define query**: `lib/mcp-client/queries.ts:200`
```typescript
export async function getNewData(mcpClient: MCPGatewayClient) {
  const result = await mcpClient.executeQuery({
    database: 'shared_users_db',
    query: 'SELECT * FROM new_table',
  });
  return result.rows;
}
```

2. **Add types**: `types/database.ts`

3. **Use in component**: Call from server component or action

---

### Add API Endpoint

1. **Create route**: `app/api/new-endpoint/route.ts`
```typescript
import { auth } from '@/lib/auth/config';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Your logic here
  return Response.json({ data: 'result' });
}
```

2. **Add types**: `types/api.ts` (if needed)

---

## 🔒 Security Patterns

### Server-Side Auth
```typescript
// In Server Components
import { requireAuth, requirePermission } from '@/lib/auth-utils';

// Basic auth
const session = await requireAuth();

// Permission check
const session = await requirePermission('users.write');
```

### Client-Side Auth
```typescript
// In Client Components
'use client';
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
if (status === 'loading') return <Loading />;
if (!session) return <Unauthorized />;
```

---

## 📚 Further Reading

- **Architecture Overview**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Auth Flow Details**: `specs/auth-flow-nextauth.md`
- **MCP Integration**: `specs/minio-s3-storage-integration.md`
- **Optimization Plan**: `OPTIMIZATION_PLAN.md`

---

**Last Updated**: 2025-11-09
**Codebase Version**: Foundation Phase
**Maintainer**: Agentic Development Team
