/**
 * CourseCard Component
 *
 * A composition component for displaying course information in a card format.
 * Features image loading with fallback, price badge, and CTA button.
 * Extracted from ozean-licht app and refactored to use Tier 2 components.
 *
 * @example
 * <CourseCard
 *   course={{
 *     id: '1',
 *     slug: 'intro-meditation',
 *     title: 'Introduction to Meditation',
 *     description: 'Learn the basics...',
 *     price: 49.99,
 *     thumbnail_url_desktop: '/images/course.jpg'
 *   }}
 * />
 */

'use client'
import { useState, useEffect } from 'react'

// @ts-expect-error - Next.js Link type
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '../../components/Card'
import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { cn } from '../../utils/cn'
import type { CourseCardProps } from '../types'

/**
 * Create a fallback SVG image for courses without thumbnails
 */
function createFallbackImage(title: string): string {
  const cleanTitle = title
    .replace(/[äöüÄÖÜß]/g, (match) => {
      const map: Record<string, string> = {
        ä: 'ae',
        ö: 'oe',
        ü: 'ue',
        Ä: 'Ae',
        Ö: 'Oe',
        Ü: 'Ue',
        ß: 'ss',
      }
      return map[match] || match
    })
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .substring(0, 25)

  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#0A0F1A"/>
    <rect x="20" y="20" width="560" height="297" fill="#0ec2bc" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${cleanTitle}...</text>
  </svg>`

  const encodedSvg = encodeURIComponent(svg)
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

/**
 * ReliableImage - Handles image loading with fallback
 */
interface ReliableImageProps {
  src: string
  alt: string
  className: string
}

function ReliableImage({ src, alt, className }: ReliableImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!src) {
      setImageSrc(createFallbackImage(alt))
      setIsLoading(false)
      return
    }

    // If already a fallback SVG, use it directly
    if (src.startsWith('data:image/svg+xml')) {
      setImageSrc(src)
      setIsLoading(false)
      return
    }

    // Attempt to load the image
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    img.onerror = () => {
      setImageSrc(createFallbackImage(alt))
      setIsLoading(false)
    }
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, alt])

  if (isLoading) {
    return (
      <div className={cn(className, 'bg-[var(--background)] flex items-center justify-center')}>
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <img src={imageSrc!} alt={alt} className={className} />
}

/**
 * CourseCard - Display course information with image, title, description, and CTA
 */
export function CourseCard({ course, className, hover = true, glow = false, href }: CourseCardProps) {
  const imageUrl =
    course.thumbnail_url_desktop || course.thumbnail_url_mobile || createFallbackImage(course.title)

  const courseHref = href || `/courses/${course.slug}`

  return (
    <Link href={courseHref}>
      <Card
        variant="default"
        hover={hover}
        glow={glow}
        className={cn(
          'group overflow-hidden transition-all duration-300 cursor-pointer',
          'bg-[var(--card)] border-[var(--border)]',
          className
        )}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--background)] to-[var(--card)] overflow-hidden">
          <ReliableImage src={imageUrl} alt={course.title} className="w-full h-full object-cover" />

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="gradient" glow size="md" className="shadow-lg">
              €{course.price}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 space-y-4">
          {/* Title */}
          <h3 className="font-decorative text-xl md:text-2xl text-[var(--foreground)] leading-tight line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed line-clamp-3">
            {course.description?.substring(0, 120) ||
              'Entdecke transformative Inhalte für dein spirituelles Wachstum und deine persönliche Entwicklung.'}
            {course.description && course.description.length > 120 ? '...' : ''}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {course.is_available !== false ? 'Verfügbar' : 'Bald verfügbar'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              {course.duration || 'Lebenslang'}
            </span>
          </div>
        </CardContent>

        {/* Footer with CTA */}
        <CardFooter className="p-6 pt-0">
          <Button variant="primary" fullWidth className="group-hover:shadow-lg transition-shadow">
            Kurs ansehen
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

CourseCard.displayName = 'CourseCard'
