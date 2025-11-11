/**
 * Git operations helpers for hooks
 */

import { execSync } from 'child_process';
import { logger } from './logger';
import { GitStatus, GitCommit } from '../types';

/**
 * Execute git command safely
 */
function execGit(command: string, cwd?: string): string {
  try {
    const repoPath = cwd || process.env.GIT_REPO_PATH || '/opt/ozean-licht-ecosystem';
    const result = execSync(`git ${command}`, {
      cwd: repoPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (error: any) {
    logger.error('Git command failed', error, { command });
    throw new Error(`Git command failed: ${command}`);
  }
}

/**
 * Get current git status
 */
export function getStatus(): GitStatus {
  try {
    const branch = execGit('rev-parse --abbrev-ref HEAD');

    // Get ahead/behind counts
    let ahead = 0;
    let behind = 0;
    try {
      const aheadBehind = execGit('rev-list --left-right --count @{u}...HEAD');
      const [behindStr, aheadStr] = aheadBehind.split('\t');
      behind = parseInt(behindStr, 10) || 0;
      ahead = parseInt(aheadStr, 10) || 0;
    } catch (e) {
      // No upstream branch
    }

    // Get file status
    const statusOutput = execGit('status --porcelain');
    const lines = statusOutput.split('\n').filter(line => line.trim());

    const staged: string[] = [];
    const unstaged: string[] = [];
    const untracked: string[] = [];
    const conflicted: string[] = [];

    lines.forEach(line => {
      const status = line.substring(0, 2);
      const file = line.substring(3);

      if (status.includes('U') || status.includes('A') && status.includes('A')) {
        conflicted.push(file);
      } else if (status[0] !== ' ' && status[0] !== '?') {
        staged.push(file);
      }

      if (status[1] !== ' ' && status[1] !== '?') {
        unstaged.push(file);
      }

      if (status === '??') {
        untracked.push(file);
      }
    });

    return {
      branch,
      ahead,
      behind,
      staged,
      unstaged,
      untracked,
      conflicted,
    };
  } catch (error) {
    logger.error('Failed to get git status', error as Error);
    throw error;
  }
}

/**
 * Get recent commits
 */
export function getRecentCommits(count: number = 5): GitCommit[] {
  try {
    const format = '%H%n%an%n%ae%n%aI%n%s%n---COMMIT---';
    const output = execGit(`log -${count} --pretty=format:"${format}"`);

    const commits: GitCommit[] = [];
    const commitBlocks = output.split('---COMMIT---').filter(b => b.trim());

    commitBlocks.forEach(block => {
      const lines = block.trim().split('\n');
      if (lines.length >= 5) {
        commits.push({
          hash: lines[0],
          author: lines[1],
          email: lines[2],
          date: lines[3],
          message: lines[4],
        });
      }
    });

    return commits;
  } catch (error) {
    logger.error('Failed to get recent commits', error as Error);
    return [];
  }
}

/**
 * Get current branch name
 */
export function getCurrentBranch(): string {
  try {
    return execGit('rev-parse --abbrev-ref HEAD');
  } catch (error) {
    logger.error('Failed to get current branch', error as Error);
    return 'unknown';
  }
}

/**
 * Check if branch is main/master
 */
export function isMainBranch(): boolean {
  const branch = getCurrentBranch();
  return branch === 'main' || branch === 'master';
}

/**
 * Get staged files
 */
export function getStagedFiles(): string[] {
  try {
    const output = execGit('diff --cached --name-only');
    return output ? output.split('\n').filter(f => f.trim()) : [];
  } catch (error) {
    logger.error('Failed to get staged files', error as Error);
    return [];
  }
}

/**
 * Get unstaged changes
 */
export function getUnstagedFiles(): string[] {
  try {
    const output = execGit('diff --name-only');
    return output ? output.split('\n').filter(f => f.trim()) : [];
  } catch (error) {
    logger.error('Failed to get unstaged files', error as Error);
    return [];
  }
}

/**
 * Check if file contains potential secrets
 */
export function containsSecrets(filename: string): boolean {
  const secretPatterns = [
    /\.env$/,
    /\.env\./,
    /credentials\.json$/,
    /secrets\./,
    /private.*key/i,
    /\.pem$/,
    /\.key$/,
    /password/i,
    /secret/i,
  ];

  return secretPatterns.some(pattern => pattern.test(filename));
}

/**
 * Get file type from extension
 */
export function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    py: 'python',
    go: 'go',
    rs: 'rust',
    java: 'java',
    rb: 'ruby',
    php: 'php',
    css: 'css',
    scss: 'scss',
    html: 'html',
    sql: 'sql',
  };

  return typeMap[ext || ''] || 'unknown';
}

/**
 * Check if repository is clean
 */
export function isClean(): boolean {
  try {
    const output = execGit('status --porcelain');
    return !output;
  } catch (error) {
    logger.error('Failed to check if repository is clean', error as Error);
    return false;
  }
}

/**
 * Get diff summary
 */
export function getDiffSummary(staged: boolean = true): string {
  try {
    const command = staged ? 'diff --cached --stat' : 'diff --stat';
    return execGit(command);
  } catch (error) {
    logger.error('Failed to get diff summary', error as Error);
    return '';
  }
}

/**
 * Check if branch has upstream
 */
export function hasUpstream(): boolean {
  try {
    execGit('rev-parse --abbrev-ref @{u}');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate git repository
 */
export function isGitRepository(_path?: string): boolean {
  try {
    execGit('rev-parse --git-dir');
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getStatus,
  getRecentCommits,
  getCurrentBranch,
  isMainBranch,
  getStagedFiles,
  getUnstagedFiles,
  containsSecrets,
  getFileType,
  isClean,
  getDiffSummary,
  hasUpstream,
  isGitRepository,
};
