import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/environment';
import { AuthenticationError, PermissionError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface AgentToken {
  agentId: string;
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt: number;
}

export interface AuthenticatedRequest extends Request {
  agent?: AgentToken;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Localhost Bypass - Trust requests from localhost and Docker network (internal)
    const clientIp = req.ip || req.socket.remoteAddress || '';
    const isLocalhost =
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp === '::ffff:127.0.0.1' ||
      clientIp.startsWith('127.') ||
      clientIp === 'localhost' ||
      // Docker network ranges (internal)
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.') ||
      clientIp.startsWith('192.168.');

    if (isLocalhost) {
      req.agent = {
        agentId: 'localhost-agent',
        name: 'Local Agent',
        permissions: ['*'],
        expiresAt: Date.now() + 86400000,
      };
      logger.debug('Localhost agent authenticated', { ip: clientIp });
      return next();
    }

    // 2. API Key Authentication - Check for X-MCP-Key header
    const apiKey = req.headers['x-mcp-key'] as string;
    if (apiKey) {
      const agent = await validateApiKey(apiKey);
      if (agent) {
        req.agent = agent;
        logger.debug('API key authenticated', {
          agentId: agent.agentId,
          name: agent.name,
        });
        return next();
      }
      throw new AuthenticationError('Invalid API key');
    }

    // 3. JWT Bearer Token (legacy support)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET) as AgentToken;

          // Check expiration
          if (decoded.expiresAt && decoded.expiresAt < Date.now()) {
            throw new AuthenticationError('Token has expired');
          }

          req.agent = decoded;
          logger.debug('JWT authenticated', {
            agentId: decoded.agentId,
            name: decoded.name,
          });
          return next();
        } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthenticationError('Invalid token');
          }
          if (error instanceof jwt.TokenExpiredError) {
            throw new AuthenticationError('Token has expired');
          }
          throw error;
        }
      }
    }

    // No valid authentication found
    throw new AuthenticationError('Authentication required. Use localhost, API key (X-MCP-Key), or Bearer token.');
  } catch (error) {
    next(error);
  }
}

/**
 * Validate API key and return agent info
 */
async function validateApiKey(apiKey: string): Promise<AgentToken | null> {
  // Simple API key validation
  // In production, this would check against a database or key store
  // Format: mcp_live_<random>
  if (!apiKey.startsWith('mcp_')) {
    return null;
  }

  // For now, accept any valid format key and assign full permissions
  // TODO: Implement proper key management with per-key permissions
  const keyId = apiKey.replace('mcp_live_', '').substring(0, 8);

  return {
    agentId: `api-key-${keyId}`,
    name: `API Key Agent (${keyId})`,
    permissions: ['*'],
    expiresAt: Date.now() + (365 * 24 * 3600000), // 1 year
  };
}

/**
 * Check if agent has required permission
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.agent) {
      return next(new AuthenticationError('Authentication required'));
    }

    const hasWildcard = req.agent.permissions.includes('*');
    const hasPermission = req.agent.permissions.includes(permission);

    if (!hasWildcard && !hasPermission) {
      return next(new PermissionError(
        `Permission '${permission}' required`,
        {
          required: permission,
          available: req.agent.permissions,
        }
      ));
    }

    next();
  };
}

/**
 * Generate a JWT token for an agent
 */
export function generateToken(
  agentId: string,
  name: string,
  permissions: string[] = [],
  expiresIn: string = '24h'
): string {
  const expiresAt = Date.now() + (parseInt(expiresIn) * 3600000);

  const payload: AgentToken = {
    agentId,
    name,
    permissions,
    expiresAt,
  };

  return jwt.sign(
    payload,
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as string,
      issuer: 'mcp-gateway',
      subject: agentId,
    } as jwt.SignOptions
  );
}

/**
 * Generate an API key for remote agents
 */
export function generateApiKey(prefix: string = 'live'): string {
  const randomBytes = Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('');

  return `mcp_${prefix}_${randomBytes}`;
}

/**
 * Middleware to log agent activity
 */
export function agentActivityLogger(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.agent) {
    logger.info('Agent activity', {
      agentId: req.agent.agentId,
      name: req.agent.name,
      method: req.method,
      path: req.path,
      body: req.body,
      timestamp: new Date().toISOString(),
    });
  }
  next();
}