'use client';

/**
 * TaskListItem Component
 *
 * Compact, expandable task row with:
 * - Checkbox for completion toggle
 * - Priority dot indicator
 * - Task name and project badge
 * - Due date with overdue highlighting
 * - Expandable description section
 */

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PriorityDot, { derivePriority } from './PriorityDot';

// Task type matching the database schema
export interface TaskItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  is_done: boolean;
  target_date: string | null;
  start_date: string | null;
  project_id: string | null;
  project_title?: string;
  created_at: string;
}

interface TaskListItemProps {
  task: TaskItem;
  onToggleDone: (id: string, isDone: boolean) => void;
  onNavigate?: (id: string) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  showProject?: boolean;
}

/**
 * Format date for display
 */
function formatDueDate(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (targetDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  if (targetDate < today) {
    return 'Overdue';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Check if date is overdue
 */
function isOverdue(dateString: string | null, isDone: boolean): boolean {
  if (isDone || !dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
}

/**
 * Get status badge variant
 */
function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'in_progress':
      return 'default';
    case 'done':
    case 'completed':
      return 'secondary';
    case 'blocked':
    case 'overdue':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function TaskListItem({
  task,
  onToggleDone,
  onNavigate,
  isExpanded: controlledExpanded,
  onExpandChange,
  showProject = true,
}: TaskListItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Support both controlled and uncontrolled modes
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const setExpanded = (value: boolean) => {
    if (onExpandChange) {
      onExpandChange(value);
    } else {
      setInternalExpanded(value);
    }
  };

  const priority = derivePriority(task.target_date, task.is_done, task.status);
  const taskOverdue = isOverdue(task.target_date, task.is_done);
  const hasDescription = task.description && task.description.trim().length > 0;

  return (
    <Collapsible open={isExpanded} onOpenChange={setExpanded}>
      <div
        className={cn(
          'group rounded-xl border transition-all duration-200',
          taskOverdue
            ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
            : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5',
          task.is_done && 'opacity-60'
        )}
      >
        {/* Main row - always visible */}
        <div className="flex items-center gap-3 p-4 min-h-[48px]">
          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={task.is_done}
              onCheckedChange={(checked) => onToggleDone(task.id, !!checked)}
              className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>

          {/* Priority dot */}
          <PriorityDot priority={priority} size="sm" />

          {/* Expand trigger and task content */}
          <CollapsibleTrigger asChild>
            <button className="flex-1 flex items-center gap-3 text-left min-w-0 cursor-pointer">
              {/* Expand icon */}
              {hasDescription ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-[#C4C8D4] flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#C4C8D4] flex-shrink-0" />
                )
              ) : (
                <span className="w-4" /> // Spacer
              )}

              {/* Task name */}
              <span
                className={cn(
                  'text-sm font-medium truncate flex-1',
                  task.is_done ? 'text-[#C4C8D4] line-through' : 'text-white'
                )}
              >
                {task.name}
              </span>
            </button>
          </CollapsibleTrigger>

          {/* Right side: project badge, date, status */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Project badge */}
            {showProject && task.project_title && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary max-w-[120px] truncate">
                {task.project_title}
              </Badge>
            )}

            {/* Due date */}
            {task.target_date && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs',
                  taskOverdue ? 'text-red-400' : 'text-[#C4C8D4]'
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.target_date)}
              </div>
            )}

            {/* Status badge */}
            <Badge variant={getStatusVariant(task.status)} className="text-xs capitalize">
              {task.status.replace('_', ' ')}
            </Badge>

            {/* Navigate button */}
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(task.id);
                }}
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </Button>
            )}
          </div>
        </div>

        {/* Expandable content */}
        <CollapsibleContent>
          {hasDescription && (
            <div className="px-4 pb-4 pt-0 ml-[52px] border-t border-primary/10 mt-0 pt-3">
              <p className="text-sm text-[#C4C8D4] whitespace-pre-wrap">
                {task.description}
              </p>

              {/* Action buttons when expanded */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => onNavigate?.(task.id)}
                >
                  View Details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
