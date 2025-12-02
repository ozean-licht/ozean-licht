'use client';

/**
 * Task Detail Client Component
 *
 * Displays task information with:
 * - Header with name, priority dot, status
 * - Project link/badge
 * - Description (editable)
 * - Due date with overdue indicator
 * - Status toggle (todo -> in_progress -> done)
 * - Comments section
 * - Quick actions
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { PriorityDot, derivePriority } from '@/components/projects';
import type { DBTask } from '@/lib/db/tasks';
import type { DBComment } from '@/lib/db/comments';
import { cn } from '@/lib/utils';

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
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Check if overdue
function isOverdue(dateString: string | null, isDone: boolean): boolean {
  if (!dateString || isDone) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
}

export default function TaskDetailClient({
  task: initialTask,
  comments,
  commentCount,
  user: _user,
}: TaskDetailClientProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const priority = derivePriority(task.target_date, task.is_done, task.status);
  const taskOverdue = isOverdue(task.target_date, task.is_done);

  // Update task
  const updateTask = async (updates: Partial<DBTask>) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const { task: updatedTask } = await response.json();
      setTask(prev => ({ ...prev, ...updatedTask }));
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
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {/* Checkbox */}
            <Checkbox
              checked={task.is_done}
              onCheckedChange={toggleDone}
              className="h-6 w-6 border-primary/40 data-[state=checked]:bg-primary"
            />

            {/* Priority dot */}
            <PriorityDot priority={priority} size="lg" />

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
              <DropdownMenuItem className="text-[#C4C8D4] focus:text-white">
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
                    {formatDate(task.finished_at)}
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
    </div>
  );
}
