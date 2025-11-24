# Plan: Ozean Cloud Storage UI Components

**Status:** 🟢 Phase 1 Complete (Foundation) | 🟡 Phase 2 In Progress
**Last Updated:** 2025-11-24
**Commit:** b78e97c

## Task Description

Analyze the existing shared UI component library and identify missing components needed to build an attractive MinIO Storage UI MVP for "ozean-cloud" - a cloud storage interface within the admin dashboard. The backend MinIO integration is already complete, but the UI layer is entirely missing.

## Objective

Create a comprehensive specification for missing UI components required to build a production-ready, visually stunning storage management interface that leverages the Ozean Licht design system (oceanic cyan, glass morphism, dark theme) to provide an intuitive file browsing, uploading, and management experience.

## Problem Statement

The Admin Dashboard currently has a complete MinIO S3 storage backend integration (API routes, MCP client, database schema) but **no UI components** to interact with the storage system. Users cannot:
- Upload files via drag & drop
- Browse files and folders visually
- Preview files inline
- Manage storage quotas
- Perform bulk operations
- Search and filter files effectively
- View storage statistics with charts

While the shared UI library has 50+ shadcn/ui components, it lacks **storage-specific components** that are essential for a modern cloud storage interface.

## Solution Approach

Build a comprehensive set of storage-specific UI components in `shared/ui/src/storage/` that:
1. Complement existing UI primitives (cards, buttons, tables)
2. Follow Ozean Licht design system strictly
3. Support both list and grid view modes
4. Integrate seamlessly with the MCP Storage Client
5. Provide excellent UX for file management operations
6. Include accessibility features (WCAG AA)
7. Are fully responsive (mobile-first)

## Relevant Files

### Existing Components (Reference)
- `shared/ui/src/ui/table.tsx` - Data table primitive (for list view)
- `shared/ui/src/ui/card.tsx` - Card component (for grid items)
- `shared/ui/src/ui/progress.tsx` - Progress bar (for uploads)
- `shared/ui/src/ui/dialog.tsx` - Modal dialogs (for previews)
- `shared/ui/src/ui/breadcrumb.tsx` - Navigation breadcrumbs
- `shared/ui/src/ui/button.tsx` - Action buttons
- `shared/ui/src/ui/badge.tsx` - Status badges
- `shared/ui/src/ui/input.tsx` - Search input
- `shared/ui/src/ui/dropdown-menu.tsx` - Context menus
- `shared/ui/src/ui/checkbox.tsx` - Multi-select
- `shared/ui/src/ui/tooltip.tsx` - Tooltips
- `shared/ui/src/ui/separator.tsx` - Dividers
- `shared/ui/src/ui/skeleton.tsx` - Loading states
- `shared/ui/src/ui/chart.tsx` - Charts for analytics
- `shared/ui/src/branded/file-tree.tsx` - Tree view (folder navigation)
- `shared/ui/src/branded/folder.tsx` - Decorative folder icon

### Backend Integration (Reference)
- `apps/admin/lib/mcp-client/client.ts` - MCP Storage Client
- `apps/admin/docs/features/minio-s3-storage-integration.md` - API documentation
- `apps/admin/types/storage.ts` - TypeScript types
- `/design-system.md` - Design system guidelines

### New Files

#### Core Storage Components
- `shared/ui/src/storage/file-dropzone.tsx` - Drag & drop file upload zone
- `shared/ui/src/storage/file-upload-queue.tsx` - Upload progress manager
- `shared/ui/src/storage/file-list-item.tsx` - File row for list view
- `shared/ui/src/storage/file-grid-item.tsx` - File card for grid view
- `shared/ui/src/storage/file-browser.tsx` - Main browser component (wrapper)
- `shared/ui/src/storage/file-preview-dialog.tsx` - File preview modal
- `shared/ui/src/storage/storage-breadcrumb.tsx` - File path navigation
- `shared/ui/src/storage/view-mode-toggle.tsx` - List/grid switcher
- `shared/ui/src/storage/file-type-icon.tsx` - MIME type icon mapper
- `shared/ui/src/storage/storage-quota-card.tsx` - Storage usage visualization
- `shared/ui/src/storage/file-context-menu.tsx` - Right-click actions
- `shared/ui/src/storage/bulk-actions-toolbar.tsx` - Multi-select toolbar
- `shared/ui/src/storage/storage-search-bar.tsx` - Advanced search with filters
- `shared/ui/src/storage/empty-storage-state.tsx` - Empty folder state
- `shared/ui/src/storage/file-metadata-panel.tsx` - File details sidebar
- `shared/ui/src/storage/bucket-selector.tsx` - Bucket/folder picker
- `shared/ui/src/storage/create-folder-dialog.tsx` - New folder modal
- `shared/ui/src/storage/share-dialog.tsx` - Share file with permissions
- `shared/ui/src/storage/storage-stats-widget.tsx` - Dashboard widget
- `shared/ui/src/storage/file-version-list.tsx` - Version history (future)

#### Utilities & Helpers
- `shared/ui/src/storage/utils/file-size-formatter.ts` - Format bytes to human-readable
- `shared/ui/src/storage/utils/mime-type-detector.ts` - Get file type from extension
- `shared/ui/src/storage/utils/file-icon-mapper.ts` - Map MIME types to icons
- `shared/ui/src/storage/utils/storage-helpers.ts` - Common storage utilities
- `shared/ui/src/storage/types.ts` - Storage component types
- `shared/ui/src/storage/constants.ts` - File type categories, limits
- `shared/ui/src/storage/index.ts` - Main export file

#### Stories (Storybook Documentation)
- `shared/ui/src/storage/file-dropzone.stories.tsx`
- `shared/ui/src/storage/file-upload-queue.stories.tsx`
- `shared/ui/src/storage/file-list-item.stories.tsx`
- `shared/ui/src/storage/file-grid-item.stories.tsx`
- `shared/ui/src/storage/file-browser.stories.tsx`
- `shared/ui/src/storage/storage-quota-card.stories.tsx`

## Implementation Phases

### Phase 1: Foundation (File Display & Navigation) ✅ COMPLETE
**Goal:** Users can browse existing files in list/grid views

**Status:** ✅ Completed 2025-11-24 (Commit: b78e97c)

**Components Implemented:**
1. ✅ File type icon mapper (utility) - `file-icon-mapper.ts`
2. ✅ File size formatter (utility) - `file-size-formatter.ts` (13 functions)
3. ✅ MIME type detector (utility) - `mime-type-detector.ts` (15 functions)
4. ✅ Storage helpers (utility) - `storage-helpers.ts` (15+ functions)
5. ✅ File type icon component - `file-type-icon.tsx` (8 Storybook stories)
6. ✅ File list item component (table row) - `file-list-item.tsx` (6 stories)
7. ✅ File grid item component (card) - `file-grid-item.tsx` (10 stories)
8. ✅ View mode toggle (list/grid switcher) - `view-mode-toggle.tsx` (7 stories)
9. ✅ Storage breadcrumb (path navigation) - `storage-breadcrumb.tsx` (14 stories)
10. ✅ Empty storage state - `empty-storage-state.tsx` (10 stories)

**Additional Deliverables:**
- ✅ Types & Constants: 16 TypeScript interfaces, 150+ MIME type mappings
- ✅ Storybook Documentation: 47 comprehensive stories
- ✅ Dependencies: react-dropzone@14.3.8, @tanstack/react-virtual@3.13.12
- ✅ Build: 348KB ESM, 375KB CJS, 380ms build time
- ✅ Design System: Full Ozean Licht compliance

**Acceptance:** ✅ Can display files from MinIO in both list and grid views with proper navigation

### Phase 2: Core Upload & Management 🟡 IN PROGRESS
**Goal:** Users can upload files and perform basic operations

**Status:** 🟡 Ready to implement

**Components:**
1. ⏳ File dropzone (drag & drop upload)
2. ⏳ File upload queue (progress tracking)
3. ⏳ File context menu (download, delete, rename actions)
4. ⏳ Bulk actions toolbar (multi-select operations)
5. ⏳ Create folder dialog
6. ⏳ File browser wrapper (orchestrates all components)

**Acceptance:** Can upload files via drag & drop, perform bulk delete/download, create folders

### Phase 3: Advanced Features & Polish
**Goal:** Professional storage interface with analytics and previews

**Components:**
1. File preview dialog (images, videos, PDFs)
2. File metadata panel (details sidebar)
3. Storage quota card (usage visualization)
4. Storage search bar (advanced filtering)
5. Bucket selector (switch between buckets)
6. Share dialog (future: permissions)
7. Storage stats widget (dashboard integration)

**Acceptance:** Complete storage UI with previews, search, analytics, and quota management

## Step by Step Tasks

### 1. Setup Storage Component Directory Structure
- Create `shared/ui/src/storage/` directory
- Create `shared/ui/src/storage/utils/` subdirectory
- Create `shared/ui/src/storage/types.ts` for TypeScript interfaces
- Create `shared/ui/src/storage/constants.ts` for file type mappings
- Create `shared/ui/src/storage/index.ts` for exports

### 2. Build Utility Functions (Foundation)
- Implement `file-size-formatter.ts` - Convert bytes to KB/MB/GB/TB
- Implement `mime-type-detector.ts` - Detect MIME type from file extension
- Implement `file-icon-mapper.ts` - Map MIME types to Lucide icons
- Implement `storage-helpers.ts` - Common functions (path parsing, validation)
- Add unit tests for all utilities

### 3. Create File Type Icon Component
- Build `file-type-icon.tsx` with props: `mimeType`, `fileName`, `size`
- Support categories: images, videos, documents, archives, audio, code
- Use Lucide React icons: FileImage, FileVideo, FileText, FileArchive, FileAudio, FileCode
- Add fallback icon for unknown types
- Apply Ozean Licht colors (primary for folders, muted for files)
- Create Storybook story showing all icon types

### 4. Build File List Item Component
- Create `file-list-item.tsx` for table row display
- Props: `file` (metadata object), `onSelect`, `onAction`, `isSelected`
- Display: icon, filename, size, date, actions (download, delete)
- Support hover state with glass-card effect
- Include checkbox for multi-select
- Add context menu trigger (right-click)
- Responsive: hide date on mobile, show only icon + name
- Create Storybook story with multiple file types

### 5. Build File Grid Item Component
- Create `file-grid-item.tsx` for card-based display
- Use glass-card styling with hover glow effect
- Display: large icon/thumbnail, filename (truncated), size, date
- Support thumbnail previews for images
- Include checkbox overlay for selection
- Add quick action buttons on hover (download, preview)
- Responsive: 1 column mobile, 2 tablet, 3-4 desktop
- Create Storybook story with grid layout

### 6. Create View Mode Toggle Component
- Build `view-mode-toggle.tsx` with list/grid toggle
- Use toggle-group from shadcn/ui
- Icons: LayoutList, LayoutGrid from Lucide
- Persist preference in localStorage
- Apply Ozean Licht primary color for active state
- Create Storybook story

### 7. Build Storage Breadcrumb Component
- Create `storage-breadcrumb.tsx` for path navigation
- Extend existing breadcrumb component
- Parse file paths (e.g., "bucket/folder/subfolder")
- Support click navigation to parent folders
- Add home icon for root bucket
- Include bucket switcher in first segment
- Create Storybook story

### 8. Create Empty Storage State Component
- Build `empty-storage-state.tsx` for empty folders
- Display: Large upload icon, heading, description, upload button
- Variants: empty bucket, empty search results, empty folder
- Use glass-card-subtle background
- Add decorative folder icon from branded components
- Create Storybook story with all variants

### 9. Build File Dropzone Component
- Create `file-dropzone.tsx` with drag & drop support
- Use react-dropzone library (add dependency)
- Visual states: idle, drag-over, uploading, error
- Show allowed file types and size limits
- Display upload icon with animated glow on drag-over
- Support click-to-browse fallback
- Validate file types and sizes client-side
- Emit `onFilesSelected` event with File[] array
- Apply glass-card effect with primary border on drag-over
- Create Storybook story with file type restrictions

### 10. Build Upload Queue Component
- Create `file-upload-queue.tsx` for upload progress tracking
- Display list of uploading files with individual progress bars
- Show: filename, size, progress %, cancel button
- Support concurrent uploads (max 3)
- Display overall progress summary
- Handle errors with retry option
- Auto-dismiss completed uploads after 3 seconds
- Use progress component from shadcn/ui
- Position: fixed bottom-right corner (non-blocking)
- Create Storybook story with mock upload states

### 11. Create File Context Menu Component
- Build `file-context-menu.tsx` for right-click actions
- Use context-menu from shadcn/ui
- Actions: Download, Rename, Delete, Share, View Details, Copy URL
- Icons for each action (Lucide)
- Disable actions based on permissions
- Emit action events to parent component
- Apply Ozean Licht styling
- Create Storybook story

### 12. Build Bulk Actions Toolbar Component
- Create `bulk-actions-toolbar.tsx` for multi-select operations
- Show selected count (e.g., "3 files selected")
- Actions: Download All, Delete Selected, Move, Clear Selection
- Position: sticky top bar when items selected
- Use glass-card-strong for emphasis
- Add "Select All" checkbox
- Animate in/out with slide transition
- Create Storybook story

### 13. Create Storage Search Bar Component
- Build `storage-search-bar.tsx` with advanced filters
- Input field with search icon
- Filter dropdowns: File Type, Date Range, Size Range
- Use popover for advanced filters
- Support keyboard navigation (CMD+K to focus)
- Debounce search input (300ms)
- Emit `onSearchChange` with filter object
- Clear all filters button
- Create Storybook story

### 14. Build Create Folder Dialog Component
- Create `create-folder-dialog.tsx` for new folder creation
- Use dialog component from shadcn/ui
- Form: Folder name input with validation
- Validate: No special characters, max 255 chars, no duplicates
- Show current path where folder will be created
- Submit button with loading state
- Error handling with toast notifications
- Create Storybook story

### 15. Build Storage Quota Card Component
- Create `storage-quota-card.tsx` for usage visualization
- Display: Used space, total space, percentage
- Visual: Circular progress or linear bar with gradient
- Color coding: green (<70%), yellow (70-90%), red (>90%)
- Show breakdown by file type (pie chart)
- Use chart component from shadcn/ui
- Apply glass-card styling
- Include "Manage Storage" action button
- Create Storybook story with different usage levels

### 16. Create File Preview Dialog Component
- Build `file-preview-dialog.tsx` for inline previews
- Support: Images (jpg, png, gif, webp), Videos (mp4, webm), PDFs
- Use dialog component (fullscreen on mobile)
- Image viewer: Zoom controls, pan, rotate
- Video player: Play, pause, volume, fullscreen
- PDF viewer: Page navigation, zoom
- Fallback: Download button for unsupported types
- Show metadata sidebar: name, size, date, type
- Navigation: Previous/Next file buttons
- Keyboard shortcuts: ESC to close, arrows to navigate
- Create Storybook story with different file types

### 17. Build File Metadata Panel Component
- Create `file-metadata-panel.tsx` for details sidebar
- Display: Full filename, file path, size, type, upload date, uploader
- Show MD5 checksum for verification
- Display tags (editable)
- Show custom metadata (JSONB field)
- Include "View in Bucket" button
- Add "Copy Public URL" button (presigned)
- Use glass-card styling
- Create Storybook story

### 18. Build Bucket Selector Component
- Create `bucket-selector.tsx` for switching buckets
- Use select or dropdown-menu component
- List buckets: kids-ascension-staging, ozean-licht-assets, shared-assets
- Show bucket icon and file count
- Filter by entity scope based on user permissions
- Highlight current bucket
- Create Storybook story

### 19. Create Share Dialog Component (Future Phase)
- Build `share-dialog.tsx` for file sharing
- Generate presigned URL with expiry time selector (1h, 24h, 7d, never)
- Copy URL button with clipboard API
- Show link expiry countdown
- Future: Add email sharing, password protection, permission levels
- Use dialog component from shadcn/ui
- Create Storybook story

### 20. Build Storage Stats Widget Component
- Create `storage-stats-widget.tsx` for dashboard
- Display: Total files, total size, recent uploads, top file types
- Use mini chart components (line, bar, pie)
- Clickable areas link to storage browser
- Compact card layout for dashboard grid
- Apply glass-card styling
- Create Storybook story

### 21. Create Main File Browser Component
- Build `file-browser.tsx` as orchestrator component
- Compose all components: breadcrumb, search, toolbar, dropzone, list/grid
- Manage state: selected files, view mode, current path, filters
- Handle API integration with MCP Storage Client
- Support infinite scroll / pagination
- Implement keyboard shortcuts (CMD+A select all, Delete key)
- Add loading skeletons for initial load
- Error boundaries for component failures
- Create comprehensive Storybook story

### 22. Add Component Exports and Documentation
- Export all components from `shared/ui/src/storage/index.ts`
- Update main `shared/ui/src/index.ts` to include storage exports
- Write component usage documentation in `shared/ui/src/storage/README.md`
- Create migration guide for admin dashboard integration
- Document props interfaces and event handlers
- Add code examples for common use cases

### 23. Build Storybook Stories for All Components
- Create .stories.tsx files for each component
- Document all props and variants
- Add interactive controls (args)
- Include dark theme background
- Show accessibility tests
- Add usage examples in MDX format
- Test responsive behavior in viewport addon

### 24. Integration Testing with Admin Dashboard
- Create `/apps/admin/app/dashboard/storage/page.tsx` route
- Import FileBrowser component from shared UI
- Connect to MCP Storage Client
- Implement upload, download, delete handlers
- Add route protection with RBAC
- Test with real MinIO backend
- Verify entity scoping works correctly
- Test all user workflows end-to-end

### 25. Accessibility & Responsiveness Audit
- Run axe-core accessibility tests on all components
- Ensure WCAG AA compliance (contrast, focus states, ARIA labels)
- Test keyboard navigation (Tab, Enter, Space, Arrows, Escape)
- Test screen reader compatibility (VoiceOver, NVDA)
- Verify mobile responsiveness (320px to 1920px)
- Test touch interactions (drag & drop on mobile)
- Add skip links for keyboard users
- Ensure focus trap in dialogs

### 26. Performance Optimization
- Implement virtual scrolling for large file lists (react-window)
- Lazy load image thumbnails
- Debounce search and filter operations
- Memoize expensive computations (React.memo, useMemo)
- Optimize bundle size (tree-shaking, code splitting)
- Add service worker for offline file list caching
- Implement optimistic UI updates
- Monitor bundle size with bundlesize tool

### 27. Error Handling & Edge Cases
- Handle network failures gracefully (retry logic)
- Show user-friendly error messages (toast notifications)
- Validate file uploads (size, type, malware scanning future)
- Handle duplicate filenames (auto-rename or confirm overwrite)
- Support cancelled uploads (cleanup temp files)
- Handle quota exceeded errors
- Add error boundaries around critical components
- Log errors to monitoring system (future: Sentry)

### 28. Final Documentation & Review
- Update design system docs with storage component patterns
- Create video walkthrough of storage UI features
- Write developer onboarding guide for storage components
- Document API integration patterns
- Add troubleshooting guide
- Create changelog entry
- Request code review from platform team
- Conduct QA testing session

## Testing Strategy

### Unit Tests (Vitest)
- Test all utility functions (file-size-formatter, mime-type-detector)
- Test component props validation
- Test state management in file-browser
- Test event handlers and callbacks
- Mock MCP client responses
- Coverage target: 80%+

### Integration Tests
- Test file upload flow end-to-end
- Test file deletion with confirmation
- Test search and filtering logic
- Test bulk operations (select all, delete multiple)
- Test folder creation and navigation
- Test view mode persistence (localStorage)

### Visual Regression Tests (Chromatic)
- Capture Storybook snapshots for all components
- Test responsive breakpoints (mobile, tablet, desktop)
- Test dark theme rendering
- Test loading states and skeletons
- Test error states

### Accessibility Tests
- Run axe-core on all Storybook stories
- Test keyboard navigation flows
- Test screen reader announcements
- Verify ARIA attributes
- Test color contrast ratios

### Performance Tests
- Benchmark file list rendering with 1000+ items
- Test upload queue with 10 concurrent uploads
- Measure time to interactive (TTI)
- Check bundle size impact on admin dashboard
- Monitor memory usage during long sessions

### Browser Compatibility
- Test on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Test on iOS Safari and Chrome Android
- Verify drag & drop works across browsers
- Test clipboard API compatibility

## Acceptance Criteria

- [ ] All 20 storage components built and exported from `shared/ui/src/storage/`
- [ ] All utilities (file-size-formatter, mime-type-detector, etc.) implemented and tested
- [ ] Storybook stories created for all components with interactive controls
- [ ] Components follow Ozean Licht design system (oceanic cyan, glass effects, dark theme)
- [ ] File browser supports list and grid view modes with toggle
- [ ] Drag & drop file upload works with visual feedback
- [ ] Upload queue shows progress for multiple concurrent uploads
- [ ] File operations (download, delete, rename) work via context menu
- [ ] Bulk selection and operations (delete, download) functional
- [ ] Storage quota card displays usage with visual chart
- [ ] File preview dialog supports images, videos, PDFs
- [ ] Search bar with advanced filters (type, date, size) operational
- [ ] Empty states display for empty folders/buckets/search results
- [ ] Breadcrumb navigation allows jumping to parent folders
- [ ] Bucket selector switches between different buckets
- [ ] Create folder dialog validates input and creates folders
- [ ] All components are fully responsive (mobile-first)
- [ ] WCAG AA accessibility compliance verified with axe-core
- [ ] Keyboard navigation works for all interactive elements
- [ ] Integration with admin dashboard complete at `/dashboard/storage`
- [ ] MCP Storage Client integrated for all backend operations
- [ ] Performance acceptable for 1000+ files (virtual scrolling)
- [ ] Error handling implemented for network failures and validation errors
- [ ] Unit test coverage >80% for utilities and components
- [ ] Visual regression tests pass in Chromatic
- [ ] Component documentation complete in README.md
- [ ] Code reviewed and approved by platform team

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# Build shared UI library
pnpm --filter @ozean-licht/shared-ui build

# Run unit tests
pnpm --filter @ozean-licht/shared-ui test

# Type check
pnpm --filter @ozean-licht/shared-ui typecheck

# Lint code
pnpm --filter @ozean-licht/shared-ui lint

# Build Storybook
pnpm --filter storybook build

# Start Storybook to verify components
pnpm --filter storybook dev
# Visit http://localhost:6006 and check Storage section

# Test accessibility
pnpm --filter storybook test-storybook --coverage

# Start admin dashboard
pnpm --filter admin dev
# Visit http://localhost:9200/dashboard/storage

# Check bundle size
pnpm --filter @ozean-licht/shared-ui bundlesize

# Run integration tests
pnpm --filter admin test:e2e -- storage
```

## Notes

### Dependencies to Add

Add these to `shared/ui/package.json`:

```json
{
  "dependencies": {
    "react-dropzone": "^14.2.3",
    "react-window": "^1.8.10",
    "@tanstack/react-virtual": "^3.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@axe-core/react": "^4.8.0",
    "bundlesize": "^0.18.1"
  }
}
```

### Design System Reference

All components must follow these guidelines:
- Primary color: `#0ec2bc` (oceanic cyan)
- Background: `#00070F` (deep ocean dark)
- Card background: `#00111A` with glass-card class
- Paragraph text: `#C4C8D4`
- Glass morphism: `backdrop-filter: blur(12px)` with 70% opacity
- Hover states: Add glow with `box-shadow: 0 0 20px rgba(14, 194, 188, 0.22)`
- Animations: Use `animate-glow`, `animate-float` sparingly
- Typography: Montserrat for UI, Cinzel Decorative for H1/H2 only
- Spacing: Use Tailwind spacing scale (4, 6, 8, 12, 16, 24)
- Border radius: Use `rounded-lg` (8px) for cards
- Transitions: `transition-colors duration-200 ease-in-out`

### Integration with Backend

All components should work with the existing MCP Storage Client:

```typescript
import { MCPStorageClient } from '@/lib/mcp-client'

const client = new MCPStorageClient({
  baseUrl: process.env.MCP_GATEWAY_URL,
  database: 'shared-users',
})

// Upload
await client.uploadFile({ bucket, fileKey, fileBuffer, contentType, metadata })

// List
await client.listStorageMetadata({ bucketName, entityScope, searchQuery, limit, offset })

// Download (presigned URL)
const url = await client.getFileUrl({ bucket, fileKey, expirySeconds: 300 })

// Delete
await client.deleteFile({ bucket, fileKey })

// Stats
const stats = await client.getStorageStats(entityScope)
```

### Icon Library

Use Lucide React for all icons (already installed):

**File Type Icons:**
- `FileImage` - Images (jpg, png, gif, webp, svg)
- `FileVideo` - Videos (mp4, webm, mov, avi)
- `FileText` - Documents (txt, doc, docx, pdf)
- `FileArchive` - Archives (zip, tar, gz, rar)
- `FileAudio` - Audio (mp3, wav, ogg)
- `FileCode` - Code (js, ts, py, java, css)
- `File` - Unknown/fallback

**UI Icons:**
- `Upload`, `Download`, `Trash2`, `Share2`, `Edit`, `Copy`
- `Search`, `Filter`, `X`, `Check`, `AlertCircle`, `Info`
- `LayoutList`, `LayoutGrid`, `Home`, `Folder`, `FolderOpen`
- `ChevronRight`, `MoreVertical`, `MoreHorizontal`
- `ZoomIn`, `ZoomOut`, `Play`, `Pause`, `Volume2`

### Future Enhancements (Post-MVP)

1. **File Versioning:** Display version history, restore previous versions
2. **Advanced Permissions:** Granular share permissions (view, edit, download)
3. **Folder Syncing:** Real-time updates with WebSocket
4. **Collaborative Features:** Comments on files, @mentions
5. **AI Features:** Auto-tagging with image recognition, smart search
6. **Malware Scanning:** ClamAV integration for uploaded files
7. **Thumbnails:** Server-side thumbnail generation for images/videos
8. **Trash/Recycle Bin:** Soft delete with 30-day retention
9. **Favorites/Starred:** Pin frequently accessed files
10. **Activity Feed:** Recent uploads, downloads, deletions

### Storage Component Architecture

```
FileBrowser (Orchestrator)
├── StorageBreadcrumb
├── StorageSearchBar
│   └── FilterPopover
├── ViewModeToggle
├── BulkActionsToolbar (conditional)
├── FileDropzone
├── FileList (List View)
│   └── FileListItem[]
│       ├── FileTypeIcon
│       ├── FileContextMenu
│       └── Checkbox
└── FileGrid (Grid View)
    └── FileGridItem[]
        ├── FileTypeIcon
        └── Checkbox

Floating Components:
- FileUploadQueue (bottom-right)
- FilePreviewDialog (fullscreen overlay)
- CreateFolderDialog
- ShareDialog
- FileMetadataPanel (sidebar)

Dashboard Widget:
- StorageStatsWidget
  └── StorageQuotaCard
```

### Performance Considerations

- **Virtual Scrolling:** Use `@tanstack/react-virtual` for lists with 1000+ items
- **Lazy Loading:** Load thumbnails only when visible (Intersection Observer)
- **Debouncing:** Search input debounced at 300ms
- **Memoization:** Use `React.memo` for FileListItem and FileGridItem
- **Pagination:** Load 50 items at a time, infinite scroll for more
- **Image Optimization:** Use Next.js Image component for thumbnails
- **Code Splitting:** Dynamic import for FilePreviewDialog (reduces initial bundle)
- **Caching:** Cache file lists in React Query with stale-while-revalidate

---

**Implementation Timeline:** 3-4 weeks for MVP (all phases)
**Team:** 1 senior frontend developer + 1 designer (Ozean Licht team)
**Estimated Complexity:** High (20+ components, backend integration, accessibility)
**Risk Level:** Medium (dependency on MCP Gateway, file size limits, browser compatibility)
