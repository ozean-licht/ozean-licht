/**
 * Content Items Database Queries
 *
 * Database queries for content items (the actual deliverables linked to tasks).
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface DBContentItem {
  id: string;
  task_id: string | null;
  project_id: string | null;
  content_type_id: string;

  // Content details
  title: string;
  description: string | null;
  script_content: string | null;

  // Translation linking
  source_content_id: string | null;
  language: string;

  // Status & scheduling
  status: 'draft' | 'in_production' | 'ready_for_review' | 'approved' | 'scheduled' | 'published';
  workflow_status_id: string | null;
  scheduled_publish_at: string | null;
  published_at: string | null;

  // Publishing targets
  platforms: string[];
  platform_urls: Record<string, string>;

  // Metadata
  duration_seconds: number | null;
  word_count: number | null;
  thumbnail_url: string | null;

  // Categorization
  category_id: string | null;
  tags: string[];

  created_by: string | null;
  created_at: string;
  updated_at: string;

  // Joined fields
  content_type_name?: string;
  content_type_icon?: string;
  project_title?: string;
  task_name?: string;
  workflow_status_name?: string;
  workflow_status_color?: string;
  translations_count?: number;
}

export interface ContentItemFilters {
  projectId?: string;
  taskId?: string;
  contentTypeId?: string;
  status?: string | string[];
  language?: string;
  platform?: string;
  search?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ContentItemListResult {
  items: DBContentItem[];
  total: number;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all content items with filtering and pagination
 */
export async function getAllContentItems(
  filters: ContentItemFilters = {}
): Promise<ContentItemListResult> {
  const {
    projectId,
    taskId,
    contentTypeId,
    status,
    language,
    platform,
    search,
    isPublished,
    limit: requestedLimit = 50,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = filters;

  const limit = Math.min(requestedLimit, 100);
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (projectId) {
    conditions.push(`ci.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  if (taskId) {
    conditions.push(`ci.task_id = $${paramIndex++}`);
    params.push(taskId);
  }

  if (contentTypeId) {
    conditions.push(`ci.content_type_id = $${paramIndex++}`);
    params.push(contentTypeId);
  }

  if (status) {
    if (Array.isArray(status)) {
      const placeholders = status.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`ci.status IN (${placeholders})`);
      params.push(...status);
      paramIndex += status.length;
    } else {
      conditions.push(`ci.status = $${paramIndex++}`);
      params.push(status);
    }
  }

  if (language) {
    conditions.push(`ci.language = $${paramIndex++}`);
    params.push(language);
  }

  if (platform) {
    conditions.push(`$${paramIndex++} = ANY(ci.platforms)`);
    params.push(platform);
  }

  if (search) {
    conditions.push(`(ci.title ILIKE $${paramIndex} OR ci.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (isPublished !== undefined) {
    if (isPublished) {
      conditions.push(`ci.status = 'published' AND ci.published_at IS NOT NULL`);
    } else {
      conditions.push(`ci.status != 'published'`);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy
  const validOrderColumns = ['created_at', 'updated_at', 'title', 'status', 'scheduled_publish_at', 'published_at'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? `ci.${orderBy}` : 'ci.created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM content_items ci ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query - use parameterized LIMIT and OFFSET
  params.push(limit);
  const limitParam = `$${paramIndex++}`;
  params.push(offset);
  const offsetParam = `$${paramIndex++}`;

  const dataSql = `
    SELECT
      ci.id, ci.task_id, ci.project_id, ci.content_type_id,
      ci.title, ci.description, ci.script_content,
      ci.source_content_id, ci.language,
      ci.status, ci.workflow_status_id, ci.scheduled_publish_at, ci.published_at,
      ci.platforms, ci.platform_urls,
      ci.duration_seconds, ci.word_count, ci.thumbnail_url,
      ci.category_id, ci.tags,
      ci.created_by, ci.created_at, ci.updated_at,
      ct.name as content_type_name,
      ct.icon as content_type_icon,
      p.title as project_title,
      t.name as task_name,
      ws.name as workflow_status_name,
      ws.color as workflow_status_color,
      (SELECT COUNT(*)::int FROM content_items WHERE source_content_id = ci.id) as translations_count
    FROM content_items ci
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    LEFT JOIN tasks t ON t.id = ci.task_id
    LEFT JOIN workflow_statuses ws ON ws.id = ci.workflow_status_id
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const items = await query<DBContentItem>(dataSql, params);

  return { items, total };
}

/**
 * Get a content item by ID
 */
export async function getContentItemById(id: string): Promise<DBContentItem | null> {
  const sql = `
    SELECT
      ci.id, ci.task_id, ci.project_id, ci.content_type_id,
      ci.title, ci.description, ci.script_content,
      ci.source_content_id, ci.language,
      ci.status, ci.workflow_status_id, ci.scheduled_publish_at, ci.published_at,
      ci.platforms, ci.platform_urls,
      ci.duration_seconds, ci.word_count, ci.thumbnail_url,
      ci.category_id, ci.tags,
      ci.created_by, ci.created_at, ci.updated_at,
      ct.name as content_type_name,
      ct.icon as content_type_icon,
      p.title as project_title,
      t.name as task_name,
      ws.name as workflow_status_name,
      ws.color as workflow_status_color,
      (SELECT COUNT(*)::int FROM content_items WHERE source_content_id = ci.id) as translations_count
    FROM content_items ci
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    LEFT JOIN tasks t ON t.id = ci.task_id
    LEFT JOIN workflow_statuses ws ON ws.id = ci.workflow_status_id
    WHERE ci.id = $1
  `;

  const rows = await query<DBContentItem>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get translations for a content item
 */
export async function getContentItemTranslations(sourceId: string): Promise<DBContentItem[]> {
  const sql = `
    SELECT
      ci.id, ci.task_id, ci.project_id, ci.content_type_id,
      ci.title, ci.description, ci.script_content,
      ci.source_content_id, ci.language,
      ci.status, ci.workflow_status_id, ci.scheduled_publish_at, ci.published_at,
      ci.platforms, ci.platform_urls,
      ci.duration_seconds, ci.word_count, ci.thumbnail_url,
      ci.category_id, ci.tags,
      ci.created_by, ci.created_at, ci.updated_at
    FROM content_items ci
    WHERE ci.source_content_id = $1
    ORDER BY ci.language ASC
  `;

  return query<DBContentItem>(sql, [sourceId]);
}

/**
 * Create a new content item
 */
export async function createContentItem(data: {
  content_type_id: string;
  title: string;
  description?: string;
  script_content?: string;
  project_id?: string;
  task_id?: string;
  source_content_id?: string;
  language?: string;
  status?: string;
  workflow_status_id?: string;
  scheduled_publish_at?: string;
  platforms?: string[];
  platform_urls?: Record<string, string>;
  duration_seconds?: number;
  word_count?: number;
  thumbnail_url?: string;
  category_id?: string;
  tags?: string[];
  created_by?: string;
}): Promise<DBContentItem> {
  const sql = `
    INSERT INTO content_items (
      content_type_id, title, description, script_content,
      project_id, task_id, source_content_id, language,
      status, workflow_status_id, scheduled_publish_at,
      platforms, platform_urls,
      duration_seconds, word_count, thumbnail_url,
      category_id, tags, created_by
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    )
    RETURNING *
  `;

  const rows = await query<DBContentItem>(sql, [
    data.content_type_id,
    data.title,
    data.description || null,
    data.script_content || null,
    data.project_id || null,
    data.task_id || null,
    data.source_content_id || null,
    data.language || 'de',
    data.status || 'draft',
    data.workflow_status_id || null,
    data.scheduled_publish_at || null,
    data.platforms || [],
    JSON.stringify(data.platform_urls || {}),
    data.duration_seconds || null,
    data.word_count || null,
    data.thumbnail_url || null,
    data.category_id || null,
    data.tags || [],
    data.created_by || null,
  ]);

  return rows[0];
}

/**
 * Update a content item
 */
export async function updateContentItem(
  id: string,
  data: Partial<Omit<DBContentItem, 'id' | 'created_at' | 'updated_at'>>
): Promise<DBContentItem | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string; isJson?: boolean }> = [
    { key: 'title', column: 'title' },
    { key: 'description', column: 'description' },
    { key: 'script_content', column: 'script_content' },
    { key: 'task_id', column: 'task_id' },
    { key: 'project_id', column: 'project_id' },
    { key: 'source_content_id', column: 'source_content_id' },
    { key: 'language', column: 'language' },
    { key: 'status', column: 'status' },
    { key: 'workflow_status_id', column: 'workflow_status_id' },
    { key: 'scheduled_publish_at', column: 'scheduled_publish_at' },
    { key: 'published_at', column: 'published_at' },
    { key: 'platforms', column: 'platforms' },
    { key: 'platform_urls', column: 'platform_urls', isJson: true },
    { key: 'duration_seconds', column: 'duration_seconds' },
    { key: 'word_count', column: 'word_count' },
    { key: 'thumbnail_url', column: 'thumbnail_url' },
    { key: 'category_id', column: 'category_id' },
    { key: 'tags', column: 'tags' },
  ];

  for (const { key, column, isJson } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(isJson ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const sql = `
    UPDATE content_items
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<DBContentItem>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a content item
 */
export async function deleteContentItem(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM content_items WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Update content item status
 */
export async function updateContentItemStatus(
  id: string,
  status: string,
  workflowStatusId?: string
): Promise<DBContentItem | null> {
  const updates: Partial<DBContentItem> = { status: status as DBContentItem['status'] };

  if (workflowStatusId) {
    updates.workflow_status_id = workflowStatusId;
  }

  // Auto-set published_at when status is 'published'
  if (status === 'published') {
    const sql = `
      UPDATE content_items
      SET status = $1, workflow_status_id = $2, published_at = NOW(), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const rows = await query<DBContentItem>(sql, [status, workflowStatusId || null, id]);
    return rows.length > 0 ? rows[0] : null;
  }

  return updateContentItem(id, updates);
}

/**
 * Get content items by project
 */
export async function getContentItemsByProject(projectId: string): Promise<DBContentItem[]> {
  const result = await getAllContentItems({ projectId, limit: 100 });
  return result.items;
}

/**
 * Get content items statistics
 */
export async function getContentItemStats(): Promise<{
  total: number;
  draft: number;
  in_production: number;
  ready_for_review: number;
  approved: number;
  scheduled: number;
  published: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'draft') as draft,
      COUNT(*) FILTER (WHERE status = 'in_production') as in_production,
      COUNT(*) FILTER (WHERE status = 'ready_for_review') as ready_for_review,
      COUNT(*) FILTER (WHERE status = 'approved') as approved,
      COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
      COUNT(*) FILTER (WHERE status = 'published') as published
    FROM content_items
  `;

  const rows = await query<{
    total: string;
    draft: string;
    in_production: string;
    ready_for_review: string;
    approved: string;
    scheduled: string;
    published: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    draft: parseInt(rows[0]?.draft || '0', 10),
    in_production: parseInt(rows[0]?.in_production || '0', 10),
    ready_for_review: parseInt(rows[0]?.ready_for_review || '0', 10),
    approved: parseInt(rows[0]?.approved || '0', 10),
    scheduled: parseInt(rows[0]?.scheduled || '0', 10),
    published: parseInt(rows[0]?.published || '0', 10),
  };
}
