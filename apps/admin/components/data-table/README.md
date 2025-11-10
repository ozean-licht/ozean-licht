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

```tsx
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
```

## Advanced Features

### Sortable Columns

```tsx
import { DataTableColumnHeader } from '@/components/data-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
];
```

### Row Selection & Bulk Actions

```tsx
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
```

### Server-Side Pagination

```tsx
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
```

### CSV Export

```tsx
<DataTable
  columns={columns}
  data={users}
  enableExport
  exportFilename="users"
/>
```

### Column Filtering (Faceted)

```tsx
import { DataTableFacetedFilter } from '@/components/data-table';

// In your toolbar customization
<DataTableFacetedFilter
  column={table.getColumn('status')}
  title="Status"
  options={[
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]}
/>
```

### Custom Row Actions

```tsx
import { DataTableRowActions } from '@/components/data-table';

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          { label: 'Edit', onClick: (user) => editUser(user) },
          { label: 'Delete', onClick: (user) => deleteUser(user), variant: 'destructive' },
        ]}
      />
    ),
  },
];
```

## Component Props

### DataTable

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Required | Column definitions |
| `data` | `TData[]` | Required | Table data |
| `pagination` | `'client' \| 'server'` | `'client'` | Pagination mode |
| `pageCount` | `number` | - | Total pages (server-side only) |
| `onPaginationChange` | `(page, pageSize) => void` | - | Pagination callback |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableGlobalFilter` | `boolean` | `true` | Enable global search |
| `enableColumnFilters` | `boolean` | `false` | Enable column filters |
| `enableRowSelection` | `boolean` | `false` | Enable row checkboxes |
| `bulkActions` | `BulkAction<TData>[]` | - | Bulk action buttons |
| `enableExport` | `boolean` | `false` | Enable CSV export |
| `exportFilename` | `string` | `'data'` | CSV filename |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `emptyState` | `EmptyStateProps` | - | Empty state config |

### DataTableColumnHeader

| Prop | Type | Description |
|------|------|-------------|
| `column` | `Column<TData, TValue>` | TanStack Table column |
| `title` | `string` | Column header text |

### DataTableFacetedFilter

| Prop | Type | Description |
|------|------|-------------|
| `column` | `Column<TData, TValue>` | Column to filter |
| `title` | `string` | Filter dropdown title |
| `options` | `{label, value, icon?}[]` | Filter options |

### DataTableRowActions

| Prop | Type | Description |
|------|------|-------------|
| `row` | `Row<TData>` | Table row |
| `actions` | `{label, onClick, variant?}[]` | Action menu items |

## Utilities

### Date Formatting

```tsx
import { formatTableDate, formatTableTime, formatTableDateTime } from '@/lib/data-table/utils';

formatTableDate(new Date());       // "Jan 15, 2024"
formatTableTime(new Date());       // "02:30 PM"
formatTableDateTime(new Date());   // "Jan 15, 2024 02:30 PM"
```

### CSV Export

```tsx
import { exportToCSV } from '@/lib/data-table/utils';

// Manual export trigger
const handleExport = () => {
  exportToCSV(table, 'my-export');
};
```

## Hooks

### useServerPagination

```tsx
const {
  paginationState,      // { page, pageSize, totalPages, totalRows }
  handlePaginationChange, // (page, pageSize) => void
  setTotalRows,         // (total) => void
} = useServerPagination(initialPageSize);
```

## Examples

See `/dashboard/examples/data-table` for a complete working example with:
- 25+ rows of mock data
- Sortable columns
- Global search
- Row selection
- Bulk delete action
- CSV export
- Column visibility toggles
- Pagination controls

## TypeScript

All components are fully typed. Column definitions inherit types from your data model:

```tsx
type User = {
  id: string;
  name: string;
  email: string;
};

// TypeScript knows the available accessorKeys
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name' },    // ✅ Valid
  { accessorKey: 'invalid' }, // ❌ Type error
];
```

## Performance

- Handles 1000+ rows smoothly with client-side pagination
- Use server-side pagination for datasets > 10,000 rows
- Column definitions are memoized automatically
- Virtual scrolling available for very large datasets (future enhancement)

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader announcements for sort changes
- Focus indicators on all controls
- Color contrast meets WCAG AA standards

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Migration from FileList

Old pattern (FileList):
```tsx
<FileList files={files} onDelete={handleDelete} />
```

New pattern (DataTable):
```tsx
<DataTable
  columns={fileColumns}
  data={files}
  bulkActions={[{ label: 'Delete', onClick: handleBulkDelete }]}
/>
```

## Related Components

- `DataTableSkeleton` - Loading skeleton (from admin/data-table-skeleton)
- `EmptyState` - Empty state display (from admin/empty-state)
- `StatusBadge` - Status badges in cells (from admin/status-badge)
- `ActionButton` - Action buttons in rows (from admin/action-button)

## API Reference

See `types/data-table.ts` for complete type definitions.

## Changelog

### v1.0.0 (2025-11-09)
- Initial release
- TanStack Table v8 integration
- Client and server pagination
- Sorting, filtering, row selection
- CSV export
- Column visibility
- Mobile responsive design
