/**
 * Button Component
 *
 * Ozean Licht branded button extending shadcn Button primitive.
 * Features gradient CTA variant, glow effects, and turquoise branding.
 *
 * @example
 * <Button variant="primary">Primary Action</Button>
 * <Button variant="cta">Call to Action</Button>
 * <Button variant="secondary" glow>Secondary with Glow</Button>
 * <Button variant="ghost" size="sm">Ghost Button</Button>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button as ShadcnButton } from '../ui/button'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'btn-base',
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--primary)] text-[var(--primary-foreground)]',
          'hover:bg-[var(--primary)]/90',
          'shadow-sm hover:shadow-lg hover:shadow-[var(--primary)]/15',
          'active:scale-95',
        ].join(' '),
        secondary: [
          'glass-card text-[var(--primary)]',
          'border border-[var(--primary)]/30',
          'hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/40',
          'active:scale-95',
        ].join(' '),
        ghost: [
          'text-[var(--primary)] hover:text-[var(--primary)]/80',
          'hover:bg-[var(--primary)]/10',
          'active:scale-95',
        ].join(' '),
        destructive: [
          'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
          'hover:bg-[var(--destructive)]/90',
          'shadow-sm hover:shadow-lg hover:shadow-[var(--destructive)]/15',
          'active:scale-95',
        ].join(' '),
        outline: [
          'border border-[var(--input)] bg-transparent',
          'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
          'active:scale-95',
        ].join(' '),
        link: [
          'text-[var(--primary)] underline-offset-4',
          'hover:underline',
        ].join(' '),
        cta: [
          'bg-gradient-to-r from-[var(--primary)]/90 via-[var(--primary)]/80 to-[var(--primary)]/70',
          'text-[var(--primary-foreground)]',
          'border border-[var(--primary)]/30',
          'glow-subtle',
          'hover:shadow-lg hover:shadow-[var(--primary)]/20 hover:border-[var(--primary)]/40',
          'active:scale-95',
        ].join(' '),
      },
      size: {
        sm: 'h-9 px-4 py-2 text-sm',
        md: 'h-10 px-6 py-3 text-base',
        lg: 'h-11 px-8 py-4 text-lg',
        icon: 'h-10 w-10',
      },
      glow: {
        true: 'glow-subtle',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Full width button */
  fullWidth?: boolean
  /** Show loading state */
  loading?: boolean
  /** Icon before text */
  icon?: React.ReactNode
  /** Icon after text */
  iconAfter?: React.ReactNode
  /** Use as child component (Radix Slot pattern) */
  asChild?: boolean
}

/**
 * Button component with Ozean Licht branding
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      fullWidth = false,
      loading = false,
      icon,
      iconAfter,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, glow }),
          fullWidth && 'w-full',
          loading && 'cursor-wait opacity-70',
          className
        )}
        disabled={disabled || loading}
        asChild={asChild}
        {...props}
      >
        <>
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        </>
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
