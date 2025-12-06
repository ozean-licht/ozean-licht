/**
 * Category Tree API Route
 *
 * GET /api/categories/tree - Get full category tree (hierarchical structure)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCategoryTree } from '@/lib/db/categories';

/**
 * GET /api/categories/tree
 * Fetch hierarchical category tree structure
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tree = await getCategoryTree();

    return NextResponse.json({ tree });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch category tree:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category tree' },
      { status: 500 }
    );
  }
}
