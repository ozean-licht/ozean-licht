/**
 * Badge Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht design system
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-alt font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#000F1F] text-primary shadow-sm shadow-primary/10',
        primary:
          'border-transparent bg-primary text-white shadow-sm shadow-primary/20',
        secondary:
          'border-border bg-card/70 text-foreground backdrop-blur-8',
        destructive:
          'border-transparent bg-destructive text-white shadow-sm shadow-destructive/20',
        success:
          'border-transparent bg-success text-white shadow-sm shadow-success/20',
        warning:
          'border-transparent bg-warning text-white shadow-sm shadow-warning/20',
        info:
          'border-transparent bg-info text-white shadow-sm shadow-info/20',
        outline:
          'border-primary/30 text-primary bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Render prop to wrap the badge (replaces asChild from shadcn/ui)
   * Example: <Badge render={<Link href="/pricing" />}>New</Badge>
   */
  render?: React.ReactElement
}

function Badge({ className, variant, render, children, ...props }: BadgeProps) {
  if (render) {
    return React.cloneElement(render, {
      ...render.props,
      className: cn(
        badgeVariants({ variant }),
        render.props.className,
        className
      ),
      ...props,
      children,
    })
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
