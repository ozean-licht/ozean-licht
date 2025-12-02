/**
 * All Tasks Page
 *
 * Server component that fetches all tasks and renders the client component.
 */

import { Suspense } from 'react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getAllTasks, getTaskStats } from '@/lib/db/tasks';
import { getAllProjects } from '@/lib/db/projects';
import TasksPageClient from './TasksPageClient';
import type { TaskItem } from '@/components/projects';

interface PageProps {
  searchParams: Promise<{
    status?: string;
    projectId?: string;
    search?: string;
    tab?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '50', 10);
  const offset = (page - 1) * limit;

  // Fetch tasks with filters
  const [tasksResult, stats, projectsResult] = await Promise.all([
    getAllTasks({
      status: params.status,
      projectId: params.projectId,
      search: params.search,
      tab: params.tab as 'active' | 'overdue' | 'planned' | 'done' | undefined,
      limit,
      offset,
      orderBy: 'created_at',
      orderDirection: 'desc',
    }),
    getTaskStats(),
    getAllProjects({ limit: 500 }), // Get all projects for filter dropdown
  ]);

  // Convert DBTask[] to TaskItem[] (they're compatible, just different type names)
  const tasks: TaskItem[] = tasksResult.tasks as TaskItem[];

  return (
    <Suspense fallback={<div className="animate-pulse">Loading tasks...</div>}>
      <TasksPageClient
        tasks={tasks}
        total={tasksResult.total}
        stats={stats}
        projects={projectsResult.projects}
        currentPage={page}
        pageSize={limit}
        filters={{
          status: params.status,
          projectId: params.projectId,
          search: params.search,
          tab: params.tab,
        }}
        user={{
          id: session.user.id || '',
          email: session.user.email || '',
          name: session.user.name || '',
        }}
      />
    </Suspense>
  );
}
