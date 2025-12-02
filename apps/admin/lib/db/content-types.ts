/**
 * Content Types Database Queries
 *
 * Database queries for content types (Video, Blog, Course, etc.).
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface DBContentType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  default_workflow_id: string | null;
  default_checklist_template_id: string | null;
  platforms: string[];
  estimated_duration_days: number | null;
  is_active: boolean;
  created_at: string;
  // Joined fields
  default_workflow_name?: string;
  content_items_count?: number;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all content types
 */
export async function getAllContentTypes(filters: {
  isActive?: boolean;
  platform?: string;
} = {}): Promise<DBContentType[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.isActive !== undefined) {
    conditions.push(`ct.is_active = $${paramIndex++}`);
    params.push(filters.isActive);
  }

  if (filters.platform) {
    conditions.push(`$${paramIndex++} = ANY(ct.platforms)`);
    params.push(filters.platform);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      ct.id, ct.name, ct.slug, ct.description, ct.icon,
      ct.default_workflow_id, ct.default_checklist_template_id,
      ct.platforms, ct.estimated_duration_days, ct.is_active, ct.created_at,
      w.name as default_workflow_name,
      COUNT(ci.id)::int as content_items_count
    FROM content_types ct
    LEFT JOIN workflow_definitions w ON w.id = ct.default_workflow_id
    LEFT JOIN content_items ci ON ci.content_type_id = ct.id
    ${whereClause}
    GROUP BY ct.id, w.name
    ORDER BY ct.name ASC
  `;

  return query<DBContentType>(sql, params);
}

/**
 * Get a content type by ID
 */
export async function getContentTypeById(id: string): Promise<DBContentType | null> {
  const sql = `
    SELECT
      ct.id, ct.name, ct.slug, ct.description, ct.icon,
      ct.default_workflow_id, ct.default_checklist_template_id,
      ct.platforms, ct.estimated_duration_days, ct.is_active, ct.created_at,
      w.name as default_workflow_name
    FROM content_types ct
    LEFT JOIN workflow_definitions w ON w.id = ct.default_workflow_id
    WHERE ct.id = $1
  `;

  const rows = await query<DBContentType>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get a content type by slug
 */
export async function getContentTypeBySlug(slug: string): Promise<DBContentType | null> {
  const sql = `
    SELECT
      ct.id, ct.name, ct.slug, ct.description, ct.icon,
      ct.default_workflow_id, ct.default_checklist_template_id,
      ct.platforms, ct.estimated_duration_days, ct.is_active, ct.created_at,
      w.name as default_workflow_name
    FROM content_types ct
    LEFT JOIN workflow_definitions w ON w.id = ct.default_workflow_id
    WHERE ct.slug = $1
  `;

  const rows = await query<DBContentType>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new content type
 */
export async function createContentType(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  default_workflow_id?: string;
  platforms?: string[];
  estimated_duration_days?: number;
}): Promise<DBContentType> {
  const sql = `
    INSERT INTO content_types (
      name, slug, description, icon, default_workflow_id, platforms, estimated_duration_days
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, slug, description, icon, default_workflow_id,
              default_checklist_template_id, platforms, estimated_duration_days,
              is_active, created_at
  `;

  const rows = await query<DBContentType>(sql, [
    data.name,
    data.slug,
    data.description || null,
    data.icon || null,
    data.default_workflow_id || null,
    data.platforms || [],
    data.estimated_duration_days || null,
  ]);

  return rows[0];
}

/**
 * Update a content type
 */
export async function updateContentType(
  id: string,
  data: Partial<Pick<DBContentType, 'name' | 'description' | 'icon' | 'default_workflow_id' | 'default_checklist_template_id' | 'platforms' | 'estimated_duration_days' | 'is_active'>>
): Promise<DBContentType | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'icon', column: 'icon' },
    { key: 'default_workflow_id', column: 'default_workflow_id' },
    { key: 'default_checklist_template_id', column: 'default_checklist_template_id' },
    { key: 'platforms', column: 'platforms' },
    { key: 'estimated_duration_days', column: 'estimated_duration_days' },
    { key: 'is_active', column: 'is_active' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  params.push(id);

  const sql = `
    UPDATE content_types
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, slug, description, icon, default_workflow_id,
              default_checklist_template_id, platforms, estimated_duration_days,
              is_active, created_at
  `;

  const rows = await query<DBContentType>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a content type (soft delete by setting is_active = false)
 */
export async function deleteContentType(id: string): Promise<boolean> {
  const result = await execute(
    'UPDATE content_types SET is_active = false WHERE id = $1',
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get content types grouped by platform
 */
export async function getContentTypesByPlatform(): Promise<Record<string, DBContentType[]>> {
  const allTypes = await getAllContentTypes({ isActive: true });

  const grouped: Record<string, DBContentType[]> = {};

  for (const contentType of allTypes) {
    for (const platform of contentType.platforms) {
      if (!grouped[platform]) {
        grouped[platform] = [];
      }
      grouped[platform].push(contentType);
    }
  }

  return grouped;
}
