'use client';

import Link from 'next/link';
import { CossUIButton, CossUIEmptyRoot, CossUIEmptyIcon, CossUIEmptyTitle, CossUIEmptyDescription, CossUIEmptyAction, CossUIFileIcon } from '@shared/ui';

export default function CourseNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <CossUIEmptyRoot className="text-center">
        <CossUIEmptyIcon>
          <CossUIFileIcon className="w-12 h-12 text-muted-foreground" />
        </CossUIEmptyIcon>
        <CossUIEmptyTitle>Course Not Found</CossUIEmptyTitle>
        <CossUIEmptyDescription>
          The course you are looking for does not exist or has been removed.
        </CossUIEmptyDescription>
        <CossUIEmptyAction>
          <Link href="/dashboard/courses">
            <CossUIButton>Back to Courses</CossUIButton>
          </Link>
        </CossUIEmptyAction>
      </CossUIEmptyRoot>
    </div>
  );
}
