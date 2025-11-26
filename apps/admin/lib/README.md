# lib/

> Core libraries - authentication, MCP Gateway client, RBAC, and utilities.

## Quick Nav

**Auth:** `auth/` | **Database:** `mcp-client/` | **RBAC:** `rbac/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Protect page (require login) | `auth-utils.ts` | `await requireAuth()` at top of server component |
| Protect page (require role) | `auth-utils.ts` | `await requireAnyRole(['super_admin', 'ol_admin'])` |
| Check permission | `auth-utils.ts` | `hasPermission(session, 'users.write')` |
| Query database | `mcp-client/queries.ts` | Use `MCPGatewayClientWithQueries` methods |
| Add new query | `mcp-client/queries.ts` | Add method to class → Use `this.query()` |
| Add role config | `rbac/constants.ts` | Update `ROLE_CONFIG` with permissions and routes |
| Add route restriction | `rbac/constants.ts` | Update `ROUTE_ROLES` mapping |
| Modify auth flow | `auth/config.ts` | Edit NextAuth callbacks or providers |

## Structure

```
.
├── auth-utils.ts             # High-level auth helpers (requireAuth, hasPermission)
├── utils.ts                  # General utilities (cn, formatDate)
├── auth/                     # NextAuth configuration
│   ├── config.ts             # NextAuth providers, callbacks, session strategy
│   ├── adapter.ts            # PostgreSQL adapter (unused with JWT)
│   ├── constants.ts          # Audit action constants
│   ├── middleware-auth.ts    # Edge-compatible session check
│   └── utils.ts              # Password hashing utilities
├── mcp-client/               # MCP Gateway database client
│   ├── index.ts              # Barrel export
│   ├── client.ts             # Base MCPGatewayClient class
│   ├── queries.ts            # MCPGatewayClientWithQueries (all DB operations)
│   ├── health.ts             # Health check utilities
│   └── errors.ts             # MCPError, MCPClientError, MCPServerError
├── rbac/                     # Role-based access control
│   ├── constants.ts          # ROLE_CONFIG, ROUTE_ROLES, canAccessRoute()
│   ├── permissions.ts        # Permission definitions
│   ├── permission-categories.ts # Permission groupings
│   └── utils.ts              # RBAC utility functions
├── db/                       # Direct database access
│   └── auth-pool.ts          # PostgreSQL pool for auth (fast path)
├── hooks/                    # React hooks
│   ├── useToast.ts           # Toast notifications
│   ├── useServerPagination.ts # Server-side pagination
│   └── use-debounce.ts       # Input debouncing
├── providers/                # React context providers
│   ├── ThemeProvider.tsx     # Dark/light mode
│   └── ToastProvider.tsx     # Toast notifications
├── contexts/                 # React contexts
│   └── BreadcrumbContext.tsx # Breadcrumb state
├── navigation/               # Navigation utilities
│   ├── breadcrumb-utils.ts   # Breadcrumb helpers
│   └── keyboard-shortcuts.ts # Keyboard navigation
└── data-table/               # Data table utilities
    └── utils.ts              # Table helper functions
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `auth-utils.ts` | `requireAuth()`, `requireAnyRole()`, `hasPermission()` - used in every protected page | ●●● |
| `auth/config.ts` | NextAuth setup: credentials provider, JWT callbacks, session enrichment | ●●● |
| `mcp-client/queries.ts` | All database operations: CRUD for users, permissions, audit logs | ●●● |
| `rbac/constants.ts` | Role definitions, route permissions, `canAccessRoute()` | ●●● |
| `mcp-client/client.ts` | Base MCP client: `query()`, `execute()`, connection handling | ●● |
| `db/auth-pool.ts` | Direct PostgreSQL pool for auth (bypasses MCP Gateway for speed) | ●● |
| `auth/middleware-auth.ts` | Edge-compatible JWT verification for middleware | ●● |

## Usage Patterns

```typescript
// Page protection (server component)
import { requireAuth, requireAnyRole } from '@/lib/auth-utils'

export default async function ProtectedPage() {
  const session = await requireAuth()  // Redirects if not logged in
  // OR
  await requireAnyRole(['super_admin', 'ol_admin'])  // Redirects if wrong role
}

// Permission check
import { hasPermission } from '@/lib/auth-utils'
if (hasPermission(session, 'users.write')) { /* can edit */ }

// Database queries
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'
const client = new MCPGatewayClientWithQueries({ database: 'ozean-licht-db' })
const users = await client.listAdminUsers()
await client.updateAdminUser(id, { adminRole: 'ol_admin' })
```

---

*Mapped: 2025-11-26 | Priority: high | Files: 26*
