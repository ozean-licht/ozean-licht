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

// MCP Gateway URL - uses localhost for local dev, service name in Docker (http://mcp-gateway:8100)
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

// Zod schema for JSON-RPC 2.0 response validation
const mcpJsonRpcResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  result: z.object({
    status: z.string(),
    data: z.object({
      records: z.array(z.any()), // Records will be typed after extraction
      hasMore: z.boolean().optional(),
    }).optional(),
  }).optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
  }).optional(),
});

// Request ID counter for JSON-RPC correlation
let requestIdCounter = 0;

/**
 * Fetch records from Airtable via MCP Gateway using JSON-RPC 2.0
 * Validates response structure and correlates request/response IDs
 */
async function fetchAirtableRecords(
  tableName: string,
  filterFormula?: string,
  maxRecords: number = 100
): Promise<Array<AirtableConnectedCalendarRecord | AirtableEventsRecord>> {
  const requestId = ++requestIdCounter;

  try {
    const response = await fetch(`${MCP_GATEWAY_URL}/mcp/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: requestId,
        method: 'mcp.execute',
        params: {
          service: 'airtable',
          operation: 'read-records',
          args: {
            tableName,
            ...(filterFormula && { filter: filterFormula }),
          },
          options: {
            limit: maxRecords,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error(`[Calendar API] MCP Gateway HTTP error for ${tableName}: ${response.status} ${response.statusText}`);
      return [];
    }

    const rawResult = await response.json();

    // Validate JSON-RPC 2.0 response structure
    const parseResult = mcpJsonRpcResponseSchema.safeParse(rawResult);
    if (!parseResult.success) {
      console.error(`[Calendar API] Invalid JSON-RPC response for ${tableName}:`, parseResult.error.format());
      return [];
    }

    const result = parseResult.data;

    // Validate request/response ID correlation
    if (result.id !== requestId) {
      console.warn(`[Calendar API] Response ID mismatch for ${tableName}: expected ${requestId}, got ${result.id}`);
    }

    // Check for JSON-RPC error
    if (result.error) {
      console.error(`[Calendar API] MCP error for ${tableName}:`, result.error.message, `(code: ${result.error.code})`);
      return [];
    }

    // Validate records exist
    if (!result.result?.data?.records) {
      console.error(`[Calendar API] Missing records in response for ${tableName}`);
      return [];
    }

    return result.result.data.records;
  } catch (error) {
    console.error(`[Calendar API] Network error fetching ${tableName}:`, error instanceof Error ? error.message : 'Unknown error');
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
