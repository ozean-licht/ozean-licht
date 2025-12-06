/**
 * Calendar Events API Route
 * GET /api/calendar/events
 *
 * Fetches events from Airtable via MCP Gateway
 * Supports filtering by date range, source, and event type
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { z } from 'zod';
import {
  type IEvent,
  type AirtableConnectedCalendarRecord,
  type AirtableEventsRecord,
  transformConnectedCalendarToEvent,
  transformEventsToEvent,
} from '@/components/calendar/types';

// MCP Gateway URL
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';

// Zod schema for query parameter validation
const queryParamsSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  source: z.enum(['connected_calendar', 'events', 'all']).optional(),
  eventType: z.enum([
    'Kurs',
    'Video',
    'Short',
    'Post',
    'Blog',
    'Love Letter',
    'Kongress',
    'Interview',
    'Live Event',
    'Youtube Live',
    'Sonstiges'
  ]).optional(),
});

interface AirtableResponse {
  success: boolean;
  data?: {
    records: Array<AirtableConnectedCalendarRecord | AirtableEventsRecord>;
    offset?: string;
  };
  error?: string;
}

/**
 * Fetch records from Airtable via MCP Gateway
 */
async function fetchAirtableRecords(
  tableName: string,
  filterFormula?: string,
  maxRecords: number = 100
): Promise<Array<AirtableConnectedCalendarRecord | AirtableEventsRecord>> {
  try {
    const response = await fetch(`${MCP_GATEWAY_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: 'airtable',
        operation: 'read-records',
        args: {
          tableName,
          maxRecords,
          ...(filterFormula && { filterByFormula: filterFormula }),
        },
      }),
    });

    if (!response.ok) {
      console.error(`Airtable fetch failed for ${tableName}: ${response.statusText}`);
      return [];
    }

    const result: AirtableResponse = await response.json();

    if (!result.success || !result.data?.records) {
      console.error(`Airtable response error for ${tableName}:`, result.error);
      return [];
    }

    return result.data.records;
  } catch (error) {
    console.error(`Error fetching from Airtable (${tableName}):`, error);
    return [];
  }
}

/**
 * Sanitize date string for Airtable filter formula
 * Validates ISO date format and prevents injection attacks
 */
function sanitizeDateString(dateStr: string): string {
  // Date is already validated by Zod schema as ISO datetime
  // Just ensure it's properly escaped for Airtable formula
  // Remove any potential injection characters (single quotes, parentheses, etc.)
  return dateStr.replace(/['"\\]/g, '');
}

/**
 * Build Airtable filter formula for date range
 * Uses sanitized date strings to prevent injection attacks
 */
function buildDateFilter(start?: string, end?: string): string | undefined {
  if (!start && !end) return undefined;

  const filters: string[] = [];

  if (start) {
    const sanitizedStart = sanitizeDateString(start);
    // Events that end after the start date
    filters.push(`IS_AFTER({end}, '${sanitizedStart}')`);
  }

  if (end) {
    const sanitizedEnd = sanitizeDateString(end);
    // Events that start before the end date
    filters.push(`IS_BEFORE({start}, '${sanitizedEnd}')`);
  }

  if (filters.length === 0) return undefined;
  if (filters.length === 1) return filters[0];

  return `AND(${filters.join(', ')})`;
}

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Parse and validate query parameters
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    start: searchParams.get('start') ?? undefined,
    end: searchParams.get('end') ?? undefined,
    source: searchParams.get('source') ?? undefined,
    eventType: searchParams.get('eventType') ?? undefined,
  };

  // Validate query parameters with Zod
  const validation = queryParamsSchema.safeParse(rawParams);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: validation.error.format(),
      },
      { status: 400 }
    );
  }

  const { start, end, source, eventType } = validation.data;

  try {
    const events: IEvent[] = [];
    const dateFilter = buildDateFilter(start ?? undefined, end ?? undefined);

    // Fetch from connected_calendar (Google Calendar sync)
    if (!source || source === 'all' || source === 'connected_calendar') {
      const connectedCalendarRecords = await fetchAirtableRecords(
        'connected_calendar',
        dateFilter,
        100
      ) as AirtableConnectedCalendarRecord[];

      const transformedConnectedEvents = connectedCalendarRecords
        .filter(record => record?.fields?.start && record?.fields?.title)
        .map(record => {
          try {
            return transformConnectedCalendarToEvent(record);
          } catch (error) {
            console.error('Error transforming connected_calendar record:', error);
            return null;
          }
        })
        .filter((event): event is IEvent => event !== null);

      events.push(...transformedConnectedEvents);
    }

    // Fetch from events table (manual events)
    if (!source || source === 'all' || source === 'events') {
      let eventsFilter = dateFilter;

      // Add event type filter if specified (already validated by Zod)
      if (eventType) {
        // Event type is validated by Zod enum, safe to use directly
        const sanitizedEventType = eventType.replace(/['"\\]/g, '');
        const typeFilter = `{type} = '${sanitizedEventType}'`;
        eventsFilter = dateFilter
          ? `AND(${dateFilter}, ${typeFilter})`
          : typeFilter;
      }

      const eventsRecords = await fetchAirtableRecords(
        'events',
        eventsFilter,
        100
      ) as AirtableEventsRecord[];

      const transformedManualEvents = eventsRecords
        .filter(record => record?.fields?.start && record?.fields?.title)
        .map(record => {
          try {
            return transformEventsToEvent(record);
          } catch (error) {
            console.error('Error transforming events record:', error);
            return null;
          }
        })
        .filter((event): event is IEvent => event !== null);

      events.push(...transformedManualEvents);
    }

    // Sort events by start date
    events.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });

    // Create response with caching headers
    const response = NextResponse.json({
      events,
      total: events.length,
      hasMore: false, // Currently not paginating
    });

    // Cache for 1 minute
    response.headers.set('Cache-Control', 'private, max-age=60');

    return response;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch calendar events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
