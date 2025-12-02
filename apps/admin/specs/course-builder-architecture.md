# Plan: Course Builder Architecture

## Task Description

Design and implement a course builder system that allows the Ozean Licht team to structure their 64 migrated courses with modules (sections) and lessons (content items). Since the Airtable `course_modules` and `module_contents` tables are empty (courses were previously in Ablefy/Elopage), this is a greenfield architecture project.

## Objective

Create a complete course builder CMS that enables:
1. Viewing course details with nested modules and lessons
2. Creating, editing, and reordering modules within a course
3. Creating, editing, and reordering lessons within a module
4. Linking existing videos (571 migrated) to video-type lessons
5. Supporting multiple content types: video, text, pdf, quiz, audio

## Problem Statement

The 64 courses migrated from Airtable exist as metadata only. The actual course structure (modules and lessons) was hosted in Ablefy (formerly Elopage) and needs to be rebuilt. The team needs an admin interface to:
- Structure each course into logical sections (modules)
- Add content items (lessons) to each module
- Link to the 571 videos already migrated to PostgreSQL
- Support multiple content types with different display requirements

## Solution Approach

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Course Detail Page (/dashboard/courses/[id])         │   │
│  │  ├── Course Header (title, status, actions)          │   │
│  │  ├── Modules List (drag-and-drop reorder)            │   │
│  │  │    └── Module Card (expand/collapse)              │   │
│  │  │         └── Lessons List (drag-and-drop)          │   │
│  │  └── Add Module Button                               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Module Editor Modal                                  │   │
│  │  ├── Title, Description fields                       │   │
│  │  └── Save/Cancel actions                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Lesson Editor Modal                                  │   │
│  │  ├── Type selector (video/text/pdf/quiz)             │   │
│  │  ├── Type-specific fields                            │   │
│  │  │    ├── Video: Video picker from library           │   │
│  │  │    ├── Text: Rich text editor                     │   │
│  │  │    ├── PDF: File upload/URL                       │   │
│  │  │    └── Quiz: Quiz builder (future)                │   │
│  │  └── Common: Title, description, duration, required  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│  lib/db/modules.ts    →  course_modules table               │
│  lib/db/lessons.ts    →  course_lessons table               │
│  lib/db/courses.ts    →  courses table (existing)           │
│  lib/db/videos.ts     →  videos table (existing)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL (ozean-licht-db)                    │
│  courses (64 records) ← existing                            │
│  videos (571 records) ← existing                            │
│  course_modules       ← NEW                                 │
│  course_lessons       ← NEW                                 │
└─────────────────────────────────────────────────────────────┘
```

### Content Type Strategy

| Type | Storage | Display | Future |
|------|---------|---------|--------|
| video | `video_id` FK to videos | Embedded player | Progress tracking |
| text | `content_text` column | Rendered markdown | - |
| pdf | `content_url` column | PDF viewer/download | - |
| quiz | `quiz_data` JSONB | Quiz component | Question builder |

## Relevant Files

### Shared UI Components (Use These!)
Import from `@shared/ui` - do NOT create duplicate components:

| Component | Import | Use For |
|-----------|--------|---------|
| `CossUIDialog` | `@shared/ui` | Module/Lesson editor modals |
| `CossUICard` | `@shared/ui` | Module cards, lesson cards |
| `CossUIAccordion` | `@shared/ui` | Expandable module list |
| `CossUIButton` | `@shared/ui` | All buttons |
| `CossUIInput`, `CossUITextarea` | `@shared/ui` | Form inputs |
| `CossUISelect` | `@shared/ui` | Content type, status dropdowns |
| `CossUICombobox` | `@shared/ui` | Video picker (searchable) |
| `CossUICheckbox`, `CossUISwitch` | `@shared/ui` | Required, preview toggles |
| `CossUIBadge` | `@shared/ui` | Status, type badges |
| `CossUISkeleton` | `@shared/ui` | Loading states |
| `CossUIEmpty` | `@shared/ui` | Empty module/lesson states |
| `CossUIAlertDialog` | `@shared/ui` | Delete confirmations |
| `CossUIMenu` | `@shared/ui` | Action dropdowns |
| `CossUITooltip` | `@shared/ui` | Icon tooltips |
| `CossUIField` | `@shared/ui` | Form field wrapper with label/error |
| `CossUIForm` | `@shared/ui` | Form root with validation |

### Existing Files (Reference)
- `shared/database/migrations/020_create_courses_standalone.sql` - Course schema pattern
- `shared/database/migrations/021_create_videos_standalone.sql` - Video schema pattern
- `shared/ui/src/cossui/` - All UI components (50+)
- `shared/ui/src/cossui/combobox.tsx` - Reference for video picker pattern
- `apps/admin/lib/db/courses.ts` - Course query pattern
- `apps/admin/lib/db/videos.ts` - Video query pattern
- `apps/admin/lib/db/index.ts` - Database connection pool
- `apps/admin/types/content.ts` - Course/Video types
- `apps/admin/app/dashboard/courses/page.tsx` - Courses list page
- `apps/admin/components/data-table/data-table.tsx` - Reusable data table

### New Files

**Database Migrations:**
- `shared/database/migrations/022_create_course_modules.sql` - Modules table
- `shared/database/migrations/023_create_course_lessons.sql` - Lessons table

**Database Queries:**
- `apps/admin/lib/db/modules.ts` - Module CRUD operations
- `apps/admin/lib/db/lessons.ts` - Lesson CRUD operations

**TypeScript Types:**
- `apps/admin/types/content.ts` - Add Module, Lesson types (extend existing)

**Admin Pages:**
- `apps/admin/app/dashboard/courses/[id]/page.tsx` - Course detail page
- `apps/admin/app/dashboard/courses/[id]/layout.tsx` - Course detail layout
- `apps/admin/app/dashboard/courses/[id]/modules/page.tsx` - Modules management

**Components (compose using @shared/ui):**
- `apps/admin/components/courses/CourseDetailHeader.tsx` - Uses CossUICard, CossUIButton, CossUIBadge
- `apps/admin/components/courses/ModuleList.tsx` - Uses CossUIAccordion for expand/collapse
- `apps/admin/components/courses/ModuleCard.tsx` - Uses CossUICard, CossUIMenu, CossUIBadge
- `apps/admin/components/courses/LessonList.tsx` - Uses CossUICard for lesson items
- `apps/admin/components/courses/LessonCard.tsx` - Uses CossUICard, CossUIBadge, CossUIMenu
- `apps/admin/components/courses/ModuleEditorModal.tsx` - Uses CossUIDialog, CossUIField, CossUIInput
- `apps/admin/components/courses/LessonEditorModal.tsx` - Uses CossUIDialog, CossUISelect, CossUICombobox
- `apps/admin/components/courses/VideoPicker.tsx` - Uses CossUICombobox for searchable video selection
- `apps/admin/components/courses/index.ts` - Barrel export

**API Routes:**
- `apps/admin/app/api/courses/[id]/modules/route.ts` - Module CRUD API
- `apps/admin/app/api/courses/[id]/modules/[moduleId]/route.ts` - Single module API
- `apps/admin/app/api/courses/[id]/modules/[moduleId]/lessons/route.ts` - Lessons API
- `apps/admin/app/api/courses/[id]/modules/reorder/route.ts` - Reorder modules
- `apps/admin/app/api/courses/[id]/modules/[moduleId]/lessons/reorder/route.ts` - Reorder lessons

## Implementation Phases

### Phase 1: Database Foundation
Create PostgreSQL schemas and database query layer for modules and lessons.

**Deliverables:**
- Migration files for `course_modules` and `course_lessons` tables
- TypeScript types for Module and Lesson entities
- Database query functions with CRUD operations
- Unit tests for query functions

### Phase 2: Core Read Operations
Build the course detail page with read-only module/lesson display.

**Deliverables:**
- Course detail page route
- Module list component (read-only)
- Lesson list component (read-only)
- Course with nested modules query

### Phase 3: Write Operations & UI
Add create, edit, delete, and reorder functionality.

**Deliverables:**
- Module editor modal
- Lesson editor modal
- API routes for CRUD operations
- Reorder API with drag-and-drop UI
- Video picker component

### Phase 4: Integration & Polish
Connect all pieces, add validation, loading states, error handling.

**Deliverables:**
- Form validation with Zod
- Optimistic updates
- Loading skeletons
- Error toasts
- Empty states

## Step by Step Tasks

### 1. Create Database Schema for Modules

Create migration file: `shared/database/migrations/022_create_course_modules.sql`

```sql
-- Migration: 022_create_course_modules.sql
-- Description: Create course_modules table for course builder
-- Created: 2025-11-28

CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_sort_order ON course_modules(course_id, sort_order);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_course_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_course_modules_updated_at();

COMMENT ON TABLE course_modules IS 'Sections/chapters within a course';
COMMENT ON COLUMN course_modules.sort_order IS 'Order of module within course (0-indexed)';
```

### 2. Create Database Schema for Lessons

Create migration file: `shared/database/migrations/023_create_course_lessons.sql`

```sql
-- Migration: 023_create_course_lessons.sql
-- Description: Create course_lessons table for course builder
-- Created: 2025-11-28

-- Content type enum
CREATE TYPE lesson_content_type AS ENUM ('video', 'text', 'pdf', 'quiz');

CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type lesson_content_type NOT NULL DEFAULT 'video',
    -- Content fields (one used based on content_type)
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    content_text TEXT,  -- For text type (markdown)
    content_url TEXT,   -- For pdf type (URL to PDF)
    quiz_data JSONB,    -- For quiz type (future)
    -- Metadata
    duration_seconds INTEGER,
    is_required BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false,  -- Free preview lesson
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX idx_course_lessons_video_id ON course_lessons(video_id);
CREATE INDEX idx_course_lessons_sort_order ON course_lessons(module_id, sort_order);
CREATE INDEX idx_course_lessons_content_type ON course_lessons(content_type);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_course_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_lessons_updated_at
    BEFORE UPDATE ON course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_course_lessons_updated_at();

COMMENT ON TABLE course_lessons IS 'Individual content items within a course module';
COMMENT ON COLUMN course_lessons.content_type IS 'Type of content: video, text, pdf, or quiz';
COMMENT ON COLUMN course_lessons.is_preview IS 'Whether this lesson is available as free preview';
COMMENT ON COLUMN course_lessons.quiz_data IS 'JSON structure for quiz questions (future feature)';
```

### 3. Add TypeScript Types

Extend `apps/admin/types/content.ts` with Module and Lesson types:

```typescript
// === Modules ===
export type ModuleStatus = 'draft' | 'published';

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  status: ModuleStatus;
  createdAt: string;
  updatedAt: string;
  // Computed
  lessonCount?: number;
  totalDurationSeconds?: number;
  lessons?: Lesson[];
}

export interface CreateModuleInput {
  courseId: string;
  title: string;
  description?: string;
  status?: ModuleStatus;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  status?: ModuleStatus;
}

// === Lessons ===
export type LessonContentType = 'video' | 'text' | 'pdf' | 'quiz';
export type LessonStatus = 'draft' | 'published';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  // Content fields
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
  quizData?: Record<string, unknown>;
  // Metadata
  durationSeconds?: number;
  isRequired: boolean;
  isPreview: boolean;
  sortOrder: number;
  status: LessonStatus;
  createdAt: string;
  updatedAt: string;
  // Joined
  video?: Video;
}

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
  durationSeconds?: number;
  isRequired?: boolean;
  isPreview?: boolean;
  status?: LessonStatus;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  contentType?: LessonContentType;
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
  durationSeconds?: number;
  isRequired?: boolean;
  isPreview?: boolean;
  status?: LessonStatus;
}

// === Course with Structure ===
export interface CourseWithStructure extends Course {
  modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}
```

### 4. Create Module Database Queries

Create `apps/admin/lib/db/modules.ts`:

- `listModulesByCourse(courseId)` - List all modules for a course, ordered by sort_order
- `getModuleById(id)` - Get single module with lesson count
- `createModule(input)` - Insert new module, auto-increment sort_order
- `updateModule(id, input)` - Update module fields
- `deleteModule(id)` - Delete module (cascades to lessons)
- `reorderModules(courseId, moduleIds[])` - Bulk update sort_order
- `getModuleWithLessons(id)` - Module with nested lessons

### 5. Create Lesson Database Queries

Create `apps/admin/lib/db/lessons.ts`:

- `listLessonsByModule(moduleId)` - List lessons for a module
- `getLessonById(id)` - Get single lesson with video join
- `createLesson(input)` - Insert new lesson
- `updateLesson(id, input)` - Update lesson fields
- `deleteLesson(id)` - Delete lesson
- `reorderLessons(moduleId, lessonIds[])` - Bulk update sort_order

### 6. Create Course Detail Page

Create `apps/admin/app/dashboard/courses/[id]/page.tsx`:

- Server component that fetches course with modules and lessons
- Pass data to client component for interactivity
- RBAC check for course:read permission

### 7. Create Module List Component

Create `apps/admin/components/courses/ModuleList.tsx`:

- Display modules as expandable cards
- Each card shows title, lesson count, duration
- Expand to show lesson list
- Add module button at bottom
- Edit/delete actions per module
- Future: drag-and-drop reorder (use @dnd-kit/sortable)

### 8. Create Lesson List Component

Create `apps/admin/components/courses/LessonList.tsx`:

- Display lessons within expanded module
- Show icon by content type (video/text/pdf/quiz)
- Show duration, required badge, preview badge
- Add lesson button
- Edit/delete actions per lesson
- Future: drag-and-drop reorder

### 9. Create Module Editor Modal

Create `apps/admin/components/courses/ModuleEditorModal.tsx`:

- Dialog with form fields: title, description, status
- Create mode vs edit mode
- Form validation with Zod
- Submit creates/updates via API
- Close modal on success

### 10. Create Lesson Editor Modal

Create `apps/admin/components/courses/LessonEditorModal.tsx`:

- Dialog with dynamic fields based on content type
- Content type selector at top
- **Video type**: Video picker (search existing videos)
- **Text type**: Markdown textarea
- **PDF type**: URL input
- **Quiz type**: Coming soon placeholder
- Common fields: title, description, duration, required, preview
- Form validation with Zod
- Submit creates/updates via API

### 11. Create Video Picker Component

Create `apps/admin/components/courses/VideoPicker.tsx`:

- Search input to filter 571 videos
- Display video cards with thumbnail, title, duration
- Select video returns video ID
- Used within Lesson Editor for video type

### 12. Create API Routes

Create CRUD API routes:

**Modules API** (`/api/courses/[id]/modules/route.ts`):
- GET: List modules for course
- POST: Create new module

**Single Module API** (`/api/courses/[id]/modules/[moduleId]/route.ts`):
- GET: Get module details
- PATCH: Update module
- DELETE: Delete module

**Reorder Modules API** (`/api/courses/[id]/modules/reorder/route.ts`):
- POST: Reorder modules (body: { moduleIds: string[] })

**Lessons API** (`/api/courses/[id]/modules/[moduleId]/lessons/route.ts`):
- GET: List lessons for module
- POST: Create new lesson

**Single Lesson API** (`apps/admin/app/api/lessons/[lessonId]/route.ts`):
- GET: Get lesson details
- PATCH: Update lesson
- DELETE: Delete lesson

**Reorder Lessons API** (`/api/courses/[id]/modules/[moduleId]/lessons/reorder/route.ts`):
- POST: Reorder lessons (body: { lessonIds: string[] })

### 13. Wire Up Client Interactions

- Create client component for course detail page
- Add state for modal visibility (create/edit module, create/edit lesson)
- Add handlers for CRUD operations
- Refresh data after mutations
- Add loading and error states

### 14. Add Navigation Links

- Update Sidebar.tsx to include course builder access
- Add "Manage Content" action to course row in data table
- Add breadcrumb for course detail page

### 15. Validate Implementation

- Test creating a module
- Test creating lessons of each type
- Test editing and deleting
- Test reordering modules and lessons
- Test video picker search and selection
- Verify data integrity in database

## Testing Strategy

### Unit Tests
- `lib/db/modules.test.ts` - Test module queries
- `lib/db/lessons.test.ts` - Test lesson queries
- Mock database pool for isolation

### Integration Tests
- API route tests with real database
- Test CRUD operations end-to-end
- Test cascade deletes (module → lessons)
- Test reorder operations

### Manual Testing Checklist
1. Create course with 3 modules
2. Add 2 lessons to each module (different types)
3. Reorder modules via drag-and-drop
4. Reorder lessons within a module
5. Edit module title and description
6. Edit lesson content by type
7. Delete a lesson, verify module updates
8. Delete a module, verify lessons cascade deleted
9. Link a video to a video-type lesson
10. Set lesson as preview, verify badge

## Acceptance Criteria

1. **Modules can be created, read, updated, deleted** for any course
2. **Lessons can be CRUD'd** within modules with proper type handling
3. **Modules display in order** with lesson counts and total duration
4. **Lessons display in order** with type icons and metadata
5. **Video picker** searches and selects from 571 existing videos
6. **Reordering** updates sort_order correctly
7. **Cascade deletes** work (delete module → deletes lessons)
8. **Form validation** prevents invalid data submission
9. **Loading states** show during async operations
10. **Error states** display meaningful messages

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Run database migrations
docker cp shared/database/migrations/022_create_course_modules.sql \
  mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457:/tmp/
docker exec mcp-gateway-o000okc80okco8s0sgcwwcwo-085218836457 \
  node -e "/* execute migration */"

# Type check admin app
cd apps/admin && npm run type-check

# Run tests
cd apps/admin && npm test -- --testPathPattern=modules
cd apps/admin && npm test -- --testPathPattern=lessons

# Build admin app
cd apps/admin && npm run build

# Manual: Navigate to /dashboard/courses/[any-course-id] and test CRUD
```

## Notes

### Component Usage - IMPORTANT
**Always import from `@shared/ui`** - do not create new Button, Card, Dialog, etc. components:

```tsx
// CORRECT - use shared UI
import {
  CossUIDialog, CossUIDialogTrigger, CossUIDialogPopup,
  CossUICard, CossUICardHeader, CossUICardPanel,
  CossUIButton, CossUIInput, CossUITextarea,
  CossUISelect, CossUISelectTrigger, CossUISelectValue, CossUISelectPopup, CossUISelectItem,
  CossUIComboboxRoot, CossUIComboboxInput, CossUIComboboxPopup, CossUIComboboxItem,
  CossUIAccordion, CossUIAccordionItem, CossUIAccordionTrigger, CossUIAccordionPanel,
  CossUIBadge, CossUISkeleton, CossUIEmpty,
  CossUIField, CossUIFieldLabel, CossUIFieldControl, CossUIFieldError,
} from '@shared/ui';

// WRONG - don't use admin/components/ui duplicates
import { Dialog, Card, Button } from '@/components/ui'; // NO!
```

### Component Gap Analysis

| Requirement | Available in @shared/ui? | Solution |
|------------|--------------------------|----------|
| Modal dialogs | ✅ CossUIDialog | Use directly |
| Cards | ✅ CossUICard | Use directly |
| Expandable sections | ✅ CossUIAccordion | Use directly |
| Searchable dropdown | ✅ CossUICombobox | Use for video picker |
| Form fields | ✅ CossUIField + inputs | Use directly |
| Empty states | ✅ CossUIEmpty | Use directly |
| Loading skeletons | ✅ CossUISkeleton | Use directly |
| Action menus | ✅ CossUIMenu | Use directly |
| Confirmations | ✅ CossUIAlertDialog | Use directly |
| **Drag-and-drop** | ❌ Not available | Add @dnd-kit (Phase 3) |
| **Rich text editor** | ❌ Not available | Add TipTap (future, optional) |

**Conclusion:** All core components exist. Only drag-and-drop needs external library.

### Dependencies to Add
```bash
# For drag-and-drop reordering (Phase 3)
cd apps/admin && npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# For rich text editing (future - text content type)
# cd apps/admin && npm install @tiptap/react @tiptap/starter-kit
```

### Schema Design Decisions

1. **Separate lessons table** (not JSONB in modules) - enables:
   - Individual lesson queries for progress tracking
   - Video foreign key for referential integrity
   - Indexing on content_type for filtering

2. **`sort_order` column** instead of linked list - simpler reordering, no recursion

3. **`is_preview` flag** - allows free preview lessons for marketing

4. **`video_id` FK to videos** - ensures video exists, enables join

5. **`lesson_content_type` enum** - type safety, extensible for future types

### Future Considerations

- **Progress tracking**: Add `user_lesson_progress` table
- **Quiz builder**: Design JSONB schema for quiz_data
- **Rich text editor**: Integrate TipTap or similar for text content
- **File upload**: MinIO integration for PDF uploads
- **Bulk import**: CSV import for module/lesson structure

---

*Spec created: 2025-11-28 | Complexity: complex | Feature type: feature*
