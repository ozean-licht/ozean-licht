/**
 * Videos Database Queries
 *
 * Direct PostgreSQL queries for video management.
 * No MCP Gateway dependency.
 */

import { query, execute, PoolClient } from './index';
import {
  Video,
  CreateVideoInput,
  UpdateVideoInput,
  VideoListFilters,
  VideoPlatformRecord,
} from '@/types/video';

// Database row type (snake_case)
interface VideoRow {
  id: string;
  airtable_id: string | null;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: string;
  entity_scope: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
  // VMS extensions
  tags: string[];
  master_file_url: string | null;
  visibility: string;
  course_id: string | null;
  module_id: string | null;
  sort_order: number;
  published_at: string | null;
  migration_status: string;
  pipeline_stage: string;
}

/**
 * Map database row to Video type
 */
function mapVideo(row: VideoRow): Video {
  return {
    id: row.id,
    airtableId: row.airtable_id || undefined,
    title: row.title,
    description: row.description || undefined,
    videoUrl: row.video_url || undefined,
    thumbnailUrl: row.thumbnail_url || undefined,
    durationSeconds: row.duration_seconds || undefined,
    status: row.status as Video['status'],
    entityScope: row.entity_scope as Video['entityScope'],
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: row.metadata || undefined,
    // VMS extensions
    tags: row.tags || [],
    masterFileUrl: row.master_file_url || undefined,
    visibility: row.visibility as Video['visibility'],
    courseId: row.course_id || undefined,
    moduleId: row.module_id || undefined,
    sortOrder: row.sort_order || 0,
    publishedAt: row.published_at || undefined,
    migrationStatus: row.migration_status as Video['migrationStatus'],
    pipelineStage: row.pipeline_stage as Video['pipelineStage'],
  };
}

export interface ListVideosOptions {
  limit?: number;
  offset?: number;
  status?: string;
  entityScope?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ListVideosResult {
  videos: Video[];
  total: number;
}

/**
 * List videos with filtering and pagination
 */
export async function listVideos(options: ListVideosOptions = {}): Promise<ListVideosResult> {
  const {
    limit = 100,
    offset = 0,
    status,
    entityScope,
    search,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options;

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (entityScope) {
    conditions.push(`entity_scope = $${paramIndex++}`);
    params.push(entityScope);
  }

  if (search) {
    conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = Object.freeze(['created_at', 'updated_at', 'title', 'duration_seconds', 'status']);

  // Additional validation: check for special characters
  if (!/^[a-z_]+$/.test(orderBy)) {
    throw new Error(`Invalid orderBy column: ${orderBy}`);
  }

  const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM videos ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
    FROM videos
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await query<VideoRow>(dataSql, params);

  return {
    videos: rows.map(mapVideo),
    total,
  };
}

/**
 * Get a single video by ID
 */
export async function getVideoById(id: string): Promise<Video | null> {
  const sql = `
    SELECT
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
    FROM videos
    WHERE id = $1
  `;

  const rows = await query<VideoRow>(sql, [id]);
  return rows.length > 0 ? mapVideo(rows[0]) : null;
}

/**
 * Get multiple videos by IDs in a single query
 * Optimized to avoid N+1 query pattern
 */
export async function getVideosByIds(ids: string[]): Promise<Video[]> {
  if (ids.length === 0) {
    return [];
  }

  const sql = `
    SELECT
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
    FROM videos
    WHERE id = ANY($1)
    ORDER BY array_position($1, id)
  `;

  const rows = await query<VideoRow>(sql, [ids]);
  return rows.map(mapVideo);
}

/**
 * Get video statistics
 */
export async function getVideoStats() {
  const sql = `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'published') as published,
      COUNT(*) FILTER (WHERE status = 'draft') as draft,
      COUNT(*) FILTER (WHERE status = 'archived') as archived
    FROM videos
  `;

  const rows = await query<{
    total: string;
    published: string;
    draft: string;
    archived: string;
  }>(sql);

  return {
    total: parseInt(rows[0]?.total || '0', 10),
    published: parseInt(rows[0]?.published || '0', 10),
    draft: parseInt(rows[0]?.draft || '0', 10),
    archived: parseInt(rows[0]?.archived || '0', 10),
  };
}

/**
 * Create a new video
 */
export async function createVideo(input: CreateVideoInput): Promise<Video> {
  const sql = `
    INSERT INTO videos (
      title,
      description,
      video_url,
      thumbnail_url,
      duration_seconds,
      status,
      entity_scope,
      tags,
      master_file_url,
      visibility,
      course_id,
      module_id,
      sort_order,
      pipeline_stage,
      metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
  `;

  const params = [
    input.title,
    input.description || null,
    input.videoUrl || null,
    input.thumbnailUrl || null,
    input.durationSeconds || null,
    input.status || 'draft',
    input.entityScope || null,
    input.tags || [],
    input.masterFileUrl || null,
    input.visibility || 'private',
    input.courseId || null,
    input.moduleId || null,
    input.sortOrder || 0,
    input.pipelineStage || 'draft',
    input.metadata || {},
  ];

  const rows = await query<VideoRow>(sql, params);
  return mapVideo(rows[0]);
}

/**
 * Update an existing video
 */
export async function updateVideo(id: string, input: UpdateVideoInput): Promise<Video | null> {
  // Build dynamic SET clause based on provided fields
  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    params.push(input.title);
  }
  if (input.description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    params.push(input.description);
  }
  if (input.videoUrl !== undefined) {
    updates.push(`video_url = $${paramIndex++}`);
    params.push(input.videoUrl);
  }
  if (input.thumbnailUrl !== undefined) {
    updates.push(`thumbnail_url = $${paramIndex++}`);
    params.push(input.thumbnailUrl);
  }
  if (input.durationSeconds !== undefined) {
    updates.push(`duration_seconds = $${paramIndex++}`);
    params.push(input.durationSeconds);
  }
  if (input.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    params.push(input.status);
  }
  if (input.entityScope !== undefined) {
    updates.push(`entity_scope = $${paramIndex++}`);
    params.push(input.entityScope);
  }
  if (input.tags !== undefined) {
    updates.push(`tags = $${paramIndex++}`);
    params.push(input.tags);
  }
  if (input.masterFileUrl !== undefined) {
    updates.push(`master_file_url = $${paramIndex++}`);
    params.push(input.masterFileUrl);
  }
  if (input.visibility !== undefined) {
    updates.push(`visibility = $${paramIndex++}`);
    params.push(input.visibility);
  }
  if (input.courseId !== undefined) {
    updates.push(`course_id = $${paramIndex++}`);
    params.push(input.courseId);
  }
  if (input.moduleId !== undefined) {
    updates.push(`module_id = $${paramIndex++}`);
    params.push(input.moduleId);
  }
  if (input.sortOrder !== undefined) {
    updates.push(`sort_order = $${paramIndex++}`);
    params.push(input.sortOrder);
  }
  if (input.publishedAt !== undefined) {
    updates.push(`published_at = $${paramIndex++}`);
    params.push(input.publishedAt);
  }
  if (input.migrationStatus !== undefined) {
    updates.push(`migration_status = $${paramIndex++}`);
    params.push(input.migrationStatus);
  }
  if (input.pipelineStage !== undefined) {
    updates.push(`pipeline_stage = $${paramIndex++}`);
    params.push(input.pipelineStage);
  }
  if (input.metadata !== undefined) {
    updates.push(`metadata = $${paramIndex++}`);
    params.push(input.metadata);
  }

  // If no updates provided, return existing video
  if (updates.length === 0) {
    return getVideoById(id);
  }

  // Add video ID as final parameter
  params.push(id);

  const sql = `
    UPDATE videos
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
  `;

  const rows = await query<VideoRow>(sql, params);
  return rows.length > 0 ? mapVideo(rows[0]) : null;
}

/**
 * Soft delete a video by setting status to 'archived'
 */
export async function deleteVideo(id: string): Promise<boolean> {
  const sql = `
    UPDATE videos
    SET status = 'archived'
    WHERE id = $1
    RETURNING id
  `;

  const result = await execute(sql, [id]);
  return (result.rowCount || 0) > 0;
}

/**
 * Get a video with its platform distribution records
 * Uses a single JOIN query to avoid N+1 query problem
 */
export async function getVideoWithPlatforms(id: string): Promise<Video | null> {
  const sql = `
    SELECT
      v.id, v.airtable_id, v.title, v.description,
      v.video_url, v.thumbnail_url, v.duration_seconds,
      v.status, v.entity_scope, v.created_by,
      v.created_at, v.updated_at, v.metadata,
      v.tags, v.master_file_url, v.visibility,
      v.course_id, v.module_id, v.sort_order,
      v.published_at, v.migration_status, v.pipeline_stage,
      COALESCE(
        json_agg(
          json_build_object(
            'id', vp.id,
            'videoId', vp.video_id,
            'platform', vp.platform,
            'externalId', vp.external_id,
            'externalUrl', vp.external_url,
            'embedUrl', vp.embed_url,
            'status', vp.status,
            'privacyLevel', vp.privacy_level,
            'syncedAt', vp.synced_at,
            'metadata', vp.metadata,
            'createdAt', vp.created_at,
            'updatedAt', vp.updated_at
          ) ORDER BY vp.platform
        ) FILTER (WHERE vp.id IS NOT NULL),
        '[]'
      ) as platforms
    FROM videos v
    LEFT JOIN video_platforms vp ON v.id = vp.video_id
    WHERE v.id = $1
    GROUP BY v.id
  `;

  interface VideoWithPlatformsRow extends VideoRow {
    platforms: VideoPlatformRecord[];
  }

  const rows = await query<VideoWithPlatformsRow>(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const video = mapVideo(row);

  return {
    ...video,
    platforms: row.platforms,
  };
}

/**
 * Bulk update multiple videos
 * Supports both direct execution and transaction-based execution
 */
export async function bulkUpdateVideos(
  ids: string[],
  updates: Partial<UpdateVideoInput>,
  client?: PoolClient
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  // Build dynamic SET clause based on provided fields
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (updates.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    params.push(updates.status);
  }
  if (updates.visibility !== undefined) {
    setClauses.push(`visibility = $${paramIndex++}`);
    params.push(updates.visibility);
  }
  if (updates.tags !== undefined) {
    setClauses.push(`tags = $${paramIndex++}`);
    params.push(updates.tags);
  }
  if (updates.migrationStatus !== undefined) {
    setClauses.push(`migration_status = $${paramIndex++}`);
    params.push(updates.migrationStatus);
  }
  if (updates.pipelineStage !== undefined) {
    setClauses.push(`pipeline_stage = $${paramIndex++}`);
    params.push(updates.pipelineStage);
  }
  if (updates.courseId !== undefined) {
    setClauses.push(`course_id = $${paramIndex++}`);
    params.push(updates.courseId);
  }
  if (updates.moduleId !== undefined) {
    setClauses.push(`module_id = $${paramIndex++}`);
    params.push(updates.moduleId);
  }

  // If no updates provided, return 0
  if (setClauses.length === 0) {
    return 0;
  }

  // Add IDs array as final parameter
  params.push(ids);

  const sql = `
    UPDATE videos
    SET ${setClauses.join(', ')}
    WHERE id = ANY($${paramIndex})
  `;

  // Use client if provided (transaction), otherwise use execute
  if (client) {
    const result = await client.query(sql, params);
    return result.rowCount || 0;
  } else {
    const result = await execute(sql, params);
    return result.rowCount || 0;
  }
}

/**
 * Get migration dashboard statistics
 */
export async function getMigrationStats() {
  const sql = `
    SELECT
      COUNT(*) as total_videos,
      COUNT(*) FILTER (WHERE migration_status IN ('hetzner_primary', 'hetzner_only')) as migrated_count,
      COUNT(*) FILTER (WHERE migration_status = 'vimeo_only') as pending_count,
      COUNT(*) FILTER (WHERE migration_status = 'migrating') as in_progress_count
    FROM videos
  `;

  const rows = await query<{
    total_videos: string;
    migrated_count: string;
    pending_count: string;
    in_progress_count: string;
  }>(sql);

  const totalVideos = parseInt(rows[0]?.total_videos || '0', 10);
  const migratedCount = parseInt(rows[0]?.migrated_count || '0', 10);
  const pendingCount = parseInt(rows[0]?.pending_count || '0', 10);
  const inProgressCount = parseInt(rows[0]?.in_progress_count || '0', 10);

  // Calculate estimated savings (assuming $5/video/month on Vimeo)
  const estimatedSavings = migratedCount * 5;

  // Calculate migration progress percentage
  const migrationProgress = totalVideos > 0
    ? Math.round((migratedCount / totalVideos) * 100)
    : 0;

  return {
    totalVideos,
    migratedCount,
    pendingCount,
    inProgressCount,
    failedCount: 0, // TODO: Track failed migrations
    estimatedSavings,
    migrationProgress,
  };
}

/**
 * Search videos with full-text search and filters
 */
export async function searchVideos(
  searchQuery: string,
  filters: VideoListFilters = {}
): Promise<ListVideosResult> {
  const {
    limit = 100,
    offset = 0,
    status,
    visibility,
    migrationStatus,
    pipelineStage,
    courseId,
    moduleId,
    tags,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = filters;

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Full-text search on title and description
  if (searchQuery && searchQuery.trim()) {
    conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${searchQuery.trim()}%`);
    paramIndex++;
  }

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (visibility) {
    conditions.push(`visibility = $${paramIndex++}`);
    params.push(visibility);
  }

  if (migrationStatus) {
    conditions.push(`migration_status = $${paramIndex++}`);
    params.push(migrationStatus);
  }

  if (pipelineStage) {
    conditions.push(`pipeline_stage = $${paramIndex++}`);
    params.push(pipelineStage);
  }

  if (courseId) {
    conditions.push(`course_id = $${paramIndex++}`);
    params.push(courseId);
  }

  if (moduleId) {
    conditions.push(`module_id = $${paramIndex++}`);
    params.push(moduleId);
  }

  if (tags && tags.length > 0) {
    conditions.push(`tags && $${paramIndex++}`);
    params.push(tags);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate orderBy to prevent SQL injection
  const validOrderColumns = Object.freeze([
    'created_at',
    'updated_at',
    'title',
    'duration_seconds',
    'published_at',
    'sort_order',
  ]);

  // Additional validation: check for special characters
  if (!/^[a-z_]+$/.test(orderBy)) {
    throw new Error(`Invalid orderBy column: ${orderBy}`);
  }

  const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'created_at';
  const safeOrderDir = orderDirection === 'asc' ? 'ASC' : 'DESC';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM videos ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query
  const dataSql = `
    SELECT
      id, airtable_id, title, description,
      video_url, thumbnail_url, duration_seconds,
      status, entity_scope, created_by,
      created_at, updated_at, metadata,
      tags, master_file_url, visibility,
      course_id, module_id, sort_order,
      published_at, migration_status, pipeline_stage
    FROM videos
    ${whereClause}
    ORDER BY ${safeOrderBy} ${safeOrderDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await query<VideoRow>(dataSql, params);

  return {
    videos: rows.map(mapVideo),
    total,
  };
}
