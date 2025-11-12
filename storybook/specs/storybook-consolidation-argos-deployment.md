# Plan: Storybook Consolidation, Argos Integration & Coolify Deployment

## Task Description

Reorganize the Storybook implementation to consolidate scattered root-level files into a single `storybook/` directory, replace Chromatic with self-hosted Argos for visual regression testing, and implement Coolify deployment using progressive disclosure scripts with support for both manual and automated deployment workflows.

## Objective

Create a cleaner, more maintainable Storybook setup by:
1. Consolidating all storybook-related files into a single directory structure
2. Migrating from Chromatic (SaaS) to Argos (self-hosted) for visual regression testing
3. Implementing production-ready Coolify deployment with progressive disclosure tooling

## Problem Statement

**Current Issues:**
- **File Sprawl**: 10+ storybook files scattered at repository root level reduce discoverability and maintainability
- **Vendor Lock-in**: Chromatic requires external SaaS subscription and manual token management
- **Deployment Gap**: GitHub Actions workflow contains TODOs and doesn't actually deploy to Coolify
- **Inconsistent Tooling**: Deployment process doesn't follow the established progressive disclosure pattern used throughout the ecosystem

**Business Impact:**
- Developer confusion navigating storybook-related files
- Monthly costs and external dependency on Chromatic
- Manual deployment burden without automated CI/CD
- Inconsistent developer experience across the monorepo

## Solution Approach

**Phase 1: File Consolidation**
- Create unified `storybook/` directory at root level
- Move all storybook-related files into logical subdirectories
- Update all path references and imports
- Preserve git history with `git mv`

**Phase 2: Argos Migration**
- Deploy self-hosted Argos instance on Coolify
- Configure Argos CLI and SDK
- Create GitHub Actions workflow for Argos
- Remove Chromatic dependencies
- Document Argos setup and usage

**Phase 3: Coolify Deployment**
- Create progressive disclosure deployment script (`storybook/scripts/deploy.sh`)
- Implement Coolify API integration
- Support manual deployment first, automated later
- Add explain mode, validation, and error recovery
- Integrate with existing tools navigation

## Relevant Files

### Files to Move/Reorganize

**Root Level → `storybook/docs/`**
- `STORYBOOK_CONTRIBUTING.md` → `storybook/docs/CONTRIBUTING.md`
- `STORYBOOK_RUNBOOK.md` → `storybook/docs/RUNBOOK.md`
- `STORYBOOK_PHASE1_COMPLETE.md` → `storybook/docs/reports/phase-1-complete.md`
- `STORYBOOK_PHASE1_COMPLETION.md` → `storybook/docs/reports/phase-1-completion.md`
- `STORYBOOK_PHASE2_IMPLEMENTATION_SUMMARY.md` → `storybook/docs/reports/phase-2-summary.md`
- `STORYBOOK_PHASE3_COMPLETE.md` → `storybook/docs/reports/phase-3-complete.md`
- `STORYBOOK_PHASE4_COMPLETE.md` → `storybook/docs/reports/phase-4-complete.md`

**Root Level → `storybook/docker/`**
- `Dockerfile.storybook` → `storybook/docker/Dockerfile`
- `.dockerignore.storybook` → `storybook/docker/.dockerignore`

**`.storybook/` → `storybook/config/`**
- `.storybook/main.ts` → `storybook/config/main.ts`
- `.storybook/preview.ts` → `storybook/config/preview.ts`
- `.storybook/*.mdx` → `storybook/config/docs/*.mdx`
- `.storybook/templates/` → `storybook/templates/`
- `.storybook/*.md` → `storybook/docs/`

**`.coolify/storybook.json` → `storybook/deployment/`**
- `.coolify/storybook.json` → `storybook/deployment/coolify.json`

### Files to Modify

**Update Path References:**
- `package.json` - Update storybook script paths
- `.gitignore` - Update storybook build output paths
- `specs/storybook-unified-implementation-spec.md` - Document new structure
- Any documentation referencing old paths

### Files to Remove

**Chromatic-Related:**
- `.github/workflows/chromatic.yml` - Replace with Argos workflow
- Remove `chromatic` and `@chromatic-com/storybook` from package.json

### New Files

**Deployment Infrastructure:**
- `storybook/scripts/deploy.sh` - Progressive disclosure deployment script
- `storybook/scripts/list.sh` - List available storybook commands
- `storybook/scripts/utils.sh` - Shared utilities
- `storybook/deployment/README.md` - Deployment documentation
- `storybook/deployment/argos-config.yml` - Argos configuration

**Argos Integration:**
- `.github/workflows/argos.yml` - GitHub Actions workflow for Argos
- `storybook/config/argos.config.js` - Argos configuration
- `storybook/argos/docker-compose.yml` - Self-hosted Argos instance config
- `storybook/argos/README.md` - Argos setup guide

**Documentation:**
- `storybook/README.md` - Main storybook documentation hub
- `storybook/docs/DEPLOYMENT.md` - Deployment procedures
- `storybook/docs/ARGOS_SETUP.md` - Argos setup and usage

## Implementation Phases

### Phase 1: Foundation & File Consolidation (2-3 hours)

**Objectives:**
- Create new directory structure
- Move all files preserving git history
- Update all path references
- Verify nothing breaks

**Deliverables:**
- Clean root directory with single `storybook/` folder
- All paths updated and working
- Git history preserved

### Phase 2: Argos Integration (3-4 hours)

**Objectives:**
- Deploy Argos instance to Coolify
- Configure Argos for the project
- Replace Chromatic workflow with Argos
- Test visual regression functionality

**Deliverables:**
- Running Argos instance at argos.ozean-licht.dev
- Working GitHub Actions workflow
- Chromatic fully removed
- Documentation for team

### Phase 3: Coolify Deployment & Automation (2-3 hours)

**Objectives:**
- Create progressive disclosure deployment script
- Implement Coolify API integration
- Support both manual and automated deployment
- Integrate with ecosystem tooling

**Deliverables:**
- Working deployment script with explain mode
- Manual deployment tested and documented
- Automated deployment ready (optional activation)
- Complete developer documentation

## Step by Step Tasks

### 1. Create New Directory Structure

```bash
# Create consolidated storybook directory structure
mkdir -p storybook/{config,docs,scripts,deployment,templates,docker}
mkdir -p storybook/config/docs
mkdir -p storybook/docs/reports
```

### 2. Move Configuration Files

```bash
# Preserve git history with git mv
git mv .storybook/main.ts storybook/config/main.ts
git mv .storybook/preview.ts storybook/config/preview.ts
git mv .storybook/templates storybook/templates
git mv .storybook/*.mdx storybook/config/docs/
git mv .storybook/*.md storybook/docs/
```

**Update imports in config files:**
- Update relative paths in `storybook/config/main.ts`
- Update preview imports in `storybook/config/preview.ts`
- Update documentation cross-references

### 3. Move Docker Files

```bash
git mv Dockerfile.storybook storybook/docker/Dockerfile
git mv .dockerignore.storybook storybook/docker/.dockerignore
```

**Update Docker configuration:**
- Adjust COPY paths in Dockerfile for new structure
- Update build context references

### 4. Move Documentation Files

```bash
# Move main documentation
git mv STORYBOOK_CONTRIBUTING.md storybook/docs/CONTRIBUTING.md
git mv STORYBOOK_RUNBOOK.md storybook/docs/RUNBOOK.md

# Move phase reports
git mv STORYBOOK_PHASE1_COMPLETE.md storybook/docs/reports/phase-1-complete.md
git mv STORYBOOK_PHASE1_COMPLETION.md storybook/docs/reports/phase-1-completion.md
git mv STORYBOOK_PHASE2_IMPLEMENTATION_SUMMARY.md storybook/docs/reports/phase-2-summary.md
git mv STORYBOOK_PHASE3_COMPLETE.md storybook/docs/reports/phase-3-complete.md
git mv STORYBOOK_PHASE4_COMPLETE.md storybook/docs/reports/phase-4-complete.md
```

### 5. Move Deployment Configuration

```bash
git mv .coolify/storybook.json storybook/deployment/coolify.json
```

**Update Coolify configuration:**
- Adjust build paths to reference new structure
- Update health check paths if needed

### 6. Update Package.json Scripts

Edit `package.json` to update storybook configuration path:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006 --config-dir storybook/config",
    "build-storybook": "storybook build --config-dir storybook/config -o storybook-static",
    "test-storybook": "test-storybook --config-dir storybook/config"
  }
}
```

### 7. Create Main Storybook README

Create `storybook/README.md`:

```markdown
# Ozean Licht Storybook

Unified component documentation and testing platform for the Ozean Licht ecosystem.

## Quick Links

- **Documentation**: [docs/](./docs/)
- **Configuration**: [config/](./config/)
- **Deployment**: [deployment/](./deployment/)
- **Scripts**: [scripts/](./scripts/)

## Getting Started

\`\`\`bash
# Start development server
npm run storybook

# Build for production
npm run build-storybook

# Deploy to Coolify
bash storybook/scripts/deploy.sh
\`\`\`

## Directory Structure

\`\`\`
storybook/
├── config/           # Storybook configuration
├── docs/             # Documentation and guides
├── scripts/          # Deployment and utility scripts
├── deployment/       # Deployment configurations
├── templates/        # Story templates
└── docker/           # Docker configuration
\`\`\`

See [docs/RUNBOOK.md](./docs/RUNBOOK.md) for complete documentation.
```

### 8. Remove Chromatic Dependencies

```bash
# Remove from package.json
npm uninstall chromatic @chromatic-com/storybook

# Remove workflow file
git rm .github/workflows/chromatic.yml
```

### 9. Set Up Self-Hosted Argos

**Create Argos deployment configuration:**

Create `storybook/argos/docker-compose.yml`:

```yaml
version: '3.8'

services:
  argos-postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: argos
      POSTGRES_USER: argos
      POSTGRES_PASSWORD: ${ARGOS_DB_PASSWORD}
    volumes:
      - argos-db:/var/lib/postgresql/data
    networks:
      - argos-net
    restart: unless-stopped

  argos-server:
    image: argos-ci/argos:latest
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://argos:${ARGOS_DB_PASSWORD}@argos-postgres:5432/argos
      APP_BASE_URL: https://argos.ozean-licht.dev
      JWT_SECRET: ${ARGOS_JWT_SECRET}
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    depends_on:
      - argos-postgres
    networks:
      - argos-net
    restart: unless-stopped

volumes:
  argos-db:

networks:
  argos-net:
    driver: bridge
```

**Create Argos configuration:**

Create `storybook/deployment/argos-config.yml`:

```yaml
# Argos CI Configuration
project: ozean-licht-storybook
baseUrl: https://argos.ozean-licht.dev

upload:
  # Upload directory for screenshots
  directory: storybook-static
  # Parallel upload for faster processing
  parallel: true
  parallelTotal: 4

build:
  # Build command to generate screenshots
  command: npm run build-storybook
  # Directory to serve for screenshot capture
  staticDir: storybook-static

# Screenshot settings
screenshots:
  # Viewports to test
  viewports:
    - name: mobile
      width: 375
      height: 667
    - name: tablet
      width: 768
      height: 1024
    - name: desktop
      width: 1920
      height: 1080

  # Browser settings
  browser: chromium

  # Wait for network idle before capturing
  waitUntil: networkidle

# Comparison settings
comparison:
  # Threshold for visual differences (0-1)
  threshold: 0.1
  # Ignore anti-aliasing differences
  ignoreAntialiasing: true
  # Ignore colors (grayscale comparison)
  ignoreColors: false

# Baseline management
baseline:
  # Branch to use as baseline
  branch: main
  # Auto-approve changes on main branch
  autoApprove: true
```

### 10. Create Argos GitHub Workflow

Create `.github/workflows/argos.yml`:

```yaml
name: 'Argos Visual Testing'

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  argos-upload:
    runs-on: ubuntu-latest
    name: Upload to Argos
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Upload screenshots to Argos
        run: |
          npx @argos-ci/cli upload storybook-static \
            --token ${{ secrets.ARGOS_TOKEN }} \
            --parallel \
            --parallel-total 1
        env:
          ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}

      - name: Comment PR with Argos link
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const botComment = comments.find(comment =>
              comment.user.type === 'Bot' &&
              comment.body.includes('Argos Visual Testing')
            );

            const commentBody = `## Argos Visual Testing

            🎨 Visual regression tests are running!

            [View Results on Argos](https://argos.ozean-licht.dev)

            Changes will be compared against the \`main\` branch baseline.`;

            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: commentBody
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: commentBody
              });
            }
```

### 11. Create Progressive Disclosure Deployment Script

Create `storybook/scripts/deploy.sh`:

```bash
#!/bin/bash
# Deploy Storybook to Coolify
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../tools/templates/shared.sh"

APP_NAME="storybook"
COOLIFY_API_URL="${COOLIFY_API_URL:-http://coolify.ozean-licht.dev:8000/api/v1}"

# Handle explain mode
if [ "$1" = "--explain" ]; then
    print_header "Storybook Deploy - Explanation Mode"
    echo "${V}                                            ${V}"
    echo "${V} What this will do:                        ${V}"
    echo "${V}   1. Build Storybook static site          ${V}"
    echo "${V}   2. Validate build output                ${V}"
    echo "${V}   3. Trigger Coolify deployment           ${V}"
    echo "${V}   4. Wait for deployment to complete      ${V}"
    echo "${V}   5. Verify health check                  ${V}"
    echo "${V}   6. Report success/failure               ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Requirements:                             ${V}"
    echo "${V}   ✓ COOLIFY_API_TOKEN environment var     ${V}"
    echo "${V}   ✓ Build passes (npm run build-storybook)${V}"
    echo "${V}   ✓ Network connectivity to Coolify       ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Deployment target:                        ${V}"
    echo "${V}   🌐 https://storybook.ozean-licht.dev    ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Typical duration: 2-3 minutes             ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Related commands:                         ${V}"
    echo "${V}   npm run storybook - Start locally       ${V}"
    echo "${V}   npm run build-storybook - Build only    ${V}"
    print_footer

    echo ""
    echo "Ready to proceed? Remove --explain flag to execute"
    echo ""
    exit 0
fi

# Validate environment
if [ -z "$COOLIFY_API_TOKEN" ]; then
    log_error "COOLIFY_API_TOKEN not set"
    echo ""
    echo "Recovery options:"
    echo "  1. Set token: export COOLIFY_API_TOKEN='your-token'"
    echo "  2. Check env: env | grep COOLIFY"
    echo "  3. Get help: bash storybook/scripts/deploy.sh --explain"
    exit 1
fi

# Build Storybook
log_info "Building Storybook..."
if npm run build-storybook; then
    log_success "Build complete"
else
    log_error "Build failed"
    exit 1
fi

# Verify build output
if [ ! -d "storybook-static" ] || [ -z "$(ls -A storybook-static)" ]; then
    log_error "Build output directory empty or missing"
    exit 1
fi

log_success "Build validated ($(du -sh storybook-static | cut -f1))"

# Get Storybook app ID from Coolify
log_info "Looking up Storybook application..."
apps_response=$(curl -s -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    "${COOLIFY_API_URL}/applications")

STORYBOOK_APP_ID=$(echo "$apps_response" | jq -r '.[] | select(.name == "ozean-licht-storybook") | .id')

if [ -z "$STORYBOOK_APP_ID" ]; then
    log_error "Storybook application not found in Coolify"
    echo ""
    echo "Manual setup required:"
    echo "  1. Log in to Coolify: http://coolify.ozean-licht.dev:8000"
    echo "  2. Create new application: ozean-licht-storybook"
    echo "  3. Import config: storybook/deployment/coolify.json"
    echo "  4. Re-run this script"
    exit 1
fi

log_success "Found application (ID: $STORYBOOK_APP_ID)"

# Trigger deployment
log_info "Deploying to Coolify..."
deploy_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${COOLIFY_API_URL}/applications/${STORYBOOK_APP_ID}/deploy")

http_code=$(echo "$deploy_response" | tail -n1)
body=$(echo "$deploy_response" | head -n-1)

if [[ "$http_code" =~ ^(200|201|202)$ ]]; then
    log_success "Deployment triggered"

    # Wait for deployment (optional)
    log_info "Waiting for deployment to complete (60s timeout)..."
    sleep 60

    # Health check
    if curl -sf https://storybook.ozean-licht.dev/ > /dev/null; then
        log_success "Deployment successful!"
        echo ""
        echo "🎉 Storybook is live at:"
        echo "   https://storybook.ozean-licht.dev"
        echo ""
    else
        log_warning "Deployment triggered but health check failed"
        echo "Check status manually at Coolify dashboard"
    fi
else
    log_error "Deployment failed (HTTP $http_code)"
    echo "$body"
    exit 1
fi
```

### 12. Create Deployment Script Listing

Create `storybook/scripts/list.sh`:

```bash
#!/bin/bash
# List available Storybook commands
# Version: 1.0.0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../tools/templates/shared.sh"

print_header "Storybook Commands"
echo "${V}                                            ${V}"
echo "${V} Development:                              ${V}"
echo "${V}   npm run storybook - Start dev server    ${V}"
echo "${V}   npm run build-storybook - Build static  ${V}"
echo "${V}   npm test - Run unit tests               ${V}"
echo "${V}                                            ${V}"
echo "${V} Deployment:                               ${V}"
echo "${V}   bash storybook/scripts/deploy.sh        ${V}"
echo "${V}   bash storybook/scripts/deploy.sh --explain ${V}"
echo "${V}                                            ${V}"
echo "${V} Documentation:                            ${V}"
echo "${V}   storybook/docs/RUNBOOK.md               ${V}"
echo "${V}   storybook/docs/CONTRIBUTING.md          ${V}"
echo "${V}   storybook/docs/DEPLOYMENT.md            ${V}"
echo "${V}                                            ${V}"
print_footer

echo ""
echo "For detailed help on any command, use --explain flag"
echo ""
```

### 13. Update .gitignore

Add to `.gitignore`:

```
# Storybook
storybook-static/
.storybook-cache/
storybook/config/.cache/

# Argos
.argos/
argos-screenshots/
```

### 14. Create Argos Setup Documentation

Create `storybook/docs/ARGOS_SETUP.md`:

```markdown
# Argos Setup Guide

Self-hosted visual regression testing for Ozean Licht Storybook.

## Quick Start

### 1. Deploy Argos Instance

\`\`\`bash
# Deploy to Coolify
cd argos/
docker-compose up -d

# Verify deployment
curl https://argos.ozean-licht.dev
\`\`\`

### 2. Configure GitHub Integration

1. Create GitHub OAuth App
2. Add credentials to environment
3. Authenticate Argos with GitHub

### 3. Create Argos Project

\`\`\`bash
# Log in to Argos
npx @argos-ci/cli login --url https://argos.ozean-licht.dev

# Create project
npx @argos-ci/cli project create ozean-licht-storybook
\`\`\`

### 4. Add GitHub Secret

Add `ARGOS_TOKEN` to GitHub repository secrets.

## Usage

Visual regression tests run automatically on every PR:

\`\`\`bash
# Manual upload
npm run build-storybook
npx @argos-ci/cli upload storybook-static
\`\`\`

## Viewing Results

Visit https://argos.ozean-licht.dev to view comparison results.

## Troubleshooting

See [Argos documentation](https://argos-ci.com/docs) for detailed troubleshooting.
```

### 15. Update Deployment Documentation

Create `storybook/docs/DEPLOYMENT.md`:

```markdown
# Storybook Deployment Guide

## Quick Deploy (Manual)

\`\`\`bash
# Explain what will happen
bash storybook/scripts/deploy.sh --explain

# Deploy to production
bash storybook/scripts/deploy.sh
\`\`\`

## Automated Deployment

Automatic deployment is triggered on every push to `main` branch via GitHub Actions.

## Requirements

- `COOLIFY_API_TOKEN` environment variable
- Coolify application created (see setup section)
- Successful build (`npm run build-storybook`)

## Setup Coolify Application

### Option 1: API Import (Recommended)

\`\`\`bash
# Import configuration
curl -X POST https://coolify.ozean-licht.dev:8000/api/v1/applications/import \
  -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
  -d @storybook/deployment/coolify.json
\`\`\`

### Option 2: Manual Setup

1. Log in to Coolify dashboard
2. Create new application
3. Name: `ozean-licht-storybook`
4. Type: Static site
5. Build command: `npm run build-storybook`
6. Output directory: `storybook-static`
7. Port: 6006
8. Domain: storybook.ozean-licht.dev

## Monitoring

- Health check: https://storybook.ozean-licht.dev/
- Coolify dashboard: http://coolify.ozean-licht.dev:8000
- Build logs: `bash tools/deployment/logs.sh <app-id>`

## Rollback

\`\`\`bash
# Via Coolify dashboard
# Applications → ozean-licht-storybook → Deployments → Rollback
\`\`\`

## Troubleshooting

### Build Fails

\`\`\`bash
# Test build locally
npm run build-storybook

# Check for errors
npm run storybook
\`\`\`

### Deployment Fails

\`\`\`bash
# Check Coolify API
bash tools/deployment/health.sh

# Check application status
bash tools/deployment/status.sh <storybook-app-id>
\`\`\`

### Health Check Fails

\`\`\`bash
# Verify build output
ls -la storybook-static/

# Test locally
npx http-server storybook-static -p 6006
curl http://localhost:6006
\`\`\`
```

### 16. Update Main Spec Document

Update `specs/storybook-unified-implementation-spec.md` to document new structure:

```markdown
## Updated Project Structure (v2.0)

All Storybook files are now consolidated in `storybook/` directory:

\`\`\`
storybook/
├── config/              # Storybook configuration
│   ├── main.ts
│   ├── preview.ts
│   └── docs/*.mdx
├── docs/                # Documentation
│   ├── CONTRIBUTING.md
│   ├── RUNBOOK.md
│   ├── DEPLOYMENT.md
│   ├── ARGOS_SETUP.md
│   └── reports/
├── scripts/             # Deployment scripts
│   ├── deploy.sh
│   └── list.sh
├── deployment/          # Deployment configs
│   ├── coolify.json
│   └── argos-config.yml
├── templates/           # Story templates
└── docker/              # Docker files
    ├── Dockerfile
    └── .dockerignore
\`\`\`

### Argos Visual Testing

Chromatic has been replaced with self-hosted Argos:
- Instance: https://argos.ozean-licht.dev
- GitHub workflow: `.github/workflows/argos.yml`
- Configuration: `storybook/deployment/argos-config.yml`
```

### 17. Test File Consolidation

```bash
# Verify Storybook still works
npm run storybook

# Verify build works
npm run build-storybook

# Verify tests work
npm test

# Check for broken links
grep -r "\.storybook/" --include="*.md" --include="*.ts" --include="*.tsx"
grep -r "STORYBOOK_" --include="*.md" --include="*.ts" --include="*.tsx"
```

### 18. Deploy Argos Instance to Coolify

**Step 1: Create GitHub OAuth App**
```bash
# Go to: https://github.com/settings/developers
# Create OAuth App with:
# - Homepage: https://argos.ozean-licht.dev
# - Callback: https://argos.ozean-licht.dev/auth/github/callback
# Copy Client ID and Client Secret
```

**Step 2: Generate Secure Passwords**
```bash
# Generate passwords for environment variables
openssl rand -base64 32  # For ARGOS_DB_PASSWORD
openssl rand -base64 32  # For ARGOS_JWT_SECRET
```

**Step 3: Deploy via Coolify Dashboard**
```bash
# 1. Log in to Coolify: http://coolify.ozean-licht.dev:8000
# 2. Resources → New Resource → Docker Compose
# 3. Upload: storybook/argos/docker-compose.yml
# 4. Name: argos-ci
# 5. Domain: argos.ozean-licht.dev
# 6. Add environment variables:
#    - ARGOS_DB_PASSWORD=<generated-password>
#    - ARGOS_JWT_SECRET=<generated-secret>
#    - GITHUB_CLIENT_ID=<from-github-oauth>
#    - GITHUB_CLIENT_SECRET=<from-github-oauth>
# 7. Enable SSL/TLS (Let's Encrypt)
# 8. Click Deploy
```

**Step 4: Initialize Database**
```bash
# Wait for deployment to complete
sleep 60

# Run migrations
bash tools/containers/exec.sh argos-server "npm run db:migrate"

# Verify deployment
curl https://argos.ozean-licht.dev/health
# Expected: {"status":"ok"}
```

**Alternative: Deploy via CLI**
```bash
# Using progressive disclosure tools
export COOLIFY_API_TOKEN="your-token"
bash tools/deployment/deploy.sh argos-ci

# Or using Coolify API directly
curl -X POST http://coolify.ozean-licht.dev:8000/api/v1/applications \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -F "compose_file=@storybook/argos/docker-compose.yml" \
  -F "name=argos-ci" \
  -F "domain=argos.ozean-licht.dev"
```

### 19. Test Argos Deployment

```bash
# Check deployment status
bash tools/deployment/status.sh <argos-app-id>

# View logs
bash tools/containers/logs.sh argos-server 100

# Check health
curl https://argos.ozean-licht.dev/health

# Verify via monitoring tools
bash tools/monitoring/health-all.sh

# Check container resources
bash tools/containers/stats.sh
```

### 20. Update Package Dependencies

```bash
# Install Argos CLI
npm install --save-dev @argos-ci/cli

# Update package.json scripts
npm pkg set scripts.argos="argos upload storybook-static"

# Remove chromatic (already done in step 8)
# Verify dependencies
npm list --depth=0
```

## Testing Strategy

### Unit Tests
- Verify all imports still work after path changes
- Run `npm test` to ensure no regressions
- Check TypeScript compilation: `npx tsc --noEmit`

### Integration Tests
- Start Storybook dev server: `npm run storybook`
- Verify all stories load without errors
- Test story interactions and play functions
- Check accessibility panel shows no errors

### Deployment Tests
- **Argos deployment**: Deploy via Coolify dashboard or CLI tools
- **Database initialization**: Run migrations and verify connection
- **Health checks**: Verify https://argos.ozean-licht.dev/health responds
- **Visual regression**: Create PR, verify Argos runs and posts results
- **Monitoring**: Check Grafana dashboards and Coolify logs

### Path Validation
- Search codebase for old paths: `grep -r "\.storybook/" "STORYBOOK_"`
- Update any remaining references
- Verify documentation links work

## Acceptance Criteria

- [ ] All storybook files consolidated into `storybook/` directory
- [ ] Zero storybook-related files remain at root level (except storybook-static/ build output)
- [ ] `npm run storybook` starts dev server successfully
- [ ] `npm run build-storybook` builds without errors
- [ ] All stories load and render correctly
- [ ] Argos instance deployed via Coolify and accessible at https://argos.ozean-licht.dev
- [ ] Argos GitHub workflow runs on PRs and posts results
- [ ] Database initialized and migrations run successfully
- [ ] GitHub OAuth authentication configured and working
- [ ] Storybook deployed and accessible at https://storybook.ozean-licht.dev
- [ ] All documentation updated with Coolify deployment instructions
- [ ] Git history preserved for moved files
- [ ] Progressive disclosure tools integrated (deployment, containers, monitoring)
- [ ] Grafana monitoring configured for Argos metrics
- [ ] SSL/TLS enabled via Let's Encrypt in Coolify

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# 1. Verify no storybook files at root (except storybook/)
ls -la | grep -i storybook
# Expected: Only storybook/ directory and storybook-static/

# 2. Verify Storybook dev server works
npm run storybook
# Expected: Opens on http://localhost:6006

# 3. Verify build works
npm run build-storybook
# Expected: Creates storybook-static/ with no errors

# 4. Verify tests pass
npm test
# Expected: All tests pass

# 5. Verify TypeScript compiles
npx tsc --noEmit
# Expected: No errors

# 6. Check for old path references
grep -r "\.storybook/" --include="*.{md,ts,tsx,js}" . | grep -v "node_modules" | grep -v "storybook/"
# Expected: No results or only valid references

# 7. Verify deployment script works
bash storybook/scripts/deploy.sh --explain
# Expected: Shows explanation

# 8. Verify Argos is installed
npm list @argos-ci/cli
# Expected: Shows installed version

# 9. Verify Chromatic removed
npm list chromatic
# Expected: Empty or not found

# 10. Verify Argos workflow exists
test -f .github/workflows/argos.yml && echo "✓ Argos workflow exists"
# Expected: ✓ Argos workflow exists

# 11. Check Chromatic workflow removed
test ! -f .github/workflows/chromatic.yml && echo "✓ Chromatic workflow removed"
# Expected: ✓ Chromatic workflow removed

# 12. Verify documentation exists
ls -la storybook/docs/
# Expected: Shows CONTRIBUTING.md, RUNBOOK.md, DEPLOYMENT.md, ARGOS_SETUP.md

# 13. Verify config directory
ls -la storybook/config/
# Expected: Shows main.ts, preview.ts, docs/

# 14. Verify deployment config
test -f storybook/deployment/coolify.json && echo "✓ Coolify config exists"
# Expected: ✓ Coolify config exists

# 15. Verify Docker files
test -f storybook/docker/Dockerfile && echo "✓ Dockerfile exists"
# Expected: ✓ Dockerfile exists
```

## Notes

### Argos Self-Hosted Setup

**Prerequisites:**
- Coolify access (http://coolify.ozean-licht.dev:8000)
- Domain configured: argos.ozean-licht.dev
- GitHub OAuth App for authentication
- COOLIFY_API_TOKEN environment variable (for CLI deployment)

**Deployment via Coolify (Recommended):**

**Option A: Coolify Dashboard**
1. Log in to Coolify: http://coolify.ozean-licht.dev:8000
2. Create new resource → Docker Compose
3. Upload: `storybook/argos/docker-compose.yml`
4. Configure:
   - Name: `argos-ci`
   - Domain: `argos.ozean-licht.dev`
   - Environment variables (see below)
   - Enable SSL/TLS (Let's Encrypt)
5. Deploy

**Option B: Progressive Disclosure Tools**
```bash
# Using ecosystem deployment tools
export COOLIFY_API_TOKEN="your-token"
bash tools/deployment/deploy.sh argos-ci
```

**Option C: Local Development Only**
```bash
# For local testing before Coolify deployment
cd storybook/argos/
docker-compose up -d
```

**Initialize Database (First Time):**
```bash
# Via Coolify dashboard: Applications → argos-ci → Terminal
# Or via CLI:
bash tools/containers/exec.sh argos-server "npm run db:migrate"
```

**GitHub OAuth Setup:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Name: Ozean Licht Argos
   - Homepage URL: https://argos.ozean-licht.dev
   - Authorization callback URL: https://argos.ozean-licht.dev/auth/github/callback
3. Copy Client ID and Client Secret
4. Add to Coolify environment variables (see Deployment section)

**Argos CLI:**
```bash
# Install globally (optional)
npm install -g @argos-ci/cli

# Or use npx
npx @argos-ci/cli --help
```

### Progressive Disclosure Pattern

The deployment script follows the ecosystem's progressive disclosure pattern:

**Features:**
- `--explain` flag shows what will happen without executing
- Validation before execution
- Clear error messages with recovery options
- Success/failure reporting
- Integration with ecosystem navigation

**Example usage:**
```bash
# Understand what will happen
bash storybook/scripts/deploy.sh --explain

# Execute deployment
bash storybook/scripts/deploy.sh
```

### Migration Path

**For existing team members:**
1. Pull latest changes: `git pull origin main`
2. Install new dependencies: `npm install`
3. Update bookmarks: https://storybook.ozean-licht.dev
4. Read new docs: `storybook/docs/RUNBOOK.md`
5. No changes to daily workflow (npm scripts remain the same)

**Breaking changes:**
- Any hardcoded paths to `.storybook/` must be updated
- Chromatic token no longer needed (replaced with Argos)
- Documentation URLs have changed

### Cost Savings

**Before (Chromatic):**
- $100-200/month subscription
- External SaaS dependency
- Limited snapshots per month
- Manual token management

**After (Argos self-hosted on Coolify):**
- $0 software costs (self-hosted, open source)
- Infrastructure costs: ~$5-10/month (shared Coolify/Hetzner instance)
- Unlimited snapshots
- Full control and customization
- Integrated monitoring via Grafana
- Managed via progressive disclosure tools

**Annual Savings**: $1,080 - $2,280

### Performance Considerations

**Build optimization:**
- Argos upload runs in parallel with GitHub Actions
- TurboSnap equivalent: Only test changed components
- Caching enabled for faster subsequent builds

**Deployment optimization:**
- Static site deployment (<1 minute)
- CDN-ready output
- Gzip + Brotli compression enabled

### Future Enhancements

**Potential improvements:**
- Automated deployment on PR merge (currently manual trigger)
- Slack/Discord notifications for deployment status
- Performance budgets in CI
- Component usage analytics
- A11y testing integration with Argos