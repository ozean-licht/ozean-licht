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
  projectType?: string; // Video, Post, Short, Kurs, Kongress, Love Letter, Interview
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
 * Get status badge - outline style
 */
const getStatusConfig = (status: ProjectStatus): { className: string; text: string; icon: React.ReactNode } => {
  switch (status) {
    case 'active':
      return {
        className: 'border-green-500/50 text-green-400 bg-transparent',
        text: 'Active',
        icon: <Play className="w-3 h-3" />
      };
    case 'paused':
      return {
        className: 'border-yellow-500/50 text-yellow-400 bg-transparent',
        text: 'Paused',
        icon: <Pause className="w-3 h-3" />
      };
    case 'completed':
      return {
        className: 'border-emerald-500/50 text-emerald-400 bg-transparent',
        text: 'Done',
        icon: <CheckCircle2 className="w-3 h-3" />
      };
    case 'archived':
      return {
        className: 'border-gray-500/50 text-gray-400 bg-transparent',
        text: 'Archived',
        icon: <FolderOpen className="w-3 h-3" />
      };
    case 'planning':
      return {
        className: 'border-blue-500/50 text-blue-400 bg-transparent',
        text: 'Planning',
        icon: <Timer className="w-3 h-3" />
      };
    default:
      return { className: 'border-gray-500/50 text-gray-400 bg-transparent', text: status, icon: null };
  }
};

/**
 * Get content type badge - colored outline style
 * shorts:orange, video:red, course:purple, kongress:green, post:blue, loveletter:cyan
 */
const getContentTypeBadge = (projectType: string | undefined): { className: string; text: string } | null => {
  if (!projectType) return null;

  const type = projectType.toLowerCase();

  switch (type) {
    case 'short':
      return { className: 'border-orange-500/60 text-orange-400 bg-transparent', text: 'Short' };
    case 'video':
      return { className: 'border-red-500/60 text-red-400 bg-transparent', text: 'Video' };
    case 'kurs':
      return { className: 'border-purple-500/60 text-purple-400 bg-transparent', text: 'Kurs' };
    case 'kongress':
      return { className: 'border-green-500/60 text-green-400 bg-transparent', text: 'Kongress' };
    case 'post':
      return { className: 'border-blue-500/60 text-blue-400 bg-transparent', text: 'Post' };
    case 'love letter':
      return { className: 'border-cyan-500/60 text-cyan-400 bg-transparent', text: 'Love Letter' };
    case 'interview':
      return { className: 'border-pink-500/60 text-pink-400 bg-transparent', text: 'Interview' };
    case 'einzigartig':
      return { className: 'border-indigo-500/60 text-indigo-400 bg-transparent', text: 'Unique' };
    default:
      return { className: 'border-gray-500/60 text-gray-400 bg-transparent', text: projectType };
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
  const contentTypeBadge = getContentTypeBadge(project.projectType);
  const isRecurring = project.type === 'recurring';
  const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'completed';

  if (compact) {
    return (
      <div
        className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer
          bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5`}
        onClick={() => onClick?.(project.id)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isRecurring && (
              <RefreshCw className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <h4 className="text-sm font-sans font-medium text-white truncate">
              {project.name}
            </h4>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Content type badge (colored outline) */}
            {contentTypeBadge && (
              <Badge variant="outline" className={`text-xs ${contentTypeBadge.className}`}>
                {contentTypeBadge.text}
              </Badge>
            )}
            {/* Status badge (outline) */}
            <Badge variant="outline" className={`text-xs ${statusConfig.className}`}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.text}</span>
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#C4C8D4] mt-2">
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.progress}%</span>
          {isOverdue && (
            <span className="flex items-center gap-1 text-red-400">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          )}
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
            {/* Content type badge (colored outline) */}
            {contentTypeBadge && (
              <Badge variant="outline" className={contentTypeBadge.className}>
                {contentTypeBadge.text}
              </Badge>
            )}
            {/* Status badge (outline) */}
            <Badge variant="outline" className={statusConfig.className}>
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
