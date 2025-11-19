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
      'flex h-10 w-full items-center justify-between gap-2 rounded-lg',
      'bg-card/70 backdrop-blur-12 border border-border px-3 py-2',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'transition-all duration-200',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[placeholder]:text-[#C4C8D4]/50',
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="h-4 w-4 opacity-50 transition-transform data-[state=open]:rotate-180"
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
 * Select Positioner - Required wrapper for Popup
 * Wraps BaseSelect.Positioner
 */
const SelectPositioner = BaseSelect.Positioner

/**
 * Select Popup - The dropdown container
 * Must be placed within SelectPositioner
 * Wraps BaseSelect.Popup with Ozean Licht styling
 */
const SelectPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Popup>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Popup
    ref={ref}
    className={cn(
      'relative z-50 min-w-[8rem] overflow-hidden rounded-lg',
      'bg-card/90 backdrop-blur-16 border border-primary/20',
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
    <div className="p-1">{children}</div>
  </BaseSelect.Popup>
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
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[selected]:bg-primary/20 data-[selected]:text-primary data-[selected]:font-medium',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <span className="ml-2 flex h-4 w-4 items-center justify-center opacity-0 data-[selected]:opacity-100">
      <svg
        className="h-4 w-4 fill-current"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
        />
      </svg>
    </span>
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
  SelectPositioner,
  SelectPopup,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
}
