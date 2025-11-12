# Storybook MVP Deployment Roadmap

**Version:** 1.0 - MVP Ready
**Date:** 2025-11-12
**Status:** Ready to Execute
**Timeline:** 1-2 days
**Goal:** Deploy Storybook to production at https://storybook.ozean-licht.dev

---

## Executive Summary

Storybook is feature-complete with 66+ documented components, excellent performance metrics, and full deployment infrastructure. This roadmap focuses on a **minimal viable product (MVP) launch** by removing unnecessary complexity (Argos visual regression, Chromatic integration, over-engineered intelligent addons) and deploying to production immediately.

**Current State:**
- Build time: 13.4s (target: < 20s) ✅
- Bundle size: 4.0MB (target: < 5MB) ✅
- Dev startup: 4.04s (target: < 5s) ✅
- Components: 66+ with stories ✅
- Deployment config: Ready ✅
- Documentation: 40,000+ words ✅

**MVP Deliverable:** Production-ready Storybook accessible at storybook.ozean-licht.dev with zero external dependencies.

---

## Phase 1: Cleanup (Day 1 - 2 hours)

### 1.1 Remove Argos References
**Objective:** Strip out visual regression testing infrastructure
**Status:** Not Started

- [ ] **Delete Argos documentation files**
  ```bash
  rm -f /opt/ozean-licht-ecosystem/storybook/docs/ARGOS_SETUP.md
  rm -f /opt/ozean-licht-ecosystem/storybook/docs/reports/phase-2-argos-integration.md
  ```

- [ ] **Remove Argos from package.json**
  - Remove: `"@argos-ci/cli": "^3.2.1"` from devDependencies
  - Remove: `"argos": "argos upload storybook-static"` from scripts
  - Command: Edit `package.json` and remove Argos lines

- [ ] **Delete Argos from .storybook/main.ts configuration**
  - Remove any Argos/visual testing references from Storybook config
  - Verify no Argos imports in config files

- [ ] **Remove Argos from GitHub Actions**
  - Check `.github/workflows/deploy-storybook.yml`
  - Remove Chromatic job if present
  - Remove Argos references from workflow

- [ ] **Verify no Argos Docker files**
  - Check if `/opt/ozean-licht-ecosystem/storybook/argos/` directory exists
  - If exists, it's safe to ignore (will be replaced by MVP focus)

---

### 1.2 Remove Chromatic References
**Objective:** Remove paid visual regression service configuration
**Status:** Not Started

- [ ] **Remove Chromatic from package.json**
  - Remove: `"chromatic": "chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}"` from scripts
  - Command: Edit `package.json` and remove Chromatic script

- [ ] **Remove Chromatic from documentation**
  - Search for "chromatic" in all markdown files:
    ```bash
    grep -r "chromatic" /opt/ozean-licht-ecosystem/storybook/docs/ || echo "None found"
    ```
  - Delete any references found

- [ ] **Verify no Chromatic secrets in GitHub**
  - Remove `CHROMATIC_PROJECT_TOKEN` from `.storybook/` if documented
  - Confirm no Chromatic setup in GitHub Actions workflow

---

### 1.3 Simplify Over-Engineered Documentation
**Objective:** Keep reference docs, remove 16-week "intelligent roadmap"
**Status:** Not Started

- [ ] **Rename intelligenc roadmap to future reference**
  - Move `/opt/ozean-licht-ecosystem/storybook/specs/storybook-intelligent-roadmap.md` to:
    ```bash
    mv /opt/ozean-licht-ecosystem/storybook/specs/storybook-intelligent-roadmap.md \
       /opt/ozean-licht-ecosystem/storybook/specs/FUTURE_ENHANCEMENTS.md
    ```
  - Add note at top: "This document describes potential future enhancements beyond MVP. Not part of current roadmap."

- [ ] **Remove unnecessary phase reports**
  - These are fine to keep (historical) but update README to focus on current state
  - Keep only: phase-4-complete.md (most recent)
  - Optional: Archive older phase reports to archive folder

- [ ] **Simplify README.md**
  - Remove reference to "Intelligent Storybook Roadmap"
  - Update vision to focus on MVP: "Component documentation and testing platform"
  - Update project status from "Phase 1 (60% Complete)" to "MVP Ready - Production"
  - Remove 16-week timeline mentions

---

## Phase 2: Verification (Day 1 - 1 hour)

### 2.1 Verify Build & Bundle
**Objective:** Ensure Storybook builds cleanly without Argos/Chromatic
**Status:** Not Started

- [ ] **Clean install and rebuild**
  ```bash
  cd /opt/ozean-licht-ecosystem
  rm -rf node_modules package-lock.json
  npm install
  npm run build-storybook
  ```
  - Expected: Build completes in ~13.4 seconds
  - Expected: No errors about missing Argos or Chromatic

- [ ] **Verify bundle output**
  ```bash
  ls -lh /opt/ozean-licht-ecosystem/storybook-static/
  du -sh /opt/ozean-licht-ecosystem/storybook-static/
  ```
  - Expected: Total size ~4.0MB
  - Expected: Contains `index.html`, `assets/`, `iframe.html`

- [ ] **Test local dev server**
  ```bash
  npm run storybook &
  sleep 5
  curl -f http://localhost:6006/ > /dev/null && echo "✅ Server OK" || echo "❌ Server Failed"
  kill %1
  ```
  - Expected: Dev server starts and responds to requests

---

### 2.2 Validate Coolify Configuration
**Objective:** Ensure Coolify deployment config is correct
**Status:** Not Started

- [ ] **Review Coolify JSON config**
  ```bash
  cat /opt/ozean-licht-ecosystem/storybook/deployment/coolify.json | jq .
  ```
  - Verify: buildCommand is correct
  - Verify: buildDirectory is "storybook/build" or correct path
  - Verify: port is 6006
  - Verify: domain is "storybook.ozean-licht.dev"
  - Verify: healthCheckPath is "/"

- [ ] **Validate Dockerfile**
  ```bash
  cat /opt/ozean-licht-ecosystem/Dockerfile.storybook | head -20
  ```
  - Expected: Valid multi-stage build
  - Expected: Uses Node 18-slim base image
  - Expected: Serves on port 6006

- [ ] **Check GitHub Actions workflow**
  ```bash
  grep -A 5 "build-storybook" /opt/ozean-licht-ecosystem/.github/workflows/deploy-storybook.yml
  ```
  - Expected: Workflow references Coolify deployment
  - Expected: No Chromatic job
  - Expected: No Argos job (or marked optional)

---

## Phase 3: Deployment Setup (Day 1-2 - 1 hour)

### 3.1 Prepare Infrastructure
**Objective:** Ensure DNS and Coolify are ready
**Status:** Not Started

- [ ] **Verify DNS is configured**
  ```bash
  dig storybook.ozean-licht.dev +short
  ```
  - Expected: Returns IP 138.201.139.25 (Hetzner server)
  - If not: Configure DNS in registrar pointing to Hetzner IP

- [ ] **Verify Coolify is running**
  ```bash
  curl -f http://coolify.ozean-licht.dev:8000/health 2>/dev/null || \
  curl -f http://138.201.139.25:8000/health 2>/dev/null
  ```
  - Expected: HTTP 200 response
  - If failed: Contact infrastructure team or check Coolify logs

- [ ] **Verify PostgreSQL databases exist**
  ```bash
  # This requires database access - skip if not available
  # Databases should already exist: shared_users_db, kids_ascension_db, ozean_licht_db
  echo "✅ Databases assumed to exist (verify in Coolify dashboard)"
  ```

---

### 3.2 Configure GitHub Secrets (Optional)
**Objective:** Set up deployment automation (can be done after first manual deploy)
**Status:** Not Started

- [ ] **Add Coolify webhook URL to GitHub secrets**
  - Go to: https://github.com/ozean-licht/ozean-licht-ecosystem/settings/secrets/actions
  - Name: `COOLIFY_WEBHOOK_URL`
  - Value: (Get from Coolify dashboard → Storybook app → Webhooks)
  - This enables automatic deployment on push to main

- [ ] **Verify GitHub Actions has permissions**
  - Repository → Settings → Actions → General
  - Ensure "Read and write permissions" is selected for workflows
  - Or add explicit token with appropriate scopes

---

## Phase 4: Deployment to Production (Day 2 - 30 minutes)

### 4.1 Deploy via Coolify UI (Recommended for First Deploy)
**Objective:** Get Storybook live at storybook.ozean-licht.dev
**Status:** Not Started

**Option A: Via Coolify Dashboard (Most Reliable)**

- [ ] **Log into Coolify**
  - URL: http://coolify.ozean-licht.dev:8000
  - Enter credentials (contact team if needed)

- [ ] **Create New Application**
  - Click: "New" → "Application"
  - Name: `ozean-licht-storybook`
  - Repository: ozean-licht/ozean-licht-ecosystem
  - Branch: main

- [ ] **Configure Build Settings**
  - Build Command: `npm install --frozen-lockfile && npm run build-storybook`
  - Install Command: `npm install --frozen-lockfile`
  - Build Directory: `storybook-static` (or `storybook/build`)
  - Start Command: `npx http-server storybook-static -p 6006 --gzip`

- [ ] **Configure Runtime**
  - Port: 6006
  - Domain: storybook.ozean-licht.dev
  - SSL/TLS: Enable (Let's Encrypt)
  - Environment: Node 18+

- [ ] **Configure Health Checks**
  - Health Check Path: `/`
  - Check Interval: 30 seconds
  - Timeout: 10 seconds
  - Retries: 3

- [ ] **Deploy Application**
  - Click: Deploy
  - Watch logs for build progress
  - Expected: Build completes in 2-3 minutes
  - Expected: Application shows "running"

- [ ] **Verify Deployment**
  - Wait 2 minutes for DNS propagation
  - Visit: https://storybook.ozean-licht.dev
  - Expected: Storybook loads with 66+ components
  - Expected: Stories are interactive
  - Expected: Navigation works

---

**Option B: Via Progressive Disclosure Tools (Requires Setup)**

```bash
# Set environment variables
export COOLIFY_API_TOKEN="your-api-token"

# Deploy application
bash tools/deployment/deploy.sh 3  # Application ID for storybook

# Check status
bash tools/deployment/status.sh 3

# View logs
bash tools/deployment/logs.sh 3 100
```

---

### 4.2 Post-Deployment Validation
**Objective:** Verify Storybook is working correctly in production
**Status:** Not Started

- [ ] **Health Check**
  ```bash
  curl -f https://storybook.ozean-licht.dev/ \
    && echo "✅ Health Check Passed" \
    || echo "❌ Health Check Failed"
  ```
  - Expected: HTTP 200
  - Expected: HTML content returned

- [ ] **Test Component Load**
  ```bash
  curl -f https://storybook.ozean-licht.dev/iframe.html \
    && echo "✅ Components Load" \
    || echo "❌ Components Failed"
  ```
  - Expected: HTML with Storybook iframe

- [ ] **Test Assets**
  ```bash
  curl -f https://storybook.ozean-licht.dev/assets/ \
    && echo "✅ Assets Load" \
    || echo "❌ Assets Failed"
  ```
  - Expected: JavaScript and CSS assets accessible

- [ ] **Verify SSL Certificate**
  ```bash
  curl -vI https://storybook.ozean-licht.dev/ 2>&1 | grep -i "SSL\|TLS"
  ```
  - Expected: Valid SSL certificate from Let's Encrypt
  - Expected: No certificate warnings

- [ ] **Manual Browser Test**
  - Visit: https://storybook.ozean-licht.dev
  - Load 3+ stories and verify they render
  - Test story controls (change props)
  - Check dark mode toggle (if available)
  - Verify navigation between stories

- [ ] **Performance Check**
  ```bash
  time curl -o /dev/null -s https://storybook.ozean-licht.dev/
  ```
  - Expected: < 2 seconds response time
  - Expected: No timeout errors

---

## Phase 5: Cleanup (Day 2 - 30 minutes)

### 5.1 Update Documentation
**Objective:** Reflect MVP status in project docs
**Status:** Not Started

- [ ] **Update main README.md**
  - File: `/opt/ozean-licht-ecosystem/storybook/README.md`
  - Remove: "Phases 1-4 in progress" language
  - Update to: "✅ MVP Ready - Deployed to Production"
  - Update status from "Phase 1 (60% Complete)" → "🟢 MVP Complete - Production Ready"
  - Update "Next Phase" to focus on future enhancements (not intelligence layer)

- [ ] **Add MVP Deployment Note**
  - Add section to README:
    ```markdown
    ## MVP Status

    Storybook is now deployed to production at https://storybook.ozean-licht.dev

    - 66+ components documented
    - Full story coverage
    - Production performance: 13.4s build, 4.0MB bundle
    - Accessible via: https://storybook.ozean-licht.dev

    ### Future Enhancements
    See [FUTURE_ENHANCEMENTS.md](./specs/FUTURE_ENHANCEMENTS.md) for planned features
    (neural search, analytics, AI assistant) - not part of MVP.
    ```

- [ ] **Update deployment documentation**
  - Ensure RUNBOOK.md is accurate
  - Add verification steps
  - Add troubleshooting for common issues

---

### 5.2 Commit and Push
**Objective:** Save changes to version control
**Status:** Not Started

- [ ] **Stage all cleanup changes**
  ```bash
  cd /opt/ozean-licht-ecosystem
  git add -A
  ```

- [ ] **Review changes**
  ```bash
  git status
  git diff --cached --stat
  ```
  - Expected: Removed Argos/Chromatic references
  - Expected: Updated README
  - Expected: Renamed intelligent roadmap

- [ ] **Commit changes**
  ```bash
  git commit -m "chore(storybook): MVP cleanup - remove Argos/Chromatic, simplify docs

  - Remove @argos-ci/cli and Chromatic dependencies
  - Remove visual regression testing from MVP scope
  - Simplify documentation - move 16-week roadmap to future enhancements
  - Update README to reflect MVP status
  - Ready for production deployment"
  ```

- [ ] **Push to main**
  ```bash
  git push origin main
  ```
  - This triggers GitHub Actions deployment workflow
  - Monitor workflow at: https://github.com/ozean-licht/ozean-licht-ecosystem/actions

---

## Phase 6: Validation (Day 2 - 15 minutes)

### 6.1 Final Smoke Test
**Objective:** Verify everything works end-to-end
**Status:** Not Started

- [ ] **Visit production URL**
  - Navigate to: https://storybook.ozean-licht.dev
  - Verify: Storybook loads quickly
  - Verify: 66+ components visible in sidebar
  - Verify: Can click through multiple stories

- [ ] **Test Core Features**
  - [ ] Story content renders
  - [ ] Story controls work
  - [ ] Accessibility tab loads
  - [ ] Canvas view responsive
  - [ ] Zoom controls work
  - [ ] Story source visible

- [ ] **Check Performance**
  - Open Chrome DevTools → Performance
  - Record page load
  - Expected: Page fully interactive in < 3 seconds
  - Expected: No significant layout shifts

- [ ] **Verify No Errors**
  - Open Chrome DevTools → Console
  - Expected: No red error messages
  - Expected: No warnings about missing components

- [ ] **Test Accessibility**
  - Click A11y tab in Storybook
  - Run check on 3 stories
  - Expected: Stories pass accessibility checks or show actionable warnings

---

### 6.2 Team Notification
**Objective:** Announce MVP deployment
**Status:** Not Started

- [ ] **Create deployment announcement**
  - Post to team Slack/Discord:
    ```
    🚀 Storybook MVP Deployed!

    Production URL: https://storybook.ozean-licht.dev

    Includes:
    - 66+ documented components
    - Interactive stories with controls
    - Accessibility testing (a11y addon)
    - Full Ozean Licht branding

    Getting Started:
    - Visit the URL to browse components
    - Use search to find components by name
    - Review stories to understand variants

    Documentation:
    - STORYBOOK_CONTRIBUTING.md - How to add new stories
    - STORYBOOK_RUNBOOK.md - Operations guide
    - .storybook/REVIEW_CHECKLIST.md - Review criteria

    Questions? See docs or contact @frontend-team
    ```

- [ ] **Share links**
  - Documentation: https://github.com/ozean-licht/ozean-licht-ecosystem/blob/main/STORYBOOK_CONTRIBUTING.md
  - Runbook: https://github.com/ozean-licht/ozean-licht-ecosystem/blob/main/STORYBOOK_RUNBOOK.md

---

## What's NOT Included in MVP

The following features are intentionally **excluded** from MVP and documented in `FUTURE_ENHANCEMENTS.md`:

| Feature | Why Not MVP | Timeline |
|---------|------------|----------|
| Neural Search | Complex, not blocking MVP | Phase 2+ |
| Component Analytics | Nice-to-have, not critical | Phase 3+ |
| AI Assistant | Advanced feature, requires more setup | Phase 4+ |
| Visual Regression (Argos) | Paid alternative exists if needed | Phase 5+ |
| Visual Performance Monitoring | Useful but not essential | Phase 6+ |
| Component Marketplace | Advanced ecosystem feature | Phase 9+ |

**Why this approach:**
- MVP is fully functional without these features
- Simpler deployment (fewer dependencies)
- Faster time to production
- Can add features later without rework
- Reduces maintenance burden

---

## Success Criteria

**MVP is successful when:**

- [x] Build time < 20s (actual: 13.4s)
- [x] Bundle size < 5MB (actual: 4.0MB)
- [x] 66+ components documented
- [ ] Deployed to production URL
- [ ] HTTPS working (valid SSL certificate)
- [ ] Health checks passing
- [ ] No Argos/Chromatic references in codebase
- [ ] Documentation updated
- [ ] Team can access and browse stories
- [ ] Stories are interactive and functional

**Target:** All checkboxes completed in 1-2 days of work.

---

## Troubleshooting

### Build fails during deployment
**Solution:**
```bash
# Test locally first
npm ci
npm run build-storybook

# Check for errors
npm audit

# Clear caches
rm -rf node_modules storybook-static
npm ci
npm run build-storybook
```

### Domain not resolving
**Solution:**
- Verify DNS: `dig storybook.ozean-licht.dev`
- Check A record points to 138.201.139.25
- Wait up to 24 hours for DNS propagation
- Test with IP directly: http://138.201.139.25:6006

### SSL certificate error
**Solution:**
- Let's Encrypt takes time (5-10 minutes)
- Try HTTPS again after waiting
- If still fails, regenerate in Coolify dashboard
- Check Let's Encrypt rate limits (50/week per domain)

### Health check failing
**Solution:**
```bash
# Check if container is running
docker ps | grep storybook

# Check logs
docker logs <container-id>

# Test manually
curl -f http://localhost:6006/ || echo "Failed"

# Check port
lsof -i :6006
```

### Stories not loading
**Solution:**
- Clear browser cache (Cmd+Shift+R on Mac)
- Check DevTools console for errors
- Verify all assets load: Open Network tab
- Try incognito mode
- Check that build completed successfully

---

## Rollback Plan

If deployment fails:

1. **Keep current production running** while debugging
2. **Revert changes**: `git revert <commit-hash>`
3. **Push revert**: `git push origin main`
4. **Rebuild**: Wait for GitHub Actions to deploy reverted version
5. **Verify**: Test production URL again

---

## Timeline Summary

| Task | Duration | Day |
|------|----------|-----|
| Remove Argos/Chromatic | 1 hour | Day 1 |
| Verify build works | 1 hour | Day 1 |
| Setup deployment | 1 hour | Day 1 |
| Deploy to production | 30 min | Day 2 |
| Validate & cleanup | 1 hour | Day 2 |
| **Total** | **4.5 hours** | **1-2 days** |

---

## Key Files

- **Storybook Config**: `/opt/ozean-licht-ecosystem/.storybook/main.ts`
- **Package.json**: `/opt/ozean-licht-ecosystem/package.json`
- **Coolify Config**: `/opt/ozean-licht-ecosystem/storybook/deployment/coolify.json`
- **GitHub Actions**: `/opt/ozean-licht-ecosystem/.github/workflows/deploy-storybook.yml`
- **Dockerfile**: `/opt/ozean-licht-ecosystem/Dockerfile.storybook`
- **README**: `/opt/ozean-licht-ecosystem/storybook/README.md`

---

## Questions?

Refer to:
- **STORYBOOK_RUNBOOK.md** - Day-to-day operations
- **STORYBOOK_CONTRIBUTING.md** - Adding new stories
- **FUTURE_ENHANCEMENTS.md** - Features for future phases
- **Coolify Dashboard** - Real-time deployment status

---

**Document Status:** Ready to Execute
**Last Updated:** 2025-11-12
**Owner:** Frontend Team / Platform Team
**Version:** 1.0 (MVP)

**Estimated Completion:** 1-2 days from start of Phase 1
**Target Production Launch:** Immediately upon completion of Phase 4

