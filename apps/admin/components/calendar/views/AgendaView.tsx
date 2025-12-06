'use client';

/**
 * AgendaView Component
 * Displays calendar events in a chronological list format
 *
 * Features:
 * - Events grouped by day with German date headers
 * - Shows next 30 days from selected date
 * - Today's section highlighted with primary border
 * - All-day events labeled as "Ganztägig"
 * - Time displayed on the left for timed events
 * - Color indicator bar on left of each event card
 * - Location displayed if available
 * - Description preview in event cards
 * - Glass morphism design matching Ozean Licht theme
 * - Click event cards to view details
 * - Empty state for no upcoming events
 *
 * @module AgendaView
 */

import { useMemo, useCallback } from 'react';
import {
  useCalendar,
  getEventsInRange,
  isToday,
  formatDate,
  formatTime,
  addDays,
  parseISO,
  eventColorClasses,
  isAllDayEvent,
} from '../';
import type { IEvent } from '../types';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Group events by their start date
 * Returns a Map with date strings as keys and event arrays as values
 */
function groupEventsByDay(events: IEvent[]): Map<string, IEvent[]> {
  const groups = new Map<string, IEvent[]>();

  events.forEach((event) => {
    const eventDate = parseISO(event.startDate);
    const dateKey = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)?.push(event);
  });

  // Sort events within each day by start time
  groups.forEach((dayEvents) => {
    dayEvents.sort((a, b) => {
      const aStart = parseISO(a.startDate).getTime();
      const bStart = parseISO(b.startDate).getTime();
      return aStart - bStart;
    });
  });

  return groups;
}

/**
 * AgendaView Component
 *
 * Renders a chronological list view of upcoming events.
 * Events are grouped by day with highlighted headers for today.
 */
export function AgendaView() {
  const { selectedDate, events, setDate, setView } = useCalendar();

  /**
   * Get events for the next 30 days and sort chronologically
   */
  const agendaEvents = useMemo(() => {
    const start = selectedDate;
    const end = addDays(selectedDate, 30);
    const rangeEvents = getEventsInRange(events, start, end);

    // Sort by start date
    return rangeEvents.sort((a, b) =>
      parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
    );
  }, [selectedDate, events]);

  /**
   * Group events by day for rendering
   */
  const groupedEvents = useMemo(() => {
    return groupEventsByDay(agendaEvents);
  }, [agendaEvents]);

  /**
   * Handle event card click - show event details (future enhancement)
   */
  const handleEventClick = useCallback(
    (_event: IEvent) => {
      // Future: Open event detail modal
      // This will be implemented when the EventDialog component is integrated
    },
    []
  );

  /**
   * Handle day header click - navigate to that day in day view
   */
  const handleDayHeaderClick = useCallback(
    (date: Date) => {
      setDate(date);
      setView('day');
    },
    [setDate, setView]
  );

  // Empty state when no events
  if (agendaEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              Keine anstehenden Termine
            </h3>
            <p className="text-sm text-muted-foreground">
              Es sind keine Ereignisse für die nächsten 30 Tage geplant.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable event list */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {Array.from(groupedEvents.entries()).map(([dateKey, dayEvents]) => {
          const dayDate = parseISO(dateKey);
          const isTodaySection = isToday(dayDate);

          return (
            <div key={dateKey} className="space-y-3">
              {/* Day Header */}
              <div
                onClick={() => handleDayHeaderClick(dayDate)}
                className={`
                  sticky top-0 z-10
                  px-4 py-3 rounded-lg
                  bg-card/90 backdrop-blur-md
                  border transition-all duration-200
                  cursor-pointer
                  hover:bg-card hover:shadow-[0_0_20px_rgba(14,194,188,0.15)]
                  ${isTodaySection
                    ? 'border-primary shadow-[0_0_15px_rgba(14,194,188,0.2)]'
                    : 'border-border'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-base font-medium ${
                      isTodaySection ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {formatDate(dayDate, 'EEEE, dd. MMMM yyyy')}
                  </h2>
                  {isTodaySection && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                      Heute
                    </span>
                  )}
                </div>
              </div>

              {/* Events for this day */}
              <div className="space-y-2">
                {dayEvents.map((event) => {
                  const colors = eventColorClasses[event.color] || eventColorClasses.gray;
                  const isAllDay = isAllDayEvent(event);
                  const isGoogleEvent = event.source === 'connected_calendar';

                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleEventClick(event);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`
                        flex gap-4 p-4 rounded-lg
                        bg-card/70 backdrop-blur-sm
                        border border-l-4 ${colors.border}
                        transition-all duration-200
                        cursor-pointer
                        hover:bg-card/80 hover:shadow-[0_0_12px_rgba(14,194,188,0.2)]
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                      `}
                    >
                      {/* Left: Time Column */}
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        {isAllDay ? (
                          <span className="text-xs font-medium text-muted-foreground">
                            Ganztägig
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium text-foreground">
                              {formatTime(event.startDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(event.endDate)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Event Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title with Google Calendar indicator */}
                        <div className="flex items-start gap-2">
                          {isGoogleEvent && (
                            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <h3 className={`text-base font-medium line-clamp-2 ${colors.text}`}>
                            {event.title}
                          </h3>
                        </div>

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {event.location}
                            </p>
                          </div>
                        )}

                        {/* Description Preview */}
                        {event.description && (
                          <p className="text-sm text-muted-foreground/90 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Event metadata */}
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-xs text-muted-foreground">
                            von {event.user.name}
                          </span>
                          {event.googleCalendarLink && (
                            <a
                              href={event.googleCalendarLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                              In Google Calendar öffnen →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
