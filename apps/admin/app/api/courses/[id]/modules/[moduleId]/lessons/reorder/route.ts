/**
 * API: Reorder Lessons
 * POST /api/courses/[id]/modules/[moduleId]/lessons/reorder - Reorder lessons within a module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { reorderLessons, listLessonsByModule } from '@/lib/db/lessons';
import { getModuleById } from '@/lib/db/modules';

interface RouteParams {
  params: Promise<{ id: string; moduleId: string }>;
}

/**
 * POST /api/courses/[id]/modules/[moduleId]/lessons/reorder
 * Reorder lessons within a module
 * Body: { lessonIds: string[] }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can reorder lessons
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { moduleId } = await params;

    // Verify module exists
    const module = await getModuleById(moduleId);
    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const { lessonIds } = body;

    // Validate lessonIds
    if (!Array.isArray(lessonIds)) {
      return NextResponse.json(
        { error: 'lessonIds must be an array' },
        { status: 400 }
      );
    }

    if (lessonIds.length === 0) {
      return NextResponse.json(
        { error: 'lessonIds cannot be empty' },
        { status: 400 }
      );
    }

    // Validate each ID is a string (UUID)
    for (const id of lessonIds) {
      if (typeof id !== 'string') {
        return NextResponse.json(
          { error: 'All lessonIds must be strings' },
          { status: 400 }
        );
      }
    }

    // Verify all lesson IDs belong to this module (foreign key validation)
    const { lessons } = await listLessonsByModule(moduleId);
    const validLessonIds = new Set(lessons.map(l => l.id));
    const invalidIds = lessonIds.filter(id => !validLessonIds.has(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: 'Invalid lesson IDs: some lessons do not belong to this module' },
        { status: 400 }
      );
    }

    // Reorder lessons
    await reorderLessons(moduleId, lessonIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder lessons:', error);
    return NextResponse.json(
      { error: 'Failed to reorder lessons' },
      { status: 500 }
    );
  }
}
