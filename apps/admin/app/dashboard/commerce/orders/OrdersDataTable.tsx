'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Order } from '@/types/commerce';
import { Input, Button } from '@/lib/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface OrdersDataTableProps {
  initialData: Order[];
  total: number;
  limit: number;
  offset: number;
}

export function OrdersDataTable({
  initialData,
  total,
  limit,
  offset,
}: OrdersDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(
    searchParams.get('paymentStatus') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (paymentStatusFilter !== 'all') params.set('paymentStatus', paymentStatusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/commerce/orders${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, statusFilter, paymentStatusFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    router.replace('/dashboard/commerce/orders');
  };

  const hasFilters = search || statusFilter !== 'all' || paymentStatusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="orders-search"
            name="orders-search"
            placeholder="Search by order number or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter} name="status-filter">
          <SelectTrigger className="w-[160px]" id="status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter} name="payment-status-filter">
          <SelectTrigger className="w-[160px]" id="payment-status-filter">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
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
          router.replace(`/dashboard/commerce/orders?${params.toString()}`);
        }}
        enableSorting
        enableGlobalFilter={false}
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} orders
      </div>
    </div>
  );
}
