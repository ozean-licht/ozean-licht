/**
 * Courses Database Queries
 *
 * Direct PostgreSQL queries for course management.
 * No MCP Gateway dependency.
 */

import { query } from './index';
import { Course } from '@/types/content';

// Database row type (snake_case)
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
  lesson_count?: string;
  module_count?: string;
  enrollment_count?: string;
}

/**
 * Map database row to Course type
 */
function mapCourse(row: CourseRow): Course {
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
    lessonCount: row.lesson_count ? parseInt(row.lesson_count, 10) : undefined,
    moduleCount: row.module_count ? parseInt(row.module_count, 10) : undefined,
    enrollmentCount: row.enrollment_count ? parseInt(row.enrollment_count, 10) : undefined,
  };
}

export interface ListCoursesOptions {
  limit?: number;
  offset?: number;
  status?: string;
  level?: string;
  category?: string;
  entityScope?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ListCoursesResult {
  courses: Course[];
  total: number;
}

/**
 * List courses with filtering and pagination
 */
export async function listCourses(options: ListCoursesOptions = {}): Promise<ListCoursesResult> {
  const {
    limit = 100,
    offset = 0,
    status,
    level,
    category,
    entityScope,
    search,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (level) {
    conditions.push(`level = $${paramIndex++}`);
    params.push(level);
  }

  if (category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(category);
  }

  if (entityScope) {
    conditions.push(`entity_scope = $${paramIndex++}`);
    params.push(entityScope);
  }

  if (search) {
    conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = ['created_at', 'updated_at', 'title', 'price_cents', 'status'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM courses ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      id, airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope,
      instructor_id, created_at, updated_at, published_at, metadata
    FROM courses
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await query<CourseRow>(dataSql, params);

  return {
    courses: rows.map(mapCourse),
    total,
  };
}

/**
 * Get a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const sql = `
    SELECT
      id, airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope,
      instructor_id, created_at, updated_at, published_at, metadata
    FROM courses
    WHERE id = $1
  `;

  const rows = await query<CourseRow>(sql, [id]);
  return rows.length > 0 ? mapCourse(rows[0]) : null;
}

/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const sql = `
    SELECT
      id, airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope,
      instructor_id, created_at, updated_at, published_at, metadata
    FROM courses
    WHERE slug = $1
  `;

  const rows = await query<CourseRow>(sql, [slug]);
  return rows.length > 0 ? mapCourse(rows[0]) : null;
}

/**
 * Get course statistics
 */
export async function getCourseStats() {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'published') as published,
      COUNT(*) FILTER (WHERE status = 'draft') as draft,
      COUNT(*) FILTER (WHERE status = 'archived') as archived
    FROM courses
  `;

  const rows = await query<{
    total: string;
    published: string;
    draft: string;
    archived: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    published: parseInt(rows[0]?.published || '0', 10),
    draft: parseInt(rows[0]?.draft || '0', 10),
    archived: parseInt(rows[0]?.archived || '0', 10),
  };
}

/**
 * Update course input type
 */
export interface UpdateCourseInput {
  title?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  thumbnailUrl?: string | null;
  coverImageUrl?: string | null;
  priceCents?: number;
  currency?: string;
  status?: 'draft' | 'published' | 'archived';
  level?: 'beginner' | 'intermediate' | 'advanced' | null;
  category?: string | null;
  durationMinutes?: number | null;
  entityScope?: 'ozean_licht' | 'kids_ascension' | null;
  instructorId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Update a course by ID
 * Only updates fields that are provided in the input
 */
export async function updateCourse(id: string, input: UpdateCourseInput): Promise<Course | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateCourseInput; column: string }> = [
    { key: 'title', column: 'title' },
    { key: 'slug', column: 'slug' },
    { key: 'description', column: 'description' },
    { key: 'shortDescription', column: 'short_description' },
    { key: 'thumbnailUrl', column: 'thumbnail_url' },
    { key: 'coverImageUrl', column: 'cover_image_url' },
    { key: 'priceCents', column: 'price_cents' },
    { key: 'currency', column: 'currency' },
    { key: 'status', column: 'status' },
    { key: 'level', column: 'level' },
    { key: 'category', column: 'category' },
    { key: 'durationMinutes', column: 'duration_minutes' },
    { key: 'entityScope', column: 'entity_scope' },
    { key: 'instructorId', column: 'instructor_id' },
    { key: 'metadata', column: 'metadata' },
  ];

  for (const { key, column } of fieldMappings) {
    if (input[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(input[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current course
    return getCourseById(id);
  }

  // Always update updated_at
  setClauses.push('updated_at = NOW()');

  // Handle publishedAt for status changes
  if (input.status === 'published') {
    setClauses.push('published_at = COALESCE(published_at, NOW())');
  }

  params.push(id);
  const sql = `
    UPDATE courses
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope,
      instructor_id, created_at, updated_at, published_at, metadata
  `;

  const rows = await query<CourseRow>(sql, params);
  return rows.length > 0 ? mapCourse(rows[0]) : null;
}

/**
 * Create a new course
 */
export async function createCourse(input: {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  priceCents?: number;
  currency?: string;
  status?: 'draft' | 'published' | 'archived';
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  entityScope?: 'ozean_licht' | 'kids_ascension';
  instructorId?: string;
  metadata?: Record<string, unknown>;
}): Promise<Course> {
  const sql = `
    INSERT INTO courses (
      title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, entity_scope, instructor_id, metadata
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING
      id, airtable_id, title, slug, description, short_description,
      thumbnail_url, cover_image_url, price_cents, currency,
      status, level, category, duration_minutes, entity_scope,
      instructor_id, created_at, updated_at, published_at, metadata
  `;

  const params = [
    input.title,
    input.slug,
    input.description || null,
    input.shortDescription || null,
    input.thumbnailUrl || null,
    input.coverImageUrl || null,
    input.priceCents ?? 0,
    input.currency || 'EUR',
    input.status || 'draft',
    input.level || null,
    input.category || null,
    input.entityScope || null,
    input.instructorId || null,
    input.metadata || null,
  ];

  const rows = await query<CourseRow>(sql, params);
  return mapCourse(rows[0]);
}
