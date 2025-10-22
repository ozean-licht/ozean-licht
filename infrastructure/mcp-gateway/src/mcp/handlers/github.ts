import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
  labels: Array<{ name: string }>;
}

export class GitHubHandler implements MCPHandler {
  private octokit: Octokit;
  private readonly authMethod: 'pat' | 'app';

  constructor() {
    // Prefer PAT authentication if available, otherwise use GitHub App
    if (config.GITHUB_PAT) {
      this.octokit = new Octokit({
        auth: config.GITHUB_PAT,
      });
      this.authMethod = 'pat';
      logger.info('GitHub handler initialized with PAT authentication');
    } else if (config.GITHUB_APP_ID && config.GITHUB_PRIVATE_KEY && config.GITHUB_INSTALLATION_ID) {
      this.octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: config.GITHUB_APP_ID,
          privateKey: config.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
          installationId: config.GITHUB_INSTALLATION_ID,
        },
      });
      this.authMethod = 'app';
      logger.info('GitHub handler initialized with App authentication');
    } else {
      throw new Error('GitHub authentication not configured. Provide either GITHUB_PAT or GitHub App credentials');
    }
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (params.operation) {
        // Repository operations
        case 'list-repos':
        case 'list-repositories':
          result = await this.listRepositories(params.options);
          break;

        case 'get-repo':
        case 'get-repository':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner and repo name required for get-repository operation');
          }
          result = await this.getRepository(params.args[0], params.args[1]);
          break;

        // Pull Request operations
        case 'list-prs':
        case 'list-pull-requests':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner and repo name required for list-pull-requests operation');
          }
          result = await this.listPullRequests(params.args[0], params.args[1], params.options);
          break;

        case 'get-pr':
        case 'get-pull-request':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and PR number required for get-pull-request operation');
          }
          result = await this.getPullRequest(params.args[0], params.args[1], parseInt(params.args[2]));
          break;

        case 'create-pr':
        case 'create-pull-request':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner, repo, and PR data required for create-pull-request operation');
          }
          result = await this.createPullRequest(params.args[0], params.args[1], params.args[2]);
          break;

        case 'merge-pr':
        case 'merge-pull-request':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and PR number required for merge-pull-request operation');
          }
          result = await this.mergePullRequest(params.args[0], params.args[1], parseInt(params.args[2]), params.options);
          break;

        case 'approve-pr':
        case 'approve-pull-request':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and PR number required for approve-pull-request operation');
          }
          result = await this.approvePullRequest(params.args[0], params.args[1], parseInt(params.args[2]), params.options);
          break;

        // Issue operations
        case 'list-issues':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner and repo name required for list-issues operation');
          }
          result = await this.listIssues(params.args[0], params.args[1], params.options);
          break;

        case 'get-issue':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and issue number required for get-issue operation');
          }
          result = await this.getIssue(params.args[0], params.args[1], parseInt(params.args[2]));
          break;

        case 'create-issue':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner, repo, and issue data required for create-issue operation');
          }
          result = await this.createIssue(params.args[0], params.args[1], params.args[2]);
          break;

        case 'update-issue':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, issue number, and update data required for update-issue operation');
          }
          result = await this.updateIssue(params.args[0], params.args[1], parseInt(params.args[2]), params.args[3]);
          break;

        case 'close-issue':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and issue number required for close-issue operation');
          }
          result = await this.closeIssue(params.args[0], params.args[1], parseInt(params.args[2]));
          break;

        // Comment operations
        case 'create-comment':
          if (!params.args || params.args.length < 4) {
            throw new ValidationError('Owner, repo, issue number, and comment body required');
          }
          result = await this.createComment(params.args[0], params.args[1], parseInt(params.args[2]), params.args[3]);
          break;

        case 'list-comments':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and issue number required for list-comments');
          }
          result = await this.listComments(params.args[0], params.args[1], parseInt(params.args[2]));
          break;

        // Branch operations
        case 'list-branches':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner and repo name required for list-branches operation');
          }
          result = await this.listBranches(params.args[0], params.args[1], params.options);
          break;

        case 'create-branch':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and branch data required for create-branch operation');
          }
          result = await this.createBranch(params.args[0], params.args[1], params.args[2]);
          break;

        // Workflow operations
        case 'list-workflows':
          if (!params.args || params.args.length < 2) {
            throw new ValidationError('Owner and repo name required for list-workflows operation');
          }
          result = await this.listWorkflows(params.args[0], params.args[1]);
          break;

        case 'trigger-workflow':
        case 'dispatch-workflow':
          if (!params.args || params.args.length < 3) {
            throw new ValidationError('Owner, repo, and workflow ID required for trigger-workflow operation');
          }
          result = await this.triggerWorkflow(params.args[0], params.args[1], params.args[2], params.options);
          break;

        case 'health':
        case 'test':
          result = await this.checkHealth();
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('github', params.operation, duration, 'success');
      recordTokenUsage('github', params.operation, 350);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 350,
          cost: 0.00105,
          service: 'github',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('github', params.operation, duration, 'error');

      logger.error('GitHub operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Octokit errors
      if (error instanceof Error && 'status' in error) {
        const statusError = error as any;
        if (statusError.status === 404) {
          throw new ValidationError('Resource not found');
        }
        if (statusError.status === 401 || statusError.status === 403) {
          throw new ValidationError('Authentication failed - check GitHub App credentials');
        }
        if (statusError.status && statusError.status >= 500) {
          throw new ServiceUnavailableError('github', error.message);
        }
        throw new ValidationError(error.message);
      }

      throw error;
    }
  }

  // Repository Operations
  private async listRepositories(options?: any): Promise<any> {
    let response;

    if (this.authMethod === 'pat') {
      // For PAT, list repos for authenticated user
      response = await this.octokit.repos.listForAuthenticatedUser({
        per_page: options?.limit || 30,
        page: options?.page || 1,
        sort: options?.sort || 'updated',
      });

      return {
        operation: 'list_repositories',
        count: response.data.length,
        repositories: response.data.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          html_url: repo.html_url,
          description: repo.description,
          default_branch: repo.default_branch,
        })),
      };
    } else {
      // For App, list repos accessible to installation
      response = await this.octokit.apps.listReposAccessibleToInstallation({
        per_page: options?.limit || 30,
        page: options?.page || 1,
      });

      return {
        operation: 'list_repositories',
        count: response.data.repositories.length,
        repositories: response.data.repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          html_url: repo.html_url,
          description: repo.description,
          default_branch: repo.default_branch,
        })),
      };
    }
  }

  private async getRepository(owner: string, repo: string): Promise<any> {
    const response = await this.octokit.repos.get({
      owner,
      repo,
    });

    const repository = response.data;

    return {
      operation: 'get_repository',
      repository: {
        id: repository.id,
        name: repository.name,
        full_name: repository.full_name,
        private: repository.private,
        html_url: repository.html_url,
        description: repository.description,
        default_branch: repository.default_branch,
        created_at: repository.created_at,
        updated_at: repository.updated_at,
        language: repository.language,
        size: repository.size,
        stargazers_count: repository.stargazers_count,
        watchers_count: repository.watchers_count,
        forks_count: repository.forks_count,
        open_issues_count: repository.open_issues_count,
      },
    };
  }

  // Pull Request Operations
  private async listPullRequests(owner: string, repo: string, options?: any): Promise<any> {
    const response = await this.octokit.pulls.list({
      owner,
      repo,
      state: options?.state || 'open',
      per_page: options?.limit || 30,
      page: options?.page || 1,
    });

    return {
      operation: 'list_pull_requests',
      owner,
      repo,
      count: response.data.length,
      pull_requests: response.data.map((pr: any) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        html_url: pr.html_url,
        created_at: pr.created_at,
        user: pr.user?.login || 'unknown',
        head_ref: pr.head.ref,
        base_ref: pr.base.ref,
      })),
    };
  }

  private async getPullRequest(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    const pr = response.data;

    return {
      operation: 'get_pull_request',
      pull_request: {
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        html_url: pr.html_url,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        merged_at: pr.merged_at,
        user: pr.user?.login,
        head: {
          ref: pr.head.ref,
          sha: pr.head.sha,
        },
        base: {
          ref: pr.base.ref,
          sha: pr.base.sha,
        },
        mergeable: pr.mergeable,
        mergeable_state: pr.mergeable_state,
        comments: pr.comments,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changed_files: pr.changed_files,
      },
    };
  }

  private async createPullRequest(owner: string, repo: string, prData: any): Promise<any> {
    const response = await this.octokit.pulls.create({
      owner,
      repo,
      title: prData.title,
      body: prData.body || '',
      head: prData.head,
      base: prData.base || 'main',
      draft: prData.draft || false,
    });

    const pr = response.data;

    return {
      operation: 'pull_request_created',
      pull_request: {
        number: pr.number,
        title: pr.title,
        html_url: pr.html_url,
        state: pr.state,
        created_at: pr.created_at,
      },
      message: 'Pull request created successfully',
    };
  }

  private async mergePullRequest(owner: string, repo: string, pullNumber: number, options?: any): Promise<any> {
    const response = await this.octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
      commit_title: options?.commit_title,
      commit_message: options?.commit_message,
      merge_method: options?.merge_method || 'squash',
    });

    return {
      operation: 'pull_request_merged',
      pull_number: pullNumber,
      merged: response.data.merged,
      sha: response.data.sha,
      message: response.data.message,
    };
  }

  private async approvePullRequest(owner: string, repo: string, pullNumber: number, options?: any): Promise<any> {
    const response = await this.octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      event: 'APPROVE',
      body: options?.body || 'Approved by MCP Gateway',
    });

    return {
      operation: 'pull_request_approved',
      pull_number: pullNumber,
      review_id: response.data.id,
      state: response.data.state,
      message: 'Pull request approved successfully',
    };
  }

  // Issue Operations
  private async listIssues(owner: string, repo: string, options?: any): Promise<any> {
    const response = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: options?.state || 'open',
      labels: options?.labels,
      per_page: options?.limit || 30,
      page: options?.page || 1,
    });

    return {
      operation: 'list_issues',
      owner,
      repo,
      count: response.data.length,
      issues: response.data.map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        html_url: issue.html_url,
        created_at: issue.created_at,
        user: issue.user?.login || 'unknown',
        labels: issue.labels?.map((l: any) => l.name) || [],
      })),
    };
  }

  private async getIssue(owner: string, repo: string, issueNumber: number): Promise<any> {
    const response = await this.octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const issue = response.data;

    return {
      operation: 'get_issue',
      issue: {
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        html_url: issue.html_url,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        user: issue.user?.login,
        labels: issue.labels.map((l: any) => l.name),
        comments: issue.comments,
      },
    };
  }

  private async createIssue(owner: string, repo: string, issueData: any): Promise<any> {
    const response = await this.octokit.issues.create({
      owner,
      repo,
      title: issueData.title,
      body: issueData.body || '',
      labels: issueData.labels || [],
      assignees: issueData.assignees || [],
    });

    const issue = response.data;

    return {
      operation: 'issue_created',
      issue: {
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        state: issue.state,
        created_at: issue.created_at,
      },
      message: 'Issue created successfully',
    };
  }

  private async updateIssue(owner: string, repo: string, issueNumber: number, updateData: any): Promise<any> {
    const response = await this.octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      title: updateData.title,
      body: updateData.body,
      state: updateData.state,
      labels: updateData.labels,
    });

    const issue = response.data;

    return {
      operation: 'issue_updated',
      issue: {
        number: issue.number,
        title: issue.title,
        state: issue.state,
        updated_at: issue.updated_at,
      },
      message: 'Issue updated successfully',
    };
  }

  private async closeIssue(owner: string, repo: string, issueNumber: number): Promise<any> {
    const response = await this.octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    });

    return {
      operation: 'issue_closed',
      issue_number: issueNumber,
      state: response.data.state,
      message: 'Issue closed successfully',
    };
  }

  // Comment Operations
  private async createComment(owner: string, repo: string, issueNumber: number, body: string): Promise<any> {
    const response = await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });

    return {
      operation: 'comment_created',
      comment: {
        id: response.data.id,
        body: response.data.body,
        created_at: response.data.created_at,
        html_url: response.data.html_url,
      },
      message: 'Comment created successfully',
    };
  }

  private async listComments(owner: string, repo: string, issueNumber: number): Promise<any> {
    const response = await this.octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
    });

    return {
      operation: 'list_comments',
      issue_number: issueNumber,
      count: response.data.length,
      comments: response.data.map(comment => ({
        id: comment.id,
        body: comment.body,
        user: comment.user?.login,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
      })),
    };
  }

  // Branch Operations
  private async listBranches(owner: string, repo: string, options?: any): Promise<any> {
    const response = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: options?.limit || 30,
      page: options?.page || 1,
    });

    return {
      operation: 'list_branches',
      owner,
      repo,
      count: response.data.length,
      branches: response.data.map(branch => ({
        name: branch.name,
        protected: branch.protected,
        commit_sha: branch.commit.sha,
      })),
    };
  }

  private async createBranch(owner: string, repo: string, branchData: any): Promise<any> {
    const response = await this.octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchData.name}`,
      sha: branchData.sha,
    });

    return {
      operation: 'branch_created',
      branch: {
        name: branchData.name,
        ref: response.data.ref,
        sha: response.data.object.sha,
      },
      message: 'Branch created successfully',
    };
  }

  // Workflow Operations
  private async listWorkflows(owner: string, repo: string): Promise<any> {
    const response = await this.octokit.actions.listRepoWorkflows({
      owner,
      repo,
    });

    return {
      operation: 'list_workflows',
      owner,
      repo,
      count: response.data.total_count,
      workflows: response.data.workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        path: workflow.path,
        state: workflow.state,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
      })),
    };
  }

  private async triggerWorkflow(owner: string, repo: string, workflowId: string, options?: any): Promise<any> {
    await this.octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref: options?.ref || 'main',
      inputs: options?.inputs || {},
    });

    return {
      operation: 'workflow_triggered',
      workflow_id: workflowId,
      ref: options?.ref || 'main',
      message: 'Workflow dispatched successfully',
    };
  }

  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();

      if (this.authMethod === 'pat') {
        // For PAT, just check if we can get the authenticated user
        const response = await this.octokit.users.getAuthenticated();
        const latency = Date.now() - startTime;

        return {
          status: 'healthy',
          service: 'github',
          auth_method: 'pat',
          latency: `${latency}ms`,
          user: response.data?.login || 'unknown',
          timestamp: new Date().toISOString(),
        };
      } else {
        // For App auth, check the app details
        const response = await this.octokit.apps.getAuthenticated();
        const latency = Date.now() - startTime;

        return {
          status: 'healthy',
          service: 'github',
          auth_method: 'app',
          latency: `${latency}ms`,
          app_name: response.data?.name || 'unknown',
          app_id: response.data?.id || 0,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'github',
        auth_method: this.authMethod,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  public validateParams(params: MCPParams): void {
    if (!params.operation) {
      throw new ValidationError('Operation parameter is required');
    }

    const validOperations = this.getCapabilities().map(c => c.name);
    if (!validOperations.includes(params.operation)) {
      throw new ValidationError(
        `Invalid operation. Allowed: ${validOperations.join(', ')}`
      );
    }
  }

  public getCapabilities(): MCPCapability[] {
    return [
      // Repository capabilities
      {
        name: 'list-repos',
        description: 'List all accessible repositories',
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'get-repo',
        description: 'Get details of a specific repository',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // Pull Request capabilities
      {
        name: 'list-prs',
        description: 'List pull requests for a repository',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'state', type: 'string', description: 'PR state (open, closed, all)', required: false, default: 'open' },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'get-pr',
        description: 'Get details of a specific pull request',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'pullNumber', type: 'number', description: 'Pull request number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'create-pr',
        description: 'Create a new pull request',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'prData', type: 'object', description: 'PR data (title, body, head, base)', required: true },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      {
        name: 'merge-pr',
        description: 'Merge a pull request',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'pullNumber', type: 'number', description: 'Pull request number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'approve-pr',
        description: 'Approve a pull request',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'pullNumber', type: 'number', description: 'Pull request number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      // Issue capabilities
      {
        name: 'list-issues',
        description: 'List issues for a repository',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'state', type: 'string', description: 'Issue state (open, closed, all)', required: false, default: 'open' },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'get-issue',
        description: 'Get details of a specific issue',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueNumber', type: 'number', description: 'Issue number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'create-issue',
        description: 'Create a new issue',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueData', type: 'object', description: 'Issue data (title, body, labels)', required: true },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      {
        name: 'update-issue',
        description: 'Update an existing issue',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueNumber', type: 'number', description: 'Issue number', required: true },
          { name: 'updateData', type: 'object', description: 'Update data', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'close-issue',
        description: 'Close an issue',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueNumber', type: 'number', description: 'Issue number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      // Comment capabilities
      {
        name: 'create-comment',
        description: 'Create a comment on an issue or PR',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueNumber', type: 'number', description: 'Issue/PR number', required: true },
          { name: 'body', type: 'string', description: 'Comment body', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'list-comments',
        description: 'List comments on an issue or PR',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'issueNumber', type: 'number', description: 'Issue/PR number', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      // Branch capabilities
      {
        name: 'list-branches',
        description: 'List branches in a repository',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'create-branch',
        description: 'Create a new branch',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'branchData', type: 'object', description: 'Branch data (name, sha)', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      // Workflow capabilities
      {
        name: 'list-workflows',
        description: 'List GitHub Actions workflows',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'trigger-workflow',
        description: 'Trigger a workflow dispatch event',
        parameters: [
          { name: 'owner', type: 'string', description: 'Repository owner', required: true },
          { name: 'repo', type: 'string', description: 'Repository name', required: true },
          { name: 'workflowId', type: 'string', description: 'Workflow ID or filename', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'health',
        description: 'Check GitHub service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down GitHub handler...');
    // No persistent connections to close
  }
}
