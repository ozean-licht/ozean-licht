/**
 * GitHub Integration Module - AI Developer Workflow (ADW)
 *
 * This module provides GitHub operations using the Octokit REST API client.
 * It replaces the Python implementation's subprocess calls to `gh` CLI with
 * native TypeScript/JavaScript API calls for better type safety and performance.
 *
 * Key differences from Python:
 * - Python: Uses `gh` CLI via subprocess
 * - TypeScript: Uses @octokit/rest native client with TypeScript types
 *
 * Features:
 * - Singleton Octokit instance for performance
 * - Cached repository information
 * - ADW_BOT_IDENTIFIER for loop prevention
 * - Comprehensive error handling and logging
 *
 * @module modules/adw/github-integration
 */

import { Octokit } from '@octokit/rest';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';
import { GitHubIssue, GitHubPullRequest } from './types.js';
import { getGit } from './git-operations.js';

/**
 * Bot identifier used to prevent webhook loops and filter bot comments
 *
 * All comments posted by ADW agents include this identifier at the start.
 * When searching for keyword comments, comments with this identifier are skipped
 * to prevent the system from responding to its own messages.
 */
export const ADW_BOT_IDENTIFIER = '[ADW-AGENTS]';

// ============================================================================
// Singleton Instances
// ============================================================================

/**
 * Cached Octokit instance
 * Initialized once on first use and reused for all subsequent API calls
 */
let octokitInstance: Octokit | null = null;

/**
 * Cached repository information
 * Extracted from git remote URL and cached for performance
 */
let repoInfoCache: { owner: string; repo: string } | null = null;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get authenticated Octokit instance
 *
 * Returns a singleton Octokit instance authenticated with the GitHub token
 * from environment variables. The instance is created once and cached for
 * subsequent calls.
 *
 * @returns Authenticated Octokit instance
 * @throws {Error} If GITHUB_TOKEN is not set in environment
 *
 * @example
 * ```typescript
 * const octokit = getOctokit();
 * const { data } = await octokit.rest.issues.list({ owner, repo });
 * ```
 */
export function getOctokit(): Octokit {
  if (!octokitInstance) {
    if (!env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN not set in environment');
    }
    octokitInstance = new Octokit({ auth: env.GITHUB_TOKEN });
    logger.debug('Created new Octokit instance');
  }
  return octokitInstance;
}

/**
 * Get repository owner and name from git remote URL
 *
 * Extracts the owner/repo information from the git remote URL and caches it
 * for performance. Supports both HTTPS and SSH GitHub URLs.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Repository owner and name
 * @throws {Error} If git remote is not found or URL cannot be parsed
 *
 * @example
 * ```typescript
 * const { owner, repo } = await getRepoInfo();
 * console.log(`Repository: ${owner}/${repo}`);
 * ```
 */
export async function getRepoInfo(cwd?: string): Promise<{ owner: string; repo: string }> {
  // Return cached value if available
  if (repoInfoCache) {
    return repoInfoCache;
  }

  try {
    const git = getGit(cwd);
    const remotes = await git.getRemotes(true);

    if (remotes.length === 0) {
      throw new Error('No git remotes found. Please ensure you are in a git repository with a remote.');
    }

    // Find origin remote or use first available
    const origin = remotes.find(r => r.name === 'origin') || remotes[0];
    if (!origin.refs.fetch) {
      throw new Error('Git remote URL not found');
    }

    const url = origin.refs.fetch;

    // Parse owner/repo from URL
    // Supports: https://github.com/owner/repo.git and git@github.com:owner/repo.git
    let match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)/);

    if (!match) {
      throw new Error(`Could not parse GitHub repository from URL: ${url}`);
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');

    repoInfoCache = { owner, repo };
    logger.debug({ owner, repo }, 'Extracted repository information');

    return repoInfoCache;
  } catch (error) {
    logger.error({ error, cwd }, 'Failed to get repository information');
    throw error;
  }
}

/**
 * Fetch a GitHub issue by number
 *
 * Retrieves complete issue data including title, body, labels, and metadata.
 *
 * @param issueNumber - Issue number to fetch
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to GitHubIssue
 * @throws {Error} If issue is not found or API call fails
 *
 * @example
 * ```typescript
 * const issue = await fetchIssue(123);
 * console.log(`Issue: ${issue.title}`);
 * console.log(`State: ${issue.state}`);
 * ```
 */
export async function fetchIssue(issueNumber: number, cwd?: string): Promise<GitHubIssue> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ issueNumber, owner, repo }, 'Fetching issue');

    const { data } = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    // Map Octokit response to our GitHubIssue interface
    const issue: GitHubIssue = {
      number: data.number,
      title: data.title,
      body: data.body || '',
      state: data.state as 'open' | 'closed',
      labels: data.labels.map(label =>
        typeof label === 'string' ? label : label.name || ''
      ),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    logger.info({ issueNumber, title: issue.title }, 'Successfully fetched issue');
    return issue;
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to fetch issue');
    throw new Error(`Failed to fetch issue #${issueNumber}: ${error}`);
  }
}

/**
 * Fetch all open issues from the repository
 *
 * Retrieves a list of all open issues with pagination support.
 * Returns up to 100 issues per request.
 *
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to array of GitHubIssue
 *
 * @example
 * ```typescript
 * const issues = await fetchOpenIssues();
 * console.log(`Found ${issues.length} open issues`);
 * ```
 */
export async function fetchOpenIssues(cwd?: string): Promise<GitHubIssue[]> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ owner, repo }, 'Fetching open issues');

    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 100,
    });

    // Map Octokit responses to our GitHubIssue interface
    const issues: GitHubIssue[] = data.map(issue => ({
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      state: issue.state as 'open' | 'closed',
      labels: issue.labels.map(label =>
        typeof label === 'string' ? label : label.name || ''
      ),
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
    }));

    logger.info({ count: issues.length }, 'Fetched open issues');
    return issues;
  } catch (error) {
    logger.error({ error }, 'Failed to fetch open issues');
    throw new Error(`Failed to fetch open issues: ${error}`);
  }
}

/**
 * Fetch all comments for a specific issue
 *
 * Retrieves all comments on an issue, sorted by creation time (oldest first).
 *
 * @param issueNumber - Issue number to fetch comments for
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to array of comment objects
 *
 * @example
 * ```typescript
 * const comments = await fetchIssueComments(123);
 * console.log(`Issue has ${comments.length} comments`);
 * ```
 */
export async function fetchIssueComments(
  issueNumber: number,
  cwd?: string
): Promise<Array<{ id: number; body: string; createdAt: Date; author: string }>> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ issueNumber, owner, repo }, 'Fetching issue comments');

    const { data } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
    });

    // Map to simplified comment structure
    const comments = data.map(comment => ({
      id: comment.id,
      body: comment.body || '',
      createdAt: new Date(comment.created_at),
      author: comment.user?.login || 'unknown',
    }));

    // Sort by creation time (ascending - oldest first)
    comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    logger.debug({ issueNumber, count: comments.length }, 'Fetched issue comments');
    return comments;
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to fetch issue comments');
    throw new Error(`Failed to fetch comments for issue #${issueNumber}: ${error}`);
  }
}

/**
 * Find the latest comment containing a keyword
 *
 * Searches through issue comments for a specific keyword and returns the latest
 * matching comment. Comments with ADW_BOT_IDENTIFIER are skipped to prevent
 * the system from responding to its own messages (loop prevention).
 *
 * @param keyword - Keyword to search for in comment bodies
 * @param issueNumber - Issue number to search comments in
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to latest matching comment or null if not found
 *
 * @example
 * ```typescript
 * const comment = await findKeywordFromComment('/adw-sdlc', 123);
 * if (comment) {
 *   console.log(`Found command in comment by ${comment.author}`);
 * }
 * ```
 */
export async function findKeywordFromComment(
  keyword: string,
  issueNumber: number,
  cwd?: string
): Promise<{ id: number; body: string; createdAt: Date; author: string } | null> {
  try {
    const comments = await fetchIssueComments(issueNumber, cwd);

    // Sort by creation time (newest first)
    const sortedComments = [...comments].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Search through comments (newest first)
    for (const comment of sortedComments) {
      // Skip ADW bot comments to prevent loops
      if (comment.body.includes(ADW_BOT_IDENTIFIER)) {
        continue;
      }

      if (comment.body.includes(keyword)) {
        logger.debug(
          { keyword, issueNumber, commentId: comment.id },
          'Found keyword in comment'
        );
        return comment;
      }
    }

    logger.debug({ keyword, issueNumber }, 'Keyword not found in comments');
    return null;
  } catch (error) {
    logger.error({ error, keyword, issueNumber }, 'Failed to search for keyword in comments');
    throw new Error(`Failed to search for keyword in issue #${issueNumber}: ${error}`);
  }
}

/**
 * Post a comment to a GitHub issue
 *
 * Creates a new comment on the specified issue. Automatically prepends
 * ADW_BOT_IDENTIFIER if not already present to enable loop prevention.
 *
 * @param issueNumber - Issue number to comment on
 * @param comment - Comment text to post
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when comment is posted
 * @throws {Error} If comment posting fails
 *
 * @example
 * ```typescript
 * await makeIssueComment(123, 'ADW is working on this issue...');
 * ```
 */
export async function makeIssueComment(
  issueNumber: number,
  comment: string,
  cwd?: string
): Promise<void> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    // Ensure comment has ADW_BOT_IDENTIFIER to prevent webhook loops
    let finalComment = comment;
    if (!comment.startsWith(ADW_BOT_IDENTIFIER)) {
      finalComment = `${ADW_BOT_IDENTIFIER} ${comment}`;
    }

    logger.debug({ issueNumber, owner, repo }, 'Posting issue comment');

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: finalComment,
    });

    logger.info({ issueNumber }, 'Successfully posted comment to issue');
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to post comment');
    throw new Error(`Failed to post comment to issue #${issueNumber}: ${error}`);
  }
}

/**
 * Mark an issue as in progress
 *
 * Adds the 'in_progress' label and assigns the issue to the authenticated user.
 * Handles cases where the label doesn't exist gracefully by logging a warning.
 *
 * @param issueNumber - Issue number to mark as in progress
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when operations complete
 *
 * @example
 * ```typescript
 * await markIssueInProgress(123);
 * console.log('Issue marked as in progress');
 * ```
 */
export async function markIssueInProgress(issueNumber: number, cwd?: string): Promise<void> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ issueNumber, owner, repo }, 'Marking issue as in progress');

    // Try to add 'in_progress' label
    try {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: ['in_progress'],
      });
      logger.debug({ issueNumber }, 'Added in_progress label');
    } catch (error) {
      // Label may not exist in repository, log warning but continue
      logger.warn(
        { error, issueNumber },
        'Could not add in_progress label (label may not exist)'
      );
    }

    // Assign to authenticated user
    try {
      // Get authenticated user
      const { data: user } = await octokit.rest.users.getAuthenticated();

      await octokit.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: issueNumber,
        assignees: [user.login],
      });
      logger.info({ issueNumber, assignee: user.login }, 'Assigned issue to self');
    } catch (error) {
      logger.warn({ error, issueNumber }, 'Could not assign issue to self');
    }
  } catch (error) {
    logger.error({ error, issueNumber }, 'Failed to mark issue as in progress');
    throw new Error(`Failed to mark issue #${issueNumber} as in progress: ${error}`);
  }
}

/**
 * Create a pull request
 *
 * Creates a new pull request with the specified title, body, and branch information.
 *
 * @param title - PR title
 * @param body - PR description/body
 * @param head - Head branch (source branch with changes)
 * @param base - Base branch (target branch, e.g., 'main')
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise resolving to the PR number
 * @throws {Error} If PR creation fails
 *
 * @example
 * ```typescript
 * const prNumber = await createPullRequest(
 *   'feat: add new feature',
 *   'This PR adds a new feature...',
 *   'feat/new-feature',
 *   'main'
 * );
 * console.log(`Created PR #${prNumber}`);
 * ```
 */
export async function createPullRequest(
  title: string,
  body: string,
  head: string,
  base: string,
  cwd?: string
): Promise<number> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ title, head, base, owner, repo }, 'Creating pull request');

    const { data } = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });

    logger.info({ prNumber: data.number, title }, 'Successfully created pull request');
    return data.number;
  } catch (error) {
    logger.error({ error, title, head, base }, 'Failed to create pull request');
    throw new Error(`Failed to create pull request: ${error}`);
  }
}

/**
 * Merge a pull request
 *
 * Merges the specified pull request using the squash merge method.
 *
 * @param prNumber - Pull request number to merge
 * @param mergeMethod - Merge method ('squash', 'merge', or 'rebase')
 * @param cwd - Working directory path (defaults to current directory)
 * @returns Promise that resolves when PR is merged
 * @throws {Error} If merge fails
 *
 * @example
 * ```typescript
 * await mergePullRequest(123, 'squash');
 * console.log('PR merged successfully');
 * ```
 */
export async function mergePullRequest(
  prNumber: number,
  mergeMethod: 'squash' | 'merge' | 'rebase' = 'squash',
  cwd?: string
): Promise<void> {
  try {
    const octokit = getOctokit();
    const { owner, repo } = await getRepoInfo(cwd);

    logger.debug({ prNumber, mergeMethod, owner, repo }, 'Merging pull request');

    await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      merge_method: mergeMethod,
    });

    logger.info({ prNumber, mergeMethod }, 'Successfully merged pull request');
  } catch (error) {
    logger.error({ error, prNumber, mergeMethod }, 'Failed to merge pull request');
    throw new Error(`Failed to merge pull request #${prNumber}: ${error}`);
  }
}
