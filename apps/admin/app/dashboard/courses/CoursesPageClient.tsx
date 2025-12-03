'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CoursesDataTable from './CoursesDataTable';
import CoursesGallery from './CoursesGallery';
import CreateCourseModal from '@/components/courses/CreateCourseModal';
import { Course } from '@/types/content';
import { Button } from '@/lib/ui';
import { Plus } from 'lucide-react';

interface CoursesPageClientProps {
  initialCourses: Course[];
  initialTotal: number;
  error?: string | null;
}

export default function CoursesPageClient({ initialCourses, initialTotal, error: _error }: CoursesPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<'list' | 'gallery'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Parse filters from URL
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';

  // Filter courses client-side for quick filtering
  const filteredCourses = useMemo(() => {
    let result = [...initialCourses];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower) ||
          c.shortDescription?.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      result = result.filter((c) => c.status === status);
    }

    if (category && category !== 'all') {
      result = result.filter((c) => c.category === category);
    }

    return result;
  }, [initialCourses, search, status, category]);

  const total = filteredCourses.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-decorative text-white text-glow-subtle">Courses</h1>
          <p className="text-muted-foreground">
            {initialTotal > 0
              ? `${initialTotal} courses from database`
              : 'Manage your educational content'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <CoursesDataTable
          courses={filteredCourses}
          total={total}
          limit={50}
          offset={0}
          onViewChange={setView}
        />
      ) : (
        <CoursesGallery courses={filteredCourses} onViewChange={setView} />
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
