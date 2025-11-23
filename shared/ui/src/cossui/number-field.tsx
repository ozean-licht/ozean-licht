/**
 * Number Field Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { NumberField as BaseNumberField } from '@base-ui-components/react/number-field'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// SVG Icons
const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const numberFieldVariants = cva(
  'flex items-center rounded-md border border-border bg-card/50 backdrop-blur-8 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-primary/30',
  {
    variants: {
      size: {
        sm: 'h-7',
        default: 'h-8',
        lg: 'h-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const numberFieldInputVariants = cva(
  'flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  {
    variants: {
      size: {
        sm: 'text-xs px-2',
        default: 'text-sm px-3',
        lg: 'text-base px-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const numberFieldButtonVariants = cva(
  'inline-flex items-center justify-center transition-all hover:bg-[#0ec2bc]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'w-6 h-6',
        default: 'w-7 h-7',
        lg: 'w-8 h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface NumberFieldRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>,
    VariantProps<typeof numberFieldVariants> {
  children?: React.ReactNode
}

/**
 * Number Field Root - Base container component
 */
const NumberFieldRoot = React.forwardRef<HTMLDivElement, NumberFieldRootProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <BaseNumberField.Root ref={ref} {...props}>
        <div className={cn(numberFieldVariants({ size }), className)}>
          {children}
        </div>
      </BaseNumberField.Root>
    )
  }
)
NumberFieldRoot.displayName = 'NumberFieldRoot'

export interface NumberFieldInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseNumberField.Input>, 'size'>,
    VariantProps<typeof numberFieldInputVariants> {}

/**
 * Number Field Input - The input element
 */
const NumberFieldInput = React.forwardRef<HTMLInputElement, NumberFieldInputProps>(
  ({ className, size, ...props }, ref) => (
    <BaseNumberField.Input
      ref={ref}
      className={cn(numberFieldInputVariants({ size }), className)}
      {...props}
    />
  )
)
NumberFieldInput.displayName = 'NumberFieldInput'

export interface NumberFieldIncrementProps
  extends React.ComponentPropsWithoutRef<typeof BaseNumberField.Increment>,
    VariantProps<typeof numberFieldButtonVariants> {
  children?: React.ReactNode
}

/**
 * Number Field Increment - Button to increase value
 */
const NumberFieldIncrement = React.forwardRef<HTMLButtonElement, NumberFieldIncrementProps>(
  ({ className, size, children, ...props }, ref) => (
    <BaseNumberField.Increment
      ref={ref}
      className={cn(numberFieldButtonVariants({ size }), 'text-[#0ec2bc]', className)}
      {...props}
    >
      {children || <ChevronUpIcon />}
    </BaseNumberField.Increment>
  )
)
NumberFieldIncrement.displayName = 'NumberFieldIncrement'

export interface NumberFieldDecrementProps
  extends React.ComponentPropsWithoutRef<typeof BaseNumberField.Decrement>,
    VariantProps<typeof numberFieldButtonVariants> {
  children?: React.ReactNode
}

/**
 * Number Field Decrement - Button to decrease value
 */
const NumberFieldDecrement = React.forwardRef<HTMLButtonElement, NumberFieldDecrementProps>(
  ({ className, size, children, ...props }, ref) => (
    <BaseNumberField.Decrement
      ref={ref}
      className={cn(numberFieldButtonVariants({ size }), 'text-[#0ec2bc]', className)}
      {...props}
    >
      {children || <ChevronDownIcon />}
    </BaseNumberField.Decrement>
  )
)
NumberFieldDecrement.displayName = 'NumberFieldDecrement'

export interface NumberFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Number Field Label - Label for the number field
 */
const NumberFieldLabel = React.forwardRef<HTMLLabelElement, NumberFieldLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-alt font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
)
NumberFieldLabel.displayName = 'NumberFieldLabel'

/**
 * Number Field - Complete component with default layout
 */
export interface NumberFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>, 'children'>,
    VariantProps<typeof numberFieldVariants> {
  placeholder?: string
  label?: string
  helperText?: string
  prefix?: string
  suffix?: string
  className?: string
  inputClassName?: string
}

const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      inputClassName,
      size,
      placeholder,
      label,
      helperText,
      prefix,
      suffix,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        {label && (
          <NumberFieldLabel htmlFor={inputId} className="text-foreground">
            {label}
          </NumberFieldLabel>
        )}
        <BaseNumberField.Root ref={ref} {...props}>
          <div className={cn(numberFieldVariants({ size }), className)}>
            <NumberFieldDecrement size={size} />
            {prefix && (
              <span className="text-sm text-muted-foreground px-2">{prefix}</span>
            )}
            <NumberFieldInput
              id={inputId}
              size={size}
              placeholder={placeholder}
              className={inputClassName}
            />
            {suffix && (
              <span className="text-sm text-muted-foreground px-2">{suffix}</span>
            )}
            <NumberFieldIncrement size={size} />
          </div>
        </BaseNumberField.Root>
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
NumberField.displayName = 'NumberField'

export {
  NumberField,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldLabel,
  numberFieldVariants,
  numberFieldInputVariants,
  numberFieldButtonVariants,
}
