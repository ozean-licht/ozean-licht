'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label: string;
  aspectRatio?: '16:9' | '1:1' | '4:3';
  bucket?: string;
  disabled?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  aspectRatio = '16:9',
  bucket = 'course-images',
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { url } = await response.json();
      onChange(url);
      setPreview(url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(value || null);
    } finally {
      setUploading(false);
      // Revoke the local preview URL to free memory
      URL.revokeObjectURL(localPreview);
    }
  }, [bucket, onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || uploading,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError('File too large. Maximum size is 5MB');
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Use JPEG, PNG, WebP, or GIF');
      } else {
        setError('Failed to upload file');
      }
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setPreview(null);
    setError(null);
  };

  const aspectClasses = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        {...getRootProps()}
        className={`
          relative ${aspectClasses[aspectRatio]} rounded-lg border-2 border-dashed
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${uploading || disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50'}
          ${error ? 'border-destructive' : ''}
          transition-colors overflow-hidden bg-muted/20
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
            {!uploading && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            {isDragActive ? (
              <>
                <Upload className="h-10 w-10 mb-2 text-primary" />
                <p className="text-sm text-primary">Drop image here</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 mb-2" />
                <p className="text-sm">Drop image or click to upload</p>
                <p className="text-xs mt-1">JPG, PNG, WebP, GIF (max 5MB)</p>
              </>
            )}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
