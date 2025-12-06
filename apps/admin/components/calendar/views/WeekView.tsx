'use client';

/**
 * WeekView Component
 * Displays a week view with time slots and events for the Ozean Licht team calendar
 *
 * Features:
 * - 7-day grid with hourly time slots
 * - All-day events section
 * - Working hours highlighting
 * - Current time indicator
 * - Event positioning with overlap handling
 *
 * @module WeekView
 */

import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  useCalendar,
  getWeekDays,
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
  dayNames,
  parseISO,
} from '../';
import type { IEvent } from '../types';

const SLOT_HEIGHT = 48; // pixels per hour
const TIME_GUTTER_WIDTH = 60; // pixels for left time column
const ALL_DAY_ROW_HEIGHT = 32; // pixels per all-day event row

/**
 * Calculate overlap groups for events in a day
 * Groups overlapping events together for proper positioning
 */
function getOverlapGroups(events: IEvent[]): IEvent[][] {
  if (events.length === 0) return [];

  // Sort events by start time
  const sorted = [...events].sort((a, b) => {
    return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
  });

  const groups: IEvent[][] = [];
  let currentGroup: IEvent[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const currentStart = parseISO(current.startDate);

    // Check if current event overlaps with any in the current group
    const overlaps = currentGroup.some((groupEvent) => {
      const groupEnd = parseISO(groupEvent.endDate);
      return currentStart < groupEnd;
    });

    if (overlaps) {
      currentGroup.push(current);
    } else {
      groups.push(currentGroup);
      currentGroup = [current];
    }
  }

  groups.push(currentGroup);
  return groups;
}

/**
 * Event component rendered in time grid
 */
interface EventBlockProps {
  event: IEvent;
  position: { top: number; height: number };
  widthPercent: number;
  leftPercent: number;
  onClick?: (event: IEvent) => void;
}

function EventBlock({ event, position, widthPercent, leftPercent, onClick }: EventBlockProps) {
  const colorClass = eventColorClasses[event.color] || eventColorClasses.gray;
  const startTime = formatTime(event.startDate);
  const endTime = formatTime(event.endDate);

  return (
    <div
      className={`
        absolute rounded border-l-2 px-1 py-0.5 text-xs overflow-hidden cursor-pointer
        transition-colors hover:brightness-110
        ${colorClass.bg} ${colorClass.text} ${colorClass.border}
      `}
      style={{
        top: `${position.top}px`,
        height: `${position.height}px`,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
      onClick={() => onClick?.(event)}
      title={`${event.title}\n${startTime} - ${endTime}\n${event.description || ''}`}
    >
      <div className="font-medium truncate">{event.title}</div>
      {position.height > 30 && (
        <div className="text-[10px] opacity-80">
          {startTime} - {endTime}
        </div>
      )}
    </div>
  );
}

/**
 * All-day event component
 */
interface AllDayEventProps {
  event: IEvent;
  onClick?: (event: IEvent) => void;
}

function AllDayEvent({ event, onClick }: AllDayEventProps) {
  const colorClass = eventColorClasses[event.color] || eventColorClasses.gray;

  return (
    <div
      className={`
        rounded border-l-2 px-2 py-1 text-xs font-medium truncate cursor-pointer
        transition-colors hover:brightness-110
        ${colorClass.bg} ${colorClass.text} ${colorClass.border}
      `}
      onClick={() => onClick?.(event)}
      title={`${event.title}\n${event.description || ''}`}
    >
      {event.title}
    </div>
  );
}

/**
 * Current time indicator component
 */
interface CurrentTimeIndicatorProps {
  visibleHours: { from: number; to: number };
  slotHeight: number;
}

function CurrentTimeIndicator({ visibleHours, slotHeight }: CurrentTimeIndicatorProps) {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      // Only show if current time is within visible hours
      if (currentHour >= visibleHours.from && currentHour <= visibleHours.to) {
        const hourOffset = currentHour - visibleHours.from;
        const minuteOffset = currentMinutes / 60;
        const top = (hourOffset + minuteOffset) * slotHeight;
        setPosition(top);
      } else {
        setPosition(null);
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [visibleHours, slotHeight]);

  if (position === null) return null;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${position}px` }}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
    </div>
  );
}

/**
 * WeekView Component
 */
export function WeekView() {
  const { selectedDate, events, config, setDate } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(
    () => getWeekDays(selectedDate, config.weekStartsOn),
    [selectedDate, config.weekStartsOn]
  );

  const hours = useMemo(
    () => getHourSlots(config.visibleHours),
    [config.visibleHours]
  );

  // Separate all-day and timed events for each day
  const dayEvents = useMemo(() => {
    return days.map((day) => {
      const dayEvents = getEventsForDay(events, day);
      const allDay = dayEvents.filter((event) => isAllDayEvent(event));
      const timed = dayEvents.filter((event) => !isAllDayEvent(event));
      return { allDay, timed };
    });
  }, [days, events]);

  // Calculate max all-day events for consistent height
  const maxAllDayEvents = useMemo(() => {
    return Math.max(...dayEvents.map((d) => d.allDay.length), 1);
  }, [dayEvents]);

  const allDayHeight = maxAllDayEvents * ALL_DAY_ROW_HEIGHT + 16; // + padding

  // Scroll to current time on mount
  useEffect(() => {
    if (containerRef.current && isToday(selectedDate)) {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= config.visibleHours.from && currentHour <= config.visibleHours.to) {
        const hourOffset = currentHour - config.visibleHours.from;
        const scrollPosition = hourOffset * SLOT_HEIGHT - 100; // Offset for better visibility

        containerRef.current.scrollTop = Math.max(0, scrollPosition);
      }
    }
  }, [selectedDate, config.visibleHours]);

  const handleEventClick = (event: IEvent) => {
    console.log('Event clicked:', event);
    // TODO: Open event details modal
  };

  const handleDayHeaderClick = (day: Date) => {
    setDate(day);
    // TODO: Switch to day view
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with day names and dates */}
      <div className="flex border-b border-border bg-card/50">
        {/* Time gutter spacer */}
        <div
          className="flex-shrink-0 border-r border-border"
          style={{ width: `${TIME_GUTTER_WIDTH}px` }}
        />

        {/* Day headers */}
        <div className="flex flex-1">
          {days.map((day, index) => {
            const dayOfWeek = getDay(day);
            const todayClass = isToday(day)
              ? 'bg-primary/10 border-primary/30'
              : '';

            return (
              <div
                key={index}
                className={`
                  flex-1 px-2 py-3 text-center border-r border-border last:border-r-0
                  cursor-pointer hover:bg-card/70 transition-colors
                  ${todayClass}
                `}
                onClick={() => handleDayHeaderClick(day)}
              >
                <div className="text-xs text-muted-foreground">
                  {dayNames.short[dayOfWeek]}
                </div>
                <div
                  className={`
                    text-lg font-medium mt-1
                    ${isToday(day) ? 'text-primary' : 'text-foreground'}
                  `}
                >
                  {formatDate(day, 'dd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-day events section */}
      <div
        className="flex border-b border-border bg-card/30"
        style={{ minHeight: `${allDayHeight}px` }}
      >
        {/* Time gutter with label */}
        <div
          className="flex-shrink-0 border-r border-border flex items-start justify-center pt-2"
          style={{ width: `${TIME_GUTTER_WIDTH}px` }}
        >
          <span className="text-xs text-muted-foreground">Ganztägig</span>
        </div>

        {/* All-day event columns */}
        <div className="flex flex-1">
          {dayEvents.map((day, index) => (
            <div
              key={index}
              className="flex-1 px-1 py-2 space-y-1 border-r border-border last:border-r-0"
            >
              {day.allDay.map((event) => (
                <AllDayEvent
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Time grid - scrollable */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
      >
        <div className="flex relative">
          {/* Time gutter */}
          <div
            className="flex-shrink-0 border-r border-border bg-card/50"
            style={{ width: `${TIME_GUTTER_WIDTH}px` }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b border-border text-right pr-2 text-xs text-muted-foreground -mt-2"
                style={{ height: `${SLOT_HEIGHT}px` }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Day columns with events */}
          <div className="flex flex-1 relative">
            {days.map((day, dayIndex) => {
              const dayOfWeek = getDay(day);
              const timedEvents = dayEvents[dayIndex].timed;
              const overlapGroups = getOverlapGroups(timedEvents);

              return (
                <div
                  key={dayIndex}
                  className="flex-1 relative border-r border-border last:border-r-0"
                >
                  {/* Hour slots background */}
                  {hours.map((hour) => {
                    const isWorking = isWorkingHour(hour, dayOfWeek, config.workingHours);
                    const bgClass = isWorking
                      ? 'bg-card/50'
                      : 'bg-background/30 opacity-60';

                    return (
                      <div
                        key={hour}
                        className={`border-b border-border ${bgClass}`}
                        style={{ height: `${SLOT_HEIGHT}px` }}
                      />
                    );
                  })}

                  {/* Events */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative h-full pointer-events-auto">
                      {overlapGroups.map((group, _groupIndex) => {
                        const groupSize = group.length;
                        const widthPercent = 100 / groupSize;

                        return group.map((event, eventIndex) => {
                          const position = getEventPosition(
                            event,
                            config.visibleHours,
                            SLOT_HEIGHT
                          );
                          const leftPercent = eventIndex * widthPercent;

                          return (
                            <EventBlock
                              key={event.id}
                              event={event}
                              position={position}
                              widthPercent={widthPercent - 1} // -1 for gap
                              leftPercent={leftPercent}
                              onClick={handleEventClick}
                            />
                          );
                        });
                      })}
                    </div>
                  </div>

                  {/* Current time indicator (only for today) */}
                  {isToday(day) && (
                    <div className="absolute inset-0 pointer-events-none">
                      <CurrentTimeIndicator
                        visibleHours={config.visibleHours}
                        slotHeight={SLOT_HEIGHT}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
