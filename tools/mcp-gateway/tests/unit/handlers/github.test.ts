/**
 * Unit Tests for GitHub MCP Handler
 */

import { GitHubHandler } from '../../../src/mcp/handlers/github';
import { MCPParams } from '../../../src/mcp/protocol/types';
import { ValidationError, ServiceUnavailableError } from '../../../src/utils/errors';
import { mockGitHubReposResponse, resetHttpMocks } from '../../mocks/http-client';

// Mock Octokit
const mockOctokit = {
  rest: {
    repos: {
      listForAuthenticatedUser: jest.fn(),
      get: jest.fn(),
      listBranches: jest.fn(),
      createOrUpdateFileContents: jest.fn(),
    },
    pulls: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      merge: jest.fn(),
      createReview: jest.fn(),
    },
    issues: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      createComment: jest.fn(),
      listComments: jest.fn(),
    },
    actions: {
      listRepoWorkflows: jest.fn(),
      createWorkflowDispatch: jest.fn(),
    },
    git: {
      createRef: jest.fn(),
    },
  },
};

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(() => mockOctokit),
}));

jest.mock('@octokit/auth-app', () => ({
  createAppAuth: jest.fn(() => jest.fn()),
}));

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock metrics
jest.mock('../../../src/monitoring/metrics', () => ({
  recordMCPOperation: jest.fn(),
  recordTokenUsage: jest.fn(),
}));

// Mock environment
jest.mock('../../../config/environment', () => ({
  config: {
    GITHUB_APP_ID: '123456',
    GITHUB_INSTALLATION_ID: '78910',
    GITHUB_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\ntest\n-----END RSA PRIVATE KEY-----',
  },
}));

describe('GitHubHandler', () => {
  let handler: GitHubHandler;

  beforeEach(() => {
    resetHttpMocks();
    handler = new GitHubHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Repository Operations', () => {
    describe('list-repos/list-repositories', () => {
      it('should list repositories', async () => {
        mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({
          data: [
            { id: 1, name: 'repo1', full_name: 'user/repo1' },
            { id: 2, name: 'repo2', full_name: 'user/repo2' },
          ],
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'list-repos',
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data).toHaveLength(2);
      });

      it('should accept pagination options', async () => {
        mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({ data: [] });

        const params: MCPParams = {
          service: 'github',
          operation: 'list-repositories',
          options: {
            type: 'all',
            per_page: 50,
            page: 2,
          },
        };

        await handler.execute(params);

        expect(mockOctokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'all',
            per_page: 50,
            page: 2,
          })
        );
      });
    });

    describe('get-repo/get-repository', () => {
      it('should get repository details', async () => {
        mockOctokit.rest.repos.get.mockResolvedValue({
          data: {
            id: 1,
            name: 'test-repo',
            full_name: 'owner/test-repo',
            private: false,
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'get-repo',
          args: ['owner/test-repo'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.name).toBe('test-repo');
      });

      it('should throw ValidationError when repo is missing', async () => {
        const params: MCPParams = {
          service: 'github',
          operation: 'get-repository',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });
  });

  describe('Pull Request Operations', () => {
    describe('list-prs/list-pull-requests', () => {
      it('should list pull requests', async () => {
        mockOctokit.rest.pulls.list.mockResolvedValue({
          data: [
            { number: 1, title: 'PR 1', state: 'open' },
            { number: 2, title: 'PR 2', state: 'open' },
          ],
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'list-prs',
          args: ['owner/repo'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data).toHaveLength(2);
      });

      it('should throw ValidationError when repo is missing', async () => {
        const params: MCPParams = {
          service: 'github',
          operation: 'list-pull-requests',
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('create-pr/create-pull-request', () => {
      it('should create a pull request', async () => {
        mockOctokit.rest.pulls.create.mockResolvedValue({
          data: {
            number: 123,
            title: 'New PR',
            html_url: 'https://github.com/owner/repo/pull/123',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'create-pr',
          args: ['owner/repo'],
          options: {
            title: 'New PR',
            body: 'Description',
            head: 'feature-branch',
            base: 'main',
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.number).toBe(123);
      });

      it('should throw ValidationError when required fields are missing', async () => {
        const params: MCPParams = {
          service: 'github',
          operation: 'create-pull-request',
          args: ['owner/repo'],
          options: {
            title: 'New PR',
            // Missing head and base
          },
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('merge-pr/merge-pull-request', () => {
      it('should merge a pull request', async () => {
        mockOctokit.rest.pulls.merge.mockResolvedValue({
          data: {
            merged: true,
            message: 'Pull Request successfully merged',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'merge-pr',
          args: ['owner/repo', 123],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.merged).toBe(true);
      });

      it('should accept merge method option', async () => {
        mockOctokit.rest.pulls.merge.mockResolvedValue({ data: { merged: true } });

        const params: MCPParams = {
          service: 'github',
          operation: 'merge-pull-request',
          args: ['owner/repo', 123],
          options: {
            merge_method: 'squash',
          },
        };

        await handler.execute(params);

        expect(mockOctokit.rest.pulls.merge).toHaveBeenCalledWith(
          expect.objectContaining({
            merge_method: 'squash',
          })
        );
      });
    });

    describe('approve-pr/approve-pull-request', () => {
      it('should approve a pull request', async () => {
        mockOctokit.rest.pulls.createReview.mockResolvedValue({
          data: {
            id: 456,
            state: 'APPROVED',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'approve-pr',
          args: ['owner/repo', 123],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockOctokit.rest.pulls.createReview).toHaveBeenCalledWith(
          expect.objectContaining({
            event: 'APPROVE',
          })
        );
      });
    });
  });

  describe('Issue Operations', () => {
    describe('list-issues', () => {
      it('should list issues', async () => {
        mockOctokit.rest.issues.list.mockResolvedValue({
          data: [
            { number: 1, title: 'Issue 1', state: 'open' },
            { number: 2, title: 'Issue 2', state: 'closed' },
          ],
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'list-issues',
          args: ['owner/repo'],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data).toHaveLength(2);
      });

      it('should accept filter options', async () => {
        mockOctokit.rest.issues.list.mockResolvedValue({ data: [] });

        const params: MCPParams = {
          service: 'github',
          operation: 'list-issues',
          args: ['owner/repo'],
          options: {
            state: 'open',
            labels: 'bug,priority-high',
          },
        };

        await handler.execute(params);

        expect(mockOctokit.rest.issues.list).toHaveBeenCalledWith(
          expect.objectContaining({
            state: 'open',
            labels: 'bug,priority-high',
          })
        );
      });
    });

    describe('create-issue', () => {
      it('should create an issue', async () => {
        mockOctokit.rest.issues.create.mockResolvedValue({
          data: {
            number: 789,
            title: 'New Issue',
            html_url: 'https://github.com/owner/repo/issues/789',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'create-issue',
          args: ['owner/repo'],
          options: {
            title: 'New Issue',
            body: 'Issue description',
            labels: ['bug'],
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(result.data.number).toBe(789);
      });

      it('should throw ValidationError when title is missing', async () => {
        const params: MCPParams = {
          service: 'github',
          operation: 'create-issue',
          args: ['owner/repo'],
          options: {
            body: 'Description without title',
          },
        };

        await expect(handler.execute(params)).rejects.toThrow(ValidationError);
      });
    });

    describe('update-issue', () => {
      it('should update an issue', async () => {
        mockOctokit.rest.issues.update.mockResolvedValue({
          data: {
            number: 789,
            title: 'Updated Issue',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'update-issue',
          args: ['owner/repo', 789],
          options: {
            title: 'Updated Issue',
            state: 'closed',
          },
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
      });
    });

    describe('close-issue', () => {
      it('should close an issue', async () => {
        mockOctokit.rest.issues.update.mockResolvedValue({
          data: {
            number: 789,
            state: 'closed',
          },
        });

        const params: MCPParams = {
          service: 'github',
          operation: 'close-issue',
          args: ['owner/repo', 789],
        };

        const result = await handler.execute(params);

        expect(result.status).toBe('success');
        expect(mockOctokit.rest.issues.update).toHaveBeenCalledWith(
          expect.objectContaining({
            state: 'closed',
          })
        );
      });
    });
  });

  describe('Comment Operations', () => {
    it('should create a comment', async () => {
      mockOctokit.rest.issues.createComment.mockResolvedValue({
        data: {
          id: 123,
          body: 'Test comment',
        },
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'create-comment',
        args: ['owner/repo', 789],
        options: {
          body: 'Test comment',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
    });

    it('should list comments', async () => {
      mockOctokit.rest.issues.listComments.mockResolvedValue({
        data: [
          { id: 1, body: 'Comment 1' },
          { id: 2, body: 'Comment 2' },
        ],
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'list-comments',
        args: ['owner/repo', 789],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(2);
    });
  });

  describe('Branch Operations', () => {
    it('should list branches', async () => {
      mockOctokit.rest.repos.listBranches.mockResolvedValue({
        data: [
          { name: 'main', protected: true },
          { name: 'develop', protected: false },
        ],
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'list-branches',
        args: ['owner/repo'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(2);
    });

    it('should create a branch', async () => {
      mockOctokit.rest.git.createRef.mockResolvedValue({
        data: {
          ref: 'refs/heads/new-branch',
        },
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'create-branch',
        args: ['owner/repo'],
        options: {
          branch: 'new-branch',
          from_branch: 'main',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
    });
  });

  describe('Workflow Operations', () => {
    it('should list workflows', async () => {
      mockOctokit.rest.actions.listRepoWorkflows.mockResolvedValue({
        data: {
          workflows: [
            { id: 1, name: 'CI', state: 'active' },
            { id: 2, name: 'Deploy', state: 'active' },
          ],
        },
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'list-workflows',
        args: ['owner/repo'],
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
      expect(result.data.workflows).toHaveLength(2);
    });

    it('should trigger a workflow', async () => {
      mockOctokit.rest.actions.createWorkflowDispatch.mockResolvedValue({
        status: 204,
        data: null,
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'trigger-workflow',
        args: ['owner/repo'],
        options: {
          workflow_id: 'deploy.yml',
          ref: 'main',
        },
      };

      const result = await handler.execute(params);

      expect(result.status).toBe('success');
    });
  });

  describe('Error Handling', () => {
    it('should handle GitHub API errors', async () => {
      mockOctokit.rest.repos.get.mockRejectedValue({
        status: 404,
        message: 'Not Found',
      });

      const params: MCPParams = {
        service: 'github',
        operation: 'get-repo',
        args: ['owner/nonexistent'],
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should throw ValidationError for unknown operations', async () => {
      const params: MCPParams = {
        service: 'github',
        operation: 'invalid-operation',
      };

      await expect(handler.execute(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('Metrics and Metadata', () => {
    it('should include execution time in metadata', async () => {
      mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({ data: [] });

      const params: MCPParams = {
        service: 'github',
        operation: 'list-repos',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('executionTime');
      expect(typeof result.metadata.executionTime).toBe('number');
    });

    it('should include token usage and cost in metadata', async () => {
      mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({ data: [] });

      const params: MCPParams = {
        service: 'github',
        operation: 'list-repos',
      };

      const result = await handler.execute(params);

      expect(result.metadata).toHaveProperty('tokensUsed', 350);
      expect(result.metadata).toHaveProperty('cost', 0.00105);
      expect(result.metadata).toHaveProperty('service', 'github');
    });
  });
});
