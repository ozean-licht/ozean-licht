/**
 * Storage Management Page
 * Main page for file storage management
 */

import { Suspense } from 'react';
import { StorageStats } from '@/components/storage/StorageStats';
import { FileList } from '@/components/storage/FileList';
import { FileUploadForm } from '@/components/storage/FileUploadForm';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';

export default async function StoragePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Storage Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage files stored in MinIO buckets
        </p>
      </div>

      {/* Statistics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Storage Overview
        </h2>
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-100 h-48 rounded-lg"></div>
          }
        >
          <StorageStats />
        </Suspense>
      </section>

      {/* Upload Form */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload File
        </h2>
        <div className="bg-white shadow rounded-lg p-6">
          <FileUploadForm
            bucket="shared-assets"
            entityScope="shared"
            uploadedBy={session.user.id || ''}
            onUploadComplete={() => {
              // Refresh file list
              window.location.reload();
            }}
            onUploadError={(error) => {
              alert(`Upload failed: ${error}`);
            }}
          />
        </div>
      </section>

      {/* File List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Files</h2>
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-100 h-96 rounded-lg"></div>
          }
        >
          <FileList
            onFileClick={() => {
              // File click handler - no action needed
            }}
            onDeleteFile={async (fileKey) => {
              if (confirm('Are you sure you want to delete this file?')) {
                try {
                  const response = await fetch('/api/storage/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileKey }),
                  });

                  if (!response.ok) {
                    throw new Error('Delete failed');
                  }

                  window.location.reload();
                } catch (error) {
                  alert('Failed to delete file');
                }
              }
            }}
          />
        </Suspense>
      </section>
    </div>
  );
}
