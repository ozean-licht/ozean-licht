'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  CalendarEvent,
  getEventStatusColor,
  getEventTypeColor,
  formatEventDateRange,
} from '@/types/calendar';
import { Button, Badge } from '@/lib/ui';
import Link from 'next/link';
import {
  MoreHorizontal,
  Eye,
  MapPin,
  Monitor,
  Users,
  CalendarClock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Status badge styles based on color
const statusBadgeClass = (color: string): string => {
  const classes: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    teal: 'bg-teal-100 text-teal-800 border-teal-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return classes[color] || classes.gray;
};

// Event type badge styles based on color
const eventTypeBadgeClass = (color: string): string => {
  const classes: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    teal: 'bg-teal-100 text-teal-800 border-teal-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    pink: 'bg-pink-100 text-pink-800 border-pink-300',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };
  return classes[color] || classes.gray;
};

// Format event type for display
const formatEventType = (type: string): string => {
  const types: Record<string, string> = {
    workshop: 'Workshop',
    webinar: 'Webinar',
    course_session: 'Course Session',
    meeting: 'Meeting',
    deadline: 'Deadline',
    retreat: 'Retreat',
    meditation: 'Meditation',
    ceremony: 'Ceremony',
    conference: 'Conference',
    other: 'Other',
  };
  return types[type] || type;
};

// Format status for display
const formatStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    live: 'Live',
    completed: 'Completed',
    cancelled: 'Cancelled',
    postponed: 'Postponed',
  };
  return statuses[status] || status;
};

export const columns: ColumnDef<CalendarEvent>[] = [
  {
    accessorKey: 'title',
    header: 'Event',
    cell: ({ row }) => {
      const title = row.original.title;
      const eventType = row.original.eventType;
      const isFeatured = row.original.isFeatured;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{title}</span>
            {isFeatured && (
              <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-300">
                FEATURED
              </Badge>
            )}
          </div>
          {eventType && (
            <Badge
              variant="outline"
              className={`w-fit gap-1 ${eventTypeBadgeClass(getEventTypeColor(eventType))}`}
            >
              {formatEventType(eventType)}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'dateRange',
    header: 'Date & Time',
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      const allDay = row.original.allDay;

      return (
        <div className="flex items-start gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-sm">
            {formatEventDateRange(startTime, endTime, allDay)}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const color = getEventStatusColor(status);

      return (
        <Badge variant="outline" className={statusBadgeClass(color)}>
          {formatStatus(status)}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _id, value) => {
      if (value === 'all') return true;
      return row.original.status === value;
    },
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const isOnline = row.original.isOnline;
      const location = row.original.location;
      const venueName = row.original.venueName;

      if (isOnline) {
        return (
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">Online</span>
          </div>
        );
      }

      return (
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            {venueName && <span className="text-sm font-medium">{venueName}</span>}
            {location && (
              <span className="text-xs text-muted-foreground">{location}</span>
            )}
            {!venueName && !location && (
              <span className="text-sm text-muted-foreground">TBD</span>
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: 'attendees',
    header: 'Attendees',
    cell: ({ row }) => {
      const maxAttendees = row.original.maxAttendees;
      const currentAttendees = row.original.currentAttendees;
      const waitlistCount = row.original.waitlistCount;

      const isFull = maxAttendees ? currentAttendees >= maxAttendees : false;
      const percentage = maxAttendees
        ? Math.round((currentAttendees / maxAttendees) * 100)
        : 0;

      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {currentAttendees}
              {maxAttendees && ` / ${maxAttendees}`}
            </span>
            {maxAttendees && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs ${
                    isFull
                      ? 'text-red-600 font-medium'
                      : percentage >= 80
                      ? 'text-amber-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {percentage}%
                  {isFull && ' FULL'}
                </span>
                {waitlistCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{waitlistCount} waitlist
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/calendar/events/${event.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/calendar/events/${event.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/calendar/events/${event.id}/edit`}>
                  Edit Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/calendar/events/${event.id}/registrations`}>
                  Manage Registrations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(event.id)}
              >
                Copy Event ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/events/${event.id}`
                  )
                }
              >
                Copy Event URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
