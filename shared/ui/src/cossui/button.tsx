/**
 * Button Component - Ozean Licht Edition
 * Based on Coss UI (Base UI) with Ozean Licht design system
 */

import * as React from 'react'
import { Button as BaseButton } from '@base-ui-components/react/button'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  // Base styles with Ozean Licht theme
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        // Alias for shadcn compatibility
        default:
          'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30',
        primary:
          'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30',
        secondary:
          'bg-card/70 text-primary border border-primary/30 backdrop-blur-12 hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15',
        muted:
          'bg-[#055D75] text-white hover:bg-[#055D75]/90 shadow-md hover:shadow-lg',
        destructive:
          'bg-destructive text-white shadow-lg shadow-destructive/20 hover:bg-destructive/90',
        'destructive-outline':
          'border border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive',
        outline:
          'border border-border bg-card/50 backdrop-blur-8 hover:bg-accent hover:text-accent-foreground hover:border-primary/30',
        ghost:
          'text-primary hover:bg-primary/10 hover:text-primary/90',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-7 px-3 text-sm',
        default: 'h-8 px-4 py-2 text-sm',
        lg: 'h-9 px-6 text-base',
        xl: 'h-10 px-8 text-lg',
        icon: 'h-8 w-8',
        'icon-sm': 'h-7 w-7',
        'icon-lg': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Button content (children)
   */
  children?: React.ReactNode
  /**
   * Render prop to wrap the button (replaces asChild from shadcn/ui)
   * Example: <Button render={<Link href="/login" />}>Login</Button>
   */
  render?: React.ReactElement
  /**
   * asChild support for compatibility with shadcn patterns
   * When true, the button will render as its child element
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, render, asChild, children, ...props }, ref) => {
    // Handle render prop pattern (Coss UI style)
    if (render) {
      return React.cloneElement(render, {
        ...render.props,
        className: cn(
          buttonVariants({ variant, size }),
          render.props.className,
          className
        ),
        ref,
        ...props,
        children,
      })
    }

    // Use Slot for asChild pattern (proper prop/ref merging)
    const Comp = asChild ? Slot : BaseButton

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
