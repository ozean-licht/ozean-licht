/**
 * POST /api/permissions/check
 *
 * Check if a specific admin user has a permission
 * Utility endpoint for debugging/troubleshooting permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { adminUserId, permissionKey } = body;

    if (!adminUserId || !permissionKey) {
      return NextResponse.json(
        { error: 'Missing adminUserId or permissionKey' },
        { status: 400 }
      );
    }

    // Check permission via MCP Gateway
    const client = new MCPGatewayClientWithQueries({ database: 'ozean-licht-db' });
    const hasPermission = await client.checkPermission(adminUserId, permissionKey);

    // Get user details to determine source
    const adminUser = await client.getAdminUserById(adminUserId);
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Determine permission source
    let source: 'wildcard' | 'role' | 'custom' | 'none' = 'none';

    if (hasPermission) {
      if (adminUser.permissions.includes('*')) {
        source = 'wildcard';
      } else if (adminUser.permissions.includes(permissionKey)) {
        source = 'custom';
      } else {
        // Check if it's from role defaults or wildcard expansion
        const parts = permissionKey.split('.');
        if (parts.length >= 2) {
          const category = parts[0];
          const action = parts[parts.length - 1];

          if (
            adminUser.permissions.includes(`${category}.*`) ||
            adminUser.permissions.includes(`*.${action}`)
          ) {
            source = 'wildcard';
          } else {
            source = 'role';
          }
        }
      }
    }

    return NextResponse.json({
      hasPermission,
      source,
      adminUser: {
        id: adminUser.id,
        adminRole: adminUser.adminRole,
        permissions: adminUser.permissions,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /permissions/check] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check permission' },
      { status: 500 }
    );
  }
}
