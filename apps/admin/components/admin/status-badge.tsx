import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { StatusType } from '@/types/admin-components';

/**
 * Status badge variants using class-variance-authority
 *
 * Provides semantic color-coded badges for all entity statuses
 * with full dark mode support
 */
const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      status: {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:ring-1 dark:ring-green-500/30',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:ring-1 dark:ring-gray-500/30',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-1 dark:ring-yellow-500/30',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:ring-1 dark:ring-green-500/30',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:ring-1 dark:ring-red-500/30',
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:ring-1 dark:ring-gray-500/30',
        published: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 dark:ring-1 dark:ring-primary-500/30',
        archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:ring-1 dark:ring-gray-500/30',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:ring-1 dark:ring-red-500/30',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:ring-1 dark:ring-green-500/30',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-1 dark:ring-yellow-500/30',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-1 dark:ring-blue-500/30',
      },
    },
    defaultVariants: {
      status: 'active',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  /** Status type (determines color and style) */
  status: StatusType;
  /** Custom label (defaults to capitalized status) */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Status Badge Component
 *
 * Displays semantic status indicators with color-coded styling.
 * Supports 12 different status types with automatic dark mode variants.
 *
 * @example
 * ```tsx
 * <StatusBadge status="active" />
 * <StatusBadge status="pending" label="Awaiting Review" />
 * <StatusBadge status="error" className="ml-2" />
 * ```
 */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {displayLabel}
    </span>
  );
}
