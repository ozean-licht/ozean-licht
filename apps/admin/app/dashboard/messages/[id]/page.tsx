/**
 * Conversation Deep Link Page
 *
 * Opens a specific conversation by ID in the full messaging UI
 */

'use client';

import MessagesPageClient from '../MessagesPageClient';
import { use } from 'react';

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { id } = use(params);

  return <MessagesPageClient initialConversationId={id} />;
}
