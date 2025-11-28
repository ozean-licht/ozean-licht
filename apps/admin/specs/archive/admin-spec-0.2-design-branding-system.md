# Plan: Admin Spec 0.2 - Design System and Branding Unification

## Task Description
Create a comprehensive design system documentation and shared components strategy to ensure the admin dashboard and entire Ozean Licht ecosystem uses consistent branding. The primary goal is to enable AI agents to build with correct branding from the first shot by providing clear, authoritative design documentation and reusable component patterns.

## Objective
Establish a single source of truth for the Ozean Licht design system that:
1. Unifies branding across admin dashboard and main platform
2. Provides clear guidance for AI agents building new features
3. Creates a shared component library strategy for consistency
4. Documents all design tokens, patterns, and utilities
5. Ensures Kids Ascension can maintain its separate branding while sharing base components

## Problem Statement
Currently, the design system is fragmented across multiple applications:
- The true Ozean Licht branding exists in `apps/ozean-licht/` with turquoise/teal colors, cosmic themes, and glass effects
- The admin dashboard has partial implementation but lacks complete alignment
- No central design system documentation exists for AI agents to reference
- The existing `shared/ui-components/` folder is empty and unused
- AI agents lack clear guidance on which branding to apply where

## Solution Approach
1. **Create Central Design System Documentation**: A comprehensive `design-system.md` at the monorepo root that serves as the single source of truth
2. **Utilize Shared UI Components Folder**: Populate existing `shared/ui-components/` folder with common components that can be imported by all apps
3. **Align Admin Dashboard**: Update admin dashboard to fully implement Ozean Licht branding
4. **AI Agent Guidelines**: Add specific instructions for AI agents in documentation
5. **Brand Assets Organization**: Centralize logos, fonts, and other brand assets in `shared/` folder

## Relevant Files
Use these files to complete the task:

### Existing Files to Reference:
- `apps/ozean-licht/tailwind.config.js` - Source of truth for Ozean Licht design tokens
- `apps/ozean-licht/app/globals.css` - Complete CSS implementation with glass effects
- `apps/ozean-licht/README.md` - Documents current design system (lines 144-162)
- `apps/admin/docs/design-system.md` - Partial design documentation to merge/update
- `apps/admin/tailwind.config.js` - Admin tailwind config to align
- `apps/admin/app/globals.css` - Admin CSS to enhance
- `shared/ui-components/` - Existing empty folder to populate

### New Files to Create:
- `/design-system.md` - Central design system documentation
- `/BRANDING.md` - Brand guidelines and asset locations
- `/shared/ui-components/package.json` - Package configuration for shared components
- `/shared/ui-components/src/styles/globals.css` - Shared global styles
- `/shared/ui-components/src/components/index.ts` - Component exports
- `/shared/ui-components/src/tokens/colors.ts` - Design tokens as TypeScript
- `/shared/ui-components/README.md` - Component library documentation

## Implementation Phases
### Phase 1: Foundation
- Extract and document all design tokens from Ozean Licht app
- Create central design system documentation structure
- Set up shared/ui-components folder structure

### Phase 2: Core Implementation
- Populate shared UI components folder with base styles and tokens
- Migrate common components to shared folder
- Update admin dashboard to use shared components

### Phase 3: Integration & Polish
- Add AI agent-specific documentation sections
- Create visual component gallery
- Validate consistency across all apps
- Add automated design token validation

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Create Central Design System Documentation
- Create `/design-system.md` with comprehensive design documentation
- Include all color tokens from Ozean Licht (turquoise #0ec2bc as primary)
- Document typography (Cinzel Decorative, Montserrat, Montserrat Alternates)
- Document spacing scale, animations (glow, float, shine), and effects (glass cards)
- Add AI agent section with clear instructions on when to use which branding
- Include code examples for all major patterns

### 2. Create Brand Guidelines Document
- Create `/BRANDING.md` with brand positioning and voice
- Document logo usage and placement rules
- Specify which apps use Ozean Licht branding (admin, main platform)
- Clearly state Kids Ascension has separate branding
- Include color psychology and usage guidelines

### 3. Set Up Shared UI Components Structure
- Create proper structure in `/shared/ui-components/`:
  - `src/components/` - React components
  - `src/styles/` - Global styles and CSS
  - `src/tokens/` - Design tokens
  - `src/utils/` - Utility functions
- Initialize package.json with name `@ozean-licht/shared-ui`
- Set up TypeScript configuration
- Configure build process for component library
- Add README.md with usage instructions

### 4. Extract and Centralize Design Tokens
- Create `/shared/ui-components/src/tokens/colors.ts` with all color values
- Create `/shared/ui-components/src/tokens/typography.ts` with font definitions
- Create `/shared/ui-components/src/tokens/spacing.ts` with spacing scale
- Create `/shared/ui-components/src/tokens/animations.ts` with animation keyframes
- Export all tokens as TypeScript constants and CSS variables

### 5. Create Shared Global Styles
- Create `/shared/ui-components/src/styles/globals.css` with base styles
- Include glass card utilities (glass-card, glass-card-strong, glass-subtle)
- Add cosmic gradient backgrounds
- Include glow, float, and shine animations
- Add responsive typography classes

### 6. Migrate Common Components
- Identify components used in both admin and Ozean Licht apps
- Create shared versions in `/shared/ui-components/src/components/`
- Start with: Button, Card, Badge, Input, Select
- Ensure components use design tokens from shared folder
- Add proper TypeScript types and exports

### 7. Update Admin Dashboard Styling
- Update `apps/admin/tailwind.config.js` to import shared design tokens
- Enhance `apps/admin/app/globals.css` with missing Ozean Licht styles
- Add font imports for Cinzel, Cinzel Decorative, Montserrat, Montserrat Alternates
- Apply glass card effects to appropriate admin components
- Add cosmic gradient background option for admin

### 8. Create Component Usage Guidelines
- Document when to use glass effects vs solid backgrounds
- Provide examples of role-based color coding (admin roles)
- Show proper heading hierarchy with Cinzel fonts
- Document form patterns and data table styling
- Include responsive design patterns

### 9. Add AI Agent Instructions
- Create section in design-system.md specifically for AI agents
- Include decision tree for choosing correct branding
- Provide copy-paste component templates
- Add "DO" and "DON'T" examples
- Include checklist for new feature implementation

### 10. Validate and Document
- Test shared component imports in both admin and Ozean Licht apps
- Ensure all design tokens are properly documented
- Create visual examples of all component variations
- Add troubleshooting section for common issues
- Update main README.md to reference new design system

## Testing Strategy
- **Visual Regression Testing**: Implement visual snapshot tests for all shared components
- **Token Validation**: Create automated tests to ensure design tokens match between apps
- **Import Testing**: Verify shared components can be imported correctly in all apps
- **Cross-browser Testing**: Ensure glass effects and animations work across browsers
- **Accessibility Testing**: Verify color contrast meets WCAG AA standards
- **AI Agent Testing**: Have AI agent create a new component using only the documentation

## Acceptance Criteria
- [ ] Central design-system.md exists at monorepo root with complete documentation
- [ ] Shared UI components in `/shared/ui-components/` with at least 5 base components
- [ ] Admin dashboard fully implements Ozean Licht branding (turquoise, cosmic theme)
- [ ] All design tokens extracted and available as TypeScript constants
- [ ] Glass card effects working consistently across apps
- [ ] Typography hierarchy implemented with correct font families
- [ ] AI agents can reference single document for all design decisions
- [ ] No design duplication between admin and Ozean Licht apps
- [ ] Brand guidelines clearly separate Ozean Licht from Kids Ascension
- [ ] Component import works: `import { Button } from '@ozean-licht/shared-ui'`

## Validation Commands
Execute these commands to validate the task is complete:

```bash
# Test shared components build
cd shared/ui-components && npm run build

# Verify imports work in admin app
cd apps/admin && npm run dev
# Check that glass effects render at http://localhost:9200

# Verify imports work in Ozean Licht app
cd apps/ozean-licht && npm run dev
# Check that components match at http://localhost:3001

# Run visual regression tests (if implemented)
npm run test:visual

# Validate TypeScript types
npm run typecheck

# Check for CSS duplication
grep -r "glass-card" apps/ | wc -l  # Should only be in shared folder
```

## Notes
- **Monorepo Structure**: Uses existing `/shared/` folder structure, not creating new `/packages/` folder
- **Font Loading**: Ensure Google Fonts are loaded in all app layouts for Cinzel, Montserrat families
- **Dark Mode First**: Ozean Licht uses dark/cosmic theme as default, light mode is secondary
- **Glass Effects Performance**: Use backdrop-filter sparingly on mobile for performance
- **Color Accessibility**: Turquoise (#0ec2bc) on dark background (#0A0F1A) meets WCAG AA
- **Package Naming**: Use `@ozean-licht/shared-ui` as package name for clarity
- **Version Management**: Start shared package at version 0.1.0 for initial release
- **Kids Ascension Exception**: Document clearly that KA has different branding but can use base components
- **Import Path**: Components should be importable from both relative paths and package name