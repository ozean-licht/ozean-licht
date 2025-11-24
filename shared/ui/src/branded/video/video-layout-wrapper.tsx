'use client'

import { BackgroundVideo } from '../layout/background-video'
import { useBackgroundMode } from '../layout/background-mode-context'

export interface VideoLayoutWrapperProps {
  /**
   * Content to render above the background video
   */
  children: React.ReactNode
  /**
   * Overlay opacity for better text readability
   */
  overlayOpacity?: number
  /**
   * Overlay color
   */
  overlayColor?: string
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

export function VideoLayoutWrapper({
  children,
  overlayOpacity = 0.5,
  overlayColor = 'black',
  desktopVideoUrl,
  mobileVideoUrl,
  desktopImageUrl,
  mobileImageUrl,
}: VideoLayoutWrapperProps) {
  const { mode, isLoaded } = useBackgroundMode()

  return (
    <>
      {isLoaded && (
        <BackgroundVideo
          mode={mode}
          overlayOpacity={overlayOpacity}
          overlayColor={overlayColor}
          desktopVideoUrl={desktopVideoUrl}
          mobileVideoUrl={mobileVideoUrl}
          desktopImageUrl={desktopImageUrl}
          mobileImageUrl={mobileImageUrl}
        />
      )}
      {children}
    </>
  )
}
