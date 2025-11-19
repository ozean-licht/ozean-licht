/**
 * Accordion Component - Ozean Licht Edition
 * Based on Base UI with Ozean Licht design system
 * Wraps Base UI with Radix UI-compatible API for consistency
 */

import * as React from 'react'
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import { cn } from '../utils/cn'

/**
 * Accordion Root Component
 * Supports Radix UI-compatible props for seamless migration:
 * - type: 'single' | 'multiple' - maps to Base UI's multiple prop
 * - collapsible: boolean - always enabled in Base UI (items are always collapsible)
 * - value: string | string[] - normalized to array for Base UI
 * - defaultValue: string | string[] - normalized to array for Base UI
 * - onValueChange: (value: string | string[]) => void - receives string or array
 */
interface AccordionRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Root>,
    'multiple' | 'value' | 'defaultValue' | 'onValueChange'
  > {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  /**
   * Called when accordion value changes.
   * For 'single' type, receives a string value.
   * For 'multiple' type, receives an array of strings.
   * Also accepts React.Dispatch<React.SetStateAction<string>> for convenience.
   */
  onValueChange?: ((value: string | string[]) => void) | React.Dispatch<React.SetStateAction<string>>
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ className, type = 'single', collapsible, value, defaultValue, onValueChange, ...props }, ref) => {
    // Map Radix-like API to Base UI API
    const multiple = type === 'multiple'

    // Normalize value to array for Base UI
    const normalizedValue = React.useMemo(() => {
      if (!value) return undefined
      return Array.isArray(value) ? value : [value]
    }, [value])

    // Normalize defaultValue to array for Base UI
    const normalizedDefaultValue = React.useMemo(() => {
      if (!defaultValue) return undefined
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }, [defaultValue])

    // Wrap onValueChange to convert back to string for single mode
    const handleValueChange = React.useCallback(
      (newValue: any[]) => {
        if (!onValueChange) return
        // For single type, return string; for multiple, return array
        const valueToPass = type === 'single' ? (newValue?.[0] || '') : (newValue || [])
        // Type assertion for callback compatibility
        ;(onValueChange as (value: string | string[]) => void)(valueToPass)
      },
      [onValueChange, type]
    )

    return (
      <BaseAccordion.Root
        ref={ref}
        multiple={multiple}
        value={normalizedValue}
        defaultValue={normalizedDefaultValue}
        onValueChange={onValueChange ? handleValueChange : undefined}
        className={cn('w-full min-w-0 space-y-2', className)}
        {...props}
      />
    )
  }
)
Accordion.displayName = 'Accordion'

/**
 * Accordion Item - Individual collapsible section
 */
const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Item
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-border bg-card/70 backdrop-blur-12',
      'shadow-sm transition-all',
      'hover:border-primary/20 hover:shadow-md hover:shadow-primary/10',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:shadow-sm disabled:hover:shadow-transparent',
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

/**
 * Accordion Trigger - Button to expand/collapse the item
 */
const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between px-4 py-3',
      'text-left text-sm font-sans font-medium text-white',
      'transition-all duration-200',
      'hover:text-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'group',
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <svg
      className="h-4 w-4 shrink-0 text-[#C4C8D4] transition-transform duration-200 group-data-[state=open]:rotate-180"
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
  </BaseAccordion.Trigger>
))
AccordionTrigger.displayName = 'AccordionTrigger'

/**
 * Accordion Panel - Collapsible content area
 */
const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn(
      'overflow-hidden transition-all duration-200',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="px-4 pb-4 pt-0 text-sm text-[#C4C8D4] font-sans font-light">
      {children}
    </div>
  </BaseAccordion.Panel>
))
AccordionPanel.displayName = 'AccordionPanel'

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel }
export type { AccordionRootProps }
