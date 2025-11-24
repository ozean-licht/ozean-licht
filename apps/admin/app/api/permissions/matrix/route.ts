/**
 * GET /api/permissions/matrix
 *
 * Returns the permission matrix (role × permission grid) for visualization
 * Only accessible to super_admin
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';
import { formatPermissionMatrix } from '@/lib/rbac/permissions';
import { AdminRole } from '@/types/admin';

export async function GET() {
  try {
    // Require super_admin authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.adminRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Super admin only' },
        { status: 403 }
      );
    }

    // Fetch all permissions from database
    const client = new MCPGatewayClientWithQueries({ database: 'shared-users-db' });
    const permissions = await client.listAdminPermissions();

    // Define roles to include in matrix
    const roles: AdminRole[] = ['super_admin', 'ol_admin', 'ol_editor', 'support'];

    // Format permission matrix
    const matrix = formatPermissionMatrix(roles, permissions);

    return NextResponse.json({
      matrix,
      roles,
      totalPermissions: permissions.length,
    });
  } catch (error) {
    console.error('[API /permissions/matrix] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate permission matrix' },
      { status: 500 }
    );
  }
}
