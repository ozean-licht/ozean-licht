/**
 * Video Migration API Route
 *
 * POST /api/videos/[id]/migrate - Migrate single video from Vimeo to Hetzner
 *
 * Queues a video for migration from Vimeo to Hetzner storage.
 * Updates migration_status to 'migrating'.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById, updateVideo } from '@/lib/db/videos';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/videos/[id]/migrate
 *
 * Migrate a video from Vimeo to Hetzner.
 *
 * Requirements:
 * - Video must exist and be in 'vimeo_only' migration status
 * - User must have content.write permission
 *
 * This operation:
 * - Updates migration_status to 'migrating'
 * - Video will be processed by encoding pipeline
 * - Logs the migration action
 *
 * @returns Updated video object with new migration_status
 *
 * @example
 * POST /api/videos/123e4567-e89b-12d3-a456-426614174000/migrate
 * Response: {
 *   "success": true,
 *   "video": { "id": "...", "migrationStatus": "migrating", ... },
 *   "message": "Video queued for migration"
 * }
 */
export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json(
        { error: 'Forbidden: content.write permission required' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Validate UUID format
    const validation = validateUUID(id, 'Video ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      );
    }

    // 2. Get video and validate it exists
    const video = await getVideoById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // 3. Check if video can be migrated (must be vimeo_only)
    if (video.migrationStatus !== 'vimeo_only') {
      return NextResponse.json(
        {
          error: 'Video cannot be migrated - must be in vimeo_only status',
          currentStatus: video.migrationStatus,
        },
        { status: 400 }
      );
    }

    // 4. Update migration status to 'migrating'
    const updatedVideo = await updateVideo(id, {
      migrationStatus: 'migrating',
    });

    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Failed to update video migration status' },
        { status: 500 }
      );
    }

    // 5. Log migration action
    console.log(
      `[MIGRATE] Video ${id} (${video.title}) queued for migration by ${session.user.email} (admin: ${session.user.adminUserId})`
    );

    return NextResponse.json({
      success: true,
      video: updatedVideo,
      message: 'Video queued for migration',
    });
  } catch (error) {
    console.error('Failed to migrate video:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
