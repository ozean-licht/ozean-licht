/**
 * Video Batch Migration API Route
 *
 * POST /api/videos/batch-migrate - Migrate multiple videos from Vimeo to Hetzner
 *
 * Queues multiple videos for migration from Vimeo to Hetzner storage.
 * Updates migration_status to 'migrating' for each video.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById, updateVideo } from '@/lib/db/videos';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface BatchMigrateRequest {
  videoIds: string[];
}

interface BatchMigrateResult {
  queued: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * POST /api/videos/batch-migrate
 *
 * Batch migrate videos from Vimeo to Hetzner.
 *
 * Requirements:
 * - User must have content.write permission
 * - Each video must exist and be in 'vimeo_only' status
 * - Request body must contain videoIds array
 *
 * This operation:
 * - Updates migration_status to 'migrating' for each eligible video
 * - Skips videos that are not in 'vimeo_only' status
 * - Returns summary of queued, skipped, and error counts
 *
 * @returns BatchMigrateResult with operation summary
 *
 * @example
 * POST /api/videos/batch-migrate
 * Body: {
 *   "videoIds": [
 *     "123e4567-e89b-12d3-a456-426614174000",
 *     "223e4567-e89b-12d3-a456-426614174000"
 *   ]
 * }
 * Response: {
 *   "queued": 2,
 *   "skipped": 0,
 *   "errors": []
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check - require content.write
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json(
        { error: 'Forbidden: content.write permission required' },
        { status: 403 }
      );
    }

    // 2. Parse and validate request body
    let body: BatchMigrateRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!body.videoIds || !Array.isArray(body.videoIds)) {
      return NextResponse.json(
        { error: 'videoIds array is required' },
        { status: 400 }
      );
    }

    if (body.videoIds.length === 0) {
      return NextResponse.json(
        { error: 'videoIds array cannot be empty' },
        { status: 400 }
      );
    }

    if (body.videoIds.length > 100) {
      return NextResponse.json(
        { error: 'Cannot migrate more than 100 videos at once' },
        { status: 400 }
      );
    }

    // 3. Process each video
    const result: BatchMigrateResult = {
      queued: 0,
      skipped: 0,
      errors: [],
    };

    for (const videoId of body.videoIds) {
      // Validate UUID format
      const validation = validateUUID(videoId, 'Video ID');
      if (!validation.valid) {
        result.errors.push({
          id: videoId,
          error: validation.error!.message,
        });
        continue;
      }

      try {
        // Get video
        const video = await getVideoById(videoId);

        if (!video) {
          result.errors.push({
            id: videoId,
            error: 'Video not found',
          });
          continue;
        }

        // Check if video is eligible for migration
        if (video.migrationStatus !== 'vimeo_only') {
          result.skipped++;
          continue;
        }

        // Update migration status to 'migrating'
        await updateVideo(videoId, {
          migrationStatus: 'migrating',
        });

        result.queued++;
      } catch (error) {
        console.error(`Failed to queue video ${videoId} for migration:`, error);
        result.errors.push({
          id: videoId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // 4. Log batch migration action
    console.log(
      `[BATCH_MIGRATE] User ${session.user.email} (admin: ${session.user.adminUserId}) queued ${result.queued} videos for migration (${result.skipped} skipped, ${result.errors.length} errors)`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to process batch migration:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
