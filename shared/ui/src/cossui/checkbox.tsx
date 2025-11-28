'use client';

/**
 * Checkbox & CheckboxGroup Components - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Checkbox as CheckboxNamespace } from '@base-ui-components/react/checkbox'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui-components/react/checkbox-group'
import { cn } from '../utils/cn'

/**
 * Checkbox Component
 * Wraps Base UI Checkbox.Root with Ozean Licht styling
 * Note: Base UI Checkbox already supports onCheckedChange prop for shadcn compatibility
 */
const Checkbox = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof CheckboxNamespace.Root>
>(({ className, ...props }, ref) => (
  <CheckboxNamespace.Root
    ref={ref}
    className={cn(
      'peer inline-flex items-center justify-center relative h-5 w-5 shrink-0 rounded border-2 border-border bg-card/50 backdrop-blur-8',
      'transition-all duration-200',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Checked state - using !important to override Base UI styles
      '[&[data-state=checked]:not([disabled])]:!bg-[#0ec2bc] [&[data-state=checked]:not([disabled])]:!border-[#0ec2bc] [&[data-state=checked]]:text-white [&[data-state=checked]:not([disabled])]:shadow-sm [&[data-state=checked]:not([disabled])]:shadow-[#0ec2bc]/20',
      // Indeterminate state
      '[&[data-state=indeterminate]:not([disabled])]:!bg-[#0ec2bc]/50 [&[data-state=indeterminate]:not([disabled])]:!border-[#0ec2bc]',
      // Disabled checked/indeterminate should stay muted
      '[&[data-state=checked][disabled]]:!bg-muted [&[data-state=checked][disabled]]:!border-muted-foreground/20',
      '[&[data-state=indeterminate][disabled]]:!bg-muted [&[data-state=indeterminate][disabled]]:!border-muted-foreground/20',
      className
    )}
    {...props}
  />
))
Checkbox.displayName = 'Checkbox'

/**
 * CheckboxIndicator Component
 * Displays the checked or indeterminate state icon inside the checkbox
 */
const CheckboxIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof CheckboxNamespace.Indicator>
>(({ className, ...props }, ref) => (
  <CheckboxNamespace.Indicator
    ref={ref}
    className={cn(
      'pointer-events-none flex items-center justify-center text-white',
      'transition-opacity duration-200',
      className
    )}
    {...props}
  >
    <svg
      className="h-full w-full fill-white"
      viewBox="0 0 16 16"
      aria-hidden="true"
      data-testid="checkbox-indicator-icon"
    >
      {/* Checkmark icon */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
      />
    </svg>
  </CheckboxNamespace.Indicator>
))
CheckboxIndicator.displayName = 'CheckboxIndicator'

/**
 * CheckboxGroup Component
 * Container for grouping related checkboxes
 */
const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(({ className, ...props }, ref) => (
  <BaseCheckboxGroup
    ref={ref}
    className={cn('flex flex-col gap-3', className)}
    {...props}
  />
))
CheckboxGroup.displayName = 'CheckboxGroup'

export { Checkbox, CheckboxIndicator, CheckboxGroup }
