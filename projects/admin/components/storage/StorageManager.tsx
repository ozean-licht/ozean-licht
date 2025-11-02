/**
 * StorageManager Component
 *
 * Main storage interface for managing buckets and files.
 * Displays bucket list, file list, and provides upload/download/delete operations.
 */

'use client';

import React, { useState } from 'react';
import { BucketStats, StorageObject } from '@/types/storage';
import StorageBucketCard from './StorageBucketCard';
import FileUploader from './FileUploader';

interface StorageManagerProps {
  /** Initial bucket statistics */
  buckets: BucketStats[];
  /** Callback to refresh bucket list */
  onRefresh: () => Promise<void>;
}

/**
 * StorageManager provides a complete storage management interface
 *
 * Features:
 * - Bucket list with selection
 * - File list for selected bucket
 * - File upload with drag-and-drop
 * - File download and delete
 * - Bucket creation and deletion
 * - Storage statistics
 *
 * @example
 * ```tsx
 * <StorageManager
 *   buckets={bucketStats}
 *   onRefresh={async () => {
 *     // Fetch fresh data
 *   }}
 * />
 * ```
 */
export default function StorageManager({ buckets: initialBuckets, onRefresh }: StorageManagerProps) {
  const [buckets] = useState<BucketStats[]>(initialBuckets); // setBuckets would be used for local updates
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [objects, setObjects] = useState<StorageObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateBucket, setShowCreateBucket] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  /**
   * Handle bucket selection
   */
  const handleSelectBucket = async (bucket: string) => {
    setSelectedBucket(bucket);
    setShowUploader(false);
    await loadObjects(bucket);
  };

  /**
   * Load objects for a bucket
   */
  const loadObjects = async (bucket: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/storage/objects?bucket=${bucket}`);
      if (!response.ok) {
        throw new Error('Failed to load objects');
      }

      const data = await response.json();
      setObjects(data.objects || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load objects');
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new bucket
   */
  const handleCreateBucket = async () => {
    if (!newBucketName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/storage/buckets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBucketName }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create bucket');
      }

      // Refresh bucket list
      await onRefresh();
      setNewBucketName('');
      setShowCreateBucket(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create bucket');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a bucket
   */
  const handleDeleteBucket = async (bucket: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/storage/buckets?name=${bucket}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete bucket');
      }

      // Clear selection if deleted bucket was selected
      if (selectedBucket === bucket) {
        setSelectedBucket(null);
        setObjects([]);
      }

      // Refresh bucket list
      await onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete bucket');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download a file
   */
  const handleDownloadFile = async (bucket: string, key: string) => {
    try {
      const response = await fetch(`/api/storage/download?bucket=${bucket}&key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = key.split('/').pop() || key;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to download file');
    }
  };

  /**
   * Delete a file
   */
  const handleDeleteFile = async (bucket: string, key: string) => {
    if (!confirm(`Delete file "${key}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/storage/objects?bucket=${bucket}&key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete file');
      }

      // Refresh object list
      await loadObjects(bucket);
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle upload complete
   */
  const handleUploadComplete = async () => {
    if (selectedBucket) {
      await loadObjects(selectedBucket);
      await onRefresh(); // Refresh stats
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: Bucket list */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Buckets</h2>
          <button
            onClick={() => setShowCreateBucket(!showCreateBucket)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + New Bucket
          </button>
        </div>

        {/* Create bucket form */}
        {showCreateBucket && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <input
              type="text"
              value={newBucketName}
              onChange={(e) => setNewBucketName(e.target.value)}
              placeholder="Bucket name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreateBucket}
                disabled={!newBucketName.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateBucket(false);
                  setNewBucketName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bucket list */}
        <div className="space-y-3">
          {buckets.map((bucket) => (
            <StorageBucketCard
              key={bucket.name}
              bucket={bucket}
              selected={selectedBucket === bucket.name}
              onSelect={handleSelectBucket}
              onDelete={handleDeleteBucket}
            />
          ))}
        </div>

        {buckets.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No buckets found. Create one to get started.
          </div>
        )}
      </div>

      {/* Right column: File list and operations */}
      <div className="lg:col-span-2 space-y-4">
        {selectedBucket ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Files in {selectedBucket}
              </h2>
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showUploader ? 'Hide Uploader' : '+ Upload Files'}
              </button>
            </div>

            {/* File uploader */}
            {showUploader && (
              <FileUploader
                bucket={selectedBucket}
                onUploadComplete={handleUploadComplete}
                onUploadError={(err) => setError(err.message)}
              />
            )}

            {/* Error display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="text-center py-8">
                <svg
                  className="animate-spin h-8 w-8 mx-auto text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            {/* File list */}
            {!loading && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {objects.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {objects.map((obj) => (
                        <tr key={obj.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {obj.key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatBytes(obj.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {obj.lastModified.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                            <button
                              onClick={() => handleDownloadFile(selectedBucket, obj.key)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDeleteFile(selectedBucket, obj.key)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No files in this bucket. Upload files to get started.
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Select a bucket to view and manage files
          </div>
        )}
      </div>
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
