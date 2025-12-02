/**
 * Single Task Detail Page
 *
 * Server component that fetches task data and renders the client component.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getTaskById } from '@/lib/db/tasks';
import { getCommentsByEntity, getCommentCount } from '@/lib/db/comments';
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

  const [comments, commentCount] = await Promise.all([
    getCommentsByEntity('task', id),
    getCommentCount('task', id),
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
      />
    </Suspense>
  );
}
