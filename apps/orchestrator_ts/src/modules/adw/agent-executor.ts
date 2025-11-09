/**
 * Agent Executor Module
 *
 * Executes Claude Agent SDK agents for ADW workflows.
 * Replaces Python's subprocess-based Claude Code CLI execution with direct SDK integration.
 *
 * Key Migration Changes:
 * - Python: subprocess calls to `claude-code` CLI with JSONL parsing
 * - TypeScript: Direct Agent SDK `query()` function with streaming
 * - Provides better error handling, retry logic, and real-time progress tracking
 *
 * Migrated from Python: adws/adw_modules/agent.py
 *
 * @module modules/adw/agent-executor
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type { Query, SDKMessage, Options } from '@anthropic-ai/claude-agent-sdk';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import {
  AgentExecutionConfig,
  AgentExecutionResult,
  SLASH_COMMAND_MODEL_MAP,
  SlashCommand,
  ModelSet,
  RetryCode,
} from './types.js';
import { getWorkflowState } from './state-manager.js';

// ============================================================================
// Constants
// ============================================================================

/**
 * Maximum number of retry attempts for agent execution
 */
const MAX_RETRIES = 3;

/**
 * Exponential backoff base delay in milliseconds
 */
const RETRY_BASE_DELAY = 1000;

/**
 * Maximum agent execution timeout in milliseconds (10 minutes)
 */
const AGENT_TIMEOUT = 600000;

/**
 * Model name mapping from short names to SDK model identifiers
 */
const MODEL_NAME_MAP: Record<string, string> = {
  sonnet: 'claude-sonnet-4-5-20250929',
  opus: 'claude-opus-4-20250514',
  haiku: 'claude-3-5-haiku-20241022',
};

// ============================================================================
// Core Agent Execution
// ============================================================================

/**
 * Execute a Claude Agent SDK agent for an ADW workflow
 *
 * Replaces Python's `prompt_claude_code()` function.
 * Executes an agent with a specific slash command and arguments.
 *
 * Features:
 * - Direct Agent SDK integration (no subprocess)
 * - Automatic retry with exponential backoff
 * - Model selection based on slash command and model set
 * - Real-time streaming (optional callback)
 * - Comprehensive error handling
 *
 * @param config - Agent execution configuration
 * @param onStreamChunk - Optional callback for streaming agent output
 * @returns Execution result with success status and output
 *
 * @example
 * ```typescript
 * const result = await executeAgent({
 *   adwId: 'abc12345',
 *   agentName: 'planner',
 *   slashCommand: '/plan',
 *   args: ['123', 'abc12345'],
 * });
 *
 * if (result.success) {
 *   console.log('Agent output:', result.output);
 * } else {
 *   console.error('Agent failed:', result.error);
 * }
 * ```
 */
export async function executeAgent(
  config: AgentExecutionConfig,
  onStreamChunk?: (chunk: SDKMessage) => void
): Promise<AgentExecutionResult> {
  const { adwId, agentName, slashCommand, args, workingDir } = config;

  logger.info(
    {
      adwId,
      agentName,
      slashCommand,
      argsCount: args.length,
      workingDir,
    },
    'Starting agent execution'
  );

  // Get model for slash command
  const model = await getModelForSlashCommand(config);

  // Build prompt with slash command and arguments
  const prompt = buildPrompt(slashCommand, args);

  // Execute with retry logic
  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    attempt++;

    try {
      logger.debug(
        { adwId, attempt, maxRetries: MAX_RETRIES },
        'Attempting agent execution'
      );

      const result = await executeAgentQuery(
        prompt,
        model,
        workingDir || env.ADW_WORKING_DIR,
        config.dangerouslySkipPermissions || false,
        onStreamChunk
      );

      logger.info(
        {
          adwId,
          agentName,
          outputLength: result.output.length,
          attempt,
        },
        'Agent execution completed successfully'
      );

      return {
        success: true,
        output: result.output,
        sessionId: result.sessionId,
        retryCode: 'NONE',
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      logger.warn(
        {
          adwId,
          attempt,
          maxRetries: MAX_RETRIES,
          error: lastError.message,
        },
        'Agent execution attempt failed'
      );

      // Determine if error is retryable
      const retryCode = classifyError(lastError);

      if (retryCode === 'EXECUTION_ERROR' || attempt >= MAX_RETRIES) {
        // Non-retryable error or max retries reached
        logger.error(
          {
            adwId,
            agentName,
            retryCode,
            attempts: attempt,
          },
          'Agent execution failed permanently'
        );

        return {
          success: false,
          output: lastError.message,
          retryCode,
          error: lastError,
        };
      }

      // Wait before retry (exponential backoff)
      const delay = RETRY_BASE_DELAY * Math.pow(2, attempt - 1);
      logger.debug({ adwId, delay, nextAttempt: attempt + 1 }, 'Waiting before retry');
      await sleep(delay);
    }
  }

  // Max retries exhausted
  logger.error(
    {
      adwId,
      agentName,
      attempts: MAX_RETRIES,
    },
    'Agent execution failed after all retries'
  );

  return {
    success: false,
    output: lastError?.message || 'Unknown error after max retries',
    retryCode: 'EXECUTION_ERROR',
    error: lastError,
  };
}

/**
 * Execute a single agent query using the Agent SDK
 *
 * Internal function that performs the actual SDK call.
 *
 * @param prompt - The prompt/command to execute
 * @param model - Claude model to use
 * @param workingDir - Working directory for agent execution
 * @param skipPermissions - Whether to bypass permission checks
 * @param onStreamChunk - Optional streaming callback
 * @returns Execution result with output and session ID
 */
async function executeAgentQuery(
  prompt: string,
  model: string,
  workingDir: string,
  skipPermissions: boolean,
  onStreamChunk?: (chunk: SDKMessage) => void
): Promise<{ output: string; sessionId: string }> {
  // Build Agent SDK options
  const options: Partial<Options> = {
    model,
    cwd: workingDir,
    // Permission mode: bypassPermissions for ADW workflows, default for interactive
    permissionMode: skipPermissions ? 'bypassPermissions' : 'default',
    maxTurns: 100,
    // Note: API key is set via ANTHROPIC_API_KEY environment variable
    // No timeout field in Options - handled by SDK internally
  };

  logger.debug(
    {
      model,
      workingDir,
      permissionMode: options.permissionMode,
    },
    'Executing Agent SDK query'
  );

  // Execute query
  const queryStream: Query = query({ prompt, options });

  // Collect output
  const outputChunks: string[] = [];
  let sessionId = '';

  try {
    for await (const message of queryStream) {
      // Call streaming callback if provided
      if (onStreamChunk) {
        onStreamChunk(message);
      }

      // Process message based on type
      switch (message.type) {
        case 'assistant':
          // Collect assistant messages - extract text content
          // SDKAssistantMessage uses text field for simple text output
          const text = (message as any).text || JSON.stringify(message);
          outputChunks.push(text);
          break;

        case 'result':
          // Extract session ID from result (uses snake_case)
          if ((message as any).session_id) {
            sessionId = (message as any).session_id;
          }
          break;
      }
    }

    const output = outputChunks.join('\n').trim();

    if (!output) {
      logger.warn('Agent produced no output');
      throw new Error('Agent produced no output');
    }

    return { output, sessionId };
  } catch (error) {
    logger.error({ error }, 'Agent SDK query failed');
    throw error;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the appropriate Claude model for a slash command
 *
 * Determines model based on:
 * 1. Explicit model override in config
 * 2. Workflow model set (base or heavy)
 * 3. Slash command defaults from SLASH_COMMAND_MODEL_MAP
 *
 * @param config - Agent execution configuration
 * @returns Claude model identifier (e.g., 'claude-sonnet-4-5-20250929')
 */
async function getModelForSlashCommand(config: AgentExecutionConfig): Promise<string> {
  // If explicit model provided, use it
  if (config.model) {
    return MODEL_NAME_MAP[config.model] || config.model;
  }

  // Get workflow state to determine model set
  let modelSet: ModelSet = 'base';
  try {
    const workflow = await getWorkflowState(config.adwId);
    if (workflow?.modelSet) {
      modelSet = workflow.modelSet as ModelSet;
    }
  } catch (error) {
    logger.warn(
      { adwId: config.adwId, error },
      'Failed to get workflow model set, using base'
    );
  }

  // Look up model from command map
  const commandModelMap = SLASH_COMMAND_MODEL_MAP[config.slashCommand];
  const modelName = commandModelMap?.[modelSet] || 'sonnet';

  const fullModelId = MODEL_NAME_MAP[modelName] || MODEL_NAME_MAP.sonnet;

  logger.debug(
    {
      slashCommand: config.slashCommand,
      modelSet,
      modelName,
      fullModelId,
    },
    'Selected model for slash command'
  );

  return fullModelId;
}

/**
 * Build agent prompt from slash command and arguments
 *
 * Formats the slash command with its arguments for execution.
 *
 * @param slashCommand - The slash command to execute
 * @param args - Arguments to pass to the command
 * @returns Formatted prompt string
 *
 * @example
 * ```typescript
 * buildPrompt('/plan', ['123', 'abc12345'])
 * // Returns: "/plan 123 abc12345"
 * ```
 */
function buildPrompt(slashCommand: SlashCommand, args: string[]): string {
  if (args.length === 0) {
    return slashCommand;
  }
  return `${slashCommand} ${args.join(' ')}`;
}

/**
 * Classify an error to determine if it's retryable
 *
 * @param error - Error to classify
 * @returns Retry code indicating error type
 */
function classifyError(error: Error): RetryCode {
  const message = error.message.toLowerCase();

  if (message.includes('timeout')) {
    return 'TIMEOUT_ERROR';
  }

  if (message.includes('claude') || message.includes('api')) {
    return 'CLAUDE_CODE_ERROR';
  }

  if (message.includes('execution')) {
    return 'ERROR_DURING_EXECUTION';
  }

  // Default to non-retryable execution error
  return 'EXECUTION_ERROR';
}

/**
 * Sleep utility for retry backoff
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
