# MCP Gateway

A unified gateway for autonomous agents to access tools and services through the Model Context Protocol (MCP).

## Overview

The MCP Gateway provides a standardized interface for agents to interact with various backend services through slash commands. It handles authentication, rate limiting, protocol translation, and service orchestration.

## Features

- **Unified Interface**: Single endpoint for all MCP services
- **Slash Command Support**: Intuitive `/mcp-[service]` command format
- **JSON-RPC 2.0**: Standard protocol implementation
- **Authentication**: JWT-based agent authentication
- **Rate Limiting**: Per-agent and per-service limits
- **Metrics & Monitoring**: Prometheus metrics and health checks
- **Service Registry**: Dynamic service registration and discovery
- **Token Tracking**: Usage and cost tracking per operation

## Architecture

```
Agent → Slash Command → Gateway → MCP Handler → Service
                          ↓
                    Authentication
                    Rate Limiting
                    Metrics
```

## Supported Services

### Server-Side MCPs (Always Loaded)
- **PostgreSQL** - Database operations for Kids Ascension and Ozean Licht
- **Mem0** - Persistent memory and context management
- **Cloudflare** - CDN, DNS, and Stream video management
- **GitHub** - Repository and code management
- **N8N** - Workflow automation

### Local MCPs (Agent-Side)
- **Playwright** - Browser automation
- **ShadCN** - UI component library
- **MagicUI** - Enhanced UI components
- **Taskmaster** - Task orchestration

## Quick Start

### Prerequisites
- Node.js v20 or higher
- PostgreSQL databases configured
- Required API tokens (Cloudflare, GitHub, etc.)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Check linting
npm run lint
```

### Production

```bash
# Build the project
npm run build

# Start with PM2
npm run start:pm2

# Or with Node directly
npm start
```

### Docker

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run
```

## Usage Examples

### Slash Commands

```bash
# PostgreSQL operations
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
/mcp-cloudflare workers deploy api-gateway

# GitHub operations
/mcp-github create-pr "feat: Add MCP Gateway" "Description"
/mcp-github list-issues --label=bug
/mcp-github merge-pr 123

# N8N workflow operations
/mcp-n8n execute workflow_123 {"data": "payload"}
/mcp-n8n list-workflows
/mcp-n8n get-execution exec_456
```

### JSON-RPC API

```bash
# Execute MCP command
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

# List available services
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.listServices",
    "id": "unique-request-id"
  }'
```

## API Endpoints

- `POST /mcp/execute` - Execute slash commands
- `POST /mcp/rpc` - JSON-RPC interface
- `GET /mcp/catalog` - List all services and capabilities
- `GET /mcp/service/:name` - Get service details
- `GET /health` - Basic health check
- `GET /ready` - Readiness check with dependencies
- `GET /metrics` - Prometheus metrics (port 9090)

## Configuration

### Environment Variables

See `.env.example` for all configuration options. Key variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 8100)
- `JWT_SECRET` - Secret for JWT signing (min 32 chars)
- `POSTGRES_*` - Database connection settings
- `CLOUDFLARE_*` - Cloudflare API credentials
- `GITHUB_*` - GitHub App credentials
- `RATE_LIMIT_*` - Rate limiting configuration

### Service Configuration

Services are configured in `config/mcp-catalog.json` with:
- Capabilities and commands
- Token costs and complexity ratings
- Rate limits per service

## Authentication

Agents authenticate using JWT tokens:

```javascript
// Generate token for agent
const token = generateToken('agent-001', 'My Agent', ['*']);

// Use in requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Monitoring

### Health Checks
- `/health` - Simple liveness check
- `/ready` - Detailed readiness with dependency status

### Metrics
Prometheus metrics available at port 9090:
- Request duration and count
- MCP operation metrics
- Token usage tracking
- Connection pool stats
- Error rates

### Logging
Structured logging with Winston:
- JSON format in production
- Pretty format in development
- Log levels: error, warn, info, debug

## Development

### Project Structure
```
mcp-gateway/
├── src/
│   ├── server.ts           # Main server
│   ├── router/             # Request routing
│   ├── mcp/               # MCP protocol & handlers
│   │   ├── handlers/      # Service-specific handlers
│   │   ├── protocol/      # Protocol types
│   │   └── registry.ts    # Service registry
│   ├── auth/              # Authentication & rate limiting
│   ├── monitoring/        # Health & metrics
│   └── utils/            # Utilities
├── config/               # Configuration files
├── tests/               # Test files
└── docs/               # Documentation
```

### Adding New Services

1. Create handler in `src/mcp/handlers/[service].ts`
2. Add to catalog in `config/mcp-catalog.json`
3. Register in `src/mcp/initialize.ts`
4. Add tests in `tests/[service].test.ts`
5. Update documentation

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Test specific service
npm test -- postgres
```

## Deployment

### Coolify Deployment

The gateway is designed to be deployed with Coolify:

1. Push to repository
2. Coolify auto-deploys on main branch
3. Environment variables configured in Coolify
4. Health checks monitor service status

### Production Checklist

- [ ] Set strong JWT_SECRET (min 32 chars)
- [ ] Configure all service credentials
- [ ] Enable SSL/TLS (via Coolify/Traefik)
- [ ] Set up monitoring dashboards
- [ ] Configure log aggregation
- [ ] Test all service connections
- [ ] Verify rate limits
- [ ] Set up backups

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Check service URLs in `.env`
   - Verify services are running
   - Check network connectivity

2. **Authentication errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure Bearer format

3. **Rate limit exceeded**
   - Adjust RATE_LIMIT_* settings
   - Check per-service limits
   - Monitor usage patterns

4. **Database connection issues**
   - Verify credentials
   - Check connection pool settings
   - Monitor pool metrics

## License

MIT

## Support

For issues or questions:
- Check `docs/` directory
- Review setup checklist
- Contact infrastructure team