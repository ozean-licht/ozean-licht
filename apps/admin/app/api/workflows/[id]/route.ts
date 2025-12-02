/**
 * Workflow Detail API Route
 *
 * GET /api/workflows/[id] - Get a workflow with its statuses
 * PATCH /api/workflows/[id] - Update a workflow
 * DELETE /api/workflows/[id] - Delete a workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getWorkflowById, updateWorkflow } from '@/lib/db/workflows';
import { execute } from '@/lib/db';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/workflows/[id]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Workflow ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const workflow = await getWorkflowById(id);

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Failed to fetch workflow:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Validation schema for updating workflow
const updateWorkflowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// PATCH /api/workflows/[id]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Workflow ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const body = await request.json();
    const validated = updateWorkflowSchema.parse(body);

    const workflow = await updateWorkflow(id, validated);

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update workflow:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/workflows/[id]
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Workflow ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    // Soft delete by setting is_active = false
    const result = await execute(
      'UPDATE workflow_definitions SET is_active = false WHERE id = $1',
      [id]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
