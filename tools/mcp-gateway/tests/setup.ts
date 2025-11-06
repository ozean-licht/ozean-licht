/**
 * Jest Setup File
 *
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters-long';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep error and warn for debugging
};

// Set default test timeout
jest.setTimeout(10000);

// Add custom matchers if needed
expect.extend({
  toBeValidJSONRPC(received) {
    const pass =
      received &&
      typeof received === 'object' &&
      received.jsonrpc === '2.0' &&
      'id' in received &&
      ('result' in received || 'error' in received);

    return {
      pass,
      message: () =>
        pass
          ? `Expected value not to be a valid JSON-RPC response`
          : `Expected value to be a valid JSON-RPC response`,
    };
  },
});

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  // This will be populated as we add cleanup hooks
});
