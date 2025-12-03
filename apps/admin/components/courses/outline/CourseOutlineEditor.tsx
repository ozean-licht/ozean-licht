'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ModuleWithLessons, Lesson } from '@/types/content';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CossUIButton,
  CossUIEmptyRoot,
  CossUIEmptyIcon,
  CossUIEmptyTitle,
  CossUIEmptyDescription,
  CossUIEmptyAction,
  CossUIFolderIcon,
  CossUIAlertDialog,
  CossUIAlertDialogPortal,
  CossUIAlertDialogBackdrop,
  CossUIAlertDialogContent,
  CossUIAlertDialogHeader,
  CossUIAlertDialogTitle,
  CossUIAlertDialogDescription,
  CossUIAlertDialogFooter,
  CossUIAlertDialogAction,
  CossUIAlertDialogCancel,
} from '@shared/ui';
import { Plus, Expand, Minimize2, Trash2, Keyboard } from 'lucide-react';
import { useCourseOutlineStore } from '@/lib/stores/course-outline-store';
import { OutlineItem } from './OutlineItem';
import { LessonContentAccordion } from './LessonContentAccordion';
import { useOutlineKeyboard } from './useOutlineKeyboard';

export interface CourseOutlineEditorProps {
  courseId: string;
  initialModules: ModuleWithLessons[];
  onModulesChange?: (modules: ModuleWithLessons[]) => void;
}

/**
 * CourseOutlineEditor Component
 *
 * Main container component for the course outline editor.
 * Manages the nested module/lesson structure with drag-and-drop reordering,
 * inline editing, and expandable lesson content.
 *
 * Features:
 * - Drag-and-drop reordering via @dnd-kit
 * - Zustand store for state management
 * - Flattened tree rendering for performance
 * - Expandable lesson content with inline editing
 * - Add/delete modules and lessons
 * - Expand/collapse all controls
 * - Delete confirmation dialog
 *
 * @param courseId - Course ID for API calls
 * @param initialModules - Initial modules data
 * @param onModulesChange - Optional callback when modules change
 */
export function CourseOutlineEditor({
  courseId,
  initialModules,
  onModulesChange,
}: CourseOutlineEditorProps) {
  // Store hooks
  const {
    modules,
    expandedIds,
    editingId,
    savingIds,
    movingIds,
    initialize,
    refreshModules,
    toggleExpanded,
    expandAll,
    collapseAll,
    setEditing,
    updateModuleTitle,
    updateLessonTitle,
    addModule,
    addLesson,
    deleteModule,
    deleteLesson,
    moveItem,
    getFlattenedItems,
  } = useCourseOutlineStore();

  // Keyboard navigation hook
  // Note: focusedIndex is managed internally by the hook; we only use focusedItemId for rendering
  const { focusedIndex: _focusedIndex, setFocusedIndex, focusedItemId } = useOutlineKeyboard({
    enabled: true,
  });

  // Get flattened items for rendering
  const flattenedItems = getFlattenedItems();

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    type: 'module' | 'lesson';
    title: string;
    parentId?: string;
  } | null>(null);

  // Keyboard shortcuts help state
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Initialize store on mount
  useEffect(() => {
    initialize(courseId, initialModules);
  }, [courseId, initialModules, initialize]);

  // Sync to parent if needed
  useEffect(() => {
    if (onModulesChange) {
      onModulesChange(modules);
    }
  }, [modules, onModulesChange]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag end handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeItem = flattenedItems.find((item) => item.id === active.id);
    const overItem = flattenedItems.find((item) => item.id === over.id);

    if (!activeItem || !overItem) return;

    try {
      await moveItem(
        String(active.id),
        String(over.id),
        activeItem.type,
        overItem.type
      );
    } catch (error) {
      // Error already handled in store with toast
      console.error('Failed to move item:', error);
    }
  };

  // Delete handler with confirmation
  const handleDeleteClick = (
    id: string,
    type: 'module' | 'lesson',
    title: string,
    parentId?: string
  ) => {
    setDeleteConfirm({
      id,
      type,
      title,
      parentId,
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { id, type, title, parentId } = deleteConfirm;

      // Store the deleted item data for potential undo
      const deletedItem = modules.find(m =>
        m.id === id || m.lessons?.some(l => l.id === id)
      );

      // Close dialog first
      setDeleteConfirm(null);

      // Perform the delete
      if (type === 'module') {
        await deleteModule(id);
      } else if (parentId) {
        await deleteLesson(id, parentId);
      }

      // Show undo toast
      toast.success(
        `${type === 'module' ? 'Module' : 'Lesson'} deleted`,
        {
          description: `"${title}" has been deleted`,
          action: {
            label: 'Undo',
            onClick: async () => {
              // Restore the item by recreating it
              try {
                if (type === 'module' && deletedItem) {
                  const response = await fetch(`/api/courses/${courseId}/modules`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: deletedItem.title,
                      description: deletedItem.description,
                      sortOrder: deletedItem.sortOrder,
                      status: deletedItem.status,
                    }),
                  });

                  if (response.ok) {
                    const restored = await response.json();
                    // Restore lessons if any
                    if (deletedItem.lessons && deletedItem.lessons.length > 0) {
                      for (const lesson of deletedItem.lessons) {
                        await fetch(`/api/courses/${courseId}/modules/${restored.id}/lessons`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: lesson.title,
                            description: lesson.description,
                            contentType: lesson.contentType,
                            contentText: lesson.contentText,
                            contentUrl: lesson.contentUrl,
                            videoId: lesson.videoId,
                            audioUrl: lesson.audioUrl,
                            audioMimeType: lesson.audioMimeType,
                            durationSeconds: lesson.durationSeconds,
                            sortOrder: lesson.sortOrder,
                            status: lesson.status,
                            isRequired: lesson.isRequired,
                            isPreview: lesson.isPreview,
                          }),
                        });
                      }
                    }
                    toast.success('Module restored');
                    // Refresh modules from API instead of reloading the page
                    await refreshModules();
                  }
                } else if (type === 'lesson' && parentId) {
                  const parentModule = modules.find(m => m.id === parentId);
                  const deletedLesson = parentModule?.lessons?.find(l => l.id === id);

                  if (deletedLesson) {
                    const response = await fetch(`/api/courses/${courseId}/modules/${parentId}/lessons`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: deletedLesson.title,
                        description: deletedLesson.description,
                        contentType: deletedLesson.contentType,
                        contentText: deletedLesson.contentText,
                        contentUrl: deletedLesson.contentUrl,
                        videoId: deletedLesson.videoId,
                        audioUrl: deletedLesson.audioUrl,
                        audioMimeType: deletedLesson.audioMimeType,
                        durationSeconds: deletedLesson.durationSeconds,
                        sortOrder: deletedLesson.sortOrder,
                        status: deletedLesson.status,
                        isRequired: deletedLesson.isRequired,
                        isPreview: deletedLesson.isPreview,
                      }),
                    });

                    if (response.ok) {
                      toast.success('Lesson restored');
                      // Refresh modules from API instead of reloading the page
                      await refreshModules();
                    }
                  }
                }
              } catch (error) {
                toast.error('Failed to restore item');
                console.error('Failed to restore:', error);
              }
            },
          },
          duration: 5000, // 5 seconds to undo
        }
      );
    } catch (error) {
      // Error already handled in store with toast
      console.error('Failed to delete:', error);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Update lesson content
  const handleLessonUpdate = async (lessonId: string, updates: Partial<Lesson>) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update lesson');
      }

      const updatedLesson: Lesson = await response.json();

      // Update the store with the updated lesson
      // The store doesn't have a direct lesson update method,
      // but the modules will be synced on next render
      toast.success('Lesson updated');

      return updatedLesson;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update lesson');
      throw error;
    }
  };

  // Empty state
  if (modules.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8">
        <CossUIEmptyRoot className="text-center">
          <CossUIEmptyIcon>
            <CossUIFolderIcon className="w-12 h-12 text-muted-foreground" />
          </CossUIEmptyIcon>
          <CossUIEmptyTitle>No modules yet</CossUIEmptyTitle>
          <CossUIEmptyDescription>
            Create your first module to start building the course outline.
          </CossUIEmptyDescription>
          <CossUIEmptyAction>
            <CossUIButton onClick={() => addModule()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Module
            </CossUIButton>
          </CossUIEmptyAction>
        </CossUIEmptyRoot>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <CossUIButton
          variant="ghost"
          size="sm"
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          title="Show keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4 mr-1" />
          Shortcuts
        </CossUIButton>
        <div className="flex items-center gap-2">
          <CossUIButton variant="ghost" size="sm" onClick={expandAll}>
            <Expand className="h-4 w-4 mr-1" />
            Expand All
          </CossUIButton>
          <CossUIButton variant="ghost" size="sm" onClick={collapseAll}>
            <Minimize2 className="h-4 w-4 mr-1" />
            Collapse All
          </CossUIButton>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Panel */}
      {showKeyboardHelp && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-semibold mb-3 text-sm">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Navigate</span>
                <kbd className="px-2 py-1 bg-background border rounded">↑ ↓</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expand/Collapse</span>
                <kbd className="px-2 py-1 bg-background border rounded">→ ←</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Edit title</span>
                <kbd className="px-2 py-1 bg-background border rounded">Enter</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Add lesson</span>
                <kbd className="px-2 py-1 bg-background border rounded">Cmd+Enter</kbd>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delete item</span>
                <kbd className="px-2 py-1 bg-background border rounded">Delete</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Move up</span>
                <kbd className="px-2 py-1 bg-background border rounded">Cmd+↑</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Move down</span>
                <kbd className="px-2 py-1 bg-background border rounded">Cmd+↓</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expand all</span>
                <kbd className="px-2 py-1 bg-background border rounded">Cmd+Shift+→</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outline Tree */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={flattenedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {flattenedItems.map((item, index) => (
              <div key={item.id}>
                <OutlineItem
                  item={item}
                  isExpanded={expandedIds.has(item.id)}
                  isEditing={editingId === item.id}
                  isSaving={savingIds.has(item.id) || movingIds.has(item.id)}
                  isFocused={focusedItemId === item.id}
                  onToggleExpand={() => toggleExpanded(item.id)}
                  onStartEdit={() => setEditing(item.id)}
                  onSaveTitle={(newTitle) =>
                    item.type === 'module'
                      ? updateModuleTitle(item.id, newTitle)
                      : updateLessonTitle(item.id, newTitle)
                  }
                  onCancelEdit={() => setEditing(null)}
                  onAddLesson={
                    item.type === 'module' ? () => addLesson(item.id) : undefined
                  }
                  onDelete={() =>
                    handleDeleteClick(
                      item.id,
                      item.type,
                      item.title,
                      item.parentId || undefined
                    )
                  }
                  onFocus={() => setFocusedIndex(index)}
                />

                {/* Show lesson content accordion when lesson is expanded */}
                {item.type === 'lesson' && expandedIds.has(item.id) && (
                  <LessonContentAccordion
                    lesson={item.data as Lesson}
                    courseId={courseId}
                    onUpdate={async (updates) => {
                      await handleLessonUpdate(item.id, updates);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Module Button */}
      <CossUIButton
        variant="outline"
        className="w-full border-dashed"
        onClick={() => addModule()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Module
      </CossUIButton>

      {/* Delete Confirmation Dialog */}
      <CossUIAlertDialog open={!!deleteConfirm} onOpenChange={handleCancelDelete}>
        <CossUIAlertDialogPortal>
          <CossUIAlertDialogBackdrop />
          <CossUIAlertDialogContent className="max-w-md">
            <CossUIAlertDialogHeader>
              <CossUIAlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete {deleteConfirm?.type === 'module' ? 'Module' : 'Lesson'}
              </CossUIAlertDialogTitle>
              <CossUIAlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold">"{deleteConfirm?.title}"</span>?
                {deleteConfirm?.type === 'module' && (
                  <span className="block mt-2 text-destructive">
                    This will also delete all lessons within this module. This action
                    cannot be undone.
                  </span>
                )}
                {deleteConfirm?.type === 'lesson' && (
                  <span className="block mt-2">
                    This action cannot be undone.
                  </span>
                )}
              </CossUIAlertDialogDescription>
            </CossUIAlertDialogHeader>
            <CossUIAlertDialogFooter>
              <CossUIAlertDialogCancel onClick={handleCancelDelete}>
                Cancel
              </CossUIAlertDialogCancel>
              <CossUIAlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </CossUIAlertDialogAction>
            </CossUIAlertDialogFooter>
          </CossUIAlertDialogContent>
        </CossUIAlertDialogPortal>
      </CossUIAlertDialog>
    </div>
  );
}
