/**
 * Pusher Server-Side Integration for Soketi
 *
 * Provides server-side Pusher client for triggering real-time events to connected clients.
 * Uses dedicated Soketi instance deployed via Coolify at realtime.ozean-licht.dev.
 *
 * Environment Variables:
 *   - SOKETI_APP_ID: Application ID (server-side only)
 *   - SOKETI_APP_KEY: Application key (server-side only)
 *   - SOKETI_APP_SECRET: Application secret (server-side only, for auth)
 *   - SOKETI_HOST: Soketi server host (default: realtime.ozean-licht.dev)
 *   - SOKETI_PORT: Soketi server port (default: 443)
 *   - SOKETI_USE_TLS: Enable TLS/SSL (default: true)
 *
 * Usage:
 *   import { triggerEvent, triggerBatch } from '@/lib/realtime/pusher-server';
 *
 *   // Trigger single event
 *   await triggerEvent('private-conversation-123', 'message_created', { message });
 *
 *   // Trigger batch events
 *   await triggerBatch([
 *     { channel: 'private-user-1', event: 'notification', data: { ... } },
 *     { channel: 'private-user-2', event: 'notification', data: { ... } },
 *   ]);
 *
 * Reference: specs/support-management-system.md (Phase 7)
 */

import Pusher from 'pusher';

type TriggerParams = {
  socket_id?: string;
};

/**
 * Convert ReadableStream to string
 * Helper for parsing Pusher API responses
 */
async function streamToString(stream: ReadableStream<any>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode(); // Flush any remaining bytes
  return result;
}

/**
 * Batch event configuration for triggering multiple events
 */
export interface BatchEvent {
  channel: string;
  event: string;
  data: unknown;
  socketId?: string;
}

/**
 * Pusher trigger result
 */
export interface TriggerResult {
  success: boolean;
  error?: string;
  channels?: string[];
}

/**
 * Get Pusher configuration from environment variables
 */
function getPusherConfig(): {
  appId: string;
  key: string;
  secret: string;
  host: string;
  port: string;
  useTLS: boolean;
} {
  const appId = process.env.SOKETI_APP_ID;
  const key = process.env.SOKETI_APP_KEY;
  const secret = process.env.SOKETI_APP_SECRET;

  if (!appId || !key || !secret) {
    throw new Error(
      'Missing Soketi configuration. Ensure SOKETI_APP_ID, SOKETI_APP_KEY, and SOKETI_APP_SECRET are set.'
    );
  }

  return {
    appId,
    key,
    secret,
    host: process.env.SOKETI_HOST || 'realtime.ozean-licht.dev',
    port: String(parseInt(process.env.SOKETI_PORT || '443', 10)),
    useTLS: process.env.SOKETI_USE_TLS !== 'false',
  };
}

/**
 * Initialize Pusher server client
 *
 * Singleton instance created lazily on first use
 */
let pusherInstance: Pusher | null = null;

function getPusherInstance(): Pusher {
  if (!pusherInstance) {
    const config = getPusherConfig();

    pusherInstance = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      host: config.host,
      port: config.port,
      useTLS: config.useTLS,
      // Additional configuration for production
      cluster: '', // Not used with self-hosted Soketi
      encrypted: config.useTLS,
    });

    // Log initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Pusher Server] Initialized connection to Soketi:', {
        host: config.host,
        port: config.port,
        useTLS: config.useTLS,
      });
    }
  }

  // TypeScript assertion - pusherInstance is guaranteed to be non-null here
  return pusherInstance as Pusher;
}

/**
 * Pusher server instance
 *
 * Use this for direct access to Pusher API methods
 */
export const pusherServer = getPusherInstance();

/**
 * Trigger a single event on a channel
 *
 * @param channel - Channel name (e.g., 'private-conversation-123')
 * @param event - Event name (e.g., 'message_created')
 * @param data - Event payload (will be JSON serialized)
 * @param socketId - Optional socket ID to exclude from receiving the event
 * @returns Promise resolving to trigger result
 *
 * @example
 * await triggerEvent('private-conversation-abc', 'message_created', {
 *   id: 'msg-123',
 *   content: 'Hello world',
 *   senderId: 'user-456',
 * });
 */
export async function triggerEvent(
  channel: string,
  event: string,
  data: unknown,
  socketId?: string
): Promise<TriggerResult> {
  try {
    const pusher = getPusherInstance();

    const params: TriggerParams = {
      socket_id: socketId,
    };

    await pusher.trigger(channel, event, data, params);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Pusher Server] Event triggered:', {
        channel,
        event,
        dataSize: JSON.stringify(data).length,
      });
    }

    return { success: true, channels: [channel] };
  } catch (error) {
    console.error('[Pusher Server] Failed to trigger event:', {
      channel,
      event,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Trigger multiple events in a single request (batch)
 *
 * More efficient than individual triggers when sending to multiple channels.
 * Maximum 10 events per batch (Pusher limitation).
 *
 * @param events - Array of batch events to trigger
 * @returns Promise resolving to trigger result
 *
 * @example
 * await triggerBatch([
 *   { channel: 'private-user-1', event: 'notification', data: { title: 'New message' } },
 *   { channel: 'private-user-2', event: 'notification', data: { title: 'New message' } },
 * ]);
 */
export async function triggerBatch(events: BatchEvent[]): Promise<TriggerResult> {
  try {
    if (events.length === 0) {
      return { success: true, channels: [] };
    }

    // Pusher batch limit is 10 events
    if (events.length > 10) {
      console.warn(
        '[Pusher Server] Batch size exceeds 10 events. Splitting into multiple batches.'
      );

      // Split into chunks of 10
      const chunks: BatchEvent[][] = [];
      for (let i = 0; i < events.length; i += 10) {
        chunks.push(events.slice(i, i + 10));
      }

      // Trigger each chunk
      const results = await Promise.all(chunks.map((chunk) => triggerBatch(chunk)));

      // Combine results
      const allChannels = results.flatMap((r) => r.channels || []);
      const hasError = results.some((r) => !r.success);

      return {
        success: !hasError,
        channels: allChannels,
        error: hasError ? 'Some batch chunks failed' : undefined,
      };
    }

    const pusher = getPusherInstance();

    // Convert to Pusher batch format
    const batch = events.map((e) => ({
      channel: e.channel,
      name: e.event,
      data: e.data,
      socket_id: e.socketId,
    }));

    await pusher.triggerBatch(batch);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Pusher Server] Batch triggered:', {
        eventCount: events.length,
        channels: events.map((e) => e.channel),
      });
    }

    return {
      success: true,
      channels: events.map((e) => e.channel),
    };
  } catch (error) {
    console.error('[Pusher Server] Failed to trigger batch:', {
      eventCount: events.length,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate authentication signature for private/presence channels
 *
 * Used on server-side to authenticate client connections to private channels.
 *
 * @param socketId - Client socket ID
 * @param channel - Channel name
 * @param data - Optional user data for presence channels
 * @returns Authentication signature
 *
 * @example
 * // In API route for channel authentication
 * const auth = authenticateChannel(socketId, channelName, {
 *   user_id: userId,
 *   user_info: { name: 'John Doe' }
 * });
 */
export function authenticateChannel(
  socketId: string,
  channel: string,
  data?: { user_id: string; user_info?: Record<string, unknown> }
): { auth: string; channel_data?: string } {
  const pusher = getPusherInstance();

  if (data) {
    // Presence channel
    return pusher.authorizeChannel(socketId, channel, data);
  } else {
    // Private channel
    return pusher.authorizeChannel(socketId, channel);
  }
}

/**
 * Terminate users from a channel (disconnect specific socket)
 *
 * Note: This requires the Pusher HTTP API to support the terminate_user_connections endpoint.
 * Check Soketi compatibility before using.
 *
 * @param channel - Channel name
 * @param socketId - Socket ID to terminate
 * @returns Promise resolving when terminated
 */
export async function terminateUserConnection(
  channel: string,
  socketId: string
): Promise<void> {
  try {
    const pusher = getPusherInstance();
    // Note: This may not be supported by Soketi, verify before use
    await pusher.terminateUserConnections(socketId);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Pusher Server] Terminated user connection:', { channel, socketId });
    }
  } catch (error) {
    console.error('[Pusher Server] Failed to terminate connection:', {
      channel,
      socketId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get information about channels
 *
 * @param options - Query options
 * @returns Promise resolving to channel info
 */
export async function getChannels(options?: {
  prefix?: string;
  attributes?: string[];
}): Promise<{ channels: Record<string, unknown> }> {
  try {
    const pusher = getPusherInstance();
    const result = await pusher.get({
      path: '/channels',
      params: options,
    });

    if (result.status !== 200) {
      throw new Error(`Pusher API returned status ${result.status}`);
    }

    // Handle body as string or ReadableStream
    const body = typeof result.body === 'string'
      ? result.body
      : await streamToString(result.body as unknown as ReadableStream<any>);
    return JSON.parse(body);
  } catch (error) {
    console.error('[Pusher Server] Failed to get channels:', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get information about a specific channel
 *
 * @param channel - Channel name
 * @param attributes - Attributes to include (e.g., ['user_count'])
 * @returns Promise resolving to channel info
 */
export async function getChannel(
  channel: string,
  attributes?: string[]
): Promise<{
  occupied: boolean;
  user_count?: number;
  subscription_count?: number;
}> {
  try {
    const pusher = getPusherInstance();
    const result = await pusher.get({
      path: `/channels/${channel}`,
      params: { info: attributes?.join(',') },
    });

    if (result.status !== 200) {
      throw new Error(`Pusher API returned status ${result.status}`);
    }

    // Handle body as string or ReadableStream
    const body = typeof result.body === 'string'
      ? result.body
      : await streamToString(result.body as unknown as ReadableStream<any>);
    return JSON.parse(body);
  } catch (error) {
    console.error('[Pusher Server] Failed to get channel info:', {
      channel,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Webhook signature verification
 *
 * Verify that a webhook request is from Pusher/Soketi by checking the signature.
 *
 * @param receivedSignature - Signature from X-Pusher-Signature header
 * @param body - Raw request body (string)
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  receivedSignature: string,
  body: string
): boolean {
  try {
    const pusher = getPusherInstance();
    const webhook = pusher.webhook({
      rawBody: body,
      headers: {
        'x-pusher-signature': receivedSignature,
      },
    });

    return webhook.isValid();
  } catch (error) {
    console.error('[Pusher Server] Failed to verify webhook signature:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
