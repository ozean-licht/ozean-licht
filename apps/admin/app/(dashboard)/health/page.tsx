/**
 * System Health Dashboard Page
 *
 * Main page component for the health monitoring dashboard.
 * Displays real-time health metrics for databases, MCP Gateway, and server resources.
 * Features auto-refresh every 30 seconds and manual refresh button.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SystemHealth } from '@/types/health';
import { getSystemHealth } from './actions';
import DatabaseHealthCard from '@/components/health/DatabaseHealthCard';
import MCPGatewayHealthCard from '@/components/health/MCPGatewayHealthCard';
import ServerHealthCard from '@/components/health/ServerHealthCard';

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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch health data');
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
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring of infrastructure health and performance
            </p>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
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
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
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
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Overall Status Banner */}
      {health && health.status !== 'healthy' && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            health.status === 'degraded'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center">
            <svg
              className={`w-5 h-5 mr-2 ${
                health.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
              }`}
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
            <span
              className={`font-medium ${
                health.status === 'degraded' ? 'text-yellow-800' : 'text-red-800'
              }`}
            >
              System Status: {health.status === 'degraded' ? 'Degraded' : 'Down'}
            </span>
          </div>
        </div>
      )}

      {/* PostgreSQL Databases Section */}
      {health && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PostgreSQL Databases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DatabaseHealthCard metrics={health.postgres.kidsAscension} />
              <DatabaseHealthCard metrics={health.postgres.ozeanLicht} />
              <DatabaseHealthCard metrics={health.postgres.sharedUsers} />
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MCPGatewayHealthCard metrics={health.mcpGateway} />
              <ServerHealthCard metrics={health.server} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
