/**
 * Switch Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Switch as SwitchNamespace } from '@base-ui-components/react/switch'
import { cn } from '../utils/cn'

/**
 * Switch Component
 * Toggle switch for boolean values
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
      'border-2 border-transparent transition-colors duration-200',
      'bg-card/50 backdrop-blur-8 border-border',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      className
    )}
    {...props}
  />
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
