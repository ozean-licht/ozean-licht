'use client';

/**
 * AnalyticsDashboardClient - Client component for course analytics
 *
 * Renders all analytics components with interactive features.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProgressDashboard,
  LessonEngagementChart,
  CompletionFunnel,
  UserProgressTable,
  ExportAnalyticsButton,
} from '@/components/courses/analytics';
import type {
  CourseAnalytics,
  ProgressSummary,
  LessonStats,
  FunnelPoint,
  EngagementData,
  UserEnrollment,
} from '@/components/courses/analytics';
import { ArrowLeft, BarChart3, Users, TrendingUp, Filter } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface AnalyticsDashboardClientProps {
  course: Course;
  analytics: CourseAnalytics | null;
  progressSummary: ProgressSummary | null;
  lessonStats: LessonStats[];
  funnel: FunnelPoint[];
  engagement: EngagementData;
}

export function AnalyticsDashboardClient({
  course,
  analytics,
  progressSummary,
  lessonStats,
  funnel,
  engagement,
}: AnalyticsDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // User table state
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [enrollmentsTotal, setEnrollmentsTotal] = useState(0);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsPage, setEnrollmentsPage] = useState(1);
  const [enrollmentsSearch, setEnrollmentsSearch] = useState('');
  const [enrollmentsStatus, setEnrollmentsStatus] = useState<'active' | 'paused' | 'completed' | 'cancelled' | 'expired' | 'all'>('all');
  const ITEMS_PER_PAGE = 20;

  // Load enrollments when users tab is active
  const loadEnrollments = useCallback(async () => {
    setEnrollmentsLoading(true);
    try {
      const params = new URLSearchParams({
        view: 'users',
        limit: String(ITEMS_PER_PAGE),
        offset: String((enrollmentsPage - 1) * ITEMS_PER_PAGE),
      });
      if (enrollmentsSearch) params.set('search', enrollmentsSearch);
      if (enrollmentsStatus !== 'all') params.set('status', enrollmentsStatus);

      const response = await fetch(`/api/analytics/courses/${course.id}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments || []);
        setEnrollmentsTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setEnrollmentsLoading(false);
    }
  }, [course.id, enrollmentsPage, enrollmentsSearch, enrollmentsStatus]);

  // Load enrollments when tab changes to users
  React.useEffect(() => {
    if (activeTab === 'users') {
      loadEnrollments();
    }
  }, [activeTab, loadEnrollments]);

  // Handle search
  const handleSearch = (query: string) => {
    setEnrollmentsSearch(query);
    setEnrollmentsPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status: 'active' | 'paused' | 'completed' | 'cancelled' | 'expired' | 'all') => {
    setEnrollmentsStatus(status);
    setEnrollmentsPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setEnrollmentsPage(page);
  };

  // Handle user click
  const handleUserClick = (userId: string) => {
    // Could navigate to user detail page
    console.log('User clicked:', userId);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/courses/${course.slug}`}>
            <Button variant="ghost" size="sm" className="text-[#C4C8D4]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-white">Analytics</h1>
            <p className="text-sm text-[#C4C8D4]">{course.title}</p>
          </div>
        </div>
        <ExportAnalyticsButton
          courseId={course.id}
          courseTitle={course.title}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#00111A] border border-[#0E282E]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
          <TabsTrigger
            value="funnel"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Funnel
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <ProgressDashboard
            courseId={course.id}
            courseTitle={course.title}
            analytics={analytics}
            progressSummary={progressSummary}
            lessonStats={lessonStats}
          />
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="mt-6 space-y-6">
          <LessonEngagementChart
            data={engagement}
            title="30-Day Engagement Trends"
            chartType="area"
          />
          <LessonEngagementChart
            data={engagement}
            title="Daily Activity Breakdown"
            chartType="line"
            showLegend={true}
          />
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="mt-6">
          <CompletionFunnel
            data={funnel}
            title="Lesson Completion Funnel"
            showDropOffAlerts={true}
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <UserProgressTable
            enrollments={enrollments}
            total={enrollmentsTotal}
            limit={ITEMS_PER_PAGE}
            offset={(enrollmentsPage - 1) * ITEMS_PER_PAGE}
            isLoading={enrollmentsLoading}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onPageChange={handlePageChange}
            onUserClick={handleUserClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboardClient;
