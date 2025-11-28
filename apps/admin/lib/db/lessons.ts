/**
 * Course Lessons Database Queries
 *
 * Direct PostgreSQL queries for course lesson management.
 * Part of Course Builder feature.
 */

import { query, execute, transaction, PoolClient } from './index';
import { Lesson, Video, CreateLessonInput, UpdateLessonInput, LessonContentType, LessonStatus } from '@/types/content';

// Database row type (snake_case)
interface LessonRow {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content_type: string;
  video_id: string | null;
  content_text: string | null;
  content_url: string | null;
  quiz_data: Record<string, unknown> | null;
  duration_seconds: number | null;
  is_required: boolean;
  is_preview: boolean;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined video fields
  video_title?: string;
  video_description?: string;
  video_url?: string;
  video_thumbnail_url?: string;
  video_duration_seconds?: number;
  video_status?: string;
}

/**
 * Map database row to Lesson type
 */
function mapLesson(row: LessonRow): Lesson {
  const lesson: Lesson = {
    id: row.id,
    moduleId: row.module_id,
    title: row.title,
    description: row.description || undefined,
    contentType: row.content_type as LessonContentType,
    videoId: row.video_id || undefined,
    contentText: row.content_text || undefined,
    contentUrl: row.content_url || undefined,
    quizData: row.quiz_data || undefined,
    durationSeconds: row.duration_seconds || undefined,
    isRequired: row.is_required,
    isPreview: row.is_preview,
    sortOrder: row.sort_order,
    status: row.status as LessonStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  // Add joined video if present
  if (row.video_id && row.video_title) {
    lesson.video = {
      id: row.video_id,
      title: row.video_title,
      description: row.video_description || undefined,
      videoUrl: row.video_url || undefined,
      thumbnailUrl: row.video_thumbnail_url || undefined,
      durationSeconds: row.video_duration_seconds || undefined,
      status: (row.video_status || 'draft') as Video['status'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return lesson;
}

export interface ListLessonsResult {
  lessons: Lesson[];
  total: number;
}

/**
 * List all lessons for a module, ordered by sort_order
 */
export async function listLessonsByModule(moduleId: string): Promise<ListLessonsResult> {
  // Count query
  const countSql = `SELECT COUNT(*) as count FROM course_lessons WHERE module_id = $1`;
  const countResult = await query<{ count: string }>(countSql, [moduleId]);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with video join
  const dataSql = `
    SELECT
      l.id, l.module_id, l.title, l.description,
      l.content_type, l.video_id, l.content_text, l.content_url, l.quiz_data,
      l.duration_seconds, l.is_required, l.is_preview,
      l.sort_order, l.status, l.created_at, l.updated_at,
      v.title as video_title, v.description as video_description,
      v.video_url, v.thumbnail_url as video_thumbnail_url,
      v.duration_seconds as video_duration_seconds, v.status as video_status
    FROM course_lessons l
    LEFT JOIN videos v ON v.id = l.video_id
    WHERE l.module_id = $1
    ORDER BY l.sort_order ASC
  `;

  const rows = await query<LessonRow>(dataSql, [moduleId]);

  return {
    lessons: rows.map(mapLesson),
    total,
  };
}

/**
 * Get a single lesson by ID with video join
 */
export async function getLessonById(id: string): Promise<Lesson | null> {
  const sql = `
    SELECT
      l.id, l.module_id, l.title, l.description,
      l.content_type, l.video_id, l.content_text, l.content_url, l.quiz_data,
      l.duration_seconds, l.is_required, l.is_preview,
      l.sort_order, l.status, l.created_at, l.updated_at,
      v.title as video_title, v.description as video_description,
      v.video_url, v.thumbnail_url as video_thumbnail_url,
      v.duration_seconds as video_duration_seconds, v.status as video_status
    FROM course_lessons l
    LEFT JOIN videos v ON v.id = l.video_id
    WHERE l.id = $1
  `;

  const rows = await query<LessonRow>(sql, [id]);
  return rows.length > 0 ? mapLesson(rows[0]) : null;
}

/**
 * Create a new lesson (auto-increments sort_order)
 */
export async function createLesson(input: CreateLessonInput): Promise<Lesson> {
  // Get the next sort_order for this module
  const maxOrderSql = `
    SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order
    FROM course_lessons
    WHERE module_id = $1
  `;
  const maxOrderResult = await query<{ next_order: number }>(maxOrderSql, [input.moduleId]);
  const nextOrder = maxOrderResult[0]?.next_order || 0;

  const sql = `
    INSERT INTO course_lessons (
      module_id, title, description, content_type,
      video_id, content_text, content_url,
      duration_seconds, is_required, is_preview, sort_order, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id, module_id, title, description, content_type,
      video_id, content_text, content_url, quiz_data,
      duration_seconds, is_required, is_preview, sort_order, status,
      created_at, updated_at
  `;

  const rows = await query<LessonRow>(sql, [
    input.moduleId,
    input.title,
    input.description || null,
    input.contentType,
    input.videoId || null,
    input.contentText || null,
    input.contentUrl || null,
    input.durationSeconds || null,
    input.isRequired ?? false,
    input.isPreview ?? false,
    nextOrder,
    input.status || 'draft',
  ]);

  return mapLesson(rows[0]);
}

/**
 * Update a lesson
 */
export async function updateLesson(id: string, input: UpdateLessonInput): Promise<Lesson | null> {
  // Build dynamic SET clause
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    params.push(input.title);
  }

  if (input.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    params.push(input.description);
  }

  if (input.contentType !== undefined) {
    setClauses.push(`content_type = $${paramIndex++}`);
    params.push(input.contentType);
  }

  if (input.videoId !== undefined) {
    setClauses.push(`video_id = $${paramIndex++}`);
    params.push(input.videoId || null);
  }

  if (input.contentText !== undefined) {
    setClauses.push(`content_text = $${paramIndex++}`);
    params.push(input.contentText || null);
  }

  if (input.contentUrl !== undefined) {
    setClauses.push(`content_url = $${paramIndex++}`);
    params.push(input.contentUrl || null);
  }

  if (input.durationSeconds !== undefined) {
    setClauses.push(`duration_seconds = $${paramIndex++}`);
    params.push(input.durationSeconds);
  }

  if (input.isRequired !== undefined) {
    setClauses.push(`is_required = $${paramIndex++}`);
    params.push(input.isRequired);
  }

  if (input.isPreview !== undefined) {
    setClauses.push(`is_preview = $${paramIndex++}`);
    params.push(input.isPreview);
  }

  if (input.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    params.push(input.status);
  }

  if (setClauses.length === 0) {
    return getLessonById(id);
  }

  params.push(id);

  const sql = `
    UPDATE course_lessons
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, module_id, title, description, content_type,
      video_id, content_text, content_url, quiz_data,
      duration_seconds, is_required, is_preview, sort_order, status,
      created_at, updated_at
  `;

  const rows = await query<LessonRow>(sql, params);
  return rows.length > 0 ? mapLesson(rows[0]) : null;
}

/**
 * Delete a lesson
 */
export async function deleteLesson(id: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM course_lessons WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Reorder lessons within a module
 * @param moduleId - The module ID
 * @param lessonIds - Array of lesson IDs in desired order
 */
export async function reorderLessons(moduleId: string, lessonIds: string[]): Promise<void> {
  await transaction(async (client: PoolClient) => {
    for (let i = 0; i < lessonIds.length; i++) {
      await client.query(
        `UPDATE course_lessons SET sort_order = $1 WHERE id = $2 AND module_id = $3`,
        [i, lessonIds[i], moduleId]
      );
    }
  });
}

/**
 * Get total lesson count for a course (across all modules)
 */
export async function getLessonCountByCourse(courseId: string): Promise<number> {
  const sql = `
    SELECT COUNT(*) as count
    FROM course_lessons l
    JOIN course_modules m ON m.id = l.module_id
    WHERE m.course_id = $1
  `;

  const result = await query<{ count: string }>(sql, [courseId]);
  return parseInt(result[0]?.count || '0', 10);
}

/**
 * Get total duration for a course (across all modules)
 */
export async function getTotalDurationByCourse(courseId: string): Promise<number> {
  const sql = `
    SELECT COALESCE(SUM(l.duration_seconds), 0) as total
    FROM course_lessons l
    JOIN course_modules m ON m.id = l.module_id
    WHERE m.course_id = $1
  `;

  const result = await query<{ total: string }>(sql, [courseId]);
  return parseInt(result[0]?.total || '0', 10);
}
