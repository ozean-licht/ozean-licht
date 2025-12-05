/**
 * Messages Home Page
 *
 * Redirects to the default channels view
 */

import { redirect } from 'next/navigation';

export default function MessagesPage() {
  redirect('/dashboard/messages/channels');
}
