/**
 * API: Videos
 * GET /api/videos - List all videos with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { listVideos } from '@/lib/db/videos';

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

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';

    // Fetch videos
    const result = await listVideos({
      limit: Math.min(limit, 1000), // Cap at 1000
      offset,
      status,
      search,
      orderBy,
      orderDirection,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to list videos:', error);
    return NextResponse.json(
      { error: 'Failed to list videos' },
      { status: 500 }
    );
  }
}
