'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTableProps } from '@/types/data-table';
import { Checkbox } from '@/components/ui/checkbox';

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = 'client',
  pageCount,
  onPaginationChange,
  enableSorting = true,
  onSortingChange,
  enableGlobalFilter = true,
  enableColumnFilters = false,
  onGlobalFilterChange,
  enableRowSelection = false,
  onRowSelectionChange,
  bulkActions,
  enableExport = false,
  exportFilename = 'data',
  isLoading = false,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Add selection column if enabled
  const columnsWithSelection: ColumnDef<TData, TValue>[] = enableRowSelection
    ? [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onRowSelectionChange) {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        onRowSelectionChange(selectedRows);
      }
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      if (onSortingChange) {
        onSortingChange(typeof updater === 'function' ? updater(sorting) : updater);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater);
      if (onGlobalFilterChange) {
        onGlobalFilterChange(typeof updater === 'function' ? updater(globalFilter) : updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination === 'client' ? getPaginationRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: pagination === 'server',
    manualSorting: pagination === 'server',
    pageCount: pageCount,
  });

  // Loading state
  if (isLoading) {
    return <DataTableSkeleton rows={10} columns={columnsWithSelection.length} />;
  }

  // Empty state
  if (!isLoading && data.length === 0 && emptyState) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        enableGlobalFilter={enableGlobalFilter}
        enableColumnFilters={enableColumnFilters}
        bulkActions={bulkActions}
        enableExport={enableExport}
        exportFilename={exportFilename}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithSelection.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        mode={pagination}
        pageCount={pageCount}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
