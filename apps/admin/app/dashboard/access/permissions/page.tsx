/**
 * Permission Matrix Page
 *
 * Displays the permission matrix (role × permission grid)
 * Only accessible to super_admin
 */

import { requireRole } from '@/lib/rbac/utils';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { formatPermissionMatrix } from '@/lib/rbac/permissions';
import { AdminRole } from '@/types/admin';
import { PermissionMatrix } from '@/components/permissions/PermissionMatrix';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/ui';

export const metadata = {
  title: 'Permission Matrix | Admin Dashboard',
  description: 'View and manage permission assignments across roles',
};

export default async function PermissionsPage() {
  // Require super_admin role
  await requireRole('super_admin');

  // Fetch all permissions from database
  const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
  const permissions = await client.listAdminPermissions();

  // Define roles to include in matrix
  const roles: AdminRole[] = ['super_admin', 'ol_admin', 'ol_editor', 'support'];

  // Format permission matrix
  const matrix = formatPermissionMatrix(roles, permissions);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permission Matrix</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View default permissions for each role. To grant custom permissions to individual users,
          visit their user profile.
        </p>
      </div>

      {/* Matrix Card */}
      <Card>
        <CardHeader>
          <CardTitle>Role × Permission Grid</CardTitle>
          <CardDescription>
            Shows which permissions each role has by default. Wildcard (*) indicates permissions
            granted via wildcard patterns like `*`, `category.*`, or `*.action`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionMatrix permissions={matrix} roles={roles} />
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm">Permission granted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">*</span>
            <span className="text-sm">Permission granted via wildcard (*, category.*, *.action)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300">-</span>
            <span className="text-sm">Permission not granted</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
