/**
 * Collapsible Component - Ozean Licht Edition
 * Based on Base UI with Ozean Licht design system
 *
 * A simpler alternative to Accordion for creating expandable/collapsible sections.
 * Supports smooth height animations, controlled/uncontrolled modes, and disabled state.
 */

import * as React from 'react'
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible'
import { cn } from '../utils/cn'

/**
 * Collapsible Root Component
 * Groups all parts of the collapsible section.
 * Supports both controlled and uncontrolled modes.
 */
const CollapsibleRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Root
    ref={ref}
    className={cn('w-full', className)}
    {...props}
  />
))
CollapsibleRoot.displayName = 'CollapsibleRoot'

/**
 * Collapsible Trigger - Button to expand/collapse the panel
 * Includes built-in ARIA attributes and icon rotation animation
 */
interface CollapsibleTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  /**
   * Whether to show the chevron icon indicator
   * @default true
   */
  showIcon?: boolean
  /**
   * Custom icon element to replace the default chevron
   */
  icon?: React.ReactNode
}

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, children, showIcon = true, icon, ...props }, ref) => (
  <BaseCollapsible.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between gap-2',
      'text-left text-sm font-sans font-medium text-white',
      'transition-all duration-200',
      'hover:text-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'group cursor-pointer',
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    {showIcon && (
      icon || (
        <svg
          className="h-5 w-5 shrink-0 text-[#0ec2bc] transition-transform duration-200 group-data-[state=open]:rotate-180"
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
      )
    )}
  </BaseCollapsible.Trigger>
))
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

/**
 * Collapsible Panel - Content area that expands/collapses
 * Includes smooth height animations and overflow handling
 */
interface CollapsiblePanelProps
  extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> {
  /**
   * Whether to keep the content mounted in the DOM when collapsed
   * @default false
   */
  keepMounted?: boolean
  /**
   * Allows browser's built-in page search to find and expand the panel
   * @default false
   */
  hiddenUntilFound?: boolean
}

const CollapsiblePanel = React.forwardRef<
  HTMLDivElement,
  CollapsiblePanelProps
>(({ className, children, keepMounted = false, hiddenUntilFound = false, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    keepMounted={keepMounted}
    hiddenUntilFound={hiddenUntilFound}
    className={cn(
      'overflow-hidden transition-all duration-300',
      'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      className
    )}
    {...props}
  >
    <div className="pt-2">
      {children}
    </div>
  </BaseCollapsible.Panel>
))
CollapsiblePanel.displayName = 'CollapsiblePanel'

export { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel }
export type { CollapsibleTriggerProps, CollapsiblePanelProps }
