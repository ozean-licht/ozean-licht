/**
 * Calendar Types - Events, Registrations, Recurrence
 * Part of Airtable MCP Migration
 */

// Entity scope for multi-tenant support
export type CalendarEntityScope = 'ozean_licht' | 'kids_ascension';

// Event type
export type EventType =
  | 'workshop'
  | 'webinar'
  | 'course_session'
  | 'meeting'
  | 'deadline'
  | 'retreat'
  | 'meditation'
  | 'ceremony'
  | 'conference'
  | 'other';

// Event status
export type EventStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed';

// Registration status
export type RegistrationStatus =
  | 'pending'
  | 'registered'
  | 'confirmed'
  | 'attended'
  | 'no_show'
  | 'cancelled'
  | 'waitlisted'
  | 'refunded';

// Payment status
export type RegistrationPaymentStatus = 'pending' | 'paid' | 'refunded' | 'free';

// Recurrence type
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// Instance status
export type InstanceStatus = 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduled';

// Reminder type
export type ReminderType = 'email' | 'sms' | 'push' | 'webhook';

// Reminder status
export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

/**
 * Event entity
 */
export interface CalendarEvent {
  id: string;
  airtableId?: string;
  title: string;
  description?: string;
  shortDescription?: string;
  eventType?: EventType;
  category?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  timezone: string;
  location?: string;
  venueName?: string;
  venueAddress?: VenueAddress;
  isOnline: boolean;
  meetingUrl?: string;
  meetingProvider?: string;
  meetingId?: string;
  meetingPassword?: string;
  maxAttendees?: number;
  currentAttendees: number;
  waitlistEnabled: boolean;
  waitlistCount: number;
  isPublic: boolean;
  isFeatured: boolean;
  requiresRegistration: boolean;
  registrationDeadline?: string;
  priceCents: number;
  currency: string;
  status: EventStatus;
  hostId?: string;
  coHosts: string[];
  thumbnailUrl?: string;
  coverImageUrl?: string;
  tags: string[];
  entityScope?: CalendarEntityScope;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  host?: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };
  registrationCount?: number;
  spotsAvailable?: number;
  isFullyBooked?: boolean;
  hasRecurrence?: boolean;
}

/**
 * Venue address
 */
export interface VenueAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Event registration entity
 */
export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  status: RegistrationStatus;
  ticketType: string;
  ticketNumber?: string;
  paymentStatus: RegistrationPaymentStatus;
  amountPaidCents: number;
  orderId?: string;
  checkInTime?: string;
  checkInMethod?: string;
  notes?: string;
  dietaryRequirements?: string;
  specialRequests?: string;
  registeredAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  reminderSent: boolean;
  feedbackRequested: boolean;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  event?: CalendarEvent;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Event recurrence pattern
 */
export interface EventRecurrence {
  id: string;
  eventId: string;
  recurrenceRule: string;
  recurrenceType: RecurrenceType;
  intervalValue: number;
  daysOfWeek: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
  occurrenceCount?: number;
  untilDate?: string;
  exceptions: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Event instance (for recurring events)
 */
export interface EventInstance {
  id: string;
  parentEventId: string;
  instanceDate: string;
  startTime: string;
  endTime: string;
  status: InstanceStatus;
  isException: boolean;
  overrideData?: Record<string, unknown>;
  createdAt: string;
  // Computed/joined fields
  parentEvent?: CalendarEvent;
  registrationCount?: number;
}

/**
 * Event reminder
 */
export interface EventReminder {
  id: string;
  eventId: string;
  registrationId?: string;
  reminderType: ReminderType;
  scheduledTime: string;
  sentAt?: string;
  status: ReminderStatus;
  failureReason?: string;
  createdAt: string;
}

/**
 * Event feedback
 */
export interface EventFeedback {
  id: string;
  eventId: string;
  registrationId?: string;
  userId?: string;
  overallRating?: number;
  contentRating?: number;
  presenterRating?: number;
  venueRating?: number;
  wouldRecommend?: boolean;
  feedbackText?: string;
  improvementSuggestions?: string;
  isPublic: boolean;
  createdAt: string;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
  };
}

// Input types for CRUD operations

export interface CreateEventInput {
  title: string;
  description?: string;
  shortDescription?: string;
  eventType?: EventType;
  category?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  timezone?: string;
  location?: string;
  venueName?: string;
  venueAddress?: VenueAddress;
  isOnline?: boolean;
  meetingUrl?: string;
  meetingProvider?: string;
  meetingId?: string;
  meetingPassword?: string;
  maxAttendees?: number;
  waitlistEnabled?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  requiresRegistration?: boolean;
  registrationDeadline?: string;
  priceCents?: number;
  currency?: string;
  status?: EventStatus;
  hostId?: string;
  coHosts?: string[];
  thumbnailUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  entityScope?: CalendarEntityScope;
  courseId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  shortDescription?: string;
  eventType?: EventType;
  category?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  timezone?: string;
  location?: string;
  venueName?: string;
  venueAddress?: VenueAddress;
  isOnline?: boolean;
  meetingUrl?: string;
  meetingProvider?: string;
  meetingId?: string;
  meetingPassword?: string;
  maxAttendees?: number;
  waitlistEnabled?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  requiresRegistration?: boolean;
  registrationDeadline?: string;
  priceCents?: number;
  currency?: string;
  status?: EventStatus;
  hostId?: string;
  coHosts?: string[];
  thumbnailUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateRegistrationInput {
  eventId: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  status?: RegistrationStatus;
  ticketType?: string;
  paymentStatus?: RegistrationPaymentStatus;
  amountPaidCents?: number;
  orderId?: string;
  notes?: string;
  dietaryRequirements?: string;
  specialRequests?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateRegistrationInput {
  status?: RegistrationStatus;
  ticketType?: string;
  paymentStatus?: RegistrationPaymentStatus;
  amountPaidCents?: number;
  notes?: string;
  dietaryRequirements?: string;
  specialRequests?: string;
  metadata?: Record<string, unknown>;
}

export interface CheckInInput {
  registrationId: string;
  checkInMethod?: string;
}

export interface CreateRecurrenceInput {
  eventId: string;
  recurrenceRule: string;
  recurrenceType: RecurrenceType;
  intervalValue?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
  occurrenceCount?: number;
  untilDate?: string;
}

export interface CreateFeedbackInput {
  eventId: string;
  registrationId?: string;
  overallRating?: number;
  contentRating?: number;
  presenterRating?: number;
  venueRating?: number;
  wouldRecommend?: boolean;
  feedbackText?: string;
  improvementSuggestions?: string;
  isPublic?: boolean;
}

// List options

export interface EventListOptions {
  entityScope?: CalendarEntityScope;
  eventType?: EventType;
  status?: EventStatus;
  hostId?: string;
  courseId?: string;
  isOnline?: boolean;
  isPublic?: boolean;
  isFeatured?: boolean;
  startAfter?: string;
  startBefore?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface RegistrationListOptions {
  eventId?: string;
  userId?: string;
  status?: RegistrationStatus;
  paymentStatus?: RegistrationPaymentStatus;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface CalendarViewOptions {
  entityScope?: CalendarEntityScope;
  startDate: string;
  endDate: string;
  eventTypes?: EventType[];
  hostId?: string;
  includePrivate?: boolean;
}

export interface FeedbackListOptions {
  eventId: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
}

// Paginated results

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type EventListResult = PaginatedResult<CalendarEvent>;
export type RegistrationListResult = PaginatedResult<EventRegistration>;
export type FeedbackListResult = PaginatedResult<EventFeedback>;

// Calendar view types

export interface CalendarDay {
  date: string;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
}

export interface CalendarEventDisplay {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  eventType?: EventType;
  status: EventStatus;
  color: string;
  isMultiDay: boolean;
}

// Stats types

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  cancelledEvents: number;
  totalRegistrations: number;
  attendanceRate: number;
  averageRating: number;
}

export interface RegistrationStats {
  total: number;
  confirmed: number;
  attended: number;
  noShow: number;
  cancelled: number;
  waitlisted: number;
  revenue: number;
}

// Display helpers

export function getEventStatusColor(status: EventStatus): string {
  const colors: Record<EventStatus, string> = {
    draft: 'gray',
    scheduled: 'blue',
    live: 'green',
    completed: 'teal',
    cancelled: 'red',
    postponed: 'yellow',
  };
  return colors[status] || 'gray';
}

export function getEventTypeColor(type: EventType): string {
  const colors: Record<EventType, string> = {
    workshop: 'purple',
    webinar: 'blue',
    course_session: 'teal',
    meeting: 'gray',
    deadline: 'red',
    retreat: 'green',
    meditation: 'cyan',
    ceremony: 'pink',
    conference: 'indigo',
    other: 'gray',
  };
  return colors[type] || 'gray';
}

export function getRegistrationStatusColor(status: RegistrationStatus): string {
  const colors: Record<RegistrationStatus, string> = {
    pending: 'yellow',
    registered: 'blue',
    confirmed: 'green',
    attended: 'teal',
    no_show: 'red',
    cancelled: 'gray',
    waitlisted: 'orange',
    refunded: 'purple',
  };
  return colors[status] || 'gray';
}

export function formatEventDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

export function formatEventDateRange(startTime: string, endTime: string, allDay: boolean): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dateFormatter = new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const timeFormatter = new Intl.DateTimeFormat('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const startDate = dateFormatter.format(start);
  const endDate = dateFormatter.format(end);

  if (allDay) {
    if (startDate === endDate) return startDate;
    return `${startDate} - ${endDate}`;
  }

  const startTimeStr = timeFormatter.format(start);
  const endTimeStr = timeFormatter.format(end);

  if (startDate === endDate) {
    return `${startDate}, ${startTimeStr} - ${endTimeStr}`;
  }

  return `${startDate} ${startTimeStr} - ${endDate} ${endTimeStr}`;
}

export function isEventFull(event: CalendarEvent): boolean {
  if (!event.maxAttendees) return false;
  return event.currentAttendees >= event.maxAttendees;
}

export function getAvailableSpots(event: CalendarEvent): number | null {
  if (!event.maxAttendees) return null;
  return Math.max(0, event.maxAttendees - event.currentAttendees);
}
