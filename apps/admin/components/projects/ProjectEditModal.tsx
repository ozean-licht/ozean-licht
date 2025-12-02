'use client';

/**
 * Project Edit Modal Component
 *
 * Dialog wrapper for ProjectForm to edit existing projects.
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
import ProjectForm from './ProjectForm';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  workflowId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  workflowId: string;
  startDate: string;
  dueDate: string;
}

interface ProjectEditModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ProjectEditModal({
  project,
  open,
  onOpenChange,
  onSuccess,
}: ProjectEditModalProps) {
  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.name,
          description: data.description || null,
          status: data.status,
          workflow_id: data.workflowId || null,
          start_date: data.startDate || null,
          target_date: data.dueDate || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update project');
      }

      toast({
        title: 'Project updated',
        description: 'The project has been updated successfully.',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update project',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-primary/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Project</DialogTitle>
          <DialogDescription className="text-[#C4C8D4]">
            Update the project details below.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
