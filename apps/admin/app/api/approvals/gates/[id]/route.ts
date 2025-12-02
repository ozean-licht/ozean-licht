/**
 * Single Approval Gate API Route
 *
 * GET /api/approvals/gates/[id] - Get single approval gate
 * PATCH /api/approvals/gates/[id] - Update approval gate
 * DELETE /api/approvals/gates/[id] - Delete approval gate
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getApprovalGateById,
  updateApprovalGate,
  deleteApprovalGate,
} from '@/lib/db/approvals';
import { z } from 'zod';

// GET /api/approvals/gates/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gate = await getApprovalGateById(params.id);

    if (!gate) {
      return NextResponse.json(
        { error: 'Approval gate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ gate });
  } catch (error) {
    console.error('Failed to fetch approval gate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approval gate' },
      { status: 500 }
    );
  }
}

// Validation schema for updating approval gate
const updateApprovalGateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).nullable().optional(),
  required_role_id: z.string().uuid().nullable().optional(),
  order_index: z.number().int().min(0).optional(),
  is_required: z.boolean().optional(),
  from_status_id: z.string().uuid().nullable().optional(),
  to_status_id: z.string().uuid().nullable().optional(),
});

// PATCH /api/approvals/gates/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateApprovalGateSchema.parse(body);

    const gate = await updateApprovalGate(params.id, validated);

    if (!gate) {
      return NextResponse.json(
        { error: 'Approval gate not found or no changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json({ gate });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update approval gate:', error);
    return NextResponse.json(
      { error: 'Failed to update approval gate' },
      { status: 500 }
    );
  }
}

// DELETE /api/approvals/gates/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteApprovalGate(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Approval gate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete approval gate:', error);
    return NextResponse.json(
      { error: 'Failed to delete approval gate' },
      { status: 500 }
    );
  }
}
