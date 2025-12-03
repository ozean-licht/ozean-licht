/**
 * Project Comments API
 * GET /api/projects/[id]/comments - List comments for project
 * POST /api/projects/[id]/comments - Create comment on project
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCommentsByEntity, createComment } from '@/lib/db/comments';
import { getProjectById } from '@/lib/db/projects';
import { createMentionNotifications } from '@/lib/db/notifications';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]/comments
 * Fetch all comments for a project
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const comments = await getCommentsByEntity('project', id);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/comments
 * Create a new comment on a project
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
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

    // Validate mentioned_user_ids if provided
    const mentionedUserIds = body.mentioned_user_ids as string[] | undefined;
    if (mentionedUserIds !== undefined) {
      if (!Array.isArray(mentionedUserIds)) {
        return NextResponse.json(
          { error: 'mentioned_user_ids must be an array' },
          { status: 400 }
        );
      }
      if (mentionedUserIds.length > 20) {
        return NextResponse.json(
          { error: 'Cannot mention more than 20 users' },
          { status: 400 }
        );
      }
      // Validate UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const invalidIds = mentionedUserIds.filter(id => typeof id !== 'string' || !uuidRegex.test(id));
      if (invalidIds.length > 0) {
        return NextResponse.json(
          { error: 'Invalid user IDs in mentioned_user_ids' },
          { status: 400 }
        );
      }
    }

    const comment = await createComment({
      entity_type: 'project',
      entity_id: id,
      content: body.content,
      author_name: session.user.name || undefined,
      author_email: session.user.email || undefined,
      parent_comment_id: body.parent_comment_id,
    });

    // Create notifications for @mentions
    if (mentionedUserIds && mentionedUserIds.length > 0 && session.user.id) {
      const project = await getProjectById(id);
      const projectTitle = project?.title || 'a project';
      await createMentionNotifications(
        mentionedUserIds,
        session.user.id,
        'project',
        id,
        projectTitle,
        `/dashboard/tools/projects/${id}`
      );
    }

    // Note: Project owner notifications could be added once owner_id is available in DBProject
    // Currently the assignee_ids array could be used to notify project team members

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
