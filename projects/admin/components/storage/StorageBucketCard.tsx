/**
 * StorageBucketCard Component
 *
 * Displays information about a storage bucket including name, size, and object count.
 * Provides actions for viewing, uploading, and deleting buckets.
 */

'use client';

import React from 'react';
import { BucketStats } from '@/types/storage';

interface StorageBucketCardProps {
  /** Bucket statistics */
  bucket: BucketStats;
  /** Callback when bucket is selected */
  onSelect?: (bucket: string) => void;
  /** Callback when delete is requested */
  onDelete?: (bucket: string) => void;
  /** Whether the bucket is currently selected */
  selected?: boolean;
}

/**
 * StorageBucketCard displays bucket information with actions
 *
 * Features:
 * - Bucket name and statistics
 * - Object count and total size
 * - Last modified date
 * - Click to select bucket
 * - Delete button
 *
 * @example
 * ```tsx
 * <StorageBucketCard
 *   bucket={{
 *     name: 'videos',
 *     objectCount: 42,
 *     size: 1024 * 1024 * 500, // 500MB
 *     lastModified: new Date()
 *   }}
 *   onSelect={(name) => console.log('Selected:', name)}
 *   onDelete={(name) => console.log('Delete:', name)}
 * />
 * ```
 */
export default function StorageBucketCard({
  bucket,
  onSelect,
  onDelete,
  selected = false,
}: StorageBucketCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(bucket.name);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onSelect
    if (onDelete && confirm(`Delete bucket "${bucket.name}"? This action cannot be undone.`)) {
      onDelete(bucket.name);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg border p-4 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Bucket icon */}
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="text-base font-semibold text-gray-900">{bucket.name}</h3>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 transition-colors"
          title="Delete bucket"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Statistics */}
      <div className="space-y-2">
        {/* Object count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Objects:</span>
          <span className="font-medium text-gray-900">
            {bucket.objectCount.toLocaleString()}
          </span>
        </div>

        {/* Size */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Size:</span>
          <span className="font-medium text-gray-900">{formatBytes(bucket.size)}</span>
        </div>

        {/* Last modified */}
        {bucket.lastModified && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last modified:</span>
            <span className="font-medium text-gray-900">
              {formatDate(bucket.lastModified)}
            </span>
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm text-blue-600">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Selected</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format date to relative time string
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString();
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return 'Just now';
  }
}
