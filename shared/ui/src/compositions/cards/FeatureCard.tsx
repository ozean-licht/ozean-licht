'use client'

import { Card, CardContent } from '../../components/Card'
import { cn } from '../../utils/cn'
import type { FeatureCardProps } from '../types'

export function FeatureCard({ feature, className, align = 'center' }: FeatureCardProps) {
  return (
    <Card variant="default" hover className={cn('h-full', className)}>
      <CardContent className={cn('p-6 space-y-4', align === 'center' && 'text-center')}>
        {feature.icon && (
          <div className={cn(
            'inline-flex items-center justify-center w-12 h-12 rounded-full',
            'bg-primary/20 text-primary animate-pulse',
            align === 'center' && 'mx-auto'
          )}>
            {feature.icon}
          </div>
        )}
        
        <h3 className="font-alt text-xl text-white font-medium">
          {feature.title}
        </h3>
        
        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  )
}

FeatureCard.displayName = 'FeatureCard'
