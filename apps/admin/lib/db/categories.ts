/**
 * Content Categories Database Queries
 *
 * Database queries for content categories with hierarchical support.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  color: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Joined fields
  parent_name?: string;
  children_count?: number;
}

export interface CategoryTree extends DBCategory {
  children: CategoryTree[];
}

export interface CategoryFilters {
  parentId?: string | null;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all categories with filtering and child counts
 */
export async function getAllCategories(
  filters: CategoryFilters = {}
): Promise<DBCategory[]> {
  const {
    parentId,
    isActive,
    search,
    limit: requestedLimit = 100,
    offset = 0,
  } = filters;

  const limit = Math.min(requestedLimit, 500);
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Filter by parent_id (including NULL for root categories)
  if (parentId !== undefined) {
    if (parentId === null) {
      conditions.push('c.parent_id IS NULL');
    } else {
      conditions.push(`c.parent_id = $${paramIndex++}`);
      params.push(parentId);
    }
  }

  if (isActive !== undefined) {
    conditions.push(`c.is_active = $${paramIndex++}`);
    params.push(isActive);
  }

  if (search) {
    conditions.push(`(c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Use parameterized LIMIT and OFFSET
  params.push(limit);
  const limitParam = `$${paramIndex++}`;
  params.push(offset);
  const offsetParam = `$${paramIndex++}`;

  const sql = `
    SELECT
      c.id, c.name, c.slug, c.description,
      c.parent_id, c.color, c.icon,
      c.sort_order, c.is_active,
      c.created_at, c.updated_at,
      p.name as parent_name,
      (SELECT COUNT(*)::int FROM content_categories WHERE parent_id = c.id) as children_count
    FROM content_categories c
    LEFT JOIN content_categories p ON p.id = c.parent_id
    ${whereClause}
    ORDER BY c.sort_order ASC, c.name ASC
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  return query<DBCategory>(sql, params);
}

/**
 * Get a category by ID with parent information
 */
export async function getCategoryById(id: string): Promise<DBCategory | null> {
  const sql = `
    SELECT
      c.id, c.name, c.slug, c.description,
      c.parent_id, c.color, c.icon,
      c.sort_order, c.is_active,
      c.created_at, c.updated_at,
      p.name as parent_name,
      (SELECT COUNT(*)::int FROM content_categories WHERE parent_id = c.id) as children_count
    FROM content_categories c
    LEFT JOIN content_categories p ON p.id = c.parent_id
    WHERE c.id = $1
  `;

  const rows = await query<DBCategory>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<DBCategory | null> {
  const sql = `
    SELECT
      c.id, c.name, c.slug, c.description,
      c.parent_id, c.color, c.icon,
      c.sort_order, c.is_active,
      c.created_at, c.updated_at,
      p.name as parent_name,
      (SELECT COUNT(*)::int FROM content_categories WHERE parent_id = c.id) as children_count
    FROM content_categories c
    LEFT JOIN content_categories p ON p.id = c.parent_id
    WHERE c.slug = $1
  `;

  const rows = await query<DBCategory>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get hierarchical category tree structure
 *
 * This function builds a tree by first fetching all categories,
 * then recursively organizing them into parent-child relationships.
 */
export async function getCategoryTree(): Promise<CategoryTree[]> {
  // Get all active categories sorted by sort_order
  const sql = `
    SELECT
      c.id, c.name, c.slug, c.description,
      c.parent_id, c.color, c.icon,
      c.sort_order, c.is_active,
      c.created_at, c.updated_at,
      (SELECT COUNT(*)::int FROM content_categories WHERE parent_id = c.id) as children_count
    FROM content_categories c
    WHERE c.is_active = true
    ORDER BY c.sort_order ASC, c.name ASC
  `;

  const allCategories = await query<DBCategory>(sql);

  // Build tree structure
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  // First pass: create tree nodes
  allCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build parent-child relationships
  allCategories.forEach(cat => {
    const treeNode = categoryMap.get(cat.id)!;

    if (cat.parent_id === null) {
      // Root category
      rootCategories.push(treeNode);
    } else {
      // Child category - add to parent's children array
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children.push(treeNode);
      } else {
        // Parent not found or inactive - treat as root
        rootCategories.push(treeNode);
      }
    }
  });

  return rootCategories;
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}): Promise<DBCategory> {
  const sql = `
    INSERT INTO content_categories (
      name, slug, description, parent_id, color, icon, sort_order, is_active
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING *
  `;

  const rows = await query<DBCategory>(sql, [
    data.name,
    data.slug,
    data.description || null,
    data.parent_id || null,
    data.color || '#0ec2bc',
    data.icon || null,
    data.sort_order ?? 0,
    data.is_active ?? true,
  ]);

  return rows[0];
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: Partial<Omit<DBCategory, 'id' | 'created_at' | 'updated_at' | 'children_count' | 'parent_name'>>
): Promise<DBCategory | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'slug', column: 'slug' },
    { key: 'description', column: 'description' },
    { key: 'parent_id', column: 'parent_id' },
    { key: 'color', column: 'color' },
    { key: 'icon', column: 'icon' },
    { key: 'sort_order', column: 'sort_order' },
    { key: 'is_active', column: 'is_active' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const sql = `
    UPDATE content_categories
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<DBCategory>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a category
 *
 * This sets all child categories' parent_id to NULL (making them root categories)
 * as defined by the ON DELETE SET NULL constraint in the database schema.
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM content_categories WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get child categories for a parent
 */
export async function getChildCategories(parentId: string): Promise<DBCategory[]> {
  const sql = `
    SELECT
      c.id, c.name, c.slug, c.description,
      c.parent_id, c.color, c.icon,
      c.sort_order, c.is_active,
      c.created_at, c.updated_at,
      (SELECT COUNT(*)::int FROM content_categories WHERE parent_id = c.id) as children_count
    FROM content_categories c
    WHERE c.parent_id = $1
    ORDER BY c.sort_order ASC, c.name ASC
  `;

  return query<DBCategory>(sql, [parentId]);
}

/**
 * Get all root categories (categories with no parent)
 */
export async function getRootCategories(): Promise<DBCategory[]> {
  return getAllCategories({ parentId: null });
}

/**
 * Check if a slug is available (not already used by another category)
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const sql = excludeId
    ? 'SELECT COUNT(*) as count FROM content_categories WHERE slug = $1 AND id != $2'
    : 'SELECT COUNT(*) as count FROM content_categories WHERE slug = $1';

  const params = excludeId ? [slug, excludeId] : [slug];
  const rows = await query<{ count: string }>(sql, params);
  const count = parseInt(rows[0]?.count || '0', 10);

  return count === 0;
}

/**
 * Reorder categories by updating sort_order values
 */
export async function reorderCategories(
  categoryIds: string[],
  startOrder: number = 0
): Promise<void> {
  // Build a batch update query
  const updates = categoryIds.map((id, index) => ({
    id,
    sort_order: startOrder + index,
  }));

  // Execute updates in a loop (could be optimized with a transaction)
  for (const update of updates) {
    await execute(
      'UPDATE content_categories SET sort_order = $1, updated_at = NOW() WHERE id = $2',
      [update.sort_order, update.id]
    );
  }
}
