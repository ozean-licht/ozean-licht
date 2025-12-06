import { redirect } from 'next/navigation';
import { requireAnyRole } from '@/lib/rbac/utils';

export default async function NewArticlePage() {
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);
  redirect('/dashboard/support/knowledge/editor');
}
