/**
 * Content Types - Videos, Courses, Lessons, Modules
 * Part of Airtable MCP Migration
 */

// Entity scope for multi-tenant support
export type ContentEntityScope = 'ozean_licht' | 'kids_ascension';

// Video status
export type VideoStatus = 'draft' | 'published' | 'archived';

// Course status
export type CourseStatus = 'draft' | 'published' | 'archived';

// Course level
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// Lesson type
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment';

// Enrollment status
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// Lesson progress status
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * Video entity
 */
export interface Video {
  id: string;
  airtableId?: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status: VideoStatus;
  entityScope?: ContentEntityScope;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * Course entity
 */
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
  // Stripe integration
  stripeProductId?: string;
  stripePriceId?: string;
  stripePaymentLinkId?: string;
  stripePaymentLinkUrl?: string;
  // Computed/joined fields
  lessonCount?: number;
  moduleCount?: number;
  enrollmentCount?: number;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Module status
 */
export type ModuleStatus = 'draft' | 'published';

/**
 * Module entity (grouping within courses)
 */
export interface Module {
  id: string;
  airtableId?: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  status: ModuleStatus;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  lessonCount?: number;
  totalDurationSeconds?: number;
  lessons?: Lesson[];
  // Legacy field for mcp-client compatibility
  /** @deprecated Use sortOrder instead */
  orderIndex?: number;
}

/**
 * Module with nested lessons
 */
export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

/**
 * Lesson content type
 */
export type LessonContentType = 'video' | 'text' | 'pdf' | 'quiz' | 'audio';

/**
 * Transcript segment for audio lessons
 */
export interface TranscriptSegment {
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
  text: string;   // Transcript text for this segment
}

/**
 * Lesson status
 */
export type LessonStatus = 'draft' | 'published';

/**
 * Lesson entity
 */
export interface Lesson {
  id: string;
  airtableId?: string;
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  // Content fields (based on content_type)
  videoId?: string;
  contentText?: string;  // For text type (markdown)
  contentUrl?: string;   // For pdf type (URL to PDF)
  quizData?: Record<string, unknown>;  // For quiz type (future)
  // Audio content fields (for audio type)
  audioUrl?: string;              // URL to audio file
  audioMimeType?: string;         // MIME type (audio/mpeg, audio/wav, etc.)
  transcript?: string;            // Plain text transcript
  transcriptSegments?: TranscriptSegment[];  // Timestamped transcript segments
  // Metadata
  sortOrder: number;
  durationSeconds?: number;
  isRequired: boolean;
  isPreview: boolean;
  status: LessonStatus;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  video?: Video;
  // Legacy fields for mcp-client compatibility
  /** @deprecated Use moduleId from parent module instead */
  courseId?: string;
  /** @deprecated Use contentText instead */
  content?: string;
  /** @deprecated Use sortOrder instead */
  orderIndex?: number;
  /** @deprecated Use isPreview instead */
  isFreePreview?: boolean;
  /** @deprecated Use contentType instead */
  lessonType?: LessonType;
}

/**
 * Course enrollment
 */
export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt?: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  course?: Course;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Lesson progress
 */
export interface LessonProgress {
  id: string;
  lessonId: string;
  userId: string;
  status: LessonProgressStatus;
  progressSeconds: number;
  completedAt?: string;
  lastPositionSeconds: number;
  createdAt: string;
  updatedAt: string;
}

// Input types for CRUD operations

export interface CreateVideoInput {
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: VideoStatus;
  entityScope?: ContentEntityScope;
  metadata?: Record<string, unknown>;
}

export interface UpdateVideoInput {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: VideoStatus;
  entityScope?: ContentEntityScope;
  metadata?: Record<string, unknown>;
}

export interface CreateCourseInput {
  title: string;
  slug: string;
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

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
  quizData?: Record<string, unknown>;
  // Audio fields
  audioUrl?: string;
  audioMimeType?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  // Metadata
  durationSeconds?: number;
  isRequired?: boolean;
  isPreview?: boolean;
  status?: LessonStatus;
  // Legacy fields for mcp-client compatibility
  /** @deprecated Use moduleId + contentText instead */
  courseId?: string;
  /** @deprecated Use contentText instead */
  content?: string;
  /** @deprecated Use sortOrder in Lesson instead */
  orderIndex?: number;
  /** @deprecated Use isPreview instead */
  isFreePreview?: boolean;
  /** @deprecated Use contentType instead */
  lessonType?: LessonType;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  contentType?: LessonContentType;
  videoId?: string;
  contentText?: string;
  contentUrl?: string;
  quizData?: Record<string, unknown>;
  // Audio fields
  audioUrl?: string;
  audioMimeType?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  // Metadata
  durationSeconds?: number;
  isRequired?: boolean;
  isPreview?: boolean;
  status?: LessonStatus;
  // Legacy fields for mcp-client compatibility
  /** @deprecated Use moduleId on create only */
  moduleId?: string;
  /** @deprecated Use contentText instead */
  content?: string;
  /** @deprecated Use reorderLessons instead */
  orderIndex?: number;
  /** @deprecated Use isPreview instead */
  isFreePreview?: boolean;
  /** @deprecated Use contentType instead */
  lessonType?: LessonType;
}

export interface CreateModuleInput {
  courseId: string;
  title: string;
  description?: string;
  status?: ModuleStatus;
  // Legacy field for mcp-client compatibility
  /** @deprecated Use sortOrder in Module instead */
  orderIndex?: number;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  status?: ModuleStatus;
  // Legacy field for mcp-client compatibility
  /** @deprecated Use reorderModules instead */
  orderIndex?: number;
}

// List options

export interface ContentListOptions {
  entityScope?: ContentEntityScope;
  status?: VideoStatus | CourseStatus;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface VideoListOptions extends ContentListOptions {
  status?: VideoStatus;
}

export interface CourseListOptions extends ContentListOptions {
  status?: CourseStatus;
  level?: CourseLevel;
  instructorId?: string;
}

export interface LessonListOptions {
  courseId: string;
  moduleId?: string;
  lessonType?: LessonType;
  limit?: number;
  offset?: number;
}

export interface EnrollmentListOptions {
  courseId?: string;
  userId?: string;
  status?: EnrollmentStatus;
  limit?: number;
  offset?: number;
}

// Paginated results

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type VideoListResult = PaginatedResult<Video>;
export type CourseListResult = PaginatedResult<Course>;
export type LessonListResult = PaginatedResult<Lesson>;
export type EnrollmentListResult = PaginatedResult<CourseEnrollment>;

// Stats types

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalRevenue: number;
}

export interface VideoStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalDurationMinutes: number;
}

// === Course with Structure ===

/**
 * Course with nested modules and lessons for course builder
 */
export interface CourseWithStructure extends Course {
  modules: ModuleWithLessons[];
}
