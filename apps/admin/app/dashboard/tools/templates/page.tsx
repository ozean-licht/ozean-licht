import { requireAnyRole } from '@/lib/rbac/utils';
import { Metadata } from 'next';
import TemplatesDashboard from './TemplatesDashboard';

export const metadata: Metadata = {
  title: 'Process Templates - Admin Dashboard',
  description: 'Process template management dashboard for Ozean Licht ecosystem',
};

export default async function TemplatesPage() {
  // Require admin role for template management
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_editor']);

  return <TemplatesDashboard />;
}
