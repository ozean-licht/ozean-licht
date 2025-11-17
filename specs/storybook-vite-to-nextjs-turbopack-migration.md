# Plan: Storybook Migration from Vite to Next.js with Turbopack

## Task Description
Migrate the Storybook application from Vite-based build system to Next.js with Turbopack. This includes updating the framework configuration, migrating custom Vite plugins to Next.js API routes, updating build processes, and ensuring all features (authentication, AI iteration, component stories) continue to work seamlessly.

## Objective
Successfully migrate Storybook from `@storybook/react-vite` to `@storybook/nextjs` while:
- Preserving all existing functionality (authentication, AI iteration, component documentation)
- Leveraging Turbopack for faster build times and better development experience
- Maintaining compatibility with the monorepo structure
- Ensuring deployment on Coolify continues to work
- Improving performance through Next.js optimizations

## Problem Statement
The current Storybook setup uses Vite as the build tool, which requires:
- Custom Vite middleware for AI iteration features
- Mock implementations for Next.js modules (Link, Image, navigation)
- Complex Vite configuration for monorepo path resolution
- Separate build optimizations for production

Migrating to Next.js with Turbopack will:
- Eliminate the need for Next.js mocks (native support)
- Simplify the build configuration
- Provide faster development builds via Turbopack
- Unify the build tooling with the admin dashboard (already uses Next.js)
- Enable better code splitting and optimization

## Solution Approach
The migration will be executed in three phases:

**Phase 1: Framework Migration**
- Update Storybook framework from `@storybook/react-vite` to `@storybook/nextjs`
- Remove Vite-specific dependencies and configuration
- Configure Next.js settings for Storybook compatibility

**Phase 2: Feature Migration**
- Migrate AI iteration Vite plugin to Next.js API routes
- Remove Next.js mocks (no longer needed)
- Update authentication integration
- Migrate custom path resolution to Next.js aliases

**Phase 3: Build & Deployment**
- Update build scripts and configuration
- Migrate Dockerfile to Next.js build process
- Test deployment on Coolify
- Validate all features in production

## Relevant Files

### Existing Files to Modify
- `apps/storybook/.storybook/main.ts` - Switch from react-vite to nextjs framework
- `apps/storybook/package.json` - Update dependencies (remove Vite, add Next.js)
- `apps/storybook/.storybook/preview.ts` - Remove Vite-specific workarounds
- `apps/storybook/Dockerfile` - Update build process for Next.js
- `apps/storybook/docker-compose.yml` - Update deployment configuration
- `apps/storybook/tsconfig.json` - Update for Next.js compatibility
- `apps/storybook/tailwind.config.js` - Ensure Next.js compatibility
- `apps/storybook/postcss.config.js` - Verify Next.js compatibility

### Files to Remove
- `apps/storybook/ai-mvp/vite-plugin.ts` - Replaced by Next.js API routes
- `apps/storybook/mocks/next-link.tsx` - No longer needed
- `apps/storybook/mocks/next-image.tsx` - No longer needed
- `apps/storybook/mocks/next-navigation.tsx` - No longer needed
- `apps/storybook/mocks/next-server.tsx` - No longer needed

### New Files to Create
- `apps/storybook/next.config.mjs` - Next.js configuration with Turbopack
- `apps/storybook/app/api/ai/get-component/route.ts` - AI iteration endpoint (get component)
- `apps/storybook/app/api/ai/iterate/route.ts` - AI iteration endpoint (iterate component)
- `apps/storybook/.env.example` - Environment variables template

## Implementation Phases

### Phase 1: Framework Migration (Foundation)
**Goal:** Replace Vite with Next.js as the Storybook framework without breaking existing functionality.

**Key Activities:**
- Install Next.js and Storybook Next.js framework
- Update main Storybook configuration
- Remove Vite dependencies
- Basic Next.js configuration

**Success Criteria:**
- Storybook dev server starts with Next.js framework
- Component stories load correctly
- No critical errors in console

### Phase 2: Feature Migration (Core Implementation)
**Goal:** Migrate all custom Vite-specific features to Next.js equivalents.

**Key Activities:**
- Convert AI iteration Vite middleware to Next.js API routes
- Remove Next.js mocks
- Update path aliases and resolution
- Migrate custom decorators and addons

**Success Criteria:**
- AI iteration (Cmd+K) works in development
- Authentication flows work correctly
- All component stories render properly
- TypeScript compilation succeeds

### Phase 3: Build & Deployment (Integration & Polish)
**Goal:** Ensure production builds work and deployment is successful.

**Key Activities:**
- Update Dockerfile for Next.js
- Configure Turbopack for optimal performance
- Test production build locally
- Deploy to Coolify and validate

**Success Criteria:**
- Production build completes successfully
- Static export works for Storybook
- Deployment on Coolify succeeds
- All features work in production environment

## Step by Step Tasks

### 1. Install Next.js Dependencies
- Add `next@latest` to dependencies
- Add `@storybook/nextjs@^8.6.14` to dependencies
- Add `@storybook/addon-onboarding` (optional, for new features)
- Remove `@storybook/react-vite` from dependencies
- Remove `vite` from dependencies

### 2. Update Storybook Main Configuration
- Change framework from `@storybook/react-vite` to `@storybook/nextjs`
- Remove `viteFinal` configuration function
- Remove Vite-specific plugins
- Add Next.js-specific options (Turbopack, image optimization)
- Update path alias resolution for Next.js

### 3. Create Next.js Configuration File
- Create `apps/storybook/next.config.mjs`
- Enable Turbopack for development (`turbopack: true`)
- Configure path aliases using `resolve.alias` equivalent
- Set up static export configuration for Storybook
- Configure TypeScript and ESLint integration
- Set up experimental features if needed

### 4. Migrate AI Iteration to Next.js API Routes
- Create `apps/storybook/app/api/ai/get-component/route.ts`
  - Implement POST handler to read component source
  - Include path validation logic
  - Return component code as JSON
- Create `apps/storybook/app/api/ai/iterate/route.ts`
  - Implement POST handler for AI iteration
  - Include Claude API integration
  - Validate TypeScript syntax before writing
  - Write component updates
- Update `apps/storybook/ai-mvp/client.ts`
  - Change endpoints from `/__ai-get-component` to `/api/ai/get-component`
  - Change endpoints from `/__ai-iterate` to `/api/ai/iterate`
  - Ensure proper error handling

### 5. Remove Next.js Mocks
- Delete `apps/storybook/mocks/next-link.tsx`
- Delete `apps/storybook/mocks/next-image.tsx`
- Delete `apps/storybook/mocks/next-navigation.tsx`
- Delete `apps/storybook/mocks/next-server.tsx`
- Remove mock aliases from main configuration
- Update admin component imports to use native Next.js modules

### 6. Update Preview Configuration
- Remove React global assignment workaround (no longer needed with Next.js)
- Remove Vite-specific decorator logic
- Verify SessionProvider decorator still works
- Test AI iteration decorator with new API routes
- Ensure theme decorator functions correctly

### 7. Update TypeScript Configuration
- Ensure `compilerOptions.paths` align with Next.js aliases
- Add Next.js types to `types` array
- Set `moduleResolution` to `bundler` or `node16`
- Verify `jsx: "preserve"` for Next.js
- Add `.next` to exclude patterns

### 8. Update Build Scripts
- Update `dev` script to use Storybook with Next.js
- Update `build` script to generate static export
- Add `next build` script if needed for testing
- Ensure scripts work in monorepo context

### 9. Update Dockerfile for Next.js Build
- Update builder stage to use Next.js build process
- Install Next.js dependencies
- Run Storybook build (which now uses Next.js internally)
- Update production stage serving strategy
- Verify health check still works

### 10. Test Authentication Integration
- Test login flow in development mode
- Test session persistence across page reloads
- Verify JWT token handling
- Test user menu functionality
- Ensure NextAuth API routes work correctly

### 11. Test AI Iteration Feature
- Test Cmd+K keyboard shortcut
- Test component source retrieval
- Test AI iteration with Claude
- Verify file writes work correctly
- Test HMR after AI component updates

### 12. Test Component Stories
- Verify all admin components render
- Verify all shared UI components render
- Test component controls and interactions
- Verify accessibility checks work
- Test responsive design switching

### 13. Create Environment Variables Template
- Create `.env.example` with all required variables
- Document ANTHROPIC_API_KEY for AI features
- Document SHARED_USERS_DB_URL for authentication
- Document AUTH_SECRET for NextAuth
- Add comments explaining each variable

### 14. Update Documentation
- Update `apps/storybook/README.md` with Next.js information
- Document Turbopack usage
- Update development instructions
- Document new API routes for AI iteration
- Update troubleshooting section

### 15. Validate Production Build
- Run production build locally
- Test static export output
- Verify all assets are generated
- Check bundle sizes
- Test serving locally with http-server

### 16. Deploy and Validate on Coolify
- Push changes to main branch (or feature branch first)
- Monitor Coolify build logs
- Verify deployment succeeds
- Test production URL (https://storybook.ozean-licht.dev)
- Verify all features work in production

## Testing Strategy

### Unit Testing
- Verify TypeScript compilation passes (`pnpm typecheck`)
- Ensure no ESLint errors (`pnpm lint`)
- Test that all stories load without errors

### Integration Testing
- **Authentication Flow:**
  - Login with valid credentials
  - Logout successfully
  - Session persistence across refreshes
  - Invalid credentials handling

- **AI Iteration:**
  - Component source retrieval
  - AI-powered component updates
  - File write operations
  - Error handling for invalid paths

- **Component Rendering:**
  - All admin components display correctly
  - All shared UI components display correctly
  - Component controls work
  - Accessibility checks pass

- **Build Process:**
  - Development server starts successfully
  - Production build completes without errors
  - Static export generates all files
  - Docker build succeeds

### Edge Cases
- **Missing Environment Variables:**
  - Storybook should load without AI features if ANTHROPIC_API_KEY missing
  - Authentication should gracefully degrade if DB connection fails

- **Invalid Component Paths:**
  - AI iteration should reject paths outside allowed directories
  - Path traversal attempts should be blocked

- **Large Component Files:**
  - AI iteration should handle components up to reasonable size limits
  - Timeouts should be handled gracefully

- **Concurrent Builds:**
  - Multiple developers building simultaneously
  - CI/CD pipeline builds

## Acceptance Criteria

### Functional Requirements
- ✅ Storybook dev server starts with Next.js framework
- ✅ Storybook build completes successfully
- ✅ All component stories load and render correctly
- ✅ AI iteration (Cmd+K) works in development mode
- ✅ Authentication (login/logout) functions properly
- ✅ Session state persists across page reloads
- ✅ Component controls and interactions work
- ✅ Accessibility checks run without critical violations
- ✅ Deployment on Coolify succeeds

### Performance Requirements
- ✅ Development server startup < 10 seconds (Turbopack benefit)
- ✅ HMR updates < 2 seconds
- ✅ Production build completes in reasonable time (< 10 minutes)
- ✅ Static export size is comparable or smaller than Vite build

### Technical Requirements
- ✅ No TypeScript compilation errors
- ✅ No ESLint errors
- ✅ No critical console errors in development or production
- ✅ Next.js Turbopack enabled and functioning
- ✅ All Storybook addons continue to work

### Documentation Requirements
- ✅ README updated with Next.js information
- ✅ Environment variables documented
- ✅ Migration notes added
- ✅ Troubleshooting guide updated

## Validation Commands

Execute these commands to validate the migration is complete:

### Development Testing
```bash
# Navigate to storybook directory
cd apps/storybook

# Install dependencies
pnpm install

# Start development server (should use Next.js + Turbopack)
pnpm dev
# Expected: Server starts on http://localhost:6006
# Expected: Console shows "Using Next.js" or similar
# Expected: No critical errors in terminal

# Open browser and test
# Expected: http://localhost:6006 loads successfully
# Expected: Component stories render
# Expected: Cmd+K triggers AI iteration modal (dev only)
# Expected: Login works (if DB configured)
```

### TypeScript & Linting
```bash
# Type checking
pnpm typecheck
# Expected: No TypeScript errors

# Linting (if configured)
pnpm lint
# Expected: No ESLint errors
```

### Build Testing
```bash
# Build Storybook for production
pnpm build
# Expected: Build completes successfully
# Expected: storybook-static/ directory created
# Expected: index.html and all assets present

# Serve locally to test
npx http-server storybook-static -p 6006
# Expected: http://localhost:6006 loads
# Expected: All stories work
# Expected: No console errors
```

### Docker Build Testing
```bash
# Build Docker image
docker build -t storybook-test .
# Expected: Build succeeds

# Run container
docker run -p 6006:6006 storybook-test
# Expected: Container starts
# Expected: http://localhost:6006 accessible
# Expected: Health check passes
```

### Feature Validation
```bash
# Test authentication (requires DB)
# 1. Click "Sign In" in toolbar
# 2. Enter credentials
# 3. Verify user menu appears
# Expected: Login successful, session persists

# Test AI iteration (requires ANTHROPIC_API_KEY, dev only)
# 1. Open any component story
# 2. Press Cmd+K
# 3. Enter iteration prompt
# Expected: Component updates, HMR triggers

# Test component rendering
# 1. Navigate through all stories in sidebar
# 2. Verify each component renders
# Expected: No rendering errors, all controls work
```

### Deployment Validation
```bash
# After deploying to Coolify
# 1. Visit https://storybook.ozean-licht.dev
# 2. Verify all stories load
# 3. Test authentication
# Expected: Production deployment works correctly

# Check deployment logs in Coolify
# Expected: Build logs show successful Next.js build
# Expected: Container health check passes
```

## Notes

### Dependencies to Install
```bash
pnpm add next@latest @storybook/nextjs@^8.6.14
pnpm remove @storybook/react-vite vite
```

### Environment Variables Required
```env
# AI Iteration (development only)
ANTHROPIC_API_KEY=your-api-key-here

# Authentication (optional, for enhanced features)
SHARED_USERS_DB_URL=postgresql://user:pass@host:5432/shared_users_db
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:6006
```

### Turbopack Configuration
Turbopack is enabled automatically in Next.js 15+ for development. For earlier versions, use:
```javascript
// next.config.mjs
export default {
  experimental: {
    turbo: true,
  },
};
```

### Potential Issues & Solutions

**Issue:** Next.js App Router conflicts with Storybook
- **Solution:** Storybook handles this automatically; no action needed

**Issue:** AI iteration endpoints not found
- **Solution:** Ensure API routes are in `app/api/` directory with correct file names

**Issue:** Authentication breaks after migration
- **Solution:** Verify `app/api/auth/[...nextauth]/route.ts` is present and configured

**Issue:** Slow builds with Turbopack
- **Solution:** Check Next.js version (15+ has better Turbopack support)

**Issue:** Monorepo path resolution fails
- **Solution:** Configure `next.config.mjs` with proper aliases matching tsconfig paths

### Migration Timeline Estimate
- **Phase 1 (Framework Migration):** 2-3 hours
- **Phase 2 (Feature Migration):** 4-5 hours
- **Phase 3 (Build & Deployment):** 2-3 hours
- **Testing & Validation:** 2-3 hours
- **Total Estimated Time:** 10-14 hours

### Rollback Strategy
If issues arise, rollback steps:
1. Revert git changes: `git checkout main -- apps/storybook`
2. Reinstall dependencies: `pnpm install`
3. Verify Vite version works: `pnpm dev`
4. Report issues in GitHub for investigation

### Next Steps After Migration
- Monitor performance metrics (build time, HMR speed)
- Gather developer feedback on Turbopack experience
- Document any Next.js-specific patterns for future stories
- Consider enabling additional Next.js features (image optimization, etc.)
- Update team documentation and training materials
