'use client';

/**
 * My Tasks Widget Component
 *
 * Displays a list of tasks assigned to the current user with priority indicators,
 * due dates, and quick action buttons. Uses Ozean Licht design system.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Flag,
} from 'lucide-react';

// Task priority types
type TaskPriority = 'high' | 'medium' | 'low';
type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

interface Task {
  id: string;
  title: string;
  projectName: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring?: boolean;
}

interface MyTasksWidgetProps {
  /** Maximum number of tasks to display */
  maxTasks?: number;
  /** Callback when task is clicked */
  onTaskClick?: (taskId: string) => void;
  /** Callback when task checkbox is toggled */
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  /** Callback when "View All" is clicked */
  onViewAll?: () => void;
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review course content for Module 3',
    projectName: 'Ozean Licht Course Launch',
    dueDate: '2025-11-27',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: '2',
    title: 'Update user documentation',
    projectName: 'Admin Dashboard v2',
    dueDate: '2025-11-28',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Weekly team standup notes',
    projectName: 'Team Operations',
    dueDate: '2025-11-26',
    priority: 'low',
    status: 'pending',
    isRecurring: true,
  },
  {
    id: '4',
    title: 'Fix authentication flow bug',
    projectName: 'Admin Dashboard v2',
    dueDate: '2025-11-25',
    priority: 'high',
    status: 'overdue',
  },
  {
    id: '5',
    title: 'Design review for new components',
    projectName: 'Shared UI Library',
    dueDate: '2025-11-29',
    priority: 'medium',
    status: 'pending',
  },
];

/**
 * Get priority badge styles - transparent fill with colored border
 */
const getPriorityStyles = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'low':
      return 'bg-[#C4C8D4]/10 text-[#C4C8D4] border-[#C4C8D4]/30';
  }
};

/**
 * Get status icon component
 */
const StatusIcon = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case 'in_progress':
      return <Clock className="w-4 h-4 text-primary" />;
    case 'overdue':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    default:
      return <Circle className="w-4 h-4 text-[#C4C8D4]" />;
  }
};

/**
 * Format date for display
 */
const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  if (date < today) {
    return 'Overdue';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Check if date is overdue
 */
const isOverdue = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

export default function MyTasksWidget({
  maxTasks = 5,
  onTaskClick,
  onTaskToggle,
  onViewAll,
}: MyTasksWidgetProps) {
  const displayTasks = mockTasks.slice(0, maxTasks);
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue').length;

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
        <div className="space-y-3">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${task.status === 'overdue'
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                  : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5'
                }`}
              onClick={() => onTaskClick?.(task.id)}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => onTaskToggle?.(task.id, !!checked)}
                    className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-sans font-medium leading-tight
                      ${task.status === 'completed' ? 'text-[#C4C8D4] line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <span
                      className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityStyles(task.priority)}`}
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-[#C4C8D4] mt-1.5 truncate">
                    {task.projectName}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    {/* Status */}
                    <div className="flex items-center gap-1">
                      <StatusIcon status={task.status} />
                      <span className={`text-xs capitalize
                        ${task.status === 'overdue' ? 'text-red-400' : 'text-[#C4C8D4]'}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Due date */}
                    <div className={`flex items-center gap-1 text-xs
                      ${isOverdue(task.dueDate) && task.status !== 'completed'
                        ? 'text-red-400'
                        : 'text-[#C4C8D4]'}`}>
                      <Calendar className="w-3 h-3" />
                      {formatDueDate(task.dueDate)}
                    </div>

                    {/* Recurring indicator */}
                    {task.isRecurring && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 1l4 4-4 4" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <path d="M7 23l-4-4 4-4" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        Recurring
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {displayTasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <p className="text-[#C4C8D4]">No tasks assigned</p>
              <p className="text-sm text-[#C4C8D4]/60 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
