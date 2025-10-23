/**
 * Unit tests for MCPGatewayClient
 */

import { MCPGatewayClient } from '../../lib/mcp-client/client';
import { MCPValidationError } from '../../lib/mcp-client/errors';

describe('MCPGatewayClient', () => {
  describe('constructor', () => {
    it('should initialize with valid config', () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
        baseUrl: 'http://localhost:8100',
      });

      expect(client).toBeDefined();
      expect(client.getConfig().database).toBe('shared-users-db');
      expect(client.getConfig().baseUrl).toBe('http://localhost:8100');
    });

    it('should use default baseUrl if not provided', () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
      });

      expect(client.getConfig().baseUrl).toBe('http://localhost:8100');
    });

    it('should use default timeout if not provided', () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
      });

      expect(client.getConfig().timeout).toBe(10000);
    });

    it('should throw error on invalid database', () => {
      expect(() => {
        new MCPGatewayClient({ database: 'invalid-db' as any });
      }).toThrow(MCPValidationError);
    });

    it('should throw error on invalid baseUrl', () => {
      expect(() => {
        new MCPGatewayClient({
          database: 'shared-users-db',
          baseUrl: 'not-a-valid-url',
        });
      }).toThrow(MCPValidationError);
    });

    it('should throw error on invalid timeout', () => {
      expect(() => {
        new MCPGatewayClient({
          database: 'shared-users-db',
          timeout: 0,
        });
      }).toThrow(MCPValidationError);

      expect(() => {
        new MCPGatewayClient({
          database: 'shared-users-db',
          timeout: 100000,
        });
      }).toThrow(MCPValidationError);
    });
  });

  describe('getConfig', () => {
    it('should return resolved configuration', () => {
      const client = new MCPGatewayClient({
        database: 'shared-users-db',
        timeout: 5000,
        retries: 5,
      });

      const config = client.getConfig();
      expect(config.database).toBe('shared-users-db');
      expect(config.timeout).toBe(5000);
      expect(config.retries).toBe(5);
      expect(config.baseUrl).toBe('http://localhost:8100');
    });
  });
});
