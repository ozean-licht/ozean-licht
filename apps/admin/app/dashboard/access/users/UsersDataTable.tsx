'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { User } from '@/types/user';
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface UsersDataTableProps {
  initialData: User[];
  total: number;
  limit: number;
  offset: number;
}

export function UsersDataTable({
  initialData,
  total,
  limit,
  offset,
}: UsersDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [entityFilter, setEntityFilter] = useState(
    searchParams.get('entity') || 'all'
  );
  const [verifiedFilter, setVerifiedFilter] = useState(
    searchParams.get('verified') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (entityFilter !== 'all') params.set('entity', entityFilter);
    if (verifiedFilter !== 'all') params.set('verified', verifiedFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/users${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  }, [debouncedSearch, entityFilter, verifiedFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setEntityFilter('all');
    setVerifiedFilter('all');
    router.push('/dashboard/users');
  };

  const hasFilters = search || entityFilter !== 'all' || verifiedFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Entity Filter */}
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="kids_ascension">Kids Ascension</SelectItem>
            <SelectItem value="ozean_licht">Ozean Licht</SelectItem>
            <SelectItem value="both">Both Platforms</SelectItem>
          </SelectContent>
        </Select>

        {/* Verified Filter */}
        <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
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
          router.push(`/dashboard/users?${params.toString()}`);
        }}
        enableSorting
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} users
      </div>
    </div>
  );
}
