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
 * Parse issue body for ADW configuration
 *
 * Extracts workflow configuration from issue body using the pattern:
 * - workflow: plan-build
 * - model_set: base | heavy
 * - Options: --skip-e2e, --skip-tests
 *
 * @param body - Issue body text
 * @returns Workflow configuration object
 */
function parseIssueBody(body: string): {
  workflowType: WorkflowType | null;
  modelSet: 'base' | 'heavy';
  options: {
    skipE2E: boolean;
    skipTests: boolean;
    autoResolve: boolean;
  };
} {
  const lowerBody = body.toLowerCase();

  // Parse workflow type
  let workflowType: WorkflowType | null = null;
  const workflowMatch = lowerBody.match(/workflow:\s*([\w-]+)/);
  if (workflowMatch) {
    const type = workflowMatch[1];
    // Validate against known workflow types
    const validTypes = ['plan', 'build', 'test', 'review', 'document', 'ship', 'plan-build', 'plan-build-test', 'plan-build-review', 'plan-build-test-review', 'sdlc', 'zte', 'patch'];
    if (validTypes.includes(type)) {
      workflowType = type as WorkflowType;
    }
  }

  // Parse model set
  let modelSet: 'base' | 'heavy' = 'base';
  const modelMatch = lowerBody.match(/model_set:\s*(base|heavy)/);
  if (modelMatch) {
    modelSet = modelMatch[1] as 'base' | 'heavy';
  }

  // Parse options
  const skipE2E = lowerBody.includes('--skip-e2e') || lowerBody.includes('skip_e2e: true');
  const skipTests = lowerBody.includes('--skip-tests') || lowerBody.includes('skip_tests: true');
  const autoResolve = !lowerBody.includes('--no-auto-resolve') && !lowerBody.includes('auto_resolve: false');

  return {
    workflowType,
    modelSet,
    options: {
      skipE2E,
      skipTests,
      autoResolve,
    },
  };
}

/**
 * Extract ADW workflow type from issue labels
 *
 * Looks for labels like:
 * - "adw:feature" -> sdlc workflow
 * - "adw:bug" -> sdlc workflow
 * - "adw:plan" -> plan workflow
 * - "adw:plan-build" -> plan-build workflow
 * - "adw:sdlc" -> sdlc workflow
 * - "adw:zte" -> zte workflow
 *
 * @param labels - Issue labels
 * @returns Workflow type if ADW label found, null otherwise
 */
function getWorkflowFromLabels(labels: Array<{ name: string }>): WorkflowType | null {
  for (const label of labels) {
    if (label.name.startsWith('adw:')) {
      const labelType = label.name.split(':')[1];

      // Map label types to workflow types
      switch (labelType) {
        case 'plan-build':
          return 'plan-build';
        case 'plan-build-test':
          return 'plan-build-test';
        case 'plan-build-review':
          return 'plan-build-review';
        case 'plan-build-test-review':
          return 'plan-build-test-review';
        case 'sdlc':
          return 'sdlc';
        case 'zte':
          return 'zte';
        case 'feature':
        case 'bug':
        case 'chore':
          return 'sdlc'; // Default to full SDLC for issue types
        case 'plan':
          return 'plan';
        case 'build':
          return 'build';
        case 'test':
          return 'test';
        case 'review':
          return 'review';
        case 'document':
          return 'document';
        case 'patch':
          return 'patch';
        default:
          logger.warn({ label: label.name }, 'Unknown ADW label type');
      }
    }
  }

  return null;
}

/**
 * Parse comment text for workflow trigger
 *
 * Detects trigger patterns like:
 * - "adw" → default workflow (plan-build)
 * - "adw sdlc" → sdlc workflow
 * - "adw zte" → zte workflow
 * - "adw zte heavy" → zte with heavy model set
 * - "adw plan-build base" → plan-build with base model
 *
 * @param comment - Comment text
 * @returns Workflow configuration if trigger found, null otherwise
 */
function parseCommentTrigger(comment: string): {
  workflowType: WorkflowType;
  modelSet: 'base' | 'heavy';
} | null {
  // Skip comments from ADW bot itself (loop prevention)
  if (comment.includes(ADW_BOT_IDENTIFIER)) {
    return null;
  }

  const lowerComment = comment.toLowerCase().trim();

  // Check for "adw" trigger
  if (!lowerComment.includes('adw')) {
    return null;
  }

  // Extract workflow type and model set
  let workflowType: WorkflowType = 'plan-build'; // Default
  let modelSet: 'base' | 'heavy' = 'base'; // Default

  // Pattern: adw [workflow-type] [model-set]
  const match = lowerComment.match(/\badw\s+([\w-]+)?(?:\s+(base|heavy))?/);
  if (match) {
    const type = match[1];
    const model = match[2];

    // Parse workflow type
    if (type) {
      const validTypes = ['plan-build', 'plan-build-test', 'plan-build-review', 'plan-build-test-review', 'sdlc', 'zte', 'patch'];
      if (validTypes.includes(type)) {
        workflowType = type as WorkflowType;
      }
    }

    // Parse model set
    if (model) {
      modelSet = model as 'base' | 'heavy';
    }
  }

  return { workflowType, modelSet };
}

/**
 * Check if event is a duplicate (prevents double-processing)
 *
 * Uses a simple in-memory cache with TTL to detect duplicate webhook events.
 * In production, this should use Redis or database.
 *
 * @param eventId - GitHub webhook event ID
 * @returns True if event was already processed
 */
const processedEvents = new Map<string, number>();
const EVENT_TTL_MS = 10 * 60 * 1000; // 10 minutes

function isDuplicateEvent(eventId: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  for (const [id, timestamp] of processedEvents.entries()) {
    if (now - timestamp > EVENT_TTL_MS) {
      processedEvents.delete(id);
    }
  }

  // Check if event was already processed
  if (processedEvents.has(eventId)) {
    return true;
  }

  // Mark event as processed
  processedEvents.set(eventId, now);
  return false;
}

/**
 * Extract ADW workflow type from issue comment (legacy function, now uses parseCommentTrigger)
 *
 * @param commentBody - Comment text
 * @returns Workflow type if found, null otherwise
 * @deprecated Use parseCommentTrigger instead for more flexibility
 */
function extractWorkflowTypeFromComment(commentBody: string): WorkflowType | null {
  const config = parseCommentTrigger(commentBody);
  return config?.workflowType || null;
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

  // Parse comment for workflow trigger
  const config = parseCommentTrigger(comment.body);
  if (!config) {
    logger.debug({ issueNumber: issue.number }, 'No ADW workflow trigger found in comment');
    return;
  }

  logger.info(
    { issueNumber: issue.number, workflowType: config.workflowType, modelSet: config.modelSet, commenter: comment.user.login },
    'ADW workflow triggered by comment'
  );

  // Create and execute workflow asynchronously
  const result = await WorkflowManager.createWorkflow(issue.number, config.workflowType, config.modelSet);

  if (result.success && result.adwId) {
    // Execute workflow in background (don't await)
    WorkflowManager.executeWorkflow(result.adwId, config.workflowType).catch((error) => {
      logger.error({ error, adwId: result.adwId, issueNumber: issue.number }, 'Workflow execution failed');
    });
  } else {
    logger.error({ error: result.error, issueNumber: issue.number }, 'Failed to create workflow');
  }
}

/**
 * Handle issues webhook event
 *
 * Triggers ADW workflow if:
 * - Issue is labeled with adw:* label
 * - Issue is opened with workflow configuration in body
 */
async function handleIssue(payload: IssuePayload): Promise<void> {
  const { action, issue, label } = payload;

  // Handle labeled event
  if (action === 'labeled') {
    // Check if the added label is an ADW trigger
    if (!label || !label.name.startsWith('adw:')) {
      return;
    }

    logger.info({ issueNumber: issue.number, label: label.name }, 'ADW workflow triggered by label');

    // Extract workflow type from label
    const workflowType = getWorkflowFromLabels([label]);
    if (!workflowType) {
      logger.warn({ label: label.name }, 'ADW label found but workflow type could not be determined');
      return;
    }

    // Parse issue body for model set
    const bodyConfig = parseIssueBody(issue.body);

    // Create and execute workflow asynchronously
    const result = await WorkflowManager.createWorkflow(issue.number, workflowType, bodyConfig.modelSet);

    if (result.success && result.adwId) {
      // Execute workflow in background (don't await)
      WorkflowManager.executeWorkflow(result.adwId, workflowType).catch((error) => {
        logger.error({ error, adwId: result.adwId, issueNumber: issue.number }, 'Workflow execution failed');
      });
    } else {
      logger.error({ error: result.error, issueNumber: issue.number }, 'Failed to create workflow');
    }
    return;
  }

  // Handle opened event (automatic workflow creation based on body)
  if (action === 'opened') {
    // Parse issue body for workflow configuration
    const bodyConfig = parseIssueBody(issue.body);

    // Check if workflow type is specified
    if (!bodyConfig.workflowType) {
      // Try to detect workflow from labels
      const labelWorkflowType = getWorkflowFromLabels(issue.labels);
      if (!labelWorkflowType) {
        logger.debug({ issueNumber: issue.number }, 'No ADW workflow configuration found in body or labels');
        return;
      }
      bodyConfig.workflowType = labelWorkflowType;
    }

    logger.info(
      {
        issueNumber: issue.number,
        workflowType: bodyConfig.workflowType,
        modelSet: bodyConfig.modelSet,
      },
      'ADW workflow triggered by issue creation'
    );

    // Create and execute workflow asynchronously
    const result = await WorkflowManager.createWorkflow(
      issue.number,
      bodyConfig.workflowType,
      bodyConfig.modelSet
    );

    if (result.success && result.adwId) {
      // Execute workflow in background (don't await)
      WorkflowManager.executeWorkflow(result.adwId, bodyConfig.workflowType).catch((error) => {
        logger.error({ error, adwId: result.adwId, issueNumber: issue.number }, 'Workflow execution failed');
      });
    } else {
      logger.error({ error: result.error, issueNumber: issue.number }, 'Failed to create workflow');
    }
    return;
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

        // Check for duplicate event
        if (isDuplicateEvent(deliveryId)) {
          logger.warn({ deliveryId }, 'Duplicate webhook event, skipping processing');
          return reply.code(200).send({ received: true, duplicate: true });
        }

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
