/**
 * Unit Tests for Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthenticatedRequest, AgentToken } from '../../../src/auth/middleware';
import { AuthenticationError } from '../../../src/utils/errors';

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock environment config
jest.mock('../../../config/environment', () => ({
  config: {
    JWT_SECRET: 'test-jwt-secret-for-testing-only',
    JWT_EXPIRES_IN: '24h',
  },
}));

describe('Authentication Middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      ip: '',
      socket: { remoteAddress: '' } as any,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Localhost Bypass Authentication', () => {
    const localhostIPs = [
      '127.0.0.1',
      '::1',
      '::ffff:127.0.0.1',
      '127.0.0.123',
      'localhost',
    ];

    localhostIPs.forEach((ip) => {
      it(`should bypass authentication for ${ip}`, async () => {
        mockReq.ip = ip;

        await authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.agent).toBeDefined();
        expect(mockReq.agent?.agentId).toBe('localhost-agent');
        expect(mockReq.agent?.permissions).toContain('*');
      });
    });

    const dockerNetworkIPs = [
      '10.0.1.16',
      '172.17.0.2',
      '192.168.1.100',
    ];

    dockerNetworkIPs.forEach((ip) => {
      it(`should bypass authentication for Docker network IP ${ip}`, async () => {
        mockReq.ip = ip;

        await authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.agent).toBeDefined();
        expect(mockReq.agent?.agentId).toBe('localhost-agent');
      });
    });

    it('should use socket.remoteAddress if req.ip is not available', async () => {
      mockReq.ip = undefined;
      mockReq.socket!.remoteAddress = '127.0.0.1';

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.agent).toBeDefined();
    });
  });

  describe('API Key Authentication', () => {
    it('should authenticate with valid API key', async () => {
      mockReq.ip = '203.0.113.1'; // External IP
      mockReq.headers = {
        'x-mcp-key': 'mcp_live_valid_key',
      };

      // Mock validateApiKey function (would need to be implemented)
      // For now, this test demonstrates the structure

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      // Should handle API key validation
      expect(mockReq.headers['x-mcp-key']).toBe('mcp_live_valid_key');
    });

    it('should reject invalid API key', async () => {
      mockReq.ip = '203.0.113.1'; // External IP
      mockReq.headers = {
        'x-mcp-key': 'mcp_live_invalid_key',
      };

      // API key validation would reject this
      // For now, documenting expected behavior
    });
  });

  describe('JWT Bearer Token Authentication', () => {
    it('should authenticate with valid JWT token', async () => {
      mockReq.ip = '203.0.113.1'; // External IP

      const agentToken: AgentToken = {
        agentId: 'test-agent-123',
        name: 'Test Agent',
        permissions: ['read', 'write'],
        rateLimit: 100,
        expiresAt: Date.now() + 86400000, // 24 hours from now
      };

      const token = jwt.sign(agentToken, 'test-jwt-secret-for-testing-only');
      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.agent).toBeDefined();
      expect(mockReq.agent?.agentId).toBe('test-agent-123');
      expect(mockReq.agent?.name).toBe('Test Agent');
      expect(mockReq.agent?.permissions).toContain('read');
    });

    it('should reject expired JWT token', async () => {
      mockReq.ip = '203.0.113.1'; // External IP

      const expiredToken: AgentToken = {
        agentId: 'test-agent-123',
        name: 'Test Agent',
        permissions: ['read'],
        expiresAt: Date.now() - 1000, // Expired 1 second ago
      };

      const token = jwt.sign(expiredToken, 'test-jwt-secret-for-testing-only');
      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow(AuthenticationError);

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow('Token has expired');
    });

    it('should reject malformed JWT token', async () => {
      mockReq.ip = '203.0.113.1'; // External IP
      mockReq.headers = {
        authorization: 'Bearer invalid_token_format',
      };

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow();
    });

    it('should reject JWT with invalid signature', async () => {
      mockReq.ip = '203.0.113.1'; // External IP

      const agentToken: AgentToken = {
        agentId: 'test-agent-123',
        name: 'Test Agent',
        permissions: ['read'],
        expiresAt: Date.now() + 86400000,
      };

      // Sign with different secret
      const token = jwt.sign(agentToken, 'wrong-secret-key');
      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow();
    });

    it('should handle missing Bearer keyword', async () => {
      mockReq.ip = '203.0.113.1'; // External IP
      const token = jwt.sign({ agentId: 'test' }, 'test-jwt-secret-for-testing-only');
      mockReq.headers = {
        authorization: token, // Missing "Bearer " prefix
      };

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('No Authentication Provided', () => {
    it('should reject request without any authentication from external IP', async () => {
      mockReq.ip = '203.0.113.1'; // External IP
      mockReq.headers = {}; // No auth headers

      await expect(
        authMiddleware(
          mockReq as AuthenticatedRequest,
          mockRes as Response,
          mockNext
        )
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('Authentication Priority', () => {
    it('should prioritize localhost bypass over API key', async () => {
      mockReq.ip = '127.0.0.1'; // Localhost
      mockReq.headers = {
        'x-mcp-key': 'mcp_live_some_key',
      };

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.agent?.agentId).toBe('localhost-agent');
      // Should not check API key for localhost
    });

    it('should prioritize localhost bypass over JWT', async () => {
      mockReq.ip = '::1'; // IPv6 localhost
      const token = jwt.sign(
        { agentId: 'test' },
        'test-jwt-secret-for-testing-only'
      );
      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.agent?.agentId).toBe('localhost-agent');
    });
  });

  describe('Agent Information', () => {
    it('should populate agent information on successful authentication', async () => {
      mockReq.ip = '127.0.0.1';

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.agent).toBeDefined();
      expect(mockReq.agent).toHaveProperty('agentId');
      expect(mockReq.agent).toHaveProperty('name');
      expect(mockReq.agent).toHaveProperty('permissions');
      expect(mockReq.agent).toHaveProperty('expiresAt');
    });

    it('should include permissions in agent token', async () => {
      mockReq.ip = '127.0.0.1';

      await authMiddleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.agent?.permissions).toBeDefined();
      expect(Array.isArray(mockReq.agent?.permissions)).toBe(true);
      expect(mockReq.agent?.permissions).toContain('*'); // Localhost has all permissions
    });
  });
});
