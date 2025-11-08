/**
 * Test Fixtures for MCP Requests
 */

export const validJSONRPCRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'postgres',
    operation: 'list-tables',
    database: 'kids-ascension',
  },
  id: 'test-request-1',
};

export const postgresListTablesRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'postgres',
    operation: 'list-tables',
    database: 'kids-ascension',
  },
  id: 'postgres-list-1',
};

export const postgresQueryRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'postgres',
    operation: 'query',
    database: 'kids-ascension',
    args: ['SELECT * FROM users LIMIT 10'],
  },
  id: 'postgres-query-1',
};

export const mem0RememberRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'mem0',
    operation: 'remember',
    args: ['Test memory content'],
    options: {
      user_id: 'test-user',
    },
  },
  id: 'mem0-remember-1',
};

export const cloudflareListZonesRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'cloudflare',
    operation: 'list-zones',
  },
  id: 'cloudflare-zones-1',
};

export const githubListReposRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'github',
    operation: 'list-repos',
    options: {
      type: 'all',
      per_page: 10,
    },
  },
  id: 'github-repos-1',
};

export const n8nListWorkflowsRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'n8n',
    operation: 'list-workflows',
  },
  id: 'n8n-workflows-1',
};

export const invalidJSONRPCRequest = {
  jsonrpc: '1.0', // Invalid version
  method: 'mcp.execute',
  params: {},
  id: 'invalid-1',
};

export const missingServiceRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    operation: 'list-tables',
  },
  id: 'missing-service-1',
};

export const unknownServiceRequest = {
  jsonrpc: '2.0' as const,
  method: 'mcp.execute',
  params: {
    service: 'unknown-service',
    operation: 'test',
  },
  id: 'unknown-service-1',
};
