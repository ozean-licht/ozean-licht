# Storybook Operations Runbook

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Status:** Official Operations Guide

---

## Overview

This runbook provides operational procedures for running, building, deploying, and troubleshooting the Ozean Licht Storybook instance.

**Production URL:** https://storybook.ozean-licht.dev
**Repository:** https://github.com/ozean-licht/ozean-licht-ecosystem
**Deployment:** Coolify (automated via GitHub Actions)

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Local Development](#local-development)
3. [Building for Production](#building-for-production)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)
6. [Monitoring](#monitoring)
7. [Maintenance](#maintenance)
8. [Emergency Procedures](#emergency-procedures)

---

## Quick Reference

### Common Commands

```bash
# Development
npm run storybook              # Start dev server at http://localhost:6006

# Building
npm run build-storybook        # Build static site to storybook-static/

# Testing
npm run test-storybook         # Run interaction tests
npm test                       # Run Vitest unit tests

# Deployment (automatic on push to main)
git push origin main           # Triggers deployment via GitHub Actions

# Manual deployment verification
curl -f https://storybook.ozean-licht.dev/
```

### Key Files

| File | Purpose |
|------|---------|
| `.storybook/main.ts` | Storybook configuration |
| `.storybook/preview.ts` | Global preview settings |
| `.storybook/PERFORMANCE_BASELINE.md` | Performance metrics |
| `.coolify/storybook.json` | Coolify deployment config |
| `Dockerfile.storybook` | Production Docker image |
| `.github/workflows/deploy-storybook.yml` | CI/CD pipeline |

### Key Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Build Time | < 20s | 13.4s | ✅ |
| Bundle Size | < 5MB | 4.0MB | ✅ |
| Dev Startup | < 5s | 4.04s | ✅ |
| Uptime | > 99.5% | - | Monitor |

---

## Local Development

### Prerequisites

- **Node.js:** 18.x LTS
- **Package Manager:** npm 9.x
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB free

### Setup

**1. Clone Repository:**
```bash
git clone https://github.com/ozean-licht/ozean-licht-ecosystem.git
cd ozean-licht-ecosystem
```

**2. Install Dependencies:**
```bash
npm install
```

**3. Start Storybook:**
```bash
npm run storybook
```

**Expected Output:**
```
╭─────────────────────────────────────────────────╮
│                                                 │
│   Storybook 8.6.14 for react-vite started      │
│   4.04 s for preview                            │
│                                                 │
│    Local:            http://localhost:6006/     │
│    On your network:  http://192.168.x.x:6006/   │
│                                                 │
╰─────────────────────────────────────────────────╯
```

**4. Open Browser:**
```bash
# macOS
open http://localhost:6006

# Linux
xdg-open http://localhost:6006

# Windows
start http://localhost:6006
```

### Development Workflow

**Typical workflow:**

1. **Start Storybook** (`npm run storybook`)
2. **Make changes** to components or stories
3. **Hot reload** updates automatically
4. **Verify changes** in browser
5. **Test accessibility** in A11y tab
6. **Commit changes** when satisfied

**File watching:**
- Storybook watches all `.stories.tsx` files
- Changes trigger automatic reload
- Build errors appear in terminal and browser

### Tips for Fast Development

1. **Keep Storybook running** - HMR is fast (< 100ms)
2. **Use TypeScript** - Catch errors before runtime
3. **Test one component at a time** - Focus on specific story
4. **Use Controls addon** - Test props interactively
5. **Check A11y tab early** - Fix issues as you go

---

## Building for Production

### Build Command

```bash
npm run build-storybook
```

**What it does:**
1. Cleans `storybook-static/` directory
2. Builds manager (Storybook UI) in ~100ms
3. Builds preview (component stories) in ~12s
4. Outputs static site to `storybook-static/`

**Expected Output:**
```
@storybook/core v8.6.14

info => Cleaning outputDir: storybook-static
info => Loading presets
info => Building manager..
info => Manager built (97 ms)
info => Building preview..
✓ 3561 modules transformed.
✓ built in 8.34s
info => Preview built (12 s)
info => Output directory: /opt/ozean-licht-ecosystem/storybook-static
```

### Build Artifacts

**Directory structure:**
```
storybook-static/
├── index.html           # Main entry point
├── iframe.html          # Preview frame
├── assets/              # Bundled JS/CSS (3.4MB)
│   ├── *.js             # Component bundles
│   └── *.css            # Styles
├── fonts/               # Web fonts
└── project.json         # Story index
```

**Size:** ~4.0 MB (uncompressed), ~1.2 MB (gzipped)

### Testing Build Locally

**Serve the build:**
```bash
npx http-server storybook-static -p 6006
```

**Test in browser:**
```bash
open http://localhost:6006
```

**Verify:**
- [ ] Homepage loads
- [ ] Stories render correctly
- [ ] Navigation works
- [ ] Controls work
- [ ] A11y addon works
- [ ] No console errors

### Build Optimization

**Current optimizations:**
- ES2020 target (modern browsers)
- Manual chunk splitting (vendors separated)
- Tree shaking enabled
- Minification with ESBuild

**See:** `.storybook/PERFORMANCE_BASELINE.md` for details

---

## Deployment

### Automatic Deployment (Recommended)

**Trigger:** Push to `main` branch

**Workflow:**
1. Push changes to `main`
2. GitHub Actions builds Storybook
3. Tests run (build, health check)
4. Deploys to Coolify
5. Verifies production deployment
6. Notifies team (if configured)

**Command:**
```bash
git push origin main
```

**Monitor:**
- GitHub Actions: https://github.com/ozean-licht/ozean-licht-ecosystem/actions
- Coolify Dashboard: http://coolify.ozean-licht.dev:8000

### Manual Deployment

**If automatic deployment fails:**

**Option 1: Trigger GitHub Actions manually**
```bash
# Via GitHub CLI
gh workflow run deploy-storybook.yml

# Or via GitHub UI:
# Actions → Deploy Storybook → Run workflow
```

**Option 2: Deploy via Coolify Dashboard**
1. Login to Coolify: http://coolify.ozean-licht.dev:8000
2. Navigate to "Storybook" application
3. Click "Deploy" button
4. Wait for deployment to complete (~2-3 minutes)

**Option 3: Deploy via Coolify API**
```bash
curl -X POST $COOLIFY_WEBHOOK_URL \
  -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"branch": "main", "application": "storybook"}'
```

### Deployment Verification

**Health Check:**
```bash
# Check if site is up
curl -f https://storybook.ozean-licht.dev/

# Check response time
curl -w "\nTotal time: %{time_total}s\n" \
  -o /dev/null -s https://storybook.ozean-licht.dev/
```

**Expected:**
- HTTP 200 status
- Response time < 2s
- No errors in HTML

**Full Verification:**
```bash
# Test main page
curl -f https://storybook.ozean-licht.dev/ > /dev/null
echo "✅ Main page OK"

# Test iframe
curl -f https://storybook.ozean-licht.dev/iframe.html > /dev/null
echo "✅ Iframe OK"

# Test static assets
curl -f https://storybook.ozean-licht.dev/assets/ > /dev/null
echo "✅ Assets OK"
```

### Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] Build completes without errors
- [ ] No accessibility violations (critical/serious)
- [ ] PR approved by reviewer
- [ ] Changes documented in commit message
- [ ] No sensitive data in stories
- [ ] Performance metrics within targets

After deployment:

- [ ] Production site loads
- [ ] Stories render correctly
- [ ] No console errors
- [ ] Health check passes
- [ ] Response time < 2s
- [ ] Team notified (if major changes)

---

## Troubleshooting

### Dev Server Won't Start

**Symptoms:**
- `npm run storybook` hangs
- Port 6006 already in use
- Build errors in terminal

**Solutions:**

**1. Port in use:**
```bash
# Kill existing process
lsof -ti:6006 | xargs kill -9

# Or use different port
npm run storybook -- -p 6007
```

**2. Corrupt cache:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear Storybook cache
rm -rf node_modules/.cache/storybook

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**3. TypeScript errors:**
```bash
# Check for errors
npm run type-check

# Build without type checking (temporary)
npm run storybook -- --no-type-check
```

**4. Missing dependencies:**
```bash
# Reinstall
npm ci
```

### Build Fails

**Symptoms:**
- `npm run build-storybook` fails
- TypeScript errors
- Module not found errors

**Solutions:**

**1. Check error message:**
```bash
# Run with verbose logging
npm run build-storybook -- --loglevel verbose
```

**2. Common errors:**

**"Cannot find module '@/...'"**
```bash
# Fix: Use relative imports in shared UI
# Bad: import { Button } from '@/components/button'
# Good: import { Button } from './button'
```

**"Duplicate story export"**
```bash
# Fix: Ensure unique story names
# Bad: export const Default, export const Default
# Good: export const Default, export const Primary
```

**"Build timeout"**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build-storybook
```

**3. Clean rebuild:**
```bash
rm -rf storybook-static node_modules/.vite
npm run build-storybook
```

### Deployment Fails

**Symptoms:**
- GitHub Actions fails
- Coolify deployment fails
- Production site not updating

**Solutions:**

**1. Check GitHub Actions logs:**
```bash
# Via CLI
gh run list --workflow=deploy-storybook.yml
gh run view <run-id> --log

# Or via UI
# https://github.com/ozean-licht/ozean-licht-ecosystem/actions
```

**2. Check Coolify logs:**
```bash
# SSH to server
ssh root@138.201.139.25

# View container logs
docker logs <storybook-container-id>

# View deployment logs in Coolify UI
# http://coolify.ozean-licht.dev:8000
```

**3. Common deployment issues:**

**Build fails in CI:**
- Check Node.js version (should be 18.x)
- Check disk space on runner
- Check for missing environment variables

**Deployment succeeds but site not updating:**
- Check if correct branch deployed
- Clear CDN cache (if applicable)
- Hard refresh browser (Cmd+Shift+R)

**Health check fails:**
- Check if container is running
- Check logs for errors
- Verify port 6006 is exposed
- Test health check endpoint manually

### Performance Issues

**Symptoms:**
- Build takes > 20s
- Dev server slow to start
- Stories load slowly

**Solutions:**

**1. Check bundle size:**
```bash
npm run build-storybook
du -sh storybook-static/
```

**2. Analyze bundle:**
```bash
# Build with stats
npm run build-storybook -- --stats-json

# Analyze (requires rollup-plugin-visualizer)
npx vite-bundle-visualizer storybook-static/stats.json
```

**3. Optimize:**
- Review `.storybook/main.ts` configuration
- Check for large dependencies
- Use code splitting
- See `.storybook/PERFORMANCE_BASELINE.md`

### Accessibility Violations

**Symptoms:**
- A11y addon shows errors
- Critical/serious violations

**Solutions:**

**1. Check violation details:**
- Open A11y tab in Storybook
- Read violation description
- Click "Learn more" for guidance

**2. Common fixes:**

**Color contrast:**
```tsx
// Bad: Light text on light background
<div className="text-gray-400 bg-gray-100">Text</div>

// Good: Sufficient contrast
<div className="text-gray-900 bg-gray-100">Text</div>
```

**Missing ARIA labels:**
```tsx
// Bad: Icon button without label
<button><X /></button>

// Good: Label provided
<button aria-label="Close"><X /></button>
```

**Non-semantic HTML:**
```tsx
// Bad: Div as button
<div onClick={...}>Click</div>

// Good: Semantic button
<button onClick={...}>Click</button>
```

**3. Test with screen reader:**
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA
- Chrome: ChromeVox extension

---

## Monitoring

### Health Checks

**Automated (every 30s):**
```bash
# Health check endpoint
curl -f https://storybook.ozean-licht.dev/

# Expected: HTTP 200
```

**Manual checks:**
```bash
# Response time
time curl -f https://storybook.ozean-licht.dev/

# SSL certificate
curl -vI https://storybook.ozean-licht.dev/ 2>&1 | grep -i 'ssl'

# DNS resolution
dig storybook.ozean-licht.dev
```

### Metrics to Track

**Performance:**
- Build time (target: < 20s)
- Bundle size (target: < 5MB)
- Page load time (target: < 2s)
- Time to interactive (target: < 3s)

**Reliability:**
- Uptime (target: > 99.5%)
- Failed deployments (target: < 5%)
- Health check failures (target: < 1%)

**Usage:**
- Page views per day
- Most viewed components
- Search queries

**See:** Grafana dashboard at https://grafana.ozean-licht.dev

### Alerts

**Configure alerts for:**

1. **Deployment failures** → Notify team
2. **Health check failures** → Page on-call
3. **Build time > 30s** → Investigate performance
4. **Bundle size > 6MB** → Review dependencies
5. **SSL cert expiring** → Renew certificate

### Logs

**View logs:**

**Coolify:**
```bash
# Via Coolify UI
http://coolify.ozean-licht.dev:8000

# Via Docker CLI (SSH to server)
docker logs storybook-container
```

**GitHub Actions:**
```bash
# Via GitHub CLI
gh run list --workflow=deploy-storybook.yml
gh run view <run-id> --log

# Via GitHub UI
https://github.com/ozean-licht/ozean-licht-ecosystem/actions
```

**Nginx (if applicable):**
```bash
ssh root@138.201.139.25
tail -f /var/log/nginx/storybook-access.log
tail -f /var/log/nginx/storybook-error.log
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor deployment status
- Check for failed builds
- Review health check logs

**Weekly:**
- Review performance metrics
- Check for security updates
- Monitor bundle size trends

**Monthly:**
- Update Storybook dependencies
- Review and clean up old stories
- Audit accessibility compliance
- Review and update documentation

**Quarterly:**
- Major version upgrades
- Performance optimization review
- Backup story files
- Team training refresher

### Dependency Updates

**Check for updates:**
```bash
npm outdated
```

**Update Storybook:**
```bash
# Update all Storybook packages
npx storybook@latest upgrade

# Or manually
npm install -D @storybook/react-vite@latest \
  @storybook/addon-essentials@latest \
  @storybook/addon-interactions@latest \
  @storybook/addon-a11y@latest
```

**Test after update:**
```bash
npm run storybook       # Test dev server
npm run build-storybook # Test build
npm run test-storybook  # Test interactions
```

**See:** `.storybook/MAINTENANCE.md` for full maintenance schedule

### Backup Procedures

**What to backup:**
- Story files (`**/*.stories.tsx`)
- Storybook configuration (`.storybook/`)
- Documentation files (`*.md`)

**Backup command:**
```bash
# Create backup archive
tar -czf storybook-backup-$(date +%Y%m%d).tar.gz \
  .storybook/ \
  shared/ui-components/src/**/*.stories.tsx \
  apps/*/components/**/*.stories.tsx \
  *.md

# Store in secure location
```

**Backup schedule:**
- Before major updates
- Monthly (automatic)
- Before breaking changes

### Rollback Procedures

**If deployment fails:**

**1. Rollback via Coolify:**
- Login to Coolify dashboard
- Select Storybook application
- Click "Rollback" to previous version

**2. Rollback via Git:**
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main  # Use with caution
```

**3. Emergency rollback:**
```bash
# Deploy specific stable version
git checkout <stable-tag>
# Trigger manual deployment
```

---

## Emergency Procedures

### Site is Down

**1. Verify the issue:**
```bash
curl -f https://storybook.ozean-licht.dev/
# If fails, site is down
```

**2. Check Coolify:**
- Login: http://coolify.ozean-licht.dev:8000
- Check container status
- Review logs

**3. Quick fixes:**

**Restart container:**
```bash
# Via Coolify UI: Click "Restart"

# Via SSH:
ssh root@138.201.139.25
docker restart storybook-container
```

**Redeploy:**
```bash
# Via GitHub Actions
gh workflow run deploy-storybook.yml

# Via Coolify UI: Click "Deploy"
```

**4. If still down:**
- Check server status (138.201.139.25)
- Check DNS (dig storybook.ozean-licht.dev)
- Check SSL certificate
- Contact infrastructure team

### Corrupted Build

**Symptoms:**
- Stories not rendering
- JavaScript errors in console
- Assets not loading

**Solutions:**

**1. Clear cache:**
```bash
# Via Coolify: Click "Clear Cache"

# Via SSH:
ssh root@138.201.139.25
docker exec storybook-container rm -rf /app/.cache
docker restart storybook-container
```

**2. Rebuild from scratch:**
```bash
git push origin main --force-with-lease
# Triggers clean deployment
```

**3. Rollback to last known good:**
```bash
# Via Coolify: Click "Rollback"
```

### Critical Security Vulnerability

**If security vulnerability discovered:**

**1. Assess severity:**
- Check CVE database
- Review affected versions
- Determine exploit risk

**2. Take action:**

**Low severity:**
- Schedule update in next maintenance window
- Document in issue tracker

**Medium severity:**
- Update within 7 days
- Test thoroughly
- Deploy during maintenance window

**High/Critical severity:**
- Update immediately
- Deploy emergency hotfix
- Notify team
- Monitor for exploits

**3. Update dependencies:**
```bash
# Update specific package
npm install <package>@<safe-version>

# Or update all
npm audit fix

# Test
npm run storybook
npm run build-storybook

# Deploy
git commit -am "security: fix vulnerability in <package>"
git push origin main
```

### Contact Information

**On-call rotation:**
- See: Internal on-call schedule

**Escalation:**
1. Frontend Team Lead
2. Platform Team Lead
3. CTO

**External support:**
- Storybook: https://storybook.js.org/support
- Coolify: https://coolify.io/docs
- Hetzner: https://www.hetzner.com/support

---

## Additional Resources

- **Storybook Documentation:** https://storybook.js.org/docs
- **Contributing Guide:** `STORYBOOK_CONTRIBUTING.md`
- **Performance Baseline:** `.storybook/PERFORMANCE_BASELINE.md`
- **Component Catalog:** `.storybook/COMPONENT_CATALOG.md`
- **Pattern Library:** `.storybook/PATTERN_LIBRARY.md`
- **Maintenance Schedule:** `.storybook/MAINTENANCE.md`
- **Branding Guidelines:** `BRANDING.md`

---

**Document Maintained By:** Platform Team
**Last Updated:** 2025-11-12
**Next Review:** Monthly
**Emergency Contact:** See internal runbook

---

**Remember:** When in doubt, check logs first. Most issues can be diagnosed from log output.
