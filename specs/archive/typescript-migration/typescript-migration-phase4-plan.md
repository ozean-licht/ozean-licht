# TypeScript Migration - Phase 4 Implementation Plan

> **Advanced Integration: MCP Tools, Orchestrator Service, and Production Deployment**
>
> **Status**: Planning
> **Phase 3 Dependency**: ✅ Complete (Integration Layer + Agent SDK)
> **Timeline**: 2-3 weeks
> **Goal**: Production-ready ADW system with orchestrator integration and deployment

---

## Executive Summary

### Phase 3 Achievements (Completed)

Phase 3 successfully delivered:
- ✅ **R2 Storage** - Upload artifacts to Cloudflare R2 (~250 lines)
- ✅ **HTTP REST API** - 5 endpoints for workflow management (~400 lines)
- ✅ **WebSocket Manager** - Real-time updates (~350 lines)
- ✅ **GitHub Webhooks** - Automated workflow triggers (~350 lines)
- ✅ **Workflow Manager Extensions** - Complete SDLC orchestration (~200 lines)
- ✅ **Agent SDK Integration** - MCP gateway + slash commands (~592 lines + 7 commands)

**Total Phase 3**: ~2,150 lines + 1,150 lines of slash commands = **3,300 lines**

### What Phase 4 Delivers

Phase 4 builds the **advanced integration layer** that transforms the TypeScript orchestrator into a production-ready system:

1. **MCP Tool System** - Custom tools for ADW workflows accessible to orchestrator agent
2. **Orchestrator Service Integration** - Unified TypeScript orchestrator with ADW capabilities
3. **Advanced Workflow Patterns** - Multi-agent collaboration and complex SDLC flows
4. **Production Deployment** - Coolify deployment with health monitoring
5. **Monitoring & Observability** - Metrics, logging, and error tracking
6. **Testing Infrastructure** - Integration and E2E tests

### Architecture Vision

```
┌─────────────────────────────────────────────────────────────┐
│              Orchestrator Service (Unified)                  │
│         (Phase 4 - Orchestrator Integration)                │
└───────────┬─────────────────────────────────────────────────┘
            │
    ┌───────▼────────┐              ┌────────────────┐
    │  MCP Tools     │              │  ADW Workflow  │
    │  (Phase 4)     │              │  Manager       │
    │                │◄─────────────┤  (Phase 3)     │
    │ - createAdw    │              └────────────────┘
    │ - executePhase │
    │ - getStatus    │
    │ - listWorkflows│
    └────────────────┘
            │
    ┌───────▼─────────────────────────────────────────┐
    │     Integration Layer (Phase 3 ✅)              │
    │  HTTP API │ WebSocket │ Webhooks │ R2 Storage  │
    └───────┬─────────────────────────────────────────┘
            │
    ┌───────▼─────────────────────────────────────────┐
    │      Core ADW Modules (Phase 2 ✅)              │
    │  workflow-manager │ agent-executor │ etc.      │
    └─────────────────────────────────────────────────┘
```

---

## Root-Level Slash Command Strategy

### Current State Assessment

**Existing Root Commands** (15 files in `.claude/commands/`):
- ✅ **Keep**: `plan.md`, `build.md`, `question.md` (useful orchestration)
- ⚠️ **Update**: Commands need Agent SDK alignment
- ❌ **Remove**: `parallel_subagents.md`, `build_in_parallel.md` (obsolete orchestration patterns)
- 🆕 **Add**: SDLC workflow commands from orchestrator_ts

### Command Hierarchy

```
.claude/commands/                    # Root-level commands
├── Meta-orchestration (keep)
│   ├── plan.md                      # Create implementation plans
│   ├── question.md                  # Answer questions without coding
│   └── prime.md                     # Codebase priming
│
├── SDLC Workflows (add from orchestrator_ts)
│   ├── classify_issue.md            # Issue classification
│   ├── generate_branch_name.md      # Branch naming
│   ├── implement.md                 # Implementation with best practices
│   ├── test.md                      # Testing strategy
│   ├── review.md                    # Code review checklist
│   ├── commit.md                    # Conventional commits
│   └── pull_request.md              # PR creation
│
└── Deprecated (remove)
    ├── parallel_subagents.md        # Old orchestration
    ├── build_in_parallel.md         # Old orchestration
    └── plan_w_scouters.md           # Old orchestration

apps/orchestrator_ts/.claude/commands/   # Orchestrator-specific
└── (Same SDLC commands for ADW workflows)
```

### Agent SDK Best Practices for Commands

**Update all root commands to follow these patterns:**

1. **Use Front Matter** (compatible with Agent SDK):
   ```markdown
   ---
   description: Brief command description
   argument-hint: [arg-name]
   allowed-tools: Tool1, Tool2
   ---
   ```

2. **Variable Substitution**:
   ```markdown
   USER_INPUT: $1
   ARGUMENTS: $ARGUMENTS
   ```

3. **Clear Workflow Structure**:
   ```markdown
   ## Instructions
   - Step-by-step guidelines

   ## Workflow
   1. Action 1
   2. Action 2

   ## Report
   - What to output
   ```

4. **Tool Restrictions** (when needed):
   ```markdown
   ---
   allowed-tools: Read, Grep, Bash(git)
   ---
   ```

---

## Phase 4 Module Specifications

### Module 0: Root Command Migration (NEW)

**Purpose**: Migrate root-level slash commands to Agent SDK best practices and add SDLC workflow commands

**Files**: `.claude/commands/*.md`

**Actions Required**:

1. **Copy SDLC Commands from orchestrator_ts**:
   ```bash
   cp apps/orchestrator_ts/.claude/commands/{classify_issue,generate_branch_name,implement,test,review,commit,pull_request}.md \
      .claude/commands/
   ```

2. **Update Existing Commands**:
   - `plan.md` - Add Agent SDK front matter, update workflow
   - `build.md` - Simplify (remove parallel execution), align with implement.md
   - `question.md` - Already good, just verify tool restrictions

3. **Remove Obsolete Commands**:
   ```bash
   rm .claude/commands/{parallel_subagents,build_in_parallel,plan_w_scouters}.md
   ```

4. **Create New Meta Commands** (if needed):
   - `orchestrate_workflow.md` - High-level SDLC orchestration
   - `analyze_codebase.md` - Deep codebase analysis

**Implementation** (example updated `plan.md`):

```markdown
---
description: Create implementation plan based on user requirements
argument-hint: [user-prompt]
allowed-tools: Read, Grep, Glob, Bash(git)
---

# Plan

Create a detailed implementation plan in the `specs/` directory.

## Variables

USER_PROMPT: $1
PLAN_OUTPUT_DIRECTORY: specs/

## Instructions

- IMPORTANT: If no USER_PROMPT provided, ask user for requirements
- Analyze requirements and determine task type (feature/fix/chore)
- Explore codebase using Read/Grep/Glob to understand patterns
- Create comprehensive plan following the Plan Format
- Save to `specs/<descriptive-name>.md`

## Workflow

1. **Analyze Requirements** - Parse USER_PROMPT, identify objectives
2. **Explore Codebase** - Use Grep/Glob to find relevant files
3. **Design Solution** - Develop technical approach
4. **Document Plan** - Create structured markdown with all sections
5. **Save Plan** - Write to specs/ with descriptive filename

## Plan Format

\```markdown
# Plan: <task-name>

## Objective
What will be accomplished

## Current State
What exists now (use Grep/Read to analyze)

## Proposed Changes
What needs to change

## Implementation Steps
1. Step 1 with code examples
2. Step 2 with code examples
...

## Testing Strategy
How to verify the implementation

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
\```

## Report

- Summarize the plan created
- Report filename and location
- Highlight key implementation points
```

---

### Module 1: MCP Tool Definitions

**Purpose**: Define ADW operations as MCP tools that the orchestrator agent can invoke

**File**: `src/tools/adw-mcp-tools.ts`

**New File** (no Python equivalent)

**Dependencies**:
- `@anthropic-ai/claude-agent-sdk` (already installed)
- workflow-manager module from Phase 2
- state-manager module from Phase 2

**Key Features**:
- Type-safe tool definitions using `tool()` from Agent SDK
- Zod schema validation for inputs
- Direct integration with workflow-manager
- Error handling and logging

**Implementation**:

```typescript
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
import type { SdkMcpToolDefinition } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import * as WorkflowManager from '../modules/adw/workflow-manager.js';
import { getWorkflowState, listActiveWorkflows } from '../modules/adw/state-manager.js';
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
      const workflows = await listActiveWorkflows();

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
export function getAdwTools(): SdkMcpToolDefinition<any>[] {
  return [
    createAdwWorkflowTool,
    executeWorkflowPhaseTool,
    getWorkflowStatusTool,
    listActiveWorkflowsTool,
    cancelWorkflowTool,
  ];
}
```

---

### Module 2: Orchestrator Service Integration

**Purpose**: Unified TypeScript orchestrator service that combines existing orchestrator functionality with ADW workflows

**File**: `src/services/orchestrator-service.ts`

**Migrates**: Portions of `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

**Dependencies**:
- Agent SDK with MCP tools
- ADW workflow manager
- WebSocket manager
- Database queries

**Key Features**:
- Single orchestrator agent instance
- ADW tools registered as MCP tools
- Chat history management
- Cost tracking
- Session management

**Implementation**:

```typescript
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
import { getAdwTools } from '../tools/adw-mcp-tools.js';
import {
  getOrCreateOrchestrator,
  updateOrchestratorSession,
  updateOrchestratorCosts,
  saveOrchestratorChat,
} from '../database/queries/orchestrator.js';
import { broadcastWorkflowUpdate } from '../modules/websocket/adw-websocket-manager.js';

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
  orchestratorId: number;
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
      permissionMode: 'default', // Require permissions for orchestrator (not bypass like ADW)
      maxTurns: 100,

      // Register ADW tools as SDK MCP server
      mcpServers: {
        'adw-workflows': {
          type: 'sdk',
          instance: {
            name: 'adw-workflows',
            version: '1.0.0',
            tools: getAdwTools(),
          },
        },
        // Also connect to external MCP gateway
        'adw-mcp-gateway': {
          type: 'http',
          url: env.MCP_GATEWAY_URL,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
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
          const chunk = JSON.stringify(message);
          responseChunks.push(chunk);
          if (onStreamChunk) {
            onStreamChunk(chunk);
          }
          break;

        case 'result':
          // Extract token usage and costs
          inputTokens = message.usage.input_tokens || 0;
          outputTokens = message.usage.output_tokens || 0;
          costUsd = message.total_cost_usd || 0;
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
```

---

### Module 3: Orchestrator HTTP Routes

**Purpose**: HTTP API endpoints for orchestrator chat interface

**File**: `src/routes/orchestrator.ts`

**Key Endpoints**:
- `POST /api/orchestrator/chat` - Send message to orchestrator
- `GET /api/orchestrator/history` - Get chat history
- `DELETE /api/orchestrator/history` - Clear chat history
- `GET /api/orchestrator/metrics` - Get session metrics

**Implementation**:

```typescript
/**
 * Orchestrator HTTP Routes
 *
 * REST API endpoints for orchestrator chat interface.
 *
 * @module routes/orchestrator
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { logger } from '../config/logger.js';
import {
  initializeOrchestrator,
  executeOrchestratorQuery,
  getChatHistory,
  clearChatHistory,
  getSessionMetrics,
  getCurrentSession,
} from '../services/orchestrator-service.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

const ChatMessageSchema = z.object({
  message: z.string().min(1),
  stream: z.boolean().optional(),
});

type ChatMessageRequest = z.infer<typeof ChatMessageSchema>;

// ============================================================================
// Route Handlers
// ============================================================================

export async function registerOrchestratorRoutes(server: FastifyInstance) {
  // Prefix all routes with /api/orchestrator
  await server.register(
    async (orchRoutes) => {
      /**
       * POST /api/orchestrator/chat
       * Send a message to the orchestrator
       */
      orchRoutes.post<{ Body: ChatMessageRequest }>(
        '/chat',
        async (request: FastifyRequest<{ Body: ChatMessageRequest }>, reply: FastifyReply) => {
          try {
            const { message, stream } = ChatMessageSchema.parse(request.body);

            // Initialize orchestrator if not already
            if (!getCurrentSession()) {
              await initializeOrchestrator();
            }

            logger.info({ messageLength: message.length }, 'Orchestrator chat message received');

            // Execute query
            const response = await executeOrchestratorQuery(message);

            return reply.send({
              success: true,
              response,
              metrics: getSessionMetrics(),
            });
          } catch (error) {
            logger.error({ error }, 'Orchestrator chat failed');

            if (error instanceof z.ZodError) {
              return reply.code(400).send({
                error: 'Validation error',
                details: error.errors,
              });
            }

            return reply.code(500).send({
              error: 'Orchestrator execution failed',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      );

      /**
       * GET /api/orchestrator/history
       * Get chat history for current session
       */
      orchRoutes.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const history = getChatHistory();

          return reply.send({
            success: true,
            history,
            count: history.length,
          });
        } catch (error) {
          logger.error({ error }, 'Failed to get chat history');
          return reply.code(500).send({
            error: 'Failed to retrieve history',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * DELETE /api/orchestrator/history
       * Clear chat history and start fresh session
       */
      orchRoutes.delete('/history', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await clearChatHistory();

          return reply.send({
            success: true,
            message: 'Chat history cleared successfully',
          });
        } catch (error) {
          logger.error({ error }, 'Failed to clear chat history');
          return reply.code(500).send({
            error: 'Failed to clear history',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      /**
       * GET /api/orchestrator/metrics
       * Get current session metrics
       */
      orchRoutes.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const metrics = getSessionMetrics();

          if (!metrics) {
            return reply.code(404).send({
              error: 'No active session',
              message: 'Orchestrator not initialized',
            });
          }

          return reply.send({
            success: true,
            metrics,
          });
        } catch (error) {
          logger.error({ error }, 'Failed to get metrics');
          return reply.code(500).send({
            error: 'Failed to retrieve metrics',
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    },
    { prefix: '/api/orchestrator' }
  );

  logger.info('Orchestrator routes registered');
}
```

---

### Module 4: Production Deployment Configuration

**Purpose**: Coolify deployment configuration and health monitoring

**File**: `docker-compose.yml` (update)

**Key Features**:
- Environment variable configuration
- Health checks
- Volume mounts
- Network configuration

**Implementation**:

```yaml
version: '3.8'

services:
  orchestrator-ts:
    image: node:18-alpine
    container_name: orchestrator-ts
    working_dir: /app
    command: npm start
    ports:
      - "8003:8003"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - MCP_GATEWAY_URL=http://mcp-gateway:8100
      - ADW_WORKING_DIR=/workspace
      - ORCHESTRATOR_WORKING_DIR=/workspace
    volumes:
      - ./apps/orchestrator_ts:/app
      - /opt/ozean-licht-ecosystem:/workspace
    depends_on:
      - postgres
      - mcp-gateway
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8003/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
    networks:
      - ozean-licht-network

networks:
  ozean-licht-network:
    external: true
```

---

## Implementation Checklist

### Week 1: Root Commands + MCP Tools

- [ ] **Root Command Migration (Module 0)**
  - [ ] Copy 7 SDLC commands from orchestrator_ts to root
  - [ ] Update `plan.md` with Agent SDK best practices
  - [ ] Update `build.md` (simplify, align with implement.md)
  - [ ] Verify `question.md` tool restrictions
  - [ ] Remove obsolete commands (parallel_subagents, build_in_parallel, etc.)
  - [ ] Test root commands with Agent SDK
  - [ ] Document command hierarchy in README

- [ ] **MCP Tools and Orchestrator Service

- [ ] **MCP Tool Definitions**
  - [ ] Create `src/tools/adw-mcp-tools.ts`
  - [ ] Implement `createAdwWorkflowTool`
  - [ ] Implement `executeWorkflowPhaseTool`
  - [ ] Implement `getWorkflowStatusTool`
  - [ ] Implement `listActiveWorkflowsTool`
  - [ ] Implement `cancelWorkflowTool`
  - [ ] Create `createAdwMcpServer()` function
  - [ ] Test tool definitions with Agent SDK

- [ ] **Orchestrator Service**
  - [ ] Create `src/services/orchestrator-service.ts`
  - [ ] Implement `initializeOrchestrator()`
  - [ ] Implement `executeOrchestratorQuery()`
  - [ ] Implement chat history management
  - [ ] Implement session metrics tracking
  - [ ] Integrate ADW tools via MCP
  - [ ] Test orchestrator with ADW tools

### Week 2: Routes and Integration Testing

- [ ] **Orchestrator HTTP Routes**
  - [ ] Create `src/routes/orchestrator.ts`
  - [ ] Implement `POST /api/orchestrator/chat`
  - [ ] Implement `GET /api/orchestrator/history`
  - [ ] Implement `DELETE /api/orchestrator/history`
  - [ ] Implement `GET /api/orchestrator/metrics`
  - [ ] Register routes in `server.ts`
  - [ ] Test all endpoints

- [ ] **Integration Testing**
  - [ ] Test orchestrator chat with ADW tools
  - [ ] Test creating workflow via orchestrator
  - [ ] Test executing workflow phases
  - [ ] Test WebSocket updates during execution
  - [ ] Test concurrent workflows
  - [ ] Test error handling and recovery

### Week 3: Deployment and Monitoring

- [ ] **Production Deployment**
  - [ ] Update `docker-compose.yml`
  - [ ] Configure environment variables
  - [ ] Set up health checks
  - [ ] Deploy to Coolify
  - [ ] Verify all services running
  - [ ] Test production endpoints

- [ ] **Monitoring Setup**
  - [ ] Configure Prometheus metrics export
  - [ ] Set up Grafana dashboards
  - [ ] Configure log aggregation
  - [ ] Set up error tracking
  - [ ] Create alerting rules
  - [ ] Document monitoring setup

- [ ] **Documentation**
  - [ ] Update orchestrator_ts README
  - [ ] Create orchestrator API documentation
  - [ ] Document MCP tool usage
  - [ ] Create deployment guide
  - [ ] Update CONTEXT_MAP.md

---

## Success Criteria

Phase 4 is complete when:

1. ✅ **MCP Tools Functional**
   - All 5 ADW tools defined and registered
   - Tools callable from orchestrator agent
   - Zod validation working correctly
   - Error handling comprehensive

2. ✅ **Orchestrator Service Operational**
   - Chat interface working
   - ADW tools accessible in chat
   - Session management functional
   - Cost tracking accurate

3. ✅ **HTTP API Complete**
   - All 4 orchestrator endpoints functional
   - Request validation with Zod
   - Error handling appropriate
   - WebSocket integration working

4. ✅ **Production Deployment Ready**
   - Docker Compose configuration complete
   - Health checks passing
   - Environment variables documented
   - Coolify deployment successful

5. ✅ **End-to-End Workflows**
   - Can create ADW workflow via orchestrator chat
   - Can execute phases via orchestrator
   - WebSocket updates broadcast correctly
   - Full SDLC workflow completes successfully

6. ✅ **Monitoring in Place**
   - Metrics exported to Prometheus
   - Grafana dashboards created
   - Logs aggregated and searchable
   - Alerts configured

---

## Phase 5 Preview

After Phase 4 completion, Phase 5 will focus on:

1. **Advanced Workflow Patterns** - Multi-agent collaboration, parallel execution
2. **Frontend UI** - React components for workflow visualization
3. **Analytics Dashboard** - Workflow metrics, success rates, performance
4. **Workflow Templates** - Pre-defined workflows for common tasks
5. **Python ADW Cleanup** - Archive Python ADW system, remove legacy code

---

## Files to Create/Modify in Phase 4

```
.claude/commands/                         # Root commands (Module 0)
├── classify_issue.md                    (COPY from orchestrator_ts)
├── generate_branch_name.md              (COPY from orchestrator_ts)
├── implement.md                         (COPY from orchestrator_ts)
├── test.md                              (COPY from orchestrator_ts)
├── review.md                            (COPY from orchestrator_ts)
├── commit.md                            (COPY from orchestrator_ts)
├── pull_request.md                      (COPY from orchestrator_ts)
├── plan.md                              (UPDATE - Agent SDK best practices)
├── build.md                             (UPDATE - simplify)
└── question.md                          (VERIFY - already good)

apps/orchestrator_ts/
├── src/
│   ├── tools/
│   │   └── adw-mcp-tools.ts           (~350 lines - NEW)
│   │
│   ├── services/
│   │   └── orchestrator-service.ts    (~400 lines - NEW)
│   │
│   └── routes/
│       └── orchestrator.ts            (~200 lines - NEW)
│
├── docker-compose.yml                 (UPDATE - add orchestrator-ts service)
│
└── DEPLOYMENT.md                      (~200 lines - NEW)
```

**Total New Code**: ~950 lines
**Root Commands**: 7 copied + 3 updated
**Updated Code**: ~50 lines in docker-compose.yml, server.ts

---

**Phase 4 Timeline**: 2-3 weeks
**Phase 4 Goal**: Production-ready orchestrator with full ADW integration
**Phase 4 Status**: Ready for implementation

