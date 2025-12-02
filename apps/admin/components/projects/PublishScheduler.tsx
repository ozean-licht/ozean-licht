'use client';

/**
 * Publish Scheduler Component
 *
 * Manages publishing schedules for content items across multiple platforms.
 * Allows scheduling, rescheduling, cancellation, and retry of failed publishes.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Youtube,
  Globe,
  Mail,
  Share2,
  Headphones,
  CalendarIcon,
  Plus,
  X,
  RotateCcw,
  Loader2,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface PublishSchedule {
  id: string;
  platform: 'youtube' | 'website' | 'newsletter' | 'social' | 'podcast';
  scheduled_at: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  published_url?: string;
  error_message?: string;
}

interface PublishSchedulerProps {
  contentItemId: string;
  onScheduleChange?: () => void;
  readonly?: boolean;
}

const PLATFORM_CONFIG = {
  youtube: { icon: Youtube, label: 'YouTube' },
  website: { icon: Globe, label: 'Website' },
  newsletter: { icon: Mail, label: 'Newsletter' },
  social: { icon: Share2, label: 'Social Media' },
  podcast: { icon: Headphones, label: 'Podcast' },
};

const STATUS_VARIANTS = {
  scheduled: 'default',
  publishing: 'warning',
  published: 'success',
  failed: 'destructive',
  cancelled: 'secondary',
} as const;

export default function PublishScheduler({
  contentItemId,
  onScheduleChange,
  readonly = false,
}: PublishSchedulerProps) {
  const [schedules, setSchedules] = useState<PublishSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState<string>('');
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState('12:00');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [contentItemId]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/publish-schedules/content/${contentItemId}`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load publish schedules.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!newPlatform || !newDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a platform and date.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const [hours, minutes] = newTime.split(':');
      const scheduledAt = new Date(newDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const res = await fetch('/api/publish-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_item_id: contentItemId,
          platform: newPlatform,
          scheduled_at: scheduledAt.toISOString(),
        }),
      });

      if (res.ok) {
        toast({ title: 'Success', description: 'Schedule added successfully.' });
        setDialogOpen(false);
        setNewPlatform('');
        setNewDate(undefined);
        setNewTime('12:00');
        await fetchSchedules();
        onScheduleChange?.();
      } else {
        throw new Error('Failed to add schedule');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (scheduleId: string) => {
    try {
      const res = await fetch(`/api/publish-schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        toast({ title: 'Success', description: 'Schedule cancelled.' });
        await fetchSchedules();
        onScheduleChange?.();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel schedule.',
        variant: 'destructive',
      });
    }
  };

  const handleRetry = async (scheduleId: string) => {
    try {
      const res = await fetch(`/api/publish-schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast({ title: 'Success', description: 'Retrying publish now.' });
        await fetchSchedules();
        onScheduleChange?.();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry publish.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Publishing Schedule</h3>
        {!readonly && (
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        )}
      </div>

      {schedules.length === 0 ? (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="py-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-primary/40" />
            <p className="text-[#C4C8D4]">No publishing schedules yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const PlatformIcon = PLATFORM_CONFIG[schedule.platform].icon;
            const scheduledDate = new Date(schedule.scheduled_at);

            return (
              <Card key={schedule.id} className="bg-card/50 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <PlatformIcon className="w-5 h-5 mt-0.5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">
                            {PLATFORM_CONFIG[schedule.platform].label}
                          </span>
                          <Badge variant={STATUS_VARIANTS[schedule.status]}>
                            {schedule.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#C4C8D4]">
                          {scheduledDate.toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                        {schedule.published_url && (
                          <a
                            href={schedule.published_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                          >
                            View Published Content
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {schedule.error_message && (
                          <p className="mt-2 text-sm text-red-400">{schedule.error_message}</p>
                        )}
                      </div>
                    </div>

                    {!readonly && (
                      <div className="flex gap-2">
                        {schedule.status === 'scheduled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(schedule.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {schedule.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(schedule.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Publishing Schedule</DialogTitle>
            <DialogDescription>
              Schedule content to be published on a specific platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger className="bg-card/50 border-primary/20">
                  <SelectValue placeholder="Select platform..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-card/50 border-primary/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDate ? format(newDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <input
                id="time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-card/50 border border-primary/20 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSchedule} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
