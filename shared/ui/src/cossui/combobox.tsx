/**
 * Combobox Component - Ozean Licht Edition
 * Based on Base UI with Ozean Licht design system
 *
 * A searchable select component combining an input with a filterable dropdown.
 * Supports single and multi-select modes with customizable chip rendering.
 */

import * as React from 'react'
import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import { cn } from '../utils/cn'

/**
 * Combobox Root Component - Wrapper around BaseCombobox.Root
 * Groups all parts of the combobox. Doesn't render its own HTML element.
 */
const ComboboxRoot = BaseCombobox.Root

/**
 * Combobox Input - The searchable input field
 * Wraps BaseCombobox.Input with Ozean Licht styling
 */
const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg',
      'bg-card/70 backdrop-blur-md border border-border px-3 py-2',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'transition-all duration-200',
      'placeholder:text-[#C4C8D4]/50',
      'hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
ComboboxInput.displayName = 'ComboboxInput'

/**
 * Combobox Trigger - Button to toggle the dropdown
 * Wraps BaseCombobox.Trigger with Ozean Licht styling
 */
const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Trigger
    ref={ref}
    className={cn(
      'flex h-10 items-center justify-center',
      'px-2 text-[#C4C8D4]',
      'transition-colors hover:text-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children || (
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
    )}
  </BaseCombobox.Trigger>
))
ComboboxTrigger.displayName = 'ComboboxTrigger'

/**
 * Combobox Icon - Icon indicator (often used for search icon)
 * Wraps BaseCombobox.Icon with Ozean Licht styling
 */
const ComboboxIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Icon>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Icon
    ref={ref}
    className={cn(
      'flex items-center justify-center px-2 text-[#C4C8D4]/50',
      className
    )}
    {...props}
  >
    {children || (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    )}
  </BaseCombobox.Icon>
))
ComboboxIcon.displayName = 'ComboboxIcon'

/**
 * Combobox Portal - Portal for overlay rendering
 */
const ComboboxPortal = BaseCombobox.Portal

/**
 * Combobox Positioner - Required wrapper for Popup positioning
 */
const ComboboxPositioner = BaseCombobox.Positioner

/**
 * Combobox Popup - The dropdown container
 * Wraps BaseCombobox.Popup with Ozean Licht styling
 */
const ComboboxPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> & {
    sideOffset?: number
  }
>(({ className, children, sideOffset = 4, ...props }, ref) => (
  <BaseCombobox.Portal>
    <BaseCombobox.Positioner sideOffset={sideOffset}>
      <BaseCombobox.Popup
        ref={ref}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg',
          'bg-card/90 backdrop-blur-lg border border-primary/20',
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
        {children}
      </BaseCombobox.Popup>
    </BaseCombobox.Positioner>
  </BaseCombobox.Portal>
))
ComboboxPopup.displayName = 'ComboboxPopup'

/**
 * Combobox List - Container for items
 * Wraps BaseCombobox.List with Ozean Licht styling
 */
const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
>(({ className, ...props }, ref) => (
  <BaseCombobox.List
    ref={ref}
    className={cn('p-1 max-h-[300px] overflow-y-auto', className)}
    {...props}
  />
))
ComboboxList.displayName = 'ComboboxList'

/**
 * Combobox Item - Individual option in the dropdown
 * Wraps BaseCombobox.Item with Ozean Licht styling
 */
const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Item>
>(({ className, children, disabled, ...props }, ref) => (
  <BaseCombobox.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[selected]:bg-primary/20 data-[selected]:text-primary data-[selected]:font-medium',
      'data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <BaseCombobox.ItemIndicator className="ml-2 flex h-4 w-4 items-center justify-center">
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
    </BaseCombobox.ItemIndicator>
  </BaseCombobox.Item>
))
ComboboxItem.displayName = 'ComboboxItem'

/**
 * Combobox ItemIndicator - Indicator for selected items
 */
const ComboboxItemIndicator = BaseCombobox.ItemIndicator

/**
 * Combobox Group - Groups related items together
 * Wraps BaseCombobox.Group with Ozean Licht styling
 */
const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Group
    ref={ref}
    className={cn('p-1 w-full', className)}
    {...props}
  />
))
ComboboxGroup.displayName = 'ComboboxGroup'

/**
 * Combobox GroupLabel - Label for a group of items
 * Wraps BaseCombobox.GroupLabel with Ozean Licht styling
 */
const ComboboxGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseCombobox.GroupLabel
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-alt font-medium text-primary/70',
      className
    )}
    {...props}
  />
))
ComboboxGroupLabel.displayName = 'ComboboxGroupLabel'

/**
 * Combobox Separator - Visual separator between items
 */
const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
ComboboxSeparator.displayName = 'ComboboxSeparator'

/**
 * Combobox Empty - Message displayed when no items match the search
 * Wraps BaseCombobox.Empty with Ozean Licht styling
 */
const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Empty
    ref={ref}
    className={cn(
      'py-6 px-3 text-center text-sm text-muted-foreground',
      className
    )}
    {...props}
  />
))
ComboboxEmpty.displayName = 'ComboboxEmpty'

/**
 * Combobox Clear - Button to clear the selection
 * Wraps BaseCombobox.Clear with Ozean Licht styling
 */
const ComboboxClear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Clear>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Clear
    ref={ref}
    className={cn(
      'flex h-10 items-center justify-center px-2',
      'text-[#C4C8D4]/50 hover:text-[#C4C8D4]',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      className
    )}
    {...props}
  >
    {children || (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    )}
  </BaseCombobox.Clear>
))
ComboboxClear.displayName = 'ComboboxClear'

/**
 * Combobox Chips - Container for selected items displayed as chips (multi-select)
 * Wraps BaseCombobox.Chips with Ozean Licht styling
 */
const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chips
    ref={ref}
    className={cn('flex flex-wrap gap-1', className)}
    {...props}
  />
))
ComboboxChips.displayName = 'ComboboxChips'

/**
 * Combobox Chip - Individual chip for selected item (multi-select)
 * Wraps BaseCombobox.Chip with Ozean Licht styling
 */
const ComboboxChip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chip
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 rounded-md px-2 py-1',
      'bg-[#000F1F] border border-[#0ec2bc]/30',
      'text-xs font-sans text-[#C4C8D4]',
      'transition-all',
      'hover:border-[#0ec2bc]/50',
      className
    )}
    {...props}
  />
))
ComboboxChip.displayName = 'ComboboxChip'

/**
 * Combobox ChipRemove - Button to remove a chip (multi-select)
 * Wraps BaseCombobox.ChipRemove with Ozean Licht styling
 */
const ComboboxChipRemove = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.ChipRemove>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.ChipRemove
    ref={ref}
    className={cn(
      'flex items-center justify-center',
      'text-[#C4C8D4]/50 hover:text-[#C4C8D4]',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
      className
    )}
    {...props}
  >
    {children || (
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    )}
  </BaseCombobox.ChipRemove>
))
ComboboxChipRemove.displayName = 'ComboboxChipRemove'

/**
 * Combobox Value - Displays the selected value
 */
const ComboboxValue = BaseCombobox.Value

/**
 * Combobox Status - Status message (e.g., "3 items selected")
 * Wraps BaseCombobox.Status with Ozean Licht styling
 */
const ComboboxStatus = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Status
    ref={ref}
    className={cn('sr-only', className)}
    {...props}
  />
))
ComboboxStatus.displayName = 'ComboboxStatus'

export {
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxIcon,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
  ComboboxEmpty,
  ComboboxClear,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxValue,
  ComboboxStatus,
}
