/**
 * TypeScript types for Admin Component Library
 *
 * Provides type-safe interfaces for all admin-specific components
 */

/**
 * Status types for badge components
 *
 * Semantic status indicators for entities across the admin dashboard
 */
export type StatusType =
  | 'active'      // Entity is active/enabled
  | 'inactive'    // Entity is inactive/disabled
  | 'pending'     // Entity awaiting approval/processing
  | 'approved'    // Entity has been approved
  | 'rejected'    // Entity has been rejected
  | 'draft'       // Entity is in draft state
  | 'published'   // Entity is published/live
  | 'archived'    // Entity is archived
  | 'error'       // Error state
  | 'success'     // Success state
  | 'warning'     // Warning state
  | 'info';       // Info state

/**
 * Action types for button components
 *
 * Common admin actions with standardized icons and variants
 */
export type ActionType =
  | 'edit'        // Edit/modify entity
  | 'delete'      // Delete entity (destructive)
  | 'view'        // View entity details
  | 'approve'     // Approve entity
  | 'reject'      // Reject entity (destructive)
  | 'publish'     // Publish entity
  | 'archive'     // Archive entity
  | 'restore';    // Restore archived entity

/**
 * Props for empty state component
 */
export interface EmptyStateProps {
  /** Icon to display (defaults to FileQuestion) */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional call-to-action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Props for confirmation modal component
 */
export interface ConfirmationModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Called when user confirms action (can be async) */
  onConfirm: () => void | Promise<void>;
  /** Modal title */
  title: string;
  /** Optional description text */
  description?: string;
  /** Confirm button label (defaults to "Confirm") */
  confirmLabel?: string;
  /** Cancel button label (defaults to "Cancel") */
  cancelLabel?: string;
  /** Visual variant (affects icon and button color) */
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * Option type for select and radio components
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Option type for radio group with optional description
 */
export interface RadioOption extends SelectOption {
  description?: string;
}
