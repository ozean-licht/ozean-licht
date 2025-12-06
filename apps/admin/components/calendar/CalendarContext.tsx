'use client';

/**
 * Calendar Context
 * State management for the team calendar
 *
 * Provides centralized state management for calendar views, events, filters, and configuration.
 * Fetches events from the Airtable API based on current date range and filters.
 *
 * @module CalendarContext
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import type { IEvent, TCalendarView, CalendarConfig, CalendarEventFilters } from './types';
import { defaultCalendarConfig } from './config';
import { getViewDateRange, navigateDate } from './helpers';
import { format } from 'date-fns';

// State interface
interface CalendarState {
  selectedDate: Date;
  view: TCalendarView;
  events: IEvent[];
  loading: boolean;
  error: string | null;
  config: CalendarConfig;
  filters: CalendarEventFilters;
}

// Action types
type CalendarAction =
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_VIEW'; payload: TCalendarView }
  | { type: 'SET_EVENTS'; payload: IEvent[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONFIG'; payload: Partial<CalendarConfig> }
  | { type: 'SET_FILTERS'; payload: Partial<CalendarEventFilters> }
  | { type: 'NAVIGATE'; payload: 'prev' | 'next' | 'today' };

// Initial state
const initialState: CalendarState = {
  selectedDate: new Date(),
  view: defaultCalendarConfig.defaultView,
  events: [],
  loading: false,
  error: null,
  config: defaultCalendarConfig,
  filters: { source: 'all' },
};

// Reducer
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'NAVIGATE':
      if (action.payload === 'today') {
        return { ...state, selectedDate: new Date() };
      }
      return {
        ...state,
        selectedDate: navigateDate(state.selectedDate, state.view, action.payload),
      };
    default:
      return state;
  }
}

// Context interface
interface CalendarContextValue extends CalendarState {
  setDate: (date: Date) => void;
  setView: (view: TCalendarView) => void;
  setFilters: (filters: Partial<CalendarEventFilters>) => void;
  updateConfig: (config: Partial<CalendarConfig>) => void;
  navigate: (direction: 'prev' | 'next' | 'today') => void;
  refreshEvents: () => Promise<void>;
  dateRange: { start: Date; end: Date };
}

// Create context
const CalendarContext = createContext<CalendarContextValue | null>(null);

// Provider props
interface CalendarProviderProps {
  children: React.ReactNode;
  initialView?: TCalendarView;
  initialDate?: Date;
}

/**
 * Calendar Provider Component
 * Wraps calendar components with state management
 */
export function CalendarProvider({
  children,
  initialView,
  initialDate,
}: CalendarProviderProps) {
  const [state, dispatch] = useReducer(calendarReducer, {
    ...initialState,
    view: initialView || initialState.view,
    selectedDate: initialDate || initialState.selectedDate,
  });

  // Memoized date range based on current view and date
  const dateRange = useMemo(
    () => getViewDateRange(state.selectedDate, state.view, state.config.weekStartsOn),
    [state.selectedDate, state.view, state.config.weekStartsOn]
  );

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        start: format(dateRange.start, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        end: format(dateRange.end, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      });

      if (state.filters.source && state.filters.source !== 'all') {
        params.set('source', state.filters.source);
      }
      if (state.filters.eventType) {
        params.set('eventType', state.filters.eventType);
      }

      const response = await fetch(`/api/calendar/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response structure before updating state
      if (!data || !Array.isArray(data.events)) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response format from calendar API');
      }

      dispatch({ type: 'SET_EVENTS', payload: data.events });
    } catch (error) {
      // Log error for debugging but don't crash the component tree
      console.error('Calendar events fetch error:', error);

      const message = error instanceof Error ? error.message : 'Failed to load events';
      dispatch({ type: 'SET_ERROR', payload: message });

      // Clear events on error to avoid showing stale data
      dispatch({ type: 'SET_EVENTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dateRange, state.filters]);

  // Fetch events when date range or filters change
  useEffect(() => {
    // Wrap in try-catch to prevent crashes if fetchEvents throws synchronously
    try {
      fetchEvents().catch((error) => {
        // Additional safety net for unhandled promise rejections
        console.error('Unhandled calendar fetch error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred' });
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    } catch (error) {
      console.error('Calendar useEffect error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize calendar' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchEvents]);

  // Action creators
  const setDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  const setView = useCallback((view: TCalendarView) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setFilters = useCallback((filters: Partial<CalendarEventFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const updateConfig = useCallback((config: Partial<CalendarConfig>) => {
    dispatch({ type: 'SET_CONFIG', payload: config });
  }, []);

  const navigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    dispatch({ type: 'NAVIGATE', payload: direction });
  }, []);

  const refreshEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  // Context value
  const value: CalendarContextValue = {
    ...state,
    setDate,
    setView,
    setFilters,
    updateConfig,
    navigate,
    refreshEvents,
    dateRange,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

/**
 * Hook to access calendar context
 *
 * Provides access to the full calendar state and actions.
 * Must be used within a CalendarProvider component.
 *
 * @returns Complete calendar context including state and actions
 * @throws Error if used outside CalendarProvider
 *
 * @example
 * ```tsx
 * function MyCalendarComponent() {
 *   const { events, loading, setView, navigate } = useCalendar();
 *   // ...
 * }
 * ```
 */
export function useCalendar(): CalendarContextValue {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }

  return context;
}

/**
 * Hook to access only calendar events
 *
 * Lightweight hook for components that only need event data and loading state.
 * Provides a smaller subset of the calendar context.
 *
 * @returns Object containing events, loading state, error state, and refresh function
 *
 * @example
 * ```tsx
 * function EventList() {
 *   const { events, loading, refresh } = useCalendarEvents();
 *   // ...
 * }
 * ```
 */
export function useCalendarEvents(): {
  events: IEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const { events, loading, error, refreshEvents } = useCalendar();
  return { events, loading, error, refresh: refreshEvents };
}

/**
 * Hook to access calendar navigation
 */
export function useCalendarNavigation(): {
  selectedDate: Date;
  view: TCalendarView;
  dateRange: { start: Date; end: Date };
  setDate: (date: Date) => void;
  setView: (view: TCalendarView) => void;
  navigate: (direction: 'prev' | 'next' | 'today') => void;
} {
  const { selectedDate, view, dateRange, setDate, setView, navigate } = useCalendar();
  return { selectedDate, view, dateRange, setDate, setView, navigate };
}

export { CalendarContext };
