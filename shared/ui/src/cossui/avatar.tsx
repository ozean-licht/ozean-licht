/**
 * Avatar Component - Ozean Licht Edition
 * Based on Radix UI Avatar with Ozean Licht design system
 * Displays user profile images with initials fallback
 */

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const avatarVariants = cva(
  // Base styles: circular, glass morphism, glow effect on border
  'relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-card/70 backdrop-blur-8 border border-border shadow-md transition-all hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/**
 * Avatar Root Component
 * Container for avatar image and fallback content
 * @example
 * <Avatar>
 *   <AvatarImage src="/avatars/01.png" alt="User avatar" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, className }))}
    {...props}
  />
))
Avatar.displayName = 'Avatar'

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

/**
 * Avatar Image Component
 * Displays the user's profile image
 * @example
 * <AvatarImage src="/avatars/01.png" alt="User avatar" />
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = 'AvatarImage'

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {}

/**
 * Avatar Fallback Component
 * Displays initials when avatar image is not available or loading
 * Uses Montserrat font for consistent typography
 * @example
 * <AvatarFallback>JD</AvatarFallback>
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      // Gradient background with Ozean Licht primary color
      'flex items-center justify-center h-full w-full bg-gradient-to-br from-primary/20 to-primary/10',
      // Montserrat font for initials, white foreground
      'font-sans font-semibold text-white',
      // Subtle border with primary color glow
      'border border-primary/30',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
