'use client';

import { Course } from '@/types/content';
import { Badge } from '@/lib/ui';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

interface CourseDetailHeaderProps {
  course: Course;
}

/**
 * Get badge config for course status
 */
function getStatusConfig(status: string): { className: string; label: string } {
  const configs: Record<string, { className: string; label: string }> = {
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
 */
function getCategoryConfig(category: string | undefined): { className: string; label: string } | null {
  if (!category) return null;

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
  return configs[category] || { className: 'border bg-gray-500/20 text-gray-600 border-gray-500/30', label: category };
}

function formatPrice(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(amount);
}

export default function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  const statusConfig = getStatusConfig(course.status);
  const categoryConfig = getCategoryConfig(course.category);

  return (
    <div className="space-y-6">
      {/* Cover Image - Standalone, max 720px, centered */}
      <div className="mx-auto max-w-[720px]">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden border border-primary/20">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary/40" />
            </div>
          )}
        </div>
      </div>

      {/* Content - Centered, no box */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Title */}
        <h1 className="text-3xl font-decorative text-white text-glow-subtle max-w-[720px]">
          {course.title}
        </h1>

        {/* Short Description */}
        {course.shortDescription && (
          <p className="text-muted-foreground max-w-[720px]">
            {course.shortDescription}
          </p>
        )}

        {/* Slug */}
        {course.slug && (
          <span className="text-base font-mono text-primary/70">
            /{course.slug}
          </span>
        )}

        {/* Badges - Status, Category, Price */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
          {categoryConfig && (
            <Badge variant="outline" className={categoryConfig.className}>
              {categoryConfig.label}
            </Badge>
          )}
          {course.priceCents === 0 ? (
            <Badge variant="outline" className="border bg-teal-500/20 text-teal-700 border-teal-500/30 dark:text-teal-400">
              Free
            </Badge>
          ) : (
            <Badge variant="outline" className="border bg-emerald-500/20 text-emerald-700 border-emerald-500/30 dark:text-emerald-400">
              {formatPrice(course.priceCents, course.currency)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
