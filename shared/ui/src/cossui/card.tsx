/**
 * Card Component - Ozean Licht Edition
 * Based on Coss UI with glass morphism and Ozean Licht styling
 */

import * as React from 'react'
import { cn } from '../utils/cn'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-border bg-card/70 backdrop-blur-12 text-card-foreground shadow-sm transition-all',
      'hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-decorative text-2xl font-normal leading-none tracking-tight text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[#C4C8D4] font-sans font-light', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * CardPanel - Coss UI uses CardPanel instead of CardContent
 * This is the main content area of the card
 */
const CardPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardPanel.displayName = 'CardPanel'

/**
 * CardContent - Alias for CardPanel (for shadcn/ui compatibility)
 * Use CardPanel for new code following Coss UI conventions
 */
const CardContent = CardPanel

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardPanel,
  CardContent,
}
