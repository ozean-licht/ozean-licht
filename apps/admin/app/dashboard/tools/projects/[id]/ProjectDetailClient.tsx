'use client';

/**
 * Project Detail Client Component
 *
 * Displays project information with:
 * - Header with title, status badge, progress bar
 * - Project metadata (dates, team, type, template)
 * - Description section
 * - Task list with keepCompletedVisible mode (completed tasks stay visible)
 * - Current task highlighting
 * - Activity log (last 5, expandable)
 * - Comments section
 * - Quick actions (edit, archive, delete)
 *
 * Phase 5: Added keepCompletedVisible, current task highlighting, activity log
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { TaskList, ActivityLog, type TaskItem, type ActivityItem, ProjectEditModal, SprintManager, SprintStatsWidget } from '@/components/projects';
import type { DBProject } from '@/lib/types';
import type { DBComment } from '@/lib/types';
import type { DBSprint } from '@/lib/types';

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
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Find the "current" task - first non-completed task in order
 */
function findCurrentTask(tasks: TaskItem[]): string | undefined {
  // Sort by task_order, then by created_at
  const sortedTasks = [...tasks].sort((a, b) => {
    // @ts-expect-error task_order may not exist on old tasks
    const orderA = a.task_order ?? 0;
    // @ts-expect-error task_order may not exist on old tasks
    const orderB = b.task_order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  // Find first incomplete task
  const current = sortedTasks.find(t => !t.is_done && !['done', 'completed'].includes(t.status));
  return current?.id;
}

export default function ProjectDetailClient({
  project,
  tasks,
  comments,
  commentCount,
  user,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [projectData, setProjectData] = useState(project);
  const [taskList, setTaskList] = useState<TaskItem[]>(tasks);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sprints, setSprints] = useState<DBSprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<DBSprint | null>(null);

  // Calculate task stats
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter(t => t.is_done).length;
  const overdueTasks = taskList.filter(t => {
    if (t.is_done || !t.target_date) return false;
    return new Date(t.target_date) < new Date();
  }).length;

  // Find current task (first incomplete task)
  const currentTaskId = useMemo(() => findCurrentTask(taskList), [taskList]);

  // Fetch activities and sprints on mount
  useEffect(() => {
    async function fetchActivities() {
      try {
        setActivitiesLoading(true);
        const response = await fetch(`/api/projects/${project.id}/activities?limit=20`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    }

    async function fetchSprints() {
      try {
        const response = await fetch(`/api/projects/${project.id}/sprints`);
        if (response.ok) {
          const data = await response.json();
          setSprints(data.sprints || []);
          // Find active sprint
          const active = data.sprints?.find((s: DBSprint) => s.status === 'active');
          setActiveSprint(active || null);
        }
      } catch (error) {
        console.error('Failed to fetch sprints:', error);
      }
    }

    fetchActivities();
    fetchSprints();
  }, [project.id]);

  // Handle task update
  const handleTaskUpdate = async (id: string, updates: Partial<TaskItem>) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          // Include user info for completion tracking
          completed_by_name: user.name,
          completed_by_email: user.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();

      // Update local state
      setTaskList(prev =>
        prev.map(task =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );

      // Refetch activities to show the new completion
      if (updates.is_done !== undefined) {
        const activitiesRes = await fetch(`/api/projects/${project.id}/activities?limit=20`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      }
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

  // Refresh project after edit
  const handleEditSuccess = async () => {
    try {
      const response = await fetch(`/api/projects/${projectData.id}`);
      if (response.ok) {
        const updatedProject = await response.json();
        setProjectData(updatedProject);
        // Also refresh activities
        const activitiesRes = await fetch(`/api/projects/${projectData.id}/activities?limit=20`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      }
    } catch (error) {
      console.error('Failed to refresh project:', error);
    }
  };

  // Sprint handlers
  const handleSprintCreated = (sprint: DBSprint) => {
    setSprints(prev => [sprint, ...prev]);
  };

  const handleSprintUpdated = (sprint: DBSprint) => {
    setSprints(prev => prev.map(s => s.id === sprint.id ? sprint : s));
    if (sprint.status === 'active') {
      setActiveSprint(sprint);
    } else if (activeSprint?.id === sprint.id) {
      setActiveSprint(null);
    }
  };

  const handleSprintDeleted = (sprintId: string) => {
    setSprints(prev => prev.filter(s => s.id !== sprintId));
    if (activeSprint?.id === sprintId) {
      setActiveSprint(null);
    }
  };

  const handleSprintSelected = (sprintId: string) => {
    router.push(`/dashboard/tools/tasks/kanban?sprintId=${sprintId}`);
  };

  // Transform project for modal (map DB fields to form fields)
  const projectForModal = {
    id: projectData.id,
    name: projectData.title,
    description: projectData.description,
    status: projectData.status,
    workflowId: (projectData as DBProject & { workflow_id?: string }).workflow_id,
    startDate: projectData.start_date,
    dueDate: projectData.target_date,
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
            {/* Project code badge */}
            {(projectData as DBProject & { project_code?: string }).project_code && (
              <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                {(projectData as DBProject & { project_code?: string }).project_code}
              </Badge>
            )}
            <Badge className={`border ${statusColors[projectData.status] || statusColors.planning}`}>
              {projectData.status.replace('_', ' ')}
            </Badge>
            {projectData.interval_type && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                {projectData.interval_type}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-decorative text-white mb-2">
            {projectData.title}
          </h1>
          {projectData.description && (
            <p className="text-[#C4C8D4] max-w-2xl">
              {projectData.description}
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-primary/30 text-primary"
            onClick={() => setEditModalOpen(true)}
          >
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
                {Math.round(projectData.progress_percent || 0)}%
              </span>
            </div>
            <Progress value={projectData.progress_percent || 0} className="h-2" />
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
                  {formatDate(projectData.start_date)}
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
                  {formatDate(projectData.target_date)}
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
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => router.push(`/dashboard/tools/tasks/new?projectId=${projectData.id}`)}
              >
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
                currentTaskId={currentTaskId}
                keepCompletedVisible={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - sprints, activity, comments, and metadata */}
        <div className="space-y-6">
          {/* Active Sprint Stats (if exists) */}
          {activeSprint && (
            <SprintStatsWidget sprint={activeSprint} />
          )}

          {/* Sprint Manager */}
          <SprintManager
            projectId={projectData.id}
            sprints={sprints}
            onSprintCreated={handleSprintCreated}
            onSprintUpdated={handleSprintUpdated}
            onSprintDeleted={handleSprintDeleted}
            onSprintSelected={handleSprintSelected}
          />

          {/* Activity Log */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLog
                activities={activities}
                initialCount={5}
                isLoading={activitiesLoading}
                showTaskRef={true}
                emptyMessage="No activity recorded yet"
                title=""
              />
            </CardContent>
          </Card>

          {/* Project details */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectData.project_type && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Type</p>
                  <p className="text-sm text-white">{projectData.project_type}</p>
                </div>
              )}
              {projectData.used_template && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Template</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    From Template
                  </Badge>
                </div>
              )}
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Created</p>
                <p className="text-sm text-white">{formatDate(projectData.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Last Updated</p>
                <p className="text-sm text-white">{formatDate(projectData.updated_at)}</p>
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

      {/* Edit Project Modal */}
      <ProjectEditModal
        project={projectForModal}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
