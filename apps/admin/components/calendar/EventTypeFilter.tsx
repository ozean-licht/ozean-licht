'use client';

/**
 * Event Type Filter Component
 * Popover-based filter for calendar event types in the Ozean Licht team calendar
 *
 * Features:
 * - Radix UI Popover for accessible dropdown interaction
 * - Color-coded event type indicators matching calendar event colors
 * - "Alle Typen" option to clear the filter
 * - Glass morphism design matching Ozean Licht design system
 * - German language labels
 *
 * @module EventTypeFilter
 */

import * as React from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { eventColorClasses, eventTypeLabels } from './config';
import { mapEventTypeToColor } from './types';
import type { TEventType } from './types';
import { cn } from '@/lib/utils';

/**
 * Props for EventTypeFilter component
 */
export interface EventTypeFilterProps {
  /** Currently selected event type (undefined means "all types") */
  selectedType?: TEventType;
  /** Callback fired when a type is selected or cleared */
  onSelect: (type: TEventType | undefined) => void;
  /** Optional loading state to show skeleton/spinner */
  isLoading?: boolean;
}

/**
 * All available event types for filtering
 */
const EVENT_TYPES: TEventType[] = [
  'Kurs',
  'Video',
  'Short',
  'Post',
  'Blog',
  'Love Letter',
  'Kongress',
  'Interview',
  'Live Event',
  'Youtube Live',
  'Sonstiges',
];

/**
 * Event Type Filter Component
 *
 * Provides a popover-based filter for selecting event types in the calendar.
 * Shows color indicators matching the event type's assigned color in the calendar.
 *
 * Layout:
 * - Trigger: Button with tag icon and "Typ filtern" label
 * - Popover: List of event types with color dots + "Alle Typen" clear option
 *
 * @param props - Component props
 * @returns Event type filter popover
 *
 * @example
 * ```tsx
 * const [selectedType, setSelectedType] = useState<TEventType | undefined>();
 *
 * <EventTypeFilter
 *   selectedType={selectedType}
 *   onSelect={setSelectedType}
 * />
 * ```
 */
export function EventTypeFilter({ selectedType, onSelect, isLoading = false }: EventTypeFilterProps) {
  const [open, setOpen] = React.useState(false);

  /**
   * Handle type selection
   * @param type - Event type to select, undefined for "All Types"
   */
  const handleSelect = (type: TEventType | undefined) => {
    onSelect(type);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="glass-card glass-hover hover:bg-primary/10 font-normal"
          disabled={isLoading}
        >
          <Tag className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline text-sm">
            {isLoading ? 'Lädt...' : 'Typ filtern'}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-64 p-2 glass-card border border-white/10"
      >
        <div className="space-y-1">
          {/* "All Types" option */}
          <button
            onClick={() => handleSelect(undefined)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-200',
              'hover:bg-primary/10 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              !selectedType
                ? 'bg-primary/10 text-primary'
                : 'text-foreground'
            )}
            aria-label="Alle Typen anzeigen"
            aria-pressed={!selectedType}
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary/60 to-primary" />
            <span>Alle Typen</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-white/10 my-2" />

          {/* Event type options */}
          {EVENT_TYPES.map((type) => {
            const color = mapEventTypeToColor(type);
            const colorClass = eventColorClasses[color];
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-200',
                  'hover:bg-primary/10 hover:text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground'
                )}
                aria-label={`${eventTypeLabels[type]} anzeigen`}
                aria-pressed={isSelected}
              >
                {/* Color indicator dot */}
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    colorClass.bg,
                    colorClass.border,
                    'border'
                  )}
                />
                <span>{eventTypeLabels[type]}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
