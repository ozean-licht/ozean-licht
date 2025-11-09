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
