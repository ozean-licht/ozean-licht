/**
 * Application Constants
 *
 * Central location for application-wide constants and configuration values.
 */

// ============================================================================
// LOG QUERY LIMITS
// ============================================================================

/**
 * Default limit for initial event history load on app startup
 *
 * Backend uses smart summarization to keep token count reasonable
 */
export const DEFAULT_EVENT_HISTORY_LIMIT = 300

/**
 * Default limit for chat history queries
 *
 * Loads full 300 message history, but backend applies smart summarization:
 * - Recent messages (0-30): Kept in full detail
 * - Mid-range (31-100): Light summarization
 * - Old messages (101+): Heavy summarization into conversation segments
 *
 * This allows orchestrator to remember user intent from 200+ messages ago
 * while keeping total context under ~40-50k tokens
 */
export const DEFAULT_CHAT_HISTORY_LIMIT = 300
