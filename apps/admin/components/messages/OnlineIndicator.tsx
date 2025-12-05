/**
 * OnlineIndicator Component - Team Chat & Messaging System
 *
 * Small status indicator dot showing user presence state
 */

'use client';

import React from 'react';
import { PresenceStatus } from '@/types/team-chat';

interface OnlineIndicatorProps {
  /** User's presence status */
  status: PresenceStatus;
  /** Additional CSS classes */
  className?: string;
}

/**
 * OnlineIndicator displays a color-coded dot for user presence
 *
 * Status colors:
 * - online: Green (#10B981)
 * - away: Yellow (#F59E0B)
 * - dnd: Red (#EF4444)
 * - offline: Gray (#6B7280)
 *
 * @example
 * ```tsx
 * <OnlineIndicator status="online" />
 * ```
 */
export default function OnlineIndicator({
  status,
  className = '',
}: OnlineIndicatorProps) {
  const statusColors: Record<PresenceStatus, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <div
      className={`w-2 h-2 rounded-full ${statusColors[status]} ${className}`}
      aria-label={`Status: ${status}`}
    />
  );
}
