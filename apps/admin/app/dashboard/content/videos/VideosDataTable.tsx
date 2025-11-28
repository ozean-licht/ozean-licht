'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Video } from '@/types/content';
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui';
import { Search, X, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface VideosDataTableProps {
  initialData: Video[];
  total: number;
  limit: number;
  offset: number;
}

export function VideosDataTable({
  initialData,
  total,
  limit,
  offset,
}: VideosDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const [entityScopeFilter, setEntityScopeFilter] = useState(
    searchParams.get('entityScope') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (entityScopeFilter !== 'all') params.set('entityScope', entityScopeFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/content/videos${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, statusFilter, entityScopeFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setEntityScopeFilter('all');
    router.replace('/dashboard/content/videos');
  };

  const hasFilters = search || statusFilter !== 'all' || entityScopeFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="videos-search"
            name="videos-search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter} name="status-filter">
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

        {/* Entity Scope Filter */}
        <Select value={entityScopeFilter} onValueChange={setEntityScopeFilter} name="entity-scope-filter">
          <SelectTrigger className="w-[160px]" id="entity-scope-filter">
            <SelectValue placeholder="Entity Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
            <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add New Video Button */}
        <Button
          onClick={() => router.push('/dashboard/content/videos/new')}
          size="sm"
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Video
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(page, pageSize) => {
          const params = new URLSearchParams(searchParams.toString());
          const newOffset = page * pageSize;
          if (newOffset > 0) {
            params.set('offset', newOffset.toString());
          } else {
            params.delete('offset');
          }
          router.replace(`/dashboard/content/videos?${params.toString()}`);
        }}
        enableSorting
        enableGlobalFilter={false}
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} videos
      </div>
    </div>
  );
}
