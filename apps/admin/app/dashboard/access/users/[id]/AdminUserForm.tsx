'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types/admin';
import { RoleSelect } from '@/components/rbac/RoleSelect';
import { RoleBadge } from '@/components/rbac/RoleBadge';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/lib/hooks/useToast';

interface AdminUserFormProps {
  adminUser: AdminUser;
  canEdit: boolean;
  currentUserAdminId: string;
}

export function AdminUserForm({ adminUser, canEdit, currentUserAdminId }: AdminUserFormProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminRole, setAdminRole] = useState(adminUser.adminRole);
  const [entityScope, setEntityScope] = useState<string | null>(adminUser.entityScope);

  const isSelfEdit = adminUser.id === currentUserAdminId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canEdit) {
      showError('You do not have permission to edit admin users.');
      return;
    }

    if (isSelfEdit) {
      showError('You cannot change your own role.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin-users/${adminUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminRole,
          entityScope,
          oldRole: adminUser.adminRole, // For audit log
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin user');
      }

      success('Admin user updated successfully.');
      router.refresh();
    } catch (_error) {
      // Error already displayed via toast
      showError('Failed to update admin user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border p-6 space-y-4">
        <div className="space-y-2">
          <Label>User ID</Label>
          <div className="font-mono text-sm text-muted-foreground">
            {adminUser.userId}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminRole">Admin Role</Label>
          {canEdit && !isSelfEdit ? (
            <RoleSelect
              value={adminRole}
              onChange={setAdminRole}
              disabled={isLoading}
            />
          ) : (
            <div>
              <RoleBadge role={adminRole} />
              {isSelfEdit && (
                <p className="text-xs text-muted-foreground mt-1">
                  You cannot change your own role
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="entityScope">Entity Scope</Label>
          {canEdit && !isSelfEdit ? (
            <Select
              value={entityScope || 'all'}
              onValueChange={(val) => setEntityScope(val === 'all' ? null : val)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
                <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div>
              {entityScope ? (
                <EntityBadge entity={entityScope as 'kids_ascension' | 'ozean_licht'} />
              ) : (
                <span className="text-sm text-muted-foreground">All Entities</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="text-sm">
            {adminUser.isActive ? (
              <span className="text-green-600 font-medium">Active</span>
            ) : (
              <span className="text-red-600 font-medium">Inactive</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Last Login</Label>
          <div className="text-sm text-muted-foreground">
            {adminUser.lastLoginAt
              ? new Date(adminUser.lastLoginAt).toLocaleString()
              : 'Never'}
          </div>
        </div>
      </div>

      {canEdit && !isSelfEdit && (
        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
