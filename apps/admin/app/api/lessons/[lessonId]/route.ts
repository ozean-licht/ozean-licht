/**
 * API: Single Lesson
 * GET /api/lessons/[lessonId] - Get lesson details
 * PATCH /api/lessons/[lessonId] - Update lesson
 * DELETE /api/lessons/[lessonId] - Delete lesson
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { getLessonById, updateLesson, deleteLesson } from '@/lib/db/lessons';
import { validateQuizData, formatQuizValidationError } from '@/lib/validations/course-builder';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ lessonId: string }>;
}

const VALID_CONTENT_TYPES = ['video', 'text', 'pdf', 'quiz'] as const;
const VALID_STATUSES = ['draft', 'published'] as const;

/**
 * GET /api/lessons/[lessonId]
 * Get lesson details
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;

    // Fetch lesson
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Failed to get lesson:', error);
    return NextResponse.json(
      { error: 'Failed to get lesson' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lessons/[lessonId]
 * Update lesson
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can update lessons
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { lessonId } = await params;

    // Verify lesson exists
    const existingLesson = await getLessonById(lessonId);
    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const {
      title,
      description,
      contentType,
      videoId,
      contentText,
      contentUrl,
      quizData,
      durationSeconds,
      isRequired,
      isPreview,
      status,
    } = body;

    // Validate fields if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title must be 200 characters or less' },
          { status: 400 }
        );
      }
    }

    if (contentType !== undefined && !VALID_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `Content type must be one of: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be draft or published' },
        { status: 400 }
      );
    }

    // Determine effective content type for validation
    const effectiveContentType = contentType ?? existingLesson.contentType;

    // Content-type-specific validation
    if (effectiveContentType === 'video' && videoId !== undefined && !videoId) {
      return NextResponse.json(
        { error: 'Video ID is required for video lessons' },
        { status: 400 }
      );
    }

    if (effectiveContentType === 'text' && contentText !== undefined && !contentText?.trim()) {
      return NextResponse.json(
        { error: 'Content text is required for text lessons' },
        { status: 400 }
      );
    }

    if (effectiveContentType === 'pdf' && contentUrl !== undefined && !contentUrl?.trim()) {
      return NextResponse.json(
        { error: 'Content URL is required for PDF lessons' },
        { status: 400 }
      );
    }

    // Validate quiz data if provided (Blocker 2 - server-side validation)
    if (effectiveContentType === 'quiz' && quizData !== undefined && quizData !== null) {
      try {
        validateQuizData(quizData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: formatQuizValidationError(error),
            },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    // Update lesson
    const updatedLesson = await updateLesson(lessonId, {
      title: title?.trim(),
      description: description !== undefined ? (description?.trim() || undefined) : undefined,
      contentType,
      videoId: videoId !== undefined ? (videoId || undefined) : undefined,
      contentText: contentText !== undefined ? (contentText?.trim() || undefined) : undefined,
      contentUrl: contentUrl !== undefined ? (contentUrl?.trim() || undefined) : undefined,
      quizData: quizData !== undefined ? quizData : undefined,
      durationSeconds: durationSeconds !== undefined ? (durationSeconds ? parseInt(durationSeconds, 10) : undefined) : undefined,
      isRequired,
      isPreview,
      status,
    });

    if (!updatedLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Failed to update lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lessons/[lessonId]
 * Delete lesson
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can delete lessons
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { lessonId } = await params;

    // Verify lesson exists
    const existingLesson = await getLessonById(lessonId);
    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Delete lesson
    const deleted = await deleteLesson(lessonId);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
