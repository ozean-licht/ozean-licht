/**
 * API: Reorder Modules
 * POST /api/courses/[id]/modules/reorder - Reorder modules within a course
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { reorderModules, listModulesByCourse } from '@/lib/db/modules';
import { getCourseById } from '@/lib/db/courses';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/courses/[id]/modules/reorder
 * Reorder modules within a course
 * Body: { moduleIds: string[] }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can reorder modules
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
    const { moduleIds } = body;

    // Validate moduleIds
    if (!Array.isArray(moduleIds)) {
      return NextResponse.json(
        { error: 'moduleIds must be an array' },
        { status: 400 }
      );
    }

    if (moduleIds.length === 0) {
      return NextResponse.json(
        { error: 'moduleIds cannot be empty' },
        { status: 400 }
      );
    }

    // Validate each ID is a string (UUID)
    for (const id of moduleIds) {
      if (typeof id !== 'string') {
        return NextResponse.json(
          { error: 'All moduleIds must be strings' },
          { status: 400 }
        );
      }
    }

    // Verify all module IDs belong to this course (foreign key validation)
    const { modules } = await listModulesByCourse(courseId);
    const validModuleIds = new Set(modules.map(m => m.id));
    const invalidIds = moduleIds.filter(id => !validModuleIds.has(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: 'Invalid module IDs: some modules do not belong to this course' },
        { status: 400 }
      );
    }

    // Reorder modules
    await reorderModules(courseId, moduleIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder modules:', error);
    return NextResponse.json(
      { error: 'Failed to reorder modules' },
      { status: 500 }
    );
  }
}
