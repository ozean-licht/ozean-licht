'use client'

import { FeatureCard } from '../cards/FeatureCard'
import { cn } from '../../utils/cn'
import type { FeatureSectionProps } from '../types'

export function FeatureSection({
  title,
  subtitle,
  features,
  columns = 3,
  className,
}: FeatureSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={cn('container mx-auto px-6 py-12', className)}>
      {(title || subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {subtitle && <p className="text-primary text-sm font-alt uppercase tracking-wide">{subtitle}</p>}
          {title && <h2 className="text-4xl md:text-5xl font-decorative text-white">{title}</h2>}
        </div>
      )}
      
      <div className={cn('grid grid-cols-1 gap-6', gridCols[columns])}>
        {features.map((feature, idx) => (
          <FeatureCard key={feature.id || idx} feature={feature} />
        ))}
      </div>
    </section>
  )
}

FeatureSection.displayName = 'FeatureSection'
