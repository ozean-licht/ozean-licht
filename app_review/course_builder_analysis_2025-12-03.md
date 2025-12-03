# Course Builder Implementation Analysis Report

**Date**: 2025-12-03  
**Location**: `apps/admin/app/dashboard/courses/`  
**Status**: Partially Complete - Missing Critical API Endpoints

---

## Executive Summary

The course builder UI is fully functional with complete components for displaying courses in both list and gallery views. However, there is a **critical missing API endpoint** for creating new courses. The "+ New Course" button has no handler, preventing users from creating courses. All other infrastructure (database, models, validations) is in place.

---

## 1. Course Listing Page

### Location
- **Server Component**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/courses/page.tsx` (lines 1-41)
- **Client Component**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/courses/CoursesPageClient.tsx` (lines 1-108)
- **Data Table**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/courses/CoursesDataTable.tsx` (lines 1-187)

### How Courses Are Fetched

**Server-side fetch** (`page.tsx` lines 20-28):
```typescript
const result = await listCourses({
  limit: 100,
  offset: 0,
  orderBy: 'created_at',
  orderDirection: 'desc',
});
```

The `listCourses` function from `lib/db/courses.ts` connects **directly to PostgreSQL** (no MCP Gateway):
- Executes a raw SQL query with filtering and pagination
- Returns `{ courses: Course[], total: number }`
- Handles WHERE conditions for status, level, category, search, and entityScope

### Display Implementation

**List View** (CoursesDataTable.tsx):
- Renders a data table using the `columns.tsx` column definitions
- Client-side filtering for search, status, and level
- Search is debounced (300ms) via `useDebounce` hook
- Filter URL params are updated in real-time

**Gallery View** (CoursesGallery.tsx):
- Card-based layout with course thumbnails
- Stats dashboard showing total, published, draft, and student counts
- Tabbed interface for filtering
- Empty state prompt to create courses

### Current Status
- Courses display correctly in both views
- Filtering, search, and sorting work properly
- No errors in course fetching

---

## 2. New Course Button Issue

### Problem Description
The "+ New Course" button appears in two locations but **has no onClick handler or navigation**:

1. **CoursesPageClient.tsx** (lines 88-91):
   ```typescript
   <Button>
     <Plus className="h-4 w-4 mr-2" />
     New Course
   </Button>
   ```
   - No `onClick` handler
   - No `href` prop for navigation
   - Button renders but does nothing

2. **CoursesGallery.tsx** (lines 162-165):
   ```typescript
   <Button className="bg-primary text-white hover:bg-primary/90">
     <Plus className="w-4 h-4 mr-2" />
     Create Course
   </Button>
   ```
   - No handler
   - No navigation

### What's Missing
- No route like `/dashboard/courses/new` exists
- No POST endpoint for creating courses at `/api/courses/` root
- No modal or form component for course creation
- No client-side handler to initiate course creation

---

## 3. API Endpoints Analysis

### Existing Routes
```
/api/courses/[id]                           - GET (fetch single) | PATCH (update)
/api/courses/[id]/modules                   - GET | POST | PATCH
/api/courses/[id]/modules/reorder           - POST
/api/courses/[id]/modules/[moduleId]        - GET | PATCH | DELETE
/api/courses/[id]/modules/[moduleId]/lessons - GET | POST | PATCH
/api/courses/[id]/modules/[moduleId]/lessons/reorder - POST
/api/courses/[id]/prerequisites/available   - GET
```

### Missing Route
**POST /api/courses** - ROOT ENDPOINT FOR CREATING COURSES

**File location**: Should be at `/opt/ozean-licht-ecosystem/apps/admin/app/api/courses/route.ts`
**Current status**: **DOES NOT EXIST**

**Required implementation**:
```typescript
export async function POST(request: NextRequest) {
  // 1. Authenticate (NextAuth)
  // 2. Validate role (super_admin, ol_admin, ol_content)
  // 3. Parse request body
  // 4. Validate with courseCreateSchema (needs to be created)
  // 5. Call createCourse() from lib/db/courses.ts
  // 6. Return 201 with created course
}

export async function GET(request: NextRequest) {
  // List all courses with optional filters
  // Alternative to server-side page.tsx fetch
}
```

---

## 4. Database Schema

### Courses Table
**File**: `/opt/ozean-licht-ecosystem/shared/database/migrations/020_create_courses_standalone.sql`

**Structure** (lines 4-25):
```sql
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airtable_id TEXT UNIQUE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  cover_image_url TEXT,
  price_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  duration_minutes INTEGER,
  entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
  instructor_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);
```

**Indexes**:
- `idx_courses_status` - for filtering by status
- `idx_courses_entity_scope` - for multi-tenant support
- `idx_courses_slug` - for unique slug lookups
- `idx_courses_airtable_id` - for legacy Airtable migration

**Triggers**:
- Auto-updates `updated_at` timestamp on every modification

### Related Tables

**Course Modules** (`022_create_course_modules.sql`):
- `course_modules` - Sections/chapters within courses
- Foreign key to `courses(id)` with CASCADE delete
- Supports ordering via `sort_order`

**Course Lessons** (`023_create_course_lessons.sql`):
- `course_lessons` - Individual content items
- Foreign key to `course_modules(id)` with CASCADE delete
- Supports multiple content types (video, text, pdf, quiz, audio)

---

## 5. Database Layer

### Location
`/opt/ozean-licht-ecosystem/apps/admin/lib/db/courses.ts` (368 lines)

### Available Functions

#### `listCourses(options)` - Lines 89-164
Returns paginated courses with filtering.

**Signature**:
```typescript
export async function listCourses(
  options: ListCoursesOptions = {}
): Promise<ListCoursesResult>
```

**Options**:
- `limit` (default: 100)
- `offset` (default: 0)
- `status` - draft | published | archived
- `level` - beginner | intermediate | advanced
- `category`
- `entityScope` - ozean_licht | kids_ascension
- `search` - full-text search on title & description
- `orderBy` - created_at | updated_at | title | price_cents | status (validated)
- `orderDirection` - asc | desc

#### `getCourseById(id)` - Lines 169-182
Fetches single course by UUID.

#### `getCourseBySlug(slug)` - Lines 187-200
Fetches single course by URL slug.

#### `getCourseStats()` - Lines 205-228
Returns counts by status (total, published, draft, archived).

#### `createCourse(input)` - Lines 318-368
Creates a new course.

**Input Type**:
```typescript
{
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  priceCents?: number;
  currency?: string;
  status?: 'draft' | 'published' | 'archived';
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  entityScope?: 'ozean_licht' | 'kids_ascension';
  instructorId?: string;
  metadata?: Record<string, unknown>;
}
```

#### `updateCourse(id, input)` - Lines 255-313
Updates existing course (partial updates supported).

**Input Type**: `UpdateCourseInput` (same fields as create, all optional)

### Key Observations

1. **Direct PostgreSQL**: Uses `query()` function from `lib/db/index.ts`
2. **No MCP Gateway**: All queries run directly against the database
3. **SQL Injection Protection**: Uses parameterized queries ($1, $2, etc.)
4. **Snake Case to Camel Case**: Row data is mapped via `mapCourse()` function
5. **Type Safety**: Full TypeScript types for rows and return types

---

## 6. Types & Validation

### Course Type
**File**: `/opt/ozean-licht-ecosystem/apps/admin/types/content.ts` (lines 49-79)

```typescript
export interface Course {
  id: string;
  airtableId?: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  priceCents: number;
  currency: string;
  status: CourseStatus;
  level?: CourseLevel;
  category?: string;
  durationMinutes?: number;
  entityScope?: ContentEntityScope;
  instructorId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metadata?: Record<string, unknown>;
  // Computed fields
  lessonCount?: number;
  moduleCount?: number;
  enrollmentCount?: number;
  instructor?: { id: string; name: string; email: string };
}
```

### Validation Schemas
**File**: `/opt/ozean-licht-ecosystem/apps/admin/lib/validations/course-builder.ts`

**Available schemas**:
- `courseUpdateSchema` (lines 384-400) - For PATCH requests
- `courseEditorSchema` (lines 405-407) - Extends updateSchema with required title

**Important**: No `courseCreateSchema` exists yet! This needs to be created.

---

## 7. Data Column Definitions

**File**: `/opt/ozean-licht-ecosystem/apps/admin/app/dashboard/courses/columns.tsx` (258 lines)

**Columns displayed**:
1. **Course** - Title, thumbnail, short description
2. **Status** - Badge showing draft/published/archived
3. **Level** - Badge showing beginner/intermediate/advanced
4. **Price** - Formatted price or "Free" badge
5. **Lessons** - Count of lessons + module count
6. **Students** - Enrollment count with icon
7. **Duration** - Formatted as "Xh Ym"
8. **Updated** - Time since update + locale date
9. **Actions** - Dropdown menu (Manage Content, View Details, Edit disabled, Delete)

**Note**: Edit and Delete are placeholders - Delete is clickable but has no handler.

---

## 8. Root Causes & Issues Summary

### Issue 1: No Course Creation Button Handler
- **Location**: `CoursesPageClient.tsx` line 88-91, `CoursesGallery.tsx` line 162-165
- **Cause**: Button component has no `onClick` or `href` props
- **Impact**: Users cannot create new courses
- **Fix**: Add `onClick` handler that opens a modal or navigates to new course form

### Issue 2: Missing POST /api/courses Endpoint
- **Location**: `/opt/ozean-licht-ecosystem/apps/admin/app/api/courses/` (root)
- **Cause**: No `route.ts` file exists at root courses directory
- **Impact**: No backend endpoint to accept course creation requests
- **Fix**: Create `/opt/ozean-licht-ecosystem/apps/admin/app/api/courses/route.ts` with POST handler

### Issue 3: Missing Course Creation Form/Modal
- **Location**: Not implemented anywhere
- **Cause**: No form component exists for initial course setup
- **Impact**: Even if endpoint existed, users have nowhere to input course data
- **Fix**: Create a modal or page with course creation form

### Issue 4: Missing courseCreateSchema Validation
- **Location**: `lib/validations/course-builder.ts`
- **Cause**: Only `courseUpdateSchema` and `courseEditorSchema` exist
- **Impact**: POST endpoint has no validation schema available
- **Fix**: Create `courseCreateSchema` that requires title, slug, and optional other fields

### Issue 5: No Role-Based Access Control Check
- **Location**: Would be in POST /api/courses
- **Cause**: Not implemented yet
- **Impact**: Any authenticated user could create courses
- **Fix**: Add role check similar to GET /api/courses/[id]:
  ```typescript
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Check roles: super_admin, ol_admin, ol_content
  ```

---

## 9. What's Working

1. **Course Data Layer**
   - Database schema is complete and normalized
   - `listCourses()` function works perfectly
   - Direct PostgreSQL connection works without issues

2. **Course Display**
   - List view displays courses correctly with all details
   - Gallery view shows cards with stats
   - Filtering, search, and sorting all function properly
   - Responsive UI works in both mobile and desktop

3. **Course Details**
   - Individual course pages load and display content
   - Course detail view (`[slug]/page.tsx`) works
   - Modules and lessons display correctly
   - All nested data loads properly

4. **Content Structure**
   - Modules and lessons are fully functional
   - Quiz builder is implemented (Phase 7)
   - Audio support is implemented (Phase 8)
   - Learning sequences are implemented (Phase 9)
   - Progress & Analytics are implemented (Phase 10)

---

## 10. What's Missing

### For Course Creation
1. POST `/api/courses` route - **CRITICAL**
2. Course creation modal/form component
3. `courseCreateSchema` validation
4. Button handlers in CoursesPageClient & CoursesGallery
5. Error handling and toast notifications

### For Better UX
1. Loading states during course creation
2. Success/error notifications
3. Slug auto-generation from title
4. Form validation feedback
5. Cancel/back navigation

---

## 11. Implementation Sequence

To fully enable course creation, implement in this order:

1. **Create validation schema** (~10 lines)
   - File: `lib/validations/course-builder.ts`
   - Add `courseCreateSchema` with required fields

2. **Create POST endpoint** (~50 lines)
   - File: `app/api/courses/route.ts` (new)
   - Add POST handler with validation & creation logic
   - Add role-based access control

3. **Create course form component** (~150 lines)
   - Create new modal or form component
   - Include title, slug, entity scope, initial level/category
   - Add auto-slug generation

4. **Wire up button handlers** (~20 lines)
   - Update CoursesPageClient.tsx button onClick
   - Update CoursesGallery.tsx button onClick
   - Open modal or navigate to form

5. **Add success/error handling** (~30 lines)
   - Toast notifications on success/failure
   - Redirect to course details on creation
   - Refresh course list

---

## 12. File Locations Reference

| Purpose | File Path | Status |
|---------|-----------|--------|
| Page (Server) | `/apps/admin/app/dashboard/courses/page.tsx` | Complete |
| Page (Client) | `/apps/admin/app/dashboard/courses/CoursesPageClient.tsx` | Needs button handler |
| Data Table | `/apps/admin/app/dashboard/courses/CoursesDataTable.tsx` | Complete |
| Gallery View | `/apps/admin/app/dashboard/courses/CoursesGallery.tsx` | Needs button handler |
| Column Defs | `/apps/admin/app/dashboard/courses/columns.tsx` | Complete |
| DB Functions | `/apps/admin/lib/db/courses.ts` | Complete |
| Types | `/apps/admin/types/content.ts` | Complete |
| Validations | `/apps/admin/lib/validations/course-builder.ts` | Missing courseCreateSchema |
| API [id] | `/apps/admin/app/api/courses/[id]/route.ts` | Complete (GET/PATCH) |
| API Root | `/apps/admin/app/api/courses/route.ts` | **MISSING (POST/GET)** |
| DB Migration | `/shared/database/migrations/020_create_courses_standalone.sql` | Complete |
| Modules Migration | `/shared/database/migrations/022_create_course_modules.sql` | Complete |
| Lessons Migration | `/shared/database/migrations/023_create_course_lessons.sql` | Complete |

---

## Conclusion

The course builder infrastructure is **95% complete**. All the heavy lifting (database, data layer, UI components, child features) is done. What's missing is straightforward:

1. One validation schema
2. One API route file with POST handler
3. One form/modal component
4. Button event handlers

These are quick wins that unblock course creation functionality.

