# Claude Code Hooks System

TypeScript-based hooks infrastructure for Claude Code agentic enhancement in the Ozean Licht Ecosystem.

## Overview

This hooks system provides automated validation, memory persistence, code review enforcement, and intelligent workflow orchestration by integrating with:

- 54+ progressive disclosure tools
- 15 slash commands
- 8 subagents
- MCP Gateway (8 services)
- Mem0 institutional memory system

## Features

- **Pre-execution validation**: Prevents errors before tool execution
- **Auto-memory saving**: Captures valuable patterns automatically
- **Context injection**: Adds relevant memories to user prompts
- **Service health checks**: Validates MCP Gateway and dependencies
- **Session management**: Lifecycle tracking and summaries
- **Pattern detection**: Recognizes deployments, errors, decisions, workflows
- **Git integration**: Blocks destructive operations on main branch
- **Security validation**: Detects exposed secrets and sensitive operations

## Architecture

```
/.claude/hooks/
├── src/
│   ├── handlers/           # Hook event handlers (7 hooks)
│   │   ├── pre-tool-use.ts       # Pre-execution validation
│   │   ├── post-tool-use.ts      # Pattern detection & learning
│   │   ├── stop.ts               # Memory persistence
│   │   ├── session-start.ts      # Environment setup
│   │   ├── session-end.ts        # Cleanup operations
│   │   ├── user-prompt-submit.ts # Context injection
│   │   └── pre-compact.ts        # Context preservation
│   ├── utils/             # Shared utilities
│   │   ├── logger.ts            # Structured logging (stderr only)
│   │   ├── mcp-client.ts        # MCP Gateway wrapper
│   │   ├── memory.ts            # Mem0 integration helpers
│   │   ├── git.ts               # Git operations
│   │   └── validation.ts        # Tool validation logic
│   ├── config/            # Configuration
│   │   ├── rules.ts             # Validation rules
│   │   └── patterns.ts          # Pattern templates
│   └── types/             # TypeScript types
│       └── index.ts             # Shared type definitions
├── tests/                 # Test suite
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── jest.config.js         # Test config
└── README.md              # This file

# Bash wrappers (executable)
├── pre-tool-use           # Calls src/handlers/pre-tool-use.ts
├── post-tool-use          # Calls src/handlers/post-tool-use.ts
├── stop                   # Calls src/handlers/stop.ts
├── session-start          # Calls src/handlers/session-start.ts
├── session-end            # Calls src/handlers/session-end.ts
├── user-prompt-submit     # Calls src/handlers/user-prompt-submit.ts
└── pre-compact            # Calls src/handlers/pre-compact.ts
```

## Installation

```bash
cd /.claude/hooks

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit configuration
nano .env
```

## Configuration

### Environment Variables (.env)

```bash
# MCP Gateway
MCP_GATEWAY_URL=http://localhost:8100
MCP_GATEWAY_TIMEOUT=5000

# Hook Settings
HOOK_TIMEOUT=60000
LOG_LEVEL=info                    # debug|info|warn|error
LOG_FORMAT=json                   # json|pretty

# Memory System
MEMORY_AUTO_SAVE=true
MEMORY_MIN_COMPLEXITY=medium      # low|medium|high
MEMORY_USER_ID=agent_claude_code

# Tool Catalog
TOOL_CATALOG_PATH=/opt/ozean-licht-ecosystem/tools/inventory/tool-catalog.json

# Validation
VALIDATION_ENABLED=true
VALIDATION_STRICT_MODE=false

# Git
GIT_REPO_PATH=/opt/ozean-licht-ecosystem
```

### Settings.json

Hook matchers are configured in `/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "/.claude/hooks/pre-tool-use"}]
      }
    ],
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [{"type": "command", "command": "/.claude/hooks/post-tool-use"}]
      }
    ]
  }
}
```

## Hook Handlers

### 1. PreToolUse

**Purpose**: Validate tool usage before execution
**Exit Codes**: 0 = allow, 2 = block, other = error

**Validations:**
- Tool exists in catalog and is active
- MCP Gateway available (for MCP tools)
- Dependencies met
- No destructive operations on main branch
- No exposed secrets in commands
- No sensitive path operations

**Example Output:**
```json
{
  "continue": false,
  "stopReason": "Tool validation failed",
  "contextMessage": "## Validation Failed\n\n**Blockers:**\n- Force push to main branch is not allowed\n\n**Suggestions:**\n- Create a feature branch for this operation"
}
```

### 2. PostToolUse

**Purpose**: Detect patterns and auto-save learnings

**Patterns Detected:**
- Successful deployments
- Error resolutions
- Database operations
- Git workflows
- Performance optimizations
- Security fixes

**Auto-Save Criteria:**
- Pattern complexity ≥ threshold (default: medium)
- Category: pattern, decision, solution, error, workflow
- No duplicate detection (similarity score < 0.95)

### 3. Stop

**Purpose**: Save session insights when conversation stops

**Behavior:**
- Extracts context from conversation
- Categorizes insights automatically
- Saves to Mem0 with metadata
- Generates session summary

### 4. SessionStart

**Purpose**: Initialize session and check services

**Health Checks:**
- MCP Gateway availability
- Git repository status
- Environment configuration

**Context Injection:**
- Service status summary
- Unhealthy service warnings
- Session ID and timestamp

### 5. SessionEnd

**Purpose**: Generate session summary and cleanup

**Output:**
- Session duration
- Metadata summary
- Completion timestamp

### 6. UserPromptSubmit

**Purpose**: Inject relevant context from memory

**Process:**
1. Extract keywords from user prompt
2. Search Mem0 for relevant memories (top 3)
3. Format memories as markdown context
4. Inject into conversation

**Example Context:**
```markdown
## Relevant Memories

1. [decision] Use TypeScript for all new projects (relevance: 92%)

2. [pattern] Connection pooling prevents timeout errors (relevance: 87%)

3. [workflow] Deploy → Health Check → Monitor (relevance: 84%)
```

### 7. PreCompact

**Purpose**: Identify critical information to preserve

**Preserved Items:**
- Error messages and resolutions
- Deployment confirmations
- Architecture decisions
- File paths and URLs
- Action items (TODO, FIXME, NOTE)

## Usage Examples

### Testing Individual Hooks

```bash
# Test PreToolUse with sample input
echo '{"tool":"Bash","args":{"command":"ls -la"}}' | /.claude/hooks/pre-tool-use

# Test PostToolUse with deployment result
echo '{"tool":"coolify","result":{"status":"success"}}' | /.claude/hooks/post-tool-use

# Test SessionStart
echo '{"sessionId":"test-123"}' | /.claude/hooks/session-start

# Test UserPromptSubmit
echo '{"prompt":"How do I deploy the admin dashboard?"}' | /.claude/hooks/user-prompt-submit
```

### Development Mode

```bash
# Run with verbose logging
LOG_LEVEL=debug LOG_FORMAT=pretty /.claude/hooks/pre-tool-use

# Disable auto-save temporarily
MEMORY_AUTO_SAVE=false /.claude/hooks/post-tool-use
```

## Development

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Type Checking

```bash
# Check types
npm run type-check

# Build TypeScript
npm run build
```

### Linting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Validation Rules

### Security Rules

- **no-exposed-secrets**: Detect API keys, passwords, tokens in commands
- **no-sensitive-paths**: Warn about /etc/, .ssh, .env file operations

### Safety Rules

- **no-destructive-on-main**: Block `git push --force`, `rm -rf` on main
- **no-force-push-main**: Prevent force push to main/master branch

### Performance Rules

- **large-file-warning**: Warn about operations on large files (.mp4, .sql, etc.)

### Best Practice Rules

- **prefer-mcp-for-database**: Suggest MCP over direct psql commands
- **prefer-script-tools**: Suggest progressive disclosure tools over raw commands

## Pattern Templates

### Deployment Pattern
- **Category**: workflow
- **Priority**: 10
- **Auto-save**: Yes
- **Matcher**: Tool includes "deploy" or "coolify" + successful result

### Error Resolution Pattern
- **Category**: solution
- **Priority**: 9
- **Auto-save**: Yes
- **Matcher**: Has error + has result (error was resolved)

### Architecture Decision Pattern
- **Category**: decision
- **Priority**: 8
- **Auto-save**: Yes
- **Matcher**: Content includes "architecture", "design decision", "chose"

### Security Fix Pattern
- **Category**: solution
- **Priority**: 10
- **Auto-save**: Yes
- **Matcher**: Content includes "security", "vulnerability", "exploit"

## Troubleshooting

### Hook Not Executing

1. Check file permissions:
```bash
ls -la /.claude/hooks/ | grep -E '^-rwxr'
```

2. Verify settings.json syntax:
```bash
cat /.claude/settings.json | jq '.'
```

3. Test hook manually:
```bash
echo '{}' | /.claude/hooks/session-start
```

### MCP Gateway Unavailable

1. Check service status:
```bash
bash tools/containers/ps.sh | grep mcp-gateway
```

2. View logs:
```bash
bash tools/containers/logs.sh mcp-gateway 100
```

3. Restart service:
```bash
bash tools/containers/restart.sh mcp-gateway
```

### Memory Not Saving

1. Check auto-save setting:
```bash
grep MEMORY_AUTO_SAVE /.claude/hooks/.env
```

2. Test Mem0 connection:
```bash
bash tools/memory/health.sh
```

3. Check complexity threshold:
```bash
# Lower threshold temporarily
MEMORY_MIN_COMPLEXITY=low /.claude/hooks/post-tool-use
```

### Type Errors

1. Rebuild TypeScript:
```bash
cd /.claude/hooks && npm run build
```

2. Check tsconfig.json paths
3. Verify all dependencies installed:
```bash
npm install
```

## Performance

- **Hook Execution Time**: Target < 5s (typically 1-2s)
- **MCP Gateway Timeout**: 5s (configurable)
- **Tool Catalog Caching**: 5 minutes TTL
- **Retry Logic**: 3 attempts with exponential backoff

## Security

- **Input Sanitization**: All stdin validated with Zod schemas
- **No Secret Logging**: Sensitive data never logged
- **Stderr Only**: Logs to stderr, stdout for JSON only
- **Environment Variables**: Secrets via .env (never committed)

## Integration Points

### Tool Catalog
- Path: `tools/inventory/tool-catalog.json`
- Used by: Validation utility
- Cache: 5-minute TTL

### MCP Gateway
- Endpoint: http://localhost:8100
- Client: `src/utils/mcp-client.ts`
- Services: postgres, mem0, coolify, github, n8n, minio, cloudflare, firecrawl

### Memory System
- Service: Mem0 (via MCP Gateway)
- User ID: `agent_claude_code`
- Operations: remember, search, get-context

### Git Repository
- Path: `/opt/ozean-licht-ecosystem`
- Operations: status, branch, commits, validation

## Phase 1 Support

This hooks system supports the Phase 1 admin dashboard deployment workflow:

- **Pre-deployment validation**: Check Coolify availability
- **Auto-save successful deployments**: Build deployment memory
- **Health check automation**: Verify services post-deploy
- **Error tracking**: Log and categorize deployment errors

## Future Enhancements

- Prompt hooks (LLM-based decisions)
- Notification integration (Slack, email)
- Dashboard for hook metrics
- A/B testing framework for rules
- ML-based pattern detection

## Contributing

1. Write tests for new features
2. Follow existing TypeScript patterns
3. Update documentation
4. Run type check and tests before commit

## License

MIT

## Contact

Ozean Licht Infrastructure Team
