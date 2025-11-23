/**
 * Meter Component - Ozean Licht Edition
 * Based on Base UI Meter with Ozean Licht styling
 *
 * A visual representation of a measurement within a known range (e.g., temperature, disk usage).
 * Supports accessible labels, custom values, and smooth animations.
 *
 * @example
 * ```tsx
 * <Meter value={40}>
 *   <MeterLabel>Progress</MeterLabel>
 *   <MeterValue />
 * </Meter>
 * ```
 */

import * as React from 'react'
import { Meter as BaseMeter } from '@base-ui-components/react/meter'
import { cn } from '../utils/cn'

/**
 * Meter Root Component
 * Groups all parts of the meter and provides the value for screen readers.
 */
export interface MeterProps
  extends React.ComponentPropsWithoutRef<typeof BaseMeter.Root> {}

const Meter = React.forwardRef<
  HTMLDivElement,
  MeterProps
>(({ className, ...props }, ref) => (
  <BaseMeter.Root
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
))
Meter.displayName = 'Meter'

/**
 * Meter Track Component
 * Contains the meter indicator and represents the entire range of the meter.
 * Provides the visual container with dark background and glass effect.
 */
export interface MeterTrackProps
  extends React.ComponentPropsWithoutRef<typeof BaseMeter.Track> {}

const MeterTrack = React.forwardRef<
  HTMLDivElement,
  MeterTrackProps
>(({ className, ...props }, ref) => (
  <BaseMeter.Track
    ref={ref}
    className={cn(
      'relative h-3 w-full overflow-hidden rounded-lg',
      'bg-card/70 backdrop-blur-8',
      'border border-primary/20',
      'shadow-inner',
      className
    )}
    {...props}
  />
))
MeterTrack.displayName = 'MeterTrack'

/**
 * Meter Indicator Component
 * Visualizes the position of the value along the range.
 * Displays as a filled portion with primary color and gradient effect.
 */
export interface MeterIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseMeter.Indicator> {}

const MeterIndicator = React.forwardRef<
  HTMLDivElement,
  MeterIndicatorProps
>(({ className, ...props }, ref) => (
  <BaseMeter.Indicator
    ref={ref}
    className={cn(
      'h-full rounded-lg',
      'bg-gradient-to-r from-primary to-primary/80',
      'shadow-lg shadow-primary/30',
      'transition-all duration-500 ease-in-out',
      className
    )}
    {...props}
  />
))
MeterIndicator.displayName = 'MeterIndicator'

/**
 * Meter Label Component
 * An accessible label for the meter using Montserrat font (font-alt).
 */
export interface MeterLabelProps
  extends React.ComponentPropsWithoutRef<typeof BaseMeter.Label> {}

const MeterLabel = React.forwardRef<
  HTMLSpanElement,
  MeterLabelProps
>(({ className, ...props }, ref) => (
  <BaseMeter.Label
    ref={ref}
    className={cn(
      'text-sm font-alt font-medium text-foreground',
      className
    )}
    {...props}
  />
))
MeterLabel.displayName = 'MeterLabel'

/**
 * Meter Value Component
 * Displays the current value as a formatted number with percentage.
 * Renders in primary color for visual emphasis.
 */
export interface MeterValueProps
  extends React.ComponentPropsWithoutRef<typeof BaseMeter.Value> {}

const MeterValue = React.forwardRef<
  HTMLSpanElement,
  MeterValueProps
>(({ className, children, ...props }, ref) => (
  <BaseMeter.Value
    ref={ref}
    className={cn(
      'text-sm font-sans font-medium text-primary',
      className
    )}
    {...props}
  >
    {typeof children === 'function'
      ? children
      : (formattedValue) => `${formattedValue}%`}
  </BaseMeter.Value>
))
MeterValue.displayName = 'MeterValue'

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue }
