'use client';

/**
 * New Task Client Component
 *
 * Task creation form with:
 * - Project selection
 * - Task name and description
 * - Status and priority
 * - Target date
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
  Alert,
  AlertDescription,
} from '@/lib/ui';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import type { DBProject } from '@/lib/types';

interface NewTaskClientProps {
  projects: DBProject[];
  user: {
    id: string;
    email: string;
    name: string;
  };
}

type TaskStatus = 'todo' | 'in_progress' | 'done';

export default function NewTaskClient({ projects }: NewTaskClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    project_id: string;
    status: TaskStatus;
    target_date: string;
  }>({
    name: '',
    description: '',
    project_id: '',
    status: 'todo',
    target_date: '',
  });

  // Pre-select project from query parameter if provided
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId && projects.some(p => p.id === projectId)) {
      setFormData(prev => ({ ...prev, project_id: projectId }));
    }
  }, [searchParams, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          target_date: formData.target_date || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      const { task } = await response.json();

      // Navigate to the newly created task
      router.push(`/dashboard/tools/tasks/${task.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4 text-[#C4C8D4] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-decorative text-white mb-2">New Task</h1>
        <p className="text-lg font-sans text-[#C4C8D4]">
          Create a new task and assign it to a project
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Task Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="bg-[#0F1419] border-primary/20 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="bg-[#0F1419] border-primary/20 text-white"
              />
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">
                Project <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, project_id: value }))
                }
                required
                name="project"
              >
                <SelectTrigger
                  id="project"
                  className="bg-[#0F1419] border-primary/20 text-white"
                >
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1419] border-primary/20">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as TaskStatus,
                  }))
                }
                name="status"
              >
                <SelectTrigger
                  id="status"
                  className="bg-[#0F1419] border-primary/20 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1419] border-primary/20">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    target_date: e.target.value,
                  }))
                }
                className="bg-[#0F1419] border-primary/20 text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.project_id}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
