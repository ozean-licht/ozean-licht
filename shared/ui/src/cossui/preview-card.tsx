/**
 * Preview Card Component - Ozean Licht Edition
 * Based on Base UI Popover with hover triggers
 *
 * Provides rich content previews on hover for links, images, users, and more.
 * Uses glass morphism effects with stronger blur for immersive preview experience.
 */

"use client";

import * as React from "react";
import { Popover } from "@base-ui-components/react/popover";
import { cn } from "../utils/cn";

// Types for positioning
type PreviewCardSide = "top" | "right" | "bottom" | "left";
type PreviewCardAlign = "start" | "center" | "end";

interface PreviewCardRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Delay in milliseconds before showing the preview on hover
   * @default 300
   */
  hoverDelay?: number;
  /**
   * Delay in milliseconds before hiding the preview after leaving
   * @default 200
   */
  leaveDelay?: number;
}

interface PreviewCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Popover.Trigger> {
  children: React.ReactNode;
}

interface PreviewCardContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Popover.Popup>,
    "side" | "align"
  > {
  children: React.ReactNode;
  /**
   * Side of the trigger to show the preview
   * @default "top"
   */
  side?: PreviewCardSide;
  /**
   * Alignment relative to the trigger
   * @default "center"
   */
  align?: PreviewCardAlign;
  /**
   * Distance in pixels from the trigger
   * @default 8
   */
  sideOffset?: number;
  /**
   * Width of the preview card
   * @default "auto" (320px default from className)
   */
  width?: string | number;
  /**
   * Enable glass effect styling
   * @default true
   */
  glassEffect?: boolean;
}

/**
 * Preview Card Root Component
 * Manages hover state with delays for better UX
 */
const PreviewCardRoot = React.forwardRef<HTMLDivElement, PreviewCardRootProps>(
  (
    {
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      hoverDelay = 300,
      leaveDelay = 200,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const hoverTimeoutRef = React.useRef<NodeJS.Timeout>();
    const leaveTimeoutRef = React.useRef<NodeJS.Timeout>();

    // Use controlled state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (controlledOpen === undefined) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [controlledOpen, onOpenChange]
    );

    // Handle hover enter with delay
    const handleMouseEnter = React.useCallback(() => {
      // Clear any pending leave timeout
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = undefined;
      }

      // Set hover timeout
      hoverTimeoutRef.current = setTimeout(() => {
        handleOpenChange(true);
      }, hoverDelay);
    }, [hoverDelay, handleOpenChange]);

    // Handle hover leave with delay
    const handleMouseLeave = React.useCallback(() => {
      // Clear any pending hover timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = undefined;
      }

      // Set leave timeout
      leaveTimeoutRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, leaveDelay);
    }, [leaveDelay, handleOpenChange]);

    // Cleanup timeouts on unmount
    React.useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        if (leaveTimeoutRef.current) {
          clearTimeout(leaveTimeoutRef.current);
        }
      };
    }, []);

    // Context to share hover handlers with children
    const contextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        handleMouseEnter,
        handleMouseLeave,
      }),
      [open, handleOpenChange, handleMouseEnter, handleMouseLeave]
    );

    return (
      <PreviewCardContext.Provider value={contextValue}>
        <Popover.Root open={open} onOpenChange={handleOpenChange} {...props}>
          <div ref={ref}>{children}</div>
        </Popover.Root>
      </PreviewCardContext.Provider>
    );
  }
);
PreviewCardRoot.displayName = "PreviewCardRoot";

// Context to share state between components
const PreviewCardContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
} | null>(null);

const usePreviewCardContext = () => {
  const context = React.useContext(PreviewCardContext);
  if (!context) {
    throw new Error(
      "PreviewCard components must be used within PreviewCardRoot"
    );
  }
  return context;
};

/**
 * Preview Card Trigger Component
 * Element that triggers the preview on hover
 */
const PreviewCardTrigger = React.forwardRef<
  HTMLButtonElement,
  PreviewCardTriggerProps
>(({ className, children, ...props }, ref) => {
  const { handleMouseEnter, handleMouseLeave } = usePreviewCardContext();

  return (
    <Popover.Trigger
      ref={ref}
      className={cn("cursor-pointer", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-slot="preview-trigger"
      {...props}
    >
      {children}
    </Popover.Trigger>
  );
});
PreviewCardTrigger.displayName = "PreviewCardTrigger";

/**
 * Preview Card Content Component
 * The preview card content with glass morphism styling
 */
const PreviewCardContent = React.forwardRef<
  HTMLDivElement,
  PreviewCardContentProps
>(
  (
    {
      className,
      children,
      side = "top",
      align = "center",
      sideOffset = 8,
      width,
      glassEffect = true,
      ...props
    },
    ref
  ) => {
    const { handleMouseEnter, handleMouseLeave } = usePreviewCardContext();

    return (
      <Popover.Portal>
        <Popover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-50"
          data-slot="preview-positioner"
        >
          <Popover.Popup
            ref={ref}
            className={cn(
              // Base styles
              "rounded-lg p-4",
              // Glass morphism with strong blur
              glassEffect &&
                "bg-card/80 backdrop-blur-16 border border-primary/30",
              !glassEffect && "bg-card border border-border",
              // Shadow and glow
              "shadow-lg shadow-primary/20",
              // Default width
              !width && "w-80",
              // Animations
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              // Transitions
              "transition-all duration-200",
              className
            )}
            style={width ? { width: typeof width === "number" ? `${width}px` : width } : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-slot="preview-content"
            {...props}
          >
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    );
  }
);
PreviewCardContent.displayName = "PreviewCardContent";

// Export components
export {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardContent,
  type PreviewCardRootProps,
  type PreviewCardTriggerProps,
  type PreviewCardContentProps,
  type PreviewCardSide,
  type PreviewCardAlign,
};
