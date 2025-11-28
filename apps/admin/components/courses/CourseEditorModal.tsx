'use client';

import { useState, useEffect } from 'react';
import { Course, CourseStatus, CourseLevel, ContentEntityScope } from '@/types/content';
import {
  CossUIDialog,
  CossUIDialogPopup,
  CossUIDialogHeader,
  CossUIDialogTitle,
  CossUIDialogDescription,
  CossUIDialogFooter,
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUITextarea,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
  CossUITabs,
  CossUITabsList,
  CossUITabsTab,
  CossUITabsPanel,
  CossUISpinner,
} from '@shared/ui';
import { Save } from 'lucide-react';
import { safeValidateCourseEditor, extractZodErrors } from '@/lib/validations/course-builder';
import ImageUploader from './ImageUploader';

interface CourseEditorModalProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Course) => void;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  priceCents: number;
  currency: string;
  status: CourseStatus;
  level: CourseLevel | '';
  category: string;
  entityScope: ContentEntityScope | '';
  instructorId: string;
}

export default function CourseEditorModal({
  course,
  open,
  onOpenChange,
  onSave,
}: CourseEditorModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    thumbnailUrl: '',
    coverImageUrl: '',
    priceCents: 0,
    currency: 'EUR',
    status: 'draft',
    level: '',
    category: '',
    entityScope: '',
    instructorId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Reset form when course changes or modal opens
  useEffect(() => {
    if (open && course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        thumbnailUrl: course.thumbnailUrl || '',
        coverImageUrl: course.coverImageUrl || '',
        priceCents: course.priceCents || 0,
        currency: course.currency || 'EUR',
        status: course.status || 'draft',
        level: course.level || '',
        category: course.category || '',
        entityScope: course.entityScope || '',
        instructorId: course.instructorId || '',
      });
      setErrors({});
      setActiveTab('basic');
    }
  }, [open, course]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    handleChange('slug', slug);
  };

  const handleSubmit = async () => {
    // Build update payload - only include changed fields
    const updatePayload: Record<string, unknown> = {};

    if (formData.title !== course.title) updatePayload.title = formData.title;
    if (formData.slug !== course.slug) updatePayload.slug = formData.slug;
    if (formData.description !== (course.description || '')) {
      updatePayload.description = formData.description || null;
    }
    if (formData.shortDescription !== (course.shortDescription || '')) {
      updatePayload.shortDescription = formData.shortDescription || null;
    }
    if (formData.thumbnailUrl !== (course.thumbnailUrl || '')) {
      updatePayload.thumbnailUrl = formData.thumbnailUrl || null;
    }
    if (formData.coverImageUrl !== (course.coverImageUrl || '')) {
      updatePayload.coverImageUrl = formData.coverImageUrl || null;
    }
    if (formData.priceCents !== course.priceCents) {
      updatePayload.priceCents = formData.priceCents;
    }
    if (formData.currency !== course.currency) {
      updatePayload.currency = formData.currency;
    }
    if (formData.status !== course.status) {
      updatePayload.status = formData.status;
    }
    if (formData.level !== (course.level || '')) {
      updatePayload.level = formData.level || null;
    }
    if (formData.category !== (course.category || '')) {
      updatePayload.category = formData.category || null;
    }
    if (formData.entityScope !== (course.entityScope || '')) {
      updatePayload.entityScope = formData.entityScope || null;
    }
    if (formData.instructorId !== (course.instructorId || '')) {
      updatePayload.instructorId = formData.instructorId || null;
    }

    // Always validate title even if unchanged
    const validationData = { ...updatePayload, title: formData.title };

    // Validate with Zod
    const result = safeValidateCourseEditor(validationData);
    if (!result.success) {
      setErrors(extractZodErrors(result.error));
      return;
    }

    if (Object.keys(updatePayload).length === 0) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((d: { field: string; message: string }) => {
            fieldErrors[d.field] = d.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ _form: data.error || 'Failed to update course' });
        }
        return;
      }

      const updated = await response.json();
      onSave(updated);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating course:', error);
      setErrors({ _form: 'Failed to update course. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      <CossUIDialogPopup className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <CossUIDialogHeader>
          <CossUIDialogTitle>Edit Course</CossUIDialogTitle>
          <CossUIDialogDescription>
            Update course information. Changes are saved when you click Save.
          </CossUIDialogDescription>
        </CossUIDialogHeader>

        {errors._form && (
          <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">
            {errors._form}
          </div>
        )}

        <CossUITabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CossUITabsList className="grid w-full grid-cols-4">
            <CossUITabsTab value="basic">Basic</CossUITabsTab>
            <CossUITabsTab value="content">Content</CossUITabsTab>
            <CossUITabsTab value="media">Media</CossUITabsTab>
            <CossUITabsTab value="settings">Settings</CossUITabsTab>
          </CossUITabsList>

          {/* Basic Info Tab */}
          <CossUITabsPanel value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <CossUILabel htmlFor="title">Title *</CossUILabel>
              <CossUIInput
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Course title"
                disabled={loading}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <CossUILabel htmlFor="slug">Slug</CossUILabel>
              <div className="flex gap-2">
                <CossUIInput
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="course-url-slug"
                  disabled={loading}
                  className="flex-1"
                />
                <CossUIButton
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  disabled={loading || !formData.title}
                >
                  Generate
                </CossUIButton>
              </div>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <CossUILabel htmlFor="status">Status</CossUILabel>
                <CossUISelect
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                  disabled={loading}
                >
                  <CossUISelectTrigger id="status">
                    <CossUISelectValue />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    <CossUISelectItem value="draft">Draft</CossUISelectItem>
                    <CossUISelectItem value="published">Published</CossUISelectItem>
                    <CossUISelectItem value="archived">Archived</CossUISelectItem>
                  </CossUISelectPopup>
                </CossUISelect>
              </div>

              <div className="space-y-2">
                <CossUILabel htmlFor="level">Level</CossUILabel>
                <CossUISelect
                  value={formData.level}
                  onValueChange={(value) => handleChange('level', value)}
                  disabled={loading}
                >
                  <CossUISelectTrigger id="level">
                    <CossUISelectValue placeholder="Select level" />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    <CossUISelectItem value="">None</CossUISelectItem>
                    <CossUISelectItem value="beginner">Beginner</CossUISelectItem>
                    <CossUISelectItem value="intermediate">Intermediate</CossUISelectItem>
                    <CossUISelectItem value="advanced">Advanced</CossUISelectItem>
                  </CossUISelectPopup>
                </CossUISelect>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <CossUILabel htmlFor="priceCents">Price (cents)</CossUILabel>
                <CossUIInput
                  id="priceCents"
                  type="number"
                  min="0"
                  value={formData.priceCents}
                  onChange={(e) => handleChange('priceCents', parseInt(e.target.value, 10) || 0)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Display: {(formData.priceCents / 100).toLocaleString('de-AT', {
                    style: 'currency',
                    currency: formData.currency || 'EUR',
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <CossUILabel htmlFor="currency">Currency</CossUILabel>
                <CossUISelect
                  value={formData.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                  disabled={loading}
                >
                  <CossUISelectTrigger id="currency">
                    <CossUISelectValue />
                  </CossUISelectTrigger>
                  <CossUISelectPopup>
                    <CossUISelectItem value="EUR">EUR</CossUISelectItem>
                    <CossUISelectItem value="USD">USD</CossUISelectItem>
                    <CossUISelectItem value="CHF">CHF</CossUISelectItem>
                  </CossUISelectPopup>
                </CossUISelect>
              </div>
            </div>
          </CossUITabsPanel>

          {/* Content Tab */}
          <CossUITabsPanel value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <CossUILabel htmlFor="shortDescription">Short Description</CossUILabel>
              <CossUITextarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="Brief summary for course cards (max 500 characters)"
                rows={3}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {formData.shortDescription.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <CossUILabel htmlFor="description">Full Description</CossUILabel>
              <CossUITextarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed course description (supports markdown)"
                rows={8}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/10000 characters
              </p>
            </div>
          </CossUITabsPanel>

          {/* Media Tab */}
          <CossUITabsPanel value="media" className="space-y-4 mt-4">
            <ImageUploader
              label="Thumbnail Image"
              value={formData.thumbnailUrl}
              onChange={(url) => handleChange('thumbnailUrl', url || '')}
              aspectRatio="16:9"
              bucket="course-images"
              disabled={loading}
            />

            <ImageUploader
              label="Cover Image"
              value={formData.coverImageUrl}
              onChange={(url) => handleChange('coverImageUrl', url || '')}
              aspectRatio="16:9"
              bucket="course-images"
              disabled={loading}
            />
          </CossUITabsPanel>

          {/* Settings Tab */}
          <CossUITabsPanel value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <CossUILabel htmlFor="category">Category</CossUILabel>
              <CossUIInput
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Meditation, Healing, Spirituality"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <CossUILabel htmlFor="entityScope">Platform</CossUILabel>
              <CossUISelect
                value={formData.entityScope}
                onValueChange={(value) => handleChange('entityScope', value)}
                disabled={loading}
              >
                <CossUISelectTrigger id="entityScope">
                  <CossUISelectValue placeholder="Select platform" />
                </CossUISelectTrigger>
                <CossUISelectPopup>
                  <CossUISelectItem value="">None</CossUISelectItem>
                  <CossUISelectItem value="ozean_licht">Ozean Licht</CossUISelectItem>
                  <CossUISelectItem value="kids_ascension">Kids Ascension</CossUISelectItem>
                </CossUISelectPopup>
              </CossUISelect>
            </div>

            <div className="space-y-2">
              <CossUILabel htmlFor="instructorId">Instructor ID</CossUILabel>
              <CossUIInput
                id="instructorId"
                value={formData.instructorId}
                onChange={(e) => handleChange('instructorId', e.target.value)}
                placeholder="UUID of instructor (optional)"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Future: Replace with instructor picker component
              </p>
            </div>
          </CossUITabsPanel>
        </CossUITabs>

        <CossUIDialogFooter className="mt-6">
          <CossUIButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </CossUIButton>
          <CossUIButton onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <CossUISpinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </CossUIButton>
        </CossUIDialogFooter>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
