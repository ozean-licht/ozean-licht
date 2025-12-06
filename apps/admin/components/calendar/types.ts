/**
 * Calendar Component Types
 * Types for the Ozean Licht team calendar component
 * Adapted from lramos33/big-calendar with Airtable integration
 *
 * This module defines all TypeScript types and interfaces used throughout the calendar system,
 * including Airtable record types, internal event types, and transformation functions.
 *
 * @module CalendarTypes
 */

// ============================================================================
// Calendar View Types
// ============================================================================

/**
 * Available calendar view modes
 */
export type TCalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda';

/**
 * Event color palette (matching big-calendar)
 */
export type TEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray';

// ============================================================================
// Core Event Types
// ============================================================================

/**
 * User interface for event creators/attendees
 */
export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

/**
 * Internal calendar event interface (big-calendar compatible)
 *
 * Normalized event structure used throughout the calendar UI.
 * Events from different sources (Google Calendar, manual events) are transformed into this format.
 *
 * @interface IEvent
 */
export interface IEvent {
  id: string;
  startDate: string;  // ISO string
  endDate: string;    // ISO string
  title: string;
  color: TEventColor;
  description: string;
  user: IUser;
  allDay?: boolean;
  location?: string;
  googleEventId?: string;
  googleCalendarLink?: string;
  source: 'connected_calendar' | 'events';
}

// ============================================================================
// Airtable Record Types
// ============================================================================

/**
 * Event type from Airtable events table
 */
export type TEventType =
  | 'Kurs'
  | 'Video'
  | 'Short'
  | 'Post'
  | 'Blog'
  | 'Love Letter'
  | 'Kongress'
  | 'Interview'
  | 'Live Event'
  | 'Youtube Live'
  | 'Sonstiges';

/**
 * Raw Airtable record from connected_calendar table (Google Calendar sync)
 */
export interface AirtableConnectedCalendarRecord {
  id: string;                    // Airtable record ID (e.g., "recXXXXXXXX")
  fields: {
    title: string;
    start: string;               // ISO datetime "2025-02-15T19:00:00.000Z"
    end: string;                 // ISO datetime
    all_day?: boolean;
    recurring_event?: boolean;
    creator?: string;            // email
    status?: 'confirmed';
    location?: string;
    description?: string;
    attendees?: string;
    created?: string;
    updated?: string;
    event_id?: string;           // Google Calendar event ID
    event_link?: string;
    hangouts_link?: string;
    open_in_google_calendar?: { label: string; url: string };
  };
  createdTime: string;
}

/**
 * Raw Airtable record from events table (manual events/content calendar)
 */
export interface AirtableEventsRecord {
  id: string;
  fields: {
    id: number;                  // autoNumber
    title: string;
    start?: string;
    end?: string;
    duration?: number;           // seconds
    status?: 'Geplant' | 'Abgeschlossen' | 'Abgebrochen';
    lias_time?: 'Blockiert' | 'Frei';
    type?: TEventType;
    description?: string;
    location?: string;
    attendees?: string;
    google_event_id?: string;
    linked_project?: string[];
    created_by?: { id: string; email: string; name: string };
    updated_by?: { id: string; email: string; name: string };
  };
  createdTime: string;
}

// ============================================================================
// Working Hours Configuration
// ============================================================================

/**
 * Working hours for a single day
 */
export interface WorkingHoursDay {
  from: number;  // Hour (0-23)
  to: number;    // Hour (0-23)
}

/**
 * Working hours configuration by day of week
 * Keys: 0 (Sunday) to 6 (Saturday)
 */
export type TWorkingHours = Record<number, WorkingHoursDay>;

/**
 * Visible hours range in calendar views
 */
export interface TVisibleHours {
  from: number;  // First hour shown (default: 6)
  to: number;    // Last hour shown (default: 22)
}

/**
 * Complete calendar configuration
 */
export interface CalendarConfig {
  workingHours: TWorkingHours;
  visibleHours: TVisibleHours;
  defaultView: TCalendarView;
  weekStartsOn: 0 | 1;  // 0 = Sunday, 1 = Monday
}

/**
 * Alias for backward compatibility
 */
export type ICalendarConfig = CalendarConfig;

// ============================================================================
// API Types
// ============================================================================

/**
 * Calendar events API response
 */
export interface CalendarEventsResponse {
  events: IEvent[];
  total: number;
  hasMore: boolean;
}

/**
 * Event filter parameters
 */
export interface CalendarEventFilters {
  start?: string;
  end?: string;
  source?: 'connected_calendar' | 'events' | 'all';
  userId?: string;
  eventType?: TEventType;
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Map Airtable event type to calendar color
 * @param type - Event type from Airtable
 * @returns Calendar color matching the event type
 */
export function mapEventTypeToColor(type?: TEventType): TEventColor {
  const typeColorMap: Record<TEventType, TEventColor> = {
    'Kurs': 'purple',           // Courses - purple (learning)
    'Video': 'blue',            // Videos - blue
    'Short': 'blue',            // Shorts - blue
    'Post': 'green',            // Social posts - green
    'Blog': 'green',            // Blog posts - green
    'Love Letter': 'yellow',    // Newsletters - yellow (highlight)
    'Kongress': 'red',          // Congresses - red (important)
    'Interview': 'orange',      // Interviews - orange
    'Live Event': 'red',        // Live events - red (important)
    'Youtube Live': 'red',      // YouTube live - red
    'Sonstiges': 'gray',        // Other - gray
  };
  return typeColorMap[type || 'Sonstiges'] || 'gray';
}

/**
 * Transform Airtable connected_calendar record to IEvent
 * @param record - Raw Airtable record from connected_calendar table
 * @returns Normalized IEvent object
 * @throws Error if record or required fields are missing/malformed
 */
export function transformConnectedCalendarToEvent(record: AirtableConnectedCalendarRecord): IEvent {
  // Defensive null checks for malformed records
  if (!record) {
    throw new Error('Cannot transform null or undefined record');
  }

  if (!record.id) {
    throw new Error('Record missing required id field');
  }

  const fields = record.fields;
  if (!fields) {
    throw new Error(`Record ${record.id} missing fields object`);
  }

  // Validate required fields
  if (!fields.start || !fields.title) {
    throw new Error(`Record ${record.id} missing required fields (start, title)`);
  }

  return {
    id: record.id,
    startDate: fields.start,
    endDate: fields.end || fields.start, // Default to start if end is missing
    title: fields.title,
    color: 'blue',  // Default for Google Calendar events
    description: fields.description || '',
    allDay: fields.all_day ?? false,
    location: fields.location ?? undefined,
    googleEventId: fields.event_id ?? undefined,
    googleCalendarLink: fields.event_link ?? undefined,
    user: {
      id: 'google',
      name: fields.creator || 'Ozean Licht',
      picturePath: null,
    },
    source: 'connected_calendar',
  };
}

/**
 * Transform Airtable events record to IEvent
 * @param record - Raw Airtable record from events table
 * @returns Normalized IEvent object
 * @throws Error if record or required fields are missing/malformed
 */
export function transformEventsToEvent(record: AirtableEventsRecord): IEvent {
  // Defensive null checks for malformed records
  if (!record) {
    throw new Error('Cannot transform null or undefined record');
  }

  if (!record.id) {
    throw new Error('Record missing required id field');
  }

  const fields = record.fields;
  if (!fields) {
    throw new Error(`Record ${record.id} missing fields object`);
  }

  // Validate required fields
  if (!fields.start || !fields.title) {
    throw new Error(`Record ${record.id} missing required fields (start, title)`);
  }

  return {
    id: record.id,
    startDate: fields.start,
    endDate: fields.end || fields.start, // Default to start if end is missing
    title: fields.title,
    color: mapEventTypeToColor(fields.type),
    description: fields.description || '',
    location: fields.location ?? undefined,
    googleEventId: fields.google_event_id ?? undefined,
    user: {
      id: fields.created_by?.id || 'team',
      name: fields.created_by?.name || 'Ozean Licht Team',
      picturePath: null,
    },
    source: 'events',
  };
}
