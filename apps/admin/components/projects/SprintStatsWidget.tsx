'use client';

/**
 * Sprint Stats Widget Component
 *
 * Shows sprint progress, burndown, and velocity.
 * Part of Project Management MVP Phase 10
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Clock,
  CheckCircle2,
  Target,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import type { DBSprint } from '@/lib/types';

interface SprintStatsWidgetProps {
  sprint: DBSprint;
  className?: string;
}

export default function SprintStatsWidget({
  sprint,
  className = '',
}: SprintStatsWidgetProps) {
  const taskProgress = sprint.task_count
    ? Math.round(((sprint.completed_task_count || 0) / sprint.task_count) * 100)
    : 0;

  const pointsProgress = sprint.total_story_points
    ? Math.round(((sprint.completed_story_points || 0) / (sprint.total_story_points || 1)) * 100)
    : 0;

  const getDaysInfo = () => {
    if (!sprint.start_date) return null;

    const start = new Date(sprint.start_date);
    const end = sprint.end_date ? new Date(sprint.end_date) : null;
    const today = new Date();

    if (sprint.status === 'completed' || sprint.status === 'cancelled') {
      if (end) {
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return { label: 'Duration', value: `${totalDays} days` };
      }
      return null;
    }

    if (!end) return null;

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      return { label: 'Overdue', value: `${Math.abs(remainingDays)} days`, isOverdue: true };
    }

    return {
      label: 'Days Left',
      value: `${remainingDays} / ${totalDays}`,
      progress: Math.min(100, Math.round((elapsedDays / totalDays) * 100)),
    };
  };

  const daysInfo = getDaysInfo();

  const getStatusIcon = () => {
    switch (sprint.status) {
      case 'active':
        return <Zap className="w-4 h-4 text-green-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card className={`bg-card/50 border-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-lg">{sprint.name}</span>
          </div>
          <Badge
            className={
              sprint.status === 'active'
                ? 'bg-green-500/20 text-green-400'
                : sprint.status === 'completed'
                  ? 'bg-gray-500/20 text-gray-400'
                  : 'bg-blue-500/20 text-blue-400'
            }
          >
            {sprint.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal */}
        {sprint.goal && (
          <div className="flex items-start gap-2 text-sm">
            <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[#C4C8D4] line-clamp-2">{sprint.goal}</p>
          </div>
        )}

        {/* Tasks Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-[#C4C8D4] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Tasks
            </span>
            <span className="text-white">
              {sprint.completed_task_count || 0} / {sprint.task_count || 0}
            </span>
          </div>
          <Progress value={taskProgress} className="h-2" />
        </div>

        {/* Story Points Progress */}
        {(sprint.total_story_points ?? 0) > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[#C4C8D4] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Story Points
              </span>
              <span className="text-white">
                {sprint.completed_story_points || 0} / {sprint.total_story_points}
              </span>
            </div>
            <Progress value={pointsProgress} className="h-2" />
          </div>
        )}

        {/* Days / Timeline */}
        {daysInfo && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={`flex items-center gap-1 ${daysInfo.isOverdue ? 'text-red-400' : 'text-[#C4C8D4]'}`}>
                <Calendar className="w-3 h-3" />
                {daysInfo.label}
              </span>
              <span className={daysInfo.isOverdue ? 'text-red-400' : 'text-white'}>
                {daysInfo.value}
              </span>
            </div>
            {daysInfo.progress !== undefined && (
              <Progress
                value={daysInfo.progress}
                className="h-2"
              />
            )}
          </div>
        )}

        {/* Velocity (for completed sprints) */}
        {sprint.status === 'completed' && sprint.velocity !== null && (
          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <span className="text-[#C4C8D4] text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              Velocity
            </span>
            <span className="text-primary font-medium">
              {sprint.velocity} pts
            </span>
          </div>
        )}

        {/* Date range */}
        {(sprint.start_date || sprint.end_date) && (
          <div className="text-xs text-[#C4C8D4] pt-2 border-t border-primary/10 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {sprint.start_date && new Date(sprint.start_date).toLocaleDateString()}
            {sprint.start_date && sprint.end_date && ' - '}
            {sprint.end_date && new Date(sprint.end_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
