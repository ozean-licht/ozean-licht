/**
 * Kbd (Keyboard) Component - Ozean Licht Edition
 * Based on Coss UI with Ozean Licht design system
 *
 * Displays keyboard shortcuts and keys with styling that suggests they are
 * interactive keyboard elements. Commonly used in documentation, help text,
 * and UI hints.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded-md font-mono font-medium whitespace-nowrap transition-all",
  {
    variants: {
      size: {
        sm: "px-1.5 py-0.5 text-xs leading-4",
        default: "px-2 py-1 text-sm leading-5",
        lg: "px-3 py-1.5 text-base leading-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLKbdElement>,
    VariantProps<typeof kbdVariants> {}

/**
 * Kbd Component
 *
 * @example
 * // Basic usage
 * <Kbd>Ctrl</Kbd>
 *
 * @example
 * // In context
 * <p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search</p>
 *
 * @example
 * // With size variants
 * <Kbd size="sm">⌘</Kbd>
 * <Kbd>Enter</Kbd>
 * <Kbd size="lg">Shift</Kbd>
 */
const Kbd = React.forwardRef<HTMLKbdElement, KbdProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          kbdVariants({ size, className }),
          // Ozean Licht dark theme styling with glass morphism
          "bg-[#000F1F] text-[#C4C8D4]",
          "border border-[#0E282E]",
          "shadow-sm shadow-black/40",
          "backdrop-blur-sm",
          "hover:bg-[#000F1F]/90 hover:border-[#0E282E]/80 hover:shadow-md hover:shadow-black/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        {...props}
      />
    );
  },
);

Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
