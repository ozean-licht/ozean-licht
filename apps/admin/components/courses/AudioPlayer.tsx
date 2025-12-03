'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { CossUIButton } from '@shared/ui';

// Generate unique ID for each player instance
let playerIdCounter = 0;

interface AudioPlayerProps {
  src: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  className?: string;
}

/**
 * Format seconds to mm:ss or hh:mm:ss
 */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({
  src,
  title,
  onTimeUpdate,
  onDurationChange,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for this player instance
  const playerId = useMemo(() => `audio-player-${++playerIdCounter}`, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
      onDurationChange?.(audioRef.current.duration);
    }
  }, [onDurationChange]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  }, [onTimeUpdate]);

  // Handle ended
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Seek to time
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [duration]);

  // Skip backward 10 seconds
  const skipBackward = useCallback(() => {
    seekTo(currentTime - 10);
  }, [currentTime, seekTo]);

  // Skip forward 10 seconds
  const skipForward = useCallback(() => {
    seekTo(currentTime + 10);
  }, [currentTime, seekTo]);

  // Restart from beginning
  const restart = useCallback(() => {
    seekTo(0);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, seekTo]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number | readonly number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Cycle playback rate
  const cyclePlaybackRate = useCallback(() => {
    const rates = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  }, [playbackRate]);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    seekTo(percent * duration);
  }, [duration, seekTo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if this specific player's container is focused
      if (!document.activeElement?.closest(`[data-audio-player="${playerId}"]`)) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          skipForward();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerId, togglePlay, skipBackward, skipForward, toggleMute, handleVolumeChange, volume]);

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      data-audio-player={playerId}
      className={`bg-[#00111A] border border-[#0E282E] rounded-lg p-4 ${className}`}
      tabIndex={0}
      role="region"
      aria-label={`Audio player${title ? ` for ${title}` : ''}`}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
        aria-label={title || 'Audio'}
      />

      {/* Title */}
      {title && (
        <p className="text-sm font-medium text-white mb-3 truncate">{title}</p>
      )}

      {/* Waveform-style progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="relative h-12 bg-[#00070F] rounded-lg cursor-pointer overflow-hidden mb-4
          hover:ring-1 hover:ring-primary/30 transition-all"
        role="slider"
        aria-label="Audio progress"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        {/* Waveform bars (decorative) */}
        <div className="absolute inset-0 flex items-center justify-around px-1 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => {
            // Generate pseudo-random heights for waveform effect
            const height = 30 + Math.sin(i * 0.5) * 20 + Math.sin(i * 1.2) * 15 + Math.sin(i * 0.3) * 10;
            const isActive = (i / 50) * 100 <= progressPercent;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-colors duration-150 ${
                  isActive ? 'bg-primary' : 'bg-[#0E282E]'
                }`}
                style={{ height: `${Math.max(10, Math.min(100, height))}%` }}
              />
            );
          })}
        </div>

        {/* Progress overlay */}
        <div
          className="absolute inset-y-0 left-0 bg-primary/10 pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Playhead indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between text-xs text-[#C4C8D4] mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1">
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={restart}
            className="text-[#C4C8D4] hover:text-white"
            title="Restart (0)"
          >
            <RotateCcw className="w-4 h-4" />
          </CossUIButton>

          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={skipBackward}
            className="text-[#C4C8D4] hover:text-white"
            title="Back 10s (J / Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </CossUIButton>

          <CossUIButton
            type="button"
            variant={isPlaying ? 'secondary' : 'default'}
            size="sm"
            onClick={togglePlay}
            disabled={!isLoaded}
            className="w-10 h-10 p-0"
            title="Play/Pause (Space / K)"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </CossUIButton>

          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={skipForward}
            className="text-[#C4C8D4] hover:text-white"
            title="Forward 10s (L / Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </CossUIButton>

          {/* Playback speed */}
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={cyclePlaybackRate}
            className="text-[#C4C8D4] hover:text-white min-w-[3rem] text-xs font-mono"
            title="Playback speed"
          >
            {playbackRate}x
          </CossUIButton>
        </div>

        {/* Right: Volume control */}
        <div className="flex items-center gap-2">
          <CossUIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-[#C4C8D4] hover:text-white"
            title="Toggle mute (M)"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </CossUIButton>

          <div className="w-20">
            <input
              type="range"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.05}
              aria-label="Volume"
              className="w-full h-2 bg-[#0E282E] rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
