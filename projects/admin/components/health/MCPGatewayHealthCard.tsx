/**
 * MCP Gateway Health Card Component
 *
 * Specialized card for displaying MCP Gateway service health metrics.
 * Shows response time percentiles, uptime, and request statistics.
 */

import React from 'react';
import { MCPGatewayHealth } from '@/types/health';
import HealthMetricCard from './HealthMetricCard';
import MetricRow from './MetricRow';

interface MCPGatewayHealthCardProps {
  /** MCP Gateway health metrics */
  metrics: MCPGatewayHealth;
}

/**
 * MCPGatewayHealthCard displays health metrics for the MCP Gateway service
 *
 * Displayed metrics:
 * - Response time percentiles (p50, p95, p99) in milliseconds
 * - Uptime formatted as "Xd Xh"
 * - 24h request count with locale formatting
 *
 * @example
 * ```tsx
 * <MCPGatewayHealthCard metrics={gatewayMetrics} />
 * ```
 */
export default function MCPGatewayHealthCard({ metrics }: MCPGatewayHealthCardProps) {
  const { status, p50, p95, p99, uptime, requestCount24h } = metrics;

  // Format uptime as "Xd Xh"
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  // Format request count with locale-specific thousands separators
  const formatRequestCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <HealthMetricCard title="MCP Gateway" status={status}>
      {/* Response Time Percentiles */}
      <MetricRow label="Response Time (p50)" value={p50.toFixed(0)} unit="ms" />
      <MetricRow label="Response Time (p95)" value={p95.toFixed(0)} unit="ms" />
      <MetricRow label="Response Time (p99)" value={p99.toFixed(0)} unit="ms" />

      {/* Uptime */}
      <MetricRow label="Uptime" value={formatUptime(uptime)} />

      {/* Request Count */}
      <MetricRow label="Requests (24h)" value={formatRequestCount(requestCount24h)} />
    </HealthMetricCard>
  );
}
