/**
 * ADW Utility Functions
 *
 * Provides utility functions for ADW workflow operations including:
 * - ID generation
 * - Port allocation
 * - Branch name generation
 * - Retry logic with exponential backoff
 *
 * @module modules/adw/utils
 */

import crypto from 'crypto';
import net from 'net';
import { logger } from '../../config/logger.js';

/**
 * Generate a unique 8-character ADW ID
 *
 * Uses base36 encoding of random bytes for short, URL-safe IDs.
 * The ID is deterministic from the random bytes and suitable for use
 * in branch names, file paths, and URLs.
 *
 * @returns 8-character lowercase alphanumeric string
 *
 * @example
 * ```typescript
 * const id = generateAdwId();
 * console.log(id); // => 'a1b2c3d4'
 * ```
 */
export function generateAdwId(): string {
  const randomBytes = crypto.randomBytes(4);
  const num = randomBytes.readUInt32BE(0);
  const id = num.toString(36).padStart(8, '0').substring(0, 8);
  logger.debug({ adwId: id }, 'Generated ADW ID');
  return id;
}

/**
 * Calculate deterministic port allocation based on ADW ID
 *
 * Hashes the ADW ID to consistently assign the same ports
 * for the same workflow across restarts. This ensures that
 * workflows can be resumed with the same port configuration.
 *
 * @param adwId - The workflow identifier
 * @param backendStart - Starting port for backend (default: 9100)
 * @param frontendStart - Starting port for frontend (default: 9200)
 * @param maxSlots - Maximum concurrent workflows (default: 15)
 * @returns Object with backendPort and frontendPort
 * @throws Error if adwId is empty
 *
 * @example
 * ```typescript
 * const ports = getPortsForAdw('abc12345');
 * console.log(ports); // => { backendPort: 9107, frontendPort: 9207 }
 * ```
 */
export function getPortsForAdw(
  adwId: string,
  backendStart = 9100,
  frontendStart = 9200,
  maxSlots = 15
): { backendPort: number; frontendPort: number } {
  if (!adwId) {
    throw new Error('adwId cannot be empty');
  }

  // Convert first 8 chars of adwId to a number using base36
  const hash = parseInt(adwId.substring(0, 8), 36);
  const index = hash % maxSlots;

  const backendPort = backendStart + index;
  const frontendPort = frontendStart + index;

  logger.debug({ adwId, index, backendPort, frontendPort }, 'Allocated ports for ADW');

  return { backendPort, frontendPort };
}

/**
 * Check if a port is available
 *
 * Attempts to listen on the specified port to determine availability.
 * Handles the EADDRINUSE error which indicates the port is in use.
 *
 * @param port - Port number to check
 * @returns Promise resolving to true if port is available, false otherwise
 *
 * @example
 * ```typescript
 * const available = await isPortAvailable(9100);
 * if (available) {
 *   console.log('Port 9100 is available');
 * }
 * ```
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        // Treat other errors as port unavailable to be safe
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

/**
 * Find next available port starting from a base port
 *
 * Sequentially checks ports starting from startPort until an available
 * port is found or maxAttempts is reached.
 *
 * @param startPort - Port to start searching from
 * @param maxAttempts - Maximum ports to try (default: 15)
 * @returns Promise resolving to available port number
 * @throws Error if no available ports found within maxAttempts
 *
 * @example
 * ```typescript
 * try {
 *   const port = await findAvailablePort(9100);
 *   console.log(`Found available port: ${port}`);
 * } catch (error) {
 *   console.error('No ports available');
 * }
 * ```
 */
export async function findAvailablePort(
  startPort: number,
  maxAttempts = 15
): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const available = await isPortAvailable(port);

    if (available) {
      logger.debug({ port, attempts: i + 1 }, 'Found available port');
      return port;
    }
  }

  throw new Error(`No available ports found starting from ${startPort}`);
}

/**
 * Sanitize branch name for git
 *
 * Removes invalid characters and formats the name according to git
 * branch naming conventions:
 * - Converts to lowercase
 * - Replaces invalid characters with hyphens
 * - Removes consecutive hyphens
 * - Trims leading and trailing hyphens
 *
 * @param name - Raw branch name
 * @returns Sanitized branch name
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeBranchName('feat/Add New Feature!');
 * console.log(sanitized); // => 'feat-add-new-feature'
 * ```
 */
export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_/]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate branch name from issue details
 *
 * Creates a standardized branch name following the pattern:
 * `{prefix}-{issueNumber}-{adwId}-{slug}`
 *
 * Where prefix is determined by issue class:
 * - feature -> feat
 * - bug -> fix
 * - chore -> chore
 *
 * @param issueNumber - GitHub issue number
 * @param adwId - ADW identifier
 * @param title - Issue title
 * @param issueClass - Issue classification (feature, bug, chore)
 * @returns Formatted branch name
 *
 * @example
 * ```typescript
 * const branchName = generateBranchName(123, 'abc12345', 'Add user auth', 'feature');
 * console.log(branchName); // => 'feat-123-abc12345-add-user-auth'
 * ```
 */
export function generateBranchName(
  issueNumber: number,
  adwId: string,
  title: string,
  issueClass: 'feature' | 'bug' | 'chore'
): string {
  const prefix = issueClass === 'feature' ? 'feat' :
                 issueClass === 'bug' ? 'fix' : 'chore';

  const slug = sanitizeBranchName(title).substring(0, 50);

  return `${prefix}-${issueNumber}-${adwId}-${slug}`;
}

/**
 * Sleep for specified milliseconds
 *
 * Utility function for introducing delays in async operations.
 * Commonly used with retry logic and rate limiting.
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 *
 * @example
 * ```typescript
 * console.log('Starting...');
 * await sleep(1000);
 * console.log('...after 1 second');
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * Executes an async function and retries on failure with exponentially
 * increasing delays between attempts. The delay follows the formula:
 * delay = baseDelay * 2^attempt
 *
 * @param fn - Async function to retry
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise resolving to function result
 * @throws The last error encountered if all retries fail
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => {
 *     const response = await fetch('https://api.example.com/data');
 *     return response.json();
 *   },
 *   3,
 *   1000
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(
          { attempt: attempt + 1, maxRetries, delay, error: lastError.message },
          'Retrying after error'
        );
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}
