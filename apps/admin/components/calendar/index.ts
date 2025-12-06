/**
 * Calendar Module
 * Barrel export for the Ozean Licht team calendar
 *
 * Usage:
 * import { CalendarProvider, useCalendar, IEvent, TCalendarView } from '@/components/calendar';
 */

// ============================================================================
// Types
// ============================================================================
export type {
  TCalendarView,
  TEventColor,
  TEventType,
  IUser,
  IEvent,
  AirtableConnectedCalendarRecord,
  AirtableEventsRecord,
  WorkingHoursDay,
  TWorkingHours,
  TVisibleHours,
  CalendarConfig,
  ICalendarConfig,
  CalendarEventsResponse,
  CalendarEventFilters,
} from './types';

// Transform functions
export {
  mapEventTypeToColor,
  transformConnectedCalendarToEvent,
  transformEventsToEvent,
} from './types';

// ============================================================================
// Configuration
// ============================================================================
export {
  defaultWorkingHours,
  defaultVisibleHours,
  defaultCalendarConfig,
  eventColorClasses,
  dayNames,
  monthNames,
  eventTypeLabels,
  viewLabels,
} from './config';

// ============================================================================
// Helper Functions
// ============================================================================
export {
  getMonthDays,
  getWeekDays,
  getHourSlots,
  getYearMonths,
  isWorkingHour,
  getEventsForDay,
  getEventsInRange,
  getEventPosition,
  isAllDayEvent,
  isMultiDayEvent,
  formatTime,
  formatDate,
  formatDateRange,
  navigateDate,
  getViewDateRange,
  getViewHeaderText,
  // Re-exported date-fns functions
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
} from './helpers';

// ============================================================================
// Context and Hooks
// ============================================================================
export {
  CalendarProvider,
  useCalendar,
  useCalendarEvents,
  useCalendarNavigation,
  CalendarContext,
} from './CalendarContext';
