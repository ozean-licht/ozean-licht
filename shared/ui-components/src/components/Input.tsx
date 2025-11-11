/**
 * Input Components
 *
 * Ozean Licht branded form inputs extending shadcn primitives.
 * Features turquoise focus rings, glass backgrounds, and icon support.
 *
 * @example
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" placeholder="you@example.com" />
 *
 * <Label htmlFor="message">Message</Label>
 * <Textarea id="message" placeholder="Your message..." />
 *
 * <Input icon={<SearchIcon />} placeholder="Search..." />
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Input as ShadcnInput } from '../ui/input'
import { Textarea as ShadcnTextarea } from '../ui/textarea'
import { Label as ShadcnLabel } from '../ui/label'
import { cn } from '../utils/cn'

// ==================== Input ====================

const inputVariants = cva(
  'input-base',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--input)] border-[var(--border)]',
          'focus:ring-[var(--ring)] focus:border-[var(--ring)]',
        ].join(' '),
        glass: [
          'glass-subtle',
          'border-[var(--primary)]/20',
          'focus:ring-[var(--ring)] focus:border-[var(--primary)]/40',
        ].join(' '),
      },
      inputSize: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'h-10 px-4 py-3 text-base',
        lg: 'h-11 px-5 py-4 text-lg',
      },
      hasError: {
        true: 'border-[var(--destructive)] focus:ring-[var(--destructive)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
      hasError: false,
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Show error state with message */
  error?: string | boolean
  /** Icon before input */
  icon?: React.ReactNode
  /** Icon after input */
  iconAfter?: React.ReactNode
}

/**
 * Input component with turquoise focus ring
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      inputSize,
      error,
      icon,
      iconAfter,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error

    // If icons are present, wrap in container
    if (icon || iconAfter) {
      return (
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
              {icon}
            </div>
          )}
          <ShadcnInput
            type={type}
            className={cn(
              inputVariants({ variant, inputSize, hasError }),
              icon && 'pl-10',
              iconAfter && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            {...props}
          />
          {iconAfter && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
              {iconAfter}
            </div>
          )}
          {typeof error === 'string' && (
            <p className="mt-1.5 text-sm text-[var(--destructive)]" role="alert">
              {error}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="w-full">
        <ShadcnInput
          type={type}
          className={cn(inputVariants({ variant, inputSize, hasError }), className)}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          {...props}
        />
        {typeof error === 'string' && (
          <p className="mt-1.5 text-sm text-[var(--destructive)]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ==================== Textarea ====================

const textareaVariants = cva(
  'input-base min-h-[80px] resize-y',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--input)] border-[var(--border)]',
          'focus:ring-[var(--ring)] focus:border-[var(--ring)]',
        ].join(' '),
        glass: [
          'glass-subtle',
          'border-[var(--primary)]/20',
          'focus:ring-[var(--ring)] focus:border-[var(--primary)]/40',
        ].join(' '),
      },
      textareaSize: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      },
      hasError: {
        true: 'border-[var(--destructive)] focus:ring-[var(--destructive)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'md',
      hasError: false,
    },
  }
)

export interface TextareaProps
  extends React.ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {
  /** Show error state with message */
  error?: string | boolean
}

/**
 * Textarea component with turquoise focus ring
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      textareaSize,
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error

    return (
      <div className="w-full">
        <ShadcnTextarea
          className={cn(textareaVariants({ variant, textareaSize, hasError }), className)}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          {...props}
        />
        {typeof error === 'string' && (
          <p className="mt-1.5 text-sm text-[var(--destructive)]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// ==================== Label ====================

const labelVariants = cva(
  'block text-sm font-medium text-[var(--foreground)] mb-1.5',
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnLabel>,
    VariantProps<typeof labelVariants> {
  /** Show required indicator */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
}

/**
 * Label component for form inputs
 */
const Label = React.forwardRef<
  React.ElementRef<typeof ShadcnLabel>,
  LabelProps
>(({ className, required, disabled, children, ...props }, ref) => {
  return (
    <ShadcnLabel
      ref={ref}
      className={cn(labelVariants({ disabled }), className)}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--destructive)] ml-1" aria-label="required">*</span>}
    </ShadcnLabel>
  )
})

Label.displayName = 'Label'

// ==================== Exports ====================

export { Input, Textarea, Label, inputVariants, textareaVariants, labelVariants }
