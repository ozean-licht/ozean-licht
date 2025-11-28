'use client';

import { Lesson, LessonContentType } from '@/types/content';
import {
  CossUIBadge,
  CossUIButton,
  CossUIEmptyRoot,
  CossUIEmptyIcon,
  CossUIEmptyTitle,
  CossUIEmptyDescription,
  CossUIEmptyAction,
  CossUIFileIcon,
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
} from 'lucide-react';

interface LessonListProps {
  lessons: Lesson[];
  /** Module ID for adding lessons (Phase 3) */
  moduleId: string;
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

export default function LessonList({ lessons, moduleId: _moduleId }: LessonListProps) {
  // moduleId will be used in Phase 3 for add lesson functionality
  void _moduleId;
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
            <CossUIButton size="sm" disabled title="Coming in Phase 3">
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
      {lessons.map((lesson, index) => {
        const Icon = contentTypeIcons[lesson.contentType];
        const duration = formatDuration(lesson.durationSeconds || lesson.video?.durationSeconds);

        return (
          <div
            key={lesson.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-accent/30 transition-colors group"
          >
            {/* Drag Handle (disabled for now) */}
            <div className="flex-shrink-0 text-muted-foreground/30 cursor-not-allowed">
              <GripVertical className="h-4 w-4" />
            </div>

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

            {/* Actions (disabled for now) */}
            <CossUIButton
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              disabled
              title="Coming in Phase 3"
            >
              <MoreVertical className="h-4 w-4" />
            </CossUIButton>
          </div>
        );
      })}

      {/* Add Lesson Button */}
      <CossUIButton
        variant="outline"
        className="w-full border-dashed"
        disabled
        title="Coming in Phase 3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Lesson
      </CossUIButton>
    </div>
  );
}
