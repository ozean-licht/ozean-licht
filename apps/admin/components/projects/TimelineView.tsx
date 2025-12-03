'use client';

/**
 * TimelineView Component - Phase 13 Advanced Views
 *
 * Gantt-style timeline for project tasks.
 * Shows task bars with start/due dates on a horizontal timeline.
 */

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays, AlertCircle } from 'lucide-react';
import type { Task, TaskStatus, Priority } from '@/types/projects';

interface TimelineViewProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (taskId: string) => void;
}

// Status colors for timeline bars
const statusColors: Record<TaskStatus, string> = {
  backlog: 'bg-gray-500/60',
  todo: 'bg-blue-500/60',
  in_progress: 'bg-yellow-500/60',
  review: 'bg-purple-500/60',
  done: 'bg-green-500/60',
  blocked: 'bg-red-500/60',
  cancelled: 'bg-gray-400/40',
};

// Priority border colors
const priorityBorders: Record<Priority, string> = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-400',
  critical: 'border-l-red-600',
};

export default function TimelineView({
  tasks,
  startDate,
  endDate,
  onTaskClick,
}: TimelineViewProps) {
  // Calculate timeline range in days
  const totalDays = useMemo(() => {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Generate week markers
  const weekMarkers = useMemo(() => {
    const markers: { date: Date; label: string; position: number }[] = [];
    const current = new Date(startDate);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday

    while (current <= endDate) {
      const dayOffset = Math.ceil((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayOffset >= 0 && dayOffset <= totalDays) {
        markers.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          position: (dayOffset / totalDays) * 100,
        });
      }
      current.setDate(current.getDate() + 7);
    }
    return markers;
  }, [startDate, endDate, totalDays]);

  // Calculate bar position and width for each task
  const taskBars = useMemo(() => {
    return tasks
      .filter((task) => {
        // Validate dates exist and are valid
        const hasValidStart = task.startDate && !isNaN(new Date(task.startDate).getTime());
        const hasValidEnd = task.dueDate && !isNaN(new Date(task.dueDate).getTime());
        return hasValidStart || hasValidEnd;
      })
      .map((task) => {
        const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate!);
        const taskEnd = task.dueDate ? new Date(task.dueDate) : new Date(task.startDate!);

        // Clamp to visible range
        const clampedStart = new Date(Math.max(taskStart.getTime(), startDate.getTime()));
        const clampedEnd = new Date(Math.min(taskEnd.getTime(), endDate.getTime()));

        const startOffset = Math.ceil((clampedStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const endOffset = Math.ceil((clampedEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        const left = Math.max(0, (startOffset / totalDays) * 100);
        const width = Math.max(2, ((endOffset - startOffset + 1) / totalDays) * 100);

        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

        return {
          ...task,
          left,
          width,
          isOverdue,
        };
      });
  }, [tasks, startDate, endDate, totalDays]);

  // Tasks without dates
  const unscheduledTasks = tasks.filter((task) => !task.startDate && !task.dueDate);

  if (tasks.length === 0) {
    return (
      <Card className="bg-card/70 border-primary/20">
        <CardContent className="p-8 text-center">
          <CalendarDays className="w-12 h-12 text-[#C4C8D4] mx-auto mb-4" />
          <p className="text-[#C4C8D4]">No tasks to display on timeline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/70 border-primary/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Timeline header with week markers */}
        <div className="relative h-10 border-b border-primary/10 bg-[#00111A]">
          <div className="absolute inset-0 flex items-center">
            {weekMarkers.map((marker, i) => (
              <div
                key={i}
                className="absolute text-xs text-[#C4C8D4] whitespace-nowrap"
                style={{ left: `${marker.position}%`, transform: 'translateX(-50%)' }}
              >
                {marker.label}
              </div>
            ))}
          </div>
        </div>

        {/* Task rows */}
        <div className="relative min-h-[200px]">
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            {weekMarkers.map((marker, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-primary/10"
                style={{ left: `${marker.position}%` }}
              />
            ))}
          </div>

          {/* Task bars */}
          <TooltipProvider>
            <div className="relative divide-y divide-primary/5">
              {taskBars.map((task) => (
                <div
                  key={task.id}
                  className="relative h-12 hover:bg-primary/5 transition-colors"
                >
                  {/* Task label on left */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-40 truncate text-sm text-white z-10">
                    {task.title}
                  </div>

                  {/* Timeline bar */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onTaskClick?.(task.id)}
                        className={`absolute top-2 h-8 rounded-md border-l-4 cursor-pointer transition-all hover:opacity-80 ${
                          statusColors[task.status]
                        } ${priorityBorders[task.priority]}`}
                        style={{
                          left: `calc(${task.left}% + 180px)`,
                          width: `calc(${task.width}% - 20px)`,
                          maxWidth: 'calc(100% - 200px)',
                        }}
                      >
                        {task.isOverdue && (
                          <AlertCircle className="absolute -right-1 -top-1 w-4 h-4 text-red-400" />
                        )}
                        <span className="absolute inset-0 flex items-center px-2 text-xs text-white truncate">
                          {task.width > 10 && task.title}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-primary/20">
                      <div className="space-y-1">
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="text-xs text-[#C4C8D4]">
                          {task.startDate && new Date(task.startDate).toLocaleDateString()}
                          {task.startDate && task.dueDate && ' - '}
                          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </TooltipProvider>

          {taskBars.length === 0 && (
            <div className="py-8 text-center text-[#C4C8D4]">
              No tasks with dates in this range
            </div>
          )}
        </div>

        {/* Unscheduled tasks footer */}
        {unscheduledTasks.length > 0 && (
          <div className="border-t border-primary/10 p-4 bg-[#00111A]">
            <p className="text-xs text-[#C4C8D4] mb-2">
              {unscheduledTasks.length} task(s) without dates
            </p>
            <div className="flex flex-wrap gap-2">
              {unscheduledTasks.slice(0, 5).map((task) => (
                <Badge
                  key={task.id}
                  variant="outline"
                  className="cursor-pointer border-primary/30 text-[#C4C8D4] hover:text-primary"
                  onClick={() => onTaskClick?.(task.id)}
                >
                  {task.title}
                </Badge>
              ))}
              {unscheduledTasks.length > 5 && (
                <Badge variant="outline" className="border-primary/30 text-[#C4C8D4]">
                  +{unscheduledTasks.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
