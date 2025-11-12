/**
 * Badge Component
 *
 * Ozean Licht branded badge with glow effects and semantic colors.
 * Perfect for status indicators, tags, and labels.
 *
 * @example
 * <Badge variant="default">Default</Badge>
 * <Badge variant="success" glow>Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="info" arrow>Click me</Badge>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  'badge-base',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--primary)]/20 text-[var(--primary)]',
          'border-[var(--primary)]/30',
          'hover:bg-[var(--primary)]/30',
        ].join(' '),
        secondary: [
          'bg-[var(--secondary)]/20 text-[var(--secondary)]',
          'border-[var(--secondary)]/30',
          'hover:bg-[var(--secondary)]/30',
        ].join(' '),
        success: [
          'bg-[var(--success)]/20 text-[var(--success)]',
          'border-[var(--success)]/30',
          'hover:bg-[var(--success)]/30',
        ].join(' '),
        warning: [
          'bg-[var(--warning)]/20 text-[var(--warning)]',
          'border-[var(--warning)]/30',
          'hover:bg-[var(--warning)]/30',
        ].join(' '),
        destructive: [
          'bg-[var(--destructive)]/20 text-[var(--destructive)]',
          'border-[var(--destructive)]/30',
          'hover:bg-[var(--destructive)]/30',
        ].join(' '),
        info: [
          'bg-[var(--info)]/20 text-[var(--info)]',
          'border-[var(--info)]/30',
          'hover:bg-[var(--info)]/30',
        ].join(' '),
        outline: [
          'bg-transparent text-[var(--foreground)]',
          'border-[var(--border)]',
          'hover:bg-[var(--accent)]',
        ].join(' '),
        gradient: [
          'bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80',
          'text-[var(--primary-foreground)]',
          'border-[var(--primary)]/50',
        ].join(' '),
      },
      size: {
        sm: 'px-2 py-0.5 text-xs h-5',
        md: 'px-3 py-1 text-sm h-6',
        lg: 'px-4 py-1.5 text-base h-7',
      },
      glow: {
        true: 'glow-subtle',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      glow: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show dot indicator before text */
  dot?: boolean
  /** Show arrow icon after text */
  arrow?: boolean
}

/**
 * Badge component with glow effects
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      dot = false,
      arrow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, glow }), className)}
        {...props}
      >
        {dot && (
          <span
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current animate-[gentle-pulse_3s_ease-in-out_infinite]"
            aria-hidden="true"
          />
        )}
        {children}
        {arrow && (
          <ArrowRight
            className="ml-1 inline-block h-3 w-3"
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
