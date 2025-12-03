'use client';

import { useState, useEffect } from 'react';
import { Lesson, UpdateLessonInput } from '@/types/content';
import {
  CossUIButton,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUICheckbox,
  CossUIInput,
  CossUILabel,
  CossUIBadge,
} from '@shared/ui';
import { Video, FileText, FileUp, HelpCircle, Music, ChevronRight, Link2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';
// Import content editors
import VideoPicker from '../VideoPicker';
import RichTextEditor from '../RichTextEditor';
import PdfUploader from '../PdfUploader';
import AudioUploader from '../AudioUploader';
// Import prerequisite and drip components
import PrerequisiteSelector, { Prerequisite } from '../PrerequisiteSelector';
import DripScheduler, { DripScheduleValue } from '../DripScheduler';

interface LessonContentAccordionProps {
  lesson: Lesson;
  courseId: string;
  onUpdate: (updates: Partial<UpdateLessonInput>) => Promise<void>;
  disabled?: boolean;
}

type LessonContentType = 'video' | 'text' | 'pdf' | 'quiz' | 'audio';

const CONTENT_TYPES: { value: LessonContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
  { value: 'text', label: 'Text', icon: <FileText className="h-4 w-4" /> },
  { value: 'pdf', label: 'PDF', icon: <FileUp className="h-4 w-4" /> },
  { value: 'quiz', label: 'Quiz', icon: <HelpCircle className="h-4 w-4" /> },
  { value: 'audio', label: 'Audio', icon: <Music className="h-4 w-4" /> },
];

export function LessonContentAccordion({
  lesson,
  courseId,
  onUpdate,
  disabled = false,
}: LessonContentAccordionProps) {
  // Local state for debounced text fields
  const [localContentText, setLocalContentText] = useState(lesson.contentText || '');
  const [localDuration, setLocalDuration] = useState(lesson.durationSeconds?.toString() || '');

  // Collapsible section states
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [showDrip, setShowDrip] = useState(false);

  // Local state for prerequisites and drip (fetched from lesson or defaults)
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [dripSchedule, setDripSchedule] = useState<DripScheduleValue | null>(null);

  // Update local state when lesson changes externally
  useEffect(() => {
    setLocalContentText(lesson.contentText || '');
  }, [lesson.contentText]);

  useEffect(() => {
    setLocalDuration(lesson.durationSeconds?.toString() || '');
  }, [lesson.durationSeconds]);

  // Debounce values
  const debouncedContentText = useDebounce(localContentText, 300);
  const debouncedDuration = useDebounce(localDuration, 300);

  // Save debounced content text
  useEffect(() => {
    let isMounted = true;

    if (debouncedContentText !== lesson.contentText && lesson.contentType === 'text') {
      onUpdate({ contentText: debouncedContentText }).catch((error) => {
        if (isMounted) {
          console.error('Failed to update content text:', error);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedContentText, lesson.contentText, lesson.contentType, onUpdate]);

  // Save debounced duration
  useEffect(() => {
    let isMounted = true;

    const parsedDuration = parseInt(debouncedDuration, 10);
    if (!isNaN(parsedDuration) && parsedDuration !== lesson.durationSeconds) {
      onUpdate({ durationSeconds: parsedDuration }).catch((error) => {
        if (isMounted) {
          console.error('Failed to update duration:', error);
        }
      });
    } else if (debouncedDuration === '' && lesson.durationSeconds !== undefined) {
      onUpdate({ durationSeconds: undefined }).catch((error) => {
        if (isMounted) {
          console.error('Failed to update duration:', error);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedDuration, lesson.durationSeconds, onUpdate]);

  // Handlers
  const handleContentTypeChange = async (type: LessonContentType) => {
    await onUpdate({ contentType: type });
  };

  const handleVideoSelect = async (videoId: string | undefined, video?: { durationSeconds?: number }) => {
    await onUpdate({
      videoId,
      durationSeconds: video?.durationSeconds,
    });
  };

  const handlePdfChange = async (url: string) => {
    await onUpdate({ contentUrl: url });
  };

  const handleAudioChange = async (url: string, mimeType?: string, duration?: number) => {
    await onUpdate({
      audioUrl: url,
      audioMimeType: mimeType,
      durationSeconds: duration,
    });
  };

  const handleStatusChange = async (status: 'draft' | 'published') => {
    await onUpdate({ status });
  };

  const handleRequiredChange = async (checked: boolean | 'indeterminate') => {
    await onUpdate({ isRequired: !!checked });
  };

  const handlePreviewChange = async (checked: boolean | 'indeterminate') => {
    await onUpdate({ isPreview: !!checked });
  };

  // Keyboard navigation for content type buttons
  const handleContentTypeKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + CONTENT_TYPES.length) % CONTENT_TYPES.length;
      const nextButton = document.querySelector(
        `[data-content-type-index="${nextIndex}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContentTypeChange(CONTENT_TYPES[currentIndex].value);
    }
  };

  return (
    <div
      className={cn(
        'ml-8 border-l-2 border-primary/30 pl-4 py-3 space-y-4',
        'bg-card/20 rounded-r-md',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Content Type Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Type:</span>
        <div className="flex gap-1 flex-wrap" role="radiogroup" aria-label="Content Type">
          {CONTENT_TYPES.map((type, index) => (
            <CossUIButton
              key={type.value}
              variant={lesson.contentType === type.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleContentTypeChange(type.value)}
              onKeyDown={(e) => handleContentTypeKeyDown(e, index)}
              disabled={disabled}
              className="gap-1.5"
              role="radio"
              aria-checked={lesson.contentType === type.value}
              aria-label={`${type.label} content type`}
              tabIndex={lesson.contentType === type.value ? 0 : -1}
              data-content-type-index={index}
            >
              {type.icon}
              <span>{type.label}</span>
            </CossUIButton>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <div className="min-h-[200px]">
        {lesson.contentType === 'video' && (
          <VideoPicker
            value={lesson.videoId}
            onChange={handleVideoSelect}
            disabled={disabled}
          />
        )}
        {lesson.contentType === 'text' && (
          <RichTextEditor
            value={localContentText}
            onChange={setLocalContentText}
            disabled={disabled}
            placeholder="Write your lesson content here..."
          />
        )}
        {lesson.contentType === 'pdf' && (
          <PdfUploader
            value={lesson.contentUrl || ''}
            onChange={handlePdfChange}
            disabled={disabled}
          />
        )}
        {lesson.contentType === 'audio' && (
          <AudioUploader
            value={lesson.audioUrl || ''}
            mimeType={lesson.audioMimeType}
            onChange={handleAudioChange}
            disabled={disabled}
          />
        )}
        {lesson.contentType === 'quiz' && (
          <div className="p-8 border border-dashed border-border/50 rounded-md text-center text-muted-foreground bg-card/10">
            <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm font-medium">Quiz editing coming soon</p>
            <p className="text-xs mt-1">Use the lesson modal for quiz editing</p>
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-6 pt-2 border-t border-border/50 flex-wrap">
        {/* Status */}
        <div className="flex items-center gap-2">
          <CossUILabel className="text-sm text-muted-foreground whitespace-nowrap">
            Status:
          </CossUILabel>
          <CossUISelect
            value={lesson.status}
            onValueChange={(v) => handleStatusChange(v as 'draft' | 'published')}
            disabled={disabled}
          >
            <CossUISelectTrigger className="w-[120px] h-8 text-xs">
              <CossUISelectValue />
            </CossUISelectTrigger>
            <CossUISelectPopup>
              <CossUISelectItem value="draft">
                <div className="flex items-center gap-2">
                  <span>Draft</span>
                </div>
              </CossUISelectItem>
              <CossUISelectItem value="published">
                <div className="flex items-center gap-2">
                  <span>Published</span>
                </div>
              </CossUISelectItem>
            </CossUISelectPopup>
          </CossUISelect>
        </div>

        {/* Required */}
        <label className="flex items-center gap-2 cursor-pointer">
          <CossUICheckbox
            checked={lesson.isRequired}
            onCheckedChange={handleRequiredChange}
            disabled={disabled}
          />
          <span className="text-sm">Required</span>
        </label>

        {/* Preview */}
        <label className="flex items-center gap-2 cursor-pointer">
          <CossUICheckbox
            checked={lesson.isPreview}
            onCheckedChange={handlePreviewChange}
            disabled={disabled}
          />
          <span className="text-sm">Free Preview</span>
        </label>

        {/* Duration (manual override) */}
        <div className="flex items-center gap-2">
          <CossUILabel className="text-sm text-muted-foreground whitespace-nowrap">
            Duration (sec):
          </CossUILabel>
          <CossUIInput
            type="number"
            value={localDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalDuration(e.target.value)}
            placeholder="Auto"
            disabled={disabled}
            className="w-[100px] h-8 text-xs"
            min="0"
          />
        </div>
      </div>

      {/* Prerequisites Section - Collapsible */}
      <div className="pt-2 border-t border-border/50">
        <button
          onClick={() => setShowPrerequisites(!showPrerequisites)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          type="button"
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              showPrerequisites && 'rotate-90'
            )}
          />
          <Link2 className="h-4 w-4" />
          <span>Prerequisites</span>
          {prerequisites.length > 0 && (
            <CossUIBadge variant="secondary" className="text-xs ml-1">
              {prerequisites.length}
            </CossUIBadge>
          )}
        </button>

        {showPrerequisites && courseId && (
          <div className="mt-3 ml-6 p-3 bg-card/30 rounded-lg border border-border/30">
            <PrerequisiteSelector
              courseId={courseId}
              lessonId={lesson.id}
              value={prerequisites}
              onChange={(newPrereqs) => {
                setPrerequisites(newPrereqs);
                // TODO: Save prerequisites to API
                // This would require an API endpoint to update lesson prerequisites
              }}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Drip Schedule Section - Collapsible */}
      <div className="pt-2 border-t border-border/50">
        <button
          onClick={() => setShowDrip(!showDrip)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          type="button"
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              showDrip && 'rotate-90'
            )}
          />
          <Clock className="h-4 w-4" />
          <span>Drip Schedule</span>
          {dripSchedule?.isActive && (
            <CossUIBadge variant="secondary" className="text-xs ml-1">
              Active
            </CossUIBadge>
          )}
        </button>

        {showDrip && courseId && (
          <div className="mt-3 ml-6">
            <DripScheduler
              courseId={courseId}
              lessonId={lesson.id}
              value={dripSchedule}
              onChange={(newSchedule) => {
                setDripSchedule(newSchedule);
                // TODO: Save drip schedule to API
                // This would require an API endpoint to update lesson drip schedule
              }}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
