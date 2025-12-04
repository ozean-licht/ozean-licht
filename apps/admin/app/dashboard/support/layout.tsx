/**
 * Support Section Layout
 *
 * Wraps all support management pages with RBAC checks.
 * Only accessible to super_admin, ol_admin, and support roles.
 */

import { requireAnyRole } from '@/lib/rbac/utils';

export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require support access roles
  await requireAnyRole(['super_admin', 'ol_admin', 'support']);

  return <>{children}</>;
}
