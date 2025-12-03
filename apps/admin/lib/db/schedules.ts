/**
 * Drip Schedules Database Queries
 *
 * Direct PostgreSQL queries for drip scheduling of course content.
 * Part of Phase 9: Learning Sequences
 */

import { query, execute } from './index';

// =====================================================
// TYPES
// =====================================================

export type DripReleaseType =
  | 'immediate'
  | 'fixed_date'
  | 'relative_days'
  | 'relative_hours'
  | 'after_lesson'
  | 'after_module'
  | 'after_enrollment';

export type DripMode = 'disabled' | 'sequential' | 'scheduled' | 'hybrid';

export interface DripSchedule {
  id: string;
  courseId: string;
  lessonId?: string;
  moduleId?: string;
  releaseType: DripReleaseType;
  releaseDate?: string;
  relativeDays?: number;
  relativeHours?: number;
  afterLessonId?: string;
  afterModuleId?: string;
  releaseTime?: string;
  timezone: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  lessonTitle?: string;
  moduleTitle?: string;
  afterLessonTitle?: string;
  afterModuleTitle?: string;
}

export interface UserDripStatus {
  id: string;
  userId: string;
  dripScheduleId: string;
  calculatedReleaseDate: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDripSettings {
  id: string;
  courseId: string;
  dripMode: DripMode;
  defaultIntervalDays: number;
  sendUnlockNotifications: boolean;
  unlockEmailTemplate?: string;
  dripStartDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Input types
export interface CreateDripScheduleInput {
  courseId: string;
  lessonId?: string;
  moduleId?: string;
  releaseType: DripReleaseType;
  releaseDate?: string;
  relativeDays?: number;
  relativeHours?: number;
  afterLessonId?: string;
  afterModuleId?: string;
  releaseTime?: string;
  timezone?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateDripScheduleInput {
  releaseType?: DripReleaseType;
  releaseDate?: string;
  relativeDays?: number;
  relativeHours?: number;
  afterLessonId?: string;
  afterModuleId?: string;
  releaseTime?: string;
  timezone?: string;
  isActive?: boolean;
  notes?: string;
}

export interface SetCourseDripSettingsInput {
  courseId: string;
  dripMode: DripMode;
  defaultIntervalDays?: number;
  sendUnlockNotifications?: boolean;
  unlockEmailTemplate?: string;
  dripStartDate?: string;
}

// Database row types
interface DripScheduleRow {
  id: string;
  course_id: string;
  lesson_id: string | null;
  module_id: string | null;
  release_type: string;
  release_date: string | null;
  relative_days: number | null;
  relative_hours: number | null;
  after_lesson_id: string | null;
  after_module_id: string | null;
  release_time: string | null;
  timezone: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  lesson_title?: string;
  module_title?: string;
  after_lesson_title?: string;
  after_module_title?: string;
}

interface UserDripStatusRow {
  id: string;
  user_id: string;
  drip_schedule_id: string;
  calculated_release_date: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseDripSettingsRow {
  id: string;
  course_id: string;
  drip_mode: string;
  default_interval_days: number;
  send_unlock_notifications: boolean;
  unlock_email_template: string | null;
  drip_start_date: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// MAPPERS
// =====================================================

function mapDripSchedule(row: DripScheduleRow): DripSchedule {
  return {
    id: row.id,
    courseId: row.course_id,
    lessonId: row.lesson_id ?? undefined,
    moduleId: row.module_id ?? undefined,
    releaseType: row.release_type as DripReleaseType,
    releaseDate: row.release_date ?? undefined,
    relativeDays: row.relative_days ?? undefined,
    relativeHours: row.relative_hours ?? undefined,
    afterLessonId: row.after_lesson_id ?? undefined,
    afterModuleId: row.after_module_id ?? undefined,
    releaseTime: row.release_time ?? undefined,
    timezone: row.timezone,
    isActive: row.is_active,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lessonTitle: row.lesson_title,
    moduleTitle: row.module_title,
    afterLessonTitle: row.after_lesson_title,
    afterModuleTitle: row.after_module_title,
  };
}

function mapUserDripStatus(row: UserDripStatusRow): UserDripStatus {
  return {
    id: row.id,
    userId: row.user_id,
    dripScheduleId: row.drip_schedule_id,
    calculatedReleaseDate: row.calculated_release_date,
    isUnlocked: row.is_unlocked,
    unlockedAt: row.unlocked_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCourseDripSettings(row: CourseDripSettingsRow): CourseDripSettings {
  return {
    id: row.id,
    courseId: row.course_id,
    dripMode: row.drip_mode as DripMode,
    defaultIntervalDays: row.default_interval_days,
    sendUnlockNotifications: row.send_unlock_notifications,
    unlockEmailTemplate: row.unlock_email_template ?? undefined,
    dripStartDate: row.drip_start_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =====================================================
// DRIP SCHEDULES CRUD
// =====================================================

/**
 * Get all drip schedules for a course
 */
export async function getDripSchedulesByCourse(courseId: string): Promise<DripSchedule[]> {
  const sql = `
    SELECT
      ds.id, ds.course_id, ds.lesson_id, ds.module_id,
      ds.release_type, ds.release_date, ds.relative_days, ds.relative_hours,
      ds.after_lesson_id, ds.after_module_id, ds.release_time, ds.timezone,
      ds.is_active, ds.notes, ds.created_at, ds.updated_at,
      cl.title as lesson_title,
      cm.title as module_title,
      al.title as after_lesson_title,
      am.title as after_module_title
    FROM drip_schedules ds
    LEFT JOIN course_lessons cl ON cl.id = ds.lesson_id
    LEFT JOIN course_modules cm ON cm.id = ds.module_id
    LEFT JOIN course_lessons al ON al.id = ds.after_lesson_id
    LEFT JOIN course_modules am ON am.id = ds.after_module_id
    WHERE ds.course_id = $1
    ORDER BY COALESCE(cm.sort_order, 0) ASC, COALESCE(cl.sort_order, 0) ASC
  `;

  const rows = await query<DripScheduleRow>(sql, [courseId]);
  return rows.map(mapDripSchedule);
}

/**
 * Get drip schedule for a specific lesson
 */
export async function getDripScheduleByLesson(lessonId: string): Promise<DripSchedule | null> {
  const sql = `
    SELECT
      ds.id, ds.course_id, ds.lesson_id, ds.module_id,
      ds.release_type, ds.release_date, ds.relative_days, ds.relative_hours,
      ds.after_lesson_id, ds.after_module_id, ds.release_time, ds.timezone,
      ds.is_active, ds.notes, ds.created_at, ds.updated_at,
      al.title as after_lesson_title,
      am.title as after_module_title
    FROM drip_schedules ds
    LEFT JOIN course_lessons al ON al.id = ds.after_lesson_id
    LEFT JOIN course_modules am ON am.id = ds.after_module_id
    WHERE ds.lesson_id = $1
  `;

  const rows = await query<DripScheduleRow>(sql, [lessonId]);
  return rows.length > 0 ? mapDripSchedule(rows[0]) : null;
}

/**
 * Get drip schedule for a specific module
 */
export async function getDripScheduleByModule(moduleId: string): Promise<DripSchedule | null> {
  const sql = `
    SELECT
      ds.id, ds.course_id, ds.lesson_id, ds.module_id,
      ds.release_type, ds.release_date, ds.relative_days, ds.relative_hours,
      ds.after_lesson_id, ds.after_module_id, ds.release_time, ds.timezone,
      ds.is_active, ds.notes, ds.created_at, ds.updated_at,
      al.title as after_lesson_title,
      am.title as after_module_title
    FROM drip_schedules ds
    LEFT JOIN course_lessons al ON al.id = ds.after_lesson_id
    LEFT JOIN course_modules am ON am.id = ds.after_module_id
    WHERE ds.module_id = $1
  `;

  const rows = await query<DripScheduleRow>(sql, [moduleId]);
  return rows.length > 0 ? mapDripSchedule(rows[0]) : null;
}

/**
 * Create a drip schedule
 */
export async function createDripSchedule(input: CreateDripScheduleInput): Promise<DripSchedule> {
  const sql = `
    INSERT INTO drip_schedules (
      course_id, lesson_id, module_id, release_type, release_date,
      relative_days, relative_hours, after_lesson_id, after_module_id,
      release_time, timezone, is_active, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id, course_id, lesson_id, module_id, release_type, release_date,
      relative_days, relative_hours, after_lesson_id, after_module_id,
      release_time, timezone, is_active, notes, created_at, updated_at
  `;

  const rows = await query<DripScheduleRow>(sql, [
    input.courseId,
    input.lessonId ?? null,
    input.moduleId ?? null,
    input.releaseType,
    input.releaseDate ?? null,
    input.relativeDays ?? null,
    input.relativeHours ?? null,
    input.afterLessonId ?? null,
    input.afterModuleId ?? null,
    input.releaseTime ?? null,
    input.timezone ?? 'UTC',
    input.isActive ?? true,
    input.notes ?? null,
  ]);

  return mapDripSchedule(rows[0]);
}

/**
 * Update a drip schedule
 */
export async function updateDripSchedule(
  id: string,
  input: UpdateDripScheduleInput
): Promise<DripSchedule | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.releaseType !== undefined) {
    setClauses.push(`release_type = $${paramIndex++}`);
    params.push(input.releaseType);
  }

  if (input.releaseDate !== undefined) {
    setClauses.push(`release_date = $${paramIndex++}`);
    params.push(input.releaseDate);
  }

  if (input.relativeDays !== undefined) {
    setClauses.push(`relative_days = $${paramIndex++}`);
    params.push(input.relativeDays);
  }

  if (input.relativeHours !== undefined) {
    setClauses.push(`relative_hours = $${paramIndex++}`);
    params.push(input.relativeHours);
  }

  if (input.afterLessonId !== undefined) {
    setClauses.push(`after_lesson_id = $${paramIndex++}`);
    params.push(input.afterLessonId || null);
  }

  if (input.afterModuleId !== undefined) {
    setClauses.push(`after_module_id = $${paramIndex++}`);
    params.push(input.afterModuleId || null);
  }

  if (input.releaseTime !== undefined) {
    setClauses.push(`release_time = $${paramIndex++}`);
    params.push(input.releaseTime || null);
  }

  if (input.timezone !== undefined) {
    setClauses.push(`timezone = $${paramIndex++}`);
    params.push(input.timezone);
  }

  if (input.isActive !== undefined) {
    setClauses.push(`is_active = $${paramIndex++}`);
    params.push(input.isActive);
  }

  if (input.notes !== undefined) {
    setClauses.push(`notes = $${paramIndex++}`);
    params.push(input.notes || null);
  }

  if (setClauses.length === 0) {
    return getDripScheduleById(id);
  }

  params.push(id);

  const sql = `
    UPDATE drip_schedules
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, course_id, lesson_id, module_id, release_type, release_date,
      relative_days, relative_hours, after_lesson_id, after_module_id,
      release_time, timezone, is_active, notes, created_at, updated_at
  `;

  const rows = await query<DripScheduleRow>(sql, params);
  return rows.length > 0 ? mapDripSchedule(rows[0]) : null;
}

/**
 * Delete a drip schedule
 */
export async function deleteDripSchedule(id: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM drip_schedules WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Delete drip schedule by lesson ID
 */
export async function deleteDripScheduleByLesson(lessonId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM drip_schedules WHERE lesson_id = $1`,
    [lessonId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Delete drip schedule by module ID
 */
export async function deleteDripScheduleByModule(moduleId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM drip_schedules WHERE module_id = $1`,
    [moduleId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get a single drip schedule by ID
 */
export async function getDripScheduleById(id: string): Promise<DripSchedule | null> {
  const sql = `
    SELECT
      ds.id, ds.course_id, ds.lesson_id, ds.module_id,
      ds.release_type, ds.release_date, ds.relative_days, ds.relative_hours,
      ds.after_lesson_id, ds.after_module_id, ds.release_time, ds.timezone,
      ds.is_active, ds.notes, ds.created_at, ds.updated_at,
      cl.title as lesson_title,
      cm.title as module_title,
      al.title as after_lesson_title,
      am.title as after_module_title
    FROM drip_schedules ds
    LEFT JOIN course_lessons cl ON cl.id = ds.lesson_id
    LEFT JOIN course_modules cm ON cm.id = ds.module_id
    LEFT JOIN course_lessons al ON al.id = ds.after_lesson_id
    LEFT JOIN course_modules am ON am.id = ds.after_module_id
    WHERE ds.id = $1
  `;

  const rows = await query<DripScheduleRow>(sql, [id]);
  return rows.length > 0 ? mapDripSchedule(rows[0]) : null;
}

/**
 * Set or update drip schedule for a lesson (upsert)
 */
export async function setLessonDripSchedule(input: CreateDripScheduleInput): Promise<DripSchedule> {
  if (!input.lessonId) {
    throw new Error('lessonId is required for setLessonDripSchedule');
  }

  // Check if schedule exists
  const existing = await getDripScheduleByLesson(input.lessonId);

  if (existing) {
    const updated = await updateDripSchedule(existing.id, {
      releaseType: input.releaseType,
      releaseDate: input.releaseDate,
      relativeDays: input.relativeDays,
      relativeHours: input.relativeHours,
      afterLessonId: input.afterLessonId,
      afterModuleId: input.afterModuleId,
      releaseTime: input.releaseTime,
      timezone: input.timezone,
      isActive: input.isActive,
      notes: input.notes,
    });
    return updated!;
  }

  return createDripSchedule(input);
}

/**
 * Set or update drip schedule for a module (upsert)
 */
export async function setModuleDripSchedule(input: CreateDripScheduleInput): Promise<DripSchedule> {
  if (!input.moduleId) {
    throw new Error('moduleId is required for setModuleDripSchedule');
  }

  // Check if schedule exists
  const existing = await getDripScheduleByModule(input.moduleId);

  if (existing) {
    const updated = await updateDripSchedule(existing.id, {
      releaseType: input.releaseType,
      releaseDate: input.releaseDate,
      relativeDays: input.relativeDays,
      relativeHours: input.relativeHours,
      afterLessonId: input.afterLessonId,
      afterModuleId: input.afterModuleId,
      releaseTime: input.releaseTime,
      timezone: input.timezone,
      isActive: input.isActive,
      notes: input.notes,
    });
    return updated!;
  }

  return createDripSchedule(input);
}

// =====================================================
// COURSE DRIP SETTINGS CRUD
// =====================================================

/**
 * Get drip settings for a course
 */
export async function getCourseDripSettings(courseId: string): Promise<CourseDripSettings | null> {
  const sql = `
    SELECT
      id, course_id, drip_mode, default_interval_days,
      send_unlock_notifications, unlock_email_template, drip_start_date,
      created_at, updated_at
    FROM course_drip_settings
    WHERE course_id = $1
  `;

  const rows = await query<CourseDripSettingsRow>(sql, [courseId]);
  return rows.length > 0 ? mapCourseDripSettings(rows[0]) : null;
}

/**
 * Set or update course drip settings (upsert)
 */
export async function setCourseDripSettings(input: SetCourseDripSettingsInput): Promise<CourseDripSettings> {
  const sql = `
    INSERT INTO course_drip_settings (
      course_id, drip_mode, default_interval_days,
      send_unlock_notifications, unlock_email_template, drip_start_date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (course_id) DO UPDATE SET
      drip_mode = EXCLUDED.drip_mode,
      default_interval_days = EXCLUDED.default_interval_days,
      send_unlock_notifications = EXCLUDED.send_unlock_notifications,
      unlock_email_template = EXCLUDED.unlock_email_template,
      drip_start_date = EXCLUDED.drip_start_date,
      updated_at = NOW()
    RETURNING id, course_id, drip_mode, default_interval_days,
      send_unlock_notifications, unlock_email_template, drip_start_date,
      created_at, updated_at
  `;

  const rows = await query<CourseDripSettingsRow>(sql, [
    input.courseId,
    input.dripMode,
    input.defaultIntervalDays ?? 7,
    input.sendUnlockNotifications ?? true,
    input.unlockEmailTemplate ?? null,
    input.dripStartDate ?? null,
  ]);

  return mapCourseDripSettings(rows[0]);
}

/**
 * Delete course drip settings
 */
export async function deleteCourseDripSettings(courseId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM course_drip_settings WHERE course_id = $1`,
    [courseId]
  );
  return (result.rowCount ?? 0) > 0;
}

// =====================================================
// USER DRIP STATUS
// =====================================================

/**
 * Get drip status for a user on a specific schedule
 */
export async function getUserDripStatus(
  userId: string,
  dripScheduleId: string
): Promise<UserDripStatus | null> {
  const sql = `
    SELECT
      id, user_id, drip_schedule_id, calculated_release_date,
      is_unlocked, unlocked_at, created_at, updated_at
    FROM user_drip_status
    WHERE user_id = $1 AND drip_schedule_id = $2
  `;

  const rows = await query<UserDripStatusRow>(sql, [userId, dripScheduleId]);
  return rows.length > 0 ? mapUserDripStatus(rows[0]) : null;
}

/**
 * Get all drip statuses for a user in a course
 */
export async function getUserDripStatusesByCourse(
  userId: string,
  courseId: string
): Promise<UserDripStatus[]> {
  const sql = `
    SELECT
      uds.id, uds.user_id, uds.drip_schedule_id, uds.calculated_release_date,
      uds.is_unlocked, uds.unlocked_at, uds.created_at, uds.updated_at
    FROM user_drip_status uds
    JOIN drip_schedules ds ON ds.id = uds.drip_schedule_id
    WHERE uds.user_id = $1 AND ds.course_id = $2
    ORDER BY uds.calculated_release_date ASC
  `;

  const rows = await query<UserDripStatusRow>(sql, [userId, courseId]);
  return rows.map(mapUserDripStatus);
}

/**
 * Update or create user drip status
 */
export async function setUserDripStatus(
  userId: string,
  dripScheduleId: string,
  calculatedReleaseDate: string,
  isUnlocked: boolean = false
): Promise<UserDripStatus> {
  const sql = `
    INSERT INTO user_drip_status (
      user_id, drip_schedule_id, calculated_release_date, is_unlocked,
      unlocked_at
    )
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id, drip_schedule_id) DO UPDATE SET
      calculated_release_date = EXCLUDED.calculated_release_date,
      is_unlocked = EXCLUDED.is_unlocked,
      unlocked_at = CASE WHEN EXCLUDED.is_unlocked AND NOT user_drip_status.is_unlocked
                        THEN NOW() ELSE user_drip_status.unlocked_at END,
      updated_at = NOW()
    RETURNING id, user_id, drip_schedule_id, calculated_release_date,
      is_unlocked, unlocked_at, created_at, updated_at
  `;

  const rows = await query<UserDripStatusRow>(sql, [
    userId,
    dripScheduleId,
    calculatedReleaseDate,
    isUnlocked,
    isUnlocked ? new Date().toISOString() : null,
  ]);

  return mapUserDripStatus(rows[0]);
}

/**
 * Unlock content for a user
 */
export async function unlockContent(userId: string, dripScheduleId: string): Promise<UserDripStatus | null> {
  const sql = `
    UPDATE user_drip_status
    SET is_unlocked = true, unlocked_at = NOW(), updated_at = NOW()
    WHERE user_id = $1 AND drip_schedule_id = $2
    RETURNING id, user_id, drip_schedule_id, calculated_release_date,
      is_unlocked, unlocked_at, created_at, updated_at
  `;

  const rows = await query<UserDripStatusRow>(sql, [userId, dripScheduleId]);
  return rows.length > 0 ? mapUserDripStatus(rows[0]) : null;
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Get content that should be unlocked for a user (release date has passed)
 */
export async function getPendingUnlocks(userId: string): Promise<UserDripStatus[]> {
  const sql = `
    SELECT
      id, user_id, drip_schedule_id, calculated_release_date,
      is_unlocked, unlocked_at, created_at, updated_at
    FROM user_drip_status
    WHERE user_id = $1
      AND is_unlocked = false
      AND calculated_release_date <= NOW()
    ORDER BY calculated_release_date ASC
  `;

  const rows = await query<UserDripStatusRow>(sql, [userId]);
  return rows.map(mapUserDripStatus);
}

/**
 * Get upcoming content releases for a user
 */
export async function getUpcomingReleases(
  userId: string,
  limit: number = 10
): Promise<UserDripStatus[]> {
  const sql = `
    SELECT
      id, user_id, drip_schedule_id, calculated_release_date,
      is_unlocked, unlocked_at, created_at, updated_at
    FROM user_drip_status
    WHERE user_id = $1
      AND is_unlocked = false
      AND calculated_release_date > NOW()
    ORDER BY calculated_release_date ASC
    LIMIT $2
  `;

  const rows = await query<UserDripStatusRow>(sql, [userId, limit]);
  return rows.map(mapUserDripStatus);
}

/**
 * Get release type display label
 */
export function getReleaseTypeLabel(type: DripReleaseType): string {
  const labels: Record<DripReleaseType, string> = {
    immediate: 'Available Immediately',
    fixed_date: 'On Specific Date',
    relative_days: 'Days After Enrollment',
    relative_hours: 'Hours After Enrollment',
    after_lesson: 'After Completing Lesson',
    after_module: 'After Completing Module',
    after_enrollment: 'After Enrollment',
  };
  return labels[type] || type;
}

/**
 * Get drip mode display label
 */
export function getDripModeLabel(mode: DripMode): string {
  const labels: Record<DripMode, string> = {
    disabled: 'Disabled (All Content Available)',
    sequential: 'Sequential (Unlock After Completion)',
    scheduled: 'Scheduled (Custom Dates)',
    hybrid: 'Hybrid (Mix of Both)',
  };
  return labels[mode] || mode;
}
