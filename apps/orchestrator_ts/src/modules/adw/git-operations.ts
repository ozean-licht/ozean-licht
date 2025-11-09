/**
 * Git Operations
 *
 * Provides git commands using simple-git library.
 * Supports working directory context for worktree operations.
 *
 * @module modules/adw/git-operations
 */

import simpleGit, { SimpleGit } from 'simple-git';
import { logger } from '../../config/logger.js';

/**
 * Get a SimpleGit instance configured for a working directory
 *
 * Creates and configures a simple-git instance with appropriate settings
 * for git operations in the specified directory or current working directory.
 *
 * @param cwd - Working directory path (defaults to process.cwd())
 * @returns Configured SimpleGit instance
 *
 * @example
 * ```typescript
 * // Use default current working directory
 * const git = getGit();
 *
 * // Use specific worktree path
 * const worktreeGit = getGit('/path/to/worktree');
 * ```
 */
export function getGit(cwd?: string): SimpleGit {
  return simpleGit({
    baseDir: cwd ?? process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
  });
}

/**
 * Get the current branch name
 *
 * Retrieves the name of the currently checked out branch in the
 * specified working directory.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to the branch name
 *
 * @example
 * ```typescript
 * const branch = await getCurrentBranch();
 * console.log(`Current branch: ${branch}`);
 *
 * // For a specific worktree
 * const worktreeBranch = await getCurrentBranch('/path/to/worktree');
 * ```
 */
export async function getCurrentBranch(cwd?: string): Promise<string> {
  const git = getGit(cwd);
  const status = await git.status();

  logger.debug({ branch: status.current, cwd }, 'Got current branch');
  return status.current || 'HEAD';
}

/**
 * Create and checkout a new branch
 *
 * Creates a new local branch and immediately checks it out.
 * Equivalent to `git checkout -b <branchName>`.
 *
 * @param branchName - Name of the branch to create
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when branch is created and checked out
 *
 * @example
 * ```typescript
 * await createBranch('feat/new-feature');
 *
 * // In a specific worktree
 * await createBranch('fix/bug-123', '/path/to/worktree');
 * ```
 */
export async function createBranch(branchName: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, cwd }, 'Creating branch');
  await git.checkoutLocalBranch(branchName);
}

/**
 * Checkout an existing branch
 *
 * Switches to an existing branch in the working directory.
 * Equivalent to `git checkout <branchName>`.
 *
 * @param branchName - Name of the branch to checkout
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when branch is checked out
 *
 * @example
 * ```typescript
 * await checkoutBranch('main');
 *
 * // In a specific worktree
 * await checkoutBranch('develop', '/path/to/worktree');
 * ```
 */
export async function checkoutBranch(branchName: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, cwd }, 'Checking out branch');
  await git.checkout(branchName);
}

/**
 * Stage all changes in the working directory
 *
 * Stages all modified, new, and deleted files for commit.
 * Equivalent to `git add .`.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when all changes are staged
 *
 * @example
 * ```typescript
 * await stageAll();
 *
 * // In a specific worktree
 * await stageAll('/path/to/worktree');
 * ```
 */
export async function stageAll(cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.debug({ cwd }, 'Staging all changes');
  await git.add('.');
}

/**
 * Create a commit with the given message
 *
 * Commits all staged changes with the provided commit message.
 * Equivalent to `git commit -m "<message>"`.
 *
 * @param message - Commit message
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when commit is created
 *
 * @example
 * ```typescript
 * await commit('feat: add new feature');
 *
 * // In a specific worktree
 * await commit('fix: resolve bug', '/path/to/worktree');
 * ```
 */
export async function commit(message: string, cwd?: string): Promise<void> {
  const git = getGit(cwd);

  logger.info({ message: message.substring(0, 50), cwd }, 'Creating commit');
  await git.commit(message);
}

/**
 * Push a branch to the remote repository
 *
 * Pushes the specified branch to the remote repository with the
 * --set-upstream flag to establish tracking relationship.
 * Equivalent to `git push --set-upstream <remote> <branchName>`.
 *
 * @param branchName - Name of the branch to push
 * @param remote - Remote name (defaults to 'origin')
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when push is complete
 *
 * @example
 * ```typescript
 * await pushBranch('feat/new-feature');
 *
 * // Push to a different remote
 * await pushBranch('feat/new-feature', 'upstream');
 *
 * // In a specific worktree
 * await pushBranch('feat/new-feature', 'origin', '/path/to/worktree');
 * ```
 */
export async function pushBranch(
  branchName: string,
  remote = 'origin',
  cwd?: string
): Promise<void> {
  const git = getGit(cwd);

  logger.info({ branchName, remote, cwd }, 'Pushing branch');
  await git.push(remote, branchName, ['--set-upstream']);
}

/**
 * Get the total number of commits in the current branch
 *
 * Retrieves the commit count for the current branch.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to the number of commits
 *
 * @example
 * ```typescript
 * const count = await getCommitCount();
 * console.log(`Total commits: ${count}`);
 *
 * // For a specific worktree
 * const worktreeCount = await getCommitCount('/path/to/worktree');
 * ```
 */
export async function getCommitCount(cwd?: string): Promise<number> {
  const git = getGit(cwd);

  const log = await git.log();
  return log.total;
}

/**
 * Check if the working directory is clean
 *
 * Determines whether the working directory has any uncommitted changes,
 * including untracked files, modified files, or staged changes.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to true if working directory is clean, false otherwise
 *
 * @example
 * ```typescript
 * const clean = await isClean();
 * if (clean) {
 *   console.log('Working directory is clean');
 * } else {
 *   console.log('There are uncommitted changes');
 * }
 *
 * // For a specific worktree
 * const worktreeClean = await isClean('/path/to/worktree');
 * ```
 */
export async function isClean(cwd?: string): Promise<boolean> {
  const git = getGit(cwd);

  const status = await git.status();
  return status.isClean();
}
