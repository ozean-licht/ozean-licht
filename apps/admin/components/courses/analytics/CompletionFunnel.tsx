'use client';

/**
 * CompletionFunnel - Lesson drop-off analysis visualization
 *
 * Shows lesson-by-lesson retention and completion rates as a funnel.
 * Part of Phase 10: Progress & Analytics for Course Builder.
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

// Types
export interface FunnelPoint {
  lessonId: string;
  title: string;
  moduleOrder: number;
  sortOrder: number;
  started: number;
  completed: number;
  completionRate: number;
  retentionRate: number;
}

interface CompletionFunnelProps {
  data: FunnelPoint[];
  isLoading?: boolean;
  title?: string;
  height?: number;
  showDropOffAlerts?: boolean;
}

/**
 * Truncate lesson title for display
 */
function truncateTitle(title: string, maxLength: number = 20): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

/**
 * Get color based on retention rate
 */
function getRetentionColor(rate: number): string {
  if (rate >= 80) return '#10B981'; // Green
  if (rate >= 60) return '#F59E0B'; // Yellow
  if (rate >= 40) return '#EF4444'; // Red
  return '#DC2626'; // Dark red
}

/**
 * Custom tooltip
 */
function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{
    payload: FunnelPoint;
  }>;
}) {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-[#00111A] border border-[#0E282E] rounded-lg p-3 shadow-lg min-w-[200px]">
      <p className="text-sm font-medium text-white mb-2">{data.title}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-[#C4C8D4]">Started:</span>
          <span className="text-white">{data.started}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#C4C8D4]">Completed:</span>
          <span className="text-white">{data.completed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#C4C8D4]">Completion Rate:</span>
          <span className="text-white">{data.completionRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#C4C8D4]">Retention:</span>
          <span className={data.retentionRate >= 80 ? 'text-green-500' :
                          data.retentionRate >= 60 ? 'text-yellow-500' : 'text-red-500'}>
            {data.retentionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function FunnelSkeleton({ height }: { height: number }) {
  return (
    <div style={{ height }} className="flex items-center justify-center">
      <div className="space-y-3 w-full px-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton
              className="h-8"
              style={{ width: `${100 - i * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Drop-off alert component
 */
function DropOffAlert({ lesson, previousLesson }: {
  lesson: FunnelPoint;
  previousLesson?: FunnelPoint;
}) {
  if (!previousLesson || lesson.retentionRate >= 70) return null;

  const dropOff = 100 - lesson.retentionRate;

  return (
    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-red-500">
          {dropOff.toFixed(0)}% drop-off detected
        </p>
        <p className="text-xs text-[#C4C8D4] mt-1">
          Between &quot;{truncateTitle(previousLesson.title, 30)}&quot; and &quot;{truncateTitle(lesson.title, 30)}&quot;
        </p>
      </div>
    </div>
  );
}

/**
 * CompletionFunnel component
 */
export function CompletionFunnel({
  data,
  isLoading = false,
  title = 'Lesson Completion Funnel',
  height = 400,
  showDropOffAlerts = true,
}: CompletionFunnelProps) {
  // Find significant drop-offs
  const dropOffs = React.useMemo(() => {
    if (!showDropOffAlerts) return [];
    return data.filter((point, index) => {
      if (index === 0) return false;
      return point.retentionRate < 70;
    }).map((point) => {
      const index = data.indexOf(point);
      return {
        lesson: point,
        previousLesson: data[index - 1],
      };
    });
  }, [data, showDropOffAlerts]);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelSkeleton height={height} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
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
            No funnel data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate max for normalization
  const maxStarted = Math.max(...data.map(d => d.started), 1);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        <div className="flex items-center gap-4 text-xs text-[#C4C8D4]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>&gt;80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>60-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>&lt;60%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#0E282E"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#C4C8D4"
              tick={{ fill: '#C4C8D4', fontSize: 12 }}
              axisLine={{ stroke: '#0E282E' }}
              domain={[0, maxStarted]}
            />
            <YAxis
              type="category"
              dataKey="title"
              stroke="#C4C8D4"
              tick={{ fill: '#C4C8D4', fontSize: 11 }}
              axisLine={{ stroke: '#0E282E' }}
              width={90}
              tickFormatter={(value) => truncateTitle(value, 15)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="started"
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getRetentionColor(entry.retentionRate)}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Drop-off alerts */}
        {showDropOffAlerts && dropOffs.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Significant Drop-offs Detected
            </div>
            {dropOffs.slice(0, 3).map(({ lesson, previousLesson }) => (
              <DropOffAlert
                key={lesson.lessonId}
                lesson={lesson}
                previousLesson={previousLesson}
              />
            ))}
          </div>
        )}

        {/* Overall completion summary */}
        {data.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#0E282E]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {data[data.length - 1].completionRate >= 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-[#C4C8D4]">Overall Course Completion:</span>
              </div>
              <span className={`font-medium ${
                data[data.length - 1].completionRate >= 50 ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {data.length > 0
                  ? `${Math.round(data[data.length - 1].completed / data[0].started * 100 || 0)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CompletionFunnel;
