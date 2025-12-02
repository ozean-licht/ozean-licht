/**
 * Single Project Detail Page
 *
 * Server component that fetches project data and renders the client component.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getProjectById } from '@/lib/db/projects';
import { getTasksByProjectId } from '@/lib/db/tasks';
import { getCommentsByEntity, getCommentCount } from '@/lib/db/comments';
import ProjectDetailClient from './ProjectDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const { id } = await params;

  // Fetch project with tasks
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const [tasks, comments, commentCount] = await Promise.all([
    getTasksByProjectId(id),
    getCommentsByEntity('project', id),
    getCommentCount('project', id),
  ]);

  return (
    <Suspense fallback={<div className="animate-pulse">Loading project...</div>}>
      <ProjectDetailClient
        project={project}
        tasks={tasks}
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
