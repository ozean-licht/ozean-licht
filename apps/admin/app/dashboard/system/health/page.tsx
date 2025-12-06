/**
 * System Health Dashboard Page
 *
 * Main page component for the health monitoring dashboard.
 * Displays real-time health metrics for databases, MCP Gateway, and server resources.
 * Features auto-refresh every 30 seconds and manual refresh button.
 * Uses @ozean-licht/shared-ui components with Ozean Licht design system.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SystemHealth } from '@/types/health';
import { getSystemHealth } from './actions';
import DatabaseHealthCard from '@/components/health/DatabaseHealthCard';
import MCPGatewayHealthCard from '@/components/health/MCPGatewayHealthCard';
import ServerHealthCard from '@/components/health/ServerHealthCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

/**
 * Refresh Icon SVG component
 */
function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

/**
 * Warning Icon SVG component
 */
function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

/**
 * Error Icon SVG component
 */
function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function HealthDashboardPage() {
  // State management
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Fetch health data from server action
   */
  const fetchHealth = async () => {
    try {
      const data = await getSystemHealth();
      setHealth(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);
      console.error('Health fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * Manual refresh handler
   */
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchHealth();
  };

  /**
   * Initial load and auto-refresh setup
   */
  useEffect(() => {
    // Initial fetch
    fetchHealth();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealth();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  /**
   * Loading state with Ozean Licht skeleton
   */
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Cards skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-52 rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-52 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-decorative font-normal text-white">
              System Health
            </h1>
            <p className="text-[#C4C8D4] font-sans font-light">
              Real-time monitoring of infrastructure health and performance
            </p>
          </div>

          {/* Manual Refresh Button - Ozean Licht styled */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg
                       hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 font-sans font-medium text-sm"
          >
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Last Updated with Badge */}
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#C4C8D4]/70 font-sans font-light">
              Last updated:
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              {lastUpdated.toLocaleTimeString()}
            </Badge>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <ErrorIcon className="w-4 h-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overall Status Banner */}
      {health && health.status !== 'healthy' && (
        <Alert variant={health.status === 'degraded' ? 'warning' : 'destructive'}>
          <WarningIcon className="w-4 h-4" />
          <AlertTitle>
            System Status: {health.status === 'degraded' ? 'Degraded' : 'Down'}
          </AlertTitle>
          <AlertDescription>
            {health.status === 'degraded'
              ? 'Some services are experiencing issues. Performance may be affected.'
              : 'Critical services are unavailable. Please check the status below.'}
          </AlertDescription>
        </Alert>
      )}

      {/* PostgreSQL Databases Section */}
      {health && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-sans font-medium text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              PostgreSQL Databases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatabaseHealthCard metrics={health.postgres.kidsAscension} />
              <DatabaseHealthCard metrics={health.postgres.ozeanLicht} />
            </div>
          </section>

          {/* Services Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-sans font-medium text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MCPGatewayHealthCard metrics={health.mcpGateway} />
              <ServerHealthCard metrics={health.server} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
