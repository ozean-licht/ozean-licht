/**
 * PermissionMatrix Component
 *
 * Displays permission matrix as a DataTable with role columns
 * Shows which permissions each role has (via checkmark or wildcard indicator)
 */

'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Check, Asterisk } from 'lucide-react';
import { AdminRole } from '@/types/admin';
import { PermissionMatrixRow } from '@/lib/rbac/permissions';
import { CategoryFilter } from './CategoryFilter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CATEGORY_METADATA } from '@/lib/rbac/permission-categories';

interface PermissionMatrixProps {
  permissions: PermissionMatrixRow[];
  roles: AdminRole[];
}

export function PermissionMatrix({ permissions, roles }: PermissionMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter permissions by selected category
  const filteredPermissions = useMemo(() => {
    if (!selectedCategory) return permissions;
    return permissions.filter((p) => p.category === selectedCategory);
  }, [permissions, selectedCategory]);

  // Get unique categories with counts
  const categories = useMemo(() => {
    const cats = [...new Set(permissions.map((p) => p.category).filter(Boolean))] as string[];
    return cats.sort();
  }, [permissions]);

  const permissionCounts = useMemo(() => {
    return permissions.reduce((acc, p) => {
      const cat = p.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [permissions]);

  // Define table columns
  const columns: ColumnDef<PermissionMatrixRow>[] = useMemo(() => {
    const baseColumns: ColumnDef<PermissionMatrixRow>[] = [
      {
        accessorKey: 'permissionLabel',
        header: 'Permission',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.permissionLabel}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.permissionKey}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const category = row.original.category;
          if (!category) return <span className="text-gray-400">-</span>;

          const metadata = CATEGORY_METADATA[category];
          return (
            <Badge variant="outline" className="font-normal">
              {metadata?.label || category}
            </Badge>
          );
        },
      },
    ];

    // Add role columns
    const roleColumns: ColumnDef<PermissionMatrixRow>[] = roles.map((role) => ({
      accessorKey: `rolePermissions.${role}`,
      header: () => {
        const roleLabels: Record<AdminRole, string> = {
          super_admin: 'Super Admin',
          ol_admin: 'OL Admin',
          ol_editor: 'Content Editor',
          support: 'Support',
        };
        return <div className="text-center">{roleLabels[role]}</div>;
      },
      cell: ({ row }) => {
        const hasPermission = row.original.rolePermissions[role];

        if (hasPermission === 'wildcard') {
          return (
            <div className="flex justify-center" title="Wildcard grant">
              <Asterisk className="h-4 w-4 text-yellow-600" />
            </div>
          );
        }

        if (hasPermission) {
          return (
            <div className="flex justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <span className="text-gray-300">-</span>
          </div>
        );
      },
    }));

    return [...baseColumns, ...roleColumns];
  }, [roles]);

  // CSV Export function
  const handleExportCSV = () => {
    const headers = [
      'Permission',
      'Category',
      'Entity Scope',
      ...roles.map((r) => {
        const labels: Record<AdminRole, string> = {
          super_admin: 'Super Admin',
          ol_admin: 'OL Admin',
          ol_editor: 'Content Editor',
          support: 'Support',
        };
        return labels[r];
      }),
    ];

    const rows = filteredPermissions.map((p) => [
      p.permissionKey,
      p.category || '',
      p.entityScope || '',
      ...roles.map((role) => {
        const has = p.rolePermissions[role];
        if (has === 'wildcard') return '✓*';
        if (has) return '✓';
        return '✗';
      }),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permission-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          permissionCounts={permissionCounts}
        />

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Permission Matrix Table */}
      <DataTable
        columns={columns}
        data={filteredPermissions}
      />

      {/* Summary */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPermissions.length} of {permissions.length} permissions
      </div>
    </div>
  );
}
