import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '../utils'

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "bg-[#2D0A0A] border-[#8B0000] text-white [&>svg]:text-[#EF4444]",
        success:
          "bg-[#0A2D1A] border-[#166534] text-white [&>svg]:text-[#10B981]",
        warning:
          "bg-[#2D1F0A] border-[#92400E] text-white [&>svg]:text-[#F59E0B]",
        info:
          "bg-[#0A1A2D] border-[#1E40AF] text-white [&>svg]:text-[#3B82F6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { variant?: "default" | "destructive" | "success" | "warning" | "info" }
>(({ className, variant, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-none tracking-tight text-white",
      variant === "destructive" && "text-[#EF4444]",
      variant === "success" && "text-[#10B981]",
      variant === "warning" && "text-[#F59E0B]",
      variant === "info" && "text-[#3B82F6]",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-white/80 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
