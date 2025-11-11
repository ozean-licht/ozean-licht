/**
 * Badge Component
 *
 * Status and label badges with semantic colors.
 * Perfect for user roles, statuses, and tags.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="destructive">Inactive</Badge>
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant (semantic colors) */
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'
  /** Badge size */
  size?: 'sm' | 'md' | 'lg'
  /** Dot indicator before text */
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: [
        'bg-primary/20 text-primary',
        'border-primary/30',
      ].join(' '),
      success: [
        'bg-success/20 text-success',
        'border-success/30',
      ].join(' '),
      warning: [
        'bg-warning/20 text-warning',
        'border-warning/30',
      ].join(' '),
      destructive: [
        'bg-destructive/20 text-destructive',
        'border-destructive/30',
      ].join(' '),
      info: [
        'bg-info/20 text-info',
        'border-info/30',
      ].join(' '),
      outline: [
        'bg-transparent text-foreground',
        'border-border',
      ].join(' '),
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'badge-base',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
