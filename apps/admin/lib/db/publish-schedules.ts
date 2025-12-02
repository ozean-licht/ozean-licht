/**
 * Publish Schedules Database Queries
 *
 * Database queries for managing content publishing schedules across multiple platforms.
 * Tracks scheduling, publishing status, and platform-specific metadata.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

/**
 * Status of a publish schedule
 */
export type PublishScheduleStatus = 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';

/**
 * Publishing platform types
 */
export type PublishPlatform = 'youtube' | 'website' | 'newsletter' | 'social' | 'podcast';

/**
 * Database row for publish schedule with joined content item info
 */
export interface DBPublishSchedule {
  id: string;
  content_item_id: string;
  platform: PublishPlatform;
  scheduled_at: string;
  timezone: string;
  status: PublishScheduleStatus;
  published_at: string | null;
  published_url: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;

  // Joined fields from content_items
  content_title?: string;
  content_type?: string;
  content_language?: string;
  content_status?: string;
  project_id?: string;
  project_title?: string;
}

/**
 * Filter options for getAllPublishSchedules
 */
export interface PublishScheduleFilters {
  contentItemId?: string;
  platform?: PublishPlatform | PublishPlatform[];
  status?: PublishScheduleStatus | PublishScheduleStatus[];
  scheduledAfter?: string; // ISO timestamp
  scheduledBefore?: string; // ISO timestamp
  projectId?: string;
  language?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Statistics for publish schedules by status and platform
 */
export interface PublishStats {
  total: number;
  byStatus: Record<PublishScheduleStatus, number>;
  byPlatform: Record<PublishPlatform, number>;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all publish schedules with filtering and pagination
 */
export async function getAllPublishSchedules(
  filters: PublishScheduleFilters = {}
): Promise<{ schedules: DBPublishSchedule[]; total: number }> {
  const {
    contentItemId,
    platform,
    status,
    scheduledAfter,
    scheduledBefore,
    projectId,
    language,
    limit: requestedLimit = 50,
    offset = 0,
    orderBy = 'scheduled_at',
    orderDirection = 'asc',
  } = filters;

  const limit = Math.min(requestedLimit, 100);
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (contentItemId) {
    conditions.push(`ps.content_item_id = $${paramIndex++}`);
    params.push(contentItemId);
  }

  if (platform) {
    if (Array.isArray(platform)) {
      const placeholders = platform.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`ps.platform IN (${placeholders})`);
      params.push(...platform);
      paramIndex += platform.length;
    } else {
      conditions.push(`ps.platform = $${paramIndex++}`);
      params.push(platform);
    }
  }

  if (status) {
    if (Array.isArray(status)) {
      const placeholders = status.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`ps.status IN (${placeholders})`);
      params.push(...status);
      paramIndex += status.length;
    } else {
      conditions.push(`ps.status = $${paramIndex++}`);
      params.push(status);
    }
  }

  if (scheduledAfter) {
    conditions.push(`ps.scheduled_at >= $${paramIndex++}`);
    params.push(scheduledAfter);
  }

  if (scheduledBefore) {
    conditions.push(`ps.scheduled_at <= $${paramIndex++}`);
    params.push(scheduledBefore);
  }

  if (projectId) {
    conditions.push(`ci.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  if (language) {
    conditions.push(`ci.language = $${paramIndex++}`);
    params.push(language);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy
  const validOrderColumns = ['scheduled_at', 'created_at', 'updated_at', 'status', 'platform', 'published_at'];
  const safeOrderBy = validOrderColumns.includes(orderBy) ? `ps.${orderBy}` : 'ps.scheduled_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `
    SELECT COUNT(*) as count
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    ${whereClause}
  `;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query - use parameterized LIMIT and OFFSET
  params.push(limit);
  const limitParam = `$${paramIndex++}`;
  params.push(offset);
  const offsetParam = `$${paramIndex++}`;

  const dataSql = `
    SELECT
      ps.id, ps.content_item_id, ps.platform, ps.scheduled_at, ps.timezone,
      ps.status, ps.published_at, ps.published_url, ps.error_message,
      ps.metadata, ps.created_by, ps.created_at, ps.updated_at,
      ci.title as content_title,
      ct.name as content_type,
      ci.language as content_language,
      ci.status as content_status,
      ci.project_id,
      p.title as project_title
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const schedules = await query<DBPublishSchedule>(dataSql, params);

  return { schedules, total };
}

/**
 * Get a single publish schedule by ID with content item information
 */
export async function getPublishScheduleById(id: string): Promise<DBPublishSchedule | null> {
  const sql = `
    SELECT
      ps.id, ps.content_item_id, ps.platform, ps.scheduled_at, ps.timezone,
      ps.status, ps.published_at, ps.published_url, ps.error_message,
      ps.metadata, ps.created_by, ps.created_at, ps.updated_at,
      ci.title as content_title,
      ct.name as content_type,
      ci.language as content_language,
      ci.status as content_status,
      ci.project_id,
      p.title as project_title
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    WHERE ps.id = $1
  `;

  const rows = await query<DBPublishSchedule>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get all publish schedules for a specific content item
 */
export async function getSchedulesByContentItem(contentItemId: string): Promise<DBPublishSchedule[]> {
  const sql = `
    SELECT
      ps.id, ps.content_item_id, ps.platform, ps.scheduled_at, ps.timezone,
      ps.status, ps.published_at, ps.published_url, ps.error_message,
      ps.metadata, ps.created_by, ps.created_at, ps.updated_at,
      ci.title as content_title,
      ct.name as content_type,
      ci.language as content_language,
      ci.status as content_status,
      ci.project_id,
      p.title as project_title
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    WHERE ps.content_item_id = $1
    ORDER BY ps.scheduled_at ASC
  `;

  return query<DBPublishSchedule>(sql, [contentItemId]);
}

/**
 * Get publish schedules for a specific platform with optional filters
 */
export async function getSchedulesByPlatform(
  platform: PublishPlatform,
  filters: Omit<PublishScheduleFilters, 'platform'> = {}
): Promise<DBPublishSchedule[]> {
  const result = await getAllPublishSchedules({
    ...filters,
    platform,
  });
  return result.schedules;
}

/**
 * Get upcoming schedules due within the next X hours
 *
 * @param hours - Number of hours to look ahead
 * @param platform - Optional platform filter
 */
export async function getUpcomingSchedules(
  hours: number = 24,
  platform?: PublishPlatform
): Promise<DBPublishSchedule[]> {
  // Validate hours is a positive integer to prevent injection
  const safeHours = Math.max(1, Math.min(Math.floor(hours), 720)); // 1 hour to 30 days max

  const conditions: string[] = [
    `ps.status = 'scheduled'`,
    `ps.scheduled_at <= NOW() + ($1 || ' hours')::INTERVAL`,
    `ps.scheduled_at > NOW()`,
  ];
  const params: unknown[] = [safeHours.toString()];
  let paramIndex = 2;

  if (platform) {
    conditions.push(`ps.platform = $${paramIndex++}`);
    params.push(platform);
  }

  const sql = `
    SELECT
      ps.id, ps.content_item_id, ps.platform, ps.scheduled_at, ps.timezone,
      ps.status, ps.published_at, ps.published_url, ps.error_message,
      ps.metadata, ps.created_by, ps.created_at, ps.updated_at,
      ci.title as content_title,
      ct.name as content_type,
      ci.language as content_language,
      ci.status as content_status,
      ci.project_id,
      p.title as project_title
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    LEFT JOIN content_types ct ON ct.id = ci.content_type_id
    LEFT JOIN projects p ON p.id = ci.project_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY ps.scheduled_at ASC
  `;

  return query<DBPublishSchedule>(sql, params);
}

/**
 * Create a new publish schedule
 */
export async function createPublishSchedule(data: {
  content_item_id: string;
  platform: PublishPlatform;
  scheduled_at: string;
  timezone?: string;
  status?: PublishScheduleStatus;
  metadata?: Record<string, unknown>;
  created_by?: string;
}): Promise<DBPublishSchedule> {
  const sql = `
    INSERT INTO publish_schedules (
      content_item_id, platform, scheduled_at, timezone, status, metadata, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [
    data.content_item_id,
    data.platform,
    data.scheduled_at,
    data.timezone || 'Europe/Vienna',
    data.status || 'scheduled',
    JSON.stringify(data.metadata || {}),
    data.created_by || null,
  ]);

  return rows[0];
}

/**
 * Update a publish schedule
 */
export async function updatePublishSchedule(
  id: string,
  data: Partial<{
    scheduled_at: string;
    timezone: string;
    status: PublishScheduleStatus;
    published_at: string;
    published_url: string;
    error_message: string;
    metadata: Record<string, unknown>;
  }>
): Promise<DBPublishSchedule | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string; isJson?: boolean }> = [
    { key: 'scheduled_at', column: 'scheduled_at' },
    { key: 'timezone', column: 'timezone' },
    { key: 'status', column: 'status' },
    { key: 'published_at', column: 'published_at' },
    { key: 'published_url', column: 'published_url' },
    { key: 'error_message', column: 'error_message' },
    { key: 'metadata', column: 'metadata', isJson: true },
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
    UPDATE publish_schedules
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a publish schedule
 */
export async function deletePublishSchedule(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM publish_schedules WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Mark a schedule as currently publishing
 */
export async function markAsPublishing(id: string): Promise<DBPublishSchedule | null> {
  const sql = `
    UPDATE publish_schedules
    SET status = 'publishing', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Mark a schedule as successfully published
 *
 * @param id - Schedule ID
 * @param publishedUrl - URL where content was published
 */
export async function markAsPublished(
  id: string,
  publishedUrl: string
): Promise<DBPublishSchedule | null> {
  const sql = `
    UPDATE publish_schedules
    SET
      status = 'published',
      published_at = NOW(),
      published_url = $2,
      error_message = NULL,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [id, publishedUrl]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Mark a schedule as failed with error message
 *
 * @param id - Schedule ID
 * @param errorMessage - Description of what went wrong
 */
export async function markAsFailed(
  id: string,
  errorMessage: string
): Promise<DBPublishSchedule | null> {
  const sql = `
    UPDATE publish_schedules
    SET
      status = 'failed',
      error_message = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [id, errorMessage]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Cancel a scheduled publish
 */
export async function cancelSchedule(id: string): Promise<DBPublishSchedule | null> {
  const sql = `
    UPDATE publish_schedules
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = $1 AND status = 'scheduled'
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Reschedule a publish to a new date/time
 *
 * @param id - Schedule ID
 * @param newScheduledAt - New scheduled timestamp
 */
export async function reschedule(
  id: string,
  newScheduledAt: string
): Promise<DBPublishSchedule | null> {
  const sql = `
    UPDATE publish_schedules
    SET
      scheduled_at = $2,
      status = 'scheduled',
      error_message = NULL,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const rows = await query<DBPublishSchedule>(sql, [id, newScheduledAt]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get publishing statistics
 *
 * @param filters - Optional filters to apply (projectId, dateRange, etc.)
 */
export async function getPublishStats(
  filters: Pick<PublishScheduleFilters, 'projectId' | 'scheduledAfter' | 'scheduledBefore'> = {}
): Promise<PublishStats> {
  const { projectId, scheduledAfter, scheduledBefore } = filters;
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (projectId) {
    conditions.push(`ci.project_id = $${paramIndex++}`);
    params.push(projectId);
  }

  if (scheduledAfter) {
    conditions.push(`ps.scheduled_at >= $${paramIndex++}`);
    params.push(scheduledAfter);
  }

  if (scheduledBefore) {
    conditions.push(`ps.scheduled_at <= $${paramIndex++}`);
    params.push(scheduledBefore);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE ps.status = 'scheduled') as scheduled,
      COUNT(*) FILTER (WHERE ps.status = 'publishing') as publishing,
      COUNT(*) FILTER (WHERE ps.status = 'published') as published,
      COUNT(*) FILTER (WHERE ps.status = 'failed') as failed,
      COUNT(*) FILTER (WHERE ps.status = 'cancelled') as cancelled,
      COUNT(*) FILTER (WHERE ps.platform = 'youtube') as youtube,
      COUNT(*) FILTER (WHERE ps.platform = 'website') as website,
      COUNT(*) FILTER (WHERE ps.platform = 'newsletter') as newsletter,
      COUNT(*) FILTER (WHERE ps.platform = 'social') as social,
      COUNT(*) FILTER (WHERE ps.platform = 'podcast') as podcast
    FROM publish_schedules ps
    LEFT JOIN content_items ci ON ci.id = ps.content_item_id
    ${whereClause}
  `;

  const rows = await query<{
    total: string;
    scheduled: string;
    publishing: string;
    published: string;
    failed: string;
    cancelled: string;
    youtube: string;
    website: string;
    newsletter: string;
    social: string;
    podcast: string;
  }>(sql, params);

  const row = rows[0];

  return {
    total: parseInt(row?.total || '0', 10),
    byStatus: {
      scheduled: parseInt(row?.scheduled || '0', 10),
      publishing: parseInt(row?.publishing || '0', 10),
      published: parseInt(row?.published || '0', 10),
      failed: parseInt(row?.failed || '0', 10),
      cancelled: parseInt(row?.cancelled || '0', 10),
    },
    byPlatform: {
      youtube: parseInt(row?.youtube || '0', 10),
      website: parseInt(row?.website || '0', 10),
      newsletter: parseInt(row?.newsletter || '0', 10),
      social: parseInt(row?.social || '0', 10),
      podcast: parseInt(row?.podcast || '0', 10),
    },
  };
}
