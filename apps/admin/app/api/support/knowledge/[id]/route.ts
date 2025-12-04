/**
 * API: Single Knowledge Article Operations
 * GET /api/support/knowledge/[id] - Fetch article by ID
 * PATCH /api/support/knowledge/[id] - Update article
 * DELETE /api/support/knowledge/[id] - Archive article
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getArticleById,
  updateArticle,
  archiveArticle,
} from '@/lib/db/knowledge-articles';
import type { ArticleStatus } from '@/types/support';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/support/knowledge/[id]
 * Fetch a single article by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID format' },
        { status: 400 }
      );
    }

    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[API] Failed to fetch knowledge article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/support/knowledge/[id]
 * Update an article by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Role check - only admins can update articles
  const allowedRoles = ['super_admin', 'ol_admin', 'ka_admin'];
  if (!allowedRoles.includes(session.user.adminRole || '')) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID format' },
        { status: 400 }
      );
    }

    // Check if article exists
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate fields if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      body.title = body.title.trim();
    }

    if (body.content !== undefined) {
      if (typeof body.content !== 'string' || body.content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Content must be a non-empty string' },
          { status: 400 }
        );
      }
      body.content = body.content.trim();
    }

    if (body.summary !== undefined) {
      if (typeof body.summary !== 'string') {
        return NextResponse.json(
          { error: 'Summary must be a string' },
          { status: 400 }
        );
      }
      body.summary = body.summary.trim() || undefined;
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string') {
        return NextResponse.json(
          { error: 'Category must be a string' },
          { status: 400 }
        );
      }
      body.category = body.category.trim() || undefined;
    }

    if (body.tags !== undefined && !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array of strings' },
        { status: 400 }
      );
    }

    if (body.language !== undefined && typeof body.language !== 'string') {
      return NextResponse.json(
        { error: 'Language must be a string' },
        { status: 400 }
      );
    }

    if (body.status !== undefined) {
      const validStatuses: ArticleStatus[] = ['draft', 'published', 'archived'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status value. Must be: draft, published, or archived' },
          { status: 400 }
        );
      }
    }

    // Update article
    const article = await updateArticle(id, body);

    if (!article) {
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[API] Failed to update knowledge article:', error);

    // Handle duplicate slug errors
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'An article with this title already exists (slug conflict)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/support/knowledge/[id]
 * Archive an article (soft delete - sets status to 'archived')
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Role check - only admins can delete articles
  const allowedRoles = ['super_admin', 'ol_admin', 'ka_admin'];
  if (!allowedRoles.includes(session.user.adminRole || '')) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID format' },
        { status: 400 }
      );
    }

    // Check if article exists
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Archive the article (soft delete)
    const archived = await archiveArticle(id);

    if (!archived) {
      return NextResponse.json(
        { error: 'Failed to archive article' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Article archived successfully',
      article: archived,
    });
  } catch (error) {
    console.error('[API] Failed to archive knowledge article:', error);
    return NextResponse.json(
      { error: 'Failed to archive article' },
      { status: 500 }
    );
  }
}
