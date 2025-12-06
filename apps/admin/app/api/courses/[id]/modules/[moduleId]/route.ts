/**
 * API: Single Module
 * GET /api/courses/[id]/modules/[moduleId] - Get module details
 * PATCH /api/courses/[id]/modules/[moduleId] - Update module
 * DELETE /api/courses/[id]/modules/[moduleId] - Delete module
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasAnyRole } from '@/lib/rbac/utils';
import { getModuleById, updateModule, deleteModule } from '@/lib/db/modules';

interface RouteParams {
  params: Promise<{ id: string; moduleId: string }>;
}

/**
 * GET /api/courses/[id]/modules/[moduleId]
 * Get module details
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;

    // Fetch module
    const courseModule = await getModuleById(moduleId);
    if (!courseModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json(courseModule);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get module:', error);
    return NextResponse.json(
      { error: 'Failed to get module' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/courses/[id]/modules/[moduleId]
 * Update module
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can update modules
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { moduleId } = await params;

    // Verify module exists
    const existingModule = await getModuleById(moduleId);
    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const { title, description, status } = body;

    // Validate fields if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title must be 200 characters or less' },
          { status: 400 }
        );
      }
    }

    if (status !== undefined && !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be draft or published' },
        { status: 400 }
      );
    }

    // Update module
    const updatedModule = await updateModule(moduleId, {
      title: title?.trim(),
      description: description !== undefined ? (description?.trim() || undefined) : undefined,
      status,
    });

    if (!updatedModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json(updatedModule);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id]/modules/[moduleId]
 * Delete module (cascades to lessons)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - only super_admin, ol_admin, ol_editor, and ol_content can delete modules
    if (!hasAnyRole(session, ['super_admin', 'ol_admin', 'ol_editor', 'ol_content'])) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { moduleId } = await params;

    // Verify module exists
    const existingModule = await getModuleById(moduleId);
    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Delete module
    const deleted = await deleteModule(moduleId);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}
