/**
 * Calendar Configuration
 * Default settings for Ozean Licht team calendar
 */

import type { CalendarConfig, TWorkingHours, TVisibleHours, TCalendarView } from './types';

/**
 * Default working hours for Ozean Licht team
 * Monday-Friday: 9:00-18:00
 * Saturday: 10:00-14:00 (half day)
 * Sunday: Not working
 */
export const defaultWorkingHours: TWorkingHours = {
  0: { from: 0, to: 0 },    // Sunday - not working
  1: { from: 9, to: 18 },   // Monday
  2: { from: 9, to: 18 },   // Tuesday
  3: { from: 9, to: 18 },   // Wednesday
  4: { from: 9, to: 18 },   // Thursday
  5: { from: 9, to: 18 },   // Friday
  6: { from: 10, to: 14 },  // Saturday - half day
};

/**
 * Default visible hours in day/week views
 * Shows from 6 AM to 10 PM
 */
export const defaultVisibleHours: TVisibleHours = {
  from: 6,   // Show from 6 AM
  to: 22,    // Show until 10 PM
};

/**
 * Default calendar configuration
 */
export const defaultCalendarConfig: CalendarConfig = {
  workingHours: defaultWorkingHours,
  visibleHours: defaultVisibleHours,
  defaultView: 'week' as TCalendarView,
  weekStartsOn: 1,  // Monday (European standard)
};

/**
 * Calendar color palette matching Ozean Licht design system
 * Maps TEventColor to Tailwind CSS classes
 */
export const eventColorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  green: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  yellow: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  gray: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
  },
};

/**
 * German day names for calendar display
 */
export const dayNames = {
  short: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  long: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
};

/**
 * German month names for calendar display
 */
export const monthNames = {
  short: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  long: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ],
};

/**
 * Event type labels in German
 */
export const eventTypeLabels: Record<string, string> = {
  'Kurs': 'Kurs',
  'Video': 'Video',
  'Short': 'Short',
  'Post': 'Post',
  'Blog': 'Blog',
  'Love Letter': 'Love Letter',
  'Kongress': 'Kongress',
  'Interview': 'Interview',
  'Live Event': 'Live Event',
  'Youtube Live': 'YouTube Live',
  'Sonstiges': 'Sonstiges',
};

/**
 * Calendar view labels
 */
export const viewLabels: Record<TCalendarView, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
  agenda: 'Agenda',
};
