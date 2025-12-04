/**
 * API: Knowledge Article Search
 * GET /api/support/knowledge/search - Full-text search for articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { searchArticles } from '@/lib/db/knowledge-articles';

/**
 * GET /api/support/knowledge/search
 * Full-text search for knowledge articles
 * Query params: q (search query), limit
 */
export async function GET(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Get search query
    const query = searchParams.get('q');
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Get limit (optional)
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '50', 10),
      100
    );

    // Validate limit
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      );
    }

    // Search articles
    const articles = await searchArticles(query.trim(), limit);

    return NextResponse.json({
      articles,
      total: articles.length,
      query: query.trim(),
    });
  } catch (error) {
    console.error('[API] Failed to search knowledge articles:', error);
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    );
  }
}
