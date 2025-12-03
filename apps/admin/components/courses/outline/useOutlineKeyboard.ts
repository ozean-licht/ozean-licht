'use client';

import { useState, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCourseOutlineStore } from '@/lib/stores/course-outline-store';

export interface UseOutlineKeyboardOptions {
  /**
   * Enable or disable keyboard shortcuts globally.
   * Hotkeys are automatically disabled when the user is editing a title.
   * @default true
   */
  enabled?: boolean;
}

export interface UseOutlineKeyboardReturn {
  /**
   * Current focused item index in the flattened list
   */
  focusedIndex: number;

  /**
   * Set the focused item index
   */
  setFocusedIndex: (index: number) => void;

  /**
   * ID of the currently focused item (null if no focus)
   */
  focusedItemId: string | null;
}

/**
 * Keyboard shortcut hook for the course outline editor.
 *
 * Provides Notion/Workflowy-style keyboard navigation and shortcuts:
 * - Arrow Up/Down: Navigate between items (when not editing)
 * - Enter: Start editing focused item
 * - Escape: Cancel edit and clear focus
 * - Cmd+Down: Expand focused item
 * - Cmd+Up: Collapse focused item
 * - Alt+Shift+Up: Move item up
 * - Alt+Shift+Down: Move item down
 * - Cmd+Shift+E: Expand all modules
 * - Cmd+Shift+C: Collapse all modules
 *
 * The hook integrates with the Zustand course outline store and
 * automatically disables hotkeys when the user is editing a title.
 *
 * @param options - Configuration options
 * @returns Object with focusedIndex, setFocusedIndex, and focusedItemId
 *
 * @example
 * ```tsx
 * function CourseOutlineEditor() {
 *   const { focusedIndex, setFocusedIndex, focusedItemId } = useOutlineKeyboard({
 *     enabled: true,
 *   });
 *
 *   return (
 *     <div>
 *       {items.map((item, index) => (
 *         <OutlineItem
 *           key={item.id}
 *           item={item}
 *           isFocused={focusedItemId === item.id}
 *           onFocus={() => setFocusedIndex(index)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOutlineKeyboard(
  options: UseOutlineKeyboardOptions = {}
): UseOutlineKeyboardReturn {
  const { enabled = true } = options;

  // Get store state and actions
  const {
    editingId,
    setEditing,
    toggleExpanded,
    expandAll,
    collapseAll,
    moveItem,
    getFlattenedItems,
  } = useCourseOutlineStore();

  // Local state for focused index
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Get flattened items
  const flattenedItems = useMemo(() => getFlattenedItems(), [getFlattenedItems]);

  // Calculate focused item ID
  const focusedItemId = useMemo(() => {
    if (focusedIndex >= 0 && focusedIndex < flattenedItems.length) {
      return flattenedItems[focusedIndex].id;
    }
    return null;
  }, [focusedIndex, flattenedItems]);

  // Hotkeys are enabled when:
  // 1. The global `enabled` option is true
  // 2. No item is currently being edited (editingId is null)
  const hotkeysEnabled = enabled && editingId === null;

  // Arrow Up: Navigate up
  useHotkeys(
    'up',
    (e) => {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(0, prev - 1));
    },
    {
      enabled: hotkeysEnabled,
      enableOnFormTags: false,
    },
    [hotkeysEnabled]
  );

  // Arrow Down: Navigate down
  useHotkeys(
    'down',
    (e) => {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(flattenedItems.length - 1, prev + 1));
    },
    {
      enabled: hotkeysEnabled,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, flattenedItems.length]
  );

  // Enter: Start editing focused item
  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault();
      if (focusedItemId) {
        setEditing(focusedItemId);
      }
    },
    {
      enabled: hotkeysEnabled && focusedItemId !== null,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, focusedItemId, setEditing]
  );

  // Escape: Cancel edit and clear focus
  useHotkeys(
    'escape',
    (e) => {
      e.preventDefault();
      if (editingId !== null) {
        setEditing(null);
      } else {
        setFocusedIndex(-1);
      }
    },
    {
      enabled: enabled, // Always enabled (even during editing)
      enableOnFormTags: true, // Allow in form inputs
    },
    [enabled, editingId, setEditing]
  );

  // Cmd+Down (Meta+Down): Expand focused item
  useHotkeys(
    'meta+down,ctrl+down',
    (e) => {
      e.preventDefault();
      if (focusedItemId) {
        const focusedItem = flattenedItems[focusedIndex];
        // Only expand modules (lessons can't be expanded beyond their content accordion)
        if (focusedItem?.type === 'module') {
          toggleExpanded(focusedItemId);
        }
      }
    },
    {
      enabled: hotkeysEnabled && focusedItemId !== null,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, focusedItemId, focusedIndex, flattenedItems, toggleExpanded]
  );

  // Cmd+Up (Meta+Up): Collapse focused item
  useHotkeys(
    'meta+up,ctrl+up',
    (e) => {
      e.preventDefault();
      if (focusedItemId) {
        const focusedItem = flattenedItems[focusedIndex];
        // Only collapse modules
        if (focusedItem?.type === 'module') {
          toggleExpanded(focusedItemId);
        }
      }
    },
    {
      enabled: hotkeysEnabled && focusedItemId !== null,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, focusedItemId, focusedIndex, flattenedItems, toggleExpanded]
  );

  // Alt+Shift+Up: Move item up
  useHotkeys(
    'alt+shift+up',
    (e) => {
      e.preventDefault();
      if (focusedItemId && focusedIndex > 0) {
        const focusedItem = flattenedItems[focusedIndex];
        const aboveItem = flattenedItems[focusedIndex - 1];

        // Only move if both items are of the same type
        if (focusedItem.type === aboveItem.type) {
          moveItem(
            focusedItemId,
            aboveItem.id,
            focusedItem.type,
            aboveItem.type
          );
          // Update focus to follow the moved item
          setFocusedIndex(focusedIndex - 1);
        }
      }
    },
    {
      enabled: hotkeysEnabled && focusedItemId !== null && focusedIndex > 0,
      enableOnFormTags: false,
    },
    [
      hotkeysEnabled,
      focusedItemId,
      focusedIndex,
      flattenedItems,
      moveItem,
    ]
  );

  // Alt+Shift+Down: Move item down
  useHotkeys(
    'alt+shift+down',
    (e) => {
      e.preventDefault();
      if (focusedItemId && focusedIndex < flattenedItems.length - 1) {
        const focusedItem = flattenedItems[focusedIndex];
        const belowItem = flattenedItems[focusedIndex + 1];

        // Only move if both items are of the same type
        if (focusedItem.type === belowItem.type) {
          moveItem(
            focusedItemId,
            belowItem.id,
            focusedItem.type,
            belowItem.type
          );
          // Update focus to follow the moved item
          setFocusedIndex(focusedIndex + 1);
        }
      }
    },
    {
      enabled:
        hotkeysEnabled &&
        focusedItemId !== null &&
        focusedIndex < flattenedItems.length - 1,
      enableOnFormTags: false,
    },
    [
      hotkeysEnabled,
      focusedItemId,
      focusedIndex,
      flattenedItems,
      moveItem,
    ]
  );

  // Cmd+Shift+E: Expand all modules
  useHotkeys(
    'meta+shift+e,ctrl+shift+e',
    (e) => {
      e.preventDefault();
      expandAll();
    },
    {
      enabled: hotkeysEnabled,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, expandAll]
  );

  // Cmd+Shift+C: Collapse all modules
  useHotkeys(
    'meta+shift+c,ctrl+shift+c',
    (e) => {
      e.preventDefault();
      collapseAll();
    },
    {
      enabled: hotkeysEnabled,
      enableOnFormTags: false,
    },
    [hotkeysEnabled, collapseAll]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    focusedItemId,
  };
}
