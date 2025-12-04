# Plan: Ozean Cloud + VMS Integration

## Task Description

Integrate Ozean Cloud (Hetzner Object Storage) with the Video Management System so that each video record in the VMS points to the correct S3 path in Ozean Cloud. Replace manual URL inputs with a file picker that browses the storage buckets directly.

**Task Type:** Feature
**Complexity:** Medium
**Timeline:** 2-3 days

## Objective

When this plan is complete:
1. VideoForm will have a file picker dialog instead of manual URL inputs
2. Users can browse `ol-cloud` and `ol-videos` buckets to select video files
3. Video records store the S3 path (bucket + key) as `masterFileUrl`
4. Thumbnail picker allows selecting images from storage
5. Bulk video import from Ozean Cloud into VMS database

## Problem Statement

**Current State:**
- VideoForm has plain text inputs for `thumbnailUrl` and `masterFileUrl`
- No connection between VMS and actual video files in Ozean Cloud
- Users must manually copy/paste URLs which is error-prone
- No way to browse existing video content when creating video records

**Impact:**
- Content creators cannot easily link videos to VMS records
- No visibility into what videos exist in storage vs. VMS
- Manual URL entry leads to typos and broken links

## Solution Approach

Build a **Video File Picker** dialog component that:
1. Reuses existing Ozean Cloud file browser patterns
2. Filters for video files (mp4, mov, webm, mkv)
3. Returns the S3 path for selected file
4. Integrates into VideoForm as a modal picker

## Relevant Files

### Existing Files to Reference

| File | Purpose |
|------|---------|
| `apps/admin/app/dashboard/tools/cloud/page.tsx` | Full file browser implementation |
| `apps/admin/app/dashboard/tools/cloud/actions.ts` | Storage server actions (getStorageFiles, etc.) |
| `apps/admin/app/dashboard/tools/cloud/constants.ts` | Bucket definitions |
| `apps/admin/lib/storage/s3-client.ts` | S3StorageClient for direct access |
| `apps/admin/types/storage.ts` | Storage type definitions |
| `apps/admin/components/videos/VideoForm.tsx` | Form to modify |
| `@shared/ui` exports | FileTypeIcon, StorageBreadcrumb, EmptyStorageState |

### New Files to Create

| File | Purpose |
|------|---------|
| `apps/admin/components/videos/VideoFilePicker.tsx` | Modal dialog for selecting video files |
| `apps/admin/components/videos/ThumbnailFilePicker.tsx` | Modal dialog for selecting thumbnail images |
| `apps/admin/app/api/storage/videos/route.ts` | API to list videos from storage |
| `apps/admin/app/api/videos/import/route.ts` | API to bulk import videos from storage |
| `apps/admin/app/dashboard/content/videos/import/page.tsx` | Bulk import page |

## Implementation Phases

### Phase 1: Video File Picker Component

Build the core file picker dialog that allows browsing Ozean Cloud for video files.

### Phase 2: VideoForm Integration

Replace URL inputs with file picker buttons that open the dialog.

### Phase 3: Bulk Import Feature

Create a page to scan storage and import multiple videos into VMS.

## Step by Step Tasks

### 1. Create Video File Picker Component

Create `apps/admin/components/videos/VideoFilePicker.tsx`:

```tsx
interface VideoFilePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (file: { bucket: string; key: string; url: string; name: string }) => void;
  currentValue?: string;
}
```

- Dialog with bucket selector (ol-cloud, ol-videos)
- File browser with folder navigation
- Filter for video MIME types only (video/*)
- Show file size and date
- Preview thumbnail if available
- "Select" button returns S3 path

### 2. Create Thumbnail File Picker Component

Create `apps/admin/components/videos/ThumbnailFilePicker.tsx`:

- Similar to VideoFilePicker but filters for images (image/*)
- Show image preview in grid
- Quick preview on hover

### 3. Create Storage Videos API

Create `apps/admin/app/api/storage/videos/route.ts`:

```typescript
// GET /api/storage/videos?bucket=ol-cloud&prefix=00_Content_Creation
// Returns list of video files with metadata
```

- List video files from specified bucket/prefix
- Include file size, last modified, path
- Support pagination with continuation token
- Filter by video MIME types

### 4. Update VideoForm Component

Modify `apps/admin/components/videos/VideoForm.tsx`:

- Replace `thumbnailUrl` Input with:
  ```tsx
  <div className="flex gap-2">
    <Input value={thumbnailUrl} readOnly placeholder="No thumbnail selected" />
    <Button onClick={() => setThumbnailPickerOpen(true)}>
      <FolderOpen className="h-4 w-4 mr-2" /> Browse
    </Button>
  </div>
  <ThumbnailFilePicker
    open={thumbnailPickerOpen}
    onOpenChange={setThumbnailPickerOpen}
    onSelect={(file) => setValue('thumbnailUrl', file.url)}
  />
  ```

- Replace `masterFileUrl` Input with VideoFilePicker
- Show selected file name, not full URL
- Add "Clear" button to remove selection

### 5. Add Storage Path Display Component

Create helper to display storage paths nicely:

```tsx
function StoragePathDisplay({ path }: { path: string }) {
  // "ol-cloud/00_Content_Creation/2025/01 Energy Code BASIC™/Session_1/video.mp4"
  // Display as: "01 Energy Code BASIC™ > Session_1 > video.mp4"
  const parts = path.split('/').slice(-3);
  return <span className="text-sm text-muted-foreground">{parts.join(' > ')}</span>;
}
```

### 6. Create Bulk Import Page

Create `apps/admin/app/dashboard/content/videos/import/page.tsx`:

- Scan selected bucket/folder for video files
- Show list of videos not yet in VMS database
- Checkbox selection for bulk import
- Auto-extract title from filename
- Import creates video records with masterFileUrl set

### 7. Create Bulk Import API

Create `apps/admin/app/api/videos/import/route.ts`:

```typescript
// POST /api/videos/import
// Body: { files: [{ bucket, key, title? }] }
// Creates video records from storage files
```

- Validate files exist in storage
- Extract metadata (size, filename)
- Create video records with status='draft'
- Return created video IDs

### 8. Update Sidebar Navigation

Add "Import from Storage" link under Videos submenu:

```tsx
{ name: 'Import', href: '/dashboard/content/videos/import', icon: FolderOpen }
```

### 9. Validation and Testing

- Test file picker opens and displays files
- Test navigation between folders
- Test video selection updates form
- Test bulk import creates records
- Verify S3 paths are stored correctly in database

## Testing Strategy

**Manual Testing:**
1. Open VideoForm, click "Browse" for Master File
2. Navigate to `ol-cloud/00_Content_Creation/2025/01 Energy Code BASIC™/Session_1/`
3. Select a video file
4. Verify path is stored in form
5. Save video and verify `masterFileUrl` in database

**Bulk Import Testing:**
1. Go to Videos > Import
2. Select `ol-cloud` bucket
3. Navigate to a course folder
4. Select multiple videos
5. Click Import
6. Verify videos appear in VMS library

## Acceptance Criteria

- [ ] VideoForm has "Browse" button for Master File URL
- [ ] File picker shows only video files (mp4, mov, webm, mkv)
- [ ] File picker supports folder navigation
- [ ] Selected file path stored as `masterFileUrl`
- [ ] Thumbnail picker shows only image files
- [ ] Bulk import page lists unimported videos
- [ ] Bulk import creates video records with correct paths
- [ ] File paths display as readable breadcrumbs

## Validation Commands

```bash
# Verify build compiles
cd apps/admin && pnpm run build

# Check TypeScript
cd apps/admin && pnpm run typecheck

# Test API endpoint
curl -s http://localhost:3000/api/storage/videos?bucket=ol-cloud&prefix=00_Content_Creation | jq '.files | length'

# Verify database stores path correctly
docker exec iccc0wo0wkgsws4cowk4440c psql -U postgres -d "ozean-licht-db" -c "SELECT id, title, master_file_url FROM videos LIMIT 5"
```

## Notes

### Bucket Structure Reference

```
ol-cloud/
├── 00_Content_Creation/2025/     <- Active production (videos here)
├── 01_Assets/08 Videos/04 Kurse/ <- Archive by year
└── gdrive-backup/06 Kurse/       <- Additional course content

ol-videos/                        <- Empty, for processed masters
```

### Video File Naming Convention

Videos often have German characters and emoji:
- `Energy Code BASIC™ ✨Modul 1 23.07.2025 Gesamte Aufzeichung.mp4`

The picker should handle these characters correctly.

### Dependencies

No new dependencies required. Uses existing:
- `@aws-sdk/client-s3` for storage access
- `@shared/ui` for FileTypeIcon, StorageBreadcrumb
- Existing Dialog, Button components

---

*Plan Created: 2025-12-04*
*Estimated Effort: 2-3 days*
*Priority: HIGH - Enables video management workflow*
