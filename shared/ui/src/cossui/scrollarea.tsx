'use client';

/**
 * ScrollArea Component - Ozean Licht Edition
 * Based on Radix UI ScrollArea with Ozean Licht design system
 * Custom styled scrollbars with glass effect and primary color (#0ec2bc)
 */

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '../utils/cn'

/**
 * ScrollArea Root - Main container for scrollable content
 * Handles both vertical and horizontal scrolling with custom styled scrollbars
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner className="bg-card/50 backdrop-blur-8" />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = 'ScrollArea'

/**
 * ScrollBar - Custom styled scrollbar with Ozean Licht theme
 * Vertical and horizontal orientations supported
 * Features:
 * - Thin scrollbar design (2.5px width)
 * - Primary color (#0ec2bc) with glass effect
 * - Smooth hover states
 * - Transparent track with subtle border
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(
  (
    { className, orientation = 'vertical', ...props },
    ref
  ) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        // Base scrollbar styles
        'bg-transparent',
        // Vertical scrollbar
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-border/30 p-[1px]',
        // Horizontal scrollbar
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-border/30 p-[1px]',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          'relative flex-1 rounded-full transition-all duration-200',
          // Base thumb styles with Ozean Licht primary color
          'bg-primary/70 backdrop-blur-12',
          // Glass effect with subtle border
          'border border-primary/20 shadow-lg shadow-primary/10',
          // Hover state - brighter primary with enhanced shadow
          'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/40',
          // Active state for better UX
          'active:bg-primary hover:scale-110',
          // Smooth transitions
          'transition-all duration-150'
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
)
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }
