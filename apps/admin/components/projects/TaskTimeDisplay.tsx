'use client';

/**
 * Task Time Display Component
 *
 * Shows total time on task cards/detail with visual indicator.
 * Part of Project Management MVP Phase 9
 */

import React from 'react';
import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TaskTimeDisplayProps {
  estimatedHours?: number | null;
  actualHours: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Format hours to human readable
function formatHours(hours: number): string {
  if (hours === 0) return '0h';
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins}m`;
  }
  // Show one decimal if needed
  if (hours % 1 !== 0) {
    return `${hours.toFixed(1)}h`;
  }
  return `${Math.round(hours)}h`;
}

export default function TaskTimeDisplay({
  estimatedHours,
  actualHours,
  showProgress = true,
  size = 'md',
  className,
}: TaskTimeDisplayProps) {
  const hasEstimate = estimatedHours != null && estimatedHours > 0;
  const progress = hasEstimate ? Math.min((actualHours / estimatedHours) * 100, 100) : 0;
  const isOverEstimate = hasEstimate && actualHours > estimatedHours;

  // Size variants
  const sizeClasses = {
    sm: {
      container: 'gap-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
      progress: 'h-1',
    },
    md: {
      container: 'gap-2',
      icon: 'w-4 h-4',
      text: 'text-sm',
      progress: 'h-1.5',
    },
    lg: {
      container: 'gap-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      progress: 'h-2',
    },
  };

  const classes = sizeClasses[size];

  // No time logged
  if (actualHours === 0 && !hasEstimate) {
    return (
      <div className={cn('flex items-center', classes.container, className)}>
        <Clock className={cn(classes.icon, 'text-[#C4C8D4]/50')} />
        <span className={cn(classes.text, 'text-[#C4C8D4]/50')}>
          No time logged
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn('flex items-center', classes.container)}>
        <Clock className={cn(classes.icon, 'text-primary')} />
        <span className={cn(classes.text, 'text-white font-medium')}>
          {formatHours(actualHours)}
        </span>
        {hasEstimate && (
          <span className={cn(classes.text, 'text-[#C4C8D4]')}>
            / {formatHours(estimatedHours)} estimated
          </span>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && hasEstimate && (
        <Progress
          value={progress}
          className={cn(
            classes.progress,
            'bg-[#00111A]',
            isOverEstimate && '[&>div]:bg-red-500'
          )}
        />
      )}

      {/* Over estimate warning */}
      {isOverEstimate && (
        <p className="text-xs text-red-400">
          {formatHours(actualHours - estimatedHours)} over estimate
        </p>
      )}
    </div>
  );
}
