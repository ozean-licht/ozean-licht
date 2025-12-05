/**
 * Team Channels Page
 *
 * Displays team channels view with channel creation capability
 */

'use client';

import MessagesPageClient from '../MessagesPageClient';
import ErrorBoundary from '@/components/messages/ErrorBoundary';

export default function ChannelsPage() {
  return (
    <ErrorBoundary>
      <MessagesPageClient typeFilter="team_channel" />
    </ErrorBoundary>
  );
}
