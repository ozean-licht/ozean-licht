'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Video } from '@/types/content';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Video as VideoIcon, Play, Clock, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

/**
 * Format duration from seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds?: number): string {
  if (!seconds) return '—';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get badge variant and label for video status
 */
function getStatusConfig(status: Video['status']): { variant: 'default' | 'secondary' | 'outline'; label: string; className: string } {
  switch (status) {
    case 'published':
      return {
        variant: 'default',
        label: 'Published',
        className: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400'
      };
    case 'draft':
      return {
        variant: 'secondary',
        label: 'Draft',
        className: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400'
      };
    case 'archived':
      return {
        variant: 'outline',
        label: 'Archived',
        className: 'bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400'
      };
    default:
      return {
        variant: 'outline',
        label: status,
        className: ''
      };
  }
}

export const columns: ColumnDef<Video>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const video = row.original;
      const thumbnailUrl = video.thumbnailUrl;

      return (
        <div className="flex items-center gap-3">
          {thumbnailUrl ? (
            <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded border">
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
                sizes="80px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-5 w-5 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex h-12 w-20 flex-shrink-0 items-center justify-center rounded border bg-muted">
              <VideoIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{video.title}</span>
            {video.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {video.description}
              </span>
            )}
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = getStatusConfig(status);

      return (
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.status === value;
    },
  },
  {
    accessorKey: 'durationSeconds',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.original.durationSeconds;

      return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(duration)}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const dateString = row.original.createdAt;
      const date = new Date(dateString);
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
      const video = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/content/videos/${video.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/content/videos/${video.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
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
                <Link href={`/dashboard/content/videos/${video.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/content/videos/${video.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Video
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(video.id)}
              >
                Copy Video ID
              </DropdownMenuItem>
              {video.videoUrl && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(video.videoUrl!)}
                >
                  Copy Video URL
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log('Delete video:', video.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
