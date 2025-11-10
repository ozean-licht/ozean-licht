# Feature Implementation Plan: MinIO S3 Storage Integration

**Issue:** #13
**ADW ID:** 9d6e020d
**Type:** Feature
**Created:** 2025-11-02

---

## Overview

This feature implements a comprehensive MinIO S3-compatible storage integration for the Admin Dashboard, enabling unified object storage management across both Kids Ascension and Ozean Licht platforms. The integration provides file upload, retrieval, deletion, and metadata management through the MCP Gateway, establishing the foundation for the three-tier storage system (MinIO → Cloudflare R2 → Cloudflare Stream).

## Context

The Ozean Licht Ecosystem uses a sophisticated three-tier storage strategy designed for cost efficiency and performance:

1. **MinIO (Hot Storage)** - On-premise staging on Hetzner server for video upload staging before moderation, brand assets, and temporary files
2. **Cloudflare R2 (Cold Archive)** - Permanent video masters after approval
3. **Cloudflare Stream (Delivery)** - CDN video streaming with automatic transcoding

Currently, the Admin Dashboard has the foundation in place:
- MCP Gateway operational with PostgreSQL, Mem0, Cloudflare, GitHub, and N8N services
- Admin authentication with NextAuth v5
- Database schema and MCP client library for admin operations
- Type-safe client pattern established

This feature adds MinIO as the first tier of the storage pipeline, integrating it as a new MCP service that can be consumed by both the Admin Dashboard and future autonomous agents.

### Institutional Memory Insights

Based on memory recall:
- **MCP Gateway integration tested successfully** - The gateway has proven reliable for service integration with proper error handling and authentication
- **Pattern:** All services follow JSON-RPC 2.0 protocol with consistent error handling
- **Best Practice:** Zero authentication overhead for localhost/Docker network requests (security by design)
- **Architecture Decision:** All operations should go through MCP Gateway for centralized metrics and connection pooling

---

## Requirements

### Functional Requirements
- **FR-1:** Admin users can upload files to MinIO buckets through MCP Gateway
- **FR-2:** Admin users can list files in MinIO buckets with pagination and filtering
- **FR-3:** Admin users can retrieve files from MinIO buckets (presigned URLs for secure access)
- **FR-4:** Admin users can delete files from MinIO buckets
- **FR-5:** Admin users can retrieve file metadata (size, content type, last modified)
- **FR-6:** System supports multiple buckets for different purposes (staging, assets, temp)
- **FR-7:** Operations are scoped by entity (kids_ascension, ozean_licht, shared)
- **FR-8:** All storage operations are logged to audit trail
- **FR-9:** File operations include automatic retry logic for transient failures
- **FR-10:** Presigned URLs are generated with configurable expiration times

### Technical Requirements
- **TR-1:** Integration through MCP Gateway using JSON-RPC 2.0 protocol
- **TR-2:** MinIO client using official `minio` npm package
- **TR-3:** TypeScript with full type safety across all operations
- **TR-4:** Connection pooling and reuse of MinIO client instances
- **TR-5:** Environment-based configuration (endpoint, credentials, bucket names)
- **TR-6:** Support for multipart uploads for large files (>100MB)
- **TR-7:** MIME type validation and file size limits enforced
- **TR-8:** Localhost authentication bypass (consistent with existing MCP services)
- **TR-9:** Health checks to verify MinIO connectivity
- **TR-10:** Prometheus metrics for storage operations

### Non-Functional Requirements
- **Performance:** File uploads < 5s for files under 10MB, < 30s for files under 100MB
- **Reliability:** 99.9% uptime for storage operations
- **Security:** All file access through presigned URLs with expiration
- **Scalability:** Support for 1000+ concurrent uploads
- **Monitoring:** All operations tracked with execution time and token costs
- **Audit:** All file operations logged with admin user, entity scope, and metadata

---

## Architecture & Design

### High-Level Design

The MinIO integration follows the established MCP Gateway pattern:

```
Admin Dashboard UI
       ↓
MCP Client Library (TypeScript)
       ↓
MCP Gateway (/mcp/rpc endpoint)
       ↓
MinIO MCP Handler (new)
       ↓
MinIO Server (Docker container)
       ↓
Storage Buckets (kids-ascension-staging, ozean-licht-assets, shared-temp)
```

**Data Flow:**

1. **Upload Flow:**
   - Admin uploads file via React form → FormData
   - Frontend calls MCP client `uploadFile()` method
   - MCP client sends JSON-RPC request to gateway
   - MinIO handler validates file, checks bucket exists
   - File uploaded to MinIO with metadata (uploader_id, entity_scope, original_name)
   - Audit log created automatically
   - Returns file key and presigned URL for verification

2. **Retrieval Flow:**
   - Admin requests file (e.g., view uploaded video)
   - MCP client calls `getFileUrl()` with file key
   - MinIO handler generates presigned URL (5-minute expiration)
   - URL returned to frontend
   - Browser fetches file directly from MinIO using URL

3. **List Flow:**
   - Admin views file listing page
   - MCP client calls `listFiles()` with filters (bucket, prefix, limit)
   - MinIO handler queries bucket with pagination
   - Returns file metadata array (key, size, modified, content_type)

### Database Changes

**New Table:** `admin_storage_metadata` (in `shared_users_db`)

```sql
CREATE TABLE IF NOT EXISTS admin_storage_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- File identification
    file_key VARCHAR(500) NOT NULL UNIQUE,  -- MinIO object key
    bucket_name VARCHAR(100) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,

    -- File properties
    content_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_md5 VARCHAR(32),

    -- Entity scoping
    entity_scope VARCHAR(50) NOT NULL CHECK (entity_scope IN ('kids_ascension', 'ozean_licht', 'shared')),

    -- Ownership & audit
    uploaded_by UUID NOT NULL REFERENCES admin_users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- File lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'processing')),
    archived_to_r2 BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Metadata & tags
    metadata JSONB DEFAULT '{}',  -- Custom metadata (e.g., video duration, image dimensions)
    tags TEXT[],  -- Searchable tags

    -- Indexes for performance
    CONSTRAINT valid_file_key CHECK (file_key ~ '^[a-zA-Z0-9\-_/\.]+$')
);

-- Indexes
CREATE INDEX idx_storage_bucket ON admin_storage_metadata(bucket_name);
CREATE INDEX idx_storage_entity ON admin_storage_metadata(entity_scope);
CREATE INDEX idx_storage_uploader ON admin_storage_metadata(uploaded_by);
CREATE INDEX idx_storage_status ON admin_storage_metadata(status);
CREATE INDEX idx_storage_uploaded_at ON admin_storage_metadata(uploaded_at DESC);
CREATE INDEX idx_storage_metadata_gin ON admin_storage_metadata USING GIN (metadata);
CREATE INDEX idx_storage_tags_gin ON admin_storage_metadata USING GIN (tags);

COMMENT ON TABLE admin_storage_metadata IS 'Metadata tracking for files stored in MinIO, enabling audit trail and lifecycle management';
```

### API Changes

**New MCP Service:** `minio`

**JSON-RPC Methods:**

```typescript
// Upload file
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "upload",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/user-123/video-abc.mp4",
    "fileBuffer": "<base64-encoded-file>",
    "contentType": "video/mp4",
    "metadata": {
      "uploadedBy": "admin-user-id",
      "entityScope": "kids_ascension",
      "originalFilename": "my-video.mp4"
    }
  },
  "id": "req-1"
}

// List files
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "list",
    "bucket": "kids-ascension-staging",
    "prefix": "videos/2025/11/",
    "limit": 100,
    "marker": "videos/2025/11/user-123/video-xyz.mp4"
  },
  "id": "req-2"
}

// Get presigned URL
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "getUrl",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/user-123/video-abc.mp4",
    "expirySeconds": 300
  },
  "id": "req-3"
}

// Delete file
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "delete",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/user-123/video-abc.mp4"
  },
  "id": "req-4"
}

// Get file metadata
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "stat",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/user-123/video-abc.mp4"
  },
  "id": "req-5"
}

// Health check
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "health"
  },
  "id": "req-6"
}
```

### Component Structure

```
infrastructure/mcp-gateway/
├── src/mcp/handlers/
│   └── minio.ts                    # New MinIO handler (350 lines)
│
projects/admin/
├── lib/mcp-client/
│   ├── storage.ts                  # New storage operations (400 lines)
│   └── index.ts                    # Update exports
│
├── types/
│   ├── storage.ts                  # New storage types (200 lines)
│   └── index.ts                    # Update exports
│
├── migrations/
│   └── 002_create_storage_metadata.sql  (80 lines)
│
├── components/
│   ├── storage/
│   │   ├── FileUploadForm.tsx     # New upload form (200 lines)
│   │   ├── FileList.tsx           # New file listing (250 lines)
│   │   ├── FileViewer.tsx         # New file viewer (150 lines)
│   │   └── StorageStats.tsx       # New storage stats (100 lines)
│
├── app/dashboard/storage/
│   ├── page.tsx                    # Storage management page (100 lines)
│   ├── layout.tsx                  # Storage layout (50 lines)
│   └── [bucket]/page.tsx           # Bucket-specific view (120 lines)
│
└── tests/
    ├── mcp-client/
    │   └── storage.test.ts         # Storage client tests (150 lines)
    └── integration/
        └── storage-e2e.test.ts     # E2E storage tests (200 lines)
```

---

## Implementation Steps

### Step 1: Infrastructure - MinIO MCP Handler

**Goal:** Create MinIO MCP handler in the gateway to enable S3-compatible storage operations

**Files to Create:**
- `infrastructure/mcp-gateway/src/mcp/handlers/minio.ts` - MinIO handler implementation

**Files to Modify:**
- `infrastructure/mcp-gateway/src/mcp/initialize.ts` - Register MinIO service
- `infrastructure/mcp-gateway/src/mcp/registry.ts` - Add MinIO to catalog
- `infrastructure/mcp-gateway/package.json` - Add `minio` dependency

**Implementation Details:**

1. Install MinIO client package: `npm install minio @types/minio`

2. Create `minio.ts` handler with:
   - Client initialization with connection pooling
   - Operations: upload, list, getUrl, delete, stat, health
   - Error handling with proper JSON-RPC error codes
   - Automatic bucket creation if not exists
   - Presigned URL generation with configurable expiry
   - Multipart upload support for large files (>100MB)
   - Content-Type validation
   - File size limit enforcement (configurable via env)

3. Configuration from environment:
   ```typescript
   const config = {
     endpoint: process.env.MINIO_ENDPOINT || 'localhost',
     port: parseInt(process.env.MINIO_PORT || '9000'),
     useSSL: process.env.MINIO_USE_SSL === 'true',
     accessKey: process.env.MINIO_ACCESS_KEY!,
     secretKey: process.env.MINIO_SECRET_KEY!,
   };
   ```

4. Register service in `initialize.ts`:
   ```typescript
   import { minioHandler } from './handlers/minio';

   await minioHandler.initialize();
   registry.registerService(minioHandler);
   logger.info('✅ Initialized minio MCP service');
   ```

5. Add health check that:
   - Verifies MinIO connectivity
   - Lists buckets to ensure permissions
   - Measures latency
   - Returns service status

**Acceptance Criteria:**
- [ ] MinIO handler initializes successfully with valid credentials
- [ ] All 6 operations (upload, list, getUrl, delete, stat, health) implemented
- [ ] Error handling returns proper JSON-RPC error codes
- [ ] Health check verifies connectivity
- [ ] Service registered in MCP Gateway catalog
- [ ] TypeScript compiles without errors
- [ ] Unit tests pass for MinIO handler

---

### Step 2: Database Migration - Storage Metadata Table

**Goal:** Create database table to track file metadata and enable audit trail

**Files to Create:**
- `projects/admin/migrations/002_create_storage_metadata.sql` - Storage metadata schema

**Files to Modify:**
- `projects/admin/migrations/README.md` - Update with new migration instructions

**Implementation Details:**

1. Create migration file with:
   - `admin_storage_metadata` table definition (as specified in Database Changes section)
   - All necessary indexes for performance
   - Foreign key to `admin_users` table
   - Check constraints for valid values
   - Comments explaining table purpose

2. Add rollback SQL at bottom of file:
   ```sql
   -- Rollback
   -- DROP TABLE IF EXISTS admin_storage_metadata CASCADE;
   ```

3. Make migration idempotent with `IF NOT EXISTS` clauses

4. Update migration README with execution command:
   ```bash
   psql $SHARED_USERS_DB_URL -f projects/admin/migrations/002_create_storage_metadata.sql
   ```

**Acceptance Criteria:**
- [ ] Migration file creates table with all columns and constraints
- [ ] All indexes created for optimal query performance
- [ ] Foreign key references are valid
- [ ] Check constraints enforce valid enum values
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] Rollback SQL provided in comments
- [ ] README updated with execution instructions

---

### Step 3: TypeScript Types - Storage Domain Models

**Goal:** Define comprehensive TypeScript types for storage operations

**Files to Create:**
- `projects/admin/types/storage.ts` - Storage types and interfaces

**Files to Modify:**
- `projects/admin/types/index.ts` - Export storage types

**Implementation Details:**

1. Create storage types:

```typescript
// Database row type
export interface StorageMetadataRow {
  id: string;
  file_key: string;
  bucket_name: string;
  original_filename: string;
  content_type: string;
  file_size_bytes: number;
  checksum_md5: string | null;
  entity_scope: 'kids_ascension' | 'ozean_licht' | 'shared';
  uploaded_by: string;
  uploaded_at: Date;
  status: 'active' | 'archived' | 'deleted' | 'processing';
  archived_to_r2: boolean;
  archived_at: Date | null;
  deleted_at: Date | null;
  metadata: Record<string, any>;
  tags: string[];
}

// Domain type (camelCase)
export interface StorageMetadata {
  id: string;
  fileKey: string;
  bucketName: string;
  originalFilename: string;
  contentType: string;
  fileSizeBytes: number;
  checksumMd5: string | null;
  entityScope: 'kids_ascension' | 'ozean_licht' | 'shared';
  uploadedBy: string;
  uploadedAt: Date;
  status: 'active' | 'archived' | 'deleted' | 'processing';
  archivedToR2: boolean;
  archivedAt: Date | null;
  deletedAt: Date | null;
  metadata: Record<string, any>;
  tags: string[];
}

// Upload input
export interface UploadFileInput {
  bucket: string;
  fileKey: string;
  fileBuffer: Buffer;
  contentType: string;
  metadata: {
    uploadedBy: string;
    entityScope: 'kids_ascension' | 'ozean_licht' | 'shared';
    originalFilename: string;
    tags?: string[];
    customMetadata?: Record<string, any>;
  };
}

// Upload result
export interface UploadFileResult {
  fileKey: string;
  bucket: string;
  url: string;
  size: number;
  etag: string;
  metadata: StorageMetadata;
}

// List files input
export interface ListFilesInput {
  bucket: string;
  prefix?: string;
  limit?: number;
  marker?: string;
}

// List files result
export interface ListFilesResult {
  files: FileInfo[];
  nextMarker: string | null;
  truncated: boolean;
}

export interface FileInfo {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
}

// Get URL input
export interface GetFileUrlInput {
  bucket: string;
  fileKey: string;
  expirySeconds?: number;
}

// Delete file input
export interface DeleteFileInput {
  bucket: string;
  fileKey: string;
}

// Stat file input
export interface StatFileInput {
  bucket: string;
  fileKey: string;
}

// Stat file result
export interface StatFileResult {
  size: number;
  lastModified: Date;
  etag: string;
  contentType: string;
  metadata: Record<string, any>;
}

// Storage filters
export interface StorageMetadataFilters {
  bucketName?: string;
  entityScope?: 'kids_ascension' | 'ozean_licht' | 'shared';
  uploadedBy?: string;
  status?: 'active' | 'archived' | 'deleted' | 'processing';
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
}
```

2. Export all types in barrel file

**Acceptance Criteria:**
- [ ] All database columns mapped to TypeScript interfaces
- [ ] Domain types use camelCase (snake_case only in DB layer)
- [ ] Input/output types defined for all operations
- [ ] Filter types defined for querying metadata
- [ ] JSDoc comments on all types
- [ ] Types exported from index.ts
- [ ] No TypeScript errors

---

### Step 4: MCP Client Library - Storage Operations

**Goal:** Extend MCP client library with type-safe storage operations

**Files to Create:**
- `projects/admin/lib/mcp-client/storage.ts` - Storage client methods

**Files to Modify:**
- `projects/admin/lib/mcp-client/index.ts` - Export storage operations
- `projects/admin/lib/mcp-client/queries.ts` - Add storage metadata queries

**Implementation Details:**

1. Create `storage.ts` with storage-specific client class:

```typescript
import { MCPGatewayClient } from './client';
import type {
  UploadFileInput,
  UploadFileResult,
  ListFilesInput,
  ListFilesResult,
  GetFileUrlInput,
  DeleteFileInput,
  StatFileInput,
  StatFileResult,
  StorageMetadata,
  StorageMetadataFilters,
} from '../types/storage';

export class MCPStorageClient extends MCPGatewayClient {
  constructor(config: MCPClientConfig) {
    super(config);
  }

  /**
   * Upload file to MinIO bucket
   */
  async uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
    const result = await this.execute('minio', 'upload', {
      bucket: input.bucket,
      fileKey: input.fileKey,
      fileBuffer: input.fileBuffer.toString('base64'),
      contentType: input.contentType,
      metadata: input.metadata,
    });

    // Store metadata in database
    await this.createStorageMetadata({
      fileKey: input.fileKey,
      bucketName: input.bucket,
      originalFilename: input.metadata.originalFilename,
      contentType: input.contentType,
      fileSizeBytes: input.fileBuffer.length,
      entityScope: input.metadata.entityScope,
      uploadedBy: input.metadata.uploadedBy,
      tags: input.metadata.tags || [],
      metadata: input.metadata.customMetadata || {},
    });

    return result;
  }

  /**
   * List files in bucket
   */
  async listFiles(input: ListFilesInput): Promise<ListFilesResult> {
    return this.execute('minio', 'list', input);
  }

  /**
   * Get presigned URL for file
   */
  async getFileUrl(input: GetFileUrlInput): Promise<string> {
    const result = await this.execute('minio', 'getUrl', input);
    return result.url;
  }

  /**
   * Delete file from bucket
   */
  async deleteFile(input: DeleteFileInput): Promise<void> {
    await this.execute('minio', 'delete', input);

    // Soft delete in metadata table
    await this.query(
      `UPDATE admin_storage_metadata
       SET status = 'deleted', deleted_at = NOW()
       WHERE file_key = $1 AND bucket_name = $2`,
      [input.fileKey, input.bucket]
    );
  }

  /**
   * Get file metadata from MinIO
   */
  async statFile(input: StatFileInput): Promise<StatFileResult> {
    return this.execute('minio', 'stat', input);
  }

  /**
   * Create storage metadata record
   */
  private async createStorageMetadata(data: Partial<StorageMetadata>): Promise<StorageMetadata> {
    const rows = await this.query<StorageMetadataRow>(
      `INSERT INTO admin_storage_metadata (
        file_key, bucket_name, original_filename, content_type,
        file_size_bytes, entity_scope, uploaded_by, tags, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        data.fileKey,
        data.bucketName,
        data.originalFilename,
        data.contentType,
        data.fileSizeBytes,
        data.entityScope,
        data.uploadedBy,
        data.tags,
        JSON.stringify(data.metadata),
      ]
    );

    return this.mapStorageMetadata(rows[0]);
  }

  /**
   * List storage metadata with filters
   */
  async listStorageMetadata(filters: StorageMetadataFilters): Promise<StorageMetadata[]> {
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
      query += ` AND tags && $${paramCount++}`;
      params.push(filters.tags);
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

    const rows = await this.query<StorageMetadataRow>(query, params);
    return rows.map(this.mapStorageMetadata);
  }

  /**
   * Map database row to domain type
   */
  private mapStorageMetadata(row: StorageMetadataRow): StorageMetadata {
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
   * Health check for MinIO service
   */
  async healthCheckStorage(): Promise<{ healthy: boolean; message?: string }> {
    try {
      await this.execute('minio', 'health', {});
      return { healthy: true };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
```

2. Export in `index.ts`:
```typescript
export { MCPStorageClient } from './storage';
export type { MCPStorageClient as IMCPStorageClient } from './storage';
```

**Acceptance Criteria:**
- [ ] All 6 MinIO operations implemented (upload, list, getUrl, delete, stat, health)
- [ ] Storage metadata queries integrated (create, list with filters)
- [ ] Automatic metadata persistence on upload
- [ ] Soft delete updates metadata table
- [ ] Type-safe operations with full TypeScript coverage
- [ ] Error handling with proper error types
- [ ] Automatic retry logic inherited from base client
- [ ] Health check method for storage service
- [ ] Unit tests for all operations

---

### Step 5: React Components - File Upload & Management UI

**Goal:** Create React components for file upload and management in Admin Dashboard

**Files to Create:**
- `projects/admin/components/storage/FileUploadForm.tsx` - File upload form with drag-drop
- `projects/admin/components/storage/FileList.tsx` - File listing with pagination
- `projects/admin/components/storage/FileViewer.tsx` - File preview/viewer
- `projects/admin/components/storage/StorageStats.tsx` - Storage statistics dashboard

**Files to Modify:**
- `projects/admin/app/dashboard/layout.tsx` - Add storage nav link

**Implementation Details:**

1. **FileUploadForm.tsx:**
   - Drag-and-drop file upload with `react-dropzone`
   - File type validation (video, image, document)
   - File size validation with visual feedback
   - Progress bar during upload
   - Entity scope selection (KA/OL/Shared)
   - Bucket selection dropdown
   - Tag input for categorization
   - Success/error toast notifications

2. **FileList.tsx:**
   - Paginated table of files
   - Columns: thumbnail, filename, size, type, uploaded by, date, actions
   - Search/filter by filename, type, date range
   - Sort by name, size, date
   - Bulk actions (delete, archive)
   - Preview button (opens FileViewer)
   - Download button (generates presigned URL)
   - Delete button (soft delete with confirmation)

3. **FileViewer.tsx:**
   - Modal/drawer component
   - Image preview for images
   - Video player for videos
   - PDF viewer for documents
   - File metadata display (size, type, uploaded by, date)
   - Copy URL button
   - Download button
   - Delete button

4. **StorageStats.tsx:**
   - Total storage used (per bucket, per entity)
   - File count statistics
   - Recent uploads timeline
   - Storage growth chart
   - Top file types pie chart

**Acceptance Criteria:**
- [ ] File upload works with drag-drop and file picker
- [ ] Upload progress shown with visual feedback
- [ ] File validation enforces size and type limits
- [ ] File list displays with pagination and sorting
- [ ] Search and filter work correctly
- [ ] File preview works for images, videos, PDFs
- [ ] Presigned URLs generated correctly for download
- [ ] Delete confirmation modal prevents accidental deletion
- [ ] Storage stats accurately reflect usage
- [ ] All components are responsive (mobile-friendly)
- [ ] TypeScript types used throughout
- [ ] Error states handled with user-friendly messages

---

### Step 6: Admin Dashboard Pages - Storage Management

**Goal:** Create Admin Dashboard pages for storage management

**Files to Create:**
- `projects/admin/app/dashboard/storage/page.tsx` - Main storage page
- `projects/admin/app/dashboard/storage/layout.tsx` - Storage section layout
- `projects/admin/app/dashboard/storage/[bucket]/page.tsx` - Bucket-specific view

**Files to Modify:**
- `projects/admin/app/dashboard/page.tsx` - Add storage card to dashboard overview

**Implementation Details:**

1. **page.tsx (Main Storage):**
   - Storage statistics overview (StorageStats component)
   - Quick actions (upload file, create bucket)
   - Bucket list with usage metrics
   - Recent uploads section (last 10 files)
   - Storage health status indicator

2. **layout.tsx:**
   - Navigation tabs for different buckets
   - Breadcrumb navigation
   - Global search across all buckets

3. **[bucket]/page.tsx:**
   - FileList component filtered to specific bucket
   - FileUploadForm for uploading to this bucket
   - Bucket-specific settings (if admin)
   - Storage quota for bucket (if configured)

4. Update dashboard overview:
   - Add "Storage" card showing total usage
   - Link to storage management page

**Acceptance Criteria:**
- [ ] Storage overview page shows statistics and recent uploads
- [ ] Bucket-specific pages show filtered file lists
- [ ] Navigation between buckets works smoothly
- [ ] Upload form pre-selects current bucket
- [ ] Breadcrumb navigation shows current location
- [ ] Dashboard overview card links to storage page
- [ ] All pages require authentication (protected routes)
- [ ] Permission checks enforce access control
- [ ] Loading states shown during data fetch
- [ ] Error states handled gracefully

---

### Step 7: Testing - Unit & Integration Tests

**Goal:** Comprehensive test coverage for storage functionality

**Files to Create:**
- `projects/admin/tests/mcp-client/storage.test.ts` - Storage client unit tests
- `projects/admin/tests/integration/storage-e2e.test.ts` - E2E storage tests
- `infrastructure/mcp-gateway/tests/mcp/handlers/minio.test.ts` - MinIO handler tests

**Files to Modify:**
- `projects/admin/jest.config.js` - Update test patterns if needed

**Implementation Details:**

1. **Storage client tests:**
   - Test uploadFile with valid input
   - Test uploadFile with invalid input (error handling)
   - Test listFiles with pagination
   - Test getFileUrl generates valid URL
   - Test deleteFile soft deletes correctly
   - Test statFile returns metadata
   - Test healthCheckStorage returns status
   - Test listStorageMetadata with filters

2. **E2E tests (requires MinIO running):**
   - Upload file end-to-end
   - List uploaded files
   - Generate presigned URL and verify accessibility
   - Delete file and verify it's gone
   - Test multipart upload for large files
   - Test concurrent uploads

3. **MinIO handler tests:**
   - Test handler initialization
   - Test each operation with mock MinIO client
   - Test error handling for connection failures
   - Test health check
   - Test bucket creation on first upload
   - Test presigned URL generation

**Acceptance Criteria:**
- [ ] All client methods have unit tests
- [ ] Error handling scenarios covered
- [ ] Integration tests verify end-to-end flow
- [ ] Tests can run in isolation (no external dependencies for unit tests)
- [ ] Integration tests can be skipped via env var
- [ ] Test coverage > 80% for storage module
- [ ] All tests pass consistently
- [ ] Mock data realistic and comprehensive

---

### Step 8: Documentation & Configuration

**Goal:** Complete documentation and configuration for deployment

**Files to Create:**
- `projects/admin/app_docs/features/minio-s3-storage-integration.md` - Feature documentation

**Files to Modify:**
- `projects/admin/README.md` - Add storage section
- `infrastructure/mcp-gateway/README.md` - Document MinIO MCP service
- `infrastructure/mcp-gateway/.env.example` - Add MinIO env vars
- `projects/admin/.env.local.example` - Add storage-related env vars
- `docker-compose.yml` - Add MinIO service if not present

**Implementation Details:**

1. **Feature documentation:**
   - Overview of storage integration
   - Architecture diagram (three-tier storage)
   - Usage examples (upload, list, delete)
   - API reference for MCP client methods
   - Configuration guide
   - Troubleshooting common issues

2. **README updates:**
   - Add "Storage Management" section
   - Document environment variables
   - Add example usage code
   - Link to feature documentation

3. **Environment variables:**
   ```bash
   # MinIO Configuration
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin

   # Storage Configuration
   MINIO_DEFAULT_BUCKET=shared-assets
   MAX_FILE_SIZE_MB=500
   ALLOWED_FILE_TYPES=video/*,image/*,application/pdf
   PRESIGNED_URL_EXPIRY_SECONDS=300
   ```

4. **Docker Compose (if MinIO not present):**
   ```yaml
   minio:
     image: minio/minio:latest
     ports:
       - "9000:9000"
       - "9001:9001"
     environment:
       MINIO_ROOT_USER: minioadmin
       MINIO_ROOT_PASSWORD: minioadmin
     command: server /data --console-address ":9001"
     volumes:
       - minio-data:/data
     networks:
       - mcp-network

   volumes:
     minio-data:
   ```

**Acceptance Criteria:**
- [ ] Feature documentation complete with examples
- [ ] README updated with storage sections
- [ ] All environment variables documented
- [ ] .env.example files updated
- [ ] Docker Compose includes MinIO service
- [ ] Troubleshooting guide covers common issues
- [ ] Architecture diagrams included
- [ ] API reference matches implementation

---

## Testing Strategy

### Unit Tests

**Storage Client:**
- All methods (uploadFile, listFiles, getFileUrl, deleteFile, statFile)
- Error handling scenarios
- Input validation
- Metadata mapping (snake_case to camelCase)

**MinIO Handler:**
- Service initialization
- Each operation (upload, list, getUrl, delete, stat, health)
- Error handling for MinIO failures
- Connection pooling behavior

**Test Files:**
- `projects/admin/tests/mcp-client/storage.test.ts`
- `infrastructure/mcp-gateway/tests/mcp/handlers/minio.test.ts`

**Key Test Cases:**
- [ ] Upload file with valid data succeeds
- [ ] Upload file with invalid bucket fails gracefully
- [ ] List files returns paginated results
- [ ] List files with prefix filters correctly
- [ ] Get presigned URL generates valid URL
- [ ] Delete file marks as deleted in metadata
- [ ] Stat file returns correct metadata
- [ ] Health check detects connectivity issues

### Integration Tests

**End-to-End Storage Flow:**
- Upload file → verify in MinIO → list files → get URL → access file → delete file

**Test Files:**
- `projects/admin/tests/integration/storage-e2e.test.ts`

**Key Test Cases:**
- [ ] Complete upload-to-delete lifecycle works
- [ ] Concurrent uploads handled correctly
- [ ] Large file upload (multipart) succeeds
- [ ] Presigned URL expires after configured time
- [ ] Soft delete prevents file access
- [ ] Metadata query filters work correctly

### E2E Tests (Future - Playwright)

**UI Testing:**
- File upload via drag-drop
- File list pagination and sorting
- File preview in modal
- File download via presigned URL
- File deletion with confirmation

**Test Files:**
- `projects/admin/tests/e2e/storage.spec.ts` (future)

---

## Security Considerations

1. **File Upload Security:**
   - Validate file types against whitelist (no executables)
   - Enforce file size limits (prevent DoS)
   - Scan for malware before permanent storage (future)
   - Sanitize filenames to prevent path traversal

2. **Access Control:**
   - All operations require admin authentication
   - Entity scope enforced (admins can only access their entity's files)
   - Presigned URLs with short expiration (5 minutes default)
   - Audit all file operations (upload, delete, access)

3. **MinIO Security:**
   - Use strong access keys (not default "minioadmin")
   - Enable SSL in production (MINIO_USE_SSL=true)
   - Restrict bucket permissions (private by default)
   - Network isolation (Docker network, no public access)

4. **Data Protection:**
   - Files encrypted at rest (MinIO + server-side encryption)
   - Presigned URLs prevent direct MinIO access
   - Soft delete enables recovery window before permanent deletion
   - Audit trail for all file operations

---

## Performance Considerations

1. **Upload Performance:**
   - Use multipart upload for files > 100MB
   - Stream files to avoid memory exhaustion
   - Connection pooling for concurrent uploads
   - Progress tracking via chunked uploads

2. **List Performance:**
   - Paginated results (default 100 items)
   - Indexed queries on bucket and entity scope
   - Cache frequently accessed file lists (Redis future)

3. **Access Performance:**
   - Presigned URLs enable direct MinIO access (no gateway bottleneck)
   - CDN integration for public files (future)
   - Lazy loading for file previews

4. **Database Performance:**
   - Indexes on all foreign keys and query columns
   - JSONB indexes for metadata queries
   - GIN indexes for tag search
   - Periodic cleanup of soft-deleted records

**Performance Targets:**
- File upload < 5s for 10MB files
- File upload < 30s for 100MB files
- List files < 200ms for 1000 files
- Presigned URL generation < 50ms
- Delete operation < 100ms

---

## Rollout Plan

1. **Development:**
   - Implement in isolated worktree (9d6e020d)
   - Test with local MinIO instance
   - Run unit tests + integration tests

2. **Testing:**
   - Unit tests for all components
   - Integration tests with MCP Gateway + MinIO
   - Manual testing of UI components
   - Performance testing with large files

3. **Review:**
   - Code review by ADW review agent
   - Screenshot validation of UI
   - Security review of file handling
   - Documentation review

4. **Deployment:**
   - Execute database migration on production
   - Deploy MCP Gateway with MinIO handler
   - Deploy Admin Dashboard with storage UI
   - Monitor for errors and performance

5. **Post-Deployment:**
   - Verify MinIO connectivity
   - Test file upload/download flow
   - Monitor storage metrics
   - Set up alerts for storage quota

---

## Success Criteria

- [ ] All functional requirements met
- [ ] MinIO MCP handler operational in gateway
- [ ] Storage metadata table created and indexed
- [ ] MCP client library supports all storage operations
- [ ] Admin UI allows upload, list, preview, delete
- [ ] All tests passing (unit + integration)
- [ ] TypeScript compiles without errors
- [ ] Code follows repository conventions
- [ ] Documentation complete and accurate
- [ ] No console errors or warnings
- [ ] Performance meets targets (< 5s for 10MB upload)
- [ ] Security review passed
- [ ] Audit logging captures all operations

---

## Potential Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| MinIO connection failures | High | Medium | Automatic retries, health checks, connection pooling |
| Large file uploads timeout | Medium | Medium | Multipart uploads, progress tracking, configurable timeouts |
| Storage quota exceeded | Medium | Low | Storage monitoring, alerts, quota enforcement |
| File type validation bypass | High | Low | Server-side validation, whitelist approach, malware scanning (future) |
| Presigned URL leakage | Medium | Low | Short expiration (5 min), audit access logs |
| Concurrent upload conflicts | Low | Low | Unique file keys with timestamp/UUID, transaction handling |
| Database migration failure | High | Low | Idempotent migration, rollback SQL, test on staging first |
| MCP Gateway performance | Medium | Medium | Connection pooling, Prometheus metrics, horizontal scaling (future) |

---

## Notes

### Institutional Memory Integration

This implementation will store learnings in Mem0:
- **Pattern:** MinIO integration through MCP Gateway (reusable for other S3-compatible storage)
- **Architecture Decision:** Three-tier storage strategy (hot→cold→CDN)
- **Best Practice:** Presigned URLs with short expiration for security
- **Error Resolution:** Connection pooling prevents exhaustion with concurrent uploads

### Future Enhancements

1. **Phase 2 (Post-MVP):**
   - Cloudflare R2 integration (cold archive tier)
   - Cloudflare Stream integration (video delivery)
   - Automatic archival pipeline (MinIO → R2 → Stream)
   - CDN integration for public assets

2. **Phase 3 (Scale):**
   - Redis caching for file lists
   - Malware scanning integration (ClamAV)
   - Advanced search (full-text on metadata)
   - Bulk operations (multi-file upload, batch delete)

3. **Phase 4 (Enterprise):**
   - Multi-region MinIO replication
   - Advanced quota management per entity
   - Storage analytics dashboard
   - Automated cleanup policies (auto-delete after N days)

### Dependencies

**NPM Packages:**
- `minio` (^7.1.0) - Official MinIO client for Node.js
- `@types/minio` (^7.1.0) - TypeScript types
- `react-dropzone` (^14.2.0) - File upload UI component

**Infrastructure:**
- MinIO server (Docker container)
- PostgreSQL with admin schema applied
- MCP Gateway operational

### Integration Points

This feature integrates with:
1. **MCP Gateway** - New MinIO service handler
2. **Admin Dashboard** - New storage management pages
3. **Database** - New storage metadata table
4. **Future Video Pipeline** - Foundation for upload→moderation→archive→stream

---

**End of Plan**
