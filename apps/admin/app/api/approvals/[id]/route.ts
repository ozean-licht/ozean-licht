/**
 * Single Approval API Route
 *
 * GET /api/approvals/[id] - Get single approval by ID
 * PATCH /api/approvals/[id] - Approve/reject/skip approval
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getApprovalById,
  approveOrReject,
  skipApproval,
  canUserApprove,
} from '@/lib/db/approvals';
import { z } from 'zod';

// GET /api/approvals/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const approval = await getApprovalById(params.id);

    if (!approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ approval });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch approval:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approval' },
      { status: 500 }
    );
  }
}

// Validation schema for deciding approval
const decideApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected', 'skipped'], {
    errorMap: () => ({
      message: 'Status must be approved, rejected, or skipped',
    }),
  }),
  comments: z.string().max(1000).optional(),
});

// PATCH /api/approvals/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = decideApprovalSchema.parse(body);

    // Get the approval to check the gate
    const existingApproval = await getApprovalById(params.id);
    if (!existingApproval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      );
    }

    // RBAC check: verify user has required role for this approval gate
    if (existingApproval.gate_id) {
      const hasPermission = await canUserApprove(
        session.user.adminUserId,
        existingApproval.gate_id
      );
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'You do not have permission to decide on this approval' },
          { status: 403 }
        );
      }
    }

    let approval;

    if (validated.status === 'approved' || validated.status === 'rejected') {
      approval = await approveOrReject(
        params.id,
        validated.status,
        session.user.adminUserId,
        validated.comments
      );
    } else if (validated.status === 'skipped') {
      approval = await skipApproval(
        params.id,
        session.user.adminUserId,
        validated.comments
      );
    }

    if (!approval) {
      return NextResponse.json(
        { error: 'Approval not found or already decided' },
        { status: 404 }
      );
    }

    return NextResponse.json({ approval });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle specific error from skipApproval (cannot skip required approval)
    if (error instanceof Error && error.message === 'Cannot skip required approval') {
      return NextResponse.json(
        { error: 'Cannot skip required approval' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to decide approval:', error);
    return NextResponse.json(
      { error: 'Failed to decide approval' },
      { status: 500 }
    );
  }
}
