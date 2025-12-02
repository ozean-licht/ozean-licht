/**
 * Single Comment API
 * PATCH /api/comments/[id] - Update comment
 * DELETE /api/comments/[id] - Delete comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { updateComment, deleteComment } from '@/lib/db/comments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/comments/[id]
 * Update comment content (only by author)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const comment = await updateComment(id, body.content, session.user.email);

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found or you are not the author' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments/[id]
 * Delete comment (by author or admin)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if user is admin (has super_admin or ol_admin role)
    const isAdmin = session.user.adminRole === 'super_admin' || session.user.adminRole === 'ol_admin';

    const deleted = await deleteComment(id, session.user.email, isAdmin);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Comment not found or you are not authorized to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
