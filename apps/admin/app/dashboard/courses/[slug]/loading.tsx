import Link from 'next/link';
import {
  Card,
  CardPanel,
  Skeleton,
} from '@/lib/ui';
import { ArrowLeft } from 'lucide-react';

export default function CourseDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header Skeleton */}
      <Card>
        <CardPanel className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <Skeleton className="h-8 w-2/3" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Meta Info */}
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardPanel>
      </Card>

      {/* Stats Row Skeleton - 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card/50">
            <CardPanel className="p-4">
              <div className="flex items-center gap-3">
                {/* Icon skeleton */}
                <Skeleton className="h-9 w-9 rounded-lg" />

                {/* Content skeleton */}
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardPanel>
          </Card>
        ))}
      </div>

      {/* Modules Section Skeleton */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Module Cards - 3 skeleton modules */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardPanel className="p-4">
                <div className="space-y-3">
                  {/* Module Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>

                  {/* Module Stats */}
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  {/* Lessons Skeleton - 2 lessons per module */}
                  <div className="ml-4 space-y-2 pt-2 border-t">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardPanel>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
