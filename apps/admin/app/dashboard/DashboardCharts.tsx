'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@shared/ui'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

// Sample data for the chart
const chartData = [
  { month: 'Jan', users: 186, sessions: 80 },
  { month: 'Feb', users: 305, sessions: 200 },
  { month: 'Mar', users: 237, sessions: 120 },
  { month: 'Apr', users: 273, sessions: 190 },
  { month: 'May', users: 209, sessions: 130 },
  { month: 'Jun', users: 314, sessions: 140 },
]

const chartConfig = {
  users: {
    label: 'Users',
    color: '#0ec2bc',
  },
  sessions: {
    label: 'Sessions',
    color: '#055D75',
  },
}

// Growth Index Data (SuperAdmin only)
const growthTrendData = [
  { month: 'Jan', ozeanLicht: 450, kidsAscension: 320, total: 770 },
  { month: 'Feb', ozeanLicht: 580, kidsAscension: 410, total: 990 },
  { month: 'Mar', ozeanLicht: 720, kidsAscension: 530, total: 1250 },
  { month: 'Apr', ozeanLicht: 890, kidsAscension: 680, total: 1570 },
  { month: 'May', ozeanLicht: 1100, kidsAscension: 850, total: 1950 },
  { month: 'Jun', ozeanLicht: 1350, kidsAscension: 1020, total: 2370 },
]

const engagementData = [
  { month: 'Jan', engagement: 65 },
  { month: 'Feb', engagement: 72 },
  { month: 'Mar', engagement: 68 },
  { month: 'Apr', engagement: 78 },
  { month: 'May', engagement: 82 },
  { month: 'Jun', engagement: 85 },
]

const platformDistribution = [
  { name: 'Ozean Licht', value: 1350, color: '#0ec2bc' },
  { name: 'Kids Ascension', value: 1020, color: '#055D75' },
  { name: 'Admin Dashboard', value: 89, color: '#0E282E' },
]

const growthConfig = {
  ozeanLicht: {
    label: 'Ozean Licht',
    color: '#0ec2bc',
  },
  kidsAscension: {
    label: 'Kids Ascension',
    color: '#055D75',
  },
  total: {
    label: 'Total',
    color: '#C4C8D4',
  },
  engagement: {
    label: 'Engagement %',
    color: '#0ec2bc',
  },
}

export function ActivityChart() {
  return (
    <div className="glass-card-strong rounded-2xl overflow-hidden mb-10">
      <div className="px-6 py-6 border-b border-primary/20">
        <h2 className="text-2xl font-decorative text-white">Platform Activity</h2>
        <p className="mt-2 text-sm font-sans text-[#C4C8D4]">
          User growth and session activity over the last 6 months
        </p>
      </div>
      <div className="p-6">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" />
            <XAxis
              dataKey="month"
              stroke="#C4C8D4"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#C4C8D4"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="users"
              fill="var(--color-users)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="sessions"
              fill="var(--color-sessions)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export function GrowthIndexCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Multi-Platform Growth Trend */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-6 border-b border-primary/20">
          <h3 className="text-xl font-decorative text-white">Platform Growth Trend</h3>
          <p className="mt-2 text-sm font-sans text-[#C4C8D4]">
            User growth across Ozean Licht and Kids Ascension
          </p>
        </div>
        <div className="p-6">
          <ChartContainer config={growthConfig} className="h-[300px] w-full">
            <LineChart data={growthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" />
              <XAxis
                dataKey="month"
                stroke="#C4C8D4"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#C4C8D4"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="ozeanLicht"
                stroke="var(--color-ozeanLicht)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="kidsAscension"
                stroke="var(--color-kidsAscension)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-6 border-b border-primary/20">
          <h3 className="text-xl font-decorative text-white">User Engagement Rate</h3>
          <p className="mt-2 text-sm font-sans text-[#C4C8D4]">
            Average engagement percentage over time
          </p>
        </div>
        <div className="p-6">
          <ChartContainer config={growthConfig} className="h-[300px] w-full">
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0E282E" />
              <XAxis
                dataKey="month"
                stroke="#C4C8D4"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#C4C8D4"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="var(--color-engagement)"
                fill="var(--color-engagement)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="glass-card-strong rounded-2xl overflow-hidden lg:col-span-2">
        <div className="px-6 py-6 border-b border-primary/20">
          <h3 className="text-xl font-decorative text-white">Platform Distribution</h3>
          <p className="mt-2 text-sm font-sans text-[#C4C8D4]">
            Current user distribution across all platforms
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2">
              <ChartContainer config={growthConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#0ec2bc"
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            {/* Stats List */}
            <div className="w-full lg:w-1/2 space-y-4">
              {platformDistribution.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#00111A] border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="font-sans text-white">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-sans font-medium text-white">
                      {platform.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-[#C4C8D4]">
                      {((platform.value / platformDistribution.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
