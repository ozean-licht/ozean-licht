'use client';

/**
 * Courses Gallery View
 *
 * Card-based view for course management.
 * Uses shared-ui components and Course type from database.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/lib/ui';
import {
  BookOpen,
  Users,
  FileText,
  Search,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Course } from '@/types/content';
import Link from 'next/link';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface CoursesGalleryProps {
  courses: Course[];
  onViewChange?: (view: 'list' | 'gallery') => void;
}

function formatPrice(cents: number, currency: string): string {
  if (cents === 0) return 'Free';
  const amount = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(amount);
}

/**
 * Get badge config for course status
 */
function getStatusConfig(status: string): { className: string; overlayClassName: string; label: string } {
  const configs: Record<string, { className: string; overlayClassName: string; label: string }> = {
    published: {
      className: 'border bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
      overlayClassName: 'bg-black/40 text-green-300 border-green-500/40',
      label: 'Published',
    },
    draft: {
      className: 'border bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
      overlayClassName: 'bg-black/40 text-yellow-300 border-yellow-500/40',
      label: 'Draft',
    },
    archived: {
      className: 'border bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-400',
      overlayClassName: 'bg-black/40 text-gray-300 border-gray-500/40',
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
function getCategoryConfig(category: string | undefined): { className: string; overlayClassName: string; label: string } {
  const configs: Record<string, { className: string; overlayClassName: string; label: string }> = {
    New: {
      className: 'border bg-primary/20 text-primary border-primary/30',
      overlayClassName: 'bg-black/40 text-primary border-primary/40',
      label: 'New',
    },
    Basis: {
      className: 'border bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400',
      overlayClassName: 'bg-black/40 text-blue-300 border-blue-500/40',
      label: 'Basis',
    },
    LCQ: {
      className: 'border bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
      overlayClassName: 'bg-black/40 text-yellow-300 border-yellow-500/40',
      label: 'LCQ',
    },
    Interview: {
      className: 'border bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
      overlayClassName: 'bg-black/40 text-green-300 border-green-500/40',
      label: 'Interview',
    },
    'Q&A': {
      className: 'border bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:text-cyan-400',
      overlayClassName: 'bg-black/40 text-cyan-300 border-cyan-500/40',
      label: 'Q&A',
    },
    Kostenlos: {
      className: 'border bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400',
      overlayClassName: 'bg-black/40 text-orange-300 border-orange-500/40',
      label: 'Kostenlos',
    },
    Aufbau: {
      className: 'border bg-indigo-500/20 text-indigo-700 border-indigo-500/30 dark:text-indigo-400',
      overlayClassName: 'bg-black/40 text-indigo-300 border-indigo-500/40',
      label: 'Aufbau',
    },
    Master: {
      className: 'border bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
      overlayClassName: 'bg-black/40 text-red-300 border-red-500/40',
      label: 'Master',
    },
    Fortgeschritten: {
      className: 'border bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400',
      overlayClassName: 'bg-black/40 text-purple-300 border-purple-500/40',
      label: 'Fortgeschritten',
    },
  };
  return configs[category || ''] || {
    className: 'border bg-gray-500/20 text-gray-600 border-gray-500/30',
    overlayClassName: 'bg-black/40 text-gray-300 border-gray-500/40',
    label: category || ''
  };
}

function CourseCard({ course }: { course: Course }) {
  const statusConfig = getStatusConfig(course.status);
  const categoryConfig = course.category ? getCategoryConfig(course.category) : null;

  return (
    <Link href={`/dashboard/courses/${course.slug}`}>
      <div className="group cursor-pointer">
        {/* Thumbnail - 16:9 aspect ratio, fully rounded, hover highlight */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden border border-transparent group-hover:border-primary/50 transition-colors">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary/40" />
            </div>
          )}

          {/* Badges - top left corner with subtle dark backing */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`border backdrop-blur-sm ${statusConfig.overlayClassName}`}>
              {statusConfig.label}
            </Badge>
            {categoryConfig && (
              <Badge variant="outline" className={`border backdrop-blur-sm ${categoryConfig.overlayClassName}`}>
                {categoryConfig.label}
              </Badge>
            )}
            {course.priceCents === 0 ? (
              <Badge variant="outline" className="border bg-black/40 text-teal-300 border-teal-500/40 backdrop-blur-sm">
                Free
              </Badge>
            ) : (
              <Badge variant="outline" className="border bg-black/40 text-emerald-300 border-emerald-500/40 backdrop-blur-sm">
                {formatPrice(course.priceCents, course.currency)}
              </Badge>
            )}
          </div>
        </div>

        {/* Content - centered, no box */}
        <div className="pt-4 px-2 text-center">
          <h3 className="text-lg font-decorative text-foreground line-clamp-1 mb-1 transition-all duration-300 group-hover:text-glow-subtle">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {course.shortDescription || course.description || 'No description'}
          </p>

          {/* Stats row - centered */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{course.lessonCount || 0} lessons</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
        <BookOpen className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-sans text-white mb-2">No courses found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Try adjusting your filters or create a new course.
      </p>
    </div>
  );
}

export default function CoursesGallery({ courses, onViewChange }: CoursesGalleryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Update URL when filters change
  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Handle search change (debounced)
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('search') || '')) {
      updateUrl({ search: debouncedSearch || null });
    }
  }, [debouncedSearch, searchParams, updateUrl]);

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    updateUrl({ status: value === 'all' ? null : value });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    updateUrl({ category: value === 'all' ? null : value });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    router.push(pathname);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusChange} name="status-filter">
            <SelectTrigger className="w-[140px]" id="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={handleCategoryChange} name="category-filter">
            <SelectTrigger className="w-[160px]" id="category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Basis">Basis</SelectItem>
              <SelectItem value="LCQ">LCQ</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Q&A">Q&A</SelectItem>
              <SelectItem value="Kostenlos">Kostenlos</SelectItem>
              <SelectItem value="Aufbau">Aufbau</SelectItem>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="Fortgeschritten">Fortgeschritten</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* View Toggle */}
        {onViewChange && (
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onViewChange('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary/10"
              onClick={() => onViewChange('gallery')}
              title="Gallery view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
      </div>

      {/* Course Grid - max 2 columns */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-12">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
