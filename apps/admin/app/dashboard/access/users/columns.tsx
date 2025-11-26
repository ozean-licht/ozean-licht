'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User, EntityType } from '@/types/user';
import { EntityBadge } from '@/components/rbac/EntityBadge';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, CheckCircle2, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.email}</span>
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.id.substring(0, 8)}...
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'entities',
    header: 'Platform Access',
    cell: ({ row }) => {
      const entities = row.original.entities;

      if (entities.length === 0) {
        return <span className="text-sm text-muted-foreground">None</span>;
      }

      return (
        <div className="flex items-center gap-1">
          {entities.map((entity) => (
            <EntityBadge
              key={entity.id}
              entity={entity.entityId}
              compact
            />
          ))}
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, _id, value) => {
      // Custom filter function for entity filtering
      const entities = row.original.entities;
      const entityIds = entities.map((e) => e.entityId);

      if (value === 'all') return true;
      if (value === 'both') return entityIds.length === 2;
      return entityIds.includes(value as EntityType);
    },
  },
  {
    accessorKey: 'emailVerified',
    header: 'Email Status',
    cell: ({ row }) => {
      const verified = row.original.emailVerified;
      return verified ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1">
          <XCircle className="h-3 w-3" />
          Unverified
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.emailVerified === (value === 'verified');
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Registered',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      // Use fixed format to avoid hydration mismatch between server/client locales
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/users/${user.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/users/${user.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
