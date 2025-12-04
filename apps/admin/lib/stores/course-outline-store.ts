/**
 * Course Outline Store
 *
 * Zustand store for managing nested outline editor state (modules and lessons).
 * Supports Notion/Workflowy-style nested editing with drag-and-drop reordering.
 *
 * IMPORTANT: Requires zustand to be installed:
 * npm install zustand
 */

import { create } from 'zustand';
import { toast } from 'sonner';
import type { Module, Lesson, ModuleWithLessons } from '@/types/content';

/**
 * Flattened item for rendering in the outline editor
 */
export interface FlattenedItem {
  id: string;
  type: 'module' | 'lesson';
  title: string;
  depth: number;           // 0 for modules, 1 for lessons
  parentId: string | null; // null for modules, moduleId for lessons
  ancestorIds: string[];   // For drag validation
  data: Module | Lesson;   // Original data
  childCount?: number;     // For modules: lesson count
}

/**
 * Course Outline Store State
 */
interface CourseOutlineState {
  // Data
  courseId: string | null;
  modules: ModuleWithLessons[];

  // UI State
  expandedIds: Set<string>;
  editingId: string | null;
  savingIds: Set<string>;
  movingIds: Set<string>;

  // Actions
  initialize: (courseId: string, modules: ModuleWithLessons[]) => void;
  setModules: (modules: ModuleWithLessons[]) => void;
  refreshModules: () => Promise<void>;
  toggleExpanded: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setEditing: (id: string | null) => void;
  setSaving: (id: string, saving: boolean) => void;

  // CRUD
  updateModuleTitle: (id: string, title: string) => Promise<void>;
  updateLessonTitle: (id: string, title: string) => Promise<void>;
  addModule: () => Promise<void>;
  addLesson: (moduleId: string) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  deleteLesson: (id: string, moduleId: string) => Promise<void>;

  // Reorder
  moveItem: (
    activeId: string,
    overId: string,
    activeType: 'module' | 'lesson',
    overType: 'module' | 'lesson'
  ) => Promise<void>;

  // Computed
  getFlattenedItems: () => FlattenedItem[];
}

/**
 * Create the course outline store
 */
export const useCourseOutlineStore = create<CourseOutlineState>((set, get) => ({
  // Initial state
  courseId: null,
  modules: [],
  expandedIds: new Set<string>(),
  editingId: null,
  savingIds: new Set<string>(),
  movingIds: new Set<string>(),

  // Initialize store with course data
  initialize: (courseId: string, modules: ModuleWithLessons[]) => {
    set({
      courseId,
      modules,
      expandedIds: new Set<string>(),
      editingId: null,
      savingIds: new Set<string>(),
      movingIds: new Set<string>(),
    });
  },

  // Set modules (for external updates)
  setModules: (modules: ModuleWithLessons[]) => {
    set({ modules });
  },

  // Refresh modules from API
  refreshModules: async () => {
    const { courseId } = get();
    if (!courseId) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`);
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }

      const freshModules: ModuleWithLessons[] = await response.json();
      set({ modules: freshModules });
    } catch (error) {
      console.error('Failed to refresh modules:', error);
      toast.error('Failed to refresh course outline');
      throw error;
    }
  },

  // Toggle module expansion
  toggleExpanded: (id: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { expandedIds: newExpanded };
    });
  },

  // Expand all modules
  expandAll: () => {
    set((state) => {
      const allModuleIds = state.modules.map((m) => m.id);
      return { expandedIds: new Set(allModuleIds) };
    });
  },

  // Collapse all modules
  collapseAll: () => {
    set({ expandedIds: new Set<string>() });
  },

  // Set editing ID
  setEditing: (id: string | null) => {
    set({ editingId: id });
  },

  // Set saving state for an item
  setSaving: (id: string, saving: boolean) => {
    set((state) => {
      const newSavingIds = new Set(state.savingIds);
      if (saving) {
        newSavingIds.add(id);
      } else {
        newSavingIds.delete(id);
      }
      return { savingIds: newSavingIds };
    });
  },

  // Update module title
  updateModuleTitle: async (id: string, title: string) => {
    const { courseId, modules, setSaving } = get();
    if (!courseId) return;

    // Optimistic update
    const previousModules = [...modules];
    const updatedModules = modules.map((m) =>
      m.id === id ? { ...m, title } : m
    );
    set({ modules: updatedModules });

    setSaving(id, true);

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update module');
      }

      const updatedModule: Module = await response.json();

      // Update with server response
      set((state) => ({
        modules: state.modules.map((m) =>
          m.id === id ? { ...m, ...updatedModule } : m
        ),
      }));
    } catch (error) {
      // Rollback on error
      set({ modules: previousModules });
      toast.error(error instanceof Error ? error.message : 'Failed to update module');
      throw error;
    } finally {
      setSaving(id, false);
    }
  },

  // Update lesson title
  updateLessonTitle: async (id: string, title: string) => {
    const { modules, setSaving } = get();

    // Find the lesson and its module
    let moduleId: string | null = null;
    for (const mod of modules) {
      if (mod.lessons.some((l) => l.id === id)) {
        moduleId = mod.id;
        break;
      }
    }

    if (!moduleId) return;

    // Optimistic update
    const previousModules = [...modules];
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map((l) => (l.id === id ? { ...l, title } : l)),
          }
        : m
    );
    set({ modules: updatedModules });

    setSaving(id, true);

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update lesson');
      }

      const updatedLesson: Lesson = await response.json();

      // Update with server response
      set((state) => ({
        modules: state.modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === id ? updatedLesson : l
                ),
              }
            : m
        ),
      }));
    } catch (error) {
      // Rollback on error
      set({ modules: previousModules });
      toast.error(error instanceof Error ? error.message : 'Failed to update lesson');
      throw error;
    } finally {
      setSaving(id, false);
    }
  },

  // Add new module
  addModule: async () => {
    const { courseId, modules } = get();
    if (!courseId) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Module',
          status: 'draft',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create module');
      }

      const newModule: Module = await response.json();
      const newModuleWithLessons: ModuleWithLessons = {
        ...newModule,
        lessons: [],
      };

      set({
        modules: [...modules, newModuleWithLessons],
        editingId: newModule.id,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create module');
      throw error;
    }
  },

  // Add new lesson to a module
  addLesson: async (moduleId: string) => {
    const { courseId, modules, expandedIds } = get();
    if (!courseId) return;

    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Lesson',
            contentType: 'text',
            status: 'draft',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create lesson');
      }

      const newLesson: Lesson = await response.json();

      // Expand the module and add lesson
      const newExpandedIds = new Set(expandedIds);
      newExpandedIds.add(moduleId);

      set({
        modules: modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: [...m.lessons, newLesson] }
            : m
        ),
        expandedIds: newExpandedIds,
        editingId: newLesson.id,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create lesson');
      throw error;
    }
  },

  // Delete module
  deleteModule: async (id: string) => {
    const { courseId, modules } = get();
    if (!courseId) return;

    // Optimistic update
    const previousModules = [...modules];
    const updatedModules = modules.filter((m) => m.id !== id);
    set({ modules: updatedModules });

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete module');
      }
    } catch (error) {
      // Rollback on error
      set({ modules: previousModules });
      toast.error(error instanceof Error ? error.message : 'Failed to delete module');
      throw error;
    }
  },

  // Delete lesson
  deleteLesson: async (id: string, moduleId: string) => {
    const { modules } = get();

    // Optimistic update
    const previousModules = [...modules];
    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.filter((l) => l.id !== id) }
        : m
    );
    set({ modules: updatedModules });

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete lesson');
      }
    } catch (error) {
      // Rollback on error
      set({ modules: previousModules });
      toast.error(error instanceof Error ? error.message : 'Failed to delete lesson');
      throw error;
    }
  },

  // Move item (drag and drop reorder)
  moveItem: async (
    activeId: string,
    overId: string,
    activeType: 'module' | 'lesson',
    overType: 'module' | 'lesson'
  ) => {
    const { courseId, modules } = get();
    if (!courseId) return;

    // Optimistic update
    const previousModules = [...modules];

    try {
      if (activeType === 'module' && overType === 'module') {
        // Reorder modules
        const activeIndex = modules.findIndex((m) => m.id === activeId);
        const overIndex = modules.findIndex((m) => m.id === overId);

        if (activeIndex === -1 || overIndex === -1) return;

        const reorderedModules = [...modules];
        const [movedModule] = reorderedModules.splice(activeIndex, 1);
        reorderedModules.splice(overIndex, 0, movedModule);

        set({ modules: reorderedModules });

        // Send to API
        const moduleIds = reorderedModules.map((m) => m.id);
        const response = await fetch(`/api/courses/${courseId}/modules/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to reorder modules');
        }
      } else if (activeType === 'lesson' && overType === 'lesson') {
        // Find source and target modules
        let sourceModuleId: string | null = null;
        let targetModuleId: string | null = null;

        for (const mod of modules) {
          if (mod.lessons.some((l) => l.id === activeId)) {
            sourceModuleId = mod.id;
          }
          if (mod.lessons.some((l) => l.id === overId)) {
            targetModuleId = mod.id;
          }
        }

        if (sourceModuleId === targetModuleId && sourceModuleId) {
          // Same module - reorder lessons
          const updatedModules = modules.map((m) => {
            if (m.id !== sourceModuleId) return m;

            const activeIndex = m.lessons.findIndex((l) => l.id === activeId);
            const overIndex = m.lessons.findIndex((l) => l.id === overId);

            if (activeIndex === -1 || overIndex === -1) return m;

            const reorderedLessons = [...m.lessons];
            const [movedLesson] = reorderedLessons.splice(activeIndex, 1);
            reorderedLessons.splice(overIndex, 0, movedLesson);

            return { ...m, lessons: reorderedLessons };
          });

          set({ modules: updatedModules });

          // Send to API
          const targetModule = updatedModules.find((m) => m.id === sourceModuleId)!;
          const lessonIds = targetModule.lessons.map((l) => l.id);

          const response = await fetch(
            `/api/courses/${courseId}/modules/${sourceModuleId}/lessons/reorder`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lessonIds }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to reorder lessons');
          }
        } else if (sourceModuleId && targetModuleId) {
          // Cross-module move
          // Set loading state for this lesson
          set((state) => {
            const newMovingIds = new Set(state.movingIds);
            newMovingIds.add(activeId);
            return { movingIds: newMovingIds };
          });

          try {
            const sourceModule = modules.find((m) => m.id === sourceModuleId)!;
            const targetModule = modules.find((m) => m.id === targetModuleId)!;

            // Remove from source
            const lesson = sourceModule.lessons.find((l) => l.id === activeId)!;
            const newSourceLessons = sourceModule.lessons.filter((l) => l.id !== activeId);

            // Insert into target at correct position
            const overIndex = targetModule.lessons.findIndex((l) => l.id === overId);
            const newTargetLessons = [...targetModule.lessons];
            newTargetLessons.splice(overIndex, 0, { ...lesson, moduleId: targetModuleId });

            // Update state
            const updatedModules = modules.map((m) => {
              if (m.id === sourceModuleId) return { ...m, lessons: newSourceLessons };
              if (m.id === targetModuleId) return { ...m, lessons: newTargetLessons };
              return m;
            });

            set({ modules: updatedModules });

            // API call
            const response = await fetch(`/api/lessons/${activeId}/move`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                targetModuleId,
                position: overIndex,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to move lesson');
            }
          } finally {
            // Clear loading state
            set((state) => {
              const newMovingIds = new Set(state.movingIds);
              newMovingIds.delete(activeId);
              return { movingIds: newMovingIds };
            });
          }
        }
      } else {
        // Invalid move (e.g., lesson to module or vice versa)
        toast.error('Invalid move operation');
        return;
      }
    } catch (error) {
      // Rollback on error
      set({ modules: previousModules });
      toast.error(error instanceof Error ? error.message : 'Failed to reorder items');
      throw error;
    }
  },

  // Get flattened items for rendering
  getFlattenedItems: () => {
    const { modules, expandedIds } = get();
    const items: FlattenedItem[] = [];

    for (const mod of modules) {
      // Add module
      items.push({
        id: mod.id,
        type: 'module',
        title: mod.title,
        depth: 0,
        parentId: null,
        ancestorIds: [],
        data: mod,
        childCount: mod.lessons.length,
      });

      // Add lessons if module is expanded
      if (expandedIds.has(mod.id)) {
        for (const lesson of mod.lessons) {
          items.push({
            id: lesson.id,
            type: 'lesson',
            title: lesson.title,
            depth: 1,
            parentId: mod.id,
            ancestorIds: [mod.id],
            data: lesson,
          });
        }
      }
    }

    return items;
  },
}));
