/**
 * Test Fixtures for MCP Responses
 */

export const successfulListTablesResponse = {
  jsonrpc: '2.0' as const,
  result: {
    status: 'success',
    data: {
      database: 'kids-ascension',
      tableCount: 3,
      tables: [
        {
          schema: 'public',
          name: 'users',
          fullName: 'public.users',
          owner: 'postgres',
        },
        {
          schema: 'public',
          name: 'videos',
          fullName: 'public.videos',
          owner: 'postgres',
        },
        {
          schema: 'public',
          name: 'test_mcp',
          fullName: 'public.test_mcp',
          owner: 'postgres',
        },
      ],
    },
    metadata: {
      executionTime: 25,
      tokensUsed: 500,
      cost: 0.0015,
      service: 'postgres',
      operation: 'list-tables',
      timestamp: new Date().toISOString(),
    },
  },
  id: 'test-request-1',
};

export const successfulQueryResponse = {
  jsonrpc: '2.0' as const,
  result: {
    status: 'success',
    data: {
      rows: [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ],
      rowCount: 2,
    },
    metadata: {
      executionTime: 15,
      tokensUsed: 350,
      cost: 0.00105,
      service: 'postgres',
      operation: 'query',
      timestamp: new Date().toISOString(),
    },
  },
  id: 'postgres-query-1',
};

export const errorResponse = {
  jsonrpc: '2.0' as const,
  error: {
    code: -32603,
    message: 'Internal error',
    data: {
      service: 'postgres',
      operation: 'list-tables',
      details: 'Database connection failed',
    },
  },
  id: 'test-request-1',
};

export const invalidParamsErrorResponse = {
  jsonrpc: '2.0' as const,
  error: {
    code: -32602,
    message: 'Invalid params',
    data: {
      details: 'Missing required parameter: service',
    },
  },
  id: 'invalid-params-1',
};

export const methodNotFoundErrorResponse = {
  jsonrpc: '2.0' as const,
  error: {
    code: -32601,
    message: 'Method not found',
    data: {
      method: 'unknown.method',
    },
  },
  id: 'method-not-found-1',
};

export const rateLimitErrorResponse = {
  jsonrpc: '2.0' as const,
  error: {
    code: 429,
    message: 'Too Many Requests',
    data: {
      retryAfter: 60,
      limit: 100,
      remaining: 0,
    },
  },
  id: 'rate-limit-1',
};

export const unauthorizedErrorResponse = {
  jsonrpc: '2.0' as const,
  error: {
    code: 401,
    message: 'Unauthorized',
    data: {
      details: 'Invalid or missing authentication token',
    },
  },
  id: 'unauthorized-1',
};
