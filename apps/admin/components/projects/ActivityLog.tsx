'use client';

/**
 * ActivityLog Component
 *
 * Displays activity history for projects and tasks with:
 * - Avatar component for user display
 * - Timeline with dots and dividers
 * - Last 5 activities visible, expandable to see all
 * - Activity type icons and human-readable descriptions
 *
 * Phase 5: Activity history implementation
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Edit,
  MessageSquare,
  UserPlus,
  UserMinus,
  CalendarClock,
  RefreshCw,
  Plus,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Activity type from database
export interface ActivityItem {
  id: string;
  task_id?: string;
  project_id?: string;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  activity_type: string;
  field_changed?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
  // Optional: task details when showing project-level activities
  task_name?: string;
  task_code?: string;
}

interface ActivityLogProps {
  /** Activities to display */
  activities: ActivityItem[];
  /** Number of activities to show initially */
  initialCount?: number;
  /** Title for the section */
  title?: string;
  /** Show task references (for project-level activity) */
  showTaskRef?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Get initials from name or email
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'SY'; // System
}

/**
 * Get avatar color based on name hash
 */
function getAvatarColor(name?: string | null): string {
  const colors = [
    'bg-primary/30 text-primary',
    'bg-blue-500/30 text-blue-400',
    'bg-purple-500/30 text-purple-400',
    'bg-green-500/30 text-green-400',
    'bg-orange-500/30 text-orange-400',
    'bg-pink-500/30 text-pink-400',
    'bg-cyan-500/30 text-cyan-400',
  ];

  if (!name) return colors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get activity icon based on type
 */
function ActivityIcon({ type }: { type: string }) {
  const iconClass = 'w-3.5 h-3.5';

  switch (type) {
    case 'completed':
      return <CheckCircle2 className={cn(iconClass, 'text-green-400')} />;
    case 'reopened':
      return <RefreshCw className={cn(iconClass, 'text-yellow-400')} />;
    case 'created':
      return <Plus className={cn(iconClass, 'text-primary')} />;
    case 'updated':
    case 'status_changed':
      return <Edit className={cn(iconClass, 'text-blue-400')} />;
    case 'commented':
      return <MessageSquare className={cn(iconClass, 'text-purple-400')} />;
    case 'assigned':
      return <UserPlus className={cn(iconClass, 'text-green-400')} />;
    case 'unassigned':
      return <UserMinus className={cn(iconClass, 'text-red-400')} />;
    case 'due_date_changed':
      return <CalendarClock className={cn(iconClass, 'text-orange-400')} />;
    default:
      return <Circle className={cn(iconClass, 'text-[#C4C8D4]')} />;
  }
}

/**
 * Format activity description
 */
function formatActivityDescription(activity: ActivityItem): string {
  const userName = activity.user_name || 'Someone';

  switch (activity.activity_type) {
    case 'completed':
      return `${userName} marked this task as done`;
    case 'reopened':
      return `${userName} reopened this task`;
    case 'created':
      return `${userName} created this task`;
    case 'status_changed':
      return `${userName} changed status from "${activity.old_value}" to "${activity.new_value}"`;
    case 'updated':
      if (activity.field_changed) {
        return `${userName} updated ${activity.field_changed}`;
      }
      return `${userName} made changes`;
    case 'commented':
      return `${userName} added a comment`;
    case 'assigned':
      return `${userName} was assigned`;
    case 'unassigned':
      return `${userName} was unassigned`;
    case 'due_date_changed':
      return `${userName} changed due date to ${activity.new_value || 'unset'}`;
    default:
      return `${userName} performed an action`;
  }
}

/**
 * Format timestamp for display (German format)
 */
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return 'just now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  // Full date in German format
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Single activity item
 */
function ActivityEntry({
  activity,
  showTaskRef,
  isLast,
}: {
  activity: ActivityItem;
  showTaskRef?: boolean;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-primary/20" />
      )}

      {/* Avatar */}
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 z-10',
          getAvatarColor(activity.user_name)
        )}
      >
        {getInitials(activity.user_name, activity.user_email)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start gap-2">
          {/* Activity icon */}
          <div className="mt-0.5">
            <ActivityIcon type={activity.activity_type} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Description */}
            <p className="text-sm text-[#C4C8D4] leading-relaxed">
              {formatActivityDescription(activity)}
            </p>

            {/* Task reference */}
            {showTaskRef && activity.task_code && (
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {activity.task_code}
                </Badge>
                {activity.task_name && (
                  <span className="text-xs text-[#C4C8D4] truncate">
                    {activity.task_name}
                  </span>
                )}
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-[#C4C8D4]/60 mt-1">
              {formatTimestamp(activity.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-primary/10" />
          <div className="flex-1">
            <div className="h-4 bg-primary/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-primary/10 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityLog({
  activities,
  initialCount = 5,
  title = 'Activity',
  showTaskRef = false,
  isLoading = false,
  emptyMessage = 'No activity yet',
}: ActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayActivities = isExpanded ? activities : activities.slice(0, initialCount);
  const hasMore = activities.length > initialCount;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <ActivitySkeleton />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <div className="text-center py-6">
          <Activity className="w-10 h-10 text-primary/20 mx-auto mb-2" />
          <p className="text-sm text-[#C4C8D4]/60">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {activities.length}
          </Badge>
        </div>
      </div>

      {/* Activity list */}
      <div className="space-y-0">
        {displayActivities.map((activity, index) => (
          <ActivityEntry
            key={activity.id}
            activity={activity}
            showTaskRef={showTaskRef}
            isLast={index === displayActivities.length - 1}
          />
        ))}
      </div>

      {/* Expand/Collapse button */}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show {activities.length - initialCount} more
            </>
          )}
        </Button>
      )}
    </div>
  );
}
