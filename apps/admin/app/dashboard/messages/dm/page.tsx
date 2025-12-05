/**
 * Direct Messages Page
 *
 * Displays direct messages view with DM creation capability
 */

'use client';

import MessagesPageClient from '../MessagesPageClient';
import ErrorBoundary from '@/components/messages/ErrorBoundary';

export default function DirectMessagesPage() {
  return (
    <ErrorBoundary>
      <MessagesPageClient typeFilter="direct_message" />
    </ErrorBoundary>
  );
}
