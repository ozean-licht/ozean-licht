/**
 * Videos Database Queries
 *
 * Direct PostgreSQL queries for video management.
 * No MCP Gateway dependency.
 */

import { query } from './index';
import { Video } from '@/types/content';

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
  const validOrderColumns = ['created_at', 'updated_at', 'title', 'duration_seconds', 'status'];
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
      created_at, updated_at, metadata
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
      created_at, updated_at, metadata
    FROM videos
    WHERE id = $1
  `;

  const rows = await query<VideoRow>(sql, [id]);
  return rows.length > 0 ? mapVideo(rows[0]) : null;
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
