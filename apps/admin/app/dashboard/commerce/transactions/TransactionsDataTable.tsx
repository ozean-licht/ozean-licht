'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { Transaction } from '@/types/commerce';
import { Input, Button } from '@/lib/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface TransactionsDataTableProps {
  initialData: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export function TransactionsDataTable({
  initialData,
  total,
  limit,
  offset,
}: TransactionsDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState(
    searchParams.get('transactionType') || 'all'
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
    if (transactionTypeFilter !== 'all') params.set('transactionType', transactionTypeFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/commerce/transactions${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, transactionTypeFilter, statusFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setTransactionTypeFilter('all');
    setStatusFilter('all');
    router.replace('/dashboard/commerce/transactions');
  };

  const hasFilters = search || transactionTypeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="transactions-search"
            name="transactions-search"
            placeholder="Search by ID or order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Transaction Type Filter */}
        <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter} name="transaction-type-filter">
          <SelectTrigger className="w-[160px]" id="transaction-type-filter">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="chargeback">Chargeback</SelectItem>
            <SelectItem value="payout">Payout</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="fee">Fee</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter} name="status-filter">
          <SelectTrigger className="w-[160px]" id="status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
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
          router.replace(`/dashboard/commerce/transactions?${params.toString()}`);
        }}
        enableSorting
        enableGlobalFilter={false}
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} transactions
      </div>
    </div>
  );
}
