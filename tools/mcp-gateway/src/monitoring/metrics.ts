import { Request, Response, NextFunction } from 'express';
import * as promClient from 'prom-client';
import { config } from '../../config/environment';
import { logger } from '../utils/logger';
import { createServer } from 'http';
import { AuthenticatedRequest } from '../auth/middleware';

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'mcp_gateway_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status', 'service'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new promClient.Counter({
  name: 'mcp_gateway_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status', 'service'],
});

const mcpOperationDuration = new promClient.Histogram({
  name: 'mcp_operation_duration_seconds',
  help: 'Duration of MCP operations in seconds',
  labelNames: ['service', 'operation', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});

const mcpOperationTotal = new promClient.Counter({
  name: 'mcp_operations_total',
  help: 'Total number of MCP operations',
  labelNames: ['service', 'operation', 'status'],
});

const tokenUsageTotal = new promClient.Counter({
  name: 'mcp_token_usage_total',
  help: 'Total token usage by service and agent',
  labelNames: ['service', 'operation', 'agent_id'],
});

const connectionPoolGauge = new promClient.Gauge({
  name: 'mcp_connection_pool_connections',
  help: 'Number of connections in the pool',
  labelNames: ['database', 'state'],
});

const activeRequestsGauge = new promClient.Gauge({
  name: 'mcp_active_requests',
  help: 'Number of active requests',
  labelNames: ['service'],
});

const rateLimitHits = new promClient.Counter({
  name: 'mcp_rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['agent_id', 'service'],
});

const errorCounter = new promClient.Counter({
  name: 'mcp_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'service', 'code'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(mcpOperationDuration);
register.registerMetric(mcpOperationTotal);
register.registerMetric(tokenUsageTotal);
register.registerMetric(connectionPoolGauge);
register.registerMetric(activeRequestsGauge);
register.registerMetric(rateLimitHits);
register.registerMetric(errorCounter);

// Middleware to track HTTP metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Track active requests
  const service = extractServiceFromPath(req.path);
  activeRequestsGauge.inc({ service });

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode.toString(),
        service,
      },
      duration
    );

    httpRequestTotal.inc({
      method: req.method,
      route,
      status: res.statusCode.toString(),
      service,
    });

    activeRequestsGauge.dec({ service });
  });

  next();
};

// Track MCP operation metrics
export function recordMCPOperation(
  service: string,
  operation: string,
  duration: number,
  status: 'success' | 'error'
): void {
  mcpOperationDuration.observe({ service, operation, status }, duration / 1000);
  mcpOperationTotal.inc({ service, operation, status });
}

// Track token usage
export function recordTokenUsage(
  service: string,
  operation: string,
  tokens: number,
  agentId?: string
): void {
  tokenUsageTotal.inc({
    service,
    operation,
    agent_id: agentId || 'anonymous',
  }, tokens);
}

// Track connection pool metrics
export function updateConnectionPoolMetrics(database: string, stats: {
  total: number;
  idle: number;
  waiting: number;
}): void {
  connectionPoolGauge.set({ database, state: 'total' }, stats.total);
  connectionPoolGauge.set({ database, state: 'idle' }, stats.idle);
  connectionPoolGauge.set({ database, state: 'waiting' }, stats.waiting);
  connectionPoolGauge.set({ database, state: 'active' }, stats.total - stats.idle);
}

// Track rate limit hits
export function recordRateLimitHit(agentId: string, service?: string): void {
  rateLimitHits.inc({
    agent_id: agentId,
    service: service || 'global',
  });
}

// Track errors
export function recordError(type: string, service: string, code?: string): void {
  errorCounter.inc({
    type,
    service,
    code: code || 'unknown',
  });
}

// Extract service from request path
function extractServiceFromPath(path: string): string {
  const match = path.match(/\/mcp\/(\w+)/);
  return match ? match[1] : 'unknown';
}

// Setup metrics server
export function setupMetrics(): void {
  if (!config.ENABLE_METRICS) {
    logger.info('Metrics disabled');
    return;
  }

  const metricsServer = createServer((req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', register.contentType);
      register.metrics().then(metrics => {
        res.end(metrics);
      }).catch(err => {
        res.statusCode = 500;
        res.end(err.toString());
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  metricsServer.listen(config.METRICS_PORT, () => {
    logger.info(`📊 Metrics server started on port ${config.METRICS_PORT}`);
  });
}

// Get current metrics as JSON
export async function getMetricsJson(): Promise<any> {
  const metrics = await register.getMetricsAsJSON();
  return metrics.reduce((acc: any, metric: any) => {
    acc[metric.name] = {
      help: metric.help,
      type: metric.type,
      values: metric.values,
    };
    return acc;
  }, {});
}

export { register };