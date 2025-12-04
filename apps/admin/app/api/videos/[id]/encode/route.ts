/**
 * API: Trigger Video Encoding
 * POST /api/videos/[id]/encode - Trigger encoding job for a video
 *
 * This endpoint creates a new encoding job for a video and queues it for processing.
 * The encoding worker will poll for queued jobs and process them asynchronously.
 *
 * Request body:
 * - inputFileUrl?: string (optional, defaults to video.masterFileUrl)
 * - outputBucket?: string (optional, defaults to 'video-hls')
 * - resolutions?: Array<'360p' | '480p' | '720p' | '1080p'> (optional subset)
 * - priority?: 'low' | 'normal' | 'high' (optional, defaults to 'normal')
 *
 * Response:
 * - success: boolean
 * - jobId: string (UUID of the created job)
 * - videoId: string (UUID of the video)
 * - status: 'queued'
 * - message: string (success message)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { getVideoById, updateVideo } from '@/lib/db/videos';
import { createEncodingJob, getActiveJobForVideo } from '@/lib/db/encoding-jobs';
import { validateTriggerEncoding } from '@/lib/validations/video';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/videos/[id]/encode
 * Trigger encoding job for a video
 *
 * Requirements:
 * - User must be authenticated with content.write permission
 * - Video must exist
 * - Video must have a master_file_url OR inputFileUrl must be provided
 * - No active encoding job can be in progress for this video
 *
 * Returns:
 * - 201: Encoding job created successfully
 * - 400: Validation error or missing input file URL
 * - 401: Unauthorized
 * - 403: Forbidden (missing permission)
 * - 404: Video not found
 * - 409: Encoding job already in progress
 * - 500: Server error
 */
export async function POST(
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

    // Permission check - requires content.write to trigger encoding
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json(
        { error: 'Forbidden: content.write permission required' },
        { status: 403 }
      );
    }

    // Extract video ID from route params
    const { id: videoId } = await context.params;

    // Parse and validate request body
    const body = await request.json();
    const validated = validateTriggerEncoding(body);

    // 1. Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // 2. Determine input file URL (use provided or fall back to master file URL)
    const inputFileUrl = validated.inputFileUrl || video.masterFileUrl;
    if (!inputFileUrl) {
      return NextResponse.json(
        {
          error: 'No input file URL available',
          message: 'Video has no master file URL and no input file URL was provided',
        },
        { status: 400 }
      );
    }

    // 3. Check for existing active encoding job
    const activeJob = await getActiveJobForVideo(videoId);
    if (activeJob) {
      return NextResponse.json(
        {
          error: 'Encoding job already active',
          message: `Video already has an active encoding job with status: ${activeJob.status}`,
          existingJobId: activeJob.id,
          existingJobStatus: activeJob.status,
          existingJobProgress: activeJob.progress,
        },
        { status: 409 }
      );
    }

    // 4. Create encoding job record in database
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/encoding/webhook`;
    const job = await createEncodingJob({
      videoId,
      inputFileUrl,
      outputBucket: validated.outputBucket,
      webhookUrl,
    });

    // 5. Update video pipeline stage to 'processing'
    await updateVideo(videoId, {
      pipelineStage: 'processing',
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        jobId: job.id,
        videoId: job.videoId,
        status: job.status,
        message: 'Encoding job created successfully. The encoding worker will process this job shortly.',
        inputFileUrl: job.inputFileUrl,
        outputBucket: job.outputBucket,
        priority: validated.priority,
        resolutions: validated.resolutions,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Log and handle other errors
    console.error('Failed to trigger encoding job:', error);
    return NextResponse.json(
      {
        error: 'Failed to trigger encoding job',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
