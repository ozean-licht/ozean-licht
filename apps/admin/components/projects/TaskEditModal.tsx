'use client';

/**
 * Task Edit Modal Component
 *
 * Dialog wrapper for TaskForm to edit existing tasks.
 * Part of Project Management MVP Phase 7
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import TaskForm from './TaskForm';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeId?: string | null;
  dueDate?: string | null;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: string;
  dueDate: string;
}

interface TaskEditModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function TaskEditModal({
  task,
  open,
  onOpenChange,
  onSuccess,
}: TaskEditModalProps) {
  const handleSubmit = async (data: TaskFormData) => {
    try {
      // Map form field names to API field names (snake_case)
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.title,
          description: data.description || null,
          status: data.status,
          // Map single assigneeId to array format expected by API
          assignee_ids: data.assigneeId ? [data.assigneeId] : [],
          target_date: data.dueDate || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update task');
      }

      toast({
        title: 'Task updated',
        description: 'The task has been updated successfully.',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-primary/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Task</DialogTitle>
          <DialogDescription className="text-[#C4C8D4]">
            Update the task details below.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
