/**
 * Input Component
 *
 * Text input with Ozean Licht styling.
 * Supports all standard HTML input types.
 *
 * @example
 * <Input type="text" placeholder="Enter name..." />
 * <Input type="email" required />
 * <Input type="password" error="Invalid password" />
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show error state */
  error?: string | boolean
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg'
  /** Icon before input */
  icon?: React.ReactNode
  /** Icon after input */
  iconAfter?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error,
      inputSize = 'md',
      icon,
      iconAfter,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    }

    const inputClasses = cn(
      'input-base',
      sizeStyles[inputSize],
      error && 'border-destructive focus:ring-destructive',
      icon && 'pl-10',
      iconAfter && 'pr-10',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )

    if (icon || iconAfter) {
      return (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {iconAfter && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconAfter}
            </div>
          )}
          {typeof error === 'string' && (
            <p className="mt-1 text-sm text-destructive">{error}</p>
          )}
        </div>
      )
    }

    return (
      <div>
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {typeof error === 'string' && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * Textarea Component
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Show error state */
  error?: string | boolean
  /** Textarea size */
  textareaSize?: 'sm' | 'md' | 'lg'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      textareaSize = 'md',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    }

    return (
      <div>
        <textarea
          className={cn(
            'input-base min-h-[80px] resize-y',
            sizeStyles[textareaSize],
            error && 'border-destructive focus:ring-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {typeof error === 'string' && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

/**
 * Label Component
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Required indicator */
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-foreground mb-1.5',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
)

Label.displayName = 'Label'

export { Input, Textarea, Label }
