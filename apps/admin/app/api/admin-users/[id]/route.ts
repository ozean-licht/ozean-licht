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
  database: 'shared-users-db',
});

const updateAdminUserSchema = z.object({
  adminRole: z.enum(['super_admin', 'ol_admin', 'ol_editor', 'support']).optional(),
  entityScope: z.enum(['ozean_licht']).nullable().optional(),
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
    // Log error for server-side debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Update admin user error:', error);
    }

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
  _request: NextRequest,
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
    // Log error for server-side debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Get admin user error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
