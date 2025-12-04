/**
 * Vimeo Sync API Route
 *
 * POST /api/videos/sync/vimeo - Trigger a Vimeo library sync
 * GET /api/videos/sync/vimeo - Check sync status and rate limits
 *
 * This endpoint fetches videos from the Vimeo API and upserts them into the
 * local database with platform tracking. Includes rate limit handling and
 * error recovery.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getVideoList,
  getRateLimitStatus,
  extractVimeoId,
  getBestThumbnail,
  type VimeoVideo,
} from '@/lib/integrations/vimeo';
import { createVideo, updateVideo } from '@/lib/db/videos';
import { upsertPlatform, findVideoByExternalId } from '@/lib/db/video-platforms';
import type { VimeoSyncResult } from '@/types/video';

// ================================================================
// GET - Check Sync Status & Rate Limits
// ================================================================

/**
 * GET /api/videos/sync/vimeo
 *
 * Check the current rate limit status and sync availability
 *
 * @returns Rate limit information and sync readiness
 *
 * @example
 * GET /api/videos/sync/vimeo
 * Response: {
 *   quotaRemaining: 987,
 *   quotaLimit: 1000,
 *   quotaResetAt: "2025-12-04T15:30:00.000Z",
 *   isRateLimited: false,
 *   canSync: true
 * }
 */
export async function GET() {
  try {
    // Check auth - any authenticated user can check status
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitStatus = getRateLimitStatus();

    return NextResponse.json({
      ...rateLimitStatus,
      canSync: !rateLimitStatus.isRateLimited && rateLimitStatus.quotaRemaining >= 10,
      minimumQuota: 10,
    });
  } catch (error) {
    console.error('[VIMEO_SYNC] Status check failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check sync status',
      },
      { status: 500 }
    );
  }
}

// ================================================================
// POST - Trigger Vimeo Sync
// ================================================================

/**
 * POST /api/videos/sync/vimeo
 *
 * Trigger a full sync of the Vimeo video library
 *
 * Authentication: Requires super_admin or ol_admin role
 * Rate Limiting: Respects Vimeo API rate limits and backoff
 *
 * @returns Sync summary with counts and quota information
 *
 * @example
 * POST /api/videos/sync/vimeo
 * Response: {
 *   added: 5,
 *   updated: 23,
 *   errors: 0,
 *   quotaRemaining: 950,
 *   nextSyncAllowed: "2025-12-04T15:31:00.000Z"
 * }
 */
export async function POST(_request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Authorization check - require admin role
    const userRole = session.user.adminRole;
    if (!['super_admin', 'ol_admin'].includes(userRole || '')) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions',
          message: 'Only super_admin and ol_admin roles can trigger Vimeo sync',
        },
        { status: 403 }
      );
    }

    // 3. Check rate limit status before starting
    const rateLimitStatus = getRateLimitStatus();
    if (rateLimitStatus.isRateLimited) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Vimeo API rate limit active. Please wait before retrying.',
          retryAfter: rateLimitStatus.backoffUntil,
          quotaRemaining: rateLimitStatus.quotaRemaining,
        },
        { status: 429 }
      );
    }

    if (rateLimitStatus.quotaRemaining < 10) {
      return NextResponse.json(
        {
          error: 'Insufficient API quota',
          message: 'Less than 10 API calls remaining. Wait for quota reset.',
          quotaRemaining: rateLimitStatus.quotaRemaining,
          quotaResetAt: rateLimitStatus.quotaResetAt,
        },
        { status: 429 }
      );
    }

    // 4. Start sync operation
    console.log(`[VIMEO_SYNC] Starting sync initiated by ${session.user.email}`);

    const result: VimeoSyncResult = {
      added: 0,
      updated: 0,
      errors: 0,
      quotaRemaining: 0,
      nextSyncAllowed: '',
    };

    try {
      let page = 1;
      let hasMore = true;
      const maxPages = 10; // Safety limit to prevent runaway syncs

      while (hasMore && page <= maxPages) {
        console.log(`[VIMEO_SYNC] Fetching page ${page}...`);

        const vimeoResponse = await getVideoList(page, 25);

        console.log(
          `[VIMEO_SYNC] Page ${page}: ${vimeoResponse.data.length} videos, total: ${vimeoResponse.total}`
        );

        // Process each video from this page
        for (const vimeoVideo of vimeoResponse.data) {
          try {
            await syncSingleVideo(vimeoVideo, result);
          } catch (err) {
            console.error(`[VIMEO_SYNC] Error syncing video ${vimeoVideo.uri}:`, err);
            result.errors++;
          }
        }

        // Check if there are more pages
        hasMore = vimeoResponse.paging.next !== null;
        page++;
      }

      // Get final rate limit status
      const finalStatus = getRateLimitStatus();
      result.quotaRemaining = finalStatus.quotaRemaining;
      result.nextSyncAllowed = new Date(Date.now() + 60000).toISOString(); // 1 minute cooldown

      console.log(
        `[VIMEO_SYNC] Completed: ${result.added} added, ${result.updated} updated, ${result.errors} errors`
      );

      return NextResponse.json(result);
    } catch (error) {
      // Handle sync errors (rate limiting, network issues, etc.)
      console.error('[VIMEO_SYNC] Sync failed:', error);

      // Return partial results if we got some data
      if (result.added > 0 || result.updated > 0) {
        return NextResponse.json(
          {
            error: error instanceof Error ? error.message : 'Sync partially failed',
            partial: result,
            message: 'Some videos were synced before the error occurred',
          },
          { status: 207 } // Multi-Status
        );
      }

      // Total failure
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Sync failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[VIMEO_SYNC] Request handling failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// ================================================================
// Helper Functions
// ================================================================

/**
 * Sync a single Vimeo video to the database
 *
 * Creates a new video record if the Vimeo ID doesn't exist,
 * or updates the existing record if it does.
 *
 * @param vimeoVideo - Video data from Vimeo API
 * @param result - Sync result accumulator (mutated)
 */
async function syncSingleVideo(
  vimeoVideo: VimeoVideo,
  result: VimeoSyncResult
): Promise<void> {
  const vimeoId = extractVimeoId(vimeoVideo.uri);

  console.log(`[VIMEO_SYNC] Processing: ${vimeoVideo.name} (ID: ${vimeoId})`);

  // Check if this Vimeo video already exists in our database
  const existingVideoId = await findVideoByExternalId('vimeo', vimeoId);

  // Map Vimeo privacy to our visibility enum
  const visibility = mapVimeoPrivacyToVisibility(vimeoVideo.privacy.view);

  // Prepare video data
  const videoData = {
    title: vimeoVideo.name,
    description: vimeoVideo.description || undefined,
    thumbnailUrl: getBestThumbnail(vimeoVideo.pictures),
    durationSeconds: vimeoVideo.duration,
    status: 'published' as const,
    visibility,
    migrationStatus: 'vimeo_only' as const,
    pipelineStage: 'published' as const,
  };

  if (existingVideoId) {
    // Update existing video
    console.log(`[VIMEO_SYNC] Updating existing video ${existingVideoId}`);
    await updateVideo(existingVideoId, videoData);

    // Update platform record
    await upsertPlatform(existingVideoId, {
      platform: 'vimeo',
      externalId: vimeoId,
      externalUrl: vimeoVideo.link,
      embedUrl: extractEmbedUrl(vimeoVideo.embed.html),
      status: 'ready',
      privacyLevel: vimeoVideo.privacy.view,
      metadata: {
        plays: vimeoVideo.stats.plays,
        created_time: vimeoVideo.created_time,
        modified_time: vimeoVideo.modified_time,
        download_enabled: vimeoVideo.privacy.download,
        embed_privacy: vimeoVideo.privacy.embed,
      },
    });

    result.updated++;
  } else {
    // Create new video
    console.log(`[VIMEO_SYNC] Creating new video for Vimeo ID ${vimeoId}`);
    const newVideo = await createVideo(videoData);

    // Add Vimeo platform entry
    await upsertPlatform(newVideo.id, {
      platform: 'vimeo',
      externalId: vimeoId,
      externalUrl: vimeoVideo.link,
      embedUrl: extractEmbedUrl(vimeoVideo.embed.html),
      status: 'ready',
      privacyLevel: vimeoVideo.privacy.view,
      metadata: {
        plays: vimeoVideo.stats.plays,
        created_time: vimeoVideo.created_time,
        modified_time: vimeoVideo.modified_time,
        download_enabled: vimeoVideo.privacy.download,
        embed_privacy: vimeoVideo.privacy.embed,
      },
    });

    result.added++;
  }
}

/**
 * Map Vimeo privacy setting to our visibility enum
 *
 * @param vimeoPrivacy - Vimeo privacy.view value
 * @returns Our visibility type
 */
function mapVimeoPrivacyToVisibility(
  vimeoPrivacy: string
): 'public' | 'unlisted' | 'private' | 'paid' {
  switch (vimeoPrivacy) {
    case 'anybody':
      return 'public';
    case 'unlisted':
      return 'unlisted';
    case 'password':
    case 'disable':
    case 'nobody':
      return 'private';
    default:
      return 'private';
  }
}

/**
 * Extract clean embed URL from Vimeo embed HTML
 *
 * @param embedHtml - Vimeo embed.html string
 * @returns Clean embed URL or undefined
 *
 * @example
 * extractEmbedUrl('<iframe src="https://player.vimeo.com/video/123">')
 * // "https://player.vimeo.com/video/123"
 */
function extractEmbedUrl(embedHtml: string): string | undefined {
  const match = embedHtml.match(/src="([^"]+)"/);
  return match ? match[1] : undefined;
}
