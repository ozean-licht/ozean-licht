/**
 * Public Help Center Articles API
 * No authentication required - for public visitors
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, searchArticles } from '@/lib/db/knowledge-articles';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    // If search query provided, use search function
    if (search && search.length >= 2) {
      const articles = await searchArticles(search, limit);
      // Filter to only published articles
      const publishedArticles = articles.filter(a => a.status === 'published');
      return NextResponse.json({ articles: publishedArticles });
    }

    // Otherwise, list published articles
    const result = await getAllArticles({
      status: 'published',
      category: category || undefined,
      limit,
    });

    return NextResponse.json({
      articles: result.articles,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching public articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
