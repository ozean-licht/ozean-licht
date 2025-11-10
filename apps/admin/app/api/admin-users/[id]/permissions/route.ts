/**
 * PATCH /api/admin-users/[id]/permissions
 *
 * Update permissions for a specific admin user
 * Only super_admin can modify permissions
 * Includes validation and audit logging
 */

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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.adminRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only super admin can edit permissions' },
        { status: 403 }
      );
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

    if (!currentAdminUser) {
      return NextResponse.json(
        { error: 'Current admin user not found' },
        { status: 404 }
      );
    }

    if (!targetAdminUser) {
      return NextResponse.json(
        { error: 'Target admin user not found' },
        { status: 404 }
      );
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
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
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
