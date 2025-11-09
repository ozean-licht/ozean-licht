# TypeScript Migration - Phase 3 Implementation Plan

> **Integration Layer: Routes, WebSocket, Storage, and Orchestrator Integration**
>
> **Status**: Planning
> **Phase 2 Dependency**: ✅ Complete (8 core ADW modules, 3,296 lines)
> **Timeline**: 2-3 weeks
> **Goal**: Create the integration layer that exposes ADW functionality through HTTP APIs, WebSocket, and orchestrator tools

---

## Executive Summary

### Phase 2 Achievements (Completed)

Phase 2 successfully delivered all 8 core ADW modules:
- ✅ `types.ts` - Type definitions with Zod schemas (302 lines)
- ✅ `utils.ts` - Utility functions (328 lines)
- ✅ `git-operations.ts` - Git commands via simple-git (236 lines)
- ✅ `agent-executor.ts` - Agent SDK execution (456 lines)
- ✅ `state-manager.ts` - Database state operations (328 lines)
- ✅ `github-integration.ts` - GitHub API via Octokit (553 lines)
- ✅ `worktree-manager.ts` - Git worktree management (410 lines)
- ✅ `workflow-manager.ts` - Complete SDLC orchestration (683 lines)

**Total**: 3,296 lines of production-ready TypeScript

### What Phase 3 Delivers

Phase 3 builds the **integration layer** that connects the core ADW modules to:
1. **HTTP REST API** - Programmatic access to ADW workflows
2. **WebSocket streaming** - Real-time workflow progress updates
3. **R2/S3 storage** - Upload screenshots and artifacts to Cloudflare R2
4. **GitHub webhooks** - Automated workflow triggering
5. **MCP tool system** - Expose ADW as tools to orchestrator agent
6. **Orchestrator service** - Integration with existing orchestrator

### Architecture Vision

```
┌─────────────────────────────────────────────────────────────┐
│                    Fastify HTTP Server                       │
│                   (apps/orchestrator_ts)                     │
└─────────────┬────────────────────────────┬──────────────────┘
              │                            │
      ┌───────▼────────┐          ┌────────▼────────┐
      │  HTTP Routes   │          │   WebSocket     │
      │  (Phase 3)     │          │   Manager       │
      └───────┬────────┘          │   (Phase 3)     │
              │                    └────────┬────────┘
              │                             │
      ┌───────▼─────────────────────────────▼────────┐
      │         ADW Orchestrator Service             │
      │              (Phase 3)                       │
      └───────┬─────────────────────────┬────────────┘
              │                         │
      ┌───────▼────────┐        ┌───────▼────────┐
      │  R2 Storage    │        │  GitHub        │
      │  Uploader      │        │  Webhook       │
      │  (Phase 3)     │        │  Handler       │
      └────────────────┘        │  (Phase 3)     │
                                └────────────────┘
              │
      ┌───────▼────────────────────────────────────┐
      │      Core ADW Modules (Phase 2 ✅)         │
      │  workflow-manager │ agent-executor │       │
      │  state-manager │ worktree-manager │        │
      │  github-integration │ git-operations │     │
      └────────────────────────────────────────────┘
```

---

## Phase 3 Module Specifications

### Module 1: R2 Storage Uploader

**Purpose**: Upload workflow artifacts (screenshots, logs, reports) to Cloudflare R2 (S3-compatible storage)

**File**: `src/modules/storage/r2-uploader.ts`

**Migrates**: `adws/adw_modules/r2_uploader.py` (126 lines)

**Dependencies**:
- `@aws-sdk/client-s3` - AWS S3 SDK (already in package.json)
- Environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

**Key Features**:
- Singleton S3 client instance
- Conditional initialization (disabled if env vars missing)
- Upload with custom object keys
- Public URL generation
- Batch screenshot upload
- Error handling and logging

**Implementation**:

```typescript
/**
 * R2 Storage Uploader Module
 *
 * Provides upload functionality for ADW workflow artifacts to Cloudflare R2
 * (S3-compatible object storage). Uploads are optional and gracefully disabled
 * if required environment variables are not present.
 *
 * Key features:
 * - Singleton S3 client for performance
 * - Conditional initialization (no errors if credentials missing)
 * - Custom object key patterns (adw/{adw_id}/review/{filename})
 * - Public URL generation for uploaded files
 * - Batch upload support for screenshots
 *
 * Migrated from Python: adws/adw_modules/r2_uploader.py
 *
 * @module modules/storage/r2-uploader
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Cached S3 client instance
 * Initialized on first upload if credentials are available
 */
let s3Client: S3Client | null = null;

/**
 * Flag indicating if R2 uploads are enabled
 * Set to false if required environment variables are missing
 */
let uploadsEnabled = false;

/**
 * Cached R2 configuration
 */
interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
}

let r2Config: R2Config | null = null;

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize R2 client if all required environment variables are present
 *
 * This function is called automatically on first upload attempt.
 * If any required environment variable is missing, uploads will be disabled
 * and all upload calls will return null gracefully.
 *
 * @returns True if initialization succeeded, false otherwise
 *
 * @example
 * ```typescript
 * // Automatic initialization on first upload
 * const url = await uploadFile('screenshot.png');
 * // Returns null if credentials not configured (graceful degradation)
 * ```
 */
function initializeR2Client(): boolean {
  if (s3Client !== null) {
    return uploadsEnabled;
  }

  // Check for required environment variables
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucketName = env.R2_BUCKET_NAME;
  const publicDomain = env.R2_PUBLIC_DOMAIN ?? 'tac-public-imgs.iddagents.com';

  // All are optional in env.ts, so check if they're actually set
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    logger.info('R2 uploads disabled - missing required environment variables');
    uploadsEnabled = false;
    return false;
  }

  try {
    // Create S3 client configured for Cloudflare R2
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    s3Client = new S3Client({
      region: 'us-east-1', // R2 uses this as a placeholder
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    r2Config = {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicDomain,
    };

    uploadsEnabled = true;
    logger.info({ bucket: bucketName, domain: publicDomain }, 'R2 uploads enabled');
    return true;
  } catch (error) {
    logger.warn({ error }, 'Failed to initialize R2 client');
    uploadsEnabled = false;
    return false;
  }
}

// ============================================================================
// Upload Functions
// ============================================================================

/**
 * Upload a file to R2 and return the public URL
 *
 * Uploads a file to Cloudflare R2 with a custom object key and returns
 * the public URL. If R2 is not configured (missing env vars), returns null
 * gracefully without throwing errors.
 *
 * @param filePath - Absolute path to the file to upload
 * @param objectKey - Optional S3 object key (defaults to adw/review/{filename})
 * @returns Public URL if successful, null if disabled or failed
 *
 * @example
 * ```typescript
 * // Upload with default key pattern
 * const url = await uploadFile('/path/to/screenshot.png');
 * // url: https://tac-public-imgs.iddagents.com/adw/review/screenshot.png
 *
 * // Upload with custom key
 * const url2 = await uploadFile('/path/to/log.txt', 'adw/abc12345/logs/build.log');
 * // url2: https://tac-public-imgs.iddagents.com/adw/abc12345/logs/build.log
 * ```
 */
export async function uploadFile(
  filePath: string,
  objectKey?: string
): Promise<string | null> {
  // Initialize client on first use
  if (s3Client === null) {
    const initialized = initializeR2Client();
    if (!initialized) {
      return null;
    }
  }

  if (!uploadsEnabled || !s3Client || !r2Config) {
    return null;
  }

  // Generate object key if not provided
  const key = objectKey ?? `adw/review/${basename(filePath)}`;

  try {
    // Read file contents
    const fileBuffer = await readFile(filePath);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: key,
      Body: fileBuffer,
    });

    await s3Client.send(command);

    // Generate public URL
    const publicUrl = `https://${r2Config.publicDomain}/${key}`;

    logger.info({ filePath, objectKey: key, publicUrl }, 'File uploaded to R2');
    return publicUrl;
  } catch (error) {
    logger.error({ error, filePath, objectKey: key }, 'Failed to upload file to R2');
    return null;
  }
}

/**
 * Upload multiple screenshots and return URL mapping
 *
 * Uploads a batch of screenshots to R2 and returns a mapping of local paths
 * to public URLs. If a screenshot fails to upload or R2 is disabled, the
 * original local path is used in the mapping.
 *
 * @param screenshots - Array of absolute file paths to upload
 * @param adwId - ADW workflow ID for organizing uploads
 * @returns Object mapping local paths to public URLs (or original paths if upload failed)
 *
 * @example
 * ```typescript
 * const screenshots = [
 *   '/tmp/screenshot1.png',
 *   '/tmp/screenshot2.png'
 * ];
 *
 * const urlMapping = await uploadScreenshots(screenshots, 'abc12345');
 * // {
 * //   '/tmp/screenshot1.png': 'https://tac-public-imgs.iddagents.com/adw/abc12345/review/screenshot1.png',
 * //   '/tmp/screenshot2.png': 'https://tac-public-imgs.iddagents.com/adw/abc12345/review/screenshot2.png'
 * // }
 * ```
 */
export async function uploadScreenshots(
  screenshots: string[],
  adwId: string
): Promise<Record<string, string>> {
  const urlMapping: Record<string, string> = {};

  for (const screenshot of screenshots) {
    if (!screenshot) {
      continue;
    }

    // Generate object key with ADW ID for organization
    const filename = basename(screenshot);
    const objectKey = `adw/${adwId}/review/${filename}`;

    // Upload and get public URL
    const publicUrl = await uploadFile(screenshot, objectKey);

    // Map to public URL if successful, otherwise keep original path
    urlMapping[screenshot] = publicUrl ?? screenshot;
  }

  logger.debug({ count: screenshots.length, adwId }, 'Uploaded screenshots to R2');
  return urlMapping;
}

/**
 * Check if R2 uploads are currently enabled
 *
 * @returns True if R2 client is initialized and ready
 *
 * @example
 * ```typescript
 * if (isR2Enabled()) {
 *   await uploadFile('screenshot.png');
 * } else {
 *   logger.info('R2 disabled, storing locally');
 * }
 * ```
 */
export function isR2Enabled(): boolean {
  if (s3Client === null) {
    initializeR2Client();
  }
  return uploadsEnabled;
}
```

**Environment Variables (Update `env.ts`)**:

```typescript
// Add to src/config/env.ts schema
R2_ACCOUNT_ID: z.string().optional(),
R2_ACCESS_KEY_ID: z.string().optional(),
R2_SECRET_ACCESS_KEY: z.string().optional(),
R2_BUCKET_NAME: z.string().optional(),
R2_PUBLIC_DOMAIN: z.string().optional().default('tac-public-imgs.iddagents.com'),
```

---

### Module 2: HTTP Routes - ADW Endpoints

**Purpose**: Expose ADW workflow operations via REST API

**File**: `src/routes/adw.ts`

**New File** (no Python equivalent - orchestrator_3_stream uses FastAPI routes in main.py)

**Dependencies**:
- Fastify server (already initialized in server.ts)
- workflow-manager module from Phase 2
- state-manager module from Phase 2

**Key Endpoints**:
- `POST /api/adw/workflows` - Create new workflow
- `GET /api/adw/workflows` - List active workflows
- `GET /api/adw/workflows/:adwId` - Get workflow status
- `POST /api/adw/workflows/:adwId/execute` - Execute workflow phase
- `DELETE /api/adw/workflows/:adwId` - Cancel workflow

**Implementation**:

```typescript
/**
 * ADW HTTP Routes
 *
 * REST API endpoints for managing ADW workflows via HTTP.
 * These routes expose the workflow-manager functionality to HTTP clients.
 *
 * @module routes/adw
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { getWorkflowState, listActiveWorkflows as listActiveWorkflowStates } from '../modules/adw/state-manager.js';
import { WorkflowType, SlashCommand } from '../modules/adw/types.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

/**
 * Schema for creating a new workflow
 */
const CreateWorkflowSchema = z.object({
  issueNumber: z.number().int().positive(),
  workflowType: WorkflowType,
  modelSet: z.enum(['base', 'heavy']).optional(),
});

type CreateWorkflowRequest = z.infer<typeof CreateWorkflowSchema>;

/**
 * Schema for executing a workflow phase
 */
const ExecutePhaseSchema = z.object({
  slashCommand: SlashCommand.optional(),
  customPrompt: z.string().optional(),
});

type ExecutePhaseRequest = z.infer<typeof ExecutePhaseSchema>;

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * Register all ADW routes with the Fastify server
 *
 * @param server - Fastify instance
 */
export async function registerAdwRoutes(server: FastifyInstance) {
  // Prefix all routes with /api/adw
  await server.register(
    async (adwRoutes) => {
      /**
       * POST /api/adw/workflows
       * Create a new ADW workflow
       */
      adwRoutes.post<{ Body: CreateWorkflowRequest }>(
        '/workflows',
        async (request: FastifyRequest<{ Body: CreateWorkflowRequest }>, reply: FastifyReply) => {
          try {
            // Validate request body
            const { issueNumber, workflowType, modelSet } = CreateWorkflowSchema.parse(request.body);

            logger.info({ issueNumber, workflowType }, 'Creating new ADW workflow');

            // Create workflow (this will initialize state in database)
            const result = await WorkflowManager.createWorkflow(issueNumber, workflowType, modelSet);

            if (!result.success) {
              return reply.code(500).send({
                error: 'Failed to create workflow',
                message: result.error,
              });
            }

            // Get workflow state
            const workflowState = await getWorkflowState(result.adwId!);

            return reply.code(201).send({
              success: true,
              adwId: result.adwId,
              workflow: workflowState,
            });
          } catch (error) {
            logger.error({ error }, 'Error creating workflow');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * GET /api/adw/workflows
       * List all active workflows
       */
      adwRoutes.get('/workflows', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const workflows = await listActiveWorkflowStates();

          return reply.send({
            success: true,
            count: workflows.length,
            workflows,
          });
        } catch (error) {
          logger.error({ error }, 'Error listing workflows');
          return reply.code(500).send({
            error: 'Failed to list workflows',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * GET /api/adw/workflows/:adwId
       * Get workflow status and details
       */
      adwRoutes.get<{ Params: { adwId: string } }>(
        '/workflows/:adwId',
        async (request: FastifyRequest<{ Params: { adwId: string } }>, reply: FastifyReply) => {
          try {
            const { adwId } = request.params;

            const workflow = await getWorkflowState(adwId);

            if (!workflow) {
              return reply.code(404).send({
                error: 'Workflow not found',
                adwId,
              });
            }

            return reply.send({
              success: true,
              workflow,
            });
          } catch (error) {
            logger.error({ error }, 'Error fetching workflow');
            return reply.code(500).send({
              error: 'Failed to fetch workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * POST /api/adw/workflows/:adwId/execute
       * Execute a workflow phase
       */
      adwRoutes.post<{ Params: { adwId: string }; Body: ExecutePhaseRequest }>(
        '/workflows/:adwId/execute',
        async (
          request: FastifyRequest<{ Params: { adwId: string }; Body: ExecutePhaseRequest }>,
          reply: FastifyReply
        ) => {
          try {
            const { adwId } = request.params;
            const { slashCommand, customPrompt } = ExecutePhaseSchema.parse(request.body);

            logger.info({ adwId, slashCommand }, 'Executing workflow phase');

            // Get workflow state
            const workflow = await getWorkflowState(adwId);
            if (!workflow) {
              return reply.code(404).send({
                error: 'Workflow not found',
                adwId,
              });
            }

            // Execute based on slash command or custom prompt
            let result;
            if (slashCommand) {
              // Execute predefined workflow phase
              result = await WorkflowManager.executeWorkflowPhase(adwId, slashCommand);
            } else if (customPrompt) {
              // Execute custom agent prompt
              result = await WorkflowManager.executeCustomPrompt(adwId, customPrompt);
            } else {
              return reply.code(400).send({
                error: 'Either slashCommand or customPrompt is required',
              });
            }

            if (!result.success) {
              return reply.code(500).send({
                error: 'Workflow execution failed',
                message: result.error,
              });
            }

            return reply.send({
              success: true,
              output: result.output,
            });
          } catch (error) {
            logger.error({ error }, 'Error executing workflow');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Failed to execute workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * DELETE /api/adw/workflows/:adwId
       * Cancel/cleanup a workflow
       */
      adwRoutes.delete<{ Params: { adwId: string } }>(
        '/workflows/:adwId',
        async (request: FastifyRequest<{ Params: { adwId: string } }>, reply: FastifyReply) => {
          try {
            const { adwId } = request.params;

            logger.info({ adwId }, 'Cancelling workflow');

            const result = await WorkflowManager.cleanupWorkflow(adwId);

            if (!result.success) {
              return reply.code(500).send({
                error: 'Failed to cancel workflow',
                message: result.error,
              });
            }

            return reply.send({
              success: true,
              message: 'Workflow cancelled successfully',
            });
          } catch (error) {
            logger.error({ error }, 'Error cancelling workflow');
            return reply.code(500).send({
              error: 'Failed to cancel workflow',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );
    },
    { prefix: '/api/adw' }
  );

  logger.info('ADW routes registered');
}
```

**Update `server.ts`**:

```typescript
// Add to src/server.ts
import { registerAdwRoutes } from './routes/adw.js';

export async function buildServer() {
  const server = Fastify({ logger: true });

  // ... existing middleware ...

  // Register ADW routes
  await registerAdwRoutes(server);

  // ... rest of server setup ...

  return server;
}
```

---

### Module 3: WebSocket Manager - Real-time Updates

**Purpose**: Stream real-time workflow progress updates to connected clients

**File**: `src/modules/websocket/adw-websocket-manager.ts`

**Migrates**: Portions of `apps/orchestrator_3_stream/backend/modules/websocket_manager.py`

**Dependencies**:
- `@fastify/websocket` (already installed)
- state-manager module from Phase 2

**Key Features**:
- Broadcast workflow events to all connected clients
- Per-workflow subscription filtering
- Connection management
- Heartbeat/ping-pong

**Implementation**:

```typescript
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
```

**Update `server.ts` to use WebSocket manager**:

```typescript
// Update src/server.ts
import { registerClient } from './modules/websocket/adw-websocket-manager.js';

// Update WebSocket endpoint
server.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, req) => {
    const clientId = registerClient(socket);
    logger.info({ clientId }, 'WebSocket client registered');
  });
});
```

---

### Module 4: GitHub Webhook Handler

**Purpose**: Handle GitHub webhook events to automatically trigger ADW workflows

**File**: `src/routes/webhooks.ts`

**New File** (Python orchestrator doesn't have this yet)

**Dependencies**:
- Fastify
- crypto (for signature verification)
- workflow-manager module from Phase 2

**Key Features**:
- Webhook signature verification (HMAC-SHA256)
- Issue comment parsing for ADW trigger keywords
- Issue labeling support (e.g., `adw:feature`, `adw:bug`)
- Loop prevention (skip comments from ADW bot)
- Async workflow execution

**Implementation**:

```typescript
/**
 * GitHub Webhook Handler
 *
 * Processes GitHub webhook events to automatically trigger ADW workflows.
 * Supports issue comments with keywords and issue labeling.
 *
 * Trigger patterns:
 * - Issue comment: "@adw-bot /implement" or "@adw-bot /build"
 * - Issue labels: "adw:feature", "adw:bug", "adw:chore"
 *
 * @module routes/webhooks
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createHmac, timingSafeEqual } from 'crypto';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { ADW_BOT_IDENTIFIER } from '../modules/adw/github-integration.js';
import { WorkflowType } from '../modules/adw/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * GitHub webhook event types we handle
 */
type GitHubEventType = 'issue_comment' | 'issues';

/**
 * Issue comment webhook payload (simplified)
 */
interface IssueCommentPayload {
  action: 'created' | 'edited' | 'deleted';
  issue: {
    number: number;
    title: string;
    body: string;
    labels: Array<{ name: string }>;
  };
  comment: {
    body: string;
    user: {
      login: string;
    };
  };
}

/**
 * Issue webhook payload (simplified)
 */
interface IssuePayload {
  action: 'labeled' | 'opened' | 'edited' | 'closed' | 'reopened';
  issue: {
    number: number;
    title: string;
    body: string;
    labels: Array<{ name: string }>;
  };
  label?: {
    name: string;
  };
}

// ============================================================================
// Webhook Signature Verification
// ============================================================================

/**
 * Verify GitHub webhook signature
 *
 * GitHub signs webhook payloads with HMAC-SHA256 using the webhook secret.
 * This function verifies the signature to ensure the webhook is authentic.
 *
 * @param payload - Raw request body
 * @param signature - X-Hub-Signature-256 header value
 * @returns True if signature is valid
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!env.GITHUB_WEBHOOK_SECRET) {
    logger.warn('GITHUB_WEBHOOK_SECRET not set - webhook signature verification disabled');
    return true; // Allow webhooks if secret not configured (dev mode)
  }

  if (!signature) {
    logger.warn('Webhook signature missing');
    return false;
  }

  try {
    // GitHub sends signature as "sha256=<hex>"
    const [algorithm, hash] = signature.split('=');
    if (algorithm !== 'sha256') {
      logger.warn({ algorithm }, 'Unexpected signature algorithm');
      return false;
    }

    // Compute expected signature
    const hmac = createHmac('sha256', env.GITHUB_WEBHOOK_SECRET);
    hmac.update(payload);
    const expectedHash = hmac.digest('hex');

    // Timing-safe comparison
    const signatureBuffer = Buffer.from(hash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    logger.error({ error }, 'Error verifying webhook signature');
    return false;
  }
}

// ============================================================================
// Webhook Parsing
// ============================================================================

/**
 * Extract ADW workflow type from issue comment
 *
 * Looks for patterns like:
 * - "@adw-bot /implement"
 * - "@adw-bot sdlc"
 * - "/build"
 *
 * @param commentBody - Comment text
 * @returns Workflow type if found, null otherwise
 */
function extractWorkflowTypeFromComment(commentBody: string): WorkflowType | null {
  // Skip comments from ADW bot itself (loop prevention)
  if (commentBody.includes(ADW_BOT_IDENTIFIER)) {
    return null;
  }

  const lowerBody = commentBody.toLowerCase();

  // Check for @adw-bot mentions
  if (lowerBody.includes('@adw-bot')) {
    // Extract workflow type after @adw-bot
    const patterns: Array<[RegExp, WorkflowType]> = [
      [/@adw-bot\s+\/implement/i, 'sdlc'],
      [/@adw-bot\s+\/build/i, 'build'],
      [/@adw-bot\s+\/test/i, 'test'],
      [/@adw-bot\s+\/plan/i, 'plan'],
      [/@adw-bot\s+sdlc/i, 'sdlc'],
    ];

    for (const [pattern, workflowType] of patterns) {
      if (pattern.test(lowerBody)) {
        return workflowType;
      }
    }
  }

  // Check for standalone slash commands
  if (lowerBody.includes('/implement') || lowerBody.includes('/sdlc')) {
    return 'sdlc';
  }

  return null;
}

/**
 * Extract ADW workflow type from issue labels
 *
 * Looks for labels like:
 * - "adw:feature" -> sdlc workflow
 * - "adw:bug" -> sdlc workflow
 * - "adw:plan" -> plan workflow
 *
 * @param labels - Issue labels
 * @returns Workflow type if ADW label found, null otherwise
 */
function extractWorkflowTypeFromLabels(labels: Array<{ name: string }>): WorkflowType | null {
  for (const label of labels) {
    if (label.name.startsWith('adw:')) {
      const labelType = label.name.split(':')[1];

      // Map label types to workflow types
      switch (labelType) {
        case 'feature':
        case 'bug':
        case 'chore':
          return 'sdlc';
        case 'plan':
          return 'plan';
        case 'build':
          return 'build';
        case 'test':
          return 'test';
        default:
          logger.warn({ label: label.name }, 'Unknown ADW label type');
      }
    }
  }

  return null;
}

// ============================================================================
// Event Handlers
// ============================================================================

/**
 * Handle issue_comment webhook event
 *
 * Triggers ADW workflow if comment contains workflow keywords
 */
async function handleIssueComment(payload: IssueCommentPayload): Promise<void> {
  const { action, issue, comment } = payload;

  // Only process new comments
  if (action !== 'created') {
    return;
  }

  logger.debug({ issueNumber: issue.number, commenter: comment.user.login }, 'Processing issue comment');

  // Extract workflow type from comment
  const workflowType = extractWorkflowTypeFromComment(comment.body);
  if (!workflowType) {
    logger.debug({ issueNumber: issue.number }, 'No ADW workflow trigger found in comment');
    return;
  }

  logger.info(
    { issueNumber: issue.number, workflowType, commenter: comment.user.login },
    'ADW workflow triggered by comment'
  );

  // Create and execute workflow asynchronously
  const result = await WorkflowManager.createWorkflow(issue.number, workflowType);

  if (result.success && result.adwId) {
    // Execute workflow in background (don't await)
    WorkflowManager.executeFullWorkflow(result.adwId).catch((error) => {
      logger.error({ error, adwId: result.adwId, issueNumber: issue.number }, 'Workflow execution failed');
    });
  } else {
    logger.error({ error: result.error, issueNumber: issue.number }, 'Failed to create workflow');
  }
}

/**
 * Handle issues webhook event
 *
 * Triggers ADW workflow if issue is labeled with adw:* label
 */
async function handleIssue(payload: IssuePayload): Promise<void> {
  const { action, issue, label } = payload;

  // Only process label additions
  if (action !== 'labeled') {
    return;
  }

  // Check if the added label is an ADW trigger
  if (!label || !label.name.startsWith('adw:')) {
    return;
  }

  logger.info({ issueNumber: issue.number, label: label.name }, 'ADW workflow triggered by label');

  // Extract workflow type from label
  const workflowType = extractWorkflowTypeFromLabels([label]);
  if (!workflowType) {
    logger.warn({ label: label.name }, 'ADW label found but workflow type could not be determined');
    return;
  }

  // Create and execute workflow asynchronously
  const result = await WorkflowManager.createWorkflow(issue.number, workflowType);

  if (result.success && result.adwId) {
    // Execute workflow in background (don't await)
    WorkflowManager.executeFullWorkflow(result.adwId).catch((error) => {
      logger.error({ error, adwId: result.adwId, issueNumber: issue.number }, 'Workflow execution failed');
    });
  } else {
    logger.error({ error: result.error, issueNumber: issue.number }, 'Failed to create workflow');
  }
}

// ============================================================================
// Route Registration
// ============================================================================

/**
 * Register GitHub webhook routes
 */
export async function registerWebhookRoutes(server: FastifyInstance) {
  /**
   * POST /webhooks/github
   * Receive and process GitHub webhook events
   */
  server.post(
    '/webhooks/github',
    {
      config: {
        // Disable Fastify's JSON body parser to access raw body for signature verification
        rawBody: true,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Extract headers
        const signature = request.headers['x-hub-signature-256'] as string;
        const eventType = request.headers['x-github-event'] as GitHubEventType;
        const deliveryId = request.headers['x-github-delivery'] as string;

        logger.debug({ eventType, deliveryId }, 'Received GitHub webhook');

        // Get raw body for signature verification
        const rawBody = (request as any).rawBody || JSON.stringify(request.body);

        // Verify signature
        if (!verifySignature(rawBody, signature)) {
          logger.warn({ deliveryId }, 'Invalid webhook signature');
          return reply.code(401).send({ error: 'Invalid signature' });
        }

        // Parse payload
        const payload = request.body as IssueCommentPayload | IssuePayload;

        // Handle different event types
        switch (eventType) {
          case 'issue_comment':
            await handleIssueComment(payload as IssueCommentPayload);
            break;

          case 'issues':
            await handleIssue(payload as IssuePayload);
            break;

          default:
            logger.debug({ eventType }, 'Ignoring webhook event type');
        }

        // Always respond 200 to GitHub
        return reply.code(200).send({ received: true });
      } catch (error) {
        logger.error({ error }, 'Error processing webhook');
        // Still return 200 to avoid GitHub retries
        return reply.code(200).send({ error: 'Processing failed' });
      }
    }
  );

  logger.info('GitHub webhook routes registered');
}
```

**Update `server.ts`**:

```typescript
// Add to src/server.ts
import { registerWebhookRoutes } from './routes/webhooks.js';

export async function buildServer() {
  const server = Fastify({
    logger: true,
    // Enable raw body for webhook signature verification
    bodyLimit: 1048576, // 1MB
  });

  // Register webhook routes before body parser
  await registerWebhookRoutes(server);

  // ... rest of server setup ...

  return server;
}
```

---

### Module 5: Workflow Manager Extensions

**Purpose**: Add missing functions to workflow-manager.ts that are needed by the integration layer

**File**: `src/modules/adw/workflow-manager.ts` (update existing file from Phase 2)

**New Functions to Add**:

```typescript
// Add these functions to the existing workflow-manager.ts from Phase 2

/**
 * Create a new workflow from an issue number
 *
 * Initializes a new ADW workflow by fetching the issue from GitHub,
 * creating the workflow state in the database, and preparing the
 * git worktree.
 *
 * @param issueNumber - GitHub issue number
 * @param workflowType - Type of workflow to execute
 * @param modelSet - Model set to use (base or heavy)
 * @returns Result with adwId if successful
 */
export async function createWorkflow(
  issueNumber: number,
  workflowType: WorkflowType,
  modelSet: ModelSet = 'base'
): Promise<WorkflowResult & { adwId?: string }> {
  try {
    logger.info({ issueNumber, workflowType, modelSet }, 'Creating new workflow');

    // Fetch issue from GitHub
    const issue = await fetchIssue(issueNumber);
    if (!issue) {
      return {
        success: false,
        output: '',
        error: `Issue #${issueNumber} not found`,
      };
    }

    // Generate ADW ID
    const adwId = generateAdwId();

    // Create workflow in database
    await createWorkflowState({
      adwId,
      issueNumber,
      workflowType,
      phase: 'initialized',
      status: 'active',
      issueTitle: issue.title,
      issueBody: issue.body,
      modelSet,
    });

    logger.info({ adwId, issueNumber }, 'Workflow created successfully');

    return {
      success: true,
      output: `Workflow ${adwId} created for issue #${issueNumber}`,
      adwId,
    };
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to create workflow');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a specific workflow phase
 *
 * @param adwId - Workflow ID
 * @param slashCommand - Slash command to execute
 * @returns Execution result
 */
export async function executeWorkflowPhase(
  adwId: string,
  slashCommand: SlashCommand
): Promise<WorkflowResult> {
  try {
    logger.info({ adwId, slashCommand }, 'Executing workflow phase');

    // Get workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Broadcast phase started
    broadcastPhaseStarted(adwId, slashCommand, slashCommand);

    // Execute agent
    const [result, error] = await executeAgent(adwId, slashCommand, workflow.worktreePath || '');

    if (error) {
      broadcastPhaseCompleted(adwId, slashCommand, false, error);
      return {
        success: false,
        output: '',
        error,
      };
    }

    broadcastPhaseCompleted(adwId, slashCommand, true, result?.output || '');

    return {
      success: true,
      output: result?.output || '',
    };
  } catch (error) {
    logger.error({ error, adwId, slashCommand }, 'Phase execution failed');
    broadcastPhaseCompleted(adwId, slashCommand, false, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute a custom agent prompt
 *
 * @param adwId - Workflow ID
 * @param prompt - Custom prompt text
 * @returns Execution result
 */
export async function executeCustomPrompt(
  adwId: string,
  prompt: string
): Promise<WorkflowResult> {
  try {
    logger.info({ adwId, promptLength: prompt.length }, 'Executing custom prompt');

    // Get workflow state
    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Broadcast phase started
    broadcastPhaseStarted(adwId, 'custom', undefined);

    // Execute agent with custom prompt
    const [result, error] = await executeAgent(adwId, prompt, workflow.worktreePath || '');

    if (error) {
      broadcastPhaseCompleted(adwId, 'custom', false, error);
      return {
        success: false,
        output: '',
        error,
      };
    }

    broadcastPhaseCompleted(adwId, 'custom', true, result?.output || '');

    return {
      success: true,
      output: result?.output || '',
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Custom prompt execution failed');
    broadcastPhaseCompleted(adwId, 'custom', false, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute complete workflow from start to finish
 *
 * This orchestrates the full SDLC workflow:
 * 1. Classify issue
 * 2. Generate branch name
 * 3. Create worktree
 * 4. Plan
 * 5. Implement
 * 6. Test (if applicable)
 * 7. Review (if applicable)
 * 8. Commit
 * 9. Create PR
 *
 * @param adwId - Workflow ID
 * @returns Final result
 */
export async function executeFullWorkflow(adwId: string): Promise<WorkflowResult> {
  try {
    logger.info({ adwId }, 'Starting full workflow execution');

    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    broadcastPhaseStarted(adwId, 'full_workflow');

    // Determine workflow steps based on workflow type
    const steps: SlashCommand[] = [];

    switch (workflow.workflowType) {
      case 'sdlc':
        steps.push(
          '/classify_issue',
          '/generate_branch_name',
          '/implement',
          '/test',
          '/review',
          '/commit',
          '/pull_request'
        );
        break;
      case 'plan':
        steps.push('/classify_issue', '/plan');
        break;
      case 'build':
        steps.push('/implement', '/commit');
        break;
      // Add more workflow types as needed
    }

    // Execute each step sequentially
    let lastOutput = '';
    for (const step of steps) {
      const result = await executeWorkflowPhase(adwId, step);
      if (!result.success) {
        broadcastWorkflowFailed(adwId, result.error || 'Unknown error', step);
        return result;
      }
      lastOutput = result.output;
    }

    // Mark workflow as completed
    await updateWorkflowState(adwId, {
      status: 'completed',
      phase: 'done',
    });

    broadcastWorkflowCompleted(adwId, workflow.prNumber || undefined);

    return {
      success: true,
      output: lastOutput,
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Full workflow execution failed');
    broadcastWorkflowFailed(adwId, error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cleanup a workflow (cancel and remove worktree)
 *
 * @param adwId - Workflow ID
 * @returns Result
 */
export async function cleanupWorkflow(adwId: string): Promise<WorkflowResult> {
  try {
    logger.info({ adwId }, 'Cleaning up workflow');

    const workflow = await getWorkflowState(adwId);
    if (!workflow) {
      return {
        success: false,
        output: '',
        error: `Workflow ${adwId} not found`,
      };
    }

    // Remove worktree if it exists
    if (workflow.worktreePath && workflow.worktreeExists) {
      await removeWorktree(adwId);
    }

    // Mark as cancelled in database
    await updateWorkflowState(adwId, {
      status: 'cancelled',
      worktreeExists: false,
    });

    broadcastWorkflowUpdate({
      type: 'workflow_updated',
      timestamp: new Date().toISOString(),
      adwId,
      data: { status: 'cancelled' },
    });

    return {
      success: true,
      output: `Workflow ${adwId} cancelled and cleaned up`,
    };
  } catch (error) {
    logger.error({ error, adwId }, 'Failed to cleanup workflow');
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Import WebSocket broadcaster
import {
  broadcastPhaseStarted,
  broadcastPhaseCompleted,
  broadcastWorkflowCompleted,
  broadcastWorkflowFailed,
  broadcastWorkflowUpdate,
} from '../websocket/adw-websocket-manager.js';

// Import utils
import { generateAdwId } from './utils.js';

// Import state manager
import { createWorkflowState, updateWorkflowState } from './state-manager.js';

// Import worktree manager
import { removeWorktree } from './worktree-manager.js';
```

---

## Implementation Checklist

### Week 1: Storage and Routes

- [ ] **R2 Storage Module**
  - [ ] Create `src/modules/storage/r2-uploader.ts`
  - [ ] Implement S3 client singleton
  - [ ] Implement `uploadFile()` function
  - [ ] Implement `uploadScreenshots()` batch function
  - [ ] Add R2 env vars to `env.ts` schema
  - [ ] Test uploads with sample files
  - [ ] Verify public URL generation

- [ ] **HTTP Routes**
  - [ ] Create `src/routes/adw.ts`
  - [ ] Implement `POST /api/adw/workflows` (create)
  - [ ] Implement `GET /api/adw/workflows` (list)
  - [ ] Implement `GET /api/adw/workflows/:adwId` (get)
  - [ ] Implement `POST /api/adw/workflows/:adwId/execute` (execute phase)
  - [ ] Implement `DELETE /api/adw/workflows/:adwId` (cancel)
  - [ ] Register routes in `server.ts`
  - [ ] Test all endpoints with curl/Postman

### Week 2: WebSocket and Webhooks

- [ ] **WebSocket Manager**
  - [ ] Create `src/modules/websocket/adw-websocket-manager.ts`
  - [ ] Implement client registration
  - [ ] Implement subscription filtering
  - [ ] Implement broadcast functions
  - [ ] Add heartbeat/ping-pong
  - [ ] Integrate with workflow-manager
  - [ ] Test real-time updates

- [ ] **Workflow Manager Extensions**
  - [ ] Add `createWorkflow()` function
  - [ ] Add `executeWorkflowPhase()` function
  - [ ] Add `executeCustomPrompt()` function
  - [ ] Add `executeFullWorkflow()` function
  - [ ] Add `cleanupWorkflow()` function
  - [ ] Integrate WebSocket broadcasts
  - [ ] Test workflow lifecycle

- [ ] **GitHub Webhooks**
  - [ ] Create `src/routes/webhooks.ts`
  - [ ] Implement signature verification
  - [ ] Implement issue_comment handler
  - [ ] Implement issues (labeled) handler
  - [ ] Add loop prevention (ADW_BOT_IDENTIFIER check)
  - [ ] Register webhook routes
  - [ ] Test with ngrok/Coolify public URL
  - [ ] Configure webhook in GitHub repo settings

### Week 3: Integration and Testing

- [ ] **Environment Configuration**
  - [ ] Update `.env.sample` with all new variables
  - [ ] Document R2 setup process
  - [ ] Document webhook setup process
  - [ ] Verify all env vars in Zod schema

- [ ] **Integration Testing**
  - [ ] Test full workflow via HTTP API
  - [ ] Test full workflow via webhook trigger
  - [ ] Test WebSocket subscription and updates
  - [ ] Test R2 uploads during review phase
  - [ ] Test error handling and retries
  - [ ] Test concurrent workflows (2-3 simultaneous)

- [ ] **Documentation**
  - [ ] Update orchestrator_ts README
  - [ ] Add API documentation
  - [ ] Add webhook setup guide
  - [ ] Add R2 configuration guide
  - [ ] Update CONTEXT_MAP.md

- [ ] **Deployment Preparation**
  - [ ] Update Coolify configuration
  - [ ] Add webhook URL to documentation
  - [ ] Configure GitHub webhook in production repo
  - [ ] Set up R2 bucket in Cloudflare
  - [ ] Test deployment on Coolify

---

## Success Criteria

Phase 3 is complete when:

1. ✅ **R2 Storage Working**
   - Files upload successfully to Cloudflare R2
   - Public URLs are generated correctly
   - Graceful degradation when R2 not configured

2. ✅ **HTTP API Functional**
   - All 5 ADW endpoints respond correctly
   - Request validation with Zod works
   - Error handling returns appropriate status codes
   - Workflows can be created and executed via API

3. ✅ **WebSocket Real-time Updates**
   - Clients can connect and subscribe
   - Workflow events broadcast in real-time
   - Subscription filtering works
   - Heartbeat prevents connection drops

4. ✅ **GitHub Webhooks Operational**
   - Webhooks verified with HMAC signature
   - Issue comments trigger workflows
   - Issue labels trigger workflows
   - Loop prevention works (no infinite webhook loops)

5. ✅ **Complete Workflow Execution**
   - Full SDLC workflow runs end-to-end via webhook
   - Worktree created, code implemented, PR created
   - All phases broadcast updates via WebSocket
   - Screenshots uploaded to R2

6. ✅ **Production Ready**
   - All environment variables documented
   - Comprehensive error handling
   - Structured logging throughout
   - Deployment guide for Coolify

---

## Phase 4 Preview

After Phase 3 completion, Phase 4 will focus on:

1. **MCP Tool Integration** - Expose ADW operations as tools to orchestrator agent
2. **Orchestrator Service Integration** - Connect ADW to main orchestrator
3. **Slash Command Migration** - Convert remaining slash commands to TypeScript
4. **Frontend UI Components** - Build React UI for ADW workflows
5. **Advanced Workflows** - Implement complex multi-phase workflows

---

## Files Created in Phase 3

```
apps/orchestrator_ts/
├── src/
│   ├── modules/
│   │   ├── storage/
│   │   │   └── r2-uploader.ts          (~250 lines - NEW)
│   │   │
│   │   ├── websocket/
│   │   │   └── adw-websocket-manager.ts (~350 lines - NEW)
│   │   │
│   │   └── adw/
│   │       └── workflow-manager.ts     (UPDATE - add ~200 lines)
│   │
│   └── routes/
│       ├── adw.ts                      (~400 lines - NEW)
│       └── webhooks.ts                  (~350 lines - NEW)
│
└── .env.sample                         (UPDATE - add R2/webhook vars)
```

**Total New Code**: ~1,350 lines
**Updated Code**: ~200 lines in workflow-manager.ts

---

**Phase 3 Timeline**: 2-3 weeks
**Phase 3 Goal**: Complete integration layer enabling production ADW workflows
**Phase 3 Status**: Ready for implementation

