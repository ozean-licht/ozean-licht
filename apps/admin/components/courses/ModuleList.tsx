'use client';

import { useState } from 'react';
import { Module, ModuleWithLessons, Lesson } from '@/types/content';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CossUIAccordion,
  CossUIAccordionItem,
  CossUIAccordionTrigger,
  CossUIAccordionPanel,
  CossUIBadge,
  CossUIEmptyRoot,
  CossUIEmptyIcon,
  CossUIEmptyTitle,
  CossUIEmptyDescription,
  CossUIEmptyAction,
  CossUIButton,
  CossUIFolderIcon,
  CossUIMenu,
  CossUIMenuTrigger,
  CossUIMenuPopup,
  CossUIMenuItem,
  CossUIMenuSeparator,
  CossUIAlertDialog,
  CossUIAlertDialogTrigger,
  CossUIAlertDialogContent,
  CossUIAlertDialogHeader,
  CossUIAlertDialogFooter,
  CossUIAlertDialogTitle,
  CossUIAlertDialogDescription,
  CossUIAlertDialogAction,
  CossUIAlertDialogCancel,
} from '@shared/ui';
import { ChevronDown, BookOpen, Clock, Plus, MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LessonList from './LessonList';
import ModuleEditorModal from './ModuleEditorModal';
import LessonEditorModal from './LessonEditorModal';

interface ModuleListProps {
  courseId: string;
  modules: ModuleWithLessons[];
  onModulesChange: (modules: ModuleWithLessons[]) => void;
}

// Sortable Module Item
interface SortableModuleItemProps {
  module: ModuleWithLessons;
  index: number;
  courseId: string;
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (lesson: Lesson, moduleId: string) => void;
  onDeleteLesson: (lesson: Lesson, moduleId: string) => void;
  onLessonsReorder: (moduleId: string, lessonIds: string[]) => void;
  formatDuration: (seconds: number) => string;
}

function SortableModuleItem({
  module,
  index,
  courseId,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonsReorder,
  formatDuration,
}: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CossUIAccordionItem
        value={module.id}
        className="border rounded-lg bg-card/50 overflow-hidden"
      >
        <div className="flex items-center">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="px-2 py-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <CossUIAccordionTrigger className="flex-1 px-2 py-3 hover:bg-accent/50 transition-colors [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Module Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {index + 1}
              </div>

              {/* Module Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{module.title}</h3>
                  <CossUIBadge
                    variant={module.status === 'published' ? 'default' : 'secondary'}
                    className="capitalize text-xs"
                  >
                    {module.status}
                  </CossUIBadge>
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {module.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{module.lessons?.length || 0} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(module.totalDurationSeconds || 0)}</span>
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200" />
          </CossUIAccordionTrigger>

          {/* Module Actions */}
          <div className="px-2">
            <CossUIMenu>
              <CossUIMenuTrigger>
                <CossUIButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </CossUIButton>
              </CossUIMenuTrigger>
              <CossUIMenuPopup>
                <CossUIMenuItem onClick={() => onEdit(module)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Module
                </CossUIMenuItem>
                <CossUIMenuItem onClick={() => onAddLesson(module.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </CossUIMenuItem>
                <CossUIMenuSeparator />
                <CossUIAlertDialog>
                  <CossUIAlertDialogTrigger>
                    <CossUIMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Module
                    </CossUIMenuItem>
                  </CossUIAlertDialogTrigger>
                  <CossUIAlertDialogContent>
                    <CossUIAlertDialogHeader>
                      <CossUIAlertDialogTitle>Delete Module</CossUIAlertDialogTitle>
                      <CossUIAlertDialogDescription>
                        Are you sure you want to delete &ldquo;{module.title}&rdquo;? This will also delete all {module.lessons?.length || 0} lessons in this module. This action cannot be undone.
                      </CossUIAlertDialogDescription>
                    </CossUIAlertDialogHeader>
                    <CossUIAlertDialogFooter>
                      <CossUIAlertDialogCancel>Cancel</CossUIAlertDialogCancel>
                      <CossUIAlertDialogAction
                        onClick={() => onDelete(module)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </CossUIAlertDialogAction>
                    </CossUIAlertDialogFooter>
                  </CossUIAlertDialogContent>
                </CossUIAlertDialog>
              </CossUIMenuPopup>
            </CossUIMenu>
          </div>
        </div>

        <CossUIAccordionPanel className="border-t">
          <div className="p-4">
            <LessonList
              courseId={courseId}
              moduleId={module.id}
              lessons={module.lessons || []}
              onAddLesson={() => onAddLesson(module.id)}
              onEditLesson={(lesson) => onEditLesson(lesson, module.id)}
              onDeleteLesson={(lesson) => onDeleteLesson(lesson, module.id)}
              onLessonsReorder={(lessonIds) => onLessonsReorder(module.id, lessonIds)}
            />
          </div>
        </CossUIAccordionPanel>
      </CossUIAccordionItem>
    </div>
  );
}

export default function ModuleList({
  courseId,
  modules,
  onModulesChange,
}: ModuleListProps) {
  // Modal state
  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [lessonEditorOpen, setLessonEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Format duration as hours and minutes
  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '0 min';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  // Handle module drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      // Capture original state before optimistic update
      const originalModules = modules;
      const newModules = arrayMove(modules, oldIndex, newIndex);
      onModulesChange(newModules);

      // Call API to persist reorder
      try {
        const response = await fetch(`/api/courses/${courseId}/modules/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleIds: newModules.map((m) => m.id) }),
        });

        if (!response.ok) {
          throw new Error('Failed to reorder modules');
        }
      } catch (error) {
        console.error('Failed to reorder modules:', error);
        // Revert to captured original state
        onModulesChange(originalModules);
      }
    }
  };

  // Handle add module
  const handleAddModule = () => {
    setEditingModule(null);
    setModuleEditorOpen(true);
  };

  // Handle edit module
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleEditorOpen(true);
  };

  // Handle module saved
  const handleModuleSaved = (savedModule: Module) => {
    if (editingModule) {
      // Update existing module
      onModulesChange(
        modules.map((m) =>
          m.id === savedModule.id ? { ...m, ...savedModule } : m
        )
      );
    } else {
      // Add new module
      onModulesChange([...modules, { ...savedModule, lessons: [] }]);
    }
  };

  // Handle delete module
  const handleDeleteModule = async (module: Module) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${module.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      onModulesChange(modules.filter((m) => m.id !== module.id));
    } catch (error) {
      console.error('Failed to delete module:', error);
    }
  };

  // Handle add lesson
  const handleAddLesson = (moduleId: string) => {
    setEditingLesson(null);
    setActiveModuleId(moduleId);
    setLessonEditorOpen(true);
  };

  // Handle edit lesson
  const handleEditLesson = (lesson: Lesson, moduleId: string) => {
    setEditingLesson(lesson);
    setActiveModuleId(moduleId);
    setLessonEditorOpen(true);
  };

  // Handle lesson saved
  const handleLessonSaved = (savedLesson: Lesson) => {
    if (editingLesson) {
      // Update existing lesson
      onModulesChange(
        modules.map((m) =>
          m.id === activeModuleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === savedLesson.id ? savedLesson : l
                ),
              }
            : m
        )
      );
    } else {
      // Add new lesson
      onModulesChange(
        modules.map((m) =>
          m.id === activeModuleId
            ? { ...m, lessons: [...m.lessons, savedLesson] }
            : m
        )
      );
    }
  };

  // Handle delete lesson
  const handleDeleteLesson = async (lesson: Lesson, moduleId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lesson.id) }
            : m
        )
      );
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  // Handle lessons reorder
  const handleLessonsReorder = async (moduleId: string, lessonIds: string[]) => {
    // Capture original state before optimistic update
    const originalModules = modules;
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const reorderedLessons = lessonIds
      .map((id) => module.lessons.find((l) => l.id === id))
      .filter((l): l is Lesson => l !== undefined);

    onModulesChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: reorderedLessons } : m
      )
    );

    // Call API to persist reorder
    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder lessons');
      }
    } catch (error) {
      console.error('Failed to reorder lessons:', error);
      // Revert to captured original state
      onModulesChange(originalModules);
    }
  };

  if (modules.length === 0) {
    return (
      <>
        <div className="border border-dashed rounded-lg p-8">
          <CossUIEmptyRoot className="text-center">
            <CossUIEmptyIcon>
              <CossUIFolderIcon className="w-12 h-12 text-muted-foreground" />
            </CossUIEmptyIcon>
            <CossUIEmptyTitle>No modules yet</CossUIEmptyTitle>
            <CossUIEmptyDescription>
              Get started by creating the first module for this course.
              Modules are sections that contain lessons.
            </CossUIEmptyDescription>
            <CossUIEmptyAction>
              <CossUIButton onClick={handleAddModule}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Module
              </CossUIButton>
            </CossUIEmptyAction>
          </CossUIEmptyRoot>
        </div>

        <ModuleEditorModal
          courseId={courseId}
          module={editingModule}
          open={moduleEditorOpen}
          onOpenChange={setModuleEditorOpen}
          onSave={handleModuleSaved}
        />
      </>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <CossUIAccordion type="multiple" defaultValue={modules.map((m) => m.id)}>
            <div className="space-y-3">
              {modules.map((module, index) => (
                <SortableModuleItem
                  key={module.id}
                  module={module}
                  index={index}
                  courseId={courseId}
                  onEdit={handleEditModule}
                  onDelete={handleDeleteModule}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                  onDeleteLesson={handleDeleteLesson}
                  onLessonsReorder={handleLessonsReorder}
                  formatDuration={formatDuration}
                />
              ))}
            </div>
          </CossUIAccordion>
        </SortableContext>
      </DndContext>

      {/* Add Module Button */}
      <CossUIButton
        variant="outline"
        className="w-full mt-4 border-dashed"
        onClick={handleAddModule}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Module
      </CossUIButton>

      {/* Module Editor Modal */}
      <ModuleEditorModal
        courseId={courseId}
        module={editingModule}
        open={moduleEditorOpen}
        onOpenChange={setModuleEditorOpen}
        onSave={handleModuleSaved}
      />

      {/* Lesson Editor Modal */}
      {activeModuleId && (
        <LessonEditorModal
          courseId={courseId}
          moduleId={activeModuleId}
          lesson={editingLesson}
          open={lessonEditorOpen}
          onOpenChange={setLessonEditorOpen}
          onSave={handleLessonSaved}
        />
      )}
    </>
  );
}
