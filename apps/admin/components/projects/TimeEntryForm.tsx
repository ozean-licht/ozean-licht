'use client';

/**
 * Time Entry Form Component
 *
 * Inline form for logging time on a task.
 * Part of Project Management MVP Phase 9
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface TimeEntryFormData {
  hours: number;
  minutes: number;
  description: string;
  workDate: string;
  isBillable: boolean;
}

interface TimeEntryFormProps {
  taskId: string; // Used for context, may be used for validation in future
  onSubmit: (data: { duration_minutes: number; description?: string; work_date: string; is_billable: boolean }) => Promise<void>;
  onCancel?: () => void;
  compact?: boolean;
}

export default function TimeEntryForm({
  taskId: _taskId,
  onSubmit,
  onCancel,
  compact = false,
}: TimeEntryFormProps) {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    hours: 0,
    minutes: 30,
    description: '',
    workDate: new Date().toISOString().split('T')[0],
    isBillable: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const totalMinutes = formData.hours * 60 + formData.minutes;
    if (totalMinutes <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const durationMinutes = formData.hours * 60 + formData.minutes;
      await onSubmit({
        duration_minutes: durationMinutes,
        description: formData.description || undefined,
        work_date: formData.workDate,
        is_billable: formData.isBillable,
      });
      // Reset form after successful submit
      setFormData({
        hours: 0,
        minutes: 30,
        description: '',
        workDate: new Date().toISOString().split('T')[0],
        isBillable: false,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log time. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDate = formData.workDate ? new Date(formData.workDate) : undefined;

  if (compact) {
    // Compact inline form for quick entry
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-primary/10">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="0"
            max="23"
            value={formData.hours}
            onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
            className="w-14 h-8 text-center bg-[#00111A] border-primary/20 text-sm"
            placeholder="0"
          />
          <span className="text-[#C4C8D4] text-sm">h</span>
          <Input
            type="number"
            min="0"
            max="59"
            step="5"
            value={formData.minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
            className="w-14 h-8 text-center bg-[#00111A] border-primary/20 text-sm"
            placeholder="30"
          />
          <span className="text-[#C4C8D4] text-sm">m</span>
        </div>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What did you work on?"
          className="flex-1 h-8 bg-[#00111A] border-primary/20 text-sm"
        />
        <Button type="submit" size="sm" disabled={submitting} className="h-8">
          {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
        </Button>
      </form>
    );
  }

  // Full form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Duration row */}
      <div className="space-y-2">
        <Label className="text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Duration <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min="0"
              max="99"
              value={formData.hours}
              onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
              className="w-16 text-center bg-card/50 border-primary/20"
            />
            <span className="text-[#C4C8D4]">hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min="0"
              max="59"
              step="5"
              value={formData.minutes}
              onChange={(e) => setFormData(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
              className="w-16 text-center bg-card/50 border-primary/20"
            />
            <span className="text-[#C4C8D4]">minutes</span>
          </div>
        </div>
        {errors.duration && (
          <p className="text-sm text-red-400">{errors.duration}</p>
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
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What did you work on?"
          rows={2}
          className="bg-card/50 border-primary/20 resize-none"
        />
      </div>

      {/* Date and Billable row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Date</Label>
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
                  setFormData(prev => ({ ...prev, workDate: date ? date.toISOString().split('T')[0] : '' }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Options</Label>
          <div className="flex items-center gap-2 h-10">
            <Checkbox
              id="billable"
              checked={formData.isBillable}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, isBillable: checked === true }))
              }
            />
            <Label htmlFor="billable" className="text-[#C4C8D4] cursor-pointer">
              Billable
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-primary/10">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Log Time
        </Button>
      </div>
    </form>
  );
}
