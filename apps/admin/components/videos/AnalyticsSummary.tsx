'use client';

/**
 * AnalyticsSummary Component
 *
 * Compact analytics widget for video detail pages.
 * Displays key metrics (views, watch time, engagement, avg watch %)
 * with trend indicators and link to full analytics.
 *
 * Features:
 * - Compact card layout suitable for sidebars/detail panels
 * - Glass card style with backdrop blur
 * - Trend arrows (up/down) with percentage changes
 * - Formatted time display (hours/minutes)
 * - Loading state support
 * - Link to full analytics page
 */

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  Clock,
  ThumbsUp,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import { VideoAnalyticsSummary } from '@/types/video';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/format';

// ================================================================
// Types & Interfaces
// ================================================================

interface AnalyticsSummaryProps {
  videoId: string;
  analytics?: VideoAnalyticsSummary;
  isLoading?: boolean;
}

interface MetricRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: number;
  className?: string;
}

// ================================================================
// Helper Functions
// ================================================================

/**
 * Format watch time in minutes to human-readable hours/minutes
 */
function formatWatchTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format trend percentage with sign
 */
function formatTrend(trend: number): string {
  const sign = trend >= 0 ? '+' : '';
  return `${sign}${trend.toFixed(1)}%`;
}

// ================================================================
// Sub-Components
// ================================================================

/**
 * Metric Row - Display a single metric with icon, value, and trend
 */
function MetricRow({ icon: Icon, label, value, trend, className }: MetricRowProps) {
  const hasTrend = typeof trend === 'number';
  const isPositive = trend !== undefined && trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300 font-sans">{value}</span>
        <span className="text-xs text-gray-500 font-sans">{label}</span>
      </div>
      {hasTrend && (
        <div className="flex items-center gap-1">
          <TrendIcon
            className={cn(
              'w-3 h-3',
              isPositive ? 'text-[#0ec2bc]' : 'text-red-400'
            )}
          />
          <span
            className={cn(
              'text-xs font-medium font-sans',
              isPositive ? 'text-[#0ec2bc]' : 'text-red-400'
            )}
          >
            {formatTrend(trend)}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Loading Skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700/50 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse" />
            <div className="w-12 h-3 bg-gray-700/50 rounded animate-pulse" />
          </div>
          <div className="w-12 h-4 bg-gray-700/50 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State
 */
function EmptyState() {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-3">
        <Eye className="w-8 h-8 text-gray-600" />
      </div>
      <p className="text-sm text-gray-500 font-sans">
        No analytics data available yet
      </p>
      <p className="text-xs text-gray-600 font-sans mt-1">
        Data will appear once the video receives views
      </p>
    </div>
  );
}

// ================================================================
// Main Component
// ================================================================

/**
 * AnalyticsSummary - Compact analytics widget
 *
 * Displays key video metrics in a compact, sidebar-friendly format.
 * Shows views, watch time, engagement, and average watch percentage
 * with trend indicators. Links to full analytics page.
 *
 * @example
 * ```tsx
 * <AnalyticsSummary
 *   videoId="video-123"
 *   analytics={videoAnalytics}
 *   isLoading={false}
 * />
 * ```
 */
export default function AnalyticsSummary({
  videoId,
  analytics,
  isLoading = false,
}: AnalyticsSummaryProps) {
  // Calculate total engagement (likes + comments + shares)
  const totalEngagement = analytics
    ? analytics.totalLikes + analytics.totalComments + analytics.totalShares
    : 0;

  return (
    <div className="rounded-lg border border-primary/20 bg-[#00111A]/70 backdrop-blur overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-primary/10">
        <h3 className="text-sm font-semibold text-white font-sans">
          Analytics Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : !analytics || analytics.totalViews === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {/* Views */}
            <MetricRow
              icon={Eye}
              label="views"
              value={formatNumber(analytics.totalViews)}
              trend={analytics.viewsTrend}
            />

            {/* Watch Time */}
            <MetricRow
              icon={Clock}
              label="watch time"
              value={formatWatchTime(analytics.totalWatchTimeMinutes)}
              trend={analytics.watchTimeTrend}
            />

            {/* Engagement (likes + comments + shares) */}
            <MetricRow
              icon={ThumbsUp}
              label="engagements"
              value={formatNumber(totalEngagement)}
              trend={analytics.engagementTrend}
            />

            {/* Average Watch Percentage (no trend) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">%</span>
                </div>
                <span className="text-sm text-gray-300 font-sans">
                  {Math.round(analytics.avgWatchPercentage)}%
                </span>
                <span className="text-xs text-gray-500 font-sans">avg watched</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Link to Full Analytics */}
      {!isLoading && analytics && analytics.totalViews > 0 && (
        <div className="px-4 py-3 border-t border-primary/10">
          <Link
            href={`/dashboard/videos/${videoId}/analytics`}
            className="flex items-center justify-between text-sm text-[#0ec2bc] hover:text-[#0ec2bc]/80 transition-colors font-sans group"
          >
            <span>View full analytics</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
