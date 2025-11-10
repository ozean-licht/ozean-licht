'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmationModalProps } from '@/types/admin-components';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Icon mapping for confirmation modal variants
 */
const variantIcons = {
  danger: <AlertTriangle className="h-6 w-6 text-destructive" />,
  warning: <AlertCircle className="h-6 w-6 text-warning" />,
  info: <Info className="h-6 w-6 text-info" />,
};

/**
 * Button variant mapping for confirmation actions
 */
const variantButtonVariants = {
  danger: 'destructive' as const,
  warning: 'default' as const,
  info: 'default' as const,
};

/**
 * Confirmation Modal Component
 *
 * Displays a confirmation dialog for important actions, especially destructive ones.
 * Supports async actions with loading states and keyboard accessibility.
 *
 * Features:
 * - Three visual variants (danger, warning, info)
 * - Async action support with loading state
 * - Keyboard accessible (Escape to close)
 * - Focus trap for accessibility
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={async () => {
 *     await deleteUser(userId);
 *   }}
 *   title="Delete User"
 *   description="This action cannot be undone. Are you sure?"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      // Keep modal open on error so user can retry or cancel
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {variantIcons[variant]}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variantButtonVariants[variant]}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
