'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Module, ModuleStatus } from '@/types/content';
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
  CossUILabel,
  CossUISpinner,
} from '@shared/ui';
import {
  createModuleSchema,
  updateModuleSchema,
  extractZodErrors,
} from '@/lib/validations/course-builder';
import { z } from 'zod';

interface ModuleEditorModalProps {
  /** Course ID for creating new modules */
  courseId: string;
  /** Module to edit (if editing) */
  module?: Module | null;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when module is saved */
  onSave: (module: Module) => void;
  /** Trigger element (optional) */
  trigger?: React.ReactNode;
}

interface FormErrors {
  title?: string;
  description?: string;
  status?: string;
  courseId?: string;
}

export default function ModuleEditorModal({
  courseId,
  module,
  open,
  onOpenChange,
  onSave,
  trigger,
}: ModuleEditorModalProps) {
  const isEditing = !!module;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ModuleStatus>('draft');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or module changes
  useEffect(() => {
    if (open) {
      if (module) {
        setTitle(module.title);
        setDescription(module.description || '');
        setStatus(module.status);
      } else {
        setTitle('');
        setDescription('');
        setStatus('draft');
      }
      setErrors({});
    }
  }, [open, module]);

  // Validate form using Zod
  const validate = (): boolean => {
    try {
      const schema = isEditing ? updateModuleSchema : createModuleSchema;
      const data = isEditing
        ? { title, description: description || undefined, status }
        : { courseId, title, description: description || undefined, status };

      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(extractZodErrors(error));
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/courses/${courseId}/modules/${module!.id}`
        : `/api/courses/${courseId}/modules`;

      const method = isEditing ? 'PATCH' : 'POST';

      const body = isEditing
        ? { title, description: description || undefined, status }
        : { courseId, title, description: description || undefined, status };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} module`);
      }

      const savedModule = await response.json();
      onSave(savedModule);
      onOpenChange(false);

      // Show success toast
      toast.success(isEditing ? 'Module updated' : 'Module created', {
        description: `"${savedModule.title}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to save module:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      // Show error toast
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} module`, {
        description: errorMessage,
      });

      setErrors({
        title: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <CossUIDialogTrigger render={<>{trigger}</>} />}
      <CossUIDialogPopup className="max-w-md">
        <form onSubmit={handleSubmit}>
          <CossUIDialogHeader>
            <CossUIDialogTitle>
              {isEditing ? 'Edit Module' : 'Add Module'}
            </CossUIDialogTitle>
            <CossUIDialogDescription>
              {isEditing
                ? 'Update the module details below.'
                : 'Create a new module for this course. Modules are sections that contain lessons.'}
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
                placeholder="e.g., Introduction to Meditation"
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
                placeholder="A brief description of what this module covers..."
                rows={3}
                className={errors.description ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <CossUILabel className="text-sm font-medium">
                Status
              </CossUILabel>
              <CossUISelect
                value={status}
                onValueChange={(value: string) => setStatus(value as ModuleStatus)}
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
              {isEditing ? 'Save Changes' : 'Create Module'}
            </CossUIButton>
          </CossUIDialogFooter>
        </form>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
