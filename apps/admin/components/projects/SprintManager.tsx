'use client';

/**
 * Sprint Manager Component
 *
 * Create and manage sprints for a project.
 * Part of Project Management MVP Phase 10
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus,
  CalendarIcon,
  Zap,
  MoreHorizontal,
  Trash2,
  Pencil,
  Loader2,
  Target,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import type { DBSprint } from '@/lib/types';

interface SprintManagerProps {
  projectId: string;
  sprints: DBSprint[];
  onSprintCreated?: (sprint: DBSprint) => void;
  onSprintUpdated?: (sprint: DBSprint) => void;
  onSprintDeleted?: (sprintId: string) => void;
  onSprintSelected?: (sprintId: string) => void;
}

export default function SprintManager({
  projectId,
  sprints,
  onSprintCreated,
  onSprintUpdated,
  onSprintDeleted,
  onSprintSelected,
}: SprintManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<DBSprint | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      goal: '',
      startDate: undefined,
      endDate: undefined,
    });
    setEditingSprint(null);
  };

  const openEditDialog = (sprint: DBSprint) => {
    setEditingSprint(sprint);
    setFormData({
      name: sprint.name,
      goal: sprint.goal || '',
      startDate: sprint.start_date ? new Date(sprint.start_date) : undefined,
      endDate: sprint.end_date ? new Date(sprint.end_date) : undefined,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Sprint name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        name: formData.name.trim(),
        goal: formData.goal.trim() || undefined,
        startDate: formData.startDate?.toISOString().split('T')[0],
        endDate: formData.endDate?.toISOString().split('T')[0],
      };

      const url = editingSprint
        ? `/api/sprints/${editingSprint.id}`
        : `/api/projects/${projectId}/sprints`;

      const res = await fetch(url, {
        method: editingSprint ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save sprint');
      }

      const data = await res.json();

      if (editingSprint) {
        onSprintUpdated?.(data.sprint);
        toast({ title: 'Sprint updated' });
      } else {
        onSprintCreated?.(data.sprint);
        toast({ title: 'Sprint created' });
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save sprint',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (sprintId: string) => {
    if (!confirm('Are you sure you want to delete this sprint? Tasks will be moved to backlog.')) {
      return;
    }

    try {
      setDeletingId(sprintId);
      const res = await fetch(`/api/sprints/${sprintId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete sprint');

      onSprintDeleted?.(sprintId);
      toast({ title: 'Sprint deleted' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete sprint',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: DBSprint['status']) => {
    const colors: Record<DBSprint['status'], string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Card className="bg-card/50 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Sprints
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSprint ? 'Edit Sprint' : 'Create Sprint'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sprint 1"
                  className="bg-card/50 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Goal</Label>
                <Textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to accomplish?"
                  rows={2}
                  className="bg-card/50 border-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-card/50 border-primary/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, 'PP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-card/50 border-primary/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, 'PP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingSprint ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {sprints.length === 0 ? (
          <p className="text-[#C4C8D4] text-sm text-center py-4">
            No sprints yet. Create one to organize your work.
          </p>
        ) : (
          sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-primary/10 hover:border-primary/30 cursor-pointer transition-colors"
              onClick={() => onSprintSelected?.(sprint.id)}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${sprint.status === 'active' ? 'text-green-400' : 'text-[#C4C8D4]'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{sprint.name}</span>
                    <Badge className={`text-xs ${getStatusColor(sprint.status)}`}>
                      {sprint.status}
                    </Badge>
                  </div>
                  {sprint.goal && (
                    <p className="text-[#C4C8D4] text-xs line-clamp-1 mt-0.5">
                      <Target className="w-3 h-3 inline mr-1" />
                      {sprint.goal}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C4C8D4] text-xs">
                  {sprint.completed_task_count || 0}/{sprint.task_count || 0}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(sprint);
                    }}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400"
                      disabled={deletingId === sprint.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sprint.id);
                      }}
                    >
                      {deletingId === sprint.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
