'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/Card'
import { Button } from '../../components/Button'
import { Badge } from '../../components/Badge'
import { cn } from '../../utils/cn'
import type { PricingCardProps } from '../types'
import { Check, X } from 'lucide-react'

export function PricingCard({ tier, onCTAClick, className }: PricingCardProps) {
  return (
    <Card 
      variant={tier.highlighted ? "strong" : "default"} 
      hover 
      glow={tier.highlighted}
      className={cn('relative', tier.popular && 'border-primary', className)}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="gradient" glow>Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center space-y-4 pb-8">
        <CardTitle className="font-alt text-2xl">{tier.name}</CardTitle>
        {tier.description && <CardDescription>{tier.description}</CardDescription>}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-primary">{tier.currency || '€'}{tier.price}</span>
          {tier.period && <span className="text-[var(--muted-foreground)]">/{tier.period}</span>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-[var(--muted)] flex-shrink-0" />
            )}
            <span className={cn(
              'text-sm',
              feature.included ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] line-through',
              feature.highlight && 'text-primary font-medium'
            )}>
              {feature.text}
            </span>
          </div>
        ))}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={tier.highlighted ? 'primary' : 'outline'} 
          fullWidth 
          onClick={onCTAClick}
        >
          {tier.cta || 'Get Started'}
        </Button>
      </CardFooter>
    </Card>
  )
}

PricingCard.displayName = 'PricingCard'
