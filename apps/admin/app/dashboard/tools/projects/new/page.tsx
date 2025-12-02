/**
 * New Project Page
 *
 * Page for creating a new project, optionally from a template.
 */

import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth-utils';
import { getAllTemplates } from '@/lib/db/templates';
import NewProjectClient from './NewProjectClient';

interface PageProps {
  searchParams: Promise<{ template?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  // Ensure user is authenticated
  const session = await requireAuth();

  const { template: selectedTemplateId } = await searchParams;

  // Fetch templates
  const templatesResult = await getAllTemplates({ isActive: true, limit: 100 });

  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <NewProjectClient
        templates={templatesResult.templates}
        preselectedTemplateId={selectedTemplateId}
        user={{
          id: session.user.id || '',
          email: session.user.email || '',
          name: session.user.name || '',
        }}
      />
    </Suspense>
  );
}
