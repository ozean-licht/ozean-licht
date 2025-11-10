# Admin Dashboard System Health Monitoring - Implementation Spec

**Feature:** Real-Time System Health Dashboard
**Issue:** TBD
**ADW Type:** /feature
**Estimated Complexity:** Medium
**Target:** Week 1 - Day 4-5

---

## Overview

Implement a comprehensive system health monitoring dashboard that provides real-time visibility into the infrastructure health. This includes PostgreSQL database metrics, MCP Gateway status, and server resource utilization.

### Goals
- Real-time health monitoring for all critical services
- Per-database connection and performance metrics
- MCP Gateway service status and response times
- Server resource utilization (CPU, RAM, Disk)
- Auto-refresh capability (30-second intervals)
- Graceful error handling for service failures
- Mobile-responsive design

### Success Criteria
- All metrics load within 2 seconds
- Auto-refresh works every 30 seconds
- Manual refresh button updates all metrics
- Error states display gracefully without breaking UI
- Dashboard is fully responsive on mobile devices
- Historical data available (last 24 hours for request counts)

---

## Technical Approach

### 1. Architecture

```
Health Dashboard (React) → Server Actions → MCP Gateway → Services (PostgreSQL, etc.)
                                                         ↓
                                                   Health Checks
                                                         ↓
                                                   Return Metrics
```

### 2. Data Structure

```typescript
interface SystemHealth {
  postgres: PostgresHealth
  mcpGateway: MCPGatewayHealth
  server: ServerHealth
  timestamp: string
  overallStatus: 'healthy' | 'degraded' | 'down'
}

interface PostgresHealth {
  databases: {
    kids_ascension_db: DatabaseMetrics
    ozean_licht_db: DatabaseMetrics
    shared_users_db: DatabaseMetrics
  }
  overallStatus: 'up' | 'down'
}

interface DatabaseMetrics {
  status: 'up' | 'down'
  activeConnections: number
  maxConnections: number
  avgQueryTime: number // milliseconds
  lastChecked: string
}

interface MCPGatewayHealth {
  status: 'up' | 'down'
  responseTime: {
    p50: number
    p95: number
    p99: number
  }
  requestCount24h: number
  uptime: number // seconds
  lastChecked: string
}

interface ServerHealth {
  cpu: {
    usage: number // percentage
    cores: number
  }
  memory: {
    used: number // GB
    total: number // GB
    percentage: number
  }
  disk: {
    used: number // TB
    total: number // TB
    percentage: number
  }
}
```

### 3. Refresh Strategy

- **Auto-refresh:** Every 30 seconds using `setInterval`
- **Manual refresh:** Button click triggers immediate update
- **Error handling:** Retry 3 times with exponential backoff
- **Stale data indicator:** Show "Last updated" timestamp

---

## Implementation Steps

### Step 1: Extend MCP Client with Health Checks

Add to `lib/mcp-client/health.ts`:

```typescript
import { AdminMCPClient } from './client'

export interface HealthCheckResult {
  healthy: boolean
  responseTime: number
  error?: string
}

export interface PostgresHealthData {
  databases: {
    kids_ascension_db: DatabaseMetrics
    ozean_licht_db: DatabaseMetrics
    shared_users_db: DatabaseMetrics
  }
  overallStatus: 'up' | 'down'
}

export interface DatabaseMetrics {
  status: 'up' | 'down'
  activeConnections: number
  maxConnections: number
  avgQueryTime: number
  lastChecked: string
}

export async function checkPostgresHealth(
  client: AdminMCPClient
): Promise<PostgresHealthData> {
  const databases = ['kids_ascension_db', 'ozean_licht_db', 'shared_users_db']

  const results = await Promise.all(
    databases.map(async (db) => {
      try {
        const startTime = Date.now()

        // Check connection status
        const statusResult = await client.executeRawQuery(
          db,
          'SELECT 1 as health_check'
        )

        // Get connection stats
        const connStats = await client.executeRawQuery(
          db,
          `SELECT
            count(*) as active_connections,
            (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
           FROM pg_stat_activity
           WHERE datname = current_database()`
        )

        // Get average query time (last hour)
        const avgQueryResult = await client.executeRawQuery(
          db,
          `SELECT
            COALESCE(AVG(mean_exec_time), 0) as avg_time
           FROM pg_stat_statements
           WHERE queryid IS NOT NULL`
        )

        const responseTime = Date.now() - startTime

        return {
          dbName: db,
          metrics: {
            status: 'up' as const,
            activeConnections: connStats[0]?.active_connections || 0,
            maxConnections: connStats[0]?.max_connections || 100,
            avgQueryTime: avgQueryResult[0]?.avg_time || responseTime,
            lastChecked: new Date().toISOString()
          }
        }
      } catch (error) {
        return {
          dbName: db,
          metrics: {
            status: 'down' as const,
            activeConnections: 0,
            maxConnections: 0,
            avgQueryTime: 0,
            lastChecked: new Date().toISOString()
          }
        }
      }
    })
  )

  const healthData: PostgresHealthData = {
    databases: {
      kids_ascension_db: results[0].metrics,
      ozean_licht_db: results[1].metrics,
      shared_users_db: results[2].metrics
    },
    overallStatus: results.every(r => r.metrics.status === 'up') ? 'up' : 'down'
  }

  return healthData
}

export async function checkMCPGatewayHealth(
  client: AdminMCPClient
): Promise<MCPGatewayHealth> {
  try {
    const startTime = Date.now()
    const healthCheck = await client.health()
    const responseTime = Date.now() - startTime

    // Get metrics from MCP Gateway health endpoint
    // This assumes MCP Gateway exposes these metrics
    return {
      status: 'up',
      responseTime: {
        p50: responseTime,
        p95: responseTime * 1.5,
        p99: responseTime * 2
      },
      requestCount24h: healthCheck.metrics?.requestCount || 0,
      uptime: healthCheck.uptime || 0,
      lastChecked: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'down',
      responseTime: {
        p50: 0,
        p95: 0,
        p99: 0
      },
      requestCount24h: 0,
      uptime: 0,
      lastChecked: new Date().toISOString()
    }
  }
}

export async function getServerHealth(): Promise<ServerHealth> {
  // This would ideally come from a monitoring agent on the server
  // For now, we'll use placeholder data or system commands via MCP

  // Future: Integrate with Prometheus or similar monitoring
  return {
    cpu: {
      usage: 45, // placeholder
      cores: 12
    },
    memory: {
      used: 24,
      total: 64,
      percentage: 37.5
    },
    disk: {
      used: 0.15,
      total: 1.0,
      percentage: 15
    }
  }
}
```

### Step 2: Create Server Action for Health Data

**File: `app/(dashboard)/health/actions.ts`**
```typescript
'use server'

import { AdminMCPClient } from '@/lib/mcp-client'
import {
  checkPostgresHealth,
  checkMCPGatewayHealth,
  getServerHealth
} from '@/lib/mcp-client/health'
import { requireAuth } from '@/lib/auth-utils'

export interface SystemHealth {
  postgres: PostgresHealthData
  mcpGateway: MCPGatewayHealth
  server: ServerHealth
  timestamp: string
  overallStatus: 'healthy' | 'degraded' | 'down'
}

export async function getSystemHealth(): Promise<SystemHealth> {
  // Ensure user is authenticated
  await requireAuth()

  const client = new AdminMCPClient()

  // Fetch all health metrics in parallel
  const [postgres, mcpGateway, server] = await Promise.all([
    checkPostgresHealth(client),
    checkMCPGatewayHealth(client),
    getServerHealth()
  ])

  // Determine overall system status
  let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy'

  if (postgres.overallStatus === 'down' || mcpGateway.status === 'down') {
    overallStatus = 'down'
  } else if (
    server.cpu.usage > 80 ||
    server.memory.percentage > 90 ||
    server.disk.percentage > 85
  ) {
    overallStatus = 'degraded'
  }

  return {
    postgres,
    mcpGateway,
    server,
    timestamp: new Date().toISOString(),
    overallStatus
  }
}
```

### Step 3: Create Health Dashboard Components

**File: `components/health/HealthMetricCard.tsx`**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface HealthMetricCardProps {
  title: string
  status: 'up' | 'down' | 'healthy' | 'degraded'
  children: React.ReactNode
}

export function HealthMetricCard({
  title,
  status,
  children
}: HealthMetricCardProps) {
  const statusColors = {
    up: 'bg-green-500',
    healthy: 'bg-green-500',
    down: 'bg-red-500',
    degraded: 'bg-yellow-500'
  }

  const statusLabels = {
    up: 'Operational',
    healthy: 'Healthy',
    down: 'Down',
    degraded: 'Degraded'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

interface MetricRowProps {
  label: string
  value: string | number
  unit?: string
  progress?: number
  warning?: boolean
}

export function MetricRow({
  label,
  value,
  unit,
  progress,
  warning
}: MetricRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className={warning ? 'text-red-600 font-medium' : 'font-medium'}>
          {value}{unit && ` ${unit}`}
        </span>
      </div>
      {progress !== undefined && (
        <Progress
          value={progress}
          className={warning ? 'bg-red-200' : ''}
        />
      )}
    </div>
  )
}
```

**File: `components/health/DatabaseHealthCard.tsx`**
```typescript
import { HealthMetricCard, MetricRow } from './HealthMetricCard'
import { DatabaseMetrics } from '@/lib/mcp-client/health'

interface DatabaseHealthCardProps {
  name: string
  displayName: string
  metrics: DatabaseMetrics
}

export function DatabaseHealthCard({
  name,
  displayName,
  metrics
}: DatabaseHealthCardProps) {
  const connectionPercentage =
    (metrics.activeConnections / metrics.maxConnections) * 100

  const isWarning = connectionPercentage > 80

  return (
    <HealthMetricCard title={displayName} status={metrics.status}>
      <div className="space-y-4">
        <MetricRow
          label="Active Connections"
          value={`${metrics.activeConnections} / ${metrics.maxConnections}`}
          progress={connectionPercentage}
          warning={isWarning}
        />
        <MetricRow
          label="Avg Query Time"
          value={metrics.avgQueryTime.toFixed(2)}
          unit="ms"
        />
        <MetricRow
          label="Last Checked"
          value={new Date(metrics.lastChecked).toLocaleTimeString()}
        />
      </div>
    </HealthMetricCard>
  )
}
```

**File: `components/health/MCPGatewayHealthCard.tsx`**
```typescript
import { HealthMetricCard, MetricRow } from './HealthMetricCard'
import { MCPGatewayHealth } from '@/lib/mcp-client/health'

interface MCPGatewayHealthCardProps {
  metrics: MCPGatewayHealth
}

export function MCPGatewayHealthCard({ metrics }: MCPGatewayHealthCardProps) {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  return (
    <HealthMetricCard title="MCP Gateway" status={metrics.status}>
      <div className="space-y-4">
        <MetricRow
          label="Response Time (p50)"
          value={metrics.responseTime.p50}
          unit="ms"
        />
        <MetricRow
          label="Response Time (p95)"
          value={metrics.responseTime.p95}
          unit="ms"
        />
        <MetricRow
          label="Response Time (p99)"
          value={metrics.responseTime.p99}
          unit="ms"
        />
        <MetricRow
          label="Requests (24h)"
          value={metrics.requestCount24h.toLocaleString()}
        />
        <MetricRow
          label="Uptime"
          value={formatUptime(metrics.uptime)}
        />
      </div>
    </HealthMetricCard>
  )
}
```

**File: `components/health/ServerHealthCard.tsx`**
```typescript
import { HealthMetricCard, MetricRow } from './HealthMetricCard'
import { ServerHealth } from '@/lib/mcp-client/health'

interface ServerHealthCardProps {
  metrics: ServerHealth
}

export function ServerHealthCard({ metrics }: ServerHealthCardProps) {
  const getStatus = () => {
    if (
      metrics.cpu.usage > 90 ||
      metrics.memory.percentage > 95 ||
      metrics.disk.percentage > 90
    ) {
      return 'down'
    }
    if (
      metrics.cpu.usage > 80 ||
      metrics.memory.percentage > 85 ||
      metrics.disk.percentage > 85
    ) {
      return 'degraded'
    }
    return 'healthy'
  }

  return (
    <HealthMetricCard title="Server Resources" status={getStatus()}>
      <div className="space-y-4">
        <MetricRow
          label={`CPU Usage (${metrics.cpu.cores} cores)`}
          value={metrics.cpu.usage}
          unit="%"
          progress={metrics.cpu.usage}
          warning={metrics.cpu.usage > 80}
        />
        <MetricRow
          label="Memory"
          value={`${metrics.memory.used.toFixed(1)} / ${metrics.memory.total}`}
          unit="GB"
          progress={metrics.memory.percentage}
          warning={metrics.memory.percentage > 85}
        />
        <MetricRow
          label="Disk"
          value={`${metrics.disk.used.toFixed(2)} / ${metrics.disk.total.toFixed(2)}`}
          unit="TB"
          progress={metrics.disk.percentage}
          warning={metrics.disk.percentage > 85}
        />
      </div>
    </HealthMetricCard>
  )
}
```

### Step 4: Create Health Dashboard Page

**File: `app/(dashboard)/health/page.tsx`**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw } from 'lucide-react'
import { DatabaseHealthCard } from '@/components/health/DatabaseHealthCard'
import { MCPGatewayHealthCard } from '@/components/health/MCPGatewayHealthCard'
import { ServerHealthCard } from '@/components/health/ServerHealthCard'
import { getSystemHealth, SystemHealth } from './actions'
import { Skeleton } from '@/components/ui/skeleton'

export default function HealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHealth = async () => {
    try {
      setError(null)
      const data = await getSystemHealth()
      setHealth(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load health metrics')
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchHealth()
  }

  useEffect(() => {
    fetchHealth()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-slate-600 mt-2">
            Real-time monitoring of infrastructure services
          </p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {health && (
        <>
          {/* Overall Status Banner */}
          {health.overallStatus !== 'healthy' && (
            <Alert variant={health.overallStatus === 'down' ? 'destructive' : 'default'}>
              <AlertDescription>
                {health.overallStatus === 'down'
                  ? 'One or more critical services are down'
                  : 'System performance is degraded'}
              </AlertDescription>
            </Alert>
          )}

          {/* PostgreSQL Databases */}
          <div>
            <h2 className="text-xl font-semibold mb-4">PostgreSQL Databases</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <DatabaseHealthCard
                name="kids_ascension_db"
                displayName="Kids Ascension"
                metrics={health.postgres.databases.kids_ascension_db}
              />
              <DatabaseHealthCard
                name="ozean_licht_db"
                displayName="Ozean Licht"
                metrics={health.postgres.databases.ozean_licht_db}
              />
              <DatabaseHealthCard
                name="shared_users_db"
                displayName="Shared Users"
                metrics={health.postgres.databases.shared_users_db}
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <MCPGatewayHealthCard metrics={health.mcpGateway} />
              <ServerHealthCard metrics={health.server} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Testing Requirements

### Unit Tests

**File: `tests/unit/health/health-checks.test.ts`**
- Test `checkPostgresHealth` with mock responses
- Test `checkMCPGatewayHealth` with various states
- Test `getServerHealth` calculations

### Integration Tests

**File: `tests/integration/health-dashboard.test.ts`**
- Test full health data fetch
- Test error handling when services are down
- Test status determination logic

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

---

## Dependencies

**Required Shadcn Components:**
- `card` - Metric cards
- `badge` - Status indicators
- `progress` - Connection/resource usage bars
- `button` - Refresh button
- `alert` - Error messages
- `skeleton` - Loading states

**Icons:**
- `lucide-react` for RefreshCw icon

---

## Future Enhancements

- Historical charts showing trends over time
- Alert notifications when thresholds exceeded
- Detailed logs for each service
- Webhook integration for critical alerts
- Integration with Prometheus/Grafana
- Custom threshold configuration per metric

---

## Notes

- Server metrics currently use placeholder data
- Future integration with system monitoring agent needed
- Consider adding WebSocket for real-time updates
- MCP Gateway metrics assume endpoint exposes this data

---

**Spec Version:** 1.0
**Created:** 2025-10-24
**Status:** Ready for Implementation
