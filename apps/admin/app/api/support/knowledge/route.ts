/**
 * API: Knowledge Base Articles
 * GET /api/support/knowledge - List articles with filters and pagination
 * POST /api/support/knowledge - Create a new article (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllArticles, createArticle } from '@/lib/db/knowledge-articles';
import type { ArticleStatus } from '@/types/support';

/**
 * GET /api/support/knowledge
 * List articles with filtering and pagination
 * Query params: status, category, search, limit, offset
 */
export async function GET(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const status = searchParams.get('status') as ArticleStatus | null;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate status if provided
    if (status && !['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be: draft, published, or archived' },
        { status: 400 }
      );
    }

    // Get articles
    const result = await getAllArticles({
      status: status || undefined,
      category: category || undefined,
      search: search || undefined,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Failed to list knowledge articles:', error);
    return NextResponse.json(
      { error: 'Failed to list articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support/knowledge
 * Create a new knowledge article (admin only)
 */
export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Role check - only admins can create articles
  const allowedRoles = ['super_admin', 'ol_admin', 'ka_admin'];
  if (!allowedRoles.includes(session.user.adminRole || '')) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (body.status && !['draft', 'published', 'archived'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be: draft, published, or archived' },
        { status: 400 }
      );
    }

    // Validate tags if provided
    if (body.tags && !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array of strings' },
        { status: 400 }
      );
    }

    // Validate language if provided
    if (body.language && typeof body.language !== 'string') {
      return NextResponse.json(
        { error: 'Language must be a string' },
        { status: 400 }
      );
    }

    // Create article
    const article = await createArticle(
      {
        title: body.title.trim(),
        content: body.content.trim(),
        summary: body.summary?.trim() || undefined,
        category: body.category?.trim() || undefined,
        tags: body.tags || [],
        language: body.language || 'de',
        status: body.status || 'draft',
      },
      session.user.adminUserId
    );

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('[API] Failed to create knowledge article:', error);

    // Handle duplicate slug errors
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'An article with this title already exists (slug conflict)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
