/**
 * ADW State Management Module
 *
 * Provides database-backed state management for ADW workflows.
 * Replaces Python's JSON file-based storage (agents/{adw_id}/adw_state.json)
 * with PostgreSQL database operations using the adw_workflows table.
 *
 * Key Migration Changes:
 * - Python: File storage in agents/{adw_id}/adw_state.json
 * - TypeScript: PostgreSQL adw_workflows table via Prisma
 * - Enables better concurrency, querying, and data integrity
 * - Maintains API compatibility with Python version where applicable
 *
 * @module modules/adw/state-manager
 */

import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import {
  createWorkflow,
  updateWorkflow,
  getWorkflow,
  listActiveWorkflows,
} from '../../database/queries/adw.js';
import type { AdwWorkflow } from '@prisma/client';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Data required to create a new workflow state
 *
 * Maps to the CreateWorkflowData interface in database/queries/adw.ts
 * but provides a cleaner API for state management operations.
 */
export interface CreateWorkflowStateData {
  /** Unique workflow identifier */
  adwId: string;
  /** GitHub issue number associated with this workflow */
  issueNumber: number;
  /** Type of workflow (e.g., 'sdlc', 'orchestrator') */
  workflowType: string;
  /** Current phase of the workflow */
  phase?: string;
  /** Current status (default: 'active') */
  status?: string;
  /** Git branch name */
  branchName?: string;
  /** GitHub issue title */
  issueTitle?: string;
  /** GitHub issue body/description */
  issueBody?: string;
  /** Issue classification (e.g., 'feature', 'bug', 'chore') */
  issueClass?: string;
  /** Path to git worktree (for isolated workflow environments) */
  worktreePath?: string;
  /** Backend development server port */
  backendPort?: number;
  /** Frontend development server port */
  frontendPort?: number;
  /** Model set to use (default: 'base') */
  modelSet?: string;
}

/**
 * Data for updating an existing workflow state
 *
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateWorkflowStateData {
  /** Current phase of the workflow */
  phase?: string;
  /** Current status */
  status?: string;
  /** Git branch name */
  branchName?: string;
  /** Pull request number (if PR created) */
  prNumber?: number;
  /** Issue classification */
  issueClass?: string;
  /** Path to git worktree */
  worktreePath?: string;
  /** Whether the worktree still exists */
  worktreeExists?: boolean;
  /** Backend development server port */
  backendPort?: number;
  /** Frontend development server port */
  frontendPort?: number;
  /** Model set to use */
  modelSet?: string;
  /** Path to plan file (if applicable) */
  planFile?: string;
  /** Completion timestamp (null to clear) */
  completedAt?: Date;
}

// ============================================================================
// Core State Management Functions
// ============================================================================

/**
 * Create a new workflow state in the database
 *
 * Replaces Python's ADWState.save() for new workflows.
 * Creates a new record in the adw_workflows table.
 *
 * @param data - Workflow creation data (adwId, issueNumber, workflowType required)
 * @returns The created workflow record from the database
 * @throws Error if workflow creation fails (e.g., duplicate adwId)
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflowState({
 *   adwId: 'abc12345',
 *   issueNumber: 123,
 *   workflowType: 'sdlc',
 *   issueTitle: 'Implement new feature',
 *   issueClass: 'feature',
 *   phase: 'initialized'
 * });
 * ```
 */
export async function createWorkflowState(
  data: CreateWorkflowStateData
): Promise<AdwWorkflow> {
  logger.info(
    { adwId: data.adwId, issueNumber: data.issueNumber, workflowType: data.workflowType },
    'Creating workflow state'
  );

  // Delegate to database layer - it handles defaults and logging
  return await createWorkflow(data);
}

/**
 * Update an existing workflow state
 *
 * Replaces Python's ADWState.update() and ADWState.save() for existing workflows.
 * Updates the workflow record in the database.
 *
 * @param adwId - The unique workflow identifier
 * @param updates - Fields to update (only provided fields are modified)
 * @returns The updated workflow record
 * @throws Error if workflow not found or update fails
 *
 * @example
 * ```typescript
 * const updated = await updateWorkflowState('abc12345', {
 *   phase: 'built',
 *   status: 'active',
 *   branchName: 'feat/new-feature'
 * });
 * ```
 */
export async function updateWorkflowState(
  adwId: string,
  updates: UpdateWorkflowStateData
): Promise<AdwWorkflow> {
  logger.debug(
    { adwId, fieldsUpdated: Object.keys(updates) },
    'Updating workflow state'
  );

  return await updateWorkflow(adwId, updates);
}

/**
 * Get workflow state from the database
 *
 * Replaces Python's ADWState.load() method.
 * Retrieves the complete workflow record.
 *
 * @param adwId - The unique workflow identifier
 * @returns The workflow record, or null if not found
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const workflow = await getWorkflowState('abc12345');
 * if (workflow) {
 *   console.log(`Current phase: ${workflow.phase}`);
 *   console.log(`Status: ${workflow.status}`);
 * }
 * ```
 */
export async function getWorkflowState(
  adwId: string
): Promise<AdwWorkflow | null> {
  // Query layer already handles logging
  return await getWorkflow(adwId);
}

/**
 * List all active workflows
 *
 * New functionality not present in Python version.
 * Enables monitoring and management of concurrent workflows.
 *
 * @returns Array of active workflow records, ordered by creation date (newest first)
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * const active = await listActiveWorkflows();
 * console.log(`Found ${active.length} active workflows`);
 * active.forEach(w => {
 *   console.log(`  ${w.adwId}: Issue #${w.issueNumber} - ${w.phase}`);
 * });
 * ```
 */
export async function listWorkflowStates(): Promise<AdwWorkflow[]> {
  const workflows = await listActiveWorkflows();

  logger.debug(
    { count: workflows.length },
    'Retrieved active workflow states'
  );

  return workflows;
}

/**
 * Get the working directory for a workflow
 *
 * Replaces Python's ADWState.get_working_directory() method.
 * Returns the worktree path if set (for isolated workflows),
 * otherwise returns the main repository path from ADW_WORKING_DIR.
 *
 * @param adwId - The unique workflow identifier
 * @returns Absolute path to the working directory
 * @throws Error if workflow not found or database query fails
 *
 * @example
 * ```typescript
 * const workDir = await getWorkingDirectory('abc12345');
 * console.log(`Working in: ${workDir}`);
 * // Execute commands in this directory
 * execSync('git status', { cwd: workDir });
 * ```
 */
export async function getWorkingDirectory(adwId: string): Promise<string> {
  const workflow = await getWorkflow(adwId);

  if (!workflow) {
    throw new Error(`Workflow ${adwId} not found`);
  }

  if (workflow.worktreePath) {
    logger.debug(
      { adwId, path: workflow.worktreePath },
      'Using worktree path as working directory'
    );
    return workflow.worktreePath;
  }

  logger.debug(
    { adwId, path: env.ADW_WORKING_DIR },
    'Using main repository path as working directory'
  );
  return env.ADW_WORKING_DIR;
}

/**
 * Track child workflow IDs (for orchestrator workflows)
 *
 * STUB FOR FUTURE IMPLEMENTATION
 *
 * In Python, this appends to the 'all_adws' array in the state JSON.
 * In the database version, this will require either:
 * - A separate adw_workflow_children junction table
 * - A JSONB column in adw_workflows
 * - Updating the schema to support hierarchical relationships
 *
 * @param adwId - Parent workflow identifier
 * @param childAdwId - Child workflow identifier to track
 *
 * @example
 * ```typescript
 * // Future usage (not implemented yet):
 * await appendAdwId('orchestrator123', 'child456');
 * ```
 */
export async function appendAdwId(
  adwId: string,
  childAdwId: string
): Promise<void> {
  logger.warn(
    { parentAdwId: adwId, childAdwId },
    'appendAdwId not implemented in database version - requires schema update for hierarchical workflow relationships'
  );

  // TODO: Implement one of the following approaches:
  // 1. Add JSONB column 'childWorkflowIds' to adw_workflows
  // 2. Create adw_workflow_relationships table
  // 3. Add parentAdwId column to support tree structure
}

/**
 * Validate that a workflow exists in the database
 *
 * Utility function for checking workflow existence without
 * retrieving the full record.
 *
 * @param adwId - The unique workflow identifier
 * @returns True if workflow exists, false otherwise
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * if (await validateWorkflowExists('abc12345')) {
 *   console.log('Workflow found');
 * } else {
 *   console.log('Workflow does not exist');
 * }
 * ```
 */
export async function validateWorkflowExists(adwId: string): Promise<boolean> {
  const workflow = await getWorkflow(adwId);
  const exists = workflow !== null;

  logger.debug(
    { adwId, exists },
    'Workflow existence validation'
  );

  return exists;
}
