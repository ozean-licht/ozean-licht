/**
 * Tabs Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 *
 * Uses Base UI Tabs namespace API:
 * - Tabs.Root: Root container component
 * - Tabs.List: Container for tab buttons
 * - Tabs.Tab: Individual tab button
 * - Tabs.Panel: Content container for each tab
 */

import * as React from 'react'
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'
import { cn } from '../utils/cn'

/**
 * Tabs Component (Root)
 * Simple passthrough wrapper for the Base UI Tabs.Root component
 * Maintains backward compatibility with the original API
 */
const TabsComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTabs.Root>
>(({ className, ...props }, ref) => (
  <BaseTabs.Root
    ref={ref}
    className={cn('w-full', className)}
    {...props}
  />
))
TabsComponent.displayName = 'Tabs'

/**
 * Tabs List - Container for tab buttons
 * Wraps Base UI Tabs.List with Ozean Licht styling
 */
const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTabs.List>
>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg',
      'bg-card/70 backdrop-blur-12 border border-border p-1',
      'text-[#C4C8D4] shadow-sm',
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

/**
 * Tabs Tab - Individual tab button
 * Wraps Base UI Tabs.Tab with Ozean Licht styling
 * Using Tabs.Tab naming convention (Coss UI)
 */
const TabsTab = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>
>(({ className, ...props }, ref) => (
  <BaseTabs.Tab
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5',
      'text-sm font-sans font-medium transition-all',
      'ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:text-primary/90 hover:bg-primary/5',
      'data-[selected]:bg-primary/20 data-[selected]:text-primary data-[selected]:shadow-sm',
      'active:scale-95',
      className
    )}
    {...props}
  />
))
TabsTab.displayName = 'TabsTab'

/**
 * Tabs Panel - Content container for each tab
 * Wraps Base UI Tabs.Panel with Ozean Licht styling
 * Using TabsPanel naming convention (Coss UI)
 */
const TabsPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>
>(({ className, ...props }, ref) => (
  <BaseTabs.Panel
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'data-[state=inactive]:hidden',
      className
    )}
    {...props}
  />
))
TabsPanel.displayName = 'TabsPanel'

// Export wrapper components with backward-compatible names
export { TabsComponent as Tabs, TabsList, TabsTab, TabsPanel }
// Also export the Base UI Tabs namespace for advanced usage if needed
export { BaseTabs }
