/**
 * Tier 1: Base UI Components (shadcn/ui primitives)
 *
 * Headless, accessible, unstyled primitives built on Radix UI.
 * These are the foundation components that can be themed and styled.
 *
 * Usage:
 * ```typescript
 * import { Button, Card, Dialog } from '@ozean-licht/shared-ui/ui'
 * ```
 */

// Base Components (Phase 1 - 10 components)
export * from './avatar';
export * from './badge';
export * from './button';
export * from './card';
export * from './dialog';
export * from './dropdown-menu';
export * from './input';
export * from './select';
export * from './skeleton';
export * from './tabs';

// Form Components (Phase 2 - 7 components)
export * from './checkbox';
export * from './form';
export * from './label';
export * from './radio-group';
export * from './slider';
export * from './switch';
export * from './textarea';

// Overlay Components (Phase 2 - 7 components)
export * from './alert-dialog';
export * from './context-menu';
export * from './hover-card';
export * from './menubar';
export * from './popover';
export * from './sheet';
export * from './tooltip';

// Feedback Components (Phase 2 - 4 components)
export * from './alert';
export * from './progress';
export * from './toast';

// Toast implementations (aliased to avoid conflicts)
// Sonner exports Toaster component
export { Toaster as SonnerToaster } from './sonner';
// Toaster exports Toaster component for shadcn toast
export { Toaster } from './toaster';

// Data Display Components (Phase 2 - 5 components)
export * from './accordion';
export * from './collapsible';
export * from './scroll-area';
export * from './separator';
export * from './table';

// Navigation Components (Phase 2 - 4 components)
export * from './breadcrumb';
export * from './command';
export * from './navigation-menu';
export * from './pagination';

// Advanced Components (Phase 2 - 10 components)
export * from './aspect-ratio';
export * from './calendar';
export * from './carousel';
export * from './chart';
export * from './drawer';
export * from './input-otp';
export * from './resizable';
export * from './toggle';
export * from './toggle-group';
