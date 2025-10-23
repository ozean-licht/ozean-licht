# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-24

### Added

- Initial release of MCP Gateway Client for admin dashboard
- Database schema migration for admin tables
- Core MCP Gateway client with JSON-RPC 2.0 support
- Admin user CRUD operations
- Admin role and permission operations
- Permission checking with wildcard support
- Audit log operations with comprehensive filtering
- Session management operations
- Health check utilities
- TypeScript type definitions for all operations
- Comprehensive error handling with typed errors
- Automatic retry logic on transient failures
- Transaction support for complex operations
- Unit tests for core functionality
- Integration test framework
- Complete API documentation

### Database Schema

- `admin_users` - Admin user accounts with role-based access
- `admin_roles` - System and custom role definitions
- `admin_permissions` - Granular permission definitions
- `admin_audit_logs` - Comprehensive audit trail
- `admin_sessions` - Session tracking for security monitoring

### Features

- Zero direct database connections (all via MCP Gateway)
- Type-safe database operations
- Localhost authentication bypass for internal agents
- Configurable timeout and retry behavior
- Support for three databases: shared-users-db, kids-ascension-db, ozean-licht-db
- Idempotent database migrations

### Performance

- Simple queries: < 50ms via MCP Gateway
- List queries: < 200ms via MCP Gateway
- Health check: < 100ms round-trip

[0.1.0]: https://github.com/ozean-licht/ozean-licht-ecosystem/releases/tag/admin-mcp-client-v0.1.0
