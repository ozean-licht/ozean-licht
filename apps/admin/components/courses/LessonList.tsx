'use client';

import { Lesson, LessonContentType } from '@/types/content';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CossUIBadge,
  CossUIButton,
  CossUIEmptyRoot,
  CossUIEmptyIcon,
  CossUIEmptyTitle,
  CossUIEmptyDescription,
  CossUIEmptyAction,
  CossUIFileIcon,
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
import {
  Video,
  FileText,
  FileQuestion,
  File,
  Clock,
  Eye,
  Star,
  Plus,
  MoreVertical,
  GripVertical,
  Edit,
  Trash2,
} from 'lucide-react';

interface LessonListProps {
  courseId: string;
  moduleId: string;
  lessons: Lesson[];
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
  onLessonsReorder: (lessonIds: string[]) => void;
}

// Icon mapping for lesson content types
const contentTypeIcons: Record<LessonContentType, typeof Video> = {
  video: Video,
  text: FileText,
  pdf: File,
  quiz: FileQuestion,
};

const contentTypeLabels: Record<LessonContentType, string> = {
  video: 'Video',
  text: 'Text',
  pdf: 'PDF',
  quiz: 'Quiz',
};

// Sortable Lesson Item
interface SortableLessonItemProps {
  lesson: Lesson;
  index: number;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

function SortableLessonItem({
  lesson,
  index,
  onEdit,
  onDelete,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const Icon = contentTypeIcons[lesson.contentType];

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds === 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    return `0:${secs.toString().padStart(2, '0')}`;
  };

  const duration = formatDuration(lesson.durationSeconds || lesson.video?.durationSeconds);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-accent/30 transition-colors group"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Lesson Number */}
      <div className="flex-shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
        {index + 1}
      </div>

      {/* Content Type Icon */}
      <div className="flex-shrink-0 p-1.5 rounded bg-primary/5">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{lesson.title}</span>
          {lesson.isPreview && (
            <CossUIBadge variant="outline" className="text-xs gap-1">
              <Eye className="h-3 w-3" />
              Preview
            </CossUIBadge>
          )}
          {lesson.isRequired && (
            <CossUIBadge variant="secondary" className="text-xs gap-1">
              <Star className="h-3 w-3" />
              Required
            </CossUIBadge>
          )}
        </div>
        {lesson.description && (
          <p className="text-sm text-muted-foreground truncate">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
        <CossUIBadge variant="outline" className="capitalize text-xs">
          {contentTypeLabels[lesson.contentType]}
        </CossUIBadge>

        {duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{duration}</span>
          </div>
        )}

        <CossUIBadge
          variant={lesson.status === 'published' ? 'default' : 'secondary'}
          className="capitalize text-xs"
        >
          {lesson.status}
        </CossUIBadge>
      </div>

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <CossUIMenu>
          <CossUIMenuTrigger>
            <CossUIButton variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </CossUIButton>
          </CossUIMenuTrigger>
          <CossUIMenuPopup>
            <CossUIMenuItem onClick={() => onEdit(lesson)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Lesson
            </CossUIMenuItem>
            <CossUIMenuSeparator />
            <CossUIAlertDialog>
              <CossUIAlertDialogTrigger>
                <CossUIMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Lesson
                </CossUIMenuItem>
              </CossUIAlertDialogTrigger>
              <CossUIAlertDialogContent>
                <CossUIAlertDialogHeader>
                  <CossUIAlertDialogTitle>Delete Lesson</CossUIAlertDialogTitle>
                  <CossUIAlertDialogDescription>
                    Are you sure you want to delete &ldquo;{lesson.title}&rdquo;? This action cannot be undone.
                  </CossUIAlertDialogDescription>
                </CossUIAlertDialogHeader>
                <CossUIAlertDialogFooter>
                  <CossUIAlertDialogCancel>Cancel</CossUIAlertDialogCancel>
                  <CossUIAlertDialogAction
                    onClick={() => onDelete(lesson)}
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
  );
}

export default function LessonList({
  courseId: _courseId,
  moduleId: _moduleId,
  lessons,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonsReorder,
}: LessonListProps) {
  // Silence unused variable warnings
  void _courseId;
  void _moduleId;

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

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((l) => l.id === active.id);
      const newIndex = lessons.findIndex((l) => l.id === over.id);

      const newLessons = arrayMove(lessons, oldIndex, newIndex);
      onLessonsReorder(newLessons.map((l) => l.id));
    }
  };

  if (lessons.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-6 bg-background/50">
        <CossUIEmptyRoot className="text-center">
          <CossUIEmptyIcon>
            <CossUIFileIcon className="w-10 h-10 text-muted-foreground" />
          </CossUIEmptyIcon>
          <CossUIEmptyTitle className="text-base">No lessons yet</CossUIEmptyTitle>
          <CossUIEmptyDescription className="text-sm">
            Add lessons to this module to build your course content.
          </CossUIEmptyDescription>
          <CossUIEmptyAction>
            <CossUIButton size="sm" onClick={onAddLesson}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </CossUIButton>
          </CossUIEmptyAction>
        </CossUIEmptyRoot>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lessons.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {lessons.map((lesson, index) => (
            <SortableLessonItem
              key={lesson.id}
              lesson={lesson}
              index={index}
              onEdit={onEditLesson}
              onDelete={onDeleteLesson}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Lesson Button */}
      <CossUIButton
        variant="outline"
        className="w-full border-dashed"
        onClick={onAddLesson}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Lesson
      </CossUIButton>
    </div>
  );
}
