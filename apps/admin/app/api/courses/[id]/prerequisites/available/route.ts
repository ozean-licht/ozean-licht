/**
 * API Route: GET /api/courses/[id]/prerequisites/available
 *
 * Returns lessons available as prerequisites for a given lesson.
 * Excludes the current lesson and lessons that would create circular dependencies.
 *
 * Query params:
 * - lessonId: The lesson to get available prerequisites for
 *
 * Part of Phase 9: Learning Sequences
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAvailablePrerequisites } from '@/lib/db/prerequisites';
import { getLessonById } from '@/lib/db/lessons';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = await params;
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId query parameter is required' },
        { status: 400 }
      );
    }

    // Authorization: Verify the lesson belongs to the course
    // (This prevents unauthorized access to other courses' lessons)
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Verify the lesson's module belongs to this course
    const lessonCourseCheck = await query<{ course_id: string }>(
      'SELECT course_id FROM course_modules WHERE id = $1',
      [lesson.moduleId]
    );

    if (lessonCourseCheck.length === 0 || lessonCourseCheck[0].course_id !== courseId) {
      return NextResponse.json(
        { error: 'Forbidden: Lesson does not belong to this course' },
        { status: 403 }
      );
    }

    // Get available lessons that can be set as prerequisites
    const availableLessons = await getAvailablePrerequisites(lessonId);

    return NextResponse.json(availableLessons);
  } catch (error) {
    console.error('Failed to get available prerequisites:', error);
    return NextResponse.json(
      { error: 'Failed to get available prerequisites' },
      { status: 500 }
    );
  }
}
