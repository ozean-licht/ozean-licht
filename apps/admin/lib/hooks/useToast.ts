import { toast as sonnerToast } from 'sonner';

/**
 * Custom hook for toast notifications
 *
 * Wraps Sonner toast with semantic methods for common use cases.
 *
 * @example
 * ```tsx
 * const { success, error } = useToast();
 *
 * const handleSave = async () => {
 *   try {
 *     await saveData();
 *     success('Changes saved successfully');
 *   } catch (err) {
 *     error('Failed to save changes');
 *   }
 * };
 * ```
 */
export const useToast = () => {
  return {
    /**
     * Show success toast (green)
     */
    success: (message: string) => sonnerToast.success(message),

    /**
     * Show error toast (red)
     */
    error: (message: string) => sonnerToast.error(message),

    /**
     * Show info toast (blue)
     */
    info: (message: string) => sonnerToast.info(message),

    /**
     * Show warning toast (yellow)
     */
    warning: (message: string) => sonnerToast.warning(message),

    /**
     * Show loading toast with promise
     */
    promise: sonnerToast.promise,

    /**
     * Show custom toast
     */
    custom: sonnerToast,
  };
};
