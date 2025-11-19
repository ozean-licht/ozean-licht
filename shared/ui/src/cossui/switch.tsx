/**
 * Switch Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Switch as SwitchNamespace } from '@base-ui-components/react/switch'
import { cn } from '../utils/cn'

/**
 * Switch Component
 * Toggle switch for boolean values with built-in thumb
 * Wraps Base UI Switch.Root with Ozean Licht styling
 */
const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SwitchNamespace.Root>
>(({ className, ...props }, ref) => (
  <SwitchNamespace.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
      'border-2 transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Unchecked state
      'data-[state=unchecked]:bg-card/50 data-[state=unchecked]:backdrop-blur-8 data-[state=unchecked]:border-border',
      'data-[state=unchecked]:hover:border-primary/40 data-[state=unchecked]:hover:shadow-sm data-[state=unchecked]:hover:shadow-primary/10',
      // Checked state
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'data-[state=checked]:hover:bg-primary/90',
      className
    )}
    {...props}
  >
    <SwitchNamespace.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0',
        'transition-transform duration-200',
        'data-[state=unchecked]:translate-x-0.5',
        'data-[state=checked]:translate-x-5'
      )}
    />
  </SwitchNamespace.Root>
))
Switch.displayName = 'Switch'

/**
 * SwitchThumb - The draggable thumb component
 * Wraps Base UI Switch.Thumb with Ozean Licht styling
 * Can be used for custom switch implementations
 */
const SwitchThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof SwitchNamespace.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchNamespace.Thumb
    ref={ref}
    className={cn(
      'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0',
      'transition-transform duration-200',
      'data-[state=unchecked]:translate-x-0.5',
      'data-[state=checked]:translate-x-5',
      className
    )}
    {...props}
  />
))
SwitchThumb.displayName = 'SwitchThumb'

export { Switch, SwitchThumb }
