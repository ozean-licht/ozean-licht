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
    // Skip auth in development mode if configured
    if (config.NODE_ENV === 'development' && !config.JWT_SECRET) {
      req.agent = {
        agentId: 'dev-agent',
        name: 'Development Agent',
        permissions: ['*'],
        expiresAt: Date.now() + 86400000,
      };
      return next();
    }

    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('Authorization header required');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new AuthenticationError('Invalid authorization format. Expected: Bearer <token>');
    }

    // Verify and decode token
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as AgentToken;

      // Check expiration
      if (decoded.expiresAt && decoded.expiresAt < Date.now()) {
        throw new AuthenticationError('Token has expired');
      }

      // Attach agent info to request
      req.agent = decoded;

      logger.debug('Agent authenticated', {
        agentId: decoded.agentId,
        name: decoded.name,
        permissions: decoded.permissions,
      });

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token has expired');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
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