/**
 * Slider Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui-components/react/slider'
import { cn } from '../utils/cn'

/**
 * Slider Component
 * Range input slider
 */
const Slider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSlider.Root> & {
    showValue?: boolean
  }
>(({ className, showValue = false, ...props }, ref: React.Ref<HTMLDivElement>) => (
  <div className="relative w-full">
    <BaseSlider.Root
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <BaseSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-card/70 backdrop-blur-12 border border-border">
        <BaseSlider.Indicator className="absolute h-full bg-primary shadow-sm shadow-primary/20" />
      </BaseSlider.Track>
      <BaseSlider.Thumb className={cn(
        'block h-5 w-5 rounded-full border-2 border-primary bg-white shadow-lg',
        'transition-all duration-200',
        'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-grab active:cursor-grabbing active:scale-105'
      )} />
    </BaseSlider.Root>
    {showValue && (
      <div className="mt-2 flex justify-between text-xs text-[#C4C8D4] font-sans font-light">
        <span>{props.min || 0}</span>
        <SliderValue className="text-primary font-medium" />
        <span>{props.max || 100}</span>
      </div>
    )}
  </div>
))
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

export { Slider, SliderValue }
