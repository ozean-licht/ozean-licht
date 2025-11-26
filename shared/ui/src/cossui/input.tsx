/**
 * Input Component - Ozean Licht Edition
 * Based on Coss UI with size variants and Ozean Licht styling
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const inputVariants = cva(
  'flex w-full max-w-[480px] rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-1 text-sm font-sans text-foreground shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/30',
  {
    variants: {
      size: {
        sm: 'h-7 text-xs',
        default: 'h-8 text-sm',
        lg: 'h-9 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
