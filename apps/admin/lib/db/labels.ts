/**
 * Labels Database Queries
 *
 * Database queries for label management and entity-label relationships.
 * Labels are flexible tags that can be attached to projects, tasks, and content items.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute, transaction, PoolClient } from './index';

// ============================================
// TYPES
// ============================================

/**
 * Entity types that can have labels attached
 */
export type EntityType = 'project' | 'task' | 'content_item';

/**
 * Database row type for labels table
 */
export interface DBLabel {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  entity_type: 'all' | 'project' | 'task' | 'content';
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Database row type for entity_labels junction table
 */
export interface DBEntityLabel {
  id: string;
  entity_id: string;
  entity_type: EntityType;
  label_id: string;
  created_at: string;
}

/**
 * Filter options for getAllLabels query
 */
export interface LabelFilters {
  entityType?: 'all' | 'project' | 'task' | 'content';
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'name' | 'usage_count' | 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Result type for paginated label queries
 */
export interface LabelListResult {
  labels: DBLabel[];
  total: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a URL-safe slug from a name
 * @param name - The label name
 * @returns Lowercase slug with hyphens
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

// ============================================
// LABEL QUERIES
// ============================================

/**
 * Get all labels with optional filtering and pagination
 *
 * @param filters - Filter options for querying labels
 * @returns Promise resolving to paginated list of labels
 *
 * @example
 * ```ts
 * // Get all active project labels
 * const { labels, total } = await getAllLabels({
 *   entityType: 'project',
 *   isActive: true
 * });
 * ```
 */
export async function getAllLabels(
  filters: LabelFilters = {}
): Promise<LabelListResult> {
  const {
    entityType,
    isActive,
    search,
    limit: requestedLimit = 100,
    offset = 0,
    orderBy = 'name',
    orderDirection = 'asc',
  } = filters;

  // Cap limit at 200 for labels (they're typically fewer than other entities)
  const limit = Math.min(requestedLimit, 200);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Entity type filter
  if (entityType) {
    // Show labels that apply to specific type OR to 'all' types
    conditions.push(`(entity_type = $${paramIndex} OR entity_type = 'all')`);
    params.push(entityType);
    paramIndex++;
  }

  // Active filter
  if (isActive !== undefined) {
    conditions.push(`is_active = $${paramIndex++}`);
    params.push(isActive);
  }

  // Search filter (name or description)
  if (search) {
    conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = ['name', 'usage_count', 'created_at', 'updated_at'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'name';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM labels ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
    FROM labels
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const labels = await query<DBLabel>(dataSql, params);

  return { labels, total };
}

/**
 * Get a single label by ID
 *
 * @param id - UUID of the label
 * @returns Promise resolving to label or null if not found
 */
export async function getLabelById(id: string): Promise<DBLabel | null> {
  const sql = `
    SELECT
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
    FROM labels
    WHERE id = $1
  `;

  const rows = await query<DBLabel>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get a label by its unique slug
 *
 * @param slug - URL-safe slug identifier
 * @returns Promise resolving to label or null if not found
 */
export async function getLabelBySlug(slug: string): Promise<DBLabel | null> {
  const sql = `
    SELECT
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
    FROM labels
    WHERE slug = $1
  `;

  const rows = await query<DBLabel>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new label
 *
 * @param data - Label data (slug is auto-generated from name if not provided)
 * @returns Promise resolving to the created label
 *
 * @example
 * ```ts
 * const label = await createLabel({
 *   name: 'High Priority',
 *   color: '#ff0000',
 *   entity_type: 'task'
 * });
 * ```
 */
export async function createLabel(data: {
  name: string;
  slug?: string;
  color?: string;
  description?: string;
  entity_type?: 'all' | 'project' | 'task' | 'content';
  is_active?: boolean;
}): Promise<DBLabel> {
  // Generate slug from name if not provided
  const slug = data.slug || generateSlug(data.name);

  const sql = `
    INSERT INTO labels (
      name, slug, color, description, entity_type, is_active
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
  `;

  const params = [
    data.name,
    slug,
    data.color || '#0ec2bc', // Default to Ozean Licht primary color
    data.description || null,
    data.entity_type || 'all',
    data.is_active ?? true,
  ];

  const rows = await query<DBLabel>(sql, params);
  return rows[0];
}

/**
 * Update an existing label
 *
 * @param id - UUID of the label to update
 * @param data - Partial label data to update
 * @returns Promise resolving to updated label or null if not found
 */
export async function updateLabel(
  id: string,
  data: Partial<Omit<DBLabel, 'id' | 'created_at' | 'updated_at' | 'usage_count'>>
): Promise<DBLabel | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof typeof data; column: string }> = [
    { key: 'name', column: 'name' },
    { key: 'slug', column: 'slug' },
    { key: 'color', column: 'color' },
    { key: 'description', column: 'description' },
    { key: 'entity_type', column: 'entity_type' },
    { key: 'is_active', column: 'is_active' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) {
    // No fields to update, return current label
    return getLabelById(id);
  }

  // Always update updated_at timestamp
  setClauses.push('updated_at = NOW()');

  params.push(id);
  const sql = `
    UPDATE labels
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
  `;

  const rows = await query<DBLabel>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a label by ID
 * Cascade deletes all entity_labels relationships via database constraint
 *
 * @param id - UUID of the label to delete
 * @returns Promise resolving to true if deleted, false if not found
 */
export async function deleteLabel(id: string): Promise<boolean> {
  const sql = `DELETE FROM labels WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

// ============================================
// ENTITY-LABEL RELATIONSHIP QUERIES
// ============================================

/**
 * Get all labels attached to a specific entity
 *
 * @param entityId - UUID of the entity (project, task, or content_item)
 * @param entityType - Type of the entity
 * @returns Promise resolving to array of labels
 *
 * @example
 * ```ts
 * const labels = await getLabelsForEntity(projectId, 'project');
 * ```
 */
export async function getLabelsForEntity(
  entityId: string,
  entityType: EntityType
): Promise<DBLabel[]> {
  const sql = `
    SELECT
      l.id, l.name, l.slug, l.color, l.description, l.entity_type,
      l.is_active, l.usage_count, l.created_at, l.updated_at
    FROM labels l
    INNER JOIN entity_labels el ON el.label_id = l.id
    WHERE el.entity_id = $1 AND el.entity_type = $2
    ORDER BY l.name ASC
  `;

  return query<DBLabel>(sql, [entityId, entityType]);
}

/**
 * Attach a label to an entity
 * Increments the label's usage_count automatically
 *
 * @param entityId - UUID of the entity
 * @param entityType - Type of the entity
 * @param labelId - UUID of the label to attach
 * @returns Promise resolving to the created entity_label relationship
 *
 * @example
 * ```ts
 * await addLabelToEntity(taskId, 'task', labelId);
 * ```
 */
export async function addLabelToEntity(
  entityId: string,
  entityType: EntityType,
  labelId: string
): Promise<DBEntityLabel> {
  // Use a transaction to ensure both insert and usage count increment succeed
  return transaction(async (client: PoolClient) => {
    // Insert entity-label relationship (ON CONFLICT DO NOTHING handles duplicates)
    const insertSql = `
      INSERT INTO entity_labels (entity_id, entity_type, label_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (entity_id, entity_type, label_id) DO NOTHING
      RETURNING id, entity_id, entity_type, label_id, created_at
    `;

    const insertResult = await client.query(insertSql, [entityId, entityType, labelId]);

    // Only increment usage count if a new row was inserted
    if (insertResult.rows.length > 0) {
      await client.query(
        'UPDATE labels SET usage_count = usage_count + 1 WHERE id = $1',
        [labelId]
      );
    }

    // Return existing or new relationship
    if (insertResult.rows.length > 0) {
      return insertResult.rows[0] as DBEntityLabel;
    }

    // If no row was inserted (duplicate), fetch the existing relationship
    const existingSql = `
      SELECT id, entity_id, entity_type, label_id, created_at
      FROM entity_labels
      WHERE entity_id = $1 AND entity_type = $2 AND label_id = $3
    `;
    const existingResult = await client.query(existingSql, [entityId, entityType, labelId]);
    return existingResult.rows[0] as DBEntityLabel;
  });
}

/**
 * Remove a label from an entity
 * Decrements the label's usage_count automatically
 *
 * @param entityId - UUID of the entity
 * @param entityType - Type of the entity
 * @param labelId - UUID of the label to remove
 * @returns Promise resolving to true if removed, false if relationship didn't exist
 */
export async function removeLabelFromEntity(
  entityId: string,
  entityType: EntityType,
  labelId: string
): Promise<boolean> {
  // Use a transaction to ensure both delete and usage count decrement succeed
  return transaction(async (client: PoolClient) => {
    // Delete entity-label relationship
    const deleteSql = `
      DELETE FROM entity_labels
      WHERE entity_id = $1 AND entity_type = $2 AND label_id = $3
    `;

    const deleteResult = await client.query(deleteSql, [entityId, entityType, labelId]);

    // Only decrement usage count if a row was deleted
    if (deleteResult.rowCount && deleteResult.rowCount > 0) {
      await client.query(
        'UPDATE labels SET usage_count = GREATEST(0, usage_count - 1) WHERE id = $1',
        [labelId]
      );
      return true;
    }

    return false;
  });
}

/**
 * Replace all labels for an entity with a new set of labels
 * Efficiently syncs labels by removing old ones and adding new ones
 *
 * @param entityId - UUID of the entity
 * @param entityType - Type of the entity
 * @param labelIds - Array of label UUIDs to set (empty array removes all labels)
 * @returns Promise resolving to the updated list of labels
 *
 * @example
 * ```ts
 * // Replace all task labels with new set
 * await syncEntityLabels(taskId, 'task', [label1Id, label2Id, label3Id]);
 * ```
 */
export async function syncEntityLabels(
  entityId: string,
  entityType: EntityType,
  labelIds: string[]
): Promise<DBLabel[]> {
  return transaction(async (client: PoolClient) => {
    // Get current labels
    const currentSql = `
      SELECT label_id
      FROM entity_labels
      WHERE entity_id = $1 AND entity_type = $2
    `;
    const currentResult = await client.query(currentSql, [entityId, entityType]);
    const currentLabelIds = currentResult.rows.map((row: { label_id: string }) => row.label_id);

    // Determine what to add and what to remove
    const toAdd = labelIds.filter(id => !currentLabelIds.includes(id));
    const toRemove = currentLabelIds.filter(id => !labelIds.includes(id));

    // Remove old labels
    if (toRemove.length > 0) {
      const removePlaceholders = toRemove.map((_, i) => `$${i + 3}`).join(', ');
      const removeSql = `
        DELETE FROM entity_labels
        WHERE entity_id = $1 AND entity_type = $2 AND label_id IN (${removePlaceholders})
      `;
      await client.query(removeSql, [entityId, entityType, ...toRemove]);

      // Decrement usage counts for removed labels
      const decrementSql = `
        UPDATE labels
        SET usage_count = GREATEST(0, usage_count - 1)
        WHERE id = ANY($1::uuid[])
      `;
      await client.query(decrementSql, [toRemove]);
    }

    // Add new labels
    if (toAdd.length > 0) {
      // Build bulk insert values
      const insertValues: string[] = [];
      const insertParams: unknown[] = [entityId, entityType];
      let paramIndex = 3;

      for (const labelId of toAdd) {
        insertValues.push(`($1, $2, $${paramIndex++})`);
        insertParams.push(labelId);
      }

      const insertSql = `
        INSERT INTO entity_labels (entity_id, entity_type, label_id)
        VALUES ${insertValues.join(', ')}
        ON CONFLICT (entity_id, entity_type, label_id) DO NOTHING
      `;
      await client.query(insertSql, insertParams);

      // Increment usage counts for added labels
      const incrementSql = `
        UPDATE labels
        SET usage_count = usage_count + 1
        WHERE id = ANY($1::uuid[])
      `;
      await client.query(incrementSql, [toAdd]);
    }

    // Fetch and return the final set of labels
    if (labelIds.length === 0) {
      return [];
    }

    const labelPlaceholders = labelIds.map((_, i) => `$${i + 1}`).join(', ');
    const finalSql = `
      SELECT
        id, name, slug, color, description, entity_type,
        is_active, usage_count, created_at, updated_at
      FROM labels
      WHERE id IN (${labelPlaceholders})
      ORDER BY name ASC
    `;
    const finalResult = await client.query(finalSql, labelIds);
    return finalResult.rows as DBLabel[];
  });
}

/**
 * Manually increment a label's usage count
 * This is typically handled automatically by addLabelToEntity, but provided for edge cases
 *
 * @param labelId - UUID of the label
 * @returns Promise resolving to updated label or null if not found
 */
export async function incrementLabelUsage(labelId: string): Promise<DBLabel | null> {
  const sql = `
    UPDATE labels
    SET usage_count = usage_count + 1, updated_at = NOW()
    WHERE id = $1
    RETURNING
      id, name, slug, color, description, entity_type,
      is_active, usage_count, created_at, updated_at
  `;

  const rows = await query<DBLabel>(sql, [labelId]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get label statistics
 * Provides counts of labels by entity type and activity status
 *
 * @returns Promise resolving to statistics object
 */
export async function getLabelStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  byEntityType: {
    all: number;
    project: number;
    task: number;
    content: number;
  };
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active,
      COUNT(*) FILTER (WHERE is_active = false) as inactive,
      COUNT(*) FILTER (WHERE entity_type = 'all') as entity_all,
      COUNT(*) FILTER (WHERE entity_type = 'project') as entity_project,
      COUNT(*) FILTER (WHERE entity_type = 'task') as entity_task,
      COUNT(*) FILTER (WHERE entity_type = 'content') as entity_content
    FROM labels
  `;

  const rows = await query<{
    total: string;
    active: string;
    inactive: string;
    entity_all: string;
    entity_project: string;
    entity_task: string;
    entity_content: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    active: parseInt(rows[0]?.active || '0', 10),
    inactive: parseInt(rows[0]?.inactive || '0', 10),
    byEntityType: {
      all: parseInt(rows[0]?.entity_all || '0', 10),
      project: parseInt(rows[0]?.entity_project || '0', 10),
      task: parseInt(rows[0]?.entity_task || '0', 10),
      content: parseInt(rows[0]?.entity_content || '0', 10),
    },
  };
}
