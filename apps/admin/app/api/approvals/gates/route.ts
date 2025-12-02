/**
 * Approval Gates API Route
 *
 * GET /api/approvals/gates?workflowId={id} - List approval gates for a workflow
 * POST /api/approvals/gates - Create a new approval gate
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getApprovalGatesByWorkflow,
  createApprovalGate,
} from '@/lib/db/approvals';
import { z } from 'zod';

// GET /api/approvals/gates?workflowId={id}
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      );
    }

    const gates = await getApprovalGatesByWorkflow(workflowId);

    return NextResponse.json({ gates });
  } catch (error) {
    console.error('Failed to fetch approval gates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approval gates' },
      { status: 500 }
    );
  }
}

// Validation schema for creating approval gate
const createApprovalGateSchema = z.object({
  workflow_id: z.string().uuid('Invalid workflow ID'),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional(),
  required_role_id: z.string().uuid('Invalid role ID').optional(),
  order_index: z.number().int().min(0).optional(),
  is_required: z.boolean().optional(),
  from_status_id: z.string().uuid('Invalid from_status ID').optional(),
  to_status_id: z.string().uuid('Invalid to_status ID').optional(),
});

// POST /api/approvals/gates
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createApprovalGateSchema.parse(body);

    const gate = await createApprovalGate({
      workflow_id: validated.workflow_id,
      name: validated.name,
      description: validated.description,
      required_role_id: validated.required_role_id,
      order_index: validated.order_index,
      is_required: validated.is_required,
      from_status_id: validated.from_status_id,
      to_status_id: validated.to_status_id,
    });

    return NextResponse.json({ gate }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create approval gate:', error);
    return NextResponse.json(
      { error: 'Failed to create approval gate' },
      { status: 500 }
    );
  }
}
