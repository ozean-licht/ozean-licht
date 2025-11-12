# AI Developer Workflow (ADW) System - TypeScript Edition

ADW automates software development using isolated git worktrees and the Claude Agent SDK. Each workflow runs in a separate worktree with dedicated ports and filesystem isolation, enabling up to 15 concurrent agents. The system is built with TypeScript, PostgreSQL state management, and real-time WebSocket streaming.

## Key Concepts

### Isolated Execution
Every ADW workflow runs in an isolated git worktree under `trees/<adw_id>/` with:
- Complete filesystem isolation
- Dedicated port ranges (backend: 9100-9114, frontend: 9200-9214)
- Independent git branches
- Support for 15 concurrent instances

### ADW ID
Each workflow run is assigned a unique 8-character identifier (e.g., `a1b2c3d4`). This ID:
- Tracks all phases of a workflow (plan → build → test → review → document)
- Appears in GitHub comments, commits, and PR titles
- Creates an isolated worktree at `trees/{adw_id}/`
- Allocates unique ports deterministically
- Enables resuming workflows and debugging

### State Management
ADW uses PostgreSQL for persistent state management via `adw_workflows` table:
- Share data between workflow phases
- Track worktree locations and port assignments
- Enable workflow composition and chaining
- Real-time updates via WebSocket streaming
- Track essential workflow data:
  - `adw_id`: Unique workflow identifier
  - `issue_number`: GitHub issue being processed
  - `branch_name`: Git branch for changes
  - `plan_file`: Path to implementation plan
  - `issue_class`: Issue type (`/chore`, `/bug`, `/feature`)
  - `worktree_path`: Absolute path to isolated worktree
  - `backend_port`: Allocated backend port (9100-9114)
  - `frontend_port`: Allocated frontend port (9200-9214)
  - `current_phase`: Current execution phase
  - `status`: Workflow status (pending, running, completed, failed)

## Quick Start

### 1. Environment Setup

The ADW system runs as a TypeScript service integrated with the Orchestrator:

```bash
# Required environment variables (apps/orchestrator_ts/.env)
NODE_ENV=development
PORT=8003
DATABASE_URL=postgresql://user:password@localhost:5432/orchestrator_db

# Core APIs
ANTHROPIC_API_KEY=sk-ant-xxxxx
GITHUB_TOKEN=ghp_xxxxx
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo

# ADW Configuration
ADW_WORKING_DIR=/opt/ozean-licht-ecosystem
ADW_BACKEND_PORT_START=9100
ADW_FRONTEND_PORT_START=9200
ADW_MAX_CONCURRENT_WORKFLOWS=15

# MCP Gateway (optional)
MCP_GATEWAY_URL=http://localhost:8100

# Cloudflare R2 (optional)
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET=ozean-ecosystem
```

### 2. Installation

```bash
cd apps/orchestrator_ts

# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev

# Service runs on http://localhost:8003
```

### 3. Using the ADW API

The ADW system exposes HTTP endpoints for workflow management:

```bash
# Create a new workflow from a GitHub issue
curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "issueNumber": 123,
    "workflowType": "plan-build",
    "modelSet": "base"
  }'

# Execute a specific phase
curl -X POST http://localhost:8003/api/adw/workflows/{adw_id}/execute \
  -H "Content-Type: application/json" \
  -d '{
    "phase": "build"
  }'

# Get workflow status
curl http://localhost:8003/api/adw/workflows/{adw_id}

# List all active workflows
curl http://localhost:8003/api/adw/workflows

# Cancel a workflow
curl -X DELETE http://localhost:8003/api/adw/workflows/{adw_id}

# GitHub webhook endpoint (automatic triggers)
# Configure in GitHub: POST http://your-domain:8003/api/webhooks/github
```

### 4. Using the Orchestrator Chat Interface

For natural language workflow management:

```bash
# Send message to orchestrator
curl -X POST http://localhost:8003/api/orchestrator/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a workflow for issue #123 and execute plan phase"
  }'

# Get chat history
curl http://localhost:8003/api/orchestrator/history

# Get session metrics
curl http://localhost:8003/api/orchestrator/metrics

# Clear chat history
curl -X DELETE http://localhost:8003/api/orchestrator/history
```

## ADW Architecture

### Workflow Phases

Each workflow phase is executed via the Agent SDK with worktree isolation:

#### 1. Plan Phase
**Creates worktree and generates implementation plan**
- Fetches GitHub issue details and classifies type (`/chore`, `/bug`, `/feature`)
- Creates isolated git worktree at `trees/<adw_id>/`
- Allocates unique ports (backend: 9100-9114, frontend: 9200-9214)
- Uses `/classify_issue` and `/plan` slash commands via Agent SDK
- Generates implementation spec in `specs/` directory
- Commits plan and creates/updates pull request
- Updates PostgreSQL workflow state

#### 2. Build Phase
**Implements solution using Agent SDK**
- Validates worktree exists and switches to correct branch
- Locates plan file from workflow state
- Uses `/implement` slash command with plan context
- Agent SDK executes in worktree with streaming progress
- Commits changes and pushes to feature branch
- Updates workflow state with build completion

#### 3. Test Phase
**Runs tests with port isolation**
- Validates worktree and allocated ports
- Uses `/test` slash command in worktree context
- Runs unit tests, integration tests, optionally E2E
- Auto-resolves failures via Agent SDK retry logic
- Commits test results and updates state

#### 4. Review Phase
**Reviews implementation against spec**
- Uses `/review` slash command with spec reference
- Validates against original plan in isolated environment
- Captures screenshots using allocated ports (Playwright)
- Uploads screenshots to Cloudflare R2
- Auto-resolves blockers if configured
- Updates workflow state with review completion

#### 5. Document Phase
**Generates comprehensive documentation**
- Analyzes git diff and implementation changes
- Uses `/document` slash command
- Generates feature documentation in `app_docs/`
- Includes technical guide, overview, and screenshots
- Commits documentation to worktree

#### 6. Ship Phase
**Approves and merges PR**
- Validates all workflow state fields populated
- Verifies worktree exists and PR is ready
- Approves PR via GitHub API
- Merges to main using squash method
- Cleans up worktree (optional)
- Marks workflow as completed in PostgreSQL

### Workflow Types

Execute phases via `workflowType` parameter:

- **`plan`** - Planning only
- **`plan-build`** - Plan + Build
- **`plan-build-test`** - Plan + Build + Test
- **`plan-build-review`** - Plan + Build + Review
- **`plan-build-test-review`** - Plan + Build + Test + Review
- **`sdlc`** - Complete SDLC (all phases)
- **`zte`** - Zero Touch Execution (SDLC + auto-ship)

### TypeScript Module Structure

```
apps/orchestrator_ts/src/
├── modules/adw/
│   ├── agent-executor.ts       # Agent SDK integration with retry logic
│   ├── state-manager.ts         # PostgreSQL state management
│   ├── workflow-manager.ts      # Orchestrates all workflow phases
│   ├── worktree-manager.ts      # Git worktree creation and cleanup
│   ├── git-operations.ts        # Git commands via simple-git
│   ├── github-integration.ts    # GitHub API operations
│   ├── types.ts                 # TypeScript types + Zod schemas
│   └── utils.ts                 # Utility functions
│
├── tools/
│   └── adw-mcp-tools.ts         # MCP tools for orchestrator
│
├── routes/
│   ├── adw.ts                   # ADW HTTP API endpoints
│   ├── orchestrator.ts          # Orchestrator chat API
│   └── webhooks.ts              # GitHub webhook handler
│
├── services/
│   └── orchestrator-service.ts  # Unified orchestrator with ADW tools
│
└── database/queries/
    ├── adw.ts                   # ADW workflow queries
    └── orchestrator.ts          # Orchestrator chat queries
```

### GitHub Webhook Integration

The system automatically processes GitHub events:

**Supported Triggers:**
- New issues created (automatic workflow initiation)
- Comments with "adw" keyword (manual trigger)
- Issue labels for workflow type selection

**Webhook Configuration:**
```bash
# GitHub webhook settings
URL: https://your-domain.com/api/webhooks/github
Content type: application/json
Events: Issues, Issue comments
Secret: Set GITHUB_WEBHOOK_SECRET environment variable
```

**Workflow Selection:**
- Include `workflow: plan-build` in issue body
- Or use labels: `adw:sdlc`, `adw:zte`, etc.
- Defaults to `plan-build` if not specified

## How ADW Works

### 1. Workflow Creation
- HTTP API or GitHub webhook receives issue number
- System fetches issue details from GitHub API
- Classifies issue type using `/classify_issue` slash command
- Creates database record in `adw_workflows` table
- Generates unique `adw_id` (8-character hash)
- Returns workflow ID to caller

### 2. Worktree Initialization
- Creates isolated git worktree at `trees/{adw_id}/`
- Allocates unique ports deterministically (hash-based)
- Creates feature branch: `{type}-{issue}-{adw_id}-{slug}`
- Copies `.env` file to worktree
- Creates `.ports.env` with allocated ports
- Updates PostgreSQL with worktree path and ports

### 3. Phase Execution
- Each phase executed via Agent SDK `query()` method
- Slash commands loaded from `.claude/commands/`
- Agent operates in worktree context (cwd parameter)
- Real-time progress streamed via WebSocket
- Database updated after each phase completion
- Errors trigger auto-retry with exponential backoff

### 4. State Management
- PostgreSQL stores all workflow state
- WebSocket broadcasts state changes
- Frontend receives real-time updates
- State includes: current_phase, status, ports, worktree_path
- Event history tracked in `adw_workflow_events` table

### 5. Integration & Deployment
- Commits created via simple-git in worktree
- Pull requests managed via @octokit/rest
- PR auto-linked to original issue
- Optional auto-merge for ZTE workflows
- Worktree cleanup after merge

## Common Usage Scenarios

### Via HTTP API

**Create and execute workflow:**
```bash
# Create workflow
WORKFLOW_ID=$(curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{"issueNumber": 789, "workflowType": "plan-build"}' \
  | jq -r '.workflow.adw_id')

# Execute plan phase
curl -X POST http://localhost:8003/api/adw/workflows/$WORKFLOW_ID/execute \
  -H "Content-Type: application/json" \
  -d '{"phase": "plan"}'

# Execute build phase
curl -X POST http://localhost:8003/api/adw/workflows/$WORKFLOW_ID/execute \
  -H "Content-Type: application/json" \
  -d '{"phase": "build"}'
```

**Run complete SDLC:**
```bash
curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "issueNumber": 789,
    "workflowType": "sdlc",
    "modelSet": "base"
  }'
```

**Multiple concurrent workflows:**
```bash
# Process three issues simultaneously
curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{"issueNumber": 101, "workflowType": "plan-build"}' &

curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{"issueNumber": 102, "workflowType": "plan-build"}' &

curl -X POST http://localhost:8003/api/adw/workflows \
  -H "Content-Type: application/json" \
  -d '{"issueNumber": 103, "workflowType": "plan-build"}' &

# Each workflow gets its own worktree and ports
```

### Via Orchestrator Chat

**Natural language workflow management:**
```bash
# Create and execute workflow
curl -X POST http://localhost:8003/api/orchestrator/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a complete SDLC workflow for issue #789 using heavy model set"
  }'

# Check workflow status
curl -X POST http://localhost:8003/api/orchestrator/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the status of workflow abc12345?"
  }'

# List active workflows
curl -X POST http://localhost:8003/api/orchestrator/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me all active ADW workflows"
  }'
```

### Via GitHub Webhook

**Automatic workflow triggers:**

Include workflow type in GitHub issue body:
```
Title: Add export functionality
Body: Please add the ability to export data to CSV.

workflow: plan-build-test-review
model_set: base
```

**Or use labels:**
- `adw:plan-build` - Plan + Build
- `adw:sdlc` - Complete SDLC
- `adw:zte` - Zero Touch Execution (auto-merge)

**Comment trigger:**
Comment "adw" on any issue to trigger default workflow (plan-build)

## Worktree Architecture

### Worktree Structure

```
trees/
├── abc12345/              # Complete repo copy for ADW abc12345
│   ├── .git/              # Worktree git directory
│   ├── .env               # Copied from main repo
│   ├── .ports.env         # Port configuration (BACKEND_PORT, FRONTEND_PORT)
│   ├── apps/              # Application code
│   ├── specs/             # Generated plan specs
│   └── ...
└── def67890/              # Another isolated instance
    └── ...

# State stored in PostgreSQL (adw_workflows table)
# No local JSON files - all state in database
```

### Port Allocation

Each isolated instance gets unique ports:
- Backend: 9100-9114 (15 ports)
- Frontend: 9200-9214 (15 ports)
- Deterministic assignment based on ADW ID hash
- Automatic fallback if preferred ports are busy

**Port Assignment Algorithm:**
```typescript
function getPortsForAdw(adwId: string): { backendPort: number; frontendPort: number } {
  // Deterministically assign ports based on ADW ID
  const index = parseInt(adwId.substring(0, 8), 36) % 15;
  const backendPort = 9100 + index;
  const frontendPort = 9200 + index;
  return { backendPort, frontendPort };
}
```

**Example Allocations:**
```
ADW abc12345: Backend 9107, Frontend 9207
ADW def67890: Backend 9103, Frontend 9203
```

### Benefits of Isolated Workflows

1. **Parallel Execution**: Run up to 15 ADWs simultaneously
2. **No Interference**: Each instance has its own:
   - Git worktree and branch
   - Filesystem (complete repo copy)
   - Backend and frontend ports
   - Environment configuration
3. **Clean Isolation**: Changes in one instance don't affect others
4. **Easy Cleanup**: Remove worktree to clean everything
5. **Better Debugging**: Isolated environment for troubleshooting
6. **Experiment Safely**: Test changes without affecting main repo

### Cleanup and Maintenance

Worktrees persist until manually removed:

```bash
# Remove specific worktree
git worktree remove trees/abc12345

# List all worktrees
git worktree list

# Clean up worktrees (removes invalid entries)
git worktree prune

# Remove worktree directory if git doesn't know about it
rm -rf trees/abc12345
```

**Best Practices:**
- Remove worktrees after PR merge
- Monitor disk usage (each worktree is a full repo copy)
- Use `git worktree prune` periodically
- Consider automation for cleanup after 7 days

## Troubleshooting

### Environment Issues
```bash
# Check required variables
env | grep -E "(GITHUB|ANTHROPIC|CLAUDE)"

# Verify GitHub auth
gh auth status

# Test Claude Code
claude --version
```

### Common Errors

**"No worktree found"**
```bash
# Check if worktree exists
git worktree list
# Run an entry point workflow first
uv run adw_plan_iso.py <issue-number>
```

**"Port already in use"**
```bash
# Check what's using the port
lsof -i :9107
# Kill the process or let ADW find alternative ports
```

**"Worktree validation failed"**
```bash
# Check worktree state
cat agents/<adw-id>/adw_state.json | jq .worktree_path
# Verify directory exists
ls -la trees/<adw-id>/
```

**"Agent execution failed"**
```bash
# Check agent output in worktree
cat trees/<adw-id>/agents/*/planner/raw_output.jsonl | tail -1 | jq .
```

### Debug Mode
```bash
export ADW_DEBUG=true
uv run adw_plan_build_iso.py 123  # Verbose output
```

## Configuration

### ADW Tracking
Each workflow run gets a unique 8-character ID (e.g., `a1b2c3d4`) that appears in:
- Issue comments: `a1b2c3d4_ops: ✅ Starting ADW workflow`
- Output files: `agents/a1b2c3d4/sdlc_planner/raw_output.jsonl`
- Git commits and PRs

### Model Selection

ADW supports dynamic model selection based on workflow complexity. Users can specify whether to use a "base" model set (optimized for speed and cost) or a "heavy" model set (optimized for complex tasks).

#### How to Specify Model Set

Include `model_set base` or `model_set heavy` in your GitHub issue or comment:

```
Title: Add export functionality  
Body: Please add the ability to export data to CSV.
Include workflow: adw_plan_build_iso model_set heavy
```

If not specified, the system defaults to "base".

#### Model Mapping

Each slash command has a configured model for both base and heavy sets:

```python
SLASH_COMMAND_MODEL_MAP = {
    "/implement": {"base": "sonnet", "heavy": "opus"},
    "/review": {"base": "sonnet", "heavy": "opus"},
    "/classify_issue": {"base": "sonnet", "heavy": "sonnet"},
    # ... etc
}
```

#### Commands Using Opus in Heavy Mode

The following commands switch to Opus when using the heavy model set:
- `/implement` - Complex implementation tasks
- `/resolve_failed_test` - Debugging test failures
- `/resolve_failed_e2e_test` - Debugging E2E test failures
- `/document` - Documentation generation
- `/chore`, `/bug`, `/feature` - Issue-specific implementations
- `/patch` - Creating patches for changes

#### Model Selection Flow

1. User triggers workflow with optional `model_set` parameter
2. ADW extracts and stores model_set in state (defaults to "base")
3. Each slash command execution:
   - Loads state to get model_set
   - Looks up appropriate model from SLASH_COMMAND_MODEL_MAP
   - Executes with selected model

#### Testing Model Selection

```bash
python adws/adw_tests/test_model_selection.py
```

This verifies:
- All commands have both base and heavy mappings
- Model selection logic works correctly
- State persistence includes model_set
- Default behavior when no state exists

### Modular Architecture
The system uses a modular TypeScript architecture:

- **State Management**: PostgreSQL via Prisma ORM
- **Worktree Operations**: `worktree-manager.ts` - Git worktree CRUD
- **Git Operations**: `git-operations.ts` - simple-git integration
- **Workflow Operations**: `workflow-manager.ts` - Phase orchestration
- **Agent Integration**: `agent-executor.ts` - Agent SDK with retry logic
- **GitHub Integration**: `github-integration.ts` - @octokit/rest
- **WebSocket Streaming**: Real-time progress updates
- **MCP Tools**: `adw-mcp-tools.ts` - Orchestrator integration

### Database Schema

**adw_workflows table:**
```sql
CREATE TABLE adw_workflows (
  id SERIAL PRIMARY KEY,
  adw_id VARCHAR(8) UNIQUE NOT NULL,
  issue_number INTEGER NOT NULL,
  workflow_type VARCHAR(50) NOT NULL,
  current_phase VARCHAR(50),
  status VARCHAR(20) NOT NULL,
  branch_name VARCHAR(255),
  worktree_path VARCHAR(500),
  backend_port INTEGER,
  frontend_port INTEGER,
  plan_file VARCHAR(500),
  issue_class VARCHAR(50),
  model_set VARCHAR(20) DEFAULT 'base',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**adw_workflow_events table:**
```sql
CREATE TABLE adw_workflow_events (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER REFERENCES adw_workflows(id),
  event_type VARCHAR(50) NOT NULL,
  phase VARCHAR(50),
  message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Workflow Output Structure

```
trees/{adw_id}/                  # Worktree directory
├── specs/
│   └── {adw_id}_plan_spec.md   # Implementation plan
├── app_docs/                    # Generated documentation
│   └── features/{feature}/
│       ├── overview.md
│       ├── technical-guide.md
│       └── images/
└── .ports.env                   # Port configuration

# State in PostgreSQL (not local files)
# Agent output streamed via WebSocket
# Screenshots uploaded to Cloudflare R2
```

## Security Best Practices

- Store tokens as environment variables, never in code
- Use GitHub fine-grained tokens with minimal permissions
- Set up branch protection rules
- Require PR reviews for ADW changes
- Monitor API usage and set billing alerts
- Validate webhook signatures from GitHub
- Use connection pooling for PostgreSQL
- Sanitize all user inputs (issue numbers, workflow IDs)

## Technical Details

### Technology Stack

**Core:**
- TypeScript 5.3+
- Node.js 18+
- PostgreSQL 15+
- Fastify (HTTP server)
- WebSocket (real-time updates)

**Libraries:**
- `@anthropic-ai/claude-agent-sdk` - Agent SDK integration
- `@octokit/rest` - GitHub API client
- `@prisma/client` - Database ORM
- `simple-git` - Git operations
- `zod` - Runtime validation
- `@aws-sdk/client-s3` - Cloudflare R2 uploads

**Infrastructure:**
- Coolify (deployment)
- PostgreSQL (state management)
- Cloudflare R2 (screenshot storage)
- Grafana (monitoring)

### API Endpoints

**ADW Workflows:**
- `POST /api/adw/workflows` - Create workflow
- `POST /api/adw/workflows/:id/execute` - Execute phase
- `GET /api/adw/workflows/:id` - Get status
- `GET /api/adw/workflows` - List workflows
- `DELETE /api/adw/workflows/:id` - Cancel workflow

**Orchestrator Chat:**
- `POST /api/orchestrator/chat` - Send message
- `GET /api/orchestrator/history` - Get history
- `DELETE /api/orchestrator/history` - Clear history
- `GET /api/orchestrator/metrics` - Session metrics

**Webhooks:**
- `POST /api/webhooks/github` - GitHub events

### Branch Naming Convention
```
{type}-{issue_number}-{adw_id}-{slug}
```
Example: `feat-456-abc12345-add-user-authentication`

- `type`: chore, bug, or feat
- `issue_number`: GitHub issue number
- `adw_id`: 8-character workflow ID
- `slug`: Slugified issue title

## Migration Status & Next Steps

### Current State (58% Complete)
- ✅ PostgreSQL database schema (`adw_workflows`, `adw_workflow_events`)
- ✅ Core TypeScript modules (state, worktree, git, github, agent executor)
- ✅ HTTP API endpoints for workflow management
- ✅ WebSocket streaming for real-time updates
- ✅ MCP tools for orchestrator integration
- ✅ Orchestrator chat service
- ⏳ Integration testing (pending)
- ⏳ Production deployment (pending)
- ⏳ Frontend UI components (pending)

### Specifications Needed

To complete the migration, the following specs should be created in `/adws/specs/`:

1. **`phase-implementation-spec.md`** - Complete implementation of all 6 workflow phases (plan, build, test, review, document, ship) using Agent SDK

2. **`workflow-orchestration-spec.md`** - Workflow type execution (plan-build, sdlc, zte) with phase chaining and error handling

3. **`webhook-automation-spec.md`** - GitHub webhook processing, issue parsing, automatic workflow triggers, and label handling

4. **`websocket-streaming-spec.md`** - Real-time progress updates, agent output streaming, and frontend synchronization

5. **`integration-testing-spec.md`** - End-to-end tests for workflows, API endpoints, database operations, and agent execution

6. **`frontend-ui-spec.md`** - Vue 3 components for workflow management, real-time status display, and orchestrator chat interface

### Key Architectural Improvements Over Python

**Agent SDK Integration:**
- ✅ Direct TypeScript integration (no subprocess calls)
- ✅ Streaming support with real-time updates
- ✅ Retry logic with exponential backoff
- ✅ Type-safe query execution

**State Management:**
- ✅ PostgreSQL instead of JSON files
- ✅ Transactional updates
- ✅ Event history tracking
- ✅ Concurrent workflow support

**Developer Experience:**
- ✅ HTTP API for programmatic access
- ✅ WebSocket streaming for real-time monitoring
- ✅ Natural language control via orchestrator chat
- ✅ Type safety throughout codebase

**Observability:**
- ✅ Structured logging with Pino
- ✅ Database-backed event history
- ✅ Session metrics and cost tracking
- ✅ Ready for Grafana/Prometheus integration

---

**Last Updated:** 2025-11-12
**Migration Progress:** 58% Complete
**Next Phase:** Phase 4 Module 3 - Integration Testing
