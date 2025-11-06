import { MCPService, MCPHandler, MCPParams, MCPResult, MCPErrorCode } from './protocol/types';
import { logger } from '../utils/logger';
import { MCPError } from '../utils/errors';
import mcpCatalog from '../../config/mcp-catalog.json';
import { config } from '../../config/environment';
import axios from 'axios';

export class MCPRegistry {
  private services: Map<string, MCPService>;
  private handlers: Map<string, MCPHandler>;
  private orchestratorUrl: string;

  constructor() {
    this.services = new Map();
    this.handlers = new Map();
    this.orchestratorUrl = config.ORCHESTRATOR_URL || 'http://localhost:9403';
  }

  /**
   * Register a new MCP service
   */
  public registerService(service: MCPService, handler?: MCPHandler): void {
    if (this.services.has(service.name)) {
      throw new Error(`Service ${service.name} is already registered`);
    }

    this.services.set(service.name, service);

    if (handler && service.location === 'server') {
      this.handlers.set(service.name, handler);
      logger.info(`Registered server-side MCP service: ${service.name}`);
    } else if (service.location === 'local') {
      logger.info(`Registered local MCP service reference: ${service.name}`);
    }
  }

  /**
   * Get a registered service
   */
  public getService(name: string): MCPService | undefined {
    return this.services.get(name);
  }

  /**
   * Get a service handler
   */
  public getHandler(name: string): MCPHandler | undefined {
    return this.handlers.get(name);
  }

  /**
   * List all registered services
   */
  public listServices(): MCPService[] {
    return Array.from(this.services.values());
  }

  /**
   * List services by location (server or local)
   */
  public listServicesByLocation(location: 'server' | 'local'): MCPService[] {
    return this.listServices().filter(s => s.location === location);
  }

  /**
   * Check if a service is registered and active
   */
  public isServiceActive(name: string): boolean {
    const service = this.services.get(name);
    return service?.status === 'active';
  }

  /**
   * Check if agent has permission to use a service
   */
  private async checkPermission(serviceName: string, agentId?: string): Promise<boolean> {
    // If no agent ID provided, allow (localhost/testing)
    if (!agentId) {
      logger.debug(`No agent ID provided, allowing ${serviceName} access`);
      return true;
    }

    // Check if service is always active (e.g., mem0)
    const catalogService = mcpCatalog.services[serviceName as keyof typeof mcpCatalog.services];
    if (catalogService?.alwaysActive) {
      logger.debug(`Service ${serviceName} is alwaysActive, allowing access for agent ${agentId}`);
      return true;
    }

    // Query orchestrator for agent permissions
    try {
      const response = await axios.get(
        `${this.orchestratorUrl}/api/agent/${agentId}/mcp-permissions`,
        { timeout: 3000 }
      );

      const allowedMCPs = response.data.allowed_mcps || [];
      const hasPermission = allowedMCPs.includes(serviceName);

      logger.debug(`Permission check for agent ${agentId} on ${serviceName}: ${hasPermission}`, {
        allowedMCPs,
      });

      return hasPermission;
    } catch (error) {
      logger.error(`Failed to check permissions for agent ${agentId}`, { error });
      // On error, deny access for safety
      return false;
    }
  }

  /**
   * Request permission from orchestrator
   */
  private async requestPermission(serviceName: string, agentId: string, reason: string): Promise<void> {
    try {
      await axios.post(
        `${this.orchestratorUrl}/api/mcp/permission-request`,
        {
          agent_id: agentId,
          service_name: serviceName,
          reason,
          timestamp: new Date().toISOString(),
        },
        { timeout: 3000 }
      );

      logger.info(`Permission request sent to orchestrator`, {
        agentId,
        serviceName,
        reason,
      });
    } catch (error) {
      logger.error(`Failed to send permission request`, { error, agentId, serviceName });
    }
  }

  /**
   * Execute a command on a service
   */
  public async execute(params: MCPParams, agentId?: string): Promise<MCPResult> {
    const service = this.services.get(params.service);

    if (!service) {
      throw new MCPError(
        `Service '${params.service}' not found`,
        MCPErrorCode.SERVICE_NOT_FOUND,
        { service: params.service }
      );
    }

    if (service.status !== 'active') {
      throw new MCPError(
        `Service '${params.service}' is not available`,
        MCPErrorCode.SERVICE_UNAVAILABLE,
        {
          service: params.service,
          status: service.status,
          details: service.errorMessage
        }
      );
    }

    // Check permissions
    const hasPermission = await this.checkPermission(params.service, agentId);

    if (!hasPermission) {
      // Send permission request to orchestrator
      const reason = `Agent ${agentId} attempted to use ${params.service} for operation: ${params.operation}`;
      await this.requestPermission(params.service, agentId!, reason);

      // Return permission denied error
      throw new MCPError(
        `Permission denied: Agent does not have access to service '${params.service}'. A permission request has been sent to the orchestrator.`,
        MCPErrorCode.PERMISSION_DENIED,
        {
          service: params.service,
          agentId,
          message: 'The orchestrator has been notified of this request. You can ask them to grant you access.',
        }
      );
    }

    // For local services, return instructions for the agent
    if (service.location === 'local') {
      return {
        status: 'success',
        data: {
          type: 'local_execution',
          service: params.service,
          instructions: this.buildLocalInstructions(params),
        },
        metadata: {
          executionTime: 0,
          tokensUsed: 0,
          cost: 0,
          service: params.service,
          operation: params.operation,
          timestamp: new Date().toISOString(),
        }
      };
    }

    // For server-side services, execute through handler
    const handler = this.handlers.get(params.service);

    if (!handler) {
      throw new MCPError(
        `Handler for service '${params.service}' not found`,
        MCPErrorCode.INTERNAL_ERROR,
        { service: params.service }
      );
    }

    // Validate params if validator is available
    if (handler.validateParams) {
      handler.validateParams(params);
    }

    // Check if operation is supported
    const capabilities = handler.getCapabilities();
    const capability = capabilities.find(c => c.name === params.operation);

    if (!capability) {
      throw new MCPError(
        `Operation '${params.operation}' not supported by service '${params.service}'`,
        MCPErrorCode.OPERATION_NOT_SUPPORTED,
        {
          service: params.service,
          operation: params.operation,
          availableOperations: capabilities.map(c => c.name)
        }
      );
    }

    // Execute the handler
    const startTime = Date.now();
    try {
      const result = await handler.execute(params);

      // Add execution metadata
      if (!result.metadata) {
        result.metadata = {
          executionTime: 0,
          tokensUsed: 0,
          cost: 0,
          service: params.service,
          operation: params.operation,
          timestamp: new Date().toISOString(),
        };
      }

      result.metadata = {
        ...result.metadata,
        executionTime: Date.now() - startTime,
        service: params.service,
        operation: params.operation,
        timestamp: new Date().toISOString(),
      };

      // Calculate token usage from catalog
      const serviceConfig = mcpCatalog.services[params.service as keyof typeof mcpCatalog.services];
      if (serviceConfig && result.metadata) {
        result.metadata.tokensUsed = result.metadata.tokensUsed || serviceConfig.tokenCost.avgTokensPerCall;
        result.metadata.cost = result.metadata.cost || serviceConfig.tokenCost.costPerCall;
      }

      return result;
    } catch (error) {
      logger.error(`Error executing ${params.service}.${params.operation}`, { error, params });

      if (error instanceof MCPError) {
        throw error;
      }

      throw new MCPError(
        `Failed to execute operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MCPErrorCode.INTERNAL_ERROR,
        {
          service: params.service,
          operation: params.operation,
          details: error instanceof Error ? error.stack : undefined
        }
      );
    }
  }

  /**
   * Build instructions for local MCP execution
   */
  private buildLocalInstructions(params: MCPParams): any {
    const service = params.service.toLowerCase();

    switch (service) {
      case 'playwright':
        return {
          command: 'npx',
          args: ['@modelcontextprotocol/server-playwright', params.operation, ...(params.args ? Object.values(params.args) : [])],
          description: `Execute Playwright ${params.operation} locally`,
        };

      case 'shadcn':
        return {
          command: 'npx',
          args: ['shadcn-ui', params.operation, ...(params.args ? Object.values(params.args) : [])],
          description: `Execute ShadCN ${params.operation} locally`,
        };

      case 'magicui':
        return {
          command: 'npx',
          args: ['magicui', params.operation, ...(params.args ? Object.values(params.args) : [])],
          description: `Execute MagicUI ${params.operation} locally`,
        };

      case 'taskmaster':
        return {
          command: 'node',
          args: ['.taskmaster/mcp-server/index.js', params.operation, ...(params.args ? Object.values(params.args) : [])],
          description: `Execute Taskmaster ${params.operation} locally`,
        };

      default:
        return {
          message: `Local execution required for ${params.service}`,
          operation: params.operation,
          args: params.args,
        };
    }
  }

  /**
   * Update service status
   */
  public updateServiceStatus(name: string, status: 'active' | 'inactive' | 'error', errorMessage?: string): void {
    const service = this.services.get(name);
    if (service) {
      service.status = status;
      service.errorMessage = errorMessage;
      logger.info(`Updated service status: ${name} -> ${status}`, { errorMessage });
    }
  }

  /**
   * Get service statistics
   */
  public getStatistics(): any {
    const services = this.listServices();
    return {
      total: services.length,
      active: services.filter(s => s.status === 'active').length,
      inactive: services.filter(s => s.status === 'inactive').length,
      error: services.filter(s => s.status === 'error').length,
      serverSide: services.filter(s => s.location === 'server').length,
      local: services.filter(s => s.location === 'local').length,
      services: services.map(s => ({
        name: s.name,
        status: s.status,
        location: s.location,
        capabilities: s.capabilities.length,
      })),
    };
  }

  /**
   * Shutdown all services gracefully
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down MCP services...');

    for (const [name, handler] of this.handlers.entries()) {
      try {
        // If handler has a shutdown method, call it
        if ('shutdown' in handler && typeof handler.shutdown === 'function') {
          await (handler as any).shutdown();
          logger.info(`Shut down service: ${name}`);
        }
      } catch (error) {
        logger.error(`Error shutting down service ${name}`, { error });
      }
    }

    this.services.clear();
    this.handlers.clear();
    logger.info('All MCP services shut down');
  }
}