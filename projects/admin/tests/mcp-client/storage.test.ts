/**
 * Storage Client Tests
 *
 * Unit tests for MinIO storage client operations via MCP Gateway.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { StorageClient } from '../../lib/mcp-client/storage';
import {
  // Types imported for test type checking but may not all be directly used
  CreateBucketOptions,
} from '../../types/storage';

describe('StorageClient', () => {
  let client: StorageClient;
  const testBucketName = `test-bucket-${Date.now()}`;
  const testFileName = 'test-file.txt';
  const testFileContent = Buffer.from('Hello, MinIO!', 'utf-8');

  beforeAll(() => {
    // Initialize storage client
    client = new StorageClient({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      timeout: 30000,
    });
  });

  afterAll(async () => {
    // Cleanup: Delete test bucket if it exists
    try {
      const buckets = await client.listBuckets();
      const testBucket = buckets.find((b) => b.name === testBucketName);
      if (testBucket) {
        // Delete all objects first
        const { objects } = await client.listObjects({ bucket: testBucketName });
        for (const obj of objects) {
          await client.deleteFile({ bucket: testBucketName, key: obj.key });
        }
        // Delete bucket
        await client.deleteBucket(testBucketName);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });

  describe('Bucket Operations', () => {
    it('should list buckets', async () => {
      const buckets = await client.listBuckets();
      expect(Array.isArray(buckets)).toBe(true);
      buckets.forEach((bucket) => {
        expect(bucket).toHaveProperty('name');
        expect(bucket).toHaveProperty('creationDate');
        expect(bucket.creationDate).toBeInstanceOf(Date);
      });
    });

    it('should create a new bucket', async () => {
      const options: CreateBucketOptions = {
        name: testBucketName,
        region: 'us-east-1',
      };

      await client.createBucket(options);

      // Verify bucket was created
      const buckets = await client.listBuckets();
      const createdBucket = buckets.find((b) => b.name === testBucketName);
      expect(createdBucket).toBeDefined();
      expect(createdBucket?.name).toBe(testBucketName);
    });

    it('should fail to create duplicate bucket', async () => {
      const options: CreateBucketOptions = {
        name: testBucketName,
      };

      await expect(client.createBucket(options)).rejects.toThrow();
    });

    it('should delete an empty bucket', async () => {
      // Create a temporary bucket
      const tempBucketName = `temp-bucket-${Date.now()}`;
      await client.createBucket({ name: tempBucketName });

      // Delete it
      await client.deleteBucket(tempBucketName);

      // Verify it's gone
      const buckets = await client.listBuckets();
      const deletedBucket = buckets.find((b) => b.name === tempBucketName);
      expect(deletedBucket).toBeUndefined();
    });

    it('should fail to delete non-existent bucket', async () => {
      const nonExistentBucket = 'non-existent-bucket-12345';
      await expect(client.deleteBucket(nonExistentBucket)).rejects.toThrow();
    });
  });

  describe('Object Operations', () => {
    beforeEach(async () => {
      // Ensure test bucket exists
      const buckets = await client.listBuckets();
      const testBucket = buckets.find((b) => b.name === testBucketName);
      if (!testBucket) {
        await client.createBucket({ name: testBucketName });
      }
    });

    it('should upload a file', async () => {
      const result = await client.uploadFile(testFileContent, {
        bucket: testBucketName,
        key: testFileName,
        contentType: 'text/plain',
        metadata: {
          'test-key': 'test-value',
        },
      });

      expect(result).toHaveProperty('key', testFileName);
      expect(result).toHaveProperty('size');
      expect(result.size).toBeGreaterThan(0);
      expect(result).toHaveProperty('etag');
      expect(result).toHaveProperty('lastModified');
      expect(result.lastModified).toBeInstanceOf(Date);
    });

    it('should list objects in a bucket', async () => {
      const { objects, isTruncated } = await client.listObjects({
        bucket: testBucketName,
      });

      expect(Array.isArray(objects)).toBe(true);
      expect(typeof isTruncated).toBe('boolean');
      expect(objects.length).toBeGreaterThan(0);

      const testFile = objects.find((obj) => obj.key === testFileName);
      expect(testFile).toBeDefined();
      expect(testFile?.key).toBe(testFileName);
      expect(testFile?.size).toBeGreaterThan(0);
    });

    it('should list objects with prefix filter', async () => {
      // Upload another file with different prefix
      await client.uploadFile(Buffer.from('test'), {
        bucket: testBucketName,
        key: 'prefix/other-file.txt',
        contentType: 'text/plain',
      });

      const { objects } = await client.listObjects({
        bucket: testBucketName,
        prefix: 'prefix/',
      });

      expect(objects.every((obj) => obj.key.startsWith('prefix/'))).toBe(true);
    });

    it('should get object metadata', async () => {
      const metadata = await client.getObjectMetadata(testBucketName, testFileName);

      expect(metadata).toHaveProperty('key', testFileName);
      expect(metadata).toHaveProperty('size');
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata).toHaveProperty('etag');
      expect(metadata).toHaveProperty('lastModified');
      expect(metadata.lastModified).toBeInstanceOf(Date);
      expect(metadata).toHaveProperty('contentType');
    });

    it('should download a file', async () => {
      const data = await client.downloadFile({
        bucket: testBucketName,
        key: testFileName,
      });

      expect(Buffer.isBuffer(data)).toBe(true);
      expect(data.toString('utf-8')).toBe(testFileContent.toString('utf-8'));
    });

    it('should fail to download non-existent file', async () => {
      await expect(
        client.downloadFile({
          bucket: testBucketName,
          key: 'non-existent-file.txt',
        })
      ).rejects.toThrow();
    });

    it('should delete a file', async () => {
      // Upload a temporary file
      const tempFileName = `temp-file-${Date.now()}.txt`;
      await client.uploadFile(Buffer.from('temporary'), {
        bucket: testBucketName,
        key: tempFileName,
        contentType: 'text/plain',
      });

      // Delete it
      await client.deleteFile({
        bucket: testBucketName,
        key: tempFileName,
      });

      // Verify it's gone
      await expect(
        client.getObjectMetadata(testBucketName, tempFileName)
      ).rejects.toThrow();
    });

    it('should fail to delete non-existent file', async () => {
      await expect(
        client.deleteFile({
          bucket: testBucketName,
          key: 'non-existent-file.txt',
        })
      ).rejects.toThrow();
    });
  });

  describe('Storage Statistics', () => {
    it('should get storage statistics', async () => {
      const stats = await client.getStorageStats();

      expect(stats).toHaveProperty('totalBuckets');
      expect(stats).toHaveProperty('totalObjects');
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('bucketStats');

      expect(typeof stats.totalBuckets).toBe('number');
      expect(typeof stats.totalObjects).toBe('number');
      expect(typeof stats.totalSize).toBe('number');
      expect(Array.isArray(stats.bucketStats)).toBe(true);

      // Verify bucket stats structure
      stats.bucketStats.forEach((bucketStat) => {
        expect(bucketStat).toHaveProperty('name');
        expect(bucketStat).toHaveProperty('objectCount');
        expect(bucketStat).toHaveProperty('size');
        expect(typeof bucketStat.objectCount).toBe('number');
        expect(typeof bucketStat.size).toBe('number');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid bucket name', async () => {
      const invalidBucketName = 'Invalid_Bucket_Name!';
      await expect(
        client.createBucket({ name: invalidBucketName })
      ).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      const shortTimeoutClient = new StorageClient({
        timeout: 1, // 1ms timeout
        retries: 0,
      });

      await expect(shortTimeoutClient.listBuckets()).rejects.toThrow();
    });

    it('should handle connection errors', async () => {
      const badClient = new StorageClient({
        baseUrl: 'http://localhost:9999', // Invalid port
        timeout: 1000,
        retries: 0,
      });

      await expect(badClient.listBuckets()).rejects.toThrow();
    });

    it('should wrap errors properly', async () => {
      try {
        await client.getObjectMetadata('non-existent-bucket', 'test.txt');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBeTruthy();
      }
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const defaultClient = new StorageClient();
      const config = defaultClient.getConfig();

      expect(config.baseUrl).toBe('http://localhost:8100');
      expect(config.timeout).toBe(30000);
      expect(config.retries).toBe(3);
      expect(config.retryDelay).toBe(1000);
    });

    it('should use custom configuration', () => {
      const customClient = new StorageClient({
        baseUrl: 'http://custom-url:8200',
        timeout: 60000,
        retries: 5,
        retryDelay: 2000,
      });
      const config = customClient.getConfig();

      expect(config.baseUrl).toBe('http://custom-url:8200');
      expect(config.timeout).toBe(60000);
      expect(config.retries).toBe(5);
      expect(config.retryDelay).toBe(2000);
    });
  });
});
