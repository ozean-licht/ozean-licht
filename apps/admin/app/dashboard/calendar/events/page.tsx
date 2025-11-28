/**
 * Events List Page
 *
 * Event list for calendar management.
 * Server component that fetches data and passes to client data table.
 */

import { Metadata } from 'next';
import { requireAnyRole } from '@/lib/rbac/utils';
import { EventsDataTable } from './EventsDataTable';
import { CalendarEvent, EventType, EventStatus } from '@/types/calendar';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/admin/data-table-skeleton';

export const metadata: Metadata = {
  title: 'Events | Admin Dashboard',
  description: 'Manage calendar events for Ozean Licht platform',
};

// Mock events data
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Sacred Geometry Workshop',
    description: 'Deep dive into the mathematics of consciousness',
    shortDescription: 'Explore sacred geometry patterns',
    eventType: 'workshop',
    startTime: '2025-12-05T14:00:00Z',
    endTime: '2025-12-05T17:00:00Z',
    allDay: false,
    timezone: 'Europe/Vienna',
    location: 'Vienna, Austria',
    venueName: 'Lichthaus Vienna',
    isOnline: false,
    maxAttendees: 30,
    currentAttendees: 18,
    waitlistEnabled: true,
    waitlistCount: 5,
    isPublic: true,
    isFeatured: true,
    requiresRegistration: true,
    priceCents: 8900,
    currency: 'EUR',
    status: 'scheduled',
    hostId: 'host-1',
    coHosts: [],
    tags: ['sacred-geometry', 'consciousness', 'mathematics'],
    entityScope: 'ozean_licht',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-11-20T15:30:00Z',
    publishedAt: '2025-11-16T09:00:00Z',
  },
  {
    id: '2',
    title: 'Online Meditation Circle',
    description: 'Weekly guided meditation session',
    shortDescription: 'Connect through meditation',
    eventType: 'meditation',
    startTime: '2025-12-01T18:00:00Z',
    endTime: '2025-12-01T19:30:00Z',
    allDay: false,
    timezone: 'Europe/Vienna',
    isOnline: true,
    meetingUrl: 'https://zoom.us/j/123456789',
    meetingProvider: 'Zoom',
    maxAttendees: 50,
    currentAttendees: 45,
    waitlistEnabled: true,
    waitlistCount: 8,
    isPublic: true,
    isFeatured: false,
    requiresRegistration: true,
    priceCents: 0,
    currency: 'EUR',
    status: 'live',
    hostId: 'host-2',
    coHosts: ['host-3'],
    tags: ['meditation', 'online', 'weekly'],
    entityScope: 'ozean_licht',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-11-28T12:00:00Z',
    publishedAt: '2025-10-02T08:00:00Z',
  },
  {
    id: '3',
    title: 'New Year Retreat 2026',
    description: 'Transform into the new year with consciousness and intention',
    shortDescription: '7-day transformational retreat',
    eventType: 'retreat',
    startTime: '2025-12-28T15:00:00Z',
    endTime: '2026-01-04T12:00:00Z',
    allDay: false,
    timezone: 'Europe/Vienna',
    location: 'Austrian Alps',
    venueName: 'Mountain Light Center',
    isOnline: false,
    maxAttendees: 20,
    currentAttendees: 20,
    waitlistEnabled: true,
    waitlistCount: 12,
    isPublic: true,
    isFeatured: true,
    requiresRegistration: true,
    registrationDeadline: '2025-12-15T23:59:59Z',
    priceCents: 189000,
    currency: 'EUR',
    status: 'scheduled',
    hostId: 'host-1',
    coHosts: ['host-2', 'host-4'],
    tags: ['retreat', 'new-year', 'transformation', 'alps'],
    entityScope: 'ozean_licht',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-11-25T16:45:00Z',
    publishedAt: '2025-09-15T10:00:00Z',
  },
  {
    id: '4',
    title: 'Introduction to Energy Healing - Webinar',
    description: 'Learn the fundamentals of energy healing practices',
    shortDescription: 'Beginner-friendly energy healing intro',
    eventType: 'webinar',
    startTime: '2025-12-10T19:00:00Z',
    endTime: '2025-12-10T21:00:00Z',
    allDay: false,
    timezone: 'Europe/Vienna',
    isOnline: true,
    meetingUrl: 'https://meet.ozean-licht.com/energy-healing-intro',
    meetingProvider: 'Custom',
    maxAttendees: 100,
    currentAttendees: 67,
    waitlistEnabled: false,
    waitlistCount: 0,
    isPublic: true,
    isFeatured: true,
    requiresRegistration: true,
    priceCents: 2500,
    currency: 'EUR',
    status: 'scheduled',
    hostId: 'host-4',
    coHosts: [],
    tags: ['webinar', 'energy-healing', 'beginner'],
    entityScope: 'ozean_licht',
    createdAt: '2025-11-10T09:00:00Z',
    updatedAt: '2025-11-27T14:20:00Z',
    publishedAt: '2025-11-11T10:00:00Z',
  },
  {
    id: '5',
    title: 'Full Moon Ceremony - December',
    description: 'Celebrate the power of the full moon with ritual and intention',
    shortDescription: 'December full moon gathering',
    eventType: 'ceremony',
    startTime: '2025-12-15T20:00:00Z',
    endTime: '2025-12-15T22:30:00Z',
    allDay: false,
    timezone: 'Europe/Vienna',
    location: 'Vienna, Austria',
    venueName: 'Sacred Circle Space',
    isOnline: false,
    maxAttendees: 25,
    currentAttendees: 12,
    waitlistEnabled: false,
    waitlistCount: 0,
    isPublic: true,
    isFeatured: false,
    requiresRegistration: true,
    priceCents: 3500,
    currency: 'EUR',
    status: 'draft',
    hostId: 'host-2',
    coHosts: ['host-5'],
    tags: ['ceremony', 'full-moon', 'ritual'],
    entityScope: 'ozean_licht',
    createdAt: '2025-11-20T11:30:00Z',
    updatedAt: '2025-11-27T09:15:00Z',
  },
];

interface EventsPageProps {
  searchParams: {
    search?: string;
    eventType?: string;
    status?: string;
    offset?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  // Require admin role (super_admin, ol_admin, or ol_content)
  await requireAnyRole(['super_admin', 'ol_admin', 'ol_content']);

  // Parse search params into filters
  // Treat 'all' as undefined (no filter)
  const eventTypeParam = searchParams.eventType;
  const statusParam = searchParams.status;

  const filters = {
    search: searchParams.search,
    eventType: eventTypeParam && eventTypeParam !== 'all' ? eventTypeParam as EventType : undefined,
    status: statusParam && statusParam !== 'all' ? statusParam as EventStatus : undefined,
    offset: searchParams.offset ? parseInt(searchParams.offset, 10) : 0,
    limit: 50,
  };

  // Apply filters to mock data
  let filteredEvents = [...MOCK_EVENTS];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.description?.toLowerCase().includes(search) ||
        e.location?.toLowerCase().includes(search)
    );
  }

  if (filters.eventType) {
    filteredEvents = filteredEvents.filter((e) => e.eventType === filters.eventType);
  }

  if (filters.status) {
    filteredEvents = filteredEvents.filter((e) => e.status === filters.status);
  }

  const events = filteredEvents;
  const total = filteredEvents.length;
  const limit = filters.limit;
  const offset = filters.offset;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Manage calendar events and registrations
        </p>
      </div>

      {/* Data Table */}
      <Suspense fallback={<DataTableSkeleton columns={6} rows={10} />}>
        <EventsDataTable
          initialData={events}
          total={total}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </div>
  );
}
