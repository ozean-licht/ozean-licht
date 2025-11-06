/**
 * Integration tests for MCP Gateway Client
 * These tests require MCP Gateway to be running
 */

import { MCPGatewayClientWithQueries } from '../../lib/mcp-client/queries';
import { healthCheck } from '../../lib/mcp-client/health';

// Skip integration tests if MCP Gateway is not available
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:8100';
const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === 'true';

describe.skip('E2E Integration Tests', () => {
  let client: MCPGatewayClientWithQueries;

  beforeAll(async () => {
    if (!RUN_INTEGRATION_TESTS) {
      console.log('Skipping integration tests (set RUN_INTEGRATION_TESTS=true to run)');
      return;
    }

    // Initialize client
    client = new MCPGatewayClientWithQueries({
      database: 'shared-users-db',
      baseUrl: MCP_GATEWAY_URL,
    });

    // Verify gateway is healthy
    const health = await healthCheck(client);
    if (!health.healthy) {
      throw new Error('MCP Gateway is not healthy. Cannot run integration tests.');
    }
  });

  describe('Health Checks', () => {
    it('should return healthy status', async () => {
      const result = await healthCheck(client);
      expect(result.healthy).toBe(true);
      expect(result.latency).toBeGreaterThan(0);
      expect(result.latency).toBeLessThan(5000);
    });
  });

  describe('Database Operations', () => {
    it('should execute raw query', async () => {
      const result = await client.query<{ n: number }>('SELECT 1 as n');
      expect(result).toHaveLength(1);
      expect(result[0].n).toBe(1);
    });

    it('should list admin roles', async () => {
      const roles = await client.listAdminRoles();
      expect(roles.length).toBeGreaterThan(0);
      expect(roles.some(r => r.roleName === 'super_admin')).toBe(true);
    });

    it('should list admin permissions', async () => {
      const permissions = await client.listAdminPermissions();
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should list admin permissions by category', async () => {
      const permissions = await client.listAdminPermissions('users');
      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions.every(p => p.category === 'users')).toBe(true);
    });
  });

  // Additional integration tests can be added here
  // Note: These would require setting up test data in the database
});
