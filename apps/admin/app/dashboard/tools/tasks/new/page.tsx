/**
 * New Task Page
 *
 * Server component that renders the task creation form.
 * This route takes precedence over the dynamic [id] route.
 */

import { Suspense } from 'react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getAllProjects } from '@/lib/db/projects';
import NewTaskClient from './NewTaskClient';

export default async function NewTaskPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all projects for the dropdown
  const projectsResult = await getAllProjects({ limit: 500 });

  return (
    <Suspense fallback={<div className="animate-pulse">Loading form...</div>}>
      <NewTaskClient
        projects={projectsResult.projects}
        user={{
          id: session.user.id || '',
          email: session.user.email || '',
          name: session.user.name || '',
        }}
      />
    </Suspense>
  );
}
