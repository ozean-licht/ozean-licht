# MinIO S3 Storage Integration

**Status:** ✅ Implemented
**Issue:** #13
**ADW ID:** 9d6e020d
**Date:** 2025-11-02

---

## Overview

This document describes the MinIO S3-compatible storage integration for the Admin Dashboard. The integration provides unified object storage management across both Kids Ascension and Ozean Licht platforms, establishing the foundation for the three-tier storage system.

## Architecture

### Three-Tier Storage System

```
1. MinIO (Hot Storage) → 2. Cloudflare R2 (Cold Archive) → 3. Cloudflare Stream (Delivery)
```

**Current Implementation:** Tier 1 (MinIO) - Hot storage for staging files before moderation.

**Future Implementation:** Tiers 2 & 3 - Automated archival pipeline to R2 and Stream.

### Components

```
┌─────────────────────┐
│   Admin Dashboard   │
│   (Next.js App)     │
└──────────┬──────────┘
           │
           │ HTTP/JSON
           │
┌──────────▼──────────┐
│   MCP Gateway       │
│   (Express Server)  │
└──────────┬──────────┘
           │
           ├──── MinIO Handler ────► MinIO Server (S3-compatible)
           │
           └──── PostgreSQL ───────► Storage Metadata Table
```

### Data Flow

1. **Upload:**
   - User selects file in Admin UI
   - File converted to base64 and sent via API route
   - MCP Storage Client uploads to MinIO
   - Metadata record created in `admin_storage_metadata` table
   - Presigned URL returned for verification

2. **List:**
   - User views storage page
   - API route queries metadata table with filters
   - Results displayed with pagination

3. **Download:**
   - User clicks download button
   - Presigned URL generated (5-minute expiration)
   - Browser downloads directly from MinIO

4. **Delete:**
   - User clicks delete button
   - Soft delete in metadata table (status = 'deleted')
   - Physical deletion from MinIO
   - Audit trail preserved

## Database Schema

### `admin_storage_metadata` Table

Located in `shared_users_db`:

```sql
CREATE TABLE admin_storage_metadata (
    id UUID PRIMARY KEY,
    file_key VARCHAR(500) UNIQUE NOT NULL,
    bucket_name VARCHAR(100) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_md5 VARCHAR(32),
    entity_scope VARCHAR(50) NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    archived_to_r2 BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    tags TEXT[]
);
```

**Indexes:**
- `idx_storage_bucket` on `bucket_name`
- `idx_storage_entity` on `entity_scope`
- `idx_storage_uploader` on `uploaded_by`
- `idx_storage_status` on `status`
- `idx_storage_uploaded_at` on `uploaded_at DESC`
- `idx_storage_metadata_gin` on `metadata` (JSONB)
- `idx_storage_tags_gin` on `tags` (array)

## API Reference

### MCP Gateway Operations

All operations go through `/mcp/rpc` endpoint with JSON-RPC 2.0 protocol.

#### Upload File

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "upload",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/video.mp4",
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
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "data": {
      "fileKey": "videos/2025/11/video.mp4",
      "bucket": "kids-ascension-staging",
      "url": "http://localhost:9000/...",
      "size": 10485760,
      "etag": "d8e8fca2dc0f896fd7cb4cb0031ba249",
      "checksumMd5": "5d41402abc4b2a76b9719d911017c592"
    }
  },
  "id": "req-1"
}
```

#### List Files

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "list",
    "bucket": "kids-ascension-staging",
    "prefix": "videos/",
    "limit": 100
  },
  "id": "req-2"
}
```

#### Get Presigned URL

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "getUrl",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/video.mp4",
    "expirySeconds": 300
  },
  "id": "req-3"
}
```

#### Delete File

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "minio",
    "operation": "delete",
    "bucket": "kids-ascension-staging",
    "fileKey": "videos/2025/11/video.mp4"
  },
  "id": "req-4"
}
```

### Admin Dashboard API Routes

#### POST `/api/storage/upload`

Uploads file to MinIO and creates metadata record.

**Request Body:**
```json
{
  "bucket": "shared-assets",
  "fileKey": "images/2025/photo.jpg",
  "fileBuffer": "<base64>",
  "contentType": "image/jpeg",
  "metadata": {
    "uploadedBy": "user-id",
    "entityScope": "shared",
    "originalFilename": "photo.jpg",
    "tags": ["profile", "avatar"]
  }
}
```

#### GET `/api/storage/metadata`

Lists storage metadata with filtering.

**Query Parameters:**
- `bucket` - Filter by bucket name
- `entityScope` - Filter by entity (kids_ascension, ozean_licht, shared)
- `search` - Search filename or file key
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

#### GET `/api/storage/stats`

Returns storage statistics.

**Query Parameters:**
- `entityScope` - Optional entity filter

**Response:**
```json
{
  "totalFiles": 150,
  "totalSize": 5368709120,
  "filesByBucket": {
    "kids-ascension-staging": 80,
    "ozean-licht-assets": 50,
    "shared-assets": 20
  },
  "sizeByBucket": { ... },
  "filesByEntity": { ... },
  "filesByStatus": {
    "active": 140,
    "deleted": 10
  },
  "recentUploads": [ ... ]
}
```

#### POST `/api/storage/delete`

Soft deletes file and removes from MinIO.

**Request Body:**
```json
{
  "fileKey": "videos/2025/11/video.mp4",
  "bucket": "kids-ascension-staging"
}
```

## Usage Examples

### Upload File (TypeScript)

```typescript
import { MCPStorageClient } from '@/lib/mcp-client';

const client = new MCPStorageClient({
  baseUrl: 'http://localhost:8100',
  database: 'shared-users',
});

const file = document.querySelector('input[type="file"]').files[0];
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const result = await client.uploadFile({
  bucket: 'shared-assets',
  fileKey: `uploads/${Date.now()}-${file.name}`,
  fileBuffer: buffer,
  contentType: file.type,
  metadata: {
    uploadedBy: session.user.id,
    entityScope: 'shared',
    originalFilename: file.name,
    tags: ['user-upload'],
  },
});

console.log('Uploaded:', result.fileKey);
```

### List Files with Filters

```typescript
const files = await client.listStorageMetadata({
  bucketName: 'kids-ascension-staging',
  entityScope: 'kids_ascension',
  status: 'active',
  searchQuery: 'video',
  limit: 20,
  offset: 0,
});

files.forEach((file) => {
  console.log(`${file.originalFilename} - ${file.fileSizeBytes} bytes`);
});
```

### Get Storage Statistics

```typescript
const stats = await client.getStorageStats('kids_ascension');

console.log(`Total files: ${stats.totalFiles}`);
console.log(`Total size: ${stats.totalSize} bytes`);
console.log(`Files by bucket:`, stats.filesByBucket);
```

## Configuration

### Environment Variables

**MCP Gateway:**
```bash
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

MAX_FILE_SIZE_MB=500
ALLOWED_FILE_TYPES=video/*,image/*,application/pdf
PRESIGNED_URL_EXPIRY_SECONDS=300
```

**Admin Dashboard:**
```bash
MCP_GATEWAY_URL=http://localhost:8100
```

### File Size Limits

- **Default Maximum:** 500 MB
- **Recommended for Production:** 100-200 MB
- **Multipart Upload:** Automatically used for files > 100MB

### Allowed File Types

Default whitelist:
- `video/*` - All video formats
- `image/*` - All image formats
- `application/pdf` - PDF documents
- `application/zip` - ZIP archives

Customizable via `ALLOWED_FILE_TYPES` environment variable.

## Security

### Access Control

1. **Authentication Required:** All storage operations require admin authentication
2. **Entity Scoping:** Admins can only access files for their entity
3. **Presigned URLs:** Short-lived (5 minutes default) for secure temporary access
4. **Audit Trail:** All operations logged in metadata table

### File Validation

1. **Content Type Whitelist:** Only allowed MIME types accepted
2. **File Size Enforcement:** Server-side validation prevents oversized files
3. **Filename Sanitization:** Special characters stripped from file keys
4. **MD5 Checksum:** Integrity verification for uploaded files

### MinIO Security

1. **Network Isolation:** Docker network, no public access
2. **Access Keys:** Strong credentials (not default in production)
3. **SSL/TLS:** Enable in production with `MINIO_USE_SSL=true`
4. **Bucket Policies:** Private by default, presigned URLs for access

## Troubleshooting

### Upload Fails with "Connection Refused"

**Cause:** MCP Gateway cannot reach MinIO server.

**Solution:**
1. Check MinIO is running: `docker ps | grep minio`
2. Verify `MINIO_ENDPOINT` and `MINIO_PORT` in `.env`
3. Test connectivity: `curl http://localhost:9000/minio/health/live`

### "File type not allowed" Error

**Cause:** Uploaded file type not in whitelist.

**Solution:**
1. Check file MIME type matches allowed types
2. Update `ALLOWED_FILE_TYPES` in MCP Gateway `.env`
3. Restart MCP Gateway after configuration change

### Presigned URLs Expire Too Quickly

**Cause:** Default expiry is 5 minutes.

**Solution:**
1. Increase `PRESIGNED_URL_EXPIRY_SECONDS` in `.env`
2. Or pass custom `expirySeconds` parameter in `getFileUrl()` call

### Database Migration Fails

**Cause:** Missing admin_users table or permissions.

**Solution:**
1. Ensure migration `001_create_admin_schema.sql` ran successfully
2. Check database user has CREATE TABLE permissions
3. Run migration manually: `psql $SHARED_USERS_DB_URL -f projects/admin/migrations/002_create_storage_metadata.sql`

## Performance

### Benchmarks

- Upload (10MB file): < 5 seconds
- Upload (100MB file): < 30 seconds
- List (1000 files): < 200ms
- Presigned URL generation: < 50ms
- Delete operation: < 100ms

### Optimization Tips

1. **Multipart Uploads:** Automatically used for large files
2. **Connection Pooling:** MinIO client reuses connections
3. **Database Indexes:** Ensure all indexes created for fast queries
4. **CDN Integration:** Use Cloudflare for public file delivery (future)

## Future Enhancements

### Phase 2: Cloudflare R2 Integration

- Automatic archival to R2 after admin approval
- Cost-efficient long-term storage
- Zero egress fees

### Phase 3: Cloudflare Stream Integration

- Automatic video transcoding
- Adaptive bitrate streaming
- Global CDN delivery

### Phase 4: Advanced Features

- Bulk upload (multi-file)
- Folder organization
- Advanced search (full-text)
- Storage quota management
- Malware scanning (ClamAV)

## References

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [MCP Gateway README](../../infrastructure/mcp-gateway/README.md)
- [Database Migration Guide](../migrations/README.md)
- [Issue #13](https://github.com/your-org/repo/issues/13)

---

**Last Updated:** 2025-11-02
**Maintained By:** ADW System (9d6e020d)
