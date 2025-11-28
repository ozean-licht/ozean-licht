'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Product } from '@/types/commerce';
import { Input, Button } from '@/lib/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface ProductsDataTableProps {
  initialData: Product[];
  total: number;
  limit: number;
  offset: number;
}

export function ProductsDataTable({
  initialData,
  total,
  limit,
  offset,
}: ProductsDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [productTypeFilter, setProductTypeFilter] = useState(
    searchParams.get('productType') || 'all'
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (productTypeFilter !== 'all') params.set('productType', productTypeFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/commerce/products${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, productTypeFilter, statusFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setProductTypeFilter('all');
    setStatusFilter('all');
    router.replace('/dashboard/commerce/products');
  };

  const hasFilters = search || productTypeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="products-search"
            name="products-search"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Product Type Filter */}
        <Select value={productTypeFilter} onValueChange={setProductTypeFilter} name="product-type-filter">
          <SelectTrigger className="w-[160px]" id="product-type-filter">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="membership">Membership</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="bundle">Bundle</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter} name="status-filter">
          <SelectTrigger className="w-[160px]" id="status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
          router.replace(`/dashboard/commerce/products?${params.toString()}`);
        }}
        enableSorting
        enableGlobalFilter={false}
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} products
      </div>
    </div>
  );
}
