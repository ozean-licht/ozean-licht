# Import Update Guide
## Migrating from Local Components to @shared/ui

**Date:** 2025-11-25
**Status:** In Progress

---

## Import Mapping Reference

### Layout Components

**From:**
```typescript
import Header from '@/components/header'
import AppHeader from '@/components/app-header'
import AppSidebar from '@/components/app-sidebar'
import AppLayout from '@/components/app-layout'
import BackgroundVideo from '@/components/background-video'
import BackgroundModeSwitch from '@/components/background-mode-switch'
import BackgroundModeContext from '@/components/background-mode-context'
import BackgroundWaterRaysDesign from '@/components/background-water-rays-design'
```

**To:**
```typescript
import {
  Header,
  AppHeader,
  AppSidebar,
  AppLayout,
  BackgroundVideo,
  BackgroundModeSwitch,
  BackgroundModeContext,
  BackgroundWaterRaysDesign
} from '@shared/ui/branded/layout'
```

---

### Video Components

**From:**
```typescript
import VideoPlayer from '@/components/video-player'
import UniversalVideoPlayer from '@/components/universal-video-player'
import VideoLayoutWrapper from '@/components/video-layout-wrapper'
```

**To:**
```typescript
import {
  VideoPlayer,
  UniversalVideoPlayer,
  VideoLayoutWrapper
} from '@shared/ui/branded/video'
```

---

### Content Components

**From:**
```typescript
import CoursePreview from '@/components/course-preview'
import BlogPreview from '@/components/blog-preview'
```

**To:**
```typescript
import {
  CoursePreview,
  BlogPreview
} from '@shared/ui/branded/content'
```

---

### Form Components

**From:**
```typescript
import FeedbackForm from '@/components/feedback-form'
import LanguagePicker from '@/components/language-picker'
```

**To:**
```typescript
import {
  FeedbackForm,
  LanguagePicker
} from '@shared/ui/branded/forms'
```

---

### Promo Components

**From:**
```typescript
import BookPromo from '@/components/book-promo'
import LoveLetterPromo from '@/components/love-letter-promo'
import PartnerDealPromo from '@/components/partner-deal-promo'
import KidsAscensionPromo from '@/components/kids-ascension-promo'
```

**To:**
```typescript
import {
  BookPromo,
  LoveLetterPromo,
  PartnerDealPromo,
  KidsAscensionPromo
} from '@shared/ui/branded/promo'
```

---

## Files That Need Updates

Run this to find all files:
```bash
cd apps/ozean-licht
grep -r "from '@/components" app/ --include="*.tsx" --include="*.ts" -l
```

---

## Update Script

Use this bash script to semi-automate updates:

```bash
#!/bin/bash
# update-imports.sh

cd /opt/ozean-licht-ecosystem/apps/ozean-licht

# Find all files with component imports
FILES=$(grep -r "from '@/components" app/ --include="*.tsx" --include="*.ts" -l)

echo "Files needing import updates:"
echo "$FILES"
echo ""
echo "Update these files manually or use find-replace in your editor"
```

---

## Manual Update Checklist

For each file:
1. [ ] Replace layout component imports
2. [ ] Replace video component imports
3. [ ] Replace content component imports
4. [ ] Replace form component imports
5. [ ] Replace promo component imports
6. [ ] Remove unused imports
7. [ ] Test file builds without errors

---

## Example Migration

### Before (app/page.tsx):
```typescript
import Header from '@/components/header'
import CoursePreview from '@/components/course-preview'
import FeedbackForm from '@/components/feedback-form'
import BookPromo from '@/components/book-promo'

export default function HomePage() {
  return (
    <>
      <Header />
      <CoursePreview courses={courses} />
      <FeedbackForm />
      <BookPromo />
    </>
  )
}
```

### After (app/page.tsx):
```typescript
import { Header } from '@shared/ui/branded/layout'
import { CoursePreview } from '@shared/ui/branded/content'
import { FeedbackForm } from '@shared/ui/branded/forms'
import { BookPromo } from '@shared/ui/branded/promo'

export default function HomePage() {
  return (
    <>
      <Header />
      <CoursePreview courses={courses} />
      <FeedbackForm />
      <BookPromo />
    </>
  )
}
```

---

## Verification After Updates

```bash
# Check no more @/components imports (except auth-redirect-handler)
grep -r "from '@/components" app/ --include="*.tsx" --include="*.ts"

# Should only show auth-related imports that we're keeping

# Test TypeScript compilation
pnpm typecheck

# Try to build
pnpm build
```

---

## Next Steps After Import Updates

1. Delete duplicate component files
2. Test runtime in development
3. Fix any remaining TypeScript errors
4. Clean up empty directories
