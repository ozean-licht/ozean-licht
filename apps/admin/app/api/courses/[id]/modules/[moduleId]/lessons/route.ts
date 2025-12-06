/**
 * API: Module Lessons
 * GET /api/courses/[id]/modules/[moduleId]/lessons - List all lessons for a module
 * POST /api/courses/[id]/modules/[moduleId]/lessons - Create a new lesson
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { listLessonsByModule, createLesson } from '@/lib/db/lessons';
import { getModuleById } from '@/lib/db/modules';
import { validateQuizData, formatQuizValidationError } from '@/lib/validations/course-builder';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string; moduleId: string }>;
}

const VALID_CONTENT_TYPES = ['video', 'text', 'pdf', 'quiz'] as const;
const VALID_STATUSES = ['draft', 'published'] as const;

/**
 * GET /api/courses/[id]/modules/[moduleId]/lessons
 * List all lessons for a module
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;

    // Verify module exists
    const parentModule = await getModuleById(moduleId);
    if (!parentModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Fetch lessons
    const result = await listLessonsByModule(moduleId);

    return NextResponse.json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to list lessons:', error);
    return NextResponse.json(
      { error: 'Failed to list lessons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[id]/modules/[moduleId]/lessons
 * Create a new lesson
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can create lessons
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { moduleId } = await params;

    // Verify module exists
    const parentModule = await getModuleById(moduleId);
    if (!parentModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
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

    if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `Content type must be one of: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Content-type-specific validation
    if (contentType === 'video' && !videoId) {
      return NextResponse.json(
        { error: 'Video ID is required for video lessons' },
        { status: 400 }
      );
    }

    if (contentType === 'text' && (!contentText || !contentText.trim())) {
      return NextResponse.json(
        { error: 'Content text is required for text lessons' },
        { status: 400 }
      );
    }

    if (contentType === 'pdf' && (!contentUrl || !contentUrl.trim())) {
      return NextResponse.json(
        { error: 'Content URL is required for PDF lessons' },
        { status: 400 }
      );
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be draft or published' },
        { status: 400 }
      );
    }

    // Validate quiz data if provided (Blocker 2 - server-side validation)
    if (contentType === 'quiz' && quizData) {
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

    // Create lesson
    const lesson = await createLesson({
      moduleId,
      title: title.trim(),
      description: description?.trim() || undefined,
      contentType,
      videoId: contentType === 'video' ? videoId : undefined,
      contentText: contentType === 'text' ? contentText.trim() : undefined,
      contentUrl: contentType === 'pdf' ? contentUrl.trim() : undefined,
      quizData: contentType === 'quiz' ? quizData : undefined,
      durationSeconds: durationSeconds ? parseInt(durationSeconds, 10) : undefined,
      isRequired: isRequired ?? false,
      isPreview: isPreview ?? false,
      status: status || 'draft',
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
