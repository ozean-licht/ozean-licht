# Plan: Course Builder UX - Phase 5: Complete User Flow

## Task Description

Extend the course builder with complete course metadata editing, MinIO image uploads, and preview mode. This creates a full end-to-end course building experience.

## Objective

Enable administrators to:
1. Edit ALL course metadata (title, description, price, images, status, level, category)
2. Upload images directly to MinIO storage
3. Preview courses as students would see them
4. Complete the full course creation → publish workflow

## Course Variable Map

### Editable Fields

| Field | Type | UI Component | Validation |
|-------|------|--------------|------------|
| `title` | text | Input | Required, 3-200 chars |
| `slug` | text | Input (auto-generate) | Required, URL-safe, unique |
| `description` | text | Rich textarea / Markdown | Optional, max 10000 chars |
| `shortDescription` | text | Textarea | Optional, max 500 chars |
| `thumbnailUrl` | text | Image upload | Optional, image URL |
| `coverImageUrl` | text | Image upload | Optional, image URL |
| `priceCents` | integer | Currency input | >= 0 |
| `currency` | text | Select | EUR, USD, CHF |
| `status` | enum | Select/Buttons | draft, published, archived |
| `level` | enum | Select | beginner, intermediate, advanced |
| `category` | text | Combobox | Free text or predefined |
| `durationMinutes` | integer | Number input | Auto-calculated from lessons |
| `entityScope` | enum | Select | ozean_licht, kids_ascension |
| `instructorId` | uuid | Combobox | Select from users |
| `metadata` | jsonb | Key-value editor | Optional JSON |

### Read-Only / Computed Fields

| Field | Source |
|-------|--------|
| `id` | Auto-generated UUID |
| `airtableId` | Legacy migration field |
| `createdAt` | Auto timestamp |
| `updatedAt` | Auto timestamp |
| `publishedAt` | Set when status → published |
| `moduleCount` | Computed from modules |
| `lessonCount` | Computed from lessons |
| `enrollmentCount` | Computed from enrollments |

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COURSE BUILDER USER FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ Course List  │ ← All 64 courses displayed
    │   /courses   │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌─────────────┐
│ Create │   │ Manage      │ ← Click on course row
│ New    │   │ Content     │
└────┬───┘   └──────┬──────┘
     │              │
     ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     COURSE DETAIL PAGE                                  │
│  /dashboard/courses/[id]                                                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ HEADER SECTION                                                   │   │
│  │ ┌──────────┐  Title: [editable]           [Edit] [Preview]      │   │
│  │ │ Thumbnail│  Status: [draft ▼]           [Publish] [Archive]   │   │
│  │ │  Upload  │  Price: €[___] EUR           [Duplicate]           │   │
│  │ └──────────┘  Level: [beginner ▼]                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ TABS: [Overview] [Content] [Settings] [Preview]                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TAB: Overview                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Stats Cards: Modules | Lessons | Duration | Status               │   │
│  │ Short Description: [textarea]                                    │   │
│  │ Full Description: [rich editor]                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TAB: Content (Current Module/Lesson Builder)                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [+ Add Module]                                                   │   │
│  │ Module 1: Introduction                          [≡] [Edit] [×]  │   │
│  │   └─ Lesson 1.1: Welcome Video                  [≡] [Edit] [×]  │   │
│  │   └─ Lesson 1.2: Course Overview                [≡] [Edit] [×]  │   │
│  │   └─ [+ Add Lesson]                                             │   │
│  │ Module 2: Core Concepts                         [≡] [Edit] [×]  │   │
│  │   └─ ...                                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TAB: Settings                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Slug: [___________]  Category: [___________]                    │   │
│  │ Entity: [Ozean Licht ▼]  Instructor: [Select ▼]                 │   │
│  │ Cover Image: [Upload]                                           │   │
│  │ Metadata: [JSON Editor]                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TAB: Preview                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [Student View of Course Landing Page]                           │   │
│  │ - Hero with cover image                                         │   │
│  │ - Course info, price, enroll button                             │   │
│  │ - Curriculum outline                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 5.1: Course Editor Modal
Enable editing all course metadata via modal.

**Deliverables:**
- `CourseEditorModal.tsx` - Full course edit form
- `updateCourse()` database function
- `PATCH /api/courses/[id]` API route
- Form validation with Zod

### Phase 5.2: Image Upload with MinIO
Add image upload capability for thumbnails and covers.

**Deliverables:**
- `ImageUploader.tsx` - Drag-drop image upload component
- `POST /api/upload/image` - Upload to MinIO route
- MinIO bucket configuration for course images
- Image preview and crop functionality

### Phase 5.3: Tabbed Course Detail Layout
Reorganize course detail page with tabs.

**Deliverables:**
- Refactor `CourseDetailClient.tsx` with tabs
- Overview tab with stats and descriptions
- Content tab (existing module/lesson builder)
- Settings tab for advanced options
- Preview tab for student view

### Phase 5.4: Course Preview Mode
Show course as students would see it.

**Deliverables:**
- `CoursePreview.tsx` - Student-facing layout
- Preview course landing page
- Preview lesson player
- Mobile preview toggle

### Phase 5.5: Quick Actions & Polish
Add workflow shortcuts and UX improvements.

**Deliverables:**
- Quick publish/unpublish buttons
- Duplicate course action
- Create new course flow
- Auto-save for descriptions
- Keyboard shortcuts

## New Files

### Components
```
apps/admin/components/courses/
├── CourseEditorModal.tsx      # Full course metadata editor
├── ImageUploader.tsx          # MinIO image upload
├── CoursePreview.tsx          # Student preview mode
├── CourseTabs.tsx             # Tab navigation
├── OverviewTab.tsx            # Stats + descriptions
├── SettingsTab.tsx            # Advanced settings
├── DescriptionEditor.tsx      # Rich text / markdown
├── PriceInput.tsx             # Currency-aware price input
├── SlugInput.tsx              # Auto-generate slug
└── index.ts                   # Barrel exports
```

### API Routes
```
apps/admin/app/api/
├── courses/[id]/route.ts      # Add PATCH for update
├── courses/route.ts           # Add POST for create
└── upload/
    └── image/route.ts         # MinIO image upload
```

### Database
```
apps/admin/lib/db/
└── courses.ts                 # Add updateCourse(), createCourse()
```

## Step by Step Tasks

### Task 1: Add Course Update Database Function

Add to `apps/admin/lib/db/courses.ts`:

```typescript
export interface UpdateCourseInput {
  title?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  priceCents?: number;
  currency?: string;
  status?: CourseStatus;
  level?: CourseLevel;
  category?: string;
  durationMinutes?: number;
  entityScope?: ContentEntityScope;
  instructorId?: string;
  metadata?: Record<string, unknown>;
}

export async function updateCourse(id: string, input: UpdateCourseInput): Promise<Course | null> {
  // Build dynamic SET clause
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Add each field if provided
  if (input.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    params.push(input.title);
  }
  // ... repeat for all fields

  if (setClauses.length === 0) {
    return getCourseById(id);
  }

  // Handle publishedAt for status changes
  if (input.status === 'published') {
    setClauses.push(`published_at = COALESCE(published_at, NOW())`);
  }

  params.push(id);
  const sql = `
    UPDATE courses
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<CourseRow>(sql, params);
  return rows.length > 0 ? mapCourse(rows[0]) : null;
}
```

### Task 2: Create Course Editor Modal

Create `apps/admin/components/courses/CourseEditorModal.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Course, UpdateCourseInput, CourseStatus, CourseLevel } from '@/types/content';
import {
  CossUIDialog,
  CossUIDialogTrigger,
  CossUIDialogPopup,
  CossUIButton,
  CossUIInput,
  CossUITextarea,
  CossUISelect,
  // ... other imports
} from '@shared/ui';
import { courseEditorSchema } from '@/lib/validations/course-builder';
import ImageUploader from './ImageUploader';

interface CourseEditorModalProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Course) => void;
}

export default function CourseEditorModal({
  course,
  open,
  onOpenChange,
  onSave,
}: CourseEditorModalProps) {
  const [formData, setFormData] = useState<UpdateCourseInput>({
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnailUrl: course.thumbnailUrl,
    coverImageUrl: course.coverImageUrl,
    priceCents: course.priceCents,
    currency: course.currency,
    status: course.status,
    level: course.level,
    category: course.category,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validate with Zod
    const result = courseEditorSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update course');

      const updated = await response.json();
      onSave(updated);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CossUIDialog open={open} onOpenChange={onOpenChange}>
      <CossUIDialogPopup className="max-w-2xl">
        {/* Form fields organized in sections */}
        {/* Basic Info: title, slug, status */}
        {/* Descriptions: short, full */}
        {/* Media: thumbnail, cover */}
        {/* Pricing: price, currency */}
        {/* Classification: level, category, entity */}
      </CossUIDialogPopup>
    </CossUIDialog>
  );
}
```

### Task 3: Create Image Uploader Component

Create `apps/admin/components/courses/ImageUploader.tsx`:

```tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CossUIButton } from '@shared/ui';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label: string;
  aspectRatio?: '16:9' | '1:1' | '4:3';
  bucket?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  aspectRatio = '16:9',
  bucket = 'course-images',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      onChange(url);
      setPreview(url);
    } catch (error) {
      console.error('Upload error:', error);
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  }, [bucket, onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const aspectClasses = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div
        {...getRootProps()}
        className={`
          relative ${aspectClasses[aspectRatio]} rounded-lg border-2 border-dashed
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50'}
          transition-colors overflow-hidden
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm">Drop image or click to upload</p>
            <p className="text-xs">JPG, PNG, WebP (max 5MB)</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Task 4: Create Image Upload API Route

Create `apps/admin/app/api/upload/image/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'course-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucket);
    if (!bucketExists) {
      await minioClient.makeBucket(bucket);
    }

    // Upload to MinIO
    await minioClient.putObject(bucket, filename, buffer, buffer.length, {
      'Content-Type': file.type,
    });

    // Generate public URL
    const publicUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${filename}`;

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

### Task 5: Add Course Update API Route

Update `apps/admin/app/api/courses/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCourseById, updateCourse } from '@/lib/db/courses';
import { courseUpdateSchema } from '@/lib/validations/course-builder';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const course = await getCourseById(params.id);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const result = courseUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 }
      );
    }

    const updated = await updateCourse(params.id, result.data);
    if (!updated) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
```

### Task 6: Add Validation Schema

Update `apps/admin/lib/validations/course-builder.ts`:

```typescript
import { z } from 'zod';

export const courseUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe').optional(),
  description: z.string().max(10000).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  priceCents: z.number().int().min(0).optional(),
  currency: z.enum(['EUR', 'USD', 'CHF']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  durationMinutes: z.number().int().min(0).optional().nullable(),
  entityScope: z.enum(['ozean_licht', 'kids_ascension']).optional().nullable(),
  instructorId: z.string().uuid().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export const courseEditorSchema = courseUpdateSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
});

export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
```

### Task 7: Refactor Course Detail with Tabs

Refactor `apps/admin/app/dashboard/courses/[id]/CourseDetailClient.tsx` to include tabs.

### Task 8: Enable Edit Button in Header

Update `apps/admin/components/courses/CourseDetailHeader.tsx`:
- Remove `disabled` from Edit button
- Add `onEdit` callback prop
- Trigger CourseEditorModal on click

## Acceptance Criteria

1. **Course metadata fully editable** - all 15+ fields can be modified
2. **Image upload works** - thumbnails/covers upload to MinIO and display
3. **Validation prevents errors** - Zod schema catches invalid input
4. **Status changes tracked** - publishedAt set on first publish
5. **Preview mode functional** - shows course as student would see
6. **Auto-save for descriptions** - debounced save for text fields
7. **Mobile responsive** - all forms work on mobile

## Testing

```bash
# Type check
cd apps/admin && npm run type-check

# Build
cd apps/admin && npm run build

# Manual testing
# 1. Edit course title, verify saves
# 2. Upload thumbnail, verify displays
# 3. Change price, verify currency formatting
# 4. Change status to published, verify publishedAt set
# 5. Preview tab shows student view
```

## Dependencies

```bash
# For image upload dropzone
cd apps/admin && npm install react-dropzone

# MinIO client (if not already installed)
cd apps/admin && npm install minio
```

---

*Spec created: 2025-11-28 | Complexity: complex | Feature type: feature*
