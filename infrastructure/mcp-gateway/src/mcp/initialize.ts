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
  const localServices = ['playwright', 'shadcn', 'magicui', 'taskmaster'];

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
 * To be implemented when setting up Cloudflare
 */
async function initializeCloudflare(registry: MCPRegistry): Promise<void> {
  // Placeholder - will be implemented when Cloudflare MCP is added
  logger.info('Cloudflare MCP initialization pending - awaiting implementation');

  const serviceConfig = mcpCatalog.services.cloudflare;
  registry.registerService({
    name: 'cloudflare',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'inactive',
    errorMessage: 'Awaiting implementation',
  });
}

/**
 * GitHub MCP Initializer
 * To be implemented when setting up GitHub
 */
async function initializeGitHub(registry: MCPRegistry): Promise<void> {
  // Placeholder - will be implemented when GitHub MCP is added
  logger.info('GitHub MCP initialization pending - awaiting implementation');

  const serviceConfig = mcpCatalog.services.github;
  registry.registerService({
    name: 'github',
    version: serviceConfig.version,
    description: serviceConfig.description,
    location: 'server',
    capabilities: serviceConfig.capabilities,
    status: 'inactive',
    errorMessage: 'Awaiting implementation',
  });
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