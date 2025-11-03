/**
 * Storage Statistics Component
 * Display storage usage statistics and metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { StorageStats as StorageStatsType, EntityScope } from '@/types/storage';

interface StorageStatsProps {
  entityScope?: EntityScope;
}

export function StorageStats({ entityScope }: StorageStatsProps) {
  const [stats, setStats] = useState<StorageStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [entityScope]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (entityScope) params.append('entityScope', entityScope);

      const response = await fetch(`/api/storage/stats?${params}`);

      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error || 'Failed to load statistics'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Files
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalFiles.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Storage
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatSize(stats.totalSize)}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Files
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(stats.filesByStatus?.active || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Files by bucket */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Files by Bucket
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.filesByBucket).map(([bucket, count]) => (
            <div key={bucket} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{bucket}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {count} files
                </span>
                <span className="text-sm text-gray-500">
                  {formatSize(stats.sizeByBucket[bucket] || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent uploads */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Uploads
        </h3>
        <div className="space-y-3">
          {stats.recentUploads.slice(0, 5).map((file) => (
            <div key={file.id} className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalFilename}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(file.uploadedAt).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-gray-500 ml-4">
                {formatSize(file.fileSizeBytes)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
