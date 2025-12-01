/**
 * Process Templates Database Queries
 *
 * Database queries for process_templates table via direct PostgreSQL connection.
 * Templates are reusable task definitions for project workflows.
 *
 * Template types: Kurs, Post, Blog, Love Letter, Video, Short, Kongress, Interview
 * Status values: active, inactive, archived, draft
 */

import { query, execute } from './index';

// ============================================================================
// Types
// ============================================================================

/**
 * Database row type matching process_templates schema
 */
export interface DBProcessTemplate {
  id: string;
  airtable_id: string | null;
  name: string;
  description: string | null;
  template_type: string | null;
  status: 'active' | 'inactive' | 'archived' | 'draft';
  task_order: number;
  offset_days_to_anchor: number;
  duration_days: number;
  is_anchor_point: boolean;
  assigned_to_ids: string[];
  linked_lightguides: string[];
  linked_anchor: string[];
  linked_set: string[];
  usage_count: number;
  created_by_name: string | null;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

/**
 * Filter options for querying templates
 */
export interface TemplateFilters {
  templateType?: string;
  status?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Paginated result for template list queries
 */
export interface TemplateListResult {
  templates: DBProcessTemplate[];
  total: number;
}

/**
 * Template type with count for statistics
 */
export interface TemplateTypeCount {
  type: string;
  count: number;
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all templates with optional filtering and pagination
 *
 * @param filters - Filter options for templates
 * @param filters.templateType - Filter by template_type (e.g., 'Kurs', 'Post')
 * @param filters.status - Filter by status (default: 'active')
 * @param filters.search - Search in name and description (case-insensitive)
 * @param filters.isActive - Only active templates (overrides status)
 * @param filters.limit - Maximum number of results (default: 100)
 * @param filters.offset - Number of results to skip (default: 0)
 * @returns Promise resolving to templates and total count
 *
 * @example
 * // Get first 10 active course templates
 * const result = await getAllTemplates({
 *   templateType: 'Kurs',
 *   limit: 10
 * });
 */
export async function getAllTemplates(
  filters: TemplateFilters = {}
): Promise<TemplateListResult> {
  const {
    templateType,
    status,
    search,
    isActive = true,
    limit: requestedLimit = 50,
    offset = 0,
  } = filters;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE clauses
  const whereClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Filter by status (default to active)
  if (isActive && !status) {
    whereClauses.push(`status = $${paramIndex}`);
    params.push('active');
    paramIndex++;
  } else if (status) {
    whereClauses.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  // Filter by template type
  if (templateType) {
    whereClauses.push(`template_type = $${paramIndex}`);
    params.push(templateType);
    paramIndex++;
  }

  // Search in name and description
  if (search) {
    whereClauses.push(
      `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
    );
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countSql = `
    SELECT COUNT(*) as total
    FROM process_templates
    ${whereClause}
  `;

  const countResult = await query<{ total: string }>(countSql, params);
  const total = parseInt(countResult[0]?.total || '0', 10);

  // Get paginated results
  const dataSql = `
    SELECT
      id,
      airtable_id,
      name,
      description,
      template_type,
      status,
      task_order,
      offset_days_to_anchor,
      duration_days,
      is_anchor_point,
      assigned_to_ids,
      linked_lightguides,
      linked_anchor,
      linked_set,
      usage_count,
      created_by_name,
      created_by_email,
      created_at,
      updated_at,
      metadata
    FROM process_templates
    ${whereClause}
    ORDER BY task_order ASC, name ASC
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
  `;

  const dataParams = [...params, limit, offset];
  const templates = await query<DBProcessTemplate>(dataSql, dataParams);

  return {
    templates,
    total,
  };
}

/**
 * Get a single template by UUID
 *
 * @param id - Template UUID
 * @returns Promise resolving to template or null if not found
 *
 * @example
 * const template = await getTemplateById('550e8400-e29b-41d4-a716-446655440000');
 * if (template) {
 *   console.log(`Template: ${template.name}`);
 * }
 */
export async function getTemplateById(
  id: string
): Promise<DBProcessTemplate | null> {
  const sql = `
    SELECT
      id,
      airtable_id,
      name,
      description,
      template_type,
      status,
      task_order,
      offset_days_to_anchor,
      duration_days,
      is_anchor_point,
      assigned_to_ids,
      linked_lightguides,
      linked_anchor,
      linked_set,
      usage_count,
      created_by_name,
      created_by_email,
      created_at,
      updated_at,
      metadata
    FROM process_templates
    WHERE id = $1
  `;

  const results = await query<DBProcessTemplate>(sql, [id]);
  return results[0] || null;
}

/**
 * Get all templates of a specific type
 *
 * @param type - Template type (e.g., 'Kurs', 'Post', 'Blog')
 * @returns Promise resolving to array of templates
 *
 * @example
 * // Get all course templates
 * const courseTemplates = await getTemplatesByType('Kurs');
 */
export async function getTemplatesByType(
  type: string
): Promise<DBProcessTemplate[]> {
  const sql = `
    SELECT
      id,
      airtable_id,
      name,
      description,
      template_type,
      status,
      task_order,
      offset_days_to_anchor,
      duration_days,
      is_anchor_point,
      assigned_to_ids,
      linked_lightguides,
      linked_anchor,
      linked_set,
      usage_count,
      created_by_name,
      created_by_email,
      created_at,
      updated_at,
      metadata
    FROM process_templates
    WHERE template_type = $1
      AND status = 'active'
    ORDER BY task_order ASC, name ASC
  `;

  return query<DBProcessTemplate>(sql, [type]);
}

/**
 * Get distinct template types with usage counts
 *
 * Useful for displaying template categories and statistics.
 * Only includes active templates in the count.
 *
 * @returns Promise resolving to array of template types with counts
 *
 * @example
 * const types = await getTemplateTypes();
 * // [
 * //   { type: 'Kurs', count: 25 },
 * //   { type: 'Post', count: 150 },
 * //   { type: 'Video', count: 42 }
 * // ]
 */
export async function getTemplateTypes(): Promise<TemplateTypeCount[]> {
  const sql = `
    SELECT
      template_type as type,
      COUNT(*) as count
    FROM process_templates
    WHERE status = 'active'
      AND template_type IS NOT NULL
    GROUP BY template_type
    ORDER BY count DESC, template_type ASC
  `;

  const results = await query<{ type: string; count: string }>(sql);

  // Convert count from string to number
  return results.map((row) => ({
    type: row.type,
    count: parseInt(row.count, 10),
  }));
}

/**
 * Increment the usage count for a template
 *
 * Call this when a template is used to create a new project or task.
 * Tracks template popularity and usage statistics.
 *
 * @param id - Template UUID
 * @returns Promise that resolves when update is complete
 *
 * @example
 * // When creating a project from a template
 * await incrementUsageCount(templateId);
 */
export async function incrementUsageCount(id: string): Promise<void> {
  const sql = `
    UPDATE process_templates
    SET usage_count = usage_count + 1
    WHERE id = $1
  `;

  await execute(sql, [id]);
}

// ============================================================================
// Exports
// ============================================================================

export default {
  getAllTemplates,
  getTemplateById,
  getTemplatesByType,
  getTemplateTypes,
  incrementUsageCount,
};
