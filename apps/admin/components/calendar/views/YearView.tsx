'use client';

/**
 * YearView Component
 * Displays a 12-month year overview with mini calendars
 *
 * Features:
 * - 12 mini month calendars in a responsive grid (4x3 desktop, 3x4 tablet, 2x6 mobile)
 * - Clickable month headers to navigate to month view
 * - Single-letter day headers (M, D, M, D, F, S, S)
 * - Days with events show a small dot indicator
 * - Today highlighted with primary color
 * - Current month highlighted with primary border
 * - Adjacent month days hidden/very dim
 * - Glass morphism cards matching Ozean Licht design
 *
 * @module YearView
 */

import { useCallback } from 'react';
import {
  useCalendar,
  getYearMonths,
  getMonthDays,
  getEventsForDay,
  isToday,
  isSameMonth,
  monthNames,
} from '../';

/**
 * Single-letter day names for mini calendars
 * Corresponds to German weekdays starting Monday
 */
const MINI_DAY_NAMES = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];

/**
 * YearView Component
 *
 * Renders a year overview with 12 mini month calendars.
 * Uses the CalendarContext for state management and navigation.
 */
export function YearView() {
  const { selectedDate, events, config, setDate, setView } = useCalendar();

  // Get all 12 months for the year
  const months = getYearMonths(selectedDate);

  /**
   * Handle month header click - navigate to month view
   */
  const handleMonthClick = useCallback(
    (month: Date) => {
      setDate(month);
      setView('month');
    },
    [setDate, setView]
  );

  /**
   * Handle day click within mini calendar - navigate to that day in month view
   */
  const handleDayClick = useCallback(
    (day: Date) => {
      setDate(day);
      setView('month');
    },
    [setDate, setView]
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* 12-Month Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {months.map((month) => {
          const monthDays = getMonthDays(month, config.weekStartsOn);
          const isCurrentMonth = isSameMonth(month, selectedDate);
          const monthIndex = month.getMonth();
          const monthName = monthNames.long[monthIndex];

          return (
            <div
              key={month.toISOString()}
              className={`
                bg-[#00111A]/70 backdrop-blur-md rounded-lg border
                transition-all duration-200
                hover:shadow-[0_0_20px_rgba(14,194,188,0.2)]
                ${isCurrentMonth ? 'border-primary shadow-[0_0_15px_rgba(14,194,188,0.15)]' : 'border-gray-800/50'}
              `}
            >
              {/* Month Header - Clickable */}
              <button
                onClick={() => handleMonthClick(month)}
                className="
                  w-full px-4 py-3 text-center font-medium
                  text-gray-200 hover:text-primary
                  transition-colors duration-150
                  border-b border-gray-800/50
                "
              >
                {monthName}
              </button>

              {/* Mini Calendar Grid */}
              <div className="p-3">
                {/* Day Headers - Single Letters */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {MINI_DAY_NAMES.map((dayLetter, index) => (
                    <div
                      key={`${monthIndex}-header-${index}`}
                      className="text-center text-[10px] font-medium text-gray-500"
                    >
                      {dayLetter}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, dayIndex) => {
                    const isDayToday = isToday(day);
                    const isInMonth = isSameMonth(day, month);
                    const dayEvents = getEventsForDay(events, day);
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <button
                        key={`${month.toISOString()}-${dayIndex}`}
                        onClick={() => handleDayClick(day)}
                        disabled={!isInMonth}
                        className={`
                          relative aspect-square rounded text-xs
                          transition-all duration-150
                          flex items-center justify-center
                          ${isInMonth
                            ? 'hover:bg-primary/10 cursor-pointer'
                            : 'cursor-default opacity-0'
                          }
                          ${isDayToday
                            ? 'bg-primary text-white font-medium'
                            : isInMonth
                              ? 'text-gray-300'
                              : 'text-gray-700'
                          }
                        `}
                      >
                        <span className="relative z-10">
                          {day.getDate()}
                        </span>

                        {/* Event Indicator Dot */}
                        {hasEvents && isInMonth && !isDayToday && (
                          <div
                            className="
                              absolute bottom-0.5 left-1/2 -translate-x-1/2
                              w-1 h-1 rounded-full bg-primary
                            "
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
