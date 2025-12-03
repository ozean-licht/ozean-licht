# Plan: Advanced Course Builder - Modern LMS Features

## Task Description

Design and implement a comprehensive, modern course builder that rivals industry-leading LMS platforms (Teachable, Thinkific, Kajabi). This spec builds upon the existing Phase 1-5 foundation to add advanced features: rich text editing, interactive quiz builder, learning paths, progress analytics, scheduling, prerequisites, certificates, and AI-assisted content creation.

## Objective

Transform the Ozean Licht Course Builder from a basic CRUD interface into a professional-grade Learning Management System that:
1. Enables rich, multimedia content creation without technical expertise
2. Supports diverse learning formats (video, text, audio, interactive quizzes)
3. Tracks learner progress with detailed analytics
4. Automates content delivery with drip scheduling
5. Issues completion certificates
6. Supports multi-course learning paths
7. Provides AI-assisted content suggestions

## Problem Statement

The current course builder handles basic CRUD operations for courses, modules, and lessons but lacks:
- **Rich content editing** - Plain textarea for text lessons; no WYSIWYG
- **Interactive quizzes** - Quiz content type exists but has no builder
- **Audio content** - No support for podcast-style lessons
- **PDF uploads** - Only URL entry, no direct file upload
- **Learning sequences** - No prerequisites or drip scheduling
- **Analytics** - No insight into learner engagement
- **Automation** - Manual publishing only

## Current Implementation Status

### What Exists (Phase 1-5 Complete)
| Feature | Status | Location |
|---------|--------|----------|
| Course CRUD | ✅ | `lib/db/courses.ts`, `app/api/courses/` |
| Module CRUD | ✅ | `lib/db/modules.ts`, `app/api/courses/[id]/modules/` |
| Lesson CRUD | ✅ | `lib/db/lessons.ts`, `app/api/lessons/` |
| Drag-drop reorder | ✅ | `ModuleList.tsx`, `LessonList.tsx` (via @dnd-kit) |
| Video picker | ✅ | `VideoPicker.tsx` (searchable, 571 videos) |
| Image upload | ✅ | `ImageUploader.tsx` (MinIO S3) |
| Course editor modal | ✅ | `CourseEditorModal.tsx` (tabbed form) |
| Lesson editor modal | ✅ | `LessonEditorModal.tsx` (4 content types) |
| Validation | ✅ | `lib/validations/course-builder.ts` (Zod) |

### What's Missing
| Feature | Priority | Complexity |
|---------|----------|------------|
| Rich text editor | P1 | Medium |
| Quiz builder | P1 | High |
| Audio lessons | P2 | Low |
| PDF upload | P2 | Low |
| Learning paths | P2 | High |
| Drip scheduling | P2 | Medium |
| Prerequisites | P2 | Medium |
| Progress tracking | P1 | High |
| Course analytics | P2 | Medium |
| Certificates | P3 | Medium |
| AI content assist | P3 | High |
| Course duplication | P2 | Low |
| Bulk operations | P3 | Low |

## Solution Approach

Implement in 6 phases over 4-6 weeks, with each phase delivering usable functionality:

```
Phase 6: Rich Content Editing
├── TipTap WYSIWYG editor
├── Markdown with live preview
├── Media embedding (YouTube, Vimeo)
└── PDF file upload to MinIO

Phase 7: Interactive Quiz Builder
├── Multiple choice questions
├── True/false questions
├── Fill-in-the-blank
├── Quiz settings (passing score, retakes)
└── Question bank/library

Phase 8: Audio & Multi-format
├── Audio lesson type
├── Audio player component
├── Transcript support
└── Podcast RSS export (future)

Phase 9: Learning Sequences
├── Lesson prerequisites
├── Module unlock rules
├── Drip scheduling calendar
└── Completion requirements

Phase 10: Progress & Analytics
├── User progress tracking schema
├── Course completion rates
├── Lesson engagement metrics
├── Time-on-content tracking
└── Analytics dashboard

Phase 11: Certificates & Paths
├── Certificate templates
├── Completion triggers
├── PDF generation
├── Learning paths (multi-course)
└── Achievement badges
```

## Relevant Files

### Existing Files to Extend
| File | Purpose | Changes |
|------|---------|---------|
| `types/content.ts` | Type definitions | Add quiz, audio, progress, certificate types |
| `lib/db/lessons.ts` | Lesson queries | Add audio fields, enhance quiz_data handling |
| `lib/validations/course-builder.ts` | Zod schemas | Add quiz, audio, prerequisite validation |
| `LessonEditorModal.tsx` | Lesson form | Integrate rich editor, quiz builder |
| `app/api/lessons/[lessonId]/route.ts` | Lesson API | Handle new content types |

### Shared UI Components to Use
| Component | Import | Use For |
|-----------|--------|---------|
| `CossUIDialog` | `@shared/ui` | Quiz question editor modals |
| `CossUITabs` | `@shared/ui` | Quiz builder sections |
| `CossUIRadioGroup` | `@shared/ui` | Multiple choice options |
| `CossUICheckbox` | `@shared/ui` | Multi-select questions |
| `CossUISlider` | `@shared/ui` | Passing score threshold |
| `CossUIProgress` | `@shared/ui` | Progress indicators |
| `CossUISwitch` | `@shared/ui` | Toggle settings |
| `Calendar` | `@shared/ui` | Drip schedule picker |
| `Chart` | `@shared/ui` | Analytics visualizations |
| `FileDropzone` | `@shared/ui` (storage) | PDF/audio upload |
| `FilePreviewDialog` | `@shared/ui` (storage) | PDF preview |

### New Files to Create

**Phase 6: Rich Content**
```
components/courses/
├── RichTextEditor.tsx         # TipTap WYSIWYG wrapper
├── MarkdownPreview.tsx        # Markdown → HTML preview
├── MediaEmbedDialog.tsx       # YouTube/Vimeo embed
└── PdfUploader.tsx            # PDF file upload

lib/
└── tiptap/
    ├── extensions.ts          # Custom TipTap extensions
    └── menu-bar.tsx           # Editor toolbar
```

**Phase 7: Quiz Builder**
```
components/courses/quiz/
├── QuizBuilder.tsx            # Main quiz authoring interface
├── QuestionEditor.tsx         # Single question editor
├── QuestionList.tsx           # Sortable question list
├── MultipleChoiceEditor.tsx   # MC question type
├── TrueFalseEditor.tsx        # T/F question type
├── FillBlankEditor.tsx        # Fill-in-blank type
├── QuestionBank.tsx           # Reusable question library
├── QuizSettings.tsx           # Pass score, retakes, timer
└── QuizPreview.tsx            # Test-taker preview

types/
└── quiz.ts                    # Quiz-specific types

lib/db/
└── quizzes.ts                 # Quiz query functions

app/api/quizzes/
├── route.ts                   # Quiz CRUD
├── [id]/route.ts              # Single quiz
└── [id]/questions/route.ts    # Question CRUD
```

**Phase 8: Audio Lessons**
```
components/courses/
├── AudioUploader.tsx          # Audio file upload
├── AudioPlayer.tsx            # Waveform player
└── TranscriptEditor.tsx       # Transcript input

lib/db/
└── audio.ts                   # Audio metadata queries
```

**Phase 9: Learning Sequences**
```
components/courses/
├── PrerequisiteSelector.tsx   # Lesson dependency picker
├── DripScheduler.tsx          # Content release calendar
├── UnlockRuleEditor.tsx       # Module unlock conditions
└── CompletionRulesEditor.tsx  # Course completion requirements

lib/db/
├── prerequisites.ts           # Prerequisite queries
└── schedules.ts               # Drip schedule queries

migrations/
├── 024_lesson_prerequisites.sql
└── 025_drip_schedules.sql
```

**Phase 10: Progress & Analytics**
```
components/courses/analytics/
├── ProgressDashboard.tsx      # Overview stats
├── LessonEngagementChart.tsx  # Time-on-content
├── CompletionFunnel.tsx       # Drop-off analysis
├── UserProgressTable.tsx      # Individual progress
└── ExportAnalyticsButton.tsx  # CSV export

lib/db/
├── progress.ts                # User progress queries
└── analytics.ts               # Aggregated metrics

app/api/
├── progress/route.ts          # Progress tracking
└── analytics/courses/[id]/route.ts

migrations/
├── 026_user_lesson_progress.sql
└── 027_analytics_events.sql
```

**Phase 11: Certificates & Paths**
```
components/courses/
├── CertificateDesigner.tsx    # Template editor
├── CertificatePreview.tsx     # PDF preview
├── LearningPathBuilder.tsx    # Multi-course sequence
└── AchievementBadges.tsx      # Gamification badges

lib/
├── certificates/
│   ├── templates.ts           # Certificate templates
│   └── pdf-generator.ts       # PDF generation (pdfkit)
└── db/
    ├── certificates.ts        # Certificate queries
    └── learning-paths.ts      # Path queries

migrations/
├── 028_certificates.sql
├── 029_learning_paths.sql
└── 030_achievements.sql
```

## Implementation Phases

### Phase 6: Rich Content Editing (Week 1)
**Goal:** Replace plain textarea with WYSIWYG editor for text lessons

**Deliverables:**
1. Install TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-*`)
2. Create `RichTextEditor.tsx` with formatting toolbar
3. Add media embed support (YouTube, Vimeo)
4. Create `PdfUploader.tsx` using `FileDropzone` from shared-ui
5. Update `LessonEditorModal.tsx` to use rich editor for text type
6. Add PDF upload API route using existing MinIO client

**Parallel Subagent Opportunities:**
- Agent 1: TipTap integration + extensions
- Agent 2: PDF upload component + API
- Agent 3: Update lesson editor modal

**Dependencies:**
```bash
cd apps/admin && pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-youtube @tiptap/extension-placeholder @tiptap/extension-highlight @tiptap/extension-underline
```

---

### Phase 7: Interactive Quiz Builder (Week 2)
**Goal:** Full quiz authoring with multiple question types

**Deliverables:**
1. Design quiz data schema (JSONB structure)
2. Create `QuizBuilder.tsx` - main interface
3. Implement question type editors (MC, T/F, Fill-blank)
4. Add drag-drop question reordering
5. Create `QuizSettings.tsx` (passing score, retakes, timer)
6. Create `QuizPreview.tsx` for testing
7. Add quiz validation to lesson form
8. Create question bank API for reusability

**Database Schema (quiz_data JSONB):**
```typescript
interface QuizData {
  settings: {
    passingScore: number;      // 0-100
    maxAttempts: number;       // -1 = unlimited
    timeLimitMinutes?: number;
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    showCorrectAnswers: boolean;
    showFeedback: boolean;
  };
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  question: string;
  points: number;
  required: boolean;
  explanation?: string;
  // Type-specific fields
  options?: QuizOption[];      // For MC
  correctAnswer?: boolean;     // For T/F
  blanks?: BlankAnswer[];      // For fill-blank
  pairs?: MatchPair[];         // For matching
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}
```

**Parallel Subagent Opportunities:**
- Agent 1: QuizBuilder main component + types
- Agent 2: Question type editors (MC, T/F)
- Agent 3: Quiz settings + preview
- Agent 4: Question bank API + DB functions

---

### Phase 8: Audio & Multi-format (Week 3)
**Goal:** Support audio lessons with transcripts

**Deliverables:**
1. Add `audio` content type to lesson schema
2. Create `AudioUploader.tsx` with waveform preview
3. Create `AudioPlayer.tsx` with seek, speed, skip controls
4. Add `TranscriptEditor.tsx` for accessibility
5. Store audio in MinIO `course-audio` bucket
6. Add audio duration extraction (FFprobe or client-side)

**New Fields:**
```typescript
interface Lesson {
  // Existing...
  audioUrl?: string;          // For audio type
  audioMimeType?: string;
  transcript?: string;        // Plain text or SRT
  transcriptTimestamps?: TranscriptSegment[];
}

interface TranscriptSegment {
  start: number;              // seconds
  end: number;
  text: string;
}
```

**Parallel Subagent Opportunities:**
- Agent 1: AudioUploader + MinIO integration
- Agent 2: AudioPlayer component
- Agent 3: Transcript editor + sync

---

### Phase 9: Learning Sequences (Week 4)
**Goal:** Implement prerequisites, drip scheduling, completion rules

**Deliverables:**
1. Create `lesson_prerequisites` table
2. Create `drip_schedules` table
3. Build `PrerequisiteSelector.tsx` for lesson dependencies
4. Build `DripScheduler.tsx` with calendar picker
5. Add `UnlockRuleEditor.tsx` for module conditions
6. Create `CompletionRulesEditor.tsx` for course requirements
7. Update course/module/lesson APIs to enforce rules

**Database Migrations:**

```sql
-- 024_lesson_prerequisites.sql
CREATE TABLE lesson_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  required_lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'completion' CHECK (type IN ('completion', 'passing_score')),
  min_score INTEGER, -- For passing_score type
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, required_lesson_id)
);

-- 025_drip_schedules.sql
CREATE TABLE drip_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  release_type TEXT NOT NULL CHECK (release_type IN (
    'immediate',          -- Available on enrollment
    'fixed_date',         -- Specific calendar date
    'relative_days',      -- N days after enrollment
    'after_lesson',       -- After completing another lesson
    'after_module'        -- After completing another module
  )),
  release_date TIMESTAMPTZ,
  relative_days INTEGER,
  after_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  after_module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Parallel Subagent Opportunities:**
- Agent 1: Prerequisites UI + API
- Agent 2: Drip scheduler + calendar integration
- Agent 3: Unlock rules + completion requirements

---

### Phase 10: Progress & Analytics (Week 5)
**Goal:** Track learner progress and visualize engagement

**Deliverables:**
1. Create `user_lesson_progress` table
2. Create `analytics_events` table
3. Build progress tracking API (start, update, complete)
4. Create `ProgressDashboard.tsx` with Chart components
5. Create `LessonEngagementChart.tsx` (time-on-content)
6. Create `CompletionFunnel.tsx` (drop-off analysis)
7. Create `UserProgressTable.tsx` (per-user view)
8. Add CSV export for analytics

**Database Migrations:**

```sql
-- 026_user_lesson_progress.sql
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References users table
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  time_spent_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0, -- For video/audio
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_progress_course ON user_lesson_progress(course_id);
CREATE INDEX idx_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_progress_status ON user_lesson_progress(status);

-- 027_analytics_events.sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON analytics_events(event_type);
CREATE INDEX idx_events_course ON analytics_events(course_id);
CREATE INDEX idx_events_created ON analytics_events(created_at);
```

**Parallel Subagent Opportunities:**
- Agent 1: Progress tracking schema + API
- Agent 2: Analytics dashboard components
- Agent 3: Export functionality

---

### Phase 11: Certificates & Learning Paths (Week 6)
**Goal:** Issue certificates and create multi-course sequences

**Deliverables:**
1. Create certificate template schema
2. Build `CertificateDesigner.tsx` with drag-drop elements
3. Implement PDF generation using `@react-pdf/renderer`
4. Create `LearningPathBuilder.tsx` for course sequences
5. Add achievement badges for gamification
6. Create certificate verification page (public URL)

**Database Migrations:**

```sql
-- 028_certificates.sql
CREATE TABLE certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL, -- Design elements, positions
  background_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  certificate_number TEXT UNIQUE NOT NULL, -- Verification code
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  metadata JSONB
);

-- 029_learning_paths.sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  entity_scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE learning_path_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(path_id, course_id)
);

-- 030_achievements.sql
CREATE TABLE achievement_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  badge_type TEXT CHECK (badge_type IN (
    'course_complete',
    'path_complete',
    'quiz_perfect',
    'streak_days',
    'lessons_count'
  )),
  trigger_data JSONB, -- Conditions for earning
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES achievement_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, badge_id)
);
```

**Dependencies:**
```bash
cd apps/admin && pnpm add @react-pdf/renderer
```

**Parallel Subagent Opportunities:**
- Agent 1: Certificate templates + designer
- Agent 2: PDF generation + verification
- Agent 3: Learning paths UI
- Agent 4: Achievement badges

---

## Missing Components to Create

### Phase 6 - New Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `RichTextEditor` | WYSIWYG with toolbar | TipTap, CossUIToolbar |
| `MarkdownPreview` | Live MD→HTML preview | react-markdown |
| `MediaEmbedDialog` | YouTube/Vimeo embed | CossUIDialog, CossUIInput |
| `PdfUploader` | PDF file upload | FileDropzone, MinIO |

### Phase 7 - Quiz Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `QuizBuilder` | Quiz authoring main | CossUITabs, DnD |
| `QuestionEditor` | Question form | CossUIDialog, Form components |
| `MultipleChoiceEditor` | MC question | CossUIRadioGroup, CossUIInput |
| `TrueFalseEditor` | T/F question | CossUISwitch |
| `FillBlankEditor` | Fill-blank | CossUIInput |
| `QuizSettings` | Settings panel | CossUISlider, CossUISwitch |
| `QuizPreview` | Test preview | CossUICard |

### Phase 8 - Audio Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `AudioUploader` | Audio upload | FileDropzone, MinIO |
| `AudioPlayer` | Playback controls | Custom + CossUISlider |
| `TranscriptEditor` | Transcript input | CossUITextarea |

### Phase 9 - Sequence Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `PrerequisiteSelector` | Dependency picker | CossUICombobox |
| `DripScheduler` | Release calendar | Calendar |
| `UnlockRuleEditor` | Unlock conditions | CossUISelect |
| `CompletionRulesEditor` | Course completion | CossUICheckbox |

### Phase 10 - Analytics Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `ProgressDashboard` | Overview stats | CossUICard, Chart |
| `LessonEngagementChart` | Time-on-content | Chart |
| `CompletionFunnel` | Drop-off view | Chart |
| `UserProgressTable` | Per-user table | CossUITable |
| `ExportAnalyticsButton` | CSV export | CossUIButton |

### Phase 11 - Certificate Components
| Component | Purpose | Uses |
|-----------|---------|------|
| `CertificateDesigner` | Template editor | DnD, CossUIDialog |
| `CertificatePreview` | PDF preview | @react-pdf/renderer |
| `LearningPathBuilder` | Path editor | DnD, CossUICard |
| `AchievementBadges` | Badge display | CossUIBadge |

---

## Step by Step Tasks

### 1. Phase 6 Setup - TipTap Integration ✅ COMPLETE (2025-12-03)
- [x] Install TipTap packages (@tiptap/react, starter-kit, extensions)
- [x] Create `lib/tiptap/extensions.ts` with custom extensions
- [x] Create `lib/tiptap/menu-bar.tsx` with formatting toolbar
- [x] Create `components/courses/RichTextEditor.tsx`
- [x] Add media embed support for YouTube/Vimeo

### 2. Phase 6 - PDF Upload ✅ COMPLETE (2025-12-03)
- [x] Create `components/courses/PdfUploader.tsx` with upload + URL tabs
- [x] Create `app/api/upload/pdf/route.ts` for MinIO upload
- [x] Update `LessonEditorModal.tsx` PDF tab to use uploader
- [x] Add PDF preview with filename display

### 3. Phase 6 - Lesson Editor Integration ✅ COMPLETE (2025-12-03)
- [x] Replace textarea with `RichTextEditor` for text content type
- [x] Update lesson API to handle HTML content
- [x] Add content sanitization (isomorphic-dompurify - SSR-safe)
- [x] Add server-side sanitization in lib/db/lessons.ts
- [x] Add SSRF protection for user-provided URLs

### 4. Phase 7 - Quiz Data Types ✅ COMPLETE (2025-12-03)
- [x] Create `types/quiz.ts` with interfaces
- [x] Update `types/content.ts` to import quiz types
- [x] Add quiz validation schema to Zod

### 5. Phase 7 - Quiz Builder Components ✅ COMPLETE (2025-12-03)
- [x] Create `components/courses/quiz/QuizBuilder.tsx`
- [x] Create `QuestionEditor.tsx` with type-specific fields
- [x] Create `MultipleChoiceEditor.tsx`
- [x] Create `TrueFalseEditor.tsx`
- [x] Create `FillBlankEditor.tsx`
- [x] Add drag-drop question reordering

### 6. Phase 7 - Quiz Settings & Preview ✅ COMPLETE (2025-12-03)
- [x] Create `QuizSettings.tsx` (passing score, retakes, timer)
- [x] Create `QuizPreview.tsx` for testing
- [x] Integrate quiz builder into `LessonEditorModal.tsx`

### 7. Phase 7 - Question Bank (DEFERRED)
- [ ] Create `lib/db/quizzes.ts` for question queries
- [ ] Create `app/api/quizzes/` routes
- [ ] Create `QuestionBank.tsx` for reusable questions
- [ ] Add question import/export functionality

### 8. Phase 8 - Audio Lesson Support
- [ ] Add `audio` to `LessonContentType` union
- [ ] Create migration for audio fields
- [ ] Create `AudioUploader.tsx`
- [ ] Create `AudioPlayer.tsx` with waveform
- [ ] Create `TranscriptEditor.tsx`

### 9. Phase 9 - Prerequisites
- [ ] Create `024_lesson_prerequisites.sql` migration
- [ ] Create `lib/db/prerequisites.ts`
- [ ] Create `PrerequisiteSelector.tsx`
- [ ] Update lesson API to validate prerequisites

### 10. Phase 9 - Drip Scheduling
- [ ] Create `025_drip_schedules.sql` migration
- [ ] Create `lib/db/schedules.ts`
- [ ] Create `DripScheduler.tsx` with Calendar
- [ ] Create `UnlockRuleEditor.tsx`
- [ ] Create `CompletionRulesEditor.tsx`

### 11. Phase 10 - Progress Tracking ✅ COMPLETE (2025-12-03)
- [x] Create `017_user_lesson_progress.sql` migration
- [x] Create `018_analytics_events.sql` migration
- [x] Create `019_add_composite_indexes.sql` migration
- [x] Create `lib/db/progress.ts`
- [x] Create `lib/db/analytics.ts`
- [x] Create `app/api/progress/` routes
- [x] Create `app/api/analytics/courses/[id]/` routes

### 12. Phase 10 - Analytics Dashboard ✅ COMPLETE (2025-12-03)
- [x] Create `ProgressDashboard.tsx`
- [x] Create `LessonEngagementChart.tsx`
- [x] Create `CompletionFunnel.tsx`
- [x] Create `UserProgressTable.tsx`
- [x] Create `ExportAnalyticsButton.tsx`
- [x] Add analytics dashboard route (`/dashboard/courses/[slug]/analytics`)

### 13. Phase 11 - Certificates
- [ ] Create `028_certificates.sql` migration
- [ ] Install `@react-pdf/renderer`
- [ ] Create `CertificateDesigner.tsx`
- [ ] Create PDF generation utility
- [ ] Create verification page
- [ ] Add auto-issue on completion

### 14. Phase 11 - Learning Paths
- [ ] Create `029_learning_paths.sql` migration
- [ ] Create `lib/db/learning-paths.ts`
- [ ] Create `LearningPathBuilder.tsx`
- [ ] Create path enrollment API
- [ ] Add path progress tracking

### 15. Phase 11 - Achievements
- [ ] Create `030_achievements.sql` migration
- [ ] Create `AchievementBadges.tsx`
- [ ] Create badge earning triggers
- [ ] Add badge display on profile

### 16. Final Validation
- [ ] Run all migrations
- [ ] Type check: `pnpm typecheck`
- [ ] Build: `pnpm build`
- [ ] Test quiz flow end-to-end
- [ ] Test certificate generation
- [ ] Test analytics dashboard

---

## Testing Strategy

### Unit Tests
- Quiz data validation (Zod schemas)
- Progress calculation functions
- Certificate number generation

### Integration Tests
- Quiz submission flow
- Progress tracking API
- Certificate issuance

### Manual Testing Checklist
1. Create course with rich text lesson (TipTap)
2. Upload PDF to lesson
3. Create quiz with 5 questions
4. Set passing score to 80%
5. Complete quiz, verify pass/fail
6. Set lesson prerequisite
7. Verify lesson locked until prereq complete
8. Set drip schedule for module
9. Verify module hidden until date
10. Complete course, verify certificate issued
11. Download certificate PDF
12. Check analytics dashboard

---

## Acceptance Criteria

### Phase 6
- [ ] Rich text editor renders formatting in lessons
- [ ] YouTube/Vimeo embeds play inline
- [ ] PDFs can be uploaded and previewed

### Phase 7
- [ ] Quizzes can be created with 4 question types
- [ ] Passing score enforces completion
- [ ] Question bank allows reuse

### Phase 8
- [ ] Audio lessons play with controls
- [ ] Transcripts display with audio

### Phase 9
- [ ] Prerequisites block lesson access
- [ ] Drip scheduling unlocks on date
- [ ] Completion rules enforced

### Phase 10
- [ ] Progress tracked per user/lesson
- [ ] Analytics dashboard shows metrics
- [ ] CSV export works

### Phase 11
- [ ] Certificates generated on completion
- [ ] Learning paths sequence courses
- [ ] Achievements earned

---

## Validation Commands

```bash
# Install dependencies
cd apps/admin && pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-youtube @tiptap/extension-placeholder @tiptap/extension-highlight @tiptap/extension-underline dompurify @react-pdf/renderer

# Type check
cd apps/admin && pnpm typecheck

# Run migrations
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" < migrations/024_lesson_prerequisites.sql
# Repeat for each migration...

# Build
cd apps/admin && pnpm build

# Start dev server
cd apps/admin && pnpm dev
```

---

## Implementation Notes

### Phase 6 Implementation (2025-12-03)

**Files Created:**
| File | Lines | Purpose |
|------|-------|---------|
| `lib/tiptap/extensions.ts` | 113 | TipTap config (StarterKit, Link, Image, YouTube, Highlight, Underline) |
| `lib/tiptap/menu-bar.tsx` | 195 | Toolbar with formatting, headings, lists, blocks, media buttons |
| `components/courses/RichTextEditor.tsx` | 309 | WYSIWYG editor with dialogs for links, images, YouTube |
| `components/courses/PdfUploader.tsx` | 206 | PDF upload + URL entry with tabs, progress indicator |
| `app/api/upload/pdf/route.ts` | 156 | MinIO upload endpoint (10MB limit, course-pdfs bucket) |
| `lib/utils/sanitize.ts` | 109 | SSR-safe sanitization + SSRF protection utilities |

**Files Modified:**
| File | Changes |
|------|---------|
| `components/courses/LessonEditorModal.tsx` | Integrated RichTextEditor + PdfUploader |
| `lib/db/lessons.ts` | Added server-side HTML sanitization |
| `shared/ui/src/cossui/index.ts` | Exported CossUITooltipContent |
| `package.json` | Added TipTap + isomorphic-dompurify |

**Dependencies Added:**
```
@tiptap/react@3.12.0, @tiptap/starter-kit@3.12.0, @tiptap/pm@3.12.0
@tiptap/extension-{link,image,youtube,placeholder,highlight,underline}@3.12.0
isomorphic-dompurify@3.3.0
```

**Security Hardening:**
- SSR-safe HTML sanitization (client + server)
- SSRF protection blocking private IPs (127.*, 10.*, 192.168.*, 172.16-31.*)
- File extension + MIME type validation for PDF uploads
- Configurable file size via `PDF_MAX_SIZE_MB` env var

**Review:** `app_review/review_2025-12-03T15-30-00Z_phase6-rich-content.md`

---

### Phase 7 Implementation (2025-12-03)

**Files Created:**
| File | Lines | Purpose |
|------|-------|---------|
| `types/quiz.ts` | 403 | Quiz types (questions, settings, results, migration) |
| `components/courses/quiz/QuizBuilder.tsx` | 364 | Main quiz authoring interface with drag-drop |
| `components/courses/quiz/QuestionEditor.tsx` | 314 | Modal for editing individual questions |
| `components/courses/quiz/QuestionListItem.tsx` | 187 | Sortable question list item |
| `components/courses/quiz/MultipleChoiceEditor.tsx` | 210 | MC question editor with options |
| `components/courses/quiz/TrueFalseEditor.tsx` | 114 | T/F question editor |
| `components/courses/quiz/FillBlankEditor.tsx` | 179 | Fill-in-blank editor with multiple accepted answers |
| `components/courses/quiz/QuizSettings.tsx` | 227 | Quiz behavior settings (pass score, timer, etc.) |
| `components/courses/quiz/QuizPreview.tsx` | 429 | Interactive preview for testing quizzes |
| `components/courses/quiz/index.ts` | 22 | Barrel exports |
| `lib/utils/sanitize-quiz.ts` | ~50 | DOMPurify sanitization for quiz content |
| `components/ErrorBoundary.tsx` | ~80 | React error boundary for crash protection |

**Files Modified:**
| File | Changes |
|------|---------|
| `lib/validations/course-builder.ts` | +209 lines (quiz Zod schemas, validation helpers) |
| `components/courses/LessonEditorModal.tsx` | Integrated QuizBuilder, ErrorBoundary, migration |
| `app/api/lessons/[lessonId]/route.ts` | Added quiz_data server validation |
| `app/api/courses/[id]/modules/[moduleId]/lessons/route.ts` | Added quiz_data server validation |
| `lib/db/lessons.ts` | Added quiz_data support in create/update |
| `types/content.ts` | Added quizData to lesson input types |

**Security Fixes Applied:**
| Issue | Severity | Fix |
|-------|----------|-----|
| XSS in quiz content | Critical | DOMPurify sanitization via `renderSanitized()` |
| Missing API validation | Critical | Zod validation in POST/PATCH endpoints |
| No data migration | Critical | `migrateQuizData()` function for version upgrades |
| Weak ID generation | High | `crypto.randomUUID()` for secure IDs |
| Missing error boundaries | High | ErrorBoundary wrapping QuizBuilder |

**Review:** `app_review/review_2025-12-03T16-00-00Z_phase7-quiz-builder.md`

---

### Phase 10 Implementation (2025-12-03)

**Files Created:**
| File | Lines | Purpose |
|------|-------|---------|
| `migrations/017_user_lesson_progress.sql` | 139 | User progress, enrollments, views |
| `migrations/018_analytics_events.sql` | 220 | Event tracking, daily stats, funnel views |
| `migrations/019_add_composite_indexes.sql` | 52 | 9 performance indexes |
| `lib/db/progress.ts` | 710 | Progress CRUD, enrollment management |
| `lib/db/analytics.ts` | 692 | Event tracking, course analytics, funnel |
| `lib/logger.ts` | 102 | Secure logging with sensitive data redaction |
| `app/api/progress/route.ts` | 322 | Progress tracking API endpoints |
| `app/api/analytics/courses/[id]/route.ts` | 231 | Course analytics API |
| `components/courses/analytics/ProgressDashboard.tsx` | 323 | Overview stats, lesson table |
| `components/courses/analytics/LessonEngagementChart.tsx` | 272 | Time series charts (Recharts) |
| `components/courses/analytics/CompletionFunnel.tsx` | 318 | Drop-off analysis with alerts |
| `components/courses/analytics/UserProgressTable.tsx` | 354 | Paginated user enrollment table |
| `components/courses/analytics/ExportAnalyticsButton.tsx` | 290 | CSV/JSON export dropdown |
| `app/dashboard/courses/[slug]/analytics/page.tsx` | 91 | Server component for data fetching |
| `app/dashboard/courses/[slug]/analytics/AnalyticsDashboardClient.tsx` | 230 | Client UI with tabs |

**Database Tables:**
- `user_lesson_progress` - Per-user lesson progress tracking
- `course_enrollments` - User enrollment status and aggregated progress
- `analytics_events` - Detailed event log for tracking
- `analytics_daily_stats` - Pre-aggregated daily metrics

**Views Created:**
- `course_completion_stats` - Course-level completion metrics
- `lesson_engagement_stats` - Per-lesson engagement metrics
- `course_analytics_7d` - Real-time 7-day analytics
- `lesson_funnel` - Lesson drop-off analysis

**Security Hardening:**
| Issue | Severity | Fix |
|-------|----------|-----|
| SQL Injection | Critical | Parameterized queries in analytics.ts |
| Missing Authorization | Critical | Enrollment verification, admin role checks |
| CSV Injection | High | Formula prefix sanitization in exports |
| Type Assertion Bypass | High | Zod inference types instead of assertions |
| Pagination Abuse | High | Max limit 100, min offset 0 |
| UUID Validation | High | Zod UUID schema on all endpoints |
| Info Disclosure | Medium | Secure logger with data redaction |

**Review:** `app_review/review_2025-12-03T16-30-00Z_phase10-analytics.md`

---

## Known Issues & Future Enhancements

### BLOCKER: "+ New Course" Button Non-Functional

**Issue:** The "+ New Course" button in `app/dashboard/courses/CoursesPageClient.tsx` (line 88-91) has no `onClick` handler and does nothing when clicked.

**Root Cause:**
1. Button has no event handler attached
2. No POST API endpoint exists at `/api/courses` for creating courses
3. `CourseEditorModal` is designed for editing only (requires existing `course` prop)

**Required Fix:**
```
1. Create `app/api/courses/route.ts` with POST handler
2. Add state + handler in CoursesPageClient.tsx
3. Either:
   a. Modify CourseEditorModal to support create mode (course prop optional)
   b. Create separate CreateCourseModal component
4. After creation, redirect to course builder page
```

**Priority:** P0 - Blocks manual testing of course builder

---

### Enhancement: Framer-Style Publish & Preview UX

**Inspiration:** Framer's floating publish button and instant preview functionality

**Proposed Features:**

| Feature | Description | Components |
|---------|-------------|------------|
| **Floating Publish Button** | Sticky button showing draft/published status, one-click publish | `PublishButton.tsx` |
| **Preview Mode** | Open course in student view without publishing | `PreviewButton.tsx`, `/preview/[slug]` route |
| **Status Badge** | Visual indicator (Draft/Published/Scheduled) | Integrate into course header |
| **Publish Confirmation** | Modal with checklist before publishing | `PublishConfirmModal.tsx` |
| **Version History** | Track changes, allow rollback | Future enhancement |

**Implementation Location:** Course builder page (`app/dashboard/courses/[slug]/page.tsx`)

**Priority:** P2 - UX enhancement after core functionality complete

---

## Notes

### Parallel Development Strategy

Each phase is designed for parallel subagent work:

| Phase | Agent 1 | Agent 2 | Agent 3 | Agent 4 |
|-------|---------|---------|---------|---------|
| 6 | TipTap editor | PDF upload | Lesson modal update | - |
| 7 | QuizBuilder | Question editors | Settings + preview | Question bank |
| 8 | AudioUploader | AudioPlayer | TranscriptEditor | - |
| 9 | Prerequisites | Drip scheduler | Unlock rules | - |
| 10 | Progress schema | Analytics UI | Export | - |
| 11 | Certificates | PDF generation | Learning paths | Achievements |

### Risk Mitigation

1. **TipTap complexity** - Use starter-kit first, add extensions incrementally
2. **Quiz validation** - Validate on both client and server
3. **PDF generation** - Test with simple template first
4. **Progress performance** - Index heavily, consider Redis cache

### Future Enhancements (Not in Scope)

- Real-time collaboration on course editing
- White-label certificate domains
- SCORM/xAPI export
- Mobile offline support

---

*Spec created: 2025-12-03 | Complexity: complex | Type: feature | Phases: 6 | Estimated: 4-6 weeks*
