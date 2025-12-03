/**
 * Course Analytics Components
 *
 * Export all analytics-related components for Course Builder Phase 10.
 */

export { ProgressDashboard } from './ProgressDashboard';
export type { CourseAnalytics, ProgressSummary, LessonStats } from './ProgressDashboard';

export { LessonEngagementChart } from './LessonEngagementChart';
export type { TimeSeriesPoint, EngagementData } from './LessonEngagementChart';

export { CompletionFunnel } from './CompletionFunnel';
export type { FunnelPoint } from './CompletionFunnel';

export { UserProgressTable } from './UserProgressTable';
export type { UserEnrollment, EnrollmentStatus } from './UserProgressTable';

export { ExportAnalyticsButton } from './ExportAnalyticsButton';
