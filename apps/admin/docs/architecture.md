# Admin Dashboard Architecture

**Last Updated**: 2025-11-11
**Status**: Phase 1 - Foundation Complete

High-level architecture overview for AI agents and developers.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Server Components (minimal client state)

### Authentication
- **Library**: NextAuth v5
- **Strategy**: Database sessions with JWT enrichment
- **Adapter**: Custom PostgreSQL adapter (`lib/auth/adapter.ts`)
- **Session Storage**: `shared_users_db.sessions` table

### Database
- **Primary**: PostgreSQL (multi-tenant architecture)
- **Access Method**: MCP Gateway (unified API on port 8100)
- **Direct Access**: Via `lib/mcp-client/` for complex queries
- **Databases**:
  - `shared_users_db` - Authentication, admin users
  - `kids_ascension_db` - KA platform data
  - `ozean_licht_db` - OL platform data

### API Layer
- **MCP Gateway**: Port 8100 (unified service interface)
- **Client Library**: `lib/mcp-client/` (simplified structure)
- **REST API**: Next.js API routes (`app/api/`)

---

## Core Abstractions

### 1. MCP Gateway Client

**Purpose**: Unified interface for all database operations

**Structure** (simplified):
```
lib/mcp-client/
├── client.ts      # Base client + config (consolidated)
├── queries.ts     # Query extensions (admin users, permissions)
├── health.ts      # Health check operations
├── errors.ts      # Error handling (simplified to 3 types)
└── index.ts       # Public exports
```

**Usage**:
```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

const client = new MCPGatewayClientWithQueries({
  database: 'shared-users-db',
})

const users = await client.listAdminUsers()
```

**Simplification** (Spec 0.1):
- Merged `config.ts` into `client.ts` (~100 LOC reduction)
- Simplified errors from 5 types to 3 types (~30 LOC reduction)
- Removed unused transaction wrapper (~25 LOC reduction)
- Total reduction: ~155 LOC (from 2060 to ~1900)

### 2. Authentication & RBAC

**Roles**:
- `super_admin` - Full access, can manage roles
- `ka_admin` - Kids Ascension admin
- `ol_admin` - Ozean Licht admin
- `support` - Read-only support role

**Permission System**:
- Wildcard support: `*` (all), `users.*` (category), `users.read` (specific)
- Stored in JWT token for fast access checks
- Enforced via middleware (`middleware.ts`) and `requireAnyRole()` helpers

**Key Files**:
- `lib/auth/config.ts` - NextAuth configuration
- `lib/auth/adapter.ts` - Database adapter
- `lib/auth-utils.ts` - Helper functions (requireAuth, hasPermission)
- `lib/rbac/` - RBAC utilities

### 3. Component Architecture

**Patterns**:
- **Server Components (default)**: Data fetching, authentication checks
- **Client Components ('use client')**: Interactivity, forms, real-time updates
- **Composition**: Server components wrap client components with data

**Component Organization**:
```
components/
├── admin/              # Generic admin components (badges, buttons, forms)
├── dashboard/          # Dashboard-specific (Sidebar, Header)
├── health/             # Health monitoring components
├── rbac/               # RBAC components (RoleBadge, EntityBadge)
└── ui/                 # Base UI components (shadcn/ui)
```

---

## Data Flow

### Authentication Flow
1. User visits `/dashboard`
2. Middleware checks session (`middleware.ts`)
3. If no session → redirect to `/login`
4. Login via NextAuth → Creates session in `shared_users_db.sessions`
5. JWT enriched with: `adminRole`, `permissions`, `entityScope`, `adminUserId`
6. Session available via `auth()` in server components or `useSession()` in client

### Page Rendering Flow (Server Components)
1. User navigates to `/dashboard/access/users`
2. Server component `page.tsx` executes on server
3. `requireAuth()` checks authentication
4. `requireAnyRole(['super_admin', 'ka_admin', 'ol_admin'])` checks RBAC
5. MCP client fetches data from database
6. Server component renders HTML with data
7. Client component hydrates for interactivity (search, filters)

### API Request Flow
1. Client calls `/api/admin-users/[id]`
2. API route handler checks `await auth()` for session
3. Validates permissions for operation
4. Calls MCP Gateway via client library
5. Returns JSON response
6. Logs action to audit log

---

## Security Model

### Multi-Tenancy
- **Databases**: Physically separated (shared_users_db, kids_ascension_db, ozean_licht_db)
- **Entity Scope**: JWT token contains `entityScope` field
- **Access Control**: Middleware and RBAC enforce entity-level access

### Permission Enforcement
- **Middleware**: Protects `/dashboard/*` routes (route-level)
- **Server Components**: `requireAnyRole()` (page-level)
- **API Routes**: Manual `await auth()` + permission checks (endpoint-level)
- **Client Components**: Hide UI elements (cosmetic, not security)

### Audit Logging
- All admin actions logged to `shared_users_db.audit_logs`
- Includes: admin user ID, action type, entity type/ID, timestamp, metadata
- Queryable via MCP client: `client.createAuditLog()`

---

## Performance Considerations

### Server-Side Rendering
- Pages render on server → faster initial load
- Data fetching happens on server → no client-side loading states
- Use `<Suspense>` boundaries for independent data fetching

### Database Queries
- Connection pooling via MCP Gateway (2-10 connections per database)
- Server-side pagination (LIMIT/OFFSET) for large datasets
- Indexes recommended on frequently queried columns

### Bundle Optimization
- Server components don't add to client bundle
- Client components tree-shaken by Next.js
- UI components imported individually (not as barrel exports)

---

## Key Patterns for AI Agents

### Reading Data
1. Import `MCPGatewayClientWithQueries`
2. Initialize with target database
3. Call query method
4. Handle errors with try/catch

### Creating Pages
1. Server component by default
2. Use `requireAuth()` or `requireAnyRole()` at top
3. Fetch data via MCP client
4. Pass data to client component if needed
5. Add metadata export for SEO

### Adding API Endpoints
1. Create `app/api/[route]/route.ts`
2. Export async function for HTTP method (GET, POST, etc.)
3. Check auth with `await auth()`
4. Validate request with Zod schema
5. Call MCP client for database operations
6. Return `Response.json()`

### RBAC Enforcement
1. **Route-level**: Middleware automatically checks
2. **Page-level**: Use `requireAnyRole([...roles])`
3. **Component-level**: Check `session.user.adminRole`
4. **API-level**: Manual `await auth()` + role check

---

## Testing Strategy

### Unit Tests
- MCP client methods (`tests/unit/mcp-client/`)
- RBAC utilities (`tests/unit/rbac/`)
- Helper functions (`tests/unit/lib/`)

### Integration Tests
- Authentication flow (`tests/integration/auth/`)
- API endpoints (`tests/integration/api/`)
- Page rendering (`tests/integration/pages/`)

### E2E Tests
- User flows (login → navigate → perform action)
- Playwright tests (`tests/e2e/`)

---

## Deployment

### Build
```bash
cd apps/admin
npm run build
```

### Environment Variables
- `NEXTAUTH_URL` - Base URL for NextAuth
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `MCP_GATEWAY_URL` - MCP Gateway endpoint (default: http://localhost:8100)
- `DATABASE_URL` - PostgreSQL connection string (via MCP Gateway)

### Production Considerations
- Use production database credentials
- Enable strict CORS policies
- Configure session timeout appropriately
- Set up monitoring (Sentry, Grafana)
- Enable audit logging

---

## File Structure (Post Spec 0.1 Cleanup)

```
apps/admin/
├── app/
│   ├── dashboard/
│   │   ├── access/              # NEW: Access Management
│   │   │   ├── users/          # User management (moved)
│   │   │   └── permissions/    # Permissions (moved)
│   │   ├── system/              # NEW: System Administration
│   │   │   └── health/         # Health monitoring (moved)
│   │   ├── platforms/           # NEW: Platform-specific admin (future)
│   │   ├── _deferred/           # NEW: Deferred features
│   │   │   └── storage/        # Storage management (deferred)
│   │   ├── layout.tsx
│   │   ├── layout-client.tsx
│   │   └── page.tsx
│   └── api/
│       ├── admin-users/
│       ├── permissions/
│       └── _deferred/           # NEW: Deferred API routes
│           └── storage/
├── components/
│   ├── dashboard/
│   ├── access/                  # Access-specific components (future)
│   ├── system/                  # System-specific components (future)
│   ├── _deferred/               # NEW: Deferred components
│   │   └── storage/
│   └── ui/
├── lib/
│   ├── mcp-client/              # SIMPLIFIED: Merged config, reduced errors
│   │   ├── client.ts           # Base client (now includes config)
│   │   ├── queries.ts          # Query extensions
│   │   ├── health.ts           # Health checks
│   │   ├── errors.ts           # Simplified errors (3 types)
│   │   ├── _deferred/          # NEW: Deferred MCP modules
│   │   │   └── storage.ts
│   │   └── index.ts
│   ├── auth/
│   └── rbac/
├── docs/                        # NEW: Documentation
│   ├── ROUTES.md               # NEW: Route map
│   ├── ARCHITECTURE.md         # NEW: This file
│   └── decisions/              # NEW: Decision records
│       ├── storage-feature-status.md
│       └── cleanup-summary.md
└── tests/
```

---

## Changes from Spec 0.1

### Code Removed (~700 LOC)
- Demo pages: `components-demo`, `examples/data-table` (~200 LOC)
- Storage feature deferred (~1560 LOC moved to `_deferred/`)
- MCP client simplification (~155 LOC reduced)

### Routes Reorganized
- Users: `/dashboard/users` → `/dashboard/access/users`
- Permissions: `/dashboard/permissions` → `/dashboard/access/permissions`
- Health: `/dashboard/health` → `/dashboard/system/health`
- Storage: `/dashboard/storage` → `/dashboard/_deferred/storage`

### Navigation Updated
- Sidebar organized by functional areas
- 4 sections: Overview, Access Management, System, Platforms
- Examples section removed

---

## Future Architecture (Phase 2+)

### Platform-Specific Sections
- Kids Ascension admin → `/dashboard/platforms/kids-ascension/`
- Ozean Licht admin → `/dashboard/platforms/ozean-licht/`
- Shared components in `components/platforms/`

### Advanced Features
- Real-time updates (WebSocket or Server-Sent Events)
- Advanced analytics dashboards
- Bulk operations UI
- Export/import functionality

---

**Last Updated**: 2025-11-11
**Maintained By**: Platform Team + Autonomous Agents
**Status**: Phase 1 Foundation Complete
