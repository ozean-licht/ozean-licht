'use client';

/**
 * Switch Component - Ozean Licht Edition
 * Based on Coss UI (@coss/switch) with Ozean Licht design system
 * Uses Base UI Switch primitives for accessibility
 */

"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui-components/react/switch";

import { cn } from "../utils/cn";

/**
 * Switch Component
 * Toggle switch for boolean values with built-in thumb
 *
 * Usage:
 * - Uncontrolled: <Switch defaultChecked={false} />
 * - Controlled: <Switch checked={isChecked} onCheckedChange={setIsChecked} />
 */
const Switch = React.forwardRef<
  HTMLButtonElement,
  SwitchPrimitive.Root.Props
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "group/switch inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 p-px outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked state
        "data-unchecked:bg-card/50 data-unchecked:backdrop-blur-8 data-unchecked:border-border",
        "data-unchecked:hover:border-primary/40 data-unchecked:hover:shadow-sm data-unchecked:hover:shadow-primary/10",
        // Checked state
        "data-checked:bg-primary data-checked:border-primary",
        "data-checked:hover:bg-primary/90",
        className,
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg",
          "transition-[translate,width] duration-200",
          "data-unchecked:translate-x-0.5",
          "data-checked:translate-x-5",
          "group-active/switch:w-4.5 data-checked:group-active/switch:translate-x-4.5",
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";

export { Switch };
