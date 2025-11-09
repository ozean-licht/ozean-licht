/**
 * Orchestrator Service
 *
 * Unified TypeScript orchestrator that combines chat-based orchestration
 * with ADW workflow management. This service replaces the Python
 * orchestrator_service.py with native TypeScript implementation.
 *
 * Key responsibilities:
 * - Initialize orchestrator agent with ADW tools
 * - Manage chat sessions and history
 * - Track token usage and costs
 * - Coordinate between chat interface and ADW workflows
 *
 * @module services/orchestrator-service
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type { Query, SDKMessage, Options } from '@anthropic-ai/claude-agent-sdk';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { createAdwMcpServer } from '../tools/adw-mcp-tools.js';
import {
  getOrCreateOrchestrator,
  updateOrchestratorSession,
  updateOrchestratorCosts,
  saveOrchestratorChat,
} from '../database/queries/orchestrator.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Orchestrator message for chat interface
 */
export interface OrchestratorMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Orchestrator session state
 */
interface OrchestratorSession {
  orchestratorId: string;
  sessionId: string;
  chatHistory: OrchestratorMessage[];
  totalTokens: number;
  totalCost: number;
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Active orchestrator session
 * Singleton pattern - one session per orchestrator instance
 */
let currentSession: OrchestratorSession | null = null;

// ============================================================================
// Orchestrator Initialization
// ============================================================================

/**
 * Initialize orchestrator with ADW tools
 *
 * Creates or retrieves the orchestrator from database and initializes
 * a new session with ADW MCP tools registered.
 *
 * @param workingDir - Orchestrator working directory
 * @returns Orchestrator session
 */
export async function initializeOrchestrator(
  workingDir: string = env.ORCHESTRATOR_WORKING_DIR
): Promise<OrchestratorSession> {
  logger.info({ workingDir }, 'Initializing orchestrator service');

  // Get or create orchestrator in database
  const orchestrator = await getOrCreateOrchestrator(workingDir);

  // Generate new session ID
  const sessionId = `orch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Update session in database
  await updateOrchestratorSession(orchestrator.id, sessionId);

  // Initialize session state
  currentSession = {
    orchestratorId: orchestrator.id,
    sessionId,
    chatHistory: [],
    totalTokens: 0,
    totalCost: 0,
  };

  logger.info(
    { orchestratorId: orchestrator.id, sessionId },
    'Orchestrator initialized successfully'
  );

  return currentSession;
}

/**
 * Get current orchestrator session
 *
 * @returns Current session or null if not initialized
 */
export function getCurrentSession(): OrchestratorSession | null {
  return currentSession;
}

// ============================================================================
// Chat Execution
// ============================================================================

/**
 * Execute orchestrator query with ADW tools
 *
 * Sends a user message to the orchestrator agent and streams back the response.
 * The agent has access to ADW workflow tools via MCP.
 *
 * @param userMessage - User's chat message
 * @param onStreamChunk - Optional callback for streaming chunks
 * @returns Assistant's response
 */
export async function executeOrchestratorQuery(
  userMessage: string,
  onStreamChunk?: (chunk: string) => void
): Promise<string> {
  if (!currentSession) {
    throw new Error('Orchestrator not initialized. Call initializeOrchestrator() first.');
  }

  logger.info(
    { sessionId: currentSession.sessionId, messageLength: userMessage.length },
    'Executing orchestrator query'
  );

  // Add user message to history
  currentSession.chatHistory.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  });

  try {
    // Build Agent SDK options with ADW tools
    const options: Partial<Options> = {
      model: env.ORCHESTRATOR_MODEL,
      cwd: env.ORCHESTRATOR_WORKING_DIR,
      permissionMode: 'default', // Use default (ask) for orchestrator chat
      maxTurns: 100,

      // Register ADW tools as SDK MCP server
      // Note: Using the createAdwMcpServer() function from adw-mcp-tools.ts
      mcpServers: {
        'adw-workflows': {
          type: 'sdk',
          instance: {
            // MCP server instance from createSdkMcpServer()
            // Uses the tools array returned by getAdwTools()
            ...createAdwMcpServer(),
          },
        },
        // Also connect to external MCP gateway
        'mcp-gateway': {
          type: 'http',
          url: env.MCP_GATEWAY_URL,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      } as any, // Type assertion due to SDK version differences
    };

    // Execute query with Agent SDK
    const queryStream: Query = query({
      prompt: userMessage,
      options,
    });

    // Collect response
    const responseChunks: string[] = [];
    let inputTokens = 0;
    let outputTokens = 0;
    let costUsd = 0;

    for await (const message of queryStream) {
      switch (message.type) {
        case 'assistant':
          // Extract text from assistant message
          const text = (message as any).text || JSON.stringify(message);
          responseChunks.push(text);
          if (onStreamChunk) {
            onStreamChunk(text);
          }
          break;

        case 'result':
          // Extract token usage and costs
          inputTokens = (message as any).usage?.input_tokens || 0;
          outputTokens = (message as any).usage?.output_tokens || 0;
          costUsd = (message as any).total_cost_usd || 0;
          break;
      }
    }

    const assistantResponse = responseChunks.join('\n');

    // Add assistant response to history
    currentSession.chatHistory.push({
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date(),
    });

    // Update token counts
    currentSession.totalTokens += inputTokens + outputTokens;
    currentSession.totalCost += costUsd;

    // Save to database
    await Promise.all([
      saveOrchestratorChat(
        currentSession.orchestratorId,
        currentSession.sessionId,
        userMessage,
        assistantResponse
      ),
      updateOrchestratorCosts(
        currentSession.orchestratorId,
        inputTokens,
        outputTokens,
        costUsd
      ),
    ]);

    logger.info(
      {
        sessionId: currentSession.sessionId,
        inputTokens,
        outputTokens,
        costUsd,
      },
      'Orchestrator query completed successfully'
    );

    return assistantResponse;
  } catch (error) {
    logger.error({ error, sessionId: currentSession.sessionId }, 'Orchestrator query failed');
    throw error;
  }
}

/**
 * Get chat history for current session
 *
 * @returns Array of chat messages
 */
export function getChatHistory(): OrchestratorMessage[] {
  return currentSession?.chatHistory || [];
}

/**
 * Clear chat history (start fresh conversation)
 */
export async function clearChatHistory(): Promise<void> {
  if (currentSession) {
    currentSession.chatHistory = [];
    currentSession.totalTokens = 0;
    currentSession.totalCost = 0;

    // Generate new session ID
    const newSessionId = `orch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    await updateOrchestratorSession(currentSession.orchestratorId, newSessionId);
    currentSession.sessionId = newSessionId;

    logger.info({ sessionId: newSessionId }, 'Chat history cleared, new session started');
  }
}

/**
 * Get session metrics
 *
 * @returns Current session token and cost metrics
 */
export function getSessionMetrics() {
  if (!currentSession) {
    return null;
  }

  return {
    sessionId: currentSession.sessionId,
    messageCount: currentSession.chatHistory.length,
    totalTokens: currentSession.totalTokens,
    totalCost: currentSession.totalCost,
  };
}
