/**
 * Fieldset Component - Ozean Licht Edition
 * Form fieldset grouping with legend, description, and helper text
 * Built with semantic HTML and Ozean Licht design system
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const fieldsetVariants = cva(
  'border rounded-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-border bg-transparent',
        bordered: 'border-[#0E282E] bg-transparent',
        card: 'border-[#0E282E] bg-card/70 backdrop-blur-12 p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface FieldsetRootProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    VariantProps<typeof fieldsetVariants> {}

/**
 * FieldsetRoot - Main fieldset container
 * Use semantic <fieldset> element for grouping related form controls
 */
const FieldsetRoot = React.forwardRef<HTMLFieldSetElement, FieldsetRootProps>(
  ({ className, variant, disabled, ...props }, ref) => (
    <fieldset
      ref={ref}
      disabled={disabled}
      className={cn(
        fieldsetVariants({ variant }),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
)
FieldsetRoot.displayName = 'FieldsetRoot'

/**
 * FieldsetLegend - Legend/title for the fieldset
 * Accessible label for the group of form controls
 */
const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    className={cn(
      'font-decorative text-lg font-normal text-white px-2 -ml-2 mb-4',
      className
    )}
    {...props}
  />
))
FieldsetLegend.displayName = 'FieldsetLegend'

/**
 * FieldsetContent - Content wrapper for fieldset children
 * Provides consistent spacing and layout for form controls
 */
const FieldsetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-4', className)}
    {...props}
  />
))
FieldsetContent.displayName = 'FieldsetContent'

/**
 * FieldsetDescription - Description text for the fieldset
 * Provides additional context about the form group
 */
const FieldsetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light mb-4', className)}
    {...props}
  />
))
FieldsetDescription.displayName = 'FieldsetDescription'

/**
 * FieldsetHelper - Helper text for the fieldset
 * Typically used for additional guidance or validation messages
 */
const FieldsetHelper = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-muted-foreground mt-4', className)}
    {...props}
  />
))
FieldsetHelper.displayName = 'FieldsetHelper'

export {
  FieldsetRoot,
  FieldsetLegend,
  FieldsetContent,
  FieldsetDescription,
  FieldsetHelper,
  fieldsetVariants,
}
