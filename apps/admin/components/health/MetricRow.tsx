/**
 * Metric Row Component
 *
 * Displays a single metric with label, value, and optional progress bar.
 * Uses @ozean-licht/shared-ui components with Ozean Licht design system.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MetricRowProps {
  /** Metric label (e.g., "Active Connections") */
  label: string;
  /** Metric value (e.g., "25 / 100" or "45%") */
  value: string | number;
  /** Optional unit (e.g., "ms", "%", "GB") */
  unit?: string;
  /** Optional progress percentage (0-100) for progress bar */
  progress?: number;
  /** Whether to show warning state (red/amber color) */
  warning?: boolean;
}

/**
 * MetricRow displays an individual metric with optional progress visualization
 *
 * Features:
 * - Label and value display with Ozean Licht typography
 * - Optional progress bar with glass morphism effect
 * - Warning state changes color to amber/red
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
  const valueColor = warning ? 'text-warning' : 'text-white';
  const progressBarColor = warning
    ? 'bg-warning shadow-warning/30'
    : 'bg-primary shadow-primary/30';

  return (
    <div className="space-y-1.5">
      {/* Label and value row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-sans font-light text-[#C4C8D4]">{label}</span>
        <span className={cn('text-sm font-sans font-medium', valueColor)}>
          {value}
          {unit && <span className="text-[#C4C8D4]/70 ml-1">{unit}</span>}
        </span>
      </div>

      {/* Optional progress bar with Ozean Licht glass morphism */}
      {progress !== undefined && (
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-card/70 backdrop-blur-8 border border-border"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out shadow-lg',
              progressBarColor
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
