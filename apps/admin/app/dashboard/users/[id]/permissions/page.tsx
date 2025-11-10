/**
 * User Permissions Page
 *
 * Edit permissions for a specific admin user
 * Shows role defaults + custom permissions with visual inheritance
 */

import { notFound, redirect } from 'next/navigation';
import { requireRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { PermissionEditorClient } from './permission-editor-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel } from '@/lib/rbac/constants';

export const metadata = {
  title: 'User Permissions | Admin Dashboard',
  description: 'Manage user-specific permissions',
};

export default async function UserPermissionsPage({
  params,
}: {
  params: { id: string };
}) {
  // Require super_admin role
  const session = await requireRole('super_admin');

  // Fetch admin user
  const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
  const adminUser = await client.getAdminUserById(params.id);

  if (!adminUser) {
    notFound();
  }

  // Prevent self-editing (security rule)
  const currentAdminUser = await client.getAdminUserByUserId(session.user.id);
  if (currentAdminUser && currentAdminUser.id === adminUser.id) {
    redirect(`/dashboard/users/${params.id}?error=cannot_edit_own_permissions`);
  }

  // Fetch all permissions
  const permissions = await client.listAdminPermissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">User Permissions</h1>
          <Badge>{getRoleLabel(adminUser.adminRole)}</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage custom permissions for this user. Gray permissions are inherited from the user's
          role and cannot be revoked here.
        </p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            Custom permissions supplement role defaults. Use this to grant additional access or
            create exceptions. Changes take effect on next login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700" />
              <span>Inherited from role (cannot be revoked)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-200 dark:bg-green-900" />
              <span>Custom grant (additional permission)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-200 dark:bg-red-900" />
              <span>Denied (not granted)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Editor */}
      <PermissionEditorClient adminUser={adminUser} permissions={permissions} />
    </div>
  );
}
