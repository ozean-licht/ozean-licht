'use client';

/**
 * Progress Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht styling
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, children, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className="relative h-2 w-full overflow-hidden rounded-full bg-card/70 backdrop-blur-8 border border-border"
        >
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out shadow-lg shadow-primary/30"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'

const ProgressLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('text-sm font-sans font-medium text-foreground', className)}
    {...props}
  />
))
ProgressLabel.displayName = 'ProgressLabel'

const ProgressValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { value?: number; max?: number }
>(({ className, value = 0, max = 100, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <span
      ref={ref}
      className={cn('text-sm font-sans font-medium text-primary', className)}
      {...props}
    >
      {Math.round(percentage)}%
    </span>
  )
})
ProgressValue.displayName = 'ProgressValue'

export { Progress, ProgressLabel, ProgressValue }
