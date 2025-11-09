import { prisma } from '../client.js';
import { logger } from '../../config/logger.js';
import type { OrchestratorAgent } from '@prisma/client';

/**
 * Database operations for orchestrator agents.
 * Provides type-safe CRUD operations using Prisma.
 */

/**
 * Get existing orchestrator by working directory or create a new one.
 *
 * @param workingDir - The working directory path for the orchestrator
 * @returns Promise resolving to the orchestrator agent
 * @throws Error if database operation fails
 *
 * @example
 * const orchestrator = await getOrCreateOrchestrator('/opt/ozean-licht-ecosystem');
 */
export async function getOrCreateOrchestrator(workingDir: string): Promise<OrchestratorAgent> {
  try {
    // Try to find existing non-archived orchestrator for this working directory
    let orchestrator = await prisma.orchestratorAgent.findFirst({
      where: {
        workingDir,
        archived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Create new orchestrator if none exists
    if (!orchestrator) {
      orchestrator = await prisma.orchestratorAgent.create({
        data: {
          workingDir,
          status: 'idle',
        },
      });

      logger.info(
        {
          orchestratorId: orchestrator.id,
          workingDir
        },
        'Created new orchestrator agent'
      );
    } else {
      logger.debug(
        {
          orchestratorId: orchestrator.id,
          workingDir
        },
        'Found existing orchestrator agent'
      );
    }

    return orchestrator;
  } catch (error) {
    logger.error(
      {
        error,
        workingDir
      },
      'Failed to get or create orchestrator'
    );
    throw new Error(`Failed to get or create orchestrator: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update the session ID for an orchestrator agent.
 *
 * @param id - The orchestrator agent ID
 * @param sessionId - The new session ID from Agent SDK
 * @returns Promise resolving to the updated orchestrator agent
 * @throws Error if orchestrator not found or update fails
 *
 * @example
 * const orchestrator = await updateOrchestratorSession('uuid-123', 'session-abc');
 */
export async function updateOrchestratorSession(
  id: string,
  sessionId: string
): Promise<OrchestratorAgent> {
  try {
    const orchestrator = await prisma.orchestratorAgent.update({
      where: { id },
      data: { sessionId },
    });

    logger.debug(
      {
        orchestratorId: id,
        sessionId
      },
      'Updated orchestrator session'
    );

    return orchestrator;
  } catch (error) {
    logger.error(
      {
        error,
        orchestratorId: id,
        sessionId
      },
      'Failed to update orchestrator session'
    );
    throw new Error(`Failed to update orchestrator session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update token usage and cost metrics for an orchestrator agent.
 *
 * @param id - The orchestrator agent ID
 * @param inputTokens - Number of input tokens to add
 * @param outputTokens - Number of output tokens to add
 * @param totalCost - Additional cost to add (in dollars)
 * @returns Promise resolving to the updated orchestrator agent
 * @throws Error if orchestrator not found or update fails
 *
 * @example
 * const orchestrator = await updateOrchestratorCosts('uuid-123', 1000, 500, 0.025);
 */
export async function updateOrchestratorCosts(
  id: string,
  inputTokens: number,
  outputTokens: number,
  totalCost: number
): Promise<OrchestratorAgent> {
  try {
    // Fetch current values
    const current = await prisma.orchestratorAgent.findUnique({
      where: { id },
      select: {
        inputTokens: true,
        outputTokens: true,
        totalCost: true,
      },
    });

    if (!current) {
      throw new Error(`Orchestrator not found: ${id}`);
    }

    // Update with incremented values
    const orchestrator = await prisma.orchestratorAgent.update({
      where: { id },
      data: {
        inputTokens: current.inputTokens + inputTokens,
        outputTokens: current.outputTokens + outputTokens,
        totalCost: current.totalCost + totalCost,
      },
    });

    logger.debug(
      {
        orchestratorId: id,
        inputTokens,
        outputTokens,
        totalCost,
        newInputTokens: orchestrator.inputTokens,
        newOutputTokens: orchestrator.outputTokens,
        newTotalCost: orchestrator.totalCost,
      },
      'Updated orchestrator costs'
    );

    return orchestrator;
  } catch (error) {
    logger.error(
      {
        error,
        orchestratorId: id,
        inputTokens,
        outputTokens,
        totalCost,
      },
      'Failed to update orchestrator costs'
    );
    throw new Error(`Failed to update orchestrator costs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get an orchestrator agent by ID.
 *
 * @param id - The orchestrator agent ID
 * @returns Promise resolving to the orchestrator agent or null if not found
 * @throws Error if database query fails
 *
 * @example
 * const orchestrator = await getOrchestratorById('uuid-123');
 * if (orchestrator) {
 *   console.log('Found:', orchestrator.workingDir);
 * }
 */
export async function getOrchestratorById(id: string): Promise<OrchestratorAgent | null> {
  try {
    const orchestrator = await prisma.orchestratorAgent.findUnique({
      where: { id },
    });

    if (orchestrator) {
      logger.debug(
        {
          orchestratorId: id
        },
        'Retrieved orchestrator by ID'
      );
    }

    return orchestrator;
  } catch (error) {
    logger.error(
      {
        error,
        orchestratorId: id
      },
      'Failed to get orchestrator by ID'
    );
    throw new Error(`Failed to get orchestrator by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all active (non-archived) orchestrator agents.
 *
 * @returns Promise resolving to array of active orchestrator agents
 * @throws Error if database query fails
 *
 * @example
 * const activeOrchestrators = await listActiveOrchestrators();
 * console.log(`Found ${activeOrchestrators.length} active orchestrators`);
 */
export async function listActiveOrchestrators(): Promise<OrchestratorAgent[]> {
  try {
    const orchestrators = await prisma.orchestratorAgent.findMany({
      where: {
        archived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.debug(
      {
        count: orchestrators.length
      },
      'Listed active orchestrators'
    );

    return orchestrators;
  } catch (error) {
    logger.error(
      {
        error
      },
      'Failed to list active orchestrators'
    );
    throw new Error(`Failed to list active orchestrators: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Archive an orchestrator agent (soft delete).
 * Sets the archived flag to true instead of deleting the record.
 *
 * @param id - The orchestrator agent ID to archive
 * @returns Promise resolving to the archived orchestrator agent
 * @throws Error if orchestrator not found or update fails
 *
 * @example
 * const orchestrator = await archiveOrchestrator('uuid-123');
 * console.log('Archived:', orchestrator.id);
 */
export async function archiveOrchestrator(id: string): Promise<OrchestratorAgent> {
  try {
    const orchestrator = await prisma.orchestratorAgent.update({
      where: { id },
      data: {
        archived: true,
        status: 'archived',
      },
    });

    logger.info(
      {
        orchestratorId: id
      },
      'Archived orchestrator agent'
    );

    return orchestrator;
  } catch (error) {
    logger.error(
      {
        error,
        orchestratorId: id
      },
      'Failed to archive orchestrator'
    );
    throw new Error(`Failed to archive orchestrator: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save a chat message between user and orchestrator.
 *
 * @param orchestratorId - The orchestrator agent ID
 * @param sessionId - The session ID for grouping messages
 * @param userMessage - The user's message
 * @param assistantResponse - The assistant's response
 * @returns Promise resolving when messages are saved
 * @throws Error if database operation fails
 *
 * @example
 * await saveOrchestratorChat('uuid-123', 'session-abc', 'Hello', 'Hi there!');
 */
export async function saveOrchestratorChat(
  orchestratorId: string,
  sessionId: string,
  userMessage: string,
  assistantResponse: string
): Promise<void> {
  try {
    // Save both messages in a transaction
    await prisma.$transaction([
      // User message
      prisma.orchestratorChat.create({
        data: {
          orchestratorAgentId: orchestratorId,
          senderType: 'user',
          receiverType: 'orchestrator',
          message: userMessage,
          metadata: { sessionId },
        },
      }),
      // Assistant response
      prisma.orchestratorChat.create({
        data: {
          orchestratorAgentId: orchestratorId,
          senderType: 'orchestrator',
          receiverType: 'user',
          message: assistantResponse,
          metadata: { sessionId },
        },
      }),
    ]);

    logger.debug(
      {
        orchestratorId,
        sessionId,
        userMessageLength: userMessage.length,
        assistantResponseLength: assistantResponse.length,
      },
      'Saved orchestrator chat messages'
    );
  } catch (error) {
    logger.error(
      {
        error,
        orchestratorId,
        sessionId,
      },
      'Failed to save orchestrator chat'
    );
    throw new Error(`Failed to save orchestrator chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
