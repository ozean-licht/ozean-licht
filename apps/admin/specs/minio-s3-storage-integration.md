# MinIO S3 Storage Integration Specification

## Executive Summary

This specification outlines the implementation of MinIO S3 storage integration for the Ozean Licht Ecosystem, including MCP Gateway support, file management interface, and entity-based theming. The system will enable autonomous agents to manage storage operations while providing a modern administrative interface for file management across multiple entities.

## Project Context

**Issue Type:** Feature Enhancement
**Priority:** High
**Entities Affected:** Kids Ascension, Ozean Licht
**Components:** MCP Gateway, Admin Dashboard, Storage Infrastructure

## Current State

### Existing Infrastructure
- MinIO deployed on Coolify at http://138.201.139.25:9000
- Environment variables configured in Coolify shared variables
- MCP Gateway architecture in place with support for multiple services
- Admin dashboard with entity switching capability

### Limitations
- No MCP handler for MinIO/S3 operations
- No file management interface in admin dashboard
- No structured bucket organization for multi-entity system
- Manual file operations required

## Proposed Solution

### 1. MCP Gateway MinIO Handler Implementation

#### 1.1 Handler Architecture
Create new MCP handler at `/infrastructure/mcp-gateway/src/mcp/handlers/minio.ts`:

```typescript
interface MinioMCPHandler {
  // Bucket Operations
  createBucket(name: string, region?: string): Promise<void>
  listBuckets(): Promise<BucketInfo[]>
  deleteBucket(name: string): Promise<void>
  getBucketPolicy(name: string): Promise<BucketPolicy>
  setBucketPolicy(name: string, policy: BucketPolicy): Promise<void>

  // Object Operations
  putObject(bucket: string, key: string, data: Buffer, metadata?: ObjectMetadata): Promise<void>
  getObject(bucket: string, key: string): Promise<ObjectData>
  deleteObject(bucket: string, key: string): Promise<void>
  listObjects(bucket: string, prefix?: string): Promise<ObjectInfo[]>
  copyObject(source: ObjectLocation, dest: ObjectLocation): Promise<void>

  // Presigned URLs
  getPresignedUrl(bucket: string, key: string, expiry?: number): Promise<string>
  putPresignedUrl(bucket: string, key: string, expiry?: number): Promise<string>

  // Multipart Upload
  initiateMultipartUpload(bucket: string, key: string): Promise<string>
  uploadPart(uploadId: string, partNumber: number, data: Buffer): Promise<string>
  completeMultipartUpload(uploadId: string, parts: Part[]): Promise<void>
}
```

#### 1.2 Slash Commands
Register the following slash commands:

```
/mcp-minio create-bucket <bucket-name> [region]
/mcp-minio list-buckets
/mcp-minio upload <bucket> <key> <file-path>
/mcp-minio download <bucket> <key> [output-path]
/mcp-minio list-objects <bucket> [prefix]
/mcp-minio delete-object <bucket> <key>
/mcp-minio get-url <bucket> <key> [expiry-minutes]
/mcp-minio set-policy <bucket> <policy-type>
```

### 2. Storage Bucket Structure

#### 2.1 Root Bucket Organization
```
ozean-ecosystem/
├── kids-ascension/
│   ├── videos/
│   │   ├── raw/           # Original uploads (staging)
│   │   ├── approved/      # Approved videos
│   │   └── transcoded/    # Processed videos
│   ├── images/
│   │   ├── logos/         # Brand assets
│   │   ├── thumbnails/    # Video thumbnails
│   │   └── content/       # Course images
│   ├── documents/
│   │   └── curricula/     # Educational materials
│   └── temp/              # Temporary files (30-day TTL)
│
├── ozean-licht/
│   ├── courses/
│   │   ├── videos/        # Course videos
│   │   └── materials/     # Course documents
│   ├── images/
│   │   ├── logos/         # Brand assets
│   │   └── content/       # Platform images
│   ├── documents/
│   │   └── membership/    # Member documents
│   └── temp/              # Temporary files
│
├── shared/
│   ├── admin/             # Admin-specific files
│   │   ├── backups/       # Database backups
│   │   └── exports/       # Data exports
│   └── system/            # System files
│       └── logs/          # Audit logs
│
└── archive/               # Long-term cold storage
    ├── kids-ascension/
    └── ozean-licht/
```

#### 2.2 Bucket Policies
```json
{
  "kids-ascension": {
    "public": ["images/logos/*", "images/thumbnails/*"],
    "private": ["videos/raw/*", "documents/*"],
    "lifecycle": {
      "temp/*": { "expiration": 30 }
    }
  },
  "ozean-licht": {
    "public": ["images/logos/*"],
    "private": ["courses/*", "documents/*"],
    "lifecycle": {
      "temp/*": { "expiration": 30 }
    }
  }
}
```

### 3. Admin Dashboard File Management Interface

#### 3.1 Component Structure
```
components/storage/
├── FileManager.tsx         # Main file manager component
├── EntitySelector.tsx      # Dropdown for entity selection
├── FileExplorer.tsx       # File/folder tree view
├── FileUploader.tsx       # Drag-and-drop upload
├── FilePreview.tsx        # Preview images/videos
├── FileActions.tsx        # Context menu actions
└── StorageMetrics.tsx     # Usage statistics
```

#### 3.2 File Manager Features
- **Entity-based navigation** with dropdown selector
- **Drag-and-drop upload** with progress indicators
- **Bulk operations** (select multiple, move, delete)
- **Search and filter** capabilities
- **File preview** for images and videos
- **Metadata editing** (tags, descriptions)
- **Presigned URL generation** for sharing
- **Usage metrics** per entity

#### 3.3 UI Components (ShadCN)
```typescript
// Entity Selector Component
<Select value={selectedEntity} onValueChange={setSelectedEntity}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select entity" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="kids-ascension">
      <div className="flex items-center gap-2">
        <img src="/logos/ka-icon.png" className="w-4 h-4" />
        Kids Ascension
      </div>
    </SelectItem>
    <SelectItem value="ozean-licht">
      <div className="flex items-center gap-2">
        <img src="/logos/ol-icon.png" className="w-4 h-4" />
        Ozean Licht
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### 4. Theme Switching System

#### 4.1 Theme Configuration
```typescript
const entityThemes = {
  'kids-ascension': {
    primary: '#4CAF50',      // Green
    secondary: '#8BC34A',
    accent: '#FFC107',       // Yellow
    background: '#F5F5F5',
    surface: '#FFFFFF',
    logo: '/logos/kids-ascension-logo.png',
    favicon: '/favicons/ka.ico'
  },
  'ozean-licht': {
    primary: '#2196F3',      // Blue
    secondary: '#03A9F4',
    accent: '#00BCD4',       // Cyan
    background: '#FAFAFA',
    surface: '#FFFFFF',
    logo: '/logos/ozean-licht-logo.webp',
    favicon: '/favicons/ol.ico'
  }
}
```

#### 4.2 Theme Context Provider
```typescript
export const ThemeProvider: React.FC = ({ children }) => {
  const [currentEntity, setCurrentEntity] = useState('kids-ascension');

  useEffect(() => {
    const theme = entityThemes[currentEntity];
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    // Apply all theme variables
  }, [currentEntity]);

  return (
    <ThemeContext.Provider value={{ currentEntity, setCurrentEntity }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 5. Implementation Dependencies

#### 5.1 Pre-requisites (Must be completed before SDLC)

1. **Infrastructure Setup**
   - ✅ MinIO deployed on Coolify (COMPLETED)
   - ✅ Environment variables configured (COMPLETED)
   - ⏳ SSL certificate for MinIO endpoint
   - ⏳ CORS configuration for browser access

2. **MCP Gateway Preparation**
   - ⏳ Update package.json with MinIO SDK dependency
   - ⏳ Add MinIO configuration to environment types
   - ⏳ Update service registry schema
   - ⏳ Add MinIO health check endpoint

3. **Database Schema Updates**
   ```sql
   -- Add to admin database
   CREATE TABLE file_metadata (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     entity_id VARCHAR(50) NOT NULL,
     bucket VARCHAR(255) NOT NULL,
     key VARCHAR(500) NOT NULL,
     size BIGINT NOT NULL,
     content_type VARCHAR(100),
     metadata JSONB,
     uploaded_by UUID REFERENCES admin_users(id),
     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_accessed TIMESTAMP,
     access_count INTEGER DEFAULT 0,
     UNIQUE(bucket, key)
   );

   CREATE INDEX idx_file_metadata_entity ON file_metadata(entity_id);
   CREATE INDEX idx_file_metadata_uploaded_by ON file_metadata(uploaded_by);
   ```

4. **Admin Dashboard Setup**
   - ⏳ Install required dependencies (react-dropzone, file-icons)
   - ⏳ Update navigation to include Storage section
   - ⏳ Add storage permissions to RBAC system

#### 5.2 External Dependencies
```json
{
  "dependencies": {
    "minio": "^7.1.3",
    "@aws-sdk/client-s3": "^3.400.0",
    "react-dropzone": "^14.2.3",
    "file-icons-js": "^1.1.0",
    "@radix-ui/react-select": "^2.0.0",
    "bytes": "^3.1.2"
  }
}
```

### 6. Testing Strategy

#### 6.1 Initial Test Uploads
```typescript
// Test script for logo uploads
async function testInitialUploads() {
  const files = [
    {
      path: '/opt/ozean-licht-ecosystem/temp/assets/kids-ascension-logo.png',
      bucket: 'ozean-ecosystem',
      key: 'kids-ascension/images/logos/main-logo.png'
    },
    {
      path: '/opt/ozean-licht-ecosystem/temp/assets/ozean-licht-logo.webp',
      bucket: 'ozean-ecosystem',
      key: 'ozean-licht/images/logos/main-logo.webp'
    }
  ];

  for (const file of files) {
    await mcp.execute('/mcp-minio upload', {
      bucket: file.bucket,
      key: file.key,
      filePath: file.path
    });
  }
}
```

#### 6.2 Test Scenarios
1. **Bucket Operations**
   - Create entity buckets
   - Set appropriate policies
   - Verify access controls

2. **File Operations**
   - Upload test logos
   - Generate presigned URLs
   - Download verification
   - Delete operations

3. **UI Testing**
   - Entity switching
   - Theme application
   - File upload/download
   - Bulk operations

4. **Integration Testing**
   - MCP command execution
   - Database metadata sync
   - Audit logging

### 7. Security Considerations

1. **Access Control**
   - Entity-based isolation
   - Role-based permissions (admin, viewer, uploader)
   - Presigned URLs with expiration

2. **Data Protection**
   - Encryption at rest
   - Secure transport (HTTPS)
   - Audit trail for all operations

3. **Resource Limits**
   - File size limits (100MB default, 1GB video)
   - Rate limiting on uploads
   - Storage quotas per entity

### 8. Success Criteria

- [ ] MCP Gateway MinIO handler fully implemented
- [ ] All slash commands functional
- [ ] Bucket structure created as specified
- [ ] Test files successfully uploaded
- [ ] File manager UI operational
- [ ] Entity switching with theme changes working
- [ ] All tests passing
- [ ] Documentation complete

### 9. Implementation Timeline

**Phase 1: MCP Handler (2 days)**
- Day 1: Handler implementation
- Day 2: Slash command integration

**Phase 2: Infrastructure (1 day)**
- Database schema updates
- Bucket creation and policies

**Phase 3: UI Development (3 days)**
- Day 1: File manager components
- Day 2: Entity selector and theming
- Day 3: Integration and polish

**Phase 4: Testing (1 day)**
- Comprehensive test suite execution
- Bug fixes and optimization

**Total: 7 days**

### 10. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| MinIO connectivity issues | High | Implement retry logic and circuit breakers |
| Large file uploads failing | Medium | Implement multipart upload for files >5MB |
| Theme switching performance | Low | Use CSS variables for instant switching |
| Storage quota exceeded | Medium | Implement monitoring and alerts |

### 11. Future Enhancements

1. **Advanced Features**
   - Video thumbnail generation
   - Image optimization pipeline
   - Document preview (PDF, DOCX)
   - Collaborative features (comments, sharing)

2. **Integration**
   - Cloudflare R2 migration path
   - Backup automation to cold storage
   - CDN integration for public files

3. **Analytics**
   - Storage usage trends
   - Access patterns analysis
   - Cost optimization recommendations

## Appendix A: MCP Command Examples

```bash
# Create bucket structure
/mcp-minio create-bucket ozean-ecosystem
/mcp-minio create-bucket ozean-ecosystem-archive

# Upload logos
/mcp-minio upload ozean-ecosystem kids-ascension/images/logos/main-logo.png /temp/assets/kids-ascension-logo.png
/mcp-minio upload ozean-ecosystem ozean-licht/images/logos/main-logo.webp /temp/assets/ozean-licht-logo.webp

# Set bucket policies
/mcp-minio set-policy ozean-ecosystem public-read-logos

# Generate sharing URL
/mcp-minio get-url ozean-ecosystem kids-ascension/images/logos/main-logo.png 60
```

## Appendix B: Environment Configuration

```env
# MinIO Configuration (Already in Coolify)
MINIO_ENDPOINT=http://138.201.139.25:9000
MINIO_ACCESS_KEY=***
MINIO_SECRET_KEY=***
MINIO_USE_SSL=false
MINIO_REGION=eu-central-1

# Additional Configuration Needed
MINIO_DEFAULT_BUCKET=ozean-ecosystem
MINIO_MAX_FILE_SIZE=104857600  # 100MB
MINIO_VIDEO_MAX_SIZE=1073741824 # 1GB
MINIO_PRESIGNED_EXPIRY=3600    # 1 hour
```

---

**Specification Version:** 1.0.0
**Author:** System Architect
**Date:** 2025-11-02
**Status:** Ready for Implementation