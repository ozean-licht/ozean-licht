'use client';

/**
 * PriorityDot Component
 *
 * Visual indicator for task priority using colored dots.
 * - High priority (red): Overdue tasks or critical items
 * - Moderate priority (orange): Due soon or needs attention
 * - Low priority (green): Normal priority tasks
 */

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type PriorityLevel = 'high' | 'moderate' | 'low';

interface PriorityDotProps {
  /** The priority level to display */
  priority: PriorityLevel;
  /** Size of the dot */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

const priorityColors = {
  high: 'bg-red-500',
  moderate: 'bg-orange-500',
  low: 'bg-green-500',
};

const priorityLabels = {
  high: 'High Priority',
  moderate: 'Moderate Priority',
  low: 'Low Priority',
};

/**
 * Derive priority from task data
 * - High: Overdue (target_date < today AND not done)
 * - Moderate: Due within 3 days OR status is 'blocked'
 * - Low: All other active tasks
 */
export function derivePriority(
  targetDate: string | null | undefined,
  isDone: boolean,
  status?: string
): PriorityLevel {
  if (isDone) return 'low';

  if (status === 'blocked') return 'moderate';

  if (!targetDate) return 'low';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'high'; // Overdue
  if (diffDays <= 3) return 'moderate'; // Due within 3 days
  return 'low';
}

export default function PriorityDot({
  priority,
  size = 'md',
  showTooltip = true,
  className,
}: PriorityDotProps) {
  const dot = (
    <span
      className={cn(
        'inline-block rounded-full flex-shrink-0',
        sizeStyles[size],
        priorityColors[priority],
        className
      )}
      aria-label={priorityLabels[priority]}
    />
  );

  if (!showTooltip) {
    return dot;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {dot}
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {priorityLabels[priority]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Named export for the derive function
export { derivePriority as getPriorityFromTask };
