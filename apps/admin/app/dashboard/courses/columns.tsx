'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Course, CourseStatus, CourseLevel } from '@/types/content';
import { formatPrice } from '@/types/commerce';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2, BookOpen, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/ui';

/**
 * Get badge config for course status
 */
function getStatusConfig(status: CourseStatus): { className: string; label: string } {
  const configs: Record<CourseStatus, { className: string; label: string }> = {
    published: {
      className: 'border bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
      label: 'Published',
    },
    draft: {
      className: 'border bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
      label: 'Draft',
    },
    archived: {
      className: 'border bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
      label: 'Archived',
    },
  };
  return configs[status] || configs.draft;
}

/**
 * Get badge config for course level
 */
function getLevelConfig(level: CourseLevel): { className: string; label: string } {
  const configs: Record<CourseLevel, { className: string; label: string }> = {
    beginner: {
      className: 'border bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
      label: 'Beginner',
    },
    intermediate: {
      className: 'border bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
      label: 'Intermediate',
    },
    advanced: {
      className: 'border bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
      label: 'Advanced',
    },
  };
  return configs[level] || configs.beginner;
}

/**
 * Format duration from minutes to readable string
 */
function formatDuration(minutes?: number): string {
  if (!minutes) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export const columns: ColumnDef<Course>[] = [
  {
    id: 'course',
    header: 'Course',
    cell: ({ row }) => {
      const course = row.original;

      return (
        <div className="flex items-center gap-3 min-w-[280px]">
          {/* Thumbnail */}
          <div className="w-16 h-10 rounded-md bg-muted flex-shrink-0 overflow-hidden">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <BookOpen className="h-5 w-5 text-primary/40" />
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-sm truncate">{course.title}</span>
            {course.shortDescription && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {course.shortDescription}
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
      const status = row.getValue('status') as CourseStatus;
      const config = getStatusConfig(status);
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === 'all' || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => {
      const level = row.getValue('level') as CourseLevel | undefined;
      if (!level) return <span className="text-muted-foreground">-</span>;
      const config = getLevelConfig(level);
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'priceCents',
    header: 'Price',
    cell: ({ row }) => {
      const priceCents = row.getValue('priceCents') as number;
      const currency = row.original.currency || 'EUR';
      if (priceCents === 0) {
        return (
          <Badge variant="outline" className="border bg-teal-500/20 text-teal-700 border-teal-500/30 dark:text-teal-400">
            Free
          </Badge>
        );
      }
      return <span className="font-medium">{formatPrice(priceCents, currency)}</span>;
    },
    enableSorting: true,
  },
  {
    id: 'lessons',
    header: 'Lessons',
    cell: ({ row }) => {
      const lessonCount = row.original.lessonCount ?? 0;
      const moduleCount = row.original.moduleCount ?? 0;
      return (
        <div className="text-sm">
          <span className="font-medium">{lessonCount}</span>
          {moduleCount > 0 && (
            <span className="text-muted-foreground text-xs ml-1">
              ({moduleCount} modules)
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'students',
    header: 'Students',
    cell: ({ row }) => {
      const enrollmentCount = row.original.enrollmentCount ?? 0;
      return (
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{enrollmentCount}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'durationMinutes',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('durationMinutes') as number | undefined;
      return <span className="text-muted-foreground">{formatDuration(duration)}</span>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString('de-AT')}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/courses/${course.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/courses/${course.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
