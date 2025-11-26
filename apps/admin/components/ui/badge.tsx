/**
 * Badge Component - Ozean Licht Design System
 *
 * Status badges with semantic color variants following the deep ocean theme.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#000F1F] text-primary shadow-sm shadow-primary/10",
        primary:
          "border-transparent bg-primary text-white shadow-sm shadow-primary/20",
        secondary:
          "border-border bg-card/70 text-foreground backdrop-blur-sm",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm shadow-destructive/20",
        success:
          "border-transparent bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm shadow-amber-500/20",
        info:
          "border-transparent bg-blue-500 text-white shadow-sm shadow-blue-500/20",
        outline:
          "border-primary/30 text-primary bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
