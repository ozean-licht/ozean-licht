'use client';

import { useState, useEffect } from 'react';
import {
  Lesson,
  CreateLessonInput,
  UpdateLessonInput,
  LessonContentType,
  LessonStatus,
  Video,
} from '@/types/content';
import {
  CossUIDialog,
  CossUIDialogTrigger,
  CossUIDialogPopup,
  CossUIDialogHeader,
  CossUIDialogFooter,
  CossUIDialogTitle,
  CossUIDialogDescription,
  CossUIDialogClose,
  CossUIButton,
  CossUIInput,
  CossUITextarea,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUICheckbox,
  CossUISpinner,
  CossUITabs,
  CossUITabsList,
  CossUITabsTab,
  CossUITabsPanel,
  CossUILabel,
} from '@shared/ui';
import { Video as VideoIcon, FileText, File, HelpCircle } from 'lucide-react';
import VideoPicker from './VideoPicker';

interface LessonEditorModalProps {
  /** Course ID (for API routing) */
  courseId: string;
  /** Module ID for creating new lessons */
  moduleId: string;
  /** Lesson to edit (if editing) */
  lesson?: Lesson | null;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when lesson is saved */
  onSave: (lesson: Lesson) => void;
  /** Trigger element (optional) */
  trigger?: React.ReactNode;
}

interface FormErrors {
  title?: string;
  contentType?: string;
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
}

const contentTypeIcons: Record<LessonContentType, typeof VideoIcon> = {
  video: VideoIcon,
  text: FileText,
  pdf: File,
  quiz: HelpCircle,
};

const contentTypeLabels: Record<LessonContentType, string> = {
  video: 'Video',
  text: 'Text',
  pdf: 'PDF',
  quiz: 'Quiz',
};

export default function LessonEditorModal({
  courseId,
  moduleId,
  lesson,
  open,
  onOpenChange,
  onSave,
  trigger,
}: LessonEditorModalProps) {
  const isEditing = !!lesson;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<LessonContentType>('video');
  const [videoId, setVideoId] = useState<string | undefined>();
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>();
  const [contentText, setContentText] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>();
  const [isRequired, setIsRequired] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState<LessonStatus>('draft');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or lesson changes
  useEffect(() => {
    if (open) {
      if (lesson) {
        setTitle(lesson.title);
        setDescription(lesson.description || '');
        setContentType(lesson.contentType);
        setVideoId(lesson.videoId);
        setSelectedVideo(lesson.video);
        setContentText(lesson.contentText || '');
        setContentUrl(lesson.contentUrl || '');
        setDurationSeconds(lesson.durationSeconds);
        setIsRequired(lesson.isRequired);
        setIsPreview(lesson.isPreview);
        setStatus(lesson.status);
      } else {
        setTitle('');
        setDescription('');
        setContentType('video');
        setVideoId(undefined);
        setSelectedVideo(undefined);
        setContentText('');
        setContentUrl('');
        setDurationSeconds(undefined);
        setIsRequired(false);
        setIsPreview(false);
        setStatus('draft');
      }
      setErrors({});
    }
  }, [open, lesson]);

  // Update duration when video is selected
  useEffect(() => {
    if (contentType === 'video' && selectedVideo?.durationSeconds) {
      setDurationSeconds(selectedVideo.durationSeconds);
    }
  }, [contentType, selectedVideo]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (contentType === 'video' && !videoId) {
      newErrors.videoId = 'Please select a video';
    }

    if (contentType === 'text' && !contentText.trim()) {
      newErrors.contentText = 'Content is required for text lessons';
    }

    if (contentType === 'pdf' && !contentUrl.trim()) {
      newErrors.contentUrl = 'PDF URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle video selection
  const handleVideoChange = (id: string | undefined, video?: Video) => {
    setVideoId(id);
    setSelectedVideo(video);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/lessons/${lesson!.id}`
        : `/api/courses/${courseId}/modules/${moduleId}/lessons`;

      const method = isEditing ? 'PATCH' : 'POST';

      const body: CreateLessonInput | UpdateLessonInput = {
        ...(isEditing ? {} : { moduleId }),
        title,
        description: description || undefined,
        contentType,
        videoId: contentType === 'video' ? videoId : undefined,
        contentText: contentType === 'text' ? contentText : undefined,
        contentUrl: contentType === 'pdf' ? contentUrl : undefined,
        durationSeconds,
        isRequired,
        isPreview,
        status,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} lesson`);
      }

      const savedLesson = await response.json();
      onSave(savedLesson);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save lesson:', error);
      setErrors({
        title: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <CossUIDialogTrigger render={<>{trigger}</>} />}
      <CossUIDialogPopup className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <CossUIDialogHeader>
            <CossUIDialogTitle>
              {isEditing ? 'Edit Lesson' : 'Add Lesson'}
            </CossUIDialogTitle>
            <CossUIDialogDescription>
              {isEditing
                ? 'Update the lesson details below.'
                : 'Create a new lesson for this module.'}
            </CossUIDialogDescription>
          </CossUIDialogHeader>

          <div className="space-y-4 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </CossUILabel>
              <CossUIInput
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g., Getting Started with Breathing"
                className={errors.title ? 'border-destructive' : ''}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Description
              </CossUILabel>
              <CossUITextarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="A brief description of this lesson..."
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            {/* Content Type Tabs */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Content Type
              </CossUILabel>
              <CossUITabs
                value={contentType}
                onValueChange={(value: string) => setContentType(value as LessonContentType)}
              >
                <CossUITabsList className="grid grid-cols-4 w-full">
                  {(['video', 'text', 'pdf', 'quiz'] as LessonContentType[]).map((type) => {
                    const Icon = contentTypeIcons[type];
                    return (
                      <CossUITabsTab
                        key={type}
                        value={type}
                        className="flex items-center gap-2"
                        disabled={type === 'quiz' || isSubmitting}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{contentTypeLabels[type]}</span>
                      </CossUITabsTab>
                    );
                  })}
                </CossUITabsList>

                {/* Video Content */}
                <CossUITabsPanel value="video" className="pt-4">
                  <div className="space-y-2">
                    <CossUILabel className="text-sm font-medium">
                      Select Video <span className="text-destructive">*</span>
                    </CossUILabel>
                    <VideoPicker
                      value={videoId}
                      onChange={handleVideoChange}
                      disabled={isSubmitting}
                    />
                    {errors.videoId && (
                      <p className="text-sm text-destructive">{errors.videoId}</p>
                    )}
                  </div>
                </CossUITabsPanel>

                {/* Text Content */}
                <CossUITabsPanel value="text" className="pt-4">
                  <div className="space-y-2">
                    <CossUILabel className="text-sm font-medium">
                      Content <span className="text-destructive">*</span>
                    </CossUILabel>
                    <p className="text-xs text-muted-foreground">
                      Supports Markdown formatting
                    </p>
                    <CossUITextarea
                      value={contentText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContentText(e.target.value)}
                      placeholder="Write your lesson content here... (Markdown supported)"
                      rows={8}
                      className={`font-mono text-sm ${errors.contentText ? 'border-destructive' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.contentText && (
                      <p className="text-sm text-destructive">{errors.contentText}</p>
                    )}
                  </div>
                </CossUITabsPanel>

                {/* PDF Content */}
                <CossUITabsPanel value="pdf" className="pt-4">
                  <div className="space-y-2">
                    <CossUILabel className="text-sm font-medium">
                      PDF URL <span className="text-destructive">*</span>
                    </CossUILabel>
                    <p className="text-xs text-muted-foreground">
                      Enter the URL to your PDF file
                    </p>
                    <CossUIInput
                      value={contentUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentUrl(e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      type="url"
                      className={errors.contentUrl ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.contentUrl && (
                      <p className="text-sm text-destructive">{errors.contentUrl}</p>
                    )}
                  </div>
                </CossUITabsPanel>

                {/* Quiz Content (Coming Soon) */}
                <CossUITabsPanel value="quiz" className="pt-4">
                  <div className="p-6 text-center bg-muted/50 rounded-lg">
                    <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Quiz builder coming soon!
                    </p>
                  </div>
                </CossUITabsPanel>
              </CossUITabs>
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <CossUILabel className="text-sm font-medium">
                  Duration (seconds)
                </CossUILabel>
                <CossUIInput
                  type="number"
                  value={durationSeconds ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDurationSeconds(e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  placeholder="e.g., 300"
                  min={0}
                  disabled={isSubmitting}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <CossUILabel className="text-sm font-medium">
                  Status
                </CossUILabel>
                <CossUISelect
                  value={status}
                  onValueChange={(value: string) => setStatus(value as LessonStatus)}
                  disabled={isSubmitting}
                >
                  <CossUISelectTrigger className="w-full">
                    <CossUISelectValue placeholder="Select status" />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    <CossUISelectItem value="draft">Draft</CossUISelectItem>
                    <CossUISelectItem value="published">Published</CossUISelectItem>
                  </CossUISelectPopup>
                </CossUISelect>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <CossUICheckbox
                  checked={isRequired}
                  onCheckedChange={(checked: boolean | 'indeterminate') => setIsRequired(checked === true)}
                  disabled={isSubmitting}
                />
                <span className="text-sm">Required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <CossUICheckbox
                  checked={isPreview}
                  onCheckedChange={(checked: boolean | 'indeterminate') => setIsPreview(checked === true)}
                  disabled={isSubmitting}
                />
                <span className="text-sm">Free Preview</span>
              </label>
            </div>
          </div>

          <CossUIDialogFooter className="gap-2">
            <CossUIDialogClose>
              <CossUIButton
                type="button"
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </CossUIButton>
            </CossUIDialogClose>
            <CossUIButton type="submit" disabled={isSubmitting}>
              {isSubmitting && <CossUISpinner className="mr-2 h-4 w-4" />}
              {isEditing ? 'Save Changes' : 'Create Lesson'}
            </CossUIButton>
          </CossUIDialogFooter>
        </form>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
