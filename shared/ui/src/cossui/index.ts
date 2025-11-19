/**
 * Coss UI Components - Ozean Licht Edition
 *
 * Modern React components based on Base UI (not Radix UI)
 * Adapted for the Ozean Licht design system
 *
 * Key differences from shadcn/ui:
 * - Uses `render` prop instead of `asChild`
 * - CardPanel instead of CardContent
 * - AccordionPanel instead of AccordionContent
 * - Built on Base UI primitives
 */

// Layout Components
export * from './card'
export * from './separator'
export * from './accordion'
// Tabs are exported with CossUI prefix to avoid conflict with Radix UI Tabs from ./ui
export { Tabs as CossUITabs, TabsList as CossUITabsList, TabsTab as CossUITabsTab, TabsPanel as CossUITabsPanel } from './tabs'

// Form Components
export * from './button'
export * from './input'
export * from './textarea'
export * from './label'
export * from './select'
export * from './checkbox'
export * from './radio-group'
export * from './switch'
export * from './slider'
export * from './toggle'

// Feedback Components
export * from './alert'
export * from './badge'
export * from './progress'
export * from './spinner'
export * from './skeleton'

// Overlay Components
export * from './dialog'
export * from './popover'
export * from './tooltip'
export * from './menu'
