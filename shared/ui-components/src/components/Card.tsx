/**
 * Card Component
 *
 * Ozean Licht branded card with glass morphism effects.
 * Extends shadcn Card primitive with turquoise branding and cosmic theme.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 * </Card>
 *
 * <Card variant="strong" hover glow>
 *   Important card with hover effects
 * </Card>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
} from '../ui/card'
import { cn } from '../utils/cn'

const cardVariants = cva(
  'card-base',
  {
    variants: {
      variant: {
        default: 'glass-card',
        strong: 'glass-card-strong',
        subtle: 'glass-subtle',
        solid: 'bg-[var(--card)] border border-[var(--border)]',
      },
      hover: {
        true: 'glass-hover transition-all duration-300',
        false: '',
      },
      glow: {
        true: 'glow-subtle hover:glow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: false,
      glow: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card component with glass morphism
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, glow, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(cardVariants({ variant, hover, glow }), className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

/**
 * Card Header - Contains title and description
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnCardHeader
        ref={ref}
        className={cn('flex flex-col space-y-2 p-6', className)}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

/**
 * Card Title - Main heading for card
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Heading level for semantic HTML */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, as, ...props }, ref) => {
    return (
      <ShadcnCardTitle
        ref={ref}
        className={cn(
          'font-serif text-xl md:text-2xl font-semibold leading-none tracking-tight',
          'text-[var(--foreground)]',
          className
        )}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

/**
 * Card Description - Subtitle or secondary text
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnCardDescription
        ref={ref}
        className={cn('text-sm text-[var(--muted-foreground)]', className)}
        {...props}
      />
    )
  }
)

CardDescription.displayName = 'CardDescription'

/**
 * Card Content - Main content area
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnCardContent
        ref={ref}
        className={cn('p-6 pt-0 space-y-4', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

/**
 * Card Footer - Action area at bottom of card
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnCardFooter
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-6 pt-0',
          'border-t border-[var(--border)]',
          className
        )}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
}
