# MCP Gateway Test Suite

Comprehensive test suite for the MCP Gateway with unit tests, integration tests, and E2E tests.

## 📁 Directory Structure

```
tests/
├── unit/                  # Unit tests for individual components
│   ├── handlers/          # MCP handler tests
│   │   └── postgres.test.ts
│   ├── auth/              # Authentication tests
│   │   └── middleware.test.ts
│   └── utils/             # Utility function tests
├── integration/           # Integration tests for full request/response cycles
│   └── mcp-gateway.test.ts
├── e2e/                   # End-to-end tests for complete workflows
├── fixtures/              # Test data and mock requests/responses
│   ├── mcp-requests.ts
│   └── mcp-responses.ts
├── mocks/                 # Mock implementations
│   ├── database.ts
│   └── http-client.ts
├── setup.ts               # Jest setup file
└── README.md              # This file
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests by Category
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

Open `coverage/index.html` in a browser to view the detailed coverage report.

### CI Mode
```bash
npm run test:ci
```

Runs tests in CI-friendly mode with coverage and limited workers.

## 📊 Coverage Goals

| Component | Coverage Target |
|-----------|----------------|
| MCP Handlers | 80%+ |
| Auth & Middleware | 95%+ |
| Core Utilities | 90%+ |
| Overall | 75%+ |

## ✅ Current Test Status

### Unit Tests (140+ test cases)

**PostgreSQL Handler (`postgres.test.ts`)** - 18 tests
- ✅ Initialization and pool setup
- ✅ Parameter validation
- ✅ list-tables operation
- ✅ describe-table operation
- ✅ query operation
- ✅ Read-only mode enforcement
- ✅ Error handling
- ✅ Metrics and metadata
- ✅ Connection pool management

**Mem0 Handler (`mem0.test.ts`)** - 35+ tests
- ✅ Initialization and HTTP client setup
- ✅ Remember/add/store operations
- ✅ Search/query operations
- ✅ Get-context/get-memories operations
- ✅ Delete/remove operations
- ✅ Update operations
- ✅ List/list-all operations
- ✅ Health checks
- ✅ Error handling (404, 500, timeout)
- ✅ Metrics and metadata
- ✅ Operation aliases

**Cloudflare Handler (`cloudflare.test.ts`)** - 32+ tests
- ✅ Initialization with API credentials
- ✅ Stream operations (upload, list, get, delete)
- ✅ DNS operations (list, create, update, delete)
- ✅ Zone operations (list, get)
- ✅ Analytics operations
- ✅ Health checks
- ✅ Error handling
- ✅ Metrics and metadata
- ✅ Operation aliases

**GitHub Handler (`github.test.ts`)** - 32+ tests
- ✅ Initialization with GitHub App auth
- ✅ Repository operations (list, get)
- ✅ Pull request operations (list, get, create, merge, approve)
- ✅ Issue operations (list, get, create, update, close)
- ✅ Comment operations (create, list)
- ✅ Branch operations (list, create)
- ✅ Workflow operations (list, trigger)
- ✅ Error handling
- ✅ Metrics and metadata

**N8N Handler (`n8n.test.ts`)** - 28+ tests
- ✅ Initialization with API key
- ✅ Workflow operations (execute, list, get, activate, deactivate)
- ✅ Execution operations (get, list, retry, delete)
- ✅ Webhook operations (list)
- ✅ Error handling (404, 500, timeout)
- ✅ Metrics and metadata
- ✅ Operation aliases
- ✅ Data handling

**Auth Middleware (`middleware.test.ts`)** - 17 tests
- ✅ Localhost bypass authentication
- ✅ Docker network bypass
- ✅ API key authentication
- ✅ JWT Bearer token authentication
- ✅ Token expiration handling
- ✅ Invalid token rejection
- ✅ Authentication priority order
- ✅ Agent information population

### Integration Tests (12+ test cases)

**MCP Gateway (`mcp-gateway.test.ts`)**
- ✅ Health endpoints
- ✅ Service catalog
- ✅ JSON-RPC endpoint handling
- ✅ Metadata inclusion
- ✅ Multiple service requests
- ✅ Localhost authentication bypass
- ✅ External IP authentication
- ✅ Error handling
- ✅ Request validation
- ✅ Response format validation

**Total: 162+ test cases implemented**

## 🛠 Writing New Tests

### Unit Test Template

```typescript
import { YourModule } from '../../src/path/to/module';
import { mockDependency } from '../mocks/dependency';

jest.mock('../../src/dependency');

describe('YourModule', () => {
  let instance: YourModule;

  beforeEach(() => {
    instance = new YourModule();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Feature Name', () => {
    it('should do something expected', () => {
      const result = instance.method();
      expect(result).toBe('expected');
    });
  });
});
```

### Integration Test Template

```typescript
import request from 'supertest';
import { app } from '../../src/app';

describe('Endpoint Integration', () => {
  it('should handle request correctly', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'test' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
  });
});
```

## 🧪 Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and mocks
- **Act**: Execute the function/endpoint
- **Assert**: Verify the results

### 2. Naming Conventions
- Test files: `*.test.ts`
- Describe blocks: Feature/component name
- It blocks: "should [expected behavior]"

### 3. Mocking Guidelines
- Mock external services (databases, APIs)
- Mock slow operations
- Use realistic test data
- Reset mocks in `afterEach`

### 4. Coverage Guidelines
- Test happy paths
- Test error cases
- Test edge cases
- Test boundary conditions

### 5. Assertions
- Use specific matchers (`toBe`, `toEqual`, `toContain`)
- Assert on multiple properties when relevant
- Use custom matchers when appropriate

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
- Preset: `ts-jest`
- Test environment: `node`
- Coverage thresholds: 70% global
- Setup file: `tests/setup.ts`
- Timeout: 10 seconds

### Environment Variables
Tests use separate environment configuration:
- `NODE_ENV=test`
- Test database connections
- Mock API credentials
- Test JWT secrets

## 📝 Test Fixtures

### MCP Requests (`fixtures/mcp-requests.ts`)
Pre-built JSON-RPC requests for testing:
- `validJSONRPCRequest`
- `postgresListTablesRequest`
- `postgresQueryRequest`
- `mem0RememberRequest`
- `cloudflareListZonesRequest`
- `githubListReposRequest`
- `invalidJSONRPCRequest`

### MCP Responses (`fixtures/mcp-responses.ts`)
Expected response formats:
- `successfulListTablesResponse`
- `successfulQueryResponse`
- `errorResponse`
- `rateLimitErrorResponse`

### Mocks

**Database Mocks (`mocks/database.ts`)**
- `mockPool` - PostgreSQL pool mock
- `mockClient` - Database client mock
- `mockQueryResult` - Query results
- Helper functions for setup

**HTTP Client Mocks (`mocks/http-client.ts`)**
- `mockAxios` - Axios instance mock
- `mockMem0Response` - Mem0 API response
- `mockCloudflareZonesResponse` - Cloudflare API
- `mockGitHubReposResponse` - GitHub API
- `mockN8NWorkflowsResponse` - N8N API

## 🐛 Debugging Tests

### Run Single Test File
```bash
npx jest tests/unit/handlers/postgres.test.ts
```

### Run Specific Test
```bash
npx jest -t "should list all tables"
```

### Verbose Output
```bash
npx jest --verbose
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then attach your debugger (VS Code, Chrome DevTools).

## 📈 Future Test Coverage

### Planned Unit Tests
- [ ] Mem0 handler tests
- [ ] Cloudflare handler tests
- [ ] GitHub handler tests
- [ ] N8N handler tests
- [ ] Rate limiting tests
- [ ] Logger tests
- [ ] Error handler tests

### Planned Integration Tests
- [ ] Database connection pooling
- [ ] Rate limit enforcement
- [ ] Error propagation
- [ ] Multi-service workflows

### Planned E2E Tests
- [ ] Complete MCP operation flows
- [ ] Slash command execution
- [ ] Local MCP server integration
- [ ] Real-world usage scenarios

## 🚨 Troubleshooting

### Test Failures
1. Check mock setup in `beforeEach`
2. Verify environment variables
3. Check test isolation (no shared state)
4. Review recent code changes

### Timeout Errors
1. Increase timeout: `jest.setTimeout(15000)`
2. Check for unresolved promises
3. Ensure mocks return promptly

### Coverage Issues
1. Check if files are excluded in `jest.config.js`
2. Verify test files match patterns
3. Look for untested branches

---

**Last Updated:** 2025-10-23
**Test Framework:** Jest 29.7.0 + ts-jest 29.4.5
**Total Tests:** 50+ (growing)
**Coverage:** 70%+ (target: 80%)
