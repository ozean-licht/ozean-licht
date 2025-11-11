# Admin Dashboard Documentation

Welcome to the comprehensive documentation for the Ozean Licht Ecosystem Admin Dashboard.

## Quick Links

- **[Getting Started](./development/credentials.md)** - Test credentials and local setup
- **[Architecture Overview](./architecture.md)** - System architecture and design patterns
- **[Routes Documentation](./routes.md)** - Complete route map and structure
- **[Design System](./design-system.md)** - UI/UX guidelines and components
- **[Deployment Guide](./deployment/deployment.md)** - Production deployment instructions
- **[Requirements](./requirements/)** - Platform requirements and specifications

## Documentation Structure

### 📐 Core Documentation
- `architecture.md` - System design, technical decisions, and architecture patterns
- `routes.md` - Complete route map and navigation structure
- `design-system.md` - UI/UX guidelines, branding, and component patterns
- `roadmap-specs-list.md` - Implementation roadmap and specification list
- `rbac-guide.md` - Role-based access control guide

### 🎯 Features
- `features/` - Feature implementation guides
  - `admin-db-schema-mcp-client.md` - Database schema and MCP client
  - `minio-s3-storage-integration.md` - Storage integration
  - `nextauth-admin-authentication.md` - Authentication system
  - `nextauth-core-libraries.md` - Core authentication libraries
  - `system-health-monitoring.md` - Health monitoring features

### 📋 Requirements
- `requirements/` - Platform requirements and specifications
  - `kids_ascension_admin_requirements.md` - Kids Ascension admin features
  - `ozean_licht_admin_requirements.md` - Ozean Licht admin features

### 🛠️ Development
- `development/` - Developer guides, testing, and local setup
  - `credentials.md` - Test user credentials
  - `dashboard-status-2025-11-09.md` - Current dashboard status
  - `tunnel-access-fix.md` - SSH tunnel configuration
  - `tunnel-access-solution.md` - Tunnel access troubleshooting

### 🚀 Deployment
- `deployment/` - Deployment instructions and configurations
  - `deployment.md` - Comprehensive deployment guide

### 📊 Reports
- `reports/` - Implementation and analysis reports
  - `admin_app_complexity_analysis.md` - Complexity analysis
  - `component-library-status.md` - Component library status
  - `dashboard-styling-update.md` - Styling updates
  - `package-lock-analysis.md` - Package lock investigation
  - `permissions-matrix-code-samples.md` - Permission code examples
  - `permissions-matrix-ui-implementation-report.md` - UI implementation
  - `rbac-implementation-report.md` - RBAC implementation

### 🔍 Decisions
- `decisions/` - Architecture decision records
  - `cleanup-summary.md` - Cleanup decisions and rationale
  - `storage-feature-status.md` - Storage feature status

### 📦 Archive
- `archive/` - Historical documents and artifacts
  - `adw-plans/` - ADW (Autonomous Development Workflow) issue plans
  - `patches/` - Historical patch specifications
  - Legacy implementation summaries and analysis

### 📝 Implementation Reports
- `implementation-reports/` - Detailed implementation documentation
  - `admin-data-tables-foundation.md` - Data tables implementation

## Navigation

### For New Developers
1. Start with [Developer Guide](../DEVELOPER_GUIDE.md)
2. Review [Test Credentials](./development/credentials.md)
3. Check [Architecture](./architecture.md) for system design
4. Review [Routes](./routes.md) for navigation structure
5. Read [Design System](./design-system.md) for UI patterns

### For AI Agents
1. Read [AI Agent Guide](../.claude/CLAUDE.md) for development patterns
2. Review [Architecture](./architecture.md) for system structure
3. Check [Routes](./routes.md) for page organization
4. Follow [RBAC Guide](./rbac-guide.md) for security patterns

### For Operations
1. Review [Deployment Guide](./deployment/deployment.md)
2. Check [System Health Monitoring](./features/system-health-monitoring.md)
3. Monitor via admin dashboard `/dashboard/system/health` endpoint
4. Review [Tunnel Access](./development/tunnel-access-fix.md) for remote access

### For Product/Planning
1. Review [Platform Requirements](./requirements/)
2. Check [Roadmap](./roadmap-specs-list.md)
3. Review [Implementation Reports](./reports/)
4. Check [Decisions](./decisions/) for architectural choices

## Contributing

When adding new documentation:
- Place feature docs in `features/`
- Place implementation reports in `reports/`
- Place architecture decisions in `decisions/`
- Archive historical docs in `archive/` with clear naming
- Use kebab-case for file names
- Update cross-references when moving files

## Related Documentation

- **[Root README](../README.md)** - Main project documentation and quick start
- **[Developer Guide](../DEVELOPER_GUIDE.md)** - Quick patterns and troubleshooting
- **[AI Agent Guide](../.claude/CLAUDE.md)** - AI agent development patterns
- **[CHANGELOG](../CHANGELOG.md)** - Version history
- **[BRANDING](../BRANDING.md)** - Brand guidelines
- **[DEPLOYMENT](../DEPLOYMENT.md)** - Production deployment

---

**Last Updated:** 2025-11-11
**Status:** Phase 1 - Foundation Complete
**Maintainer:** Platform Team + Autonomous Agents
