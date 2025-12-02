/**
 * Checklist Templates API Route
 *
 * GET /api/checklist-templates - List all checklist templates
 * POST /api/checklist-templates - Create a new checklist template
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllChecklistTemplates, createChecklistTemplate } from '@/lib/db/checklists';
import { z } from 'zod';

// GET /api/checklist-templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskType = searchParams.get('taskType') || undefined;
    const contentTypeId = searchParams.get('contentTypeId') || undefined;
    const isActive = searchParams.get('isActive');

    const templates = await getAllChecklistTemplates({
      taskType,
      contentTypeId,
      isActive: isActive !== null ? isActive === 'true' : undefined,
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Failed to fetch checklist templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checklist templates' },
      { status: 500 }
    );
  }
}

// Validation schema for creating checklist template
const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
  task_type: z.string().max(50).optional(),
  content_type_id: z.string().uuid().optional(),
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    required: z.boolean().optional(),
    order: z.number().int().min(0),
  })).min(1, 'At least one item is required'),
});

// POST /api/checklist-templates
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createTemplateSchema.parse(body);

    const template = await createChecklistTemplate({
      name: validated.name,
      description: validated.description,
      task_type: validated.task_type,
      content_type_id: validated.content_type_id,
      items: validated.items,
      created_by: session.user.id,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create checklist template:', error);
    return NextResponse.json(
      { error: 'Failed to create checklist template' },
      { status: 500 }
    );
  }
}
