# Ozean Licht Storybook

Unified component documentation and testing platform for the Ozean Licht ecosystem.

## 🎯 MVP Status

**Status:** ✅ MVP Ready - Cleaned up and optimized for production deployment

Storybook is production-ready with:
- 66+ components documented
- Full story coverage for admin and shared UI components
- Performance optimized: 10s build time, 6.8MB bundle
- Accessible deployment target: https://storybook.ozean-licht.dev

**Next Steps:**
1. Deploy to Coolify (see [Deployment Guide](#deployment) below)
2. Configure DNS A record for storybook.ozean-licht.dev → 138.201.139.25

**Roadmap:** [specs/storybook-roadmap.md](./specs/storybook-roadmap.md) - Complete MVP deployment guide

---

## Quick Links

- **Documentation**: [docs/](./docs/)
  - [Contributing Guide](./docs/CONTRIBUTING.md)
  - [Runbook](./docs/RUNBOOK.md)
- **Configuration**: [config/](./config/)
- **Deployment**: [deployment/](./deployment/)
- **Scripts**: [scripts/](./scripts/)
- **Phase Reports**: [docs/reports/](./docs/reports/)

## Getting Started

```bash
# Start development server
npm run storybook

# Build for production
npm run build-storybook

# Run tests
npm run test-storybook
```

## Directory Structure

```
storybook/
├── build/            # Production build output (gitignored)
├── config/           # Storybook configuration
│   ├── main.ts      # Main Storybook config
│   ├── preview.ts   # Preview settings and decorators
│   └── docs/        # Documentation pages (.mdx files)
├── docs/             # Documentation and guides
│   ├── CONTRIBUTING.md
│   ├── RUNBOOK.md
│   └── reports/     # Phase completion reports
├── scripts/          # Deployment and utility scripts
├── deployment/       # Deployment configurations
│   └── coolify.json # Coolify deployment config
├── templates/        # Story templates
└── docker/           # Docker configuration
    ├── Dockerfile
    └── .dockerignore
```

## Component Coverage

Storybook includes stories for:
- **Shared UI Components** (`shared/ui-components/src/`)
- **Admin Components** (`apps/admin/components/`)
- **Ozean Licht Components** (`apps/ozean-licht/components/`)

## Key Features

- **Multi-tenant Support**: Entity context switcher (Admin, Kids Ascension, Ozean Licht)
- **Dark Mode**: Theme toggle for testing components in both themes
- **Accessibility Testing**: Built-in a11y addon with WCAG 2.1 AA compliance checks
- **Performance Optimized**: Chunk splitting and lazy loading for fast load times
- **Visual Testing**: Configured for visual regression testing

## Development

### Adding New Stories

1. Create a `*.stories.tsx` file next to your component
2. Follow the patterns in [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)
3. Stories will be automatically discovered by Storybook

### Testing

```bash
# Run unit tests
npm run test

# Run Storybook tests
npm run test-storybook

# Visual regression tests
# (Configured in deployment pipeline)
```

## Deployment

### Production URL
https://storybook.ozean-licht.dev

### Manual Deployment
```bash
# Using progressive disclosure tools (when implemented)
bash storybook/scripts/deploy.sh

# Explain what will happen
bash storybook/scripts/deploy.sh --explain
```

### Automated Deployment
Deployments are triggered automatically via:
- **CI/CD**: GitHub Actions on push to `main`
- **Coolify**: Configured in [deployment/coolify.json](./deployment/coolify.json)

## Troubleshooting

### Build Issues
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear caches
rm -rf node_modules/.cache
rm -rf storybook/build

# Reinstall dependencies
npm ci
```

### Port Conflicts
If port 6006 is in use:
```bash
# Kill process on port 6006
lsof -ti:6006 | xargs kill -9

# Or use a different port
npm run storybook -- -p 6007
```

## Documentation

- [Complete Runbook](./docs/RUNBOOK.md) - Comprehensive guide to all Storybook features
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to add and maintain stories
- [Phase Reports](./docs/reports/) - Implementation phase completion reports

## Support

For issues or questions:
1. Check the [Runbook](./docs/RUNBOOK.md)
2. Review [Phase Reports](./docs/reports/) for implementation details
3. Contact the platform team

---

**Version**: 2.0.0 (Consolidated Structure)
**Last Updated**: 2025-11-12
