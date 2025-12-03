/**
 * Task Comments API
 * GET /api/tasks/[id]/comments - List comments for task
 * POST /api/tasks/[id]/comments - Create comment on task
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCommentsByEntity, createComment } from '@/lib/db/comments';
import { getTaskById } from '@/lib/db/tasks';
import { createMentionNotifications, createCommentNotification } from '@/lib/db/notifications';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/[id]/comments
 * Fetch all comments for a task
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
    const comments = await getCommentsByEntity('task', id);
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
 * POST /api/tasks/[id]/comments
 * Create a new comment on a task
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
      entity_type: 'task',
      entity_id: id,
      content: body.content,
      author_name: session.user.name || undefined,
      author_email: session.user.email || undefined,
      parent_comment_id: body.parent_comment_id,
    });

    // Create notifications for @mentions
    if (mentionedUserIds && mentionedUserIds.length > 0 && session.user.id) {
      const task = await getTaskById(id);
      const taskTitle = task?.name || 'a task';
      await createMentionNotifications(
        mentionedUserIds,
        session.user.id,
        'task',
        id,
        taskTitle,
        `/dashboard/tools/tasks/${id}`
      );
    }

    // Notify task assignees about new comments (if not the commenter)
    // This is optional - skip if no session user id
    if (session.user.id) {
      const task = await getTaskById(id);
      if (task?.assignee_ids) {
        const assigneeIds = Array.isArray(task.assignee_ids)
          ? task.assignee_ids
          : typeof task.assignee_ids === 'string'
          ? JSON.parse(task.assignee_ids)
          : [];
        for (const assigneeId of assigneeIds) {
          if (assigneeId !== session.user.id && !mentionedUserIds?.includes(assigneeId)) {
            await createCommentNotification(
              assigneeId,
              session.user.id,
              'task',
              id,
              task.name || 'a task'
            );
          }
        }
      }
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
