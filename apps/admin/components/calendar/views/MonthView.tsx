'use client';

/**
 * MonthView Component
 * Displays calendar events in a monthly grid layout
 *
 * Features:
 * - 7-column week grid (Monday-Sunday, European format)
 * - Current day highlighting with primary border
 * - Selected date highlighting with primary background
 * - Event pills with color coding (max 3 visible, then "+N more")
 * - Adjacent month days shown with reduced opacity
 * - Click to select day or drill down to day view
 * - Responsive: hides event text on mobile, shows color dots only
 *
 * @module MonthView
 */

import { useCallback } from 'react';
import {
  useCalendar,
  getMonthDays,
  getEventsForDay,
  isToday,
  isSameMonth,
  isSameDay,
  dayNames,
  eventColorClasses,
  formatTime,
} from '../';
import type { IEvent } from '../types';

/**
 * Maximum number of events to display before showing "+N more"
 */
const MAX_VISIBLE_EVENTS = 3;

/**
 * MonthView Component
 *
 * Renders a complete month calendar grid with event pills.
 * Uses the CalendarContext for state management and navigation.
 */
export function MonthView() {
  const { selectedDate, events, config, setDate, setView } = useCalendar();

  // Get all days for the month grid (includes padding from adjacent months)
  const days = getMonthDays(selectedDate, config.weekStartsOn);

  /**
   * Handle day cell click - selects the date
   */
  const handleDayClick = useCallback(
    (date: Date) => {
      setDate(date);
    },
    [setDate]
  );

  /**
   * Handle "more events" click - drills down to day view
   */
  const handleMoreClick = useCallback(
    (date: Date, e: React.MouseEvent) => {
      e.stopPropagation();
      setDate(date);
      setView('day');
    },
    [setDate, setView]
  );

  /**
   * Handle event pill click - drills down to day view
   */
  const handleEventClick = useCallback(
    (date: Date, _event: IEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      setDate(date);
      setView('day');
    },
    [setDate, setView]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px bg-border border-b border-border">
        {dayNames.short.map((dayName, index) => {
          // Adjust for week start (Monday = 1)
          const adjustedIndex = config.weekStartsOn === 1
            ? (index + 1) % 7
            : index;
          const name = dayNames.short[adjustedIndex];

          return (
            <div
              key={dayName}
              className="bg-card/70 backdrop-blur-sm py-3 px-2 text-center"
            >
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border flex-1 overflow-hidden">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelected = isSameDay(day, selectedDate);
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = Math.max(0, dayEvents.length - MAX_VISIBLE_EVENTS);

          return (
            <div
              key={`${day.toISOString()}-${index}`}
              onClick={() => handleDayClick(day)}
              className={`
                bg-card/70 backdrop-blur-sm p-2 min-h-[120px] cursor-pointer
                transition-all duration-200
                hover:bg-card hover:shadow-[0_0_20px_rgba(14,194,188,0.15)]
                ${isCurrentDay ? 'ring-2 ring-primary ring-inset' : ''}
                ${isSelected ? 'bg-primary/10' : ''}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                flex flex-col
              `}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${isCurrentDay ? 'text-primary font-medium' : ''}
                    ${isSelected && !isCurrentDay ? 'text-primary-400' : ''}
                    ${!isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground'}
                  `}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {visibleEvents.map((event) => {
                  const colorClasses = eventColorClasses[event.color] || eventColorClasses.gray;
                  const timePrefix = !event.allDay ? `${formatTime(event.startDate)} ` : '';

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(day, event, e)}
                      className={`
                        px-2 py-1 rounded text-xs border cursor-pointer
                        transition-all duration-150
                        hover:opacity-80 hover:scale-[1.02]
                        ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
                      `}
                      title={`${timePrefix}${event.title}`}
                    >
                      {/* Desktop: Show event text */}
                      <div className="hidden sm:block truncate">
                        <span className="font-medium">
                          {timePrefix}
                        </span>
                        <span>{event.title}</span>
                      </div>

                      {/* Mobile: Show color dot only */}
                      <div className="sm:hidden flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${colorClasses.text.replace('text-', 'bg-')}`}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* "+N more" indicator */}
                {hiddenCount > 0 && (
                  <button
                    onClick={(e) => handleMoreClick(day, e)}
                    className="
                      w-full px-2 py-1 text-xs text-primary-400
                      hover:text-primary hover:bg-primary/10
                      rounded transition-colors duration-150
                      text-left font-medium
                    "
                  >
                    +{hiddenCount} mehr
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
