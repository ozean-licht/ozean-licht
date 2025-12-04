/**
 * API: Encoding Webhook
 * POST /api/encoding/webhook - Receive encoding progress updates from worker
 *
 * This is a PUBLIC webhook endpoint - NO auth() check required.
 * Security is enforced through HMAC-SHA256 signature verification.
 *
 * TODO: Add rate limiting before production deployment
 * Recommended approach: Use upstash/ratelimit or simple in-memory Map
 * with IP tracking to prevent abuse (e.g., max 100 requests per minute per IP).
 *
 * Webhook flow:
 * 1. Verify HMAC-SHA256 signature in X-Webhook-Signature header
 * 2. Parse and validate payload using Zod
 * 3. Update encoding job status in database
 * 4. On completion: update video with CDN URLs and migration status
 * 5. On failure: log error, keep Vimeo as fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  updateJobProgress,
  completeJob,
  failJob,
  getEncodingJobById,
} from '@/lib/db/encoding-jobs';
import { updateVideo, getVideoById } from '@/lib/db/videos';
import { encodingWebhookSchema } from '@/lib/validations/video';
import type { EncodingWebhookPayload } from '@/types/video';

/**
 * Verify HMAC-SHA256 signature using timing-safe comparison
 *
 * The webhook sender must:
 * 1. Compute HMAC-SHA256(secret, raw_body)
 * 2. Send as header: X-Webhook-Signature: sha256=<hex_digest>
 *
 * @param payload - Raw request body as string
 * @param signature - Signature from X-Webhook-Signature header
 * @returns true if signature is valid, false otherwise
 * @throws Error if webhook secret is not configured
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.ENCODING_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('ENCODING_WEBHOOK_SECRET environment variable not configured');
  }

  // Compute expected signature
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Extract provided signature (remove "sha256=" prefix if present)
  const providedSignature = signature.replace(/^sha256=/, '');

  // Validate hex format
  if (!/^[a-f0-9]{64}$/i.test(providedSignature)) {
    console.error('[Encoding Webhook] Invalid signature format:', providedSignature);
    return false;
  }

  // Timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(providedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    // timingSafeEqual throws if buffers have different lengths
    console.error('[Encoding Webhook] Signature comparison failed:', error);
    return false;
  }
}

/**
 * POST /api/encoding/webhook
 * Receive and process encoding worker updates
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Get raw body for signature verification
    const rawBody = await request.text();

    // Step 2: Verify HMAC signature
    const signature = request.headers.get('x-webhook-signature');

    if (!signature) {
      console.error('[Encoding Webhook] Missing X-Webhook-Signature header');
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Missing webhook signature'
        },
        { status: 401 }
      );
    }

    // Verify signature
    let isValid = false;
    try {
      isValid = verifyWebhookSignature(rawBody, signature);
    } catch (error) {
      console.error('[Encoding Webhook] Signature verification error:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Webhook signature verification failed'
        },
        { status: 500 }
      );
    }

    if (!isValid) {
      console.error('[Encoding Webhook] Invalid webhook signature');
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid webhook signature'
        },
        { status: 401 }
      );
    }

    // Step 3: Parse and validate payload
    let payload: EncodingWebhookPayload;
    try {
      const parsedBody = JSON.parse(rawBody);
      payload = encodingWebhookSchema.parse(parsedBody);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('[Encoding Webhook] Validation failed:', error.flatten());
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Invalid webhook payload',
            details: error.flatten(),
          },
          { status: 400 }
        );
      }

      console.error('[Encoding Webhook] JSON parse error:', error);
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid JSON payload',
        },
        { status: 400 }
      );
    }

    // Step 4: Verify job exists
    const job = await getEncodingJobById(payload.jobId);
    if (!job) {
      console.error(`[Encoding Webhook] Job not found: ${payload.jobId}`);
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Encoding job ${payload.jobId} not found`
        },
        { status: 404 }
      );
    }

    // Verify videoId matches
    if (job.videoId !== payload.videoId) {
      console.error(
        `[Encoding Webhook] Video ID mismatch: job=${job.videoId}, payload=${payload.videoId}`
      );
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Video ID mismatch'
        },
        { status: 400 }
      );
    }

    // Step 5: Process webhook based on status
    console.log(
      `[Encoding Webhook] Processing ${payload.status} for job ${payload.jobId} (video ${payload.videoId})`
    );

    switch (payload.status) {
      case 'progress': {
        // Update job progress
        if (payload.progress === undefined) {
          console.warn('[Encoding Webhook] Progress status without progress value');
          return NextResponse.json(
            {
              error: 'Bad Request',
              message: 'Progress value required for progress status',
            },
            { status: 400 }
          );
        }

        await updateJobProgress(payload.jobId, payload.progress);

        console.log(
          `[Encoding Webhook] Updated job ${payload.jobId} progress to ${payload.progress}%`
        );

        return NextResponse.json({
          success: true,
          message: 'Progress updated',
          jobId: payload.jobId,
          progress: payload.progress,
        });
      }

      case 'completed': {
        // Validate required fields for completion
        if (!payload.outputUrl) {
          console.error('[Encoding Webhook] Completed status without outputUrl');
          return NextResponse.json(
            {
              error: 'Bad Request',
              message: 'Output URL required for completed status',
            },
            { status: 400 }
          );
        }

        if (!payload.renditions || payload.renditions.length === 0) {
          console.warn('[Encoding Webhook] Completed status without renditions');
        }

        // Complete the job
        await completeJob(
          payload.jobId,
          payload.outputUrl,
          payload.renditions || [],
          payload.thumbnailUrls || []
        );

        // Update video with new CDN URL and migration status
        const video = await getVideoById(payload.videoId);
        if (!video) {
          console.error(`[Encoding Webhook] Video not found: ${payload.videoId}`);
          // Job is marked complete, but video update failed
          return NextResponse.json(
            {
              success: true,
              warning: 'Job completed but video not found',
              jobId: payload.jobId,
            },
            { status: 200 }
          );
        }

        // Update video with CDN URL, thumbnail (if provided), and migration status
        const videoUpdates: {
          videoUrl: string;
          migrationStatus: 'hetzner_primary';
          thumbnailUrl?: string;
        } = {
          videoUrl: payload.outputUrl,
          migrationStatus: 'hetzner_primary',
        };

        // Update thumbnail if provided and video doesn't have one
        if (payload.thumbnailUrls && payload.thumbnailUrls.length > 0 && !video.thumbnailUrl) {
          videoUpdates.thumbnailUrl = payload.thumbnailUrls[0];
        }

        await updateVideo(payload.videoId, videoUpdates);

        console.log(
          `[Encoding Webhook] Job ${payload.jobId} completed successfully. ` +
          `Video ${payload.videoId} updated with CDN URL: ${payload.outputUrl}`
        );

        return NextResponse.json({
          success: true,
          message: 'Encoding completed',
          jobId: payload.jobId,
          videoId: payload.videoId,
          outputUrl: payload.outputUrl,
          renditions: payload.renditions?.length || 0,
        });
      }

      case 'failed': {
        // Validate error information
        if (!payload.error) {
          console.warn('[Encoding Webhook] Failed status without error details');
        }

        const errorCode = payload.error?.code || 'UNKNOWN_ERROR';
        const errorMessage = payload.error?.message || 'Encoding failed without error details';

        // Fail the job (will set up retry logic automatically)
        await failJob(payload.jobId, errorMessage, errorCode);

        console.error(
          `[Encoding Webhook] Job ${payload.jobId} failed: [${errorCode}] ${errorMessage}`
        );

        // Video remains with Vimeo URL as fallback - no update needed

        return NextResponse.json({
          success: true,
          message: 'Encoding failure recorded',
          jobId: payload.jobId,
          videoId: payload.videoId,
          error: {
            code: errorCode,
            message: errorMessage,
          },
          willRetry: true, // failJob sets up retry automatically
        });
      }

      default: {
        // Should never happen due to Zod validation
        console.error(`[Encoding Webhook] Unknown status: ${payload.status}`);
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: `Unknown status: ${payload.status}`,
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    // Log unexpected errors
    console.error('[Encoding Webhook] Unexpected error:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/encoding/webhook
 * Health check endpoint
 */
export async function GET() {
  // Check if webhook secret is configured
  const isConfigured = !!process.env.ENCODING_WEBHOOK_SECRET;

  return NextResponse.json({
    status: 'ok',
    service: 'encoding-webhook',
    configured: isConfigured,
    timestamp: new Date().toISOString(),
  });
}
