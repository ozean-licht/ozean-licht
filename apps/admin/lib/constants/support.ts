/**
 * Support Management System Constants
 * Shared configuration for knowledge base and support features
 */

/**
 * Default article categories for knowledge base
 */
export const DEFAULT_ARTICLE_CATEGORIES = [
  'Account & Billing',
  'Courses & Learning',
  'Technical Support',
  'Spiritual Practice',
  'Getting Started',
  'FAQ',
] as const;

export type ArticleCategory = typeof DEFAULT_ARTICLE_CATEGORIES[number];

/**
 * Supported languages for articles
 */
export const ARTICLE_LANGUAGES = [
  { value: 'de', label: 'German' },
  { value: 'en', label: 'English' },
] as const;

/**
 * Article input validation limits
 */
export const ARTICLE_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  SUMMARY_MAX_LENGTH: 500,
  CATEGORY_MAX_LENGTH: 100,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS_COUNT: 10,
  CONTENT_MAX_LENGTH: 50000,
} as const;

/**
 * Support ticket priorities with display configuration
 */
export const TICKET_PRIORITIES = {
  low: { label: 'Low', color: 'gray' },
  normal: { label: 'Normal', color: 'blue' },
  high: { label: 'High', color: 'orange' },
  urgent: { label: 'Urgent', color: 'red' },
} as const;

/**
 * Conversation statuses with display configuration
 */
export const CONVERSATION_STATUSES = {
  open: { label: 'Open', color: 'green' },
  pending: { label: 'Pending', color: 'yellow' },
  resolved: { label: 'Resolved', color: 'blue' },
  snoozed: { label: 'Snoozed', color: 'gray' },
} as const;
