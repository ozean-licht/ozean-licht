/**
 * Jest test setup
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests
process.env.LOG_FORMAT = 'json';
process.env.MCP_GATEWAY_URL = 'http://localhost:8100';
process.env.MCP_GATEWAY_TIMEOUT = '5000';
process.env.MEMORY_AUTO_SAVE = 'false'; // Disable auto-save in tests
process.env.VALIDATION_ENABLED = 'true';
process.env.TOOL_CATALOG_PATH = '/opt/ozean-licht-ecosystem/tools/inventory/tool-catalog.json';
process.env.GIT_REPO_PATH = '/opt/ozean-licht-ecosystem';

// Increase timeout for integration tests
jest.setTimeout(10000);
