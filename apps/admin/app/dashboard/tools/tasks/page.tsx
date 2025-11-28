import { requireAnyRole } from '@/lib/rbac/utils';
import { Metadata } from 'next';
import TasksKanban from './TasksKanban';

export const metadata: Metadata = {
  title: 'Tasks | Admin Dashboard',
  description: 'Kanban board for task management across projects',
};

export default async function TasksPage() {
  // Require admin role for task management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_editor']);

  return <TasksKanban />;
}
