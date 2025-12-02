'use client';

/**
 * Sprint Board Component
 *
 * Sprint-specific kanban view with sprint header and progress.
 * Part of Project Management MVP Phase 10
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  Calendar,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Sprint {
  id: string;
  project_id: string;
  name: string;
  goal?: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string | null;
  end_date?: string | null;
  velocity?: number | null;
  task_count?: number;
  completed_task_count?: number;
  total_story_points?: number;
  completed_story_points?: number;
}

interface Task {
  id: string;
  name: string;
  status: string;
  is_done: boolean;
  story_points?: number | null;
  assignee_ids: string[];
}

interface SprintBoardProps {
  sprintId: string;
}

const STATUS_COLUMNS = [
  { id: 'todo', label: 'To Do', icon: Circle },
  { id: 'in_progress', label: 'In Progress', icon: Clock },
  { id: 'review', label: 'Review', icon: AlertCircle },
  { id: 'done', label: 'Done', icon: CheckCircle2 },
];

export default function SprintBoard({ sprintId }: SprintBoardProps) {
  const router = useRouter();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshSprintData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    async function fetchSprintData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/sprints/${sprintId}?includeTasks=true`);
        if (!res.ok) {
          throw new Error('Failed to fetch sprint');
        }

        const data = await res.json();
        setSprint(data.sprint);
        setTasks(data.tasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sprint');
      } finally {
        setLoading(false);
      }
    }

    fetchSprintData();
  }, [sprintId, refreshKey]);

  const getStatusColor = (status: Sprint['status']) => {
    const colors: Record<Sprint['status'], string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getDaysRemaining = () => {
    if (!sprint?.end_date) return null;
    try {
      const end = new Date(sprint.end_date);
      if (isNaN(end.getTime())) return null;
      const today = new Date();
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return null;
    }
  };

  const getProgressPercent = () => {
    if (!sprint?.task_count || sprint.task_count === 0) return 0;
    return Math.round(((sprint.completed_task_count || 0) / sprint.task_count) * 100);
  };

  const tasksByStatus = STATUS_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => {
      if (col.id === 'done') return t.is_done || t.status === 'done';
      return t.status === col.id;
    }),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !sprint) {
    return (
      <Card className="bg-card/50 border-red-500/30">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">{error || 'Sprint not found'}</p>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining();
  const progress = getProgressPercent();

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-white text-xl">{sprint.name}</CardTitle>
              <Badge className={getStatusColor(sprint.status)}>
                {sprint.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#C4C8D4]">
              {sprint.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {(() => {
                      try {
                        const startDate = new Date(sprint.start_date);
                        return isNaN(startDate.getTime()) ? 'Invalid date' : startDate.toLocaleDateString();
                      } catch {
                        return 'Invalid date';
                      }
                    })()}
                  </span>
                  {sprint.end_date && (
                    <span>
                      {' - '}
                      {(() => {
                        try {
                          const endDate = new Date(sprint.end_date);
                          return isNaN(endDate.getTime()) ? 'Invalid date' : endDate.toLocaleDateString();
                        } catch {
                          return 'Invalid date';
                        }
                      })()}
                    </span>
                  )}
                </div>
              )}
              {daysRemaining !== null && sprint.status === 'active' && (
                <Badge
                  className={
                    daysRemaining < 0
                      ? 'bg-red-500/20 text-red-400'
                      : daysRemaining <= 3
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                  }
                >
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : `${daysRemaining} days left`}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sprint.goal && (
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-[#C4C8D4] text-sm">{sprint.goal}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#C4C8D4]">
                {sprint.completed_task_count || 0} of {sprint.task_count || 0} tasks
              </span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Story Points */}
          {(sprint.total_story_points ?? 0) > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#C4C8D4]">
                Story Points: {sprint.completed_story_points || 0} / {sprint.total_story_points}
              </span>
              {sprint.velocity && (
                <span className="text-primary">
                  Velocity: {sprint.velocity} pts
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4">
        {tasksByStatus.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <column.icon className="w-4 h-4 text-primary" />
                <span className="text-white font-medium">{column.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
            </div>
            <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-card/30 border border-primary/10">
              {column.tasks.length === 0 ? (
                <p className="text-[#C4C8D4] text-sm text-center py-8 italic">
                  No tasks
                </p>
              ) : (
                column.tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-card/50 border-primary/20 hover:border-primary/40 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/tools/tasks/${task.id}`)}
                  >
                    <CardContent className="p-3">
                      <p className="text-white text-sm line-clamp-2">{task.name}</p>
                      {task.story_points && (
                        <Badge className="mt-2 bg-primary/20 text-primary text-xs">
                          {task.story_points} pts
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {sprint.status === 'planning' && (
          <Button
            onClick={async () => {
              try {
                await fetch(`/api/sprints/${sprintId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'start' }),
                });
                refreshSprintData();
              } catch (err) {
                console.error('Failed to start sprint:', err);
              }
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Sprint
          </Button>
        )}
        {sprint.status === 'active' && (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await fetch(`/api/sprints/${sprintId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'complete' }),
                });
                refreshSprintData();
              } catch (err) {
                console.error('Failed to complete sprint:', err);
              }
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Sprint
          </Button>
        )}
      </div>
    </div>
  );
}
