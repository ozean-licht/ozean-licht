'use client';

/**
 * Calendar Header Component
 * Navigation header for the Ozean Licht team calendar with view switcher and date navigation
 *
 * Features:
 * - Today button for quick navigation to current date
 * - Previous/Next navigation arrows
 * - Dynamic date/period display based on current view
 * - View switcher tabs (Day | Week | Month | Year | Agenda)
 * - Responsive design with mobile-friendly layout
 *
 * @module CalendarHeader
 */

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendar } from './CalendarContext';
import { getViewHeaderText } from './helpers';
import { viewLabels } from './config';
import type { TCalendarView } from './types';
import { cn } from '@/lib/utils';

const views: TCalendarView[] = ['day', 'week', 'month', 'year', 'agenda'];

/**
 * Calendar Header Component
 *
 * Displays the calendar navigation controls, current date/period, and view switcher.
 * Integrates with CalendarContext for state management.
 *
 * Layout:
 * - Left: Today button + Prev/Next arrows
 * - Center: Current date/period display
 * - Right: View switcher tabs
 *
 * @returns Calendar header with navigation and view controls
 *
 * @example
 * ```tsx
 * <CalendarProvider>
 *   <CalendarHeader />
 *   <CalendarGrid />
 * </CalendarProvider>
 * ```
 */
export function CalendarHeader() {
  const { selectedDate, view, setView, navigate } = useCalendar();
  const headerText = getViewHeaderText(selectedDate, view);

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      {/* Left section: Navigation controls */}
      <div className="flex items-center gap-2">
        {/* Today button */}
        <Button
          onClick={() => navigate('today')}
          variant="default"
          size="default"
          className="bg-primary text-white hover:bg-primary/90 font-normal"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Heute</span>
        </Button>

        {/* Previous button */}
        <Button
          onClick={() => navigate('prev')}
          variant="ghost"
          size="icon"
          className="glass-card glass-hover hover:bg-primary/10 font-normal"
          aria-label="Vorheriger Zeitraum"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Next button */}
        <Button
          onClick={() => navigate('next')}
          variant="ghost"
          size="icon"
          className="glass-card glass-hover hover:bg-primary/10 font-normal"
          aria-label="Nächster Zeitraum"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Center section: Current date/period display */}
      <div className="flex-1 text-center min-w-0">
        <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-normal truncate">
          {headerText}
        </h2>
      </div>

      {/* Right section: View switcher */}
      <div className="flex items-center gap-1 glass-card rounded-lg p-1">
        {views.map((viewOption) => (
          <button
            key={viewOption}
            onClick={() => setView(viewOption)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-normal transition-all duration-200',
              'hover:bg-primary/10 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              view === viewOption
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground'
            )}
            aria-label={`${viewLabels[viewOption]} Ansicht`}
            aria-pressed={view === viewOption}
          >
            {/* Full labels on desktop, abbreviated on mobile */}
            <span className="hidden sm:inline">{viewLabels[viewOption]}</span>
            <span className="inline sm:hidden">
              {viewLabels[viewOption].charAt(0)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
