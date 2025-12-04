/**
 * RoutingBadge Component - Support Management System
 *
 * Displays team and priority indicators with color-coded badges.
 */

'use client';

import React from 'react';
import { Team, ConversationPriority } from '@/types/support';
import { getTeamLabel, getTeamColor, getPriorityColor } from '@/types/support';
import { Badge } from '@/components/ui/badge';

interface RoutingBadgeProps {
  /** Team assignment */
  team?: Team;
  /** Priority level */
  priority?: ConversationPriority;
}

/**
 * RoutingBadge displays team and/or priority badges
 *
 * Features:
 * - Team badge with color coding (tech=blue, sales=green, spiritual=purple, general=gray)
 * - Priority badge with urgency colors (urgent=red, high=orange, normal=blue, low=gray)
 * - Returns null if neither team nor priority is provided
 * - Follows Ozean Licht design system
 *
 * @example
 * ```tsx
 * <RoutingBadge team="tech" priority="high" />
 * <RoutingBadge team="sales" />
 * <RoutingBadge priority="urgent" />
 * ```
 */
export default function RoutingBadge({ team, priority }: RoutingBadgeProps) {
  // Return null if no routing info
  if (!team && !priority) {
    return null;
  }

  // Map team color to badge variant
  const getTeamVariant = (
    color: string
  ): 'info' | 'success' | 'secondary' | 'default' => {
    const colorMap: Record<string, 'info' | 'success' | 'secondary' | 'default'> = {
      blue: 'info',
      green: 'success',
      purple: 'secondary',
      gray: 'default',
    };
    return colorMap[color] || 'default';
  };

  // Map priority color to badge variant
  const getPriorityVariant = (
    color: string
  ): 'default' | 'info' | 'warning' | 'destructive' => {
    const colorMap: Record<string, 'default' | 'info' | 'warning' | 'destructive'> = {
      gray: 'default',
      blue: 'info',
      orange: 'warning',
      red: 'destructive',
    };
    return colorMap[color] || 'default';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Team Badge */}
      {team && (
        <Badge variant={getTeamVariant(getTeamColor(team))}>
          {getTeamLabel(team)}
        </Badge>
      )}

      {/* Priority Badge */}
      {priority && (
        <Badge variant={getPriorityVariant(getPriorityColor(priority))}>
          {priority}
        </Badge>
      )}
    </div>
  );
}
