'use client';

/**
 * DayView Component
 * Single day calendar view with time slots for the Ozean Licht team calendar
 *
 * Features:
 * - Full day view with hourly time slots
 * - Working hours highlighting
 * - All-day events section
 * - Current time indicator
 * - Event positioning with overlap handling
 * - Glass morphism styling matching Ozean Licht design system
 *
 * @module DayView
 */

import React, { useMemo, useEffect, useRef } from 'react';
import {
  useCalendar,
  getHourSlots,
  getEventsForDay,
  getEventPosition,
  isWorkingHour,
  isToday,
  formatTime,
  formatDate,
  isAllDayEvent,
  eventColorClasses,
  getDay,
  parseISO,
} from '../';
import type { IEvent } from '../types';

const SLOT_HEIGHT = 64; // Taller than week view for more detail

/**
 * Event with position metadata for rendering
 */
interface PositionedEvent extends IEvent {
  top: number;
  height: number;
  column: number;
  totalColumns: number;
}

/**
 * Calculate overlap groups for events
 * Groups events that overlap in time so they can be rendered side-by-side
 */
function calculateEventLayout(events: IEvent[], visibleHours: { from: number; to: number }): PositionedEvent[] {
  if (events.length === 0) return [];

  // Sort events by start time, then by duration (longer events first)
  const sortedEvents = [...events].sort((a, b) => {
    const startA = parseISO(a.startDate).getTime();
    const startB = parseISO(b.startDate).getTime();
    if (startA !== startB) return startA - startB;

    const endA = parseISO(a.endDate).getTime();
    const endB = parseISO(b.endDate).getTime();
    return (endB - startB) - (endA - startA); // Longer events first
  });

  const positioned: PositionedEvent[] = [];
  const columns: Array<{ event: PositionedEvent; end: number }[]> = [];

  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.startDate).getTime();
    const eventEnd = parseISO(event.endDate).getTime();
    const { top, height } = getEventPosition(event, visibleHours, SLOT_HEIGHT);

    // Find the first column where this event fits (no overlap with existing events)
    let columnIndex = 0;
    while (columnIndex < columns.length) {
      const column = columns[columnIndex];
      const hasOverlap = column.some((item) => eventStart < item.end);
      if (!hasOverlap) break;
      columnIndex++;
    }

    // Create new column if needed
    if (columnIndex >= columns.length) {
      columns.push([]);
    }

    const positionedEvent: PositionedEvent = {
      ...event,
      top,
      height,
      column: columnIndex,
      totalColumns: 1, // Will be updated
    };

    columns[columnIndex].push({ event: positionedEvent, end: eventEnd });
    positioned.push(positionedEvent);
  });

  // Update totalColumns for all events based on maximum column count
  const maxColumns = columns.length;
  positioned.forEach((event) => {
    event.totalColumns = maxColumns;
  });

  return positioned;
}

/**
 * TimeGridEvent Component
 * Renders a single event in the time grid with positioning
 */
interface TimeGridEventProps {
  event: PositionedEvent;
}

function TimeGridEvent({ event }: TimeGridEventProps) {
  const colors = eventColorClasses[event.color] || eventColorClasses.gray;
  const width = `${100 / event.totalColumns}%`;
  const left = `${(event.column * 100) / event.totalColumns}%`;

  const startTime = formatTime(event.startDate);
  const endTime = formatTime(event.endDate);

  // Extract first line of description for preview
  const descriptionPreview = event.description
    ? event.description.split('\n')[0].slice(0, 100)
    : '';

  return (
    <div
      className="absolute px-2 py-1.5 rounded-lg border backdrop-blur-sm transition-all hover:z-10 hover:shadow-lg cursor-pointer group overflow-hidden"
      style={{
        top: `${event.top}px`,
        height: `${event.height}px`,
        left,
        width: `calc(${width} - 4px)`,
        minHeight: '32px',
      }}
      title={`${event.title}\n${startTime} - ${endTime}\n${event.description}`}
    >
      <div className={`h-full flex flex-col ${colors.bg} ${colors.border}`}>
        {/* Event title */}
        <div className={`font-medium text-sm ${colors.text} truncate`}>
          {event.title}
        </div>

        {/* Event time (if there's space) */}
        {event.height >= 48 && (
          <div className="text-xs text-gray-400 mt-0.5">
            {startTime} - {endTime}
          </div>
        )}

        {/* Description preview (if there's space) */}
        {event.height >= 80 && descriptionPreview && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {descriptionPreview}
          </div>
        )}

        {/* Event creator (if there's space) */}
        {event.height >= 100 && event.user.name && (
          <div className="text-xs text-gray-600 mt-auto pt-1 truncate">
            {event.user.name}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AllDayEvent Component
 * Renders an all-day event badge
 */
interface AllDayEventProps {
  event: IEvent;
}

function AllDayEvent({ event }: AllDayEventProps) {
  const colors = eventColorClasses[event.color] || eventColorClasses.gray;

  return (
    <div
      className={`px-3 py-2 rounded-lg border backdrop-blur-sm ${colors.bg} ${colors.border} cursor-pointer hover:shadow-lg transition-all`}
      title={`${event.title}\n${event.description}`}
    >
      <div className={`font-medium text-sm ${colors.text}`}>
        {event.title}
      </div>
      {event.description && (
        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
          {event.description}
        </div>
      )}
    </div>
  );
}

/**
 * CurrentTimeIndicator Component
 * Shows a red line at the current time
 */
function CurrentTimeIndicator({ visibleHours }: { visibleHours: { from: number; to: number } }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Don't show if outside visible hours
  if (hours < visibleHours.from || hours > visibleHours.to) {
    return null;
  }

  const topPosition = ((hours - visibleHours.from) + (minutes / 60)) * SLOT_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${topPosition}px` }}
    >
      {/* Time label */}
      <div className="absolute -left-2 -top-2.5 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-md">
        {formatTime(currentTime)}
      </div>
      {/* Red line */}
      <div className="h-0.5 bg-red-500 shadow-md" />
    </div>
  );
}

/**
 * DayView Component
 * Main day view calendar component
 */
export function DayView() {
  const { selectedDate, events, config } = useCalendar();
  const scrollRef = useRef<HTMLDivElement>(null);

  const hours = useMemo(
    () => getHourSlots(config.visibleHours),
    [config.visibleHours]
  );

  const dayEvents = useMemo(
    () => getEventsForDay(events, selectedDate),
    [events, selectedDate]
  );

  const dayOfWeek = useMemo(
    () => getDay(selectedDate),
    [selectedDate]
  );

  // Separate all-day and timed events
  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: IEvent[] = [];
    const timed: IEvent[] = [];

    dayEvents.forEach((event) => {
      if (isAllDayEvent(event)) {
        allDay.push(event);
      } else {
        timed.push(event);
      }
    });

    return { allDayEvents: allDay, timedEvents: timed };
  }, [dayEvents]);

  // Calculate positioned events with overlap handling
  const positionedEvents = useMemo(
    () => calculateEventLayout(timedEvents, config.visibleHours),
    [timedEvents, config.visibleHours]
  );

  const isTodayView = useMemo(() => isToday(selectedDate), [selectedDate]);

  // Auto-scroll to current time on mount if viewing today
  useEffect(() => {
    if (isTodayView && scrollRef.current) {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= config.visibleHours.from && currentHour <= config.visibleHours.to) {
        const scrollPosition = Math.max(0, (currentHour - config.visibleHours.from - 2) * SLOT_HEIGHT);
        scrollRef.current.scrollTop = scrollPosition;
      }
    }
  }, [isTodayView, config.visibleHours]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with date */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-medium text-primary">
          {formatDate(selectedDate, 'EEEE, dd. MMMM yyyy')}
        </h2>
        {dayEvents.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {dayEvents.length} {dayEvents.length === 1 ? 'Termin' : 'Termine'}
          </p>
        )}
      </div>

      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-800 bg-card/20">
          <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Ganztägig
          </div>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <AllDayEvent key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative">
          {/* Hour rows */}
          {hours.map((hour) => {
            const isWorking = isWorkingHour(hour, dayOfWeek, config.workingHours);

            return (
              <div
                key={hour}
                className="flex border-b border-gray-800/50"
                style={{ height: `${SLOT_HEIGHT}px` }}
              >
                {/* Time gutter */}
                <div className="w-20 flex-shrink-0 pr-3 text-right">
                  <div className="text-sm text-gray-500 -mt-2.5">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Event column */}
                <div
                  className={`flex-1 relative transition-colors ${
                    isWorking
                      ? 'bg-card/50'
                      : 'bg-background/30 opacity-60'
                  }`}
                >
                  {/* Half-hour line */}
                  <div className="absolute left-0 right-0 border-t border-gray-800/30" style={{ top: '50%' }} />
                </div>
              </div>
            );
          })}

          {/* Events overlay */}
          <div
            className="absolute left-20 right-0"
            style={{
              top: 0,
              height: `${hours.length * SLOT_HEIGHT}px`,
            }}
          >
            {positionedEvents.map((event) => (
              <TimeGridEvent key={event.id} event={event} />
            ))}
          </div>

          {/* Current time indicator */}
          {isTodayView && (
            <div className="absolute left-20 right-0" style={{ top: 0 }}>
              <CurrentTimeIndicator visibleHours={config.visibleHours} />
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {dayEvents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-lg font-medium">Keine Termine</div>
            <div className="text-sm mt-1">
              {formatDate(selectedDate, 'EEEE, dd. MMMM yyyy')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
