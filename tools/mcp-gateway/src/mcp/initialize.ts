import { MCPRegistry } from './registry';
import { logger } from '../utils/logger';
import mcpCatalog from '../../config/mcp-catalog.json';

/**
 * Initialize all MCP services
 * This function will be expanded as we implement each service handler
 */
export async function initializeServices(registry: MCPRegistry): Promise<void> {
  logger.info('Starting MCP service initialization...');

  // Register local MCP services (no handlers needed, just registry entries)
  registerLocalServices(registry);

  // Initialize server-side MCP services
  await initializeServerServices(registry);

  logger.info(`Initialized ${registry.listServices().length} MCP services`);
}

/**
 * Register local MCP services that run on the agent's machine
 */
function registerLocalServices(registry: MCPRegistry): void {
  const localServices = ['playwright', 'shadcn', 'magicui'];

  for (const serviceName of localServices) {
    const serviceConfig = mcpCatalog.services[serviceName as keyof typeof mcpCatalog.services];

    if (serviceConfig) {
      registry.registerService({
        name: serviceName,
        version: serviceConfig.version,
        description: serviceConfig.description,
        location: 'local',
        capabilities: serviceConfig.capabilities,
        status: 'active',
      });

      logger.info(`Registered local MCP service: ${serviceName}`);
    }
  }
}

/**
 * Initialize server-side MCP services with their handlers
 */
async function initializeServerServices(registry: MCPRegistry): Promise<void> {
  const services = [
    { name: 'postgres', initializer: initializePostgreSQL },
    { name: 'mem0', initializer: initializeMem0 },
    { name: 'cloudflare', initializer: initializeCloudflare },
    { name: 'github', initializer: initializeGitHub },
    { name: 'n8n', initializer: initializeN8N },
    { name: 'minio', initializer: initializeMinIO },
  ];

  for (const { name, initializer } of services) {
    try {
      await initializer(registry);
      logger.info(`✅ Initialized ${name} MCP service`);
    } catch (error) {
      logger.error(`❌ Failed to initialize ${name} MCP service`, { error });

      // Register the service as inactive
      const serviceConfig = mcpCatalog.services[name as keyof typeof mcpCatalog.services];
      if (serviceConfig) {
        registry.registerService({
          name,
          version: serviceConfig.version,
          description: serviceConfig.description,
          location: 'server',
          capabilities: serviceConfig.capabilities,
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
}

/**
 * PostgreSQL MCP Initializer
 */
async function initializePostgreSQL(registry: MCPRegistry): Promise<void> {
  const { PostgreSQLHandler } = await import('./handlers/postgres');

  const handler = new PostgreSQLHandler({
    readOnly: true, // Default to read-only for safety
    maxQuerySize: 10000,
  });

  const serviceConfig = mcpCatalog.services.postgres;
  registry.registerService({
    name: 'postgres',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}

/**
 * Mem0 MCP Initializer
 */
async function initializeMem0(registry: MCPRegistry): Promise<void> {
  const { Mem0Handler } = await import('./handlers/mem0');

  const handler = new Mem0Handler();

  const serviceConfig = mcpCatalog.services.mem0;
  registry.registerService({
    name: 'mem0',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}

/**
 * Cloudflare MCP Initializer
 */
async function initializeCloudflare(registry: MCPRegistry): Promise<void> {
  const { CloudflareHandler } = await import('./handlers/cloudflare');

  const handler = new CloudflareHandler();

  const serviceConfig = mcpCatalog.services.cloudflare;
  registry.registerService({
    name: 'cloudflare',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}

/**
 * GitHub MCP Initializer
 */
async function initializeGitHub(registry: MCPRegistry): Promise<void> {
  const { GitHubHandler } = await import('./handlers/github');

  const handler = new GitHubHandler();

  const serviceConfig = mcpCatalog.services.github;
  registry.registerService({
    name: 'github',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}

/**
 * N8N MCP Initializer
 */
async function initializeN8N(registry: MCPRegistry): Promise<void> {
  const { N8NHandler } = await import('./handlers/n8n');

  const handler = new N8NHandler();

  const serviceConfig = mcpCatalog.services.n8n;
  registry.registerService({
    name: 'n8n',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}

/**
 * MinIO MCP Initializer
 */
async function initializeMinIO(registry: MCPRegistry): Promise<void> {
  const { createMinIOHandler } = await import('./handlers/minio');

  const handler = createMinIOHandler({
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '500') * 1024 * 1024,
    allowedContentTypes: (process.env.ALLOWED_FILE_TYPES || 'video/*,image/*,application/pdf').split(','),
    presignedUrlExpiry: parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || '300'),
  });

  await handler.initialize();

  const serviceConfig = mcpCatalog.services.minio;
  registry.registerService({
    name: 'minio',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'active',
  }, handler);
}