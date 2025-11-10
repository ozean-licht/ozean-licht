# RBAC Guide - Admin Dashboard

## Roles

### SUPER_ADMIN
- Full system access across all platforms
- Can manage admin user roles
- Can access all routes and perform all actions
- Default permissions: `['*']` (wildcard)
- Badge color: Red (destructive)

### KA_ADMIN
- Full access to Kids Ascension platform
- Cannot manage admin roles
- Can access: users, kids-ascension routes, health, storage
- Default permissions: users.*, content.*, classrooms.*, analytics.read, settings.read
- Badge color: Blue (default)

### OL_ADMIN
- Full access to Ozean Licht platform
- Cannot manage admin roles
- Can access: users, ozean-licht routes, health, storage
- Default permissions: users.*, courses.*, members.*, payments.read, analytics.read, settings.read
- Badge color: Blue (default)

### SUPPORT
- Read-only access across both platforms
- Cannot manage admin roles
- Can access: users (read), kids-ascension (read), ozean-licht (read)
- Default permissions: *.read
- Badge color: Gray (secondary)

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

## Security Rules

1. **Only super_admin can manage roles** - Enforced in API and UI
2. **Users cannot change their own role** - Prevents privilege escalation
3. **Middleware enforces route access** - Server-side validation that cannot be bypassed
4. **All role changes are logged** - Full audit trail for compliance
5. **JWT tokens contain role data** - Validated on every request

## Route Access Matrix

| Route | super_admin | ka_admin | ol_admin | support |
|-------|-------------|----------|----------|---------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/users` | ✅ | ✅ | ✅ | ❌ |
| `/dashboard/kids-ascension` | ✅ | ✅ | ❌ | ✅ |
| `/dashboard/ozean-licht` | ✅ | ❌ | ✅ | ✅ |
| `/dashboard/settings` | ✅ | ✅ | ✅ | ❌ |
| `/dashboard/audit` | ✅ | ❌ | ❌ | ❌ |
| `/dashboard/health` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/storage` | ✅ | ✅ | ✅ | ✅ |

## Permission Wildcards

The system supports flexible permission matching:

- `*` - Grants all permissions (super_admin only)
- `users.*` - Grants all user-related permissions (users.read, users.write, etc.)
- `*.read` - Grants read permission for all resources

Example:
```typescript
// Check permission
if (hasPermission(session, 'users.write')) {
  // User can edit users
}

// Permission matching examples:
// user.permissions = ['users.*']
// hasPermission(session, 'users.read') -> true
// hasPermission(session, 'users.write') -> true

// user.permissions = ['*.read']
// hasPermission(session, 'users.read') -> true
// hasPermission(session, 'courses.read') -> true
```

## Error Handling

When a user tries to access a route they don't have access to:

1. **Middleware redirects** to `/dashboard?error=route_not_allowed`
2. **Error message displayed** on dashboard page
3. **User's current role shown** for clarity

Example error messages:
- "Access Denied - You do not have permission to access that page"
- "Insufficient Permissions - Your current role does not have sufficient permissions"

## Testing

See `tests/unit/rbac/utils.test.ts` for comprehensive test coverage of RBAC utilities.

Run tests:
```bash
cd /opt/ozean-licht-ecosystem/apps/admin
npm test -- rbac
```

## Implementation Files

- **Constants**: `lib/rbac/constants.ts` - Role definitions and route access rules
- **Utilities**: `lib/rbac/utils.ts` - Role checking and access control functions
- **Components**: `components/rbac/` - RoleBadge, EntityBadge, RoleSelect
- **Middleware**: `middleware.ts` - Route protection enforcement
- **API**: `app/api/admin-users/[id]/route.ts` - Role management endpoint
- **Pages**: `app/(dashboard)/users/` - Admin user management UI

## Future Enhancements

- Advanced permissions matrix UI
- Role templates for quick assignment
- Bulk role assignment
- Time-limited role assignments (temporary escalation)
- Multi-factor authentication for role changes
- IP-based role restrictions
- Session management (view/revoke active sessions)
