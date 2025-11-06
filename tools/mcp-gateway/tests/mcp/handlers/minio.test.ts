/**
 * MinIO Handler Tests
 * Unit tests for MinIO MCP handler
 */

import { MinIOHandler } from '../../../src/mcp/handlers/minio';
import { MCPParams } from '../../../src/mcp/protocol/types';

describe('MinIOHandler', () => {
  let handler: MinIOHandler;

  beforeAll(() => {
    handler = new MinIOHandler({
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      maxFileSize: 100 * 1024 * 1024, // 100MB for tests
      allowedContentTypes: ['image/*', 'video/*', 'application/pdf'],
      presignedUrlExpiry: 300,
    });
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(handler.initialize()).resolves.not.toThrow();
    });
  });

  describe('health check', () => {
    it('should return health status', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'health',
      };

      const result = await handler.execute(params);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('healthy');
      expect(result.data).toHaveProperty('service', 'minio');
    });
  });

  describe('upload operation', () => {
    it('should validate required parameters', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'upload',
        // Missing required fields
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });

    it('should reject files exceeding max size', async () => {
      const largeBuffer = Buffer.alloc(200 * 1024 * 1024); // 200MB
      const params: MCPParams = {
        service: 'minio',
        operation: 'upload',
        bucket: 'test-bucket',
        fileKey: 'test/large-file.bin',
        fileBuffer: largeBuffer.toString('base64'),
        contentType: 'application/octet-stream',
      };

      await expect(handler.execute(params)).rejects.toThrow(/exceeds maximum/);
    });

    it('should reject invalid file types', async () => {
      const buffer = Buffer.from('test content');
      const params: MCPParams = {
        service: 'minio',
        operation: 'upload',
        bucket: 'test-bucket',
        fileKey: 'test/script.exe',
        fileBuffer: buffer.toString('base64'),
        contentType: 'application/x-msdownload',
      };

      await expect(handler.execute(params)).rejects.toThrow(/not allowed/);
    });
  });

  describe('list operation', () => {
    it('should list files in bucket', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'list',
        bucket: 'test-bucket',
        prefix: 'test/',
        limit: 10,
      };

      const result = await handler.execute(params);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('files');
      expect(Array.isArray(result.data.files)).toBe(true);
    });
  });

  describe('getUrl operation', () => {
    it('should validate bucket and fileKey', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'getUrl',
        // Missing bucket and fileKey
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });
  });

  describe('delete operation', () => {
    it('should validate bucket and fileKey', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'delete',
        // Missing bucket and fileKey
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });
  });

  describe('stat operation', () => {
    it('should validate bucket and fileKey', async () => {
      const params: MCPParams = {
        service: 'minio',
        operation: 'stat',
        // Missing bucket and fileKey
      };

      await expect(handler.execute(params)).rejects.toThrow();
    });
  });

  describe('capabilities', () => {
    it('should return list of capabilities', () => {
      const capabilities = handler.getCapabilities();

      expect(Array.isArray(capabilities)).toBe(true);
      expect(capabilities.length).toBeGreaterThan(0);
      expect(capabilities.map((c) => c.name)).toContain('upload');
      expect(capabilities.map((c) => c.name)).toContain('list');
      expect(capabilities.map((c) => c.name)).toContain('getUrl');
      expect(capabilities.map((c) => c.name)).toContain('delete');
      expect(capabilities.map((c) => c.name)).toContain('stat');
      expect(capabilities.map((c) => c.name)).toContain('health');
    });
  });
});
