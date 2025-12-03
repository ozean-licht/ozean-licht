import { ColumnDef, SortingState, Table } from '@tanstack/react-table';

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

  // Row interaction
  onRowDoubleClick?: (row: TData) => void;
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
