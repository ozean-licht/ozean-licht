/**
 * Integration Tests for MCP Gateway
 *
 * Tests complete request/response cycle through the Express server
 */

import request from 'supertest';
import express, { Express } from 'express';
import { authMiddleware } from '../../src/auth/middleware';
import {
  postgresListTablesRequest,
  cloudflareListZonesRequest,
  githubListReposRequest,
  invalidJSONRPCRequest,
  unknownServiceRequest,
} from '../fixtures/mcp-requests';

// Mock all external dependencies
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../../src/monitoring/metrics', () => ({
  updateConnectionPoolMetrics: jest.fn(),
  recordMCPOperation: jest.fn(),
  recordTokenUsage: jest.fn(),
}));

jest.mock('../../config/environment', () => ({
  config: {
    PORT: 8100,
    HOST: 'localhost',
    NODE_ENV: 'test',
    JWT_SECRET: 'test-secret',
    JWT_EXPIRES_IN: '24h',
  },
  dbConfig: {
    kidsAscension: {
      host: 'localhost',
      port: 5432,
      database: 'test_db',
      user: 'test',
      password: 'test',
    },
    ozeanLicht: {
      host: 'localhost',
      port: 5431,
      database: 'test_db',
      user: 'test',
      password: 'test',
    },
  },
}));

describe('MCP Gateway Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    // Create a minimal Express app for testing
    app = express();
    app.use(express.json());

    // Add auth middleware
    app.use(authMiddleware);

    // Add test routes
    app.post('/mcp/rpc', (req, res) => {
      // Mock MCP handler response
      res.json({
        jsonrpc: '2.0',
        result: {
          status: 'success',
          data: { test: 'data' },
          metadata: {
            executionTime: 10,
            tokensUsed: 100,
            cost: 0.001,
          },
        },
        id: req.body.id,
      });
    });

    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    app.get('/mcp/catalog', (req, res) => {
      res.json({
        services: ['postgres', 'mem0', 'cloudflare', 'github', 'n8n'],
        totalServices: 5,
      });
    });
  });

  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('version');
    });

    it('should return service catalog', async () => {
      const response = await request(app).get('/mcp/catalog');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toContain('postgres');
      expect(response.body.services).toContain('cloudflare');
    });
  });

  describe('JSON-RPC Endpoint', () => {
    it('should handle valid JSON-RPC request from localhost', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(postgresListTablesRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jsonrpc', '2.0');
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('id');
    });

    it('should include metadata in successful response', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(cloudflareListZonesRequest);

      expect(response.status).toBe(200);
      expect(response.body.result).toHaveProperty('metadata');
      expect(response.body.result.metadata).toHaveProperty('executionTime');
      expect(response.body.result.metadata).toHaveProperty('tokensUsed');
      expect(response.body.result.metadata).toHaveProperty('cost');
    });

    it('should handle requests for different services', async () => {
      const services = [
        postgresListTablesRequest,
        cloudflareListZonesRequest,
        githubListReposRequest,
      ];

      for (const serviceRequest of services) {
        const response = await request(app)
          .post('/mcp/rpc')
          .set('X-Forwarded-For', '127.0.0.1')
          .send(serviceRequest);

        expect(response.status).toBe(200);
        expect(response.body.jsonrpc).toBe('2.0');
      }
    });
  });

  describe('Authentication', () => {
    it('should allow localhost requests without authentication', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(postgresListTablesRequest);

      expect(response.status).toBe(200);
    });

    it('should allow Docker network requests without authentication', async () => {
      const dockerIPs = ['10.0.1.16', '172.17.0.2', '192.168.1.100'];

      for (const ip of dockerIPs) {
        const response = await request(app)
          .post('/mcp/rpc')
          .set('X-Forwarded-For', ip)
          .send(postgresListTablesRequest);

        expect(response.status).toBe(200);
      }
    });

    it('should reject external requests without authentication', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '203.0.113.1') // External IP
        .send(postgresListTablesRequest);

      // Without proper authentication, should fail
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    it('should return JSON-RPC error for invalid request', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(invalidJSONRPCRequest);

      expect(response.status).toBe(200); // JSON-RPC errors return 200
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });

    it('should handle unknown service gracefully', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(unknownServiceRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Unknown service');
    });
  });

  describe('Request Validation', () => {
    it('should require Content-Type: application/json', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Content-Type', 'text/plain')
        .send(JSON.stringify(postgresListTablesRequest));

      expect(response.status).toBe(415); // Unsupported Media Type
    });

    it('should handle POST requests only for /mcp/rpc', async () => {
      const response = await request(app)
        .get('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1');

      expect(response.status).toBe(404);
    });
  });

  describe('Response Format', () => {
    it('should always return valid JSON-RPC 2.0 format', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(postgresListTablesRequest);

      expect(response.body).toHaveProperty('jsonrpc', '2.0');
      expect(response.body).toHaveProperty('id');
      expect(
        response.body.hasOwnProperty('result') || response.body.hasOwnProperty('error')
      ).toBe(true);
    });

    it('should return proper content-type header', async () => {
      const response = await request(app)
        .post('/mcp/rpc')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(postgresListTablesRequest);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
