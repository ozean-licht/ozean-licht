/**
 * Event Dialog Component
 * Modal dialog for displaying full event details using Radix UI Dialog primitives
 *
 * Features:
 * - Glass morphism design with backdrop blur
 * - Color-coded event indicator
 * - Full event details (date, time, location, description)
 * - Google Calendar integration link
 * - Smooth animations
 *
 * @module EventDialog
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Clock, User, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import type { IEvent } from './types';
import { eventColorClasses, formatDateRange } from './';
import { cn } from '@/lib/utils';

interface EventDialogProps {
  event: IEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * EventDialog - Modal dialog for viewing event details
 *
 * @param event - The event to display (null to hide dialog)
 * @param open - Whether the dialog is open
 * @param onOpenChange - Callback when open state changes
 */
export function EventDialog({ event, open, onOpenChange }: EventDialogProps) {
  if (!event) return null;

  const colorClasses = eventColorClasses[event.color];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay with backdrop blur */}
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

        {/* Dialog Content */}
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-[500px]",
            "translate-x-[-50%] translate-y-[-50%]",
            "bg-card/95 backdrop-blur-xl border border-primary/20",
            "rounded-lg shadow-lg",
            "p-6",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200"
          )}
        >
          {/* Color indicator bar */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1 rounded-t-lg",
              colorClasses.bg
            )}
          />

          {/* Close button */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4",
              "rounded-sm opacity-70 ring-offset-background",
              "transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none",
              "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Schließen</span>
          </Dialog.Close>

          {/* Content */}
          <div className="space-y-4 mt-2">
            {/* Title */}
            <Dialog.Title className="text-xl font-medium leading-none tracking-tight">
              {event.title}
            </Dialog.Title>

            {/* Date/Time */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                {formatDateRange(event.startDate, event.endDate, event.allDay)}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  {event.location}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="pt-2 border-t border-border/50">
                <Dialog.Description className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </Dialog.Description>
              </div>
            )}

            {/* Creator/User Info */}
            <div className="flex items-start gap-3 pt-2 border-t border-border/50">
              <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{event.user.name}</span>
                {event.source === 'connected_calendar' && (
                  <span className="ml-2 text-xs opacity-70">(Google Calendar)</span>
                )}
              </div>
            </div>

            {/* Google Calendar Link */}
            {event.googleCalendarLink && (
              <div className="pt-3">
                <a
                  href={event.googleCalendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2",
                    "text-sm text-primary",
                    "hover:underline",
                    "transition-all"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>In Google Calendar öffnen</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
