'use client';

/**
 * LessonEngagementChart - Time series engagement visualization
 *
 * Shows daily engagement metrics (users, completions, page views) over time.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Types
export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface EngagementData {
  uniqueUsers: TimeSeriesPoint[];
  completions: TimeSeriesPoint[];
  pageViews: TimeSeriesPoint[];
  lessonStarts: TimeSeriesPoint[];
}

interface LessonEngagementChartProps {
  data: EngagementData | null;
  isLoading?: boolean;
  title?: string;
  showLegend?: boolean;
  height?: number;
  chartType?: 'line' | 'area';
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
}

/**
 * Custom tooltip component
 */
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !label) return null;

  return (
    <div className="bg-[#00111A] border border-[#0E282E] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-white mb-2">{formatDate(label)}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#C4C8D4]">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton
 */
function ChartSkeleton({ height }: { height: number }) {
  return (
    <div style={{ height }} className="flex items-center justify-center">
      <div className="space-y-4 w-full px-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * LessonEngagementChart component
 */
export function LessonEngagementChart({
  data,
  isLoading = false,
  title = 'Engagement Over Time',
  showLegend = true,
  height = 300,
  chartType = 'area',
}: LessonEngagementChartProps) {
  // Combine data into chart format
  const chartData = React.useMemo(() => {
    if (!data) return [];

    // Use unique users as the base for dates
    return data.uniqueUsers.map((point, index) => ({
      date: point.date,
      'Unique Users': point.value,
      'Page Views': data.pageViews[index]?.value ?? 0,
      'Lesson Starts': data.lessonStarts[index]?.value ?? 0,
      'Completions': data.completions[index]?.value ?? 0,
    }));
  }, [data]);

  const colors = {
    'Unique Users': '#0ec2bc',
    'Page Views': '#3B82F6',
    'Lesson Starts': '#F59E0B',
    'Completions': '#10B981',
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{ height }}
            className="flex items-center justify-center text-[#C4C8D4]"
          >
            No engagement data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={chartData}>
            <defs>
              {Object.entries(colors).map(([key, color]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#0E282E"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
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
            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-[#C4C8D4] text-sm">{value}</span>
                )}
              />
            )}
            {chartType === 'area' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="Unique Users"
                  stroke={colors['Unique Users']}
                  fill={`url(#gradient-Unique Users)`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Completions"
                  stroke={colors['Completions']}
                  fill={`url(#gradient-Completions)`}
                  strokeWidth={2}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="Unique Users"
                  stroke={colors['Unique Users']}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: colors['Unique Users'] }}
                />
                <Line
                  type="monotone"
                  dataKey="Page Views"
                  stroke={colors['Page Views']}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: colors['Page Views'] }}
                />
                <Line
                  type="monotone"
                  dataKey="Lesson Starts"
                  stroke={colors['Lesson Starts']}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: colors['Lesson Starts'] }}
                />
                <Line
                  type="monotone"
                  dataKey="Completions"
                  stroke={colors['Completions']}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: colors['Completions'] }}
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default LessonEngagementChart;
