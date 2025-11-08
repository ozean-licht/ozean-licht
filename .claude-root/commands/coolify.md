# Coolify Management

**Purpose**: Manage Coolify infrastructure - applications, databases, servers, and deployments.

**MCP Server**: `@joshuarileydev/coolify-mcp-server`
**API**: http://localhost:8000
**Authentication**: Token-based (configured in .mcp.json)

## Usage

```bash
# List all applications
/coolify list-applications

# Deploy an application
/coolify deploy <application-id>

# Restart an application
/coolify restart <application-id>

# Get application details
/coolify get <application-id>

# Stop/start application
/coolify stop <application-id>
/coolify start <application-id>

# List other resources
/coolify list-databases
/coolify list-servers
/coolify list-projects
/coolify list-services

# Get Coolify version
/coolify version
```

## Available Tools

### Applications
- `list_applications` - List all applications with status, domains, and metadata
- `get_application` - Get detailed information about specific application
- `deploy_application` - Trigger deployment for an application (pulls latest code)
- `start_application` - Start a stopped application
- `stop_application` - Stop a running application
- `restart_application` - Restart an application (stop → start)

### Databases
- `list_databases` - List all databases with connection info
- `create_database` - Create new database instance

### Servers
- `list_servers` - List all connected servers
- `create_server` - Add new server to Coolify
- `validate_server` - Test server connection

### Projects & Services
- `list_projects` - List all projects
- `create_project` - Create new project
- `list_services` - List all services
- `start_service` - Start a service
- `stop_service` - Stop a service

### System
- `get_version` - Get Coolify version information

## Common Tasks

### Deploy MCP Gateway
```bash
# Find application ID
/coolify list-applications

# Deploy (pulls latest git changes)
/coolify deploy 3
```

### Check Application Status
```bash
# Get full details including env vars, domains, git config
/coolify get 3
```

### Restart After Configuration Change
```bash
# Restart without redeploying
/coolify restart 3
```

## MCP Configuration

The Coolify MCP server is configured in `tools/.mcp.json`:
```json
{
  "coolify": {
    "command": "node",
    "args": [".../coolify-mcp-server/dist/index.js"],
    "env": {
      "COOLIFY_API_URL": "http://localhost:8000",
      "COOLIFY_API_TOKEN": "1|nN3hZvk..."
    }
  }
}
```

## Response Format

All commands return structured data:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}
```

## Error Handling

Common errors:
- **401 Unauthorized**: API token invalid or expired
- **404 Not Found**: Application/resource ID doesn't exist
- **500 Server Error**: Coolify server issue

## Notes

- Application IDs are numeric (e.g., 3 for mcp-gateway)
- Deployments pull latest code from configured git repository
- Restarts don't pull new code, just restart the container
- Some operations require specific permissions on API token
