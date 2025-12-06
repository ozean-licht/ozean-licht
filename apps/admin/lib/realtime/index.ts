/**
 * Realtime Communication Module
 *
 * Provides WebSocket-based realtime communication via Pusher/Soketi
 * for the admin dashboard.
 *
 * Client-side: Use getPusherClient() in browser components
 * Server-side: Use triggerEvent() in API routes
 */

// Client-side exports (browser only)
export {
  getPusherClient,
  disconnectPusher,
  getPusherConnectionState,
  isPusherConnected,
} from './pusher-client';

// Server-side exports (API routes only)
export type { BatchEvent, TriggerResult } from './pusher-server';
export {
  triggerEvent,
  triggerBatch,
  authenticateChannel,
} from './pusher-server';

// Channel helpers and types
export * from './channels';
