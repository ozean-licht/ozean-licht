'use client'

import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { cn } from '../../utils/cn'
import type { HeroSectionProps } from '../types'

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  secondaryCTAText,
  secondaryCTAHref,
  onCTAClick,
  onSecondaryCTAClick,
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn('container mx-auto px-6 py-12', className)}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-6">
          {subtitle && (
            <div className="flex justify-center">
              <Badge variant="default">{subtitle}</Badge>
            </div>
          )}
          
          <h1 className="font-decorative text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] text-balance"
              style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}>
            {title}
          </h1>
          
          {description && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-[var(--muted-foreground)] font-light">
              {description}
            </p>
          )}
        </div>
        
        <div className="pt-4 flex items-center justify-center gap-4">
          {ctaText && (
            ctaHref ? (
              <a href={ctaHref}>
                <Button variant="primary" size="lg">{ctaText}</Button>
              </a>
            ) : (
              <Button variant="primary" size="lg" onClick={onCTAClick}>{ctaText}</Button>
            )
          )}
          
          {secondaryCTAText && (
            secondaryCTAHref ? (
              <a href={secondaryCTAHref}>
                <Button variant="outline" size="lg">{secondaryCTAText}</Button>
              </a>
            ) : (
              <Button variant="outline" size="lg" onClick={onSecondaryCTAClick}>{secondaryCTAText}</Button>
            )
          )}
        </div>
      </div>
    </section>
  )
}

HeroSection.displayName = 'HeroSection'
