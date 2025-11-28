/**
 * Calendar Query Operations - Events, Registrations, Recurrence
 * Part of Airtable MCP Migration
 */

import { MCPGatewayClient } from './client';
import {
  CalendarEvent,
  EventRegistration,
  EventRecurrence,
  CreateEventInput,
  UpdateEventInput,
  CreateRegistrationInput,
  UpdateRegistrationInput,
  CheckInInput,
  CreateRecurrenceInput,
  EventListOptions,
  RegistrationListOptions,
  EventListResult,
  RegistrationListResult,
  EventStats,
  RegistrationStats,
  VenueAddress,
} from '../../types/calendar';

// Database row types (snake_case)
interface EventRow {
  id: string;
  airtable_id: string | null;
  title: string;
  description: string | null;
  short_description: string | null;
  event_type: string | null;
  category: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
  timezone: string;
  location: string | null;
  venue_name: string | null;
  venue_address: Record<string, unknown> | null;
  is_online: boolean;
  meeting_url: string | null;
  meeting_provider: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  max_attendees: number | null;
  current_attendees: number;
  waitlist_enabled: boolean;
  waitlist_count: number;
  is_public: boolean;
  is_featured: boolean;
  requires_registration: boolean;
  registration_deadline: string | null;
  price_cents: number;
  currency: string;
  status: string;
  host_id: string | null;
  co_hosts: string[];
  thumbnail_url: string | null;
  cover_image_url: string | null;
  tags: string[];
  entity_scope: string | null;
  course_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  metadata: Record<string, unknown> | null;
  registration_count?: number;
  spots_available?: number;
  is_fully_booked?: boolean;
  has_recurrence?: boolean;
}

interface RegistrationRow {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  status: string;
  ticket_type: string;
  ticket_number: string | null;
  payment_status: string;
  amount_paid_cents: number;
  order_id: string | null;
  check_in_time: string | null;
  check_in_method: string | null;
  notes: string | null;
  dietary_requirements: string | null;
  special_requests: string | null;
  registered_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  reminder_sent: boolean;
  feedback_requested: boolean;
  metadata: Record<string, unknown> | null;
}

interface RecurrenceRow {
  id: string;
  event_id: string;
  recurrence_rule: string;
  recurrence_type: string;
  interval_value: number;
  days_of_week: number[];
  day_of_month: number | null;
  month_of_year: number | null;
  occurrence_count: number | null;
  until_date: string | null;
  exceptions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Calendar Queries Extension for MCPGatewayClient
 */
export class CalendarQueries {
  constructor(private client: MCPGatewayClient) {}

  // ============================================================================
  // Event Operations
  // ============================================================================

  /**
   * Get event by ID
   */
  async getEventById(id: string): Promise<CalendarEvent | null> {
    const sql = `
      SELECT e.id, e.airtable_id, e.title, e.description, e.short_description,
             e.event_type, e.category, e.start_time, e.end_time, e.all_day,
             e.timezone, e.location, e.venue_name, e.venue_address, e.is_online,
             e.meeting_url, e.meeting_provider, e.meeting_id, e.meeting_password,
             e.max_attendees, e.current_attendees, e.waitlist_enabled, e.waitlist_count,
             e.is_public, e.is_featured, e.requires_registration, e.registration_deadline,
             e.price_cents, e.currency, e.status, e.host_id, e.co_hosts,
             e.thumbnail_url, e.cover_image_url, e.tags, e.entity_scope, e.course_id,
             e.created_at, e.updated_at, e.published_at, e.metadata,
             (SELECT COUNT(*) FROM event_registrations r WHERE r.event_id = e.id) as registration_count,
             (SELECT COUNT(*) > 0 FROM event_recurrence rec WHERE rec.event_id = e.id) as has_recurrence
      FROM events e
      WHERE e.id = $1
    `;

    const rows = await this.client.query<EventRow>(sql, [id]);
    return rows.length > 0 ? this.mapEvent(rows[0]) : null;
  }

  /**
   * List events with filters and pagination
   */
  async listEvents(options: EventListOptions = {}): Promise<EventListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`e.entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.eventType) {
      conditions.push(`e.event_type = $${paramIndex++}`);
      params.push(options.eventType);
    }

    if (options.status) {
      conditions.push(`e.status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.hostId) {
      conditions.push(`e.host_id = $${paramIndex++}`);
      params.push(options.hostId);
    }

    if (options.courseId) {
      conditions.push(`e.course_id = $${paramIndex++}`);
      params.push(options.courseId);
    }

    if (options.isOnline !== undefined) {
      conditions.push(`e.is_online = $${paramIndex++}`);
      params.push(options.isOnline);
    }

    if (options.isPublic !== undefined) {
      conditions.push(`e.is_public = $${paramIndex++}`);
      params.push(options.isPublic);
    }

    if (options.isFeatured !== undefined) {
      conditions.push(`e.is_featured = $${paramIndex++}`);
      params.push(options.isFeatured);
    }

    if (options.startAfter) {
      conditions.push(`e.start_time >= $${paramIndex++}`);
      params.push(options.startAfter);
    }

    if (options.startBefore) {
      conditions.push(`e.start_time <= $${paramIndex++}`);
      params.push(options.startBefore);
    }

    if (options.search) {
      conditions.push(`(e.title ILIKE $${paramIndex} OR e.description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const EVENT_SORTABLE_COLUMNS: Record<string, string> = {
      start_time: 'start_time',
      end_time: 'end_time',
      created_at: 'created_at',
      updated_at: 'updated_at',
      title: 'title',
      status: 'status',
    };
    const orderBy = EVENT_SORTABLE_COLUMNS[options.orderBy || 'start_time'] || 'start_time';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM events e ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT e.id, e.airtable_id, e.title, e.description, e.short_description,
             e.event_type, e.category, e.start_time, e.end_time, e.all_day,
             e.timezone, e.location, e.venue_name, e.venue_address, e.is_online,
             e.meeting_url, e.meeting_provider, e.meeting_id, e.meeting_password,
             e.max_attendees, e.current_attendees, e.waitlist_enabled, e.waitlist_count,
             e.is_public, e.is_featured, e.requires_registration, e.registration_deadline,
             e.price_cents, e.currency, e.status, e.host_id, e.co_hosts,
             e.thumbnail_url, e.cover_image_url, e.tags, e.entity_scope, e.course_id,
             e.created_at, e.updated_at, e.published_at, e.metadata,
             (SELECT COUNT(*) FROM event_registrations r WHERE r.event_id = e.id) as registration_count,
             (SELECT COUNT(*) > 0 FROM event_recurrence rec WHERE rec.event_id = e.id) as has_recurrence
      FROM events e
      ${whereClause}
      ORDER BY e.${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<EventRow>(sql, params);

    return {
      data: rows.map(row => this.mapEvent(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Get events in a specific date range
   */
  async getEventsInDateRange(
    startDate: string,
    endDate: string,
    entityScope?: string
  ): Promise<CalendarEvent[]> {
    const conditions: string[] = [
      '(e.start_time >= $1 AND e.start_time <= $2) OR (e.end_time >= $1 AND e.end_time <= $2)',
    ];
    const params: (string | number)[] = [startDate, endDate];
    let paramIndex = 3;

    if (entityScope) {
      conditions.push(`e.entity_scope = $${paramIndex++}`);
      params.push(entityScope);
    }

    const sql = `
      SELECT e.id, e.airtable_id, e.title, e.description, e.short_description,
             e.event_type, e.category, e.start_time, e.end_time, e.all_day,
             e.timezone, e.location, e.venue_name, e.venue_address, e.is_online,
             e.meeting_url, e.meeting_provider, e.meeting_id, e.meeting_password,
             e.max_attendees, e.current_attendees, e.waitlist_enabled, e.waitlist_count,
             e.is_public, e.is_featured, e.requires_registration, e.registration_deadline,
             e.price_cents, e.currency, e.status, e.host_id, e.co_hosts,
             e.thumbnail_url, e.cover_image_url, e.tags, e.entity_scope, e.course_id,
             e.created_at, e.updated_at, e.published_at, e.metadata,
             (SELECT COUNT(*) FROM event_registrations r WHERE r.event_id = e.id) as registration_count,
             (SELECT COUNT(*) > 0 FROM event_recurrence rec WHERE rec.event_id = e.id) as has_recurrence
      FROM events e
      WHERE ${conditions.join(' AND ')}
      ORDER BY e.start_time ASC
    `;

    const rows = await this.client.query<EventRow>(sql, params);
    return rows.map(row => this.mapEvent(row));
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventInput): Promise<CalendarEvent> {
    const sql = `
      INSERT INTO events (
        title, description, short_description, event_type, category,
        start_time, end_time, all_day, timezone, location, venue_name, venue_address,
        is_online, meeting_url, meeting_provider, meeting_id, meeting_password,
        max_attendees, waitlist_enabled, is_public, is_featured, requires_registration,
        registration_deadline, price_cents, currency, status, host_id, co_hosts,
        thumbnail_url, cover_image_url, tags, entity_scope, course_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
              $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
      RETURNING id, airtable_id, title, description, short_description,
                event_type, category, start_time, end_time, all_day,
                timezone, location, venue_name, venue_address, is_online,
                meeting_url, meeting_provider, meeting_id, meeting_password,
                max_attendees, current_attendees, waitlist_enabled, waitlist_count,
                is_public, is_featured, requires_registration, registration_deadline,
                price_cents, currency, status, host_id, co_hosts,
                thumbnail_url, cover_image_url, tags, entity_scope, course_id,
                created_at, updated_at, published_at, metadata
    `;

    const rows = await this.client.query<EventRow>(sql, [
      data.title,
      data.description || null,
      data.shortDescription || null,
      data.eventType || null,
      data.category || null,
      data.startTime,
      data.endTime,
      data.allDay || false,
      data.timezone || 'Europe/Vienna',
      data.location || null,
      data.venueName || null,
      data.venueAddress ? JSON.stringify(data.venueAddress) : null,
      data.isOnline || false,
      data.meetingUrl || null,
      data.meetingProvider || null,
      data.meetingId || null,
      data.meetingPassword || null,
      data.maxAttendees || null,
      data.waitlistEnabled || false,
      data.isPublic !== undefined ? data.isPublic : true,
      data.isFeatured || false,
      data.requiresRegistration !== undefined ? data.requiresRegistration : true,
      data.registrationDeadline || null,
      data.priceCents || 0,
      data.currency || 'EUR',
      data.status || 'draft',
      data.hostId || null,
      JSON.stringify(data.coHosts || []),
      data.thumbnailUrl || null,
      data.coverImageUrl || null,
      JSON.stringify(data.tags || []),
      data.entityScope || null,
      data.courseId || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapEvent(rows[0]);
  }

  /**
   * Update an event
   */
  async updateEvent(id: string, data: UpdateEventInput): Promise<CalendarEvent> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateEventInput, string]> = [
      ['title', 'title'],
      ['description', 'description'],
      ['shortDescription', 'short_description'],
      ['eventType', 'event_type'],
      ['category', 'category'],
      ['startTime', 'start_time'],
      ['endTime', 'end_time'],
      ['allDay', 'all_day'],
      ['timezone', 'timezone'],
      ['location', 'location'],
      ['venueName', 'venue_name'],
      ['isOnline', 'is_online'],
      ['meetingUrl', 'meeting_url'],
      ['meetingProvider', 'meeting_provider'],
      ['meetingId', 'meeting_id'],
      ['meetingPassword', 'meeting_password'],
      ['maxAttendees', 'max_attendees'],
      ['waitlistEnabled', 'waitlist_enabled'],
      ['isPublic', 'is_public'],
      ['isFeatured', 'is_featured'],
      ['requiresRegistration', 'requires_registration'],
      ['registrationDeadline', 'registration_deadline'],
      ['priceCents', 'price_cents'],
      ['currency', 'currency'],
      ['status', 'status'],
      ['hostId', 'host_id'],
      ['thumbnailUrl', 'thumbnail_url'],
      ['coverImageUrl', 'cover_image_url'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | boolean | null);
      }
    }

    if (data.venueAddress !== undefined) {
      updates.push(`venue_address = $${paramIndex++}`);
      params.push(JSON.stringify(data.venueAddress));
    }

    if (data.coHosts !== undefined) {
      updates.push(`co_hosts = $${paramIndex++}`);
      params.push(JSON.stringify(data.coHosts));
    }

    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      params.push(JSON.stringify(data.tags));
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    // Set published_at when status changes to scheduled
    if (data.status === 'scheduled') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE events
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, title, description, short_description,
                event_type, category, start_time, end_time, all_day,
                timezone, location, venue_name, venue_address, is_online,
                meeting_url, meeting_provider, meeting_id, meeting_password,
                max_attendees, current_attendees, waitlist_enabled, waitlist_count,
                is_public, is_featured, requires_registration, registration_deadline,
                price_cents, currency, status, host_id, co_hosts,
                thumbnail_url, cover_image_url, tags, entity_scope, course_id,
                created_at, updated_at, published_at, metadata
    `;

    const rows = await this.client.query<EventRow>(sql, params);
    return this.mapEvent(rows[0]);
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    await this.client.execute('DELETE FROM events WHERE id = $1', [id]);
  }

  /**
   * Get event statistics
   */
  async getEventStats(entityScope?: string): Promise<EventStats> {
    const scopeCondition = entityScope ? 'WHERE e.entity_scope = $1' : '';
    const params = entityScope ? [entityScope] : [];

    const sql = `
      SELECT
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE e.start_time > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE e.end_time < NOW()) as past_events,
        COUNT(*) FILTER (WHERE e.status = 'cancelled') as cancelled_events,
        (SELECT COUNT(*) FROM event_registrations r
         INNER JOIN events ev ON r.event_id = ev.id
         ${scopeCondition ? 'WHERE ev.entity_scope = $1' : ''}) as total_registrations,
        COALESCE(
          (SELECT AVG(
            CASE
              WHEN r.status = 'attended' THEN 1
              WHEN r.status IN ('registered', 'confirmed') AND ev.end_time < NOW() THEN 0
              ELSE NULL
            END
          )
          FROM event_registrations r
          INNER JOIN events ev ON r.event_id = ev.id
          ${scopeCondition ? 'WHERE ev.entity_scope = $1' : ''}
          ), 0
        ) * 100 as attendance_rate,
        COALESCE(
          (SELECT AVG(overall_rating)
           FROM event_feedback f
           INNER JOIN events ev ON f.event_id = ev.id
           ${scopeCondition ? 'WHERE ev.entity_scope = $1' : ''}
           ), 0
        ) as average_rating
      FROM events e
      ${scopeCondition}
    `;

    const rows = await this.client.query<{
      total_events: string;
      upcoming_events: string;
      past_events: string;
      cancelled_events: string;
      total_registrations: string;
      attendance_rate: string;
      average_rating: string;
    }>(sql, params);

    return {
      totalEvents: parseInt(rows[0].total_events, 10),
      upcomingEvents: parseInt(rows[0].upcoming_events, 10),
      pastEvents: parseInt(rows[0].past_events, 10),
      cancelledEvents: parseInt(rows[0].cancelled_events, 10),
      totalRegistrations: parseInt(rows[0].total_registrations, 10),
      attendanceRate: parseFloat(rows[0].attendance_rate),
      averageRating: parseFloat(rows[0].average_rating),
    };
  }

  // ============================================================================
  // Event Registration Operations
  // ============================================================================

  /**
   * List registrations with filters and pagination
   */
  async listRegistrations(options: RegistrationListOptions = {}): Promise<RegistrationListResult> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (options.eventId) {
      conditions.push(`event_id = $${paramIndex++}`);
      params.push(options.eventId);
    }

    if (options.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(options.userId);
    }

    if (options.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.paymentStatus) {
      conditions.push(`payment_status = $${paramIndex++}`);
      params.push(options.paymentStatus);
    }

    if (options.search) {
      conditions.push(`(guest_email ILIKE $${paramIndex} OR guest_name ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const REGISTRATION_SORTABLE_COLUMNS: Record<string, string> = {
      registered_at: 'registered_at',
      confirmed_at: 'confirmed_at',
      guest_name: 'guest_name',
      status: 'status',
    };
    const orderBy = REGISTRATION_SORTABLE_COLUMNS[options.orderBy || 'registered_at'] || 'registered_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM event_registrations ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, event_id, user_id, guest_email, guest_name, status,
             ticket_type, ticket_number, payment_status, amount_paid_cents, order_id,
             check_in_time, check_in_method, notes, dietary_requirements, special_requests,
             registered_at, confirmed_at, cancelled_at, reminder_sent, feedback_requested, metadata
      FROM event_registrations
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<RegistrationRow>(sql, params);

    return {
      data: rows.map(row => this.mapRegistration(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new registration
   */
  async createRegistration(data: CreateRegistrationInput): Promise<EventRegistration> {
    const sql = `
      INSERT INTO event_registrations (
        event_id, user_id, guest_email, guest_name, status, ticket_type,
        payment_status, amount_paid_cents, order_id, notes,
        dietary_requirements, special_requests, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, event_id, user_id, guest_email, guest_name, status,
                ticket_type, ticket_number, payment_status, amount_paid_cents, order_id,
                check_in_time, check_in_method, notes, dietary_requirements, special_requests,
                registered_at, confirmed_at, cancelled_at, reminder_sent, feedback_requested, metadata
    `;

    const rows = await this.client.query<RegistrationRow>(sql, [
      data.eventId,
      data.userId || null,
      data.guestEmail || null,
      data.guestName || null,
      data.status || 'registered',
      data.ticketType || 'standard',
      data.paymentStatus || 'pending',
      data.amountPaidCents || 0,
      data.orderId || null,
      data.notes || null,
      data.dietaryRequirements || null,
      data.specialRequests || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapRegistration(rows[0]);
  }

  /**
   * Update a registration
   */
  async updateRegistration(id: string, data: UpdateRegistrationInput): Promise<EventRegistration> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateRegistrationInput, string]> = [
      ['status', 'status'],
      ['ticketType', 'ticket_type'],
      ['paymentStatus', 'payment_status'],
      ['amountPaidCents', 'amount_paid_cents'],
      ['notes', 'notes'],
      ['dietaryRequirements', 'dietary_requirements'],
      ['specialRequests', 'special_requests'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | null);
      }
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    // Set confirmed_at when status changes to confirmed
    if (data.status === 'confirmed') {
      updates.push(`confirmed_at = COALESCE(confirmed_at, NOW())`);
    }

    // Set cancelled_at when status changes to cancelled
    if (data.status === 'cancelled') {
      updates.push(`cancelled_at = COALESCE(cancelled_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE event_registrations
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, event_id, user_id, guest_email, guest_name, status,
                ticket_type, ticket_number, payment_status, amount_paid_cents, order_id,
                check_in_time, check_in_method, notes, dietary_requirements, special_requests,
                registered_at, confirmed_at, cancelled_at, reminder_sent, feedback_requested, metadata
    `;

    const rows = await this.client.query<RegistrationRow>(sql, params);
    return this.mapRegistration(rows[0]);
  }

  /**
   * Check in a registration
   */
  async checkInRegistration(data: CheckInInput): Promise<EventRegistration> {
    const sql = `
      UPDATE event_registrations
      SET status = 'attended',
          check_in_time = NOW(),
          check_in_method = $1
      WHERE id = $2
      RETURNING id, event_id, user_id, guest_email, guest_name, status,
                ticket_type, ticket_number, payment_status, amount_paid_cents, order_id,
                check_in_time, check_in_method, notes, dietary_requirements, special_requests,
                registered_at, confirmed_at, cancelled_at, reminder_sent, feedback_requested, metadata
    `;

    const rows = await this.client.query<RegistrationRow>(sql, [
      data.checkInMethod || 'manual',
      data.registrationId,
    ]);

    return this.mapRegistration(rows[0]);
  }

  /**
   * Get registration statistics for an event
   */
  async getRegistrationStats(eventId: string): Promise<RegistrationStats> {
    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'attended') as attended,
        COUNT(*) FILTER (WHERE status = 'no_show') as no_show,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted,
        COALESCE(SUM(amount_paid_cents), 0) as revenue
      FROM event_registrations
      WHERE event_id = $1
    `;

    const rows = await this.client.query<{
      total: string;
      confirmed: string;
      attended: string;
      no_show: string;
      cancelled: string;
      waitlisted: string;
      revenue: string;
    }>(sql, [eventId]);

    return {
      total: parseInt(rows[0].total, 10),
      confirmed: parseInt(rows[0].confirmed, 10),
      attended: parseInt(rows[0].attended, 10),
      noShow: parseInt(rows[0].no_show, 10),
      cancelled: parseInt(rows[0].cancelled, 10),
      waitlisted: parseInt(rows[0].waitlisted, 10),
      revenue: parseInt(rows[0].revenue, 10),
    };
  }

  // ============================================================================
  // Event Recurrence Operations
  // ============================================================================

  /**
   * Get recurrence pattern for an event
   */
  async getEventRecurrence(eventId: string): Promise<EventRecurrence | null> {
    const sql = `
      SELECT id, event_id, recurrence_rule, recurrence_type, interval_value,
             days_of_week, day_of_month, month_of_year, occurrence_count,
             until_date, exceptions, created_at, updated_at
      FROM event_recurrence
      WHERE event_id = $1
    `;

    const rows = await this.client.query<RecurrenceRow>(sql, [eventId]);
    return rows.length > 0 ? this.mapRecurrence(rows[0]) : null;
  }

  /**
   * Create a recurrence pattern
   */
  async createRecurrence(data: CreateRecurrenceInput): Promise<EventRecurrence> {
    const sql = `
      INSERT INTO event_recurrence (
        event_id, recurrence_rule, recurrence_type, interval_value,
        days_of_week, day_of_month, month_of_year, occurrence_count, until_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, event_id, recurrence_rule, recurrence_type, interval_value,
                days_of_week, day_of_month, month_of_year, occurrence_count,
                until_date, exceptions, created_at, updated_at
    `;

    const rows = await this.client.query<RecurrenceRow>(sql, [
      data.eventId,
      data.recurrenceRule,
      data.recurrenceType,
      data.intervalValue || 1,
      JSON.stringify(data.daysOfWeek || []),
      data.dayOfMonth || null,
      data.monthOfYear || null,
      data.occurrenceCount || null,
      data.untilDate || null,
    ]);

    return this.mapRecurrence(rows[0]);
  }

  /**
   * Update a recurrence pattern
   */
  async updateRecurrence(id: string, data: Partial<CreateRecurrenceInput>): Promise<EventRecurrence> {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    if (data.recurrenceRule !== undefined) {
      updates.push(`recurrence_rule = $${paramIndex++}`);
      params.push(data.recurrenceRule);
    }

    if (data.recurrenceType !== undefined) {
      updates.push(`recurrence_type = $${paramIndex++}`);
      params.push(data.recurrenceType);
    }

    if (data.intervalValue !== undefined) {
      updates.push(`interval_value = $${paramIndex++}`);
      params.push(data.intervalValue);
    }

    if (data.daysOfWeek !== undefined) {
      updates.push(`days_of_week = $${paramIndex++}`);
      params.push(JSON.stringify(data.daysOfWeek));
    }

    if (data.dayOfMonth !== undefined) {
      updates.push(`day_of_month = $${paramIndex++}`);
      params.push(data.dayOfMonth);
    }

    if (data.monthOfYear !== undefined) {
      updates.push(`month_of_year = $${paramIndex++}`);
      params.push(data.monthOfYear);
    }

    if (data.occurrenceCount !== undefined) {
      updates.push(`occurrence_count = $${paramIndex++}`);
      params.push(data.occurrenceCount);
    }

    if (data.untilDate !== undefined) {
      updates.push(`until_date = $${paramIndex++}`);
      params.push(data.untilDate);
    }

    params.push(id);

    const sql = `
      UPDATE event_recurrence
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, event_id, recurrence_rule, recurrence_type, interval_value,
                days_of_week, day_of_month, month_of_year, occurrence_count,
                until_date, exceptions, created_at, updated_at
    `;

    const rows = await this.client.query<RecurrenceRow>(sql, params);
    return this.mapRecurrence(rows[0]);
  }

  /**
   * Delete a recurrence pattern
   */
  async deleteRecurrence(id: string): Promise<void> {
    await this.client.execute('DELETE FROM event_recurrence WHERE id = $1', [id]);
  }

  // ============================================================================
  // Mapping Functions
  // ============================================================================

  private mapEvent(row: EventRow): CalendarEvent {
    const spotsAvailable =
      row.max_attendees !== null ? Math.max(0, row.max_attendees - row.current_attendees) : null;
    const isFullyBooked = row.max_attendees !== null && row.current_attendees >= row.max_attendees;

    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      title: row.title,
      description: row.description || undefined,
      shortDescription: row.short_description || undefined,
      eventType: row.event_type as CalendarEvent['eventType'],
      category: row.category || undefined,
      startTime: row.start_time,
      endTime: row.end_time,
      allDay: row.all_day,
      timezone: row.timezone,
      location: row.location || undefined,
      venueName: row.venue_name || undefined,
      venueAddress: row.venue_address as VenueAddress | undefined,
      isOnline: row.is_online,
      meetingUrl: row.meeting_url || undefined,
      meetingProvider: row.meeting_provider || undefined,
      meetingId: row.meeting_id || undefined,
      meetingPassword: row.meeting_password || undefined,
      maxAttendees: row.max_attendees || undefined,
      currentAttendees: row.current_attendees,
      waitlistEnabled: row.waitlist_enabled,
      waitlistCount: row.waitlist_count,
      isPublic: row.is_public,
      isFeatured: row.is_featured,
      requiresRegistration: row.requires_registration,
      registrationDeadline: row.registration_deadline || undefined,
      priceCents: row.price_cents,
      currency: row.currency,
      status: row.status as CalendarEvent['status'],
      hostId: row.host_id || undefined,
      coHosts: row.co_hosts,
      thumbnailUrl: row.thumbnail_url || undefined,
      coverImageUrl: row.cover_image_url || undefined,
      tags: row.tags,
      entityScope: row.entity_scope as CalendarEvent['entityScope'],
      courseId: row.course_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at || undefined,
      metadata: row.metadata || undefined,
      registrationCount: row.registration_count,
      spotsAvailable: spotsAvailable !== null ? spotsAvailable : undefined,
      isFullyBooked,
      hasRecurrence: row.has_recurrence || false,
    };
  }

  private mapRegistration(row: RegistrationRow): EventRegistration {
    return {
      id: row.id,
      eventId: row.event_id,
      userId: row.user_id || undefined,
      guestEmail: row.guest_email || undefined,
      guestName: row.guest_name || undefined,
      status: row.status as EventRegistration['status'],
      ticketType: row.ticket_type,
      ticketNumber: row.ticket_number || undefined,
      paymentStatus: row.payment_status as EventRegistration['paymentStatus'],
      amountPaidCents: row.amount_paid_cents,
      orderId: row.order_id || undefined,
      checkInTime: row.check_in_time || undefined,
      checkInMethod: row.check_in_method || undefined,
      notes: row.notes || undefined,
      dietaryRequirements: row.dietary_requirements || undefined,
      specialRequests: row.special_requests || undefined,
      registeredAt: row.registered_at,
      confirmedAt: row.confirmed_at || undefined,
      cancelledAt: row.cancelled_at || undefined,
      reminderSent: row.reminder_sent,
      feedbackRequested: row.feedback_requested,
      metadata: row.metadata || undefined,
    };
  }

  private mapRecurrence(row: RecurrenceRow): EventRecurrence {
    return {
      id: row.id,
      eventId: row.event_id,
      recurrenceRule: row.recurrence_rule,
      recurrenceType: row.recurrence_type as EventRecurrence['recurrenceType'],
      intervalValue: row.interval_value,
      daysOfWeek: row.days_of_week,
      dayOfMonth: row.day_of_month || undefined,
      monthOfYear: row.month_of_year || undefined,
      occurrenceCount: row.occurrence_count || undefined,
      untilDate: row.until_date || undefined,
      exceptions: row.exceptions,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
