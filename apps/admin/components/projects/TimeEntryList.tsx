'use client';

/**
 * Time Entry List Component
 *
 * Displays logged time entries for a task.
 * Part of Project Management MVP Phase 9
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, DollarSign, Calendar } from 'lucide-react';
import type { DBTimeEntry } from '@/lib/types';

interface TimeEntryListProps {
  entries: DBTimeEntry[];
  onDelete?: (entryId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// Format duration from minutes to human readable
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  // Check if yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  // Otherwise show date
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Get initials from name
function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function TimeEntryList({
  entries,
  onDelete,
  isLoading = false,
  emptyMessage = 'No time logged yet',
}: TimeEntryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-[#00111A]/50 border border-primary/10 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-primary/10 rounded" />
                <div className="h-3 w-32 bg-primary/10 rounded" />
              </div>
            </div>
            <div className="h-6 w-12 bg-primary/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-[#C4C8D4]">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between p-3 rounded-lg bg-[#00111A]/50 border border-primary/10 hover:border-primary/20 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
              {getInitials(entry.user_name)}
            </div>

            {/* Entry details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-white font-medium">
                  {entry.user_name || 'Unknown'}
                </span>
                <span className="text-xs text-[#C4C8D4] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(entry.work_date)}
                </span>
                {entry.is_billable && (
                  <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 py-0">
                    <DollarSign className="w-3 h-3 mr-0.5" />
                    Billable
                  </Badge>
                )}
              </div>
              {entry.description && (
                <p className="text-xs text-[#C4C8D4] truncate mt-0.5">
                  {entry.description}
                </p>
              )}
            </div>
          </div>

          {/* Duration and actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Badge className="bg-primary/20 text-primary border-0 font-mono">
              {formatDuration(entry.duration_minutes)}
            </Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
