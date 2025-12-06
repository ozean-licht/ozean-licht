'use client';

/**
 * CalendarContainer Component
 * Main wrapper component that combines all calendar parts together
 *
 * Features:
 * - Combines CalendarProvider, CalendarHeader, and all view components
 * - Manages event dialog state
 * - Handles loading and error states with glass morphism styling
 * - Renders the active calendar view (month, week, day, year, agenda)
 * - Responsive design with proper state handling
 *
 * @module CalendarContainer
 */

import { useState, useCallback } from 'react';
import { CalendarProvider, useCalendar } from './CalendarContext';
import { CalendarHeader } from './CalendarHeader';
import { EventDialog } from './EventDialog';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { YearView } from './views/YearView';
import { AgendaView } from './views/AgendaView';
import type { IEvent, TCalendarView } from './types';
import { AlertCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarContainerProps {
  initialView?: TCalendarView;
  initialDate?: Date;
}

/**
 * LoadingState Component
 * Skeleton loader for calendar grid with glass morphism styling
 */
function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="glass-card glass-hover p-8 rounded-lg text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Animated spinner */}
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Kalender wird geladen...
            </p>
            <p className="text-sm text-muted-foreground">
              Termine werden synchronisiert
            </p>
          </div>

          {/* Skeleton grid preview */}
          <div className="mt-4 grid grid-cols-7 gap-2 w-full max-w-md">
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-primary/10 rounded animate-pulse"
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorState Component
 * Error message display with retry functionality
 */
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="glass-card glass-hover p-8 rounded-lg text-center max-w-md">
        <div className="flex flex-col items-center gap-4">
          {/* Error icon with accent */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-red-500/10 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Error message */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              Fehler beim Laden
            </h3>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>

          {/* Retry button */}
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              className="mt-2 bg-primary text-white hover:bg-primary/90"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
          )}

          {/* Additional help text */}
          <p className="text-xs text-muted-foreground mt-2">
            Wenn das Problem weiterhin besteht, kontaktieren Sie bitte den Support.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * CalendarContent Component
 * Inner component that uses the calendar context to render views
 */
function CalendarContent() {
  const { view, loading, error, refreshEvents } = useCalendar();
  const [selectedEvent] = useState<IEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Render the active calendar view based on current view state
   */
  const renderView = useCallback(() => {
    switch (view) {
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      case 'day':
        return <DayView />;
      case 'year':
        return <YearView />;
      case 'agenda':
        return <AgendaView />;
      default:
        // Fallback to week view if unknown view type
        console.warn(`Unknown view type: ${view}, falling back to week view`);
        return <WeekView />;
    }
  }, [view]);

  /**
   * Handle retry button click in error state
   */
  const handleRetry = useCallback(() => {
    refreshEvents();
  }, [refreshEvents]);

  return (
    <div className="flex flex-col h-full">
      {/* Calendar header with navigation and view switcher */}
      <CalendarHeader />

      {/* Loading state - shows skeleton loader */}
      {loading && <LoadingState />}

      {/* Error state - shows error message with retry button */}
      {error && !loading && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {/* Calendar view - shows the active calendar view */}
      {!loading && !error && (
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      )}

      {/* Event dialog - modal for viewing event details */}
      <EventDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

/**
 * CalendarContainer Component
 * Main container that wraps everything with the CalendarProvider
 *
 * This is the top-level component that should be used in pages.
 * It provides the calendar context to all child components.
 *
 * @param initialView - Optional initial view mode (default: 'week')
 * @param initialDate - Optional initial date (default: today)
 *
 * @example
 * ```tsx
 * // In your page component
 * export default function CalendarPage() {
 *   return (
 *     <CalendarContainer
 *       initialView="month"
 *       initialDate={new Date()}
 *     />
 *   );
 * }
 * ```
 */
export function CalendarContainer({
  initialView,
  initialDate,
}: CalendarContainerProps) {
  return (
    <CalendarProvider initialView={initialView} initialDate={initialDate}>
      <CalendarContent />
    </CalendarProvider>
  );
}
