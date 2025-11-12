'use client'

import { PricingCard } from '../cards/PricingCard'
import { cn } from '../../utils/cn'
import type { PricingSectionProps } from '../types'

export function PricingSection({
  title,
  subtitle,
  tiers,
  onTierSelect,
  className,
}: PricingSectionProps) {
  return (
    <section className={cn('container mx-auto px-6 py-12', className)}>
      {(title || subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {subtitle && <p className="text-primary text-sm font-alt uppercase tracking-wide">{subtitle}</p>}
          {title && <h2 className="text-4xl md:text-5xl font-decorative text-white">{title}</h2>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier, idx) => (
          <PricingCard 
            key={tier.id || idx} 
            tier={tier} 
            onCTAClick={() => onTierSelect?.(tier)}
          />
        ))}
      </div>
    </section>
  )
}

PricingSection.displayName = 'PricingSection'
