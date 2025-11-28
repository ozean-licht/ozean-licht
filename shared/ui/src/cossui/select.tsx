'use client';

/**
 * Select Component - Ozean Licht Edition
 * Based on Base UI with Ozean Licht design system
 *
 * Wraps Base UI's namespace API (Select.Root, Select.Trigger, etc.)
 * with Ozean Licht styling while maintaining the same component exports.
 */

import * as React from 'react'
import { Select as BaseSelect } from '@base-ui-components/react/select'
import { cn } from '../utils/cn'

/**
 * Select Root Component - Wrapper around BaseSelect.Root
 */
const Select = BaseSelect.Root

/**
 * Select Trigger - The button that opens the select
 * Wraps BaseSelect.Trigger with Ozean Licht styling
 */
const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between gap-2 rounded-md',
      'bg-card/70 backdrop-blur-sm border border-primary/25 px-3 py-2',
      'text-sm font-sans text-foreground',
      'transition-all duration-200',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[placeholder]:text-muted-foreground',
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="h-4 w-4 text-primary transition-transform data-[state=open]:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </BaseSelect.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

/**
 * Select Value - Displays the selected value
 * Wraps BaseSelect.Value with Ozean Licht styling
 *
 * Note: Base UI's SelectValue doesn't support placeholder prop natively,
 * but we accept it for API compatibility - it's handled by the trigger.
 */
const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Value> & {
    placeholder?: string
  }
>(({ className, placeholder, ...props }, ref) => (
  <BaseSelect.Value
    ref={ref}
    className={cn('text-left font-sans', className)}
    {...props}
  />
))
SelectValue.displayName = 'SelectValue'

/**
 * Select Portal - Portal for overlay rendering
 * Wraps BaseSelect.Portal (if available)
 */
const SelectPortal = BaseSelect.Portal

/**
 * Select Positioner - Required wrapper for Popup
 * Wraps BaseSelect.Positioner
 */
const SelectPositioner = BaseSelect.Positioner

/**
 * Select Popup - The dropdown container
 * Internally wraps with Portal and Positioner (similar to Popover)
 * Wraps BaseSelect.Popup with Ozean Licht styling
 */
const SelectPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> & {
    align?: React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner>['align']
    side?: React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner>['side']
    sideOffset?: number
    alignOffset?: number
    collisionBoundary?: React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner>['collisionBoundary']
    collisionPadding?: React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner>['collisionPadding']
  }
>(({ className, children, align, side, sideOffset = 4, alignOffset, collisionBoundary, collisionPadding, ...props }, ref) => (
  <BaseSelect.Portal>
    <BaseSelect.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      className="z-[9999]"
    >
      <BaseSelect.Popup
        ref={ref}
        className={cn(
          'min-w-[var(--anchor-width)] overflow-hidden rounded-md',
          'bg-card/95 backdrop-blur-xl border border-primary/25',
          'shadow-lg shadow-primary/10',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        <BaseSelect.List className="p-1">
          {children}
        </BaseSelect.List>
      </BaseSelect.Popup>
    </BaseSelect.Positioner>
  </BaseSelect.Portal>
))
SelectPopup.displayName = 'SelectPopup'

/**
 * Select Item - Individual option in the dropdown
 * Wraps BaseSelect.Item with Ozean Licht styling
 */
const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ className, children, disabled, ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2',
      'text-sm font-sans text-foreground',
      'outline-none transition-colors',
      'hover:bg-primary/20 hover:text-white',
      'focus:bg-primary/20 focus:text-white',
      'data-[selected]:bg-primary/20 data-[selected]:text-white',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    {...props}
  >
    <BaseSelect.ItemText className="flex-1">{children}</BaseSelect.ItemText>
    <BaseSelect.ItemIndicator className="ml-2 flex h-4 w-4 items-center justify-center">
      <svg
        className="h-4 w-4 fill-primary"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
        />
      </svg>
    </BaseSelect.ItemIndicator>
  </BaseSelect.Item>
))
SelectItem.displayName = 'SelectItem'

/**
 * Select Separator - Visual separator between items
 */
const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'

/**
 * Select Group - Groups related items together
 * Wraps BaseSelect.Group with Ozean Licht styling
 */
const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Group>
>(({ className, ...props }, ref) => (
  <BaseSelect.Group
    ref={ref}
    className={cn('p-1 w-full', className)}
    {...props}
  />
))
SelectGroup.displayName = 'SelectGroup'

/**
 * Select Label - Label for a group of items
 * Wraps BaseSelect.GroupLabel with Ozean Licht styling
 */
const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-alt font-medium text-primary/70',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
}
