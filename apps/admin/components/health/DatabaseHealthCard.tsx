/**
 * Database Health Card Component
 *
 * Specialized card for displaying individual PostgreSQL database health metrics.
 * Shows connection pool usage, query performance, and last check timestamp.
 */

import React from 'react';
import { DatabaseMetrics } from '@/types/health';
import HealthMetricCard from './HealthMetricCard';
import MetricRow from './MetricRow';

interface DatabaseHealthCardProps {
  /** Database metrics data */
  metrics: DatabaseMetrics;
}

/**
 * DatabaseHealthCard displays health metrics for a single PostgreSQL database
 *
 * Displayed metrics:
 * - Active Connections with progress bar (warns at > 80%)
 * - Average Query Time in milliseconds
 * - Last Checked timestamp
 *
 * Connection usage calculation:
 * - Percentage = (activeConnections / maxConnections) * 100
 * - Warning threshold: > 80%
 *
 * @example
 * ```tsx
 * <DatabaseHealthCard metrics={kidsAscensionMetrics} />
 * ```
 */
export default function DatabaseHealthCard({ metrics }: DatabaseHealthCardProps) {
  const { displayName, status, activeConnections, maxConnections, avgQueryTime, lastChecked } =
    metrics;

  // Calculate connection percentage
  const connectionPercentage = (activeConnections / maxConnections) * 100;
  const connectionWarning = connectionPercentage > 80;

  // Format timestamp
  const formattedTime = new Date(lastChecked).toLocaleTimeString();

  return (
    <HealthMetricCard title={displayName} status={status}>
      {/* Active Connections */}
      <MetricRow
        label="Active Connections"
        value={`${activeConnections} / ${maxConnections}`}
        progress={connectionPercentage}
        warning={connectionWarning}
      />

      {/* Average Query Time */}
      <MetricRow label="Avg Query Time" value={avgQueryTime.toFixed(2)} unit="ms" />

      {/* Last Checked */}
      <MetricRow label="Last Checked" value={formattedTime} />
    </HealthMetricCard>
  );
}
