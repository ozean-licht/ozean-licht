'use client';

import { X } from 'lucide-react';
import { Button, Input } from '@/lib/ui';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableToolbarProps } from '@/types/data-table';
import { exportToCSV } from '@/lib/data-table/utils';

export function DataTableToolbar<TData>({
  table,
  enableGlobalFilter,
  bulkActions,
  enableExport,
  exportFilename,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Global search */}
        {enableGlobalFilter && (
          <Input
            placeholder="Search all columns..."
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Column filters would go here */}

        {/* Clear filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bulk actions */}
      {selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} row(s) selected
          </span>
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              onClick={() => action.onClick(selectedRows.map(row => row.original))}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Right side actions */}
      {selectedRows.length === 0 && (
        <div className="flex items-center space-x-2">
          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(table, exportFilename)}
            >
              Export CSV
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      )}
    </div>
  );
}
