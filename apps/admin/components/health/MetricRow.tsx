/**
 * Metric Row Component
 *
 * Displays a single metric with label, value, and optional progress bar.
 * Used within health metric cards to show individual measurements.
 */

import React from 'react';

interface MetricRowProps {
  /** Metric label (e.g., "Active Connections") */
  label: string;
  /** Metric value (e.g., "25 / 100" or "45%") */
  value: string | number;
  /** Optional unit (e.g., "ms", "%", "GB") */
  unit?: string;
  /** Optional progress percentage (0-100) for progress bar */
  progress?: number;
  /** Whether to show warning state (red color) */
  warning?: boolean;
}

/**
 * MetricRow displays an individual metric with optional progress visualization
 *
 * Features:
 * - Label and value display
 * - Optional progress bar for percentage metrics
 * - Warning state changes color to red
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <MetricRow label="CPU Usage" value={45} unit="%" progress={45} />
 * <MetricRow label="Response Time" value={125} unit="ms" />
 * <MetricRow label="Connections" value="25 / 100" progress={25} warning={false} />
 * ```
 */
export default function MetricRow({ label, value, unit, progress, warning }: MetricRowProps) {
  const valueColor = warning ? 'text-red-600' : 'text-gray-900';
  const progressColor = warning ? 'bg-red-500' : 'bg-indigo-600';

  return (
    <div className="space-y-1">
      {/* Label and value row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${valueColor}`}>
          {value}
          {unit && <span className="text-gray-500 ml-1">{unit}</span>}
        </span>
      </div>

      {/* Optional progress bar */}
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
