/**
 * User Progress Database Queries
 *
 * Direct PostgreSQL queries for tracking user progress through courses.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import { query } from './index';

// Types for progress tracking

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'cancelled' | 'expired';

/**
 * User lesson progress record
 */
export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: ProgressStatus;
  progressPercent: number;
  timeSpentSeconds: number;
  lastPositionSeconds: number;
  quizScore: number | null;
  quizAttempts: number;
  quizPassed: boolean;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  lessonTitle?: string;
  lessonType?: string;
  moduleTitle?: string;
}

/**
 * Course enrollment record
 */
export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  lessonsCompleted: number;
  totalTimeSeconds: number;
  certificateIssued: boolean;
  certificateId: string | null;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  courseTitle?: string;
  courseThumbnail?: string;
  totalLessons?: number;
  userName?: string;
  userEmail?: string;
}

// Database row types (snake_case)

interface ProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  status: string;
  progress_percent: number;
  time_spent_seconds: number;
  last_position_seconds: number;
  quiz_score: number | null;
  quiz_attempts: number;
  quiz_passed: boolean;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  lesson_title?: string;
  content_type?: string;
  module_title?: string;
}

interface EnrollmentRow {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percent: number;
  lessons_completed: number;
  total_time_seconds: number;
  certificate_issued: boolean;
  certificate_id: string | null;
  enrolled_at: string;
  started_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  course_title?: string;
  thumbnail_url?: string;
  total_lessons?: string;
  user_name?: string;
  user_email?: string;
}

/**
 * Map database row to UserLessonProgress
 */
function mapProgress(row: ProgressRow): UserLessonProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    courseId: row.course_id,
    status: row.status as ProgressStatus,
    progressPercent: row.progress_percent,
    timeSpentSeconds: row.time_spent_seconds,
    lastPositionSeconds: row.last_position_seconds,
    quizScore: row.quiz_score,
    quizAttempts: row.quiz_attempts,
    quizPassed: row.quiz_passed,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    lastAccessedAt: row.last_accessed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lessonTitle: row.lesson_title,
    lessonType: row.content_type,
    moduleTitle: row.module_title,
  };
}

/**
 * Map database row to CourseEnrollment
 */
function mapEnrollment(row: EnrollmentRow): CourseEnrollment {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    status: row.status as EnrollmentStatus,
    progressPercent: row.progress_percent,
    lessonsCompleted: row.lessons_completed,
    totalTimeSeconds: row.total_time_seconds,
    certificateIssued: row.certificate_issued,
    certificateId: row.certificate_id,
    enrolledAt: row.enrolled_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    expiresAt: row.expires_at,
    lastAccessedAt: row.last_accessed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    courseTitle: row.course_title,
    courseThumbnail: row.thumbnail_url,
    totalLessons: row.total_lessons ? parseInt(row.total_lessons, 10) : undefined,
    userName: row.user_name,
    userEmail: row.user_email,
  };
}

// ============================================
// Lesson Progress Operations
// ============================================

/**
 * Get or create progress record for a user/lesson
 */
export async function getOrCreateProgress(
  userId: string,
  lessonId: string,
  courseId: string
): Promise<UserLessonProgress> {
  const sql = `
    INSERT INTO user_lesson_progress (user_id, lesson_id, course_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      last_accessed_at = NOW()
    RETURNING *
  `;

  const rows = await query<ProgressRow>(sql, [userId, lessonId, courseId]);
  return mapProgress(rows[0]);
}

/**
 * Get progress for a specific lesson
 */
export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<UserLessonProgress | null> {
  const sql = `
    SELECT ulp.*, l.title as lesson_title, l.content_type, m.title as module_title
    FROM user_lesson_progress ulp
    JOIN course_lessons l ON l.id = ulp.lesson_id
    JOIN course_modules m ON m.id = l.module_id
    WHERE ulp.user_id = $1 AND ulp.lesson_id = $2
  `;

  const rows = await query<ProgressRow>(sql, [userId, lessonId]);
  return rows.length > 0 ? mapProgress(rows[0]) : null;
}

/**
 * Get all progress for a user in a course
 */
export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<UserLessonProgress[]> {
  const sql = `
    SELECT ulp.*, l.title as lesson_title, l.content_type, m.title as module_title
    FROM user_lesson_progress ulp
    JOIN course_lessons l ON l.id = ulp.lesson_id
    JOIN course_modules m ON m.id = l.module_id
    WHERE ulp.user_id = $1 AND ulp.course_id = $2
    ORDER BY m.sort_order, l.sort_order
  `;

  const rows = await query<ProgressRow>(sql, [userId, courseId]);
  return rows.map(mapProgress);
}

/**
 * Update progress input
 */
export interface UpdateProgressInput {
  status?: ProgressStatus;
  progressPercent?: number;
  timeSpentSeconds?: number;
  lastPositionSeconds?: number;
  quizScore?: number;
  quizAttempts?: number;
  quizPassed?: boolean;
}

/**
 * Update lesson progress
 */
export async function updateProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  input: UpdateProgressInput
): Promise<UserLessonProgress> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Handle status transitions
  if (input.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    params.push(input.status);

    // Auto-set timestamps based on status
    if (input.status === 'in_progress') {
      setClauses.push(`started_at = COALESCE(started_at, NOW())`);
    } else if (input.status === 'completed') {
      setClauses.push(`started_at = COALESCE(started_at, NOW())`);
      setClauses.push(`completed_at = COALESCE(completed_at, NOW())`);
    }
  }

  if (input.progressPercent !== undefined) {
    setClauses.push(`progress_percent = $${paramIndex++}`);
    params.push(Math.min(100, Math.max(0, input.progressPercent)));
  }

  if (input.timeSpentSeconds !== undefined) {
    setClauses.push(`time_spent_seconds = $${paramIndex++}`);
    params.push(input.timeSpentSeconds);
  }

  if (input.lastPositionSeconds !== undefined) {
    setClauses.push(`last_position_seconds = $${paramIndex++}`);
    params.push(input.lastPositionSeconds);
  }

  if (input.quizScore !== undefined) {
    setClauses.push(`quiz_score = $${paramIndex++}`);
    params.push(input.quizScore);
  }

  if (input.quizAttempts !== undefined) {
    setClauses.push(`quiz_attempts = $${paramIndex++}`);
    params.push(input.quizAttempts);
  }

  if (input.quizPassed !== undefined) {
    setClauses.push(`quiz_passed = $${paramIndex++}`);
    params.push(input.quizPassed);
  }

  // Always update last_accessed_at
  setClauses.push(`last_accessed_at = NOW()`);

  if (setClauses.length === 0) {
    // Just update last_accessed_at
    const existing = await getLessonProgress(userId, lessonId);
    if (existing) return existing;
  }

  // Upsert query
  const sql = `
    INSERT INTO user_lesson_progress (user_id, lesson_id, course_id)
    VALUES ($${paramIndex++}, $${paramIndex++}, $${paramIndex++})
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      ${setClauses.join(', ')}
    RETURNING *
  `;

  params.push(userId, lessonId, courseId);
  const rows = await query<ProgressRow>(sql, params);
  return mapProgress(rows[0]);
}

/**
 * Mark lesson as started
 */
export async function startLesson(
  userId: string,
  lessonId: string,
  courseId: string
): Promise<UserLessonProgress> {
  return updateProgress(userId, lessonId, courseId, {
    status: 'in_progress',
    progressPercent: 0,
  });
}

/**
 * Mark lesson as completed
 */
export async function completeLesson(
  userId: string,
  lessonId: string,
  courseId: string,
  quizScore?: number,
  quizPassed?: boolean
): Promise<UserLessonProgress> {
  return updateProgress(userId, lessonId, courseId, {
    status: 'completed',
    progressPercent: 100,
    quizScore,
    quizPassed,
  });
}

// ============================================
// Course Enrollment Operations
// ============================================

/**
 * Enroll user in course
 */
export async function enrollInCourse(
  userId: string,
  courseId: string,
  expiresAt?: string
): Promise<CourseEnrollment> {
  const sql = `
    INSERT INTO course_enrollments (user_id, course_id, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, course_id) DO UPDATE SET
      status = CASE WHEN course_enrollments.status = 'cancelled' THEN 'active' ELSE course_enrollments.status END,
      last_accessed_at = NOW()
    RETURNING *
  `;

  const rows = await query<EnrollmentRow>(sql, [userId, courseId, expiresAt || null]);
  return mapEnrollment(rows[0]);
}

/**
 * Get user's enrollment in a course
 */
export async function getEnrollment(
  userId: string,
  courseId: string
): Promise<CourseEnrollment | null> {
  const sql = `
    SELECT ce.*, c.title as course_title, c.thumbnail_url,
      (SELECT COUNT(*) FROM course_lessons l
       JOIN course_modules m ON m.id = l.module_id
       WHERE m.course_id = c.id) as total_lessons
    FROM course_enrollments ce
    JOIN courses c ON c.id = ce.course_id
    WHERE ce.user_id = $1 AND ce.course_id = $2
  `;

  const rows = await query<EnrollmentRow>(sql, [userId, courseId]);
  return rows.length > 0 ? mapEnrollment(rows[0]) : null;
}

/**
 * Get all enrollments for a user
 */
export async function getUserEnrollments(
  userId: string,
  status?: EnrollmentStatus
): Promise<CourseEnrollment[]> {
  let sql = `
    SELECT ce.*, c.title as course_title, c.thumbnail_url,
      (SELECT COUNT(*) FROM course_lessons l
       JOIN course_modules m ON m.id = l.module_id
       WHERE m.course_id = c.id) as total_lessons
    FROM course_enrollments ce
    JOIN courses c ON c.id = ce.course_id
    WHERE ce.user_id = $1
  `;

  const params: unknown[] = [userId];

  if (status) {
    sql += ` AND ce.status = $2`;
    params.push(status);
  }

  sql += ` ORDER BY ce.last_accessed_at DESC NULLS LAST`;

  const rows = await query<EnrollmentRow>(sql, params);
  return rows.map(mapEnrollment);
}

/**
 * Get all enrollments for a course (admin view)
 */
export async function getCourseEnrollments(
  courseId: string,
  options: {
    status?: EnrollmentStatus;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}
): Promise<{ enrollments: CourseEnrollment[]; total: number }> {
  const { status, search } = options;

  // Validate and bound pagination parameters
  const limit = Math.min(Math.max(1, options.limit || 50), 100);
  const offset = Math.max(0, options.offset || 0);

  let whereClause = `WHERE ce.course_id = $1`;
  const params: unknown[] = [courseId];
  let paramIndex = 2;

  if (status) {
    whereClause += ` AND ce.status = $${paramIndex++}`;
    params.push(status);
  }

  if (search) {
    whereClause += ` AND (au.name ILIKE $${paramIndex} OR au.email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM course_enrollments ce
    LEFT JOIN admin_users au ON au.id = ce.user_id
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT ce.*, c.title as course_title, c.thumbnail_url,
      au.name as user_name, au.email as user_email,
      (SELECT COUNT(*) FROM course_lessons l
       JOIN course_modules m ON m.id = l.module_id
       WHERE m.course_id = c.id) as total_lessons
    FROM course_enrollments ce
    JOIN courses c ON c.id = ce.course_id
    LEFT JOIN admin_users au ON au.id = ce.user_id
    ${whereClause}
    ORDER BY ce.enrolled_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  params.push(limit, offset);

  const rows = await query<EnrollmentRow>(dataSql, params);

  return {
    enrollments: rows.map(mapEnrollment),
    total,
  };
}

/**
 * Update enrollment status
 */
export async function updateEnrollmentStatus(
  userId: string,
  courseId: string,
  status: EnrollmentStatus
): Promise<CourseEnrollment | null> {
  let sql = `
    UPDATE course_enrollments
    SET status = $3
  `;

  if (status === 'completed') {
    sql += `, completed_at = COALESCE(completed_at, NOW())`;
  } else if (status === 'active') {
    sql += `, started_at = COALESCE(started_at, NOW())`;
  }

  sql += `
    WHERE user_id = $1 AND course_id = $2
    RETURNING *
  `;

  const rows = await query<EnrollmentRow>(sql, [userId, courseId, status]);
  return rows.length > 0 ? mapEnrollment(rows[0]) : null;
}

/**
 * Recalculate and update enrollment progress from lesson progress
 */
export async function recalculateEnrollmentProgress(
  userId: string,
  courseId: string
): Promise<CourseEnrollment | null> {
  const sql = `
    WITH lesson_stats AS (
      SELECT
        COUNT(*) as total_lessons,
        COUNT(*) FILTER (WHERE ulp.status = 'completed') as completed_lessons,
        COALESCE(SUM(ulp.time_spent_seconds), 0) as total_time
      FROM course_lessons l
      JOIN course_modules m ON m.id = l.module_id
      LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = $1
      WHERE m.course_id = $2
    )
    UPDATE course_enrollments ce
    SET
      progress_percent = CASE
        WHEN ls.total_lessons > 0
        THEN ROUND(100.0 * ls.completed_lessons / ls.total_lessons)
        ELSE 0
      END,
      lessons_completed = ls.completed_lessons,
      total_time_seconds = ls.total_time,
      status = CASE
        WHEN ls.total_lessons > 0 AND ls.completed_lessons = ls.total_lessons THEN 'completed'
        WHEN ls.completed_lessons > 0 THEN 'active'
        ELSE ce.status
      END,
      completed_at = CASE
        WHEN ls.total_lessons > 0 AND ls.completed_lessons = ls.total_lessons
          AND ce.completed_at IS NULL THEN NOW()
        ELSE ce.completed_at
      END
    FROM lesson_stats ls
    WHERE ce.user_id = $1 AND ce.course_id = $2
    RETURNING ce.*
  `;

  const rows = await query<EnrollmentRow>(sql, [userId, courseId]);
  return rows.length > 0 ? mapEnrollment(rows[0]) : null;
}

// ============================================
// Progress Summary & Stats
// ============================================

/**
 * Course progress summary
 */
export interface CourseProgressSummary {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  avgProgressPercent: number;
  avgTimeSeconds: number;
  completionRate: number;
}

/**
 * Get course progress summary (admin view)
 */
export async function getCourseProgressSummary(courseId: string): Promise<CourseProgressSummary | null> {
  const sql = `
    SELECT
      c.id as course_id,
      c.title as course_title,
      COUNT(ce.id) as total_enrollments,
      COUNT(ce.id) FILTER (WHERE ce.status = 'active') as active_enrollments,
      COUNT(ce.id) FILTER (WHERE ce.status = 'completed') as completed_enrollments,
      COALESCE(AVG(ce.progress_percent), 0) as avg_progress,
      COALESCE(AVG(ce.total_time_seconds), 0) as avg_time,
      CASE
        WHEN COUNT(ce.id) > 0
        THEN ROUND(100.0 * COUNT(ce.id) FILTER (WHERE ce.status = 'completed') / COUNT(ce.id), 2)
        ELSE 0
      END as completion_rate
    FROM courses c
    LEFT JOIN course_enrollments ce ON ce.course_id = c.id
    WHERE c.id = $1
    GROUP BY c.id, c.title
  `;

  const rows = await query<{
    course_id: string;
    course_title: string;
    total_enrollments: string;
    active_enrollments: string;
    completed_enrollments: string;
    avg_progress: string;
    avg_time: string;
    completion_rate: string;
  }>(sql, [courseId]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    courseId: row.course_id,
    courseTitle: row.course_title,
    totalEnrollments: parseInt(row.total_enrollments, 10),
    activeEnrollments: parseInt(row.active_enrollments, 10),
    completedEnrollments: parseInt(row.completed_enrollments, 10),
    avgProgressPercent: parseFloat(row.avg_progress),
    avgTimeSeconds: parseFloat(row.avg_time),
    completionRate: parseFloat(row.completion_rate),
  };
}

/**
 * Lesson progress stats
 */
export interface LessonProgressStats {
  lessonId: string;
  lessonTitle: string;
  contentType: string;
  totalViews: number;
  completions: number;
  avgTimeSeconds: number;
  avgQuizScore: number | null;
  completionRate: number;
}

/**
 * Get lesson progress stats for a course
 */
export async function getCourseLessonStats(courseId: string): Promise<LessonProgressStats[]> {
  const sql = `
    SELECT
      l.id as lesson_id,
      l.title as lesson_title,
      l.content_type,
      COUNT(DISTINCT ulp.user_id) as total_views,
      COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed') as completions,
      COALESCE(AVG(ulp.time_spent_seconds) FILTER (WHERE ulp.time_spent_seconds > 0), 0) as avg_time,
      AVG(ulp.quiz_score) FILTER (WHERE ulp.quiz_score IS NOT NULL) as avg_quiz_score,
      CASE
        WHEN COUNT(DISTINCT ulp.user_id) > 0
        THEN ROUND(100.0 * COUNT(DISTINCT ulp.user_id) FILTER (WHERE ulp.status = 'completed')
             / COUNT(DISTINCT ulp.user_id), 2)
        ELSE 0
      END as completion_rate
    FROM course_lessons l
    JOIN course_modules m ON m.id = l.module_id
    LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id
    WHERE m.course_id = $1
    GROUP BY l.id, l.title, l.content_type, m.sort_order, l.sort_order
    ORDER BY m.sort_order, l.sort_order
  `;

  const rows = await query<{
    lesson_id: string;
    lesson_title: string;
    content_type: string;
    total_views: string;
    completions: string;
    avg_time: string;
    avg_quiz_score: string | null;
    completion_rate: string;
  }>(sql, [courseId]);

  return rows.map(row => ({
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    contentType: row.content_type,
    totalViews: parseInt(row.total_views, 10),
    completions: parseInt(row.completions, 10),
    avgTimeSeconds: parseFloat(row.avg_time),
    avgQuizScore: row.avg_quiz_score ? parseFloat(row.avg_quiz_score) : null,
    completionRate: parseFloat(row.completion_rate),
  }));
}
