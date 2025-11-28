'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  CossUIAlert,
  CossUIAlertTitle,
  CossUIAlertDescription,
  CossUIButton,
  CossUICard,
  CossUICardPanel,
} from '@shared/ui';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CourseDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Course detail error:', error);
  }, [error]);

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

      {/* Error Card */}
      <CossUICard className="max-w-2xl mx-auto">
        <CossUICardPanel className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="text-muted-foreground">
                We encountered an error while loading this course. This could be due to a network
                issue or a problem with the course data.
              </p>
            </div>

            {/* Error Details */}
            <CossUIAlert variant="destructive" className="w-full text-left">
              <CossUIAlertTitle>Error Details</CossUIAlertTitle>
              <CossUIAlertDescription className="font-mono text-sm">
                {error.message || 'An unexpected error occurred'}
                {error.digest && (
                  <div className="mt-2 text-xs opacity-70">Error ID: {error.digest}</div>
                )}
              </CossUIAlertDescription>
            </CossUIAlert>

            {/* Actions */}
            <div className="flex gap-3">
              <CossUIButton onClick={reset} variant="default">
                Try Again
              </CossUIButton>
              <CossUIButton asChild variant="outline">
                <Link href="/dashboard/courses">Back to Courses</Link>
              </CossUIButton>
            </div>
          </div>
        </CossUICardPanel>
      </CossUICard>
    </div>
  );
}
