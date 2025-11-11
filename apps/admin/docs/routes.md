# Admin Dashboard Route Map

**Last Updated**: 2025-11-11
**Status**: Phase 1 - Foundation Complete

This document provides a comprehensive map of all routes in the admin dashboard, organized for easy AI agent navigation.

## Route Structure Overview

```
/dashboard
├── /access                # Access Management (users, permissions, roles)
├── /system                # System Administration (health, monitoring)
└── /platforms             # Platform-specific admin (future: KA, OL)
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
  - Quick access cards to main sections

---

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

---

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

---

## Platform Routes (Future)

### `/dashboard/platforms/` (Phase 2+)
**Kids Ascension Platform**:
- `/dashboard/platforms/kids-ascension/videos` - Video content management
- `/dashboard/platforms/kids-ascension/reviews` - Review workflows
- `/dashboard/platforms/kids-ascension/classrooms` - Classroom management

**Ozean Licht Platform**:
- `/dashboard/platforms/ozean-licht/courses` - Course management
- `/dashboard/platforms/ozean-licht/members` - Member tracking
- `/dashboard/platforms/ozean-licht/payments` - Payment monitoring

---

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

---

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

---

## Route Naming Conventions

- **Plural nouns** for list pages: `/users`, `/permissions`
- **Dynamic segments** for detail pages: `/users/[id]`, `/users/[id]/permissions`
- **Action verbs** for specific operations: `/permissions/check`
- **Nested resources** follow parent hierarchy: `/users/[id]/permissions`

---

## Deferred Features

The following features have been moved to `_deferred/` and are not part of MVP:

### Storage Management (Deferred)
- `/dashboard/_deferred/storage` - MinIO storage management
- **Reason**: Not Phase 1 critical, available via MCP Gateway when needed
- **Re-enable**: See `docs/decisions/storage-feature-status.md`

---

## Route Discovery Commands

```bash
# List all pages
find apps/admin/app -name "page.tsx" -type f

# List all API routes
find apps/admin/app/api -name "route.ts" -type f

# Find routes with authentication
grep -r "requireAuth\|requireAnyRole" apps/admin/app/dashboard
```

---

## Route Organization Philosophy

### Functional Areas
Routes are organized by **functional area** rather than by feature or entity:

- **Access** (`/access/`) - Everything related to user management, permissions, and RBAC
- **System** (`/system/`) - System administration, health, monitoring, configuration
- **Platforms** (`/platforms/`) - Platform-specific admin for KA and OL (future)

### Benefits for AI Agents
1. **Clear Mental Model**: Agents can quickly identify which functional area a task belongs to
2. **Predictable Structure**: Consistent patterns across all routes
3. **Easy Discovery**: Routes are grouped logically rather than scattered
4. **Scalability**: New features fit naturally into existing structure

### Example Agent Workflow
```
Agent Task: "Add a new user"
→ Identify functional area: Access Management
→ Navigate to: /dashboard/access/users
→ Execute: Create new user action
```

---

## Authentication & Authorization Flow

### Route Protection
1. **Middleware** (`middleware.ts`) - Protects all `/dashboard/*` routes
2. **Page-level** - Uses `requireAuth()` or `requireAnyRole()` in server components
3. **Component-level** - Checks `session.user.adminRole` for UI elements
4. **API-level** - Manual `await auth()` + role checks

### RBAC Enforcement
Each route specifies which roles can access it:
- **super_admin** - Full access to all routes
- **ka_admin** - Kids Ascension admin, limited to KA and shared features
- **ol_admin** - Ozean Licht admin, limited to OL and shared features
- **support** - Read-only access, cannot modify users or permissions

---

**Last Updated**: 2025-11-11
**Maintained By**: Platform Team + Autonomous Agents
