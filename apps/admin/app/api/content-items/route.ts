/**
 * Content Items API Route
 *
 * GET /api/content-items - List all content items with filtering
 * POST /api/content-items - Create a new content item
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllContentItems, createContentItem } from '@/lib/db/content-items';
import { z } from 'zod';

// GET /api/content-items
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const result = await getAllContentItems({
      projectId: searchParams.get('projectId') || undefined,
      taskId: searchParams.get('taskId') || undefined,
      contentTypeId: searchParams.get('contentTypeId') || undefined,
      status: searchParams.get('status') || undefined,
      language: searchParams.get('language') || undefined,
      platform: searchParams.get('platform') || undefined,
      search: searchParams.get('search') || undefined,
      isPublished: searchParams.get('isPublished') !== null
        ? searchParams.get('isPublished') === 'true'
        : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      orderBy: searchParams.get('orderBy') || 'created_at',
      orderDirection: searchParams.get('orderDirection') === 'asc' ? 'asc' : 'desc',
    });

    return NextResponse.json({
      items: result.items,
      total: result.total,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    });
  } catch (error) {
    console.error('Failed to fetch content items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content items' },
      { status: 500 }
    );
  }
}

// Validation schema for creating content item
const createContentItemSchema = z.object({
  content_type_id: z.string().uuid('Invalid content type ID'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional(),
  script_content: z.string().optional(),
  project_id: z.string().uuid().optional(),
  task_id: z.string().uuid().optional(),
  source_content_id: z.string().uuid().optional(),
  language: z.string().max(10).optional(),
  status: z.enum(['draft', 'in_production', 'ready_for_review', 'approved', 'scheduled', 'published']).optional(),
  workflow_status_id: z.string().uuid().optional(),
  scheduled_publish_at: z.string().datetime().optional(),
  platforms: z.array(z.string()).optional(),
  platform_urls: z.record(z.string()).optional(),
  duration_seconds: z.number().int().min(0).optional(),
  word_count: z.number().int().min(0).optional(),
  thumbnail_url: z.string().url().optional(),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

// POST /api/content-items
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createContentItemSchema.parse(body);

    const contentItem = await createContentItem({
      ...validated,
      created_by: session.user.id,
    });

    return NextResponse.json({ contentItem }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create content item:', error);
    return NextResponse.json(
      { error: 'Failed to create content item' },
      { status: 500 }
    );
  }
}
