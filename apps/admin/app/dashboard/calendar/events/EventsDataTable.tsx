'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';
import { CalendarEvent } from '@/types/calendar';
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/ui';
import { Search, X, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import Link from 'next/link';

interface EventsDataTableProps {
  initialData: CalendarEvent[];
  total: number;
  limit: number;
  offset: number;
}

export function EventsDataTable({
  initialData,
  total,
  limit,
  offset,
}: EventsDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [eventTypeFilter, setEventTypeFilter] = useState(
    searchParams.get('eventType') || 'all'
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (eventTypeFilter !== 'all') params.set('eventType', eventTypeFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (offset > 0) params.set('offset', offset.toString());

    const newUrl = `/dashboard/calendar/events${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [debouncedSearch, eventTypeFilter, statusFilter, offset, router]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setEventTypeFilter('all');
    setStatusFilter('all');
    router.replace('/dashboard/calendar/events');
  };

  const hasFilters =
    search || eventTypeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="events-search"
              name="events-search"
              placeholder="Search by event title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Event Type Filter */}
          <Select
            value={eventTypeFilter}
            onValueChange={setEventTypeFilter}
            name="event-type-filter"
          >
            <SelectTrigger className="w-[180px]" id="event-type-filter">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="retreat">Retreat</SelectItem>
              <SelectItem value="meditation">Meditation</SelectItem>
              <SelectItem value="ceremony">Ceremony</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="course_session">Course Session</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            name="status-filter"
          >
            <SelectTrigger className="w-[140px]" id="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Add New Event Button */}
        <Button asChild>
          <Link href="/dashboard/calendar/events/new">
            <Plus className="h-4 w-4 mr-1" />
            Add New Event
          </Link>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={initialData}
        pagination="server"
        pageCount={Math.ceil(total / limit)}
        onPaginationChange={(page, pageSize) => {
          const params = new URLSearchParams(searchParams.toString());
          const newOffset = page * pageSize;
          if (newOffset > 0) {
            params.set('offset', newOffset.toString());
          } else {
            params.delete('offset');
          }
          router.replace(`/dashboard/calendar/events?${params.toString()}`);
        }}
        enableSorting
        enableGlobalFilter={false}
        enableExport
      />

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}{' '}
        events
      </div>
    </div>
  );
}
