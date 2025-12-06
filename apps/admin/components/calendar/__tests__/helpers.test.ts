/**
 * Unit Tests for Calendar Helper Functions
 *
 * Tests for date utilities and calendar grid calculations.
 * All dates use Europe/Berlin timezone based on Airtable configuration.
 */

import {
  getMonthDays,
  getWeekDays,
  isWorkingHour,
  getEventsForDay,
  formatTime,
  navigateDate,
  getViewDateRange,
} from '../helpers';
import type { IEvent, TWorkingHours } from '../types';

describe('Calendar Helpers', () => {
  describe('getMonthDays', () => {
    it('should return correct number of days for a full month grid with Monday start', () => {
      // January 2025: Starts on Wednesday (Jan 1), ends on Friday (Jan 31)
      // Grid should include: Dec 29-31 (Mon-Wed) + Jan 1-31 + Feb 1-2 (Sat-Sun)
      const date = new Date('2025-01-15');
      const days = getMonthDays(date, 1);

      // Should have 5 weeks (35 days total)
      expect(days.length).toBe(35);
    });

    it('should return correct number of days for a full month grid with Sunday start', () => {
      // January 2025: Starts on Wednesday (Jan 1), ends on Friday (Jan 31)
      // Grid with Sunday start should include: Dec 29-31 + Jan 1-31 + Feb 1
      const date = new Date('2025-01-15');
      const days = getMonthDays(date, 0);

      // Should have 5 weeks (35 days total)
      expect(days.length).toBe(35);
    });

    it('should include padding days from previous month', () => {
      // January 2025 with Monday start
      const date = new Date('2025-01-15');
      const days = getMonthDays(date, 1);

      // First day should be from December 2024 (Dec 30 is Monday)
      const firstDay = days[0];
      expect(firstDay.getMonth()).toBe(11); // December (0-indexed)
      expect(firstDay.getDate()).toBe(30);
      expect(firstDay.getFullYear()).toBe(2024);
    });

    it('should include padding days from next month', () => {
      // January 2025 with Monday start
      const date = new Date('2025-01-15');
      const days = getMonthDays(date, 1);

      // Last day should be from February 2025 (Feb 2 is Sunday)
      const lastDay = days[days.length - 1];
      expect(lastDay.getMonth()).toBe(1); // February (0-indexed)
      expect(lastDay.getDate()).toBe(2);
      expect(lastDay.getFullYear()).toBe(2025);
    });

    it('should handle February in leap year correctly', () => {
      // February 2024 is a leap year (29 days)
      const date = new Date('2024-02-15');
      const days = getMonthDays(date, 1);

      // Should have complete weeks
      expect(days.length).toBeGreaterThanOrEqual(28);
      expect(days.length % 7).toBe(0); // Should be divisible by 7
    });

    it('should handle February in non-leap year correctly', () => {
      // February 2025 is not a leap year (28 days)
      const date = new Date('2025-02-15');
      const days = getMonthDays(date, 1);

      // Should have complete weeks
      expect(days.length).toBeGreaterThanOrEqual(28);
      expect(days.length % 7).toBe(0); // Should be divisible by 7
    });
  });

  describe('getWeekDays', () => {
    it('should return exactly 7 days for a week with Monday start', () => {
      const date = new Date('2025-01-15'); // Wednesday
      const days = getWeekDays(date, 1);

      expect(days.length).toBe(7);
    });

    it('should return exactly 7 days for a week with Sunday start', () => {
      const date = new Date('2025-01-15'); // Wednesday
      const days = getWeekDays(date, 0);

      expect(days.length).toBe(7);
    });

    it('should start week on Monday when weekStartsOn is 1', () => {
      const date = new Date('2025-01-15'); // Wednesday, Jan 15
      const days = getWeekDays(date, 1);

      // First day should be Monday, Jan 13
      expect(days[0].getDay()).toBe(1); // Monday
      expect(days[0].getDate()).toBe(13);
    });

    it('should start week on Sunday when weekStartsOn is 0', () => {
      const date = new Date('2025-01-15'); // Wednesday, Jan 15
      const days = getWeekDays(date, 0);

      // First day should be Sunday, Jan 12
      expect(days[0].getDay()).toBe(0); // Sunday
      expect(days[0].getDate()).toBe(12);
    });

    it('should end week on Sunday when weekStartsOn is 1', () => {
      const date = new Date('2025-01-15'); // Wednesday, Jan 15
      const days = getWeekDays(date, 1);

      // Last day should be Sunday, Jan 19
      expect(days[6].getDay()).toBe(0); // Sunday
      expect(days[6].getDate()).toBe(19);
    });

    it('should end week on Saturday when weekStartsOn is 0', () => {
      const date = new Date('2025-01-15'); // Wednesday, Jan 15
      const days = getWeekDays(date, 0);

      // Last day should be Saturday, Jan 18
      expect(days[6].getDay()).toBe(6); // Saturday
      expect(days[6].getDate()).toBe(18);
    });
  });

  describe('isWorkingHour', () => {
    const workingHours: TWorkingHours = {
      0: { from: 0, to: 0 },      // Sunday - not working
      1: { from: 9, to: 17 },     // Monday - 9am to 5pm
      2: { from: 9, to: 17 },     // Tuesday - 9am to 5pm
      3: { from: 9, to: 17 },     // Wednesday - 9am to 5pm
      4: { from: 9, to: 17 },     // Thursday - 9am to 5pm
      5: { from: 9, to: 17 },     // Friday - 9am to 5pm
      6: { from: 0, to: 0 },      // Saturday - not working
    };

    it('should return true during working hours on a working day', () => {
      // Monday at 10am
      expect(isWorkingHour(10, 1, workingHours)).toBe(true);

      // Wednesday at 2pm
      expect(isWorkingHour(14, 3, workingHours)).toBe(true);

      // Friday at 9am (start of work day)
      expect(isWorkingHour(9, 5, workingHours)).toBe(true);
    });

    it('should return false outside working hours on a working day', () => {
      // Monday at 8am (before work)
      expect(isWorkingHour(8, 1, workingHours)).toBe(false);

      // Monday at 5pm (at the boundary, should be false as hour < to)
      expect(isWorkingHour(17, 1, workingHours)).toBe(false);

      // Wednesday at 6pm (after work)
      expect(isWorkingHour(18, 3, workingHours)).toBe(false);
    });

    it('should return false on non-working days (Sunday)', () => {
      // Sunday at noon
      expect(isWorkingHour(12, 0, workingHours)).toBe(false);

      // Sunday at 9am
      expect(isWorkingHour(9, 0, workingHours)).toBe(false);
    });

    it('should return false on non-working days (Saturday)', () => {
      // Saturday at noon
      expect(isWorkingHour(12, 6, workingHours)).toBe(false);

      // Saturday at 10am
      expect(isWorkingHour(10, 6, workingHours)).toBe(false);
    });

    it('should handle edge case at start boundary (inclusive)', () => {
      // 9am should be included in working hours
      expect(isWorkingHour(9, 1, workingHours)).toBe(true);
    });

    it('should handle edge case at end boundary (exclusive)', () => {
      // 5pm (17:00) should NOT be included (hour < to)
      expect(isWorkingHour(17, 1, workingHours)).toBe(false);

      // 4pm should be included
      expect(isWorkingHour(16, 1, workingHours)).toBe(true);
    });
  });

  describe('getEventsForDay', () => {
    const createEvent = (
      id: string,
      startDate: string,
      endDate: string,
      title: string = 'Test Event'
    ): IEvent => ({
      id,
      startDate,
      endDate,
      title,
      color: 'blue',
      description: '',
      user: { id: 'user1', name: 'Test User', picturePath: null },
      source: 'events',
    });

    it('should return events that start on the specified day', () => {
      const events: IEvent[] = [
        createEvent('1', '2025-01-15T10:00:00Z', '2025-01-15T11:00:00Z', 'Morning Event'),
        createEvent('2', '2025-01-15T14:00:00Z', '2025-01-15T15:00:00Z', 'Afternoon Event'),
        createEvent('3', '2025-01-16T10:00:00Z', '2025-01-16T11:00:00Z', 'Next Day Event'),
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return events that span multiple days including the target day', () => {
      const events: IEvent[] = [
        // Event starts before and ends after the target day
        createEvent('1', '2025-01-14T10:00:00Z', '2025-01-16T11:00:00Z', 'Multi-day Event'),
        // Event starts on target day and ends later
        createEvent('2', '2025-01-15T10:00:00Z', '2025-01-17T11:00:00Z', 'Starts Today'),
        // Event started earlier and ends on target day
        createEvent('3', '2025-01-13T10:00:00Z', '2025-01-15T23:59:00Z', 'Ends Today'),
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBe(3);
    });

    it('should return empty array when no events match the day', () => {
      const events: IEvent[] = [
        createEvent('1', '2025-01-14T10:00:00Z', '2025-01-14T11:00:00Z'),
        createEvent('2', '2025-01-16T10:00:00Z', '2025-01-16T11:00:00Z'),
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBe(0);
    });

    it('should handle all-day events correctly', () => {
      const events: IEvent[] = [
        {
          ...createEvent('1', '2025-01-15T00:00:00Z', '2025-01-15T23:59:59Z', 'All Day'),
          allDay: true,
        },
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should handle events at day boundaries', () => {
      const events: IEvent[] = [
        // Event ends exactly at midnight of the target day
        createEvent('1', '2025-01-14T23:00:00Z', '2025-01-15T00:00:00Z'),
        // Event starts at midnight of the target day
        createEvent('2', '2025-01-15T00:00:00Z', '2025-01-15T01:00:00Z'),
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBeGreaterThanOrEqual(1);
      // At least event '2' should be included
      expect(result.some(e => e.id === '2')).toBe(true);
    });

    it('should handle events with same start and end date', () => {
      const events: IEvent[] = [
        createEvent('1', '2025-01-15T10:00:00Z', '2025-01-15T10:00:00Z', 'Instant Event'),
      ];

      const date = new Date('2025-01-15');
      const result = getEventsForDay(events, date);

      expect(result.length).toBe(1);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly in 24-hour format (HH:mm)', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const formatted = formatTime(date);

      // Format should be HH:mm (24-hour)
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle ISO string input', () => {
      const isoString = '2025-01-15T14:45:00Z';
      const formatted = formatTime(isoString);

      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should format morning hours correctly', () => {
      const date = new Date('2025-01-15T09:15:00Z');
      const formatted = formatTime(date);

      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should format afternoon/evening hours correctly', () => {
      const date = new Date('2025-01-15T18:30:00Z');
      const formatted = formatTime(date);

      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should pad single digit hours and minutes with zeros', () => {
      const date = new Date('2025-01-15T08:05:00Z');
      const formatted = formatTime(date);

      // Should have exactly 5 characters (HH:mm)
      expect(formatted.length).toBe(5);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle midnight correctly', () => {
      const date = new Date('2025-01-15T00:00:00Z');
      const formatted = formatTime(date);

      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('navigateDate', () => {
    it('should navigate forward by 1 day in day view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'day', 'next');

      expect(result.getDate()).toBe(16);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });

    it('should navigate backward by 1 day in day view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'day', 'prev');

      expect(result.getDate()).toBe(14);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });

    it('should navigate forward by 1 week in week view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'week', 'next');

      expect(result.getDate()).toBe(22);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });

    it('should navigate backward by 1 week in week view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'week', 'prev');

      expect(result.getDate()).toBe(8);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });

    it('should navigate forward by 1 month in month view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'month', 'next');

      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getFullYear()).toBe(2025);
    });

    it('should navigate backward by 1 month in month view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'month', 'prev');

      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getFullYear()).toBe(2024);
    });

    it('should navigate forward by 1 year in year view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'year', 'next');

      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2026);
    });

    it('should navigate backward by 1 year in year view', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'year', 'prev');

      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });

    it('should navigate by 1 week in agenda view (forward)', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'agenda', 'next');

      expect(result.getDate()).toBe(22);
    });

    it('should navigate by 1 week in agenda view (backward)', () => {
      const date = new Date('2025-01-15');
      const result = navigateDate(date, 'agenda', 'prev');

      expect(result.getDate()).toBe(8);
    });

    it('should handle month boundaries correctly (day view)', () => {
      const date = new Date('2025-01-31');
      const result = navigateDate(date, 'day', 'next');

      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(1); // February
    });

    it('should handle year boundaries correctly (month view)', () => {
      const date = new Date('2024-12-15');
      const result = navigateDate(date, 'month', 'next');

      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe('getViewDateRange', () => {
    it('should return single day range for day view', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const range = getViewDateRange(date, 'day', 1);

      // Start should be beginning of day
      expect(range.start.getDate()).toBe(15);
      expect(range.start.getHours()).toBe(0);
      expect(range.start.getMinutes()).toBe(0);
      expect(range.start.getSeconds()).toBe(0);

      // End should be end of day
      expect(range.end.getDate()).toBe(15);
      expect(range.end.getHours()).toBe(23);
      expect(range.end.getMinutes()).toBe(59);
      expect(range.end.getSeconds()).toBe(59);
    });

    it('should return 7-day range for week view with Monday start', () => {
      const date = new Date('2025-01-15'); // Wednesday
      const range = getViewDateRange(date, 'week', 1);

      // Should start on Monday (Jan 13)
      expect(range.start.getDay()).toBe(1); // Monday
      expect(range.start.getDate()).toBe(13);

      // Should end on Sunday (Jan 19)
      expect(range.end.getDay()).toBe(0); // Sunday
      expect(range.end.getDate()).toBe(19);
    });

    it('should return 7-day range for week view with Sunday start', () => {
      const date = new Date('2025-01-15'); // Wednesday
      const range = getViewDateRange(date, 'week', 0);

      // Should start on Sunday (Jan 12)
      expect(range.start.getDay()).toBe(0); // Sunday
      expect(range.start.getDate()).toBe(12);

      // Should end on Saturday (Jan 18)
      expect(range.end.getDay()).toBe(6); // Saturday
      expect(range.end.getDate()).toBe(18);
    });

    it('should return full grid range for month view with Monday start', () => {
      const date = new Date('2025-01-15');
      const range = getViewDateRange(date, 'month', 1);

      // Should start on the first Monday before/on the month
      expect(range.start.getDay()).toBe(1); // Monday

      // Should end on the last Sunday after/on the month
      expect(range.end.getDay()).toBe(0); // Sunday

      // Range should include days from December
      expect(range.start.getMonth()).toBe(11); // December
      expect(range.start.getDate()).toBe(30);

      // Range should include days from February
      expect(range.end.getMonth()).toBe(1); // February
      expect(range.end.getDate()).toBe(2);
    });

    it('should return full grid range for month view with Sunday start', () => {
      const date = new Date('2025-01-15');
      const range = getViewDateRange(date, 'month', 0);

      // Should start on Sunday
      expect(range.start.getDay()).toBe(0);

      // Should end on Saturday
      expect(range.end.getDay()).toBe(6);
    });

    it('should return full year range for year view', () => {
      const date = new Date('2025-06-15');
      const range = getViewDateRange(date, 'year', 1);

      // Should start on Jan 1
      expect(range.start.getMonth()).toBe(0);
      expect(range.start.getDate()).toBe(1);
      expect(range.start.getFullYear()).toBe(2025);

      // Should end on Dec 31
      expect(range.end.getMonth()).toBe(11);
      expect(range.end.getDate()).toBe(31);
      expect(range.end.getFullYear()).toBe(2025);
    });

    it('should return 30-day range for agenda view', () => {
      const date = new Date('2025-01-15');
      const range = getViewDateRange(date, 'agenda', 1);

      // Should start at beginning of selected day
      expect(range.start.getDate()).toBe(15);
      expect(range.start.getHours()).toBe(0);

      // Should end 30 days later (Feb 14)
      expect(range.end.getDate()).toBe(14);
      expect(range.end.getMonth()).toBe(1); // February
    });

    it('should handle leap year correctly in year view', () => {
      const date = new Date('2024-06-15'); // 2024 is a leap year
      const range = getViewDateRange(date, 'year', 1);

      expect(range.start.getFullYear()).toBe(2024);
      expect(range.end.getFullYear()).toBe(2024);
      expect(range.end.getMonth()).toBe(11); // December
      expect(range.end.getDate()).toBe(31);
    });

    it('should handle February boundaries in month view', () => {
      const date = new Date('2025-02-15');
      const range = getViewDateRange(date, 'month', 1);

      // February 2025 starts on Saturday, ends on Friday
      // With Monday start, should include days from January and March
      expect(range.start.getDay()).toBe(1); // Monday
      expect(range.end.getDay()).toBe(0); // Sunday
    });
  });
});
