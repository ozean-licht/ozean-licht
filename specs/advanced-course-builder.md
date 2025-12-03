# Plan: Advanced Course Builder - Modern LMS Features

## Overview

Professional-grade Course Builder for Ozean Licht Akademie with rich content editing, interactive quizzes, learning sequences, and analytics.

**Status:** Phase 10 Complete | **Next:** Phase 11 (Course Display & Creation)

---

## Quick Reference

| Item | Value |
|------|-------|
| **Database** | `ozean-licht-db` (64 courses, 571 videos) |
| **Container** | `iccc0wo0wkgsws4cowk4440c` (port 32771) |
| **Env Var** | `OZEAN_LICHT_DB_URL` for content DB |
| **Location** | `apps/admin/app/dashboard/courses/` |
| **Airtable** | Source of truth for course content |

---

## Completed Phases Summary

### Phase 1-5: Foundation (Pre-existing)
- Course/Module/Lesson CRUD with drag-drop reorder
- Video picker (571 videos), Image upload (MinIO S3)
- Course editor modal, Lesson editor modal (4 content types)
- Zod validation schemas

### Phase 6: Rich Content Editing ✅
**Files:** `RichTextEditor.tsx`, `PdfUploader.tsx`, `lib/tiptap/`

| Feature | Implementation |
|---------|----------------|
| TipTap WYSIWYG | StarterKit + Link, Image, YouTube, Highlight, Underline |
| PDF Upload | MinIO S3 with 10MB limit, MIME validation |
| Media Embeds | YouTube/Vimeo inline embedding |
| Security | SSR-safe DOMPurify, SSRF protection |

### Phase 7: Interactive Quiz Builder ✅
**Files:** `components/courses/quiz/` (9 files), `types/quiz.ts`

| Feature | Implementation |
|---------|----------------|
| Question Types | Multiple choice, True/False, Fill-in-blank |
| Quiz Settings | Pass score, max attempts, timer, shuffle |
| Quiz Preview | Interactive test-taking simulation |
| Security | XSS sanitization, Zod validation, ErrorBoundary |

### Phase 8: Audio & Multi-format ✅
**Files:** `AudioUploader.tsx`, `AudioPlayer.tsx`, `TranscriptEditor.tsx`

| Feature | Implementation |
|---------|----------------|
| Audio Upload | MinIO `course-audio` bucket |
| Audio Player | Seek, speed, skip controls |
| Transcripts | Plain text + timestamp support |

### Phase 9: Learning Sequences ✅
**Files:** `PrerequisiteSelector.tsx`, `DripScheduler.tsx`, `CompletionRulesEditor.tsx`

| Feature | Implementation |
|---------|----------------|
| Prerequisites | Lesson dependency picker |
| Drip Scheduling | Calendar-based content release |
| Completion Rules | Course/module unlock conditions |
| DB Tables | `lesson_prerequisites`, `drip_schedules` |

### Phase 10: Progress & Analytics ✅
**Files:** `components/courses/analytics/` (5 files), `lib/db/progress.ts`, `lib/db/analytics.ts`

| Feature | Implementation |
|---------|----------------|
| Progress Tracking | Per-user lesson progress, enrollments |
| Analytics Dashboard | Stats, charts, funnel analysis |
| Export | CSV/JSON with formula injection protection |
| DB Tables | `user_lesson_progress`, `course_enrollments`, `analytics_events` |

---

## Current Issues (P0 Blockers)

### Issue 1: Courses Not Displaying
**Symptom:** `/dashboard/courses` shows empty list despite 64 courses in DB

**Root Cause:** Missing `OZEAN_LICHT_DB_URL` environment variable in running admin app

**Fix:**
```bash
# Add to apps/admin/.env.local
OZEAN_LICHT_DB_URL=postgresql://postgres:XXX@localhost:32771/ozean-licht-db
```

### Issue 2: "+ New Course" Button Dead
**Location:** `CoursesPageClient.tsx:88-91`

**Root Cause:**
1. Button has no `onClick` handler
2. No POST endpoint at `/api/courses`
3. `CourseEditorModal` requires existing course (edit-only)

### Issue 3: Airtable Data Stale
**Symptom:** Images, subtitles updated in Airtable not reflected in DB

**Root Cause:** One-time migration on 2025-11-28, no sync mechanism

---

## Phase 11: Course Display & Creation Flow

**Goal:** Fix course listing display and enable new course creation

**Priority:** P0 - Blocking all manual testing

### 11.1 Fix Environment Configuration
- [ ] Document required env vars in `.env.example`
- [ ] Add startup check for `OZEAN_LICHT_DB_URL`
- [ ] Show helpful error message when DB connection fails

### 11.2 Create Course API Endpoint
**File:** `app/api/courses/route.ts` (NEW)

```typescript
// POST /api/courses - Create new course
// GET /api/courses - List courses with pagination
```

**Requirements:**
- Auth check (`requireAnyRole(['super_admin', 'ol_admin', 'ol_content'])`)
- Zod validation for input
- Auto-generate slug from title
- Return created course with ID

### 11.3 Add Course Create Schema
**File:** `lib/validations/course-builder.ts`

```typescript
export const courseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(), // Auto-generate if missing
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category: z.string().optional(),
  entityScope: z.enum(['ozean_licht', 'kids_ascension']).default('ozean_licht'),
  priceCents: z.number().min(0).default(0),
  currency: z.string().default('EUR'),
});
```

### 11.4 Wire Up New Course Button
**File:** `CoursesPageClient.tsx`

```typescript
// Add state for create modal
const [showCreateModal, setShowCreateModal] = useState(false);

// Add onClick handler
<Button onClick={() => setShowCreateModal(true)}>
  <Plus className="h-4 w-4 mr-2" />
  New Course
</Button>
```

### 11.5 Create Course Modal
**Option A:** Extend `CourseEditorModal` to support create mode (course prop optional)
**Option B:** Create minimal `CreateCourseModal` with title + slug only

**Recommendation:** Option A - reuse existing modal, add create logic

### 11.6 Post-Creation Flow
1. Create course via POST `/api/courses`
2. Show success toast
3. Redirect to `/dashboard/courses/[slug]` for editing

### Deliverables
| File | Type | Purpose |
|------|------|---------|
| `app/api/courses/route.ts` | NEW | POST/GET endpoints |
| `lib/validations/course-builder.ts` | EDIT | Add `courseCreateSchema` |
| `CoursesPageClient.tsx` | EDIT | Add create modal state + handler |
| `CourseEditorModal.tsx` | EDIT | Support create mode (optional course prop) |

---

## Phase 12: Airtable Course Reimport

**Goal:** Sync course data from Airtable (images, subtitles, new courses)

**Priority:** P1 - Required for accurate course display

### 12.1 Airtable Course Schema Mapping

| Airtable Field | DB Column | Notes |
|----------------|-----------|-------|
| `title` | `title` | Required |
| `slug` | `slug` | Preserve from Airtable |
| `description` | `description` | Rich text |
| `short_description` | `short_description` | Excerpt |
| `thumbnail` | `thumbnail_url` | Attachment URL |
| `cover_image` | `cover_image_url` | Attachment URL |
| `is_public` | `status` | true → 'published', false → 'draft' |
| `level` | `level` | beginner/intermediate/advanced |
| `tags` | `category` | First tag as category |
| `price` | `price_cents` | EUR * 100 |
| `Record ID` | `airtable_id` | For upsert matching |

### 12.2 Migration Script Enhancement
**File:** `tools/mcp-gateway/scripts/migrate-courses.ts`

**Changes Required:**
1. Add upsert logic (INSERT ... ON CONFLICT UPDATE)
2. Map new fields: `thumbnail`, `cover_image`, `short_description`
3. Handle attachment URLs from Airtable
4. Log changes (new, updated, unchanged counts)

### 12.3 Upsert SQL Pattern

```sql
INSERT INTO courses (
  airtable_id, title, slug, description, short_description,
  thumbnail_url, cover_image_url, price_cents, currency,
  status, level, category, entity_scope
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
ON CONFLICT (airtable_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  cover_image_url = EXCLUDED.cover_image_url,
  price_cents = EXCLUDED.price_cents,
  status = EXCLUDED.status,
  level = EXCLUDED.level,
  category = EXCLUDED.category,
  updated_at = NOW()
RETURNING id, airtable_id,
  CASE WHEN xmax = 0 THEN 'inserted' ELSE 'updated' END as operation;
```

### 12.4 Add Unique Constraint for Upsert
**Migration:** `migrations/020_airtable_upsert.sql`

```sql
-- Add unique constraint on airtable_id for upsert
ALTER TABLE courses
ADD CONSTRAINT courses_airtable_id_unique UNIQUE (airtable_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_courses_airtable_id ON courses(airtable_id);
```

### 12.5 Run Migration Command

```bash
# From project root
cd tools/mcp-gateway && npx tsx scripts/migrate-courses.ts

# Expected output:
# Fetched 68 courses from Airtable
# Inserted: 4 new courses
# Updated: 64 existing courses
# Unchanged: 0
# Migration complete!
```

### 12.6 Verify Import

```bash
# Check counts
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" \
  -c "SELECT COUNT(*) as total, status FROM courses GROUP BY status;"

# Check images populated
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" \
  -c "SELECT COUNT(*) as has_thumbnail FROM courses WHERE thumbnail_url IS NOT NULL;"
```

### Deliverables
| File | Type | Purpose |
|------|------|---------|
| `migrations/020_airtable_upsert.sql` | NEW | Unique constraint for airtable_id |
| `tools/mcp-gateway/scripts/migrate-courses.ts` | EDIT | Upsert logic + new fields |
| `tools/mcp-gateway/scripts/verify-migration.ts` | NEW | Post-import verification |

---

## Future Phases (Paused)

### Phase 13: Certificates & PDF Generation
- Certificate template designer
- PDF generation with `@react-pdf/renderer`
- Verification page (public URL)
- Auto-issue on course completion

### Phase 14: Learning Paths
- Multi-course sequences
- Path enrollment and progress
- Path completion certificates

### Phase 15: Achievements & Gamification
- Badge definitions and triggers
- User achievement tracking
- Profile badge display

---

## Implementation Order

```
Phase 11.1 → Fix env vars (5 min)
Phase 11.2 → Create /api/courses route (30 min)
Phase 11.3 → Add Zod schema (10 min)
Phase 11.4 → Wire up button (10 min)
Phase 11.5 → Extend CourseEditorModal (45 min)
Phase 11.6 → Add redirect flow (15 min)
---
Phase 12.1 → Document field mapping (10 min)
Phase 12.2 → Update migration script (45 min)
Phase 12.3 → Create upsert migration (10 min)
Phase 12.4 → Run migration (5 min)
Phase 12.5 → Verify results (10 min)
```

**Total Estimated Time:** ~3 hours

---

## Validation Commands

```bash
# Check database connection
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" -c "SELECT 1"

# Count courses
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" \
  -c "SELECT COUNT(*), status FROM courses GROUP BY status;"

# Type check
cd apps/admin && pnpm typecheck

# Build
cd apps/admin && pnpm build

# Start dev
cd apps/admin && pnpm dev
```

---

## Files Reference

### High-Gravity Files
| File | Purpose |
|------|---------|
| `lib/db/courses.ts` | Course CRUD (createCourse, listCourses ready) |
| `lib/db/index.ts` | PostgreSQL pool, requires OZEAN_LICHT_DB_URL |
| `app/dashboard/courses/page.tsx` | Server component, fetches via listCourses() |
| `CoursesPageClient.tsx` | Client container, view toggle, NEW button (broken) |
| `CourseEditorModal.tsx` | Edit-only modal (needs create mode) |

### API Endpoints (Existing)
| Endpoint | Methods | Status |
|----------|---------|--------|
| `/api/courses/[id]` | GET, PATCH | ✅ Works |
| `/api/courses/[id]/modules` | GET, POST | ✅ Works |
| `/api/courses/[id]/modules/[moduleId]/lessons` | GET, POST | ✅ Works |
| `/api/courses` | GET, POST | ❌ Missing |

### Migration Scripts
| Script | Purpose |
|--------|---------|
| `tools/mcp-gateway/scripts/migrate-courses.ts` | Airtable → PostgreSQL |
| `tools/mcp-gateway/scripts/migrate-projects.ts` | Projects migration |

---

*Spec updated: 2025-12-03 | Focus: Phase 11-12 | Phases 13-15 paused*
