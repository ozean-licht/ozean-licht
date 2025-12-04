'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Video } from '@/types/content';
import { Input, Button } from '@/lib/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { BulkActionsToolbar, BulkAction } from '@/components/videos';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );

  // State for row selection
  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Get selected video IDs
  const selectedIds = selectedVideos.map(v => v.id);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/content/videos${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, statusFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    router.replace('/dashboard/content/videos');
  };

  const hasFilters = search || statusFilter !== 'all';

  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: BulkAction) => {
    if (selectedIds.length === 0) return;

    setIsBulkLoading(true);

    try {
      // Convert BulkAction to API format
      let apiAction: Record<string, unknown>;
      switch (action.type) {
        case 'archive':
          apiAction = { type: 'archive' };
          break;
        case 'visibility':
          apiAction = { type: 'visibility', value: action.value };
          break;
        case 'pipelineStage':
          apiAction = { type: 'pipelineStage', value: action.value };
          break;
        case 'migrate':
          apiAction = { type: 'migrationStatus', value: 'migrating' };
          break;
        case 'addTags':
          apiAction = { type: 'addTags', tags: action.tags };
          break;
        default:
          throw new Error('Unknown action type');
      }

      const response = await fetch('/api/videos/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          action: apiAction,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to perform bulk action');
      }

      const result = await response.json();

      toast({
        title: 'Success',
        description: `Updated ${result.updatedCount} video${result.updatedCount !== 1 ? 's' : ''}`,
      });

      // Clear selection and refresh only on success
      setSelectedVideos([]);
      router.refresh();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to perform bulk action',
        variant: 'destructive',
      });
      // Preserve selection on error - do not clear or refresh
    } finally {
      setIsBulkLoading(false);
    }
  }, [selectedIds, router, toast]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedVideos([]);
  }, []);

  // Handle row selection change from DataTable
  const handleRowSelectionChange = useCallback((rows: Video[]) => {
    setSelectedVideos(rows);
  }, []);

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
        enableRowSelection
        onRowSelectionChange={handleRowSelectionChange}
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} videos
        {selectedIds.length > 0 && (
          <span className="ml-2 text-primary">
            ({selectedIds.length} selected)
          </span>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedIds={selectedIds}
        onBulkAction={handleBulkAction}
        onClearSelection={handleClearSelection}
        isLoading={isBulkLoading}
      />
    </div>
  );
}
