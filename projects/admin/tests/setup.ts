// Test setup file
// Add any global test configuration here

// Set test timeout
jest.setTimeout(30000);

// Mock console.error to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
};
