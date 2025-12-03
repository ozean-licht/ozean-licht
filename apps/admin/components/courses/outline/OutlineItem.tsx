'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronRight, FolderOpen, FileText } from 'lucide-react';
import { CossUIBadge } from '@shared/ui';
import { cn } from '@/lib/utils';
import type { FlattenedItem } from '@/lib/stores/course-outline-store';
import { InlineEditableTitle } from './InlineEditableTitle';
import { OutlineItemActions } from './OutlineItemActions';

export interface OutlineItemProps {
  item: FlattenedItem;
  isExpanded: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isFocused?: boolean;
  onToggleExpand: () => void;
  onStartEdit: () => void;
  onSaveTitle: (newTitle: string) => Promise<void>;
  onCancelEdit: () => void;
  onAddLesson?: () => void;  // Only for modules
  onDelete: () => void;
  onFocus?: () => void;
  isDragging?: boolean;
}

/**
 * OutlineItem Component
 *
 * Renders a single tree item (module or lesson) in the course outline editor.
 * Supports drag-and-drop reordering, inline title editing, expand/collapse for modules,
 * and hover action buttons.
 *
 * Features:
 * - Drag handle with @dnd-kit/sortable
 * - Click-to-edit inline title editing
 * - Expand/collapse chevron for modules
 * - Visual distinction between modules and lessons
 * - Status badge (draft/published)
 * - Child count for modules
 * - Hover actions (add lesson, edit, delete)
 *
 * @param item - Flattened item data (module or lesson)
 * @param isExpanded - Whether module is expanded (modules only)
 * @param isEditing - Whether title is being edited
 * @param isSaving - Whether save is in progress
 * @param onToggleExpand - Callback to toggle module expansion
 * @param onStartEdit - Callback to start editing title
 * @param onSaveTitle - Callback to save title changes
 * @param onCancelEdit - Callback to cancel editing
 * @param onAddLesson - Callback to add lesson to module (modules only)
 * @param onDelete - Callback to delete item
 * @param isDragging - Whether item is currently being dragged
 */
export function OutlineItem({
  item,
  isExpanded,
  isEditing,
  isSaving,
  isFocused,
  onToggleExpand,
  onStartEdit,
  onSaveTitle,
  onCancelEdit,
  onAddLesson,
  onDelete,
  onFocus,
  isDragging: isDraggingProp,
}: OutlineItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingFromSortable,
  } = useSortable({ id: item.id });

  const isDragging = isDraggingProp || isDraggingFromSortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${item.depth * 24 + 8}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onFocus}
      className={cn(
        'group flex items-center gap-2 py-2 px-2 rounded-md transition-colors',
        'hover:bg-accent/50',
        isDragging && 'opacity-50 bg-accent/30',
        isSaving && 'animate-pulse bg-accent/20',
        item.type === 'module' && 'bg-card/30',
        isFocused && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {/* Drag handle - visible on hover */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing',
          'text-muted-foreground hover:text-foreground transition-opacity',
          'flex-shrink-0'
        )}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Expand/collapse toggle - for both modules and lessons */}
      <button
        onClick={onToggleExpand}
        className={cn(
          'text-muted-foreground hover:text-foreground transition-all',
          'flex-shrink-0'
        )}
        aria-label={isExpanded ? 'Collapse content' : 'Expand content'}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {/* Icon - folder for modules, file for lessons */}
      <div className="flex-shrink-0 text-muted-foreground">
        {item.type === 'module' ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </div>

      {/* Inline editable title */}
      <InlineEditableTitle
        value={item.title}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={onStartEdit}
        onSave={onSaveTitle}
        onCancel={onCancelEdit}
        className="flex-1 min-w-0"
        placeholder={item.type === 'module' ? 'Untitled Module' : 'Untitled Lesson'}
      />

      {/* Status badge */}
      <CossUIBadge
        variant={item.data.status === 'published' ? 'primary' : 'secondary'}
        className="flex-shrink-0 text-xs"
      >
        {item.data.status}
      </CossUIBadge>

      {/* Child count - modules only */}
      {item.type === 'module' && item.childCount !== undefined && (
        <span className="text-xs text-muted-foreground flex-shrink-0 min-w-fit">
          {item.childCount} {item.childCount === 1 ? 'lesson' : 'lessons'}
        </span>
      )}

      {/* Action buttons - visible on hover */}
      <OutlineItemActions
        itemType={item.type}
        onAddChild={item.type === 'module' ? onAddLesson : undefined}
        onEdit={onStartEdit}
        onDelete={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      />
    </div>
  );
}
