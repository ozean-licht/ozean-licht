/**
 * Knowledge Base Articles API
 * GET - List all articles
 * POST - Create new article
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllArticles, createArticle } from '@/lib/db/knowledge-articles';
import { z } from 'zod';

const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().default('de'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | null;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const result = await getAllArticles({
      status: status || undefined,
      category: category || undefined,
      search: search || undefined,
      limit: 100,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = createArticleSchema.parse(body);

    const article = await createArticle(validated, session.user.adminUserId);

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
