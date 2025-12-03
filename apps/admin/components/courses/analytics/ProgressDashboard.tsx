'use client';

/**
 * ProgressDashboard - Overview of course analytics
 *
 * Displays key metrics, progress stats, and engagement data for a course.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

// Types for analytics data
export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  uniqueUsers: number;
  pageViews: number;
  lessonStarts: number;
  lessonCompletions: number;
  quizAttempts: number;
  quizPasses: number;
  completionRate: number;
}

export interface ProgressSummary {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  avgProgressPercent: number;
  avgTimeSeconds: number;
  completionRate: number;
}

export interface LessonStats {
  lessonId: string;
  lessonTitle: string;
  contentType: string;
  totalViews: number;
  completions: number;
  avgTimeSeconds: number;
  avgQuizScore: number | null;
  completionRate: number;
}

interface ProgressDashboardProps {
  courseId: string;
  courseTitle: string;
  analytics: CourseAnalytics | null;
  progressSummary: ProgressSummary | null;
  lessonStats: LessonStats[];
  isLoading?: boolean;
}

/**
 * Format seconds to human-readable duration
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

/**
 * Stat card component
 */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
}) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#C4C8D4]">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-[#C4C8D4] mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={trend.value >= 0 ? 'text-green-500' : 'text-red-500'}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-[#C4C8D4] ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for stat cards
 */
function StatCardSkeleton() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32 mt-2" />
      </CardContent>
    </Card>
  );
}

/**
 * ProgressDashboard component
 */
export function ProgressDashboard({
  courseTitle,
  analytics,
  progressSummary,
  lessonStats,
  isLoading = false,
}: ProgressDashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Course Analytics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Progress Overview</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Course Analytics</h2>
        <p className="text-sm text-[#C4C8D4]">{courseTitle}</p>
      </div>

      {/* Engagement Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Unique Visitors"
          value={analytics?.uniqueUsers ?? 0}
          subtitle="Users who viewed course content"
          icon={Users}
        />
        <StatCard
          title="Page Views"
          value={analytics?.pageViews ?? 0}
          subtitle="Total lesson page visits"
          icon={BookOpen}
        />
        <StatCard
          title="Lesson Completions"
          value={analytics?.lessonCompletions ?? 0}
          subtitle={`${analytics?.lessonStarts ?? 0} started`}
          icon={CheckCircle}
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics?.completionRate ?? 0}%`}
          subtitle="Of started lessons"
          icon={TrendingUp}
        />
      </div>

      {/* Progress Summary */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Enrollment Progress</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Enrollments"
            value={progressSummary?.totalEnrollments ?? 0}
            subtitle={`${progressSummary?.activeEnrollments ?? 0} active`}
            icon={Users}
          />
          <StatCard
            title="Course Completions"
            value={progressSummary?.completedEnrollments ?? 0}
            subtitle={`${progressSummary?.completionRate ?? 0}% completion rate`}
            icon={Award}
          />
          <StatCard
            title="Average Progress"
            value={`${Math.round(progressSummary?.avgProgressPercent ?? 0)}%`}
            subtitle="Across all enrollments"
            icon={TrendingUp}
          />
          <StatCard
            title="Average Time"
            value={formatDuration(progressSummary?.avgTimeSeconds ?? 0)}
            subtitle="Time spent per user"
            icon={Clock}
          />
        </div>
      </div>

      {/* Lesson Performance Table */}
      {lessonStats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Lesson Performance</h3>
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0E282E]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Lesson
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Type
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Views
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Completions
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Avg. Time
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                      Completion %
                    </th>
                    {lessonStats.some(l => l.avgQuizScore !== null) && (
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#C4C8D4]">
                        Quiz Score
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {lessonStats.map((lesson) => (
                    <tr
                      key={lesson.lessonId}
                      className="border-b border-[#0E282E] last:border-0 hover:bg-[#001e1f]/50"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm text-white">{lesson.lessonTitle}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary capitalize">
                          {lesson.contentType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {lesson.totalViews}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {lesson.completions}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                        {formatDuration(lesson.avgTimeSeconds)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm ${
                          lesson.completionRate >= 70
                            ? 'text-green-500'
                            : lesson.completionRate >= 40
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}>
                          {lesson.completionRate}%
                        </span>
                      </td>
                      {lessonStats.some(l => l.avgQuizScore !== null) && (
                        <td className="py-3 px-4 text-right text-sm text-[#C4C8D4]">
                          {lesson.avgQuizScore !== null ? `${Math.round(lesson.avgQuizScore)}%` : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ProgressDashboard;
