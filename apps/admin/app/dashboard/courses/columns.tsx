'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Course, CourseStatus } from '@/types/content';
import { formatPrice } from '@/types/commerce';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import { MoreHorizontal, Eye, Edit, Trash2, BookOpen, Users, Layers } from 'lucide-react';
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
 * Get badge config for course category
 * Colors: New=Primary, Interview=Green, Aufbau=Indigo, Kostenlos=Orange,
 *         LCQ=Yellow, Q&A=Turquoise, Basis=Blue, Fortgeschritten=Purple, Master=Red
 */
function getCategoryConfig(category: string | undefined): { className: string; label: string } {
  const configs: Record<string, { className: string; label: string }> = {
    New: {
      className: 'border bg-primary/20 text-primary border-primary/30',
      label: 'New',
    },
    Basis: {
      className: 'border bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
      label: 'Basis',
    },
    LCQ: {
      className: 'border bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
      label: 'LCQ',
    },
    Interview: {
      className: 'border bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
      label: 'Interview',
    },
    'Q&A': {
      className: 'border bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:text-cyan-400',
      label: 'Q&A',
    },
    Kostenlos: {
      className: 'border bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
      label: 'Kostenlos',
    },
    Aufbau: {
      className: 'border bg-indigo-500/20 text-indigo-700 border-indigo-500/30 dark:text-indigo-400',
      label: 'Aufbau',
    },
    Master: {
      className: 'border bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
      label: 'Master',
    },
    Fortgeschritten: {
      className: 'border bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
      label: 'Fortgeschritten',
    },
  };
  return configs[category || ''] || { className: 'border bg-gray-500/20 text-gray-600 border-gray-500/30', label: category || '-' };
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) return <span className="text-muted-foreground">-</span>;
      const config = getCategoryConfig(category);
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === 'all' || row.original.category === value;
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
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt') as string);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      let display: string;
      if (diffMins < 60) {
        display = `${diffMins} min ago`;
      } else if (diffHours < 24) {
        display = `${diffHours} hours ago`;
      } else {
        display = date.toLocaleString('de-AT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return <span className="text-sm text-muted-foreground whitespace-nowrap">{display}</span>;
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
              <Link href={`/dashboard/courses/${course.slug}`}>
                <Layers className="mr-2 h-4 w-4" />
                Manage Content
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/courses/${course.slug}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled>
              <span>
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </span>
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
