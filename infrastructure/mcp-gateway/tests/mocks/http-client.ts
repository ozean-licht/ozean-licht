/**
 * HTTP Client Mocks for Testing External Services
 */

import { AxiosResponse } from 'axios';

export const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
});

export const mockMem0Response = {
  data: {
    operation: 'memory_added',
    memory: {
      user_id: 'test-user',
      content: 'Test memory content',
      metadata: {
        source: 'mcp-gateway',
        timestamp: new Date().toISOString(),
      },
    },
    message: 'Memory successfully stored',
  },
};

export const mockCloudflareZonesResponse = {
  data: {
    result: [
      {
        id: 'zone-1',
        name: 'kids-ascension.dev',
        status: 'active',
        name_servers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
      },
      {
        id: 'zone-2',
        name: 'ozean-licht.dev',
        status: 'active',
        name_servers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
      },
    ],
    success: true,
  },
};

export const mockGitHubReposResponse = {
  data: [
    {
      id: 1,
      name: 'test-repo',
      full_name: 'test-org/test-repo',
      private: false,
      html_url: 'https://github.com/test-org/test-repo',
      description: 'Test repository',
      default_branch: 'main',
    },
  ],
};

export const mockN8NWorkflowsResponse = {
  data: {
    data: [
      {
        id: '1',
        name: 'Test Workflow',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
};

/**
 * Mock Axios instance
 */
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  create: jest.fn(() => mockAxios),
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

/**
 * Reset all HTTP client mocks
 */
export function resetHttpMocks() {
  mockAxios.get.mockReset();
  mockAxios.post.mockReset();
  mockAxios.put.mockReset();
  mockAxios.delete.mockReset();
  mockAxios.patch.mockReset();
}

/**
 * Mock successful HTTP response
 */
export function mockSuccessfulHttp<T>(data: T) {
  mockAxios.get.mockResolvedValue(mockAxiosResponse(data));
  mockAxios.post.mockResolvedValue(mockAxiosResponse(data));
}

/**
 * Mock failed HTTP response
 */
export function mockFailedHttp(statusCode: number, message: string) {
  const error = new Error(message) as any;
  error.response = {
    status: statusCode,
    data: { error: message },
  };
  mockAxios.get.mockRejectedValue(error);
  mockAxios.post.mockRejectedValue(error);
}

/**
 * Mock network timeout
 */
export function mockNetworkTimeout() {
  const error = new Error('Network timeout') as any;
  error.code = 'ETIMEDOUT';
  mockAxios.get.mockRejectedValue(error);
  mockAxios.post.mockRejectedValue(error);
}
