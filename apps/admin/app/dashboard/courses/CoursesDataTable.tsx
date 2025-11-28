'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Course, CourseStatus, CourseLevel } from '@/types/content';
import {
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/lib/ui';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface CoursesDataTableProps {
  courses: Course[];
  total: number;
  limit: number;
  offset: number;
  onViewChange?: (view: 'list' | 'gallery') => void;
}

export default function CoursesDataTable({
  courses,
  total,
  limit,
  offset,
  onViewChange,
}: CoursesDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');

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

      // Reset offset when filters change
      if (!('offset' in params)) {
        newParams.delete('offset');
      }

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

  const handleLevelChange = (value: string) => {
    setLevelFilter(value);
    updateUrl({ level: value === 'all' ? null : value });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setLevelFilter('all');
    router.push(pathname);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || levelFilter !== 'all';

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

          {/* Level Filter */}
          <Select value={levelFilter} onValueChange={handleLevelChange} name="level-filter">
            <SelectTrigger className="w-[140px]" id="level-filter">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
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
              className="h-8 w-8 p-0 bg-primary/10"
              onClick={() => onViewChange('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
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
        Showing {offset + 1} to {Math.min(offset + courses.length, total)} of {total} courses
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={courses}
        enableExport
      />
    </div>
  );
}
