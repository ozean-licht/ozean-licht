/**
 * Type exports
 */

export * from './admin';
export * from './database';
export * from './mcp';
export * from './health';

// Export content types (has PaginatedResult)
export * from './content';

// Export commerce types but rename PaginatedResult to avoid conflict
export type {
  CommerceEntityScope,
  ProductType,
  OrderStatus,
  PaymentStatus,
  TransactionType,
  TransactionStatus,
  DiscountType,
  Product,
  Order,
  OrderItem,
  Transaction,
  Coupon,
  Address,
  CreateProductInput,
  UpdateProductInput,
  CreateOrderInput,
  CreateOrderItemInput,
  UpdateOrderInput,
  CreateTransactionInput,
  CreateCouponInput,
  UpdateCouponInput,
  ProductListOptions,
  OrderListOptions,
  TransactionListOptions,
  CouponListOptions,
  ProductListResult,
  OrderListResult,
  TransactionListResult,
  CouponListResult,
  CommerceStats,
  RevenueByPeriod,
  ProductPerformance,
} from './commerce';

// Export projects types but rename PaginatedResult to avoid conflict
export type {
  ProjectEntityScope,
  ProjectStatus,
  Priority,
  TaskStatus,
  TaskType,
  TemplateType,
  SprintStatus,
  TaskActivityType,
  Project,
  Task,
  TaskAttachment,
  TaskComment,
  ProcessTemplate,
  TemplateStep,
  Sprint,
  TaskActivity,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateSprintInput,
  UpdateSprintInput,
  ProjectListResult,
  TaskListResult,
  TemplateListResult,
  SprintListResult,
} from './projects';

// Export calendar types but rename PaginatedResult to avoid conflict
export type {
  CalendarEvent,
  EventStatus,
  EventType,
  EventRecurrence,
  EventRegistration,
  RegistrationStatus,
  EventFeedback,
  CreateEventInput,
  UpdateEventInput,
  UpdateRegistrationInput,
  EventListResult,
  RegistrationListResult,
  FeedbackListResult,
} from './calendar';
// Re-export storage types, but rename EntityScope to avoid conflict with admin.ts
export type {
  EntityScope as StorageEntityScope,
  FileStatus,
  StorageMetadataRow,
  StorageMetadata,
  FileInfo,
  UploadFileInput,
  UploadFileResult,
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  GetFileUrlResult,
  DeleteFileInput,
  DeleteFileResult,
  StatFileInput,
  StatFileResult,
  StorageMetadataFilters,
  StorageStats,
  BucketConfig,
  UploadProgress,
  PresignedUrlWithMetadata,
  StorageOperationResult,
  StorageHealthStatus,
  MultipartUploadConfig,
  FileValidationResult,
  BucketStats,
  StorageQuota,
  FileMetadataDisplay,
  BulkOperationInput,
  BulkOperationResult,
} from './storage';
