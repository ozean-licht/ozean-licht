'use client';

import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcut handlers configuration
 */
export interface KeyboardShortcutHandlers {
  /** Handler for toggling the sidebar (mobile) */
  onToggleSidebar?: () => void;
  /** Handler for opening search/command palette */
  onSearch?: () => void;
  /** Handler for closing modals/overlays */
  onClose?: () => void;
  /** Handler for navigating to dashboard home */
  onGoHome?: () => void;
}

/**
 * Keyboard shortcuts configuration
 */
export interface KeyboardShortcutConfig {
  /** Enable/disable specific shortcuts */
  enabled?: {
    escape?: boolean;
    search?: boolean;
    navigation?: boolean;
  };
}

/**
 * Hook for managing global keyboard shortcuts in the admin dashboard
 *
 * Supported shortcuts:
 * - Escape: Close sidebar/modal
 * - /: Focus search (if implemented)
 * - g + h: Go to dashboard home
 *
 * @param handlers - Callback functions for different keyboard actions
 * @param config - Optional configuration to enable/disable shortcuts
 *
 * @example
 * // In a layout component
 * useKeyboardShortcuts({
 *   onToggleSidebar: handleToggleSidebar,
 *   onSearch: handleOpenSearch,
 *   onClose: handleCloseSidebar,
 * });
 *
 * @example
 * // With custom configuration
 * useKeyboardShortcuts(
 *   { onToggleSidebar: handleToggle },
 *   { enabled: { escape: true, search: false } }
 * );
 */
export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  config: KeyboardShortcutConfig = {}
) {
  const {
    onToggleSidebar,
    onSearch,
    onClose,
    onGoHome,
  } = handlers;

  const {
    enabled = {
      escape: true,
      search: true,
      navigation: true,
    },
  } = config;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Escape key: Close sidebar/modal
      if (enabled.escape && event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
        return;
      }

      // Don't process other shortcuts in input fields
      if (isInputField) {
        return;
      }

      // Forward slash: Open search (only if not in input)
      if (enabled.search && event.key === '/' && onSearch) {
        event.preventDefault();
        onSearch();
        return;
      }

      // Navigation shortcuts with 'g' prefix
      if (enabled.navigation && event.key === 'g') {
        // Wait for second key
        const handleSecondKey = (e: KeyboardEvent) => {
          if (e.key === 'h' && onGoHome) {
            e.preventDefault();
            onGoHome();
          }
          window.removeEventListener('keydown', handleSecondKey);
        };

        window.addEventListener('keydown', handleSecondKey);
        // Clean up after 1 second if no second key is pressed
        setTimeout(() => {
          window.removeEventListener('keydown', handleSecondKey);
        }, 1000);
      }
    },
    [onToggleSidebar, onSearch, onClose, onGoHome, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Keyboard shortcut documentation for display in help modals
 */
export const KEYBOARD_SHORTCUTS_DOCS = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Esc'], description: 'Close sidebar or modal' },
      { keys: ['g', 'h'], description: 'Go to dashboard home' },
    ],
  },
  {
    category: 'Search',
    shortcuts: [
      { keys: ['/'], description: 'Open search or command palette' },
    ],
  },
] as const;
