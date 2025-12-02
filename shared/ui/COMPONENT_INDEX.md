# Component Index

> Complete catalog of `@ozean-licht/shared-ui` components for discovery and agent context.

**Total: 105 components** | **Last Updated:** 2025-12-02

---

## Quick Stats

| Tier | Location | Count | Status |
|------|----------|-------|--------|
| Tier 0 | `primitives/` | 0 | Empty |
| Tier 1a | `cossui/` | 48 | Active |
| Tier 1b | `ui/` | 14 | Active |
| Tier 1c | `magicui/` | 2 | Active |
| Tier 2 | `branded/` | 28 | Active |
| Tier 2 | `storage/` | 13 | Active |
| Tier 3 | `compositions/` | 12 | Disabled |

---

## Tier 1a: CossUI Base Components (48)

Modern React components built on Base UI primitives with Ozean Licht styling.

### Layout (10)
| Component | Path | Description |
|-----------|------|-------------|
| `CossUICard` | `cossui/card` | Card container with header, panel, footer |
| `CossUIFrame` | `cossui/frame` | Frame container with header, title, content, footer |
| `CossUISeparator` | `cossui/separator` | Visual divider |
| `ScrollArea` | `cossui/scrollarea` | Custom scrollable area |
| `CossUIAccordion` | `cossui/accordion` | Collapsible content sections |
| `CossUICollapsibleRoot` | `cossui/collapsible` | Single collapsible panel |
| `CossUITabs` | `cossui/tabs` | Tabbed navigation |
| `CossUITable` | `cossui/table` | Data table with header, body, footer |
| `CossUIBreadcrumb` | `cossui/breadcrumb` | Navigation breadcrumb |
| `CossUIPagination` | `cossui/pagination` | Page navigation |

### Form (17)
| Component | Path | Description |
|-----------|------|-------------|
| `CossUIButton` | `cossui/button` | Button with variants |
| `CossUIInput` | `cossui/input` | Text input field |
| `CossUIInputGroupRoot` | `cossui/input-group` | Input with addons |
| `CossUITextarea` | `cossui/textarea` | Multi-line text input |
| `CossUILabel` | `cossui/label` | Form label |
| `CossUISelect` | `cossui/select` | Dropdown select |
| `CossUIComboboxRoot` | `cossui/combobox` | Searchable dropdown |
| `CossUIAutocompleteRoot` | `cossui/autocomplete` | Autocomplete input |
| `CossUICheckbox` | `cossui/checkbox` | Checkbox with indicator |
| `CossUIRadioGroup` | `cossui/radio-group` | Radio button group |
| `CossUISwitch` | `cossui/switch` | Toggle switch |
| `CossUISlider` | `cossui/slider` | Range slider |
| `CossUIToggle` | `cossui/toggle` | Toggle button |
| `CossUINumberField` | `cossui/number-field` | Number input with increment/decrement |
| `CossUIFieldRoot` | `cossui/field` | Form field wrapper with label, error, helper |
| `CossUIToolbar` | `cossui/toolbar` | Toolbar with groups and buttons |
| `CossUIFieldsetRoot` | `cossui/fieldset` | Fieldset with legend |
| `CossUIGroupRoot` | `cossui/group` | Group container |
| `CossUIFormRoot` | `cossui/form` | Form with validation |

### Feedback (11)
| Component | Path | Description |
|-----------|------|-------------|
| `CossUIAlert` | `cossui/alert` | Alert message with title and description |
| `CossUIBadge` | `cossui/badge` | Status badge |
| `CossUIKbd` | `cossui/kbd` | Keyboard shortcut display |
| `CossUIProgress` | `cossui/progress` | Progress bar |
| `CossUIMeter` | `cossui/meter` | Meter/gauge display |
| `CossUISpinner` | `cossui/spinner` | Loading spinner |
| `CossUISkeleton` | `cossui/skeleton` | Loading placeholder |
| `CossUIAvatar` | `cossui/avatar` | User avatar with fallback |
| `CossUIToast` | `cossui/toast` | Toast notification |
| `CossUIEmptyRoot` | `cossui/empty` | Empty state with icon and action |

### Overlay (10)
| Component | Path | Description |
|-----------|------|-------------|
| `CossUIDialog` | `cossui/dialog` | Modal dialog |
| `CossUISheet` | `cossui/sheet` | Slide-out panel |
| `CossUIAlertDialog` | `cossui/alert-dialog` | Confirmation dialog |
| `CossUIPopover` | `cossui/popover` | Floating popover |
| `CossUITooltip` | `cossui/tooltip` | Hover tooltip |
| `CossUIMenu` | `cossui/menu` | Dropdown menu |
| `CossUIPreviewCardRoot` | `cossui/preview-card` | Hover preview card |

---

## Tier 1b: ShadCN UI Components (14)

Radix UI based components for unique functionality not covered by CossUI.

### Overlay (4)
| Component | Path | Description |
|-----------|------|-------------|
| `ContextMenu` | `ui/context-menu` | Right-click context menu |
| `DropdownMenu` | `ui/dropdown-menu` | Dropdown menu |
| `HoverCard` | `ui/hover-card` | Hover preview card |
| `Menubar` | `ui/menubar` | Application menubar |

### Navigation (2)
| Component | Path | Description |
|-----------|------|-------------|
| `Command` | `ui/command` | Command palette (cmdk) |
| `NavigationMenu` | `ui/navigation-menu` | Site navigation menu |

### Advanced (8)
| Component | Path | Description |
|-----------|------|-------------|
| `AspectRatio` | `ui/aspect-ratio` | Maintain aspect ratio |
| `Calendar` | `ui/calendar` | Date picker calendar |
| `Carousel` | `ui/carousel` | Image/content carousel |
| `Chart` | `ui/chart` | Data visualization charts |
| `Drawer` | `ui/drawer` | Mobile drawer (vaul) |
| `InputOTP` | `ui/input-otp` | OTP code input |
| `Resizable` | `ui/resizable` | Resizable panels |
| `SonnerToaster` | `ui/sonner` | Sonner toast notifications |

---

## Tier 1c: MagicUI Components (2)

Animation and effect components.

| Component | Path | Description |
|-----------|------|-------------|
| `AnimatedGradientText` | `magicui/animated-gradient-text` | Animated gradient text effect |
| `Vortex` | `magicui/vortex` | Vortex background animation |

---

## Tier 2: Branded Components (28)

Ozean Licht branded components with oceanic cyan (#0ec2bc), glass effects.

### Core (16)
| Component | Path | Description |
|-----------|------|-------------|
| `Logo` | `branded/logo` | Ozean Licht logo variants |
| `SpanBadge` | `branded/span-badge` | Branded badge/span |
| `SpanDesign` | `branded/span-design` | Decorative span element |
| `TestimonialCard` | `branded/testimonial-card` | Customer testimonial card |
| `InfoCard` | `branded/info-card` | Information card with optional button |
| `NavButton` | `branded/nav-button` | Navigation button |
| `CtaButton` | `branded/cta-button` | Call-to-action button |
| `CourseCard` | `branded/course-card` | Course display card |
| `CourseCardModern` | `branded/course-card-modern` | Modern course card variant |
| `CourseFilter` | `branded/course-filter` | Course filtering UI |
| `BlogItem` | `branded/blog-item` | Blog post item |
| `FaqItem` | `branded/faq-item` | FAQ accordion item |
| `Notification` | `branded/notification` | Notification component |
| `LightRays` | `branded/light-rays` | WebGL light ray animation |
| `Folder` | `branded/folder` | Folder icon component |
| `Tree` | `branded/file-tree` | File tree view |

### Layout (9)
| Component | Path | Description |
|-----------|------|-------------|
| `AppHeader` | `branded/layout/app-header` | Application header |
| `AppSidebar` | `branded/layout/app-sidebar` | Application sidebar navigation |
| `AppLayout` | `branded/layout/app-layout` | Full application layout shell |
| `Header` | `branded/layout/header` | Public site header |
| `Footer` | `branded/layout/footer` | Site footer |
| `BackgroundModeSwitch` | `branded/layout/background-mode-switch` | Background mode toggle |
| `BackgroundModeContext` | `branded/layout/background-mode-context` | Background mode provider |
| `BackgroundVideo` | `branded/layout/background-video` | Video background |
| `BackgroundWaterRaysDesign` | `branded/layout/background-water-rays-design` | Water rays background |

### Forms (2)
| Component | Path | Description |
|-----------|------|-------------|
| `FeedbackForm` | `branded/forms/feedback-form` | User feedback form |
| `LanguagePicker` | `branded/forms/language-picker` | Language selection dropdown |

### Content (2)
| Component | Path | Description |
|-----------|------|-------------|
| `BlogPreview` | `branded/content/blog-preview` | Blog post preview |
| `CoursePreview` | `branded/content/course-preview` | Course preview card |

---

## Tier 2: Storage Components (13)

Ozean Cloud storage UI for MinIO S3 file management.

| Component | Path | Description |
|-----------|------|-------------|
| `FileDropzone` | `storage/file-dropzone` | Drag-and-drop file upload |
| `FileUploadQueue` | `storage/file-upload-queue` | Upload progress queue |
| `FileContextMenu` | `storage/file-context-menu` | File right-click menu |
| `BulkActionsToolbar` | `storage/bulk-actions-toolbar` | Multi-select actions |
| `CreateFolderDialog` | `storage/create-folder-dialog` | New folder dialog |
| `FileBrowser` | `storage/file-browser` | Full file browser component |
| `FilePreviewDialog` | `storage/file-preview-dialog` | File preview modal |
| `StorageQuotaCard` | `storage/storage-quota-card` | Storage usage display |
| `StorageSearchBar` | `storage/storage-search-bar` | File search input |
| `FileMetadataPanel` | `storage/file-metadata-panel` | File details panel |
| `BucketSelector` | `storage/bucket-selector` | S3 bucket selector |
| `ShareDialog` | `storage/share-dialog` | File sharing dialog |
| `StorageStatsWidget` | `storage/storage-stats-widget` | Storage statistics |

### Storage Utilities (6)
| Utility | Path | Description |
|---------|------|-------------|
| `FileTypeIcon` | `branded/storage/file-type-icon` | File type icon mapper |
| `ViewModeToggle` | `branded/storage/view-mode-toggle` | Grid/list view toggle |
| `EmptyStorageState` | `branded/storage/empty-storage-state` | Empty folder state |
| `FileListItem` | `branded/storage/file-list-item` | File list row |
| `StorageBreadcrumb` | `branded/storage/storage-breadcrumb` | Path breadcrumb |
| `FileGridItem` | `branded/storage/file-grid-item` | File grid card |

---

## Tier 3: Compositions (12) - DISABLED

Complex page sections. Currently disabled due to import errors.

| Component | Path | Description |
|-----------|------|-------------|
| `Hero` | `compositions/hero` | Hero section |
| `CourseListWithFilter` | `compositions/course-list-with-filter` | Filtered course list |
| `TestimonialsPreview` | `compositions/testimonials-preview` | Testimonials section |
| `Footer` | `compositions/footer` | Full footer composition |
| `FooterNav` | `compositions/footer-nav` | Footer navigation |
| `LegalNav` | `compositions/legal-nav` | Legal links navigation |
| `OurPromise` | `compositions/our-promise` | Promise/values section |
| `QuickFaq` | `compositions/quick-faq` | FAQ preview section |
| `Cta1` | `compositions/cta-1` | Call-to-action variant 1 |
| `Cta2` | `compositions/cta-2` | Call-to-action variant 2 |
| `Ticker` | `compositions/ticker` | Scrolling ticker |
| `YoutubeTicker` | `compositions/youtube-ticker` | YouTube video ticker |

---

## Usage

```tsx
// Tier 1: Base components
import { CossUIButton, CossUICard, CossUIDialog } from '@ozean-licht/shared-ui'
import { Command, Calendar, Chart } from '@ozean-licht/shared-ui'

// Tier 2: Branded components
import { Logo, CourseCard, AppLayout } from '@ozean-licht/shared-ui'

// Storage components
import { FileBrowser, FileDropzone } from '@ozean-licht/shared-ui'

// Styles (required in app root)
import '@ozean-licht/shared-ui/styles/globals.css'
```

---

## Storybook

Browse components visually:
```bash
pnpm --filter storybook dev
# Open http://localhost:6006
```

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0ec2bc` | Buttons, links, accents |
| Background | `#00070F` | Page background |
| Card | `#00111A` | Card backgrounds |
| Border | `#0E282E` | Borders, dividers |
| Text | `#C4C8D4` | Body text |
| Heading | `#FFFFFF` | Headings |

---

*Generated: 2025-12-02 | Source: shared/ui/src/*
