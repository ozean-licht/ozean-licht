/**
 * Select Component
 *
 * Dropdown select with Ozean Licht styling.
 * Native HTML select with custom styling.
 *
 * @example
 * <Select>
 *   <option value="">Choose...</option>
 *   <option value="1">Option 1</option>
 * </Select>
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Show error state */
  error?: string | boolean
  /** Select size */
  selectSize?: 'sm' | 'md' | 'lg'
  /** Select options (alternative to children) */
  options?: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      selectSize = 'md',
      options,
      children,
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
        <select
          className={cn(
            'input-base appearance-none cursor-pointer',
            'bg-input bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")]',
            'bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat',
            'pr-10',
            sizeStyles[selectSize],
            error && 'border-destructive focus:ring-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        {typeof error === 'string' && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

/**
 * Form Group Component
 * Wraps label, input/select, and error message
 */
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label text */
  label?: string
  /** Required field indicator */
  required?: boolean
  /** Error message */
  error?: string
  /** Help text */
  helpText?: string
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  (
    {
      className,
      label,
      required,
      error,
      helpText,
      children,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn('space-y-1.5', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
)

FormGroup.displayName = 'FormGroup'

export { Select, FormGroup }
