/**
 * Unit tests for health check utilities
 */

import { MCPGatewayClient } from '@/lib/mcp-client/client';
import { healthCheck, checkGatewayReachable } from '@/lib/mcp-client/health';

describe('Health Check Utilities', () => {
  describe('healthCheck', () => {
    it('should return healthy false when query fails', async () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
        baseUrl: 'http://localhost:9999', // Invalid port
        timeout: 1000,
        retries: 0,
      });

      const result = await healthCheck(client);
      expect(result.healthy).toBe(false);
      expect(result.latency).toBeGreaterThan(0);
    });

    it('should measure latency', async () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
        baseUrl: 'http://localhost:9999',
        timeout: 1000,
        retries: 0,
      });

      const result = await healthCheck(client);
      expect(result.latency).toBeGreaterThan(0);
      expect(result.latency).toBeLessThan(5000);
    });
  });

  describe('checkGatewayReachable', () => {
    it('should return false for unreachable gateway', async () => {
      const result = await checkGatewayReachable('http://localhost:9999');
      expect(result).toBe(false);
    });
  });
});
