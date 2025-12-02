'use client';

/**
 * Project Detail Client Component
 *
 * Displays project information with:
 * - Header with title, status badge, progress bar
 * - Project metadata (dates, team, type, template)
 * - Description section
 * - Task list with add task button
 * - Comments section
 * - Quick actions (edit, archive, delete)
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Edit,
  Archive,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskList, type TaskItem } from '@/components/projects';
import type { DBProject } from '@/lib/db/projects';
import type { DBComment } from '@/lib/db/comments';

interface ProjectDetailClientProps {
  project: DBProject;
  tasks: TaskItem[];
  comments: DBComment[];
  commentCount: number;
  user: {
    id: string;
    email: string;
    name: string;
    adminRole: string;
  };
}

// Status color mapping
const statusColors: Record<string, string> = {
  planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  todo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  not_started: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

// Format date for display
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProjectDetailClient({
  project,
  tasks,
  comments,
  commentCount,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [taskList, setTaskList] = useState<TaskItem[]>(tasks);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate task stats
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter(t => t.is_done).length;
  const overdueTasks = taskList.filter(t => {
    if (t.is_done || !t.target_date) return false;
    return new Date(t.target_date) < new Date();
  }).length;

  // Handle task update
  const handleTaskUpdate = async (id: string, updates: Partial<TaskItem>) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Update local state
      setTaskList(prev =>
        prev.map(task =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate to task detail
  const handleTaskNavigate = (taskId: string) => {
    router.push(`/dashboard/tools/tasks/${taskId}`);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button and breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/tools/projects')}
          className="text-[#C4C8D4] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <Badge className={`border ${statusColors[project.status] || statusColors.planning}`}>
              {project.status.replace('_', ' ')}
            </Badge>
            {project.interval_type && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                {project.interval_type}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-decorative text-white mb-2">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-[#C4C8D4] max-w-2xl">
              {project.description}
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-primary/30 text-primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-primary/30">
                <MoreHorizontal className="w-4 h-4 text-[#C4C8D4]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-primary/20">
              <DropdownMenuItem className="text-[#C4C8D4] focus:text-white">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem className="text-red-400 focus:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Progress */}
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#C4C8D4]">Progress</span>
              <span className="text-lg font-medium text-white">
                {Math.round(project.progress_percent || 0)}%
              </span>
            </div>
            <Progress value={project.progress_percent || 0} className="h-2" />
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-[#C4C8D4]">Tasks</p>
                <p className="text-lg font-medium text-white">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Date */}
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-[#C4C8D4]">Start Date</p>
                <p className="text-lg font-medium text-white">
                  {formatDate(project.start_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Date */}
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-[#C4C8D4]">Target Date</p>
                <p className="text-lg font-medium text-white">
                  {formatDate(project.target_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks section - takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-card/70 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Tasks
                {overdueTasks > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {overdueTasks} overdue
                  </Badge>
                )}
              </CardTitle>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={taskList}
                isLoading={isUpdating}
                onTaskUpdate={handleTaskUpdate}
                onTaskNavigate={handleTaskNavigate}
                showProjects={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - comments and metadata */}
        <div className="space-y-6">
          {/* Project details */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.project_type && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Type</p>
                  <p className="text-sm text-white">{project.project_type}</p>
                </div>
              )}
              {project.used_template && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Template</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    From Template
                  </Badge>
                </div>
              )}
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Created</p>
                <p className="text-sm text-white">{formatDate(project.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Last Updated</p>
                <p className="text-sm text-white">{formatDate(project.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Comments section */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Comments
                <Badge variant="secondary" className="ml-auto">
                  {commentCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <p className="text-sm text-[#C4C8D4] text-center py-4">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-[#00111A]/50 border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-[#C4C8D4]">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-[#C4C8D4] line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-primary/30 text-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
