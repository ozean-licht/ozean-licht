/**
 * Quick Responses Database Module
 *
 * CRUD operations for quick responses (canned responses) in Support Management System.
 * Supports team-wide and personal responses with category filtering.
 */

import { query, execute } from './index';
import type {
  QuickResponse,
  CreateQuickResponseInput,
  UpdateQuickResponseInput,
} from '../../types/support';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

interface DBQuickResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  is_personal: boolean;
  created_by: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  creator_name?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Transform database row to QuickResponse type
 */
function transformQuickResponse(row: DBQuickResponse): QuickResponse {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    language: row.language,
    isPersonal: row.is_personal,
    createdBy: row.created_by || undefined,
    usageCount: row.usage_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// List & Filter Operations
// ============================================================================

interface QuickResponseListOptions {
  category?: string;
  language?: string;
  isPersonal?: boolean;
  createdBy?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'usage_count' | 'title' | 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Get all quick responses with filtering
 *
 * @param options - Filter and pagination options
 * @returns Array of quick responses and total count
 *
 * @example
 * // Get team responses in German
 * const { responses, total } = await getAllQuickResponses({
 *   isPersonal: false,
 *   language: 'de',
 *   orderBy: 'usage_count',
 *   orderDirection: 'desc'
 * });
 */
export async function getAllQuickResponses(
  options: QuickResponseListOptions = {}
): Promise<{ responses: QuickResponse[]; total: number }> {
  const {
    category,
    language,
    isPersonal,
    createdBy,
    search,
    limit = 50,
    offset = 0,
    orderBy = 'usage_count',
    orderDirection = 'desc',
  } = options;

  const conditions: string[] = [];
  const params: (string | boolean | number)[] = [];
  let paramIndex = 1;

  // Apply filters
  if (category) {
    conditions.push(`category = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  if (language) {
    conditions.push(`language = $${paramIndex}`);
    params.push(language);
    paramIndex++;
  }

  if (isPersonal !== undefined) {
    conditions.push(`is_personal = $${paramIndex}`);
    params.push(isPersonal);
    paramIndex++;
  }

  if (createdBy) {
    conditions.push(`created_by = $${paramIndex}`);
    params.push(createdBy);
    paramIndex++;
  }

  if (search) {
    conditions.push(
      `(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`
    );
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderBy: Array<typeof orderBy> = ['usage_count', 'title', 'created_at', 'updated_at'];
  const safeOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'usage_count';

  // Validate orderDirection
  const validOrderDirection: Array<typeof orderDirection> = ['asc', 'desc'];
  const safeOrderDirection = validOrderDirection.includes(orderDirection) ? orderDirection.toUpperCase() : 'DESC';

  // Count query
  const countSql = `
    SELECT COUNT(*)::INTEGER as count
    FROM quick_responses
    ${whereClause}
  `;
  const countRows = await query<{ count: number }>(countSql, params);
  const total = countRows[0]?.count || 0;

  // Data query
  const dataSql = `
    SELECT
      id,
      title,
      content,
      category,
      language,
      is_personal,
      created_by,
      usage_count,
      created_at,
      updated_at
    FROM quick_responses
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDirection}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const rows = await query<DBQuickResponse>(dataSql, [
    ...params,
    limit,
    offset,
  ]);

  return {
    responses: rows.map(transformQuickResponse),
    total,
  };
}

// ============================================================================
// Single Record Operations
// ============================================================================

/**
 * Get a quick response by ID
 *
 * @param id - Quick response UUID
 * @returns Quick response or null if not found
 */
export async function getQuickResponseById(
  id: string
): Promise<QuickResponse | null> {
  const sql = `
    SELECT
      id,
      title,
      content,
      category,
      language,
      is_personal,
      created_by,
      usage_count,
      created_at,
      updated_at
    FROM quick_responses
    WHERE id = $1
  `;

  const rows = await query<DBQuickResponse>(sql, [id]);
  return rows.length > 0 ? transformQuickResponse(rows[0]) : null;
}

/**
 * Create a new quick response
 *
 * @param data - Quick response data
 * @param createdBy - Admin user ID creating the response
 * @returns Created quick response
 */
export async function createQuickResponse(
  data: CreateQuickResponseInput,
  createdBy?: string
): Promise<QuickResponse> {
  const {
    title,
    content,
    category = 'general',
    language = 'de',
    isPersonal = false,
  } = data;

  const sql = `
    INSERT INTO quick_responses (
      title,
      content,
      category,
      language,
      is_personal,
      created_by,
      usage_count
    ) VALUES ($1, $2, $3, $4, $5, $6, 0)
    RETURNING
      id,
      title,
      content,
      category,
      language,
      is_personal,
      created_by,
      usage_count,
      created_at,
      updated_at
  `;

  const result = await execute<DBQuickResponse>(sql, [
    title,
    content,
    category,
    language,
    isPersonal,
    createdBy || null,
  ]);

  return transformQuickResponse(result.rows[0]);
}

/**
 * Update a quick response
 *
 * @param id - Quick response UUID
 * @param data - Fields to update
 * @returns Updated quick response or null if not found
 */
export async function updateQuickResponse(
  id: string,
  data: UpdateQuickResponseInput
): Promise<QuickResponse | null> {
  const updates: string[] = [];
  const params: (string | boolean)[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex}`);
    params.push(data.title);
    paramIndex++;
  }

  if (data.content !== undefined) {
    updates.push(`content = $${paramIndex}`);
    params.push(data.content);
    paramIndex++;
  }

  if (data.category !== undefined) {
    updates.push(`category = $${paramIndex}`);
    params.push(data.category);
    paramIndex++;
  }

  if (data.language !== undefined) {
    updates.push(`language = $${paramIndex}`);
    params.push(data.language);
    paramIndex++;
  }

  if (data.isPersonal !== undefined) {
    updates.push(`is_personal = $${paramIndex}`);
    params.push(data.isPersonal);
    paramIndex++;
  }

  if (updates.length === 0) {
    return getQuickResponseById(id);
  }

  params.push(id);

  const sql = `
    UPDATE quick_responses
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id,
      title,
      content,
      category,
      language,
      is_personal,
      created_by,
      usage_count,
      created_at,
      updated_at
  `;

  const result = await execute<DBQuickResponse>(sql, params);
  return result.rows.length > 0 ? transformQuickResponse(result.rows[0]) : null;
}

/**
 * Delete a quick response
 *
 * @param id - Quick response UUID
 * @returns True if deleted, false if not found
 */
export async function deleteQuickResponse(id: string): Promise<boolean> {
  const sql = `DELETE FROM quick_responses WHERE id = $1`;
  const result = await execute(sql, [id]);
  return result.rowCount > 0;
}

// ============================================================================
// Usage Tracking
// ============================================================================

/**
 * Increment usage count for a quick response
 *
 * @param id - Quick response UUID
 * @returns Updated usage count or null if not found
 */
export async function incrementUsageCount(id: string): Promise<number | null> {
  const sql = `
    UPDATE quick_responses
    SET usage_count = usage_count + 1
    WHERE id = $1
    RETURNING usage_count
  `;

  const result = await execute<{ usage_count: number }>(sql, [id]);
  return result.rows.length > 0 ? result.rows[0].usage_count : null;
}

// ============================================================================
// Category Operations
// ============================================================================

/**
 * Get all unique categories
 *
 * @returns Array of category names
 */
export async function getCategories(): Promise<string[]> {
  const sql = `
    SELECT DISTINCT category
    FROM quick_responses
    WHERE category IS NOT NULL
    ORDER BY category ASC
  `;

  const rows = await query<{ category: string }>(sql);
  return rows.map((r) => r.category);
}

/**
 * Get quick response count by category
 *
 * @returns Record mapping category to count
 */
export async function getCountByCategory(): Promise<Record<string, number>> {
  const sql = `
    SELECT
      category,
      COUNT(*)::INTEGER as count
    FROM quick_responses
    GROUP BY category
    ORDER BY count DESC
  `;

  const rows = await query<{ category: string; count: number }>(sql);

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.category] = row.count;
  }
  return result;
}
