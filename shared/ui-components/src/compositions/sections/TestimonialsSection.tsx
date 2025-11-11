'use client'

import { TestimonialCard } from '../cards/TestimonialCard'
import { cn } from '../../utils/cn'
import type { TestimonialsSectionProps } from '../types'

export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  layout = 'grid',
  columns = 3,
  className,
}: TestimonialsSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <section className={cn('container mx-auto px-6 py-12', className)}>
      {(title || subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {subtitle && <p className="text-primary text-sm font-alt uppercase tracking-wide">{subtitle}</p>}
          {title && <h2 className="text-4xl md:text-5xl font-decorative text-white">{title}</h2>}
        </div>
      )}
      
      <div className={cn('grid grid-cols-1 gap-6', layout === 'grid' && gridCols[columns])}>
        {testimonials.map((testimonial, idx) => (
          <TestimonialCard key={testimonial.id || idx} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}

TestimonialsSection.displayName = 'TestimonialsSection'
