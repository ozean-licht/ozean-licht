/**
 * Button Component
 *
 * Ozean Licht styled button with multiple variants and sizes.
 * Uses design tokens from the Ozean Licht design system.
 *
 * @example
 * <Button variant="primary" size="md">Click Me</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button variant="ghost" size="lg">Learn More</Button>
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Full width button */
  fullWidth?: boolean
  /** Show loading state */
  loading?: boolean
  /** Icon before text */
  icon?: React.ReactNode
  /** Icon after text */
  iconAfter?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconAfter,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: [
        'bg-primary hover:bg-primary-400 active:bg-primary-600',
        'text-primary-foreground',
        'shadow-md hover:shadow-lg hover:shadow-primary/20',
        'active:scale-95',
      ].join(' '),
      secondary: [
        'bg-card border border-primary/30',
        'text-primary hover:text-primary-400',
        'hover:bg-primary/10 hover:border-primary/40',
        'active:scale-95',
      ].join(' '),
      ghost: [
        'text-primary hover:text-primary-400',
        'hover:bg-primary/10',
        'active:scale-95',
      ].join(' '),
      destructive: [
        'bg-destructive hover:bg-destructive/90',
        'text-destructive-foreground',
        'shadow-md hover:shadow-lg hover:shadow-destructive/20',
        'active:scale-95',
      ].join(' '),
    }

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'btn-base',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait opacity-70',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
        {!loading && iconAfter && <span className="ml-2">{iconAfter}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
