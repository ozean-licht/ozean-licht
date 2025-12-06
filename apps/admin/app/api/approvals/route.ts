/**
 * Approvals API Route
 *
 * GET /api/approvals - Get pending approvals (with optional filters)
 * POST /api/approvals - Request new approval
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getPendingApprovals,
  createApproval,
  type ApprovalEntityType,
  type PendingApprovalFilters,
} from '@/lib/db/approvals';
import { z } from 'zod';

// GET /api/approvals?gateId=...&entityType=...&userId=...
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const filters: PendingApprovalFilters = {};

    const gateId = searchParams.get('gateId');
    if (gateId) filters.gateId = gateId;

    const entityType = searchParams.get('entityType');
    if (entityType) {
      filters.entityType = entityType as ApprovalEntityType;
    }

    const userId = searchParams.get('userId');
    if (userId) filters.userId = userId;

    const entityId = searchParams.get('entityId');
    if (entityId) filters.entityId = entityId;

    const workflowId = searchParams.get('workflowId');
    if (workflowId) filters.workflowId = workflowId;

    const limit = searchParams.get('limit');
    if (limit) filters.limit = parseInt(limit, 10);

    const offset = searchParams.get('offset');
    if (offset) filters.offset = parseInt(offset, 10);

    const approvals = await getPendingApprovals(filters);

    return NextResponse.json({ approvals });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch pending approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending approvals' },
      { status: 500 }
    );
  }
}

// Validation schema for requesting approval
const requestApprovalSchema = z.object({
  gateId: z.string().uuid('Invalid gate ID'),
  entityId: z.string().uuid('Invalid entity ID'),
  entityType: z.enum(['task', 'content_item'], {
    errorMap: () => ({ message: 'Entity type must be task or content_item' }),
  }),
});

// POST /api/approvals
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = requestApprovalSchema.parse(body);

    const approval = await createApproval({
      gate_id: validated.gateId,
      entity_id: validated.entityId,
      entity_type: validated.entityType,
    });

    return NextResponse.json({ approval }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Failed to request approval:', error);
    return NextResponse.json(
      { error: 'Failed to request approval' },
      { status: 500 }
    );
  }
}
