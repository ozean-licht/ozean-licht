# Plan: Admin Data Tables Foundation (Spec 1.3)

## Task Description

Create a production-ready, reusable DataTable component using TanStack Table v8 that provides:
- Powerful table rendering with column definitions and type safety
- Pagination controls (client-side and server-side modes)
- Column sorting (single and multi-column)
- Global search and column-specific filtering
- Bulk action checkbox selection with action bar
- Export to CSV functionality
- Column visibility toggles
- Responsive table design with mobile stacking
- Loading states and empty states integration
- Accessibility compliance (keyboard navigation, screen readers)

This is **Spec 1.3** from the Admin Dashboard Roadmap - a P0 (blocker) task that provides the foundation for all list-based features (user management, course lists, member lists, video libraries, transaction lists, etc.).

## Objective

Build a flexible, type-safe DataTable component that:
1. Handles 1000+ rows with excellent performance
2. Supports both client-side and server-side pagination
3. Enables multi-column sorting with visual indicators
4. Provides global and column-specific search/filtering
5. Allows bulk actions on selected rows
6. Exports filtered/sorted data to CSV
7. Works seamlessly on desktop, tablet, and mobile
8. Integrates with existing admin components (StatusBadge, ActionButton, skeletons)
9. Unblocks all Phase 1-5 list features

## Problem Statement

The current table implementation (FileList component) has significant limitations:
1. **No sorting** - Users can't sort by any column
2. **Basic pagination** - Manual next/prev only, no page selection or jump-to-page
3. **No bulk actions** - Can't select multiple rows for batch operations
4. **No column filtering** - Only global search, no per-column filters
5. **No CSV export** - Can't export data for offline analysis
6. **No column visibility** - Can't hide/show columns based on preference
7. **Not reusable** - File-specific logic mixed with table logic
8. **Limited responsiveness** - Table overflows on mobile
9. **No type safety** - Column definitions not strongly typed

These limitations will require reimplementation for every list feature. A robust DataTable component eliminates 70%+ of repetitive table code.

## Solution Approach

**Strategy:** Build a flexible, composable DataTable component using TanStack Table v8 with multiple patterns:

### Architecture Patterns

1. **Column Definition Pattern**
   ```typescript
   const columns: ColumnDef<User>[] = [
     {
       accessorKey: 'email',
       header: 'Email',
       cell: ({ row }) => <span>{row.original.email}</span>,
       enableSorting: true,
       enableColumnFilter: true,
     }
   ];
   ```

2. **Server-Side Data Pattern**
   ```typescript
   <DataTable
     columns={columns}
     data={users}
     pagination="server"
     pageCount={totalPages}
     onPaginationChange={handlePaginationChange}
     onSortingChange={handleSortingChange}
   />
   ```

3. **Client-Side Data Pattern**
   ```typescript
   <DataTable
     columns={columns}
     data={users}
     pagination="client"
     enableGlobalFilter
     enableColumnFilters
   />
   ```

### Component Hierarchy

```
DataTable (Main Component)
├── DataTableToolbar (Search, filters, bulk actions, column visibility)
│   ├── Search input (global filter)
│   ├── Column filters (per-column dropdowns)
│   ├── Bulk action bar (when rows selected)
│   └── Column visibility dropdown
├── Table (shadcn/ui wrapper)
│   ├── TableHeader
│   │   ├── Checkbox column (select all)
│   │   ├── Sortable column headers (with arrows)
│   │   └── Column resize handles (optional)
│   ├── TableBody
│   │   └── TableRow (with selection checkboxes)
│   └── TableFooter (optional)
├── DataTablePagination (Page controls, size selector, info)
└── DataTableSkeleton (Loading state from Spec 1.2)
```

### TanStack Table Features to Use

- **useReactTable** - Main hook for table state management
- **getCoreRowModel** - Core row rendering
- **getSortedRowModel** - Client-side sorting
- **getFilteredRowModel** - Client-side filtering
- **getPaginationRowModel** - Client-side pagination
- **getFacetedRowModel** - For column filter counts
- **getFacetedUniqueValues** - For filter options
- **Column visibility** - Show/hide columns
- **Row selection** - Checkbox selection state

## Relevant Files

### Existing Files (Reference/Extend)

- **`components/ui/table.tsx`** - Base shadcn/ui table components (unchanged)
- **`components/storage/FileList.tsx`** - Current table pattern (to be refactored using DataTable)
- **`components/admin/status-badge.tsx`** - Status badges in table cells (from Spec 1.2)
- **`components/admin/action-button.tsx`** - Action buttons in table rows (from Spec 1.2)
- **`components/admin/data-table-skeleton.tsx`** - Loading skeleton (from Spec 1.2)
- **`components/admin/empty-state.tsx`** - Empty state when no data (from Spec 1.2)
- **`components/ui/checkbox.tsx`** - Checkbox for row selection (from Spec 1.2)
- **`components/ui/button.tsx`** - Pagination buttons
- **`components/ui/input.tsx`** - Search input
- **`components/ui/dropdown-menu.tsx`** - Column visibility menu
- **`lib/utils.ts`** - Utility functions

### New Files (To Create)

#### Core DataTable Components
- **`components/data-table/data-table.tsx`** - Main DataTable component
- **`components/data-table/data-table-toolbar.tsx`** - Toolbar with search and filters
- **`components/data-table/data-table-pagination.tsx`** - Pagination controls
- **`components/data-table/data-table-column-header.tsx`** - Sortable column header
- **`components/data-table/data-table-row-actions.tsx`** - Row action dropdown template
- **`components/data-table/data-table-faceted-filter.tsx`** - Faceted column filter
- **`components/data-table/data-table-view-options.tsx`** - Column visibility toggle

#### Utilities
- **`lib/data-table/utils.ts`** - DataTable utility functions (CSV export, etc.)
- **`lib/data-table/filters.ts`** - Custom filter functions

#### Types
- **`types/data-table.ts`** - DataTable TypeScript types

#### Hooks
- **`lib/hooks/useDataTable.ts`** - Custom hook wrapping TanStack Table
- **`lib/hooks/useServerPagination.ts`** - Server pagination helper

#### Examples
- **`app/(dashboard)/examples/data-table/page.tsx`** - DataTable demo page
- **`app/(dashboard)/examples/data-table/columns.tsx`** - Example column definitions

## Implementation Phases

### Phase 1: Foundation (6 hours)
- Install TanStack Table and dependencies
- Create base DataTable component with TanStack Table integration
- Implement column definitions pattern
- Add basic rendering with client-side data

### Phase 2: Core Features (10 hours)
- Add sorting (single and multi-column)
- Add pagination (client and server modes)
- Add global search filtering
- Add column-specific filtering
- Add row selection with checkboxes
- Create toolbar and pagination components

### Phase 3: Advanced Features (4 hours)
- Add column visibility toggles
- Add CSV export functionality
- Add bulk action bar
- Implement responsive mobile view
- Add loading and empty states
- Create comprehensive documentation

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Install TanStack Table and Dependencies

```bash
cd apps/admin

# Install TanStack Table v8
npm install @tanstack/react-table

# Install Papa Parse for CSV export
npm install papaparse
npm install --save-dev @types/papaparse
```

- Verify installation in package.json
- Check version is v8.x.x (latest stable)

### 2. Create DataTable Type Definitions

- Create `types/data-table.ts`:
  ```typescript
  import { Table } from '@tanstack/react-table';

  export type PaginationMode = 'client' | 'server';

  export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    // Pagination
    pagination?: PaginationMode;
    pageCount?: number; // For server-side pagination
    onPaginationChange?: (page: number, pageSize: number) => void;

    // Sorting
    enableSorting?: boolean;
    onSortingChange?: (sorting: SortingState) => void;

    // Filtering
    enableGlobalFilter?: boolean;
    enableColumnFilters?: boolean;
    onGlobalFilterChange?: (filter: string) => void;

    // Selection
    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: TData[]) => void;

    // Bulk actions
    bulkActions?: BulkAction<TData>[];

    // CSV Export
    enableExport?: boolean;
    exportFilename?: string;

    // Column visibility
    enableColumnVisibility?: boolean;

    // Loading & Empty states
    isLoading?: boolean;
    emptyState?: {
      title: string;
      description?: string;
      action?: {
        label: string;
        onClick: () => void;
      };
    };
  }

  export interface BulkAction<TData> {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: TData[]) => void | Promise<void>;
    variant?: 'default' | 'destructive';
  }

  export interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    enableGlobalFilter?: boolean;
    enableColumnFilters?: boolean;
    bulkActions?: BulkAction<TData>[];
    enableExport?: boolean;
    exportFilename?: string;
  }

  export interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    mode: PaginationMode;
    pageCount?: number;
    onPaginationChange?: (page: number, pageSize: number) => void;
  }
  ```

### 3. Create Base DataTable Component

- Create `components/data-table/data-table.tsx`:
  ```typescript
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
    enableColumnVisibility = true,
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
  ```

### 4. Create Sortable Column Header Component

- Create `components/data-table/data-table-column-header.tsx`:
  ```typescript
  import { Column } from '@tanstack/react-table';
  import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { cn } from '@/lib/utils';

  interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
  }

  export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
  }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>;
    }

    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>{title}</span>
          {column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
  ```

### 5. Create DataTable Toolbar Component

- Create `components/data-table/data-table-toolbar.tsx`:
  ```typescript
  'use client';

  import { Table } from '@tanstack/react-table';
  import { X } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { DataTableViewOptions } from './data-table-view-options';
  import { DataTableToolbarProps } from '@/types/data-table';
  import { exportToCSV } from '@/lib/data-table/utils';

  export function DataTableToolbar<TData>({
    table,
    enableGlobalFilter,
    enableColumnFilters,
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
  ```

### 6. Create Column Visibility Component

- Create `components/data-table/data-table-view-options.tsx`:
  ```typescript
  'use client';

  import { Table } from '@tanstack/react-table';
  import { Settings2 } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';

  interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
  }

  export function DataTableViewOptions<TData>({
    table,
  }: DataTableViewOptionsProps<TData>) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 flex"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  ```

### 7. Create Pagination Component

- Create `components/data-table/data-table-pagination.tsx`:
  ```typescript
  'use client';

  import { Table } from '@tanstack/react-table';
  import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { DataTablePaginationProps } from '@/types/data-table';

  export function DataTablePagination<TData>({
    table,
    mode,
    pageCount,
    onPaginationChange,
  }: DataTablePaginationProps<TData>) {
    const handlePageChange = (newPage: number) => {
      if (mode === 'server' && onPaginationChange) {
        onPaginationChange(newPage, table.getState().pagination.pageSize);
      } else {
        table.setPageIndex(newPage);
      }
    };

    const handlePageSizeChange = (newSize: number) => {
      if (mode === 'server' && onPaginationChange) {
        onPaginationChange(0, newSize);
      }
      table.setPageSize(newSize);
    };

    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = mode === 'server' ? (pageCount || 1) : table.getPageCount();

    return (
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  ```

### 8. Create CSV Export Utility

- Create `lib/data-table/utils.ts`:
  ```typescript
  import { Table } from '@tanstack/react-table';
  import Papa from 'papaparse';

  export function exportToCSV<TData>(
    table: Table<TData>,
    filename: string = 'data'
  ): void {
    // Get visible columns
    const visibleColumns = table.getVisibleLeafColumns();

    // Get rows (filtered and sorted)
    const rows = table.getFilteredRowModel().rows;

    // Build CSV data
    const headers = visibleColumns
      .filter(col => col.id !== 'select' && col.id !== 'actions')
      .map(col => col.id);

    const data = rows.map(row => {
      const rowData: Record<string, any> = {};
      visibleColumns
        .filter(col => col.id !== 'select' && col.id !== 'actions')
        .forEach(col => {
          rowData[col.id] = row.getValue(col.id);
        });
      return rowData;
    });

    // Convert to CSV using Papa Parse
    const csv = Papa.unparse({
      fields: headers,
      data: data,
    });

    // Download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export function formatTableDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  export function formatTableTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  export function formatTableDateTime(date: Date | string): string {
    return `${formatTableDate(date)} ${formatTableTime(date)}`;
  }
  ```

### 9. Create Example Demo Page

- Create `app/(dashboard)/examples/data-table/page.tsx`:
  ```typescript
  'use client';

  import { DataTable } from '@/components/data-table/data-table';
  import { columns, User } from './columns';
  import { useState } from 'react';

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'alice@example.com',
      name: 'Alice Johnson',
      role: 'SUPER_ADMIN',
      status: 'active',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      email: 'bob@example.com',
      name: 'Bob Smith',
      role: 'KA_ADMIN',
      status: 'active',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      email: 'charlie@example.com',
      name: 'Charlie Brown',
      role: 'OL_ADMIN',
      status: 'inactive',
      createdAt: new Date('2024-03-10'),
    },
    // Add 20+ more for pagination testing
  ];

  export default function DataTableExamplePage() {
    const [data, setData] = useState<User[]>(mockUsers);

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-serif font-bold mb-6">DataTable Demo</h1>
        <DataTable
          columns={columns}
          data={data}
          enableRowSelection
          enableExport
          exportFilename="users"
          bulkActions={[
            {
              label: 'Delete Selected',
              variant: 'destructive',
              onClick: (rows) => {
                console.log('Delete:', rows);
              },
            },
          ]}
          emptyState={{
            title: 'No users found',
            description: 'Get started by creating your first user',
            action: {
              label: 'Create User',
              onClick: () => console.log('Create user'),
            },
          }}
        />
      </div>
    );
  }
  ```

### 10. Create Example Column Definitions

- Create `app/(dashboard)/examples/data-table/columns.tsx`:
  ```typescript
  'use client';

  import { ColumnDef } from '@tanstack/react-table';
  import { StatusBadge } from '@/components/admin/status-badge';
  import { ActionButton } from '@/components/admin/action-button';
  import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
  import { formatTableDateTime } from '@/lib/data-table/utils';

  export type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    createdAt: Date;
  };

  export const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <div>{row.getValue('role')}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatTableDateTime(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <ActionButton
            action="edit"
            iconOnly
            onClick={() => console.log('Edit:', row.original)}
          />
          <ActionButton
            action="delete"
            iconOnly
            onClick={() => console.log('Delete:', row.original)}
          />
        </div>
      ),
    },
  ];
  ```

### 11. Add Navigation Link to Example Page

- Update `components/dashboard/Sidebar.tsx`:
  - Add "Data Table Demo" link under Settings section
  - Link to `/dashboard/examples/data-table`

### 12. Create Faceted Filter Component (Advanced)

- Create `components/data-table/data-table-faceted-filter.tsx`:
  ```typescript
  import { Column } from '@tanstack/react-table';
  import { Check, PlusCircle } from 'lucide-react';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
  } from '@/components/ui/command';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  import { Separator } from '@/components/ui/separator';
  import { cn } from '@/lib/utils';

  interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }

  export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
  }: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as string[]);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  ```

- Note: This requires `command` component from shadcn/ui
- Install: `npx shadcn@latest add command`
- Install: `npx shadcn@latest add separator`

### 13. Create Row Actions Template Component

- Create `components/data-table/data-table-row-actions.tsx`:
  ```typescript
  import { Row } from '@tanstack/react-table';
  import { MoreHorizontal } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';

  interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    actions: {
      label: string;
      onClick: (data: TData) => void;
      variant?: 'default' | 'destructive';
    }[];
  }

  export function DataTableRowActions<TData>({
    row,
    actions,
  }: DataTableRowActionsProps<TData>) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {actions.map((action, index) => (
            <div key={index}>
              {index > 0 && action.variant === 'destructive' && (
                <DropdownMenuSeparator />
              )}
              <DropdownMenuItem
                onClick={() => action.onClick(row.original)}
                className={action.variant === 'destructive' ? 'text-destructive' : ''}
              >
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  ```

### 14. Create Server Pagination Hook

- Create `lib/hooks/useServerPagination.ts`:
  ```typescript
  import { useState } from 'react';

  export interface ServerPaginationState {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRows: number;
  }

  export function useServerPagination(initialPageSize: number = 10) {
    const [paginationState, setPaginationState] = useState<ServerPaginationState>({
      page: 0,
      pageSize: initialPageSize,
      totalPages: 0,
      totalRows: 0,
    });

    const handlePaginationChange = (page: number, pageSize: number) => {
      setPaginationState((prev) => ({
        ...prev,
        page,
        pageSize,
      }));
    };

    const setTotalRows = (totalRows: number) => {
      const totalPages = Math.ceil(totalRows / paginationState.pageSize);
      setPaginationState((prev) => ({
        ...prev,
        totalRows,
        totalPages,
      }));
    };

    return {
      paginationState,
      handlePaginationChange,
      setTotalRows,
    };
  }
  ```

### 15. Create Index Export Files

- Create `components/data-table/index.ts`:
  ```typescript
  export { DataTable } from './data-table';
  export { DataTableColumnHeader } from './data-table-column-header';
  export { DataTablePagination } from './data-table-pagination';
  export { DataTableToolbar } from './data-table-toolbar';
  export { DataTableViewOptions } from './data-table-view-options';
  export { DataTableFacetedFilter } from './data-table-faceted-filter';
  export { DataTableRowActions } from './data-table-row-actions';
  ```

### 16. Create Documentation

- Create `components/data-table/README.md`:
  ```markdown
  # DataTable Component

  Powerful, flexible data table component built with TanStack Table v8.

  ## Features

  - ✅ Client-side and server-side pagination
  - ✅ Single and multi-column sorting
  - ✅ Global search and column filtering
  - ✅ Row selection with bulk actions
  - ✅ CSV export (filtered and sorted data)
  - ✅ Column visibility toggles
  - ✅ Responsive mobile design
  - ✅ Loading and empty states
  - ✅ TypeScript first with full type safety

  ## Basic Usage

  \`\`\`tsx
  import { DataTable } from '@/components/data-table';
  import { ColumnDef } from '@tanstack/react-table';

  type User = {
    id: string;
    email: string;
    name: string;
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ];

  export function UserList({ users }: { users: User[] }) {
    return <DataTable columns={columns} data={users} />;
  }
  \`\`\`

  ## Advanced Features

  ### Sortable Columns

  \`\`\`tsx
  import { DataTableColumnHeader } from '@/components/data-table';

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
  ];
  \`\`\`

  ### Row Selection & Bulk Actions

  \`\`\`tsx
  <DataTable
    columns={columns}
    data={users}
    enableRowSelection
    bulkActions={[
      {
        label: 'Delete Selected',
        variant: 'destructive',
        onClick: (rows) => handleBulkDelete(rows),
      },
    ]}
  />
  \`\`\`

  ### Server-Side Pagination

  \`\`\`tsx
  const { paginationState, handlePaginationChange, setTotalRows } = useServerPagination(10);

  useEffect(() => {
    fetchUsers(paginationState.page, paginationState.pageSize).then(({ users, total }) => {
      setUsers(users);
      setTotalRows(total);
    });
  }, [paginationState.page, paginationState.pageSize]);

  <DataTable
    columns={columns}
    data={users}
    pagination="server"
    pageCount={paginationState.totalPages}
    onPaginationChange={handlePaginationChange}
  />
  \`\`\`

  ### CSV Export

  \`\`\`tsx
  <DataTable
    columns={columns}
    data={users}
    enableExport
    exportFilename="users"
  />
  \`\`\`

  ## API Reference

  See `types/data-table.ts` for full API documentation.
  ```

### 17. Update FileList to Use DataTable (Refactoring Example)

- Refactor `components/storage/FileList.tsx` to use new DataTable component
- Create column definitions for files
- Replace manual table rendering with `<DataTable />`
- Remove manual pagination logic
- Test file list with new component

### 18. Add Mobile Responsive Styles

- Update `data-table.tsx` with responsive classes:
  - Hide less important columns on mobile using `hidden md:table-cell`
  - Add horizontal scroll for table on mobile
  - Stack pagination controls vertically on small screens
  - Test on mobile viewport (375px width)

### 19. Comprehensive Testing

- **Unit Tests**: Test column header sorting, filtering, pagination
- **Integration Tests**: Test full DataTable with mock data
- **Accessibility Tests**: Keyboard navigation, ARIA labels
- **Performance Tests**: Test with 1000+ rows
- **Mobile Tests**: Test responsive layout on various screen sizes

### 20. Update ROADMAP-SPECS-LIST.md

- Mark Spec 1.3 as ✅ Complete
- Document actual hours vs estimated 20 hours
- Note any scope changes or deviations

## Testing Strategy

### Unit Tests

```typescript
// components/data-table/__tests__/data-table.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';

type TestData = { id: string; name: string };

const columns: ColumnDef<TestData>[] = [
  { accessorKey: 'name', header: 'Name' },
];

describe('DataTable', () => {
  it('renders data correctly', () => {
    const data = [{ id: '1', name: 'Test' }];
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('sorts columns when header clicked', () => {
    // Test sorting
  });

  it('filters data with global search', () => {
    // Test filtering
  });

  it('paginates data correctly', () => {
    // Test pagination
  });

  it('selects rows when checkbox clicked', () => {
    // Test row selection
  });
});
```

### Integration Tests

```typescript
// Test complete workflow
describe('DataTable Integration', () => {
  it('handles full user workflow', async () => {
    // 1. Render table
    // 2. Search for user
    // 3. Sort by name
    // 4. Select rows
    // 5. Execute bulk action
    // 6. Export CSV
  });
});
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<DataTable columns={columns} data={data} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Performance Tests

```typescript
describe('DataTable Performance', () => {
  it('renders 1000 rows without lag', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      name: `User ${i}`,
    }));

    const { rerender } = render(<DataTable columns={columns} data={largeData} />);

    // Measure render time
    const start = performance.now();
    rerender(<DataTable columns={columns} data={largeData} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // <100ms
  });
});
```

### Edge Cases

- **Empty data**: Test with empty array
- **Single row**: Test with 1 row
- **Large dataset**: Test with 10,000+ rows
- **Long text**: Test with very long cell values
- **Special characters**: Test with HTML, emojis, etc.
- **Null values**: Test with missing/null data
- **Date sorting**: Test date column sorting
- **Number sorting**: Test numeric column sorting

## Acceptance Criteria

### Core DataTable
- [x] DataTable component created with TanStack Table v8
- [x] Supports generic TypeScript types `<TData, TValue>`
- [x] Renders data with column definitions
- [x] Client-side pagination works (10, 20, 30, 40, 50 rows per page)
- [x] Server-side pagination works with pageCount prop
- [x] Loading state shows DataTableSkeleton
- [x] Empty state shows EmptyState component

### Sorting
- [x] Single column sorting works (asc/desc/none)
- [x] Sortable column header shows arrow indicators
- [x] Clicking header toggles sort direction
- [x] Multi-column sorting disabled by default (can enable later)
- [x] Server-side sorting triggers onSortingChange callback

### Filtering
- [x] Global search filters across all columns
- [x] Search input debounced (avoid excessive filtering)
- [x] Reset button clears all filters
- [x] Filtered row count displayed correctly
- [x] Column filters work (faceted filter component)

### Row Selection
- [x] Checkbox column added when enableRowSelection=true
- [x] Select all checkbox in header works
- [x] Individual row checkboxes work
- [x] Selected row count displayed
- [x] Bulk action bar shows when rows selected
- [x] onRowSelectionChange callback fires with selected data

### Pagination Controls
- [x] First, previous, next, last page buttons work
- [x] Current page and total pages displayed
- [x] Rows per page selector works (10, 20, 30, 40, 50)
- [x] Buttons disabled at boundaries (first page, last page)
- [x] Pagination works in both client and server modes

### Column Visibility
- [x] Column visibility dropdown shows all columns
- [x] Toggling column visibility works
- [x] Hidden columns excluded from rendering
- [x] Hidden columns excluded from CSV export
- [x] Selection and actions columns cannot be hidden

### CSV Export
- [x] Export button triggers CSV download
- [x] Exported data matches filtered/sorted table data
- [x] Column headers included in CSV
- [x] Hidden columns excluded from export
- [x] Selection and actions columns excluded from export
- [x] Custom filename supported

### Responsive Design
- [x] Table scrolls horizontally on mobile (<768px)
- [x] Pagination stacks vertically on small screens
- [x] Less important columns hidden on mobile
- [x] Touch interactions work on mobile
- [x] Table readable on all screen sizes

### Integration
- [x] Integrates with StatusBadge component
- [x] Integrates with ActionButton component
- [x] Integrates with DataTableSkeleton
- [x] Integrates with EmptyState component
- [x] Works with existing shadcn/ui components

### Accessibility
- [x] Lighthouse accessibility score >95
- [x] Keyboard navigation works (Tab, Enter, Space, Arrows)
- [x] ARIA labels on all interactive elements
- [x] Screen reader announces sorting changes
- [x] Focus indicators visible
- [x] Color contrast meets WCAG AA

### Documentation
- [x] README.md with usage examples
- [x] JSDoc comments on all components
- [x] Demo page with working example
- [x] Column definition examples
- [x] Server pagination example
- [x] Bulk actions example

### Testing
- [x] Unit tests for core functionality (>80% coverage)
- [x] Integration tests for workflows
- [x] Accessibility tests (zero violations)
- [x] Performance tests (handles 1000+ rows)

## Validation Commands

Execute these commands to validate the task is complete:

### Build & Type Check
```bash
cd apps/admin

# TypeScript type checking
npx tsc --noEmit

# ESLint
npx eslint components/data-table/ --ext .ts,.tsx

# Build
npm run build
```

### Test Suite
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Target: >80% coverage for data-table components
```

### Lighthouse Audit
```bash
# Start dev server
npm run dev

# Audit demo page
npx lighthouse http://localhost:9200/dashboard/examples/data-table \
  --only-categories=accessibility,performance \
  --output=html \
  --output-path=./lighthouse-datatable.html

# Target: Accessibility >95, Performance >90
```

### Performance Test
```bash
# Manual test: Load demo page with 1000+ rows
# Measure FPS, interaction latency
# Should be smooth (60fps, <100ms interactions)
```

### Manual Testing Checklist
```bash
# Navigate to http://localhost:9200/dashboard/examples/data-table

# ✅ Basic Rendering
- [ ] Table renders with data
- [ ] All columns visible
- [ ] Data displays correctly

# ✅ Sorting
- [ ] Click column header to sort ascending
- [ ] Click again to sort descending
- [ ] Click again to remove sort
- [ ] Arrow icons update correctly

# ✅ Pagination
- [ ] First page button disabled on page 1
- [ ] Next/Previous buttons work
- [ ] Last page button works
- [ ] Page info displays correctly
- [ ] Change rows per page (10, 20, 30, 40, 50)

# ✅ Search
- [ ] Type in search box
- [ ] Results filter in real-time
- [ ] "Reset" button clears search
- [ ] Row count updates

# ✅ Row Selection
- [ ] Check individual row
- [ ] Check "select all" checkbox
- [ ] Selected count displays
- [ ] Bulk action bar appears
- [ ] Bulk action button works

# ✅ Column Visibility
- [ ] Click "View" button
- [ ] Toggle column visibility
- [ ] Column disappears/reappears
- [ ] Hidden columns excluded from export

# ✅ CSV Export
- [ ] Click "Export CSV" button
- [ ] File downloads
- [ ] CSV contains correct data
- [ ] Filename matches expectation

# ✅ Responsive
- [ ] Resize window to mobile width
- [ ] Table scrolls horizontally
- [ ] Pagination stacks vertically
- [ ] All features work on mobile

# ✅ Accessibility
- [ ] Tab through all interactive elements
- [ ] Press Enter/Space to activate
- [ ] Screen reader announces changes
- [ ] Focus indicators visible
```

## Notes

### Dependencies to Install

```bash
cd apps/admin

# TanStack Table v8
npm install @tanstack/react-table

# CSV Export
npm install papaparse
npm install --save-dev @types/papaparse

# Additional shadcn components (if not installed)
npx shadcn@latest add command
npx shadcn@latest add separator
```

### Design System Compliance

- Use Ozean Licht branding (primary color for selected rows)
- Maintain cosmic dark theme support
- Use `font-sans` (Montserrat) for table text
- Use consistent spacing and border radius
- Integrate with existing admin components

### TanStack Table Patterns

1. **Column Definitions**: Define columns outside component (memoized)
2. **Table Instance**: Create once using `useReactTable` hook
3. **State Management**: Let TanStack manage internal state
4. **Controlled State**: Use callbacks for server-side operations
5. **Type Safety**: Use generic types `<TData, TValue>` everywhere

### Performance Considerations

- Use `memo` for column definitions to prevent re-renders
- Use `useMemo` for expensive computations
- Implement virtual scrolling for 10,000+ rows (future enhancement)
- Debounce search input (300ms)
- Paginate large datasets server-side

### Future Enhancements (Post-MVP)

- Virtual scrolling for 10,000+ rows
- Column resizing (drag handles)
- Column reordering (drag-drop)
- Advanced filtering (date ranges, number ranges)
- Saved table views (persist filters, sorting, column visibility)
- Row expansion (nested data)
- Editable cells (inline editing)
- Row drag-drop reordering
- Sticky headers
- Column pinning (freeze left/right columns)

### Breaking Changes

None - New component library, no existing code broken.

### Migration Path

1. Deploy DataTable component library
2. Create demo page for testing
3. Refactor FileList component to use DataTable
4. Future specs use DataTable by default
5. Gradually refactor other list components (optional)

### Related Specs

- **Spec 1.1**: Admin Layout & Navigation (provides layout for demo)
- **Spec 1.2**: Shared UI Components (StatusBadge, ActionButton, skeletons used in DataTable)
- **Spec 1.5**: User Management List (first real usage of DataTable)
- **All Phase 2-5 list features**: Course lists, member lists, video libraries, etc.

### Estimated Effort Breakdown

- Install TanStack Table: 0.5 hours
- Create base DataTable component: 3 hours
- Create column header component: 1 hour
- Create toolbar component: 2 hours
- Create pagination component: 1.5 hours
- Create column visibility component: 1 hour
- CSV export utility: 1 hour
- Server pagination hook: 0.5 hours
- Faceted filter component: 2 hours
- Row actions component: 0.5 hours
- Demo page and examples: 2 hours
- Documentation: 1.5 hours
- Testing: 3 hours
- Refactor FileList: 1 hour
- **Total: 20 hours**

---

**Spec Status:** ❌ Not Started
**Priority:** P0 (Blocker)
**Estimated Effort:** 20 hours
**Dependencies:** Spec 1.2 (Shared UI Components)
**Blocks:** Spec 1.5 (User List), all Phase 2-5 list features
**Created:** 2025-11-09
**Target Completion:** Week 2
