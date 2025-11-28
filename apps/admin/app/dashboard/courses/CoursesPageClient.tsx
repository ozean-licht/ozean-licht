'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CoursesDataTable from './CoursesDataTable';
import CoursesGallery from './CoursesGallery';
import { Course } from '@/types/content';
import { Button } from '@/lib/ui';
import { Plus, List, LayoutGrid } from 'lucide-react';

interface CoursesPageClientProps {
  initialCourses: Course[];
  initialTotal: number;
}

export default function CoursesPageClient({ initialCourses, initialTotal }: CoursesPageClientProps) {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'list' | 'gallery'>('list');

  // Parse filters from URL
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const level = searchParams.get('level') || '';

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

    if (level && level !== 'all') {
      result = result.filter((c) => c.level === level);
    }

    return result;
  }, [initialCourses, search, status, level]);

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
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${view === 'list' ? 'bg-primary/10' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${view === 'gallery' ? 'bg-primary/10' : ''}`}
              onClick={() => setView('gallery')}
              title="Gallery view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <CoursesDataTable
          courses={filteredCourses}
          total={total}
          limit={50}
          offset={0}
        />
      ) : (
        <CoursesGallery courses={filteredCourses} />
      )}
    </div>
  );
}
