'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { FileText, Upload, X, Link, Loader2 } from 'lucide-react';
import {
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUITabs,
  CossUITabsList,
  CossUITabsTab,
  CossUITabsPanel,
} from '@shared/ui';

interface PdfUploaderProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function PdfUploader({
  value,
  onChange,
  disabled = false,
  error,
}: PdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract filename from URL
  const getFilename = (url: string): string => {
    if (!url) return '';
    try {
      const pathname = new URL(url).pathname;
      return pathname.split('/').pop() || 'document.pdf';
    } catch {
      return url.split('/').pop() || 'document.pdf';
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Invalid file type', {
        description: 'Please select a PDF file.',
      });
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Maximum file size is 10MB.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      onChange(data.url);
      setUrlInput(data.url);

      toast.success('PDF uploaded', {
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      toast.error('Upload failed', {
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle URL input submit
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success('PDF URL set', {
        description: 'The PDF URL has been saved.',
      });
    }
  };

  // Handle clear
  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  // If a PDF is already set, show preview
  if (value) {
    return (
      <div className={`rounded-lg border ${error ? 'border-destructive' : 'border-[#0E282E]'} bg-[#00111A] p-4`}>
        <div className="flex items-center gap-4">
          {/* PDF Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#00070F] flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {getFilename(value)}
            </p>
            <p className="text-xs text-[#C4C8D4]/70 truncate">
              {value}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <CossUIButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(value, '_blank')}
              disabled={disabled}
              className="text-[#C4C8D4] hover:text-white"
            >
              Preview
            </CossUIButton>
            <CossUIButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="text-[#C4C8D4] hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </CossUIButton>
          </div>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${error ? 'border-destructive' : 'border-[#0E282E]'} bg-[#00111A] overflow-hidden`}>
      <CossUITabs defaultValue="upload">
        <CossUITabsList className="w-full border-b border-[#0E282E] bg-transparent">
          <CossUITabsTab value="upload" className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </CossUITabsTab>
          <CossUITabsTab value="url" className="flex-1">
            <Link className="w-4 h-4 mr-2" />
            URL
          </CossUITabsTab>
        </CossUITabsList>

        {/* Upload Tab */}
        <CossUITabsPanel value="upload" className="pt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#C4C8D4]">Uploading...</p>
              <div className="mt-2 w-full max-w-xs mx-auto bg-[#00070F] rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-full py-8 border-2 border-dashed border-[#0E282E] rounded-lg
                hover:border-primary/50 hover:bg-primary/5 transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#00111A]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-8 h-8 text-[#C4C8D4] mx-auto mb-2" />
              <p className="text-sm text-[#C4C8D4]">
                Click to upload PDF
              </p>
              <p className="text-xs text-[#C4C8D4]/50 mt-1">
                Maximum file size: 10MB
              </p>
            </button>
          )}
        </CossUITabsPanel>

        {/* URL Tab */}
        <CossUITabsPanel value="url" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <CossUILabel>PDF URL</CossUILabel>
              <div className="flex gap-2">
                <CossUIInput
                  value={urlInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/document.pdf"
                  type="url"
                  disabled={disabled}
                  className="flex-1"
                />
                <CossUIButton
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={disabled || !urlInput.trim()}
                >
                  Set URL
                </CossUIButton>
              </div>
            </div>
            <p className="text-xs text-[#C4C8D4]/70">
              Enter the URL of an existing PDF file
            </p>
          </div>
        </CossUITabsPanel>
      </CossUITabs>

      {error && <p className="text-sm text-destructive px-4 pb-4">{error}</p>}
    </div>
  );
}
