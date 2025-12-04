/**
 * Support Analytics Dashboard Page
 *
 * Comprehensive analytics dashboard for support performance monitoring.
 * Displays metrics, trends, breakdowns, and agent performance data.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  Users,
  PieChart,
  Clock,
  MessageSquare,
  Star,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import type { SupportStats } from '@/types/support';
import { formatResponseTime, formatCSATScore } from '@/types/support';

// Types for analytics data
interface TrendPoint {
  period: string;
  avgMinutes: number;
}

interface CSATTrendPoint {
  date: string;
  score: number;
  count: number;
}

interface VolumeTrendPoint {
  date: string;
  new: number;
  resolved: number;
}

interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalConversations: number;
  resolvedConversations: number;
  avgResponseTimeMinutes: number;
  csatAverage: number;
}

interface TrendsData {
  responseTimeTrend: TrendPoint[];
  csatTrend: CSATTrendPoint[];
  volumeTrend: VolumeTrendPoint[];
}

interface BreakdownData {
  byChannel: Record<string, number>;
  byTeam: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

interface AgentsData {
  agents: AgentPerformance[];
}

// Chart colors
const COLORS = {
  primary: '#0ec2bc',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280',
};

const CHANNEL_COLORS: Record<string, string> = {
  web_widget: '#0ec2bc',
  email: '#3B82F6',
  whatsapp: '#25D366',
  telegram: '#0088cc',
};

const TEAM_COLORS: Record<string, string> = {
  tech: '#3B82F6',
  sales: '#10B981',
  spiritual: '#8B5CF6',
  general: '#6B7280',
};

const STATUS_COLORS: Record<string, string> = {
  open: '#10B981',
  pending: '#F59E0B',
  resolved: '#3B82F6',
  snoozed: '#6B7280',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#6B7280',
  normal: '#3B82F6',
  high: '#F59E0B',
  urgent: '#EF4444',
};

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !label) return null;

  return (
    <div className="bg-[#00111A] border border-[#0E282E] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#C4C8D4]">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for charts
function ChartSkeleton() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="space-y-4 w-full px-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  trendUp?: boolean;
}) {
  return (
    <Card className="glass-card glass-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#C4C8D4]">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trendUp ? (
              <ArrowUp className="h-3 w-3 text-green-400" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-400" />
            )}
            <span className={`text-xs ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trend}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SupportAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownData | null>(null);
  const [agents, setAgents] = useState<AgentsData | null>(null);

  // Calculate date range
  const getDateRange = useCallback(() => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
    }
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [dateRange]);

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange();

    try {
      // Always fetch overview stats
      const statsResponse = await fetch('/api/support/analytics?type=overview');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data.stats);
      } else {
        const errorData = await statsResponse.json().catch(() => ({ error: 'Unknown error' }));
        toast.error('Failed to load overview stats', {
          description: errorData.error || 'Please try refreshing the page',
        });
      }

      // Fetch tab-specific data
      if (activeTab === 'trends' || activeTab === 'overview') {
        const trendsResponse = await fetch(
          `/api/support/analytics?type=trends&startDate=${startDate}&endDate=${endDate}`
        );
        if (trendsResponse.ok) {
          const data = await trendsResponse.json();
          setTrends(data);
        } else {
          const errorData = await trendsResponse.json().catch(() => ({ error: 'Unknown error' }));
          toast.error('Failed to load trends data', {
            description: errorData.error || 'Please try refreshing the page',
          });
        }
      }

      if (activeTab === 'breakdown' || activeTab === 'overview') {
        const breakdownResponse = await fetch(
          `/api/support/analytics?type=breakdown&startDate=${startDate}&endDate=${endDate}`
        );
        if (breakdownResponse.ok) {
          const data = await breakdownResponse.json();
          setBreakdown(data);
        } else {
          const errorData = await breakdownResponse.json().catch(() => ({ error: 'Unknown error' }));
          toast.error('Failed to load breakdown data', {
            description: errorData.error || 'Please try refreshing the page',
          });
        }
      }

      if (activeTab === 'agents') {
        const agentsResponse = await fetch(
          `/api/support/analytics?type=agents&startDate=${startDate}&endDate=${endDate}`
        );
        if (agentsResponse.ok) {
          const data = await agentsResponse.json();
          setAgents(data);
        } else {
          const errorData = await agentsResponse.json().catch(() => ({ error: 'Unknown error' }));
          toast.error('Failed to load agent performance data', {
            description: errorData.error || 'Please try refreshing the page',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to fetch analytics', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, getDateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare pie chart data
  interface ChartDataPoint {
    name: string;
    value: number;
    color: string;
  }

  const prepareChartData = (
    data: Record<string, number>,
    colorMap: Record<string, string>
  ): ChartDataPoint[] => {
    return Object.entries(data).map(([name, value]) => ({
      name: name.replace('_', ' ').charAt(0).toUpperCase() + name.replace('_', ' ').slice(1),
      value,
      color: colorMap[name] || COLORS.muted,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-decorative text-white">Support Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics and insights for your support team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={dateRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={dateRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={dateRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Open Conversations"
              value={stats.openConversations}
              subtitle={`${stats.pendingConversations} pending response`}
              icon={MessageSquare}
            />
            <StatCard
              title="Today's Activity"
              value={stats.conversationsToday}
              subtitle={`${stats.resolvedToday} resolved`}
              icon={TrendingUp}
            />
            <StatCard
              title="Avg Response Time"
              value={formatResponseTime(stats.avgResponseTimeMinutes)}
              subtitle="First response to customers"
              icon={Clock}
            />
            <StatCard
              title="CSAT Score"
              value={stats.csatScore > 0 ? `${stats.csatScore.toFixed(1)}/5` : 'N/A'}
              subtitle={stats.csatScore > 0 ? formatCSATScore(stats.csatScore) : 'No ratings yet'}
              icon={Star}
            />
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#00111A] border border-[#0E282E]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="breakdown"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Users className="h-4 w-4 mr-2" />
            Agents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Response Time Trend */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response Time Trend
                </CardTitle>
                <CardDescription>Average first response time over period</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !trends ? (
                  <ChartSkeleton />
                ) : trends.responseTimeTrend.length > 0 ? (
                  <div role="img" aria-label="Response time trend chart showing average first response time over the selected period">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trends.responseTimeTrend}>
                      <defs>
                        <linearGradient id="gradientResponse" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                      <XAxis
                        dataKey="period"
                        tickFormatter={formatDate}
                        stroke="#C4C8D4"
                        tick={{ fill: '#C4C8D4', fontSize: 12 }}
                        axisLine={{ stroke: '#0E282E' }}
                      />
                      <YAxis
                        stroke="#C4C8D4"
                        tick={{ fill: '#C4C8D4', fontSize: 12 }}
                        axisLine={{ stroke: '#0E282E' }}
                        tickFormatter={(v) => `${v}m`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="avgMinutes"
                        name="Avg Minutes"
                        stroke={COLORS.primary}
                        fill="url(#gradientResponse)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No response time data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversation Volume */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Conversation Volume
                </CardTitle>
                <CardDescription>New vs resolved conversations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !trends ? (
                  <ChartSkeleton />
                ) : trends.volumeTrend.length > 0 ? (
                  <div role="img" aria-label="Conversation volume chart comparing new and resolved conversations over time">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={trends.volumeTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        stroke="#C4C8D4"
                        tick={{ fill: '#C4C8D4', fontSize: 12 }}
                        axisLine={{ stroke: '#0E282E' }}
                      />
                      <YAxis
                        stroke="#C4C8D4"
                        tick={{ fill: '#C4C8D4', fontSize: 12 }}
                        axisLine={{ stroke: '#0E282E' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 20 }}
                        formatter={(value) => (
                          <span className="text-[#C4C8D4] text-sm">{value}</span>
                        )}
                      />
                      <Bar dataKey="new" name="New" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" name="Resolved" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No volume data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6 space-y-6">
          {/* CSAT Trend */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                CSAT Score Trend
              </CardTitle>
              <CardDescription>Customer satisfaction over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !trends ? (
                <ChartSkeleton />
              ) : trends.csatTrend.length > 0 ? (
                <div role="img" aria-label="CSAT score trend chart showing customer satisfaction ratings over time">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends.csatTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#C4C8D4"
                      tick={{ fill: '#C4C8D4', fontSize: 12 }}
                      axisLine={{ stroke: '#0E282E' }}
                    />
                    <YAxis
                      domain={[1, 5]}
                      stroke="#C4C8D4"
                      tick={{ fill: '#C4C8D4', fontSize: 12 }}
                      axisLine={{ stroke: '#0E282E' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 20 }}
                      formatter={(value) => (
                        <span className="text-[#C4C8D4] text-sm">{value}</span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="CSAT Score"
                      stroke={COLORS.warning}
                      strokeWidth={2}
                      dot={{ fill: COLORS.warning, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No CSAT data available yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response and Resolution Time Comparison */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Response Time Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {loading || !trends ? (
                  <ChartSkeleton />
                ) : trends.responseTimeTrend.length > 0 ? (
                  <div role="img" aria-label="Detailed response time trend showing average response minutes">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={trends.responseTimeTrend}>
                      <defs>
                        <linearGradient id="gradientResp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                      <XAxis dataKey="period" tickFormatter={formatDate} stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <YAxis stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="avgMinutes" name="Minutes" stroke={COLORS.primary} fill="url(#gradientResp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {loading || !trends ? (
                  <ChartSkeleton />
                ) : trends.volumeTrend.length > 0 ? (
                  <div role="img" aria-label="Volume trend chart showing new and resolved conversations by date">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={trends.volumeTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={formatDate} stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <YAxis stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="new" name="New" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="resolved" name="Resolved" stroke={COLORS.success} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* By Channel */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">By Channel</CardTitle>
                <CardDescription>Conversation distribution across channels</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !breakdown ? (
                  <ChartSkeleton />
                ) : Object.keys(breakdown.byChannel).length > 0 ? (
                  <div role="img" aria-label="Pie chart showing conversation distribution across different communication channels">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                      <Pie
                        data={prepareChartData(breakdown.byChannel, CHANNEL_COLORS)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {prepareChartData(breakdown.byChannel, CHANNEL_COLORS).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend formatter={(value) => <span className="text-[#C4C8D4] text-sm">{value}</span>} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No channel data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* By Team */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">By Team</CardTitle>
                <CardDescription>Conversation distribution across teams</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !breakdown ? (
                  <ChartSkeleton />
                ) : Object.keys(breakdown.byTeam).length > 0 ? (
                  <div role="img" aria-label="Pie chart showing conversation distribution across support teams">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={prepareChartData(breakdown.byTeam, TEAM_COLORS)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {prepareChartData(breakdown.byTeam, TEAM_COLORS).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend formatter={(value) => <span className="text-[#C4C8D4] text-sm">{value}</span>} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No team data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* By Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">By Status</CardTitle>
                <CardDescription>Current conversation status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !breakdown ? (
                  <ChartSkeleton />
                ) : Object.keys(breakdown.byStatus).length > 0 ? (
                  <div role="img" aria-label="Bar chart showing conversation counts by status">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={prepareChartData(breakdown.byStatus, STATUS_COLORS)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" horizontal={false} />
                      <XAxis type="number" stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                        {prepareChartData(breakdown.byStatus, STATUS_COLORS).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No status data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* By Priority */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">By Priority</CardTitle>
                <CardDescription>Conversation priority distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {loading || !breakdown ? (
                  <ChartSkeleton />
                ) : Object.keys(breakdown.byPriority).length > 0 ? (
                  <div role="img" aria-label="Bar chart showing conversation counts by priority level">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={prepareChartData(breakdown.byPriority, PRIORITY_COLORS)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" horizontal={false} />
                      <XAxis type="number" stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" stroke="#C4C8D4" tick={{ fill: '#C4C8D4', fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                        {prepareChartData(breakdown.byPriority, PRIORITY_COLORS).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No priority data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Agent Performance
              </CardTitle>
              <CardDescription>Individual agent metrics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : agents && agents.agents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#0E282E]">
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#C4C8D4]">Agent</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-[#C4C8D4]">Conversations</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-[#C4C8D4]">Resolved</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-[#C4C8D4]">Resolution Rate</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-[#C4C8D4]">Avg Response</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-[#C4C8D4]">CSAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.agents.map((agent) => {
                        const resolutionRate =
                          agent.totalConversations > 0
                            ? Math.round((agent.resolvedConversations / agent.totalConversations) * 100)
                            : 0;

                        return (
                          <tr key={agent.agentId} className="border-b border-[#0E282E]/50 hover:bg-card/30">
                            <td className="py-3 px-4">
                              <div className="font-medium text-white">{agent.agentName}</div>
                            </td>
                            <td className="py-3 px-4 text-center text-white">{agent.totalConversations}</td>
                            <td className="py-3 px-4 text-center text-white">{agent.resolvedConversations}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                variant={resolutionRate >= 80 ? 'default' : resolutionRate >= 60 ? 'secondary' : 'outline'}
                                className={resolutionRate >= 80 ? 'bg-green-500/20 text-green-400' : ''}
                              >
                                {resolutionRate}%
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center text-white">
                              {formatResponseTime(agent.avgResponseTimeMinutes)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {agent.csatAverage > 0 ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-400" />
                                  <span className="text-white">{agent.csatAverage.toFixed(1)}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agent performance data available</p>
                  <p className="text-sm mt-1">Assign agents to conversations to see their metrics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
