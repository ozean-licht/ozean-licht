/**
 * Pusher/Soketi Client for Browser (Client-Side Only)
 *
 * Singleton Pusher client for realtime WebSocket communication with Soketi.
 * Used for private/presence channels and realtime updates in the admin dashboard.
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_SOKETI_APP_KEY: Application key for Soketi authentication
 * - NEXT_PUBLIC_SOKETI_HOST: WebSocket host (default: realtime.ozean-licht.dev)
 * - NEXT_PUBLIC_SOKETI_PORT: WebSocket port (default: 443)
 * - NEXT_PUBLIC_SOKETI_USE_TLS: Enable TLS/WSS (default: true)
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { getPusherClient } from '@/lib/realtime/pusher-client';
 * import { useEffect } from 'react';
 *
 * export function RealtimeComponent() {
 *   useEffect(() => {
 *     const pusher = getPusherClient();
 *     const channel = pusher.subscribe('private-user-123');
 *
 *     channel.bind('notification', (data) => {
 *       console.log('Received notification:', data);
 *     });
 *
 *     return () => {
 *       channel.unbind_all();
 *       channel.unsubscribe();
 *     };
 *   }, []);
 * }
 * ```
 */

'use client';

import Pusher from 'pusher-js';

// Singleton instance
let pusherClient: Pusher | null = null;

/**
 * Get or create the singleton Pusher client instance
 *
 * This client is configured for browser-side use only and connects to Soketi
 * for realtime WebSocket communication. It automatically handles authentication
 * for private and presence channels via the /api/realtime/auth endpoint.
 *
 * @returns {Pusher} The Pusher client instance
 * @throws {Error} If required environment variables are missing
 */
export function getPusherClient(): Pusher {
  // Only create client in browser environment
  if (!pusherClient && typeof window !== 'undefined') {
    // Validate required environment variables
    const appKey = process.env.NEXT_PUBLIC_SOKETI_APP_KEY;
    if (!appKey) {
      throw new Error(
        'NEXT_PUBLIC_SOKETI_APP_KEY is required for Pusher client initialization'
      );
    }

    // Get configuration from environment with sensible defaults
    const host = process.env.NEXT_PUBLIC_SOKETI_HOST || 'realtime.ozean-licht.dev';
    const port = parseInt(process.env.NEXT_PUBLIC_SOKETI_PORT || '443');
    const useTLS = process.env.NEXT_PUBLIC_SOKETI_USE_TLS !== 'false';

    // Initialize Pusher client with Soketi configuration
    pusherClient = new Pusher(appKey, {
      // WebSocket host configuration
      wsHost: host,
      wsPort: useTLS ? port : 80,
      wssPort: port,

      // Force TLS/WSS for secure connections
      forceTLS: useTLS,

      // Enable both ws and wss transports
      enabledTransports: ['ws', 'wss'],

      // Authentication endpoint for private/presence channels
      authEndpoint: '/api/realtime/auth',

      // Required by Pusher but not used with custom host
      cluster: 'mt1',

      // Enable activity checks for connection health monitoring
      enableStats: false,
      activityTimeout: 30000,
      pongTimeout: 10000,
    });

    // Connection health monitoring and telemetry
    pusherClient.connection.bind('state_change', (states: { previous: string; current: string }) => {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`[Pusher] Connection state: ${states.previous} → ${states.current}`);
      }

      // Track connection state transitions for monitoring
      trackConnectionState(states.previous, states.current);
    });

    pusherClient.connection.bind('error', (err: Error) => {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[Pusher] Connection error:', err);
      }

      // Track connection errors for monitoring
      trackConnectionError(err);
    });

    // Track successful connections for uptime monitoring
    pusherClient.connection.bind('connected', () => {
      trackConnectionSuccess();
    });

    // Track disconnections for monitoring
    pusherClient.connection.bind('disconnected', () => {
      trackDisconnection();
    });
  }

  if (!pusherClient) {
    throw new Error('Pusher client is not available (likely called on server-side)');
  }

  return pusherClient;
}

/**
 * Disconnect and cleanup the Pusher client
 *
 * Call this function when you need to explicitly disconnect the WebSocket
 * connection and clean up the singleton instance. Useful for cleanup in
 * component unmount or app shutdown scenarios.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   const pusher = getPusherClient();
 *   // ... use pusher
 *
 *   return () => {
 *     disconnectPusher();
 *   };
 * }, []);
 * ```
 */
export function disconnectPusher(): void {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[Pusher] Client disconnected and cleaned up');
    }
  }
}

/**
 * Get the current connection state of the Pusher client
 *
 * @returns {string | null} The current connection state or null if not initialized
 */
export function getPusherConnectionState(): string | null {
  return pusherClient?.connection.state || null;
}

/**
 * Check if the Pusher client is currently connected
 *
 * @returns {boolean} True if connected, false otherwise
 */
export function isPusherConnected(): boolean {
  return pusherClient?.connection.state === 'connected';
}

// ============================================================================
// Connection Health Telemetry
// ============================================================================

/**
 * Connection health statistics for monitoring
 */
interface ConnectionStats {
  totalConnections: number;
  totalDisconnections: number;
  totalErrors: number;
  lastConnectedAt: number | null;
  lastDisconnectedAt: number | null;
  lastErrorAt: number | null;
  stateTransitions: Array<{ from: string; to: string; timestamp: number }>;
}

// In-memory connection statistics
const connectionStats: ConnectionStats = {
  totalConnections: 0,
  totalDisconnections: 0,
  totalErrors: 0,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  lastErrorAt: null,
  stateTransitions: [],
};

// Maximum number of state transitions to keep in memory
const MAX_STATE_TRANSITIONS = 50;

/**
 * Track connection state changes
 * @internal
 */
function trackConnectionState(previousState: string, currentState: string): void {
  const timestamp = Date.now();

  // Record state transition
  connectionStats.stateTransitions.push({
    from: previousState,
    to: currentState,
    timestamp,
  });

  // Keep only the most recent transitions
  if (connectionStats.stateTransitions.length > MAX_STATE_TRANSITIONS) {
    connectionStats.stateTransitions.shift();
  }

  // Send to external monitoring service if available
  if (typeof window !== 'undefined' && (window as any).analytics?.track) {
    (window as any).analytics.track('pusher_state_change', {
      previous: previousState,
      current: currentState,
      timestamp,
    });
  }
}

/**
 * Track successful connections
 * @internal
 */
function trackConnectionSuccess(): void {
  const timestamp = Date.now();
  connectionStats.totalConnections++;
  connectionStats.lastConnectedAt = timestamp;

  // Send to external monitoring service if available
  if (typeof window !== 'undefined' && (window as any).analytics?.track) {
    (window as any).analytics.track('pusher_connected', {
      totalConnections: connectionStats.totalConnections,
      timestamp,
    });
  }
}

/**
 * Track disconnections
 * @internal
 */
function trackDisconnection(): void {
  const timestamp = Date.now();
  connectionStats.totalDisconnections++;
  connectionStats.lastDisconnectedAt = timestamp;

  // Calculate connection duration if we have a last connected timestamp
  const connectionDuration = connectionStats.lastConnectedAt
    ? timestamp - connectionStats.lastConnectedAt
    : null;

  // Send to external monitoring service if available
  if (typeof window !== 'undefined' && (window as any).analytics?.track) {
    (window as any).analytics.track('pusher_disconnected', {
      totalDisconnections: connectionStats.totalDisconnections,
      connectionDuration,
      timestamp,
    });
  }
}

/**
 * Track connection errors
 * @internal
 */
function trackConnectionError(error: Error): void {
  const timestamp = Date.now();
  connectionStats.totalErrors++;
  connectionStats.lastErrorAt = timestamp;

  // Send to external monitoring service if available
  if (typeof window !== 'undefined' && (window as any).analytics?.track) {
    (window as any).analytics.track('pusher_error', {
      error: error.message,
      totalErrors: connectionStats.totalErrors,
      timestamp,
    });
  }
}

/**
 * Get current connection health statistics
 * Useful for monitoring dashboards and debugging
 *
 * @returns {ConnectionStats} Current connection statistics
 *
 * @example
 * ```tsx
 * import { getConnectionStats } from '@/lib/realtime/pusher-client';
 *
 * function ConnectionHealthMonitor() {
 *   const stats = getConnectionStats();
 *
 *   return (
 *     <div>
 *       <p>Connections: {stats.totalConnections}</p>
 *       <p>Errors: {stats.totalErrors}</p>
 *       <p>Last Connected: {stats.lastConnectedAt ? new Date(stats.lastConnectedAt).toISOString() : 'Never'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function getConnectionStats(): Readonly<ConnectionStats> {
  return { ...connectionStats };
}

/**
 * Reset connection statistics
 * Useful for testing or after handling connection issues
 */
export function resetConnectionStats(): void {
  connectionStats.totalConnections = 0;
  connectionStats.totalDisconnections = 0;
  connectionStats.totalErrors = 0;
  connectionStats.lastConnectedAt = null;
  connectionStats.lastDisconnectedAt = null;
  connectionStats.lastErrorAt = null;
  connectionStats.stateTransitions = [];
}
