'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { ActionButton } from '@/components/admin/action-button';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { formatTableDateTime } from '@/lib/data-table/utils';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatTableDateTime(row.getValue('createdAt'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ActionButton
          action="edit"
          iconOnly
          onClick={() => console.log('Edit:', row.original)}
        />
        <ActionButton
          action="delete"
          iconOnly
          onClick={() => console.log('Delete:', row.original)}
        />
      </div>
    ),
  },
];
