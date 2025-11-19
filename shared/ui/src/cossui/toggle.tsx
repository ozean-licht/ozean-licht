/**
 * Toggle & ToggleGroup Components - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-card/70 backdrop-blur-12 border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:border-primary/40',
        outline:
          'border border-border bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30 data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:border-primary/40',
        ghost:
          'hover:bg-primary/10 hover:text-primary data-[state=on]:bg-primary/20 data-[state=on]:text-primary',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2.5 text-xs',
        lg: 'h-10 px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * Toggle Component
 * Individual toggle button - can be used standalone or within a ToggleGroup
 */
const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToggle> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <BaseToggle
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))
Toggle.displayName = 'Toggle'

/**
 * ToggleGroup Component
 * Container for grouping toggle buttons with shared state
 */
const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToggleGroup>
>(({ className, ...props }, ref) => (
  <BaseToggleGroup
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 rounded-lg bg-card/70 backdrop-blur-12 border border-border p-1',
      className
    )}
    {...props}
  />
))
ToggleGroup.displayName = 'ToggleGroup'

export { Toggle, ToggleGroup, toggleVariants }
