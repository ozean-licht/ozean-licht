/**
 * ADW WebSocket Manager
 *
 * Manages WebSocket connections and broadcasts real-time workflow updates
 * to connected clients. Clients can subscribe to specific workflows or
 * receive all workflow updates.
 *
 * @module modules/websocket/adw-websocket-manager
 */

import { WebSocket } from 'ws';
import { logger } from '../../config/logger.js';
import { createWorkflowEvent } from '../../database/queries/adw.js';

// ============================================================================
// Types
// ============================================================================

/**
 * WebSocket message types
 */
export type WSMessageType =
  | 'connection_established'
  | 'subscribe'
  | 'unsubscribe'
  | 'workflow_created'
  | 'workflow_updated'
  | 'workflow_phase_started'
  | 'workflow_phase_completed'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'agent_output'
  | 'error'
  | 'ping'
  | 'pong';

/**
 * WebSocket message structure
 */
export interface WSMessage {
  type: WSMessageType;
  timestamp: string;
  data?: any;
  adwId?: string;
}

/**
 * WebSocket client connection with metadata
 */
interface WSClient {
  socket: WebSocket;
  id: string;
  subscribedWorkflows: Set<string>; // Empty set = subscribed to all
  connectedAt: Date;
}

// ============================================================================
// State
// ============================================================================

/**
 * Active WebSocket connections
 * Maps client ID to connection metadata
 */
const clients = new Map<string, WSClient>();

/**
 * Next client ID counter
 */
let nextClientId = 1;

// ============================================================================
// Connection Management
// ============================================================================

/**
 * Register a new WebSocket connection
 *
 * @param socket - WebSocket connection
 * @returns Client ID
 */
export function registerClient(socket: WebSocket): string {
  const clientId = `ws-${nextClientId++}`;

  const client: WSClient = {
    socket,
    id: clientId,
    subscribedWorkflows: new Set(),
    connectedAt: new Date(),
  };

  clients.set(clientId, client);

  // Set up ping/pong heartbeat
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      sendToClient(clientId, { type: 'ping', timestamp: new Date().toISOString() });
    }
  }, 30000); // Ping every 30 seconds

  // Handle client disconnect
  socket.on('close', () => {
    clearInterval(pingInterval);
    clients.delete(clientId);
    logger.info({ clientId, connectionDuration: Date.now() - client.connectedAt.getTime() }, 'WebSocket client disconnected');
  });

  // Handle incoming messages
  socket.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString()) as WSMessage;
      handleClientMessage(clientId, message);
    } catch (error) {
      logger.error({ error, clientId }, 'Failed to parse WebSocket message');
      sendToClient(clientId, {
        type: 'error',
        timestamp: new Date().toISOString(),
        data: { message: 'Invalid message format' },
      });
    }
  });

  logger.info({ clientId }, 'WebSocket client connected');

  // Send connection confirmation
  sendToClient(clientId, {
    type: 'connection_established',
    timestamp: new Date().toISOString(),
    data: { clientId },
  });

  return clientId;
}

/**
 * Handle incoming message from client
 *
 * @param clientId - Client ID
 * @param message - Parsed WebSocket message
 */
function handleClientMessage(clientId: string, message: WSMessage) {
  const client = clients.get(clientId);
  if (!client) {
    return;
  }

  switch (message.type) {
    case 'subscribe':
      if (message.adwId) {
        client.subscribedWorkflows.add(message.adwId);
        logger.debug({ clientId, adwId: message.adwId }, 'Client subscribed to workflow');
        sendToClient(clientId, {
          type: 'subscribe',
          timestamp: new Date().toISOString(),
          adwId: message.adwId,
          data: { success: true },
        });
      }
      break;

    case 'unsubscribe':
      if (message.adwId) {
        client.subscribedWorkflows.delete(message.adwId);
        logger.debug({ clientId, adwId: message.adwId }, 'Client unsubscribed from workflow');
        sendToClient(clientId, {
          type: 'unsubscribe',
          timestamp: new Date().toISOString(),
          adwId: message.adwId,
          data: { success: true },
        });
      }
      break;

    case 'pong':
      // Heartbeat response received
      logger.debug({ clientId }, 'Received pong from client');
      break;

    default:
      logger.warn({ clientId, messageType: message.type }, 'Unknown message type from client');
  }
}

// ============================================================================
// Broadcasting
// ============================================================================

/**
 * Send a message to a specific client
 *
 * @param clientId - Client ID
 * @param message - Message to send
 */
function sendToClient(clientId: string, message: WSMessage) {
  const client = clients.get(clientId);
  if (!client) {
    return;
  }

  if (client.socket.readyState === WebSocket.OPEN) {
    try {
      client.socket.send(JSON.stringify(message));
    } catch (error) {
      logger.error({ error, clientId }, 'Failed to send message to client');
    }
  }
}

/**
 * Broadcast a workflow update to all subscribed clients
 *
 * Sends the message to clients that are either:
 * - Subscribed to the specific workflow (adwId in their subscribedWorkflows set)
 * - Subscribed to all workflows (empty subscribedWorkflows set)
 *
 * @param message - Message to broadcast
 */
export function broadcastWorkflowUpdate(message: WSMessage) {
  const { adwId } = message;

  for (const [clientId, client] of clients.entries()) {
    // Send to clients subscribed to this specific workflow or all workflows
    const isSubscribed =
      client.subscribedWorkflows.size === 0 || (adwId && client.subscribedWorkflows.has(adwId));

    if (isSubscribed) {
      sendToClient(clientId, message);
    }
  }

  // Also log to database as workflow event
  if (adwId && message.type !== 'ping' && message.type !== 'pong') {
    createWorkflowEvent({
      adwId,
      eventType: message.type,
      message: JSON.stringify(message.data),
      data: message.data,
    }).catch((error) => {
      logger.error({ error, adwId, messageType: message.type }, 'Failed to log workflow event to database');
    });
  }
}

/**
 * Broadcast workflow creation
 */
export function broadcastWorkflowCreated(adwId: string, issueNumber: number, workflowType: string) {
  broadcastWorkflowUpdate({
    type: 'workflow_created',
    timestamp: new Date().toISOString(),
    adwId,
    data: { issueNumber, workflowType },
  });
}

/**
 * Broadcast workflow phase started
 */
export function broadcastPhaseStarted(adwId: string, phase: string, slashCommand?: string) {
  broadcastWorkflowUpdate({
    type: 'workflow_phase_started',
    timestamp: new Date().toISOString(),
    adwId,
    data: { phase, slashCommand },
  });
}

/**
 * Broadcast workflow phase completed
 */
export function broadcastPhaseCompleted(adwId: string, phase: string, success: boolean, output?: string) {
  broadcastWorkflowUpdate({
    type: 'workflow_phase_completed',
    timestamp: new Date().toISOString(),
    adwId,
    data: { phase, success, output },
  });
}

/**
 * Broadcast workflow completion
 */
export function broadcastWorkflowCompleted(adwId: string, prNumber?: number) {
  broadcastWorkflowUpdate({
    type: 'workflow_completed',
    timestamp: new Date().toISOString(),
    adwId,
    data: { prNumber },
  });
}

/**
 * Broadcast workflow failure
 */
export function broadcastWorkflowFailed(adwId: string, error: string, phase?: string) {
  broadcastWorkflowUpdate({
    type: 'workflow_failed',
    timestamp: new Date().toISOString(),
    adwId,
    data: { error, phase },
  });
}

/**
 * Broadcast agent output
 */
export function broadcastAgentOutput(adwId: string, agentName: string, output: string) {
  broadcastWorkflowUpdate({
    type: 'agent_output',
    timestamp: new Date().toISOString(),
    adwId,
    data: { agentName, output },
  });
}

/**
 * Get count of connected clients
 */
export function getConnectedClientCount(): number {
  return clients.size;
}

/**
 * Get list of active client IDs
 */
export function getActiveClientIds(): string[] {
  return Array.from(clients.keys());
}
