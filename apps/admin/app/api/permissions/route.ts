/**
 * GET /api/permissions
 *
 * List all available permissions with optional filtering by category and entity scope
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { MCPGatewayClientWithQueries } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  try {
    // Require authentication (any admin role can view permissions)
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    // Fetch permissions from database via MCP Gateway
    const client = new MCPGatewayClientWithQueries({ database: 'ozean-licht-db' });
    const permissions = await client.listAdminPermissions(category);

    // Filter by entity scope if provided
    const entityScope = searchParams.get('entityScope');
    const filteredPermissions = entityScope
      ? permissions.filter((p) => p.entityScope === entityScope || p.entityScope === null)
      : permissions;

    // Group by category for easier UI rendering
    const grouped = filteredPermissions.reduce((acc, permission) => {
      const cat = permission.category || 'uncategorized';
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(permission);
      return acc;
    }, {} as Record<string, typeof permissions>);

    return NextResponse.json({
      permissions: filteredPermissions,
      grouped,
      total: filteredPermissions.length,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /permissions] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
