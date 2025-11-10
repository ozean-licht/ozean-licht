# System Health Monitoring Dashboard

**ADW ID:** e07adce5
**Date:** 2025-10-24
**Specification:** projects/admin/specs/issue-11-adw-e07adce5-sdlc_planner-system-health-dashboard.md

## Overview

A comprehensive real-time system health monitoring dashboard that provides operational visibility into the Ozean Licht Ecosystem infrastructure. The dashboard monitors three PostgreSQL databases, MCP Gateway service performance, and server resource utilization with auto-refresh capabilities and graceful error handling.

## What Was Built

- **Real-time Health Dashboard** - Interactive page displaying system health metrics with 30-second auto-refresh
- **PostgreSQL Monitoring** - Individual health cards for three databases (kids_ascension_db, ozean_licht_db, shared_users_db)
- **MCP Gateway Monitoring** - Performance metrics including response times (p50, p95, p99), uptime, and request count
- **Server Resource Monitoring** - CPU, memory, and disk utilization with warning thresholds
- **Reusable Component Library** - Modular health card components for consistent metric display
- **Type-Safe Health System** - Comprehensive TypeScript interfaces for all health data structures
- **Server Actions Integration** - Next.js 14 server actions for authenticated data fetching

## Technical Implementation

### Files Modified

- `projects/admin/app/(dashboard)/health/page.tsx`: Main dashboard page with auto-refresh and manual refresh functionality
- `projects/admin/app/(dashboard)/health/actions.ts`: Server action for aggregating health data with authentication
- `projects/admin/lib/mcp-client/health.ts`: Extended health check functions for databases and MCP Gateway
- `projects/admin/types/health.ts`: Complete TypeScript type definitions for health metrics
- `projects/admin/types/index.ts`: Re-export health types for easier imports
- `projects/admin/components/health/HealthMetricCard.tsx`: Reusable base card with status badge
- `projects/admin/components/health/MetricRow.tsx`: Individual metric display with optional progress bar
- `projects/admin/components/health/DatabaseHealthCard.tsx`: Database-specific health metrics display
- `projects/admin/components/health/MCPGatewayHealthCard.tsx`: MCP Gateway performance metrics display
- `projects/admin/components/health/ServerHealthCard.tsx`: Server resource utilization display
- `projects/admin/components/dashboard/Sidebar.tsx`: Added "System Health" navigation link

### Key Changes

**Health Check Functions:**
- Implemented `checkPostgresHealth()` to query all three databases in parallel with connection statistics and average query times
- Created `checkMCPGatewayHealth()` to fetch gateway performance metrics from `/health` endpoint
- Added `getServerHealth()` with placeholder server metrics (CPU, memory, disk usage)
- All health checks include graceful error handling returning 'down' status on failure

**Type System:**
- Defined comprehensive interfaces: `SystemHealth`, `PostgresHealthData`, `DatabaseMetrics`, `MCPGatewayHealth`, `ServerHealth`
- Status types: `ServiceStatus` ('up' | 'down'), `SystemStatus` ('healthy' | 'degraded' | 'down')
- All interfaces include JSDoc comments for developer clarity

**Component Architecture:**
- `HealthMetricCard`: Base card component with color-coded status badges (green=healthy, yellow=degraded, red=down)
- `MetricRow`: Flexible metric display with optional progress bar and warning states
- Database, Gateway, and Server cards use composition pattern building on base components
- Progress bars visualize resource utilization with automatic warning colors at thresholds

**Server Action:**
- `getSystemHealth()`: Authenticates user, fetches all metrics in parallel, determines overall system status
- Status determination: 'down' if any database/gateway down, 'degraded' if resources exceed thresholds, 'healthy' otherwise
- Returns complete `SystemHealth` object with timestamp

**Dashboard Page:**
- React client component with state management for health data, loading, and error states
- Auto-refresh via `useEffect` with 30-second interval and proper cleanup
- Manual refresh button with loading state and animated spinner
- Responsive grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Loading skeletons during initial data fetch
- Error alerts without breaking UI

## How to Use

### Accessing the Dashboard

1. Log in to the admin dashboard (authentication required)
2. Click "System Health" in the sidebar navigation
3. The dashboard loads and displays real-time health metrics

### Understanding the Metrics

**PostgreSQL Databases (3 cards):**
- **Status Badge**: Green (up) or Red (down)
- **Active Connections**: Shows current connections with progress bar (warns at >80% of max)
- **Average Query Time**: Mean query execution time in milliseconds
- **Last Checked**: Timestamp of most recent health check

**MCP Gateway:**
- **Status Badge**: Green (up) or Red (down)
- **Response Times**: p50, p95, p99 percentiles in milliseconds
- **24h Requests**: Total request count in last 24 hours
- **Uptime**: Service uptime formatted as days and hours

**Server Resources:**
- **Status Badge**: Green (healthy), Yellow (degraded), or Red (down)
- **CPU Usage**: Percentage with core count
- **Memory Usage**: Used/Total GB with percentage and progress bar (warns at >85%)
- **Disk Usage**: Used/Total TB with percentage and progress bar (warns at >85%)

### Manual Refresh

- Click the "Refresh" button in the top-right corner
- Button shows "Refreshing..." with spinning icon during update
- All metrics update immediately

### Auto-Refresh

- Dashboard automatically refreshes every 30 seconds
- "Last updated" timestamp shows when data was last fetched
- No action required from user

### Warning Indicators

- **Red Progress Bars**: Resource usage exceeds safe thresholds
- **Yellow Status Badge**: System degraded but operational
- **Red Status Badge**: Service or system down
- **Error Alert**: Red banner appears if health data fetch fails

## Configuration

### Environment Variables

No additional environment variables required. The health dashboard uses existing configuration:

```bash
# MCP Gateway (must be running)
MCP_GATEWAY_URL=http://localhost:8100  # Default if not specified

# Database connections (via MCP Gateway)
SHARED_USERS_DB_URL=<configured in MCP Gateway>
KIDS_ASCENSION_DB_URL=<configured in MCP Gateway>
OZEAN_LICHT_DB_URL=<configured in MCP Gateway>
```

### Health Check Configuration

**Timeouts:**
- Database queries: 5 seconds per query
- MCP Gateway health check: 5 seconds
- Total page load timeout: ~15 seconds (all parallel)

**Auto-Refresh Interval:**
- Default: 30 seconds
- Configurable in `page.tsx` line 60

**Warning Thresholds:**
- CPU: >80% (degraded), >90% (down)
- Memory: >85% (degraded), >90% (down)
- Disk: >85% (degraded), >90% (down)
- Database connections: >80% (warning indicator)

### Prerequisites

**Required Services:**
- MCP Gateway running on port 8100
- PostgreSQL databases accessible via MCP Gateway
- NextAuth authentication configured

**Optional (for accurate metrics):**
- `pg_stat_statements` extension enabled on databases (for query time metrics)

## Testing

### Manual Testing

1. **Navigate to `/health` while logged in**
   - Verify all metric cards load within 2 seconds
   - Check status badges show correct colors

2. **Test Manual Refresh**
   - Click "Refresh" button
   - Verify button shows loading state
   - Verify metrics update and timestamp changes

3. **Test Auto-Refresh**
   - Wait 30+ seconds
   - Verify "Last updated" timestamp changes
   - Verify metrics update automatically

4. **Test Responsive Layout**
   - Resize browser to mobile (375px), tablet (768px), desktop (1920px)
   - Verify grid layout adapts correctly

5. **Test Error Handling**
   - Stop MCP Gateway service
   - Verify error alert appears
   - Verify status badges show "down"

### Automated Testing

**Unit Tests:** (future enhancement)
```bash
pnpm --filter @admin test:unit
```

**E2E Tests:** (future enhancement)
```bash
pnpm --filter @admin test:e2e
```

## Notes

### Current Limitations

1. **Server Metrics are Placeholders**: Current implementation returns static server resource data. Future integration with Prometheus or system monitoring agent required for accurate real-time metrics.

2. **Query Time Requires Extension**: Average query time calculation requires `pg_stat_statements` PostgreSQL extension. If not enabled, returns 0 as fallback.

3. **Polling-Based Refresh**: Uses 30-second polling instead of WebSockets. Future enhancement could implement real-time push updates.

4. **No Historical Data**: Shows current snapshot only. Future enhancement could add time-series charts for trending and analysis.

5. **No Alerting**: Monitoring only, no email/Slack notifications when thresholds exceeded.

6. **Hardcoded Thresholds**: Warning thresholds are hardcoded in components. Future enhancement could allow admin configuration.

### Architecture Decisions

**Why Server Actions?** Next.js 14 server actions provide built-in CSRF protection, type safety, and seamless client-server integration without separate API routes.

**Why Parallel Fetching?** Using `Promise.all()` to fetch all health checks simultaneously minimizes latency and ensures sub-2-second page load times.

**Why Component Composition?** Base components (`HealthMetricCard`, `MetricRow`) enable consistent styling and reduce code duplication across specialized cards.

**Why Client Component?** Dashboard page requires client-side state management for auto-refresh and manual refresh functionality. Server actions fetch data securely while maintaining interactive UI.

### Future Enhancements

- [ ] Integrate real server metrics via Prometheus or system monitoring agent
- [ ] Add time-series charts for historical trend analysis
- [ ] Implement WebSocket-based real-time updates
- [ ] Add email/Slack alerting when thresholds exceeded
- [ ] Allow admin configuration of warning thresholds
- [ ] Add database replication lag monitoring
- [ ] Implement health check result caching for performance
- [ ] Add query slow log integration
- [ ] Create mobile app view optimization

### Related Documentation

- Specification: `projects/admin/specs/issue-11-adw-e07adce5-sdlc_planner-system-health-dashboard.md`
- MCP Gateway: `infrastructure/mcp-gateway/README.md`
- Architecture: `docs/architecture.md`

### Troubleshooting

**Problem:** Health checks show all services as "down"
- **Solution**: Verify MCP Gateway is running on port 8100: `curl http://localhost:8100/health`

**Problem:** Database query times show as 0
- **Solution**: Enable `pg_stat_statements` extension: `CREATE EXTENSION pg_stat_statements;`

**Problem:** Auto-refresh stops working after some time
- **Solution**: Check browser console for errors. Verify cleanup function in `useEffect` is working properly.

**Problem:** Page loads slowly (>5 seconds)
- **Solution**: Check MCP Gateway response time. Verify database connections are not timing out.

**Problem:** Server metrics show static placeholder values
- **Solution**: Expected behavior. Integrate with Prometheus or system monitoring agent for real metrics (future enhancement).
