import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  Archive,
  RotateCcw,
  LucideIcon,
} from 'lucide-react';
import { ActionType } from '@/types/admin-components';

/**
 * Icon mapping for action types
 */
const actionIcons: Record<ActionType, LucideIcon> = {
  edit: Edit2,
  delete: Trash2,
  view: Eye,
  approve: Check,
  reject: X,
  publish: Upload,
  archive: Archive,
  restore: RotateCcw,
};

/**
 * Button variant mapping for action types
 */
const actionVariants: Record<ActionType, ButtonProps['variant']> = {
  edit: 'outline',
  delete: 'destructive',
  view: 'ghost',
  approve: 'default',
  reject: 'destructive',
  publish: 'default',
  archive: 'outline',
  restore: 'outline',
};

/**
 * Default labels for action types
 */
const actionLabels: Record<ActionType, string> = {
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
  approve: 'Approve',
  reject: 'Reject',
  publish: 'Publish',
  archive: 'Archive',
  restore: 'Restore',
};

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Action type (determines icon, variant, and default label) */
  action: ActionType;
  /** Custom label (defaults to action type) */
  label?: string;
  /** Whether to show icon (default: true) */
  showIcon?: boolean;
  /** Icon-only mode (no text, compact size) */
  iconOnly?: boolean;
}

/**
 * Action Button Component
 *
 * Standardized button component for common admin actions with:
 * - Automatic icon selection
 * - Semantic variant styling
 * - Icon-only mode support
 * - Accessibility labels
 *
 * @example
 * ```tsx
 * <ActionButton action="edit" onClick={handleEdit} />
 * <ActionButton action="delete" onClick={handleDelete} />
 * <ActionButton action="view" iconOnly onClick={handleView} />
 * ```
 */
export function ActionButton({
  action,
  label,
  showIcon = true,
  iconOnly = false,
  className,
  size = 'sm',
  ...props
}: ActionButtonProps) {
  const Icon = actionIcons[action];
  const variant = actionVariants[action];
  const displayLabel = label || actionLabels[action];

  return (
    <Button
      variant={variant}
      size={iconOnly ? 'icon' : size}
      className={cn(iconOnly && 'h-8 w-8', className)}
      aria-label={iconOnly ? displayLabel : undefined}
      {...props}
    >
      {showIcon && <Icon className={cn('h-4 w-4', !iconOnly && 'mr-2')} />}
      {!iconOnly && <span>{displayLabel}</span>}
    </Button>
  );
}
