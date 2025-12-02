'use client';

/**
 * Task Detail Client Component
 *
 * Displays task information with:
 * - Header with task_code, name, priority dot, status
 * - Circle checkbox with improved completion UX
 * - Completion info (avatar + timestamp)
 * - Project link/badge
 * - Description (editable)
 * - Due date with overdue indicator
 * - Activity log
 * - Status toggle (todo -> in_progress -> done)
 * - Comments section
 * - Quick actions
 *
 * Phase 5: Added task_code display, improved completion UX, activity log
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Save,
  X,
  ExternalLink,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PriorityDot, derivePriority, ActivityLog, type ActivityItem, TaskEditModal, SubtaskList, TimeEntryForm, TimeEntryList, TaskTimeDisplay } from '@/components/projects';
import type { DBTimeEntry } from '@/lib/db/time-entries';
import type { DBTask } from '@/lib/db/tasks';
import type { DBComment } from '@/lib/db/comments';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface TimeStats {
  totalMinutes: number;
  billableMinutes: number;
  entryCount: number;
  estimatedHours: number | null;
  actualHours: number;
}

interface TaskDetailClientProps {
  task: DBTask;
  comments: DBComment[];
  commentCount: number;
  user: {
    id: string;
    email: string;
    name: string;
    adminRole: string;
  };
  parentTask?: DBTask | null;
  initialSubtasks?: DBTask[];
  initialTimeEntries?: DBTimeEntry[];
  initialTimeStats?: TimeStats;
}

// Status options
const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'planned', label: 'Planned' },
];

// Status color mapping
const statusColors: Record<string, string> = {
  todo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  done: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
  overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
  planned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
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

// Format date with time for completion
function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Check if overdue
function isOverdue(dateString: string | null, isDone: boolean): boolean {
  if (!dateString || isDone) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
}

// Get initials from name
function getInitials(name?: string | null): string {
  if (!name) return 'SY';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function TaskDetailClient({
  task: initialTask,
  comments,
  commentCount,
  user,
  parentTask,
  initialSubtasks = [],
  initialTimeEntries = [],
  initialTimeStats,
}: TaskDetailClientProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subtasks, setSubtasks] = useState<DBTask[]>(initialSubtasks);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subtasksLoading, _setSubtasksLoading] = useState(false);
  // Phase 9: Time tracking state
  const [timeEntries, setTimeEntries] = useState<DBTimeEntry[]>(initialTimeEntries);
  const [timeStats, setTimeStats] = useState<TimeStats | undefined>(initialTimeStats);
  const [timeEntriesLoading, setTimeEntriesLoading] = useState(!initialTimeEntries.length);

  const priority = derivePriority(task.target_date, task.is_done, task.status);
  const taskOverdue = isOverdue(task.target_date, task.is_done);

  // Fetch activities on mount
  useEffect(() => {
    async function fetchActivities() {
      try {
        setActivitiesLoading(true);
        const response = await fetch(`/api/tasks/${task.id}/activities?limit=20`);
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

    fetchActivities();
  }, [task.id]);

  // Fetch time entries on mount (if not passed as props)
  useEffect(() => {
    if (initialTimeEntries.length > 0) return; // Already have data from props

    async function fetchTimeEntries() {
      try {
        setTimeEntriesLoading(true);
        const response = await fetch(`/api/tasks/${task.id}/time-entries`);
        if (response.ok) {
          const data = await response.json();
          setTimeEntries(data.entries || []);
          setTimeStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch time entries:', error);
      } finally {
        setTimeEntriesLoading(false);
      }
    }

    fetchTimeEntries();
  }, [task.id, initialTimeEntries.length]);

  // Update task
  const updateTask = async (updates: Partial<DBTask>) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
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
      setTask(prev => ({ ...prev, ...updatedTask }));

      // Refresh activities if status changed
      if (updates.is_done !== undefined || updates.status !== undefined) {
        const activitiesRes = await fetch(`/api/tasks/${task.id}/activities?limit=20`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle done status
  const toggleDone = () => {
    const newIsDone = !task.is_done;
    updateTask({
      is_done: newIsDone,
      status: newIsDone ? 'done' : 'todo',
    });
  };

  // Save description
  const saveDescription = () => {
    updateTask({ description: editedDescription });
    setIsEditing(false);
  };

  // Change status
  const handleStatusChange = (newStatus: string) => {
    const isDone = ['done', 'completed'].includes(newStatus);
    updateTask({ status: newStatus as DBTask['status'], is_done: isDone });
  };

  // Refresh task after edit
  const handleEditSuccess = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`);
      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setEditedDescription(updatedTask.description || '');
        // Also refresh activities
        const activitiesRes = await fetch(`/api/tasks/${task.id}/activities?limit=20`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      }
    } catch (error) {
      console.error('Failed to refresh task:', error);
    }
  };

  // Subtask handlers
  const handleToggleSubtask = async (taskId: string, isDone: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: isDone, status: isDone ? 'done' : 'todo' }),
      });
      if (!response.ok) throw new Error('Failed to update subtask');
      setSubtasks(prev =>
        prev.map(st => st.id === taskId ? { ...st, is_done: isDone, status: isDone ? 'done' : 'todo' } : st)
      );
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  const handleAddSubtask = async (title: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          parent_task_id: task.id,
          project_id: task.project_id,
          status: 'todo',
        }),
      });
      if (!response.ok) throw new Error('Failed to create subtask');
      const { task: newTask } = await response.json();
      setSubtasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  // Phase 9: Time entry handlers
  const handleAddTimeEntry = async (data: { duration_minutes: number; description?: string; work_date: string; is_billable: boolean }) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to log time');
      const result = await response.json();
      setTimeEntries(prev => [result.entry, ...prev]);
      setTimeStats(result.stats);
    } catch (error) {
      console.error('Failed to add time entry:', error);
      throw error;
    }
  };

  const handleDeleteTimeEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}/time-entries/${entryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete time entry');
      const result = await response.json();
      setTimeEntries(prev => prev.filter(e => e.id !== entryId));
      setTimeStats(result.stats);
    } catch (error) {
      console.error('Failed to delete time entry:', error);
    }
  };

  // Transform task for modal (map DB fields to form fields)
  const taskForModal = {
    id: task.id,
    title: task.name,
    description: task.description,
    status: task.status,
    priority: 'medium', // Priority not stored in DB, default to medium
    assigneeId: task.assignee_ids?.[0] || null, // Use first assignee from array
    dueDate: task.target_date,
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-[#C4C8D4] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {task.project_id && task.project_title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/tools/projects/${task.project_id}`)}
            className="text-primary hover:text-primary/80"
          >
            <FolderKanban className="w-4 h-4 mr-2" />
            {task.project_title}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        )}
        {/* Parent task link for subtasks */}
        {parentTask && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/tools/tasks/${parentTask.id}`)}
            className="text-[#C4C8D4] hover:text-white border border-primary/20 rounded-lg"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Parent: {parentTask.name}
          </Button>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {/* Circle Checkbox */}
            <button
              onClick={toggleDone}
              disabled={isSaving}
              className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                task.is_done
                  ? 'bg-primary border-primary'
                  : 'border-primary/40 hover:border-primary/60 hover:bg-primary/5'
              )}
              aria-label={task.is_done ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.is_done && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Priority dot */}
            <PriorityDot priority={priority} size="lg" />

            {/* Task code badge */}
            {task.task_code && (
              <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                {task.task_code}
              </Badge>
            )}

            {/* Status badge */}
            <Badge className={cn('border', statusColors[task.status] || statusColors.todo)}>
              {task.status.replace('_', ' ')}
            </Badge>

            {/* Overdue indicator */}
            {taskOverdue && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Overdue
              </Badge>
            )}
          </div>

          <h1 className={cn(
            'text-3xl font-decorative mb-2',
            task.is_done ? 'text-[#C4C8D4] line-through' : 'text-white'
          )}>
            {task.name}
          </h1>

          {/* Completion info */}
          {task.is_done && task.finished_at && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 mt-4 max-w-md">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-green-500/30 text-green-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {task.completed_by_name ? getInitials(task.completed_by_name) : <CheckCircle2 className="w-4 h-4" />}
              </div>
              {/* Completion text */}
              <p className="text-sm text-green-400">
                Accomplished{' '}
                {task.completed_by_name && (
                  <span className="font-medium">by {task.completed_by_name}</span>
                )}{' '}
                at {formatDateTime(task.finished_at)}
              </p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-primary/30">
                <MoreHorizontal className="w-4 h-4 text-[#C4C8D4]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-primary/20">
              <DropdownMenuItem
                className="text-[#C4C8D4] focus:text-white cursor-pointer"
                onClick={() => setEditModalOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white">Description</CardTitle>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-primary"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="min-h-[150px] bg-[#00111A] border-primary/20 text-white"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={saveDescription}
                      disabled={isSaving}
                      className="bg-primary text-white"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedDescription(task.description || '');
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className={cn(
                  'text-[#C4C8D4] whitespace-pre-wrap',
                  !task.description && 'italic'
                )}>
                  {task.description || 'No description provided.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Subtasks - only show for parent tasks (not subtasks themselves) */}
          {!task.parent_task_id && (
            <SubtaskList
              parentTaskId={task.id}
              parentProjectId={task.project_id}
              subtasks={subtasks}
              onToggleComplete={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
              isLoading={subtasksLoading}
            />
          )}

          {/* Time Tracking - Phase 9 */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Time Tracking
                </CardTitle>
                {timeStats && (
                  <TaskTimeDisplay
                    estimatedHours={timeStats.estimatedHours}
                    actualHours={timeStats.actualHours}
                    showProgress={false}
                    size="sm"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Compact time entry form */}
              <TimeEntryForm
                taskId={task.id}
                onSubmit={handleAddTimeEntry}
                compact
              />

              {/* Time entries list */}
              <TimeEntryList
                entries={timeEntries}
                onDelete={handleDeleteTimeEntry}
                isLoading={timeEntriesLoading}
                emptyMessage="No time logged yet. Use the form above to log time."
              />
            </CardContent>
          </Card>

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
                emptyMessage="No activity recorded yet"
                title=""
              />
            </CardContent>
          </Card>

          {/* Comments */}
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
                <p className="text-sm text-[#C4C8D4] text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-[#00111A]/50 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-[#C4C8D4]">
                          {formatDate(comment.created_at)}
                        </span>
                        {comment.is_edited && (
                          <span className="text-xs text-[#C4C8D4] italic">(edited)</span>
                        )}
                      </div>
                      <p className="text-sm text-[#C4C8D4] whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3 border-l-2 border-primary/20 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="p-2 rounded bg-[#00111A]/30">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-white">
                                  {reply.author_name || 'Anonymous'}
                                </span>
                                <span className="text-xs text-[#C4C8D4]">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-[#C4C8D4]">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Assigned To */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium',
                  task.assignee_ids?.length ? 'bg-primary/20 text-primary' : 'bg-[#00111A] text-[#C4C8D4]'
                )}>
                  {task.assignee_ids?.length ? (
                    task.assignee_ids.length > 1 ? (
                      <span className="text-xs">{task.assignee_ids.length}</span>
                    ) : (
                      <User className="w-4 h-4" />
                    )
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  {task.assignee_ids?.length ? (
                    <p className="text-sm text-white">
                      {task.assignee_ids.length === 1 ? '1 assignee' : `${task.assignee_ids.length} assignees`}
                    </p>
                  ) : (
                    <p className="text-sm text-[#C4C8D4] italic">Unassigned</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Start Date</p>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-primary" />
                  {formatDate(task.start_date)}
                </div>
              </div>
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Due Date</p>
                <div className={cn(
                  'flex items-center gap-2',
                  taskOverdue ? 'text-red-400' : 'text-white'
                )}>
                  <Clock className={cn('w-4 h-4', taskOverdue ? 'text-red-400' : 'text-primary')} />
                  {formatDate(task.target_date)}
                </div>
              </div>
              {task.finished_at && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Completed</p>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {formatDateTime(task.finished_at)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-card/70 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.task_code && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Task ID</p>
                  <p className="text-sm text-white font-mono">{task.task_code}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Task Order</p>
                <p className="text-sm text-white">#{task.task_order}</p>
              </div>
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Created</p>
                <p className="text-sm text-white">{formatDate(task.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Last Updated</p>
                <p className="text-sm text-white">{formatDate(task.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Task Modal */}
      <TaskEditModal
        task={taskForModal}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
