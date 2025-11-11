/**
 * Card Component
 *
 * Ozean Licht glass morphism card with hover effects.
 * Uses signature glass effect from the design system.
 *
 * @example
 * <Card>Basic card</Card>
 * <Card variant="strong" hover>Important content</Card>
 * <Card variant="subtle">Background content</Card>
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glass effect variant */
  variant?: 'default' | 'strong' | 'subtle'
  /** Enable hover glow effect */
  hover?: boolean
  /** Add glow animation */
  glow?: boolean
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = false,
      glow = false,
      padding = 'none',
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'glass-card',
      strong: 'glass-card-strong',
      subtle: 'glass-subtle',
    }

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'card-base',
          variantStyles[variant],
          hover && 'glass-hover',
          glow && 'animate-glow',
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * Card Header Component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

/**
 * Card Title Component
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Comp = 'h4', ...props }, ref) => (
    <Comp
      ref={ref as any}
      className={cn('font-serif text-xl md:text-2xl font-semibold', className)}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

/**
 * Card Description Component
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)

CardDescription.displayName = 'CardDescription'

/**
 * Card Content Component
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'

/**
 * Card Footer Component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 pt-4 border-t border-border', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
