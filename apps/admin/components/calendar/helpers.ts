/**
 * Calendar Helper Functions
 * Date utilities for calendar views
 *
 * TIMEZONE NOTE: All date operations assume Europe/Berlin timezone based on Airtable configuration.
 * The calendar uses date-fns with German locale (de) for formatting.
 * Dates are stored in Airtable as ISO 8601 strings in UTC, but displayed in local time.
 */

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  getDay,
  getHours,
  getMinutes,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from 'date-fns';
import { de } from 'date-fns/locale';
import type { IEvent, TWorkingHours, TVisibleHours, TCalendarView } from './types';

/**
 * Get all days in a month grid (including days from prev/next months to fill weeks)
 *
 * Returns a complete calendar grid for the month view, including days from the
 * previous and next months to fill complete weeks.
 *
 * @param date - Any date in the target month
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 * @returns Array of Date objects representing all days in the grid
 *
 * @example
 * ```ts
 * const days = getMonthDays(new Date('2025-01-15'), 1);
 * // Returns ~35-42 days including padding from Dec 2024 and Feb 2025
 * ```
 */
export function getMonthDays(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

/**
 * Get all days in a week
 * @param date - Any date in the target week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday
 */
export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn });
  const weekEnd = endOfWeek(date, { weekStartsOn });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

/**
 * Get hour slots for day/week views
 * @param visibleHours - Configuration for visible hour range
 */
export function getHourSlots(visibleHours: TVisibleHours): number[] {
  const slots: number[] = [];
  for (let hour = visibleHours.from; hour <= visibleHours.to; hour++) {
    slots.push(hour);
  }
  return slots;
}

/**
 * Get all months in a year for year view
 * @param date - Any date in the target year
 */
export function getYearMonths(date: Date): Date[] {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);

  return eachMonthOfInterval({ start: yearStart, end: yearEnd });
}

/**
 * Check if an hour is within working hours for a given day
 * @param hour - Hour to check (0-23)
 * @param dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @param workingHours - Working hours configuration
 */
export function isWorkingHour(
  hour: number,
  dayOfWeek: number,
  workingHours: TWorkingHours
): boolean {
  const dayConfig = workingHours[dayOfWeek];
  if (!dayConfig || dayConfig.from === 0 && dayConfig.to === 0) {
    return false; // Non-working day
  }
  return hour >= dayConfig.from && hour < dayConfig.to;
}

/**
 * Filter events for a specific day
 *
 * Returns all events that occur on or overlap with the specified date.
 * Handles multi-day events and all-day events correctly.
 *
 * @param events - All events to filter
 * @param date - Target date to check
 * @returns Array of events that occur on this day
 *
 * @example
 * ```ts
 * const todayEvents = getEventsForDay(allEvents, new Date());
 * ```
 */
export function getEventsForDay(events: IEvent[], date: Date): IEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);

    // Event overlaps with this day
    return (
      isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) ||
      isWithinInterval(eventEnd, { start: dayStart, end: dayEnd })
    );
  });
}

/**
 * Get events within a date range
 * @param events - All events
 * @param start - Start date
 * @param end - End date
 */
export function getEventsInRange(events: IEvent[], start: Date, end: Date): IEvent[] {
  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);

    return (
      isWithinInterval(eventStart, { start, end }) ||
      isWithinInterval(eventEnd, { start, end }) ||
      (eventStart <= start && eventEnd >= end)
    );
  });
}

/**
 * Calculate event position and height for time grid views
 * @param event - Event to position
 * @param visibleHours - Visible hours configuration
 * @param slotHeight - Height of each hour slot in pixels
 */
export function getEventPosition(
  event: IEvent,
  visibleHours: TVisibleHours,
  slotHeight: number = 48
): { top: number; height: number } {
  const eventStart = parseISO(event.startDate);
  const eventEnd = parseISO(event.endDate);

  const startHour = getHours(eventStart);
  const startMinutes = getMinutes(eventStart);

  // Clamp to visible hours
  const visibleStartHour = Math.max(startHour, visibleHours.from);

  // Calculate position relative to visible hours
  const topHour = visibleStartHour - visibleHours.from;
  const topMinuteFraction = startHour >= visibleHours.from ? startMinutes / 60 : 0;
  const top = (topHour + topMinuteFraction) * slotHeight;

  // Calculate height
  const durationMinutes = differenceInMinutes(eventEnd, eventStart);
  const height = Math.max((durationMinutes / 60) * slotHeight, slotHeight / 2); // Minimum half slot

  return { top, height };
}

/**
 * Check if event is an all-day event
 * @param event - Event to check
 */
export function isAllDayEvent(event: IEvent): boolean {
  if (event.allDay) return true;

  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  const durationMinutes = differenceInMinutes(end, start);

  // Consider events >= 24 hours as all-day
  return durationMinutes >= 24 * 60;
}

/**
 * Check if event spans multiple days
 * @param event - Event to check
 */
export function isMultiDayEvent(event: IEvent): boolean {
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  return !isSameDay(start, end);
}

/**
 * Format time for display (German locale)
 * @param date - Date to format
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: de });
}

/**
 * Format date for display (German locale)
 * @param date - Date to format
 * @param formatStr - Format string (date-fns format)
 */
export function formatDate(date: Date | string, formatStr: string = 'dd. MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: de });
}

/**
 * Format date range for display
 * @param start - Start date
 * @param end - End date
 * @param allDay - Whether it's an all-day event
 */
export function formatDateRange(
  start: Date | string,
  end: Date | string,
  allDay: boolean = false
): string {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;

  if (allDay) {
    if (isSameDay(startDate, endDate)) {
      return formatDate(startDate, 'EEEE, dd. MMMM yyyy');
    }
    return `${formatDate(startDate, 'dd. MMM')} - ${formatDate(endDate, 'dd. MMM yyyy')}`;
  }

  if (isSameDay(startDate, endDate)) {
    return `${formatDate(startDate, 'EEEE, dd. MMMM')} ${formatTime(startDate)} - ${formatTime(endDate)}`;
  }

  return `${formatDate(startDate, 'dd. MMM')} ${formatTime(startDate)} - ${formatDate(endDate, 'dd. MMM')} ${formatTime(endDate)}`;
}

/**
 * Navigate calendar date based on current view
 *
 * Calculates the next or previous date based on the current calendar view.
 * Each view type has its own navigation increment (day, week, month, year).
 *
 * @param date - Current selected date
 * @param view - Current calendar view mode
 * @param direction - Navigation direction ('prev' or 'next')
 * @returns New date after navigation
 *
 * @example
 * ```ts
 * const nextWeek = navigateDate(new Date(), 'week', 'next');
 * const prevMonth = navigateDate(new Date(), 'month', 'prev');
 * ```
 */
export function navigateDate(
  date: Date,
  view: TCalendarView,
  direction: 'prev' | 'next'
): Date {
  const add = direction === 'next';

  switch (view) {
    case 'day':
      return add ? addDays(date, 1) : subDays(date, 1);
    case 'week':
      return add ? addWeeks(date, 1) : subWeeks(date, 1);
    case 'month':
      return add ? addMonths(date, 1) : subMonths(date, 1);
    case 'year':
      return add ? addYears(date, 1) : subYears(date, 1);
    case 'agenda':
      return add ? addWeeks(date, 1) : subWeeks(date, 1);
    default:
      return date;
  }
}

/**
 * Get date range for current view
 *
 * Calculates the start and end dates for the visible range in the current view.
 * Used for fetching events within the relevant time period.
 *
 * @param date - Currently selected date
 * @param view - Current calendar view mode
 * @param weekStartsOn - Week start day (0 = Sunday, 1 = Monday, default: 1)
 * @returns Object with start and end Date objects
 *
 * @example
 * ```ts
 * const range = getViewDateRange(new Date('2025-01-15'), 'month', 1);
 * // Returns: { start: 2024-12-30, end: 2025-02-02 } (full grid)
 * ```
 */
export function getViewDateRange(
  date: Date,
  view: TCalendarView,
  weekStartsOn: 0 | 1 = 1
): { start: Date; end: Date } {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn }),
        end: endOfWeek(date, { weekStartsOn }),
      };
    case 'month': {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return {
        start: startOfWeek(monthStart, { weekStartsOn }),
        end: endOfWeek(monthEnd, { weekStartsOn }),
      };
    }
    case 'year':
      return { start: startOfYear(date), end: endOfYear(date) };
    case 'agenda':
      return { start: startOfDay(date), end: addDays(date, 30) };
    default:
      return { start: date, end: date };
  }
}

/**
 * Get header text for current view
 * @param date - Selected date
 * @param view - Current calendar view
 */
export function getViewHeaderText(date: Date, view: TCalendarView): string {
  switch (view) {
    case 'day':
      return formatDate(date, 'EEEE, dd. MMMM yyyy');
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      if (isSameMonth(weekStart, weekEnd)) {
        return `${formatDate(weekStart, 'dd.')} - ${formatDate(weekEnd, 'dd. MMMM yyyy')}`;
      }
      return `${formatDate(weekStart, 'dd. MMM')} - ${formatDate(weekEnd, 'dd. MMM yyyy')}`;
    }
    case 'month':
      return formatDate(date, 'MMMM yyyy');
    case 'year':
      return formatDate(date, 'yyyy');
    case 'agenda':
      return `Agenda - ${formatDate(date, 'MMMM yyyy')}`;
    default:
      return '';
  }
}

// Re-export commonly used date-fns functions
export {
  isToday,
  isSameDay,
  isSameMonth,
  parseISO,
  format,
  getDay,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
};
