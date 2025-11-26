# Admin Dashboard Setup Reference

> Extracted from README.md (2025-11-26) - Preserved setup, credentials, and historical context

## Quick Start

### Prerequisites
```bash
node -v       # 18+
pnpm -v       # Latest
```

### Setup
```bash
# Install dependencies
cd apps/admin
pnpm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with:
# - NEXTAUTH_URL=http://localhost:9200
# - NEXTAUTH_SECRET=$(openssl rand -base64 32)
# - MCP_GATEWAY_URL=http://localhost:8100

# Start MCP Gateway (required)
cd ../../tools/mcp-gateway
npm run dev  # Port 8100

# Start admin dashboard
cd ../../apps/admin
pnpm dev  # Port 9200
```

Visit `http://localhost:9200/login`

### Test Credentials
- Email: `admin@ozean-licht.dev`
- Password: `admin123`
- Role: `super_admin`

---

## Technology Stack

**Frontend**
- Next.js 14 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS + Ozean Licht Design System (`@ozean-licht/shared-ui`)
- shadcn/ui components

**Backend**
- NextAuth v5 (authentication)
- MCP Gateway (database operations)
- PostgreSQL (databases: `shared_users_db`, `ozean_licht_db`)

**Infrastructure**
- Coolify (deployment)
- MinIO → Cloudflare R2 → Stream (storage pipeline)

---

## RBAC Role Definitions

| Role | Access Level |
|------|--------------|
| `super_admin` | Full system access across all platforms, can manage roles |
| `ol_admin` | Ozean Licht admin, full platform access |
| `ol_editor` | Content editor, can manage courses and content |
| `support` | Read-only support access |

### Permission Checking Patterns

```typescript
// Server components
import { requireAnyRole } from '@/lib/auth-utils'
await requireAnyRole(['super_admin', 'ol_admin'])

// Client components
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
const canEdit = ['super_admin', 'ol_admin'].includes(session?.user?.adminRole)

// Manual permission check
import { hasPermission } from '@/lib/auth-utils'
const canDelete = hasPermission(session.user.permissions, 'users.delete')
```

---

## MCP Gateway Integration

All database operations go through MCP Gateway:

```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

// Initialize client
const client = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'ozean-licht-db',
})

// Query examples
const users = await client.listAdminUsers()
const user = await client.getAdminUserById(userId)
await client.updateAdminUser(userId, { adminRole: 'ol_admin' })
await client.createAuditLog({ action: 'user.update', ... })
```

---

## Deployment

### Via Coolify
```bash
# Push to main branch
git push origin main

# Coolify auto-deploys
# Monitor: http://coolify.ozean-licht.dev:8000
```

### Environment Variables (Production)
```bash
NEXTAUTH_URL=https://admin.ozean-licht.dev
NEXTAUTH_SECRET=<production-secret>
MCP_GATEWAY_URL=https://mcp.ozean-licht.dev
NODE_ENV=production
```

---

## Historical Context

### Architecture Decision (2025-11-24)
- Separation of Concerns: Kids Ascension now has its own separate admin dashboard
- This dashboard is now exclusively for Ozean Licht platform
- Removed `ka_admin` role and Kids Ascension-specific features
- Simplified RBAC to focus on Ozean Licht roles only

### Code Cleanup (Spec 0.1)
- Demo pages removed: `components-demo`, `examples/data-table`
- Storage feature deferred to `_deferred/` (not MVP critical)
- MCP client simplified (merged config, reduced errors)

### Routes Reorganized
- Users: `/dashboard/users` → `/dashboard/access/users`
- Permissions: `/dashboard/permissions` → `/dashboard/access/permissions`
- Health: `/dashboard/health` → `/dashboard/system/health`

See [decisions/cleanup-summary.md](./decisions/cleanup-summary.md) for full details.

---

## Roadmap

### Phase 1 - Foundation (Complete)
- [x] Authentication with NextAuth v5
- [x] RBAC system (Ozean Licht roles)
- [x] User management interface
- [x] System health monitoring
- [x] Permissions matrix UI

### Phase 2 - Content Management
- [ ] Course management interface
- [ ] Lesson editor
- [ ] Media library integration
- [ ] Content publishing workflow

### Phase 3 - Member Management
- [ ] Member overview dashboard
- [ ] Subscription management
- [ ] Engagement tracking
- [ ] Communication tools

### Phase 4 - Analytics
- [ ] Platform analytics dashboard
- [ ] Content performance metrics
- [ ] Member insights
- [ ] Revenue tracking

---

## Codebase Stats (2025-11-24)

- ~14,107 LOC across 142 TypeScript files
- 57 permissions across 10 categories
- 4 admin roles (super_admin, ol_admin, ol_editor, support)

---

*Extracted: 2025-11-26 | Sources: README.md, CONTEXT-MAP.md*
