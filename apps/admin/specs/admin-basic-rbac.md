# Plan: Spec 1.4 - Basic Role-Based Access Control (RBAC)

## Task Description
Implement the basic RBAC system for the admin dashboard, including role management UI, role-based route protection, and role badge display. This spec builds on the existing authentication foundation (NextAuth v5) and database schema (admin_users, admin_roles, admin_permissions) to provide visual role management and enforce role-based access control throughout the application.

## Objective
Provide admins with the ability to:
- Assign and change roles for admin users (SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT)
- View role badges in user interfaces
- Access only the dashboard sections their role permits
- Ensure entity-scoped access is enforced (KIDS_ASCENSION, OZEAN_LICHT)

## Problem Statement
While the authentication infrastructure exists (database tables, MCP client queries, JWT enrichment, and permission checking utilities), there is no UI for role management and no enforcement of role-based route access. Admins cannot assign roles, users cannot see their current role, and the application does not restrict navigation based on roles. This spec addresses the visual and UX layer of RBAC.

## Solution Approach
1. **Role Constants & Configuration** - Define role display metadata (labels, colors, descriptions, default permissions)
2. **Role Badge Component** - Visual indicator for user roles with semantic colors
3. **Role Assignment UI** - Dropdown selector for changing admin roles
4. **Enhanced Middleware** - Extend existing middleware to enforce role-based route access
5. **Role-Based Navigation** - Filter sidebar menu items based on user role
6. **Admin User Management Page** - Interface for assigning roles and managing entity access

The implementation leverages existing infrastructure:
- MCP Gateway client for all database operations
- NextAuth v5 session enrichment (already includes adminRole, permissions, entityScope)
- Existing helper functions (hasPermission, requirePermission, requireAuth)
- Established audit logging patterns

## Relevant Files

### Existing Files (Read, Understand, Extend)
- `lib/auth/config.ts` - NextAuth configuration with JWT enrichment (lines 81-88, 110-119, 124-134)
- `lib/auth-utils.ts` - Permission checking utilities (hasPermission, requirePermission, requireAuth)
- `lib/auth/constants.ts` - Auth constants (will add RBAC constants)
- `middleware.ts` - Route protection (will add role-based checks)
- `types/admin.ts` - AdminRole type definition (lines 9, 19-31)
- `types/next-auth.d.ts` - Session type extensions (includes adminRole)
- `lib/mcp-client/queries.ts` - RBAC database operations (lines 36-213, 219-282)
- `components/ui/badge.tsx` - Base badge component (will extend for role badges)
- `app/(dashboard)/layout-client.tsx` - Client layout with sidebar (will add role filtering)

### New Files
- `lib/rbac/constants.ts` - Role definitions, labels, colors, permissions, route access rules
- `lib/rbac/utils.ts` - Role-based access checking utilities
- `components/rbac/RoleBadge.tsx` - Visual role badge component
- `components/rbac/RoleSelect.tsx` - Role assignment dropdown
- `components/rbac/EntityBadge.tsx` - Entity scope indicator
- `app/(dashboard)/users/page.tsx` - Admin user management page
- `app/(dashboard)/users/[id]/page.tsx` - Admin user detail/edit page
- `app/api/admin-users/[id]/route.ts` - API endpoint for updating admin users

## Implementation Phases

### Phase 1: Foundation
Establish role constants, utility functions, and reusable components. This provides the building blocks for all subsequent phases.

### Phase 2: Core UI Components
Build the RoleBadge and RoleSelect components, enabling visual role display and role assignment throughout the application.

### Phase 3: Route Protection
Enhance middleware to enforce role-based access control and filter navigation based on user roles.

### Phase 4: Admin User Management
Create the admin user management interface for viewing and assigning roles, completing the RBAC implementation.

## Step by Step Tasks

### 1. Create RBAC Constants
Create `lib/rbac/constants.ts` with comprehensive role definitions.

**File: `lib/rbac/constants.ts`**
```typescript
/**
 * RBAC Constants
 *
 * Role definitions, permissions, and access rules for the admin dashboard.
 */

import { AdminRole } from '@/types/admin';

/**
 * Role display metadata
 */
export const ROLE_CONFIG: Record<AdminRole, {
  label: string;
  description: string;
  color: 'default' | 'destructive' | 'outline' | 'secondary';
  icon: string; // Lucide icon name
  defaultPermissions: string[];
  allowedRoutes: string[]; // Route prefixes this role can access
}> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access across all platforms',
    color: 'destructive',
    icon: 'Shield',
    defaultPermissions: ['*'], // Wildcard: all permissions
    allowedRoutes: ['/dashboard'], // All routes
  },
  ka_admin: {
    label: 'Kids Ascension Admin',
    description: 'Full access to Kids Ascension platform',
    color: 'default',
    icon: 'GraduationCap',
    defaultPermissions: [
      'users.read', 'users.write',
      'content.read', 'content.write', 'content.approve',
      'classrooms.read', 'classrooms.write',
      'analytics.read',
      'settings.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/kids-ascension',
      '/dashboard/health',
      '/dashboard/storage',
    ],
  },
  ol_admin: {
    label: 'Ozean Licht Admin',
    description: 'Full access to Ozean Licht platform',
    color: 'default',
    icon: 'Sparkles',
    defaultPermissions: [
      'users.read', 'users.write',
      'courses.read', 'courses.write', 'courses.publish',
      'members.read', 'members.write',
      'payments.read',
      'analytics.read',
      'settings.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/ozean-licht',
      '/dashboard/health',
      '/dashboard/storage',
    ],
  },
  support: {
    label: 'Support',
    description: 'Read-only access for customer support',
    color: 'secondary',
    icon: 'Headphones',
    defaultPermissions: [
      'users.read',
      'content.read',
      'courses.read',
      'members.read',
      'classrooms.read',
      'analytics.read',
    ],
    allowedRoutes: [
      '/dashboard',
      '/dashboard/users',
      '/dashboard/kids-ascension',
      '/dashboard/ozean-licht',
    ],
  },
};

/**
 * Entity scope display metadata
 */
export const ENTITY_CONFIG = {
  kids_ascension: {
    label: 'Kids Ascension',
    shortLabel: 'KA',
    color: 'default',
    icon: 'GraduationCap',
  },
  ozean_licht: {
    label: 'Ozean Licht',
    shortLabel: 'OL',
    color: 'outline',
    icon: 'Sparkles',
  },
} as const;

/**
 * Route access rules
 * Maps route prefixes to required roles
 */
export const ROUTE_ROLES: Record<string, AdminRole[]> = {
  '/dashboard/kids-ascension': ['super_admin', 'ka_admin', 'support'],
  '/dashboard/ozean-licht': ['super_admin', 'ol_admin', 'support'],
  '/dashboard/users': ['super_admin', 'ka_admin', 'ol_admin'],
  '/dashboard/settings': ['super_admin', 'ka_admin', 'ol_admin'],
  '/dashboard/audit': ['super_admin'],
  // Health and storage accessible to all roles
  '/dashboard/health': ['super_admin', 'ka_admin', 'ol_admin', 'support'],
  '/dashboard/storage': ['super_admin', 'ka_admin', 'ol_admin', 'support'],
};

/**
 * Get role display name
 */
export function getRoleLabel(role: AdminRole): string {
  return ROLE_CONFIG[role]?.label || role;
}

/**
 * Get role color for badges
 */
export function getRoleColor(role: AdminRole): string {
  return ROLE_CONFIG[role]?.color || 'default';
}

/**
 * Check if role can access a route
 */
export function canAccessRoute(role: AdminRole, path: string): boolean {
  // Super admin can access everything
  if (role === 'super_admin') {
    return true;
  }

  // Check exact match first
  if (ROUTE_ROLES[path]?.includes(role)) {
    return true;
  }

  // Check prefix match (e.g., /dashboard/users/123 matches /dashboard/users)
  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ROLES)) {
    if (path.startsWith(routePrefix) && allowedRoles.includes(role)) {
      return true;
    }
  }

  // Default: allow access to base dashboard
  if (path === '/dashboard') {
    return true;
  }

  return false;
}
```

- Define role display metadata (labels, colors, icons, descriptions)
- Map roles to default permissions
- Define route access rules (which roles can access which routes)
- Create helper functions: getRoleLabel, getRoleColor, canAccessRoute
- Entity scope configuration for Kids Ascension and Ozean Licht

### 2. Create RBAC Utilities
Create `lib/rbac/utils.ts` with role-based access checking functions.

**File: `lib/rbac/utils.ts`**
```typescript
/**
 * RBAC Utility Functions
 */

import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { AdminRole } from '@/types/admin';
import { canAccessRoute, ROLE_CONFIG } from './constants';
import type { Session } from 'next-auth';

/**
 * Check if user has a specific role
 */
export function hasRole(session: Session, role: AdminRole): boolean {
  return session.user?.adminRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(session: Session, roles: AdminRole[]): boolean {
  return roles.includes(session.user?.adminRole as AdminRole);
}

/**
 * Require a specific role for a server component
 * Redirects to dashboard if role not permitted
 */
export async function requireRole(role: AdminRole): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (!hasRole(session, role)) {
    redirect('/dashboard?error=insufficient_role');
  }

  return session;
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(roles: AdminRole[]): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (!hasAnyRole(session, roles)) {
    redirect('/dashboard?error=insufficient_role');
  }

  return session;
}

/**
 * Require route access based on role
 */
export async function requireRouteAccess(path: string): Promise<Session> {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user?.adminRole as AdminRole;

  if (!canAccessRoute(userRole, path)) {
    redirect('/dashboard?error=route_not_allowed');
  }

  return session;
}

/**
 * Get allowed routes for a role
 */
export function getAllowedRoutes(role: AdminRole): string[] {
  return ROLE_CONFIG[role]?.allowedRoutes || ['/dashboard'];
}

/**
 * Check if user can manage roles (assign/change roles)
 * Only super_admin can manage roles
 */
export function canManageRoles(session: Session): boolean {
  return hasRole(session, 'super_admin');
}

/**
 * Check if user can view entity data
 */
export function canViewEntity(session: Session, entity: 'kids_ascension' | 'ozean_licht'): boolean {
  const role = session.user?.adminRole as AdminRole;
  const entityScope = session.user?.entityScope;

  // Super admin can view all entities
  if (role === 'super_admin') {
    return true;
  }

  // Check entity scope match
  if (entityScope === entity) {
    return true;
  }

  // Check role-based access
  if (entity === 'kids_ascension' && role === 'ka_admin') {
    return true;
  }

  if (entity === 'ozean_licht' && role === 'ol_admin') {
    return true;
  }

  // Support can view all entities (read-only)
  if (role === 'support') {
    return true;
  }

  return false;
}
```

- Role checking functions: hasRole, hasAnyRole
- Server-side guards: requireRole, requireAnyRole, requireRouteAccess
- Entity access checking: canViewEntity
- Role management permissions: canManageRoles

### 3. Create RoleBadge Component
Create `components/rbac/RoleBadge.tsx` for displaying user roles visually.

**File: `components/rbac/RoleBadge.tsx`**
```typescript
/**
 * RoleBadge Component
 *
 * Displays an admin user's role with semantic colors and icons.
 */

import { Badge } from '@/components/ui/badge';
import { AdminRole } from '@/types/admin';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: AdminRole;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  showIcon = true,
  showLabel = true,
  className
}: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as any;

  return (
    <Badge
      variant={config.color as any}
      className={cn('inline-flex items-center gap-1.5', className)}
    >
      {showIcon && IconComponent && (
        <IconComponent className="h-3 w-3" />
      )}
      {showLabel && config.label}
    </Badge>
  );
}

/**
 * Compact role badge (icon only with tooltip)
 */
export function CompactRoleBadge({ role }: { role: AdminRole }) {
  const config = ROLE_CONFIG[role];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as any;

  return (
    <div
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted"
      title={config.label}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
    </div>
  );
}
```

- Full badge with icon and label
- Compact badge (icon only) for tight spaces
- Uses ROLE_CONFIG for semantic colors
- Tooltip support for compact mode

### 4. Create EntityBadge Component
Create `components/rbac/EntityBadge.tsx` for displaying entity scope.

**File: `components/rbac/EntityBadge.tsx`**
```typescript
/**
 * EntityBadge Component
 *
 * Displays the entity scope (Kids Ascension or Ozean Licht) for an admin user.
 */

import { Badge } from '@/components/ui/badge';
import { ENTITY_CONFIG } from '@/lib/rbac/constants';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntityBadgeProps {
  entity: 'kids_ascension' | 'ozean_licht';
  compact?: boolean;
  className?: string;
}

export function EntityBadge({ entity, compact = false, className }: EntityBadgeProps) {
  const config = ENTITY_CONFIG[entity];

  if (!config) {
    return null;
  }

  const IconComponent = Icons[config.icon as keyof typeof Icons] as any;
  const label = compact ? config.shortLabel : config.label;

  return (
    <Badge
      variant={config.color as any}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {IconComponent && <IconComponent className="h-3 w-3" />}
      {label}
    </Badge>
  );
}
```

- Displays Kids Ascension or Ozean Licht badges
- Compact mode shows "KA" or "OL"
- Full mode shows complete label

### 5. Create RoleSelect Component
Create `components/rbac/RoleSelect.tsx` for role assignment UI.

**File: `components/rbac/RoleSelect.tsx`**
```typescript
/**
 * RoleSelect Component
 *
 * Dropdown selector for assigning admin roles.
 */

'use client';

import { AdminRole } from '@/types/admin';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as Icons from 'lucide-react';

interface RoleSelectProps {
  value: AdminRole;
  onChange: (value: AdminRole) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({ value, onChange, disabled, className }: RoleSelectProps) {
  const roles: AdminRole[] = ['super_admin', 'ka_admin', 'ol_admin', 'support'];

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AdminRole)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => {
          const config = ROLE_CONFIG[role];
          const IconComponent = Icons[config.icon as keyof typeof Icons] as any;

          return (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <div>
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
```

- Dropdown with all four roles
- Shows icon, label, and description for each role
- Controlled component (value + onChange)
- Disabled state for non-editable contexts

### 6. Enhance Middleware for Role-Based Route Protection
Update `middleware.ts` to enforce role-based access control.

**File: `middleware.ts`**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth/config';
import { canAccessRoute } from './lib/rbac/constants';
import type { AdminRole } from './types/admin';

/**
 * Next.js middleware for route protection
 * Protects dashboard routes and enforces role-based access control
 */
export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route access control
    const userRole = session.user?.adminRole as AdminRole;

    if (userRole && !canAccessRoute(userRole, pathname)) {
      // Redirect to dashboard with error message
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('error', 'route_not_allowed');
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Redirect authenticated users away from login
  if (pathname === '/login') {
    if (session) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- Existing authentication check remains
- Add role-based route access check using canAccessRoute()
- Redirect unauthorized roles to /dashboard with error message
- Preserve existing login redirect logic

### 7. Update Navigation to Filter by Role
Update `app/(dashboard)/layout-client.tsx` to filter sidebar menu based on user role.

**File changes in `app/(dashboard)/layout-client.tsx`:**

Add imports:
```typescript
import { canAccessRoute } from '@/lib/rbac/constants';
import type { AdminRole } from '@/types/admin';
```

Filter sidebar items based on role:
```typescript
// Inside the component, filter navigation items
const userRole = session?.user?.adminRole as AdminRole;

const filteredNavigation = sidebarItems.filter((item) => {
  // Keep section headers
  if (item.type === 'section') {
    return true;
  }

  // Filter items based on role access
  if (item.href && !canAccessRoute(userRole, item.href)) {
    return false;
  }

  return true;
});
```

- Filter sidebar navigation items based on user role
- Use canAccessRoute() to determine visibility
- Keep section headers for visual structure
- Hide inaccessible routes from navigation

### 8. Create Admin User Management API Route
Create API endpoint for updating admin user roles.

**File: `app/api/admin-users/[id]/route.ts`**
```typescript
/**
 * Admin User API
 *
 * Update admin user roles and entity access.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { canManageRoles } from '@/lib/rbac/utils';
import { z } from 'zod';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'kids-ascension-db',
});

const updateAdminUserSchema = z.object({
  adminRole: z.enum(['super_admin', 'ka_admin', 'ol_admin', 'support']).optional(),
  entityScope: z.enum(['kids_ascension', 'ozean_licht']).nullable().optional(),
  isActive: z.boolean().optional(),
});

/**
 * PATCH /api/admin-users/[id]
 * Update admin user role and entity access
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can manage roles
    if (!canManageRoles(session)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateAdminUserSchema.parse(body);

    // Update admin user
    const updatedUser = await mcpClient.updateAdminUser(params.id, {
      ...validatedData,
      updatedBy: session.user.adminUserId,
    });

    // Log the role change to audit log
    await mcpClient.createAuditLog({
      adminUserId: session.user.adminUserId,
      action: 'admin_user.role_updated',
      entityType: 'admin_users',
      entityId: params.id,
      metadata: {
        oldRole: body.oldRole, // Client should send old role for audit
        newRole: validatedData.adminRole,
        entityScope: validatedData.entityScope,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('[API] Update admin user error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin-users/[id]
 * Get admin user details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await mcpClient.getAdminUserById(params.id);

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    return NextResponse.json({ user: adminUser });
  } catch (error) {
    console.error('[API] Get admin user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- PATCH endpoint for updating admin user roles
- Only super_admin can update roles (enforced via canManageRoles)
- Validates input using Zod schema
- Logs role changes to audit log
- GET endpoint for fetching admin user details

### 9. Create Admin Users List Page
Create `app/(dashboard)/users/page.tsx` for listing all admin users.

**File: `app/(dashboard)/users/page.tsx`**
```typescript
/**
 * Admin Users List Page
 *
 * Lists all admin users with role badges and entity access indicators.
 */

import { requireAuth } from '@/lib/auth-utils';
import { requireAnyRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { RoleBadge } from '@/components/rbac/RoleBadge';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'kids-ascension-db',
});

export default async function AdminUsersPage() {
  // Require admin role (super_admin, ka_admin, or ol_admin)
  const session = await requireAnyRole(['super_admin', 'ka_admin', 'ol_admin']);

  // Fetch all admin users
  const adminUsers = await mcpClient.listAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground">
            Manage admin user roles and entity access
          </p>
        </div>

        {/* Future: Add new admin user button */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Entity Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">
                  {user.userId.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.adminRole} />
                </TableCell>
                <TableCell>
                  {user.entityScope ? (
                    <EntityBadge
                      entity={user.entityScope as 'kids_ascension' | 'ozean_licht'}
                      compact
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">All</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="text-green-600 text-sm">Active</span>
                  ) : (
                    <span className="text-red-600 text-sm">Inactive</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLoginAt
                    ? formatDistanceToNow(user.lastLoginAt, { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- Server component fetching admin users
- Displays role badges and entity badges
- Shows last login timestamp
- Links to user detail/edit page
- Requires admin role (enforced via requireAnyRole)

### 10. Create Admin User Detail/Edit Page
Create `app/(dashboard)/users/[id]/page.tsx` for viewing and editing admin user roles.

**File: `app/(dashboard)/users/[id]/page.tsx`**
```typescript
/**
 * Admin User Detail/Edit Page
 *
 * View and edit admin user roles and entity access.
 */

import { requireAuth } from '@/lib/auth-utils';
import { canManageRoles } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { notFound } from 'next/navigation';
import { AdminUserForm } from './AdminUserForm';

const mcpClient = new MCPGatewayClientWithQueries({
  baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
  database: 'kids-ascension-db',
});

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  // Fetch admin user
  const adminUser = await mcpClient.getAdminUserById(params.id);

  if (!adminUser) {
    notFound();
  }

  // Check if current user can manage roles
  const canEdit = canManageRoles(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin User Details</h1>
        <p className="text-muted-foreground">
          View and manage admin user role and permissions
        </p>
      </div>

      <AdminUserForm
        adminUser={adminUser}
        canEdit={canEdit}
        currentUserAdminId={session.user.adminUserId}
      />
    </div>
  );
}
```

- Server component loading admin user data
- Passes data to client form component
- Checks if current user can edit roles (only super_admin)

**File: `app/(dashboard)/users/[id]/AdminUserForm.tsx`** (client component)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types/admin';
import { RoleSelect } from '@/components/rbac/RoleSelect';
import { RoleBadge } from '@/components/rbac/RoleBadge';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AdminUserFormProps {
  adminUser: AdminUser;
  canEdit: boolean;
  currentUserAdminId: string;
}

export function AdminUserForm({ adminUser, canEdit, currentUserAdminId }: AdminUserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminRole, setAdminRole] = useState(adminUser.adminRole);
  const [entityScope, setEntityScope] = useState<string | null>(adminUser.entityScope);

  const isSelfEdit = adminUser.id === currentUserAdminId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canEdit) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit admin users.',
        variant: 'destructive',
      });
      return;
    }

    if (isSelfEdit) {
      toast({
        title: 'Cannot Edit Self',
        description: 'You cannot change your own role.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin-users/${adminUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminRole,
          entityScope,
          oldRole: adminUser.adminRole, // For audit log
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin user');
      }

      toast({
        title: 'Success',
        description: 'Admin user updated successfully.',
      });

      router.refresh();
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update admin user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border p-6 space-y-4">
        <div className="space-y-2">
          <Label>User ID</Label>
          <div className="font-mono text-sm text-muted-foreground">
            {adminUser.userId}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminRole">Admin Role</Label>
          {canEdit && !isSelfEdit ? (
            <RoleSelect
              value={adminRole}
              onChange={setAdminRole}
              disabled={isLoading}
            />
          ) : (
            <div>
              <RoleBadge role={adminRole} />
              {isSelfEdit && (
                <p className="text-xs text-muted-foreground mt-1">
                  You cannot change your own role
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="entityScope">Entity Scope</Label>
          {canEdit && !isSelfEdit ? (
            <Select
              value={entityScope || 'all'}
              onValueChange={(val) => setEntityScope(val === 'all' ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
                <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div>
              {entityScope ? (
                <EntityBadge entity={entityScope as any} />
              ) : (
                <span className="text-sm text-muted-foreground">All Entities</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="text-sm">
            {adminUser.isActive ? (
              <span className="text-green-600 font-medium">Active</span>
            ) : (
              <span className="text-red-600 font-medium">Inactive</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Last Login</Label>
          <div className="text-sm text-muted-foreground">
            {adminUser.lastLoginAt
              ? new Date(adminUser.lastLoginAt).toLocaleString()
              : 'Never'}
          </div>
        </div>
      </div>

      {canEdit && !isSelfEdit && (
        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
```

- Client form component for editing admin user
- Role selector using RoleSelect component
- Entity scope selector
- Prevents users from editing their own role
- Only shows edit UI if user has permission (super_admin)
- Uses toast notifications for feedback

### 11. Add Role Badge to Header
Update `app/(dashboard)/layout-client.tsx` to display current user's role in header.

Add to header section:
```typescript
import { RoleBadge } from '@/components/rbac/RoleBadge';

// In the header, near the user menu/avatar:
<div className="flex items-center gap-2">
  <RoleBadge role={session?.user?.adminRole as AdminRole} />
  {/* Existing user menu/avatar */}
</div>
```

- Displays current user's role in dashboard header
- Always visible to remind users of their access level
- Uses RoleBadge component for consistency

### 12. Update Authentication Constants
Add RBAC-related audit actions to `lib/auth/constants.ts`.

```typescript
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'login.success',
  LOGIN_FAILURE: 'login.failure',
  LOGOUT: 'logout',
  SESSION_REFRESH: 'session.refresh',
  SESSION_EXPIRED: 'session.expired',
  // RBAC audit actions
  ROLE_ASSIGNED: 'admin_user.role_assigned',
  ROLE_UPDATED: 'admin_user.role_updated',
  ROLE_REVOKED: 'admin_user.role_revoked',
  ENTITY_ACCESS_GRANTED: 'admin_user.entity_access_granted',
  ENTITY_ACCESS_REVOKED: 'admin_user.entity_access_revoked',
} as const;
```

- Add audit action constants for role changes
- Ensures consistent audit logging across the application

### 13. Add Error Handling for Unauthorized Access
Create error display in `app/(dashboard)/page.tsx` for route access errors.

```typescript
// In the dashboard home page component:
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await requireAuth();

  return (
    <div className="space-y-6">
      {searchParams.error === 'route_not_allowed' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <h3 className="text-sm font-medium text-destructive">Access Denied</h3>
          <p className="text-sm text-destructive/80 mt-1">
            You do not have permission to access that page. Your role is{' '}
            <RoleBadge role={session.user.adminRole} className="ml-1" />
          </p>
        </div>
      )}

      {searchParams.error === 'insufficient_role' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <h3 className="text-sm font-medium text-destructive">Insufficient Permissions</h3>
          <p className="text-sm text-destructive/80 mt-1">
            Your current role does not have sufficient permissions for that action.
          </p>
        </div>
      )}

      {/* Rest of dashboard home content */}
    </div>
  );
}
```

- Display error messages for unauthorized access attempts
- Shows user's current role when access is denied
- Provides clear feedback about permission issues

### 14. Add Role Filter to Sidebar (Optional Enhancement)
In `app/(dashboard)/layout-client.tsx`, add visual indicator for filtered items.

```typescript
// When rendering navigation items, add a subtle indicator for items
// that are filtered based on role (for debugging/admin awareness)

{process.env.NODE_ENV === 'development' && (
  <div className="px-3 py-2 text-xs text-muted-foreground">
    Role: {session?.user?.adminRole} | {filteredNavigation.length} items
  </div>
)}
```

- Development-only indicator showing filtered navigation count
- Helps admins understand what they can access
- Remove in production or make configurable

### 15. Create RBAC Documentation
Create `docs/rbac-guide.md` documenting the RBAC system for developers.

**File: `docs/rbac-guide.md`**
```markdown
# RBAC Guide - Admin Dashboard

## Roles

### SUPER_ADMIN
- Full system access across all platforms
- Can manage admin user roles
- Can access all routes and perform all actions
- Default permissions: `['*']` (wildcard)

### KA_ADMIN
- Full access to Kids Ascension platform
- Cannot manage admin roles
- Can access: users, kids-ascension routes, health, storage
- Default permissions: users.*, content.*, classrooms.*, analytics.read, settings.read

### OL_ADMIN
- Full access to Ozean Licht platform
- Cannot manage admin roles
- Can access: users, ozean-licht routes, health, storage
- Default permissions: users.*, courses.*, members.*, payments.read, analytics.read, settings.read

### SUPPORT
- Read-only access across both platforms
- Cannot manage admin roles
- Can access: users (read), kids-ascension (read), ozean-licht (read)
- Default permissions: *.read

## Usage

### Server Components
```typescript
import { requireAuth } from '@/lib/auth-utils';
import { requireAnyRole, hasRole } from '@/lib/rbac/utils';

// Require authentication
const session = await requireAuth();

// Require specific role
const session = await requireRole('super_admin');

// Require any of multiple roles
const session = await requireAnyRole(['super_admin', 'ka_admin']);

// Check role
if (hasRole(session, 'super_admin')) {
  // Show admin-only content
}
```

### Client Components
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { hasRole } from '@/lib/rbac/utils';

export function MyComponent() {
  const { data: session } = useSession();

  if (!session) return null;

  if (hasRole(session, 'super_admin')) {
    return <AdminOnlyFeature />;
  }

  return <RegularFeature />;
}
```

### Route Protection
Routes are automatically protected by middleware based on role. Configure in `lib/rbac/constants.ts`:

```typescript
export const ROUTE_ROLES: Record<string, AdminRole[]> = {
  '/dashboard/kids-ascension': ['super_admin', 'ka_admin', 'support'],
  '/dashboard/ozean-licht': ['super_admin', 'ol_admin', 'support'],
  '/dashboard/users': ['super_admin', 'ka_admin', 'ol_admin'],
  // ...
};
```

## Components

### RoleBadge
```typescript
<RoleBadge role="super_admin" />
<RoleBadge role="ka_admin" showIcon={false} />
<CompactRoleBadge role="support" />
```

### EntityBadge
```typescript
<EntityBadge entity="kids_ascension" />
<EntityBadge entity="ozean_licht" compact />
```

### RoleSelect
```typescript
<RoleSelect
  value={role}
  onChange={setRole}
  disabled={!canEdit}
/>
```

## Audit Logging
All role changes are automatically logged:
- Action: `admin_user.role_updated`
- Entity Type: `admin_users`
- Metadata: `{ oldRole, newRole, entityScope }`
```

- Complete developer documentation
- Usage examples for common patterns
- Component API reference
- Audit logging patterns

### 16. Write Tests for RBAC Utilities
Create `tests/unit/rbac/utils.test.ts` for testing role utilities.

**File: `tests/unit/rbac/utils.test.ts`**
```typescript
import { hasRole, hasAnyRole, canManageRoles } from '@/lib/rbac/utils';
import { canAccessRoute } from '@/lib/rbac/constants';
import type { Session } from 'next-auth';

describe('RBAC Utilities', () => {
  const mockSession = (role: string): Session => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      adminUserId: 'test-admin-id',
      adminRole: role,
      permissions: [],
      entityScope: null,
    },
    expires: '2025-12-31',
  });

  describe('hasRole', () => {
    it('should return true for exact role match', () => {
      const session = mockSession('super_admin');
      expect(hasRole(session, 'super_admin')).toBe(true);
    });

    it('should return false for different role', () => {
      const session = mockSession('ka_admin');
      expect(hasRole(session, 'super_admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has one of the specified roles', () => {
      const session = mockSession('ka_admin');
      expect(hasAnyRole(session, ['super_admin', 'ka_admin'])).toBe(true);
    });

    it('should return false if user has none of the specified roles', () => {
      const session = mockSession('support');
      expect(hasAnyRole(session, ['super_admin', 'ka_admin'])).toBe(false);
    });
  });

  describe('canManageRoles', () => {
    it('should return true for super_admin', () => {
      const session = mockSession('super_admin');
      expect(canManageRoles(session)).toBe(true);
    });

    it('should return false for non-super_admin', () => {
      const session = mockSession('ka_admin');
      expect(canManageRoles(session)).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow super_admin to access all routes', () => {
      expect(canAccessRoute('super_admin', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('super_admin', '/dashboard/users')).toBe(true);
    });

    it('should restrict ka_admin to Kids Ascension routes', () => {
      expect(canAccessRoute('ka_admin', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('ka_admin', '/dashboard/ozean-licht')).toBe(false);
      expect(canAccessRoute('ka_admin', '/dashboard/users')).toBe(true);
    });

    it('should restrict ol_admin to Ozean Licht routes', () => {
      expect(canAccessRoute('ol_admin', '/dashboard/kids-ascension')).toBe(false);
      expect(canAccessRoute('ol_admin', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('ol_admin', '/dashboard/users')).toBe(true);
    });

    it('should allow support read-only access', () => {
      expect(canAccessRoute('support', '/dashboard/kids-ascension')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/ozean-licht')).toBe(true);
      expect(canAccessRoute('support', '/dashboard/users')).toBe(false);
    });
  });
});
```

- Unit tests for all RBAC utilities
- Tests for hasRole, hasAnyRole, canManageRoles
- Tests for canAccessRoute with all role combinations
- Mock session factory for clean test data

### 17. Update CLAUDE.md with RBAC Patterns
Add RBAC usage examples to `CLAUDE.md`.

Add to CLAUDE.md under "Security" section:
```markdown
## RBAC (Role-Based Access Control)

// Check role
import { hasRole, requireAnyRole } from '@/lib/rbac/utils';
const canManage = hasRole(session, 'super_admin');

// Require role for page
const session = await requireAnyRole(['super_admin', 'ka_admin']);

// Display role badges
<RoleBadge role={session.user.adminRole} />
<EntityBadge entity="kids_ascension" compact />

// Route access
canAccessRoute(role, '/dashboard/kids-ascension') // boolean
```

- Quick reference for RBAC patterns
- Keeps CLAUDE.md as single source of truth for common patterns

### 18. Run Type Check
Ensure all TypeScript types are correct.

```bash
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck
```

- Verify no TypeScript errors
- Ensure all imports resolve correctly
- Check that AdminRole type is used consistently

### 19. Manual Testing Checklist
Test all RBAC functionality manually.

**Test Scenarios:**
1. **Login as super_admin**
   - Verify all routes accessible
   - Verify can assign roles to other users
   - Verify role badge displays correctly
   - Verify navigation shows all items

2. **Login as ka_admin**
   - Verify can access /dashboard/kids-ascension
   - Verify cannot access /dashboard/ozean-licht
   - Verify cannot assign roles
   - Verify navigation filtered correctly

3. **Login as ol_admin**
   - Verify can access /dashboard/ozean-licht
   - Verify cannot access /dashboard/kids-ascension
   - Verify cannot assign roles

4. **Login as support**
   - Verify read-only access
   - Verify cannot access /dashboard/users
   - Verify cannot edit anything

5. **Edge Cases**
   - Try accessing forbidden route (should redirect with error)
   - Try changing own role (should fail)
   - Try assigning role without permission (should fail)

### 20. Validate Implementation
Run all validation checks to ensure RBAC is working correctly.

**Validation Checklist:**
- [ ] All role constants defined in `lib/rbac/constants.ts`
- [ ] Role badges render with correct colors and icons
- [ ] Role selector shows all 4 roles with descriptions
- [ ] Middleware enforces role-based route access
- [ ] Navigation menu filters based on user role
- [ ] Admin users page lists all users with role badges
- [ ] Admin user edit page allows role changes (super_admin only)
- [ ] API endpoint validates permissions before role changes
- [ ] Audit logs capture all role changes
- [ ] TypeScript types pass without errors
- [ ] All tests pass
- [ ] Documentation complete

## Testing Strategy

### Unit Tests
- Test RBAC utility functions (hasRole, hasAnyRole, canAccessRoute)
- Test permission checking logic (wildcards, category matching)
- Test role configuration parsing
- Located in `tests/unit/rbac/utils.test.ts`

### Integration Tests
- Test middleware role enforcement (mock Next.js middleware)
- Test API endpoint authorization (super_admin only can update roles)
- Test audit logging for role changes
- Test navigation filtering based on roles

### Manual Testing
- Login with each role and verify accessible routes
- Attempt to access forbidden routes (should redirect)
- Assign roles as super_admin
- Attempt to assign roles as non-super_admin (should fail)
- Attempt to change own role (should fail)
- Verify role badges display correctly in all contexts
- Verify entity badges display correctly

### Edge Cases
- User with no role (should default to most restrictive)
- User with invalid role (should handle gracefully)
- Session expired during role change (should require re-login)
- Concurrent role changes (should be serialized via database)

## Acceptance Criteria

- [ ] Four roles defined: SUPER_ADMIN, KA_ADMIN, OL_ADMIN, SUPPORT
- [ ] Role badges display with semantic colors (red=super_admin, blue=platform admins, gray=support)
- [ ] Role selector dropdown shows all roles with descriptions
- [ ] Middleware enforces role-based route access (redirects unauthorized roles)
- [ ] Navigation menu filters items based on user role
- [ ] Admin users list page shows all admin users with role badges
- [ ] Admin user edit page allows super_admin to change roles
- [ ] Non-super_admins cannot change roles (UI disabled + API rejects)
- [ ] Users cannot change their own role (even super_admin)
- [ ] All role changes logged to audit trail with old/new role metadata
- [ ] Entity scope badges display for Kids Ascension and Ozean Licht
- [ ] Entity access enforced (e.g., ka_admin cannot access OL routes)
- [ ] Support role has read-only access (no write operations)
- [ ] TypeScript types enforce correct role values (no stringly-typed roles)
- [ ] Error messages display when unauthorized access attempted
- [ ] Documentation complete in docs/rbac-guide.md
- [ ] All tests pass (unit + integration)

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Type check
cd /opt/ozean-licht-ecosystem/apps/admin
npm run typecheck

# Run tests
npm test -- rbac

# Lint check
npm run lint

# Build check (ensures no runtime errors)
npm run build

# Manual verification
# 1. Start dev server
npm run dev

# 2. Login as super_admin and verify:
#    - Can access all routes
#    - Can see all navigation items
#    - Can assign roles in /dashboard/users
#    - Role badge shows "Super Admin" in header

# 3. Login as ka_admin and verify:
#    - Can access /dashboard/kids-ascension
#    - Cannot access /dashboard/ozean-licht (redirect with error)
#    - Cannot assign roles (UI hidden)
#    - Role badge shows "Kids Ascension Admin"

# 4. Login as ol_admin and verify:
#    - Can access /dashboard/ozean-licht
#    - Cannot access /dashboard/kids-ascension (redirect with error)
#    - Role badge shows "Ozean Licht Admin"

# 5. Login as support and verify:
#    - Can view users but not edit
#    - Cannot access /dashboard/users page
#    - Role badge shows "Support"

# 6. Check audit logs
# Navigate to /dashboard/audit (super_admin only)
# Verify role changes logged with:
#   - Action: admin_user.role_updated
#   - Metadata: { oldRole, newRole, entityScope }
```

## Notes

### Dependencies
No new npm packages required. All functionality uses existing dependencies:
- NextAuth v5 (already installed)
- Lucide React (already installed for icons)
- shadcn/ui components (already installed)
- MCP Gateway client (already implemented)

### Database Schema
The database schema already exists with these tables:
- `admin_users` (role, permissions, entity_scope columns exist)
- `admin_roles` (system-defined roles)
- `admin_permissions` (permission definitions)
- `admin_audit_logs` (audit trail)

No migrations required.

### Existing Infrastructure Used
- NextAuth JWT enrichment (already includes adminRole, permissions, entityScope)
- MCP Gateway client queries (updateAdminUser, listAdminUsers, createAuditLog)
- Permission checking utilities (hasPermission, requirePermission)
- Auth helper functions (requireAuth)

### Security Considerations
- Only super_admin can assign/change roles (enforced in API + UI)
- Users cannot change their own role (prevents privilege escalation)
- All role changes logged to audit trail
- Middleware enforces route access (server-side, cannot be bypassed)
- API endpoints validate permissions before mutations
- JWT tokens contain role data (validated on every request)
- Entity scope enforced for platform-specific data access

### Future Enhancements (Out of Scope for This Spec)
- Advanced permissions matrix UI (Spec 1.8)
- Role templates for quick assignment
- Bulk role assignment
- Time-limited role assignments (temporary escalation)
- Multi-factor authentication for role changes
- IP-based role restrictions
- Session management (view/revoke active sessions)

### Related Specs
- **Spec 1.1** (admin-layout-navigation.md) - Depends on layout for role badge placement
- **Spec 1.5** (admin-user-management-list.md) - Will use DataTable for user list
- **Spec 1.7** (admin-audit-logging.md) - Will extend audit log viewer to filter by role changes
- **Spec 1.8** (admin-permissions-matrix.md) - Advanced RBAC with granular permissions

### Estimated Effort
**16 hours** total:
- Phase 1 (Foundation): 4 hours
- Phase 2 (Components): 4 hours
- Phase 3 (Route Protection): 3 hours
- Phase 4 (Admin UI): 4 hours
- Testing & Documentation: 1 hour

### Priority
**P1 (Critical)** - Blocks all feature development. Users need role-based access control before building platform-specific features (Ozean Licht courses, Kids Ascension content management).
