'use client';

import { Course } from '@/types/content';
import {
  CossUICard,
  CossUICardPanel,
} from '@shared/ui';
import Image from 'next/image';

interface CourseDetailHeaderProps {
  course: Course;
}

export default function CourseDetailHeader({ course }: CourseDetailHeaderProps) {

  return (
    <CossUICard className="bg-gradient-to-r from-card/80 to-card/40 backdrop-blur">
      <CossUICardPanel className="p-6">
        {/* Cover Image - Full width, 16:9 */}
        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden mb-6">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-6xl font-decorative text-primary/50">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content - Centered, max 720px */}
        <div className="flex flex-col items-center text-center">
          {/* Title and Description - max 720px */}
          <div className="max-w-[720px] space-y-3">
            <h1 className="text-3xl font-decorative text-white text-glow-subtle">
              {course.title}
            </h1>
            {course.shortDescription && (
              <p className="text-muted-foreground">
                {course.shortDescription}
              </p>
            )}
          </div>

          {/* Slug - Bigger and brighter */}
          {course.slug && (
            <span className="mt-3 text-base font-mono text-primary/70">
              /{course.slug}
            </span>
          )}

          {/* Price */}
          <div className="mt-4 text-sm">
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
          </div>
        </div>
      </CossUICardPanel>
    </CossUICard>
  );
}
