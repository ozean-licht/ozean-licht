/**
 * Health Metric Card Component
 *
 * Reusable card component for displaying health metrics with status badges.
 * Used as a base wrapper for database, gateway, and server health cards.
 */

import React from 'react';
import { ServiceStatus, SystemStatus } from '@/types/health';

interface HealthMetricCardProps {
  /** Card title (e.g., "Kids Ascension Database") */
  title: string;
  /** Service status ('up', 'down', 'healthy', 'degraded') */
  status: ServiceStatus | SystemStatus;
  /** Card content */
  children: React.ReactNode;
}

/**
 * HealthMetricCard displays a metric container with color-coded status badge
 *
 * Status badge colors:
 * - green: 'up' or 'healthy'
 * - yellow: 'degraded'
 * - red: 'down'
 *
 * @example
 * ```tsx
 * <HealthMetricCard title="Database" status="up">
 *   <MetricRow label="Connections" value="25 / 100" />
 * </HealthMetricCard>
 * ```
 */
export default function HealthMetricCard({ title, status, children }: HealthMetricCardProps) {
  // Determine badge color based on status
  const getBadgeColor = () => {
    if (status === 'up' || status === 'healthy') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'degraded') {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  // Determine status text
  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with title and status badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Card content */}
      <div className="space-y-3">{children}</div>
    </div>
  );
}
