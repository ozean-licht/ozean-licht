/**
 * EventCard Component
 * Reusable event display component for calendar views
 *
 * Supports three variants:
 * - compact: For month view (minimal, title only)
 * - default: For week view (title + time)
 * - detailed: For day view (title + time + description preview)
 *
 * Features:
 * - Glass morphism design with color-coded left border
 * - Hover glow effect matching Ozean Licht design system
 * - Source indicator for Google Calendar events
 * - Full keyboard accessibility
 * - Truncated text with proper overflow handling
 */

'use client';

import type { IEvent } from './types';
import { eventColorClasses, formatTime, isAllDayEvent } from './';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface EventCardProps {
  event: IEvent;
  variant?: 'compact' | 'default' | 'detailed';
  onClick?: (event: IEvent) => void;
  style?: React.CSSProperties; // For absolute positioning in time grid
  className?: string;
}

/**
 * EventCard component for displaying calendar events
 *
 * @param event - The event to display
 * @param variant - Display variant (default: 'default')
 * @param onClick - Optional click handler for opening event details
 * @param style - Optional inline styles for positioning
 * @param className - Additional CSS classes
 */
export function EventCard({
  event,
  variant = 'default',
  onClick,
  style,
  className
}: EventCardProps) {
  const colors = eventColorClasses[event.color] || eventColorClasses.gray;
  const isAllDay = isAllDayEvent(event);
  const isClickable = !!onClick;
  const isGoogleEvent = event.source === 'connected_calendar';

  // Handle click and keyboard events
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(event);
    }
  };

  // Base classes shared across all variants
  const baseClasses = cn(
    // Glass morphism background
    'bg-card/70 backdrop-blur-sm',
    // Border styling with event color on left
    'border border-l-4',
    colors.border,
    // Rounded corners
    'rounded-md',
    // Transition for smooth hover effects
    'transition-all duration-200',
    // Hover glow effect
    isClickable && 'cursor-pointer hover:shadow-[0_0_12px_rgba(14,166,193,0.2)] hover:bg-card/80',
    // Focus styles for accessibility
    isClickable && 'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
    className
  );

  // Compact variant for month view
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        className={cn(baseClasses, 'px-1.5 py-0.5 min-h-[20px]')}
        style={style}
        title={event.title}
      >
        <div className="flex items-center gap-1">
          {isGoogleEvent && (
            <Calendar className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
          )}
          <p className={cn('text-xs font-medium truncate', colors.text)}>
            {event.title}
          </p>
        </div>
      </div>
    );
  }

  // Default variant for week view
  if (variant === 'default') {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        className={cn(baseClasses, 'px-2 py-1.5 min-h-[40px]')}
        style={style}
      >
        <div className="flex flex-col gap-0.5">
          {/* Time display */}
          {!isAllDay && (
            <p className="text-[10px] font-normal text-muted-foreground">
              {formatTime(event.startDate)}
            </p>
          )}

          {/* Title */}
          <div className="flex items-start gap-1">
            {isGoogleEvent && (
              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <p className={cn('text-xs font-medium line-clamp-2', colors.text)}>
              {event.title}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant for day view
  if (variant === 'detailed') {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        className={cn(baseClasses, 'px-3 py-2 min-h-[60px]')}
        style={style}
      >
        <div className="flex flex-col gap-1">
          {/* Time display */}
          {!isAllDay && (
            <p className="text-xs font-normal text-muted-foreground">
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </p>
          )}
          {isAllDay && (
            <p className="text-xs font-normal text-muted-foreground">
              Ganztägig
            </p>
          )}

          {/* Title with Google Calendar indicator */}
          <div className="flex items-start gap-1.5">
            {isGoogleEvent && (
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <h4 className={cn('text-sm font-medium line-clamp-2', colors.text)}>
              {event.title}
            </h4>
          </div>

          {/* Location (if available) */}
          {event.location && (
            <p className="text-xs text-muted-foreground truncate">
              📍 {event.location}
            </p>
          )}

          {/* Description preview */}
          {event.description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-0.5">
              {event.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Fallback (should never reach here with proper TypeScript)
  return null;
}
