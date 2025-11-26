import { requireAuth } from '@/lib/auth-utils';
import { Metadata } from 'next';
import ProjectsDashboard from './ProjectsDashboard';

export const metadata: Metadata = {
  title: 'Projects - Admin Dashboard',
  description: 'Project management dashboard for Ozean Licht ecosystem',
};

export default async function ProjectsPage() {
  // Ensure user is authenticated
  const session = await requireAuth();
  const { user } = session;

  return <ProjectsDashboard user={user} />;
}
