import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { ValidationError, ServiceUnavailableError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

interface AirtableTableMetadata {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    options?: Record<string, any>;
  }>;
  views: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface AirtableBaseMetadata {
  tables: AirtableTableMetadata[];
}

export class AirtableHandler implements MCPHandler {
  private client: AxiosInstance;
  private metaClient: AxiosInstance;
  private readonly baseId: string;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';

    if (!this.apiKey) {
      logger.warn('Airtable API key not configured - service will be limited');
    }

    if (!this.baseId) {
      logger.warn('Airtable Base ID not configured - service will be limited');
    }

    // Main API client for record operations
    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      timeout: parseInt(process.env.HTTP_TIMEOUT_MS || '30000'),
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Metadata API client for schema operations
    this.metaClient = axios.create({
      baseURL: 'https://api.airtable.com/v0/meta',
      timeout: parseInt(process.env.HTTP_TIMEOUT_MS || '30000'),
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info('Airtable handler initialized', {
      hasApiKey: !!this.apiKey,
      hasBaseId: !!this.baseId
    });
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      this.validateConfig();

      let result: any;

      switch (params.operation) {
        case 'list-bases':
          result = await this.listBases();
          break;

        case 'list-tables':
          result = await this.listTables(params.args?.baseId);
          break;

        case 'get-table-schema':
          if (!params.args?.tableName) {
            throw new ValidationError('Table name required for get-table-schema operation');
          }
          result = await this.getTableSchema(params.args.tableName, params.args?.baseId);
          break;

        case 'read-records':
        case 'get-records':
          if (!params.args?.tableName) {
            throw new ValidationError('Table name required for read-records operation');
          }
          result = await this.readRecords(
            params.args.tableName,
            {
              maxRecords: params.options?.limit || 100,
              offset: params.args?.offset,
              filterByFormula: params.args?.filter,
              sort: params.args?.sort,
              fields: params.args?.fields,
              view: params.args?.view,
              baseId: params.args?.baseId,
            }
          );
          break;

        case 'get-record':
          if (!params.args?.tableName || !params.args?.recordId) {
            throw new ValidationError('Table name and record ID required for get-record operation');
          }
          result = await this.getRecord(
            params.args.tableName,
            params.args.recordId,
            params.args?.baseId
          );
          break;

        case 'create-record':
          if (!params.args?.tableName || !params.args?.fields) {
            throw new ValidationError('Table name and fields required for create-record operation');
          }
          result = await this.createRecord(
            params.args.tableName,
            params.args.fields,
            params.args?.baseId
          );
          break;

        case 'create-records':
          if (!params.args?.tableName || !params.args?.records) {
            throw new ValidationError('Table name and records array required for create-records operation');
          }
          result = await this.createRecords(
            params.args.tableName,
            params.args.records,
            params.args?.baseId
          );
          break;

        case 'update-record':
          if (!params.args?.tableName || !params.args?.recordId || !params.args?.fields) {
            throw new ValidationError('Table name, record ID, and fields required for update-record operation');
          }
          result = await this.updateRecord(
            params.args.tableName,
            params.args.recordId,
            params.args.fields,
            params.args?.baseId
          );
          break;

        case 'update-records':
          if (!params.args?.tableName || !params.args?.records) {
            throw new ValidationError('Table name and records array required for update-records operation');
          }
          result = await this.updateRecords(
            params.args.tableName,
            params.args.records,
            params.args?.baseId
          );
          break;

        case 'delete-record':
          if (!params.args?.tableName || !params.args?.recordId) {
            throw new ValidationError('Table name and record ID required for delete-record operation');
          }
          result = await this.deleteRecord(
            params.args.tableName,
            params.args.recordId,
            params.args?.baseId
          );
          break;

        case 'delete-records':
          if (!params.args?.tableName || !params.args?.recordIds) {
            throw new ValidationError('Table name and record IDs array required for delete-records operation');
          }
          result = await this.deleteRecords(
            params.args.tableName,
            params.args.recordIds,
            params.args?.baseId
          );
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
      recordMCPOperation('airtable', params.operation, duration, 'success');
      recordTokenUsage('airtable', params.operation, 300);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 300,
          cost: 0.0009,
          service: 'airtable',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('airtable', params.operation, duration, 'error');

      logger.error('Airtable operation failed', {
        operation: params.operation,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  private validateConfig(): void {
    if (!this.apiKey) {
      throw new ServiceUnavailableError('Airtable API key not configured');
    }
    if (!this.baseId) {
      throw new ServiceUnavailableError('Airtable Base ID not configured');
    }
  }

  private async listBases(): Promise<any> {
    try {
      const response = await this.metaClient.get('/bases');
      return {
        operation: 'list_bases',
        bases: response.data.bases.map((base: any) => ({
          id: base.id,
          name: base.name,
          permissionLevel: base.permissionLevel,
        })),
        totalBases: response.data.bases.length,
      };
    } catch (error) {
      this.handleApiError(error, 'list-bases');
    }
  }

  private async listTables(baseId?: string): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      const response = await this.metaClient.get(`/bases/${targetBaseId}/tables`);
      const metadata = response.data as AirtableBaseMetadata;

      return {
        operation: 'list_tables',
        baseId: targetBaseId,
        tables: metadata.tables.map((table) => ({
          id: table.id,
          name: table.name,
          primaryFieldId: table.primaryFieldId,
          fieldCount: table.fields.length,
          viewCount: table.views?.length || 0,
        })),
        totalTables: metadata.tables.length,
      };
    } catch (error) {
      this.handleApiError(error, 'list-tables');
    }
  }

  private async getTableSchema(tableName: string, baseId?: string): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      const response = await this.metaClient.get(`/bases/${targetBaseId}/tables`);
      const metadata = response.data as AirtableBaseMetadata;

      const table = metadata.tables.find(
        (t) => t.name === tableName || t.id === tableName
      );

      if (!table) {
        throw new ValidationError(`Table '${tableName}' not found in base`);
      }

      return {
        operation: 'get_table_schema',
        table: {
          id: table.id,
          name: table.name,
          primaryFieldId: table.primaryFieldId,
          fields: table.fields.map((field) => ({
            id: field.id,
            name: field.name,
            type: field.type,
            options: field.options,
          })),
          views: table.views?.map((view) => ({
            id: view.id,
            name: view.name,
            type: view.type,
          })),
        },
      };
    } catch (error) {
      this.handleApiError(error, 'get-table-schema');
    }
  }

  private async readRecords(
    tableName: string,
    options: {
      maxRecords?: number;
      offset?: string;
      filterByFormula?: string;
      sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
      fields?: string[];
      view?: string;
      baseId?: string;
    }
  ): Promise<any> {
    const targetBaseId = options.baseId || this.baseId;

    try {
      const params: Record<string, any> = {};

      if (options.maxRecords) params.maxRecords = options.maxRecords;
      if (options.offset) params.offset = options.offset;
      if (options.filterByFormula) params.filterByFormula = options.filterByFormula;
      if (options.view) params.view = options.view;
      if (options.fields) params['fields[]'] = options.fields;
      if (options.sort) {
        options.sort.forEach((s, i) => {
          params[`sort[${i}][field]`] = s.field;
          params[`sort[${i}][direction]`] = s.direction;
        });
      }

      const response = await this.client.get<AirtableListResponse>(
        `/${targetBaseId}/${encodeURIComponent(tableName)}`,
        { params }
      );

      return {
        operation: 'read_records',
        table: tableName,
        recordCount: response.data.records.length,
        records: response.data.records.map((record) => ({
          id: record.id,
          fields: record.fields,
          createdTime: record.createdTime,
        })),
        offset: response.data.offset,
        hasMore: !!response.data.offset,
      };
    } catch (error) {
      this.handleApiError(error, 'read-records');
    }
  }

  private async getRecord(
    tableName: string,
    recordId: string,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      const response = await this.client.get<AirtableRecord>(
        `/${targetBaseId}/${encodeURIComponent(tableName)}/${recordId}`
      );

      return {
        operation: 'get_record',
        table: tableName,
        record: {
          id: response.data.id,
          fields: response.data.fields,
          createdTime: response.data.createdTime,
        },
      };
    } catch (error) {
      this.handleApiError(error, 'get-record');
    }
  }

  private async createRecord(
    tableName: string,
    fields: Record<string, any>,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      const response = await this.client.post<AirtableRecord>(
        `/${targetBaseId}/${encodeURIComponent(tableName)}`,
        { fields }
      );

      return {
        operation: 'record_created',
        table: tableName,
        record: {
          id: response.data.id,
          fields: response.data.fields,
          createdTime: response.data.createdTime,
        },
      };
    } catch (error) {
      this.handleApiError(error, 'create-record');
    }
  }

  private async createRecords(
    tableName: string,
    records: Array<{ fields: Record<string, any> }>,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    // Airtable allows max 10 records per request
    const batches: Array<Array<{ fields: Record<string, any> }>> = [];
    for (let i = 0; i < records.length; i += 10) {
      batches.push(records.slice(i, i + 10));
    }

    const results: AirtableRecord[] = [];

    try {
      for (const batch of batches) {
        const response = await this.client.post<{ records: AirtableRecord[] }>(
          `/${targetBaseId}/${encodeURIComponent(tableName)}`,
          { records: batch }
        );
        results.push(...response.data.records);

        // Rate limit: 5 requests per second
        if (batches.length > 1) {
          await this.sleep(200);
        }
      }

      return {
        operation: 'records_created',
        table: tableName,
        recordCount: results.length,
        records: results.map((record) => ({
          id: record.id,
          fields: record.fields,
          createdTime: record.createdTime,
        })),
      };
    } catch (error) {
      this.handleApiError(error, 'create-records');
    }
  }

  private async updateRecord(
    tableName: string,
    recordId: string,
    fields: Record<string, any>,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      const response = await this.client.patch<AirtableRecord>(
        `/${targetBaseId}/${encodeURIComponent(tableName)}/${recordId}`,
        { fields }
      );

      return {
        operation: 'record_updated',
        table: tableName,
        record: {
          id: response.data.id,
          fields: response.data.fields,
          createdTime: response.data.createdTime,
        },
      };
    } catch (error) {
      this.handleApiError(error, 'update-record');
    }
  }

  private async updateRecords(
    tableName: string,
    records: Array<{ id: string; fields: Record<string, any> }>,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    // Airtable allows max 10 records per request
    const batches: Array<Array<{ id: string; fields: Record<string, any> }>> = [];
    for (let i = 0; i < records.length; i += 10) {
      batches.push(records.slice(i, i + 10));
    }

    const results: AirtableRecord[] = [];

    try {
      for (const batch of batches) {
        const response = await this.client.patch<{ records: AirtableRecord[] }>(
          `/${targetBaseId}/${encodeURIComponent(tableName)}`,
          { records: batch }
        );
        results.push(...response.data.records);

        // Rate limit: 5 requests per second
        if (batches.length > 1) {
          await this.sleep(200);
        }
      }

      return {
        operation: 'records_updated',
        table: tableName,
        recordCount: results.length,
        records: results.map((record) => ({
          id: record.id,
          fields: record.fields,
          createdTime: record.createdTime,
        })),
      };
    } catch (error) {
      this.handleApiError(error, 'update-records');
    }
  }

  private async deleteRecord(
    tableName: string,
    recordId: string,
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    try {
      await this.client.delete(
        `/${targetBaseId}/${encodeURIComponent(tableName)}/${recordId}`
      );

      return {
        operation: 'record_deleted',
        table: tableName,
        recordId,
        message: 'Record deleted successfully',
      };
    } catch (error) {
      this.handleApiError(error, 'delete-record');
    }
  }

  private async deleteRecords(
    tableName: string,
    recordIds: string[],
    baseId?: string
  ): Promise<any> {
    const targetBaseId = baseId || this.baseId;

    // Airtable allows max 10 records per request
    const batches: string[][] = [];
    for (let i = 0; i < recordIds.length; i += 10) {
      batches.push(recordIds.slice(i, i + 10));
    }

    const deletedIds: string[] = [];

    try {
      for (const batch of batches) {
        const params = new URLSearchParams();
        batch.forEach((id) => params.append('records[]', id));

        await this.client.delete(
          `/${targetBaseId}/${encodeURIComponent(tableName)}?${params.toString()}`
        );
        deletedIds.push(...batch);

        // Rate limit: 5 requests per second
        if (batches.length > 1) {
          await this.sleep(200);
        }
      }

      return {
        operation: 'records_deleted',
        table: tableName,
        deletedCount: deletedIds.length,
        recordIds: deletedIds,
        message: 'Records deleted successfully',
      };
    } catch (error) {
      this.handleApiError(error, 'delete-records');
    }
  }

  private async checkHealth(): Promise<any> {
    try {
      if (!this.apiKey || !this.baseId) {
        return {
          status: 'unconfigured',
          service: 'airtable',
          message: 'Airtable API key or Base ID not configured',
          timestamp: new Date().toISOString(),
        };
      }

      const startTime = Date.now();
      await this.metaClient.get(`/bases/${this.baseId}/tables`);
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'airtable',
        baseId: this.baseId,
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'airtable',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private handleApiError(error: any, operation: string): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;

      if (status === 401) {
        throw new ValidationError('Invalid Airtable API key');
      }
      if (status === 403) {
        throw new ValidationError('Access denied to Airtable base');
      }
      if (status === 404) {
        throw new ValidationError('Airtable resource not found');
      }
      if (status === 422) {
        throw new ValidationError(`Airtable validation error: ${message}`);
      }
      if (status === 429) {
        throw new ServiceUnavailableError('Airtable rate limit exceeded');
      }

      throw new ServiceUnavailableError(`Airtable API error: ${message}`);
    }

    throw error;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'list-bases',
        description: 'List all accessible Airtable bases',
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'list-tables',
        description: 'List all tables in an Airtable base',
        parameters: [
          { name: 'baseId', type: 'string', description: 'Base ID (optional, uses default)', required: false },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'get-table-schema',
        description: 'Get detailed schema for a specific table',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name or ID', required: true },
          { name: 'baseId', type: 'string', description: 'Base ID (optional)', required: false },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'read-records',
        description: 'Read records from a table with filtering and sorting',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name or ID', required: true },
          { name: 'maxRecords', type: 'number', description: 'Max records to return (default: 100)', required: false },
          { name: 'filter', type: 'string', description: 'Airtable formula filter', required: false },
          { name: 'sort', type: 'array', description: 'Sort configuration', required: false },
          { name: 'fields', type: 'array', description: 'Fields to return', required: false },
          { name: 'view', type: 'string', description: 'View name or ID', required: false },
          { name: 'offset', type: 'string', description: 'Pagination offset', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'get-record',
        description: 'Get a single record by ID',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'recordId', type: 'string', description: 'Record ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'create-record',
        description: 'Create a new record',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'fields', type: 'object', description: 'Record fields', required: true },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      {
        name: 'create-records',
        description: 'Create multiple records (batch)',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'records', type: 'array', description: 'Array of {fields} objects', required: true },
        ],
        requiresAuth: true,
        tokenCost: 500,
      },
      {
        name: 'update-record',
        description: 'Update an existing record',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'recordId', type: 'string', description: 'Record ID', required: true },
          { name: 'fields', type: 'object', description: 'Fields to update', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'update-records',
        description: 'Update multiple records (batch)',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'records', type: 'array', description: 'Array of {id, fields} objects', required: true },
        ],
        requiresAuth: true,
        tokenCost: 450,
      },
      {
        name: 'delete-record',
        description: 'Delete a record',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'recordId', type: 'string', description: 'Record ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 250,
      },
      {
        name: 'delete-records',
        description: 'Delete multiple records (batch)',
        parameters: [
          { name: 'tableName', type: 'string', description: 'Table name', required: true },
          { name: 'recordIds', type: 'array', description: 'Array of record IDs', required: true },
        ],
        requiresAuth: true,
        tokenCost: 400,
      },
      {
        name: 'health',
        description: 'Check Airtable service health',
        requiresAuth: false,
        tokenCost: 50,
      },
    ];
  }

  public validateParams(params: MCPParams): void {
    if (!params.operation) {
      throw new ValidationError('Operation is required');
    }

    const validOperations = this.getCapabilities().map((c) => c.name);
    if (!validOperations.includes(params.operation)) {
      throw new ValidationError(`Invalid operation: ${params.operation}. Valid operations: ${validOperations.join(', ')}`);
    }
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Airtable handler...');
    // HTTP client automatically cleaned up
  }
}
