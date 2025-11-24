'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { BackgroundMode } from './background-mode-context'

interface BackgroundVideoProps {
  /**
   * Shows a fallback image while the video is loading
   * Can be a screenshot of the first frame
   */
  posterImage?: string
  /**
   * CSS classes for additional styling
   */
  className?: string
  /**
   * Overlay opacity (0-1) for better text readability
   */
  overlayOpacity?: number
  /**
   * Overlay color (default: black)
   */
  overlayColor?: string
  /**
   * Background mode: video, image, or none
   */
  mode?: BackgroundMode
  /**
   * Desktop video URL
   */
  desktopVideoUrl?: string
  /**
   * Mobile video URL
   */
  mobileVideoUrl?: string
  /**
   * Desktop image URL (for image mode)
   */
  desktopImageUrl?: string
  /**
   * Mobile image URL (for image mode)
   */
  mobileImageUrl?: string
}

export function BackgroundVideo({
  posterImage,
  className = '',
  overlayOpacity = 0.3,
  overlayColor = 'black',
  mode = 'video',
  desktopVideoUrl = '/videos/electric-water-desktop.mp4',
  mobileVideoUrl = '/videos/electric-water-mobile.mp4',
  desktopImageUrl = '/images/backgrounds/electric-water-desktop.webp',
  mobileImageUrl = '/images/backgrounds/electric-water-mobile.webp',
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle video loading and play/pause based on mode
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (mode === 'video') {
      const handleCanPlay = () => {
        setIsLoaded(true)
        video.play().catch(err => {
          console.warn('Auto-play prevented:', err)
        })
      }

      video.addEventListener('canplay', handleCanPlay)

      // If video is already loaded, play it
      if (video.readyState >= 3) {
        video.play().catch(err => {
          console.warn('Auto-play prevented:', err)
        })
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
      }
    } else {
      // Pause and reset video when not in video mode
      video.pause()
    }
  }, [mode])

  const videoSrc = isMobile ? mobileVideoUrl : desktopVideoUrl
  const imageSrc = isMobile ? mobileImageUrl : desktopImageUrl

  // Return nothing if mode is 'none'
  if (mode === 'none') {
    return null
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Show only image when mode === 'image' */}
      {mode === 'image' && (
        <Image
          src={imageSrc}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
      )}

      {/* Fallback poster image while video is loading */}
      {mode === 'video' && posterImage && !isLoaded && (
        <Image
          src={posterImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={75}
        />
      )}

      {/* Background video */}
      {mode === 'video' && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterImage}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay for better text readability */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Vignette effect for better aesthetics */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${overlayColor} 100%)`,
          opacity: 0.4,
        }}
      />
    </div>
  )
}
