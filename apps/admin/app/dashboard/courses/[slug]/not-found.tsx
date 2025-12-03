'use client';

import Link from 'next/link';
import { Button } from '@/lib/ui';
import { FileQuestion } from 'lucide-react';

export default function CourseNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <FileQuestion className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Course Not Found</h2>
        <p className="text-muted-foreground">
          The course you are looking for does not exist or has been removed.
        </p>
        <div>
          <Link href="/dashboard/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
