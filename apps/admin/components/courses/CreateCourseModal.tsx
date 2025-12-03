'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  CossUISpinner,
  CossUISelect,
  CossUISelectTrigger,
  CossUISelectValue,
  CossUISelectPopup,
  CossUISelectItem,
} from '@shared/ui';
import { Plus } from 'lucide-react';

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Helper to generate URL-safe slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => {
      const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CreateCourseModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCourseModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [entityScope, setEntityScope] = useState<'ozean_licht' | 'kids_ascension'>('ozean_licht');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate slug as user types
    setSlug(generateSlug(value));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug || generateSlug(title),
          entityScope,
          status: 'draft',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          setError('A course with this slug already exists. Try a different title.');
        } else if (response.status === 403) {
          setError('You do not have permission to create courses.');
        } else {
          setError(data.error || 'Failed to create course');
        }
        return;
      }

      const { course } = await response.json();

      // Reset form
      setTitle('');
      setSlug('');
      onOpenChange(false);
      onSuccess?.();

      // Redirect to course detail page for full editing
      router.push(`/dashboard/courses/${course.slug}`);
    } catch (err) {
      console.error('Failed to create course:', err);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSlug('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <CossUIDialog open={open} onOpenChange={handleClose}>
      <CossUIDialogPopup className="max-w-md">
        <CossUIDialogHeader>
          <CossUIDialogTitle>Create New Course</CossUIDialogTitle>
          <CossUIDialogDescription>
            Enter a title to create a new course. You can add more details after creation.
          </CossUIDialogDescription>
        </CossUIDialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <CossUILabel htmlFor="create-title">Course Title *</CossUILabel>
            <CossUIInput
              id="create-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Introduction to Meditation"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <CossUILabel htmlFor="create-slug">URL Slug</CossUILabel>
            <CossUIInput
              id="create-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="introduction-to-meditation"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from title. Will be used in the course URL.
            </p>
          </div>

          <div className="space-y-2">
            <CossUILabel htmlFor="create-scope">Platform</CossUILabel>
            <CossUISelect
              value={entityScope}
              onValueChange={(value) => setEntityScope(value as 'ozean_licht' | 'kids_ascension')}
              disabled={loading}
            >
              <CossUISelectTrigger id="create-scope" className="w-full">
                <CossUISelectValue />
              </CossUISelectTrigger>
              <CossUISelectPopup>
                <CossUISelectItem value="ozean_licht">Ozean Licht</CossUISelectItem>
                <CossUISelectItem value="kids_ascension">Kids Ascension</CossUISelectItem>
              </CossUISelectPopup>
            </CossUISelect>
          </div>
        </div>

        <CossUIDialogFooter>
          <CossUIButton variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </CossUIButton>
          <CossUIButton onClick={handleSubmit} disabled={loading || !title.trim()}>
            {loading ? (
              <>
                <CossUISpinner className="mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </>
            )}
          </CossUIButton>
        </CossUIDialogFooter>
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
