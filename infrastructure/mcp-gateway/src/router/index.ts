import { Router, Request, Response, NextFunction } from 'express';
import { MCPRegistry } from '../mcp/registry';
import { commandParser } from './commandParser';
import { MCPRequest, MCPResponse, MCPErrorCode } from '../mcp/protocol/types';
import { logger } from '../utils/logger';
import { MCPError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export function setupRouter(registry: MCPRegistry): Router {
  const router = Router();

  // Handle slash command format: /mcp-[service] [args]
  router.post('/execute', async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.body.id || uuidv4();
    const startTime = Date.now();

    try {
      // Parse the command
      const { command } = req.body;
      if (!command) {
        throw new ValidationError('Command is required');
      }

      logger.debug('Processing command', { command, requestId });

      const parsed = commandParser.parse(command);
      logger.debug('Parsed command', { parsed, requestId });

      // Build MCP params
      const params = {
        service: parsed.service,
        operation: parsed.operation,
        database: parsed.database,
        args: parsed.args,
        options: req.body.options,
      };

      // Execute through registry
      const result = await registry.execute(params);

      // Build response
      const response: MCPResponse = {
        jsonrpc: '2.0',
        result,
        id: requestId,
      };

      logger.info('Command executed successfully', {
        command,
        service: parsed.service,
        operation: parsed.operation,
        executionTime: Date.now() - startTime,
        requestId,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Handle JSON-RPC format
  router.post('/rpc', async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    try {
      const rpcRequest: MCPRequest = req.body;

      // Validate JSON-RPC format
      if (rpcRequest.jsonrpc !== '2.0') {
        throw new MCPError(
          'Invalid JSON-RPC version',
          MCPErrorCode.INVALID_REQUEST,
          { received: rpcRequest.jsonrpc, expected: '2.0' }
        );
      }

      if (!rpcRequest.method) {
        throw new MCPError('Method is required', MCPErrorCode.INVALID_REQUEST);
      }

      if (!rpcRequest.id) {
        throw new MCPError('Request ID is required', MCPErrorCode.INVALID_REQUEST);
      }

      logger.debug('Processing RPC request', {
        method: rpcRequest.method,
        params: rpcRequest.params,
        id: rpcRequest.id,
      });

      // Handle different methods
      let result;
      switch (rpcRequest.method) {
        case 'mcp.execute':
          if (!rpcRequest.params) {
            throw new MCPError('Parameters required for mcp.execute', MCPErrorCode.INVALID_PARAMS);
          }
          result = await registry.execute(rpcRequest.params);
          break;

        case 'mcp.listServices':
          result = {
            status: 'success',
            data: registry.listServices().map(s => ({
              name: s.name,
              version: s.version,
              description: s.description,
              location: s.location,
              status: s.status,
              capabilities: s.capabilities,
            })),
          };
          break;

        case 'mcp.getCapabilities':
          const serviceName = rpcRequest.params?.service;
          if (!serviceName) {
            throw new MCPError('Service name required', MCPErrorCode.INVALID_PARAMS);
          }
          const handler = registry.getHandler(serviceName);
          if (!handler) {
            throw new MCPError(`Service ${serviceName} not found`, MCPErrorCode.SERVICE_NOT_FOUND);
          }
          result = {
            status: 'success',
            data: handler.getCapabilities(),
          };
          break;

        case 'mcp.getStatistics':
          result = {
            status: 'success',
            data: registry.getStatistics(),
          };
          break;

        default:
          throw new MCPError(
            `Method ${rpcRequest.method} not found`,
            MCPErrorCode.METHOD_NOT_FOUND
          );
      }

      // Build response
      const response: MCPResponse = {
        jsonrpc: '2.0',
        result,
        id: rpcRequest.id,
      };

      logger.info('RPC request processed', {
        method: rpcRequest.method,
        executionTime: Date.now() - startTime,
        id: rpcRequest.id,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get service catalog
  router.get('/catalog', (req: Request, res: Response) => {
    const services = registry.listServices();
    const catalog = services.map(service => ({
      name: service.name,
      version: service.version,
      description: service.description,
      location: service.location,
      status: service.status,
      capabilities: service.capabilities,
      handler: registry.getHandler(service.name) ? {
        capabilities: registry.getHandler(service.name)!.getCapabilities(),
      } : null,
    }));

    res.json({
      services: catalog,
      statistics: registry.getStatistics(),
      timestamp: new Date().toISOString(),
    });
  });

  // Get service details
  router.get('/service/:name', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      const service = registry.getService(name);

      if (!service) {
        throw new MCPError(`Service ${name} not found`, MCPErrorCode.SERVICE_NOT_FOUND);
      }

      const handler = registry.getHandler(name);
      const capabilities = handler ? handler.getCapabilities() : [];

      res.json({
        service: {
          ...service,
          capabilities: capabilities.length > 0 ? capabilities : service.capabilities,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Test endpoint for specific services
  router.post('/test/:service', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { service } = req.params;
      const handler = registry.getHandler(service);

      if (!handler) {
        throw new MCPError(`Service ${service} not available for testing`, MCPErrorCode.SERVICE_NOT_FOUND);
      }

      // Simple test operation
      const result = await registry.execute({
        service,
        operation: 'test',
        args: {},
      });

      res.json({
        service,
        status: 'success',
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}