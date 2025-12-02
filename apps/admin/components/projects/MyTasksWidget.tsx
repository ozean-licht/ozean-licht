'use client';

/**
 * My Tasks Widget Component
 *
 * Displays a list of tasks assigned to the current user with priority indicators,
 * due dates, and quick action buttons. Uses Ozean Licht design system.
 *
 * Phase 5: Now fetches real data from API
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Flag,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Task type matching the API response
interface Task {
  id: string;
  name: string;
  task_code: string | null;
  project_id: string | null;
  project_title: string | null;
  target_date: string | null;
  status: string;
  is_done: boolean;
  finished_at: string | null;
  completed_by_name: string | null;
}

// Priority derived from due date
type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

interface MyTasksWidgetProps {
  /** Maximum number of tasks to display */
  maxTasks?: number;
  /** Callback when task is clicked */
  onTaskClick?: (taskId: string) => void;
  /** Callback when task checkbox is toggled */
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  /** Callback when "View All" is clicked */
  onViewAll?: () => void;
  /** Optional: pre-loaded tasks (skip API fetch) */
  tasks?: Task[];
}

/**
 * Derive priority from due date
 */
function derivePriority(targetDate: string | null, isDone: boolean): TaskPriority {
  if (isDone) return 'low';
  if (!targetDate) return 'medium';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(targetDate);
  due.setHours(0, 0, 0, 0);

  const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'urgent'; // Overdue
  if (daysUntilDue <= 1) return 'high'; // Due today or tomorrow
  if (daysUntilDue <= 7) return 'medium'; // Due this week
  return 'low';
}

/**
 * Get priority badge styles - transparent fill with colored border
 */
const getPriorityStyles = (priority: TaskPriority): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'high':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'low':
      return 'bg-[#C4C8D4]/10 text-[#C4C8D4] border-[#C4C8D4]/30';
  }
};

/**
 * Get status icon component
 */
const StatusIcon = ({ isDone, isOverdue }: { isDone: boolean; isOverdue: boolean }) => {
  if (isDone) return <CheckCircle2 className="w-4 h-4 text-green-400" />;
  if (isOverdue) return <AlertTriangle className="w-4 h-4 text-red-400" />;
  return <Circle className="w-4 h-4 text-[#C4C8D4]" />;
};

/**
 * Format date for display
 */
const formatDueDate = (dateString: string | null): string => {
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
};

/**
 * Check if date is overdue
 */
const isOverdue = (dateString: string | null, isDone: boolean): boolean => {
  if (isDone || !dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
};

/**
 * Loading skeleton
 */
function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-primary/10 bg-[#00111A]/50">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyTasksWidget({
  maxTasks = 5,
  onTaskClick,
  onTaskToggle,
  onViewAll,
  tasks: preloadedTasks,
}: MyTasksWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>(preloadedTasks || []);
  const [isLoading, setIsLoading] = useState(!preloadedTasks);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  useEffect(() => {
    if (preloadedTasks) return;

    async function fetchTasks() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch active tasks, ordered by target_date
        const response = await fetch('/api/tasks?tab=active&limit=20&orderBy=target_date&orderDirection=asc');

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [preloadedTasks]);

  // Handle task toggle
  const handleToggle = async (taskId: string, completed: boolean) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, is_done: completed, status: completed ? 'done' : 'todo' } : task
      )
    );

    // Call parent callback
    onTaskToggle?.(taskId, completed);
  };

  const displayTasks = tasks.slice(0, maxTasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_done).length;
  const overdueTasks = tasks.filter(t => isOverdue(t.target_date, t.is_done)).length;

  return (
    <Card className="bg-card/70 backdrop-blur-12 border-primary/20 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-sans font-medium text-white">
                My Tasks
              </CardTitle>
              <p className="text-sm text-[#C4C8D4] mt-0.5">
                {completedTasks}/{totalTasks} completed
                {overdueTasks > 0 && (
                  <span className="text-red-400 ml-2">
                    {overdueTasks} overdue
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={onViewAll}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TaskListSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-400/40 mx-auto mb-3" />
            <p className="text-[#C4C8D4]">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.map((task) => {
              const priority = derivePriority(task.target_date, task.is_done);
              const taskOverdue = isOverdue(task.target_date, task.is_done);

              return (
                <div
                  key={task.id}
                  className={cn(
                    'group p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                    taskOverdue
                      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                      : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5'
                  )}
                  onClick={() => onTaskClick?.(task.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Circle Checkbox */}
                    <div
                      className="pt-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(task.id, !task.is_done);
                      }}
                    >
                      <button
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                          task.is_done
                            ? 'bg-primary border-primary'
                            : 'border-primary/40 hover:border-primary/60'
                        )}
                      >
                        {task.is_done && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {/* Task code badge */}
                          {task.task_code && (
                            <span className="text-xs text-primary/70 font-mono mr-2">
                              {task.task_code}
                            </span>
                          )}
                          <h4 className={cn(
                            'text-sm font-sans font-medium leading-tight inline',
                            task.is_done ? 'text-[#C4C8D4] line-through' : 'text-white'
                          )}>
                            {task.name}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            'flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                            getPriorityStyles(priority)
                          )}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {priority}
                        </span>
                      </div>

                      {/* Project name */}
                      {task.project_title && (
                        <p className="text-xs text-[#C4C8D4] mt-1.5 truncate flex items-center gap-1">
                          <FolderKanban className="w-3 h-3" />
                          {task.project_title}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        {/* Status */}
                        <div className="flex items-center gap-1">
                          <StatusIcon isDone={task.is_done} isOverdue={taskOverdue} />
                          <span className={cn(
                            'text-xs capitalize',
                            taskOverdue ? 'text-red-400' : 'text-[#C4C8D4]'
                          )}>
                            {taskOverdue ? 'overdue' : task.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Due date */}
                        {task.target_date && (
                          <div className={cn(
                            'flex items-center gap-1 text-xs',
                            taskOverdue ? 'text-red-400' : 'text-[#C4C8D4]'
                          )}>
                            <Calendar className="w-3 h-3" />
                            {formatDueDate(task.target_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayTasks.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-primary/40 mx-auto mb-3" />
                <p className="text-[#C4C8D4]">No active tasks</p>
                <p className="text-sm text-[#C4C8D4]/60 mt-1">
                  You&apos;re all caught up!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
