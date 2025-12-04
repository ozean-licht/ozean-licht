/**
 * Video Rollback API Route
 *
 * POST /api/videos/[id]/rollback - Rollback video from Hetzner to Vimeo
 *
 * Reverts a migrated video back to Vimeo-only status. This is a safety mechanism
 * for when issues are discovered with Hetzner hosting. Hetzner files are kept
 * for potential re-migration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById, updateVideo } from '@/lib/db/videos';
import { getPlatformsByVideoId } from '@/lib/db/video-platforms';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/videos/[id]/rollback
 *
 * Rollback a video from Hetzner primary status to Vimeo only.
 *
 * Requirements:
 * - Video must exist and be in 'hetzner_primary' migration status
 * - Video must have a valid Vimeo platform entry with 'ready' status
 * - User must have content.write permission
 *
 * This operation:
 * - Updates migration_status to 'vimeo_only'
 * - Keeps Hetzner files intact for potential re-migration
 * - Logs the rollback action
 *
 * @returns Updated video object with new migration_status
 *
 * @example
 * POST /api/videos/123e4567-e89b-12d3-a456-426614174000/rollback
 * Response: {
 *   "success": true,
 *   "video": { "id": "...", "migrationStatus": "vimeo_only", ... },
 *   "message": "Video successfully rolled back to Vimeo"
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

    // 3. Check if video can be rolled back (must be hetzner_primary)
    if (video.migrationStatus !== 'hetzner_primary') {
      return NextResponse.json(
        {
          error: 'Video cannot be rolled back - must be in hetzner_primary status',
          currentStatus: video.migrationStatus,
        },
        { status: 400 }
      );
    }

    // 4. Verify Vimeo platform exists and is ready
    const platforms = await getPlatformsByVideoId(id);
    const vimeoPlatform = platforms.find(p => p.platform === 'vimeo');

    if (!vimeoPlatform) {
      return NextResponse.json(
        { error: 'No Vimeo backup found for rollback' },
        { status: 400 }
      );
    }

    if (vimeoPlatform.status !== 'ready') {
      return NextResponse.json(
        {
          error: 'Vimeo backup is not ready for rollback',
          vimeoStatus: vimeoPlatform.status,
        },
        { status: 400 }
      );
    }

    // 5. Update migration status to vimeo_only
    const updatedVideo = await updateVideo(id, {
      migrationStatus: 'vimeo_only',
    });

    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Failed to update video migration status' },
        { status: 500 }
      );
    }

    // 6. Log rollback action
    console.log(
      `[ROLLBACK] Video ${id} (${video.title}) rolled back to Vimeo by ${session.user.email} (admin: ${session.user.adminUserId})`
    );

    return NextResponse.json({
      success: true,
      video: updatedVideo,
      message: 'Video successfully rolled back to Vimeo',
    });
  } catch (error) {
    console.error('Failed to rollback video:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
