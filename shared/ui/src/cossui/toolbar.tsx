'use client';

/**
 * Toolbar Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 *
 * A horizontal toolbar for organizing related action buttons and controls.
 * Provides glass-morphism effects, grouping, separators, and full accessibility.
 *
 * Features:
 * - Glass effect container with subtle border
 * - Support for grouped buttons with flexible spacing
 * - Vertical separators between button groups
 * - Support for custom render prop composition
 * - Full ARIA toolbar role and accessibility
 * - Ozean turquoise (#0ec2bc) primary color with hover glow effects
 * - Icon button support with size variants
 */

import * as React from 'react'
import { Toolbar as BaseToolbar } from '@base-ui-components/react/toolbar'
import { cn } from '../utils/cn'

/**
 * Toolbar Root Component
 * Main container for all toolbar items - establishes flexbox layout with glass effect
 *
 * @example
 * <Toolbar>
 *   <ToolbarGroup>
 *     <ToolbarButton>Bold</ToolbarButton>
 *   </ToolbarGroup>
 *   <ToolbarSeparator />
 *   <ToolbarButton>Save</ToolbarButton>
 * </Toolbar>
 */
const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Root
    ref={ref}
    role="toolbar"
    className={cn(
      // Layout: horizontal flex with items centered
      'inline-flex items-center',
      // Glass effect: semi-transparent background with backdrop blur
      'bg-card/70 backdrop-blur-12',
      // Border: subtle primary color with low opacity
      'border border-primary/20',
      // Spacing & sizing
      'gap-1 p-2 rounded-lg',
      // Shadow: soft glow effect
      'shadow-lg shadow-primary/5',
      // Transitions for smooth animations
      'transition-all duration-200',
      className
    )}
    {...props}
  />
))
Toolbar.displayName = 'Toolbar'

/**
 * ToolbarGroup Component
 * Groups related toolbar buttons together with consistent spacing
 *
 * Use groups to:
 * - Visually organize related controls
 * - Add separators between groups using ToolbarSeparator
 * - Support multiple formatting options or view modes
 *
 * @example
 * <ToolbarGroup>
 *   <ToolbarButton>Bold</ToolbarButton>
 *   <ToolbarButton>Italic</ToolbarButton>
 * </ToolbarGroup>
 */
const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Group
    ref={ref}
    className={cn(
      // Layout: flex items horizontally with small gap
      'flex items-center gap-0.5',
      className
    )}
    {...props}
  />
))
ToolbarGroup.displayName = 'ToolbarGroup'

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof BaseToolbar.Button> {
  /**
   * Render prop for composition (e.g., wrapping with Link or Toggle)
   * Example: <ToolbarButton render={<Link href="/save" />}>Save</ToolbarButton>
   */
  render?: React.ReactElement
  /**
   * Size variant for different button styles
   * - icon: small square button for icons (h-7 w-7)
   * - sm: small button (h-7)
   * - default: standard button (h-8)
   * - lg: large button (h-9)
   */
  size?: 'icon' | 'sm' | 'default' | 'lg'
  /**
   * Visual style variant
   * - default: glass effect with primary border
   * - ghost: minimal with no background
   * - outline: transparent with border
   */
  variant?: 'default' | 'ghost' | 'outline'
}

/**
 * ToolbarButton Component
 * Individual button within a toolbar with support for icons and text
 *
 * Features:
 * - Glass morphism styling matching Ozean Licht design
 * - Hover glow effect with primary color
 * - Focus ring for keyboard navigation
 * - Support for icon-only buttons
 * - Composition via render prop
 *
 * @example
 * // Text button
 * <ToolbarButton>Save</ToolbarButton>
 *
 * // Icon button
 * <ToolbarButton size="icon" aria-label="Bold">
 *   B
 * </ToolbarButton>
 *
 * // With Toggle composition
 * <ToolbarButton render={<Toggle />}>Bold</ToolbarButton>
 */
const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, render, size = 'default', variant = 'default', children, ...props }, ref) => {
    // Determine styles based on size variant
    const sizeClasses = {
      icon: 'h-7 w-7 px-0',
      sm: 'h-7 px-2 text-xs',
      default: 'h-8 px-3 text-sm',
      lg: 'h-9 px-4 text-base',
    }

    // Determine styles based on variant
    const variantClasses = {
      default:
        'bg-card/60 text-primary border border-primary/30 hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
      ghost:
        'text-primary hover:bg-primary/10 hover:text-primary/90 hover:shadow-lg hover:shadow-primary/10',
      outline:
        'bg-transparent border border-border text-primary hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
    }

    const baseClasses = cn(
      // Layout
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
      // Typography
      'font-sans font-medium',
      // Focus states with Ozean turquoise ring
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Disabled state
      'disabled:pointer-events-none disabled:opacity-50',
      // Active state
      'active:scale-95',
      // Transitions
      'transition-all duration-150',
      // Apply size variant
      sizeClasses[size],
      // Apply variant
      variantClasses[variant],
      className
    )

    // If render prop is provided, use composition pattern
    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        className: cn(baseClasses, render.props.className),
        ref,
        ...props,
      })
    }

    // Otherwise render as button
    return (
      <BaseToolbar.Button
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
      </BaseToolbar.Button>
    )
  }
)
ToolbarButton.displayName = 'ToolbarButton'

/**
 * ToolbarSeparator Component
 * Visual divider between toolbar groups or individual buttons
 *
 * Creates a vertical line to separate logical groups of toolbar items.
 *
 * @example
 * <Toolbar>
 *   <ToolbarGroup>
 *     <ToolbarButton>Bold</ToolbarButton>
 *   </ToolbarGroup>
 *   <ToolbarSeparator />
 *   <ToolbarButton>Save</ToolbarButton>
 * </Toolbar>
 */
const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Separator
    ref={ref}
    role="separator"
    aria-orientation="vertical"
    className={cn(
      // Vertical line sizing
      'h-6 w-px',
      // Muted color matching Ozean Licht design
      'bg-primary/20',
      // Margins for spacing around separator
      'mx-1',
      // Smooth transitions
      'transition-colors duration-200',
      className
    )}
    {...props}
  />
))
ToolbarSeparator.displayName = 'ToolbarSeparator'

export { Toolbar, ToolbarGroup, ToolbarButton, ToolbarSeparator }
