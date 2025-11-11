'use client'

import { Card, CardContent } from '../../components/Card'
import { cn } from '../../utils/cn'
import type { StatsCardProps } from '../types'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatsCard({ stat, className, showTrend = true }: StatsCardProps) {
  return (
    <Card variant="default" hover className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-[var(--muted-foreground)] text-sm">{stat.label}</p>
            <p className="text-4xl font-bold text-primary">{stat.value}</p>
            {showTrend && stat.trend && stat.trendValue && (
              <div className={cn(
                'flex items-center gap-1 text-sm',
                stat.trend === 'up' && 'text-green-500',
                stat.trend === 'down' && 'text-red-500',
                stat.trend === 'neutral' && 'text-[var(--muted-foreground)]'
              )}>
                {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                <span>{stat.trendValue}</span>
              </div>
            )}
          </div>
          {stat.icon && (
            <div className="text-primary opacity-20">
              {stat.icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

StatsCard.displayName = 'StatsCard'
