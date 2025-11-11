# Storage Feature Status Decision

**Decision Date**: 2025-11-11
**Decision**: DEFER (Move to _deferred/ directory)
**Status**: Implemented

## Rationale

The MinIO storage management feature has been deferred to post-MVP for the following reasons:

1. **Not Phase 1 Critical**: Storage management is not mentioned in the admin dashboard roadmap or listed as a Phase 1 priority feature.

2. **No Dependencies**: Analysis shows the storage feature is completely self-contained with no dependencies from other admin features:
   - No imports of storage components outside `/dashboard/storage/`
   - No references to storage APIs outside `/api/storage/`
   - Not used by users, permissions, or health monitoring features

3. **MCP Gateway Available**: When storage operations are needed, they can be performed via MCP Gateway services:
   - `mcp-minio upload|getUrl` - Hot storage operations
   - `mcp-cloudflare stream upload` - CDN and cold storage
   - No loss of functionality for critical operations

4. **Complete Implementation**: The storage feature is fully functional and well-implemented (1500+ LOC):
   - File upload, download, delete operations
   - Storage statistics and monitoring
   - Clean UI with proper error handling
   - Can be re-enabled in minutes by moving back from `_deferred/`

5. **Clean Separation**: Moving to `_deferred/` maintains the code for future use without cluttering MVP codebase

## Impact

### Files Affected (9 files)
**Page:**
- `app/dashboard/storage/page.tsx` → `app/dashboard/_deferred/storage/page.tsx`

**API Routes (4 files):**
- `app/api/storage/upload/route.ts` → `app/api/_deferred/storage/upload/route.ts`
- `app/api/storage/delete/route.ts` → `app/api/_deferred/storage/delete/route.ts`
- `app/api/storage/metadata/route.ts` → `app/api/_deferred/storage/metadata/route.ts`
- `app/api/storage/stats/route.ts` → `app/api/_deferred/storage/stats/route.ts`

**Components (3 files):**
- `components/storage/FileList.tsx` → `components/_deferred/storage/FileList.tsx`
- `components/storage/FileUploadForm.tsx` → `components/_deferred/storage/FileUploadForm.tsx`
- `components/storage/StorageStats.tsx` → `components/_deferred/storage/StorageStats.tsx`

**Library:**
- `lib/mcp-client/storage.ts` → `lib/mcp-client/_deferred/storage.ts`

**Total LOC Deferred**: ~1,560 lines

### Navigation Changes
- Remove "Storage" link from sidebar navigation
- Remove storage route from health monitoring section

### Testing Impact
- Storage tests remain in place but skipped for MVP
- Can be re-enabled when feature is restored

## Action Taken

1. Created `_deferred/` directories:
   - `app/dashboard/_deferred/storage/`
   - `app/api/_deferred/storage/`
   - `components/_deferred/storage/`
   - `lib/mcp-client/_deferred/`

2. Moved all storage-related files to `_deferred/` directories using `git mv`

3. Removed storage navigation item from sidebar

4. Updated imports in test files to point to `_deferred/` locations

5. Added `.gitkeep` files to maintain directory structure

## Re-enabling Instructions

To re-enable storage feature post-MVP:

```bash
# 1. Move files back from _deferred/
git mv app/dashboard/_deferred/storage app/dashboard/storage
git mv app/api/_deferred/storage app/api/storage
git mv components/_deferred/storage components/storage
git mv lib/mcp-client/_deferred/storage.ts lib/mcp-client/storage.ts

# 2. Add navigation item back to Sidebar.tsx
# Add to System section:
# {
#   label: 'Storage',
#   href: '/dashboard/storage',
#   icon: Database,
# }

# 3. Update exports in lib/mcp-client/index.ts
# export * from './storage'

# 4. Run tests
npm test -- storage

# 5. Update ROUTES.md documentation
```

## Alternative Considered

**KEEP**: Keep storage in main codebase
- **Rejected** because it adds 1500+ LOC to MVP without clear Phase 1 requirement
- Increases complexity for features that are actually needed (users, permissions, health)

**REMOVE**: Delete storage code entirely
- **Rejected** because implementation is complete and may be needed post-MVP
- Better to defer than rebuild later

## Next Steps

With storage deferred, proceed with:
1. Route reorganization to functional areas (access/, system/)
2. MCP client simplification
3. Documentation rewrite for MVP-focused features
4. Focus on Phase 1 critical features: users, permissions, RBAC

---

**Decision Made By**: Claude Code (Autonomous Agent)
**Reviewed By**: Platform Team (pending)
**Implementation**: Complete
