# Plan: Ozean Cloud Dashboard Page

**Status:** Ready to Implement
**Type:** Feature
**Complexity:** Medium
**Last Updated:** 2025-11-26

## Task Description

Build the "Ozean Cloud" dashboard page — a production-ready cloud storage interface within the Admin Dashboard that integrates the existing storage UI components (`shared/ui/src/storage/`) with the MinIO backend via MCP Gateway. The sidebar navigation already has an entry at `/dashboard/tools/cloud`.

## Objective

Create a fully functional storage management interface where admin users can:
- Browse files in list/grid view with navigation breadcrumbs
- Upload files via drag & drop with progress tracking
- Download, delete, and manage files (single and bulk operations)
- Search and filter files by type, date, and size
- View storage quota and statistics
- Preview images, videos, and PDFs inline
- Create folders and organize content
- Switch between buckets (kids-ascension-staging, ozean-licht-assets, shared-assets)

## Problem Statement

The Admin Dashboard has:
- ✅ Complete MinIO S3 backend via MCP Gateway (`tools/mcp-gateway/src/mcp/handlers/minio.ts`)
- ✅ 19 storage UI components in `shared/ui/src/storage/` and `shared/ui/src/branded/storage/`
- ✅ Database schema for metadata (`admin_storage_metadata`)
- ✅ TypeScript types defined (`apps/admin/types/storage.ts`)
- ✅ Sidebar navigation entry ("Ozean Cloud" → `/dashboard/tools/cloud`)
- ❌ **No actual page implementation at `/dashboard/tools/cloud/`**

## Solution Approach

1. Create the route structure at `apps/admin/app/dashboard/tools/cloud/`
2. Build server actions for MCP Gateway storage operations
3. Create a storage client wrapper for type-safe API calls
4. Compose the FileBrowser orchestrator with real data
5. Add state management for view mode, filters, and uploads
6. Wire up all CRUD operations with proper error handling

## Relevant Files

### Existing Components (Import From)
- `@ozean-licht/shared-ui` → Storage components (FileBrowser, FileDropzone, etc.)
- `@ozean-licht/shared-ui` → Branded storage (FileListItem, FileGridItem, ViewModeToggle, etc.)
- `apps/admin/types/storage.ts` → Storage TypeScript types
- `apps/admin/lib/mcp-client/client.ts` → MCPGatewayClient base class
- `apps/admin/lib/auth-utils.ts` → `requireAuth()` function

### Backend Reference
- `tools/mcp-gateway/src/mcp/handlers/minio.ts` → MinIO handler (upload, list, getUrl, delete, stat, health)
- `apps/admin/docs/features/minio-s3-storage-integration.md` → API documentation

### Pattern Reference
- `apps/admin/app/dashboard/system/health/page.tsx` → Page pattern with state
- `apps/admin/app/dashboard/system/health/actions.ts` → Server actions pattern

### New Files

#### Route Structure
- `apps/admin/app/dashboard/tools/cloud/page.tsx` - Main cloud storage page
- `apps/admin/app/dashboard/tools/cloud/layout.tsx` - Optional layout wrapper
- `apps/admin/app/dashboard/tools/cloud/actions.ts` - Server actions for storage ops
- `apps/admin/app/dashboard/tools/cloud/loading.tsx` - Loading state component

#### Storage Client
- `apps/admin/lib/mcp-client/storage.ts` - Storage-specific MCP client wrapper

#### Components (Page-Specific)
- `apps/admin/components/storage/StoragePageHeader.tsx` - Page header with stats
- `apps/admin/components/storage/StorageToolbar.tsx` - Search + view toggle + actions

## Implementation Phases

### Phase 1: Foundation (API Layer)
Set up the storage client and server actions for MCP Gateway communication.

### Phase 2: Core Page Implementation
Build the main page with FileBrowser integration and basic CRUD operations.

### Phase 3: Polish & Features
Add search, filters, quota display, and error handling.

## Step by Step Tasks

### 1. Create Storage MCP Client Wrapper

Create a typed storage client that wraps the generic MCPGatewayClient.

- Create `apps/admin/lib/mcp-client/storage.ts`
- Implement methods: `uploadFile`, `listFiles`, `getFileUrl`, `deleteFile`, `statFile`, `getHealth`
- Add proper TypeScript types from `apps/admin/types/storage.ts`
- Export `MCPStorageClient` class

```typescript
// Example structure
export class MCPStorageClient {
  async uploadFile(params: UploadFileInput): Promise<UploadFileResult>
  async listFiles(params: ListFilesInput): Promise<ListFilesResult>
  async getFileUrl(params: GetFileUrlInput): Promise<GetFileUrlResult>
  async deleteFile(params: DeleteFileInput): Promise<DeleteFileResult>
  async statFile(params: StatFileInput): Promise<StatFileResult>
  async checkHealth(): Promise<StorageHealthStatus>
}
```

### 2. Create Server Actions

Create server actions for all storage operations with authentication.

- Create `apps/admin/app/dashboard/tools/cloud/actions.ts`
- Add `'use server'` directive
- Import `requireAuth` from `@/lib/auth-utils`
- Implement actions:
  - `getStorageFiles(bucket: string, prefix?: string)` - List files
  - `uploadStorageFile(formData: FormData)` - Upload file
  - `deleteStorageFile(bucket: string, fileKey: string)` - Delete file
  - `getStorageUrl(bucket: string, fileKey: string)` - Get presigned URL
  - `getStorageStats()` - Get storage statistics
  - `createFolder(bucket: string, folderPath: string)` - Create folder

### 3. Create Route Layout

Create the layout wrapper for the cloud storage section.

- Create `apps/admin/app/dashboard/tools/cloud/layout.tsx`
- Add metadata for page title
- Include breadcrumb context if needed

### 4. Create Loading State

Create a loading skeleton for the storage page.

- Create `apps/admin/app/dashboard/tools/cloud/loading.tsx`
- Use skeleton components matching the FileBrowser layout
- Show skeleton for toolbar, file list, and sidebar

### 5. Build Main Storage Page

Create the main page component with state management.

- Create `apps/admin/app/dashboard/tools/cloud/page.tsx`
- Add `'use client'` directive
- Import storage components from `@ozean-licht/shared-ui`:
  - `FileBrowser`, `FileDropzone`, `FileUploadQueue`
  - `BucketSelector`, `StorageSearchBar`, `ViewModeToggle`
  - `StorageQuotaCard`, `StorageStatsWidget`
  - `FileListItem`, `FileGridItem` (from branded/storage)
  - `StorageBreadcrumb`, `EmptyStorageState` (from branded/storage)
- Implement state:
  - `files: StorageFile[]`
  - `currentBucket: string`
  - `currentPath: string`
  - `viewMode: 'list' | 'grid'`
  - `selectedFiles: StorageFile[]`
  - `uploads: UploadProgress[]`
  - `isLoading: boolean`
  - `error: string | null`
  - `filter: FileFilter`
- Implement handlers:
  - `handleUpload(files: File[])`
  - `handleDownload(file: StorageFile)`
  - `handleDelete(file: StorageFile)`
  - `handleBulkDelete(files: StorageFile[])`
  - `handleNavigate(path: string)`
  - `handleBucketChange(bucket: string)`
  - `handleCreateFolder(name: string)`
  - `handleSearchChange(filter: FileFilter)`

### 6. Create Page Header Component

Build a header component with title, stats summary, and quick actions.

- Create `apps/admin/components/storage/StoragePageHeader.tsx`
- Display page title "Ozean Cloud"
- Show quick stats (total files, total size)
- Add "Upload" and "New Folder" action buttons
- Include last updated timestamp

### 7. Create Toolbar Component

Build the toolbar with search, filters, and view toggle.

- Create `apps/admin/components/storage/StorageToolbar.tsx`
- Integrate `StorageSearchBar` from shared-ui
- Integrate `ViewModeToggle` from shared-ui
- Add bucket selector dropdown
- Add "Refresh" button

### 8. Wire Up File List/Grid Views

Implement the file display area with both view modes.

- Use `FileListItem` for list view (table rows)
- Use `FileGridItem` for grid view (cards)
- Connect selection handlers
- Wire up context menu actions
- Implement folder navigation (double-click)

### 9. Implement Upload Flow

Connect the upload flow with progress tracking.

- Handle file selection from `FileDropzone`
- Convert files to base64 for MCP Gateway
- Track progress in `uploads` state
- Display `FileUploadQueue` component
- Handle success/error states
- Refresh file list after upload

### 10. Implement Download Flow

Connect download functionality.

- Get presigned URL from MCP Gateway
- Trigger browser download
- Handle errors gracefully

### 11. Implement Delete Flow

Connect single and bulk delete operations.

- Confirm deletion with dialog
- Call delete action
- Remove from file list optimistically
- Handle errors with rollback

### 12. Implement Search & Filter

Wire up search and filter functionality.

- Debounce search input (300ms)
- Filter files client-side for immediate feedback
- Support file type, date range, size range filters
- Clear filters button

### 13. Add Bucket Switching

Implement bucket selection and switching.

- Define available buckets (kids-ascension-staging, ozean-licht-assets, shared-assets)
- Filter buckets by user entity scope
- Reset path on bucket change
- Reload files on bucket change

### 14. Add Storage Quota Display

Show storage usage and quota information.

- Fetch storage stats from server action
- Display `StorageQuotaCard` component
- Show breakdown by file type
- Warning at 80%, error at 95% usage

### 15. Add Error Handling

Implement comprehensive error handling.

- Display error toast notifications
- Retry logic for transient failures
- Graceful degradation when backend unavailable
- User-friendly error messages

### 16. Add Keyboard Shortcuts

Implement keyboard navigation.

- `Ctrl/Cmd + A` - Select all files
- `Delete` - Delete selected files
- `Ctrl/Cmd + N` - New folder dialog
- `Escape` - Clear selection
- Arrow keys - Navigate file list

### 17. Test & Validate

Test all functionality with real MinIO backend.

- Test upload with various file types and sizes
- Test download and verify file integrity
- Test delete (single and bulk)
- Test search and filter combinations
- Test across buckets
- Test error scenarios (network failure, quota exceeded)
- Test responsive layout (mobile, tablet, desktop)

## Testing Strategy

### Manual Testing
- Upload files of various types (images, videos, PDFs, archives)
- Test large file uploads (50MB+) with progress tracking
- Test drag & drop functionality
- Test bulk operations (select 10+ files, delete)
- Test search with various queries
- Test filter combinations
- Test view mode toggle persistence
- Test bucket switching
- Test folder creation and navigation

### Integration Testing
- Verify MCP Gateway connectivity
- Test authentication flow (requireAuth)
- Test error handling when gateway is down
- Test presigned URL generation and expiry

### Accessibility Testing
- Keyboard navigation through file list
- Screen reader announcements for actions
- Focus management in dialogs
- Color contrast compliance

## Acceptance Criteria

- [ ] Page loads at `/dashboard/tools/cloud` with file browser
- [ ] Files display in both list and grid views
- [ ] View mode persists in localStorage
- [ ] Drag & drop upload works with visual feedback
- [ ] Upload progress shows in queue component
- [ ] Files can be downloaded via presigned URL
- [ ] Single file delete works with confirmation
- [ ] Bulk delete works for multiple selected files
- [ ] Search filters files by name
- [ ] Type/date/size filters work correctly
- [ ] Folder navigation via breadcrumbs works
- [ ] New folder creation works
- [ ] Bucket switching reloads file list
- [ ] Storage quota displays correctly
- [ ] Empty states display appropriately
- [ ] Error messages are user-friendly
- [ ] Page is responsive (mobile-first)
- [ ] Keyboard shortcuts function correctly
- [ ] Authentication required (redirects if not logged in)

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Build shared-ui library (ensure exports work)
pnpm --filter @ozean-licht/shared-ui build

# Type check admin app
pnpm --filter admin typecheck

# Lint admin app
pnpm --filter admin lint

# Start admin dashboard
pnpm --filter admin dev
# Visit http://localhost:9200/dashboard/tools/cloud

# Verify MinIO is accessible
curl http://138.201.139.25:9001/minio/health/live

# Verify MCP Gateway is running
curl http://localhost:8100/health
```

## Notes

### Type Mapping

The shared-ui `StorageFile` type needs to map to the admin `StorageMetadata` type:

| shared-ui (StorageFile) | admin (StorageMetadata) |
|-------------------------|------------------------|
| `id` | `id` |
| `name` | `originalFilename` |
| `path` | `fileKey` |
| `size` | `fileSizeBytes` |
| `mimeType` | `contentType` |
| `uploadedAt` | `uploadedAt` |
| `uploadedBy` | `uploadedBy` |
| `bucket` | `bucketName` |
| `entityScope` | `entityScope` |
| `md5Hash` | `checksumMd5` |
| `metadata` | `metadata` |
| `tags` | `tags` |
| `isFolder` | (derived from path) |

### Bucket Configuration

```typescript
const BUCKETS = [
  { name: 'kids-ascension-staging', displayName: 'Kids Ascension', entityScope: 'kids_ascension' },
  { name: 'ozean-licht-assets', displayName: 'Ozean Licht', entityScope: 'ozean_licht' },
  { name: 'shared-assets', displayName: 'Shared Assets', entityScope: 'shared' },
]
```

### Environment Variables

Ensure these are set in `.env.local`:

```bash
MCP_GATEWAY_URL=http://localhost:8100
```

### MinIO Server

Production MinIO is running at:
- Console: http://138.201.139.25:9001
- API: http://138.201.139.25:9000

---

**Estimated Time:** 4-6 hours
**Dependencies:** shared-ui storage components, MCP Gateway running
**Risk:** Medium (backend integration complexity)
