import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../../config/environment';
import { RateLimitError } from '../utils/errors';
import { AuthenticatedRequest } from './middleware';
import { logger } from '../utils/logger';

// In-memory store for development, Redis for production
const createStore = () => {
  if (config.NODE_ENV === 'production' && config.REDIS_URL) {
    // Redis store would be configured here in production
    // For now, using memory store
    return undefined;
  }
  return undefined; // Use default memory store
};

// Key generator based on agent ID or IP
const keyGenerator = (req: Request): string => {
  const authReq = req as AuthenticatedRequest;
  if (authReq.agent) {
    return `agent:${authReq.agent.agentId}`;
  }
  return `ip:${req.ip}`;
};

// Base rate limiter
export const rateLimitMiddleware = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: createStore(),
  skip: (req: Request) => {
    // Skip rate limiting in development if configured
    if (config.NODE_ENV === 'development') {
      return true;
    }
    return false;
  },
  handler: (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const identifier = authReq.agent ? `Agent ${authReq.agent.agentId}` : `IP ${req.ip}`;

    logger.warn('Rate limit exceeded', {
      identifier,
      path: req.path,
      method: req.method,
    });

    throw new RateLimitError(
      `Rate limit exceeded. Maximum ${config.RATE_LIMIT_MAX_REQUESTS} requests per ${config.RATE_LIMIT_WINDOW_MS / 1000} seconds.`,
      {
        limit: config.RATE_LIMIT_MAX_REQUESTS,
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        identifier,
      }
    );
  },
});

// Service-specific rate limiters
export const createServiceRateLimiter = (service: string, maxRequests: number = 100) => {
  return rateLimit({
    windowMs: 60000, // 1 minute
    max: maxRequests,
    keyGenerator: (req: Request) => {
      const authReq = req as AuthenticatedRequest;
      const agentId = authReq.agent?.agentId || req.ip;
      return `${service}:${agentId}`;
    },
    skip: (req: Request) => {
      if (config.NODE_ENV === 'development') {
        return true;
      }
      return false;
    },
    handler: (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const identifier = authReq.agent ? `Agent ${authReq.agent.agentId}` : `IP ${req.ip}`;

      logger.warn(`Service rate limit exceeded for ${service}`, {
        service,
        identifier,
        path: req.path,
      });

      throw new RateLimitError(
        `Rate limit exceeded for ${service}. Maximum ${maxRequests} requests per minute.`,
        {
          service,
          limit: maxRequests,
          windowMs: 60000,
          identifier,
        }
      );
    },
  });
};

// Create rate limiters for each service based on catalog
export const serviceRateLimiters = {
  postgres: createServiceRateLimiter('postgres', 100),
  mem0: createServiceRateLimiter('mem0', 200),
  cloudflare: createServiceRateLimiter('cloudflare', 50),
  github: createServiceRateLimiter('github', 60),
  n8n: createServiceRateLimiter('n8n', 100),
};

// Burst rate limiter for preventing abuse
export const burstRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20, // Maximum 20 requests per second
  keyGenerator,
  skip: (req: Request) => config.NODE_ENV === 'development',
  handler: (req: Request, res: Response) => {
    logger.error('Burst rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });

    throw new RateLimitError(
      'Too many requests in a short period. Please slow down.',
      {
        type: 'burst',
        limit: 20,
        windowMs: 1000,
      }
    );
  },
});