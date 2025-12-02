'use client';

/**
 * SubtaskProgress Component - Phase 8
 *
 * Compact subtask completion indicator for task cards.
 * Shows "3/5 subtasks" with mini progress bar.
 */

import React from 'react';
import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubtaskProgressProps {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export default function SubtaskProgress({
  completed,
  total,
  className,
  showLabel = true,
}: SubtaskProgressProps) {
  if (total === 0) return null;

  const progress = Math.round((completed / total) * 100);
  const isComplete = completed === total;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <ListChecks className={cn(
        'w-3.5 h-3.5',
        isComplete ? 'text-green-400' : 'text-[#C4C8D4]'
      )} />
      {showLabel && (
        <span className={cn(
          'text-xs',
          isComplete ? 'text-green-400' : 'text-[#C4C8D4]'
        )}>
          {completed}/{total}
        </span>
      )}
      {/* Mini progress bar */}
      <div className="w-8 h-1 bg-primary/10 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isComplete ? 'bg-green-400' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
