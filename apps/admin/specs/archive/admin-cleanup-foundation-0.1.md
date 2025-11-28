# Plan: Spec 0.1 - Admin Dashboard Foundation Cleanup & Agentic Navigation

## Task Description

Perform comprehensive cleanup of the `/admin` app to establish a clean, agent-friendly foundation before implementing features in Specs 1.1+. This includes:

1. **Code Cleanup**: Remove demo/example pages, evaluate storage feature necessity, clean build artifacts
2. **Structural Optimization**: Simplify MCP client abstractions, organize components logically
3. **Agentic Navigation**: Subdivide dashboard routes into clear functional areas optimized for AI agent navigation
4. **Documentation Rewrite**: Create new README.md and CLAUDE.md reflecting the simplified, agent-optimized structure

This is the **critical foundation spec** that must be completed before Specs 1.1 (Layout), 1.4 (RBAC), and 1.5 (User Management).

## Objective

Establish a clean, maintainable, and agent-friendly admin dashboard foundation by:

- Removing 500+ LOC of demo/example code
- Evaluating and documenting storage feature status (keep/defer/remove)
- Simplifying MCP client from 2060 LOC across 7 files to streamlined structure
- Organizing routes into 5 clear functional areas for agent navigation
- Creating comprehensive navigation documentation for AI agents
- Rewriting README.md and CLAUDE.md to reflect new structure and patterns

## Problem Statement

### Current Issues (from Complexity Analysis Report)

1. **Demo/Example Bloat**: `components-demo` and `examples/data-table` pages add complexity without production value
2. **Storage Feature Uncertainty**: 1500+ LOC storage management system with unclear MVP criticality
3. **MCP Client Over-Engineering**: 2060 LOC across 7 files with heavy abstractions (transactions, error hierarchies)
4. **Lack of Agent-Friendly Structure**: Routes not organized for AI agent comprehension
5. **Outdated Documentation**: README and CLAUDE.md don't reflect current architecture or agentic patterns

### Impact on Development

- **Cognitive Load**: Developers/agents must navigate demo code alongside production features
- **Maintenance Burden**: Extra features require ongoing maintenance and testing
- **Slower Onboarding**: Complex abstractions slow down understanding
- **Agent Confusion**: No clear route structure documentation for AI navigation

## Solution Approach

### Phase 1: Cleanup (Remove Non-Essential Code)
Remove demo pages, evaluate storage, clean artifacts to reduce codebase by ~500-1000 LOC

### Phase 2: Structural Optimization
Simplify MCP client abstractions while maintaining functionality, organize components by domain

### Phase 3: Agentic Route Organization
Subdivide dashboard into 5 functional areas:
- **Core** (`/dashboard`) - Home, overview, general admin
- **Access** (`/dashboard/access`) - Users, permissions, roles, RBAC
- **System** (`/dashboard/system`) - Health, storage, monitoring
- **Platforms** (`/dashboard/platforms`) - Platform-specific admin (future: KA, OL sections)
- **API** (`/api`) - REST endpoints

### Phase 4: Documentation Rewrite
Create comprehensive agent-friendly documentation with route maps, patterns, and navigation guides

## Relevant Files

### Files to Modify

#### Cleanup Targets
- `app/dashboard/components-demo/page.tsx` - **DELETE** (demo page)
- `app/dashboard/examples/data-table/page.tsx` - **DELETE** (example page)
- `app/dashboard/examples/data-table/columns.tsx` - **DELETE** (example code)
- `app/dashboard/storage/page.tsx` - **EVALUATE** (decide keep/defer/remove)
- `app/api/storage/{delete,metadata,stats,upload}/route.ts` - **EVALUATE** (4 files)
- `components/storage/{FileList,FileUploadForm,StorageStats}.tsx` - **EVALUATE** (3 files)
- `lib/mcp-client/storage.ts` - **EVALUATE**

#### MCP Client Simplification
- `lib/mcp-client/client.ts` - **REFACTOR** (base client - 400+ LOC)
- `lib/mcp-client/queries.ts` - **REFACTOR** (query extensions)
- `lib/mcp-client/storage.ts` - **EVALUATE** (storage ops)
- `lib/mcp-client/health.ts` - **KEEP** (health checks)
- `lib/mcp-client/config.ts` - **MERGE** (into client.ts)
- `lib/mcp-client/errors.ts` - **SIMPLIFY** (5 error types → 2-3)
- `lib/mcp-client/index.ts` - **UPDATE** (exports)

#### Route Reorganization (Move Files)
- `app/dashboard/users/**` → `app/dashboard/access/users/**`
- `app/dashboard/permissions/page.tsx` → `app/dashboard/access/permissions/page.tsx`
- `app/dashboard/health/page.tsx` → `app/dashboard/system/health/page.tsx`
- Keep `app/dashboard/page.tsx` as home/overview

#### Navigation & Layout
- `app/dashboard/layout-client.tsx` - **UPDATE** (sidebar nav with new routes)
- `components/dashboard/Sidebar.tsx` - **UPDATE** (if exists, organize by functional areas)

### New Files

#### Documentation
- **`README.md`** - Complete rewrite with new structure, setup, and agentic patterns
- **`.claude/CLAUDE.md`** - Rewrite with simplified patterns and route navigation
- **`docs/ROUTES.md`** - NEW: Agent-friendly route map and navigation guide
- **`docs/ARCHITECTURE.md`** - NEW: High-level architecture overview for agents

#### Route Organization
- `app/dashboard/access/layout.tsx` - NEW: Access management section layout
- `app/dashboard/system/layout.tsx` - NEW: System admin section layout
- `app/dashboard/platforms/layout.tsx` - NEW: Platform-specific admin (future)

#### Decision Documentation
- `docs/decisions/storage-feature-status.md` - NEW: Document storage feature decision
- `docs/decisions/mcp-client-simplification.md` - NEW: Document MCP client changes

## Implementation Phases

### Phase 1: Foundation Cleanup (2 hours)
1. Remove demo/example pages
2. Evaluate storage feature (keep/defer/remove decision)
3. Clean build artifacts (.next, ensure .gitignore)
4. Document decisions in `docs/decisions/`

### Phase 2: MCP Client Simplification (3 hours)
1. Consolidate config.ts into client.ts
2. Simplify error hierarchy (5 types → 2-3)
3. Keep transaction wrapper only if actively used
4. Update tests to match simplified structure

### Phase 3: Route Reorganization (3 hours)
1. Create functional area directories (`access/`, `system/`, `platforms/`)
2. Move existing routes to new structure
3. Update all imports and links
4. Update navigation/sidebar with new structure
5. Test all routes work correctly

### Phase 4: Documentation Rewrite (2 hours)
1. Create `docs/ROUTES.md` with route map
2. Create `docs/ARCHITECTURE.md` with high-level overview
3. Rewrite `README.md` with new structure and setup
4. Rewrite `.claude/CLAUDE.md` with agentic patterns
5. Add inline documentation to key files

## Step by Step Tasks

### 1. Evaluate Storage Feature Criticality

**Decision Point**: Is storage management critical for MVP day-1?

- Read through storage feature implementation
- Check for dependencies in other parts of codebase
- Determine if used by product team or planned for Phase 1
- Document decision in `docs/decisions/storage-feature-status.md`

**Options:**
- **KEEP**: Storage is MVP-critical → Move to `app/dashboard/system/storage/`
- **DEFER**: Storage is post-MVP → Move entire feature to `app/dashboard/_deferred/storage/`
- **REMOVE**: Storage not needed → Delete all storage-related files

**Files Affected:**
```
app/dashboard/storage/page.tsx
app/api/storage/{delete,metadata,stats,upload}/route.ts (4 files)
components/storage/{FileList,FileUploadForm,StorageStats}.tsx (3 files)
lib/mcp-client/storage.ts
```

**Create decision document:**
```markdown
# Storage Feature Status Decision

**Decision Date**: 2025-11-11
**Decision**: [KEEP | DEFER | REMOVE]

## Rationale
[Explain why this decision was made]

## Impact
- Files affected: X
- LOC removed/moved: Y
- Dependencies: [List any dependencies]

## Action Taken
[Describe what was done]
```

### 2. Remove Demo and Example Pages

- Delete `app/dashboard/components-demo/page.tsx`
- Delete `app/dashboard/examples/` directory (data-table example)
- Remove any references in navigation/sidebar
- Verify no other code imports from these files

**Verification:**
```bash
# Search for imports of deleted files
grep -r "components-demo" apps/admin/
grep -r "examples/data-table" apps/admin/
```

**Expected Outcome**: -200+ LOC removed, cleaner dashboard navigation

### 3. Clean Build Artifacts

- Verify `.next/` is in `.gitignore`
- Verify `node_modules/` is in `.gitignore`
- Add `.gitignore` entries if missing:
  ```
  # Build outputs
  .next/
  dist/
  build/

  # Dependencies
  node_modules/

  # Development
  .DS_Store
  Thumbs.db
  *.log
  ```

- Optional: Clean `.next/` directory for fresh build
  ```bash
  rm -rf apps/admin/.next
  ```

### 4. Simplify MCP Client Structure

**Goal**: Consolidate from 7 files (2060 LOC) to 4-5 files (~1600 LOC)

#### Step 4.1: Merge config.ts into client.ts

- Copy configuration logic from `lib/mcp-client/config.ts` into `lib/mcp-client/client.ts`
- Move default config constants to top of client.ts
- Update imports in other files
- Delete `lib/mcp-client/config.ts`

#### Step 4.2: Simplify Error Hierarchy

**Current**: 5 error types in `errors.ts`
```typescript
MCPError (base)
MCPConnectionError
MCPTimeoutError
MCPValidationError
MCPServerError
```

**Simplified** (2-3 types):
```typescript
MCPError (base)
MCPClientError (4xx errors, validation, bad requests)
MCPServerError (5xx errors, connection, timeout)
```

- Update `lib/mcp-client/errors.ts` with simplified hierarchy
- Update error handling in `client.ts` and `queries.ts`
- Run tests to ensure error handling still works

#### Step 4.3: Evaluate Transaction Wrapper

- Check if transaction methods in `client.ts` are actually used
  ```bash
  grep -r "beginTransaction\|commitTransaction\|rollbackTransaction" apps/admin/
  ```
- If NOT used: Remove transaction methods and comments
- If used: Keep but add comment explaining usage

#### Step 4.4: Update Index Exports

- Update `lib/mcp-client/index.ts` with new exports
- Ensure all public APIs remain accessible
- Update any imports in other files

**Verification:**
```bash
# Type check
cd apps/admin
npm run typecheck

# Run MCP client tests
npm test -- mcp-client
```

**Expected Outcome**: ~400-500 LOC reduction, simpler abstractions, same functionality

### 5. Create Functional Route Directories

Create new directory structure for agentic navigation:

```bash
mkdir -p apps/admin/app/dashboard/access
mkdir -p apps/admin/app/dashboard/system
mkdir -p apps/admin/app/dashboard/platforms
```

Create layout files for each section:

**`app/dashboard/access/layout.tsx`**
```typescript
export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb showing: Dashboard > Access Management */}
      {children}
    </div>
  )
}
```

**`app/dashboard/system/layout.tsx`**
```typescript
export default function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb showing: Dashboard > System */}
      {children}
    </div>
  )
}
```

**`app/dashboard/platforms/layout.tsx`**
```typescript
export default function PlatformsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb showing: Dashboard > Platforms */}
      {children}
    </div>
  )
}
```

### 6. Move Routes to Functional Areas

#### Move Users to Access
```bash
git mv apps/admin/app/dashboard/users apps/admin/app/dashboard/access/users
```

Update all imports referencing `/dashboard/users` to `/dashboard/access/users`

#### Move Permissions to Access
```bash
git mv apps/admin/app/dashboard/permissions apps/admin/app/dashboard/access/permissions
```

Update imports for permissions page

#### Move Health to System
```bash
git mv apps/admin/app/dashboard/health apps/admin/app/dashboard/system/health
```

Update imports and navigation links

#### Move Storage (if keeping)
```bash
# If KEEP decision from Step 1
git mv apps/admin/app/dashboard/storage apps/admin/app/dashboard/system/storage
```

**Verification After Each Move:**
```bash
# Check for broken imports
npm run typecheck

# Test affected routes
npm run dev
# Navigate to moved routes and verify they work
```

### 7. Update Navigation/Sidebar

Update `app/dashboard/layout-client.tsx` sidebar navigation to reflect new structure:

```typescript
const navigationSections = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ],
  },
  {
    name: 'Access Management',
    items: [
      { name: 'Users', href: '/dashboard/access/users', icon: UsersIcon },
      { name: 'Permissions', href: '/dashboard/access/permissions', icon: ShieldIcon },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Health', href: '/dashboard/system/health', icon: ActivityIcon },
      { name: 'Storage', href: '/dashboard/system/storage', icon: DatabaseIcon }, // if keeping
    ],
  },
  {
    name: 'Platforms',
    items: [
      // Future: Kids Ascension, Ozean Licht sections
    ],
  },
]
```

Update navigation to use sections for clear grouping

### 8. Create Agent-Friendly Route Documentation

**Create `docs/ROUTES.md`:**

```markdown
# Admin Dashboard Route Map

**Last Updated**: 2025-11-11

This document provides a comprehensive map of all routes in the admin dashboard, organized for easy AI agent navigation.

## Route Structure Overview

```
/admin
├── /dashboard              # Core dashboard
│   ├── /access            # Access Management (users, permissions, roles)
│   ├── /system            # System Administration (health, storage, monitoring)
│   └── /platforms         # Platform-specific admin (future: KA, OL)
└── /api                   # REST API endpoints
```

## Core Routes

### `/dashboard`
- **Purpose**: Admin dashboard home/overview
- **File**: `app/dashboard/page.tsx`
- **Auth**: Required (any admin role)
- **RBAC**: All authenticated admins
- **Key Features**:
  - User welcome and role display
  - Permission summary
  - Quick access cards

## Access Management Routes

### `/dashboard/access/users`
- **Purpose**: User management list
- **File**: `app/dashboard/access/users/page.tsx`
- **Auth**: Required (super_admin, ka_admin, ol_admin)
- **RBAC**: Blocked for support role
- **Key Features**:
  - Searchable user list with filters
  - Entity badges (KA, OL)
  - Email verification status
  - Server-side pagination

### `/dashboard/access/users/[id]`
- **Purpose**: User detail view
- **File**: `app/dashboard/access/users/[id]/page.tsx`
- **Auth**: Required (super_admin, ka_admin, ol_admin)
- **RBAC**: Blocked for support role
- **Key Features**:
  - User information card
  - Platform access details
  - OAuth provider connections

### `/dashboard/access/users/[id]/permissions`
- **Purpose**: User-specific permission editor
- **File**: `app/dashboard/access/users/[id]/permissions/page.tsx`
- **Auth**: Required (super_admin only)
- **RBAC**: Super admin only
- **Key Features**:
  - Permission matrix
  - Grant/revoke permissions
  - Permission inheritance display

### `/dashboard/access/permissions`
- **Purpose**: System-wide permissions management
- **File**: `app/dashboard/access/permissions/page.tsx`
- **Auth**: Required (super_admin only)
- **RBAC**: Super admin only
- **Key Features**:
  - Permission definitions
  - Role-permission mappings
  - Create/edit permissions

## System Routes

### `/dashboard/system/health`
- **Purpose**: System health monitoring
- **File**: `app/dashboard/system/health/page.tsx`
- **Auth**: Required (all admin roles)
- **RBAC**: Accessible to all admins
- **Key Features**:
  - Database connection status
  - MCP Gateway health
  - Server metrics
  - Real-time monitoring

### `/dashboard/system/storage` (if kept)
- **Purpose**: MinIO storage management
- **File**: `app/dashboard/system/storage/page.tsx`
- **Auth**: Required (super_admin, ka_admin, ol_admin)
- **RBAC**: Varies by implementation
- **Key Features**:
  - File upload/download
  - Storage statistics
  - Bucket management

## API Routes

### `/api/admin-users/[id]`
- **Methods**: GET, PATCH
- **Purpose**: Admin user CRUD operations
- **Auth**: Required
- **RBAC**:
  - GET: All admin roles
  - PATCH: super_admin only

### `/api/admin-users/[id]/permissions`
- **Methods**: GET, PATCH
- **Purpose**: User permission management
- **Auth**: Required (super_admin only)

### `/api/permissions/check`
- **Methods**: POST
- **Purpose**: Check if user has specific permission
- **Auth**: Required

### `/api/permissions/matrix`
- **Methods**: GET
- **Purpose**: Retrieve full permission matrix
- **Auth**: Required (super_admin only)

## Navigation Patterns for AI Agents

### Finding User Management
1. Start at `/dashboard`
2. Navigate to `/dashboard/access/users`
3. Search/filter as needed
4. Select user → `/dashboard/access/users/[id]`

### Checking System Health
1. Start at `/dashboard`
2. Navigate to `/dashboard/system/health`
3. View real-time metrics

### Managing Permissions
1. Start at `/dashboard`
2. Navigate to `/dashboard/access/permissions` (system-wide)
3. OR navigate to `/dashboard/access/users/[id]/permissions` (user-specific)

## Route Naming Conventions

- **Plural nouns** for list pages: `/users`, `/permissions`
- **Dynamic segments** for detail pages: `/users/[id]`, `/users/[id]/permissions`
- **Action verbs** for specific operations: `/permissions/check`, `/storage/upload`
- **Nested resources** follow parent hierarchy: `/users/[id]/permissions`

## Future Routes (Planned)

### Ozean Licht Platform
- `/dashboard/platforms/ozean-licht/courses`
- `/dashboard/platforms/ozean-licht/members`
- `/dashboard/platforms/ozean-licht/payments`

### Kids Ascension Platform
- `/dashboard/platforms/kids-ascension/videos`
- `/dashboard/platforms/kids-ascension/reviews`
- `/dashboard/platforms/kids-ascension/classrooms`

## Route Discovery Commands

```bash
# List all pages
find apps/admin/app -name "page.tsx" -type f

# List all API routes
find apps/admin/app/api -name "route.ts" -type f

# Find routes with authentication
grep -r "requireAuth\|requireAnyRole" apps/admin/app/dashboard
```
```

### 9. Create Architecture Documentation

**Create `docs/ARCHITECTURE.md`:**

```markdown
# Admin Dashboard Architecture

**Last Updated**: 2025-11-11

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
- **Access Method**: MCP Gateway (unified API)
- **Direct Access**: Via `lib/mcp-client/` for complex queries
- **Databases**:
  - `shared_users_db` - Authentication, admin users
  - `kids_ascension_db` - KA platform data
  - `ozean_licht_db` - OL platform data

### API Layer
- **MCP Gateway**: Port 8100 (unified service interface)
- **Client Library**: `lib/mcp-client/` (simplified structure)
- **REST API**: Next.js API routes (`app/api/`)

## Core Abstractions

### 1. MCP Gateway Client

**Purpose**: Unified interface for all database operations

**Structure** (simplified):
```
lib/mcp-client/
├── client.ts      # Base client + config (consolidated)
├── queries.ts     # Query extensions (admin users, permissions)
├── health.ts      # Health check operations
├── storage.ts     # Storage operations (if kept)
├── errors.ts      # Error handling (simplified to 2-3 types)
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
- `lib/rbac/` - RBAC utilities (if implemented)

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
├── storage/            # Storage components (if kept)
└── ui/                 # Base UI components (shadcn/ui)
```

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
```

### 10. Rewrite README.md

**Replace `apps/admin/README.md` with:**

```markdown
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
│   ├── /health                    # Health monitoring
│   └── /storage                   # Storage management (if enabled)
└── /platforms                      # Platform-specific admin (future)
    ├── /kids-ascension            # KA admin (Phase 2)
    └── /ozean-licht               # OL admin (Phase 2)
```

**See [docs/ROUTES.md](./docs/ROUTES.md) for complete route documentation.**

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

**See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture.**

## Development

### Running Locally
```bash
# Admin dashboard
pnpm dev

# With MCP Gateway
pnpm dev:with-gateway

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
Update `app/dashboard/layout-client.tsx` with new route

#### 3. Implement RBAC
```typescript
import { requireAnyRole } from '@/lib/rbac/utils'

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
import { requireAnyRole } from '@/lib/rbac/utils'
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

**See [lib/mcp-client/README.md](./lib/mcp-client/README.md) for full API.**

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
- [Route Map](./docs/ROUTES.md) - Complete route documentation
- [Architecture](./docs/ARCHITECTURE.md) - High-level architecture overview
- [Developer Guide](./.claude/CLAUDE.md) - Quick patterns and troubleshooting

**API References:**
- [MCP Client API](./lib/mcp-client/README.md) - Database operations
- [Design System](./design-system.md) - UI component library

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

1. Review [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. Check [specs/](./specs/) for planned features
3. Follow patterns in [.claude/CLAUDE.md](./.claude/CLAUDE.md)
4. Create feature branch: `feature/description`
5. Write tests for new features
6. Submit PR with clear description

## Success Criteria

**MVP (Phase 1):**
- [x] Authentication with NextAuth v5
- [x] RBAC system (4 roles)
- [x] User management interface
- [x] System health monitoring
- [ ] Ozean Licht critical features (Phase 1+)
- [ ] Kids Ascension critical features (Phase 2+)

## License

**UNLICENSED** - Private package for Ozean Licht Ecosystem

---

**Last Updated**: 2025-11-11
**Status**: Phase 1 - Foundation Complete
**Maintainer**: Platform Team + Autonomous Agents
```

### 11. Rewrite .claude/CLAUDE.md

**Replace `apps/admin/.claude/CLAUDE.md` with:**

```markdown
# Admin Dashboard - AI Agent Development Guide

**Context**: Ozean Licht Ecosystem Admin Dashboard
**Stack**: Next.js 14 + NextAuth v5 + TypeScript + MCP Gateway + Tailwind

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
├── /system      # Health monitoring, storage, configuration
└── /platforms   # Platform-specific admin (future: KA, OL)
```

**When implementing features:**
- **User/permission features** → Place in `/dashboard/access/`
- **System/infrastructure features** → Place in `/dashboard/system/`
- **Platform-specific features** → Place in `/dashboard/platforms/[platform]/`

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
import { requireAnyRole } from '@/lib/rbac/utils'
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' })

export default async function UsersPage() {
  // ALWAYS check auth first
  await requireAnyRole(['super_admin', 'ka_admin', 'ol_admin'])

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

### 3. MCP Gateway Database Operations

**ALWAYS use MCP Gateway client** - never direct database access:

```typescript
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client'

// Initialize with target database
const client = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'shared-users-db', // or 'kids-ascension-db', 'ozean-licht-db'
})

// Query operations
const users = await client.listAdminUsers()
const user = await client.getAdminUserById(userId)

// Mutations
await client.updateAdminUser(userId, { adminRole: 'ka_admin' })
await client.deleteAdminUser(userId)

// Audit logging
await client.createAuditLog({
  adminUserId: session.user.adminUserId,
  action: 'user.update',
  entityType: 'admin_users',
  entityId: userId,
  metadata: { oldRole, newRole },
})
```

### 4. RBAC Enforcement

**Route protection (middleware)** - automatic for `/dashboard/*`:
```typescript
// middleware.ts already protects all dashboard routes
// No action needed - just works
```

**Page-level protection:**
```typescript
import { requireAnyRole } from '@/lib/rbac/utils'

export default async function MyPage() {
  // Redirect if user doesn't have required role
  await requireAnyRole(['super_admin', 'ka_admin'])

  // ... rest of page
}
```

**Component-level checks:**
```typescript
import { useSession } from 'next-auth/react'

export function EditButton() {
  const { data: session } = useSession()

  // Only show to super_admin
  if (session?.user?.adminRole !== 'super_admin') {
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
  adminRole: z.enum(['super_admin', 'ka_admin', 'ol_admin', 'support']),
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

  // 2. Check permissions
  if (session.user.adminRole !== 'super_admin') {
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
// Use shadcn/ui base components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Use admin-specific components
import { RoleBadge } from '@/components/rbac/RoleBadge'
import { EntityBadge } from '@/components/rbac/EntityBadge'
import { StatusBadge } from '@/components/admin/status-badge'
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

### Data Tables (if implemented)
```typescript
import { DataTable } from '@/components/tables/DataTable'
import { columns } from './columns'

export function UsersTable({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination="server"
      enableSorting
      enableExport
    />
  )
}
```

---

## Common Tasks

### Task: Add New Page

1. **Determine functional area** (access/system/platforms)
2. **Create page file**:
   ```bash
   touch apps/admin/app/dashboard/[area]/[feature]/page.tsx
   ```
3. **Implement server component** with auth checks
4. **Add to navigation** in `layout-client.tsx`
5. **Update ROUTES.md** with new route documentation

### Task: Add Database Query

1. **Open MCP client queries** (`lib/mcp-client/queries.ts`)
2. **Add new method** to `MCPGatewayClientWithQueries` class
3. **Implement query** using `this.query()` or `this.executeQuery()`
4. **Add TypeScript types** for request/response
5. **Write unit test** in `tests/unit/mcp-client/`

### Task: Add API Endpoint

1. **Create route file**: `app/api/[resource]/route.ts`
2. **Export HTTP method** function (GET, POST, PATCH, DELETE)
3. **Check auth** with `await auth()`
4. **Validate input** with Zod schema
5. **Call MCP client** for database operations
6. **Return JSON** response

### Task: Implement RBAC

1. **Add route protection** in page:
   ```typescript
   await requireAnyRole(['super_admin', 'ka_admin'])
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
- [ ] Sensitive operations (delete, role change) restricted to super_admin
- [ ] User inputs validated with Zod schemas
- [ ] SQL queries parameterized (via MCP client - automatic)
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

### MCP Gateway Connection Failed
```bash
# Start MCP Gateway
cd tools/mcp-gateway
npm run dev

# Check health
curl http://localhost:8100/health
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
- `lib/mcp-client/` - Database operations
- `app/dashboard/layout-client.tsx` - Navigation
- `types/admin.ts` - Admin-specific types

**Documentation:**
- [ROUTES.md](../docs/ROUTES.md) - Route map
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Architecture overview
- [README.md](../README.md) - Setup and quick start

---

**Last Updated**: 2025-11-11
**Purpose**: AI agent development guide
**Audience**: Claude Code, autonomous agents, developers
```

### 12. Verify All Imports and Links

After moving routes, check for broken imports:

```bash
# Type check
cd apps/admin
npm run typecheck

# Check for broken imports
grep -r "from '@/app/dashboard/users'" apps/admin/
grep -r "href=\"/dashboard/users\"" apps/admin/
grep -r "href=\"/dashboard/health\"" apps/admin/

# Update any references to moved routes
# Old: /dashboard/users
# New: /dashboard/access/users
```

**Fix all broken references** before proceeding

### 13. Test All Routes

```bash
# Start dev server
cd apps/admin
npm run dev

# Manual testing checklist
```

**Test each route:**
- [ ] `/dashboard` - Home page loads
- [ ] `/dashboard/access/users` - Users list (moved from /dashboard/users)
- [ ] `/dashboard/access/users/[id]` - User detail
- [ ] `/dashboard/access/permissions` - Permissions page (moved from /dashboard/permissions)
- [ ] `/dashboard/system/health` - Health monitoring (moved from /dashboard/health)
- [ ] `/dashboard/system/storage` - Storage page (if kept)

**Test navigation:**
- [ ] Sidebar links work with new routes
- [ ] Breadcrumbs show correct path
- [ ] Back buttons navigate correctly

**Test RBAC:**
- [ ] super_admin can access all routes
- [ ] ka_admin can access appropriate routes
- [ ] ol_admin can access appropriate routes
- [ ] support role has correct restrictions

### 14. Update .gitignore

Ensure build artifacts are ignored:

```bash
# Check current .gitignore
cat apps/admin/.gitignore

# Add if missing
cat >> apps/admin/.gitignore << 'EOF'

# Build outputs
.next/
dist/
build/
out/

# Dependencies
node_modules/

# Development
.DS_Store
Thumbs.db
*.log
logs/

# Environment
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage/

EOF
```

### 15. Build and Validate

```bash
# Clean build
rm -rf apps/admin/.next

# Build production
cd apps/admin
npm run build

# Should complete without errors
# Check bundle size
npm run analyze  # if analyzer configured
```

**Validation:**
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size reasonable

### 16. Create Decision Documentation

**Create `docs/decisions/cleanup-summary.md`:**

```markdown
# Cleanup Summary - Spec 0.1

**Date**: 2025-11-11
**Status**: Completed

## Actions Taken

### Code Removed
- [ ] Demo pages: components-demo, examples/data-table
- [ ] LOC removed: ~XXX lines

### Storage Feature Decision
- [ ] **Decision**: [KEEP | DEFER | REMOVE]
- [ ] **Rationale**: [Explain]
- [ ] **Files affected**: [List]

### MCP Client Simplification
- [ ] Config merged into client.ts
- [ ] Error types simplified: 5 → 3
- [ ] Transaction wrapper: [KEPT | REMOVED]
- [ ] LOC reduced: ~XXX lines

### Route Reorganization
- [ ] Users moved to /access/users
- [ ] Permissions moved to /access/permissions
- [ ] Health moved to /system/health
- [ ] Storage moved to /system/storage (if kept)

### Documentation Created
- [ ] docs/ROUTES.md
- [ ] docs/ARCHITECTURE.md
- [ ] README.md rewritten
- [ ] .claude/CLAUDE.md rewritten

## Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total LOC | ~8500 | ~7500 | -1000 (-12%) |
| MCP Client LOC | 2060 | ~1600 | -460 (-22%) |
| Demo/Example LOC | 300 | 0 | -300 (-100%) |
| Route Depth | 2 levels | 3 levels | +1 (organized) |

## Next Steps

With foundation clean, proceed with:
1. **Spec 1.1**: Layout & Navigation enhancements
2. **Spec 1.4**: RBAC system implementation
3. **Spec 1.5**: User management features
```

## Testing Strategy

### Unit Tests

**MCP Client**:
- Test simplified client initialization
- Test query methods still work after refactoring
- Test error handling with simplified error types
- Verify transaction methods (if kept)

**Route Structure**:
- Test all route files exist at new locations
- Test imports resolve correctly
- Test navigation links point to correct routes

### Integration Tests

**Authentication Flow**:
- Test login redirects to `/dashboard`
- Test auth protection on all routes
- Test RBAC enforcement on moved routes

**Page Rendering**:
- Test server components render with data
- Test client components hydrate correctly
- Test moved routes maintain functionality

### Manual Testing

**Navigation**:
- Click through all sidebar links
- Verify breadcrumbs show correct paths
- Test back buttons work
- Test deep links work

**RBAC**:
- Login as each role (super_admin, ka_admin, ol_admin, support)
- Verify access to routes matches expectations
- Test unauthorized access redirects correctly

**Functionality**:
- User management still works
- Health monitoring still works
- Permissions page still works
- Storage (if kept) still works

## Acceptance Criteria

### Code Cleanup
- [ ] Demo pages removed (components-demo, examples/data-table)
- [ ] Storage feature evaluated and documented (keep/defer/remove)
- [ ] Build artifacts added to .gitignore
- [ ] No unused code remaining

### MCP Client Simplification
- [ ] Config merged into client.ts (config.ts deleted)
- [ ] Error types simplified from 5 to 2-3
- [ ] Transaction wrapper evaluated (kept or removed)
- [ ] All tests pass after refactoring
- [ ] LOC reduced by ~20-30%

### Route Reorganization
- [ ] Functional areas created (access/, system/, platforms/)
- [ ] Users moved to /access/users
- [ ] Permissions moved to /access/permissions
- [ ] Health moved to /system/health
- [ ] Storage moved to /system/storage (if kept)
- [ ] All imports updated
- [ ] All navigation links updated
- [ ] All routes tested and working

### Documentation
- [ ] docs/ROUTES.md created with complete route map
- [ ] docs/ARCHITECTURE.md created with architecture overview
- [ ] README.md rewritten with new structure
- [ ] .claude/CLAUDE.md rewritten with agentic patterns
- [ ] Decision documents created in docs/decisions/

### Build & Validation
- [ ] TypeScript type check passes (no errors)
- [ ] ESLint passes (no errors)
- [ ] Production build completes successfully
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing complete

### Quality Metrics
- [ ] Total LOC reduced by 500-1000 lines
- [ ] MCP client LOC reduced by 400-500 lines
- [ ] No console errors in browser
- [ ] No 404 errors on routes
- [ ] Performance maintained or improved

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Change to admin directory
cd /opt/ozean-licht-ecosystem/apps/admin

# 1. Type check
npm run typecheck
# Expected: No errors

# 2. Lint check
npm run lint
# Expected: No errors or warnings

# 3. Run tests
npm test
# Expected: All tests pass

# 4. Build production
npm run build
# Expected: Build completes successfully

# 5. Check for broken imports
grep -r "from '@/app/dashboard/users'" . --include="*.ts" --include="*.tsx" | grep -v node_modules
# Expected: No results (should be updated to /access/users)

grep -r "href=\"/dashboard/users\"" . --include="*.tsx" | grep -v node_modules
# Expected: No results (should be updated to /access/users)

# 6. Verify route structure
ls -la app/dashboard/access/
ls -la app/dashboard/system/
ls -la app/dashboard/platforms/
# Expected: Directories exist with moved files

# 7. Check documentation exists
ls -la docs/ROUTES.md
ls -la docs/ARCHITECTURE.md
ls -la docs/decisions/
# Expected: Files exist

# 8. Verify .gitignore
grep ".next" .gitignore
grep "node_modules" .gitignore
grep "logs/" .gitignore
# Expected: All present

# 9. Check MCP client files
ls -la lib/mcp-client/
# Expected: Simplified structure (no config.ts if merged)

# 10. Count LOC (approximate)
find lib/mcp-client -name "*.ts" | xargs wc -l | tail -1
# Expected: ~1600-1700 lines (down from 2060)
```

## Notes

### Dependencies

No new dependencies required. All work uses existing packages:
- Next.js 14
- NextAuth v5
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Breaking Changes

**Route Changes** (breaking for external links):
- `/dashboard/users` → `/dashboard/access/users`
- `/dashboard/permissions` → `/dashboard/access/permissions`
- `/dashboard/health` → `/dashboard/system/health`

**Mitigation**: Add redirects in middleware if external links exist:
```typescript
if (pathname === '/dashboard/users') {
  return NextResponse.redirect(new URL('/dashboard/access/users', request.url))
}
```

### Storage Feature Decision

**Key Questions**:
1. Is storage management used in production currently?
2. Is it planned for Phase 1 deployment?
3. Are there dependencies on storage features?

**Recommendation**:
- **DEFER** to post-MVP if not actively used
- Move to `app/dashboard/_deferred/storage/` for future implementation
- Document in `docs/decisions/storage-feature-status.md`

### MCP Client Refactoring

**Safe Changes**:
- Merge config.ts into client.ts ✅
- Simplify error hierarchy ✅
- Remove unused transaction wrapper ⚠️ (check usage first)

**Risky Changes** (avoid for now):
- Removing query abstractions ❌
- Changing public API signatures ❌
- Removing health checks ❌

### Performance Impact

**Expected Improvements**:
- Smaller bundle size (~200KB reduction from removed demo pages)
- Faster builds (fewer files to process)
- Faster type checking (fewer LOC)

**No Negative Impact**:
- Route reorganization doesn't affect performance
- MCP client simplification maintains same functionality

### Rollback Plan

If issues arise:
1. **Routes**: Revert git moves, restore old navigation
2. **MCP Client**: Restore from git (all changes in single commit)
3. **Documentation**: Old docs preserved in git history

Always commit work in logical chunks for easy rollback.

---

## Related Specs

**Blocked Specs** (wait for this cleanup):
- **Spec 1.1**: Layout & Navigation - Builds on clean route structure
- **Spec 1.4**: RBAC System - Builds on simplified auth patterns
- **Spec 1.5**: User Management - Uses cleaned MCP client and moved routes

**Follow-up Specs** (after Spec 0.1):
- **Spec 1.1**: Can proceed with breadcrumbs on clean routes
- **Spec 1.4**: Can proceed with RBAC on organized structure
- **Spec 1.5**: Can proceed with user management in /access/users

---

## Estimated Effort

**Total: 10-12 hours**

- Phase 1 (Cleanup): 2 hours
- Phase 2 (MCP Simplification): 3 hours
- Phase 3 (Route Reorganization): 3 hours
- Phase 4 (Documentation): 2 hours
- Testing & Validation: 1-2 hours

**Priority**: **P0 (BLOCKER)** - Must complete before Specs 1.1, 1.4, 1.5

---

**Spec Status**: ⚠️ Not Started
**Priority**: P0 (Blocker)
**Estimated Effort**: 10-12 hours
**Dependencies**: None
**Blocks**: Spec 1.1, 1.4, 1.5
**Created**: 2025-11-11
**Target Completion**: Before Phase 1 feature development
