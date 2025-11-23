/**
 * Textarea Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht styling
 * Smooth resize behavior with proper transitions
 */

import * as React from 'react'
import { cn } from '../utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2',
          'text-sm font-sans font-light text-foreground shadow-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'hover:border-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y transition-colors duration-200',
          // Smooth resize behavior
          'scroll-smooth',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
