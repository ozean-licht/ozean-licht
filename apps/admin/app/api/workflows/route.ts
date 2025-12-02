/**
 * Workflows API Route
 *
 * GET /api/workflows - List all workflow definitions
 * POST /api/workflows - Create a new workflow definition
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllWorkflows, createWorkflow } from '@/lib/db/workflows';
import { z } from 'zod';

// GET /api/workflows
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectType = searchParams.get('projectType') || undefined;
    const isActive = searchParams.get('isActive');

    const workflows = await getAllWorkflows({
      projectType,
      isActive: isActive !== null ? isActive === 'true' : undefined,
    });

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Failed to fetch workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

// Validation schema for creating workflow
const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional(),
  project_type: z.enum(['video', 'course', 'blog', 'social', 'general']),
  is_default: z.boolean().optional(),
});

// POST /api/workflows
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createWorkflowSchema.parse(body);

    const workflow = await createWorkflow({
      name: validated.name,
      description: validated.description,
      project_type: validated.project_type,
      is_default: validated.is_default,
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
