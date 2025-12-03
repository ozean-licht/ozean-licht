'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Music, Upload, X, Link, Loader2, Play, Pause } from 'lucide-react';
import {
  CossUIButton,
  CossUIInput,
  CossUILabel,
  CossUITabs,
  CossUITabsList,
  CossUITabsTab,
  CossUITabsPanel,
} from '@shared/ui';

interface AudioUploaderProps {
  value: string;
  mimeType?: string;
  onChange: (url: string, mimeType?: string, duration?: number) => void;
  disabled?: boolean;
  error?: string;
}

// Allowed audio formats
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',      // MP3
  'audio/mp3',       // MP3 alternative
  'audio/wav',       // WAV
  'audio/wave',      // WAV alternative
  'audio/ogg',       // OGG
  'audio/webm',      // WebM audio
  'audio/aac',       // AAC
  'audio/m4a',       // M4A
  'audio/x-m4a',     // M4A alternative
  'audio/mp4',       // MP4 audio
  'audio/flac',      // FLAC
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function AudioUploader({
  value,
  mimeType,
  onChange,
  disabled = false,
  error,
}: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState(value || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Extract filename from URL
  const getFilename = (url: string): string => {
    if (!url) return '';
    try {
      const pathname = new URL(url).pathname;
      const filename = pathname.split('/').pop() || 'audio';
      // Remove UUID prefix if present
      const parts = filename.split('-');
      if (parts.length > 1 && parts[0].length === 36) {
        return parts.slice(1).join('-');
      }
      return filename;
    } catch {
      return url.split('/').pop() || 'audio';
    }
  };

  // Get audio duration from file
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        const duration = Math.round(audio.duration);
        if (!isFinite(duration) || duration <= 0) {
          console.warn('[AudioUploader] Invalid audio duration detected:', duration);
          resolve(0);
        } else {
          resolve(duration);
        }
      };
      audio.onerror = (error) => {
        console.error('[AudioUploader] Failed to extract audio duration:', error);
        resolve(0);
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please select an audio file (MP3, WAV, OGG, AAC, M4A, FLAC).',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large', {
        description: 'Maximum file size is 100MB.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get audio duration before upload
      const duration = await getAudioDuration(file);

      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload/audio', {
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

      onChange(data.url, data.type, duration);
      setUrlInput(data.url);

      toast.success('Audio uploaded', {
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

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Verify URL points to audio file via HEAD request
  const verifyAudioUrl = async (url: string): Promise<{ valid: boolean; mimeType?: string; error?: string }> => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });

      if (!response.ok) {
        return { valid: false, error: `URL returned ${response.status} status` };
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('audio/')) {
        return { valid: false, error: 'URL does not point to an audio file' };
      }

      return { valid: true, mimeType: contentType.split(';')[0] };
    } catch (error) {
      // CORS or network error - fall back to extension-based validation
      console.warn('[AudioUploader] HEAD request failed, using extension fallback:', error);
      return { valid: true }; // Allow but warn user
    }
  };

  // Handle URL input submit
  const handleUrlSubmit = async () => {
    const trimmedUrl = urlInput.trim();

    if (!trimmedUrl) {
      return;
    }

    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      toast.error('Invalid URL', {
        description: 'Please enter a valid HTTP or HTTPS URL.',
      });
      return;
    }

    // Check file extension
    const ext = trimmedUrl.split('?')[0].split('.').pop()?.toLowerCase();
    const validExtensions = ['mp3', 'wav', 'ogg', 'webm', 'aac', 'm4a', 'flac'];

    if (!ext || !validExtensions.includes(ext)) {
      toast.error('Invalid audio file', {
        description: 'URL must point to a supported audio file (MP3, WAV, OGG, AAC, M4A, FLAC).',
      });
      return;
    }

    // Show loading state
    setIsUploading(true);

    // Verify URL points to audio
    const verification = await verifyAudioUrl(trimmedUrl);

    setIsUploading(false);

    if (!verification.valid && verification.error) {
      toast.error('Invalid audio URL', {
        description: verification.error,
      });
      return;
    }

    // Use verified MIME type or detect from extension
    let mimeType = verification.mimeType;
    if (!mimeType) {
      switch (ext) {
        case 'mp3':
          mimeType = 'audio/mpeg';
          break;
        case 'wav':
          mimeType = 'audio/wav';
          break;
        case 'ogg':
          mimeType = 'audio/ogg';
          break;
        case 'webm':
          mimeType = 'audio/webm';
          break;
        case 'aac':
          mimeType = 'audio/aac';
          break;
        case 'm4a':
          mimeType = 'audio/m4a';
          break;
        case 'flac':
          mimeType = 'audio/flac';
          break;
        default:
          mimeType = 'audio/mpeg';
      }
    }

    onChange(trimmedUrl, mimeType);
    toast.success('Audio URL set', {
      description: verification.mimeType
        ? 'The audio URL has been verified and saved.'
        : 'The audio URL has been saved. Verification was skipped due to CORS.',
    });
  };

  // Handle clear
  const handleClear = () => {
    onChange('', undefined, undefined);
    setUrlInput('');
    setIsPlaying(false);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Get format label from MIME type
  const getFormatLabel = (mime?: string): string => {
    if (!mime) return 'Audio';
    const formats: Record<string, string> = {
      'audio/mpeg': 'MP3',
      'audio/mp3': 'MP3',
      'audio/wav': 'WAV',
      'audio/wave': 'WAV',
      'audio/ogg': 'OGG',
      'audio/webm': 'WebM',
      'audio/aac': 'AAC',
      'audio/m4a': 'M4A',
      'audio/x-m4a': 'M4A',
      'audio/mp4': 'M4A',
      'audio/flac': 'FLAC',
    };
    return formats[mime] || 'Audio';
  };

  // If audio is already set, show preview
  if (value) {
    return (
      <div className={`rounded-lg border ${error ? 'border-destructive' : 'border-[#0E282E]'} bg-[#00111A] p-4`}>
        <div className="flex items-center gap-4">
          {/* Audio Icon / Play Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#00070F] flex items-center justify-center
              hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={disabled}
            aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary ml-0.5" />
            )}
          </button>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={value}
            onEnded={handleEnded}
            preload="metadata"
          />

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {getFilename(value)}
            </p>
            <p className="text-xs text-[#C4C8D4]/70">
              {getFormatLabel(mimeType)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <CossUIButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="text-[#C4C8D4] hover:text-destructive"
              aria-label="Remove audio file"
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
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" aria-label="Uploading audio" />
              <p className="text-sm text-[#C4C8D4]">Uploading...</p>
              <div className="mt-2 w-full max-w-xs mx-auto bg-[#00070F] rounded-full h-2" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
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
              aria-label="Click to upload audio file"
            >
              <Music className="w-8 h-8 text-[#C4C8D4] mx-auto mb-2" />
              <p className="text-sm text-[#C4C8D4]">
                Click to upload audio file
              </p>
              <p className="text-xs text-[#C4C8D4]/50 mt-1">
                MP3, WAV, OGG, AAC, M4A, FLAC (max 100MB)
              </p>
            </button>
          )}
        </CossUITabsPanel>

        {/* URL Tab */}
        <CossUITabsPanel value="url" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <CossUILabel>Audio URL</CossUILabel>
              <div className="flex gap-2">
                <CossUIInput
                  value={urlInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
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
              Enter the URL of an existing audio file
            </p>
          </div>
        </CossUITabsPanel>
      </CossUITabs>

      {error && <p className="text-sm text-destructive px-4 pb-4">{error}</p>}
    </div>
  );
}
