/**
 * Video Platform Distribution API Route
 *
 * Manages platform distribution records for videos across Vimeo, YouTube, and Hetzner.
 *
 * GET /api/videos/[id]/platforms - List all platforms for a video
 * POST /api/videos/[id]/platforms - Create/update a platform record
 * DELETE /api/videos/[id]/platforms?platform={vimeo|youtube|hetzner} - Remove platform record
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import {
  getPlatformsByVideoId,
  upsertPlatform,
  deletePlatform,
} from '@/lib/db/video-platforms';
import { validateUpsertPlatform } from '@/lib/validations/video';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/videos/[id]/platforms
 *
 * Retrieve all platform distribution records for a video
 *
 * @returns Array of platform records
 *
 * @example
 * GET /api/videos/123e4567-e89b-12d3-a456-426614174000/platforms
 * Response: { platforms: [{ platform: 'vimeo', status: 'ready', ... }] }
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.read')) {
      return NextResponse.json({ error: 'Forbidden: content.read permission required' }, { status: 403 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Video ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      );
    }

    const platforms = await getPlatformsByVideoId(id);

    return NextResponse.json({ platforms });
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * POST /api/videos/[id]/platforms
 *
 * Create or update a platform distribution record
 *
 * Uses upsert logic - creates new record or updates existing based on (video_id, platform) uniqueness.
 *
 * @body UpsertPlatformInput - Platform data (platform, externalId, externalUrl, etc.)
 * @returns Created or updated platform record
 *
 * @example
 * POST /api/videos/123e4567-e89b-12d3-a456-426614174000/platforms
 * Body: {
 *   "platform": "vimeo",
 *   "externalId": "123456789",
 *   "externalUrl": "https://vimeo.com/123456789",
 *   "embedUrl": "https://player.vimeo.com/video/123456789",
 *   "status": "ready",
 *   "privacyLevel": "unlisted"
 * }
 * Response: { platform: { id: "...", platform: "vimeo", ... } }
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json({ error: 'Forbidden: content.write permission required' }, { status: 403 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Video ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      );
    }

    const body = await request.json();
    const validated = validateUpsertPlatform(body);

    const platform = await upsertPlatform(id, validated);

    return NextResponse.json({ platform });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to upsert platform:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * DELETE /api/videos/[id]/platforms?platform={vimeo|youtube|hetzner}
 *
 * Remove a platform distribution record for a video
 *
 * @query platform - Platform identifier (vimeo, youtube, or hetzner)
 * @returns Success confirmation or 404 if not found
 *
 * @example
 * DELETE /api/videos/123e4567-e89b-12d3-a456-426614174000/platforms?platform=vimeo
 * Response: { success: true }
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.delete')) {
      return NextResponse.json({ error: 'Forbidden: content.delete permission required' }, { status: 403 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Video ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      );
    }

    // Get platform from query params
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform query parameter is required' },
        { status: 400 }
      );
    }

    // Validate platform is one of the allowed values
    const validPlatforms = ['vimeo', 'youtube', 'hetzner'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    const deleted = await deletePlatform(id, platform as 'vimeo' | 'youtube' | 'hetzner');

    if (!deleted) {
      return NextResponse.json(
        { error: 'Platform record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete platform:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
