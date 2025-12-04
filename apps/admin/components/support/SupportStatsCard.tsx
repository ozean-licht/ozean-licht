/**
 * SupportStatsCard Component - Support Management System
 *
 * Dashboard widget displaying key support metrics including open conversations,
 * average response time, and CSAT score.
 */

'use client';

import React from 'react';
import { SupportStats } from '@/types/support';
import { formatResponseTime, formatCSATScore } from '@/types/support';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SupportStatsCardProps {
  /** Support statistics data */
  stats: SupportStats;
  /** Loading state */
  loading?: boolean;
}

/**
 * SupportStatsCard displays key support performance metrics
 *
 * Metrics:
 * - Open Conversations (with pending count)
 * - Today's Activity (new and resolved)
 * - Average Response Time
 * - Average Resolution Time
 * - CSAT Score (Customer Satisfaction)
 *
 * Uses glass morphism styling with turquoise accents
 *
 * @example
 * ```tsx
 * <SupportStatsCard
 *   stats={supportStats}
 *   loading={isLoading}
 * />
 * ```
 */
export default function SupportStatsCard({
  stats,
  loading = false,
}: SupportStatsCardProps) {
  // Loading skeleton
  if (loading) {
    return (
      <Card className="bg-[#00111A]/70 backdrop-blur-md border border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#00111A]/70 backdrop-blur-md border border-primary/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/15 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-sans font-medium text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Support Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Open Conversations */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-sans font-medium text-[#C4C8D4]">
                Open Conversations
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-sans font-medium text-white">
                {stats.openConversations}
              </span>
              <span className="text-sm font-sans font-light text-[#C4C8D4]">
                ({stats.pendingConversations} pending)
              </span>
            </div>
            <div className="text-xs font-sans font-light text-[#C4C8D4]">
              {stats.conversationsToday} new today, {stats.resolvedToday} resolved
            </div>
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-sans font-medium text-[#C4C8D4]">
                Avg Response Time
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-sans font-medium text-white">
                {formatResponseTime(stats.avgResponseTimeMinutes)}
              </span>
            </div>
            <div className="text-xs font-sans font-light text-[#C4C8D4]">
              Resolution: {formatResponseTime(stats.avgResolutionTimeMinutes)}
            </div>
          </div>

          {/* CSAT Score */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-sans font-medium text-[#C4C8D4]">
                CSAT Score
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-sans font-medium text-white">
                {formatCSATScore(stats.csatScore)}
              </span>
              <span className="text-sm font-sans font-light text-[#C4C8D4]">
                ({stats.csatScore.toFixed(1)}/5.0)
              </span>
            </div>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(stats.csatScore)
                      ? 'text-primary'
                      : 'text-[#C4C8D4]/30'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
