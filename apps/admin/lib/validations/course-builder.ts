/**
 * Zod validation schemas for Course Builder
 *
 * Provides client-side and server-side validation for:
 * - Modules (create, update)
 * - Lessons (create, update)
 *
 * Usage:
 * - Client-side: Use schemas in form components for instant validation
 * - Server-side: Use in API routes for request validation
 */

import { z } from 'zod';

// === Common Schemas ===

export const moduleStatusSchema = z.enum(['draft', 'published']);
export const lessonStatusSchema = z.enum(['draft', 'published']);
export const lessonContentTypeSchema = z.enum(['video', 'text', 'pdf', 'quiz']);

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
 * Schema for creating a quiz lesson (future)
 */
const createQuizLessonSchema = z.object({
  ...baseLessonFields,
  moduleId: z.string().uuid('Invalid module ID'),
  contentType: z.literal('quiz'),
  videoId: z.undefined(),
  contentText: z.undefined(),
  contentUrl: z.undefined(),
  quizData: z.record(z.unknown()).optional(),
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
  });

/**
 * Schema for reordering lessons
 */
export const reorderLessonsSchema = z.object({
  lessonIds: z.array(z.string().uuid('Invalid lesson ID')).min(1, 'At least one lesson ID is required'),
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
