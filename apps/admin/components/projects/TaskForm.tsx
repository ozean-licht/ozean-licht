'use client';

/**
 * Task Form Component
 *
 * Core task form for creating/editing tasks.
 * Part of Project Management MVP Phase 2
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import SprintSelector from './SprintSelector';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeId?: string | null;
  dueDate?: string | null;
  sprintId?: string | null;
  storyPoints?: number | null;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: string;
  dueDate: string;
  sprintId: string;
  storyPoints: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface TaskFormProps {
  task?: Task;
  projectId?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'critical', label: 'Critical' },
];

export default function TaskForm({
  task,
  projectId,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    assigneeId: task?.assigneeId || '',
    dueDate: task?.dueDate || '',
    sprintId: task?.sprintId || '',
    storyPoints: task?.storyPoints?.toString() || '',
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin-users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      }
    }
    fetchUsers();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const selectedDate = formData.dueDate ? new Date(formData.dueDate) : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title..."
          className="bg-card/50 border-primary/20"
        />
        {errors.title && (
          <p className="text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter task description..."
          rows={3}
          className="bg-card/50 border-primary/20 resize-none"
        />
      </div>

      {/* Status and Priority row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger className="bg-card/50 border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange('priority', value)}
          >
            <SelectTrigger className="bg-card/50 border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assignee */}
      <div className="space-y-2">
        <Label className="text-white">Assignee</Label>
        <Select
          value={formData.assigneeId}
          onValueChange={(value) => handleChange('assigneeId', value)}
        >
          <SelectTrigger className="bg-card/50 border-primary/20">
            <SelectValue placeholder="Select assignee..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label className="text-white">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal bg-card/50 border-primary/20"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) =>
                handleChange('dueDate', date ? date.toISOString() : '')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sprint and Story Points (Phase 10) */}
      {projectId && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              Sprint
            </Label>
            <SprintSelector
              projectId={projectId}
              value={formData.sprintId || null}
              onChange={(value) => handleChange('sprintId', value || '')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Story Points</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.storyPoints}
              onChange={(e) => handleChange('storyPoints', e.target.value)}
              placeholder="0"
              className="bg-card/50 border-primary/20"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-primary/10">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
