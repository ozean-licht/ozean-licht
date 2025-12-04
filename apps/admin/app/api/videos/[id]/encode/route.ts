/**
 * Video Encoding Trigger API Route
 *
 * POST /api/videos/[id]/encode - Trigger an encoding job for a video
 *
 * This endpoint creates an encoding job in the database. The actual
 * BullMQ integration for job processing will be added in Phase 2.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById } from '@/lib/db/videos';
import { createEncodingJob, getActiveJobForVideo } from '@/lib/db/encoding-jobs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/videos/[id]/encode
 * Trigger encoding job for a video
 *
 * Requirements:
 * - User must be authenticated
 * - Video must exist
 * - Video must have a master_file_url
 * - No active encoding job can be in progress for this video
 *
 * Returns:
 * - 201: Encoding job created successfully
 * - 400: Missing master file URL
 * - 401: Unauthorized
 * - 404: Video not found
 * - 409: Encoding job already in progress
 * - 500: Server error
 */
export async function POST(
  _request: NextRequest,
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

    // Permission check
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json(
        { error: 'Forbidden: content.write permission required' },
        { status: 403 }
      );
    }

    // Extract video ID from route params
    const { id } = await context.params;

    // Get video by ID
    const video = await getVideoById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if video has a master file URL
    if (!video.masterFileUrl) {
      return NextResponse.json(
        { error: 'No master file URL available for encoding' },
        { status: 400 }
      );
    }

    // Check for active encoding job
    const activeJob = await getActiveJobForVideo(id);
    if (activeJob) {
      return NextResponse.json(
        {
          error: 'An encoding job is already in progress',
          job: {
            id: activeJob.id,
            status: activeJob.status,
            progress: activeJob.progress,
            createdAt: activeJob.createdAt,
          },
        },
        { status: 409 }
      );
    }

    // Create encoding job
    const job = await createEncodingJob({
      videoId: id,
      inputFileUrl: video.masterFileUrl,
    });

    return NextResponse.json(
      {
        message: 'Encoding job created successfully',
        job: {
          id: job.id,
          videoId: job.videoId,
          status: job.status,
          progress: job.progress,
          inputFileUrl: job.inputFileUrl,
          outputBucket: job.outputBucket,
          createdAt: job.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create encoding job:', error);
    return NextResponse.json(
      {
        error: 'Failed to create encoding job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
