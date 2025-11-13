# Shared UI Folder Structure Plan
**Version:** 1.0
**Date:** 2025-11-13
**Status:** Approved
**Philosophy:** Agentic Engineering Principles

---

## Executive Summary

This plan optimizes `/shared/ui` for AI-driven development through:
- **Progressive Disclosure:** Three-tier architecture (primitives → branded → compositions)
- **Discoverability:** Clear naming, comprehensive stories, atomic documentation
- **Scalability:** Modular structure supporting 100+ future components
- **Maintainability:** Single source of truth, consistent patterns, automated testing

**Key Metric:** Enable AI agents to build brand-adhering UI in first iteration (0-edit deployment).

---

## Current State Analysis

### Inventory (99 TSX files)

```
/shared/ui/src/
├── ui/                 # 47 shadcn primitives (8 have stories)
├── catalyst/           # 11 Catalyst components (0 stories)
├── components/         # 7 branded components (5 have stories)
├── compositions/       # 19 composition components (0 stories)
├── tokens/             # Design tokens (2 themes)
├── styles/             # Global CSS
├── hooks/              # React hooks
├── themes/             # Theme configs
└── utils/              # Utility functions
```

### Story Coverage
- **Total Components:** 84 (47 + 11 + 7 + 19)
- **Components with Stories:** 13 (15.5%)
- **Missing Stories:** 71 components (84.5%)

### Key Issues Identified

1. **Storybook Configuration Bug (FIXED)** ✅
   - Was looking for `shared/ui-components/` instead of `shared/ui/`
   - Fixed in `/storybook/config/main.ts`

2. **Low Story Coverage (CRITICAL)**
   - Only 13/84 components documented in Storybook
   - AI agents cannot discover undocumented components
   - Risk: Agents rebuild existing components instead of reusing

3. **Inconsistent Organization**
   - Some primitives in `/ui` have stories, others don't
   - Catalyst components have zero documentation
   - Compositions (most complex) have no visual examples

4. **Missing Documentation**
   - No component discovery index
   - No usage guidelines for compositions
   - No theming documentation

---

## Proposed Structure (Optimal)

### Philosophy: "Progressive Disclosure for Agents"

```
/shared/ui/src/
│
├── 📦 primitives/              # TIER 1: Base building blocks
│   ├── shadcn/                 # 47 Radix UI components
│   │   ├── button.tsx
│   │   ├── button.stories.tsx  # ⚠️ Story per component
│   │   ├── card.tsx
│   │   ├── card.stories.tsx
│   │   └── ...
│   │
│   └── catalyst/               # 11 Headless UI components
│       ├── layouts/
│       │   ├── sidebar-layout.tsx
│       │   └── sidebar-layout.stories.tsx  # ⚠️ Add stories
│       ├── navigation/
│       ├── data/
│       ├── forms/
│       └── typography/
│
├── 🎨 components/              # TIER 2: Branded Ozean Licht
│   ├── button/
│   │   ├── Button.tsx          # Extends shadcn with OL branding
│   │   ├── Button.stories.tsx  # ✅ Already exists
│   │   ├── Button.test.tsx
│   │   └── README.md           # Usage guidelines
│   ├── card/
│   │   ├── Card.tsx
│   │   ├── Card.stories.tsx    # ✅ Already exists
│   │   ├── Card.test.tsx
│   │   └── README.md
│   └── ...
│
├── 🧩 compositions/            # TIER 3: Application patterns
│   ├── cards/
│   │   ├── CourseCard.tsx
│   │   ├── CourseCard.stories.tsx     # ⚠️ Add stories
│   │   ├── TestimonialCard.tsx
│   │   ├── TestimonialCard.stories.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.stories.tsx      # ⚠️ Add stories
│   │   └── index.ts
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardLayout.stories.tsx
│   │   └── index.ts
│   └── sections/
│       ├── HeroSection.tsx
│       ├── HeroSection.stories.tsx    # ⚠️ Add stories
│       └── index.ts
│
├── 🎭 tokens/                  # Design tokens
│   ├── ozean-licht/            # Primary brand
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── effects.ts
│   │   └── index.ts
│   ├── kids-ascension/         # Secondary brand (future)
│   │   └── index.ts
│   └── index.ts
│
├── 🎨 themes/                  # Theme configs
│   ├── ozean-licht.ts          # Default theme
│   ├── kids-ascension.ts       # Override theme
│   └── index.ts
│
├── 💅 styles/                  # Global styles
│   ├── globals.css             # CSS variables, utilities
│   ├── animations.css          # Keyframes (glow, float, shine)
│   └── glass-effects.css       # Glass morphism utilities
│
├── 🪝 hooks/                   # React hooks
│   ├── use-toast.ts
│   ├── use-theme.ts
│   └── index.ts
│
├── 🛠️ utils/                   # Utilities
│   ├── cn.ts                   # Class name merger
│   ├── format.ts
│   └── index.ts
│
├── 📚 catalog/                 # NEW: Component discovery
│   ├── component-index.json    # Machine-readable catalog
│   ├── README.md               # Human-readable guide
│   └── usage-patterns.md       # Common patterns
│
└── index.ts                    # Main entry point
```

---

## Migration Strategy (From Current → Optimal)

### Phase 1: Immediate Fixes (Today) ✅

- [x] Fix Storybook config path (`ui-components` → `ui`)
- [ ] Test Storybook loads existing stories
- [ ] Document current structure

### Phase 2: Story Coverage - Tier 2 (Priority 1 - Today)

Create stories for **7 branded components**:
- [x] Button.stories.tsx ✅ (exists)
- [x] Card.stories.tsx ✅ (exists)
- [x] Badge.stories.tsx ✅ (exists)
- [x] Input.stories.tsx ✅ (exists)
- [x] Select.stories.tsx ✅ (exists)
- [ ] Dialog.stories.tsx (needs creation)
- [ ] Textarea.stories.tsx (needs creation)

### Phase 3: Story Coverage - Tier 3 (Priority 2 - This Week)

Create stories for **19 composition components**:

**Cards (6 components):**
- [ ] CourseCard.stories.tsx
- [ ] TestimonialCard.stories.tsx
- [ ] PricingCard.stories.tsx
- [ ] BlogCard.stories.tsx
- [ ] FeatureCard.stories.tsx
- [ ] StatsCard.stories.tsx

**Sections (5 components):**
- [ ] HeroSection.stories.tsx
- [ ] CTASection.stories.tsx
- [ ] FeatureSection.stories.tsx
- [ ] TestimonialsSection.stories.tsx
- [ ] PricingSection.stories.tsx

**Forms (5 components):**
- [ ] LoginForm.stories.tsx
- [ ] RegisterForm.stories.tsx
- [ ] PasswordResetForm.stories.tsx
- [ ] MagicLinkForm.stories.tsx
- [ ] ContactForm.stories.tsx

**Layouts (3 components):**
- [ ] DashboardLayout.stories.tsx
- [ ] MarketingLayout.stories.tsx
- [ ] AuthLayout.stories.tsx

### Phase 4: Story Coverage - Tier 1 Primitives (Priority 3 - Next Week)

**Catalyst (11 components) - 0 stories:**
- [ ] SidebarLayout.stories.tsx
- [ ] StackedLayout.stories.tsx
- [ ] AuthLayout.stories.tsx
- [ ] Navbar.stories.tsx
- [ ] Sidebar.stories.tsx
- [ ] Button.stories.tsx (catalyst version)
- [ ] Link.stories.tsx
- [ ] Table.stories.tsx
- [ ] Combobox.stories.tsx
- [ ] Heading.stories.tsx
- [ ] Text.stories.tsx

**shadcn Primitives (47 components) - 39 need stories:**
Focus on most-used components first:
- [ ] dialog.stories.tsx
- [ ] dropdown-menu.stories.tsx
- [ ] form.stories.tsx
- [ ] input.stories.tsx
- [ ] label.stories.tsx
- [ ] popover.stories.tsx
- [ ] select.stories.tsx
- [ ] sheet.stories.tsx
- [ ] table.stories.tsx
- [ ] toast.stories.tsx

### Phase 5: Component Catalog (Priority 4 - Next Week)

Create `/catalog/` directory with:

1. **component-index.json** - Machine-readable catalog
```json
{
  "version": "0.1.0",
  "components": {
    "tier1": {
      "shadcn": [
        {
          "name": "Button",
          "path": "primitives/shadcn/button.tsx",
          "story": "primitives/shadcn/button.stories.tsx",
          "category": "form",
          "tags": ["interactive", "clickable"],
          "dependencies": []
        }
      ]
    },
    "tier2": {
      "branded": [
        {
          "name": "Button",
          "path": "components/button/Button.tsx",
          "story": "components/button/Button.stories.tsx",
          "extends": "primitives/shadcn/button",
          "category": "form",
          "tags": ["ozean-licht", "branded", "primary"],
          "features": ["glow", "loading", "icons"]
        }
      ]
    },
    "tier3": {
      "compositions": [
        {
          "name": "CourseCard",
          "path": "compositions/cards/CourseCard.tsx",
          "story": "compositions/cards/CourseCard.stories.tsx",
          "uses": ["Card", "Button", "Badge"],
          "category": "cards",
          "tags": ["course", "product", "ecommerce"]
        }
      ]
    }
  }
}
```

2. **README.md** - Human-readable discovery guide
3. **usage-patterns.md** - Common composition patterns

### Phase 6: Folder Restructuring (Optional - Future)

**Only if needed:** Restructure to match optimal layout
- Move `/ui` → `/primitives/shadcn`
- Move `/catalyst` → `/primitives/catalyst`
- Nest components in subdirectories

**Risk:** Breaking changes to imports
**Recommendation:** Keep current structure, improve via stories and catalog

---

## Agentic Engineering Principles Applied

### 1. **Progressive Disclosure**
- Tier 1 (Primitives): Low-level, maximum flexibility
- Tier 2 (Branded): Ozean Licht styling applied
- Tier 3 (Compositions): Ready-to-use application patterns

**Agent Benefit:** Clear mental model of abstraction levels

### 2. **Comprehensive Documentation**
- Every component has a `.stories.tsx` file
- Stories show all variants, sizes, states
- Stories include JSDoc comments explaining usage

**Agent Benefit:** Visual examples prevent reimplementation

### 3. **Machine-Readable Catalog**
- `component-index.json` enables semantic search
- Tags and categories support intent-based queries
- Dependency graph prevents circular imports

**Agent Benefit:** Fast component discovery via JSON parsing

### 4. **Atomic Design Patterns**
- Primitives → Components → Compositions
- Clear dependency flow (compositions use components use primitives)
- No cross-tier dependencies (compositions don't import other compositions)

**Agent Benefit:** Predictable component relationships

### 5. **Single Source of Truth**
- Design tokens in `/tokens` (not hardcoded colors)
- Global styles in `/styles` (not component-level CSS)
- Theme overrides in `/themes` (not per-app customization)

**Agent Benefit:** Consistent styling without guesswork

### 6. **Naming Conventions**
- PascalCase for components (`Button.tsx`)
- PascalCase for stories (`Button.stories.tsx`)
- kebab-case for primitives (`button.tsx`)
- Descriptive names over abbreviations (`CourseCard` not `CCard`)

**Agent Benefit:** Intuitive file discovery

### 7. **Type Safety**
- TypeScript for all components
- Exported types in `types.ts` per directory
- Props interfaces with JSDoc

**Agent Benefit:** IntelliSense-driven development

---

## Success Metrics

### Agent Performance
- **First-Shot Accuracy:** 90%+ of generated UI uses correct components
- **Zero Reimplementation:** Agents reuse existing components instead of rebuilding
- **Brand Adherence:** 100% of generated UI matches Ozean Licht design system

### Developer Experience
- **Component Discovery Time:** < 30 seconds (via Storybook or catalog)
- **Story Coverage:** 100% of Tier 2 and Tier 3 components
- **Documentation Completeness:** Every component has usage examples

### Build Performance
- **Bundle Size:** < 500 KB (tree-shakeable exports)
- **Build Time:** < 30 seconds
- **Storybook Load:** < 5 seconds

---

## Implementation Priority

### Today (Phase 1-2)
1. ✅ Fix Storybook config
2. Test Storybook with existing stories
3. Create 2 missing Tier 2 stories (Dialog, Textarea)

### This Week (Phase 3)
1. Create 19 Tier 3 composition stories
2. Test all stories in Storybook
3. Document usage patterns

### Next Week (Phase 4-5)
1. Create Catalyst component stories (11 stories)
2. Build component catalog (JSON + docs)
3. Create high-priority primitive stories (10 stories)

### Future (Phase 6)
1. Evaluate folder restructuring need
2. Add automated story generation
3. Implement visual regression testing

---

## Technical Specifications

### Story File Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

/**
 * Component description and key features
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 *
 * ## Usage
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
const meta = {
  title: 'Tier/Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed description for docs',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for interactive props
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    // Default props
  },
};

// Additional variants
export const Variant1: Story = { ... };
export const Variant2: Story = { ... };
```

### Component Index Schema

```typescript
interface ComponentIndex {
  version: string;
  components: {
    tier1: {
      shadcn: ComponentMeta[];
      catalyst: ComponentMeta[];
    };
    tier2: {
      branded: ComponentMeta[];
    };
    tier3: {
      compositions: CompositionMeta[];
    };
  };
}

interface ComponentMeta {
  name: string;
  path: string;
  story: string;
  category: string;
  tags: string[];
  dependencies?: string[];
  extends?: string;
  features?: string[];
}

interface CompositionMeta extends ComponentMeta {
  uses: string[]; // Which Tier 2 components it uses
}
```

---

## Maintenance Plan

### Automation
- [ ] Pre-commit hook: Ensure every `.tsx` component has `.stories.tsx`
- [ ] CI/CD: Build Storybook on every PR
- [ ] Weekly: Update `component-index.json` via script

### Documentation
- [ ] Quarterly: Review and update usage patterns
- [ ] Per-release: Update component catalog
- [ ] Monthly: Audit story coverage

### Governance
- **Rule 1:** No new component without story file
- **Rule 2:** No breaking changes without migration guide
- **Rule 3:** Design tokens only (no hardcoded colors/sizes)

---

## Conclusion

This structure plan enables **AI-first UI development** through:
- Clear component hierarchy (3 tiers)
- Comprehensive visual documentation (100% story coverage goal)
- Machine-readable component catalog (JSON index)
- Consistent patterns (naming, organization, dependencies)

**Next Action:** Begin Phase 2 - Create missing Tier 2 stories and test Storybook deployment.

---

**Document Owner:** Agentic Layer
**Review Cadence:** Monthly
**Version History:**
- v1.0 (2025-11-13): Initial plan
