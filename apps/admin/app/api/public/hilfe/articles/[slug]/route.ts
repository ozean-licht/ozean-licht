/**
 * Public Help Center Article by Slug API
 * No authentication required - for public visitors
 */
import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug, incrementViewCount } from '@/lib/db/knowledge-articles';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Only return published articles
    if (article.status !== 'published') {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Track view count (fire and forget)
    // eslint-disable-next-line no-console
    incrementViewCount(article.id).catch(console.error);

    return NextResponse.json({ article });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
