'use client';

/**
 * TaskListItem Component
 *
 * Compact, expandable task row with:
 * - Circle checkbox for completion toggle (improved UX)
 * - Priority dot indicator
 * - Task code badge
 * - Task name and project badge
 * - Due date with overdue highlighting
 * - Completion info (avatar + timestamp)
 * - Expandable description section
 *
 * Phase 5: Improved completion UX
 */

import React, { useState } from 'react';
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
  CheckCircle2,
  Paperclip,
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
  // Phase 5: New fields
  task_code?: string | null;
  finished_at?: string | null;
  completed_by_name?: string | null;
  completed_by_email?: string | null;
  // Phase 11: Attachments
  attachment_count?: number;
}

interface TaskListItemProps {
  task: TaskItem;
  onToggleDone: (id: string, isDone: boolean) => void;
  onNavigate?: (id: string) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  showProject?: boolean;
  /** Highlight this task (e.g., current task in project) */
  isHighlighted?: boolean;
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
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

/**
 * Format completion timestamp in German format
 */
function formatCompletionTime(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

/**
 * Get initials from name
 */
function getInitials(name?: string | null): string {
  if (!name) return 'SY';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function TaskListItem({
  task,
  onToggleDone,
  onNavigate,
  isExpanded: controlledExpanded,
  onExpandChange,
  showProject = true,
  isHighlighted = false,
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
            : isHighlighted
              ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
              : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5',
          task.is_done && 'opacity-60'
        )}
      >
        {/* Main row - always visible */}
        <div className="flex items-center gap-3 p-4 min-h-[48px]">
          {/* Circle Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleDone(task.id, !task.is_done)}
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                task.is_done
                  ? 'bg-primary border-primary'
                  : 'border-primary/40 hover:border-primary/60 hover:bg-primary/5'
              )}
              aria-label={task.is_done ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.is_done && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
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

              {/* Task code */}
              {task.task_code && (
                <span className="text-xs text-primary/70 font-mono flex-shrink-0">
                  {task.task_code}
                </span>
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

          {/* Right side: project badge, attachment count, date, status */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Project badge */}
            {showProject && task.project_title && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary max-w-[120px] truncate">
                {task.project_title}
              </Badge>
            )}

            {/* Attachment count badge */}
            {task.attachment_count !== undefined && task.attachment_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#C4C8D4]">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachment_count}</span>
              </div>
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
          <div className="px-4 pb-4 pt-0 ml-[52px] border-t border-primary/10 mt-0 pt-3">
            {/* Description */}
            {hasDescription && (
              <p className="text-sm text-[#C4C8D4] whitespace-pre-wrap mb-3">
                {task.description}
              </p>
            )}

            {/* Completion info */}
            {task.is_done && task.finished_at && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 mb-3">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-green-500/30 text-green-400 flex items-center justify-center text-xs font-medium">
                  {task.completed_by_name ? getInitials(task.completed_by_name) : <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                {/* Completion text */}
                <p className="text-xs text-green-400">
                  Accomplished{' '}
                  {task.completed_by_name && (
                    <span className="font-medium">by {task.completed_by_name}</span>
                  )}{' '}
                  at {formatCompletionTime(task.finished_at)}
                </p>
              </div>
            )}

            {/* Action buttons when expanded */}
            <div className="flex items-center gap-2">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
