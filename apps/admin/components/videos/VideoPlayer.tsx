'use client';

/**
 * VideoPlayer Component
 *
 * Advanced video player with HLS support, multiple fallback sources, and quality selection.
 * Designed for self-hosted video streaming with Bunny CDN and Vimeo fallback.
 *
 * Features:
 * - HLS.js for adaptive bitrate streaming (HLS manifests from Bunny CDN)
 * - Native HTML5 video fallback for MP4
 * - Vimeo iframe embed as final fallback
 * - Quality selector for HLS streams (360p, 480p, 720p, 1080p, Auto)
 * - Responsive aspect ratio container
 * - Loading states and error handling with retry
 * - Progress tracking and event callbacks
 * - Dark theme compatible styling
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ================================================================
// Types & Interfaces
// ================================================================

interface VideoPlayerProps {
  /** Primary source (HLS manifest URL from Bunny CDN) */
  hlsUrl?: string;
  /** Fallback source (direct mp4 URL) */
  mp4Url?: string;
  /** Vimeo embed fallback */
  vimeoId?: string;
  vimeoEmbedUrl?: string;
  /** Display options */
  poster?: string;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  /** Behavior */
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  /** Callbacks */
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

interface HlsQualityLevel {
  height: number;
  bitrate: number;
  index: number;
}

// ================================================================
// Constants
// ================================================================

const ASPECT_RATIO_CLASSES = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
};

const QUALITY_LABELS: Record<number, string> = {
  360: '360p',
  480: '480p',
  720: '720p HD',
  1080: '1080p Full HD',
  1440: '1440p 2K',
  2160: '4K',
};

// ================================================================
// Component
// ================================================================

export default function VideoPlayer({
  hlsUrl,
  mp4Url,
  vimeoId,
  vimeoEmbedUrl,
  poster,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  muted = false,
  controls = true,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
}: VideoPlayerProps) {
  // ================================================================
  // State Management
  // ================================================================

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHlsSupported, setIsHlsSupported] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<HlsQualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
  const [sourceType, setSourceType] = useState<'hls' | 'mp4' | 'vimeo' | null>(null);

  // ================================================================
  // HLS Initialization
  // ================================================================

  const initHls = useCallback(async () => {
    if (!hlsUrl || !videoRef.current) return;

    try {
      // Dynamically import hls.js (client-side only)
      const Hls = (await import('hls.js')).default;

      // Check HLS support
      if (Hls.isSupported()) {
        setIsHlsSupported(true);
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        });

        hlsRef.current = hls;

        // Load HLS source
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);

        // Event: Manifest parsed (quality levels available)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('[VideoPlayer] HLS manifest parsed');
          setIsLoading(false);
          setSourceType('hls');

          // Extract quality levels
          const levels = hls.levels.map((level, index) => ({
            height: level.height,
            bitrate: level.bitrate,
            index,
          }));
          setAvailableQualities(levels);
          setCurrentQuality(-1); // Auto by default

          // Auto-play if enabled
          if (autoPlay) {
            videoRef.current?.play().catch((err) => {
              console.warn('[VideoPlayer] Auto-play prevented:', err);
            });
          }
        });

        // Event: Errors
        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.error('[VideoPlayer] HLS error:', data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('[VideoPlayer] Network error, attempting recovery...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('[VideoPlayer] Media error, attempting recovery...');
                hls.recoverMediaError();
                break;
              default:
                // Fatal error, try fallback
                handleFallback(new Error(`HLS fatal error: ${data.type}`));
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        console.log('[VideoPlayer] Using native HLS support');
        videoRef.current.src = hlsUrl;
        setIsHlsSupported(true);
        setIsLoading(false);
        setSourceType('hls');
      } else {
        // No HLS support, try fallback
        handleFallback(new Error('HLS not supported'));
      }
    } catch (err) {
      console.error('[VideoPlayer] Error initializing HLS:', err);
      handleFallback(err as Error);
    }
  }, [hlsUrl, autoPlay]);

  // ================================================================
  // Fallback Logic
  // ================================================================

  const handleFallback = useCallback((err: Error) => {
    console.warn('[VideoPlayer] Falling back to alternative source:', err.message);

    // Try MP4 fallback
    if (mp4Url && videoRef.current) {
      console.log('[VideoPlayer] Using MP4 fallback');
      videoRef.current.src = mp4Url;
      setSourceType('mp4');
      setIsLoading(false);
      setError(null);
      return;
    }

    // Try Vimeo fallback
    if (vimeoId || vimeoEmbedUrl) {
      console.log('[VideoPlayer] Using Vimeo fallback');
      setSourceType('vimeo');
      setIsLoading(false);
      setError(null);
      return;
    }

    // No fallback available
    setError('No playable video source available');
    setIsLoading(false);
    onError?.(err);
  }, [mp4Url, vimeoId, vimeoEmbedUrl, onError]);

  // ================================================================
  // Quality Selection
  // ================================================================

  const handleQualityChange = useCallback((qualityIndex: number) => {
    if (!hlsRef.current) return;

    setCurrentQuality(qualityIndex);

    if (qualityIndex === -1) {
      // Auto quality
      hlsRef.current.currentLevel = -1;
    } else {
      // Manual quality
      hlsRef.current.currentLevel = qualityIndex;
    }
  }, []);

  // ================================================================
  // Video Event Handlers
  // ================================================================

  const handlePlay = useCallback(() => {
    console.log('[VideoPlayer] Play');
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    console.log('[VideoPlayer] Pause');
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    console.log('[VideoPlayer] Ended');
    onEnded?.();
  }, [onEnded]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  const handleVideoError = useCallback(() => {
    const videoError = videoRef.current?.error;
    const errorMessage = videoError
      ? `Video error: ${videoError.message} (code: ${videoError.code})`
      : 'Unknown video error';

    console.error('[VideoPlayer]', errorMessage);
    handleFallback(new Error(errorMessage));
  }, [handleFallback]);

  const handleLoadedData = useCallback(() => {
    console.log('[VideoPlayer] Video loaded');
    setIsLoading(false);
    setError(null);
  }, []);

  // ================================================================
  // Retry Logic
  // ================================================================

  const handleRetry = useCallback(() => {
    console.log('[VideoPlayer] Retrying...');
    setError(null);
    setIsLoading(true);

    // Cleanup existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Retry with HLS
    if (hlsUrl) {
      initHls();
    } else if (mp4Url && videoRef.current) {
      videoRef.current.src = mp4Url;
      videoRef.current.load();
    }
  }, [hlsUrl, mp4Url, initHls]);

  // ================================================================
  // Lifecycle
  // ================================================================

  useEffect(() => {
    // Initialize video source
    if (hlsUrl) {
      initHls();
    } else if (mp4Url && videoRef.current) {
      console.log('[VideoPlayer] Using MP4 source');
      videoRef.current.src = mp4Url;
      setSourceType('mp4');
      setIsLoading(false);
    } else if (vimeoId || vimeoEmbedUrl) {
      console.log('[VideoPlayer] Using Vimeo source');
      setSourceType('vimeo');
      setIsLoading(false);
    } else {
      setError('No video source provided');
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsUrl, mp4Url, vimeoId, vimeoEmbedUrl, initHls]);

  // ================================================================
  // Quality Selector Render
  // ================================================================

  const renderQualitySelector = () => {
    if (!isHlsSupported || availableQualities.length === 0 || sourceType !== 'hls') {
      return null;
    }

    return (
      <div className="absolute bottom-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/70 hover:bg-black/90 text-white border-primary/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              {currentQuality === -1 ? 'Auto' : QUALITY_LABELS[availableQualities[currentQuality]?.height] || 'Quality'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-primary/20">
            <DropdownMenuItem
              onClick={() => handleQualityChange(-1)}
              className={cn(
                'cursor-pointer',
                currentQuality === -1 && 'bg-primary/20 text-primary font-medium'
              )}
            >
              Auto
            </DropdownMenuItem>
            {availableQualities
              .sort((a, b) => b.height - a.height)
              .map((level) => (
                <DropdownMenuItem
                  key={level.index}
                  onClick={() => handleQualityChange(level.index)}
                  className={cn(
                    'cursor-pointer',
                    currentQuality === level.index && 'bg-primary/20 text-primary font-medium'
                  )}
                >
                  {QUALITY_LABELS[level.height] || `${level.height}p`}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  // ================================================================
  // Render
  // ================================================================

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg bg-[#00111A]',
        ASPECT_RATIO_CLASSES[aspectRatio]
      )}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#00111A] z-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#0ec2bc] animate-spin" />
            <p className="text-sm text-gray-400">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#00111A] z-20">
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Playback Error</h3>
              <p className="text-sm text-gray-400 mb-4">{error}</p>
            </div>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-[#0ec2bc] text-[#0ec2bc] hover:bg-[#0ec2bc] hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Video Player (HLS or MP4) */}
      {sourceType !== 'vimeo' && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            playsInline
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            onLoadedData={handleLoadedData}
          >
            {/* Fallback for browsers without JS */}
            {mp4Url && <source src={mp4Url} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>

          {/* Quality Selector Overlay */}
          {renderQualitySelector()}
        </>
      )}

      {/* Vimeo Embed Fallback */}
      {sourceType === 'vimeo' && (
        <div className="absolute inset-0">
          <iframe
            src={vimeoEmbedUrl || `https://player.vimeo.com/video/${vimeoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title || 'Video Player'}
          />
          {/* Vimeo Fallback Notice */}
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md">
            Playing from Vimeo
          </div>
        </div>
      )}
    </div>
  );
}
