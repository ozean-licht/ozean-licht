/**
 * Error Notifier Module
 *
 * Provides error notification and alerting capabilities for ADW workflows.
 * Sends notifications to external systems (webhooks, Slack, email, etc.) when
 * errors occur that require attention or intervention.
 *
 * Key Features:
 * - Webhook notification support
 * - Error severity-based notification routing
 * - Database logging of error notifications
 * - Rate limiting to prevent notification storms
 * - Configurable notification channels
 * - Notification history tracking
 *
 * Notification Strategy:
 * - CRITICAL errors: Immediate notification to all channels
 * - HIGH errors: Notification to primary channels
 * - MEDIUM errors: Notification in production only
 * - LOW errors: Logged only, no notifications
 *
 * @module modules/adw/error-notifier
 */

import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import {
  EnrichedError,
  ErrorSeverity,
  extractErrorDetails,
  shouldAlert,
} from './error-handler.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Error notification payload
 *
 * Contains all information needed to send an error notification.
 */
export interface ErrorNotification {
  /** Workflow identifier */
  adwId: string;

  /** Workflow phase where error occurred */
  phase: string;

  /** Enriched error with full context */
  error: EnrichedError;

  /** Error severity level */
  severity: ErrorSeverity;

  /** Timestamp when notification was created */
  timestamp: Date;

  /** Whether this error requires manual intervention */
  requiresIntervention: boolean;

  /** GitHub issue number if applicable */
  issueNumber?: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Notification channel type
 */
export enum NotificationChannel {
  WEBHOOK = 'webhook',
  DATABASE = 'database',
  CONSOLE = 'console',
}

/**
 * Notification delivery result
 */
export interface NotificationResult {
  /** Whether notification was sent successfully */
  success: boolean;

  /** Channel used for notification */
  channel: NotificationChannel;

  /** Error message if delivery failed */
  error?: string;

  /** Timestamp of delivery attempt */
  timestamp: Date;
}

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Rate limiter for error notifications
 *
 * Prevents notification storms by limiting the rate of notifications
 * for the same error type.
 */
class NotificationRateLimiter {
  private recentNotifications: Map<string, Date[]> = new Map();
  private readonly windowMs = 300000; // 5 minutes
  private readonly maxNotificationsPerWindow = 10;

  /**
   * Check if notification should be allowed
   *
   * @param key - Notification key (e.g., 'adw-abc123-build-error')
   * @returns True if notification should be sent
   */
  shouldNotify(key: string): boolean {
    const now = new Date();
    const recent = this.recentNotifications.get(key) || [];

    // Remove notifications outside the window
    const withinWindow = recent.filter(
      (timestamp) => now.getTime() - timestamp.getTime() < this.windowMs
    );

    // Check if under limit
    if (withinWindow.length >= this.maxNotificationsPerWindow) {
      logger.warn(
        {
          key,
          count: withinWindow.length,
          limit: this.maxNotificationsPerWindow,
          windowMs: this.windowMs,
        },
        'Notification rate limit exceeded'
      );
      return false;
    }

    // Record this notification
    withinWindow.push(now);
    this.recentNotifications.set(key, withinWindow);

    return true;
  }

  /**
   * Reset rate limiter for specific key
   *
   * @param key - Notification key
   */
  reset(key: string): void {
    this.recentNotifications.delete(key);
  }

  /**
   * Clear all rate limiting data
   */
  clear(): void {
    this.recentNotifications.clear();
  }
}

// Singleton rate limiter
const rateLimiter = new NotificationRateLimiter();

// ============================================================================
// Notification Formatting
// ============================================================================

/**
 * Format error notification for webhook payload
 *
 * Creates a structured payload suitable for external notification systems.
 *
 * @param notification - Error notification to format
 * @returns Formatted webhook payload
 */
function formatWebhookPayload(notification: ErrorNotification): Record<string, unknown> {
  const errorDetails = extractErrorDetails(notification.error);

  return {
    type: 'adw_error_notification',
    version: '1.0',
    timestamp: notification.timestamp.toISOString(),
    severity: notification.severity,
    requiresIntervention: notification.requiresIntervention,
    workflow: {
      adwId: notification.adwId,
      phase: notification.phase,
      issueNumber: notification.issueNumber,
    },
    error: {
      category: errorDetails.category,
      message: errorDetails.message,
      originalMessage: errorDetails.originalMessage,
      stack: errorDetails.stack,
      context: errorDetails.context,
    },
    metadata: notification.metadata,
    // Include actionable information
    actions: notification.requiresIntervention
      ? [
          {
            type: 'manual_intervention',
            description: 'This error requires manual intervention',
            url: `${env.HOST}:${env.PORT}/api/adw/workflows/${notification.adwId}`,
          },
        ]
      : [],
  };
}

/**
 * Format error notification for Slack
 *
 * Creates a Slack-formatted message with blocks and attachments.
 *
 * @param notification - Error notification to format
 * @returns Slack message payload
 */
function formatSlackPayload(notification: ErrorNotification): Record<string, unknown> {
  const severityEmoji: Record<ErrorSeverity, string> = {
    [ErrorSeverity.CRITICAL]: ':rotating_light:',
    [ErrorSeverity.HIGH]: ':warning:',
    [ErrorSeverity.MEDIUM]: ':exclamation:',
    [ErrorSeverity.LOW]: ':information_source:',
  };

  const severityColor: Record<ErrorSeverity, string> = {
    [ErrorSeverity.CRITICAL]: '#ff0000',
    [ErrorSeverity.HIGH]: '#ff6600',
    [ErrorSeverity.MEDIUM]: '#ffcc00',
    [ErrorSeverity.LOW]: '#cccccc',
  };

  return {
    text: `${severityEmoji[notification.severity]} ADW Error: ${notification.error.formattedMessage}`,
    attachments: [
      {
        color: severityColor[notification.severity],
        fields: [
          {
            title: 'ADW ID',
            value: notification.adwId,
            short: true,
          },
          {
            title: 'Phase',
            value: notification.phase,
            short: true,
          },
          {
            title: 'Severity',
            value: notification.severity.toUpperCase(),
            short: true,
          },
          {
            title: 'Category',
            value: notification.error.category.toUpperCase(),
            short: true,
          },
          {
            title: 'Error',
            value: notification.error.originalError?.message || 'Unknown error',
            short: false,
          },
          ...(notification.requiresIntervention
            ? [
                {
                  title: 'Action Required',
                  value: ':rotating_light: Manual intervention required',
                  short: false,
                },
              ]
            : []),
        ],
        footer: 'ADW System',
        ts: Math.floor(notification.timestamp.getTime() / 1000),
      },
    ],
  };
}

// ============================================================================
// Notification Delivery
// ============================================================================

/**
 * Send error notification via webhook
 *
 * Posts error notification to configured webhook URL.
 *
 * @param notification - Error notification to send
 * @returns Promise resolving to delivery result
 */
async function sendWebhookNotification(
  notification: ErrorNotification
): Promise<NotificationResult> {
  const webhookUrl = process.env.ERROR_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.debug('ERROR_WEBHOOK_URL not configured, skipping webhook notification');
    return {
      success: false,
      channel: NotificationChannel.WEBHOOK,
      error: 'Webhook URL not configured',
      timestamp: new Date(),
    };
  }

  try {
    const payload = formatWebhookPayload(notification);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    logger.info(
      {
        adwId: notification.adwId,
        severity: notification.severity,
        webhookUrl,
      },
      'Error notification sent via webhook'
    );

    return {
      success: true,
      channel: NotificationChannel.WEBHOOK,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(
      {
        error,
        adwId: notification.adwId,
        webhookUrl,
      },
      'Failed to send webhook notification'
    );

    return {
      success: false,
      channel: NotificationChannel.WEBHOOK,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    };
  }
}

/**
 * Log error notification to database
 *
 * Stores error notification in database for historical tracking.
 * Note: This is a placeholder - actual database implementation would use Prisma.
 *
 * @param notification - Error notification to log
 * @returns Promise resolving to delivery result
 */
async function logNotificationToDatabase(
  notification: ErrorNotification
): Promise<NotificationResult> {
  try {
    // TODO: Implement database logging using Prisma
    // This would insert into adw_workflow_events table with type='error'

    logger.debug(
      {
        adwId: notification.adwId,
        phase: notification.phase,
        severity: notification.severity,
      },
      'Error notification logged to database (placeholder)'
    );

    return {
      success: true,
      channel: NotificationChannel.DATABASE,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(
      {
        error,
        adwId: notification.adwId,
      },
      'Failed to log notification to database'
    );

    return {
      success: false,
      channel: NotificationChannel.DATABASE,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    };
  }
}

/**
 * Log error notification to console
 *
 * Logs error notification using structured logger.
 *
 * @param notification - Error notification to log
 * @returns Delivery result
 */
function logNotificationToConsole(notification: ErrorNotification): NotificationResult {
  logger.error(
    {
      adwId: notification.adwId,
      phase: notification.phase,
      severity: notification.severity,
      category: notification.error.category,
      requiresIntervention: notification.requiresIntervention,
      errorMessage: notification.error.formattedMessage,
    },
    'Error notification'
  );

  return {
    success: true,
    channel: NotificationChannel.CONSOLE,
    timestamp: new Date(),
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Send error notification
 *
 * Main entry point for sending error notifications. Handles:
 * - Rate limiting to prevent notification storms
 * - Channel selection based on severity and configuration
 * - Multiple delivery attempts
 * - Result tracking
 *
 * @param notification - Error notification to send
 * @returns Promise resolving to array of delivery results
 *
 * @example
 * ```typescript
 * try {
 *   await operation();
 * } catch (error) {
 *   const enriched = enrichError(error, context);
 *
 *   if (shouldAlert(enriched)) {
 *     await notifyError({
 *       adwId: context.adwId,
 *       phase: context.phase,
 *       error: enriched,
 *       severity: enriched.severity,
 *       timestamp: new Date(),
 *       requiresIntervention: enriched.requiresIntervention,
 *     });
 *   }
 * }
 * ```
 */
export async function notifyError(
  notification: ErrorNotification
): Promise<NotificationResult[]> {
  // Check if notifications are enabled
  const notificationsEnabled = process.env.ERROR_NOTIFICATION_ENABLED !== 'false';
  if (!notificationsEnabled) {
    logger.debug('Error notifications disabled, skipping');
    return [];
  }

  // Generate rate limit key
  const rateLimitKey = `${notification.adwId}-${notification.phase}-${notification.severity}`;

  // Check rate limit
  if (!rateLimiter.shouldNotify(rateLimitKey)) {
    logger.warn(
      {
        adwId: notification.adwId,
        phase: notification.phase,
        severity: notification.severity,
      },
      'Error notification rate limited'
    );
    return [];
  }

  // Determine if we should send alerts based on severity and environment
  const shouldSendAlert = shouldAlert(notification.error, env.NODE_ENV);

  if (!shouldSendAlert) {
    logger.debug(
      {
        adwId: notification.adwId,
        severity: notification.severity,
        environment: env.NODE_ENV,
      },
      'Error notification not required for this severity/environment'
    );
    // Still log to console
    return [logNotificationToConsole(notification)];
  }

  logger.info(
    {
      adwId: notification.adwId,
      phase: notification.phase,
      severity: notification.severity,
      requiresIntervention: notification.requiresIntervention,
    },
    'Sending error notification'
  );

  // Send notifications to all configured channels
  const results: NotificationResult[] = [];

  // Always log to console
  results.push(logNotificationToConsole(notification));

  // Log to database
  results.push(await logNotificationToDatabase(notification));

  // Send webhook notification if configured
  if (process.env.ERROR_WEBHOOK_URL) {
    results.push(await sendWebhookNotification(notification));
  }

  // Log results
  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;

  logger.info(
    {
      adwId: notification.adwId,
      successCount,
      failureCount,
      totalChannels: results.length,
    },
    'Error notification delivery complete'
  );

  return results;
}

/**
 * Create error notification from enriched error
 *
 * Convenience function to create a notification from an enriched error
 * and workflow context.
 *
 * @param error - Enriched error
 * @param additionalMetadata - Optional additional metadata
 * @returns Error notification ready to send
 *
 * @example
 * ```typescript
 * const enriched = enrichError(error, context);
 * const notification = createErrorNotification(enriched, {
 *   attemptNumber: 3,
 *   totalAttempts: 3,
 * });
 * await notifyError(notification);
 * ```
 */
export function createErrorNotification(
  error: EnrichedError,
  additionalMetadata?: Record<string, unknown>
): ErrorNotification {
  return {
    adwId: error.context.adwId,
    phase: error.context.phase,
    error,
    severity: error.severity,
    timestamp: error.timestamp,
    requiresIntervention: error.requiresIntervention,
    issueNumber: error.context.issueNumber,
    metadata: {
      ...error.context.metadata,
      ...additionalMetadata,
    },
  };
}

/**
 * Test error notification system
 *
 * Sends a test notification to verify configuration.
 * Useful for testing webhook endpoints and notification channels.
 *
 * @returns Promise resolving to delivery results
 */
export async function testNotificationSystem(): Promise<NotificationResult[]> {
  logger.info('Testing error notification system');

  // Create a test error
  const testError = new Error('Test notification - please ignore');
  const enrichedError = {
    name: 'EnrichedError',
    message: '[TEST/LOW] Test notification',
    originalError: testError,
    category: 'TRANSIENT' as any,
    severity: ErrorSeverity.LOW,
    context: {
      adwId: 'test-notification',
      phase: 'test',
      operation: 'test-notification-system',
    },
    timestamp: new Date(),
    requiresIntervention: false,
    formattedMessage: '[TEST/LOW] ADW test-notification (test): Test notification',
    stack: testError.stack,
  } as EnrichedError;

  const notification: ErrorNotification = {
    adwId: 'test-notification',
    phase: 'test',
    error: enrichedError,
    severity: ErrorSeverity.LOW,
    timestamp: new Date(),
    requiresIntervention: false,
    metadata: {
      isTest: true,
    },
  };

  return notifyError(notification);
}

/**
 * Clear notification rate limiter
 *
 * Resets rate limiting for all notifications.
 * Useful for testing or manual intervention.
 */
export function clearNotificationRateLimiter(): void {
  rateLimiter.clear();
  logger.info('Notification rate limiter cleared');
}
