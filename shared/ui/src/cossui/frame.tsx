/**
 * Frame Component - Ozean Licht Edition
 * Container component for embedding content with support for aspect ratios and variants
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const frameVariants = cva(
  'relative overflow-hidden transition-all',
  {
    variants: {
      variant: {
        default:
          'border border-[#0E282E] rounded-lg bg-card/50 backdrop-blur-8',
        bordered:
          'border-2 border-primary/30 rounded-lg bg-card/50 backdrop-blur-8',
        elevated:
          'border border-[#0E282E] rounded-lg bg-card/60 backdrop-blur-12 shadow-lg shadow-primary/10',
        glass:
          'bg-card/70 backdrop-blur-16 border border-primary/20 rounded-lg shadow-md shadow-primary/5',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'none',
    },
  }
)

export interface FrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'video' | 'square' | string
}

const Frame = React.forwardRef<HTMLDivElement, FrameProps>(
  ({ className, variant, padding, aspectRatio, style, children, ...props }, ref) => {
    const aspectRatioStyle = aspectRatio
      ? {
          aspectRatio:
            aspectRatio === 'video'
              ? '16/9'
              : aspectRatio === 'square'
              ? '1/1'
              : aspectRatio,
        }
      : undefined

    return (
      <div
        ref={ref}
        role="region"
        className={cn(frameVariants({ variant, padding }), className)}
        style={{ ...aspectRatioStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame.displayName = 'Frame'

const FrameHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border-b border-[#0E282E] px-4 py-3 bg-[#000F1F]',
      className
    )}
    {...props}
  />
))
FrameHeader.displayName = 'FrameHeader'

const FrameTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-alt text-base font-medium leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
))
FrameTitle.displayName = 'FrameTitle'

const FrameContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative h-full w-full', className)}
    {...props}
  />
))
FrameContent.displayName = 'FrameContent'

const FrameFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border-t border-[#0E282E] px-4 py-3 bg-[#000F1F]',
      className
    )}
    {...props}
  />
))
FrameFooter.displayName = 'FrameFooter'

export {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameContent,
  FrameFooter,
  frameVariants,
}
