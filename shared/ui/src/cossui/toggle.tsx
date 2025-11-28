'use client';

/**
 * Toggle & ToggleGroup Components - Ozean Licht Edition
 * Based on Coss UI (@coss/toggle) with Ozean Licht design system
 * Uses Base UI Toggle primitives for accessibility
 */

"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui-components/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui-components/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-3 min-w-9",
        lg: "h-10 px-4 min-w-10",
        sm: "h-8 px-2.5 min-w-8 text-xs",
        icon: "h-9 w-9",
      },
      variant: {
        default:
          "bg-card/70 backdrop-blur-12 border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 data-pressed:bg-primary/20 data-pressed:text-primary data-pressed:border-primary/40 active:scale-95",
        outline:
          "border border-border bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30 data-pressed:bg-primary/20 data-pressed:text-primary data-pressed:border-primary/40 active:scale-95",
        ghost:
          "hover:bg-primary/10 hover:text-primary data-pressed:bg-primary/20 data-pressed:text-primary active:scale-95",
      },
    },
  },
);

/**
 * Toggle Component
 * Individual toggle button - can be used standalone or within a ToggleGroup
 */
const Toggle = React.forwardRef<
  HTMLButtonElement,
  TogglePrimitive.Props & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => {
  return (
    <TogglePrimitive
      ref={ref}
      className={cn(toggleVariants({ size, variant, className }))}
      data-slot="toggle"
      {...props}
    />
  );
});

Toggle.displayName = "Toggle";

/**
 * ToggleGroup Component
 * Container for grouping toggle buttons with shared state
 */
const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 rounded-lg bg-card/70 backdrop-blur-12 border border-border p-1",
      className
    )}
    {...props}
  />
));

ToggleGroup.displayName = "ToggleGroup";

export { Toggle, ToggleGroup, toggleVariants };
