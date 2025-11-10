# Permission Matrix UI - Key Code Samples

This document showcases the most important code implementations from Spec 1.8.

---

## 1. Permission Computation Utilities

**File**: `lib/rbac/permissions.ts`

### Wildcard Expansion

```typescript
/**
 * Expand wildcard permissions to concrete permission keys
 * Supports: `*`, `category.*`, `*.action`
 */
export function expandWildcards(
  permissions: string[],
  allPermissions: AdminPermission[]
): string[] {
  const expanded = new Set<string>();

  for (const permission of permissions) {
    // Exact match - no wildcard
    if (!permission.includes('*')) {
      expanded.add(permission);
      continue;
    }

    // Global wildcard: `*` - All permissions
    if (permission === '*') {
      allPermissions.forEach((p) => expanded.add(p.permissionKey));
      continue;
    }

    // Category wildcard: `category.*` - All permissions in category
    if (permission.endsWith('.*')) {
      const category = permission.slice(0, -2);
      allPermissions
        .filter((p) => p.permissionKey.startsWith(`${category}.`))
        .forEach((p) => expanded.add(p.permissionKey));
      continue;
    }

    // Action wildcard: `*.action` - All permissions with action
    if (permission.startsWith('*.')) {
      const action = permission.slice(2);
      allPermissions
        .filter((p) => p.permissionKey.endsWith(`.${action}`))
        .forEach((p) => expanded.add(p.permissionKey));
      continue;
    }
  }

  return Array.from(expanded).sort();
}
```

### Permission Validation

```typescript
/**
 * Validate permission change before applying
 * Security rules:
 * 1. Only super_admin can edit permissions
 * 2. Cannot self-grant permissions
 * 3. Cannot grant permissions outside entity scope
 * 4. Wildcard permissions show warning
 */
export function validatePermissionChange(
  currentUser: AdminUser,
  targetUser: AdminUser,
  newPermissions: string[]
): ValidationResult {
  const warnings: string[] = [];

  // Rule 1: Only super_admin can edit permissions
  if (currentUser.adminRole !== 'super_admin') {
    return {
      valid: false,
      error: 'Only super administrators can edit permissions',
    };
  }

  // Rule 2: Cannot self-grant permissions
  if (currentUser.id === targetUser.id) {
    return {
      valid: false,
      error: 'Cannot modify your own permissions (privilege escalation prevention)',
    };
  }

  // Rule 3: Cannot grant permissions outside entity scope
  if (targetUser.entityScope) {
    const entityPrefix = targetUser.entityScope === 'kids_ascension' ? 'ka' : 'ol';
    const invalidPermissions = newPermissions.filter((p) => {
      if (!p.includes('.') || p === '*') return false;
      if (p.startsWith(`${entityPrefix}.`)) return false;
      if (p.startsWith('*.')) return false;

      const otherPrefix = entityPrefix === 'ka' ? 'ol' : 'ka';
      return p.startsWith(`${otherPrefix}.`);
    });

    if (invalidPermissions.length > 0) {
      return {
        valid: false,
        error: `Cannot grant permissions outside entity scope: ${invalidPermissions.join(', ')}`,
      };
    }
  }

  // Rule 4: Wildcard permissions show warning
  const wildcardPermissions = newPermissions.filter((p) => p.includes('*'));
  if (wildcardPermissions.length > 0) {
    warnings.push(
      `Wildcard permissions grant broad access: ${wildcardPermissions.join(', ')}`
    );
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
```

---

## 2. Permission Matrix Component

**File**: `components/permissions/PermissionMatrix.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Check, Asterisk } from 'lucide-react';
import { AdminRole } from '@/types/admin';
import { PermissionMatrixRow } from '@/lib/rbac/permissions';
import { CategoryFilter } from './CategoryFilter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PermissionMatrix({ permissions, roles }: PermissionMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter permissions by selected category
  const filteredPermissions = useMemo(() => {
    if (!selectedCategory) return permissions;
    return permissions.filter((p) => p.category === selectedCategory);
  }, [permissions, selectedCategory]);

  // Define table columns
  const columns: ColumnDef<PermissionMatrixRow>[] = useMemo(() => {
    const baseColumns: ColumnDef<PermissionMatrixRow>[] = [
      {
        accessorKey: 'permissionLabel',
        header: 'Permission',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.permissionLabel}</div>
            <div className="text-xs text-gray-500">{row.original.permissionKey}</div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const category = row.original.category;
          if (!category) return <span className="text-gray-400">-</span>;
          return <Badge variant="outline">{category}</Badge>;
        },
      },
    ];

    // Add role columns
    const roleColumns: ColumnDef<PermissionMatrixRow>[] = roles.map((role) => ({
      accessorKey: `rolePermissions.${role}`,
      header: () => <div className="text-center">{getRoleLabel(role)}</div>,
      cell: ({ row }) => {
        const hasPermission = row.original.rolePermissions[role];

        if (hasPermission === 'wildcard') {
          return (
            <div className="flex justify-center" title="Wildcard grant">
              <Asterisk className="h-4 w-4 text-yellow-600" />
            </div>
          );
        }

        if (hasPermission) {
          return (
            <div className="flex justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          );
        }

        return <div className="flex justify-center"><span>-</span></div>;
      },
    }));

    return [...baseColumns, ...roleColumns];
  }, [roles]);

  // CSV Export function
  const handleExportCSV = () => {
    const headers = ['Permission', 'Category', 'Entity Scope', ...roles];
    const rows = filteredPermissions.map((p) => [
      p.permissionKey,
      p.category || '',
      p.entityScope || '',
      ...roles.map((role) => {
        const has = p.rolePermissions[role];
        if (has === 'wildcard') return '✓*';
        if (has) return '✓';
        return '✗';
      }),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permission-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          permissionCounts={permissionCounts}
        />
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <DataTable columns={columns} data={filteredPermissions} />

      <div className="text-sm text-gray-500">
        Showing {filteredPermissions.length} of {permissions.length} permissions
      </div>
    </div>
  );
}
```

---

## 3. Permission Editor Component

**File**: `components/permissions/PermissionEditor.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { AdminUser, AdminPermission } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryFilter } from './CategoryFilter';
import { PermissionCheckbox, PermissionCheckboxValue } from './PermissionCheckbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import { hasPermission } from '@/lib/rbac/permissions';
import { useToast } from '@/hooks/use-toast';

export function PermissionEditor({ adminUser, permissions, onSave }: PermissionEditorProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPermissions, setCustomPermissions] = useState<string[]>(adminUser.permissions);
  const [isSaving, setIsSaving] = useState(false);

  // Get role default permissions
  const roleDefaults = ROLE_CONFIG[adminUser.adminRole]?.defaultPermissions || [];

  // Determine checkbox value for each permission
  const getPermissionValue = (permissionKey: string): PermissionCheckboxValue => {
    const hasFromRole = hasPermission(roleDefaults, permissionKey);
    if (hasFromRole) return 'inherited';

    if (customPermissions.includes(permissionKey)) return 'granted';

    return 'denied';
  };

  // Handle permission toggle
  const handlePermissionChange = (permissionKey: string, newValue: PermissionCheckboxValue) => {
    setCustomPermissions((prev) => {
      if (newValue === 'granted') {
        return [...prev, permissionKey];
      } else {
        return prev.filter((p) => p !== permissionKey);
      }
    });
  };

  // Reset to role defaults
  const handleReset = () => {
    setCustomPermissions([]);
    toast({
      title: 'Permissions reset',
      description: 'All custom permissions removed.',
    });
  };

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(customPermissions);
      toast({
        title: 'Permissions updated',
        description: 'User permissions have been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const original = adminUser.permissions.slice().sort();
    const current = customPermissions.slice().sort();
    return JSON.stringify(original) !== JSON.stringify(current);
  }, [adminUser.permissions, customPermissions]);

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{adminUser.adminRole}</strong> role grants{' '}
          <strong>{roleDefaults.join(', ')}</strong>
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!customPermissions.length}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Role Defaults
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle>{group.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {group.permissions.map((permission) => (
                  <PermissionCheckbox
                    key={permission.permissionKey}
                    permission={permission.permissionKey}
                    label={permission.permissionLabel}
                    value={getPermissionValue(permission.permissionKey)}
                    onChange={(newValue) =>
                      handlePermissionChange(permission.permissionKey, newValue)
                    }
                    roleName={adminUser.adminRole}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Permission Update API Route

**File**: `app/api/admin-users/[id]/permissions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { validatePermissionChange, computePermissionDiff } from '@/lib/rbac/permissions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require super_admin authentication
    const session = await auth();
    if (!session || session.user?.adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { permissions } = body;

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'permissions must be an array' },
        { status: 400 }
      );
    }

    // Fetch current user and target user
    const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
    const currentAdminUser = await client.getAdminUserByUserId(session.user.id);
    const targetAdminUser = await client.getAdminUserById(params.id);

    if (!currentAdminUser || !targetAdminUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate permission change
    const validation = validatePermissionChange(
      currentAdminUser,
      targetAdminUser,
      permissions
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Compute diff for audit logging
    const beforePermissions = targetAdminUser.permissions;
    const afterPermissions = permissions;
    const diff = computePermissionDiff(beforePermissions, afterPermissions);

    // Update permissions
    const updatedUser = await client.updateAdminUser(params.id, {
      permissions: afterPermissions,
      updatedBy: currentAdminUser.id,
    });

    // Create audit log
    await client.createAuditLog({
      adminUserId: currentAdminUser.id,
      action: 'admin_user.permissions_updated',
      entityType: 'admin_users',
      entityId: params.id,
      entityScope: targetAdminUser.entityScope || undefined,
      metadata: {
        targetUserId: params.id,
        changes: {
          permissions: {
            before: beforePermissions,
            after: afterPermissions,
          },
        },
        diff: {
          added: diff.added,
          removed: diff.removed,
          unchanged: diff.unchanged,
        },
      },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      diff,
      warnings: validation.warnings,
    });
  } catch (error) {
    console.error('[API /admin-users/:id/permissions] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
```

---

## 5. Database Migration

**File**: `migrations/002_extend_permissions.sql`

```sql
-- ============================================================================
-- Migration 002: Extend Admin Permissions
-- Expand from 14 to 57 permissions across 10 categories
-- ============================================================================

INSERT INTO admin_permissions (permission_key, permission_label, description, category, entity_scope)
VALUES
    -- Content Management (7 permissions)
    ('content.read', 'Read Content', 'View content items', 'content', NULL),
    ('content.create', 'Create Content', 'Upload new content', 'content', NULL),
    ('content.update', 'Update Content', 'Edit existing content', 'content', NULL),
    ('content.delete', 'Delete Content', 'Remove content', 'content', NULL),
    ('content.approve', 'Approve Content', 'Approve submitted content', 'content', NULL),
    ('content.publish', 'Publish Content', 'Publish to production', 'content', NULL),
    ('content.moderate', 'Moderate Content', 'Review flagged content', 'content', NULL),

    -- Course Management (7 permissions) - Ozean Licht
    ('courses.read', 'Read Courses', 'View course information', 'courses', 'ozean_licht'),
    ('courses.create', 'Create Courses', 'Create new courses', 'courses', 'ozean_licht'),
    ('courses.update', 'Update Courses', 'Modify course content', 'courses', 'ozean_licht'),
    ('courses.delete', 'Delete Courses', 'Remove courses', 'courses', 'ozean_licht'),
    ('courses.publish', 'Publish Courses', 'Make courses available', 'courses', 'ozean_licht'),
    ('courses.enroll', 'Enroll Members', 'Manually enroll members', 'courses', 'ozean_licht'),
    ('courses.export', 'Export Course Data', 'Export course analytics', 'courses', 'ozean_licht'),

    -- Admin Management (11 permissions) - NEW CATEGORY
    ('admin.users.read', 'Read Admin Users', 'View admin accounts', 'admin_management', NULL),
    ('admin.users.create', 'Create Admin Users', 'Create admin accounts', 'admin_management', NULL),
    ('admin.users.update', 'Update Admin Users', 'Modify admin info', 'admin_management', NULL),
    ('admin.users.delete', 'Delete Admin Users', 'Remove admin accounts', 'admin_management', NULL),
    ('admin.roles.manage', 'Manage Roles', 'Assign admin roles', 'admin_management', NULL),
    ('admin.permissions.read', 'Read Permissions', 'View permission matrix', 'admin_management', NULL),
    ('admin.permissions.assign', 'Assign Permissions', 'Grant/revoke permissions', 'admin_management', NULL),
    ('admin.sessions.read', 'Read Admin Sessions', 'View active sessions', 'admin_management', NULL),
    ('admin.sessions.revoke', 'Revoke Admin Sessions', 'Terminate sessions', 'admin_management', NULL),
    ('admin.audit.read', 'Read Admin Audit Logs', 'View audit logs', 'admin_management', NULL),
    ('admin.audit.export', 'Export Admin Audit Logs', 'Export for compliance', 'admin_management', NULL)

    -- ... (additional 36 permissions for members, classrooms, payments, analytics, settings, system)

ON CONFLICT (permission_key) DO UPDATE SET
    permission_label = EXCLUDED.permission_label,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    entity_scope = EXCLUDED.entity_scope;
```

---

## 6. Permission Definitions

**File**: `lib/rbac/permission-categories.ts`

```typescript
export const PERMISSION_DEFINITIONS: Record<string, PermissionDefinition[]> = {
  // User Management (4 permissions)
  users: [
    {
      key: 'users.read',
      label: 'Read Users',
      description: 'View user information and profiles',
      category: 'users',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'users.create',
      label: 'Create Users',
      description: 'Create new user accounts',
      category: 'users',
      entityScope: null,
      actions: ['create'],
    },
    // ... (2 more)
  ],

  // Content Management (7 permissions)
  content: [
    {
      key: 'content.read',
      label: 'Read Content',
      description: 'View content items (videos, articles, media)',
      category: 'content',
      entityScope: null,
      actions: ['read'],
    },
    // ... (6 more)
  ],

  // Admin Management (11 permissions) - NEW
  admin_management: [
    {
      key: 'admin.users.read',
      label: 'Read Admin Users',
      description: 'View admin user accounts',
      category: 'admin_management',
      entityScope: null,
      actions: ['read'],
    },
    {
      key: 'admin.permissions.assign',
      label: 'Assign Permissions',
      description: 'Grant or revoke permissions for admin users',
      category: 'admin_management',
      entityScope: null,
      actions: ['assign'],
    },
    // ... (9 more)
  ],

  // ... (7 more categories: courses, members, classrooms, payments, analytics, settings, system)
};

// Category metadata for UI
export const CATEGORY_METADATA: Record<string, {
  label: string;
  description: string;
  icon: string;
  color: string;
}> = {
  users: {
    label: 'User Management',
    description: 'Manage platform users and accounts',
    icon: 'Users',
    color: 'blue',
  },
  admin_management: {
    label: 'Admin Management',
    description: 'Manage admin users, roles, and permissions',
    icon: 'Shield',
    color: 'pink',
  },
  // ... (8 more categories)
};
```

---

## Summary

**Total Implementation:**
- **2,387 lines of code** across 18 files
- **57 permissions** across 10 categories
- **4 API routes** for permission management
- **7 React components** for UI
- **100% type-safe** (TypeScript strict mode)
- **Zero `any` types** used

**Key Features:**
- ✅ Wildcard permission expansion (`*`, `category.*`, `*.action`)
- ✅ Security validation (self-editing prevention, entity scope enforcement)
- ✅ Audit logging with before/after diffs
- ✅ Visual inheritance indicators (gray = role, green = custom, red = denied)
- ✅ CSV export for compliance
- ✅ Category filtering for easier navigation

**Next Steps:**
1. Run database migration `002_extend_permissions.sql`
2. Manual testing of all features
3. Deploy to production

**Related Files:**
- Full implementation report: `specs/reports/PERMISSIONS_MATRIX_UI_IMPLEMENTATION_REPORT.md`
- Spec document: `specs/admin-permissions-matrix-ui.md`
