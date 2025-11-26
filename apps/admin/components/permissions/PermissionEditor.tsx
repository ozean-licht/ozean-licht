/**
 * PermissionEditor Component
 *
 * Edit user-specific permissions with visual inheritance indicators
 * Shows role defaults (gray) vs custom permissions (green/red)
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminUser, AdminPermission } from '@/types/admin';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription } from '@/lib/ui';
import { CategoryFilter } from './CategoryFilter';
import { PermissionCheckbox, PermissionCheckboxValue } from './PermissionCheckbox';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import { ROLE_CONFIG } from '@/lib/rbac/constants';
import { hasPermission } from '@/lib/rbac/permissions';
import { groupPermissionsByCategory, CATEGORY_METADATA } from '@/lib/rbac/permission-categories';
import { useToast } from '@/hooks/use-toast';

interface PermissionEditorProps {
  adminUser: AdminUser;
  permissions: AdminPermission[];
  onSave: (newPermissions: string[]) => Promise<void>;
}

export function PermissionEditor({ adminUser, permissions, onSave }: PermissionEditorProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPermissions, setCustomPermissions] = useState<string[]>(adminUser.permissions);
  const [isSaving, setIsSaving] = useState(false);

  // Get role default permissions
  const roleDefaults = ROLE_CONFIG[adminUser.adminRole]?.defaultPermissions || [];

  // Group permissions by category
  const permissionGroups = useMemo(() => {
    return groupPermissionsByCategory(permissions);
  }, [permissions]);

  // Filter by selected category
  const filteredGroups = useMemo(() => {
    if (!selectedCategory) return permissionGroups;
    return permissionGroups.filter((g) => g.category === selectedCategory);
  }, [permissionGroups, selectedCategory]);

  // Get categories with counts
  const categories = useMemo(() => {
    return permissionGroups.map((g) => g.category);
  }, [permissionGroups]);

  const permissionCounts = useMemo(() => {
    return permissionGroups.reduce((acc, g) => {
      acc[g.category] = g.permissions.length;
      return acc;
    }, {} as Record<string, number>);
  }, [permissionGroups]);

  // Determine checkbox value for each permission
  const getPermissionValue = (permissionKey: string): PermissionCheckboxValue => {
    // Check if permission is from role defaults
    const hasFromRole = hasPermission(roleDefaults, permissionKey);

    if (hasFromRole) {
      return 'inherited';
    }

    // Check if permission is custom granted
    if (customPermissions.includes(permissionKey)) {
      return 'granted';
    }

    // Otherwise it's denied (not granted)
    return 'denied';
  };

  // Handle permission toggle
  const handlePermissionChange = (permissionKey: string, newValue: PermissionCheckboxValue) => {
    setCustomPermissions((prev) => {
      if (newValue === 'granted') {
        // Add permission
        return [...prev, permissionKey];
      } else {
        // Remove permission
        return prev.filter((p) => p !== permissionKey);
      }
    });
  };

  // Reset to role defaults
  const handleReset = () => {
    setCustomPermissions([]);
    toast({
      title: 'Permissions reset',
      description: 'All custom permissions removed. User now has only role default permissions.',
    });
  };

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(customPermissions);
      toast({
        title: 'Permissions updated',
        description: 'User permissions have been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const original = adminUser.permissions.slice().sort();
    const current = customPermissions.slice().sort();
    return JSON.stringify(original) !== JSON.stringify(current);
  }, [adminUser.permissions, customPermissions]);

  // Count custom grants
  const customGrantCount = useMemo(() => {
    return customPermissions.filter((p) => !hasPermission(roleDefaults, p)).length;
  }, [customPermissions, roleDefaults]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{adminUser.adminRole}</strong> role grants{' '}
          <strong>{roleDefaults.join(', ') || 'no default permissions'}</strong>.
          {customGrantCount > 0 && (
            <span> This user has <strong>{customGrantCount} custom permission(s)</strong>.</span>
          )}
        </AlertDescription>
      </Alert>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          permissionCounts={permissionCounts}
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={customPermissions.length === 0}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Role Defaults
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Permission Groups */}
      <div className="space-y-4">
        {filteredGroups.map((group) => {
          const metadata = CATEGORY_METADATA[group.category];

          return (
            <Card key={group.category}>
              <CardHeader>
                <CardTitle className="text-base">
                  {metadata?.label || group.category}
                </CardTitle>
                <CardDescription>{metadata?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {group.permissions.map((permission) => (
                    <PermissionCheckbox
                      key={permission.permissionKey}
                      permission={permission.permissionKey}
                      label={permission.permissionLabel}
                      value={getPermissionValue(permission.permissionKey)}
                      onChange={(newValue) =>
                        handlePermissionChange(permission.permissionKey, newValue)
                      }
                      roleName={adminUser.adminRole}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No permissions found in this category.
        </div>
      )}
    </div>
  );
}
