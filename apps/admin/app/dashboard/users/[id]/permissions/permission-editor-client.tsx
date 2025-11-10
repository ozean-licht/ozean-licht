/**
 * Permission Editor Client Component
 *
 * Client-side wrapper for PermissionEditor to handle API calls
 */

'use client';

import { AdminUser, AdminPermission } from '@/types/admin';
import { PermissionEditor } from '@/components/permissions/PermissionEditor';
import { useRouter } from 'next/navigation';

interface PermissionEditorClientProps {
  adminUser: AdminUser;
  permissions: AdminPermission[];
}

export function PermissionEditorClient({
  adminUser,
  permissions,
}: PermissionEditorClientProps) {
  const router = useRouter();

  const handleSave = async (newPermissions: string[]) => {
    const response = await fetch(`/api/admin-users/${adminUser.id}/permissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions: newPermissions }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update permissions');
    }

    // Refresh the page to show updated permissions
    router.refresh();
  };

  return <PermissionEditor adminUser={adminUser} permissions={permissions} onSave={handleSave} />;
}
