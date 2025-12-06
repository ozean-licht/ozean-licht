/**
 * Knowledge Base Article API
 * GET - Get single article
 * PATCH - Update article
 * DELETE - Delete article
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getArticleById,
  updateArticle,
  deleteArticle,
  publishArticle,
  archiveArticle
} from '@/lib/db/knowledge-articles';
import { z } from 'zod';
import { validateUUID, parsePostgresError } from '@/lib/utils/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateArticleSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  summary: z.string().max(500).optional().nullable().transform(v => v ?? undefined),
  category: z.string().max(100).optional().nullable().transform(v => v ?? undefined),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Article ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Article ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const body = await request.json();
    const validated = updateArticleSchema.parse(body);

    // Handle status changes with special functions
    if (validated.status === 'published') {
      const article = await publishArticle(id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      // If there are other updates, apply them too
      const { status: _status, ...otherUpdates } = validated;
      if (Object.keys(otherUpdates).length > 0) {
        await updateArticle(id, otherUpdates);
      }
      const updated = await getArticleById(id);
      return NextResponse.json({ article: updated });
    }

    if (validated.status === 'archived') {
      const article = await archiveArticle(id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ article });
    }

    const article = await updateArticle(id, validated);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error updating article:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Validate UUID
    const validation = validateUUID(id, 'Article ID');
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error!.message }, { status: validation.error!.status });
    }

    const deleted = await deleteArticle(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    const { message, status } = parsePostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
