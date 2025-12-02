/**
 * Categories API Route
 *
 * GET /api/categories - List all categories (with optional filters)
 * POST /api/categories - Create a new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllCategories, createCategory, getCategoryTree } from '@/lib/db/categories';
import { z } from 'zod';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_id');
    const tree = searchParams.get('tree') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // If tree format is requested, return hierarchical structure
    if (tree) {
      const treeData = await getCategoryTree();
      return NextResponse.json({ tree: treeData });
    }

    // Otherwise return flat list with filters
    const categories = await getAllCategories({
      parentId: parentId === 'null' ? null : parentId || undefined,
      isActive: includeInactive ? undefined : true,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Validation schema for creating category
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().max(1000).optional(),
  parent_id: z.string().uuid().optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  icon: z.string().max(50).optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createCategorySchema.parse(body);

    const category = await createCategory({
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      parent_id: validated.parent_id || undefined,
      color: validated.color,
      icon: validated.icon || undefined,
      sort_order: validated.sort_order,
      is_active: validated.is_active,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
