# Admin Dashboard

**Unified admin interface for Kids Ascension and Ozean Licht platforms**

**Status**: Phase 1 - Foundation | **Port**: 9200 | **Stack**: Next.js 14 + NextAuth v5 + MCP Gateway

---

## Overview

Centralized admin dashboard serving two legally separate Austrian associations (Vereine):

- **Ecosystem Admin** - Cross-platform user management, system health, RBAC
- **Ozean Licht Admin** - Course management, member tracking, payment monitoring (future)
- **Kids Ascension Admin** - Video content, review workflows, classroom management (future)

Both platforms share authentication (`shared_users_db`) but maintain separate operational databases.

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

**Test Credentials:**
- Email: `admin@ozean-licht.dev`
- Password: `admin123`
- Role: `super_admin`

## Route Structure

```
/dashboard                          # Home/overview
├── /access                         # Access Management
│   ├── /users                     # User list & detail
│   ├── /users/[id]                # User profile
│   ├── /users/[id]/permissions    # User permissions
│   └── /permissions               # System permissions
├── /system                         # System Administration
│   └── /health                    # Health monitoring
└── /platforms                      # Platform-specific admin (future)
    ├── /kids-ascension            # KA admin (Phase 2)
    └── /ozean-licht               # OL admin (Phase 2)
```

**See [docs/routes.md](./docs/routes.md) for complete route documentation.**

## Technology Stack

**Frontend**
- Next.js 14 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui

**Backend**
- NextAuth v5 (authentication)
- MCP Gateway (database operations)
- PostgreSQL (multi-tenant: `shared_users_db`, `ozean_licht_db`, `kids_ascension_db`)

**Infrastructure**
- Coolify (deployment)
- MinIO → Cloudflare R2 → Stream (storage pipeline)

**See [docs/architecture.md](./docs/architecture.md) for detailed architecture.**

## Development

### Running Locally
```bash
# Admin dashboard
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Tests
pnpm test
pnpm test:watch
```

### Adding New Features

#### 1. Create Page
```bash
# For access management features
app/dashboard/access/[feature]/page.tsx

# For system features
app/dashboard/system/[feature]/page.tsx
```

#### 2. Add Navigation
Update `components/dashboard/Sidebar.tsx` with new route

#### 3. Implement RBAC
```typescript
import { requireAnyRole } from '@/lib/auth-utils'

export default async function MyPage() {
  await requireAnyRole(['super_admin', 'ka_admin'])
  // ... rest of page
}
```

#### 4. Add Database Operations
```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

const client = new MCPGatewayClientWithQueries({
  database: 'shared-users-db',
})

const data = await client.query('SELECT ...')
```

## Role-Based Access Control (RBAC)

### Roles

- **super_admin**: Full system access, can manage roles
- **ka_admin**: Kids Ascension admin, full KA access
- **ol_admin**: Ozean Licht admin, full OL access
- **support**: Read-only support access

### Permission Checking

```typescript
// Server components
import { requireAnyRole } from '@/lib/auth-utils'
await requireAnyRole(['super_admin', 'ka_admin'])

// Client components
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
const canEdit = session?.user?.adminRole === 'super_admin'

// Manual permission check
import { hasPermission } from '@/lib/auth-utils'
const canDelete = hasPermission(session.user.permissions, 'users.delete')
```

## MCP Gateway Integration

All database operations go through MCP Gateway:

```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

// Initialize client
const client = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db',
})

// Query examples
const users = await client.listAdminUsers()
const user = await client.getAdminUserById(userId)
await client.updateAdminUser(userId, { adminRole: 'ka_admin' })
await client.createAuditLog({ action: 'user.update', ... })
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- users

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Test Structure
```
tests/
├── unit/              # Unit tests
│   ├── mcp-client/   # MCP client tests
│   └── rbac/         # RBAC utility tests
├── integration/       # Integration tests
│   ├── api/          # API endpoint tests
│   └── pages/        # Page rendering tests
└── e2e/              # End-to-end tests
```

## Deployment

### Via Coolify

```bash
# Push to main branch
git push origin main

# Coolify auto-deploys
# Monitor: http://coolify.ozean-licht.dev:8000
```

### Manual Deployment

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Environment Variables (Production)

```bash
NEXTAUTH_URL=https://admin.ozean-licht.dev
NEXTAUTH_SECRET=<production-secret>
MCP_GATEWAY_URL=https://mcp.ozean-licht.dev
NODE_ENV=production
```

## Documentation

**Core Docs:**
- **[Context Map](./CONTEXT-MAP.md) 🤖 - Single Source of Truth for agent navigation [START HERE]**
- [Route Map](./docs/routes.md) - Complete route documentation
- [Architecture](./docs/architecture.md) - High-level architecture overview
- [Developer Guide](./DEVELOPER_GUIDE.md) - Quick patterns and troubleshooting
- [AI Agent Guide](./.claude/CLAUDE.md) - AI agent development patterns

**API References:**
- [MCP Client API](./lib/mcp-client/README.md) - Database operations (if exists)
- [Design System](./docs/design-system.md) - UI component library

**Specs & Plans:**
- [Specs Directory](./specs/) - Implementation specifications
- [Decisions](./docs/decisions/) - Architecture decision records

## Troubleshooting

### MCP Gateway Connection Failed
```bash
# Ensure MCP Gateway is running
cd tools/mcp-gateway
npm run dev

# Check connection
curl http://localhost:8100/health
```

### Authentication Issues
```bash
# Check environment variables
cat .env.local | grep NEXTAUTH

# Verify database connection
# Check MCP Gateway logs
```

### Build Errors
```bash
# Clean and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

## Contributing

1. Review [docs/architecture.md](./docs/architecture.md)
2. Check [specs/](./specs/) for planned features
3. Follow patterns in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) or [.claude/CLAUDE.md](./.claude/CLAUDE.md)
4. Create feature branch: `feature/description`
5. Write tests for new features
6. Submit PR with clear description

## Recent Changes (Spec 0.1 Cleanup)

### Code Removed (~700 LOC)
- ❌ Demo pages: `components-demo`, `examples/data-table`
- ⏸️ Storage feature deferred to `_deferred/` (not MVP critical)
- ✂️ MCP client simplified (merged config, reduced errors)

### Routes Reorganized
- ✅ Users: `/dashboard/users` → `/dashboard/access/users`
- ✅ Permissions: `/dashboard/permissions` → `/dashboard/access/permissions`
- ✅ Health: `/dashboard/health` → `/dashboard/system/health`

### Navigation Updated
- ✅ Sidebar organized by functional areas (Overview, Access, System, Platforms)
- ✅ Removed Examples section
- ✅ Clean, MVP-focused structure

**See [docs/decisions/cleanup-summary.md](./docs/decisions/cleanup-summary.md) for full details.**

## Success Criteria

**MVP (Phase 1):**
- [x] Authentication with NextAuth v5
- [x] RBAC system (4 roles)
- [x] User management interface
- [x] System health monitoring
- [x] Permissions matrix UI
- [ ] Ozean Licht critical features (Phase 2)
- [ ] Kids Ascension critical features (Phase 3)

## License

**UNLICENSED** - Private package for Ozean Licht Ecosystem

---

**Last Updated**: 2025-11-11
**Status**: Phase 1 - Foundation Complete
**Maintainer**: Platform Team + Autonomous Agents
