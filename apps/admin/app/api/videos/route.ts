/**
 * API: Videos
 * POST /api/videos - Create a new video
 * GET /api/videos - List all videos with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/auth-utils';
import { createVideo, listVideos } from '@/lib/db/videos';
import { validateCreateVideo } from '@/lib/validations/video';

/**
 * POST /api/videos
 * Create a new video
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.write')) {
      return NextResponse.json({ error: 'Forbidden: content.write permission required' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();

    // Validate input - throws ZodError on failure
    const validated = validateCreateVideo(body);

    // Create video
    const video = await createVideo(validated);

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    // Log and handle other errors
    console.error('Failed to create video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/videos
 * List videos with optional filtering
 * Query params: limit, offset, status, search, orderBy, orderDirection
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Permission check
    if (!hasPermission(session, 'content.read')) {
      return NextResponse.json({ error: 'Forbidden: content.read permission required' }, { status: 403 });
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';

    // Fetch videos
    const cappedLimit = Math.min(limit, 1000); // Cap at 1000
    const result = await listVideos({
      limit: cappedLimit,
      offset,
      status,
      search,
      orderBy,
      orderDirection,
    });

    // Add pagination metadata
    return NextResponse.json({
      videos: result.videos,
      total: result.total,
      limit: cappedLimit,
      offset,
      hasMore: result.total > offset + cappedLimit,
    });
  } catch (error) {
    console.error('Failed to list videos:', error);
    return NextResponse.json(
      { error: 'Failed to list videos' },
      { status: 500 }
    );
  }
}
