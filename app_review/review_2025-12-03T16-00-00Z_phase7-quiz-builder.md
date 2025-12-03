# Code Review Report - Phase 7: Interactive Quiz Builder

**Generated**: 2025-12-03T16:00:00Z
**Reviewed Work**: Phase 7 Interactive Quiz Builder implementation for Course Builder
**Git Diff Summary**: New files added (quiz types, validation schemas, 9 quiz components), modified files: LessonEditorModal.tsx, course-builder.ts
**Verdict**: WARNING FAIL

---

## Executive Summary

Phase 7 successfully implements a comprehensive interactive quiz builder with multiple question types (multiple choice, true/false, fill-in-blank), drag-and-drop reordering, quiz settings, and live preview. The implementation demonstrates strong TypeScript usage, good component architecture, and proper design system compliance. However, **3 BLOCKER issues** were identified related to XSS vulnerabilities, missing validation in API routes, and potential data loss scenarios that must be addressed before production deployment.

---

## Quick Reference

| #   | Description                                          | Risk Level | Recommended Solution                                |
| --- | ---------------------------------------------------- | ---------- | --------------------------------------------------- |
| 1   | XSS vulnerability in quiz question text              | BLOCKER    | Sanitize quiz question/option text on server-side  |
| 2   | Missing quiz validation in lesson API routes         | BLOCKER    | Add Zod validation in lesson PATCH/POST endpoints  |
| 3   | No data migration for existing quiz_data field       | BLOCKER    | Add migration script or version handling            |
| 4   | Missing error boundaries for quiz components         | HIGH       | Add error boundaries around QuizBuilder             |
| 5   | No quiz autosave during editing                      | HIGH       | Implement autosave to localStorage                  |
| 6   | generateQuizId() uses weak randomness               | HIGH       | Use crypto.randomUUID() or nanoid                   |
| 7   | Quiz preview doesn't validate fill-blank formatting  | MEDIUM     | Add validation for {{blank}} placeholders           |
| 8   | No keyboard shortcuts for quiz authoring             | MEDIUM     | Add Cmd+S save, Cmd+Enter submit                    |
| 9   | Missing analytics tracking for quiz creation         | MEDIUM     | Add telemetry for quiz feature usage                |
| 10  | QuizPreview scoring logic duplicated                 | LOW        | Extract to shared scoring utility                   |
| 11  | Inconsistent use of useCallback dependencies         | LOW        | Fix exhaustive-deps warnings                        |
| 12  | Missing JSDoc for complex validation functions       | LOW        | Add documentation for isValidQuestion()             |

---

## Issues by Risk Tier

### BLOCKERS (Must Fix Before Merge)

#### Issue #1: XSS Vulnerability in Quiz Question Text

**Description**: Quiz question text, options, and feedback are rendered without sanitization, creating a stored XSS vulnerability. An attacker with admin access could inject malicious scripts that execute when other admins or learners view the quiz.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuizPreview.tsx`
- Lines: `215` (question rendering), `317`, `343` (option rendering)
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuestionListItem.tsx`
- Lines: `137-140` (question preview)

**Offending Code**:
```typescript
// QuizPreview.tsx line 215
<p className="text-lg font-medium">{currentQuestion.question}</p>

// QuestionListItem.tsx lines 137-140
<p className="text-sm line-clamp-2 mb-1">
  {question.question || (
    <span className="text-muted-foreground italic">No question text</span>
  )}
</p>
```

**Recommended Solutions**:

1. **Server-Side Sanitization** (Preferred)
   - Add sanitization in `lib/db/lessons.ts` when saving quiz data
   - Use `isomorphic-dompurify` (already installed from Phase 6)
   - Sanitize all user-generated quiz content fields
   - Rationale: Defense in depth - sanitize at ingress point

   ```typescript
   // In lib/db/lessons.ts
   import { sanitizeHtml } from '@/lib/utils/sanitize';

   function sanitizeQuizData(quizData: QuizData): QuizData {
     return {
       ...quizData,
       questions: quizData.questions.map(q => ({
         ...q,
         question: sanitizeHtml(q.question),
         explanation: q.explanation ? sanitizeHtml(q.explanation) : undefined,
         hint: q.hint ? sanitizeHtml(q.hint) : undefined,
         // Type-specific sanitization
         ...(q.type === 'multiple_choice' && {
           options: q.options.map(o => ({
             ...o,
             text: sanitizeHtml(o.text),
             feedback: o.feedback ? sanitizeHtml(o.feedback) : undefined,
           })),
         }),
       })),
     };
   }
   ```

2. **Client-Side DOMPurify** (Additional Layer)
   - Use dangerouslySetInnerHTML with DOMPurify in preview
   - Trade-off: Adds client-side dependency, but provides extra protection

3. **Content Security Policy**
   - Add CSP headers to prevent inline script execution
   - Trade-off: Requires infrastructure changes, may break existing features

---

#### Issue #2: Missing Quiz Data Validation in API Routes

**Description**: Lesson API routes (`POST /api/courses/[id]/modules/[moduleId]/lessons`, `PATCH /api/lessons/[id]`) accept quiz_data without server-side validation. The Zod schemas are defined but not enforced in API routes, allowing invalid quiz data to be stored in the database.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/courses/[id]/modules/[moduleId]/lessons/route.ts` (likely location)
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/lessons/[id]/route.ts` (likely location)
- Evidence: No API route files were provided in the diff, suggesting existing routes don't validate quiz data

**Offending Code**:
```typescript
// Hypothetical current API route (needs verification)
export async function POST(req: Request) {
  const body = await req.json();
  // Missing: Validate body.quizData with quizDataSchema
  const lesson = await createLesson(body);
  return NextResponse.json(lesson);
}
```

**Recommended Solutions**:

1. **Add Server-Side Zod Validation** (Preferred)
   - Import and use `validateQuizData()` from `lib/validations/course-builder.ts`
   - Return 400 Bad Request with validation errors if invalid
   - Rationale: Prevents corrupt data from reaching database

   ```typescript
   import { validateQuizData, extractZodErrors } from '@/lib/validations/course-builder';

   export async function POST(req: Request) {
     const body = await req.json();

     // Validate quiz data if contentType is 'quiz'
     if (body.contentType === 'quiz' && body.quizData) {
       try {
         validateQuizData(body.quizData);
       } catch (error) {
         if (error instanceof z.ZodError) {
           return NextResponse.json(
             { error: 'Invalid quiz data', details: extractZodErrors(error) },
             { status: 400 }
           );
         }
       }
     }

     const lesson = await createLesson(body);
     return NextResponse.json(lesson);
   }
   ```

2. **Use Discriminated Union Validation**
   - Validate entire lesson payload with `createLessonSchema`
   - Trade-off: More comprehensive but stricter validation

---

#### Issue #3: No Data Migration for Existing quiz_data Field

**Description**: The `lessons` table's `quiz_data` JSONB field may contain old data with a different schema. The new implementation introduces a versioned schema (`version: 1`) but doesn't handle migration of existing data or provide backward compatibility checks.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/types/quiz.ts`
- Lines: `147-148` (version field introduced)
- Missing: Migration script in `tools/database/` or version handling in data access layer

**Offending Code**:
```typescript
// quiz.ts lines 145-158
export interface QuizData {
  settings: QuizSettings;
  questions: QuizQuestion[];
  version: number;  // Schema version for migrations
}

export const emptyQuizData: QuizData = {
  settings: defaultQuizSettings,
  questions: [],
  version: 1,
};

// No migration logic for existing data
```

**Recommended Solutions**:

1. **Create Migration Function** (Preferred)
   - Add `migrateQuizData()` in `lib/db/lessons.ts`
   - Check version field when loading quiz data
   - Migrate old data to new schema on read
   - Rationale: Safe, reversible, no database downtime

   ```typescript
   // In lib/db/lessons.ts
   function migrateQuizData(data: any): QuizData {
     if (!data) return emptyQuizData;

     // Version 0 or missing version (old data)
     if (!data.version || data.version < 1) {
       return {
         version: 1,
         settings: {
           ...defaultQuizSettings,
           ...data.settings,
         },
         questions: data.questions?.map(migrateQuestion) || [],
       };
     }

     return data as QuizData;
   }

   export async function getLessonById(id: string) {
     const lesson = await query(/* ... */);
     if (lesson.quiz_data) {
       lesson.quiz_data = migrateQuizData(lesson.quiz_data);
     }
     return lesson;
   }
   ```

2. **Database Migration Script**
   - Create SQL script to update all existing quiz_data
   - Trade-off: Requires database access, one-time operation

3. **Strict Version Check with Error**
   - Reject old data, force manual migration
   - Trade-off: Breaking change, requires content editor intervention

---

### HIGH RISK (Should Fix Before Merge)

#### Issue #4: Missing Error Boundaries for Quiz Components

**Description**: Quiz components involve complex state management and recursive question editing. No error boundaries are present to catch and handle rendering errors gracefully, which could crash the entire lesson editor modal.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/LessonEditorModal.tsx`
- Lines: `395-408` (QuizBuilder integration)
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuizBuilder.tsx`
- All quiz component files

**Offending Code**:
```typescript
// LessonEditorModal.tsx lines 403-407
<QuizBuilder
  value={quizData}
  onChange={setQuizData}
  disabled={isSubmitting}
/>
// No error boundary wrapping
```

**Recommended Solutions**:

1. **Add Error Boundary Component** (Preferred)
   - Create `QuizBuilderErrorBoundary` wrapper
   - Display friendly error message with reset option
   - Log errors to monitoring service
   - Rationale: Prevents complete modal crash, improves UX

   ```typescript
   // In components/courses/quiz/QuizBuilderErrorBoundary.tsx
   class QuizBuilderErrorBoundary extends React.Component {
     state = { hasError: false, error: null };

     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error('Quiz Builder Error:', error, errorInfo);
       // TODO: Send to monitoring service
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="p-6 text-center border border-destructive rounded-lg">
             <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
             <h3 className="font-medium mb-2">Quiz Builder Error</h3>
             <p className="text-sm text-muted-foreground mb-4">
               Something went wrong. Your quiz data is safe.
             </p>
             <Button onClick={() => this.setState({ hasError: false })}>
               Try Again
             </Button>
           </div>
         );
       }
       return this.props.children;
     }
   }

   // Wrap QuizBuilder in LessonEditorModal.tsx
   <QuizBuilderErrorBoundary>
     <QuizBuilder value={quizData} onChange={setQuizData} disabled={isSubmitting} />
   </QuizBuilderErrorBoundary>
   ```

2. **Use react-error-boundary Library**
   - Install `react-error-boundary` package
   - Trade-off: Adds dependency, but more feature-rich

---

#### Issue #5: No Quiz Autosave During Editing

**Description**: Complex quizzes with many questions can be lost if the browser crashes, tab is accidentally closed, or network issues occur. No autosave mechanism exists to persist work in progress.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuizBuilder.tsx`
- Entire component (no autosave logic)

**Recommended Solutions**:

1. **Implement localStorage Autosave** (Preferred)
   - Save quiz data to localStorage every 30 seconds
   - Load from localStorage on component mount
   - Clear on successful save
   - Rationale: Simple, no backend changes needed

   ```typescript
   // In QuizBuilder.tsx
   const AUTOSAVE_KEY = `quiz-autosave-${lessonId}`;

   useEffect(() => {
     const interval = setInterval(() => {
       if (value.questions.length > 0) {
         localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(value));
       }
     }, 30000); // Every 30 seconds

     return () => clearInterval(interval);
   }, [value, lessonId]);

   useEffect(() => {
     // Load autosave on mount
     const autosaved = localStorage.getItem(AUTOSAVE_KEY);
     if (autosaved) {
       const shouldRestore = confirm('Restore unsaved quiz changes?');
       if (shouldRestore) {
         onChange(JSON.parse(autosaved));
       }
       localStorage.removeItem(AUTOSAVE_KEY);
     }
   }, []);
   ```

2. **Server-Side Draft Saving**
   - Add draft endpoint to save quiz without validation
   - Trade-off: Requires API changes, more complex

---

#### Issue #6: Weak Random ID Generation in generateQuizId()

**Description**: `generateQuizId()` uses `Date.now()` + `Math.random()` which can produce collisions in rapid succession or with multiple users editing simultaneously. This could cause quiz element duplication or data corruption.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/types/quiz.ts`
- Lines: `335-337`

**Offending Code**:
```typescript
export function generateQuizId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
```

**Recommended Solutions**:

1. **Use crypto.randomUUID()** (Preferred)
   - Browser-native UUID v4 generation
   - Cryptographically secure, no collisions
   - Rationale: Industry standard, built-in, secure

   ```typescript
   export function generateQuizId(): string {
     if (typeof crypto !== 'undefined' && crypto.randomUUID) {
       return `q_${crypto.randomUUID()}`;
     }
     // Fallback for older browsers (unlikely in admin dashboard)
     return `q_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
   }
   ```

2. **Install nanoid Package**
   - Shorter, URL-safe IDs
   - Trade-off: Adds dependency, but very small

---

### MEDIUM RISK (Fix Soon)

#### Issue #7: Quiz Preview Doesn't Validate Fill-Blank Formatting

**Description**: FillBlankEditor accepts question text with `{{blank}}` placeholders, but QuizPreview doesn't validate that the number of placeholders matches the number of blanks defined. This leads to confusing preview experience.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuizPreview.tsx`
- Lines: `238-244` (FillBlankPreview component)
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/FillBlankEditor.tsx`
- Lines: `167-176` (help text mentions {{blank}})

**Recommended Solutions**:

1. **Add Validation Warning in FillBlankEditor** (Preferred)
   - Count {{blank}} occurrences in question text
   - Show warning if count doesn't match blanks.length
   - Don't block saving, just warn

   ```typescript
   // In FillBlankEditor.tsx
   const blankCount = (question.question.match(/\{\{blank\}\}/g) || []).length;
   const shouldWarn = blankCount !== question.blanks.length;

   return (
     <div className="space-y-4">
       {/* ... existing fields ... */}
       {shouldWarn && (
         <div className="p-3 bg-warning/10 border border-warning rounded-lg">
           <p className="text-sm text-warning">
             Warning: Found {blankCount} {{'{{'}}blank{{'}}'}} placeholder(s) but {question.blanks.length} blank answer(s) defined.
           </p>
         </div>
       )}
     </div>
   );
   ```

2. **Auto-Detect Blanks from Question Text**
   - Parse question text and auto-create blank entries
   - Trade-off: Magic behavior, less predictable

---

#### Issue #8: No Keyboard Shortcuts for Quiz Authoring

**Description**: Power users creating many quizzes would benefit from keyboard shortcuts. Currently all actions require mouse clicks, slowing down workflow.

**Recommended Solutions**:

1. **Add Common Shortcuts** (Preferred)
   - Cmd/Ctrl+S: Save question
   - Cmd/Ctrl+Enter: Save and close
   - Cmd/Ctrl+N: Add new question
   - Escape: Close modal/cancel

   ```typescript
   // In QuestionEditor.tsx
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if ((e.metaKey || e.ctrlKey) && e.key === 's') {
         e.preventDefault();
         handleSave();
       }
       if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
         e.preventDefault();
         handleSave();
       }
     };

     if (open) {
       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }
   }, [open, handleSave]);
   ```

---

#### Issue #9: Missing Analytics Tracking for Quiz Creation

**Description**: No telemetry is tracked for quiz feature usage. This makes it hard to understand adoption, identify problems, and prioritize improvements.

**Recommended Solutions**:

1. **Add Event Tracking** (Preferred)
   - Track quiz created, question added, quiz published
   - Use existing analytics service or add simple logging

   ```typescript
   // In QuizBuilder.tsx
   const handleSaveQuestion = useCallback((question: QuizQuestion) => {
     // ... existing save logic ...

     // Track event
     analytics.track('quiz_question_added', {
       questionType: question.type,
       questionCount: value.questions.length + 1,
     });
   }, [value, onChange]);
   ```

---

### LOW RISK (Nice to Have)

#### Issue #10: QuizPreview Scoring Logic Duplicated

**Description**: The scoring calculation logic in `QuizPreview.calculateScore()` will need to be duplicated on the backend for actual quiz grading. This creates a maintenance burden and risk of inconsistent scoring.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/QuizPreview.tsx`
- Lines: `54-105`

**Recommended Solutions**:

1. **Extract to Shared Utility** (Preferred)
   - Create `lib/quiz/scoring.ts` with pure functions
   - Use in both QuizPreview and future backend grading
   - Rationale: DRY principle, single source of truth

   ```typescript
   // lib/quiz/scoring.ts
   export function scoreQuestion(
     question: QuizQuestion,
     answer: QuestionAnswer['answer']
   ): boolean {
     // ... scoring logic ...
   }

   export function calculateQuizScore(
     questions: QuizQuestion[],
     answers: Record<string, QuestionAnswer>
   ) {
     // ... quiz scoring logic ...
   }
   ```

---

#### Issue #11: Inconsistent useCallback Dependencies

**Description**: Some `useCallback` hooks have incomplete dependency arrays, which could cause stale closures or unnecessary re-renders.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/quiz/MultipleChoiceEditor.tsx`
- Line: `86` (handleToggleCorrect missing handleOptionChange in deps)

**Offending Code**:
```typescript
const handleToggleCorrect = useCallback((optionId: string, isCorrect: boolean) => {
  if (question.allowMultiple) {
    handleOptionChange(optionId, { isCorrect });
  } else {
    onChange({ /* ... */ });
  }
}, [question.allowMultiple, question.options, onChange, handleOptionChange]);
// handleOptionChange is in deps, but it's defined with useCallback earlier
```

**Recommended Solutions**:

1. **Fix Dependency Arrays** (Preferred)
   - Run ESLint exhaustive-deps rule
   - Add missing dependencies or remove unnecessary ones

---

#### Issue #12: Missing JSDoc for Complex Validation Functions

**Description**: Functions like `isValidQuestion()` and `calculateQuizSummary()` contain complex business logic but lack detailed documentation explaining edge cases and validation rules.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/types/quiz.ts`
- Lines: `285-311` (isValidQuestion), `316-330` (calculateQuizSummary)

**Recommended Solutions**:

1. **Add JSDoc Comments** (Preferred)
   - Document parameters, return values, edge cases
   - Improves maintainability and developer experience

   ```typescript
   /**
    * Validates if a quiz question is complete and ready for saving.
    *
    * @param question - The question to validate
    * @returns true if valid, false otherwise
    *
    * Validation rules:
    * - Question text must be non-empty
    * - Points must be non-negative
    * - Multiple choice: ≥2 options, ≥1 correct, all options have text
    * - True/false: correctAnswer must be boolean
    * - Fill blank: ≥1 blank, each blank has ≥1 accepted answer
    * - Matching: ≥2 pairs, all pairs have left and right text
    */
   export function isValidQuestion(question: QuizQuestion): boolean {
     // ...
   }
   ```

---

## Verification Checklist

- [ ] Blocker #1: Quiz text sanitized with DOMPurify in `lib/db/lessons.ts`
- [ ] Blocker #2: Quiz validation added to lesson API routes
- [ ] Blocker #3: Quiz data migration function added and tested
- [ ] High #4: Error boundary added around QuizBuilder
- [ ] High #5: Autosave implemented with localStorage
- [ ] High #6: generateQuizId() uses crypto.randomUUID()
- [ ] Medium #7: Fill-blank placeholder validation warning added
- [ ] Medium #8: Keyboard shortcuts implemented
- [ ] Medium #9: Analytics tracking added
- [ ] Low #10: Scoring logic extracted to shared utility
- [ ] Low #11: useCallback dependencies fixed
- [ ] Low #12: JSDoc added for validation functions
- [ ] Security: CSP headers configured for admin dashboard
- [ ] Testing: Manual quiz creation and editing tested
- [ ] Testing: Fill-blank preview tested with edge cases

---

## Final Verdict

**Status**: WARNING FAIL

**Reasoning**: Phase 7 implementation is architecturally sound with excellent TypeScript usage, proper component separation, and good design system compliance. However, **3 BLOCKER issues** must be addressed before merge:

1. **XSS vulnerability** in quiz rendering poses security risk
2. **Missing server-side validation** allows corrupt data to enter database
3. **No data migration** could break existing quiz lessons

The high-risk issues (error boundaries, autosave, weak randomness) should also be addressed to ensure production readiness and good UX.

**Next Steps**:
1. Add server-side sanitization with isomorphic-dompurify in `lib/db/lessons.ts`
2. Add quiz validation in lesson API routes (`POST`, `PATCH`)
3. Create quiz data migration function for backward compatibility
4. Add error boundary around QuizBuilder component
5. Implement localStorage autosave
6. Replace generateQuizId() with crypto.randomUUID()
7. Test thoroughly with edge cases (empty quizzes, malicious input, concurrent editing)

**Positive Highlights**:
- Excellent TypeScript type safety with discriminated unions
- Well-structured component hierarchy (Builder → Editor → Type Editors)
- Proper use of CossUI design system components
- Good separation of concerns (types, validation, components)
- Comprehensive Zod validation schemas
- Live preview feature adds great UX
- Drag-and-drop reordering with @dnd-kit
- Proper accessibility considerations (ARIA labels, keyboard navigation)

---

**Report File**: `/opt/ozean-licht-ecosystem/app_review/review_2025-12-03T16-00-00Z_phase7-quiz-builder.md`
