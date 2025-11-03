/**
 * File Upload Form Component
 * Drag-and-drop file upload with validation and progress tracking
 */

'use client';

import { useState, useCallback } from 'react';
import { EntityScope } from '@/types/storage';

interface FileUploadFormProps {
  bucket: string;
  entityScope: EntityScope;
  uploadedBy: string;
  onUploadComplete?: (fileKey: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUploadForm({
  bucket,
  entityScope,
  uploadedBy,
  onUploadComplete,
  onUploadError,
}: FileUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Max file size: 500MB
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 500MB limit' };
    }

    // Allowed types
    const allowedTypes = [
      'video/',
      'image/',
      'application/pdf',
      'application/zip',
    ];

    const isAllowed = allowedTypes.some((type) =>
      type.endsWith('/') ? file.type.startsWith(type) : file.type === type
    );

    if (!isAllowed) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      } else {
        onUploadError?.(validation.error || 'Invalid file');
      }
    }
  }, [onUploadError]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const validation = validateFile(file);
        if (validation.valid) {
          setSelectedFile(file);
        } else {
          onUploadError?.(validation.error || 'Invalid file');
        }
      }
    },
    [onUploadError]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate file key with timestamp
      const timestamp = Date.now();
      const fileKey = `${entityScope}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${timestamp}-${selectedFile.name}`;

      // Read file as buffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload via API route (which uses MCP Storage Client)
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket,
          fileKey,
          fileBuffer: buffer.toString('base64'),
          contentType: selectedFile.type,
          metadata: {
            uploadedBy,
            entityScope,
            originalFilename: selectedFile.name,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          },
        }),
      });

      setProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      onUploadComplete?.(result.fileKey);

      // Reset form
      setSelectedFile(null);
      setTags('');
      setProgress(0);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag-drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div>
            <p className="text-lg font-medium text-gray-700">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drag and drop file here
            </p>
            <p className="text-sm text-gray-500 mt-2">or</p>
            <label className="mt-4 inline-block">
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="video/*,image/*,application/pdf,application/zip"
              />
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                Select File
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Tags input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., video, kids, lesson"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isUploading}
        />
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
}
