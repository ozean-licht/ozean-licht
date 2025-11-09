/**
 * File Upload Form Component
 * Drag-and-drop file upload with validation and progress tracking
 * Now using ShadCN UI components for consistent styling
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { EntityScope } from '@/types/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        setSuccess(false);
      } else {
        setError(validation.error || 'Invalid file');
        onUploadError?.(validation.error || 'Invalid file');
      }
    }
  }, [onUploadError]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (file) {
        const validation = validateFile(file);
        if (validation.valid) {
          setSelectedFile(file);
          setSuccess(false);
        } else {
          setError(validation.error || 'Invalid file');
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
    setError(null);
    setSuccess(false);

    try {
      // Generate file key with timestamp
      const timestamp = Date.now();
      const fileKey = `${entityScope}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${timestamp}-${selectedFile.name}`;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

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

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      onUploadComplete?.(result.fileKey);

      // Show success state
      setSuccess(true);

      // Reset form after a delay
      setTimeout(() => {
        setSelectedFile(null);
        setTags('');
        setProgress(0);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>
          Upload files to {entityScope === 'kids_ascension' ? 'Kids Ascension' : 'Ozean Licht'} storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              File uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Drag-drop zone */}
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25',
            selectedFile && 'bg-muted/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelectedFile}
                disabled={isUploading}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drag and drop file here
                </p>
                <p className="text-xs text-muted-foreground">or</p>
              </div>
              <label>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleFileSelect}
                  accept="video/*,image/*,application/pdf,application/zip"
                />
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    Select File
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground">
                Supported: Video, Images, PDF, ZIP (Max 500MB)
              </p>
            </div>
          )}
        </div>

        {/* Tags input */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (optional)</Label>
          <Input
            id="tags"
            type="text"
            placeholder="e.g., video, kids, lesson (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isUploading}
          />
          {tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.split(',').map((tag, index) => {
                const trimmed = tag.trim();
                return trimmed ? (
                  <Badge key={index} variant="secondary">
                    {trimmed}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Upload button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}