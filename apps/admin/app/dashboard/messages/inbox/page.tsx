/**
 * Unified Inbox Page
 *
 * Shows all conversation types (support, channels, DMs, internal tickets)
 * with filter tabs to switch between types.
 */

import MessagesPageClient from '../MessagesPageClient';

export default function UnifiedInboxPage() {
  return <MessagesPageClient showUnifiedInbox={true} />;
}
