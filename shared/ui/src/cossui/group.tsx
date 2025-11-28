'use client';

/**
 * Group Component - Ozean Licht Edition
 * Generic grouping component for related elements
 *
 * A versatile component for organizing related elements with support for
 * labels, different orientations, spacing options, and visual variants.
 * Perfect for button groups, form controls, navigation items, and more.
 *
 * Features:
 * - Multiple orientations (horizontal, vertical)
 * - Flexible spacing (tight, normal, loose)
 * - Visual variants (default, bordered, separated)
 * - Optional labels with proper ARIA relationships
 * - Glass morphism effects matching Ozean Licht design
 * - Full accessibility with role="group" and aria-labelledby
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Root Group Component with variants
const groupRootVariants = cva(
  'flex items-stretch',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      spacing: {
        tight: '',
        normal: '',
        loose: '',
      },
      variant: {
        default: '',
        bordered: 'border border-[#0E282E] rounded-lg bg-card/50 backdrop-blur-8 p-3',
        separated: '',
      },
    },
    compoundVariants: [
      // Horizontal spacing
      { orientation: 'horizontal', spacing: 'tight', class: 'gap-0.5' },
      { orientation: 'horizontal', spacing: 'normal', class: 'gap-2' },
      { orientation: 'horizontal', spacing: 'loose', class: 'gap-4' },
      // Vertical spacing
      { orientation: 'vertical', spacing: 'tight', class: 'gap-1' },
      { orientation: 'vertical', spacing: 'normal', class: 'gap-3' },
      { orientation: 'vertical', spacing: 'loose', class: 'gap-6' },
      // Bordered variant adjustments
      { variant: 'bordered', orientation: 'horizontal', class: 'items-center' },
      { variant: 'bordered', orientation: 'vertical', class: 'items-stretch' },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      spacing: 'normal',
      variant: 'default',
    },
  }
)

export interface GroupRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof groupRootVariants> {
  /**
   * ID for the group label (used for aria-labelledby)
   */
  labelId?: string
  /**
   * Render prop to customize the root element
   * Example: <GroupRoot render={<section />}>...</GroupRoot>
   */
  render?: React.ReactElement
}

/**
 * GroupRoot Component
 * Main container for grouped elements
 *
 * @example
 * // Basic horizontal group
 * <GroupRoot>
 *   <GroupItem>Item 1</GroupItem>
 *   <GroupItem>Item 2</GroupItem>
 * </GroupRoot>
 *
 * @example
 * // Vertical group with label
 * <GroupRoot orientation="vertical" labelId="group-label">
 *   <GroupLabel id="group-label">Actions</GroupLabel>
 *   <GroupContent>
 *     <GroupItem>Action 1</GroupItem>
 *     <GroupItem>Action 2</GroupItem>
 *   </GroupContent>
 * </GroupRoot>
 */
const GroupRoot = React.forwardRef<HTMLDivElement, GroupRootProps>(
  ({ className, orientation, spacing, variant, labelId, render, children, ...props }, ref) => {
    const groupClasses = cn(
      groupRootVariants({ orientation, spacing, variant }),
      className
    )

    // If render prop is provided, use composition pattern
    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        ref,
        role: 'group',
        'aria-labelledby': labelId,
        className: cn(groupClasses, render.props.className),
        ...props,
        children: children || render.props.children,
      })
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        className={groupClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GroupRoot.displayName = 'GroupRoot'

export interface GroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Render prop to customize the label element
   * Example: <GroupLabel render={<h3 />}>Title</GroupLabel>
   */
  render?: React.ReactElement
}

/**
 * GroupLabel Component
 * Optional label for the group with proper semantic styling
 *
 * @example
 * <GroupLabel id="actions-label">Available Actions</GroupLabel>
 */
const GroupLabel = React.forwardRef<HTMLDivElement, GroupLabelProps>(
  ({ className, render, children, ...props }, ref) => {
    const labelClasses = cn(
      'text-sm font-medium text-white mb-2',
      className
    )

    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        ref,
        className: cn(labelClasses, render.props.className),
        ...props,
        children: children || render.props.children,
      })
    }

    return (
      <div ref={ref} className={labelClasses} {...props}>
        {children}
      </div>
    )
  }
)
GroupLabel.displayName = 'GroupLabel'

export interface GroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Render prop to customize the content container
   */
  render?: React.ReactElement
  /**
   * Orientation inherited from parent (for proper layout)
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Spacing inherited from parent
   */
  spacing?: 'tight' | 'normal' | 'loose'
}

/**
 * GroupContent Component
 * Container for group items when you have a label
 * Automatically applies proper flex layout
 *
 * @example
 * <GroupRoot orientation="vertical" labelId="group-label">
 *   <GroupLabel id="group-label">Actions</GroupLabel>
 *   <GroupContent orientation="vertical" spacing="normal">
 *     <GroupItem>Action 1</GroupItem>
 *     <GroupItem>Action 2</GroupItem>
 *   </GroupContent>
 * </GroupRoot>
 */
const GroupContent = React.forwardRef<HTMLDivElement, GroupContentProps>(
  ({ className, render, orientation = 'horizontal', spacing = 'normal', children, ...props }, ref) => {
    const contentClasses = cn(
      'flex items-stretch',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      orientation === 'horizontal' && spacing === 'tight' && 'gap-0.5',
      orientation === 'horizontal' && spacing === 'normal' && 'gap-2',
      orientation === 'horizontal' && spacing === 'loose' && 'gap-4',
      orientation === 'vertical' && spacing === 'tight' && 'gap-1',
      orientation === 'vertical' && spacing === 'normal' && 'gap-3',
      orientation === 'vertical' && spacing === 'loose' && 'gap-6',
      className
    )

    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        ref,
        className: cn(contentClasses, render.props.className),
        ...props,
        children: children || render.props.children,
      })
    }

    return (
      <div ref={ref} className={contentClasses} {...props}>
        {children}
      </div>
    )
  }
)
GroupContent.displayName = 'GroupContent'

export interface GroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Render prop to customize the item element
   * Example: <GroupItem render={<Button />}>Click me</GroupItem>
   */
  render?: React.ReactElement
  /**
   * Whether this item should be separated from others (adds border)
   */
  separated?: boolean
  /**
   * Orientation of parent group (for separator positioning)
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * GroupItem Component
 * Individual item within a group
 * Can be used with separated prop to add dividers between items
 *
 * @example
 * // Basic item
 * <GroupItem>Content</GroupItem>
 *
 * @example
 * // With separator
 * <GroupItem separated orientation="horizontal">Item with left border</GroupItem>
 */
const GroupItem = React.forwardRef<HTMLDivElement, GroupItemProps>(
  ({ className, render, separated = false, orientation = 'horizontal', children, ...props }, ref) => {
    const itemClasses = cn(
      'flex items-center',
      separated && orientation === 'horizontal' && 'border-l border-[#0E282E] pl-2 first:border-l-0 first:pl-0',
      separated && orientation === 'vertical' && 'border-t border-[#0E282E] pt-2 first:border-t-0 first:pt-0',
      className
    )

    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        ref,
        className: cn(itemClasses, render.props.className),
        ...props,
        children: children || render.props.children,
      })
    }

    return (
      <div ref={ref} className={itemClasses} {...props}>
        {children}
      </div>
    )
  }
)
GroupItem.displayName = 'GroupItem'

export { GroupRoot, GroupLabel, GroupContent, GroupItem, groupRootVariants }
