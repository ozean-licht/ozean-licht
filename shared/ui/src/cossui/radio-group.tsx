/**
 * Radio & RadioGroup Components - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group'
import { Radio as RadioNamespace } from '@base-ui-components/react/radio'
import { cn } from '../utils/cn'

/**
 * RadioGroup Component
 * Container for grouping radio buttons
 * Wraps Base UI RadioGroup with Ozean Licht styling
 */
const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseRadioGroup>
>(({ className, ...props }, ref) => (
  <BaseRadioGroup
    ref={ref}
    className={cn('flex flex-col gap-3', className)}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

/**
 * Radio Component
 * Individual radio button
 * Wraps Base UI Radio.Root with Ozean Licht styling
 */
const Radio = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadioNamespace.Root>
>(({ className, ...props }, ref) => (
  <RadioNamespace.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-full border-2 border-border bg-card/50 backdrop-blur-8',
      'transition-all duration-200',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary data-[state=checked]:border-[5px]',
      className
    )}
    {...props}
  />
))
Radio.displayName = 'Radio'

/**
 * RadioIndicator - Visual indicator for radio state
 * Wraps Base UI Radio.Indicator with Ozean Licht styling
 */
const RadioIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof RadioNamespace.Indicator>
>(({ className, ...props }, ref) => (
  <RadioNamespace.Indicator
    ref={ref}
    className={cn(
      'pointer-events-none flex items-center justify-center text-current',
      className
    )}
    {...props}
  >
    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
  </RadioNamespace.Indicator>
))
RadioIndicator.displayName = 'RadioIndicator'

export { RadioGroup, Radio, RadioIndicator }
