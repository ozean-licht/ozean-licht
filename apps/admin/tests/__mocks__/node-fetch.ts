/**
 * Mock implementation of node-fetch for testing
 */

export interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<any>;
}

// Mock fetch function
const fetch = jest.fn(async (url: string, _options?: any): Promise<MockResponse> => {
  // Add minimal delay to ensure measurable latency
  await new Promise(resolve => setTimeout(resolve, 1));

  // Simulate connection errors for invalid ports (9999)
  if (url.includes(':9999')) {
    const error: any = new Error('connect ECONNREFUSED');
    error.code = 'ECONNREFUSED';
    throw error;
  }

  // Default mock response for health checks and queries
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({
      jsonrpc: '2.0',
      id: 'mock-id',
      result: {
        status: 'success',
        data: []
      }
    })
  };
});

export default fetch;
