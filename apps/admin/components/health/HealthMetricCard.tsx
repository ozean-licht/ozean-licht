/**
 * Health Metric Card Component
 *
 * Reusable card component for displaying health metrics with status badges.
 * Uses @ozean-licht/shared-ui components with Ozean Licht design system.
 */

'use client';

import React from 'react';
import { ServiceStatus, SystemStatus } from '@/types/health';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
 * Status badge variants (Ozean Licht design):
 * - success: 'up' or 'healthy'
 * - warning: 'degraded'
 * - destructive: 'down'
 *
 * @example
 * ```tsx
 * <HealthMetricCard title="Database" status="up">
 *   <MetricRow label="Connections" value="25 / 100" />
 * </HealthMetricCard>
 * ```
 */
export default function HealthMetricCard({ title, status, children }: HealthMetricCardProps) {
  // Determine badge variant based on status
  const getBadgeVariant = (): 'success' | 'warning' | 'destructive' => {
    if (status === 'up' || status === 'healthy') {
      return 'success';
    } else if (status === 'degraded') {
      return 'warning';
    } else {
      return 'destructive';
    }
  };

  // Determine status text
  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="bg-card/70 backdrop-blur-12">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-sans font-medium text-white">
            {title}
          </CardTitle>
          <Badge variant={getBadgeVariant()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">{children}</div>
      </CardContent>
    </Card>
  );
}
