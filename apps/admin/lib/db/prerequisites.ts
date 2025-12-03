/**
 * Lesson Prerequisites Database Queries
 *
 * Direct PostgreSQL queries for lesson prerequisites, module unlock rules,
 * and course completion rules.
 * Part of Phase 9: Learning Sequences
 */

import { query, execute, transaction } from './index';

// =====================================================
// TYPES
// =====================================================

export type PrerequisiteType = 'completion' | 'passing_score' | 'viewed';

export interface LessonPrerequisite {
  id: string;
  lessonId: string;
  requiredLessonId: string;
  type: PrerequisiteType;
  minScore?: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  requiredLesson?: {
    id: string;
    title: string;
    moduleId: string;
    moduleName?: string;
  };
}

export type ModuleUnlockRuleType =
  | 'always_unlocked'
  | 'sequential'
  | 'specific_module'
  | 'lesson_count'
  | 'percentage_complete'
  | 'date_based';

export interface ModuleUnlockRule {
  id: string;
  moduleId: string;
  ruleType: ModuleUnlockRuleType;
  requiredModuleId?: string;
  requiredLessonCount?: number;
  requiredPercentage?: number;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  requiredModule?: {
    id: string;
    title: string;
  };
}

export type CourseCompletionRuleType =
  | 'all_lessons'
  | 'required_lessons'
  | 'percentage'
  | 'specific_lessons'
  | 'quiz_average';

export interface CourseCompletionRule {
  id: string;
  courseId: string;
  ruleType: CourseCompletionRuleType;
  requiredPercentage?: number;
  minQuizScore?: number;
  issueCertificate: boolean;
  completionMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// Input types
export interface CreatePrerequisiteInput {
  lessonId: string;
  requiredLessonId: string;
  type?: PrerequisiteType;
  minScore?: number;
  sortOrder?: number;
}

export interface UpdatePrerequisiteInput {
  type?: PrerequisiteType;
  minScore?: number;
  sortOrder?: number;
}

export interface CreateModuleUnlockRuleInput {
  moduleId: string;
  ruleType: ModuleUnlockRuleType;
  requiredModuleId?: string;
  requiredLessonCount?: number;
  requiredPercentage?: number;
}

export interface UpdateModuleUnlockRuleInput {
  ruleType?: ModuleUnlockRuleType;
  requiredModuleId?: string;
  requiredLessonCount?: number;
  requiredPercentage?: number;
}

export interface CreateCourseCompletionRuleInput {
  courseId: string;
  ruleType: CourseCompletionRuleType;
  requiredPercentage?: number;
  minQuizScore?: number;
  issueCertificate?: boolean;
  completionMessage?: string;
}

export interface UpdateCourseCompletionRuleInput {
  ruleType?: CourseCompletionRuleType;
  requiredPercentage?: number;
  minQuizScore?: number;
  issueCertificate?: boolean;
  completionMessage?: string;
}

// Database row types
interface PrerequisiteRow {
  id: string;
  lesson_id: string;
  required_lesson_id: string;
  type: string;
  min_score: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  required_lesson_title?: string;
  required_lesson_module_id?: string;
  required_lesson_module_name?: string;
}

interface ModuleUnlockRuleRow {
  id: string;
  module_id: string;
  rule_type: string;
  required_module_id: string | null;
  required_lesson_count: number | null;
  required_percentage: number | null;
  created_at: string;
  updated_at: string;
  required_module_title?: string;
}

interface CourseCompletionRuleRow {
  id: string;
  course_id: string;
  rule_type: string;
  required_percentage: number | null;
  min_quiz_score: number | null;
  issue_certificate: boolean;
  completion_message: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// MAPPERS
// =====================================================

function mapPrerequisite(row: PrerequisiteRow): LessonPrerequisite {
  const prerequisite: LessonPrerequisite = {
    id: row.id,
    lessonId: row.lesson_id,
    requiredLessonId: row.required_lesson_id,
    type: row.type as PrerequisiteType,
    minScore: row.min_score ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.required_lesson_title) {
    prerequisite.requiredLesson = {
      id: row.required_lesson_id,
      title: row.required_lesson_title,
      moduleId: row.required_lesson_module_id || '',
      moduleName: row.required_lesson_module_name,
    };
  }

  return prerequisite;
}

function mapModuleUnlockRule(row: ModuleUnlockRuleRow): ModuleUnlockRule {
  const rule: ModuleUnlockRule = {
    id: row.id,
    moduleId: row.module_id,
    ruleType: row.rule_type as ModuleUnlockRuleType,
    requiredModuleId: row.required_module_id ?? undefined,
    requiredLessonCount: row.required_lesson_count ?? undefined,
    requiredPercentage: row.required_percentage ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.required_module_id && row.required_module_title) {
    rule.requiredModule = {
      id: row.required_module_id,
      title: row.required_module_title,
    };
  }

  return rule;
}

function mapCourseCompletionRule(row: CourseCompletionRuleRow): CourseCompletionRule {
  return {
    id: row.id,
    courseId: row.course_id,
    ruleType: row.rule_type as CourseCompletionRuleType,
    requiredPercentage: row.required_percentage ?? undefined,
    minQuizScore: row.min_quiz_score ?? undefined,
    issueCertificate: row.issue_certificate,
    completionMessage: row.completion_message ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =====================================================
// LESSON PREREQUISITES CRUD
// =====================================================

/**
 * Get all prerequisites for a lesson
 */
export async function getPrerequisitesByLesson(lessonId: string): Promise<LessonPrerequisite[]> {
  const sql = `
    SELECT
      lp.id, lp.lesson_id, lp.required_lesson_id, lp.type, lp.min_score,
      lp.sort_order, lp.created_at, lp.updated_at,
      cl.title as required_lesson_title,
      cl.module_id as required_lesson_module_id,
      cm.title as required_lesson_module_name
    FROM lesson_prerequisites lp
    JOIN course_lessons cl ON cl.id = lp.required_lesson_id
    LEFT JOIN course_modules cm ON cm.id = cl.module_id
    WHERE lp.lesson_id = $1
    ORDER BY lp.sort_order ASC
  `;

  const rows = await query<PrerequisiteRow>(sql, [lessonId]);
  return rows.map(mapPrerequisite);
}

/**
 * Get lessons that depend on a given lesson (reverse lookup)
 */
export async function getLessonsDependingOn(requiredLessonId: string): Promise<LessonPrerequisite[]> {
  const sql = `
    SELECT
      lp.id, lp.lesson_id, lp.required_lesson_id, lp.type, lp.min_score,
      lp.sort_order, lp.created_at, lp.updated_at
    FROM lesson_prerequisites lp
    WHERE lp.required_lesson_id = $1
    ORDER BY lp.created_at ASC
  `;

  const rows = await query<PrerequisiteRow>(sql, [requiredLessonId]);
  return rows.map(mapPrerequisite);
}

/**
 * Create a lesson prerequisite
 */
export async function createPrerequisite(input: CreatePrerequisiteInput): Promise<LessonPrerequisite> {
  const sql = `
    INSERT INTO lesson_prerequisites (
      lesson_id, required_lesson_id, type, min_score, sort_order
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, lesson_id, required_lesson_id, type, min_score, sort_order, created_at, updated_at
  `;

  const rows = await query<PrerequisiteRow>(sql, [
    input.lessonId,
    input.requiredLessonId,
    input.type || 'completion',
    input.minScore ?? null,
    input.sortOrder ?? 0,
  ]);

  return mapPrerequisite(rows[0]);
}

/**
 * Update a lesson prerequisite
 */
export async function updatePrerequisite(
  id: string,
  input: UpdatePrerequisiteInput
): Promise<LessonPrerequisite | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.type !== undefined) {
    setClauses.push(`type = $${paramIndex++}`);
    params.push(input.type);
  }

  if (input.minScore !== undefined) {
    setClauses.push(`min_score = $${paramIndex++}`);
    params.push(input.minScore);
  }

  if (input.sortOrder !== undefined) {
    setClauses.push(`sort_order = $${paramIndex++}`);
    params.push(input.sortOrder);
  }

  if (setClauses.length === 0) {
    return getPrerequisiteById(id);
  }

  params.push(id);

  const sql = `
    UPDATE lesson_prerequisites
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, lesson_id, required_lesson_id, type, min_score, sort_order, created_at, updated_at
  `;

  const rows = await query<PrerequisiteRow>(sql, params);
  return rows.length > 0 ? mapPrerequisite(rows[0]) : null;
}

/**
 * Delete a lesson prerequisite
 */
export async function deletePrerequisite(id: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM lesson_prerequisites WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Delete all prerequisites for a lesson
 */
export async function deleteAllPrerequisites(lessonId: string): Promise<number> {
  const result = await execute(
    `DELETE FROM lesson_prerequisites WHERE lesson_id = $1`,
    [lessonId]
  );
  return result.rowCount ?? 0;
}

/**
 * Get a single prerequisite by ID
 */
export async function getPrerequisiteById(id: string): Promise<LessonPrerequisite | null> {
  const sql = `
    SELECT
      lp.id, lp.lesson_id, lp.required_lesson_id, lp.type, lp.min_score,
      lp.sort_order, lp.created_at, lp.updated_at,
      cl.title as required_lesson_title,
      cl.module_id as required_lesson_module_id,
      cm.title as required_lesson_module_name
    FROM lesson_prerequisites lp
    JOIN course_lessons cl ON cl.id = lp.required_lesson_id
    LEFT JOIN course_modules cm ON cm.id = cl.module_id
    WHERE lp.id = $1
  `;

  const rows = await query<PrerequisiteRow>(sql, [id]);
  return rows.length > 0 ? mapPrerequisite(rows[0]) : null;
}

/**
 * Bulk set prerequisites for a lesson (replaces existing)
 * Wrapped in a transaction to ensure atomicity
 */
export async function setLessonPrerequisites(
  lessonId: string,
  prerequisites: Array<{ requiredLessonId: string; type?: PrerequisiteType; minScore?: number }>
): Promise<LessonPrerequisite[]> {
  return transaction(async (client) => {
    // Delete existing prerequisites
    await client.query(
      'DELETE FROM lesson_prerequisites WHERE lesson_id = $1',
      [lessonId]
    );

    // Insert new prerequisites
    const results: LessonPrerequisite[] = [];
    for (let i = 0; i < prerequisites.length; i++) {
      const prereq = prerequisites[i];
      const sql = `
        INSERT INTO lesson_prerequisites (
          lesson_id, required_lesson_id, type, min_score, sort_order
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, lesson_id, required_lesson_id, type, min_score, sort_order, created_at, updated_at
      `;

      const result = await client.query(sql, [
        lessonId,
        prereq.requiredLessonId,
        prereq.type || 'completion',
        prereq.minScore ?? null,
        i,
      ]);

      results.push(mapPrerequisite(result.rows[0]));
    }

    return results;
  });
}

// =====================================================
// MODULE UNLOCK RULES CRUD
// =====================================================

/**
 * Get unlock rule for a module
 */
export async function getModuleUnlockRule(moduleId: string): Promise<ModuleUnlockRule | null> {
  const sql = `
    SELECT
      mur.id, mur.module_id, mur.rule_type, mur.required_module_id,
      mur.required_lesson_count, mur.required_percentage,
      mur.created_at, mur.updated_at,
      rm.title as required_module_title
    FROM module_unlock_rules mur
    LEFT JOIN course_modules rm ON rm.id = mur.required_module_id
    WHERE mur.module_id = $1
  `;

  const rows = await query<ModuleUnlockRuleRow>(sql, [moduleId]);
  return rows.length > 0 ? mapModuleUnlockRule(rows[0]) : null;
}

/**
 * Get all unlock rules for a course
 */
export async function getModuleUnlockRulesByCourse(courseId: string): Promise<ModuleUnlockRule[]> {
  const sql = `
    SELECT
      mur.id, mur.module_id, mur.rule_type, mur.required_module_id,
      mur.required_lesson_count, mur.required_percentage,
      mur.created_at, mur.updated_at,
      rm.title as required_module_title
    FROM module_unlock_rules mur
    JOIN course_modules cm ON cm.id = mur.module_id
    LEFT JOIN course_modules rm ON rm.id = mur.required_module_id
    WHERE cm.course_id = $1
    ORDER BY cm.sort_order ASC
  `;

  const rows = await query<ModuleUnlockRuleRow>(sql, [courseId]);
  return rows.map(mapModuleUnlockRule);
}

/**
 * Create or update module unlock rule (upsert)
 */
export async function setModuleUnlockRule(input: CreateModuleUnlockRuleInput): Promise<ModuleUnlockRule> {
  // Validate circular dependency for specific_module type
  if (input.ruleType === 'specific_module' && input.requiredModuleId) {
    // Check that the required module comes before the current module in sort order
    const moduleOrderCheck = await query<{ current_order: number; required_order: number }>(
      `SELECT
        curr.sort_order as current_order,
        req.sort_order as required_order
      FROM course_modules curr
      JOIN course_modules req ON req.id = $2 AND req.course_id = curr.course_id
      WHERE curr.id = $1`,
      [input.moduleId, input.requiredModuleId]
    );

    if (moduleOrderCheck.length === 0) {
      throw new Error('Required module not found or does not belong to the same course');
    }

    const { current_order, required_order } = moduleOrderCheck[0];

    if (required_order >= current_order) {
      throw new Error('Required module must come before the current module in the course sequence');
    }
  }

  const sql = `
    INSERT INTO module_unlock_rules (
      module_id, rule_type, required_module_id, required_lesson_count, required_percentage
    )
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (module_id) DO UPDATE SET
      rule_type = EXCLUDED.rule_type,
      required_module_id = EXCLUDED.required_module_id,
      required_lesson_count = EXCLUDED.required_lesson_count,
      required_percentage = EXCLUDED.required_percentage,
      updated_at = NOW()
    RETURNING id, module_id, rule_type, required_module_id, required_lesson_count, required_percentage, created_at, updated_at
  `;

  const rows = await query<ModuleUnlockRuleRow>(sql, [
    input.moduleId,
    input.ruleType,
    input.requiredModuleId ?? null,
    input.requiredLessonCount ?? null,
    input.requiredPercentage ?? null,
  ]);

  return mapModuleUnlockRule(rows[0]);
}

/**
 * Delete module unlock rule
 */
export async function deleteModuleUnlockRule(moduleId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM module_unlock_rules WHERE module_id = $1`,
    [moduleId]
  );
  return (result.rowCount ?? 0) > 0;
}

// =====================================================
// COURSE COMPLETION RULES CRUD
// =====================================================

/**
 * Get completion rules for a course
 */
export async function getCourseCompletionRules(courseId: string): Promise<CourseCompletionRule | null> {
  const sql = `
    SELECT
      id, course_id, rule_type, required_percentage, min_quiz_score,
      issue_certificate, completion_message, created_at, updated_at
    FROM course_completion_rules
    WHERE course_id = $1
  `;

  const rows = await query<CourseCompletionRuleRow>(sql, [courseId]);
  return rows.length > 0 ? mapCourseCompletionRule(rows[0]) : null;
}

/**
 * Create or update course completion rules (upsert)
 */
export async function setCourseCompletionRules(input: CreateCourseCompletionRuleInput): Promise<CourseCompletionRule> {
  const sql = `
    INSERT INTO course_completion_rules (
      course_id, rule_type, required_percentage, min_quiz_score,
      issue_certificate, completion_message
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (course_id) DO UPDATE SET
      rule_type = EXCLUDED.rule_type,
      required_percentage = EXCLUDED.required_percentage,
      min_quiz_score = EXCLUDED.min_quiz_score,
      issue_certificate = EXCLUDED.issue_certificate,
      completion_message = EXCLUDED.completion_message,
      updated_at = NOW()
    RETURNING id, course_id, rule_type, required_percentage, min_quiz_score,
      issue_certificate, completion_message, created_at, updated_at
  `;

  const rows = await query<CourseCompletionRuleRow>(sql, [
    input.courseId,
    input.ruleType,
    input.requiredPercentage ?? null,
    input.minQuizScore ?? null,
    input.issueCertificate ?? false,
    input.completionMessage ?? null,
  ]);

  return mapCourseCompletionRule(rows[0]);
}

/**
 * Delete course completion rules
 */
export async function deleteCourseCompletionRules(courseId: string): Promise<boolean> {
  const result = await execute(
    `DELETE FROM course_completion_rules WHERE course_id = $1`,
    [courseId]
  );
  return (result.rowCount ?? 0) > 0;
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

/**
 * Check if adding a prerequisite would create a circular dependency
 */
export async function wouldCreateCycle(lessonId: string, requiredLessonId: string): Promise<boolean> {
  const sql = `SELECT check_prerequisite_cycle($1, $2) as has_cycle`;
  const rows = await query<{ has_cycle: boolean }>(sql, [lessonId, requiredLessonId]);
  return rows[0]?.has_cycle ?? false;
}

/**
 * Get all available lessons that can be set as prerequisites
 * (lessons in the same course, before the current lesson's module)
 */
export async function getAvailablePrerequisites(lessonId: string): Promise<Array<{
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  moduleOrder: number;
}>> {
  const sql = `
    WITH current_lesson AS (
      SELECT cl.id, cl.module_id, cm.course_id, cm.sort_order as module_order
      FROM course_lessons cl
      JOIN course_modules cm ON cm.id = cl.module_id
      WHERE cl.id = $1
    )
    SELECT
      cl.id,
      cl.title,
      cl.module_id as "moduleId",
      cm.title as "moduleName",
      cm.sort_order as "moduleOrder"
    FROM course_lessons cl
    JOIN course_modules cm ON cm.id = cl.module_id
    CROSS JOIN current_lesson curr
    WHERE cm.course_id = curr.course_id
      AND cl.id != $1
      AND (
        cm.sort_order < curr.module_order
        OR (cm.sort_order = curr.module_order AND cl.sort_order < (
          SELECT sort_order FROM course_lessons WHERE id = $1
        ))
      )
    ORDER BY cm.sort_order ASC, cl.sort_order ASC
  `;

  return query(sql, [lessonId]);
}
