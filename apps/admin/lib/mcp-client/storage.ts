/**
 * MCP Storage Client
 * Provides type-safe storage operations via MCP Gateway (MinIO integration)
 */

import fetch from 'node-fetch';
import { randomUUID } from 'crypto';
import { MCPClientConfig, ResolvedMCPClientConfig, resolveConfig } from './config';
import { MCPRequest, MCPResponse } from '../../types/mcp';
import {
  MCPError,
  MCPTimeoutError,
  MCPConnectionError,
  parseError,
} from './errors';
import {
  UploadFileInput,
  UploadFileResult,
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  GetFileUrlResult,
  DeleteFileInput,
  DeleteFileResult,
  StatFileInput,
  StatFileResult,
  StorageMetadata,
  StorageMetadataRow,
  StorageMetadataFilters,
  StorageStats,
  StorageHealthStatus,
  EntityScope,
  FileStatus,
} from '../../types/storage';

/**
 * MCP Storage Client
 * Handles file operations through MinIO MCP service and metadata tracking in PostgreSQL
 */
export class MCPStorageClient {
  private readonly config: ResolvedMCPClientConfig;

  constructor(config: MCPClientConfig) {
    this.config = resolveConfig(config);
  }

  /**
   * Upload file to MinIO bucket
   * Automatically creates metadata record in database
   */
  async uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
    // Validate required fields
    if (!input.bucket || !input.fileKey || !input.fileBuffer || !input.contentType || !input.metadata) {
      throw new MCPError(-32602, 'Missing required fields: bucket, fileKey, fileBuffer, contentType, and metadata are required');
    }

    // Validate entity scope
    const validScopes: EntityScope[] = ['kids_ascension', 'ozean_licht', 'shared'];
    if (!validScopes.includes(input.metadata.entityScope)) {
      throw new MCPError(-32602, `Invalid entity scope: ${input.metadata.entityScope}. Must be one of: ${validScopes.join(', ')}`);
    }

    // Upload to MinIO
    const uploadResult = await this._minioRequest<UploadFileResult>('upload', {
      bucket: input.bucket,
      fileKey: input.fileKey,
      fileBuffer: input.fileBuffer.toString('base64'),
      contentType: input.contentType,
      metadata: input.metadata,
    });

    // Create metadata record in database
    await this._createStorageMetadata({
      fileKey: input.fileKey,
      bucketName: input.bucket,
      originalFilename: input.metadata.originalFilename,
      contentType: input.contentType,
      fileSizeBytes: input.fileBuffer.length,
      checksumMd5: uploadResult.checksumMd5,
      entityScope: input.metadata.entityScope,
      uploadedBy: input.metadata.uploadedBy,
      tags: input.metadata.tags || [],
      metadata: input.metadata.customMetadata || {},
    });

    return uploadResult;
  }

  /**
   * List files in bucket
   */
  async listFiles(input: ListFilesInput): Promise<ListFilesResult> {
    return this._minioRequest<ListFilesResult>('list', input);
  }

  /**
   * Get presigned URL for file
   */
  async getFileUrl(input: GetFileUrlInput): Promise<GetFileUrlResult> {
    // Validate required fields
    if (!input.bucket || !input.fileKey) {
      throw new MCPError(-32602, 'Missing required fields: bucket and fileKey are required');
    }

    return this._minioRequest<GetFileUrlResult>('getUrl', input);
  }

  /**
   * Delete file from bucket
   * Performs soft delete in metadata table
   */
  async deleteFile(input: DeleteFileInput): Promise<DeleteFileResult> {
    // Validate required fields
    if (!input.bucket || !input.fileKey) {
      throw new MCPError(-32602, 'Missing required fields: bucket and fileKey are required');
    }

    // Delete from MinIO
    const deleteResult = await this._minioRequest<DeleteFileResult>('delete', input);

    // Soft delete in metadata table
    await this._dbQuery(
      `UPDATE admin_storage_metadata
       SET status = 'deleted', deleted_at = NOW()
       WHERE file_key = $1 AND bucket_name = $2`,
      [input.fileKey, input.bucket]
    );

    return deleteResult;
  }

  /**
   * Get file metadata from MinIO
   */
  async statFile(input: StatFileInput): Promise<StatFileResult> {
    return this._minioRequest<StatFileResult>('stat', input);
  }

  /**
   * List storage metadata with filters
   */
  async listStorageMetadata(filters: StorageMetadataFilters = {}): Promise<StorageMetadata[]> {
    let query = 'SELECT * FROM admin_storage_metadata WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.bucketName) {
      query += ` AND bucket_name = $${paramCount++}`;
      params.push(filters.bucketName);
    }

    if (filters.entityScope) {
      query += ` AND entity_scope = $${paramCount++}`;
      params.push(filters.entityScope);
    }

    if (filters.uploadedBy) {
      query += ` AND uploaded_by = $${paramCount++}`;
      params.push(filters.uploadedBy);
    }

    if (filters.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters.startDate) {
      query += ` AND uploaded_at >= $${paramCount++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND uploaded_at <= $${paramCount++}`;
      params.push(filters.endDate);
    }

    if (filters.tags && filters.tags.length > 0) {
      query += ` AND tags && $${paramCount++}::text[]`;
      params.push(filters.tags);
    }

    if (filters.searchQuery) {
      query += ` AND (original_filename ILIKE $${paramCount++} OR file_key ILIKE $${paramCount})`;
      params.push(`%${filters.searchQuery}%`, `%${filters.searchQuery}%`);
      paramCount += 2;
    }

    query += ' ORDER BY uploaded_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const rows = await this._dbQuery<StorageMetadataRow>(query, params);
    return rows.map(this._mapStorageMetadata);
  }

  /**
   * Get storage metadata by file key
   */
  async getStorageMetadata(fileKey: string): Promise<StorageMetadata | null> {
    const rows = await this._dbQuery<StorageMetadataRow>(
      'SELECT * FROM admin_storage_metadata WHERE file_key = $1',
      [fileKey]
    );

    return rows.length > 0 ? this._mapStorageMetadata(rows[0]) : null;
  }

  /**
   * Update storage metadata tags
   */
  async updateTags(fileKey: string, tags: string[]): Promise<void> {
    await this._dbQuery(
      'UPDATE admin_storage_metadata SET tags = $1 WHERE file_key = $2',
      [tags, fileKey]
    );
  }

  /**
   * Update storage metadata status
   */
  async updateStatus(fileKey: string, status: FileStatus): Promise<void> {
    await this._dbQuery(
      'UPDATE admin_storage_metadata SET status = $1 WHERE file_key = $2',
      [status, fileKey]
    );
  }

  /**
   * Mark file as archived to R2
   */
  async markArchivedToR2(fileKey: string): Promise<void> {
    await this._dbQuery(
      'UPDATE admin_storage_metadata SET archived_to_r2 = true, archived_at = NOW() WHERE file_key = $1',
      [fileKey]
    );
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(entityScope?: EntityScope): Promise<StorageStats> {
    let whereClause = 'WHERE status = $1';
    const params: any[] = ['active'];

    if (entityScope) {
      whereClause += ' AND entity_scope = $2';
      params.push(entityScope);
    }

    // Total files and size
    const totals = await this._dbQuery<{ total_files: number; total_size: number }>(
      `SELECT COUNT(*) as total_files, COALESCE(SUM(file_size_bytes), 0) as total_size
       FROM admin_storage_metadata ${whereClause}`,
      params
    );

    // Files by bucket
    const byBucket = await this._dbQuery<{ bucket_name: string; count: number }>(
      `SELECT bucket_name, COUNT(*) as count
       FROM admin_storage_metadata ${whereClause}
       GROUP BY bucket_name`,
      params
    );

    // Size by bucket
    const sizeByBucket = await this._dbQuery<{ bucket_name: string; total_size: number }>(
      `SELECT bucket_name, COALESCE(SUM(file_size_bytes), 0) as total_size
       FROM admin_storage_metadata ${whereClause}
       GROUP BY bucket_name`,
      params
    );

    // Files by entity
    const byEntity = await this._dbQuery<{ entity_scope: EntityScope; count: number }>(
      `SELECT entity_scope, COUNT(*) as count
       FROM admin_storage_metadata WHERE status = $1
       GROUP BY entity_scope`,
      ['active']
    );

    // Files by status
    const byStatus = await this._dbQuery<{ status: FileStatus; count: number }>(
      `SELECT status, COUNT(*) as count
       FROM admin_storage_metadata
       ${entityScope ? 'WHERE entity_scope = $1' : ''}
       GROUP BY status`,
      entityScope ? [entityScope] : []
    );

    // Recent uploads
    const recent = await this.listStorageMetadata({
      entityScope,
      status: 'active',
      limit: 10,
    });

    return {
      totalFiles: totals[0]?.total_files || 0,
      totalSize: totals[0]?.total_size || 0,
      filesByBucket: Object.fromEntries(byBucket.map((r) => [r.bucket_name, r.count])),
      sizeByBucket: Object.fromEntries(sizeByBucket.map((r) => [r.bucket_name, r.total_size])),
      filesByEntity: Object.fromEntries(byEntity.map((r) => [r.entity_scope, r.count])) as Record<EntityScope, number>,
      filesByStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.count])) as Record<FileStatus, number>,
      recentUploads: recent,
    };
  }

  /**
   * Health check for storage service
   */
  async healthCheck(): Promise<StorageHealthStatus> {
    try {
      return await this._minioRequest<StorageHealthStatus>('health', {});
    } catch (error) {
      return {
        healthy: false,
        service: 'minio',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create storage metadata record
   */
  private async _createStorageMetadata(data: {
    fileKey: string;
    bucketName: string;
    originalFilename: string;
    contentType: string;
    fileSizeBytes: number;
    checksumMd5?: string;
    entityScope: EntityScope;
    uploadedBy: string;
    tags: string[];
    metadata: Record<string, any>;
  }): Promise<void> {
    await this._dbQuery(
      `INSERT INTO admin_storage_metadata (
        file_key, bucket_name, original_filename, content_type,
        file_size_bytes, checksum_md5, entity_scope, uploaded_by, tags, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (file_key) DO UPDATE SET
        file_size_bytes = EXCLUDED.file_size_bytes,
        checksum_md5 = EXCLUDED.checksum_md5,
        uploaded_at = NOW()`,
      [
        data.fileKey,
        data.bucketName,
        data.originalFilename,
        data.contentType,
        data.fileSizeBytes,
        data.checksumMd5 || null,
        data.entityScope,
        data.uploadedBy,
        data.tags,
        JSON.stringify(data.metadata),
      ]
    );
  }

  /**
   * Map database row to domain type
   */
  private _mapStorageMetadata(row: StorageMetadataRow): StorageMetadata {
    return {
      id: row.id,
      fileKey: row.file_key,
      bucketName: row.bucket_name,
      originalFilename: row.original_filename,
      contentType: row.content_type,
      fileSizeBytes: row.file_size_bytes,
      checksumMd5: row.checksum_md5,
      entityScope: row.entity_scope,
      uploadedBy: row.uploaded_by,
      uploadedAt: new Date(row.uploaded_at),
      status: row.status,
      archivedToR2: row.archived_to_r2,
      archivedAt: row.archived_at ? new Date(row.archived_at) : null,
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
      metadata: row.metadata,
      tags: row.tags,
    };
  }

  /**
   * Execute MinIO operation via MCP Gateway
   */
  private async _minioRequest<T>(operation: string, params: any, retryCount = 0): Promise<T> {
    const requestId = randomUUID();

    const body: MCPRequest = {
      jsonrpc: '2.0',
      method: 'mcp.execute',
      params: {
        service: 'minio',
        operation,
        ...params,
      },
      id: requestId,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/mcp/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new MCPConnectionError(
          `MCP Gateway returned ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as MCPResponse<T>;

      if (data.error) {
        throw new MCPError(data.error.code, data.error.message, data.error.data);
      }

      if (!data.result) {
        throw new MCPError(-32603, 'Invalid response: missing result');
      }

      return data.result.data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._minioRequest<T>(operation, params, retryCount + 1);
        }
        throw new MCPTimeoutError(`Request timed out after ${this.config.timeout}ms`);
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._minioRequest<T>(operation, params, retryCount + 1);
        }
        throw new MCPConnectionError('Failed to connect to MCP Gateway', {
          baseUrl: this.config.baseUrl,
          error: error.message,
        });
      }

      if (error instanceof MCPError) {
        throw error;
      }

      throw parseError(error);
    }
  }

  /**
   * Execute database query via MCP Gateway (PostgreSQL service)
   */
  private async _dbQuery<T = any>(sql: string, params: any[] = [], retryCount = 0): Promise<T[]> {
    const requestId = randomUUID();

    const body: MCPRequest = {
      jsonrpc: '2.0',
      method: 'mcp.execute',
      params: {
        service: 'postgres',
        database: this.config.database || 'shared-users',
        operation: 'query',
        args: [sql, params],
      },
      id: requestId,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/mcp/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new MCPConnectionError(
          `MCP Gateway returned ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as MCPResponse<T[]>;

      if (data.error) {
        throw new MCPError(data.error.code, data.error.message, data.error.data);
      }

      if (!data.result) {
        throw new MCPError(-32603, 'Invalid response: missing result');
      }

      return data.result.data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._dbQuery<T>(sql, params, retryCount + 1);
        }
        throw new MCPTimeoutError(`Request timed out after ${this.config.timeout}ms`);
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        if (retryCount < this.config.retries) {
          await this._sleep(this.config.retryDelay);
          return this._dbQuery<T>(sql, params, retryCount + 1);
        }
        throw new MCPConnectionError('Failed to connect to MCP Gateway');
      }

      if (error instanceof MCPError) {
        throw error;
      }

      throw parseError(error);
    }
  }

  /**
   * Sleep for a given duration
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current configuration
   */
  getConfig(): ResolvedMCPClientConfig {
    return { ...this.config };
  }
}
