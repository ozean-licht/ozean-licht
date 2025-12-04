'use client';

/**
 * VideoForm Component
 *
 * Comprehensive form for creating and editing videos in the Video Management System.
 * Supports both create and edit modes with full validation and error handling.
 *
 * Features:
 * - Zod validation with react-hook-form
 * - Tag management (comma-separated input)
 * - Pipeline stage and visibility controls
 * - Course and module association
 * - Loading states and error display
 * - Dark theme compatible styling
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

// Types and validation
import type {
  Video,
  CreateVideoInput,
  UpdateVideoInput,
  VideoVisibility,
  VideoPipelineStage,
} from '@/types/video';
import { PIPELINE_STAGES } from '@/types/video';
import {
  createVideoSchema,
  updateVideoSchema,
} from '@/lib/validations/video';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Video Components
import CourseVideoAssignment from './CourseVideoAssignment';

// Icons
import { Loader2, Save } from 'lucide-react';

// ================================================================
// Types & Interfaces
// ================================================================

interface VideoFormProps {
  video?: Video;
  onSubmit: (data: CreateVideoInput | UpdateVideoInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  tags: string; // Comma-separated string for simplicity
  visibility: VideoVisibility;
  pipelineStage: VideoPipelineStage;
  thumbnailUrl: string;
  masterFileUrl: string;
  durationSeconds: string;
  courseId: string;
  moduleId: string;
  sortOrder: string;
}

// ================================================================
// Constants
// ================================================================

const VISIBILITY_OPTIONS: Array<{ value: VideoVisibility; label: string }> = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' },
  { value: 'paid', label: 'Paid' },
];

// ================================================================
// Component
// ================================================================

export default function VideoForm({
  video,
  onSubmit,
  onCancel,
  isLoading = false,
}: VideoFormProps) {
  // Determine if we're in edit mode
  const isEditMode = !!video;

  // Initialize form with react-hook-form (without Zod resolver for simplicity)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      title: video?.title || '',
      description: video?.description || '',
      tags: video?.tags?.join(', ') || '',
      visibility: video?.visibility || 'private',
      pipelineStage: video?.pipelineStage || 'draft',
      thumbnailUrl: video?.thumbnailUrl || '',
      masterFileUrl: video?.masterFileUrl || '',
      durationSeconds: video?.durationSeconds?.toString() || '',
      courseId: video?.courseId || '',
      moduleId: video?.moduleId || '',
      sortOrder: video?.sortOrder?.toString() || '0',
    },
  });

  // Reset form when video prop changes (for edit mode)
  useEffect(() => {
    if (video) {
      reset({
        title: video.title || '',
        description: video.description || '',
        tags: video.tags?.join(', ') || '',
        visibility: video.visibility || 'private',
        pipelineStage: video.pipelineStage || 'draft',
        thumbnailUrl: video.thumbnailUrl || '',
        masterFileUrl: video.masterFileUrl || '',
        durationSeconds: video.durationSeconds?.toString() || '',
        courseId: video.courseId || '',
        moduleId: video.moduleId || '',
        sortOrder: video.sortOrder?.toString() || '0',
      });
    }
  }, [video, reset]);

  // ================================================================
  // Form Submission Handler
  // ================================================================

  const onFormSubmit = async (formData: FormData) => {
    // Convert form data to proper types
    const submitData: CreateVideoInput | UpdateVideoInput = {
      title: formData.title,
      description: formData.description || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      visibility: formData.visibility,
      pipelineStage: formData.pipelineStage,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      masterFileUrl: formData.masterFileUrl || undefined,
      durationSeconds: formData.durationSeconds
        ? parseInt(formData.durationSeconds, 10)
        : undefined,
      courseId: formData.courseId || undefined,
      moduleId: formData.moduleId || undefined,
      sortOrder: formData.sortOrder
        ? parseInt(formData.sortOrder, 10)
        : 0,
    };

    // Validate with Zod
    const schema = isEditMode ? updateVideoSchema : createVideoSchema;
    const result = schema.safeParse(submitData);

    if (!result.success) {
      // Set field errors from Zod validation
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormData;
        if (field) {
          setError(field, { message: error.message });
        }
      });
      return;
    }

    await onSubmit(submitData);
  };

  // ================================================================
  // Render
  // ================================================================

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium text-sm text-white">
          Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter video title..."
          disabled={isLoading}
          className="bg-card border-primary/20 text-white placeholder:text-gray-400"
        />
        {errors.title && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium text-sm text-white">
          Description
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter video description..."
          rows={4}
          disabled={isLoading}
          className="bg-card border-primary/20 text-white placeholder:text-gray-400 resize-none"
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="font-medium text-sm text-white">
          Tags
        </Label>
        <Input
          id="tags"
          {...register('tags')}
          placeholder="Enter tags separated by commas (e.g., meditation, healing)"
          disabled={isLoading}
          className="bg-card border-primary/20 text-white placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-400">
          Separate multiple tags with commas
        </p>
        {errors.tags && (
          <p className="text-sm text-red-400">{errors.tags.message}</p>
        )}
      </div>

      {/* Visibility and Pipeline Stage Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Visibility Field */}
        <div className="space-y-2">
          <Label htmlFor="visibility" className="font-medium text-sm text-white">
            Visibility
          </Label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="visibility"
                  className="bg-card border-primary/20 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.visibility && (
            <p className="text-sm text-red-400">{errors.visibility.message}</p>
          )}
        </div>

        {/* Pipeline Stage Field */}
        <div className="space-y-2">
          <Label htmlFor="pipelineStage" className="font-medium text-sm text-white">
            Pipeline Stage
          </Label>
          <Controller
            name="pipelineStage"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="pipelineStage"
                  className="bg-card border-primary/20 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.pipelineStage && (
            <p className="text-sm text-red-400">{errors.pipelineStage.message}</p>
          )}
        </div>
      </div>

      {/* Thumbnail URL Field */}
      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl" className="font-medium text-sm text-white">
          Thumbnail URL
        </Label>
        <Input
          id="thumbnailUrl"
          {...register('thumbnailUrl')}
          placeholder="https://example.com/thumbnail.jpg"
          disabled={isLoading}
          className="bg-card border-primary/20 text-white placeholder:text-gray-400"
        />
        {errors.thumbnailUrl && (
          <p className="text-sm text-red-400">{errors.thumbnailUrl.message}</p>
        )}
      </div>

      {/* Master File URL Field */}
      <div className="space-y-2">
        <Label htmlFor="masterFileUrl" className="font-medium text-sm text-white">
          Master File URL
        </Label>
        <Input
          id="masterFileUrl"
          {...register('masterFileUrl')}
          placeholder="https://example.com/master-file.mp4"
          disabled={isLoading}
          className="bg-card border-primary/20 text-white placeholder:text-gray-400"
        />
        {errors.masterFileUrl && (
          <p className="text-sm text-red-400">{errors.masterFileUrl.message}</p>
        )}
      </div>

      {/* Duration and Sort Order Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration Field */}
        <div className="space-y-2">
          <Label htmlFor="durationSeconds" className="font-medium text-sm text-white">
            Duration (seconds)
          </Label>
          <Input
            id="durationSeconds"
            type="number"
            min="0"
            {...register('durationSeconds')}
            placeholder="0"
            disabled={isLoading}
            className="bg-card border-primary/20 text-white placeholder:text-gray-400"
          />
          {errors.durationSeconds && (
            <p className="text-sm text-red-400">{errors.durationSeconds.message}</p>
          )}
        </div>

        {/* Sort Order Field */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder" className="font-medium text-sm text-white">
            Sort Order
          </Label>
          <Input
            id="sortOrder"
            type="number"
            min="0"
            {...register('sortOrder')}
            placeholder="0"
            disabled={isLoading}
            className="bg-card border-primary/20 text-white placeholder:text-gray-400"
          />
          {errors.sortOrder && (
            <p className="text-sm text-red-400">{errors.sortOrder.message}</p>
          )}
        </div>
      </div>

      {/* Course Assignment */}
      <Controller
        name="courseId"
        control={control}
        render={({ field: courseField }) => (
          <Controller
            name="moduleId"
            control={control}
            render={({ field: moduleField }) => (
              <CourseVideoAssignment
                videoId={video?.id}
                courseId={courseField.value || null}
                moduleId={moduleField.value || null}
                onChange={({ courseId, moduleId }) => {
                  courseField.onChange(courseId || '');
                  moduleField.onChange(moduleId || '');
                }}
                disabled={isLoading}
              />
            )}
          />
        )}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-primary/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update Video' : 'Create Video'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
