'use client';

/**
 * Autocomplete Component - Ozean Licht Edition
 * Based on Base UI Combobox with Ozean Licht design system
 *
 * An autocomplete is a searchable select component that filters suggestions
 * as you type. It combines an input field with a dropdown list of options.
 * Supports single and multi-select modes, custom rendering, and keyboard navigation.
 *
 * Note: This is an alias of the Combobox component, following the CossUI naming convention.
 * Base UI does not have a separate Autocomplete component - Combobox serves this purpose.
 */

import * as React from 'react'
import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import { cn } from '../utils/cn'

/**
 * Autocomplete Root Component
 * Groups all parts of the autocomplete. Doesn't render its own HTML element.
 *
 * Props:
 * - value: The selected value(s)
 * - onValueChange: Callback when selection changes
 * - defaultValue: Initial value
 * - multiple: Enable multi-select mode
 * - disabled: Disable the entire autocomplete
 */
const AutocompleteRoot = BaseCombobox.Root

/**
 * Autocomplete Input - The searchable input field
 * Users type here to filter suggestions and see selected values
 *
 * Key Features:
 * - Glass morphism background with backdrop blur
 * - Primary color focus ring
 * - Smooth transitions on hover/focus
 * - Proper focus management (no jumping or losing focus)
 */
const AutocompleteInput = React.forwardRef<
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
AutocompleteInput.displayName = 'AutocompleteInput'

/**
 * Autocomplete Trigger - Button to toggle the dropdown
 * Usually displays a chevron icon that rotates when open
 */
const AutocompleteTrigger = React.forwardRef<
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
AutocompleteTrigger.displayName = 'AutocompleteTrigger'

/**
 * Autocomplete Icon - Icon indicator (typically a search icon)
 * Displayed at the start of the input field
 */
const AutocompleteIcon = React.forwardRef<
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
AutocompleteIcon.displayName = 'AutocompleteIcon'

/**
 * Autocomplete Portal - Portal for overlay rendering
 * Renders the popup in a portal at the document root to avoid z-index issues
 */
const AutocompletePortal = BaseCombobox.Portal

/**
 * Autocomplete Positioner - Required wrapper for Popup positioning
 * Handles popup positioning relative to the trigger (below input by default)
 *
 * Critical for proper positioning - fixes the "popup spawns bottom-left" bug
 */
const AutocompletePositioner = BaseCombobox.Positioner

/**
 * Autocomplete Popup - The dropdown container
 * Contains the list of suggestions
 *
 * Key Features:
 * - Properly positioned below the input (via Portal + Positioner)
 * - Glass morphism with backdrop blur
 * - Smooth animations (fade + zoom + slide)
 * - Proper z-index layering (z-50)
 * - Border with primary color glow
 *
 * Critical Fix: Always wrap with Portal and Positioner for correct positioning
 */
const AutocompletePopup = React.forwardRef<
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
AutocompletePopup.displayName = 'AutocompletePopup'

/**
 * Autocomplete List - Container for items
 * Scrollable list that contains all the suggestion items
 *
 * Features:
 * - Max height with overflow scroll
 * - Keyboard navigation support (built into Base UI)
 */
const AutocompleteList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
>(({ className, ...props }, ref) => (
  <BaseCombobox.List
    ref={ref}
    className={cn('p-1 max-h-[300px] overflow-y-auto', className)}
    {...props}
  />
))
AutocompleteList.displayName = 'AutocompleteList'

/**
 * Autocomplete Item - Individual suggestion in the dropdown
 * Represents a single selectable option
 *
 * Features:
 * - Hover effects with primary color
 * - Focus management (no jumping or losing focus)
 * - Selected state with checkmark indicator
 * - Highlighted state during keyboard navigation
 * - Disabled state support
 */
const AutocompleteItem = React.forwardRef<
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
AutocompleteItem.displayName = 'AutocompleteItem'

/**
 * Autocomplete ItemIndicator - Indicator for selected items
 * Displays a checkmark when item is selected
 */
const AutocompleteItemIndicator = BaseCombobox.ItemIndicator

/**
 * Autocomplete Group - Groups related items together
 * Useful for categorizing suggestions (e.g., "Recent", "Popular")
 */
const AutocompleteGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Group
    ref={ref}
    className={cn('p-1 w-full', className)}
    {...props}
  />
))
AutocompleteGroup.displayName = 'AutocompleteGroup'

/**
 * Autocomplete GroupLabel - Label for a group of items
 * Displays the category name for a group
 */
const AutocompleteGroupLabel = React.forwardRef<
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
AutocompleteGroupLabel.displayName = 'AutocompleteGroupLabel'

/**
 * Autocomplete Separator - Visual separator between items
 * Used to divide different sections in the dropdown
 */
const AutocompleteSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
AutocompleteSeparator.displayName = 'AutocompleteSeparator'

/**
 * Autocomplete Empty - Message displayed when no items match
 * Shown when user's search yields no results
 */
const AutocompleteEmpty = React.forwardRef<
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
AutocompleteEmpty.displayName = 'AutocompleteEmpty'

/**
 * Autocomplete Clear - Button to clear the selection
 * Displays an X icon to reset the autocomplete
 */
const AutocompleteClear = React.forwardRef<
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
AutocompleteClear.displayName = 'AutocompleteClear'

/**
 * Autocomplete Chips - Container for selected items as chips (multi-select)
 * Displays selected values as removable chips
 */
const AutocompleteChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chips
    ref={ref}
    className={cn('flex flex-wrap gap-1', className)}
    {...props}
  />
))
AutocompleteChips.displayName = 'AutocompleteChips'

/**
 * Autocomplete Chip - Individual chip for selected item (multi-select)
 * Represents a single selected value with remove button
 */
const AutocompleteChip = React.forwardRef<
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
AutocompleteChip.displayName = 'AutocompleteChip'

/**
 * Autocomplete ChipRemove - Button to remove a chip (multi-select)
 * X button on each chip to deselect that value
 */
const AutocompleteChipRemove = React.forwardRef<
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
AutocompleteChipRemove.displayName = 'AutocompleteChipRemove'

/**
 * Autocomplete Value - Displays the selected value
 * Used to show the current selection in the input
 */
const AutocompleteValue = BaseCombobox.Value

/**
 * Autocomplete Status - Status message for screen readers
 * Announces selection count and state to assistive technologies
 */
const AutocompleteStatus = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Status
    ref={ref}
    className={cn('sr-only', className)}
    {...props}
  />
))
AutocompleteStatus.displayName = 'AutocompleteStatus'

// Export with CossUI prefix to avoid conflicts
export {
  AutocompleteRoot as CossUIAutocompleteRoot,
  AutocompleteInput as CossUIAutocompleteInput,
  AutocompleteTrigger as CossUIAutocompleteTrigger,
  AutocompleteIcon as CossUIAutocompleteIcon,
  AutocompletePortal as CossUIAutocompletePortal,
  AutocompletePositioner as CossUIAutocompletePositioner,
  AutocompletePopup as CossUIAutocompletePopup,
  AutocompleteList as CossUIAutocompleteList,
  AutocompleteItem as CossUIAutocompleteItem,
  AutocompleteItemIndicator as CossUIAutocompleteItemIndicator,
  AutocompleteGroup as CossUIAutocompleteGroup,
  AutocompleteGroupLabel as CossUIAutocompleteGroupLabel,
  AutocompleteSeparator as CossUIAutocompleteSeparator,
  AutocompleteEmpty as CossUIAutocompleteEmpty,
  AutocompleteClear as CossUIAutocompleteClear,
  AutocompleteChips as CossUIAutocompleteChips,
  AutocompleteChip as CossUIAutocompleteChip,
  AutocompleteChipRemove as CossUIAutocompleteChipRemove,
  AutocompleteValue as CossUIAutocompleteValue,
  AutocompleteStatus as CossUIAutocompleteStatus,
}

// Also export without prefix for convenience
export {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteIcon,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteItemIndicator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteSeparator,
  AutocompleteEmpty,
  AutocompleteClear,
  AutocompleteChips,
  AutocompleteChip,
  AutocompleteChipRemove,
  AutocompleteValue,
  AutocompleteStatus,
}
