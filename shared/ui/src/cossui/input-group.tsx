/**
 * Input Group Component - Ozean Licht Edition
 * Based on Coss UI patterns with Ozean Licht design system
 *
 * Provides grouped input fields with leading/trailing addons:
 * - Text addons ($, @, https://)
 * - Icon addons (search, user, email)
 * - Button addons (submit, copy, clear)
 * - Combined layouts (icon + input + button)
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// SVG Icons
const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const UserIcon = () => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CopyIcon = () => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const XIcon = () => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const GlobeIcon = () => (
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
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

// Variants
const inputGroupRootVariants = cva(
  'flex items-stretch rounded-md border border-border bg-card/50 backdrop-blur-8 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-primary/30',
  {
    variants: {
      size: {
        sm: 'h-7',
        md: 'h-8',
        lg: 'h-9',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const inputGroupAddonVariants = cva(
  'inline-flex items-center justify-center border-border text-[#C4C8D4] font-sans transition-colors whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'text-xs px-2',
        md: 'text-sm px-3',
        lg: 'text-base px-3',
      },
      position: {
        leading: 'bg-[#000F1F] border-r rounded-l-md',
        trailing: 'bg-[#000F1F] border-l rounded-r-md',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'leading',
    },
  }
)

const inputGroupInputVariants = cva(
  'flex-1 bg-transparent font-sans text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium',
  {
    variants: {
      size: {
        sm: 'text-xs px-2',
        md: 'text-sm px-3',
        lg: 'text-base px-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const inputGroupButtonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-xs px-2',
        md: 'text-sm px-3',
        lg: 'text-base px-4',
      },
      variant: {
        primary: 'bg-[#0ec2bc] text-white hover:bg-[#0ec2bc]/90 rounded-r-md',
        secondary: 'bg-[#000F1F] text-[#C4C8D4] hover:bg-[#0ec2bc]/10 border-l border-border rounded-r-md',
        ghost: 'text-[#0ec2bc] hover:bg-[#0ec2bc]/10',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
)

// Component Props
export interface InputGroupRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupRootVariants> {
  children: React.ReactNode
  error?: boolean
  disabled?: boolean
  readOnly?: boolean
}

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupAddonVariants> {
  children: React.ReactNode
}

export interface InputGroupInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputGroupInputVariants> {
  size?: 'sm' | 'md' | 'lg'
}

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof inputGroupButtonVariants> {
  children: React.ReactNode
}

// Context for size propagation
interface InputGroupContextValue {
  size: 'sm' | 'md' | 'lg'
}

const InputGroupContext = React.createContext<InputGroupContextValue | undefined>(undefined)

const useInputGroupContext = () => {
  const context = React.useContext(InputGroupContext)
  if (!context) {
    throw new Error('InputGroup components must be used within InputGroupRoot')
  }
  return context
}

/**
 * Input Group Root - Container for grouped input elements
 */
const InputGroupRoot = React.forwardRef<HTMLDivElement, InputGroupRootProps>(
  ({ className, size = 'md', children, error, disabled, readOnly, ...props }, ref) => {
    const groupSize: 'sm' | 'md' | 'lg' = size || 'md'

    return (
      <InputGroupContext.Provider value={{ size: groupSize }}>
        <div
          ref={ref}
          className={cn(
            inputGroupRootVariants({ size: groupSize }),
            error && 'border-destructive focus-within:ring-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
            readOnly && 'bg-muted/50',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </InputGroupContext.Provider>
    )
  }
)
InputGroupRoot.displayName = 'InputGroupRoot'

/**
 * Input Group Addon - Text or icon addon for input group
 */
const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, size: sizeProp, position = 'leading', children, ...props }, ref) => {
    const { size: contextSize } = useInputGroupContext()
    const size = sizeProp || contextSize

    return (
      <div
        ref={ref}
        className={cn(inputGroupAddonVariants({ size, position }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
InputGroupAddon.displayName = 'InputGroupAddon'

/**
 * Input Group Input - The input element within the group
 */
const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, size: sizeProp, type = 'text', ...props }, ref) => {
    const { size: contextSize } = useInputGroupContext()
    const size = sizeProp || contextSize

    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputGroupInputVariants({ size }), className)}
        {...props}
      />
    )
  }
)
InputGroupInput.displayName = 'InputGroupInput'

/**
 * Input Group Button - Button within the input group
 */
const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, size: sizeProp, variant = 'primary', children, type = 'button', ...props }, ref) => {
    const { size: contextSize } = useInputGroupContext()
    const size = sizeProp || contextSize

    return (
      <button
        ref={ref}
        type={type}
        className={cn(inputGroupButtonVariants({ size, variant }), className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
InputGroupButton.displayName = 'InputGroupButton'

// Export icons for convenience
export {
  InputGroupRoot,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  inputGroupRootVariants,
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupButtonVariants,
  // Icons
  SearchIcon,
  UserIcon,
  MailIcon,
  CopyIcon,
  XIcon,
  PhoneIcon,
  GlobeIcon,
}
