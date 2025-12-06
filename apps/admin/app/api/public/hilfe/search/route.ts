/**
 * Public Help Center Search API
 * No authentication required - for public visitors
 * Returns quick results for autocomplete
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/db/knowledge-articles';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Limit to 5 results for autocomplete
    const articles = await searchArticles(q, 5);

    // Filter to published only and return minimal data
    const results = articles
      .filter(a => a.status === 'published')
      .map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.summary?.slice(0, 100) || a.content.slice(0, 100),
        category: a.category,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
