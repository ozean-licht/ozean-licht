/**
 * GitHub API Mock
 *
 * Mock GitHub API responses for integration testing.
 * Allows tests to simulate GitHub operations without external dependencies.
 */

export interface MockIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
}

export interface MockPullRequest {
  number: number;
  title: string;
  body: string;
  head: string;
  base: string;
  state: 'open' | 'closed' | 'merged';
}

/**
 * GitHub API Mock Manager
 *
 * Stores and retrieves mock responses for GitHub API calls.
 */
export class GitHubMock {
  private static issues: Map<number, MockIssue> = new Map();
  private static pullRequests: Map<number, MockPullRequest> = new Map();
  private static createPRResponse: Partial<MockPullRequest> | null = null;
  private static mergePRResponse: Record<number, any> = {};

  /**
   * Mock a GitHub issue response
   *
   * @param issueNumber - Issue number
   * @param data - Issue data
   */
  static mockGetIssue(issueNumber: number, data: Partial<MockIssue>): void {
    this.issues.set(issueNumber, {
      number: issueNumber,
      title: `Test Issue #${issueNumber}`,
      body: 'Test issue body',
      state: 'open',
      labels: [],
      ...data,
    });
  }

  /**
   * Get mocked issue
   *
   * @param issueNumber - Issue number
   * @returns Mocked issue or null
   */
  static getIssue(issueNumber: number): MockIssue | null {
    return this.issues.get(issueNumber) || null;
  }

  /**
   * Mock pull request creation response
   *
   * @param prData - PR data to return
   */
  static mockCreatePullRequest(prData: Partial<MockPullRequest>): void {
    this.createPRResponse = prData;
  }

  /**
   * Get mocked PR creation response
   *
   * @returns Mocked PR data
   */
  static getCreatePRResponse(): Partial<MockPullRequest> | null {
    return this.createPRResponse;
  }

  /**
   * Mock pull request merge response
   *
   * @param prNumber - PR number
   * @param result - Merge result
   */
  static mockMergePullRequest(prNumber: number, result: any): void {
    this.mergePRResponse[prNumber] = result;
  }

  /**
   * Get mocked PR merge response
   *
   * @param prNumber - PR number
   * @returns Mocked merge result
   */
  static getMergePRResponse(prNumber: number): any {
    return this.mergePRResponse[prNumber];
  }

  /**
   * Mock a pull request
   *
   * @param prNumber - PR number
   * @param data - PR data
   */
  static mockGetPullRequest(prNumber: number, data: Partial<MockPullRequest>): void {
    this.pullRequests.set(prNumber, {
      number: prNumber,
      title: `Test PR #${prNumber}`,
      body: 'Test PR body',
      head: 'feature/test',
      base: 'main',
      state: 'open',
      ...data,
    });
  }

  /**
   * Get mocked PR
   *
   * @param prNumber - PR number
   * @returns Mocked PR or null
   */
  static getPullRequest(prNumber: number): MockPullRequest | null {
    return this.pullRequests.get(prNumber) || null;
  }

  /**
   * Clear all mocks
   */
  static reset(): void {
    this.issues.clear();
    this.pullRequests.clear();
    this.createPRResponse = null;
    this.mergePRResponse = {};
  }

  /**
   * Get all mocked issues
   *
   * @returns Array of all mocked issues
   */
  static getAllIssues(): MockIssue[] {
    return Array.from(this.issues.values());
  }

  /**
   * Get all mocked PRs
   *
   * @returns Array of all mocked PRs
   */
  static getAllPullRequests(): MockPullRequest[] {
    return Array.from(this.pullRequests.values());
  }
}
