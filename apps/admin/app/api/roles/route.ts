/**
 * Project Roles API Route
 *
 * GET /api/roles - List all project roles
 * POST /api/roles - Create a new project role
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllProjectRoles, createProjectRole } from '@/lib/db/project-roles';
import { z } from 'zod';

// GET /api/roles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const roles = await getAllProjectRoles({
      isActive: isActive !== null ? isActive === 'true' : undefined,
    });

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Failed to fetch project roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project roles' },
      { status: 500 }
    );
  }
}

// Validation schema for creating project role
const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9_]+$/, 'Slug must be lowercase alphanumeric with underscores'),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  icon: z.string().max(50).optional(),
  permissions: z.record(z.boolean()).optional(),
  sort_order: z.number().int().min(0).optional(),
});

// POST /api/roles
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createRoleSchema.parse(body);

    const role = await createProjectRole({
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      color: validated.color,
      icon: validated.icon,
      permissions: validated.permissions,
      sort_order: validated.sort_order,
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create project role:', error);
    return NextResponse.json(
      { error: 'Failed to create project role' },
      { status: 500 }
    );
  }
}
