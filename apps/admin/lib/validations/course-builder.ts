/**
 * Zod validation schemas for Course Builder
 *
 * Provides client-side and server-side validation for:
 * - Modules (create, update)
 * - Lessons (create, update)
 * - Quizzes (settings, questions)
 *
 * Usage:
 * - Client-side: Use schemas in form components for instant validation
 * - Server-side: Use in API routes for request validation
 */

import { z } from 'zod';

// === Common Schemas ===

export const moduleStatusSchema = z.enum(['draft', 'published']);
export const lessonStatusSchema = z.enum(['draft', 'published']);
export const lessonContentTypeSchema = z.enum(['video', 'text', 'pdf', 'quiz', 'audio']);

// === Module Schemas ===

/**
 * Schema for creating a new module
 */
export const createModuleSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .transform((val) => val?.trim() || undefined),
  status: moduleStatusSchema.optional().default('draft'),
});

/**
 * Schema for updating an existing module
 */
export const updateModuleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .transform((val) => val?.trim() || undefined),
  status: moduleStatusSchema.optional(),
});

/**
 * Schema for reordering modules
 */
export const reorderModulesSchema = z.object({
  moduleIds: z.array(z.string().uuid('Invalid module ID')).min(1, 'At least one module ID is required'),
});

// === Lesson Schemas ===

/**
 * Base lesson fields shared between create and update
 */
const baseLessonFields = {
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .transform((val) => val?.trim() || undefined),
  durationSeconds: z
    .number()
    .int('Duration must be a whole number')
    .min(0, 'Duration cannot be negative')
    .optional()
    .nullable(),
  isRequired: z.boolean().optional().default(false),
  isPreview: z.boolean().optional().default(false),
  status: lessonStatusSchema.optional().default('draft'),
};

/**
 * Schema for creating a video lesson
 */
const createVideoLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('video'),
  videoId: z.string().uuid('Please select a video'),
  contentText: z.undefined(),
  contentUrl: z.undefined(),
});

/**
 * Schema for creating a text lesson
 */
const createTextLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('text'),
  videoId: z.undefined(),
  contentText: z
    .string()
    .min(1, 'Content is required for text lessons')
    .transform((val) => val.trim()),
  contentUrl: z.undefined(),
});

/**
 * Schema for creating a PDF lesson
 */
const createPdfLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('pdf'),
  videoId: z.undefined(),
  contentText: z.undefined(),
  contentUrl: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'PDF URL is required'),
});

/**
 * Schema for creating a quiz lesson
 */
const createQuizLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('quiz'),
  videoId: z.undefined(),
  contentText: z.undefined(),
  contentUrl: z.undefined(),
  quizData: z.lazy(() => quizDataSchema).optional(),
});

/**
 * Transcript segment schema for audio lessons
 */
export const transcriptSegmentSchema = z.object({
  start: z.number().min(0, 'Start time must be positive'),
  end: z.number().min(0, 'End time must be positive'),
  text: z.string().min(1, 'Segment text is required'),
}).refine((data) => data.end >= data.start, {
  message: 'End time must be after start time',
  path: ['end'],
});

/**
 * Schema for creating an audio lesson
 */
const createAudioLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('audio'),
  videoId: z.undefined(),
  contentText: z.undefined(),
  contentUrl: z.undefined(),
  audioUrl: z
    .string()
    .url('Please enter a valid audio URL')
    .min(1, 'Audio URL is required'),
  audioMimeType: z
    .string()
    .optional(),
  transcript: z
    .string()
    .max(50000, 'Transcript must be 50000 characters or less')
    .optional(),
  transcriptSegments: z
    .array(transcriptSegmentSchema)
    .optional(),
});

/**
 * Discriminated union schema for creating a lesson
 * Validates based on contentType
 */
export const createLessonSchema = z.discriminatedUnion('contentType', [
  createVideoLessonSchema,
  createTextLessonSchema,
  createPdfLessonSchema,
  createQuizLessonSchema,
  createAudioLessonSchema,
]);

/**
 * Simpler schema for lesson form validation (client-side)
 * Validates based on contentType value at runtime
 */
export const lessonFormSchema = z
  .object({
    moduleId: z.string().uuid('Invalid module ID'),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less'),
    description: z
      .string()
      .max(2000, 'Description must be 2000 characters or less')
      .optional(),
    contentType: lessonContentTypeSchema,
    videoId: z.string().uuid().optional().nullable(),
    contentText: z.string().optional(),
    contentUrl: z.string().optional(),
    // Audio fields
    audioUrl: z.string().optional(),
    audioMimeType: z.string().optional(),
    transcript: z.string().optional(),
    transcriptSegments: z.array(z.object({
      start: z.number(),
      end: z.number(),
      text: z.string(),
    })).optional(),
    // Metadata
    durationSeconds: z.number().int().min(0).optional().nullable(),
    isRequired: z.boolean().optional(),
    isPreview: z.boolean().optional(),
    status: lessonStatusSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // Validate video lessons require videoId
    if (data.contentType === 'video' && !data.videoId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a video',
        path: ['videoId'],
      });
    }

    // Validate text lessons require contentText
    if (data.contentType === 'text' && (!data.contentText || !data.contentText.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Content is required for text lessons',
        path: ['contentText'],
      });
    }

    // Validate PDF lessons require contentUrl
    if (data.contentType === 'pdf' && (!data.contentUrl || !data.contentUrl.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PDF URL is required',
        path: ['contentUrl'],
      });
    }

    // Validate PDF URL format
    if (data.contentType === 'pdf' && data.contentUrl) {
      try {
        new URL(data.contentUrl);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid URL',
          path: ['contentUrl'],
        });
      }
    }

    // Validate audio lessons require audioUrl
    if (data.contentType === 'audio' && (!data.audioUrl || !data.audioUrl.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio file is required',
        path: ['audioUrl'],
      });
    }

    // Validate audio URL format
    if (data.contentType === 'audio' && data.audioUrl) {
      try {
        new URL(data.audioUrl);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid audio URL',
          path: ['audioUrl'],
        });
      }
    }
  });

/**
 * Schema for updating an existing lesson
 */
export const updateLessonSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less')
      .transform((val) => val.trim())
      .optional(),
    description: z
      .string()
      .max(2000, 'Description must be 2000 characters or less')
      .optional()
      .transform((val) => val?.trim() || undefined),
    contentType: lessonContentTypeSchema.optional(),
    videoId: z.string().uuid().optional().nullable(),
    contentText: z.string().optional().nullable(),
    contentUrl: z.string().url('Please enter a valid URL').optional().nullable(),
    // Audio fields
    audioUrl: z.string().url('Please enter a valid audio URL').optional().nullable(),
    audioMimeType: z.string().optional().nullable(),
    transcript: z.string().max(50000, 'Transcript must be 50000 characters or less').optional().nullable(),
    transcriptSegments: z.array(z.object({
      start: z.number(),
      end: z.number(),
      text: z.string(),
    })).optional().nullable(),
    // Metadata
    durationSeconds: z.number().int().min(0).optional().nullable(),
    isRequired: z.boolean().optional(),
    isPreview: z.boolean().optional(),
    status: lessonStatusSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // If contentType is being set, validate content fields
    if (data.contentType === 'video' && data.videoId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a video',
        path: ['videoId'],
      });
    }

    if (data.contentType === 'text' && data.contentText === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Content is required for text lessons',
        path: ['contentText'],
      });
    }

    if (data.contentType === 'pdf' && data.contentUrl === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PDF URL is required',
        path: ['contentUrl'],
      });
    }

    if (data.contentType === 'audio' && data.audioUrl === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio file is required',
        path: ['audioUrl'],
      });
    }
  });

/**
 * Schema for reordering lessons
 */
export const reorderLessonsSchema = z.object({
  lessonIds: z.array(z.string().uuid('Invalid lesson ID')).min(1, 'At least one lesson ID is required'),
});

// === Course Schemas ===

export const courseStatusSchema = z.enum(['draft', 'published', 'archived']);
export const courseLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const currencySchema = z.enum(['EUR', 'USD', 'CHF']);
export const entityScopeSchema = z.enum(['ozean_licht', 'kids_ascension']);

/**
 * Schema for updating an existing course
 */
export const courseUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200).optional(),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe (lowercase letters, numbers, hyphens only)').optional(),
  description: z.string().max(10000).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  thumbnailUrl: z.string().url('Must be a valid URL').optional().nullable(),
  coverImageUrl: z.string().url('Must be a valid URL').optional().nullable(),
  priceCents: z.number().int().min(0, 'Price cannot be negative').optional(),
  currency: currencySchema.optional(),
  status: courseStatusSchema.optional(),
  level: courseLevelSchema.optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  durationMinutes: z.number().int().min(0).optional().nullable(),
  entityScope: entityScopeSchema.optional().nullable(),
  instructorId: z.string().uuid().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

/**
 * Schema for the course editor form (requires title)
 */
export const courseEditorSchema = courseUpdateSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be 200 characters or less'),
});

// === Quiz Schemas ===

/**
 * Question type enum
 */
export const questionTypeSchema = z.enum(['multiple_choice', 'true_false', 'fill_blank', 'matching']);

/**
 * Quiz option schema (for multiple choice)
 */
export const quizOptionSchema = z.object({
  id: z.string().min(1, 'Option ID is required'),
  text: z.string().min(1, 'Option text is required').max(500, 'Option text must be 500 characters or less'),
  isCorrect: z.boolean(),
  feedback: z.string().max(500).optional(),
});

/**
 * Blank answer schema (for fill-in-blank)
 */
export const blankAnswerSchema = z.object({
  id: z.string().min(1, 'Blank ID is required'),
  acceptedAnswers: z.array(z.string().min(1)).min(1, 'At least one accepted answer is required'),
  caseSensitive: z.boolean().default(false),
});

/**
 * Match pair schema (for matching questions)
 */
export const matchPairSchema = z.object({
  id: z.string().min(1, 'Pair ID is required'),
  left: z.string().min(1, 'Left side text is required').max(200),
  right: z.string().min(1, 'Right side text is required').max(200),
});

/**
 * Base question fields
 */
const baseQuestionFields = {
  id: z.string().min(1, 'Question ID is required'),
  question: z.string().min(1, 'Question text is required').max(2000, 'Question must be 2000 characters or less'),
  points: z.number().int().min(0, 'Points cannot be negative').max(100, 'Points cannot exceed 100').default(1),
  required: z.boolean().default(true),
  explanation: z.string().max(1000).optional(),
  hint: z.string().max(500).optional(),
};

/**
 * Multiple choice question schema (base, without refinement for discriminatedUnion)
 */
const multipleChoiceQuestionBaseSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('multiple_choice'),
  options: z.array(quizOptionSchema).min(2, 'At least 2 options required').max(10, 'Maximum 10 options'),
  allowMultiple: z.boolean().default(false),
});

/**
 * Multiple choice question schema with validation
 */
export const multipleChoiceQuestionSchema = multipleChoiceQuestionBaseSchema;

/**
 * True/false question schema
 */
export const trueFalseQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('true_false'),
  correctAnswer: z.boolean(),
});

/**
 * Fill-in-blank question schema
 */
export const fillBlankQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('fill_blank'),
  blanks: z.array(blankAnswerSchema).min(1, 'At least one blank is required').max(10),
});

/**
 * Matching question schema
 */
export const matchingQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('matching'),
  pairs: z.array(matchPairSchema).min(2, 'At least 2 pairs required').max(10),
});

/**
 * Union schema for all question types
 */
export const quizQuestionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  fillBlankQuestionSchema,
  matchingQuestionSchema,
]);

/**
 * Quiz settings schema
 */
export const quizSettingsSchema = z.object({
  passingScore: z.number().int().min(0).max(100).default(70),
  maxAttempts: z.number().int().min(-1).default(-1), // -1 = unlimited
  timeLimitMinutes: z.number().int().min(1).max(480).nullable().default(null),
  shuffleQuestions: z.boolean().default(false),
  shuffleAnswers: z.boolean().default(false),
  showCorrectAnswers: z.boolean().default(true),
  showFeedback: z.boolean().default(true),
  showResultsImmediately: z.boolean().default(true),
  allowReview: z.boolean().default(true),
});

/**
 * Complete quiz data schema
 */
export const quizDataSchema = z.object({
  settings: quizSettingsSchema,
  questions: z.array(quizQuestionSchema).min(1, 'At least one question is required'),
  version: z.number().int().positive().default(1),
});

/**
 * Quiz form schema (for lesson editor - allows empty questions during editing)
 */
export const quizFormSchema = z.object({
  settings: quizSettingsSchema,
  questions: z.array(quizQuestionSchema).default([]),
  version: z.number().int().positive().default(1),
});

// === Type Exports ===

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
export type ReorderModulesInput = z.infer<typeof reorderModulesSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type LessonFormInput = z.infer<typeof lessonFormSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>;
export type ModuleStatus = z.infer<typeof moduleStatusSchema>;
export type LessonStatus = z.infer<typeof lessonStatusSchema>;
export type LessonContentType = z.infer<typeof lessonContentTypeSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type CourseEditorInput = z.infer<typeof courseEditorSchema>;

// Quiz types
export type QuestionTypeValue = z.infer<typeof questionTypeSchema>;
export type QuizOptionInput = z.infer<typeof quizOptionSchema>;
export type BlankAnswerInput = z.infer<typeof blankAnswerSchema>;
export type MatchPairInput = z.infer<typeof matchPairSchema>;
export type MultipleChoiceQuestionInput = z.infer<typeof multipleChoiceQuestionSchema>;
export type TrueFalseQuestionInput = z.infer<typeof trueFalseQuestionSchema>;
export type FillBlankQuestionInput = z.infer<typeof fillBlankQuestionSchema>;
export type MatchingQuestionInput = z.infer<typeof matchingQuestionSchema>;
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>;
export type QuizSettingsInput = z.infer<typeof quizSettingsSchema>;
export type QuizDataInput = z.infer<typeof quizDataSchema>;
export type QuizFormInput = z.infer<typeof quizFormSchema>;

// === Validation Helpers ===

/**
 * Validate and parse module creation input
 * @returns Parsed data or throws ZodError
 */
export function validateCreateModule(data: unknown) {
  return createModuleSchema.parse(data);
}

/**
 * Validate and parse module update input
 * @returns Parsed data or throws ZodError
 */
export function validateUpdateModule(data: unknown) {
  return updateModuleSchema.parse(data);
}

/**
 * Validate and parse lesson form input
 * @returns Parsed data or throws ZodError
 */
export function validateLessonForm(data: unknown) {
  return lessonFormSchema.parse(data);
}

/**
 * Validate and parse lesson update input
 * @returns Parsed data or throws ZodError
 */
export function validateUpdateLesson(data: unknown) {
  return updateLessonSchema.parse(data);
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeValidateCreateModule(data: unknown) {
  return createModuleSchema.safeParse(data);
}

export function safeValidateUpdateModule(data: unknown) {
  return updateModuleSchema.safeParse(data);
}

export function safeValidateLessonForm(data: unknown) {
  return lessonFormSchema.safeParse(data);
}

export function safeValidateUpdateLesson(data: unknown) {
  return updateLessonSchema.safeParse(data);
}

/**
 * Extract error messages from ZodError for form display
 */
export function extractZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

/**
 * Validate and parse course update input
 */
export function validateCourseUpdate(data: unknown) {
  return courseUpdateSchema.parse(data);
}

export function safeValidateCourseUpdate(data: unknown) {
  return courseUpdateSchema.safeParse(data);
}

export function safeValidateCourseEditor(data: unknown) {
  return courseEditorSchema.safeParse(data);
}

// === Quiz Validation Helpers ===

/**
 * Validate quiz data (requires at least one question)
 */
export function validateQuizData(data: unknown) {
  return quizDataSchema.parse(data);
}

/**
 * Safe validate quiz data
 */
export function safeValidateQuizData(data: unknown) {
  return quizDataSchema.safeParse(data);
}

/**
 * Validate quiz form (allows empty questions during editing)
 */
export function validateQuizForm(data: unknown) {
  return quizFormSchema.parse(data);
}

/**
 * Safe validate quiz form
 */
export function safeValidateQuizForm(data: unknown) {
  return quizFormSchema.safeParse(data);
}

/**
 * Validate a single question
 */
export function validateQuizQuestion(data: unknown) {
  return quizQuestionSchema.parse(data);
}

/**
 * Safe validate a single question
 */
export function safeValidateQuizQuestion(data: unknown) {
  return quizQuestionSchema.safeParse(data);
}

/**
 * Validate quiz settings
 */
export function validateQuizSettings(data: unknown) {
  return quizSettingsSchema.parse(data);
}

/**
 * Safe validate quiz settings
 */
export function safeValidateQuizSettings(data: unknown) {
  return quizSettingsSchema.safeParse(data);
}
