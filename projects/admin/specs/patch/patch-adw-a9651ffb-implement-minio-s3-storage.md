# Patch: Implement MinIO S3 Storage Integration

## Metadata
adw_id: `a9651ffb`
review_change_request: `Implement MinIO S3 storage integration for the admin dashboard to enable file upload, storage management, and integration with the three-tier storage system (MinIO → R2 → Stream)`

## Issue Summary
**Original Spec:** None (new feature implementation)
**Issue:** The admin dashboard lacks MinIO S3 storage integration, preventing file uploads and storage management functionality
**Solution:** Implement MCP client for MinIO operations, create storage management UI components, add server actions for file operations, and integrate with existing MCP Gateway infrastructure

## Files to Modify
Use these files to implement the patch:

**New Files to Create:**
- `projects/admin/lib/mcp-client/storage.ts` - MinIO MCP client operations
- `projects/admin/types/storage.ts` - TypeScript types for storage operations
- `projects/admin/components/storage/FileUploader.tsx` - File upload component
- `projects/admin/components/storage/StorageManager.tsx` - Storage management UI
- `projects/admin/components/storage/StorageBucketCard.tsx` - Bucket display component
- `projects/admin/app/(dashboard)/storage/page.tsx` - Storage dashboard page
- `projects/admin/app/(dashboard)/storage/actions.ts` - Server actions for storage ops
- `projects/admin/tests/mcp-client/storage.test.ts` - Unit tests for storage client

**Files to Update:**
- `projects/admin/lib/mcp-client/index.ts` - Export storage client
- `projects/admin/types/index.ts` - Export storage types
- `projects/admin/components/dashboard/Sidebar.tsx` - Add storage navigation link
- `projects/admin/lib/mcp-client/config.ts` - Add MinIO configuration (if needed)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create storage TypeScript types
- Define `StorageBucket`, `StorageObject`, `UploadOptions`, `UploadProgress` interfaces
- Define `StorageStats`, `BucketInfo` types for dashboard metrics
- Add error types for storage operations

### Step 2: Implement MinIO MCP client library
- Create `storage.ts` with MinIO operations via MCP Gateway
- Implement `listBuckets()`, `createBucket()`, `deleteBucket()` methods
- Implement `uploadFile()`, `downloadFile()`, `deleteFile()` methods
- Implement `listObjects()`, `getObjectMetadata()` methods
- Add `getStorageStats()` for bucket usage metrics
- Handle multipart uploads for large files
- Implement proper error handling and retry logic

### Step 3: Create storage management UI components
- Build `FileUploader.tsx` with drag-and-drop support and progress tracking
- Build `StorageBucketCard.tsx` to display bucket info (name, size, object count)
- Build `StorageManager.tsx` as main storage interface with bucket list and file operations
- Add upload progress indicators and file type validation
- Implement file preview for supported formats (images, PDFs)

### Step 4: Create storage dashboard page and server actions
- Implement `/storage/page.tsx` with StorageManager component
- Create `actions.ts` with server-side storage operations
- Add bucket creation, deletion, and listing actions
- Add file upload, download, and deletion actions
- Implement proper authentication and authorization checks
- Add audit logging for storage operations

### Step 5: Update navigation and exports
- Add "Storage" link to Sidebar navigation with appropriate icon
- Export storage client from `lib/mcp-client/index.ts`
- Export storage types from `types/index.ts`
- Update MCP client config if MinIO-specific settings needed

### Step 6: Write comprehensive tests
- Create unit tests for storage MCP client operations
- Test bucket creation, listing, and deletion
- Test file upload, download, and deletion
- Test error handling and edge cases
- Verify proper cleanup after tests

## Validation
Execute every command to validate the patch is complete with zero regressions.

### 1. TypeScript compilation
```bash
cd projects/admin
pnpm run build
```

### 2. Run storage client tests
```bash
cd projects/admin
pnpm test tests/mcp-client/storage.test.ts
```

### 3. Run all MCP client tests
```bash
cd projects/admin
pnpm test tests/mcp-client/
```

### 4. Start development server and verify storage page
```bash
cd projects/admin
pnpm dev
# Navigate to http://localhost:9203/storage and verify UI renders correctly
```

### 5. Manual verification checklist
- [ ] Storage page accessible from sidebar navigation
- [ ] Can list existing buckets
- [ ] Can create new bucket
- [ ] Can upload file to bucket with progress indicator
- [ ] Can list files in bucket
- [ ] Can download file from bucket
- [ ] Can delete file from bucket
- [ ] Error handling works for invalid operations
- [ ] UI is responsive and matches design system

## Patch Scope
**Lines of code to change:** ~800-1000 (new feature implementation)
**Risk level:** low-medium
**Testing required:** Unit tests for MCP client, manual testing of UI components and file operations, verify integration with MCP Gateway MinIO service
