'use client';

/**
 * Form Components - Ozean Licht Edition
 * Based on react-hook-form with Ozean Licht design system
 *
 * Provides a complete form implementation with:
 * - Client-side validation
 * - Async validation support
 * - Error aggregation
 * - Loading states
 * - ARIA attributes
 */

import * as React from 'react'
import { useForm, UseFormReturn, FieldValues, SubmitHandler, Path, FieldError } from 'react-hook-form'
import { cn } from '../utils/cn'

// ============================================================================
// Context
// ============================================================================

interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = React.createContext<FormContextValue<any> | null>(null)

function useFormContext<TFieldValues extends FieldValues = FieldValues>() {
  const context = React.useContext(FormContext) as FormContextValue<TFieldValues> | null
  if (!context) {
    throw new Error('Form components must be used within a FormRoot')
  }
  return context
}

// ============================================================================
// FormRoot - Main form wrapper
// ============================================================================

export interface FormRootProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  /**
   * Show loading state during submission
   */
  isSubmitting?: boolean
}

function FormRootComponent<TFieldValues extends FieldValues = FieldValues>(
  { form, onSubmit, isSubmitting, className, children, ...props }: FormRootProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <FormContext.Provider value={{ form }}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const FormRoot = React.forwardRef(FormRootComponent) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormRootProps<TFieldValues> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement

// ============================================================================
// FormField - Field wrapper with validation
// ============================================================================

interface FormFieldContextValue {
  name: string
  error?: FieldError
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormFieldContext() {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error('FormField components must be used within a FormField')
  }
  return context
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
}

function FormFieldComponent<TFieldValues extends FieldValues = FieldValues>(
  { name, className, children, ...props }: FormFieldProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { form } = useFormContext<TFieldValues>()
  const error = form.formState.errors[name] as FieldError | undefined

  return (
    <FormFieldContext.Provider value={{ name, error }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
}

export const FormField = React.forwardRef(FormFieldComponent) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormFieldProps<TFieldValues> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

// ============================================================================
// FormLabel - Label for form fields
// ============================================================================

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const { name, error } = useFormFieldContext()

    return (
      <label
        ref={ref}
        htmlFor={name}
        className={cn(
          'text-sm font-alt font-medium leading-none text-foreground',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-red-400',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
    )
  }
)
FormLabel.displayName = 'FormLabel'

// ============================================================================
// FormControl - Wrapper for form controls (input, select, etc.)
// ============================================================================

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    const { name, error } = useFormFieldContext()
    const { form } = useFormContext()

    // Clone the child element and inject form registration and error state
    const child = React.Children.only(children) as React.ReactElement

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {React.cloneElement(child, {
          id: name,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': error ? `${name}-error` : undefined,
          className: cn(
            child.props.className,
            error && 'border-red-400 focus-visible:ring-red-400'
          ),
          ...form.register(name),
        })}
      </div>
    )
  }
)
FormControl.displayName = 'FormControl'

// ============================================================================
// FormDescription - Helper text for form fields
// ============================================================================

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { name } = useFormFieldContext()

    return (
      <p
        ref={ref}
        id={`${name}-description`}
        className={cn('text-xs text-muted-foreground', className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = 'FormDescription'

// ============================================================================
// FormMessage - Error message display
// ============================================================================

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { name, error } = useFormFieldContext()

    if (!error) {
      return null
    }

    const message = error.message || children

    return (
      <p
        ref={ref}
        id={`${name}-error`}
        role="alert"
        aria-live="polite"
        className={cn('text-xs text-red-400 font-medium', className)}
        {...props}
      >
        {message}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

// ============================================================================
// FormSubmit - Submit button with loading state
// ============================================================================

export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Show loading state
   */
  isLoading?: boolean
  /**
   * Text to display when loading
   */
  loadingText?: string
}

export const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ className, children, isLoading, loadingText = 'Submitting...', disabled, ...props }, ref) => {
    const { form } = useFormContext()
    const isSubmitting = isLoading ?? form.formState.isSubmitting

    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled || isSubmitting}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg',
          'bg-[#0ec2bc] text-white shadow-lg shadow-[#0ec2bc]/20',
          'px-4 py-2 text-sm font-sans font-medium',
          'transition-all duration-200',
          'hover:bg-[#0ec2bc]/90 hover:shadow-[#0ec2bc]/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ec2bc] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          isSubmitting && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isSubmitting && (
          <svg
            className="animate-spin h-4 w-4"
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
        {isSubmitting ? loadingText : children}
      </button>
    )
  }
)
FormSubmit.displayName = 'FormSubmit'

// ============================================================================
// Utility hook for easy form creation
// ============================================================================

export function useFormHandler<TFieldValues extends FieldValues = FieldValues>(
  defaultValues?: Partial<TFieldValues>
) {
  return useForm<TFieldValues>({
    defaultValues: defaultValues as any,
    mode: 'onBlur',
  })
}

// ============================================================================
// Exports
// ============================================================================

export { useForm, useFormContext }
export type { UseFormReturn, FieldValues, SubmitHandler, Path, FieldError }
