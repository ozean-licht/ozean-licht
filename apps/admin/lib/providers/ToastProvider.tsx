'use client';

import { Toaster } from 'sonner';

/**
 * Toast notification provider using Sonner
 *
 * Provides toast notifications across the application with:
 * - Auto-dismiss after 5 seconds
 * - Stack support for multiple toasts
 * - Rich colors for semantic variants
 * - Dark theme matching Ozean Licht design
 *
 * Usage: Add to root layout.tsx inside body tag
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      duration={5000}
      toastOptions={{
        style: {
          background: '#1A1F2E',
          color: '#FFFFFF',
          border: '1px solid #2A2F3E',
        },
      }}
    />
  );
}
