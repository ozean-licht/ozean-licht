import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { config, features } from '../config/environment';
import { setupRouter } from './router';
import { errorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';
import { setupMetrics, metricsMiddleware } from './monitoring/metrics';
import { healthRouter } from './monitoring/health';
import { rateLimitMiddleware } from './auth/rateLimit';
import { authMiddleware } from './auth/middleware';
import { MCPRegistry } from './mcp/registry';
import { initializeServices } from './mcp/initialize';

export class MCPGatewayServer {
  private app: Application;
  private server: ReturnType<typeof createServer>;
  private registry: MCPRegistry;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.registry = new MCPRegistry();
  }

  private async setupMiddleware(): Promise<void> {
    // Security middleware
    if (features.helmet) {
      this.app.use(helmet());
    }

    // CORS configuration
    if (features.cors) {
      this.app.use(cors({
        origin: config.NODE_ENV === 'production'
          ? ['https://ozean-licht.dev', 'https://kids-ascension.dev']
          : true,
        credentials: true,
      }));
    }

    // Compression
    if (features.compression) {
      this.app.use(compression());
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request processed', {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          ip: req.ip,
        });
      });
      next();
    });

    // Metrics middleware
    if (features.metrics) {
      this.app.use(metricsMiddleware);
    }

    // Rate limiting
    if (features.rateLimiting) {
      this.app.use('/mcp', rateLimitMiddleware);
    }

    // Authentication
    if (features.authentication) {
      this.app.use('/mcp', authMiddleware);
    }
  }

  private setupRoutes(): void {
    // Health check routes
    this.app.use('/', healthRouter);

    // Main MCP routes
    this.app.use('/mcp', setupRouter(this.registry));

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
      });
    });

    // Error handler
    this.app.use(errorHandler);
  }

  private async initializeServices(): Promise<void> {
    logger.info('Initializing MCP services...');

    try {
      await initializeServices(this.registry);
      logger.info('All MCP services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize MCP services', { error });
      throw error;
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);

      // Stop accepting new connections
      this.server.close(() => {
        logger.info('HTTP server closed');
      });

      // Close all MCP service connections
      await this.registry.shutdown();

      // Wait for existing connections to complete (max 10 seconds)
      setTimeout(() => {
        logger.warn('Forcing shutdown after timeout');
        process.exit(0);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  public async start(): Promise<void> {
    try {
      // Setup middleware
      await this.setupMiddleware();

      // Initialize MCP services
      await this.initializeServices();

      // Setup routes
      this.setupRoutes();

      // Setup metrics server if enabled
      if (features.metrics) {
        setupMetrics();
      }

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      // Start server
      this.server.listen(config.PORT, config.HOST, () => {
        logger.info(`🚀 MCP Gateway Server started`, {
          host: config.HOST,
          port: config.PORT,
          environment: config.NODE_ENV,
          services: this.registry.listServices().length,
        });

        logger.info('Available MCP services:',
          this.registry.listServices().map(s => s.name)
        );
      });
    } catch (error) {
      logger.error('Failed to start server', { error });
      process.exit(1);
    }
  }
}

// Start server if this is the main module
if (require.main === module) {
  const server = new MCPGatewayServer();
  server.start().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default MCPGatewayServer;