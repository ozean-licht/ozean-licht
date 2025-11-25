# @ozean/mcp-gateway

> MCP Gateway for autonomous agent tooling

## Quick Start

```bash
npm install
npm run dev
npm run build
npm start
npm test
```

## Environment Variables

| Variable | Required | Default | Source |
|----------|----------|---------|--------|
| `ALLOWED_FILE_TYPES` | No | video/* | `src/mcp/initialize.ts:196` |
| `CONTEXT7_API_URL` | No | https://mcp.context7.com/mcp | `config/environment.ts:198` |
| `FIRECRAWL_API_KEY` | No | - | `src/mcp/handlers/firecrawl.ts:31` |
| `JWT_SECRET` | Yes | - | `tests/setup.ts:9` |
| `LOG_LEVEL` | Yes | - | `tests/setup.ts:10` |
| `MAX_FILE_SIZE_MB` | No | 500 | `src/mcp/initialize.ts:195` |
| `MINIO_ACCESS_KEY` | No | minioadmin | `src/mcp/initialize.ts:193` |
| `MINIO_ENDPOINT` | No | localhost | `src/mcp/initialize.ts:190` |
| `MINIO_PORT` | No | 9000 | `src/mcp/initialize.ts:191` |
| `MINIO_SECRET_KEY` | No | minioadmin | `src/mcp/initialize.ts:194` |
| `MINIO_USE_SSL` | No | - | `src/mcp/initialize.ts:192` |
| `NODE_ENV` | No | - | `src/monitoring/health.ts:72` |
| `PRESIGNED_URL_EXPIRY_SECONDS` | No | 300 | `src/mcp/initialize.ts:197` |

## API Endpoints

| Method | Path | Handler |
|--------|------|---------|
| GET | `/health` | `src/monitoring/health.ts` |
| GET | `/ready` | `src/monitoring/health.ts` |
| GET | `/info` | `src/monitoring/health.ts` |
| POST | `/execute` | `src/router/index.ts` |
| POST | `/rpc` | `src/router/index.ts` |
| GET | `/catalog` | `src/router/index.ts` |
| GET | `/service/:name` | `src/router/index.ts` |
| POST | `/test/:service` | `src/router/index.ts` |
| USE | `/mcp` | `src/server.ts` |
| USE | `/mcp` | `src/server.ts` |
| USE | `/` | `src/server.ts` |
| USE | `/mcp` | `src/server.ts` |
| POST | `/mcp/rpc` | `tests/integration/mcp-gateway.test.ts` |
| GET | `/health` | `tests/integration/mcp-gateway.test.ts` |
| GET | `/mcp/catalog` | `tests/integration/mcp-gateway.test.ts` |

## Structure

```
.
├── src/            # Source code [needs map]
├── tests/          # Test suites [needs map]
├── config/         # Configuration
├── tools/          # ...
├── docs/           # Documentation
├── logs/           # ...
├── monitoring/     # Metrics & health [needs map]
├── scripts/        # Build scripts
└── dist/server.js  # Entry point
```

## Key Files

Files ranked by import frequency (gravity):

| File | Imports | Purpose |
|------|---------|---------|
| `src/utils/errors.ts` | 21 | Error handling utilities |
| `src/mcp/protocol/types.ts` | 19 | TypeScript type definitions |
| `src/utils/logger.ts` | 18 | Logging utilities |
| `config/environment.ts` | 15 | Zod validation schema |
| `src/monitoring/metrics.ts` | 10 | Server initialization |
| `src/auth/middleware.ts` | 5 | Middleware functions |
| `src/mcp/registry.ts` | 4 | <!-- ENRICH --> |
| `tests/mocks/http-client.ts` | 4 | Client implementation |
| `src/auth/rateLimit.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/cloudflare.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/github.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/mem0.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/minio.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/n8n.ts` | 1 | <!-- ENRICH --> |
| `src/mcp/handlers/postgres.ts` | 1 | <!-- ENRICH --> |

## If You Need To...

<!-- ENRICH: Add 3-5 common tasks based on understanding of the codebase -->

| Task | Start Here | Flow |
|------|------------|------|
| Add route | `src/monitoring/` | Create handler → Register in router |
| Add middleware | `src/middleware/` | Create function → Add to app chain |
| Add env var | `src/mcp/initialize.ts` | Add to schema → Update `.env.example` |

## Documentation

- [Grafana Monitoring - Production Deployment Guide](./docs/DEPLOYMENT.md)
- [MCP Gateway Architecture](./docs/architecture.md)
- [Context7 MCP Usage Guide](./docs/context7-usage.md)
- [MCP Gateway Setup Checklist](./docs/setup-checklist.md)

## Needs Deeper Mapping

These directories are complex enough for their own README:

- [ ] `src/` — 22 files
- [ ] `tests/` — 13 files
- [ ] `monitoring/` — 3 levels deep

---

*Mapped: 2025-11-25 | Mode: hybrid (enrichment markers present) | Files: ~63*