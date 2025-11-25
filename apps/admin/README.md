# Ozean Licht Admin Dashboard

**Admin interface for Ozean Licht platform**

**Status**: Phase 1 - Foundation | **Port**: 9200 | **Stack**: Next.js 14 + NextAuth v5 + MCP Gateway

---

## Overview

Admin dashboard for the Ozean Licht platform (Austrian association/Verein):

- **Platform Management** - Course management, content publishing, member tracking
- **Access Control** - User management, RBAC, permissions matrix
- **System Administration** - Health monitoring, configuration, audit logs
- **Analytics** - Platform insights, member engagement, content performance (future)

**Note**: Kids Ascension has its own separate admin dashboard with distinct branding and features.

---

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

---

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
├── /content                        # Content Management (Phase 2)
│   ├── /courses                   # Course management
│   ├── /lessons                   # Lesson management
│   └── /media                     # Media library
├── /members                        # Member Management (Phase 2)
│   ├── /overview                  # Member overview
│   ├── /subscriptions             # Subscription management
│   └── /engagement                # Engagement tracking
└── /analytics                      # Analytics (Phase 3)
    ├── /overview                  # Platform overview
    ├── /content                   # Content performance
    └── /members                   # Member insights
```

**See [docs/routes.md](./docs/routes.md) for complete route documentation.**

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

**See [docs/architecture.md](./docs/architecture.md) for detailed architecture.**

---

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

# For content management features
app/dashboard/content/[feature]/page.tsx

# For member management features
app/dashboard/members/[feature]/page.tsx
```

#### 2. Add Navigation
Update `components/dashboard/Sidebar.tsx` with new route

#### 3. Implement RBAC
```typescript
import { requireAnyRole } from '@/lib/auth-utils'

export default async function MyPage() {
  await requireAnyRole(['super_admin', 'ol_admin'])
  // ... rest of page
}
```

#### 4. Add Database Operations
```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

const client = new MCPGatewayClientWithQueries({
  database: 'ozean-licht-db',
})

const data = await client.query('SELECT ...')
```

---

## Role-Based Access Control (RBAC)

### Roles

- **super_admin**: Full system access across all platforms, can manage roles
- **ol_admin**: Ozean Licht admin, full platform access
- **ol_editor**: Content editor, can manage courses and content
- **support**: Read-only support access

### Permission Checking

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

---

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

---

## Documentation

**Core Docs:**
- **[Context Map](./CONTEXT-MAP.md) 🤖 - Single Source of Truth for agent navigation [START HERE]**
- [Route Map](./docs/routes.md) - Complete route documentation
- [Architecture](./docs/architecture.md) - High-level architecture overview
- [Developer Guide](./DEVELOPER_GUIDE.md) - Quick patterns and troubleshooting
- [AI Agent Guide](./.claude/CLAUDE.md) - AI agent development patterns

**Design System:**
- [Ozean Licht Design System](../../design-system.md) - Official design guidelines
- [Shared UI Components](../../shared/ui/README.md) - Component library

**API References:**
- [MCP Client API](./lib/mcp-client/README.md) - Database operations (if exists)

**Specs & Plans:**
- [Specs Directory](./specs/) - Implementation specifications
- [Decisions](./docs/decisions/) - Architecture decision records

---

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

---

## Contributing

1. Review [docs/architecture.md](./docs/architecture.md)
2. Check [specs/](./specs/) for planned features
3. Follow patterns in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) or [.claude/CLAUDE.md](./.claude/CLAUDE.md)
4. Follow [Ozean Licht Design System](../../design-system.md) guidelines
5. Create feature branch: `feature/description`
6. Write tests for new features
7. Submit PR with clear description

---

## Recent Changes

### Architectural Decision (2025-11-24)
- ✅ **Separation of Concerns**: Kids Ascension now has its own separate admin dashboard
- ✅ This dashboard is now exclusively for Ozean Licht platform
- ✅ Removed `ka_admin` role and Kids Ascension-specific features
- ✅ Simplified RBAC to focus on Ozean Licht roles only

### Code Cleanup (Spec 0.1)
- ❌ Demo pages: `components-demo`, `examples/data-table`
- ⏸️ Storage feature deferred to `_deferred/` (not MVP critical)
- ✂️ MCP client simplified (merged config, reduced errors)

### Routes Reorganized
- ✅ Users: `/dashboard/users` → `/dashboard/access/users`
- ✅ Permissions: `/dashboard/permissions` → `/dashboard/access/permissions`
- ✅ Health: `/dashboard/health` → `/dashboard/system/health`

### Navigation Updated
- ✅ Sidebar organized by functional areas (Overview, Access, System, Content, Members, Analytics)
- ✅ Removed Examples section
- ✅ Clean, MVP-focused structure

**See [docs/decisions/cleanup-summary.md](./docs/decisions/cleanup-summary.md) for full details.**

---

## Success Criteria

**MVP (Phase 1):**
- [x] Authentication with NextAuth v5
- [x] RBAC system (Ozean Licht roles)
- [x] User management interface
- [x] System health monitoring
- [x] Permissions matrix UI

**Phase 2 - Content Management:**
- [ ] Course management interface
- [ ] Lesson editor
- [ ] Media library integration
- [ ] Content publishing workflow

**Phase 3 - Member Management:**
- [ ] Member overview dashboard
- [ ] Subscription management
- [ ] Engagement tracking
- [ ] Communication tools

**Phase 4 - Analytics:**
- [ ] Platform analytics dashboard
- [ ] Content performance metrics
- [ ] Member insights
- [ ] Revenue tracking

---

## License

**UNLICENSED** - Private package for Ozean Licht Ecosystem

---

**Last Updated**: 2025-11-24
**Status**: Phase 1 - Foundation Complete
**Maintainer**: Ozean Licht Platform Team + Autonomous Agents
**Scope**: Ozean Licht platform only (Kids Ascension has separate admin dashboard)

---

<!-- CONTEXT-MAP:START - Auto-generated navigation map. Edit the content, keep the markers. -->

## Navigation

> Last mapped: 2025-11-25

### Key Files

| File | Purpose |
|------|--------|
| `jest.config.js` | Configuration |
| `middleware.ts` | Request middleware |
| `next-env.d.ts` | _add description_ |
| `next.config.js` | Configuration |
| `postcss.config.js` | Configuration |
| `tailwind.config.js` | Configuration |
| `test-spec-1.1.js` | _add description_ |

### Directories

| Directory | Purpose | Navigate |
|-----------|---------|----------|
| `app/` | Next.js app router | [README](./app/) |
| `lib/` | Core libraries | [README](./lib/) |
| `components/` | UI components | [README](./components/) |
| `docs/` | Documentation | [README](./docs/) |
| `hooks/` | React hooks | [README](./hooks/) |
| `migrations/` | Database migrations | [README](./migrations/) |
| `public/` | Public files | 0 files |
| `scripts/` | Build/utility scripts | [README](./scripts/) |
| `specs/` | Specifications | 10 files |
| `tests/` | Test files | [README](./tests/) |
| `types/` | Type definitions | [README](./types/) |

<!-- CONTEXT-MAP:END -->