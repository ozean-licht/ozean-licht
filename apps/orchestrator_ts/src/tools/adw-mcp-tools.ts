/**
 * ADW MCP Tools
 *
 * Defines ADW workflow operations as MCP tools that can be invoked by
 * the orchestrator agent. These tools provide a programmatic interface
 * to create and manage ADW workflows.
 *
 * Key capabilities:
 * - Create new ADW workflows from GitHub issues
 * - Execute workflow phases (plan, implement, test, review)
 * - Get workflow status and progress
 * - List active workflows
 * - Cancel workflows
 *
 * @module tools/adw-mcp-tools
 */

import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { getWorkflowState, listWorkflowStates } from '../modules/adw/state-manager.js';
import { WorkflowType, SlashCommand } from '../modules/adw/types.js';

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * Create ADW Workflow Tool
 *
 * Creates a new ADW workflow from a GitHub issue number.
 * The workflow is initialized and ready for execution.
 *
 * Input:
 * - issueNumber: GitHub issue number
 * - workflowType: Type of workflow (sdlc, plan, build, etc.)
 * - modelSet: Optional model complexity (base or heavy)
 *
 * Output:
 * - adwId: Generated workflow ID
 * - status: Workflow creation status
 * - message: Human-readable result message
 */
export const createAdwWorkflowTool = tool(
  'create_adw_workflow',
  'Create a new ADW workflow from a GitHub issue',
  {
    issueNumber: z.number().int().positive().describe('GitHub issue number'),
    workflowType: WorkflowType.describe('Type of workflow to create'),
    modelSet: z.enum(['base', 'heavy']).optional().describe('Model set for computational complexity'),
  },
  async (args, extra) => {
    logger.info(
      { issueNumber: args.issueNumber, workflowType: args.workflowType },
      'MCP Tool: create_adw_workflow called'
    );

    try {
      const result = await WorkflowManager.createWorkflow(
        args.issueNumber,
        args.workflowType,
        args.modelSet
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to create workflow: ${result.error}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              adwId: result.adwId,
              message: `ADW workflow ${result.adwId} created for issue #${args.issueNumber}`,
            }),
          },
        ],
      };
    } catch (error) {
      logger.error({ error, args }, 'MCP Tool: create_adw_workflow failed');
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Execute Workflow Phase Tool
 *
 * Executes a specific phase of an ADW workflow.
 * Supports all slash commands (implement, test, review, etc.)
 *
 * Input:
 * - adwId: Workflow identifier
 * - slashCommand: Command to execute (/implement, /test, etc.)
 *
 * Output:
 * - success: Execution success status
 * - output: Agent execution output
 * - message: Human-readable result
 */
export const executeWorkflowPhaseTool = tool(
  'execute_workflow_phase',
  'Execute a specific phase of an ADW workflow',
  {
    adwId: z.string().length(8).describe('ADW workflow identifier'),
    slashCommand: SlashCommand.describe('Slash command to execute'),
  },
  async (args, extra) => {
    logger.info(
      { adwId: args.adwId, slashCommand: args.slashCommand },
      'MCP Tool: execute_workflow_phase called'
    );

    try {
      const result = await WorkflowManager.executeWorkflowPhase(
        args.adwId,
        args.slashCommand
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: result.success,
              output: result.output.substring(0, 500), // Truncate for tool response
              message: result.success
                ? `Phase ${args.slashCommand} completed successfully`
                : `Phase ${args.slashCommand} failed: ${result.error}`,
            }),
          },
        ],
        isError: !result.success,
      };
    } catch (error) {
      logger.error({ error, args }, 'MCP Tool: execute_workflow_phase failed');
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Get Workflow Status Tool
 *
 * Retrieves the current status and details of an ADW workflow.
 *
 * Input:
 * - adwId: Workflow identifier
 *
 * Output:
 * - workflow: Complete workflow state
 * - status: Current status (active, completed, failed)
 * - phase: Current phase
 * - progress: Human-readable progress description
 */
export const getWorkflowStatusTool = tool(
  'get_workflow_status',
  'Get the current status of an ADW workflow',
  {
    adwId: z.string().length(8).describe('ADW workflow identifier'),
  },
  async (args, extra) => {
    logger.info({ adwId: args.adwId }, 'MCP Tool: get_workflow_status called');

    try {
      const workflow = await getWorkflowState(args.adwId);

      if (!workflow) {
        return {
          content: [
            {
              type: 'text',
              text: `Workflow ${args.adwId} not found`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              adwId: workflow.adwId,
              issueNumber: workflow.issueNumber,
              status: workflow.status,
              phase: workflow.phase,
              workflowType: workflow.workflowType,
              branchName: workflow.branchName,
              prNumber: workflow.prNumber,
              createdAt: workflow.createdAt,
              updatedAt: workflow.updatedAt,
            }),
          },
        ],
      };
    } catch (error) {
      logger.error({ error, args }, 'MCP Tool: get_workflow_status failed');
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * List Active Workflows Tool
 *
 * Lists all currently active ADW workflows.
 *
 * Input: None
 *
 * Output:
 * - workflows: Array of active workflow summaries
 * - count: Number of active workflows
 */
export const listActiveWorkflowsTool = tool(
  'list_active_workflows',
  'List all active ADW workflows',
  {},
  async (args, extra) => {
    logger.info('MCP Tool: list_active_workflows called');

    try {
      const workflows = await listWorkflowStates();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              count: workflows.length,
              workflows: workflows.map((w) => ({
                adwId: w.adwId,
                issueNumber: w.issueNumber,
                status: w.status,
                phase: w.phase,
                workflowType: w.workflowType,
                createdAt: w.createdAt,
              })),
            }),
          },
        ],
      };
    } catch (error) {
      logger.error({ error }, 'MCP Tool: list_active_workflows failed');
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Cancel Workflow Tool
 *
 * Cancels an active ADW workflow and cleans up resources.
 *
 * Input:
 * - adwId: Workflow identifier
 *
 * Output:
 * - success: Cancellation success status
 * - message: Human-readable result
 */
export const cancelWorkflowTool = tool(
  'cancel_workflow',
  'Cancel an ADW workflow and clean up resources',
  {
    adwId: z.string().length(8).describe('ADW workflow identifier'),
  },
  async (args, extra) => {
    logger.info({ adwId: args.adwId }, 'MCP Tool: cancel_workflow called');

    try {
      const result = await WorkflowManager.cleanupWorkflow(args.adwId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: result.success,
              message: result.success
                ? `Workflow ${args.adwId} cancelled successfully`
                : `Failed to cancel workflow: ${result.error}`,
            }),
          },
        ],
        isError: !result.success,
      };
    } catch (error) {
      logger.error({ error, args }, 'MCP Tool: cancel_workflow failed');
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ============================================================================
// MCP Server Configuration
// ============================================================================

/**
 * Create ADW MCP Server
 *
 * Creates an SDK MCP server instance with all ADW tools registered.
 * This server can be integrated into the orchestrator agent.
 *
 * @returns MCP server configuration with tools
 */
export function createAdwMcpServer() {
  return createSdkMcpServer({
    name: 'adw-workflows',
    version: '1.0.0',
    tools: [
      createAdwWorkflowTool,
      executeWorkflowPhaseTool,
      getWorkflowStatusTool,
      listActiveWorkflowsTool,
      cancelWorkflowTool,
    ],
  });
}

/**
 * Get all ADW tools as an array
 *
 * Useful for registering tools individually with the orchestrator
 *
 * @returns Array of ADW tool definitions
 */
export function getAdwTools() {
  return [
    createAdwWorkflowTool,
    executeWorkflowPhaseTool,
    getWorkflowStatusTool,
    listActiveWorkflowsTool,
    cancelWorkflowTool,
  ];
}
