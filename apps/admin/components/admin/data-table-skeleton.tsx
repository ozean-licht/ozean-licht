import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/ui';

interface DataTableSkeletonProps {
  /** Number of rows to display (default: 5) */
  rows?: number;
  /** Number of columns to display (default: 4) */
  columns?: number;
}

/**
 * Data Table Skeleton Component
 *
 * Loading skeleton for data tables with configurable rows and columns.
 * Displays while table data is being fetched.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <DataTableSkeleton rows={10} columns={5} />
 * ) : (
 *   <DataTable data={users} />
 * )}
 * ```
 */
export function DataTableSkeleton({ rows = 5, columns = 4 }: DataTableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
