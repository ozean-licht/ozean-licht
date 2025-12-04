/**
 * API: Knowledge Article Categories
 * GET /api/support/knowledge/categories - Get unique article categories
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCategories } from '@/lib/db/knowledge-articles';

/**
 * GET /api/support/knowledge/categories
 * Get unique categories from published articles
 * No auth required for public articles (returns only published categories)
 */
export async function GET(_request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get categories (only from published articles)
    const categories = await getCategories();

    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('[API] Failed to fetch knowledge article categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
