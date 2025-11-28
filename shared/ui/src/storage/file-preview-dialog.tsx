'use client';

/**
 * File Preview Dialog Component
 * Inline file previews for images, videos, PDFs with navigation
 */

import * as React from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react'
import { Dialog, DialogPopup } from '../cossui/dialog'
import { Button } from '../cossui/button'
import { cn } from '../utils/cn'
import type { StorageFile } from './types'

export interface FilePreviewDialogProps {
  file: StorageFile
  files?: StorageFile[] // For prev/next navigation
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate?: (file: StorageFile) => void
  onDownload?: (file: StorageFile) => void
  className?: string
}

export function FilePreviewDialog({
  file,
  files = [],
  open,
  onOpenChange,
  onNavigate,
  onDownload,
  className,
}: FilePreviewDialogProps) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Get current file index for navigation
  const currentIndex = files.findIndex((f) => f.id === file.id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < files.length - 1 && currentIndex !== -1

  // Reset state when file changes
  React.useEffect(() => {
    setZoom(1)
    setRotation(0)
    setIsPlaying(false)
  }, [file.id])

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        handleNavigate(-1)
      } else if (e.key === 'ArrowRight' && hasNext) {
        handleNavigate(1)
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn()
      } else if (e.key === '-') {
        handleZoomOut()
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotate()
      } else if (e.key === ' ' && isVideo(file)) {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, file, hasPrevious, hasNext, zoom, rotation, isPlaying])

  const handleNavigate = (direction: number) => {
    if (!files.length || currentIndex === -1) return

    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < files.length) {
      const newFile = files[newIndex]
      if (onNavigate) {
        onNavigate(newFile)
      }
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const isImage = (file: StorageFile) => {
    return file.mimeType.startsWith('image/')
  }

  const isVideo = (file: StorageFile) => {
    return file.mimeType.startsWith('video/')
  }

  const isPdf = (file: StorageFile) => {
    return file.mimeType === 'application/pdf'
  }

  const canPreview = isImage(file) || isVideo(file) || isPdf(file)

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className={cn(
          'max-w-7xl h-[90vh] p-0 glass-card-strong border-primary/30',
          'flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0E282E]">
          <div className="flex-1 min-w-0">
            <h2 className="font-sans text-lg text-white truncate">{file.name}</h2>
            <p className="text-sm text-[#C4C8D4]">
              {formatBytes(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Download Button */}
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload(file)}
                className="text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-[#C4C8D4] hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex min-h-0">
          {/* Main Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-[#00070F] relative overflow-hidden">
            {canPreview ? (
              <>
                {/* Image Preview */}
                {isImage(file) && (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <img
                      src={`/api/storage/preview/${file.bucket}/${file.path}`}
                      alt={file.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      }}
                    />

                    {/* Image Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card-strong rounded-lg p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="text-primary hover:bg-primary/10"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-white font-mono min-w-[4rem] text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        className="text-primary hover:bg-primary/10"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-[#0E282E] mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotate}
                        className="text-primary hover:bg-primary/10"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-primary hover:bg-primary/10"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video Preview */}
                {isVideo(file) && (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <video
                      ref={videoRef}
                      src={`/api/storage/preview/${file.bucket}/${file.path}`}
                      className="max-w-full max-h-full rounded-lg"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card-strong rounded-lg p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="text-primary hover:bg-primary/10"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-primary hover:bg-primary/10"
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* PDF Preview */}
                {isPdf(file) && (
                  <iframe
                    src={`/api/storage/preview/${file.bucket}/${file.path}`}
                    className="w-full h-full border-0"
                    title={file.name}
                  />
                )}
              </>
            ) : (
              /* Unsupported File Type */
              <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="rounded-full bg-card p-6">
                  <Download className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-lg text-white mb-2">Preview not available</h3>
                  <p className="text-sm text-[#C4C8D4] mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  {onDownload && (
                    <Button
                      onClick={() => onDownload(file)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {files.length > 1 && (
              <>
                {hasPrevious && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 glass-card-strong text-primary hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                {hasNext && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 glass-card-strong text-primary hover:bg-primary/10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Metadata Sidebar */}
          <div className="w-80 border-l border-[#0E282E] bg-card/50 p-6 overflow-y-auto">
            <h3 className="font-sans text-base text-white mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  File Name
                </label>
                <p className="text-sm text-white mt-1 break-all">{file.name}</p>
              </div>

              <div>
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  File Path
                </label>
                <p className="text-sm text-white mt-1 break-all font-mono">{file.path}</p>
              </div>

              <div>
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  Size
                </label>
                <p className="text-sm text-white mt-1">{formatBytes(file.size)}</p>
              </div>

              <div>
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  Type
                </label>
                <p className="text-sm text-white mt-1">{file.mimeType}</p>
              </div>

              <div>
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  Uploaded
                </label>
                <p className="text-sm text-white mt-1">{formatDate(file.uploadedAt)}</p>
              </div>

              {file.uploadedBy && (
                <div>
                  <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                    Uploaded By
                  </label>
                  <p className="text-sm text-white mt-1">{file.uploadedBy}</p>
                </div>
              )}

              {file.md5Hash && (
                <div>
                  <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                    MD5 Checksum
                  </label>
                  <p className="text-xs text-white mt-1 break-all font-mono">{file.md5Hash}</p>
                </div>
              )}

              {file.tags && file.tags.length > 0 && (
                <div>
                  <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {file.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {files.length > 1 && (
                <div className="pt-4 border-t border-[#0E282E]">
                  <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                    Navigation
                  </label>
                  <p className="text-sm text-white mt-1">
                    {currentIndex + 1} of {files.length} files
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}
