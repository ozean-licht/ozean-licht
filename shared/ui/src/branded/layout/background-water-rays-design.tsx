'use client'

import { useEffect, useRef } from 'react'

interface BackgroundWaterRaysDesignProps {
  height?: string
  className?: string
  /**
   * Desktop video URL
   */
  desktopVideoUrl?: string
  /**
   * Tablet video URL
   */
  tabletVideoUrl?: string
  /**
   * Mobile video URL
   */
  mobileVideoUrl?: string
}

export function BackgroundWaterRaysDesign({
  height = 'h-96',
  className = '',
  desktopVideoUrl = '/videos/background-water-effect-desktop.mp4',
  tabletVideoUrl = '/videos/background-water-effect-tablet.mp4',
  mobileVideoUrl = '/videos/background-water-effect-mobile.mp4',
}: BackgroundWaterRaysDesignProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silent catch for autoplay issues
      })
    }
  }, [])

  return (
    <div className={`relative w-full ${height} overflow-hidden pointer-events-none ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {/* Desktop Version */}
        <source
          media="(min-width: 1024px)"
          src={desktopVideoUrl}
          type="video/mp4"
        />
        {/* Tablet Version */}
        <source
          media="(min-width: 768px)"
          src={tabletVideoUrl}
          type="video/mp4"
        />
        {/* Mobile Version */}
        <source
          src={mobileVideoUrl}
          type="video/mp4"
        />
        {/* Fallback */}
        Your browser does not support the video element.
      </video>

      {/* Gradient overlay for fading */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/90" />

      {/* Additional light rays effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
    </div>
  )
}
