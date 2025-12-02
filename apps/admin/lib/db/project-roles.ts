/**
 * Project Roles Database Queries
 *
 * Database queries for project roles (Editor, Voice Artist, Translator, etc.).
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface DBProjectRole {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  permissions: Record<string, boolean>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  // Joined fields
  assignments_count?: number;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all project roles
 */
export async function getAllProjectRoles(filters: {
  isActive?: boolean;
} = {}): Promise<DBProjectRole[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.isActive !== undefined) {
    conditions.push(`pr.is_active = $${paramIndex++}`);
    params.push(filters.isActive);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      pr.id, pr.name, pr.slug, pr.description, pr.color, pr.icon,
      pr.permissions, pr.is_active, pr.sort_order, pr.created_at,
      COUNT(ta.id)::int as assignments_count
    FROM project_roles pr
    LEFT JOIN task_assignments ta ON ta.role_id = pr.id
    ${whereClause}
    GROUP BY pr.id
    ORDER BY pr.sort_order ASC, pr.name ASC
  `;

  return query<DBProjectRole>(sql, params);
}

/**
 * Get a project role by ID
 */
export async function getProjectRoleById(id: string): Promise<DBProjectRole | null> {
  const sql = `
    SELECT
      id, name, slug, description, color, icon,
      permissions, is_active, sort_order, created_at
    FROM project_roles
    WHERE id = $1
  `;

  const rows = await query<DBProjectRole>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get a project role by slug
 */
export async function getProjectRoleBySlug(slug: string): Promise<DBProjectRole | null> {
  const sql = `
    SELECT
      id, name, slug, description, color, icon,
      permissions, is_active, sort_order, created_at
    FROM project_roles
    WHERE slug = $1
  `;

  const rows = await query<DBProjectRole>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new project role
 */
export async function createProjectRole(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  permissions?: Record<string, boolean>;
  sort_order?: number;
}): Promise<DBProjectRole> {
  const sql = `
    INSERT INTO project_roles (name, slug, description, color, icon, permissions, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, slug, description, color, icon, permissions, is_active, sort_order, created_at
  `;

  const rows = await query<DBProjectRole>(sql, [
    data.name,
    data.slug,
    data.description || null,
    data.color || '#0ec2bc',
    data.icon || null,
    JSON.stringify(data.permissions || {}),
    data.sort_order ?? 0,
  ]);

  return rows[0];
}

/**
 * Update a project role
 */
export async function updateProjectRole(
  id: string,
  data: Partial<Pick<DBProjectRole, 'name' | 'description' | 'color' | 'icon' | 'permissions' | 'is_active' | 'sort_order'>>
): Promise<DBProjectRole | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string; isJson?: boolean }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'color', column: 'color' },
    { key: 'icon', column: 'icon' },
    { key: 'permissions', column: 'permissions', isJson: true },
    { key: 'is_active', column: 'is_active' },
    { key: 'sort_order', column: 'sort_order' },
  ];

  for (const { key, column, isJson } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(isJson ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  params.push(id);

  const sql = `
    UPDATE project_roles
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, slug, description, color, icon, permissions, is_active, sort_order, created_at
  `;

  const rows = await query<DBProjectRole>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a project role (soft delete by setting is_active = false)
 */
export async function deleteProjectRole(id: string): Promise<boolean> {
  const result = await execute(
    'UPDATE project_roles SET is_active = false WHERE id = $1',
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Check if a role has a specific permission
 */
export async function roleHasPermission(
  roleId: string,
  permission: string
): Promise<boolean> {
  const role = await getProjectRoleById(roleId);
  if (!role) return false;
  return role.permissions[permission] === true;
}

/**
 * Get roles with a specific permission
 */
export async function getRolesWithPermission(permission: string): Promise<DBProjectRole[]> {
  const sql = `
    SELECT
      id, name, slug, description, color, icon,
      permissions, is_active, sort_order, created_at
    FROM project_roles
    WHERE is_active = true AND permissions->$1 = 'true'
    ORDER BY sort_order ASC, name ASC
  `;

  return query<DBProjectRole>(sql, [permission]);
}
