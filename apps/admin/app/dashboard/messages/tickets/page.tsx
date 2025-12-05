/**
 * Internal Tickets Page
 *
 * Displays internal tickets view for bug tracking, feature requests, and tasks
 */

'use client';

import MessagesPageClient from '../MessagesPageClient';
import ErrorBoundary from '@/components/messages/ErrorBoundary';

export default function InternalTicketsPage() {
  return (
    <ErrorBoundary>
      <MessagesPageClient typeFilter="internal_ticket" />
    </ErrorBoundary>
  );
}
