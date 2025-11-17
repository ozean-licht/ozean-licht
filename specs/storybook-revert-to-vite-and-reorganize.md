# Plan: Revert Storybook to Vite and Reorganize for Proper Separation of Concerns

## Task Description
Revert the recent Storybook migration from Next.js back to Vite (react-vite) and reorganize the codebase structure to follow proper separation of concerns. The goal is to move Storybook from `apps/storybook/` into `packages/shared-ui/.storybook/`, making the shared-ui package a self-contained, framework-agnostic React component library with its own documentation.

## Objective
Successfully restructure the codebase to achieve:
```
packages/
  └── shared-ui/              ← Pure React components (framework-agnostic)
      ├── src/                ← Component source files
      ├── .storybook/         ← Storybook config (uses Vite builder)
      └── package.json        ← Self-contained package

apps/
  ├── kids-ascension/         ← Next.js app (consumes @ozean-licht/shared-ui)
  ├── ozean-licht/            ← Next.js app (consumes @ozean-licht/shared-ui)
  └── admin/                  ← Next.js app (consumes @ozean-licht/shared-ui)
```

This structure ensures:
- **Pure components**: shared-ui contains only React components, no Next.js dependencies
- **Self-contained documentation**: Storybook lives with the components it documents
- **Framework independence**: Components can be used in any React framework
- **Clear boundaries**: Apps consume the package, not the other way around

## Problem Statement
The current structure has several issues:

1. **Incorrect separation**: Storybook lives in `apps/` but isn't really an application
2. **Next.js coupling**: Shared UI components are documented using Next.js-specific tooling
3. **Complex dependencies**: Storybook has Next.js, NextAuth, PostgreSQL dependencies for non-essential features
4. **Migration mistake**: Recent switch to Next.js added unnecessary complexity
5. **Monorepo confusion**: `shared/` directory should be `packages/` for clarity

The ideal architecture separates concerns:
- **Packages** = Reusable, framework-agnostic libraries
- **Apps** = Framework-specific applications that consume packages
- **Storybook** = Documentation tool that lives with what it documents

## Solution Approach
The reversion and reorganization will be executed in four phases:

**Phase 1: Prepare Packages Directory**
- Create `packages/` directory structure
- Update pnpm-workspace.yaml to include `packages/*`
- Set up packages/shared-ui/ with proper structure

**Phase 2: Revert to Vite**
- Restore Storybook to use `@storybook/react-vite`
- Remove Next.js dependencies and configuration
- Remove Next.js-specific features (API routes, NextAuth)
- Restore Vite configuration

**Phase 3: Move Storybook into Packages**
- Move `.storybook/` from `apps/storybook/` to `packages/shared-ui/`
- Update story paths to be relative to new location
- Update all imports and references
- Consolidate authentication addon (optional, simpler implementation)

**Phase 4: Clean Up and Validate**
- Remove old `apps/storybook/` directory
- Update all app dependencies to use new package location
- Update build scripts and CI/CD
- Validate all functionality works

## Relevant Files

### Files to Move/Modify

**From apps/storybook/ → packages/shared-ui/:**
- `.storybook/main.ts` - Storybook configuration (revert to Vite)
- `.storybook/preview.ts` - Preview configuration (remove Next.js-specific code)
- `.storybook/manager.ts` - Manager configuration (keep as-is)
- `tailwind.config.js` - Tailwind config (move to shared-ui)
- `postcss.config.js` - PostCSS config (move to shared-ui)
- `globals.css` - Global styles (move to shared-ui)

**From shared/ui/ → packages/shared-ui/:**
- `src/` - All component source files
- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration
- `README.md` - Package documentation

**To Update:**
- `/pnpm-workspace.yaml` - Add `packages/*` pattern
- `apps/admin/package.json` - Update shared-ui import path
- `apps/ozean-licht/package.json` - Update shared-ui import path
- `apps/kids-ascension/package.json` - Update shared-ui import path (if applicable)
- Root `package.json` - Update scripts if needed

### Files to Remove
- `apps/storybook/` - Entire directory (after migration complete)
- `apps/storybook/app/api/` - Next.js API routes
- `apps/storybook/lib/auth/` - NextAuth configuration
- `apps/storybook/components/auth/` - Auth components
- `apps/storybook/ai-mvp/` - AI iteration features (optional: simplify or remove)
- `apps/storybook/next.config.mjs` - Next.js configuration
- `apps/storybook/Dockerfile` - Docker configuration (create new Vite-based one)
- `apps/storybook/docker-compose.yml` - Docker Compose config

### New Files to Create
- `packages/shared-ui/.storybook/main.ts` - Vite-based Storybook config
- `packages/shared-ui/.storybook/preview.ts` - Simplified preview config
- `packages/shared-ui/vite.config.ts` - Vite configuration for Storybook
- `packages/shared-ui/Dockerfile` - Docker config for Storybook deployment
- `packages/shared-ui/docker-compose.yml` - Docker Compose for Storybook
- `packages/shared-ui/.storybook/README.md` - Storybook documentation

## Implementation Phases

### Phase 1: Prepare Packages Directory (Foundation)
**Goal:** Create the new `packages/` directory structure and move shared-ui package.

**Key Activities:**
- Create `packages/` directory
- Move `shared/ui/` to `packages/shared-ui/`
- Update pnpm-workspace.yaml
- Update all package references

**Success Criteria:**
- `packages/shared-ui/` exists with all component source files
- pnpm workspace recognizes the new package
- All apps can still import from `@ozean-licht/shared-ui`

### Phase 2: Revert to Vite (Core Implementation)
**Goal:** Remove Next.js dependencies and restore Vite-based Storybook configuration.

**Key Activities:**
- Update package.json to use `@storybook/react-vite`
- Remove Next.js, NextAuth, and related dependencies
- Restore `viteFinal` configuration
- Remove Next.js-specific code (API routes, auth)

**Success Criteria:**
- Storybook uses Vite builder
- No Next.js dependencies remain
- Development server starts successfully
- All stories load correctly

### Phase 3: Move Storybook into Packages (Integration)
**Goal:** Move Storybook configuration from `apps/storybook/` to `packages/shared-ui/.storybook/`.

**Key Activities:**
- Create `.storybook/` directory in packages/shared-ui/
- Move and update Storybook configuration files
- Update story paths to be relative to new location
- Update Tailwind and PostCSS configs
- Create new Dockerfile for deployment

**Success Criteria:**
- Storybook runs from `packages/shared-ui/`
- All stories from shared-ui, admin, and other apps load correctly
- Build process generates static output
- Docker build succeeds

### Phase 4: Clean Up and Validate (Polish)
**Goal:** Remove old directory, update references, and validate everything works.

**Key Activities:**
- Remove `apps/storybook/` directory
- Update Coolify deployment configuration
- Update README and documentation
- Run full test suite

**Success Criteria:**
- No references to old `apps/storybook/` location
- All apps build and run successfully
- Storybook deploys to production
- Documentation is up to date

## Step by Step Tasks

### 1. Create Packages Directory Structure
- Create `packages/` directory: `mkdir -p packages`
- Move `shared/ui/` to `packages/shared-ui/`: `mv shared/ui packages/shared-ui`
- Verify file permissions are correct: `ls -la packages/shared-ui`

### 2. Update pnpm Workspace Configuration
- Edit `pnpm-workspace.yaml`
- Add `packages/*` to the packages array
- Keep `shared/*` for backward compatibility temporarily
- Run `pnpm install` to verify workspace recognition

### 3. Update Package References in Apps
- **apps/admin/package.json**: Verify `@ozean-licht/shared-ui` dependency
- **apps/ozean-licht/package.json**: Verify `@ozean-licht/shared-ui` dependency
- **apps/kids-ascension/package.json**: Verify `@ozean-licht/shared-ui` dependency (if applicable)
- Run `pnpm install` to regenerate lock file with new paths
- Test that apps can still import components: `pnpm --filter admin build`

### 4. Create Storybook Directory in Packages
- Create `.storybook/` directory: `mkdir -p packages/shared-ui/.storybook`
- Create placeholder files for migration

### 5. Revert Storybook to Vite Dependencies
- Navigate to current storybook: `cd apps/storybook`
- Remove Next.js dependencies:
  ```bash
  pnpm remove next @storybook/nextjs next-auth pg bcryptjs
  pnpm remove @types/pg @types/bcryptjs
  ```
- Add Vite dependencies:
  ```bash
  pnpm add -D @storybook/react-vite vite
  ```
- Update package.json scripts to remove Next.js specific commands

### 6. Restore Vite-based Storybook Configuration
- Edit `apps/storybook/.storybook/main.ts`
- Change framework from `@storybook/nextjs` to `@storybook/react-vite`
- Remove Next.js-specific options (nextConfigPath, staticDirs)
- Add `viteFinal` configuration function
- Restore Vite path aliases and optimizations
- Reference git commit `ab18f80^` for previous configuration

### 7. Remove Next.js-Specific Features
- Delete `apps/storybook/app/` directory (Next.js API routes)
- Delete `apps/storybook/lib/auth/` directory (NextAuth config)
- Delete `apps/storybook/components/auth/` directory (Auth UI components)
- Delete `apps/storybook/next.config.mjs` file
- Update `.storybook/preview.ts` to remove SessionProvider and auth decorators

### 8. Simplify Storybook Features
- **Option A (Recommended)**: Remove AI iteration features entirely
  - Delete `apps/storybook/ai-mvp/` directory
  - Simpler, faster Storybook focused on documentation
- **Option B (Keep AI features)**: Simplify AI iteration
  - Convert to Vite plugin instead of Next.js API routes
  - Remove authentication requirement
  - Keep for development only (not in production)

### 9. Move Storybook Configuration to Packages
- Copy `.storybook/` files from `apps/storybook/` to `packages/shared-ui/`:
  ```bash
  cp -r apps/storybook/.storybook/* packages/shared-ui/.storybook/
  ```
- Update story paths in `packages/shared-ui/.storybook/main.ts`:
  ```typescript
  stories: [
    // Shared UI components (same directory)
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Admin components (external app)
    '../../apps/admin/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ]
  ```

### 10. Move Build Configuration Files
- Copy `tailwind.config.js` to `packages/shared-ui/`
- Copy `postcss.config.js` to `packages/shared-ui/`
- Copy `globals.css` to `packages/shared-ui/` (if not already there)
- Update paths in these files to be relative to new location
- Create `vite.config.ts` in `packages/shared-ui/` for build optimization

### 11. Update Package Scripts
- Edit `packages/shared-ui/package.json`
- Add Storybook scripts:
  ```json
  {
    "scripts": {
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build -o storybook-static",
      "build": "tsup src/index.ts --format cjs,esm --dts",
      "dev": "pnpm run storybook"
    }
  }
  ```

### 12. Create Dockerfile for Storybook
- Create `packages/shared-ui/Dockerfile`
- Base on Node.js image with pnpm
- Multi-stage build: builder stage + production stage
- Build Storybook static output
- Serve with nginx or simple http server
- Reference previous Vite-based Docker config if available

### 13. Create Docker Compose Configuration
- Create `packages/shared-ui/docker-compose.yml`
- Configure for Coolify deployment
- Set proper ports (6006)
- Configure environment variables
- Add health check endpoint

### 14. Test Storybook from New Location
- Navigate to packages/shared-ui: `cd packages/shared-ui`
- Install dependencies: `pnpm install`
- Start Storybook: `pnpm storybook`
- Verify stories load from all sources:
  - shared-ui components (../src/**)
  - admin components (../../apps/admin/components/**)
- Check for console errors
- Test component interactions and controls

### 15. Update Root Scripts (Optional)
- Edit root `package.json`
- Update Storybook scripts to point to new location:
  ```json
  {
    "scripts": {
      "storybook": "pnpm --filter @ozean-licht/shared-ui storybook",
      "build-storybook": "pnpm --filter @ozean-licht/shared-ui build-storybook"
    }
  }
  ```

### 16. Remove Old Storybook Directory
- Verify new Storybook works correctly
- Create git branch for safety: `git checkout -b revert-storybook-to-vite`
- Remove old directory: `rm -rf apps/storybook`
- Commit changes with clear message

### 17. Update Coolify Deployment
- Update Coolify project to point to new directory:
  - Build context: `packages/shared-ui`
  - Dockerfile path: `packages/shared-ui/Dockerfile`
- Update environment variables if needed
- Test deployment to staging first
- Monitor build logs for errors

### 18. Update Documentation
- Update `packages/shared-ui/README.md` with Storybook information
- Update root `README.md` to reflect new structure
- Create `packages/shared-ui/.storybook/README.md` with usage guide
- Document differences from Next.js version
- Add migration notes for team

### 19. Clean Up Remaining Shared Directory
- If `shared/` directory is now empty (except ui moved to packages):
  - Remove from `pnpm-workspace.yaml`
  - Remove empty `shared/ui/` directory
- If other packages remain in `shared/`:
  - Consider moving them to `packages/` as well for consistency
  - Update workspace config accordingly

### 20. Validate Complete System
- Test all apps still build: `pnpm build`
- Test Storybook builds: `pnpm --filter @ozean-licht/shared-ui build-storybook`
- Test component imports in each app:
  - Admin: `pnpm --filter admin dev`
  - Ozean Licht: `pnpm --filter @ol/web dev`
  - Kids Ascension: `pnpm --filter @ka/web dev`
- Verify no broken imports or missing dependencies
- Run type checking: `pnpm typecheck` (if available)

## Testing Strategy

### Unit Testing
- **TypeScript Compilation:**
  - Run `pnpm typecheck` in packages/shared-ui
  - Verify no errors in component files
  - Verify Storybook config types are correct

- **Package Exports:**
  - Test importing components in each app
  - Verify all exported components are accessible
  - Check that barrel exports (index.ts) work correctly

### Integration Testing
- **Storybook Functionality:**
  - All stories load without errors
  - Component controls work correctly
  - Accessibility addon functions properly
  - Interactions addon works
  - Responsive viewport switching works

- **Cross-App Compatibility:**
  - Admin app can import and render shared components
  - Ozean Licht app can import and render shared components
  - Kids Ascension app can import and render shared components
  - No duplicate React instances or style conflicts

- **Build Process:**
  - Storybook static build completes successfully
  - Output size is reasonable (< 50MB)
  - All assets are generated correctly
  - Docker build succeeds without errors

### Deployment Testing
- **Local Docker:**
  - Build Docker image locally
  - Run container and access on localhost:6006
  - Verify all stories work in containerized environment

- **Coolify Staging:**
  - Deploy to staging environment first
  - Test all functionality in production-like environment
  - Verify performance is acceptable
  - Check for any production-only issues

- **Coolify Production:**
  - Deploy to production (https://storybook.ozean-licht.dev)
  - Smoke test all major component categories
  - Monitor for errors in production logs
  - Verify analytics/monitoring works (if configured)

### Regression Testing
- **Story Coverage:**
  - Verify no stories were lost in migration
  - Check that all documented components still appear
  - Ensure story organization remains logical

- **Feature Parity:**
  - Dark mode toggle works
  - Font loading works correctly
  - Ozean Licht branding is intact
  - Component interactions function as expected

### Edge Cases
- **Monorepo Path Resolution:**
  - Stories from multiple apps load correctly
  - Tailwind classes work across all components
  - Shared dependencies don't cause conflicts

- **Large Component Libraries:**
  - Storybook handles 50+ component stories
  - Navigation remains performant
  - Search functionality works

- **Missing Dependencies:**
  - Graceful degradation if optional features unavailable
  - Clear error messages for configuration issues

## Acceptance Criteria

### Structural Requirements
- ✅ `packages/shared-ui/` exists with complete component library
- ✅ `.storybook/` directory is inside `packages/shared-ui/`
- ✅ `apps/storybook/` directory is completely removed
- ✅ pnpm-workspace.yaml includes `packages/*`
- ✅ All apps import from `@ozean-licht/shared-ui` successfully

### Technical Requirements
- ✅ Storybook uses `@storybook/react-vite` (not Next.js)
- ✅ No Next.js dependencies in shared-ui package.json
- ✅ Vite configuration is present and working
- ✅ TypeScript compilation succeeds with no errors
- ✅ All component stories load and render correctly

### Functional Requirements
- ✅ Storybook dev server starts from `packages/shared-ui`
- ✅ Production build generates static output
- ✅ All apps can import and use shared components
- ✅ Component controls and interactions work
- ✅ Accessibility checks run without critical violations
- ✅ Responsive design switching functions correctly

### Deployment Requirements
- ✅ Docker build completes successfully
- ✅ Docker container runs and serves Storybook
- ✅ Deployment on Coolify succeeds
- ✅ Production URL (https://storybook.ozean-licht.dev) is accessible
- ✅ All features work in production environment

### Documentation Requirements
- ✅ README updated in packages/shared-ui
- ✅ Storybook-specific README created in .storybook/
- ✅ Root README reflects new structure
- ✅ Migration notes documented for team
- ✅ Architecture decision recorded

### Performance Requirements
- ✅ Storybook dev server starts in < 5 seconds
- ✅ HMR updates complete in < 1 second
- ✅ Production build completes in < 5 minutes
- ✅ Static bundle size is < 50MB

### Code Quality Requirements
- ✅ No ESLint errors (if linting configured)
- ✅ No TypeScript errors
- ✅ No console errors in development or production
- ✅ Consistent code style maintained

## Validation Commands

Execute these commands to validate the reversion and reorganization is complete:

### Workspace Validation
```bash
# Verify pnpm workspace recognizes new structure
pnpm list --depth 0
# Expected: Should show @ozean-licht/shared-ui package

# Verify packages directory is recognized
ls -la packages/
# Expected: shared-ui/ directory exists

# Verify old structure is gone
ls -la apps/ | grep storybook
# Expected: No output (storybook should not be in apps/)
```

### Package Installation
```bash
# Install all dependencies from root
pnpm install
# Expected: No errors, all workspaces recognized

# Verify shared-ui dependencies
pnpm --filter @ozean-licht/shared-ui list
# Expected: Shows Vite, Storybook, React (no Next.js)
```

### Storybook Development
```bash
# Start Storybook from new location
cd packages/shared-ui
pnpm storybook
# Expected: Server starts at http://localhost:6006
# Expected: No critical errors in console
# Expected: Console shows "Vite" or "react-vite"

# Or from root
pnpm --filter @ozean-licht/shared-ui storybook
# Expected: Same as above
```

### Component Import Testing
```bash
# Test admin app can import components
cd apps/admin
pnpm dev
# Expected: Starts successfully
# Expected: Can import from @ozean-licht/shared-ui
# Expected: Components render correctly

# Test component import in code
node -e "console.log(require.resolve('@ozean-licht/shared-ui'))"
# Expected: Points to packages/shared-ui/dist/index.js
```

### Build Testing
```bash
# Build Storybook static output
cd packages/shared-ui
pnpm build-storybook
# Expected: Completes successfully
# Expected: storybook-static/ directory created
# Expected: Contains index.html and assets

# Verify output size
du -sh storybook-static/
# Expected: < 50MB

# Serve locally to test
npx http-server storybook-static -p 6006
# Expected: Accessible at http://localhost:6006
# Expected: All stories work
```

### TypeScript Validation
```bash
# Type check shared-ui package
cd packages/shared-ui
pnpm typecheck
# Expected: No TypeScript errors

# Type check apps
cd ../../apps/admin
pnpm typecheck
# Expected: No errors importing shared-ui types
```

### Docker Build Testing
```bash
# Build Docker image
cd packages/shared-ui
docker build -t storybook-vite .
# Expected: Build succeeds

# Run container
docker run -p 6006:6006 storybook-vite
# Expected: Container starts
# Expected: http://localhost:6006 accessible
```

### Story Coverage Validation
```bash
# Visit Storybook in browser
open http://localhost:6006

# Manual checks:
# ✅ Navigate through all component categories
# ✅ Verify shared-ui components appear
# ✅ Verify admin components appear
# ✅ Test component controls
# ✅ Test accessibility checks
# ✅ Test responsive viewports
# ✅ Verify Ozean Licht branding (colors, fonts)
```

### Deployment Validation
```bash
# After deploying to Coolify:

# Check deployment logs
# Expected: Build succeeds, no errors

# Visit production URL
curl -I https://storybook.ozean-licht.dev
# Expected: HTTP 200 response

# Test in browser
open https://storybook.ozean-licht.dev
# Expected: Storybook loads
# Expected: All stories accessible
# Expected: No console errors
```

### Regression Testing
```bash
# Verify no stories were lost
# Count stories before and after migration
# Expected: Same number or more stories

# Test all apps still work
pnpm --filter admin build
pnpm --filter @ol/web build
pnpm --filter @ka/web build
# Expected: All builds succeed
# Expected: No import errors
```

## Notes

### Dependencies to Change

**Remove from Storybook:**
```bash
pnpm remove next @storybook/nextjs next-auth pg bcryptjs @types/pg @types/bcryptjs
```

**Add to Storybook:**
```bash
pnpm add -D @storybook/react-vite vite
```

### Vite Configuration Template

```typescript
// packages/shared-ui/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

### Storybook Main Config Template

```typescript
// packages/shared-ui/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../apps/admin/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    // Customize Vite config here
    return config;
  },
};

export default config;
```

### Potential Issues & Solutions

**Issue:** Apps can't find shared-ui package after move
- **Solution:** Run `pnpm install` from root to regenerate symlinks

**Issue:** Story paths break after directory move
- **Solution:** Update story glob patterns in main.ts to be relative to new location

**Issue:** Tailwind classes don't work in stories
- **Solution:** Ensure tailwind.config.js is in shared-ui and referenced in preview.ts

**Issue:** Docker build fails with missing dependencies
- **Solution:** Ensure pnpm-lock.yaml is committed and workspace context is correct

**Issue:** Coolify deployment fails
- **Solution:** Update build context path to `packages/shared-ui` in Coolify settings

**Issue:** Performance degradation compared to Next.js
- **Solution:** Optimize Vite config, enable pre-bundling, use SWC plugin

### Migration Timeline Estimate
- **Phase 1 (Prepare Packages):** 1-2 hours
- **Phase 2 (Revert to Vite):** 2-3 hours
- **Phase 3 (Move Storybook):** 3-4 hours
- **Phase 4 (Clean Up & Validate):** 2-3 hours
- **Testing & Documentation:** 2-3 hours
- **Total Estimated Time:** 10-15 hours

### Rollback Strategy
If critical issues arise during migration:

1. **Immediate rollback:**
   ```bash
   git checkout main -- apps/storybook shared/ui
   pnpm install
   cd apps/storybook && pnpm dev
   ```

2. **Partial rollback (keep new structure, revert to working state):**
   ```bash
   # Keep packages/ structure but restore previous Storybook config
   git checkout <commit-before-migration> -- packages/shared-ui/.storybook
   pnpm install
   ```

3. **Report issues:**
   - Document what failed
   - Capture error logs
   - Create GitHub issue with reproduction steps

### Benefits of New Structure

**For Developers:**
- ✅ Clear separation: packages vs apps
- ✅ Framework independence: Components work in any React framework
- ✅ Self-contained: Shared-ui package has its own documentation
- ✅ Faster builds: Vite is faster than Next.js for component libraries
- ✅ Simpler setup: No Next.js complexity for pure React components

**For the Project:**
- ✅ Standard monorepo structure (packages + apps)
- ✅ Easier to open-source shared-ui in the future
- ✅ Better architectural boundaries
- ✅ Easier to add more packages or apps
- ✅ Consistent with industry best practices

**For Performance:**
- ✅ Vite HMR is faster for component development
- ✅ Smaller bundle sizes (no Next.js overhead)
- ✅ Faster Storybook build times
- ✅ Better developer experience with instant feedback

### Future Enhancements

After successful migration, consider:

1. **Add Vitest for component testing:**
   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Add visual regression testing:**
   - Use Storybook's Chromatic addon
   - Or Percy for visual diffs

3. **Add component documentation:**
   - Use Storybook's MDX docs
   - Add detailed usage examples
   - Include do's and don'ts

4. **Optimize build:**
   - Tree-shaking configuration
   - Code splitting for large component libraries
   - CDN caching strategy

5. **Consider publishing:**
   - Prepare shared-ui for npm publishing
   - Semantic versioning
   - Changelog automation

### Architecture Decision Record

**Context:**
- Storybook was initially in apps/ using Vite
- Recently migrated to Next.js for unclear reasons
- This added unnecessary complexity and coupling

**Decision:**
- Revert to Vite-based Storybook
- Move to packages/shared-ui/.storybook/
- Maintain framework independence

**Consequences:**
- **Positive:**
  - Clear separation of concerns
  - Framework-agnostic component library
  - Faster development builds with Vite
  - Standard monorepo structure
  - Self-contained package with documentation

- **Negative:**
  - Migration effort required
  - Loss of Next.js-specific features (if any were used)
  - Need to update deployment configuration

- **Neutral:**
  - Authentication addon may need simplification
  - AI iteration features may be removed or simplified

**Status:** Approved and ready for implementation
