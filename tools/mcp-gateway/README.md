# MCP Gateway

> **Version:** 1.0.3
> **Status:** ✅ Production Ready - Docker Tested & Verified with MinIO
> **Last Updated:** 2025-11-13

A unified gateway for autonomous agents to access tools and services through the Model Context Protocol (MCP). The gateway provides a standardized interface for agents to interact with backend services through slash commands, handling authentication, rate limiting, protocol translation, and service orchestration.

---

## 📚 Documentation

- **[Setup Checklist](./setup-checklist.md)** - Complete setup progress and phase tracking
- **[Guides](./docs/guides/)** - Configuration and deployment guides
  - [Webhook Setup Guide](./docs/guides/WEBHOOK-SETUP.md) - GitHub auto-deploy configuration
  - [Telegram Setup Guide](./monitoring/TELEGRAM-SETUP.md) - Alert notifications
- **[Session Notes](./docs/sessions/)** - Development session summaries
  - [Final Session Summary](./docs/sessions/FINAL-SESSION-SUMMARY.md) - Latest deployment status

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Services](#services)
6. [Usage Examples](#usage-examples)
7. [Deployment](#deployment)
8. [Configuration](#configuration)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)
11. [Development](#development)
12. [Implementation Status](#implementation-status)

---

## Overview

The MCP Gateway acts as a bridge between autonomous agents and various backend services. It implements the Model Context Protocol using JSON-RPC 2.0, providing:

- **Unified Interface**: Single endpoint for all MCP services
- **Multi-Database Access**: PostgreSQL connections for Kids Ascension and Ozean Licht
- **External Service Integration**: Cloudflare, GitHub, Mem0, N8N
- **Enterprise Features**: Authentication, rate limiting, metrics, health checks

### Architecture Diagram

```
Agent → Slash Command → MCP Gateway → Service Handler → Backend Service
                          ↓              ↓
                    Authentication   Protocol
                    Rate Limiting    Translation
                    Metrics          Connection Pool
```

**Key Components:**
- **Express Server** (Node.js 20 + TypeScript)
- **JSON-RPC 2.0** Protocol Handler
- **Service Registry** with 10 MCP services
- **JWT Authentication** with per-agent rate limiting
- **Connection Pooling** for PostgreSQL
- **Prometheus Metrics** (port 9090)
- **Docker Containerized** (221MB optimized image)

---

## Features

### Core Capabilities

✅ **10 MCP Services Integrated:**
- **Server-Side (Always Loaded):** PostgreSQL, Mem0, Cloudflare, GitHub, N8N, MinIO, Coolify, Firecrawl, Context7
- **Local (Agent-Side References):** Playwright, ShadCN, MagicUI

✅ **Authentication & Security:**
- JWT-based agent authentication
- Per-agent rate limiting (100 req/min default)
- Non-root container execution
- Environment-based secret management

✅ **Monitoring & Observability:**
- Prometheus metrics on port 9090
- Health checks (`/health`, `/ready`)
- Structured logging (Winston)
- Request tracing with correlation IDs

✅ **Performance & Reliability:**
- PostgreSQL connection pooling (2-10 connections)
- Circuit breaker pattern for HTTP clients
- Request/response timeout handling
- Graceful shutdown with connection cleanup

---

## Architecture

### Server-Side MCP Services

#### 1. PostgreSQL MCP
- **Purpose:** Database operations for both Kids Ascension and Ozean Licht databases
- **Features:**
  - Connection pooling (min: 2, max: 10)
  - Schema introspection
  - Query execution with parameterized queries
  - Connection statistics
- **Databases:**
  - `kids-ascension-db` (port 5432)
  - `ozean-licht-db` (port 5431)

#### 2. Mem0 MCP
- **Purpose:** Persistent memory and context management
- **Features:**
  - Memory storage and retrieval
  - Vector-based semantic search
  - Context management per agent
  - Health monitoring
- **Endpoint:** `http://mem0.ozean-licht.dev:8090`

#### 3. Cloudflare MCP
- **Purpose:** CDN, DNS, and video management
- **Features:**
  - DNS record management
  - Cloudflare Stream operations (video upload/management)
  - Zone management
  - Analytics
- **Authentication:** API Token

#### 4. GitHub MCP
- **Purpose:** Repository and code management
- **Features:**
  - Repository operations
  - PR management (list, create, merge, approve)
  - Issue management (list, create, update, close)
  - Branch operations
  - Workflow dispatch
- **Authentication:** GitHub App (App ID + Private Key)

#### 5. N8N MCP
- **Purpose:** Workflow automation
- **Features:**
  - Workflow execution
  - Webhook management
  - Execution tracking
  - Workflow list/status
- **Endpoint:** `http://n8n.ozean-licht.dev:5678`

#### 6. MinIO MCP
- **Purpose:** S3-compatible object storage for file management
- **Features:**
  - File upload with base64 encoding
  - List files with prefix filtering and pagination
  - Generate presigned URLs for secure access
  - Delete files and get metadata
  - Automatic bucket creation
  - Content type validation (video/*, image/*, PDF, ZIP)
  - File size limits (configurable, default 500MB)
- **Endpoint:** `http://138.201.139.25:9000`
- **Authentication:** Access Key/Secret Key

#### 7. Coolify MCP
- **Purpose:** Infrastructure and deployment management
- **Features:**
  - List applications and databases
  - Deploy applications (pull latest code)
  - Restart applications
  - Get Coolify version and status
- **Endpoint:** `http://coolify.ozean-licht.dev:8000`
- **Authentication:** API Token

#### 8. Firecrawl MCP
- **Purpose:** Web scraping and content extraction service
- **Features:**
  - Scrape web pages and convert to markdown
  - Extract structured content
  - Health monitoring
  - Always active for all agents
- **Endpoint:** `https://api.firecrawl.dev`
- **Authentication:** API Key

#### 9. Context7 MCP
- **Purpose:** Up-to-date, version-specific code documentation for libraries
- **Features:**
  - Resolve library names to Context7 IDs
  - Fetch version-specific documentation
  - Topic-based filtering (e.g., "hooks", "routing")
  - Token-limited responses (1k-10k tokens)
  - Always active for all agents
  - Supports 100+ popular libraries (React, Next.js, FastAPI, etc.)
- **Endpoint:** `https://mcp.context7.com/mcp`
- **Authentication:** Optional API key (higher rate limits with key, free tier without)

### Local MCP Services (Agent-Side)

These services run locally on the agent's machine:
- **Playwright:** Browser automation
- **ShadCN:** UI component library
- **MagicUI:** Enhanced UI components

For detailed architecture information, see [`docs/architecture.md`](docs/architecture.md).

---

## Quick Start

### Prerequisites

- Node.js v20 or higher
- Docker and Docker Compose
- PostgreSQL databases (Kids Ascension & Ozean Licht)
- Required API tokens (Cloudflare, GitHub, N8N)

### Installation

```bash
# Clone repository
cd /opt/ozean-licht-ecosystem/infrastructure/mcp-gateway

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Add your credentials
```

### Development Mode

```bash
# Run with hot reload
npm run dev

# Server starts on http://localhost:8100
# Metrics available on http://localhost:9090
```

### Build for Production

```bash
# Compile TypeScript
npm run build

# Start production server
npm start

# Or with PM2
npm run start:pm2
```

### Docker (Recommended)

```bash
# Build image
docker compose build

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f mcp-gateway
```

### Verify Installation

```bash
# Health check
curl http://localhost:8100/health

# Service catalog
curl http://localhost:8100/mcp/catalog

# Metrics
curl http://localhost:9090/metrics
```

---

## Services

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic liveness check |
| `/ready` | GET | Readiness with dependency checks |
| `/metrics` | GET | Prometheus metrics (port 9090) |
| `/mcp/execute` | POST | Execute slash commands |
| `/mcp/rpc` | POST | JSON-RPC 2.0 interface |
| `/mcp/catalog` | GET | List all services and capabilities |
| `/mcp/service/:name` | GET | Get service details |

### Service Catalog

```bash
# List all available services
curl http://localhost:8100/mcp/catalog | jq

# Response includes:
# - Service name and version
# - Location (server/local)
# - Capabilities
# - Commands
# - Token costs
```

---

## Authentication

MCP Gateway supports **three authentication methods** (checked in priority order):

### 1. Localhost/Docker Network Bypass ⚡ (Recommended for Internal Agents)

**Zero authentication overhead!** Requests from localhost and Docker networks automatically bypass authentication:

```bash
# No auth headers needed!
curl -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{...},"id":1}' \
  http://localhost:8100/mcp/rpc
```

**Trusted IPs:**
- `127.0.0.1`, `::1` (localhost)
- `10.x.x.x`, `172.x.x.x`, `192.168.x.x` (private networks)

**Use Case:** Internal agents running on the same server

### 2. API Key Authentication 🔑 (For Remote Agents)

Simple header-based authentication (for future use if gateway is exposed):

```bash
curl -H "X-MCP-Key: mcp_live_abc123xyz456" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{...},"id":1}' \
  http://10.0.1.16:8100/mcp/rpc
```

**Use Case:** Remote agents or external integrations (currently internal-only)

### 3. JWT Bearer Token 🎫 (Legacy)

Full JWT token support for backward compatibility:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"mcp.execute","params":{...},"id":1}' \
  http://localhost:8100/mcp/rpc
```

**Use Case:** Legacy systems or when you need fine-grained permissions

---

## Usage Examples

### Slash Commands

```bash
# PostgreSQL operations (NO AUTH NEEDED for localhost!)
/mcp-postgres kids-ascension-db list tables
/mcp-postgres ozean-licht-db describe users
/mcp-postgres kids-ascension-db query "SELECT * FROM videos LIMIT 10"

# Mem0 memory operations
/mcp-mem0 remember "User prefers TypeScript"
/mcp-mem0 search "programming preferences"
/mcp-mem0 get-context agent_001

# Cloudflare operations
/mcp-cloudflare dns list-records ozean-licht.dev
/mcp-cloudflare stream upload /videos/lesson1.mp4
/mcp-cloudflare zones list

# GitHub operations
/mcp-github list-repos ozean-licht
/mcp-github create-pr "feat: Add feature" "Description here"
/mcp-github list-issues --label=bug
/mcp-github merge-pr 123

# N8N workflow operations
/mcp-n8n execute workflow_123 {"data": "payload"}
/mcp-n8n list-workflows
/mcp-n8n get-execution exec_456

# MinIO storage operations
/mcp-minio upload kids-ascension-staging videos/lesson1.mp4 video/mp4
/mcp-minio list kids-ascension-staging --prefix=videos/
/mcp-minio getUrl kids-ascension-staging videos/lesson1.mp4
/mcp-minio delete kids-ascension-staging videos/old-video.mp4
/mcp-minio stat kids-ascension-staging videos/lesson1.mp4

# Coolify deployment operations
/mcp-coolify list-applications
/mcp-coolify deploy-application 3
/mcp-coolify restart-application 3
/mcp-coolify list-databases
/mcp-coolify get-version

# Firecrawl web scraping
/mcp-firecrawl scrape "https://docs.anthropic.com/en/docs/claude-code/sdk"
/mcp-firecrawl health

# Context7 documentation service
/mcp-context7 resolve "react"
/mcp-context7 resolve "nextjs"
/mcp-context7 get-docs "react@18" --topic="hooks"
/mcp-context7 get-docs "fastapi@0.104" --tokens=3000
/mcp-context7 health
```

### JSON-RPC API

#### Execute MCP Command

```bash
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "postgres",
      "database": "kids-ascension",
      "operation": "list-tables"
    },
    "id": "unique-request-id"
  }'
```

#### List Services

```bash
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.listServices",
    "id": "unique-request-id"
  }'
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": {
      "tables": ["users", "videos", "courses"]
    },
    "metadata": {
      "executionTime": 45,
      "tokensUsed": 150
    }
  },
  "id": "unique-request-id"
}
```

---

## Deployment

### Docker Deployment

#### Build & Run

```bash
# Build image (221MB optimized)
docker build -t mcp-gateway:1.0.0 .

# Run with environment variables
docker run -d \
  --name mcp-gateway \
  -p 8100:8100 \
  -p 9090:9090 \
  --env-file .env \
  mcp-gateway:1.0.0
```

#### Docker Compose (Recommended)

```bash
# Start all services
docker compose up -d

# Included services:
# - mcp-gateway (port 8100, 9090)
# - redis (port 6380)

# Check status
docker compose ps

# View logs
docker compose logs -f mcp-gateway

# Stop services
docker compose down
```

### Coolify Deployment

#### Option 1: Via Coolify UI

1. **Login:** `http://coolify.ozean-licht.dev:8000`
2. **Create Resource:** New Resource → Docker Compose
3. **Configure:**
   - Name: `mcp-gateway`
   - Repository: Your Git repo
   - Branch: `main`
   - Docker Compose Path: `infrastructure/mcp-gateway/docker-compose.coolify.yml`

   **⚠️ Important:** Use `docker-compose.coolify.yml` (not `docker-compose.yml`) for correct build context paths when deploying from repository root.
4. **Environment Variables:** Copy all from `.env` file
5. **Deploy:** Click "Deploy"

Coolify will automatically:
- Build Docker image
- Start services
- Configure reverse proxy
- Set up SSL (Let's Encrypt)
- Monitor health checks

#### Option 2: Manual Deployment

```bash
# SSH into server
ssh root@138.201.139.25

# Navigate to project
cd /opt/ozean-licht-ecosystem/infrastructure/mcp-gateway

# Pull latest code
git pull origin main

# Deploy
docker compose up -d --build

# Verify
docker compose ps
curl http://localhost:8100/health
```

### Post-Deployment Verification

```bash
# 1. Container Status
docker compose ps
# Expected: mcp-gateway Up (healthy)

# 2. Health Check
curl http://localhost:8100/health
# Expected: {"status":"healthy","timestamp":"...","version":"1.0.0"}

# 3. Services Initialized
docker compose logs mcp-gateway | grep "Initialized"
# Expected: ✅ Initialized postgres/mem0/cloudflare/github/n8n MCP service

# 4. Metrics
curl http://localhost:9090/metrics | head -20
# Expected: Prometheus metrics data

# 5. Service Catalog
curl http://localhost:8100/mcp/catalog
# Expected: List of 10 MCP services
```

---

## Configuration

### Environment Variables

**Required Variables:**

```bash
# Server Configuration
NODE_ENV=production          # development | production | test
PORT=8100                    # Main API port
HOST=0.0.0.0                # Bind address

# Database - Kids Ascension
POSTGRES_KA_URL=postgresql://user:password@host:5432/kids-ascension
POSTGRES_KA_PASSWORD=your_password

# Database - Ozean Licht
POSTGRES_OL_URL=postgresql://user:password@host:5431/ozean-licht
POSTGRES_OL_PASSWORD=your_password

# Service URLs
MEM0_API_URL=http://mem0.ozean-licht.dev:8090
N8N_API_URL=http://n8n.ozean-licht.dev:5678
N8N_API_KEY=your_n8n_api_key

# Cloudflare
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ZONE_ID=your_zone_id

# GitHub App
GITHUB_PAT=ghp_your_personal_access_token
GITHUB_APP_ID=123456
GITHUB_INSTALLATION_ID=78910
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# External Services
FIRECRAWL_API_KEY=fc-your_api_key          # Web scraping
CONTEXT7_API_KEY=your_context7_key         # Optional: higher rate limits for docs

# Security
JWT_SECRET=minimum_32_character_secret_key_here
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000          # 60 seconds
RATE_LIMIT_MAX_REQUESTS=100         # per window

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
LOG_LEVEL=info                      # error | warn | info | debug
LOG_FORMAT=json                     # json | pretty

# Connection Pools
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT_MS=10000

# Timeouts
DEFAULT_TIMEOUT_MS=30000
DB_QUERY_TIMEOUT_MS=10000
HTTP_TIMEOUT_MS=30000
```

### Credential Setup Guides

#### Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Select permissions:
   - Stream: Edit
   - DNS: Edit
   - Zone: Read
   - Account: Read
4. Copy token and set `CLOUDFLARE_API_TOKEN`
5. Get Account ID from zone overview → Set `CLOUDFLARE_ACCOUNT_ID`

#### GitHub App

1. Go to https://github.com/settings/apps
2. Create new GitHub App:
   - **Permissions:**
     - Contents: Read & Write
     - Pull requests: Read & Write
     - Issues: Read & Write
     - Metadata: Read-only
3. Generate private key (download .pem file)
4. Install app to your organization/repositories
5. Set in `.env`:
   ```bash
   GITHUB_APP_ID=123456
   GITHUB_INSTALLATION_ID=78910
   GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
   ```

#### JWT Secret

Generate a secure random secret:

```bash
# Generate 32+ character secret
openssl rand -base64 48

# Set in .env
JWT_SECRET=your_generated_secret_here
```

---

## Monitoring

### Health Checks

**Basic Health:**
```bash
curl http://localhost:8100/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-10-22T14:54:52.174Z",
  "version": "1.0.0"
}
```

**Readiness Check:**
```bash
curl http://localhost:8100/ready

# Includes dependency status:
# - PostgreSQL pools
# - Mem0 connectivity
# - N8N availability
```

### Prometheus Metrics

Available on port 9090:

```bash
curl http://localhost:9090/metrics

# Key metrics:
# - mcp_operation_duration_seconds
# - mcp_operation_total
# - mcp_token_usage_total
# - mcp_connection_pool_size
# - mcp_connection_pool_idle
# - http_request_duration_seconds
# - process_cpu_user_seconds_total
# - process_resident_memory_bytes
```

### Prometheus Configuration

Add to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'mcp-gateway'
    static_configs:
      - targets: ['mcp-gateway:9090']
    scrape_interval: 15s
    scrape_timeout: 10s
```

### Grafana Dashboard

Create panels for:
- **Request Rate:** Requests per second by service
- **Latency:** P50, P95, P99 response times
- **Errors:** Error rate by category
- **Connections:** Database pool stats
- **Resources:** CPU, memory usage

### Logging

Structured JSON logs in production:

```json
{
  "level": "info",
  "message": "Request processed",
  "service": "mcp-gateway",
  "timestamp": "2025-10-22T14:54:19.438Z",
  "method": "GET",
  "path": "/health",
  "statusCode": 200,
  "duration": 2,
  "ip": "127.0.0.1"
}
```

**View logs:**
```bash
# Docker
docker compose logs -f mcp-gateway

# PM2
pm2 logs mcp-gateway

# Filter errors
docker compose logs mcp-gateway | grep ERROR
```

---

## Troubleshooting

### Container Won't Start

**Symptoms:** Container exits immediately or restarts continuously

**Check:**
```bash
# View logs
docker compose logs mcp-gateway --tail 50

# Common issues:
# 1. Missing environment variables
# 2. Invalid database credentials
# 3. Port already in use
```

**Solutions:**
- Verify all required env vars are set
- Test database connectivity: `psql $POSTGRES_KA_URL -c "SELECT 1"`
- Check port availability: `lsof -i :8100`

### Service Not Initializing

**Symptoms:** Logs show service initialization failures

**Check specific service:**
```bash
docker compose logs mcp-gateway | grep "postgres"
docker compose logs mcp-gateway | grep "cloudflare"
docker compose logs mcp-gateway | grep "github"
```

**Common issues:**
- **PostgreSQL:** Wrong credentials, database doesn't exist, wrong port
- **Cloudflare:** Invalid API token, insufficient permissions
- **GitHub:** App not installed, wrong private key format, invalid installation ID
- **Mem0:** Service not running at specified URL
- **N8N:** Service not running, wrong API key

### Authentication Errors

**Symptoms:** 401 Unauthorized responses

**Solutions:**
- Verify `JWT_SECRET` is set (min 32 chars)
- Check token expiration (24h default)
- Ensure `Authorization: Bearer <token>` header format
- Generate new token if expired

### Rate Limit Exceeded

**Symptoms:** 429 Too Many Requests

**Solutions:**
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Check per-service limits in code
- Monitor usage patterns via metrics
- Implement request batching in agent

### Database Connection Issues

**Symptoms:** Connection refused, pool exhausted

**Solutions:**
```bash
# Test direct connection
psql $POSTGRES_KA_URL -c "SELECT NOW()"

# Check connection pool settings
# - DB_POOL_MIN (default: 2)
# - DB_POOL_MAX (default: 10)
# - DB_IDLE_TIMEOUT_MS (default: 10000)

# Monitor pool metrics
curl http://localhost:9090/metrics | grep mcp_connection_pool
```

### Health Check Failing

```bash
# Test from inside container
docker compose exec mcp-gateway wget -qO- http://localhost:8100/health

# Test PostgreSQL from container
docker compose exec mcp-gateway node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.POSTGRES_KA_URL });
pool.query('SELECT NOW()').then(r => console.log('✅ DB OK:', r.rows[0])).catch(e => console.error('❌ DB Error:', e.message));
"
```

---

## Development

### Project Structure

```
mcp-gateway/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── router/
│   │   └── index.ts          # Express route handlers
│   ├── mcp/
│   │   ├── initialize.ts     # Service initialization
│   │   ├── registry.ts       # Service registry
│   │   ├── protocol/
│   │   │   └── types.ts      # JSON-RPC types
│   │   └── handlers/
│   │       ├── postgres.ts   # PostgreSQL MCP handler
│   │       ├── mem0.ts       # Mem0 MCP handler
│   │       ├── cloudflare.ts # Cloudflare MCP handler
│   │       ├── github.ts     # GitHub MCP handler
│   │       └── n8n.ts        # N8N MCP handler
│   ├── auth/
│   │   ├── middleware.ts     # JWT authentication
│   │   └── rateLimit.ts      # Rate limiting
│   ├── monitoring/
│   │   ├── metrics.ts        # Prometheus metrics
│   │   └── health.ts         # Health checks
│   └── utils/
│       ├── logger.ts         # Winston logging
│       └── errors.ts         # Error handling
├── config/
│   └── environment.ts         # Environment configuration
├── tests/
│   └── *.test.ts             # Test files
├── docs/
│   └── architecture.md        # Detailed architecture
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

### Adding New MCP Services

1. **Create handler:** `src/mcp/handlers/[service].ts`

```typescript
import { MCPHandler } from '../protocol/types';

export const myServiceHandler: MCPHandler = {
  name: 'my-service',
  version: '1.0.0',
  location: 'server',

  async initialize() {
    // Setup connections, clients, etc.
  },

  async execute(operation: string, params: any) {
    // Handle operations
    switch (operation) {
      case 'test':
        return { status: 'ok' };
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  },

  async health() {
    // Health check logic
    return { healthy: true };
  }
};
```

2. **Register service:** `src/mcp/initialize.ts`

```typescript
import { myServiceHandler } from './handlers/my-service';

export async function initializeMCPServices() {
  // ... existing services

  await myServiceHandler.initialize();
  registry.registerService(myServiceHandler);
  logger.info('✅ Initialized my-service MCP');
}
```

3. **Add tests:** `tests/my-service.test.ts`

```typescript
import { myServiceHandler } from '../src/mcp/handlers/my-service';

describe('MyService MCP', () => {
  test('should execute test operation', async () => {
    const result = await myServiceHandler.execute('test', {});
    expect(result.status).toBe('ok');
  });
});
```

4. **Update documentation**

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Test specific service
npm test -- postgres

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

---

## Implementation Status

### ✅ Completed (Phases 0-5)

**Phase 0: Strategic Foundation**
- ✅ Vision and success criteria defined
- ✅ Master plan created

**Phase 1: Architectural Design**
- ✅ MCP Gateway architecture designed
- ✅ Technology stack selected (Node.js, TypeScript, Express)
- ✅ Security architecture planned (JWT, rate limiting)

**Phase 2: Core Implementation**
- ✅ Express server with TypeScript
- ✅ JSON-RPC 2.0 protocol handler
- ✅ Service registry
- ✅ Authentication & rate limiting
- ✅ Monitoring & health checks
- ✅ Structured logging

**Phase 3: MCP Service Implementations**
- ✅ **PostgreSQL MCP** - Full database operations with connection pooling
- ✅ **Mem0 MCP** - Memory storage and vector search
- ✅ **Cloudflare MCP** - Stream, DNS, zones, analytics
- ✅ **GitHub MCP** - Complete GitHub App integration (repos, PRs, issues, workflows)
- ✅ **N8N MCP** - Workflow automation with execution tracking
- ✅ **MinIO MCP** - S3-compatible object storage with presigned URLs

**Phase 4: Local MCP References**
- ✅ Playwright, ShadCN, MagicUI configured in registry

**Phase 5: Deployment & Orchestration**
- ✅ **Docker image built** - 221MB optimized multi-stage build
- ✅ **Docker Compose tested** - All services initialize correctly
- ✅ **Environment loading** - Works with .env files and direct env vars
- ✅ **Health checks verified** - Returns 200 OK
- ✅ **Metrics verified** - Prometheus endpoint operational
- ✅ **All 9 services initialized** - Tested in container (including MinIO)

### ⏳ Pending (Phases 6-10)

**Phase 6: Token Cost Catalog**
- Usage metrics definition
- Cost calculation per operation
- Catalog JSON creation
- Billing integration

**Phase 7: Testing Strategy**
- Unit tests for all handlers
- Integration tests
- E2E test suite
- Load testing
- Security audit

**Phase 8: Monitoring & Observability**
- Grafana dashboards
- Alerting rules (PagerDuty, Slack)
- Log aggregation (Loki)
- Distributed tracing (Jaeger)

**Phase 9: Documentation**
- Agent navigation guide
- API documentation (OpenAPI/Swagger)
- Troubleshooting runbook
- Best practices guide

**Phase 10: Production Validation**
- Performance benchmarks
- Security penetration testing
- User acceptance testing
- Production readiness review

---

## Security Considerations

1. **Environment Variables:** Never commit `.env` to Git (already in `.gitignore`)
2. **JWT Secret:** Rotate every 90 days, minimum 32 characters
3. **Database Passwords:** Use strong passwords (32+ chars)
4. **API Tokens:** Rotate Cloudflare/GitHub tokens every 6 months
5. **Container Security:** Runs as non-root user `nodejs` (UID 1001)
6. **Network Isolation:** Uses dedicated Docker network `mcp-network`
7. **Logging:** Sensitive data (passwords, tokens) never logged

---

## Performance Tuning

### Current Configuration (MVP)

```yaml
Database Pools:
  Min Connections: 2
  Max Connections: 10
  Idle Timeout: 10s

Rate Limiting:
  Window: 60 seconds
  Max Requests: 100 per agent

Timeouts:
  Default: 30s
  DB Query: 10s
  HTTP Client: 30s
```

### Scale-Up for Production

Update `docker-compose.yml`:

```yaml
services:
  mcp-gateway:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    environment:
      DB_POOL_MAX: 20
      RATE_LIMIT_MAX_REQUESTS: 500
```

---

## Rollback Procedure

```bash
# Stop current deployment
docker compose down

# Restore previous version
docker tag mcp-gateway:1.0.0 mcp-gateway:rollback
docker compose up -d

# Or restore from Git
git checkout <previous-commit>
docker compose up -d --build
```

---

## Support & Resources

- **Documentation:** [`docs/`](docs/) directory
- **Architecture Details:** [`docs/architecture.md`](docs/architecture.md)
- **Server:** 138.201.139.25
- **Coolify:** http://coolify.ozean-licht.dev:8000

---

## License

MIT

---

## Changelog

### v1.0.0 (2025-10-22)
- ✅ Initial production release
- ✅ 8 MCP services implemented (5 server-side, 3 local references)
- ✅ Docker deployment tested and verified
- ✅ Complete environment configuration
- ✅ Prometheus metrics and health checks
- ✅ JWT authentication and rate limiting
- ✅ Production-ready container (221MB)

### v1.0.1 (2025-10-23)
- ✅ Localhost bypass authentication implemented (zero context pollution)
- ✅ **All 5 server-side MCPs tested and operational:**
  - PostgreSQL (both databases: kids-ascension-db, ozean-licht-db)
  - Cloudflare (zones, DNS, Stream with token cost tracking)
  - Mem0 (memory storage + vector search, 7.9s execution)
  - N8N (workflow automation)
  - GitHub (repository management via GitHub App authentication)
- ✅ Token cost tracking operational
- ✅ IPv4 localhost access verified
- ✅ Internal-only deployment (no public domain - security by design)
- ✅ GitHub private key formatting fixed (Coolify global env vars)

### v1.0.2 (2025-11-03)
- ✅ **MinIO MCP fully integrated** - S3-compatible object storage
  - Upload files with base64 encoding
  - List files with pagination support
  - Generate presigned URLs for secure access
  - Delete files and get metadata
  - Health check functionality
  - Support for video, image, PDF, and ZIP files
- ✅ Complete Coolify deployment configuration
- ✅ Environment variables properly configured for all services
- ✅ **Total: 9 MCP services operational** (6 server-side, 3 local references)
- ✅ Documentation updated with MinIO integration details

---

<!-- CONTEXT-MAP:START - Auto-generated navigation map. Edit the content, keep the markers. -->

## Navigation

> Last mapped: 2025-11-25

### Key Files

| File | Purpose |
|------|--------|
| `ecosystem.config.js` | Configuration |
| `jest.config.js` | Configuration |
| `query-storybook-docs.js` | _add description_ |
| `test-context7.js` | React context |

### Directories

| Directory | Purpose | Navigate |
|-----------|---------|----------|
| `src/` | Source code | [README](./src/) |
| `config/` | Configuration | [README](./config/) |
| `docs/` | Documentation | 4 files |
| `logs/` | _add description_ | 0 files |
| `monitoring/` | _add description_ | [README](./monitoring/) |
| `scripts/` | Build/utility scripts | 0 files |
| `tests/` | Test files | [README](./tests/) |
| `tools/` | _add description_ | [README](./tools/) |

<!-- CONTEXT-MAP:END -->