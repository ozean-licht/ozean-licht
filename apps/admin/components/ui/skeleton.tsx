/**
 * Skeleton Component - Ozean Licht Design System
 *
 * Loading placeholder with glass morphism effect.
 */

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-card/70 backdrop-blur-sm border border-border/50",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
