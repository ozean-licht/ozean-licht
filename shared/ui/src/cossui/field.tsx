'use client';

/**
 * Field Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 *
 * Form field wrapper with label, validation, and error messages
 */

import * as React from 'react'
import { Field as BaseField } from '@base-ui-components/react/field'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// SVG Icons
const CheckCircleIcon = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const AlertCircleIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const AlertTriangleIcon = () => (
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
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// Field variants
const fieldRootVariants = cva('flex flex-col gap-2 w-full', {
  variants: {
    size: {
      sm: 'max-w-[360px]',
      default: 'max-w-[480px]',
      lg: 'max-w-[640px]',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const fieldLabelVariants = cva(
  'text-sm font-alt font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      state: {
        default: 'text-foreground',
        error: 'text-foreground',
        success: 'text-foreground',
        warning: 'text-foreground',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

const fieldMessageVariants = cva('text-xs flex items-center gap-1.5', {
  variants: {
    state: {
      default: 'text-[#C4C8D4]',
      error: 'text-red-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

export interface FieldRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Root>,
    VariantProps<typeof fieldRootVariants> {
  children?: React.ReactNode
}

/**
 * Field Root - Base container component for form fields
 */
const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <BaseField.Root
        ref={ref}
        className={cn(fieldRootVariants({ size }), className)}
        {...props}
      >
        {children}
      </BaseField.Root>
    )
  }
)
FieldRoot.displayName = 'FieldRoot'

export interface FieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof fieldLabelVariants> {
  required?: boolean
  optional?: boolean
}

/**
 * Field Label - Label for form fields with required/optional indicators
 */
const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, state, required, optional, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(fieldLabelVariants({ state }), className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
      {optional && !required && (
        <span className="text-muted-foreground ml-1 font-normal">(optional)</span>
      )}
    </label>
  )
)
FieldLabel.displayName = 'FieldLabel'

export interface FieldControlProps extends React.HTMLAttributes<HTMLDivElement> {
  render: (props: {
    'aria-invalid'?: boolean
    'aria-describedby'?: string
    id?: string
  }) => React.ReactNode
}

/**
 * Field Control - Wrapper for the input control with ARIA attributes
 */
const FieldControl = React.forwardRef<HTMLDivElement, FieldControlProps>(
  ({ render, className, ...props }, ref) => {
    return (
      <BaseField.Control
        ref={ref}
        className={className}
        render={(controlProps) => <>{render(controlProps)}</>}
        {...props}
      />
    )
  }
)
FieldControl.displayName = 'FieldControl'

export interface FieldErrorProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Error>,
    VariantProps<typeof fieldMessageVariants> {
  showIcon?: boolean
}

/**
 * Field Error - Error message display
 */
const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, showIcon = true, children, ...props }, ref) => (
    <BaseField.Error
      ref={ref}
      className={cn(fieldMessageVariants({ state: 'error' }), className)}
      {...props}
    >
      {showIcon && <AlertCircleIcon />}
      <span>{children}</span>
    </BaseField.Error>
  )
)
FieldError.displayName = 'FieldError'

export interface FieldHelperProps extends React.HTMLAttributes<HTMLParagraphElement> {
  showIcon?: boolean
  state?: 'default' | 'success' | 'warning'
}

/**
 * Field Helper - Helper text for form fields
 */
const FieldHelper = React.forwardRef<HTMLParagraphElement, FieldHelperProps>(
  ({ className, showIcon = false, state = 'default', children, ...props }, ref) => {
    const Icon =
      state === 'success'
        ? CheckCircleIcon
        : state === 'warning'
          ? AlertTriangleIcon
          : null

    return (
      <p
        ref={ref}
        className={cn(fieldMessageVariants({ state }), className)}
        {...props}
      >
        {showIcon && Icon && <Icon />}
        <span>{children}</span>
      </p>
    )
  }
)
FieldHelper.displayName = 'FieldHelper'

export interface FieldDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Description> {}

/**
 * Field Description - Description text for form fields
 */
const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <BaseField.Description
      ref={ref}
      className={cn('text-xs text-[#C4C8D4]', className)}
      {...props}
    >
      {children}
    </BaseField.Description>
  )
)
FieldDescription.displayName = 'FieldDescription'

export interface FieldValidityProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * Field Validity - Container for validation state display
 */
const FieldValidity = React.forwardRef<HTMLDivElement, FieldValidityProps>(
  ({ className, children, ...props }, ref) => (
    <BaseField.Validity
      ref={ref}
      className={className}
      render={(validity) => <>{typeof children === 'function' ? children(validity) : children}</>}
      {...props}
    />
  )
)
FieldValidity.displayName = 'FieldValidity'

export {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldError,
  FieldHelper,
  FieldDescription,
  FieldValidity,
  fieldRootVariants,
  fieldLabelVariants,
  fieldMessageVariants,
}
