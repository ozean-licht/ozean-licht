'use client';

/**
 * Popover Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Popover } from '@base-ui-components/react/popover'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../utils/cn'

/**
 * Popover Root Component
 */
const PopoverRoot = Popover.Root

/**
 * Popover Portal - Portal for overlay rendering
 * Wraps Popover.Portal
 */
const PopoverPortal = Popover.Portal

/**
 * Popover Positioner - Required by Base UI for positioning
 * Wraps Popover.Positioner
 */
const PopoverPositioner = Popover.Positioner

/**
 * Popover Backdrop - Background overlay
 */
const PopoverBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Popover.Backdrop>
>(({ className, ...props }, ref) => (
  <Popover.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[#00070F]/80 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
PopoverBackdrop.displayName = 'PopoverBackdrop'

/**
 * Popover Trigger Props - Extends Base UI with asChild support
 */
interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Popover.Trigger> {
  /**
   * When true, renders the child element as the trigger
   * (shadcn compatibility)
   */
  asChild?: boolean
}

/**
 * Popover Trigger - Button/element that opens the popover
 */
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    // Use Slot for asChild pattern (proper prop/ref merging)
    const Comp = asChild ? Slot : Popover.Trigger

    // Extract common className string to avoid duplication
    const triggerClassName = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
      'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 font-sans font-medium',
      'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
      'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
      className
    )

    return (
      <Comp
        ref={ref}
        className={triggerClassName}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
PopoverTrigger.displayName = 'PopoverTrigger'

/**
 * Popover Popup - The popover content container
 * Wraps Popover.Popup with Ozean Licht styling
 * Internally wraps with Portal and Positioner (required by Base UI)
 */
const PopoverPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Popover.Popup> & {
    children?: React.ReactNode
    align?: React.ComponentPropsWithoutRef<typeof Popover.Positioner>['align']
    side?: React.ComponentPropsWithoutRef<typeof Popover.Positioner>['side']
    sideOffset?: number
    alignOffset?: number
    collisionBoundary?: React.ComponentPropsWithoutRef<typeof Popover.Positioner>['collisionBoundary']
    collisionPadding?: React.ComponentPropsWithoutRef<typeof Popover.Positioner>['collisionPadding']
  }
>(({ className, children, align, side, sideOffset = 8, alignOffset, collisionBoundary, collisionPadding, ...props }, ref) => (
  <Popover.Portal>
    <Popover.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
    >
      <Popover.Popup
        ref={ref}
        className={cn(
          'z-50 w-72 rounded-lg',
          'bg-card/90 backdrop-blur-16 border border-primary/20',
          'shadow-lg shadow-primary/10 p-4',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
))
PopoverPopup.displayName = 'PopoverPopup'

/**
 * Popover Title - Accessible title for the popover
 */
const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Popover.Title>
>(({ className, ...props }, ref) => (
  <Popover.Title
    ref={ref}
    className={cn(
      'font-decorative text-lg font-normal leading-none text-white mb-2',
      className
    )}
    {...props}
  />
))
PopoverTitle.displayName = 'PopoverTitle'

/**
 * Popover Description - Accessible description for the popover
 */
const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Popover.Description>
>(({ className, ...props }, ref) => (
  <Popover.Description
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light', className)}
    {...props}
  />
))
PopoverDescription.displayName = 'PopoverDescription'

/**
 * Popover Close - Close button for the popover
 */
const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Popover.Close>
>(({ className, children, ...props }, ref) => (
  <Popover.Close
    ref={ref}
    className={cn(
      'mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 w-full',
      'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 font-sans font-medium text-sm',
      'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
      'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'active:scale-95',
      className
    )}
    {...props}
  >
    {children || 'Close'}
  </Popover.Close>
))
PopoverClose.displayName = 'PopoverClose'

export {
  PopoverRoot as Popover,
  PopoverPortal,
  PopoverPositioner,
  PopoverBackdrop,
  PopoverTrigger,
  PopoverPopup,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
}
