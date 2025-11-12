/**
 * TestimonialCard Component
 *
 * A card component for displaying customer testimonials with name, location,
 * optional avatar, rating, and quote.
 *
 * @example
 * import { TestimonialCard } from '@ozean-licht/shared-ui/compositions'
 *
 * <TestimonialCard
 *   testimonial={{
 *     name: 'Maria Schmidt',
 *     location: 'Vienna, Austria',
 *     testimonial: 'This transformed my spiritual practice...',
 *     rating: 5
 *   }}
 * />
 */

'use client'

import { Card, CardContent } from '../../components/Card'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '../../utils/cn'
import type { TestimonialCardProps } from '../types'

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    const first = parts[0][0] || ''
    const last = parts[parts.length - 1][0] || ''
    return (first + last).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

interface StarRatingProps {
  rating: number
  maxRating?: number
}

function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1" aria-label={`Rating: ${rating} out of ${maxRating}`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <svg
          key={i}
          className={cn(
            'w-4 h-4',
            i < rating ? 'text-primary fill-primary' : 'text-[var(--muted)] fill-[var(--muted)]'
          )}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 1l2.5 6.5L19 8.5l-5 4.5 1.5 6.5L10 16l-5.5 3.5L6 13l-5-4.5 6.5-1L10 1z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialCard({
  testimonial,
  showAvatar = true,
  showRating = true,
  className,
}: TestimonialCardProps) {
  return (
    <Card variant="default" hover className={cn('max-w-md', className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          {showAvatar && (
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={testimonial.avatar || undefined} alt={testimonial.name} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {getInitials(testimonial.name)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <h4 className="font-alt text-white text-lg font-medium">
              {testimonial.name}
            </h4>
            {testimonial.location && (
              <p className="text-primary text-sm">{testimonial.location}</p>
            )}
          </div>
        </div>

        {showRating && testimonial.rating && (
          <div className="flex items-center justify-center">
            <StarRating rating={testimonial.rating} />
          </div>
        )}

        <blockquote className="text-[var(--muted-foreground)] text-sm leading-relaxed text-center">
          "{testimonial.testimonial}"
        </blockquote>

        {testimonial.date && (
          <p className="text-[var(--muted)] text-xs text-center">
            {new Date(testimonial.date).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

TestimonialCard.displayName = 'TestimonialCard'
