# Plan: Ozean Licht Brand Preservation & Component Infrastructure

## Task Description
Implement a comprehensive component infrastructure that preserves the valuable Ozean Licht brand identity (developed over years) while establishing Storybook as the documentation platform. This follows Option 2 approach: First extract and consolidate existing Ozean Licht branded components into shared-ui, then build Storybook around the existing brand, transform admin dashboard to use shared components, and finally continue with admin core features.

## Objective
Establish a unified component library that preserves the Ozean Licht brand identity (turquoise palette, glass morphism, cosmic dark theme, Cinzel typography) while providing a robust documentation platform through Storybook. All applications will use the same branded components, ensuring consistency and reducing duplication.

## Problem Statement
The Ozean Licht ecosystem has a valuable brand identity developed over years that is currently scattered across applications. The admin dashboard uses generic shadcn/ui components that don't match the brand, while ozean-licht app has custom branded components that aren't reusable. There's a risk of losing this brand identity if we build Storybook from scratch with generic components.

## Solution Approach
Implement a brand-first approach by:
1. Extracting existing Ozean Licht components and styles (glass cards, turquoise theme)
2. Consolidating them into a shared UI library with proper exports
3. Building Storybook around what already exists (document, don't recreate)
4. Migrating admin dashboard to use branded shared components
5. Ensuring all future development uses the established brand system

## Relevant Files

### Existing Brand Assets to Extract
- `apps/ozean-licht/app/globals.css` - Glass card utilities, brand colors
- `apps/ozean-licht/components/*.tsx` - ~20 branded components
- `apps/ozean-licht/tailwind.config.js` - Theme configuration
- `/opt/ozean-licht-ecosystem/design-system.md` - Official design tokens
- `/opt/ozean-licht-ecosystem/BRANDING.md` - Brand guidelines

### Target Shared UI Structure
- `shared/ui-components/src/styles/globals.css` - Consolidated styles
- `shared/ui-components/src/styles/glass.css` - Glass morphism utilities
- `shared/ui-components/src/styles/animations.css` - Brand animations
- `shared/ui-components/src/tokens/index.ts` - Design tokens
- `shared/ui-components/src/components/*.tsx` - Branded components

### Admin Dashboard Files to Transform
- `apps/admin/components/ui/*.tsx` - Replace with shared branded versions
- `apps/admin/app/globals.css` - Import shared styles
- `apps/admin/tailwind.config.js` - Use shared theme

### New Files
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.ts` - Global decorators with brand
- `shared/ui-components/src/stories/*.stories.tsx` - Component stories
- `shared/ui-components/src/stories/BrandGuidelines.stories.mdx` - Brand documentation

## Implementation Phases

### Phase 1: Brand Extraction & Consolidation (Week 1-2)
Extract all brand assets from ozean-licht app and consolidate into shared-ui library. This includes glass card utilities, turquoise color palette, Cinzel typography, and existing components.

### Phase 2: Storybook Documentation (Week 3-4)
Build Storybook around the extracted brand components. Document what exists rather than creating new components. Create brand guideline stories as the first priority.

### Phase 3: Admin Dashboard Transformation (Week 5-6)
Replace generic admin components with branded shared-ui versions. Apply glass morphism effects and cosmic dark theme throughout admin dashboard.

### Phase 4: Component Expansion & Polish (Week 7-8)
Fill gaps with additional branded components. Ensure 100% brand consistency across all applications.

## Step by Step Tasks

### 1. Extract Brand Styles from Ozean Licht
- Copy glass card utilities from `apps/ozean-licht/app/globals.css`
- Extract color variables (turquoise #188689, background #000F0F)
- Preserve backdrop-filter effects and border treatments
- Copy font family declarations (Cinzel Decorative, Montserrat)

### 2. Download and Index Tailwind Plus Components
```bash
# Create Tailwind Plus local index
mkdir -p shared/ui-components/src/tailwind-plus
cd shared/ui-components

# Download all Tailwind Plus components (requires credentials)
npx github:richardkmichael/tailwindplus-downloader#latest
# This creates a timestamped JSON file with all components

# Move to organized location
mv tailwindplus-*.json src/tailwind-plus/components-index.json

# Create skeleton file for LLM queries (reduces 6MB to ~200KB)
cat src/tailwind-plus/components-index.json | \
  jq 'walk(if type == "object" and has("code") then del(.code) else . end)' \
  > src/tailwind-plus/components-skeleton.json
```
- Authenticate with Tailwind Plus web credentials
- Download takes ~3-4 minutes
- Index contains HTML, React, Vue variants for each component
- Supports both Tailwind v3 and v4, light and dark modes

### 3. Create Shared Style Infrastructure
```bash
# Create style structure
mkdir -p shared/ui-components/src/styles
mkdir -p shared/ui-components/src/tokens

# Create style files
touch shared/ui-components/src/styles/globals.css
touch shared/ui-components/src/styles/glass.css
touch shared/ui-components/src/styles/animations.css
touch shared/ui-components/src/tokens/index.ts
```
- Move glass card classes to `glass.css`
- Create animation keyframes (glow, float, shine) in `animations.css`
- Export design tokens matching design-system.md values

### 4. Extract Existing Ozean Licht Components
```bash
# Identify reusable components
ls apps/ozean-licht/components/*.tsx

# Priority components to extract:
# - primary-button.tsx → Button.tsx
# - span-badge.tsx → Badge.tsx
# - notification.tsx → Alert.tsx
# - cta-button.tsx → CTAButton.tsx
# - nav-button.tsx → NavButton.tsx
```
- Copy component logic but enhance with variants
- Ensure all use turquoise primary color (#0ec2bc from design-system.md)
- Apply glass-card classes where appropriate
- Use Cinzel Decorative for display text

### 5. Create Local Component Search System
```typescript
// shared/ui-components/src/tailwind-plus/search.ts
// Copy pattern from tools/mcp-gateway/src/mcp/handlers/mem0.ts

import { readFileSync } from 'fs';
import path from 'path';

interface TailwindPlusComponent {
  category: string;
  section: string;
  name: string;
  snippets: Array<{
    code: string;
    language: string;
    mode: 'light' | 'dark' | 'system';
    framework: 'html' | 'react' | 'vue';
    version: 3 | 4;
  }>;
}

class TailwindPlusSearch {
  private components: TailwindPlusComponent[];
  private skeleton: any; // For LLM queries

  constructor() {
    // Load full index for actual component retrieval
    const indexPath = path.join(__dirname, 'components-index.json');
    this.components = JSON.parse(readFileSync(indexPath, 'utf-8'));

    // Load skeleton for efficient searching
    const skeletonPath = path.join(__dirname, 'components-skeleton.json');
    this.skeleton = JSON.parse(readFileSync(skeletonPath, 'utf-8'));
  }

  searchComponents(query: string, options?: {
    framework?: 'react' | 'vue' | 'html';
    mode?: 'light' | 'dark';
    version?: 3 | 4;
  }) {
    // Simple text search, can enhance with embeddings later
    const results = this.components.filter(comp => {
      const searchText = `${comp.name} ${comp.category} ${comp.section}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    // Filter by options if provided
    if (options?.framework) {
      return results.map(r => ({
        ...r,
        snippets: r.snippets.filter(s => s.framework === options.framework)
      }));
    }

    return results;
  }

  getComponentByPath(category: string, section: string, name: string) {
    return this.components.find(c =>
      c.category === category &&
      c.section === section &&
      c.name === name
    );
  }
}

export { TailwindPlusSearch };
```
- Reuse Mem0 semantic search pattern
- Load components from local JSON index
- Support filtering by framework/mode/version
- Use skeleton file for efficient LLM queries

### 6. Create Token System
```typescript
// shared/ui-components/src/tokens/index.ts
export const colors = {
  primary: {
    DEFAULT: '#0ec2bc',    // Turquoise from design-system.md
    50:  '#E6F8F7',
    100: '#CCF1F0',
    200: '#99E3E1',
    300: '#66D5D2',
    400: '#33C7C3',
    500: '#0ec2bc',
    600: '#0BA09A',
    700: '#087E78',
    800: '#065C56',
    900: '#033A34',
  },
  background: '#0A0F1A',     // Cosmic dark
  card: '#1A1F2E',           // Card layer
  border: '#2A2F3E',
};

export const glass = {
  card: 'rgba(26, 31, 46, 0.7)',
  cardStrong: 'rgba(26, 31, 46, 0.8)',
  cardSubtle: 'rgba(26, 31, 46, 0.5)',
  blur: '12px',
  border: 'rgba(14, 194, 188, 0.25)',
};
```

### 7. Update Shared Components Package
```json
// shared/ui-components/package.json
{
  "name": "@ozean-licht/shared-ui",
  "exports": {
    ".": "./src/index.ts",
    "./styles": "./src/styles/globals.css",
    "./glass": "./src/styles/glass.css",
    "./tokens": "./src/tokens/index.ts"
  }
}
```

### 6. Install and Configure Storybook
```bash
cd /opt/ozean-licht-ecosystem
pnpm add -D @storybook/react-vite@^8.4.0 @storybook/addon-essentials@^8.4.0
npx storybook@latest init --type react --builder vite --skip-install
```

### 7. Configure Storybook with Brand
```typescript
// .storybook/preview.ts
import '../shared/ui-components/src/styles/globals.css';
import '../shared/ui-components/src/styles/glass.css';
import '../shared/ui-components/src/styles/animations.css';

import { colors, glass } from '../shared/ui-components/src/tokens';

export const parameters = {
  backgrounds: {
    default: 'cosmic',
    values: [
      { name: 'cosmic', value: '#0A0F1A' },  // Brand background
      { name: 'card', value: '#1A1F2E' },
    ],
  },
  docs: {
    theme: {
      base: 'dark',
      colorPrimary: '#0ec2bc',
      colorSecondary: '#0ec2bc',
      appBg: '#0A0F1A',
      appContentBg: '#1A1F2E',
      textColor: '#FFFFFF',
      barBg: '#1A1F2E',
    },
  },
};
```

### 8. Create Brand Guidelines Story (FIRST STORY)
```typescript
// shared/ui-components/src/stories/BrandGuidelines.stories.mdx
import { Meta } from '@storybook/blocks';

<Meta title="Foundation/Brand Guidelines" />

# Ozean Licht Brand Guidelines

## Primary Color - Turquoise
The signature Ozean Licht turquoise (#0ec2bc) represents clarity and transformation.

## Glass Morphism
Our signature glass card effects create depth and elegance.

<div className="glass-card p-6 rounded-lg">
  Standard Glass Card
</div>

<div className="glass-card-strong p-6 rounded-lg mt-4">
  Strong Glass Card
</div>

## Typography
- Headings: Cinzel Decorative
- Body: Montserrat
```

### 9. Document Existing Components
```typescript
// shared/ui-components/src/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    backgrounds: { default: 'cosmic' },  // Always on brand background
  },
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style - primary uses turquoise',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

// Document existing variants from ozean-licht
export const Primary: StoryObj<typeof meta> = {
  args: {
    children: 'Ozean Licht Button',
    className: 'glass-hover',  // Apply brand effects
  },
};
```

### 10. Transform Admin Dashboard Components
```typescript
// Before: apps/admin/components/ui/button.tsx (generic)
export function Button({ className, ...props }) {
  return <button className={cn("bg-primary", className)} {...props} />
}

// After: Import from shared
import { Button } from '@ozean-licht/shared-ui';
// Automatically has turquoise, glass effects, proper fonts
```

### 11. Apply Glass Effects to Admin
```typescript
// apps/admin/app/layout.tsx
import '@ozean-licht/shared-ui/styles';  // Import all brand styles
import '@ozean-licht/shared-ui/glass';   // Glass utilities

// apps/admin/components/dashboard/card.tsx
<div className="glass-card glass-hover rounded-lg p-6">
  {/* Card content with automatic brand styling */}
</div>
```

### 12. Validate Brand Consistency
- Check all primary buttons use turquoise (#0ec2bc)
- Verify glass card effects work on cosmic dark background
- Ensure Cinzel Decorative loads for headings
- Test hover states show turquoise glow
- Confirm admin dashboard matches ozean-licht visual identity

## Testing Strategy

### Visual Testing
- Use Chromatic to capture brand elements
- Create visual regression tests for glass effects
- Test on cosmic dark background (#0A0F1A)
- Verify turquoise color accuracy

### Component Testing
- Test glass card backdrop-filter rendering
- Verify hover state transitions
- Check responsive behavior of glass effects
- Test font loading (Cinzel Decorative)

### Brand Compliance Testing
- Create checklist story showing DO/DON'T examples
- Visual comparison with existing ozean-licht app
- Admin dashboard should be indistinguishable from main app

## Acceptance Criteria

### Brand Preservation
- [ ] Turquoise (#0ec2bc) is primary color across all components
- [ ] Glass morphism effects (backdrop-filter) work correctly
- [ ] Cosmic dark background (#0A0F1A) is default
- [ ] Cinzel Decorative font loads for headings
- [ ] All hover states use turquoise glow effect

### Component Migration
- [ ] 20+ components extracted from ozean-licht app
- [ ] Admin dashboard uses shared branded components
- [ ] No duplicate component definitions
- [ ] Consistent visual identity across all apps

### Storybook Documentation
- [ ] Brand Guidelines as first story
- [ ] All extracted components documented
- [ ] Glass card variants demonstrated
- [ ] Color palette reference available
- [ ] Typography hierarchy shown

### Technical Requirements
- [ ] Shared-ui package properly exports components and styles
- [ ] Tree-shaking works for component imports
- [ ] CSS modules don't conflict between apps
- [ ] Build time remains under 20 seconds

## Validation Commands

```bash
# Test shared-ui package build
cd shared/ui-components
pnpm build

# Start Storybook with brand
pnpm storybook
# Verify cosmic dark background and turquoise accents

# Test component imports in admin
cd apps/admin
pnpm dev
# Check glass effects and brand colors

# Visual regression test
npx chromatic --project-token=$CHROMATIC_TOKEN
# Verify brand elements captured correctly

# Bundle size check
pnpm build-storybook
du -sh storybook-static
# Should be under 10MB

# Test admin with shared components
cd apps/admin
pnpm dev
# Navigate to http://localhost:9200
# Verify glass cards and turquoise theme
```

## Notes

### Critical Brand Elements to Preserve
- **Color**: Turquoise #0ec2bc (not #188689 from ozean-licht CSS, use design-system.md value)
- **Background**: Cosmic dark #0A0F1A
- **Glass Effects**: Three variants with specific opacity/blur values
- **Typography**: Cinzel Decorative for display, Montserrat for body
- **Animations**: Glow, float, shine keyframes from design-system.md

### Migration Priority
1. Visual components first (buttons, badges, cards)
2. Form components second (inputs, selects)
3. Complex components last (data tables, modals)

### Risk Mitigation
- Take screenshots of current ozean-licht app for reference
- Create brand compliance checklist
- Review with stakeholders before major changes
- Keep backup of original components

### Dependencies
```bash
# Required for glass effects
pnpm add -D postcss autoprefixer

# For Storybook
pnpm add -D @storybook/react-vite@^8.4.0 @storybook/addon-essentials@^8.4.0

# For Tailwind Plus component downloading
npx github:richardkmichael/tailwindplus-downloader#latest

# For component scraping and indexing
pnpm add -D playwright @playwright/test
pnpm add -D chromadb openai langchain

# For fonts
# Fonts loaded via next/font/google in Next.js apps
```

### Tailwind Plus Integration Strategy
Since we only have web access to Tailwind Plus (no API token), we'll:
1. Use tailwindplus-downloader to scrape all components locally
2. Store components in JSON index (~6MB full, use skeleton for LLM)
3. Build local semantic search using existing Mem0 pattern
4. Index components with ChromaDB for vector search
5. No @tailwindui/catalyst npm package - use local copies

### Performance Considerations
- Glass effects (backdrop-filter) can be expensive on mobile
- Consider reducing blur radius on smaller screens
- Provide fallback for browsers without backdrop-filter support
- Lazy load Cinzel Decorative font (display font)