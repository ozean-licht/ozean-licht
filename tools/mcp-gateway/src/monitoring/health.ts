import { Router, Request, Response } from 'express';
import { MCPRegistry } from '../mcp/registry';
import { logger } from '../utils/logger';
import pkg from '../../package.json';

export const healthRouter = Router();

// Basic liveness check
healthRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: pkg.version,
  });
});

// Detailed readiness check with dependency status
healthRouter.get('/ready', async (req: Request, res: Response) => {
  const checks: Record<string, any> = {};
  let allHealthy = true;

  // Check PostgreSQL connections
  try {
    // This will be implemented when PostgreSQL MCP is added
    checks.postgresql = {
      status: 'pending',
      databases: {
        'kids-ascension': 'pending',
        'ozean-licht': 'pending',
      },
    };
  } catch (error) {
    checks.postgresql = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    allHealthy = false;
  }

  // Check Mem0 connectivity
  try {
    // This will be implemented when Mem0 MCP is added
    checks.mem0 = { status: 'pending' };
  } catch (error) {
    checks.mem0 = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    allHealthy = false;
  }

  // Check N8N connectivity
  try {
    // This will be implemented when N8N MCP is added
    checks.n8n = { status: 'pending' };
  } catch (error) {
    checks.n8n = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    allHealthy = false;
  }

  const response = {
    status: allHealthy ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    version: pkg.version,
    checks,
  };

  res.status(allHealthy ? 200 : 503).json(response);
});

// Version and build info
healthRouter.get('/info', (req: Request, res: Response) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});