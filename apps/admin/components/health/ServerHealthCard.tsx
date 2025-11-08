/**
 * Server Health Card Component
 *
 * Specialized card for displaying server resource utilization metrics.
 * Shows CPU, memory, and disk usage with progress bars and warning thresholds.
 */

import React from 'react';
import { ServerHealth } from '@/types/health';
import HealthMetricCard from './HealthMetricCard';
import MetricRow from './MetricRow';

interface ServerHealthCardProps {
  /** Server health metrics */
  metrics: ServerHealth;
}

/**
 * ServerHealthCard displays server resource utilization metrics
 *
 * Displayed metrics:
 * - CPU usage with core count (e.g., "45% (12 cores)")
 * - Memory usage as "used / total GB" with percentage and progress bar
 * - Disk usage as "used / total TB" with percentage and progress bar
 *
 * Warning thresholds:
 * - CPU > 80%: warning state
 * - Memory > 85%: warning state
 * - Disk > 85%: warning state
 *
 * Overall card status determination:
 * - down: Any metric > 90%
 * - degraded: Any metric > 80%
 * - healthy: All metrics ≤ 80%
 *
 * @example
 * ```tsx
 * <ServerHealthCard metrics={serverMetrics} />
 * ```
 */
export default function ServerHealthCard({ metrics }: ServerHealthCardProps) {
  const { status, cpuUsage, cpuCores, memoryUsed, memoryTotal, diskUsed, diskTotal } = metrics;

  // Calculate percentages
  const memoryPercentage = (memoryUsed / memoryTotal) * 100;
  const diskPercentage = (diskUsed / diskTotal) * 100;

  // Determine warning states
  const cpuWarning = cpuUsage > 80;
  const memoryWarning = memoryPercentage > 85;
  const diskWarning = diskPercentage > 85;

  return (
    <HealthMetricCard title="Server Resources" status={status}>
      {/* CPU Usage */}
      <MetricRow
        label="CPU Usage"
        value={`${cpuUsage}% (${cpuCores} cores)`}
        progress={cpuUsage}
        warning={cpuWarning}
      />

      {/* Memory Usage */}
      <MetricRow
        label="Memory Usage"
        value={`${memoryUsed.toFixed(1)} / ${memoryTotal} GB (${memoryPercentage.toFixed(1)}%)`}
        progress={memoryPercentage}
        warning={memoryWarning}
      />

      {/* Disk Usage */}
      <MetricRow
        label="Disk Usage"
        value={`${diskUsed.toFixed(2)} / ${diskTotal} TB (${diskPercentage.toFixed(1)}%)`}
        progress={diskPercentage}
        warning={diskWarning}
      />
    </HealthMetricCard>
  );
}
