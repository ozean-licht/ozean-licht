'use client';

/**
 * Video Analytics Dashboard - Client Component
 *
 * Interactive dashboard with date range filtering, charts, and CSV export.
 * Part of Phase 3: Video Analytics Dashboard for the VMS.
 */

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  Calendar,
  Play,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  VideoAnalyticsSummary,
  TopPerformingVideo,
} from '@/types/video';
import {
  formatNumber,
  formatMinutesToHours,
  formatPercentage,
  formatDateRange,
  formatShortDate,
} from '@/lib/utils/format';

// ================================================================
// Types
// ================================================================

interface PlatformBreakdown {
  platform: string;
  views: number;
  watchTimeMinutes: number;
  engagement: number;
}

interface ViewsOverTime {
  date: string;
  views: number;
  watchTimeMinutes: number;
}

interface AnalyticsDashboardData {
  aggregatedAnalytics: VideoAnalyticsSummary;
  topVideos: TopPerformingVideo[];
  platformBreakdown: PlatformBreakdown[];
  viewsOverTime: ViewsOverTime[];
  startDate: string;
  endDate: string;
}

interface AnalyticsDashboardClientProps {
  initialData: AnalyticsDashboardData;
}

// ================================================================
// Constants
// ================================================================

const PLATFORM_COLORS: Record<string, string> = {
  vimeo: '#1ab7ea',
  hetzner: '#d50c2d',
  youtube: '#ff0000',
};

const CHART_COLORS = {
  primary: '#0ec2bc',
  secondary: '#3B82F6',
  accent: '#10B981',
  warning: '#F59E0B',
};

// ================================================================
// Sub-Components
// ================================================================

/**
 * Stat Card Component
 */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading = false,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-[#C4C8D4]">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-[#C4C8D4] mt-1">{subtitle}</p>
        )}
        {trend !== undefined && trend !== 0 && (
          <div
            className={`text-xs mt-1 flex items-center gap-1 ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`}
            />
            <span>{Math.abs(trend).toFixed(1)}% vs previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Custom Chart Tooltip
 */
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !label) return null;

  return (
    <div className="bg-[#00111A] border border-[#0E282E] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-white mb-2">
        {formatShortDate(label)}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#C4C8D4]">{entry.name}:</span>
          <span className="text-white font-medium">
            {formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Platform Breakdown Chart
 */
function PlatformBreakdownChart({
  data,
  isLoading = false,
}: {
  data: PlatformBreakdown[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">
            Platform Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">
            Platform Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[#C4C8D4]">
            No platform data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
    value: item.views,
  }));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">
          Platform Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PLATFORM_COLORS[entry.name.toLowerCase()] || CHART_COLORS.primary}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span className="text-[#C4C8D4] text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      PLATFORM_COLORS[item.platform] || CHART_COLORS.primary,
                  }}
                />
                <span className="text-[#C4C8D4] capitalize">
                  {item.platform}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <span>{formatNumber(item.views)} views</span>
                <span>{formatMinutesToHours(item.watchTimeMinutes)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Top Videos List
 */
function TopVideosList({
  videos,
  isLoading = false,
}: {
  videos: TopPerformingVideo[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-[#C4C8D4]">
            No video data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">
          Top Performing Videos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos.map((video, index) => (
            <Link
              key={video.videoId}
              href={`/dashboard/content/videos/${video.videoId}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#0E282E] transition-colors"
            >
              <div className="flex-shrink-0 text-[#C4C8D4] font-medium w-6">
                #{index + 1}
              </div>
              {video.thumbnailUrl ? (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width={80}
                  height={45}
                  className="rounded object-cover"
                />
              ) : (
                <div className="w-20 h-[45px] bg-[#0E282E] rounded flex items-center justify-center">
                  <Play className="h-5 w-5 text-[#C4C8D4]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {video.title}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#C4C8D4]">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatNumber(video.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatMinutesToHours(video.watchTimeMinutes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {video.engagement}
                  </span>
                </div>
              </div>
              {video.trend !== 0 && (
                <div
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    video.trend > 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {video.trend > 0 ? '+' : ''}
                  {video.trend.toFixed(1)}%
                </div>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Main Component
// ================================================================

export function AnalyticsDashboardClient({
  initialData,
}: AnalyticsDashboardClientProps) {
  const [data] = useState(initialData);
  const [isLoading] = useState(false);
  const [dateRange] = useState({
    startDate: initialData.startDate,
    endDate: initialData.endDate,
  });

  // TODO: Implement date range filtering
  // const handleDateRangeChange = useCallback(
  //   async (startDate: string, endDate: string) => {
  //     setIsLoading(true);
  //     setDateRange({ startDate, endDate });
  //     // Fetch from API endpoint with new date range
  //   },
  //   []
  // );

  // Handle CSV export
  const handleExport = useCallback(() => {
    try {
      // Prepare CSV data
      const headers = [
        'Date',
        'Metric',
        'Value',
      ];

      const rows = [
        ['Overview', '', ''],
        ['', 'Total Views', data.aggregatedAnalytics.totalViews.toString()],
        ['', 'Total Watch Time (hours)', (data.aggregatedAnalytics.totalWatchTimeMinutes / 60).toFixed(2)],
        ['', 'Average Watch %', data.aggregatedAnalytics.avgWatchPercentage.toFixed(2)],
        ['', 'Total Engagement', (data.aggregatedAnalytics.totalLikes + data.aggregatedAnalytics.totalComments + data.aggregatedAnalytics.totalShares).toString()],
        ['', '', ''],
        ['Views Over Time', '', ''],
        ...data.viewsOverTime.map(item => [
          item.date,
          'Views',
          item.views.toString(),
        ]),
        ['', '', ''],
        ['Top Videos', '', ''],
        ...data.topVideos.map(video => [
          video.title,
          'Views',
          video.views.toString(),
        ]),
      ];

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `video-analytics-${dateRange.startDate}-${dateRange.endDate}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  }, [data, dateRange]);

  const { aggregatedAnalytics, topVideos, platformBreakdown, viewsOverTime } = data;

  // Calculate total engagement
  const totalEngagement =
    aggregatedAnalytics.totalLikes +
    aggregatedAnalytics.totalComments +
    aggregatedAnalytics.totalShares;

  // Prepare chart data
  const viewsChartData = viewsOverTime.map(item => ({
    date: item.date,
    Views: item.views,
    'Watch Time (min)': item.watchTimeMinutes,
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-decorative text-white">
            Video Analytics
          </h1>
          <p className="text-[#C4C8D4] mt-1">
            {formatDateRange(dateRange.startDate, dateRange.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* TODO: Add date range picker */}
          <Button
            variant="outline"
            size="sm"
            className="text-[#C4C8D4] border-[#0E282E]"
            disabled
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-[#C4C8D4] border-[#0E282E] hover:text-white hover:border-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
          value={formatNumber(aggregatedAnalytics.totalViews)}
          subtitle={`${aggregatedAnalytics.totalViews.toLocaleString()} total`}
          icon={Eye}
          trend={aggregatedAnalytics.viewsTrend}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Watch Time"
          value={formatMinutesToHours(aggregatedAnalytics.totalWatchTimeMinutes)}
          subtitle={`${(aggregatedAnalytics.totalWatchTimeMinutes / 60).toFixed(1)} hours`}
          icon={Clock}
          trend={aggregatedAnalytics.watchTimeTrend}
          isLoading={isLoading}
        />
        <StatCard
          title="Average Watch %"
          value={formatPercentage(aggregatedAnalytics.avgWatchPercentage)}
          subtitle="Average completion rate"
          icon={BarChart3}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Engagement"
          value={formatNumber(totalEngagement)}
          subtitle={`${totalEngagement.toLocaleString()} interactions`}
          icon={TrendingUp}
          trend={aggregatedAnalytics.engagementTrend}
          isLoading={isLoading}
        />
      </div>

      {/* Views Over Time Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">
            Views Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : viewsChartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-[#C4C8D4]">
              No data available for the selected date range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={viewsChartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  stroke="#C4C8D4"
                  tick={{ fill: '#C4C8D4', fontSize: 12 }}
                  axisLine={{ stroke: '#0E282E' }}
                  tickLine={{ stroke: '#0E282E' }}
                />
                <YAxis
                  stroke="#C4C8D4"
                  tick={{ fill: '#C4C8D4', fontSize: 12 }}
                  axisLine={{ stroke: '#0E282E' }}
                  tickLine={{ stroke: '#0E282E' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => (
                    <span className="text-[#C4C8D4] text-sm">{value}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="Views"
                  stroke={CHART_COLORS.primary}
                  fill="url(#colorViews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Platform Breakdown & Top Videos */}
      <div className="grid gap-6 md:grid-cols-2">
        <PlatformBreakdownChart data={platformBreakdown} isLoading={isLoading} />
        <TopVideosList videos={topVideos} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default AnalyticsDashboardClient;
