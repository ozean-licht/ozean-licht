/**
 * Tooltip Component - Ozean Licht Edition
 * Based on Coss UI (@coss/tooltip) with Ozean Licht design system
 * Uses Base UI Tooltip primitives with Positioner for proper positioning
 */

"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip";

import { cn } from "../utils/cn";

/**
 * Tooltip Provider - Wraps multiple tooltips for instant display
 * Use this to group tooltips that should open instantly after the first opens
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip Root Component
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip Trigger - Element that shows the tooltip on hover
 */
const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  TooltipPrimitive.Trigger.Props
>((props, ref) => {
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      data-slot="tooltip-trigger"
      className={cn("cursor-help", props.className)}
      {...props}
    />
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

/**
 * Tooltip Positioner - Exported for advanced positioning use cases
 */
const TooltipPositioner = TooltipPrimitive.Positioner;

/**
 * Tooltip Popup - The tooltip content with Positioner integrated
 * Using TooltipPopup instead of TooltipContent (Coss UI convention)
 */
function TooltipPopup({
  className,
  align = "center",
  sideOffset = 4,
  side = "top",
  children,
  ...props
}: TooltipPrimitive.Popup.Props & {
  align?: TooltipPrimitive.Positioner.Props["align"];
  side?: TooltipPrimitive.Positioner.Props["side"];
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"];
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        className="z-50"
        data-slot="tooltip-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(
            "overflow-hidden rounded-md px-3 py-1.5 text-xs",
            "bg-card/95 backdrop-blur-16 border border-primary/30",
            "text-[#C4C8D4] font-sans font-light",
            "shadow-md shadow-primary/20",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "data-ending-style:animate-out data-ending-style:fade-out-0 data-ending-style:zoom-out-95",
            "data-starting-style:scale-98 data-starting-style:opacity-0",
            className,
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

/**
 * Tooltip Content - Alias for TooltipPopup (for shadcn/ui compatibility)
 * Use TooltipPopup for new code following Coss UI conventions
 */
const TooltipContent = TooltipPopup;

/**
 * Tooltip Arrow - Optional arrow pointing to the trigger
 */
const TooltipArrow = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-card border-primary/30", className)}
    {...props}
  />
));
TooltipArrow.displayName = "TooltipArrow";

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPositioner,
  TooltipPopup,
  TooltipContent,
  TooltipArrow,
};
