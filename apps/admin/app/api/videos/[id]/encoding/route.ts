/**
 * API: Video Encoding Status
 * GET /api/videos/[id]/encoding - Get active encoding job status for a video
 *
 * This endpoint allows polling for encoding progress in real-time.
 * Returns the most recent active (non-completed) encoding job for a video.
 *
 * Response:
 * - 200: Active encoding job found
 * - 401: Unauthorized
 * - 403: Forbidden (missing permission)
 * - 404: Video not found or no active encoding job
 * - 500: Server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById } from '@/lib/db/videos';
import { getActiveJobForVideo } from '@/lib/db/encoding-jobs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/videos/[id]/encoding
 * Get active encoding job status for a video
 *
 * Requirements:
 * - User must be authenticated with content.read permission
 * - Video must exist
 * - Returns active encoding job or 404 if none exists
 *
 * Returns:
 * - 200: Encoding job status
 * - 401: Unauthorized
 * - 403: Forbidden (missing permission)
 * - 404: Video or encoding job not found
 * - 500: Server error
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Permission check - requires content.read to view encoding status
    if (!hasPermission(session, 'content.read')) {
      return NextResponse.json(
        { error: 'Forbidden: content.read permission required' },
        { status: 403 }
      );
    }

    // Extract video ID from route params
    const { id: videoId } = await context.params;

    // 1. Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // 2. Get active encoding job
    const activeJob = await getActiveJobForVideo(videoId);
    if (!activeJob) {
      return NextResponse.json(
        {
          error: 'No active encoding job',
          message: 'This video does not have an active encoding job',
        },
        { status: 404 }
      );
    }

    // 3. Return job status
    return NextResponse.json(
      {
        success: true,
        job: {
          id: activeJob.id,
          videoId: activeJob.videoId,
          status: activeJob.status,
          progress: activeJob.progress,
          inputFileUrl: activeJob.inputFileUrl,
          outputManifestUrl: activeJob.outputManifestUrl,
          outputBucket: activeJob.outputBucket,
          outputKey: activeJob.outputKey,
          renditions: activeJob.renditions,
          thumbnailUrls: activeJob.thumbnailUrls,
          attemptCount: activeJob.attemptCount,
          maxAttempts: activeJob.maxAttempts,
          nextRetryAt: activeJob.nextRetryAt,
          lastError: activeJob.lastError,
          errorHistory: activeJob.errorHistory,
          alertSent: activeJob.alertSent,
          workerId: activeJob.workerId,
          startedAt: activeJob.startedAt,
          completedAt: activeJob.completedAt,
          createdAt: activeJob.createdAt,
          updatedAt: activeJob.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Log and handle errors
    console.error('Failed to get encoding status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get encoding status',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
