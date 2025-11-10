# Feature Implementation Plan: Admin Dashboard System Health Monitoring

**Issue:** #11
**ADW ID:** e07adce5
**Type:** Feature
**Created:** 2025-10-24

---

## Overview

Implement a comprehensive real-time system health monitoring dashboard that provides visibility into the infrastructure health of the Ozean Licht Ecosystem. This feature will monitor PostgreSQL databases, MCP Gateway services, and server resources with auto-refresh capabilities and graceful error handling.

## Context

The admin dashboard currently has authentication (NextAuth), sidebar navigation, and entity switching capabilities implemented. The MCP client library exists with basic health check functionality, but it needs to be extended to provide comprehensive metrics for database connections, query performance, and service status.

The system architecture consists of:
- **Three PostgreSQL databases**: kids_ascension_db, ozean_licht_db, shared_users_db
- **MCP Gateway**: Acts as a unified interface for service communication (running on port 8100)
- **Hetzner Server**: AMD Ryzen 5 3600 (6c/12t), 64GB RAM, 2x512GB NVMe

This feature fits into the Week 1 implementation plan for the admin dashboard and will provide critical operational visibility for administrators managing both Kids Ascension and Ozean Licht platforms.

## Requirements

### Functional Requirements
- Display real-time health status for all three PostgreSQL databases (kids_ascension_db, ozean_licht_db, shared_users_db)
- Show database connection metrics: active connections, max connections, average query time
- Display MCP Gateway health: status, response times (p50, p95, p99), uptime, 24h request count
- Show server resource utilization: CPU usage, memory usage, disk usage
- Auto-refresh metrics every 30 seconds
- Manual refresh button for immediate updates
- Display "Last updated" timestamp for data freshness indication
- Show overall system status (healthy, degraded, down) with visual indicators
- Provide warning indicators when resource usage exceeds thresholds

### Technical Requirements
- Use Next.js 14 Server Actions for data fetching
- Extend existing MCP client library with comprehensive health check functions
- All health checks must complete within 2 seconds
- Use React hooks for client-side state management and auto-refresh
- Implement retry logic (3 attempts with exponential backoff) for failed requests
- Type-safe TypeScript throughout all components and actions
- Responsive design that works on mobile, tablet, and desktop
- Follow existing project patterns (NextAuth auth guards, MCP client usage)

### Non-Functional Requirements
- **Performance**: All metrics must load within 2 seconds
- **Reliability**: Auto-refresh must not cause memory leaks
- **Security**: Require authentication via NextAuth before displaying metrics
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Maintainability**: Reusable component structure for metric cards

## Architecture & Design

### High-Level Design

The health monitoring system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Health Dashboard Page                     │
│              (app/(dashboard)/health/page.tsx)               │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Database  │  │    MCP     │  │   Server   │           │
│  │   Cards    │  │  Gateway   │  │  Resource  │           │
│  │  (3 cards) │  │    Card    │  │    Card    │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└──────────────────────┬───────────────────────────────────────┘
                       │ getSystemHealth()
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Server Action (health/actions.ts)               │
│                                                              │
│  • Authenticate user via requireAuth()                      │
│  • Fetch metrics in parallel from all sources               │
│  • Aggregate and determine overall status                   │
│  • Return SystemHealth object                               │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         MCP Client Health Functions (lib/mcp-client/)        │
│                                                              │
│  • checkPostgresHealth() - Query all 3 databases            │
│  • checkMCPGatewayHealth() - Query gateway /health          │
│  • getServerHealth() - Placeholder for future monitoring    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                MCP Gateway (Port 8100)                       │
│                                                              │
│  • PostgreSQL database connections                          │
│  • Health endpoint (/health)                                │
│  • Catalog endpoint (/mcp/catalog)                          │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User visits `/health` page (authenticated via middleware)
2. Page component calls `getSystemHealth()` server action
3. Server action fetches metrics from all sources in parallel
4. Health check functions query databases via MCP Gateway
5. Results aggregated and returned to client
6. React components render metric cards with visual indicators
7. Auto-refresh triggers every 30 seconds

### Database Changes

No database schema changes required. This feature only queries existing databases for metadata.

### API Changes

**New Server Action:**
```typescript
// app/(dashboard)/health/actions.ts
'use server'

export async function getSystemHealth(): Promise<SystemHealth>
```

**Extended MCP Client Functions:**
```typescript
// lib/mcp-client/health.ts

// New function: Check all databases
export async function checkPostgresHealth(
  baseUrl: string
): Promise<PostgresHealthData>

// New function: Check MCP Gateway with detailed metrics
export async function checkMCPGatewayHealth(
  baseUrl: string
): Promise<MCPGatewayHealth>

// New function: Get server metrics (placeholder)
export async function getServerHealth(): Promise<ServerHealth>
```

### Component Structure

```
projects/admin/
├── app/(dashboard)/health/
│   ├── page.tsx              # Main health dashboard page (client component)
│   └── actions.ts            # Server actions for fetching health data
│
├── components/health/
│   ├── HealthMetricCard.tsx      # Reusable card with status badge
│   ├── MetricRow.tsx             # Individual metric display with progress
│   ├── DatabaseHealthCard.tsx    # Database-specific metrics card
│   ├── MCPGatewayHealthCard.tsx  # MCP Gateway metrics card
│   └── ServerHealthCard.tsx      # Server resource metrics card
│
├── lib/mcp-client/
│   └── health.ts             # Extended health check functions
│
└── types/
    └── health.ts             # TypeScript interfaces for health data
```

## Implementation Steps

### Step 1: Create TypeScript Type Definitions

**Goal:** Define all TypeScript interfaces for health metrics and status indicators.

**Files to Create:**
- `types/health.ts` - Complete type definitions

**Implementation Details:**

Create comprehensive type definitions covering:
- `SystemHealth` - Top-level health object with overall status
- `PostgresHealthData` - Container for all database metrics
- `DatabaseMetrics` - Individual database health metrics (status, connections, query time)
- `MCPGatewayHealth` - Gateway metrics (response times, uptime, request count)
- `ServerHealth` - Server resource metrics (CPU, memory, disk)
- Status union types: `'up' | 'down'`, `'healthy' | 'degraded' | 'down'`

These types will be imported across server actions, client components, and MCP client functions to ensure type safety.

**Acceptance Criteria:**
- [ ] All interfaces properly exported
- [ ] No TypeScript compilation errors
- [ ] Interfaces match the spec requirements from system-health-dashboard.md
- [ ] JSDoc comments for all interfaces

---

### Step 2: Extend MCP Client Health Functions

**Goal:** Enhance the existing MCP client health module with comprehensive database and gateway checks.

**Files to Modify:**
- `lib/mcp-client/health.ts` - Add new health check functions

**Implementation Details:**

Extend the existing health.ts module with three new functions:

1. **checkPostgresHealth()**: Query all three databases in parallel
   - Execute health check query: `SELECT 1 as health_check`
   - Get connection stats: `SELECT count(*) as active_connections, (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections FROM pg_stat_activity WHERE datname = current_database()`
   - Get average query time: `SELECT COALESCE(AVG(mean_exec_time), 0) as avg_time FROM pg_stat_statements WHERE queryid IS NOT NULL`
   - Handle failures gracefully (return 'down' status on error)
   - Return metrics for kids_ascension_db, ozean_licht_db, shared_users_db

2. **checkMCPGatewayHealth()**: Query MCP Gateway health endpoint
   - Fetch from `http://localhost:8100/health`
   - Measure response time for p50, p95, p99 (use simple calculation for now)
   - Extract uptime and request count from response
   - Return status 'down' if unreachable

3. **getServerHealth()**: Return placeholder server metrics
   - For now, return static placeholder values
   - Add TODO comment for future Prometheus integration
   - Structure data for CPU (12 cores), Memory (64GB), Disk (1TB)

Each function should include:
- Timeout handling (5 second max)
- Error catching with specific error types
- Timestamp of last check
- Response time measurement

**Acceptance Criteria:**
- [ ] All three functions implemented and exported
- [ ] Parallel execution in checkPostgresHealth using Promise.all()
- [ ] Proper error handling returns 'down' status instead of throwing
- [ ] Response times measured accurately
- [ ] Functions work with existing MCPGatewayClient instances

---

### Step 3: Create Health Server Action

**Goal:** Implement the server action that aggregates health data and enforces authentication.

**Files to Create:**
- `app/(dashboard)/health/actions.ts` - Server action with getSystemHealth()

**Implementation Details:**

Create a Next.js Server Action that:
1. Validates authentication using `requireAuth()` from existing auth utilities
2. Creates MCP Gateway client instance with default config
3. Fetches health data from all sources in parallel using `Promise.all([checkPostgresHealth(), checkMCPGatewayHealth(), getServerHealth()])`
4. Determines overall system status based on rules:
   - **down**: Any database is down OR MCP Gateway is down
   - **degraded**: CPU > 80% OR Memory > 90% OR Disk > 85%
   - **healthy**: All checks pass and resources within normal range
5. Returns `SystemHealth` object with timestamp

The action must handle errors gracefully:
- If authentication fails, throw error (caught by Next.js error boundary)
- If health checks fail, still return partial data with 'down' status
- Always include timestamp for data freshness

**Acceptance Criteria:**
- [ ] Server action properly marked with 'use server' directive
- [ ] Authentication enforced before data fetching
- [ ] Health checks execute in parallel for performance
- [ ] Overall status calculation logic implemented correctly
- [ ] Error handling doesn't crash the action
- [ ] Returns properly typed SystemHealth object

---

### Step 4: Create Reusable Health Component Library

**Goal:** Build a library of reusable React components for displaying health metrics.

**Files to Create:**
- `components/health/HealthMetricCard.tsx` - Base card with status badge
- `components/health/MetricRow.tsx` - Individual metric with optional progress bar

**Implementation Details:**

**HealthMetricCard:**
- Accepts title, status, and children as props
- Displays color-coded status badge (green=up/healthy, yellow=degraded, red=down)
- Uses Next.js/Tailwind for styling
- Responsive card layout

**MetricRow:**
- Displays label and value with optional unit
- Optional progress bar for percentage metrics
- Warning state changes color to red
- Flexible layout for different metric types

Both components should:
- Use TypeScript with proper prop interfaces
- Include JSDoc comments
- Use semantic HTML elements
- Support dark mode (via Tailwind classes)
- Be fully responsive

**Acceptance Criteria:**
- [ ] Components are fully typed with TypeScript
- [ ] Status badge colors match spec (green/yellow/red)
- [ ] Progress bars render correctly for percentage values
- [ ] Warning states display with red color
- [ ] Components are responsive and accessible
- [ ] JSDoc comments explain usage

---

### Step 5: Create Database Health Card Component

**Goal:** Build a specialized card component for displaying individual database metrics.

**Files to Create:**
- `components/health/DatabaseHealthCard.tsx` - Database-specific health display

**Implementation Details:**

Create a component that:
- Accepts database name, display name, and metrics as props
- Uses HealthMetricCard as base wrapper
- Calculates connection percentage: (activeConnections / maxConnections) * 100
- Displays warning when connection percentage > 80%
- Shows three metric rows:
  1. Active Connections (with progress bar)
  2. Average Query Time (in milliseconds)
  3. Last Checked (formatted as localized time)

Connection usage visualization:
- Progress bar shows visual representation of connection pool usage
- Red color when > 80% (warning threshold)
- Normal color when ≤ 80%

**Acceptance Criteria:**
- [ ] Component renders with proper database display name
- [ ] Connection percentage calculated correctly
- [ ] Warning state triggers at > 80% connections
- [ ] Average query time formatted to 2 decimal places
- [ ] Last checked time formatted as readable timestamp
- [ ] Progress bar reflects connection usage accurately

---

### Step 6: Create MCP Gateway and Server Health Cards

**Goal:** Build specialized card components for MCP Gateway and server resource metrics.

**Files to Create:**
- `components/health/MCPGatewayHealthCard.tsx` - MCP Gateway metrics display
- `components/health/ServerHealthCard.tsx` - Server resource metrics display

**Implementation Details:**

**MCPGatewayHealthCard:**
- Display response time percentiles (p50, p95, p99) in milliseconds
- Show 24h request count with locale-formatted numbers (e.g., "1,234")
- Format uptime as "Xd Xh" (days and hours)
- Use HealthMetricCard wrapper with gateway status

**ServerHealthCard:**
- Display CPU usage with core count (e.g., "45% (12 cores)")
- Show memory usage as "used / total GB" with percentage
- Show disk usage as "used / total TB" with percentage
- Each metric has progress bar
- Warning colors when thresholds exceeded:
  - CPU > 80%
  - Memory > 85%
  - Disk > 85%
- Determine overall card status based on worst metric:
  - down: Any metric > 90%
  - degraded: Any metric > 80%
  - healthy: All metrics ≤ 80%

**Acceptance Criteria:**
- [ ] MCP Gateway card displays all required metrics
- [ ] Uptime formatter converts seconds to days/hours correctly
- [ ] Request count uses locale-specific formatting
- [ ] Server card shows all three resources with progress bars
- [ ] Warning thresholds trigger color changes correctly
- [ ] Overall status determination logic works properly

---

### Step 7: Create Health Dashboard Page

**Goal:** Build the main health dashboard page with auto-refresh and manual refresh capabilities.

**Files to Create:**
- `app/(dashboard)/health/page.tsx` - Main dashboard page component

**Implementation Details:**

Create a client component ('use client') that:

**State Management:**
- `health: SystemHealth | null` - Current health data
- `isLoading: boolean` - Initial loading state
- `error: string | null` - Error message if fetch fails
- `lastUpdated: Date | null` - Timestamp of last successful fetch
- `isRefreshing: boolean` - Manual refresh in progress

**Data Fetching:**
- `fetchHealth()` function calls `getSystemHealth()` server action
- Updates state with results or error
- Sets lastUpdated timestamp

**Auto-Refresh:**
- useEffect hook sets up 30-second interval
- Cleanup function clears interval on unmount
- Prevents memory leaks

**Manual Refresh:**
- Button with RefreshCw icon (from lucide-react)
- Disabled during refresh
- Icon spins during refresh (animate-spin class)
- Immediately triggers fetchHealth()

**UI Layout:**
1. Header with title, description, last updated time, and refresh button
2. Error alert (if present)
3. Overall status banner (if system not healthy)
4. "PostgreSQL Databases" section with 3 database cards in grid
5. "Services" section with MCP Gateway and Server cards in grid

**Loading State:**
- Show skeleton loaders while initial data loads
- Use Next.js Skeleton component or custom loading placeholders

**Responsive Grid:**
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns for databases, 2 columns for services

**Acceptance Criteria:**
- [ ] Page loads within 2 seconds
- [ ] Auto-refresh works every 30 seconds
- [ ] Manual refresh button works immediately
- [ ] Last updated timestamp displays correctly
- [ ] Error states display without breaking UI
- [ ] Loading skeletons show during initial load
- [ ] Grid layout is responsive on all screen sizes
- [ ] Overall status banner appears when status is not healthy
- [ ] No console errors or warnings

---

### Step 8: Add Navigation Link to Sidebar

**Goal:** Make the health dashboard accessible from the main navigation sidebar.

**Files to Modify:**
- `components/dashboard/Sidebar.tsx` - Add "System Health" navigation item

**Implementation Details:**

Add a new navigation item to the sidebar:
- Icon: Activity icon from lucide-react (represents monitoring/health)
- Label: "System Health"
- Route: `/health`
- Place in appropriate section (likely after Dashboard, before Settings)

Follow existing sidebar patterns:
- Check current route highlighting logic
- Ensure proper href for Next.js Link component
- Maintain consistent spacing and styling

**Acceptance Criteria:**
- [ ] "System Health" link appears in sidebar
- [ ] Link navigates to /health route
- [ ] Active state highlights when on /health page
- [ ] Icon renders correctly
- [ ] Follows existing sidebar styling patterns

---

### Step 9: Create Unit Tests

**Goal:** Ensure health check functions work correctly with comprehensive unit tests.

**Files to Create:**
- `tests/unit/health/health-checks.test.ts` - Test health check functions

**Implementation Details:**

Test Coverage:

**checkPostgresHealth():**
- Mock successful responses from all 3 databases
- Test parallel execution (Promise.all)
- Test handling of individual database failures
- Verify overallStatus is 'up' when all databases up
- Verify overallStatus is 'down' when any database down
- Test timeout handling

**checkMCPGatewayHealth():**
- Mock successful /health endpoint response
- Test response time calculation
- Test handling of unreachable gateway (returns 'down')
- Verify uptime and request count parsing

**getServerHealth():**
- Verify returns correct placeholder structure
- Test CPU, memory, disk percentage calculations

Use Jest mocking:
- Mock fetch calls with node-fetch
- Mock MCPGatewayClient if needed
- Use jest.setTimeout for async tests

**Acceptance Criteria:**
- [ ] All health check functions have unit tests
- [ ] Tests cover success and failure cases
- [ ] Mocks properly isolate functions from external dependencies
- [ ] Tests run successfully with `pnpm test:unit`
- [ ] Code coverage > 80% for health.ts

---

### Step 10: Create Integration Tests

**Goal:** Test the full health data fetching flow from server action to components.

**Files to Create:**
- `tests/integration/health-dashboard.test.ts` - Integration tests for health feature

**Implementation Details:**

Test Scenarios:

1. **Full System Health Fetch:**
   - Mock MCP Gateway responses
   - Call getSystemHealth() server action
   - Verify all metrics returned correctly
   - Check overall status determination

2. **Error Handling:**
   - Mock database connection failures
   - Verify server action returns 'down' status
   - Ensure partial data still returned

3. **Status Determination Logic:**
   - Test 'healthy' state: All services up, resources normal
   - Test 'degraded' state: Services up, high resource usage
   - Test 'down' state: Database or gateway down

4. **Authentication:**
   - Test that unauthenticated requests fail
   - Mock requireAuth() function

Use integration test patterns:
- Mock external services (MCP Gateway)
- Don't mock internal functions (test full flow)
- Use realistic test data

**Acceptance Criteria:**
- [ ] Full health fetch tested end-to-end
- [ ] Error handling scenarios covered
- [ ] Status determination logic verified
- [ ] Authentication enforcement tested
- [ ] Tests run successfully with `pnpm test:integration`

---

### Step 11: Add E2E Tests with Playwright

**Goal:** Ensure the health dashboard works correctly in a real browser environment.

**Files to Create:**
- `tests/e2e/health-dashboard.spec.ts` - E2E tests with Playwright

**Implementation Details:**

Test Scenarios:

1. **Page Load:**
   - Navigate to /health
   - Verify authentication redirect if not logged in
   - After login, verify page renders
   - Check all metric cards visible

2. **Data Display:**
   - Verify database cards show metrics
   - Verify MCP Gateway card shows metrics
   - Verify Server card shows metrics
   - Check status badges display correct colors

3. **Manual Refresh:**
   - Click refresh button
   - Verify button enters loading state
   - Verify metrics update
   - Verify last updated timestamp changes

4. **Auto-Refresh:**
   - Wait 30+ seconds
   - Verify metrics refresh automatically
   - Verify last updated timestamp updates

5. **Responsive Design:**
   - Test on mobile viewport (375px)
   - Test on tablet viewport (768px)
   - Test on desktop viewport (1920px)
   - Verify grid layout adjusts correctly

6. **Error States:**
   - Mock failed health check
   - Verify error alert displays
   - Verify previous data remains visible

Use Playwright best practices:
- Use data-testid attributes for selections
- Wait for network idle before assertions
- Take screenshots for visual regression
- Test in isolated test environment

**Acceptance Criteria:**
- [ ] All E2E scenarios pass
- [ ] Tests run with allocated FRONTEND_PORT from .ports.env
- [ ] Authentication flow works correctly
- [ ] Manual and auto-refresh tested
- [ ] Responsive layout verified
- [ ] Tests run successfully with `pnpm test:e2e`

---

### Step 12: Documentation and Code Comments

**Goal:** Document the health monitoring feature for future maintainers.

**Files to Create:**
- `app_docs/features/system-health-monitoring.md` - Feature documentation

**Files to Modify:**
- Add JSDoc comments to all functions in health.ts
- Add component usage examples in JSDoc

**Implementation Details:**

Create comprehensive feature documentation covering:

1. **Overview:** What the feature does and why it exists
2. **Architecture:** How components and actions interact
3. **Metrics Explained:** What each metric means and thresholds
4. **Troubleshooting:** Common issues and solutions
5. **Future Enhancements:** TODOs for server metrics integration

JSDoc comments should include:
- Function purpose and behavior
- Parameter descriptions with types
- Return value descriptions
- Example usage
- Error conditions

**Acceptance Criteria:**
- [ ] Feature documentation created in app_docs/features/
- [ ] All exported functions have JSDoc comments
- [ ] Component props interfaces documented
- [ ] Troubleshooting section includes common errors
- [ ] Future enhancements clearly marked

## Testing Strategy

### Unit Tests

**Test Files:**
- `tests/unit/health/health-checks.test.ts` - Health check function tests

**Key Test Cases:**
- [ ] checkPostgresHealth returns correct structure with mock data
- [ ] checkPostgresHealth handles individual database failures
- [ ] checkPostgresHealth calculates connection percentages correctly
- [ ] checkMCPGatewayHealth parses response correctly
- [ ] checkMCPGatewayHealth handles timeout errors
- [ ] getServerHealth returns correct placeholder structure
- [ ] All functions handle network errors gracefully

### Integration Tests

**Test Files:**
- `tests/integration/health-dashboard.test.ts` - Full flow integration tests

**Key Test Cases:**
- [ ] getSystemHealth aggregates all metrics correctly
- [ ] Overall status determination works for all states
- [ ] Authentication is enforced
- [ ] Parallel fetching improves performance
- [ ] Error handling returns partial data

### E2E Tests

**Test Files:**
- `tests/e2e/health-dashboard.spec.ts` - Playwright browser tests

**Key Test Cases:**
- [ ] Dashboard page loads and displays all cards
- [ ] Manual refresh updates metrics
- [ ] Auto-refresh works after 30 seconds
- [ ] Status badges display correct colors
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Error states display without crashing

### Manual Testing Checklist

1. **Data Loading**
   - [ ] All metrics load within 2 seconds
   - [ ] Loading skeletons display correctly
   - [ ] Data populates all cards

2. **Auto-Refresh**
   - [ ] Page refreshes every 30 seconds
   - [ ] Last updated timestamp updates
   - [ ] No memory leaks after multiple refreshes

3. **Manual Refresh**
   - [ ] Refresh button triggers immediate update
   - [ ] Button shows loading state
   - [ ] Refresh icon animates during load

4. **Error Handling**
   - [ ] Error alert shows when fetch fails
   - [ ] Previous data remains visible on error
   - [ ] Retry mechanism works correctly

5. **Status Indicators**
   - [ ] Green badge for healthy services
   - [ ] Yellow badge for degraded state
   - [ ] Red badge for down services
   - [ ] Overall status banner appears when needed

6. **Mobile Responsiveness**
   - [ ] Cards stack vertically on mobile
   - [ ] Text remains readable
   - [ ] Refresh button accessible
   - [ ] Progress bars render correctly

## Security Considerations

- **Authentication Required:** All health endpoints protected by NextAuth middleware (existing middleware.ts already handles /health routes)
- **Rate Limiting:** Consider adding rate limiting to prevent abuse (future enhancement)
- **Sensitive Data:** Database connection strings never exposed to client (only metrics)
- **SQL Injection:** Use parameterized queries via MCP Gateway (already implemented)
- **XSS Prevention:** React automatically escapes output, but validate all user inputs
- **CSRF Protection:** Next.js Server Actions have built-in CSRF protection

## Performance Considerations

- **Parallel Fetching:** All health checks execute in parallel to minimize latency (Promise.all)
- **Timeout Handling:** 5-second timeout per check prevents hanging requests
- **Client-Side Caching:** Health data cached in React state between refreshes
- **Debouncing:** Manual refresh button debounced to prevent spam
- **Memory Management:** Auto-refresh interval properly cleaned up on unmount
- **Bundle Size:** Use tree-shaking for lucide-react icons (import only needed icons)

## Rollout Plan

1. **Development:** Implement in isolated worktree (trees/e07adce5/)
2. **Testing:** Run unit + integration + E2E tests in isolated environment
3. **Review:** Validate against spec with screenshots
4. **Documentation:** Generate feature docs
5. **Deployment:** Merge to main → auto-deploy to Cloudflare Pages

## Success Criteria

- [ ] All functional requirements met (real-time monitoring, auto-refresh, error handling)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code follows repository conventions (TypeScript, Next.js patterns, MCP client usage)
- [ ] Documentation updated (feature docs, JSDoc comments)
- [ ] No console errors or warnings
- [ ] Performance meets requirements (< 2 second load time)
- [ ] Mobile responsive design works correctly
- [ ] Authentication properly enforced
- [ ] Auto-refresh doesn't cause memory leaks

## Potential Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| MCP Gateway unavailable during health check | High | Low | Return 'down' status gracefully, show error alert, retain previous data |
| Database query timeout | High | Low | 5-second timeout with retry logic, show 'down' status for affected database |
| Auto-refresh causes memory leak | Medium | Medium | Proper cleanup in useEffect return function, test with React DevTools Profiler |
| Server metrics unavailable (placeholder data) | Low | High | Clearly mark as placeholder, add TODO for future Prometheus integration |
| Performance degradation with many refreshes | Medium | Low | Use React.memo for metric cards, optimize re-renders |
| Auth token expiration during session | Medium | Low | NextAuth handles token refresh automatically, test session timeout |
| pg_stat_statements extension not enabled | High | Low | Add fallback query if extension unavailable, document requirement |
| Responsive layout breaks on specific viewport | Low | Medium | Test multiple viewport sizes in E2E tests |

## Notes

- **Server Metrics Placeholder:** Current implementation returns static server metrics. Future enhancement should integrate with Prometheus or system monitoring agent.
- **pg_stat_statements:** Database average query time requires pg_stat_statements extension. If not available, fall back to response time measurement.
- **MCP Gateway Metrics:** Assumes MCP Gateway /health endpoint returns uptime and request count. If not available, implement basic metrics in MCP Gateway first.
- **Real-Time Updates:** Current implementation uses polling (30-second refresh). Future enhancement could use WebSockets for true real-time updates.
- **Historical Data:** Current implementation shows current snapshot only. Future enhancement could add time-series charts for trending.
- **Alerting:** Current implementation is monitoring only. Future enhancement could add alert notifications (email, Slack) when thresholds exceeded.
- **Custom Thresholds:** Current thresholds are hardcoded. Future enhancement could allow admins to configure thresholds per metric.

---

**End of Plan**
