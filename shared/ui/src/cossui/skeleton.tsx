/**
 * Skeleton Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht styling
 */

import * as React from 'react'
import { cn } from '../utils/cn'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-card/70 backdrop-blur-8 border border-border/50',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
