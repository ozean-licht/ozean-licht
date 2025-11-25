# Component Migration Map
## Ozean Licht App → Shared UI Library

**Status:** Audit Complete
**Date:** 2025-11-25

---

## Components in apps/ozean-licht/components/ → Shared UI Mapping

### ✅ EXACT MATCHES (Delete from app, use shared)

| App Component | Shared UI Location | Action |
|--------------|-------------------|--------|
| `app-header.tsx` | `shared/ui/src/branded/layout/app-header.tsx` | ✅ DELETE from app |
| `app-layout.tsx` | `shared/ui/src/branded/layout/app-layout.tsx` | ✅ DELETE from app |
| `app-sidebar.tsx` | `shared/ui/src/branded/layout/app-sidebar.tsx` | ✅ DELETE from app |
| `background-mode-context.tsx` | `shared/ui/src/branded/layout/background-mode-context.tsx` | ✅ DELETE from app |
| `background-mode-switch.tsx` | `shared/ui/src/branded/layout/background-mode-switch.tsx` | ✅ DELETE from app |
| `background-video.tsx` | `shared/ui/src/branded/layout/background-video.tsx` | ✅ DELETE from app |
| `background-water-rays-design.tsx` | `shared/ui/src/branded/layout/background-water-rays-design.tsx` | ✅ DELETE from app |
| `header.tsx` | `shared/ui/src/branded/layout/header.tsx` | ✅ DELETE from app |
| `universal-video-player.tsx` | `shared/ui/src/branded/video/universal-video-player.tsx` | ✅ DELETE from app |
| `video-layout-wrapper.tsx` | `shared/ui/src/branded/video/video-layout-wrapper.tsx` | ✅ DELETE from app |
| `video-player.tsx` | `shared/ui/src/branded/video/video-player.tsx` | ✅ DELETE from app |
| `blog-preview.tsx` | `shared/ui/src/branded/content/blog-preview.tsx` | ✅ DELETE from app |
| `course-preview.tsx` | `shared/ui/src/branded/content/course-preview.tsx` | ✅ DELETE from app |

**Total: 13 components to delete**

---

### ✅ VERIFIED MATCHES (Delete from app, use shared)

| App Component | Shared UI Location | Action |
|--------------|-------------------|--------|
| `feedback-form.tsx` | `shared/ui/src/branded/forms/feedback-form.tsx` | ✅ DELETE from app |
| `language-picker.tsx` | `shared/ui/src/branded/forms/language-picker.tsx` | ✅ DELETE from app |
| `book-promo.tsx` | `shared/ui/src/branded/promo/book-promo.tsx` | ✅ DELETE from app |
| `kids-ascension-promo.tsx` | `shared/ui/src/branded/promo/kids-ascension-promo.tsx` | ✅ DELETE from app |
| `love-letter-promo.tsx` | `shared/ui/src/branded/promo/love-letter-promo.tsx` | ✅ DELETE from app |
| `partner-deal-promo.tsx` | `shared/ui/src/branded/promo/partner-deal-promo.tsx` | ✅ DELETE from app |

**Total: 6 components VERIFIED ✅ - all exist in shared UI**

---

### 🆕 APP-SPECIFIC (Keep in app, these are Ozean Licht specific)

| App Component | Type | Keep/Move |
|--------------|------|-----------|
| `auth-redirect-handler.tsx` | Auth utility | ✅ KEEP (app-specific) |
| `login-form.tsx` | Auth form | ⚠️ EVALUATE (might be generic) |
| `magic-link-form.tsx` | Auth form | ⚠️ EVALUATE (might be generic) |
| `password-reset-form.tsx` | Auth form | ⚠️ EVALUATE (might be generic) |
| `register-form.tsx` | Auth form | ⚠️ EVALUATE (might be generic) |

**Note:** Auth forms might be generic enough for shared UI if they follow Ozean Licht branding

---

## Migration Strategy

### Step 1: Verify Existence of Questionable Components
```bash
# Search for each component in shared UI
find shared/ui/src -name "feedback-form.tsx"
find shared/ui/src -name "language-picker.tsx"
find shared/ui/src -name "*-promo.tsx"
```

### Step 2: Update Imports in All Pages
**Before:**
```typescript
import Header from '@/components/header'
import AppSidebar from '@/components/app-sidebar'
import VideoPlayer from '@/components/video-player'
```

**After:**
```typescript
import { Header, AppSidebar } from '@shared/ui/branded/layout'
import { VideoPlayer } from '@shared/ui/branded/video'
```

### Step 3: Delete Duplicate Components
```bash
cd apps/ozean-licht/components
# After updating all imports, delete:
rm app-header.tsx app-layout.tsx app-sidebar.tsx
rm background-*.tsx
rm header.tsx
rm universal-video-player.tsx video-layout-wrapper.tsx video-player.tsx
rm blog-preview.tsx course-preview.tsx
# (and more based on verification)
```

### Step 4: Clean Up Empty Auth Directory
```bash
# If components/auth/ is empty after migration
rmdir apps/ozean-licht/components/auth/
```

---

## Import Pattern Reference

### Old Pattern (WRONG)
```typescript
// apps/ozean-licht/app/page.tsx
import Header from '@/components/header'
import CoursePreview from '@/components/course-preview'
import VideoPlayer from '@/components/video-player'
```

### New Pattern (CORRECT)
```typescript
// apps/ozean-licht/app/page.tsx
import { Header } from '@shared/ui/branded/layout'
import { CoursePreview } from '@shared/ui/branded/content'
import { VideoPlayer } from '@shared/ui/branded/video'

// Or using index exports if available:
import {
  Header,
  CoursePreview,
  VideoPlayer
} from '@shared/ui/branded'
```

---

## Post-Migration Verification

1. **Check all files that import from @/components**
   ```bash
   cd apps/ozean-licht
   grep -r "from '@/components" app/ lib/ --include="*.tsx" --include="*.ts"
   ```

2. **Verify build succeeds**
   ```bash
   cd apps/ozean-licht
   pnpm typecheck
   pnpm build
   ```

3. **Test in Storybook**
   ```bash
   pnpm --filter storybook dev
   # Visit http://localhost:6006 and verify all components render
   ```

---

## Estimated Impact

- **Components to delete:** 13-19 files
- **Files to update:** ~10-15 (pages and layouts)
- **Lines of code saved:** ~2,000+ (eliminating duplicates)
- **Maintenance improvement:** Single source of truth for all components

---

**Next Steps After Migration:**
1. Update all imports across the app
2. Delete duplicate components
3. Test build and runtime
4. Clean up unused directories
5. Update documentation
