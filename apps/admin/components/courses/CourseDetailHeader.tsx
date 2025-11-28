'use client';

import { Course } from '@/types/content';
import {
  CossUICard,
  CossUICardPanel,
  CossUIBadge,
  CossUIButton,
} from '@shared/ui';
import { Edit } from 'lucide-react';
import Image from 'next/image';

interface CourseDetailHeaderProps {
  course: Course;
  onEdit?: () => void;
}

export default function CourseDetailHeader({ course, onEdit }: CourseDetailHeaderProps) {
  const statusVariant = {
    draft: 'secondary',
    published: 'default',
    archived: 'outline',
  }[course.status] as 'secondary' | 'default' | 'outline';

  const levelVariant = {
    beginner: 'secondary',
    intermediate: 'default',
    advanced: 'destructive',
  }[course.level || 'beginner'] as 'secondary' | 'default' | 'destructive';

  return (
    <CossUICard className="bg-gradient-to-r from-card/80 to-card/40 backdrop-blur">
      <CossUICardPanel className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-64 h-40 md:h-36 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                width={256}
                height={144}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-4xl font-decorative text-primary/50">
                  {course.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CossUIBadge variant={statusVariant} className="capitalize">
                    {course.status}
                  </CossUIBadge>
                  {course.level && (
                    <CossUIBadge variant={levelVariant} className="capitalize">
                      {course.level}
                    </CossUIBadge>
                  )}
                  {course.category && (
                    <CossUIBadge variant="outline">{course.category}</CossUIBadge>
                  )}
                </div>
                <h1 className="text-3xl font-decorative text-white text-glow-subtle">
                  {course.title}
                </h1>
                {course.shortDescription && (
                  <p className="text-muted-foreground line-clamp-2">
                    {course.shortDescription}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <CossUIButton
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  disabled={!onEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </CossUIButton>
              </div>
            </div>

            {/* Price and Metadata */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {course.priceCents > 0 ? (
                <span className="font-medium text-foreground">
                  {(course.priceCents / 100).toLocaleString('de-AT', {
                    style: 'currency',
                    currency: course.currency || 'EUR',
                  })}
                </span>
              ) : (
                <span className="text-green-500 font-medium">Free</span>
              )}
              {course.durationMinutes && (
                <span>
                  {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m total
                </span>
              )}
              {course.slug && (
                <span className="text-xs font-mono text-muted-foreground/60">
                  /{course.slug}
                </span>
              )}
            </div>
          </div>
        </div>
      </CossUICardPanel>
    </CossUICard>
  );
}
