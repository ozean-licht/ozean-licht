/**
 * Lesson Move API Route
 *
 * POST /api/lessons/[lessonId]/move - Move a lesson to a different module with reordering
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { transaction } from '@/lib/db';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

// Validation schema for moving lesson
const moveLessonSchema = z.object({
  targetModuleId: z.string().uuid('Target module ID must be a valid UUID'),
  position: z.number().int().min(0, 'Position must be a non-negative integer'),
});

// POST /api/lessons/[lessonId]/move
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can move lessons
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { lessonId } = await context.params;

    // Validate lesson UUID
    const validation = validateUUID(lessonId, 'Lesson ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = moveLessonSchema.parse(body);

    const { targetModuleId, position } = validated;

    // Validate target module UUID (additional check beyond zod)
    const moduleValidation = validateUUID(targetModuleId, 'Target module ID');
    if (!moduleValidation.valid) {
      return NextResponse.json(
        { error: moduleValidation.error!.message },
        { status: moduleValidation.error!.status }
      );
    }

    // Execute move operation in a transaction to ensure data consistency
    const result = await transaction(async (client) => {
      // 1. Check if lesson exists and get current module info
      // Use FOR UPDATE to lock the lesson row and prevent concurrent modifications
      const lessonResult = await client.query(
        'SELECT id, module_id, title FROM course_lessons WHERE id = $1 FOR UPDATE',
        [lessonId]
      );

      if (lessonResult.rows.length === 0) {
        throw new Error('LESSON_NOT_FOUND');
      }

      const lesson = lessonResult.rows[0];
      const sourceModuleId = lesson.module_id;

      // 2. Verify target module exists
      const moduleResult = await client.query(
        'SELECT id FROM course_modules WHERE id = $1',
        [targetModuleId]
      );

      if (moduleResult.rows.length === 0) {
        throw new Error('MODULE_NOT_FOUND');
      }

      // If moving to the same module, this is a reorder operation (not a cross-module move)
      // But we'll handle it anyway for consistency

      // 3. Lock all affected lessons in the target module to prevent race conditions
      //    This ensures no other transaction can modify these rows simultaneously
      await client.query(
        `SELECT id FROM course_lessons
         WHERE module_id = $1 AND sort_order >= $2
         FOR UPDATE`,
        [targetModuleId, position]
      );

      // 4. Shift down lessons in target module at and after the target position
      //    to make room for the incoming lesson
      await client.query(
        `UPDATE course_lessons
         SET sort_order = sort_order + 1
         WHERE module_id = $1 AND sort_order >= $2`,
        [targetModuleId, position]
      );

      // 5. Update the lesson's module_id and sort_order
      await client.query(
        `UPDATE course_lessons
         SET module_id = $1, sort_order = $2, updated_at = NOW()
         WHERE id = $3`,
        [targetModuleId, position, lessonId]
      );

      // 6. Reorder lessons in the source module (if different from target)
      //    to close the gap left by the moved lesson
      if (sourceModuleId !== targetModuleId) {
        // Lock source module lessons to prevent race conditions
        await client.query(
          `SELECT id FROM course_lessons
           WHERE module_id = $1
           FOR UPDATE`,
          [sourceModuleId]
        );

        await client.query(
          `UPDATE course_lessons
           SET sort_order = sort_order - 1
           WHERE module_id = $1 AND sort_order > (
             SELECT sort_order FROM course_lessons WHERE id = $2
           )`,
          [sourceModuleId, lessonId]
        );
      }

      // 7. Return updated lesson data
      const updatedLessonResult = await client.query(
        `SELECT
          id,
          module_id,
          title,
          description,
          content_type,
          sort_order,
          status,
          created_at,
          updated_at
         FROM course_lessons
         WHERE id = $1`,
        [lessonId]
      );

      return updatedLessonResult.rows[0];
    });

    return NextResponse.json({
      success: true,
      lesson: result,
      message: 'Lesson moved successfully',
    });

  } catch (error) {
    // Handle custom error messages
    if (error instanceof Error) {
      if (error.message === 'LESSON_NOT_FOUND') {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        );
      }
      if (error.message === 'MODULE_NOT_FOUND') {
        return NextResponse.json(
          { error: 'Target module not found' },
          { status: 404 }
        );
      }
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle PostgreSQL errors
    // eslint-disable-next-line no-console
    console.error('Failed to move lesson:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
