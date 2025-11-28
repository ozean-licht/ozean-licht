'use client';

/**
 * Menu Component - Ozean Licht Edition
 * Based on Base UI with Ozean Licht design system
 *
 * Wraps Base UI's namespace API (Menu.Root, Menu.Trigger, etc.)
 * with Ozean Licht styling while maintaining the same component exports.
 */

import * as React from 'react'
import { Menu as BaseMenu } from '@base-ui-components/react/menu'
import { cn } from '../utils/cn'

/**
 * Menu Root Component - Wrapper around BaseMenu.Root
 */
const Menu = BaseMenu.Root

/**
 * Menu Trigger - Button that opens the menu
 * Wraps BaseMenu.Trigger with Ozean Licht styling
 */
const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2',
      'h-8 text-sm',
      'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 font-sans font-medium',
      'hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
      'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </BaseMenu.Trigger>
))
MenuTrigger.displayName = 'MenuTrigger'

/**
 * Menu Portal - Portal for overlay rendering
 * Wraps BaseMenu.Portal
 */
const MenuPortal = BaseMenu.Portal

/**
 * Menu Positioner - Required by Base UI for positioning
 * Wraps BaseMenu.Positioner
 */
const MenuPositioner = BaseMenu.Positioner

/**
 * Menu Popup - The menu content container
 * Wraps BaseMenu.Popup with Ozean Licht styling
 * Internally wraps with Portal and Positioner (required by Base UI)
 */
const MenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> & {
    children?: React.ReactNode
    sideOffset?: number
  }
>(({ className, children, sideOffset = 8, ...props }, ref) => (
  <BaseMenu.Portal>
    <BaseMenu.Positioner sideOffset={sideOffset}>
      <BaseMenu.Popup
        ref={ref}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-lg p-1',
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
        {children}
      </BaseMenu.Popup>
    </BaseMenu.Positioner>
  </BaseMenu.Portal>
))
MenuPopup.displayName = 'MenuPopup'

/**
 * Menu Item - Individual menu option
 * Wraps BaseMenu.Item with Ozean Licht styling
 */
const MenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Item>
>(({ className, disabled, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    {...props}
  />
))
MenuItem.displayName = 'MenuItem'

/**
 * Menu Separator - Visual divider between items
 * Wraps BaseMenu.Separator with Ozean Licht styling
 */
const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
MenuSeparator.displayName = 'MenuSeparator'

/**
 * Menu Group - Groups related items
 * Wraps BaseMenu.Group with Ozean Licht styling
 */
const MenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseMenu.Group
    ref={ref}
    className={cn('py-1', className)}
    {...props}
  />
))
MenuGroup.displayName = 'MenuGroup'

/**
 * Menu Group Label - Label for a group
 * Wraps BaseMenu.GroupLabel with Ozean Licht styling
 */
const MenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    className={cn(
      'px-3 py-1.5 text-xs font-alt font-medium text-primary/70',
      className
    )}
    {...props}
  />
))
MenuGroupLabel.displayName = 'MenuGroupLabel'

/**
 * Menu Checkbox Item - Checkable menu item
 * Wraps BaseMenu.CheckboxItem with Ozean Licht styling
 */
const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <BaseMenu.CheckboxItemIndicator>
        <svg
          className="h-4 w-4 fill-current text-primary"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
          />
        </svg>
      </BaseMenu.CheckboxItemIndicator>
    </span>
    {children}
  </BaseMenu.CheckboxItem>
))
MenuCheckboxItem.displayName = 'MenuCheckboxItem'

/**
 * Menu Radio Group - Container for radio items
 * Wraps BaseMenu.RadioGroup
 */
const MenuRadioGroup = BaseMenu.RadioGroup

/**
 * Menu Radio Item - Radio option in menu
 * Wraps BaseMenu.RadioItem with Ozean Licht styling
 */
const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[checked]:text-primary data-[checked]:font-medium',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <BaseMenu.RadioItemIndicator>
        <span className="h-2 w-2 rounded-full bg-primary" />
      </BaseMenu.RadioItemIndicator>
    </span>
    {children}
  </BaseMenu.RadioItem>
))
MenuRadioItem.displayName = 'MenuRadioItem'

/**
 * Menu Submenu - Nested submenu container
 * Wraps BaseMenu.SubmenuRoot
 */
const MenuSub = BaseMenu.SubmenuRoot

/**
 * Menu Submenu Trigger - Trigger for submenu
 * Wraps BaseMenu.SubmenuTrigger with Ozean Licht styling
 */
const MenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.SubmenuTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2',
      'text-sm font-sans font-light text-[#C4C8D4]',
      'outline-none transition-colors',
      'hover:bg-primary/10 hover:text-primary',
      'focus:bg-primary/10 focus:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="ml-auto h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </BaseMenu.SubmenuTrigger>
))
MenuSubTrigger.displayName = 'MenuSubTrigger'

/**
 * Menu Submenu Popup - Popup for submenu
 * Internally wraps with Portal and Positioner (required by Base UI)
 */
const MenuSubPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> & {
    children?: React.ReactNode
    sideOffset?: number
  }
>(({ className, children, sideOffset = 4, ...props }, ref) => (
  <BaseMenu.Portal>
    <BaseMenu.Positioner sideOffset={sideOffset}>
      <BaseMenu.Popup
        ref={ref}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-lg p-1',
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
        {children}
      </BaseMenu.Popup>
    </BaseMenu.Positioner>
  </BaseMenu.Portal>
))
MenuSubPopup.displayName = 'MenuSubPopup'

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubPopup,
}
