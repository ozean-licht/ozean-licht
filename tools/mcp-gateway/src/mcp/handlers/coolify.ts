import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface CoolifyApplication {
  id: number;
  name: string;
  fqdn?: string;
  git_repository?: string;
  git_branch?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface CoolifyDatabase {
  id: number;
  name: string;
  type: string;
  version?: string;
  status?: string;
  public_port?: number;
}

interface CoolifyServer {
  id: number;
  name: string;
  ip?: string;
  port?: number;
  user?: string;
  status?: string;
}

export class CoolifyHandler implements MCPHandler {
  private client: AxiosInstance;
  private readonly apiUrl: string;

  constructor() {
    if (!config.COOLIFY_API_TOKEN) {
      throw new Error('COOLIFY_API_TOKEN not configured');
    }

    this.apiUrl = config.COOLIFY_API_URL || 'http://localhost:8000';

    this.client = axios.create({
      baseURL: `${this.apiUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${config.COOLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30s timeout for deployment operations
    });

    logger.info('Coolify handler initialized', { apiUrl: this.apiUrl });
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (params.operation) {
        // Application operations
        case 'list-applications':
        case 'list_applications':
          result = await this.listApplications(params.options);
          break;

        case 'get-application':
        case 'get_application':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Application ID required for get-application operation');
          }
          result = await this.getApplication(params.args[0]);
          break;

        case 'deploy-application':
        case 'deploy_application':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Application ID required for deploy-application operation');
          }
          result = await this.deployApplication(params.args[0], params.options);
          break;

        case 'start-application':
        case 'start_application':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Application ID required for start-application operation');
          }
          result = await this.startApplication(params.args[0]);
          break;

        case 'stop-application':
        case 'stop_application':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Application ID required for stop-application operation');
          }
          result = await this.stopApplication(params.args[0]);
          break;

        case 'restart-application':
        case 'restart_application':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Application ID required for restart-application operation');
          }
          result = await this.restartApplication(params.args[0]);
          break;

        // Database operations
        case 'list-databases':
        case 'list_databases':
          result = await this.listDatabases(params.options);
          break;

        case 'create-database':
        case 'create_database':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Database configuration required for create-database operation');
          }
          result = await this.createDatabase(params.args[0]);
          break;

        // Server operations
        case 'list-servers':
        case 'list_servers':
          result = await this.listServers(params.options);
          break;

        case 'create-server':
        case 'create_server':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Server configuration required for create-server operation');
          }
          result = await this.createServer(params.args[0]);
          break;

        case 'validate-server':
        case 'validate_server':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Server ID required for validate-server operation');
          }
          result = await this.validateServer(params.args[0]);
          break;

        // Project operations
        case 'list-projects':
        case 'list_projects':
          result = await this.listProjects(params.options);
          break;

        case 'create-project':
        case 'create_project':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Project data required for create-project operation');
          }
          result = await this.createProject(params.args[0]);
          break;

        // Service operations
        case 'list-services':
        case 'list_services':
          result = await this.listServices(params.options);
          break;

        case 'start-service':
        case 'start_service':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Service ID required for start-service operation');
          }
          result = await this.startService(params.args[0]);
          break;

        case 'stop-service':
        case 'stop_service':
          if (!params.args || params.args.length < 1) {
            throw new ValidationError('Service ID required for stop-service operation');
          }
          result = await this.stopService(params.args[0]);
          break;

        // System operations
        case 'get-version':
        case 'get_version':
        case 'version':
          result = await this.getVersion();
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
      recordMCPOperation('coolify', params.operation, duration, 'success');
      recordTokenUsage('coolify', params.operation, 200);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 200,
          cost: 0.0006,
          service: 'coolify',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('coolify', params.operation, duration, 'error');

      logger.error('Coolify operation failed', {
        operation: params.operation,
        error,
      });

      // Handle axios errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new ValidationError('Resource not found - check application/database/server ID');
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new ValidationError('Authentication failed - check COOLIFY_API_TOKEN');
        }
        if (error.response?.status && error.response.status >= 500) {
          throw new ServiceUnavailableError('coolify', error.message);
        }
        throw new ValidationError(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  // Application Operations
  private async listApplications(options?: any): Promise<any> {
    const response = await this.client.get('/applications', {
      params: {
        page: options?.page || 1,
        per_page: options?.limit || 50,
      },
    });

    const applications = Array.isArray(response.data) ? response.data : response.data.data || [];

    return {
      operation: 'list_applications',
      count: applications.length,
      applications: applications.map((app: any) => ({
        id: app.id,
        name: app.name,
        fqdn: app.fqdn,
        git_repository: app.git_repository,
        git_branch: app.git_branch,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
      })),
    };
  }

  private async getApplication(appId: string): Promise<any> {
    const response = await this.client.get(`/applications/${appId}`);

    const app = response.data.data || response.data;

    return {
      operation: 'get_application',
      application: {
        id: app.id,
        name: app.name,
        description: app.description,
        fqdn: app.fqdn,
        git_repository: app.git_repository,
        git_branch: app.git_branch,
        git_commit_sha: app.git_commit_sha,
        docker_compose_location: app.docker_compose_location,
        build_pack: app.build_pack,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        environment: app.environment || {},
      },
    };
  }

  private async deployApplication(appId: string, options?: any): Promise<any> {
    const response = await this.client.post(`/applications/${appId}/deploy`, {
      force_rebuild: options?.force_rebuild || false,
    });

    return {
      operation: 'deploy_application',
      application_id: appId,
      deployment_id: response.data.deployment_id || response.data.id,
      status: response.data.status || 'queued',
      message: 'Deployment triggered successfully',
    };
  }

  private async startApplication(appId: string): Promise<any> {
    const response = await this.client.post(`/applications/${appId}/start`);

    return {
      operation: 'start_application',
      application_id: appId,
      status: response.data.status || 'starting',
      message: 'Application start initiated',
    };
  }

  private async stopApplication(appId: string): Promise<any> {
    const response = await this.client.post(`/applications/${appId}/stop`);

    return {
      operation: 'stop_application',
      application_id: appId,
      status: response.data.status || 'stopped',
      message: 'Application stopped successfully',
    };
  }

  private async restartApplication(appId: string): Promise<any> {
    const response = await this.client.post(`/applications/${appId}/restart`);

    return {
      operation: 'restart_application',
      application_id: appId,
      status: response.data.status || 'restarting',
      message: 'Application restart initiated',
    };
  }

  // Database Operations
  private async listDatabases(options?: any): Promise<any> {
    const response = await this.client.get('/databases', {
      params: {
        page: options?.page || 1,
        per_page: options?.limit || 50,
      },
    });

    const databases = Array.isArray(response.data) ? response.data : response.data.data || [];

    return {
      operation: 'list_databases',
      count: databases.length,
      databases: databases.map((db: any) => ({
        id: db.id,
        name: db.name,
        type: db.type,
        version: db.version,
        status: db.status,
        public_port: db.public_port,
        created_at: db.created_at,
      })),
    };
  }

  private async createDatabase(dbData: any): Promise<any> {
    const response = await this.client.post('/databases', {
      name: dbData.name,
      type: dbData.type || 'postgresql',
      version: dbData.version,
      project_id: dbData.project_id,
      environment_id: dbData.environment_id,
    });

    const db = response.data.data || response.data;

    return {
      operation: 'create_database',
      database: {
        id: db.id,
        name: db.name,
        type: db.type,
        status: db.status,
        connection_string: db.connection_string,
      },
      message: 'Database created successfully',
    };
  }

  // Server Operations
  private async listServers(options?: any): Promise<any> {
    const response = await this.client.get('/servers', {
      params: {
        page: options?.page || 1,
        per_page: options?.limit || 50,
      },
    });

    const servers = Array.isArray(response.data) ? response.data : response.data.data || [];

    return {
      operation: 'list_servers',
      count: servers.length,
      servers: servers.map((server: any) => ({
        id: server.id,
        name: server.name,
        ip: server.ip,
        port: server.port,
        user: server.user,
        status: server.status,
        created_at: server.created_at,
      })),
    };
  }

  private async createServer(serverData: any): Promise<any> {
    const response = await this.client.post('/servers', {
      name: serverData.name,
      ip: serverData.ip,
      port: serverData.port || 22,
      user: serverData.user || 'root',
      private_key: serverData.private_key,
    });

    const server = response.data.data || response.data;

    return {
      operation: 'create_server',
      server: {
        id: server.id,
        name: server.name,
        ip: server.ip,
        status: server.status,
      },
      message: 'Server created successfully',
    };
  }

  private async validateServer(serverId: string): Promise<any> {
    const response = await this.client.post(`/servers/${serverId}/validate`);

    return {
      operation: 'validate_server',
      server_id: serverId,
      valid: response.data.valid || true,
      status: response.data.status,
      message: response.data.message || 'Server connection validated',
    };
  }

  // Project Operations
  private async listProjects(options?: any): Promise<any> {
    const response = await this.client.get('/projects', {
      params: {
        page: options?.page || 1,
        per_page: options?.limit || 50,
      },
    });

    const projects = Array.isArray(response.data) ? response.data : response.data.data || [];

    return {
      operation: 'list_projects',
      count: projects.length,
      projects: projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        created_at: project.created_at,
      })),
    };
  }

  private async createProject(projectData: any): Promise<any> {
    const response = await this.client.post('/projects', {
      name: projectData.name,
      description: projectData.description || '',
    });

    const project = response.data.data || response.data;

    return {
      operation: 'create_project',
      project: {
        id: project.id,
        name: project.name,
      },
      message: 'Project created successfully',
    };
  }

  // Service Operations
  private async listServices(options?: any): Promise<any> {
    const response = await this.client.get('/services', {
      params: {
        page: options?.page || 1,
        per_page: options?.limit || 50,
      },
    });

    const services = Array.isArray(response.data) ? response.data : response.data.data || [];

    return {
      operation: 'list_services',
      count: services.length,
      services: services.map((service: any) => ({
        id: service.id,
        name: service.name,
        type: service.type,
        status: service.status,
        created_at: service.created_at,
      })),
    };
  }

  private async startService(serviceId: string): Promise<any> {
    const response = await this.client.post(`/services/${serviceId}/start`);

    return {
      operation: 'start_service',
      service_id: serviceId,
      status: response.data.status || 'starting',
      message: 'Service start initiated',
    };
  }

  private async stopService(serviceId: string): Promise<any> {
    const response = await this.client.post(`/services/${serviceId}/stop`);

    return {
      operation: 'stop_service',
      service_id: serviceId,
      status: response.data.status || 'stopped',
      message: 'Service stopped successfully',
    };
  }

  // System Operations
  private async getVersion(): Promise<any> {
    const response = await this.client.get('/version');

    return {
      operation: 'get_version',
      version: response.data.version || response.data,
      api_version: response.data.api_version,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();
      const response = await this.client.get('/version');
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'coolify',
        latency: `${latency}ms`,
        version: response.data.version,
        api_url: this.apiUrl,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'coolify',
        error: error instanceof Error ? error.message : 'Unknown error',
        api_url: this.apiUrl,
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
      // Application capabilities
      {
        name: 'list-applications',
        description: 'List all applications with status and metadata',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'get-application',
        description: 'Get detailed information about a specific application',
        parameters: [
          { name: 'appId', type: 'string', description: 'Application ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'deploy-application',
        description: 'Trigger deployment for an application (pulls latest code)',
        parameters: [
          { name: 'appId', type: 'string', description: 'Application ID', required: true },
          { name: 'force_rebuild', type: 'boolean', description: 'Force rebuild', required: false, default: false },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'start-application',
        description: 'Start a stopped application',
        parameters: [
          { name: 'appId', type: 'string', description: 'Application ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'stop-application',
        description: 'Stop a running application',
        parameters: [
          { name: 'appId', type: 'string', description: 'Application ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'restart-application',
        description: 'Restart an application (stop → start)',
        parameters: [
          { name: 'appId', type: 'string', description: 'Application ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // Database capabilities
      {
        name: 'list-databases',
        description: 'List all databases with connection information',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'create-database',
        description: 'Create a new database instance',
        parameters: [
          { name: 'dbData', type: 'object', description: 'Database configuration', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      // Server capabilities
      {
        name: 'list-servers',
        description: 'List all connected servers',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'create-server',
        description: 'Add a new server to Coolify',
        parameters: [
          { name: 'serverData', type: 'object', description: 'Server configuration', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'validate-server',
        description: 'Test server connection',
        parameters: [
          { name: 'serverId', type: 'string', description: 'Server ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 150,
      },
      // Project capabilities
      {
        name: 'list-projects',
        description: 'List all projects',
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'create-project',
        description: 'Create a new project',
        parameters: [
          { name: 'projectData', type: 'object', description: 'Project configuration', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // Service capabilities
      {
        name: 'list-services',
        description: 'List all services',
        requiresAuth: true,
        tokenCost: 150,
      },
      {
        name: 'start-service',
        description: 'Start a service',
        parameters: [
          { name: 'serviceId', type: 'string', description: 'Service ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'stop-service',
        description: 'Stop a service',
        parameters: [
          { name: 'serviceId', type: 'string', description: 'Service ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      // System capabilities
      {
        name: 'get-version',
        description: 'Get Coolify version information',
        requiresAuth: false,
        tokenCost: 50,
      },
      {
        name: 'health',
        description: 'Check Coolify service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Coolify handler...');
    // No persistent connections to close (axios handles connection pooling)
  }
}
