import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config, serviceUrls } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError, TimeoutError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  connections: any;
  settings?: any;
  staticData?: any;
  tags?: string[];
}

interface N8NExecution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowData?: N8NWorkflow;
  data?: any;
}

interface N8NWebhook {
  httpMethod: string;
  path: string;
  webhookId: string;
  webhookDescription?: string;
  node: string;
  workflowId: string;
}

export class N8NHandler implements MCPHandler {
  private client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || serviceUrls.n8n;

    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'MCP-Gateway/1.0.0',
    };

    // Add API key if provided
    if (apiKey || config.N8N_API_KEY) {
      headers['X-N8N-API-KEY'] = apiKey || config.N8N_API_KEY;
    }

    this.client = axios.create({
      baseURL: `${this.baseUrl}/api/v1`,
      timeout: config.HTTP_TIMEOUT_MS,
      headers,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('N8N API request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('N8N request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('N8N API response', {
          status: response.status,
          dataPreview: JSON.stringify(response.data).substring(0, 200),
        });
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('N8N request timed out');
        }
        if (error.response) {
          logger.error('N8N API error response', {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          logger.error('N8N connection error', { error: error.message });
        }
        return Promise.reject(error);
      }
    );
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (params.operation) {
        case 'execute':
        case 'execute-workflow':
        case 'run':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Workflow ID required for execute operation');
          }
          const workflowId = params.args[0];
          const workflowData = params.args[1] ? this.parseJsonArg(params.args[1]) : {};
          result = await this.executeWorkflow(workflowId, workflowData);
          break;

        case 'list':
        case 'list-workflows':
          result = await this.listWorkflows(params.options);
          break;

        case 'get':
        case 'get-workflow':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Workflow ID required for get operation');
          }
          result = await this.getWorkflow(params.args[0]);
          break;

        case 'activate':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Workflow ID required for activate operation');
          }
          result = await this.activateWorkflow(params.args[0]);
          break;

        case 'deactivate':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Workflow ID required for deactivate operation');
          }
          result = await this.deactivateWorkflow(params.args[0]);
          break;

        case 'get-execution':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Execution ID required');
          }
          result = await this.getExecution(params.args[0]);
          break;

        case 'list-executions':
          const workflowIdForExecutions = params.args?.[0];
          result = await this.listExecutions(workflowIdForExecutions, params.options);
          break;

        case 'retry-execution':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Execution ID required for retry');
          }
          result = await this.retryExecution(params.args[0]);
          break;

        case 'delete-execution':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Execution ID required for deletion');
          }
          result = await this.deleteExecution(params.args[0]);
          break;

        case 'webhooks':
        case 'list-webhooks':
          result = await this.listWebhooks();
          break;

        case 'test-webhook':
          if (!params.args || params.args.length === 0) {
            throw new ValidationError('Webhook path required');
          }
          const webhookPath = params.args[0];
          const webhookData = params.args[1] ? this.parseJsonArg(params.args[1]) : {};
          result = await this.testWebhook(webhookPath, webhookData);
          break;

        case 'health':
        case 'test':
          result = await this.checkHealth();
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('n8n', params.operation, duration, 'success');
      recordTokenUsage('n8n', params.operation, 250); // Estimated tokens

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 250,
          cost: 0.0008,
          service: 'n8n',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('n8n', params.operation, duration, 'error');

      logger.error('N8N operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new ValidationError('Workflow or execution not found');
        }
        if (error.response?.status === 401) {
          throw new ValidationError('N8N authentication failed. Check API key.');
        }
        if (error.response?.status >= 500) {
          throw new ServiceUnavailableError('n8n', error.response?.data?.message || error.message);
        }
        throw new ValidationError(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  private parseJsonArg(arg: string): any {
    try {
      return JSON.parse(arg);
    } catch (error) {
      // If not valid JSON, treat as string
      return arg;
    }
  }

  private async executeWorkflow(workflowId: string, data: any): Promise<any> {
    const response = await this.client.post(`/executions/workflow/${workflowId}`, {
      workflowData: data,
    });

    const execution = response.data.data || response.data;

    return {
      operation: 'workflow_executed',
      workflowId,
      executionId: execution.id,
      status: execution.finished ? 'completed' : 'running',
      mode: execution.mode,
      startedAt: execution.startedAt,
      stoppedAt: execution.stoppedAt,
      data: execution.data,
      message: `Workflow ${workflowId} executed successfully`,
    };
  }

  private async listWorkflows(options?: any): Promise<any> {
    const params: any = {
      active: options?.active,
      limit: options?.limit || 100,
    };

    const response = await this.client.get('/workflows', { params });

    const workflows: N8NWorkflow[] = response.data.data || response.data || [];

    return {
      operation: 'list_workflows',
      total: workflows.length,
      workflows: workflows.map(w => ({
        id: w.id,
        name: w.name,
        active: w.active,
        nodeCount: w.nodes?.length || 0,
        tags: w.tags || [],
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
    };
  }

  private async getWorkflow(workflowId: string): Promise<any> {
    const response = await this.client.get(`/workflows/${workflowId}`);

    const workflow: N8NWorkflow = response.data.data || response.data;

    return {
      operation: 'get_workflow',
      workflow: {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
        tags: workflow.tags || [],
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      },
    };
  }

  private async activateWorkflow(workflowId: string): Promise<any> {
    const response = await this.client.patch(`/workflows/${workflowId}`, {
      active: true,
    });

    return {
      operation: 'workflow_activated',
      workflowId,
      active: true,
      message: `Workflow ${workflowId} activated successfully`,
    };
  }

  private async deactivateWorkflow(workflowId: string): Promise<any> {
    const response = await this.client.patch(`/workflows/${workflowId}`, {
      active: false,
    });

    return {
      operation: 'workflow_deactivated',
      workflowId,
      active: false,
      message: `Workflow ${workflowId} deactivated successfully`,
    };
  }

  private async getExecution(executionId: string): Promise<any> {
    const response = await this.client.get(`/executions/${executionId}`);

    const execution: N8NExecution = response.data.data || response.data;

    return {
      operation: 'get_execution',
      execution: {
        id: execution.id,
        workflowId: execution.workflowId,
        finished: execution.finished,
        mode: execution.mode,
        startedAt: execution.startedAt,
        stoppedAt: execution.stoppedAt,
        retryOf: execution.retryOf,
        retrySuccessId: execution.retrySuccessId,
        data: execution.data,
      },
    };
  }

  private async listExecutions(workflowId?: string, options?: any): Promise<any> {
    const params: any = {
      workflowId,
      limit: options?.limit || 20,
      status: options?.status,
    };

    const response = await this.client.get('/executions', { params });

    const executions: N8NExecution[] = response.data.data || response.data || [];

    return {
      operation: 'list_executions',
      total: executions.length,
      workflowId,
      executions: executions.map(e => ({
        id: e.id,
        workflowId: e.workflowId,
        finished: e.finished,
        mode: e.mode,
        startedAt: e.startedAt,
        stoppedAt: e.stoppedAt,
        duration: e.stoppedAt ?
          new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime() : null,
      })),
    };
  }

  private async retryExecution(executionId: string): Promise<any> {
    const response = await this.client.post(`/executions/${executionId}/retry`);

    const newExecution = response.data.data || response.data;

    return {
      operation: 'execution_retried',
      originalExecutionId: executionId,
      newExecutionId: newExecution.id,
      message: `Execution ${executionId} retried successfully`,
    };
  }

  private async deleteExecution(executionId: string): Promise<any> {
    await this.client.delete(`/executions/${executionId}`);

    return {
      operation: 'execution_deleted',
      executionId,
      message: `Execution ${executionId} deleted successfully`,
    };
  }

  private async listWebhooks(): Promise<any> {
    // N8N doesn't have a direct webhook list endpoint, so we get from workflows
    const workflowsResponse = await this.client.get('/workflows', { params: { active: true } });
    const workflows: N8NWorkflow[] = workflowsResponse.data.data || [];

    const webhooks: N8NWebhook[] = [];

    for (const workflow of workflows) {
      const webhookNodes = workflow.nodes.filter(n =>
        n.type === 'n8n-nodes-base.webhook' ||
        n.type === 'n8n-nodes-base.webhookTrigger'
      );

      for (const node of webhookNodes) {
        webhooks.push({
          httpMethod: node.parameters?.httpMethod || 'GET',
          path: node.parameters?.path || node.webhookPath || '',
          webhookId: node.webhookId || '',
          webhookDescription: node.parameters?.webhookDescription,
          node: node.name,
          workflowId: workflow.id,
        });
      }
    }

    return {
      operation: 'list_webhooks',
      total: webhooks.length,
      webhooks,
    };
  }

  private async testWebhook(path: string, data: any): Promise<any> {
    // Test webhook by calling it directly
    const webhookUrl = `${this.baseUrl}/webhook/${path}`;

    try {
      const response = await axios.post(webhookUrl, data, {
        timeout: 10000,
      });

      return {
        operation: 'webhook_tested',
        path,
        url: webhookUrl,
        status: response.status,
        data: response.data,
        message: 'Webhook test successful',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          operation: 'webhook_test_failed',
          path,
          url: webhookUrl,
          status: error.response?.status || 0,
          error: error.response?.data || error.message,
          message: 'Webhook test failed',
        };
      }
      throw error;
    }
  }

  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();

      // N8N doesn't have a standard health endpoint, so we check workflow list
      const response = await this.client.get('/workflows', {
        params: { limit: 1 },
        timeout: 5000,
      });

      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'n8n',
        endpoint: this.baseUrl,
        latency: `${latency}ms`,
        version: response.headers['n8n-version'] || 'unknown',
        authenticated: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'n8n',
        endpoint: this.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        authenticated: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  public validateParams(params: MCPParams): void {
    if (!params.operation) {
      throw new ValidationError('Operation parameter is required');
    }

    const validOperations = this.getCapabilities().map(c => c.name);
    if (!validOperations.includes(params.operation)) {
      throw new ValidationError(
        `Invalid operation. Allowed: ${validOperations.join(', ')}`
      );
    }
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'execute',
        description: 'Execute a workflow',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'ID of the workflow to execute',
            required: true,
          },
          {
            name: 'data',
            type: 'object',
            description: 'Input data for the workflow',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'list-workflows',
        description: 'List all workflows',
        parameters: [
          {
            name: 'active',
            type: 'boolean',
            description: 'Filter by active status',
            required: false,
          },
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum number of workflows',
            required: false,
            default: 100,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'get-workflow',
        description: 'Get workflow details',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'ID of the workflow',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'activate',
        description: 'Activate a workflow',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'ID of the workflow to activate',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'deactivate',
        description: 'Deactivate a workflow',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'ID of the workflow to deactivate',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'get-execution',
        description: 'Get execution details',
        parameters: [
          {
            name: 'executionId',
            type: 'string',
            description: 'ID of the execution',
            required: true,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'list-executions',
        description: 'List workflow executions',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'Filter by workflow ID',
            required: false,
          },
          {
            name: 'limit',
            type: 'number',
            description: 'Maximum number of executions',
            required: false,
            default: 20,
          },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'list-webhooks',
        description: 'List all webhook endpoints',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'test-webhook',
        description: 'Test a webhook endpoint',
        parameters: [
          {
            name: 'path',
            type: 'string',
            description: 'Webhook path',
            required: true,
          },
          {
            name: 'data',
            type: 'object',
            description: 'Test data to send',
            required: false,
          },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'health',
        description: 'Check N8N service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down N8N handler...');
    // No persistent connections to close for HTTP client
  }
}