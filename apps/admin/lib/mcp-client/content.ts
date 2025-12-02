/**
 * Content Query Operations - Videos, Courses, Lessons, Modules
 * Part of Airtable MCP Migration
 */

import { MCPGatewayClient } from './client';
import {
  Video,
  Course,
  Lesson,
  LessonContentType,
  Module,
  CourseEnrollment,
  VideoListOptions,
  CourseListOptions,
  LessonListOptions,
  EnrollmentListOptions,
  VideoListResult,
  CourseListResult,
  LessonListResult,
  EnrollmentListResult,
  CreateVideoInput,
  UpdateVideoInput,
  CreateCourseInput,
  UpdateCourseInput,
  CreateLessonInput,
  UpdateLessonInput,
  CreateModuleInput,
  UpdateModuleInput,
  CourseStats,
  VideoStats,
} from '../../types/content';

// Database row types (snake_case)
interface VideoRow {
  id: string;
  airtable_id: string | null;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: string;
  entity_scope: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

interface CourseRow {
  id: string;
  airtable_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  price_cents: number;
  currency: string;
  status: string;
  level: string | null;
  category: string | null;
  duration_minutes: number | null;
  entity_scope: string | null;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  metadata: Record<string, unknown> | null;
  lesson_count?: number;
  module_count?: number;
  enrollment_count?: number;
}

interface LessonRow {
  id: string;
  airtable_id: string | null;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  content: string | null;
  video_id: string | null;
  order_index: number;
  duration_seconds: number | null;
  is_free_preview: boolean;
  lesson_type: string;
  created_at: string;
  updated_at: string;
}

interface ModuleRow {
  id: string;
  airtable_id: string | null;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  lesson_count?: number;
}

interface EnrollmentRow {
  id: string;
  course_id: string;
  user_id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, unknown> | null;
}

/**
 * Content Queries Extension for MCPGatewayClient
 */
export class ContentQueries {
  constructor(private client: MCPGatewayClient) {}

  // ============================================================================
  // Video Operations
  // ============================================================================

  /**
   * Get video by ID
   */
  async getVideoById(id: string): Promise<Video | null> {
    const sql = `
      SELECT id, airtable_id, title, description, video_url, thumbnail_url,
             duration_seconds, status, entity_scope, created_by,
             created_at, updated_at, metadata
      FROM videos
      WHERE id = $1
    `;

    const rows = await this.client.query<VideoRow>(sql, [id]);
    return rows.length > 0 ? this.mapVideo(rows[0]) : null;
  }

  /**
   * List videos with filters and pagination
   */
  async listVideos(options: VideoListOptions = {}): Promise<VideoListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const orderBy = options.orderBy || 'created_at';
    const orderDir = options.orderDirection || 'desc';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM videos ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, title, description, video_url, thumbnail_url,
             duration_seconds, status, entity_scope, created_by,
             created_at, updated_at, metadata
      FROM videos
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<VideoRow>(sql, params);

    return {
      data: rows.map(row => this.mapVideo(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new video
   */
  async createVideo(data: CreateVideoInput): Promise<Video> {
    const sql = `
      INSERT INTO videos (
        title, description, video_url, thumbnail_url, duration_seconds,
        status, entity_scope, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, airtable_id, title, description, video_url, thumbnail_url,
                duration_seconds, status, entity_scope, created_by,
                created_at, updated_at, metadata
    `;

    const rows = await this.client.query<VideoRow>(sql, [
      data.title,
      data.description || null,
      data.videoUrl || null,
      data.thumbnailUrl || null,
      data.durationSeconds || null,
      data.status || 'draft',
      data.entityScope || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapVideo(rows[0]);
  }

  /**
   * Update a video
   */
  async updateVideo(id: string, data: UpdateVideoInput): Promise<Video> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(data.description);
    }
    if (data.videoUrl !== undefined) {
      updates.push(`video_url = $${paramIndex++}`);
      params.push(data.videoUrl);
    }
    if (data.thumbnailUrl !== undefined) {
      updates.push(`thumbnail_url = $${paramIndex++}`);
      params.push(data.thumbnailUrl);
    }
    if (data.durationSeconds !== undefined) {
      updates.push(`duration_seconds = $${paramIndex++}`);
      params.push(data.durationSeconds);
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(data.status);
    }
    if (data.entityScope !== undefined) {
      updates.push(`entity_scope = $${paramIndex++}`);
      params.push(data.entityScope);
    }
    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    params.push(id);

    const sql = `
      UPDATE videos
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, title, description, video_url, thumbnail_url,
                duration_seconds, status, entity_scope, created_by,
                created_at, updated_at, metadata
    `;

    const rows = await this.client.query<VideoRow>(sql, params);
    return this.mapVideo(rows[0]);
  }

  /**
   * Delete a video
   */
  async deleteVideo(id: string): Promise<void> {
    await this.client.execute('DELETE FROM videos WHERE id = $1', [id]);
  }

  /**
   * Get video stats
   */
  async getVideoStats(entityScope?: string): Promise<VideoStats> {
    const scopeCondition = entityScope ? 'WHERE entity_scope = $1' : '';
    const params = entityScope ? [entityScope] : [];

    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'published') as published,
        COUNT(*) FILTER (WHERE status = 'draft') as draft,
        COALESCE(SUM(duration_seconds), 0) / 60 as total_duration_minutes
      FROM videos
      ${scopeCondition}
    `;

    const rows = await this.client.query<{
      total: string;
      published: string;
      draft: string;
      total_duration_minutes: string;
    }>(sql, params);

    return {
      totalVideos: parseInt(rows[0].total, 10),
      publishedVideos: parseInt(rows[0].published, 10),
      draftVideos: parseInt(rows[0].draft, 10),
      totalDurationMinutes: parseInt(rows[0].total_duration_minutes, 10),
    };
  }

  // ============================================================================
  // Course Operations
  // ============================================================================

  /**
   * Get course by ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    const sql = `
      SELECT c.id, c.airtable_id, c.title, c.slug, c.description, c.short_description,
             c.thumbnail_url, c.cover_image_url, c.price_cents, c.currency,
             c.status, c.level, c.category, c.duration_minutes, c.entity_scope,
             c.instructor_id, c.created_at, c.updated_at, c.published_at, c.metadata,
             (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as lesson_count,
             (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) as module_count,
             (SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id = c.id) as enrollment_count
      FROM courses c
      WHERE c.id = $1
    `;

    const rows = await this.client.query<CourseRow>(sql, [id]);
    return rows.length > 0 ? this.mapCourse(rows[0]) : null;
  }

  /**
   * Get course by slug
   */
  async getCourseBySlug(slug: string): Promise<Course | null> {
    const sql = `
      SELECT c.id, c.airtable_id, c.title, c.slug, c.description, c.short_description,
             c.thumbnail_url, c.cover_image_url, c.price_cents, c.currency,
             c.status, c.level, c.category, c.duration_minutes, c.entity_scope,
             c.instructor_id, c.created_at, c.updated_at, c.published_at, c.metadata,
             (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as lesson_count,
             (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) as module_count,
             (SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id = c.id) as enrollment_count
      FROM courses c
      WHERE c.slug = $1
    `;

    const rows = await this.client.query<CourseRow>(sql, [slug]);
    return rows.length > 0 ? this.mapCourse(rows[0]) : null;
  }

  /**
   * List courses with filters and pagination
   */
  async listCourses(options: CourseListOptions = {}): Promise<CourseListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`c.entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.status) {
      conditions.push(`c.status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.level) {
      conditions.push(`c.level = $${paramIndex++}`);
      params.push(options.level);
    }

    if (options.category) {
      conditions.push(`c.category = $${paramIndex++}`);
      params.push(options.category);
    }

    if (options.instructorId) {
      conditions.push(`c.instructor_id = $${paramIndex++}`);
      params.push(options.instructorId);
    }

    if (options.search) {
      conditions.push(`(c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const orderBy = options.orderBy || 'created_at';
    const orderDir = options.orderDirection || 'desc';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM courses c ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT c.id, c.airtable_id, c.title, c.slug, c.description, c.short_description,
             c.thumbnail_url, c.cover_image_url, c.price_cents, c.currency,
             c.status, c.level, c.category, c.duration_minutes, c.entity_scope,
             c.instructor_id, c.created_at, c.updated_at, c.published_at, c.metadata,
             (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as lesson_count,
             (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) as module_count,
             (SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id = c.id) as enrollment_count
      FROM courses c
      ${whereClause}
      ORDER BY c.${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<CourseRow>(sql, params);

    return {
      data: rows.map(row => this.mapCourse(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseInput): Promise<Course> {
    const sql = `
      INSERT INTO courses (
        title, slug, description, short_description, thumbnail_url, cover_image_url,
        price_cents, currency, status, level, category, duration_minutes,
        entity_scope, instructor_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, airtable_id, title, slug, description, short_description,
                thumbnail_url, cover_image_url, price_cents, currency,
                status, level, category, duration_minutes, entity_scope,
                instructor_id, created_at, updated_at, published_at, metadata
    `;

    const rows = await this.client.query<CourseRow>(sql, [
      data.title,
      data.slug,
      data.description || null,
      data.shortDescription || null,
      data.thumbnailUrl || null,
      data.coverImageUrl || null,
      data.priceCents || 0,
      data.currency || 'EUR',
      data.status || 'draft',
      data.level || null,
      data.category || null,
      data.durationMinutes || null,
      data.entityScope || null,
      data.instructorId || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapCourse(rows[0]);
  }

  /**
   * Update a course
   */
  async updateCourse(id: string, data: UpdateCourseInput): Promise<Course> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateCourseInput, string]> = [
      ['title', 'title'],
      ['slug', 'slug'],
      ['description', 'description'],
      ['shortDescription', 'short_description'],
      ['thumbnailUrl', 'thumbnail_url'],
      ['coverImageUrl', 'cover_image_url'],
      ['priceCents', 'price_cents'],
      ['currency', 'currency'],
      ['status', 'status'],
      ['level', 'level'],
      ['category', 'category'],
      ['durationMinutes', 'duration_minutes'],
      ['entityScope', 'entity_scope'],
      ['instructorId', 'instructor_id'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | null);
      }
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    // Set published_at when status changes to published
    if (data.status === 'published') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE courses
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, title, slug, description, short_description,
                thumbnail_url, cover_image_url, price_cents, currency,
                status, level, category, duration_minutes, entity_scope,
                instructor_id, created_at, updated_at, published_at, metadata
    `;

    const rows = await this.client.query<CourseRow>(sql, params);
    return this.mapCourse(rows[0]);
  }

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<void> {
    await this.client.execute('DELETE FROM courses WHERE id = $1', [id]);
  }

  /**
   * Get course stats
   */
  async getCourseStats(entityScope?: string): Promise<CourseStats> {
    const scopeCondition = entityScope ? 'WHERE entity_scope = $1' : '';
    const params = entityScope ? [entityScope] : [];

    const sql = `
      SELECT
        COUNT(*) as total_courses,
        COUNT(*) FILTER (WHERE status = 'published') as published_courses,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_courses,
        (SELECT COUNT(*) FROM course_enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM course_enrollments WHERE status = 'active') as active_enrollments,
        (SELECT COUNT(*) FROM course_enrollments WHERE status = 'completed') as completed_enrollments,
        COALESCE(SUM(price_cents), 0) as total_revenue
      FROM courses
      ${scopeCondition}
    `;

    const rows = await this.client.query<{
      total_courses: string;
      published_courses: string;
      draft_courses: string;
      total_enrollments: string;
      active_enrollments: string;
      completed_enrollments: string;
      total_revenue: string;
    }>(sql, params);

    return {
      totalCourses: parseInt(rows[0].total_courses, 10),
      publishedCourses: parseInt(rows[0].published_courses, 10),
      draftCourses: parseInt(rows[0].draft_courses, 10),
      totalEnrollments: parseInt(rows[0].total_enrollments, 10),
      activeEnrollments: parseInt(rows[0].active_enrollments, 10),
      completedEnrollments: parseInt(rows[0].completed_enrollments, 10),
      totalRevenue: parseInt(rows[0].total_revenue, 10),
    };
  }

  // ============================================================================
  // Lesson Operations
  // ============================================================================

  /**
   * List lessons for a course
   */
  async listLessons(options: LessonListOptions): Promise<LessonListResult> {
    const conditions: string[] = ['course_id = $1'];
    const params: (string | number)[] = [options.courseId];
    let paramIndex = 2;

    if (options.moduleId) {
      conditions.push(`module_id = $${paramIndex++}`);
      params.push(options.moduleId);
    }

    if (options.lessonType) {
      conditions.push(`lesson_type = $${paramIndex++}`);
      params.push(options.lessonType);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const limit = options.limit || 100;
    const offset = options.offset || 0;

    const countSql = `SELECT COUNT(*) as count FROM lessons ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    const sql = `
      SELECT id, airtable_id, course_id, module_id, title, description, content,
             video_id, order_index, duration_seconds, is_free_preview, lesson_type,
             created_at, updated_at
      FROM lessons
      ${whereClause}
      ORDER BY order_index ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<LessonRow>(sql, params);

    return {
      data: rows.map(row => this.mapLesson(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a lesson
   */
  async createLesson(data: CreateLessonInput): Promise<Lesson> {
    const sql = `
      INSERT INTO lessons (
        course_id, module_id, title, description, content, video_id,
        order_index, duration_seconds, is_free_preview, lesson_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, airtable_id, course_id, module_id, title, description, content,
                video_id, order_index, duration_seconds, is_free_preview, lesson_type,
                created_at, updated_at
    `;

    const rows = await this.client.query<LessonRow>(sql, [
      data.courseId,
      data.moduleId || null,
      data.title,
      data.description || null,
      data.content || null,
      data.videoId || null,
      data.orderIndex,
      data.durationSeconds || null,
      data.isFreePreview || false,
      data.lessonType || 'video',
    ]);

    return this.mapLesson(rows[0]);
  }

  /**
   * Update a lesson
   */
  async updateLesson(id: string, data: UpdateLessonInput): Promise<Lesson> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateLessonInput, string]> = [
      ['moduleId', 'module_id'],
      ['title', 'title'],
      ['description', 'description'],
      ['content', 'content'],
      ['videoId', 'video_id'],
      ['orderIndex', 'order_index'],
      ['durationSeconds', 'duration_seconds'],
      ['isFreePreview', 'is_free_preview'],
      ['lessonType', 'lesson_type'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | boolean | null);
      }
    }

    params.push(id);

    const sql = `
      UPDATE lessons
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, course_id, module_id, title, description, content,
                video_id, order_index, duration_seconds, is_free_preview, lesson_type,
                created_at, updated_at
    `;

    const rows = await this.client.query<LessonRow>(sql, params);
    return this.mapLesson(rows[0]);
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(id: string): Promise<void> {
    await this.client.execute('DELETE FROM lessons WHERE id = $1', [id]);
  }

  // ============================================================================
  // Module Operations
  // ============================================================================

  /**
   * List modules for a course
   */
  async listModules(courseId: string): Promise<Module[]> {
    const sql = `
      SELECT m.id, m.airtable_id, m.course_id, m.title, m.description, m.order_index,
             m.created_at, m.updated_at,
             (SELECT COUNT(*) FROM lessons l WHERE l.module_id = m.id) as lesson_count
      FROM modules m
      WHERE m.course_id = $1
      ORDER BY m.order_index ASC
    `;

    const rows = await this.client.query<ModuleRow>(sql, [courseId]);
    return rows.map(row => this.mapModule(row));
  }

  /**
   * Create a module
   */
  async createModule(data: CreateModuleInput): Promise<Module> {
    const sql = `
      INSERT INTO modules (course_id, title, description, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING id, airtable_id, course_id, title, description, order_index,
                created_at, updated_at
    `;

    const rows = await this.client.query<ModuleRow>(sql, [
      data.courseId,
      data.title,
      data.description || null,
      data.orderIndex,
    ]);

    return this.mapModule(rows[0]);
  }

  /**
   * Update a module
   */
  async updateModule(id: string, data: UpdateModuleInput): Promise<Module> {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(data.description);
    }
    if (data.orderIndex !== undefined) {
      updates.push(`order_index = $${paramIndex++}`);
      params.push(data.orderIndex);
    }

    params.push(id);

    const sql = `
      UPDATE modules
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, course_id, title, description, order_index,
                created_at, updated_at
    `;

    const rows = await this.client.query<ModuleRow>(sql, params);
    return this.mapModule(rows[0]);
  }

  /**
   * Delete a module
   */
  async deleteModule(id: string): Promise<void> {
    await this.client.execute('DELETE FROM modules WHERE id = $1', [id]);
  }

  // ============================================================================
  // Enrollment Operations
  // ============================================================================

  /**
   * List enrollments
   */
  async listEnrollments(options: EnrollmentListOptions = {}): Promise<EnrollmentListResult> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (options.courseId) {
      conditions.push(`course_id = $${paramIndex++}`);
      params.push(options.courseId);
    }

    if (options.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(options.userId);
    }

    if (options.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    const countSql = `SELECT COUNT(*) as count FROM course_enrollments ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    const sql = `
      SELECT id, course_id, user_id, status, progress_percent,
             enrolled_at, started_at, completed_at, last_accessed_at, metadata
      FROM course_enrollments
      ${whereClause}
      ORDER BY enrolled_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<EnrollmentRow>(sql, params);

    return {
      data: rows.map(row => this.mapEnrollment(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  // ============================================================================
  // Mapping Functions
  // ============================================================================

  private mapVideo(row: VideoRow): Video {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      title: row.title,
      description: row.description || undefined,
      videoUrl: row.video_url || undefined,
      thumbnailUrl: row.thumbnail_url || undefined,
      durationSeconds: row.duration_seconds || undefined,
      status: row.status as Video['status'],
      entityScope: row.entity_scope as Video['entityScope'],
      createdBy: row.created_by || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadata: row.metadata || undefined,
    };
  }

  private mapCourse(row: CourseRow): Course {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      title: row.title,
      slug: row.slug,
      description: row.description || undefined,
      shortDescription: row.short_description || undefined,
      thumbnailUrl: row.thumbnail_url || undefined,
      coverImageUrl: row.cover_image_url || undefined,
      priceCents: row.price_cents,
      currency: row.currency,
      status: row.status as Course['status'],
      level: row.level as Course['level'],
      category: row.category || undefined,
      durationMinutes: row.duration_minutes || undefined,
      entityScope: row.entity_scope as Course['entityScope'],
      instructorId: row.instructor_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at || undefined,
      metadata: row.metadata || undefined,
      lessonCount: row.lesson_count,
      moduleCount: row.module_count,
      enrollmentCount: row.enrollment_count,
    };
  }

  private mapLesson(row: LessonRow): Lesson {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      moduleId: row.module_id || '',
      title: row.title,
      description: row.description || undefined,
      contentType: (row.lesson_type as LessonContentType) || 'video',
      videoId: row.video_id || undefined,
      sortOrder: row.order_index,
      durationSeconds: row.duration_seconds || undefined,
      isRequired: true,
      isPreview: row.is_free_preview,
      status: 'published',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapModule(row: ModuleRow): Module {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      courseId: row.course_id,
      title: row.title,
      description: row.description || undefined,
      sortOrder: row.order_index,
      status: 'published' as const,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lessonCount: row.lesson_count,
    };
  }

  private mapEnrollment(row: EnrollmentRow): CourseEnrollment {
    return {
      id: row.id,
      courseId: row.course_id,
      userId: row.user_id,
      status: row.status as CourseEnrollment['status'],
      progressPercent: row.progress_percent,
      enrolledAt: row.enrolled_at,
      startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined,
      lastAccessedAt: row.last_accessed_at || undefined,
      metadata: row.metadata || undefined,
    };
  }
}
