/**
 * Course Modules Database Queries
 *
 * Direct PostgreSQL queries for course module management.
 * Part of Course Builder feature.
 */

import { query, execute, transaction, PoolClient } from './index';
import { Module, ModuleWithLessons, CreateModuleInput, UpdateModuleInput, Lesson, LessonContentType, LessonStatus, VideoStatus } from '@/types/content';

// Database row type (snake_case)
interface ModuleRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  lesson_count?: string;
  total_duration_seconds?: string;
}

/**
 * Map database row to Module type
 */
function mapModule(row: ModuleRow): Module {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    description: row.description || undefined,
    sortOrder: row.sort_order,
    status: row.status as Module['status'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lessonCount: row.lesson_count ? parseInt(row.lesson_count, 10) : undefined,
    totalDurationSeconds: row.total_duration_seconds ? parseInt(row.total_duration_seconds, 10) : undefined,
  };
}

export interface ListModulesResult {
  modules: Module[];
  total: number;
}

/**
 * List all modules for a course, ordered by sort_order
 */
export async function listModulesByCourse(courseId: string): Promise<ListModulesResult> {
  // Count query
  const countSql = `SELECT COUNT(*) as count FROM course_modules WHERE course_id = $1`;
  const countResult = await query<{ count: string }>(countSql, [courseId]);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with lesson count and total duration
  const dataSql = `
    SELECT
      m.id, m.course_id, m.title, m.description,
      m.sort_order, m.status, m.created_at, m.updated_at,
      COUNT(l.id)::text as lesson_count,
      COALESCE(SUM(l.duration_seconds), 0)::text as total_duration_seconds
    FROM course_modules m
    LEFT JOIN course_lessons l ON l.module_id = m.id
    WHERE m.course_id = $1
    GROUP BY m.id
    ORDER BY m.sort_order ASC
  `;

  const rows = await query<ModuleRow>(dataSql, [courseId]);

  return {
    modules: rows.map(mapModule),
    total,
  };
}

/**
 * Get a single module by ID
 */
export async function getModuleById(id: string): Promise<Module | null> {
  const sql = `
    SELECT
      m.id, m.course_id, m.title, m.description,
      m.sort_order, m.status, m.created_at, m.updated_at,
      COUNT(l.id)::text as lesson_count,
      COALESCE(SUM(l.duration_seconds), 0)::text as total_duration_seconds
    FROM course_modules m
    LEFT JOIN course_lessons l ON l.module_id = m.id
    WHERE m.id = $1
    GROUP BY m.id
  `;

  const rows = await query<ModuleRow>(sql, [id]);
  return rows.length > 0 ? mapModule(rows[0]) : null;
}

/**
 * Create a new module (auto-increments sort_order)
 */
export async function createModule(input: CreateModuleInput): Promise<Module> {
  // Get the next sort_order for this course
  const maxOrderSql = `
    SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order
    FROM course_modules
    WHERE course_id = $1
  `;
  const maxOrderResult = await query<{ next_order: number }>(maxOrderSql, [input.courseId]);
  const nextOrder = maxOrderResult[0]?.next_order || 0;

  const sql = `
    INSERT INTO course_modules (course_id, title, description, sort_order, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, course_id, title, description, sort_order, status, created_at, updated_at
  `;

  const rows = await query<ModuleRow>(sql, [
    input.courseId,
    input.title,
    input.description || null,
    nextOrder,
    input.status || 'draft',
  ]);

  return mapModule(rows[0]);
}

/**
 * Update a module
 */
export async function updateModule(id: string, input: UpdateModuleInput): Promise<Module | null> {
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

  if (input.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    params.push(input.status);
  }

  if (setClauses.length === 0) {
    return getModuleById(id);
  }

  params.push(id);

  const sql = `
    UPDATE course_modules
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, course_id, title, description, sort_order, status, created_at, updated_at
  `;

  const rows = await query<ModuleRow>(sql, params);
  return rows.length > 0 ? mapModule(rows[0]) : null;
}

/**
 * Delete a module (cascades to lessons)
 */
export async function deleteModule(id: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM course_modules WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Reorder modules within a course
 * @param courseId - The course ID
 * @param moduleIds - Array of module IDs in desired order
 */
export async function reorderModules(courseId: string, moduleIds: string[]): Promise<void> {
  await transaction(async (client: PoolClient) => {
    for (let i = 0; i < moduleIds.length; i++) {
      await client.query(
        `UPDATE course_modules SET sort_order = $1 WHERE id = $2 AND course_id = $3`,
        [i, moduleIds[i], courseId]
      );
    }
  });
}

/**
 * Get module with nested lessons
 */
export async function getModuleWithLessons(id: string): Promise<ModuleWithLessons | null> {
  // Get the module first
  const module = await getModuleById(id);
  if (!module) return null;

  // Import lessons query (avoiding circular dependency)
  const { listLessonsByModule } = await import('./lessons');
  const { lessons } = await listLessonsByModule(id);

  return {
    ...module,
    lessons,
  };
}

/**
 * Get all modules with lessons for a course (for course detail page)
 * Uses a single JOIN query to fetch all modules and lessons efficiently
 */
export async function getModulesWithLessonsByCourse(courseId: string): Promise<ModuleWithLessons[]> {
  // Database row type for joined query
  interface ModuleLessonRow {
    // Module fields
    module_id: string;
    module_title: string;
    module_description: string | null;
    module_sort_order: number;
    module_status: string;
    module_created_at: string;
    module_updated_at: string;
    // Lesson fields (nullable)
    lesson_id: string | null;
    lesson_title: string | null;
    lesson_description: string | null;
    lesson_content_type: string | null;
    lesson_video_id: string | null;
    lesson_content_text: string | null;
    lesson_content_url: string | null;
    lesson_quiz_data: Record<string, unknown> | null;
    lesson_duration_seconds: number | null;
    lesson_is_required: boolean | null;
    lesson_is_preview: boolean | null;
    lesson_sort_order: number | null;
    lesson_status: string | null;
    lesson_created_at: string | null;
    lesson_updated_at: string | null;
    // Video fields (nullable)
    video_title: string | null;
    video_description: string | null;
    video_url: string | null;
    video_thumbnail_url: string | null;
    video_duration_seconds: number | null;
    video_status: string | null;
  }

  // Single query to fetch all modules and their lessons
  const sql = `
    SELECT
      m.id as module_id,
      m.title as module_title,
      m.description as module_description,
      m.sort_order as module_sort_order,
      m.status as module_status,
      m.created_at as module_created_at,
      m.updated_at as module_updated_at,
      l.id as lesson_id,
      l.title as lesson_title,
      l.description as lesson_description,
      l.content_type as lesson_content_type,
      l.video_id as lesson_video_id,
      l.content_text as lesson_content_text,
      l.content_url as lesson_content_url,
      l.quiz_data as lesson_quiz_data,
      l.duration_seconds as lesson_duration_seconds,
      l.is_required as lesson_is_required,
      l.is_preview as lesson_is_preview,
      l.sort_order as lesson_sort_order,
      l.status as lesson_status,
      l.created_at as lesson_created_at,
      l.updated_at as lesson_updated_at,
      v.title as video_title,
      v.description as video_description,
      v.video_url,
      v.thumbnail_url as video_thumbnail_url,
      v.duration_seconds as video_duration_seconds,
      v.status as video_status
    FROM course_modules m
    LEFT JOIN course_lessons l ON l.module_id = m.id
    LEFT JOIN videos v ON v.id = l.video_id
    WHERE m.course_id = $1
    ORDER BY m.sort_order ASC, l.sort_order ASC
  `;

  const rows = await query<ModuleLessonRow>(sql, [courseId]);

  // Group lessons by module in memory
  const modulesMap = new Map<string, ModuleWithLessons>();

  for (const row of rows) {
    // Initialize module if not exists
    if (!modulesMap.has(row.module_id)) {
      modulesMap.set(row.module_id, {
        id: row.module_id,
        courseId,
        title: row.module_title,
        description: row.module_description || undefined,
        sortOrder: row.module_sort_order,
        status: row.module_status as Module['status'],
        createdAt: row.module_created_at,
        updatedAt: row.module_updated_at,
        lessons: [],
      });
    }

    // Add lesson if exists
    if (row.lesson_id) {
      const module = modulesMap.get(row.module_id)!;

      const lesson: Lesson = {
        id: row.lesson_id,
        moduleId: row.module_id,
        title: row.lesson_title!,
        description: row.lesson_description || undefined,
        contentType: row.lesson_content_type as LessonContentType,
        videoId: row.lesson_video_id || undefined,
        contentText: row.lesson_content_text || undefined,
        contentUrl: row.lesson_content_url || undefined,
        quizData: row.lesson_quiz_data || undefined,
        durationSeconds: row.lesson_duration_seconds || undefined,
        isRequired: row.lesson_is_required ?? false,
        isPreview: row.lesson_is_preview ?? false,
        sortOrder: row.lesson_sort_order!,
        status: row.lesson_status as LessonStatus,
        createdAt: row.lesson_created_at!,
        updatedAt: row.lesson_updated_at!,
      };

      // Add video if exists
      if (row.lesson_video_id && row.video_title) {
        lesson.video = {
          id: row.lesson_video_id,
          title: row.video_title,
          description: row.video_description || undefined,
          videoUrl: row.video_url || undefined,
          thumbnailUrl: row.video_thumbnail_url || undefined,
          durationSeconds: row.video_duration_seconds || undefined,
          status: (row.video_status || 'draft') as VideoStatus,
          createdAt: row.lesson_created_at!,
          updatedAt: row.lesson_updated_at!,
        };
      }

      module.lessons.push(lesson);
    }
  }

  // Calculate stats for each module
  const modulesWithStats = Array.from(modulesMap.values()).map(module => ({
    ...module,
    lessonCount: module.lessons.length,
    totalDurationSeconds: module.lessons.reduce(
      (sum, lesson) => sum + (lesson.durationSeconds || 0),
      0
    ),
  }));

  return modulesWithStats;
}
