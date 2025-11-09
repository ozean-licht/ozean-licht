/**
 * Worktree Manager
 *
 * Manages git worktrees for isolated ADW workflow execution.
 * Each ADW workflow runs in its own worktree under trees/<adw_id>/
 * with deterministic port allocation for backend and frontend services.
 *
 * The trees/ directory is added to .gitignore to prevent worktrees
 * from being tracked by git.
 *
 * @module modules/adw/worktree-manager
 */

import fs from 'fs';
import path from 'path';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import { getPortsForAdw, isPortAvailable, findAvailablePort } from './utils.js';
import { getGit } from './git-operations.js';
import {
  WorktreeConfig,
  WorktreeValidation,
  PortAllocation,
} from './types.js';

/**
 * Create a git worktree for isolated ADW execution
 *
 * Creates a new git worktree at trees/<adw_id>/ branching from origin/main.
 * The worktree provides an isolated git working directory for the ADW workflow,
 * allowing multiple workflows to run concurrently without conflicts.
 *
 * Process:
 * 1. Create trees/ directory if it doesn't exist
 * 2. Check if worktree already exists (returns early if so)
 * 3. Fetch latest changes from origin
 * 4. Create worktree with new branch using git worktree add
 * 5. If branch already exists, retry without -b flag
 * 6. Allocate ports and return WorktreeConfig
 *
 * @param adwId - The ADW workflow identifier
 * @param branchName - Git branch name for the worktree
 * @returns Promise resolving to WorktreeConfig with path and port allocation
 * @throws Error if worktree creation fails
 *
 * @example
 * ```typescript
 * const config = await createWorktree('abc12345', 'feat-123-abc12345-new-feature');
 * console.log(`Worktree created at ${config.worktreePath}`);
 * console.log(`Backend port: ${config.ports.backendPort}`);
 * ```
 */
export async function createWorktree(
  adwId: string,
  branchName: string
): Promise<WorktreeConfig> {
  const workingDir = env.ADW_WORKING_DIR;
  const treesDir = path.join(workingDir, 'trees');
  const worktreePath = path.join(treesDir, adwId);

  logger.info({ adwId, branchName, worktreePath }, 'Creating worktree');

  // Create trees/ directory if it doesn't exist
  if (!fs.existsSync(treesDir)) {
    fs.mkdirSync(treesDir, { recursive: true });
    logger.debug({ treesDir }, 'Created trees directory');
  }

  // Check if worktree already exists
  if (fs.existsSync(worktreePath)) {
    logger.warn({ worktreePath }, 'Worktree already exists, returning existing configuration');
    const ports = await allocatePorts(adwId);
    return {
      adwId,
      branchName,
      worktreePath,
      ports,
    };
  }

  const git = getGit(workingDir);

  try {
    // Fetch latest changes from origin
    logger.debug('Fetching latest changes from origin');
    await git.raw(['fetch', 'origin']);
    logger.debug('Fetch completed successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn({ error: message }, 'Failed to fetch from origin, continuing anyway');
  }

  try {
    // Create worktree with new branch from origin/main
    logger.debug({ branchName, worktreePath }, 'Creating worktree with new branch');
    await git.raw(['worktree', 'add', '-b', branchName, worktreePath, 'origin/main']);
    logger.info({ worktreePath, branchName }, 'Worktree created successfully with new branch');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // If branch already exists, retry without -b flag
    if (message.includes('already exists')) {
      logger.debug({ branchName }, 'Branch already exists, retrying without -b flag');
      try {
        await git.raw(['worktree', 'add', worktreePath, branchName]);
        logger.info({ worktreePath, branchName }, 'Worktree created successfully with existing branch');
      } catch (retryError) {
        const retryMessage = retryError instanceof Error ? retryError.message : String(retryError);
        logger.error({ error: retryMessage, branchName, worktreePath }, 'Failed to create worktree on retry');
        throw new Error(`Failed to create worktree: ${retryMessage}`);
      }
    } else {
      logger.error({ error: message, branchName, worktreePath }, 'Failed to create worktree');
      throw new Error(`Failed to create worktree: ${message}`);
    }
  }

  // Allocate ports for this worktree
  const ports = await allocatePorts(adwId);

  return {
    adwId,
    branchName,
    worktreePath,
    ports,
  };
}

/**
 * Validate that a worktree exists and is properly configured
 *
 * Performs two-way validation to ensure consistency:
 * 1. Directory exists on filesystem
 * 2. Git knows about the worktree (via git worktree list)
 *
 * This ensures that the worktree is in a valid state and can be used
 * for workflow execution.
 *
 * @param adwId - The ADW workflow identifier
 * @param worktreePath - Path to the worktree directory
 * @returns Promise resolving to WorktreeValidation result
 *
 * @example
 * ```typescript
 * const validation = await validateWorktree('abc12345', '/path/to/trees/abc12345');
 * if (validation.isValid) {
 *   console.log('Worktree is valid');
 * } else {
 *   console.error(`Validation failed: ${validation.error}`);
 * }
 * ```
 */
export async function validateWorktree(
  adwId: string,
  worktreePath: string
): Promise<WorktreeValidation> {
  logger.debug({ adwId, worktreePath }, 'Validating worktree');

  // Check if directory exists on filesystem
  if (!fs.existsSync(worktreePath)) {
    const error = `Worktree directory not found: ${worktreePath}`;
    logger.warn({ adwId, worktreePath }, error);
    return {
      exists: false,
      isValid: false,
      error,
    };
  }

  // Check if git knows about the worktree
  const git = getGit(env.ADW_WORKING_DIR);
  try {
    const worktreeListOutput = await git.raw(['worktree', 'list']);
    const isRegistered = worktreeListOutput.includes(worktreePath);

    if (!isRegistered) {
      const error = 'Worktree not registered with git';
      logger.warn({ adwId, worktreePath }, error);
      return {
        exists: true,
        isValid: false,
        error,
      };
    }

    logger.debug({ adwId, worktreePath }, 'Worktree validation successful');
    return {
      exists: true,
      isValid: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error({ adwId, worktreePath, error: message }, 'Failed to validate worktree');
    return {
      exists: true,
      isValid: false,
      error: `Git validation failed: ${message}`,
    };
  }
}

/**
 * Get the filesystem path for a worktree
 *
 * Constructs the absolute path to the worktree directory for a given ADW ID.
 * This is a simple path construction utility that does not perform validation.
 *
 * @param adwId - The ADW workflow identifier
 * @returns Absolute path to the worktree directory
 *
 * @example
 * ```typescript
 * const path = getWorktreePath('abc12345');
 * console.log(path); // => '/opt/ozean-licht-ecosystem/trees/abc12345'
 * ```
 */
export function getWorktreePath(adwId: string): string {
  return path.join(env.ADW_WORKING_DIR, 'trees', adwId);
}

/**
 * Remove a worktree and clean up
 *
 * Removes a git worktree using git worktree remove with --force flag.
 * If git removal fails, attempts manual cleanup using fs.rmSync().
 *
 * This function is used during workflow cleanup to reclaim resources
 * and prevent accumulation of stale worktrees.
 *
 * @param adwId - The ADW workflow identifier
 * @returns Promise resolving to true if removal succeeded, false otherwise
 *
 * @example
 * ```typescript
 * const success = await removeWorktree('abc12345');
 * if (success) {
 *   console.log('Worktree removed successfully');
 * } else {
 *   console.error('Failed to remove worktree');
 * }
 * ```
 */
export async function removeWorktree(adwId: string): Promise<boolean> {
  const worktreePath = getWorktreePath(adwId);

  logger.info({ adwId, worktreePath }, 'Removing worktree');

  const git = getGit(env.ADW_WORKING_DIR);

  try {
    // Try to remove via git worktree remove
    await git.raw(['worktree', 'remove', worktreePath, '--force']);
    logger.info({ adwId, worktreePath }, 'Worktree removed successfully via git');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn({ adwId, worktreePath, error: message }, 'Git worktree remove failed, attempting manual cleanup');

    // Try manual cleanup if git command failed
    if (fs.existsSync(worktreePath)) {
      try {
        fs.rmSync(worktreePath, { recursive: true, force: true });
        logger.info({ adwId, worktreePath }, 'Worktree removed successfully via manual cleanup');
        return true;
      } catch (cleanupError) {
        const cleanupMessage = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
        logger.error(
          { adwId, worktreePath, gitError: message, cleanupError: cleanupMessage },
          'Failed to remove worktree'
        );
        return false;
      }
    }

    // If directory doesn't exist, consider it a success
    logger.warn({ adwId, worktreePath }, 'Worktree directory does not exist, considering removal successful');
    return true;
  }
}

/**
 * Setup worktree environment with port configuration
 *
 * Creates a .ports.env file in the worktree containing port allocation
 * for backend and frontend services. This file is sourced by the application
 * to ensure each worktree uses unique ports.
 *
 * The .ports.env file contains:
 * - BACKEND_PORT: Port for backend server
 * - FRONTEND_PORT: Port for frontend dev server
 * - VITE_BACKEND_URL: Full URL for backend API
 *
 * @param worktreePath - Path to the worktree directory
 * @param backendPort - Port number for backend server
 * @param frontendPort - Port number for frontend dev server
 *
 * @example
 * ```typescript
 * await setupWorktreeEnvironment('/path/to/trees/abc12345', 9107, 9207);
 * // Creates .ports.env with:
 * // BACKEND_PORT=9107
 * // FRONTEND_PORT=9207
 * // VITE_BACKEND_URL=http://localhost:9107
 * ```
 */
export function setupWorktreeEnvironment(
  worktreePath: string,
  backendPort: number,
  frontendPort: number
): void {
  const portsEnvPath = path.join(worktreePath, '.ports.env');

  logger.info({ worktreePath, backendPort, frontendPort }, 'Setting up worktree environment');

  const content = `BACKEND_PORT=${backendPort}
FRONTEND_PORT=${frontendPort}
VITE_BACKEND_URL=http://localhost:${backendPort}
`;

  fs.writeFileSync(portsEnvPath, content, 'utf8');

  logger.info({ portsEnvPath, backendPort, frontendPort }, 'Created .ports.env file');
}

/**
 * Allocate unique ports for a workflow
 *
 * Uses deterministic port allocation based on ADW ID to ensure the same
 * workflow always gets the same ports (important for resuming workflows).
 *
 * Process:
 * 1. Calculate deterministic ports using getPortsForAdw()
 * 2. Check if ports are available
 * 3. If not available, use findAvailablePort() to scan for alternatives
 *
 * Port ranges:
 * - Backend: 9100-9114 (15 slots)
 * - Frontend: 9200-9214 (15 slots)
 *
 * @param adwId - The ADW workflow identifier
 * @returns Promise resolving to PortAllocation
 * @throws Error if no available ports found
 *
 * @example
 * ```typescript
 * const ports = await allocatePorts('abc12345');
 * console.log(`Backend: ${ports.backendPort}, Frontend: ${ports.frontendPort}`);
 * ```
 */
export async function allocatePorts(adwId: string): Promise<PortAllocation> {
  logger.debug({ adwId }, 'Allocating ports for ADW workflow');

  // Get deterministic port assignment
  const deterministic = getPortsForAdw(
    adwId,
    env.ADW_BACKEND_PORT_START,
    env.ADW_FRONTEND_PORT_START,
    env.ADW_MAX_CONCURRENT_WORKFLOWS
  );

  // Check if deterministic ports are available
  const backendAvailable = await isPortAvailable(deterministic.backendPort);
  const frontendAvailable = await isPortAvailable(deterministic.frontendPort);

  if (backendAvailable && frontendAvailable) {
    logger.info(
      { adwId, backendPort: deterministic.backendPort, frontendPort: deterministic.frontendPort },
      'Allocated deterministic ports'
    );
    return {
      backendPort: deterministic.backendPort,
      frontendPort: deterministic.frontendPort,
    };
  }

  // If deterministic ports not available, find alternative ports
  logger.warn(
    { adwId, deterministicBackend: deterministic.backendPort, deterministicFrontend: deterministic.frontendPort },
    'Deterministic ports not available, searching for alternatives'
  );

  let backendPort = deterministic.backendPort;
  let frontendPort = deterministic.frontendPort;

  if (!backendAvailable) {
    backendPort = await findAvailablePort(
      env.ADW_BACKEND_PORT_START,
      env.ADW_MAX_CONCURRENT_WORKFLOWS
    );
    logger.debug({ adwId, backendPort }, 'Found alternative backend port');
  }

  if (!frontendAvailable) {
    frontendPort = await findAvailablePort(
      env.ADW_FRONTEND_PORT_START,
      env.ADW_MAX_CONCURRENT_WORKFLOWS
    );
    logger.debug({ adwId, frontendPort }, 'Found alternative frontend port');
  }

  logger.info(
    { adwId, backendPort, frontendPort },
    'Allocated alternative ports'
  );

  return {
    backendPort,
    frontendPort,
  };
}
