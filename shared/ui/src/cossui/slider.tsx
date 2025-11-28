'use client';

/**
 * Slider Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui-components/react/slider'
import { cn } from '../utils/cn'

/**
 * Slider Root - Base component
 */
const SliderRoot = BaseSlider.Root

/**
 * Slider Track
 */
const SliderTrack = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Track>
>(({ className, ...props }, ref) => (
  <BaseSlider.Track
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-card/70 backdrop-blur-md border border-border',
      className
    )}
    {...props}
  />
))
SliderTrack.displayName = 'SliderTrack'

/**
 * Slider Indicator
 */
const SliderIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Indicator>
>(({ className, ...props }, ref) => (
  <BaseSlider.Indicator
    ref={ref}
    className={cn('absolute h-full bg-primary shadow-sm shadow-primary/20', className)}
    {...props}
  />
))
SliderIndicator.displayName = 'SliderIndicator'

/**
 * Slider Thumb
 */
const SliderThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Thumb>
>(({ className, ...props }, ref) => (
  <BaseSlider.Thumb
    ref={ref}
    className={cn(
      'block h-5 w-5 rounded-full border-2 border-primary bg-white shadow-lg',
      'transition-all duration-200',
      'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'cursor-grab active:cursor-grabbing active:scale-105',
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = 'SliderThumb'

/**
 * Slider Component - Using Control and Input
 */
const Slider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Root> & {
    children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => {
  return (
    <BaseSlider.Root ref={ref} className={cn('relative w-full', className)} {...props}>
      {children}
      <BaseSlider.Control className="relative w-full h-5 flex items-center">
        <BaseSlider.Track className="relative h-2 w-full overflow-hidden rounded-full bg-card/70 backdrop-blur-md border border-border">
          <BaseSlider.Indicator className="absolute h-full bg-primary shadow-sm shadow-primary/20" />
        </BaseSlider.Track>
        <BaseSlider.Thumb className={cn(
          'absolute -translate-x-1/2',
          'block h-5 w-5 rounded-full border-2 border-primary bg-white shadow-lg',
          'transition-transform duration-200',
          'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          'cursor-grab active:cursor-grabbing active:scale-105'
        )} />
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
})
Slider.displayName = 'Slider'

/**
 * Slider Value - Displays the current slider value
 */
const SliderValue = React.forwardRef<
  HTMLOutputElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Value>
>(({ className, ...props }, ref) => (
  <BaseSlider.Value
    ref={ref}
    className={cn('text-sm font-sans font-medium text-primary', className)}
    {...props}
  />
))
SliderValue.displayName = 'SliderValue'

export {
  Slider,
  SliderRoot,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue
}
