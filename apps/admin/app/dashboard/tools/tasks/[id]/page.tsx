/**
 * Single Task Detail Page
 *
 * Server component that fetches task data and renders the client component.
 * Phase 8: Now includes parent task and subtasks.
 * Phase 11: Now includes attachments.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getTaskById, getSubtasks } from '@/lib/db/tasks';
import { getCommentsByEntity, getCommentCount } from '@/lib/db/comments';
import { getAttachmentsByTaskId } from '@/lib/db/attachments';
import TaskDetailClient from './TaskDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const { id } = await params;

  // Fetch task
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  // Fetch parent task if this is a subtask, subtasks, and attachments
  const [comments, commentCount, parentTask, subtasks, attachments] = await Promise.all([
    getCommentsByEntity('task', id),
    getCommentCount('task', id),
    task.parent_task_id ? getTaskById(task.parent_task_id) : Promise.resolve(null),
    getSubtasks(id),
    getAttachmentsByTaskId(id),
  ]);

  return (
    <Suspense fallback={<div className="animate-pulse">Loading task...</div>}>
      <TaskDetailClient
        task={task}
        comments={comments}
        commentCount={commentCount}
        user={{
          id: session.user.id || '',
          email: session.user.email || '',
          name: session.user.name || '',
          adminRole: (session.user as any).adminRole || '',
        }}
        parentTask={parentTask}
        initialSubtasks={subtasks}
        initialAttachments={attachments}
      />
    </Suspense>
  );
}
