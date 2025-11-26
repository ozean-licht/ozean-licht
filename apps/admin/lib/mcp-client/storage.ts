/**
 * MCP Storage Client
 *
 * Typed wrapper for MinIO storage operations via MCP Gateway.
 * Provides file upload, download, list, delete, and stat operations.
 */

import { randomUUID } from 'crypto';
import type {
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  GetFileUrlResult,
  DeleteFileInput,
  DeleteFileResult,
  StatFileInput,
  StatFileResult,
  StorageHealthStatus,
  EntityScope,
} from '@/types/storage';

/**
 * Upload file input parameters for MCP Gateway
 */
export interface MCPUploadFileInput {
  bucket: string;
  fileKey: string;
  fileBuffer: string; // base64 encoded
  contentType: string;
  metadata?: {
    uploadedBy?: string;
    entityScope?: EntityScope;
    originalFilename?: string;
    [key: string]: unknown;
  };
}

/**
 * Upload file result from MCP Gateway
 */
export interface MCPUploadFileResult {
  fileKey: string;
  bucket: string;
  url: string;
  size: number;
  etag: string;
  contentType: string;
  checksumMd5: string;
  metadata: {
    uploadedBy?: string;
    entityScope?: EntityScope;
    originalFilename?: string;
  };
}

/**
 * MCP Storage Client Configuration
 */
export interface MCPStorageClientConfig {
  baseUrl?: string;
  timeout?: number;
}

/**
 * MCP JSON-RPC Request
 */
interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, unknown>;
  id: string;
}

/**
 * MCP JSON-RPC Response
 */
interface MCPResponse<T> {
  jsonrpc: '2.0';
  result?: {
    status: 'success' | 'error';
    data: T;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: string;
}

/**
 * MCP Storage Client
 *
 * Provides type-safe storage operations via MCP Gateway.
 * All methods communicate with the MinIO handler through JSON-RPC.
 */
export class MCPStorageClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: MCPStorageClientConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.MCP_GATEWAY_URL || 'http://localhost:8100';
    this.timeout = config.timeout || 30000; // 30s default for uploads
  }

  /**
   * Upload a file to MinIO bucket
   *
   * @param params Upload parameters with base64 file buffer
   * @returns Upload result with presigned URL
   */
  async uploadFile(params: MCPUploadFileInput): Promise<MCPUploadFileResult> {
    return this._request<MCPUploadFileResult>('upload', params);
  }

  /**
   * List files in a bucket with optional prefix filtering
   *
   * @param params List parameters
   * @returns Files and pagination info
   */
  async listFiles(params: ListFilesInput): Promise<ListFilesResult> {
    const result = await this._request<{
      files: Array<{
        key: string;
        size: number;
        lastModified: string;
        etag: string;
      }>;
      nextMarker: string | null;
      truncated: boolean;
      count: number;
    }>('list', params);

    // Transform dates from strings to Date objects
    return {
      files: result.files.map((f) => ({
        key: f.key,
        size: f.size,
        lastModified: new Date(f.lastModified),
        etag: f.etag,
      })),
      nextMarker: result.nextMarker,
      truncated: result.truncated,
      count: result.count,
    };
  }

  /**
   * Get a presigned URL for file download
   *
   * @param params File key and bucket
   * @returns Presigned URL with expiry info
   */
  async getFileUrl(params: GetFileUrlInput): Promise<GetFileUrlResult> {
    return this._request<GetFileUrlResult>('getUrl', params);
  }

  /**
   * Delete a file from bucket
   *
   * @param params File key and bucket
   * @returns Deletion confirmation
   */
  async deleteFile(params: DeleteFileInput): Promise<DeleteFileResult> {
    return this._request<DeleteFileResult>('delete', params);
  }

  /**
   * Get file metadata (stat)
   *
   * @param params File key and bucket
   * @returns File metadata
   */
  async statFile(params: StatFileInput): Promise<StatFileResult> {
    const result = await this._request<{
      size: number;
      lastModified: string;
      etag: string;
      contentType: string;
      metadata: Record<string, unknown>;
    }>('stat', params);

    return {
      size: result.size,
      lastModified: new Date(result.lastModified),
      etag: result.etag,
      contentType: result.contentType,
      metadata: result.metadata,
    };
  }

  /**
   * Check MinIO service health
   *
   * @returns Health status with latency info
   */
  async checkHealth(): Promise<StorageHealthStatus> {
    return this._request<StorageHealthStatus>('health', {});
  }

  /**
   * Internal request method for MCP Gateway communication
   */
  private async _request<T>(operation: string, params: object): Promise<T> {
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/mcp/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`MCP Gateway returned ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as MCPResponse<T>;

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.result) {
        throw new Error('Invalid response: missing result');
      }

      if (data.result.status === 'error') {
        throw new Error('Storage operation failed');
      }

      return data.result.data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timed out after ${this.timeout}ms`);
        }
        throw error;
      }

      throw new Error('Unknown storage error');
    }
  }
}

/**
 * Create a new MCP Storage Client instance
 */
export function createStorageClient(config?: MCPStorageClientConfig): MCPStorageClient {
  return new MCPStorageClient(config);
}

/**
 * Default storage client instance
 */
let defaultClient: MCPStorageClient | null = null;

/**
 * Get the default storage client (singleton)
 */
export function getStorageClient(): MCPStorageClient {
  if (!defaultClient) {
    defaultClient = new MCPStorageClient();
  }
  return defaultClient;
}
