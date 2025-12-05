/**
 * TypeFilterTabs Component - Team Chat & Messaging System
 *
 * Filter tabs for the unified inbox to filter by conversation type.
 * Provides horizontal tabs with icons, labels, and counts for each conversation type.
 */

'use client';

import React from 'react';
import { Hash, Headset, MessageCircle, Ticket } from 'lucide-react';
import { ConversationType } from '@/types/team-chat';
import { cn } from '@/lib/utils';

export interface TypeFilterTabsProps {
  /** Currently active filter */
  activeFilter: ConversationType | 'all';
  /** Callback when filter changes */
  onFilterChange: (filter: ConversationType | 'all') => void;
  /** Optional counts for each conversation type */
  counts?: {
    all: number;
    team_channel: number;
    support: number;
    direct_message: number;
    internal_ticket: number;
  };
}

interface TabConfig {
  key: ConversationType | 'all';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  {
    key: 'all',
    label: 'All',
    icon: MessageCircle,
  },
  {
    key: 'team_channel',
    label: 'Team',
    icon: Hash,
  },
  {
    key: 'support',
    label: 'Support',
    icon: Headset,
  },
  {
    key: 'direct_message',
    label: 'DMs',
    icon: MessageCircle,
  },
  {
    key: 'internal_ticket',
    label: 'Tickets',
    icon: Ticket,
  },
];

/**
 * TypeFilterTabs displays filter tabs for conversation types
 *
 * Features:
 * - Horizontal tabs with icons and labels
 * - Badge counts for each type
 * - Active tab highlighted with primary color underline and background
 * - Responsive design - scrollable on mobile
 * - Follows Ozean Licht design system
 *
 * @example
 * ```tsx
 * <TypeFilterTabs
 *   activeFilter="team_channel"
 *   onFilterChange={(filter) => setActiveFilter(filter)}
 *   counts={{
 *     all: 42,
 *     team_channel: 15,
 *     support: 12,
 *     direct_message: 8,
 *     internal_ticket: 7,
 *   }}
 * />
 * ```
 */
export default function TypeFilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: TypeFilterTabsProps) {
  // Get count for a specific tab
  const getCount = (key: ConversationType | 'all'): number | undefined => {
    if (!counts) return undefined;
    return counts[key as keyof typeof counts];
  };

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      {/* Scrollable container for mobile responsiveness */}
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count = getCount(tab.key);
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => onFilterChange(tab.key)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-3 text-sm font-sans font-medium transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'hover:bg-primary/5',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-[#C4C8D4] hover:text-white'
                )}
              >
                {/* Icon */}
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-primary' : 'text-[#C4C8D4]'
                  )}
                />

                {/* Label */}
                <span>{tab.label}</span>

                {/* Count badge */}
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-sans font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-[#C4C8D4]'
                    )}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}

                {/* Active indicator (underline) */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
