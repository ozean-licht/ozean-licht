/**
 * Messages Section Layout
 *
 * Wraps all team messaging pages with RBAC checks.
 * Accessible to admins and moderators.
 */

import { requireAnyRole } from '@/lib/rbac/utils';

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require messaging access roles (use available AdminRole values)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_editor', 'ol_content', 'support']);

  return <>{children}</>;
}
