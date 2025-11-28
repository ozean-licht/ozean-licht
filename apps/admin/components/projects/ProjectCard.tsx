'use client';

/**
 * Project Card Component
 *
 * Displays a project summary card with progress, status, and quick actions.
 * Supports both recurring and non-recurring projects with visual distinction.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Play,
  Pause,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Timer,
} from 'lucide-react';

// Project types
type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived' | 'planning';
type ProjectType = 'one-time' | 'recurring';
type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  type: ProjectType;
  recurrencePattern?: RecurrencePattern;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  startDate: string;
  endDate?: string;
  nextOccurrence?: string;
  teamMembers: number;
  templateName?: string;
  color?: string;
}

interface ProjectCardProps {
  project: Project;
  /** Callback when card is clicked */
  onClick?: (projectId: string) => void;
  /** Callback when action menu is opened */
  onActionClick?: (projectId: string, action: string) => void;
  /** Display as compact card */
  compact?: boolean;
}

/**
 * Get status badge variant and text
 */
const getStatusConfig = (status: ProjectStatus): { variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; text: string; icon: React.ReactNode } => {
  switch (status) {
    case 'active':
      return { variant: 'default', text: 'Active', icon: <Play className="w-3 h-3" /> };
    case 'paused':
      return { variant: 'warning', text: 'Paused', icon: <Pause className="w-3 h-3" /> };
    case 'completed':
      return { variant: 'success', text: 'Completed', icon: <CheckCircle2 className="w-3 h-3" /> };
    case 'archived':
      return { variant: 'secondary', text: 'Archived', icon: <FolderOpen className="w-3 h-3" /> };
    case 'planning':
      return { variant: 'secondary', text: 'Planning', icon: <Timer className="w-3 h-3" /> };
    default:
      return { variant: 'secondary', text: status, icon: null };
  }
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Get recurrence label
 */
const getRecurrenceLabel = (pattern: RecurrencePattern): string => {
  switch (pattern) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'yearly':
      return 'Yearly';
    default:
      return pattern;
  }
};

/**
 * Get progress bar color based on progress percentage
 */
const _getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-primary';
  if (progress >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ProjectCard({
  project,
  onClick,
  onActionClick,
  compact = false,
}: ProjectCardProps) {
  const statusConfig = getStatusConfig(project.status);
  const isRecurring = project.type === 'recurring';
  const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'completed';

  if (compact) {
    return (
      <div
        className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer
          bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5`}
        onClick={() => onClick?.(project.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isRecurring && (
              <RefreshCw className="w-4 h-4 text-primary" />
            )}
            <h4 className="text-sm font-sans font-medium text-white truncate">
              {project.name}
            </h4>
          </div>
          <Badge variant={statusConfig.variant} className="text-xs">
            {statusConfig.icon}
            <span className="ml-1">{statusConfig.text}</span>
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#C4C8D4]">
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1 mt-2" />
      </div>
    );
  }

  return (
    <Card
      className={`group bg-card/70 backdrop-blur-12 border-primary/20 transition-all duration-300 cursor-pointer
        hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15
        ${isOverdue ? 'border-red-500/30' : ''}`}
      onClick={() => onClick?.(project.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Project type indicator */}
              {isRecurring ? (
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <RefreshCw className="w-4 h-4 text-primary" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-[#055D75]/20 border border-[#055D75]/30">
                  <FolderOpen className="w-4 h-4 text-[#055D75]" />
                </div>
              )}
              <CardTitle className="text-lg font-sans font-medium text-white truncate">
                {project.name}
              </CardTitle>
            </div>
            <p className="text-sm text-[#C4C8D4] line-clamp-2 mt-1">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge variant={statusConfig.variant}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.text}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.(project.id, 'menu');
              }}
            >
              <MoreVertical className="w-4 h-4 text-[#C4C8D4]" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#C4C8D4]">Progress</span>
            <span className="text-sm font-medium text-white">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-[#C4C8D4]">
            <span>{project.completedTasks} of {project.totalTasks} tasks completed</span>
            {isOverdue && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Metadata section */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary/10">
          {/* Dates */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-[#C4C8D4]">
                {isRecurring ? 'Next Run' : 'Due Date'}
              </p>
              <p className="text-sm text-white truncate">
                {isRecurring && project.nextOccurrence
                  ? formatDate(project.nextOccurrence)
                  : project.endDate
                    ? formatDate(project.endDate)
                    : 'No deadline'}
              </p>
            </div>
          </div>

          {/* Team members */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-[#C4C8D4]">Team</p>
              <p className="text-sm text-white">
                {project.teamMembers} member{project.teamMembers !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Recurrence pattern (for recurring projects) */}
          {isRecurring && project.recurrencePattern && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-[#C4C8D4]">Recurrence</p>
                <p className="text-sm text-white">
                  {getRecurrenceLabel(project.recurrencePattern)}
                </p>
              </div>
            </div>
          )}

          {/* Template (if applicable) */}
          {project.templateName && (
            <div className="flex items-center gap-2 text-sm">
              <FolderOpen className="w-4 h-4 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-[#C4C8D4]">Template</p>
                <p className="text-sm text-white truncate">
                  {project.templateName}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
