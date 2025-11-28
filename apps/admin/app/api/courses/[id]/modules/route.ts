/**
 * API: Course Modules
 * GET /api/courses/[id]/modules - List all modules for a course
 * POST /api/courses/[id]/modules - Create a new module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { listModulesByCourse, createModule } from '@/lib/db/modules';
import { getCourseById } from '@/lib/db/courses';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/courses/[id]/modules
 * List all modules for a course
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = await params;

    // Verify course exists
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch modules
    const result = await listModulesByCourse(courseId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to list modules:', error);
    return NextResponse.json(
      { error: 'Failed to list modules' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[id]/modules
 * Create a new module
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can create modules
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { id: courseId } = await params;

    // Verify course exists
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const { title, description, status } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      );
    }

    if (status && !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be draft or published' },
        { status: 400 }
      );
    }

    // Create module
    const createdModule = await createModule({
      courseId,
      title: title.trim(),
      description: description?.trim() || undefined,
      status: status || 'draft',
    });

    return NextResponse.json(createdModule, { status: 201 });
  } catch (error) {
    console.error('Failed to create module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
