/**
 * Video Platform Distribution CRUD Operations
 *
 * Direct PostgreSQL queries for managing video distribution across platforms.
 * Handles platform records for Vimeo, YouTube, and Hetzner.
 */

import { query, execute } from './index';
import type {
  VideoPlatformRecord,
  VideoPlatform,
  PlatformStatus,
  UpsertPlatformInput,
} from '@/types/video';

// Database row type (snake_case)
interface VideoPlatformRow {
  id: string;
  video_id: string;
  platform: string;
  external_id: string | null;
  external_url: string | null;
  embed_url: string | null;
  status: string;
  privacy_level: string | null;
  synced_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Map database row to VideoPlatformRecord type
 */
function mapPlatformRecord(row: VideoPlatformRow): VideoPlatformRecord {
  return {
    id: row.id,
    videoId: row.video_id,
    platform: row.platform as VideoPlatform,
    externalId: row.external_id || undefined,
    externalUrl: row.external_url || undefined,
    embedUrl: row.embed_url || undefined,
    status: row.status as PlatformStatus,
    privacyLevel: row.privacy_level || undefined,
    syncedAt: row.synced_at || undefined,
    metadata: row.metadata || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get all platform records for a video
 *
 * @param videoId - Video UUID
 * @returns Array of platform records
 *
 * @example
 * const platforms = await getPlatformsByVideoId('123e4567-e89b-12d3-a456-426614174000');
 * // Returns all platforms where this video is distributed
 */
export async function getPlatformsByVideoId(
  videoId: string
): Promise<VideoPlatformRecord[]> {
  const sql = `
    SELECT
      id, video_id, platform, external_id, external_url, embed_url,
      status, privacy_level, synced_at, metadata,
      created_at, updated_at
    FROM video_platforms
    WHERE video_id = $1
    ORDER BY created_at ASC
  `;

  const rows = await query<VideoPlatformRow>(sql, [videoId]);
  return rows.map(mapPlatformRecord);
}

/**
 * Get a specific platform record by video ID and platform type
 *
 * @param videoId - Video UUID
 * @param platform - Platform identifier
 * @returns Platform record or null if not found
 *
 * @example
 * const vimeoPlatform = await getPlatformByVideoAndType(videoId, 'vimeo');
 * if (vimeoPlatform) {
 *   console.log('Vimeo URL:', vimeoPlatform.externalUrl);
 * }
 */
export async function getPlatformByVideoAndType(
  videoId: string,
  platform: VideoPlatform
): Promise<VideoPlatformRecord | null> {
  const sql = `
    SELECT
      id, video_id, platform, external_id, external_url, embed_url,
      status, privacy_level, synced_at, metadata,
      created_at, updated_at
    FROM video_platforms
    WHERE video_id = $1 AND platform = $2
  `;

  const rows = await query<VideoPlatformRow>(sql, [videoId, platform]);
  return rows.length > 0 ? mapPlatformRecord(rows[0]) : null;
}

/**
 * Create or update a platform record for a video
 *
 * Uses PostgreSQL's ON CONFLICT to perform upsert operation.
 * Updates synced_at timestamp and all provided fields.
 *
 * @param videoId - Video UUID
 * @param input - Platform data to insert/update
 * @returns Created or updated platform record
 *
 * @example
 * const platform = await upsertPlatform(videoId, {
 *   platform: 'vimeo',
 *   externalId: '123456789',
 *   externalUrl: 'https://vimeo.com/123456789',
 *   embedUrl: 'https://player.vimeo.com/video/123456789',
 *   status: 'ready',
 *   privacyLevel: 'unlisted',
 *   metadata: { quality: '1080p' }
 * });
 */
export async function upsertPlatform(
  videoId: string,
  input: UpsertPlatformInput
): Promise<VideoPlatformRecord> {
  const {
    platform,
    externalId,
    externalUrl,
    embedUrl,
    status = 'pending',
    privacyLevel,
    metadata,
  } = input;

  const sql = `
    INSERT INTO video_platforms (
      video_id, platform, external_id, external_url, embed_url,
      status, privacy_level, synced_at, metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
    ON CONFLICT (video_id, platform)
    DO UPDATE SET
      external_id = COALESCE(EXCLUDED.external_id, video_platforms.external_id),
      external_url = COALESCE(EXCLUDED.external_url, video_platforms.external_url),
      embed_url = COALESCE(EXCLUDED.embed_url, video_platforms.embed_url),
      status = EXCLUDED.status,
      privacy_level = COALESCE(EXCLUDED.privacy_level, video_platforms.privacy_level),
      synced_at = NOW(),
      metadata = COALESCE(EXCLUDED.metadata, video_platforms.metadata),
      updated_at = NOW()
    RETURNING
      id, video_id, platform, external_id, external_url, embed_url,
      status, privacy_level, synced_at, metadata,
      created_at, updated_at
  `;

  const rows = await query<VideoPlatformRow>(sql, [
    videoId,
    platform,
    externalId || null,
    externalUrl || null,
    embedUrl || null,
    status,
    privacyLevel || null,
    metadata ? JSON.stringify(metadata) : '{}',
  ]);

  return mapPlatformRecord(rows[0]);
}

/**
 * Delete a platform record for a video
 *
 * @param videoId - Video UUID
 * @param platform - Platform identifier to remove
 * @returns true if a record was deleted, false if not found
 *
 * @example
 * const deleted = await deletePlatform(videoId, 'vimeo');
 * if (deleted) {
 *   console.log('Vimeo platform record removed');
 * }
 */
export async function deletePlatform(
  videoId: string,
  platform: VideoPlatform
): Promise<boolean> {
  const sql = `
    DELETE FROM video_platforms
    WHERE video_id = $1 AND platform = $2
  `;

  const result = await execute(sql, [videoId, platform]);
  return (result.rowCount || 0) > 0;
}

/**
 * Update the status of a platform record
 *
 * @param id - Platform record UUID
 * @param status - New status value
 * @returns Updated platform record or null if not found
 *
 * @example
 * const updated = await updatePlatformStatus(platformId, 'ready');
 * if (updated) {
 *   console.log('Platform status updated to ready');
 * }
 */
export async function updatePlatformStatus(
  id: string,
  status: PlatformStatus
): Promise<VideoPlatformRecord | null> {
  const sql = `
    UPDATE video_platforms
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id, video_id, platform, external_id, external_url, embed_url,
      status, privacy_level, synced_at, metadata,
      created_at, updated_at
  `;

  const rows = await query<VideoPlatformRow>(sql, [status, id]);
  return rows.length > 0 ? mapPlatformRecord(rows[0]) : null;
}

/**
 * Get all videos that don't have a record for a specific platform
 *
 * Useful for finding videos that need to be distributed to a platform.
 * Only returns published videos with video_url set.
 *
 * @param platform - Platform identifier
 * @returns Array of videos without the platform
 *
 * @example
 * const videosWithoutYouTube = await getVideosWithoutPlatform('youtube');
 * console.log(`${videosWithoutYouTube.length} videos need YouTube distribution`);
 */
export async function getVideosWithoutPlatform(
  platform: VideoPlatform
): Promise<{ id: string; title: string }[]> {
  const sql = `
    SELECT v.id, v.title
    FROM videos v
    WHERE v.status = 'published'
      AND v.video_url IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM video_platforms vp
        WHERE vp.video_id = v.id
          AND vp.platform = $1
      )
    ORDER BY v.created_at DESC
  `;

  const rows = await query<{ id: string; title: string }>(sql, [platform]);
  return rows;
}

/**
 * Find a video by platform and external ID
 *
 * Useful for sync operations to check if a video from an external platform
 * already exists in the local database.
 *
 * @param platform - Platform identifier
 * @param externalId - External platform video ID
 * @returns Video ID if found, null otherwise
 *
 * @example
 * const videoId = await findVideoByExternalId('vimeo', '123456789');
 * if (videoId) {
 *   console.log('Video already exists with ID:', videoId);
 * }
 */
export async function findVideoByExternalId(
  platform: VideoPlatform,
  externalId: string
): Promise<string | null> {
  const sql = `
    SELECT video_id
    FROM video_platforms
    WHERE platform = $1 AND external_id = $2
    LIMIT 1
  `;

  const rows = await query<{ video_id: string }>(sql, [platform, externalId]);
  return rows.length > 0 ? rows[0].video_id : null;
}
