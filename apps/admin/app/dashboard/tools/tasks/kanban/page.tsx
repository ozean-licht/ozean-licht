/**
 * Tasks Kanban View Page - Phase 3
 *
 * Server component that fetches tasks with assignments
 * and renders the Kanban board with real data.
 */

import { Suspense } from 'react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getAllTasks, getTaskStats } from '@/lib/db/tasks';
import { getAllProjects } from '@/lib/db/projects';
import { getTaskAssignments } from '@/lib/db/task-assignments';
import { query } from '@/lib/db';
import TasksKanban, { type KanbanTask } from '../TasksKanban';

// Get admin users for assignee filter (join with users table for email)
async function getAdminUsers(): Promise<Array<{ id: string; name: string; email: string }>> {
  const sql = `
    SELECT au.id, u.email as name, u.email
    FROM admin_users au
    JOIN users u ON au.user_id = u.id
    WHERE au.is_active = true
    ORDER BY u.email ASC
    LIMIT 100
  `;
  return query<{ id: string; name: string; email: string }>(sql);
}

export default async function TasksKanbanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all data in parallel
  const [tasksResult, stats, projectsResult, users] = await Promise.all([
    getAllTasks({
      limit: 100, // Show more tasks for kanban
      orderBy: 'updated_at',
      orderDirection: 'desc',
    }),
    getTaskStats(),
    getAllProjects({ limit: 500 }),
    getAdminUsers(),
  ]);

  // Get task assignments for all tasks (gracefully handle if table doesn't exist)
  const taskIds = tasksResult.tasks.map((t) => t.id);
  let allAssignments: Awaited<ReturnType<typeof getTaskAssignments>> = [];
  try {
    if (taskIds.length > 0) {
      allAssignments = await getTaskAssignments({ limit: 1000 });
    }
  } catch (error) {
    // task_assignments table may not exist yet - continue without assignments
    console.warn('[Kanban] Could not fetch task assignments:', error);
  }

  // Group assignments by task ID
  const assignmentsByTask = new Map<string, typeof allAssignments>();
  for (const assignment of allAssignments) {
    if (!assignmentsByTask.has(assignment.task_id)) {
      assignmentsByTask.set(assignment.task_id, []);
    }
    assignmentsByTask.get(assignment.task_id)!.push(assignment);
  }

  // Enrich tasks with assignments
  const tasksWithAssignments: KanbanTask[] = tasksResult.tasks.map((task) => ({
    ...task,
    assignee_ids: task.assignee_ids || [],
    assignments: (assignmentsByTask.get(task.id) || []).map((a) => ({
      id: a.id,
      user_name: a.user_name || undefined,
      role_name: a.role_name || undefined,
      role_color: a.role_color || undefined,
    })),
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-primary/10 rounded w-48 mb-4" />
            <div className="h-6 bg-primary/10 rounded w-64 mb-8" />
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-primary/10 rounded-2xl" />
              ))}
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-72 h-[500px] bg-primary/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <TasksKanban
        initialTasks={tasksWithAssignments}
        projects={projectsResult.projects}
        users={users}
        stats={stats}
      />
    </Suspense>
  );
}
