import type { Meta, StoryObj } from '@storybook/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from './chart';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';

/**
 * Chart component built on Recharts library.
 *
 * **This is a Tier 1 Primitive** - Recharts wrapper with shadcn styling and configuration system.
 * No Tier 2 branded version exists for charts.
 *
 * ## Key Components
 * - **ChartContainer**: Root wrapper providing context and responsive sizing
 * - **ChartTooltip**: Tooltip component from Recharts
 * - **ChartTooltipContent**: Styled tooltip content with indicator options
 * - **ChartLegend**: Legend component from Recharts
 * - **ChartLegendContent**: Styled legend content
 * - **ChartConfig**: TypeScript type for chart configuration
 *
 * ## Chart Configuration
 * The chart config system provides:
 * - Color theming with CSS variables
 * - Light/dark mode support
 * - Labels and icons for data series
 * - Automatic color application to chart elements
 *
 * ## Component Structure
 * ```tsx
 * <ChartContainer config={chartConfig}>
 *   <LineChart data={data}>
 *     <CartesianGrid />
 *     <XAxis dataKey="name" />
 *     <YAxis />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *     <ChartLegend content={<ChartLegendContent />} />
 *     <Line dataKey="value" stroke="var(--color-value)" />
 *   </LineChart>
 * </ChartContainer>
 * ```
 *
 * ## Available Chart Types
 * - **LineChart**: Trends over time
 * - **BarChart**: Comparisons and categories
 * - **AreaChart**: Volume and trends
 * - **PieChart**: Proportions and percentages
 * - **RadarChart**: Multi-dimensional data
 *
 * ## Use Cases
 * - Analytics dashboards
 * - Data visualization
 * - Performance metrics
 * - Business intelligence
 * - Real-time monitoring
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A collection of chart components built on Recharts with shadcn styling and configuration. Provides LineChart, BarChart, AreaChart, PieChart, and RadarChart with consistent theming.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for various chart types
const monthlyRevenueData = [
  { month: 'Jan', revenue: 12500, expenses: 8200, profit: 4300 },
  { month: 'Feb', revenue: 15800, expenses: 9100, profit: 6700 },
  { month: 'Mar', revenue: 18200, expenses: 10500, profit: 7700 },
  { month: 'Apr', revenue: 21000, expenses: 11200, profit: 9800 },
  { month: 'May', revenue: 19500, expenses: 10800, profit: 8700 },
  { month: 'Jun', revenue: 23400, expenses: 12100, profit: 11300 },
];

const websiteTrafficData = [
  { day: 'Mon', visitors: 2400, pageViews: 4800, bounceRate: 42 },
  { day: 'Tue', visitors: 3200, pageViews: 6200, bounceRate: 38 },
  { day: 'Wed', visitors: 2800, pageViews: 5400, bounceRate: 45 },
  { day: 'Thu', visitors: 3900, pageViews: 7200, bounceRate: 35 },
  { day: 'Fri', visitors: 4100, pageViews: 7800, bounceRate: 32 },
  { day: 'Sat', visitors: 3400, pageViews: 6100, bounceRate: 41 },
  { day: 'Sun', visitors: 2900, pageViews: 5200, bounceRate: 48 },
];

const userDemographicsData = [
  { category: '18-24', value: 2400, color: '#0ec2bc' },
  { category: '25-34', value: 4200, color: '#0ea9a4' },
  { category: '35-44', value: 3100, color: '#0e918c' },
  { category: '45-54', value: 2800, color: '#0e7974' },
  { category: '55+', value: 1900, color: '#0e615d' },
];

const performanceMetricsData = [
  { metric: 'Speed', value: 85, fullMark: 100 },
  { metric: 'Reliability', value: 92, fullMark: 100 },
  { metric: 'Security', value: 88, fullMark: 100 },
  { metric: 'Usability', value: 95, fullMark: 100 },
  { metric: 'Scalability', value: 78, fullMark: 100 },
];

const quarterlyGrowthData = [
  { quarter: 'Q1 2023', growth: 12, target: 15 },
  { quarter: 'Q2 2023', growth: 18, target: 20 },
  { quarter: 'Q3 2023', growth: 24, target: 22 },
  { quarter: 'Q4 2023', growth: 28, target: 25 },
  { quarter: 'Q1 2024', growth: 32, target: 30 },
];

/**
 * Basic line chart showing revenue trends.
 *
 * Demonstrates the fundamental LineChart setup with a single data series.
 */
export const LineChartDefault: Story = {
  render: () => {
    const chartConfig = {
      revenue: {
        label: 'Revenue',
        color: '#0ec2bc',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    );
  },
};

/**
 * Line chart with multiple data series and legend.
 *
 * Shows revenue, expenses, and profit trends with color-coded lines.
 */
export const MultiLineChart: Story = {
  render: () => {
    const chartConfig = {
      revenue: {
        label: 'Revenue',
        color: '#0ec2bc',
      },
      expenses: {
        label: 'Expenses',
        color: '#ef4444',
      },
      profit: {
        label: 'Profit',
        color: '#22c55e',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <LineChart data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="var(--color-profit)"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    );
  },
};

/**
 * Bar chart for categorical comparisons.
 *
 * Perfect for comparing values across different categories or time periods.
 */
export const BarChartDefault: Story = {
  render: () => {
    const chartConfig = {
      visitors: {
        label: 'Visitors',
        color: '#0ec2bc',
      },
      pageViews: {
        label: 'Page Views',
        color: '#3b82f6',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <BarChart data={websiteTrafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pageViews" fill="var(--color-pageViews)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    );
  },
};

/**
 * Area chart for showing volume and trends.
 *
 * Useful for displaying cumulative data or emphasizing magnitude of change.
 */
export const AreaChartDefault: Story = {
  render: () => {
    const chartConfig = {
      visitors: {
        label: 'Visitors',
        color: '#0ec2bc',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={websiteTrafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="var(--color-visitors)"
            fill="var(--color-visitors)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ChartContainer>
    );
  },
};

/**
 * Stacked area chart with multiple data series.
 *
 * Shows how different components contribute to a total value over time.
 */
export const StackedAreaChart: Story = {
  render: () => {
    const chartConfig = {
      visitors: {
        label: 'Visitors',
        color: '#0ec2bc',
      },
      pageViews: {
        label: 'Page Views',
        color: '#3b82f6',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <AreaChart data={websiteTrafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="visitors"
            stackId="1"
            stroke="var(--color-visitors)"
            fill="var(--color-visitors)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stackId="1"
            stroke="var(--color-pageViews)"
            fill="var(--color-pageViews)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ChartContainer>
    );
  },
};

/**
 * Pie chart for showing proportions.
 *
 * Ideal for displaying percentage breakdowns and composition.
 */
export const PieChartDefault: Story = {
  render: () => {
    const chartConfig = {
      value: {
        label: 'Users',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={userDemographicsData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) => `${entry.category}: ${entry.value}`}
          >
            {userDemographicsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  },
};

/**
 * Donut chart variant of pie chart.
 *
 * Uses innerRadius to create a donut/ring chart with center space for labels.
 */
export const DonutChart: Story = {
  render: () => {
    const chartConfig = {
      value: {
        label: 'Users',
      },
    } satisfies ChartConfig;

    const total = userDemographicsData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="relative">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={userDemographicsData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
            >
              {userDemographicsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold">{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Radar chart for multi-dimensional data.
 *
 * Perfect for showing performance across multiple categories or metrics.
 */
export const RadarChartDefault: Story = {
  render: () => {
    const chartConfig = {
      value: {
        label: 'Score',
        color: '#0ec2bc',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <RadarChart data={performanceMetricsData} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="var(--color-value)"
            fill="var(--color-value)"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ChartContainer>
    );
  },
};

/**
 * Chart with custom tooltip styling.
 *
 * Demonstrates different tooltip indicator styles: dot, line, dashed.
 */
export const WithCustomTooltip: Story = {
  render: () => {
    const chartConfig = {
      growth: {
        label: 'Growth',
        color: '#0ec2bc',
      },
      target: {
        label: 'Target',
        color: '#94a3b8',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={quarterlyGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            type="monotone"
            dataKey="growth"
            stroke="var(--color-growth)"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ChartContainer>
    );
  },
};

/**
 * Chart with tooltip using dot indicator.
 *
 * Shows the dot indicator style which is more compact.
 */
export const TooltipDotIndicator: Story = {
  render: () => {
    const chartConfig = {
      revenue: {
        label: 'Revenue',
        color: '#0ec2bc',
      },
      expenses: {
        label: 'Expenses',
        color: '#ef4444',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    );
  },
};

/**
 * Chart with tooltip using dashed indicator.
 *
 * Shows the dashed indicator style for visual distinction.
 */
export const TooltipDashedIndicator: Story = {
  render: () => {
    const chartConfig = {
      visitors: {
        label: 'Visitors',
        color: '#0ec2bc',
      },
      pageViews: {
        label: 'Page Views',
        color: '#3b82f6',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={websiteTrafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="var(--color-visitors)"
            fill="var(--color-visitors)"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stroke="var(--color-pageViews)"
            fill="var(--color-pageViews)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ChartContainer>
    );
  },
};

/**
 * Responsive chart that adapts to container size.
 *
 * ChartContainer automatically provides responsive behavior via ResponsiveContainer.
 */
export const ResponsiveChart: Story = {
  render: () => {
    const chartConfig = {
      revenue: {
        label: 'Revenue',
        color: '#0ec2bc',
      },
    } satisfies ChartConfig;

    return (
      <div className="w-full space-y-4">
        <p className="text-sm text-muted-foreground">
          Resize your browser to see the chart adapt to different widths.
        </p>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  },
};

/**
 * Dashboard with multiple chart types.
 *
 * Example of combining different chart types in a dashboard layout.
 */
export const DashboardMetrics: Story = {
  render: () => {
    const revenueConfig = {
      revenue: { label: 'Revenue', color: '#0ec2bc' },
      profit: { label: 'Profit', color: '#22c55e' },
    } satisfies ChartConfig;

    const trafficConfig = {
      visitors: { label: 'Visitors', color: '#0ec2bc' },
    } satisfies ChartConfig;

    const demographicsConfig = {
      value: { label: 'Users' },
    } satisfies ChartConfig;

    const performanceConfig = {
      value: { label: 'Score', color: '#0ec2bc' },
    } satisfies ChartConfig;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Revenue & Profit</h3>
          <ChartContainer config={revenueConfig} className="h-[250px] w-full">
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="var(--color-profit)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Weekly Traffic</h3>
          <ChartContainer config={trafficConfig} className="h-[250px] w-full">
            <AreaChart data={websiteTrafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="var(--color-visitors)"
                fill="var(--color-visitors)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">User Demographics</h3>
          <ChartContainer config={demographicsConfig} className="h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={userDemographicsData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {userDemographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
          <ChartContainer config={performanceConfig} className="h-[250px] w-full">
            <RadarChart
              data={performanceMetricsData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </div>
    );
  },
};

/**
 * Ozean Licht themed charts.
 *
 * Demonstrates using the Ozean Licht turquoise color (#0ec2bc) as the primary chart color
 * with complementary shades for multi-series data.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const chartConfig = {
      primary: {
        label: 'Primary Metric',
        color: '#0ec2bc', // Ozean Licht turquoise
      },
      secondary: {
        label: 'Secondary Metric',
        color: '#0ea9a4', // Darker shade
      },
      tertiary: {
        label: 'Tertiary Metric',
        color: '#7dd3ce', // Lighter shade
      },
    } satisfies ChartConfig;

    const data = [
      { name: 'Week 1', primary: 4000, secondary: 2400, tertiary: 3200 },
      { name: 'Week 2', primary: 3000, secondary: 1398, tertiary: 2800 },
      { name: 'Week 3', primary: 2000, secondary: 9800, tertiary: 4100 },
      { name: 'Week 4', primary: 2780, secondary: 3908, tertiary: 3600 },
      { name: 'Week 5', primary: 1890, secondary: 4800, tertiary: 2900 },
      { name: 'Week 6', primary: 2390, secondary: 3800, tertiary: 3400 },
    ];

    return (
      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold" style={{ color: '#0ec2bc' }}>
            Line Chart - Ozean Licht Theme
          </h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="primary"
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="var(--color-secondary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="tertiary"
                stroke="var(--color-tertiary)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold" style={{ color: '#0ec2bc' }}>
            Bar Chart - Ozean Licht Theme
          </h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="primary" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="secondary" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tertiary" fill="var(--color-tertiary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold" style={{ color: '#0ec2bc' }}>
            Area Chart - Ozean Licht Theme
          </h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="primary"
                stackId="1"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="secondary"
                stackId="1"
                stroke="var(--color-secondary)"
                fill="var(--color-secondary)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    );
  },
};

/**
 * Chart with custom colors per data point.
 *
 * Shows how to use custom colors for individual data points in charts.
 */
export const CustomColors: Story = {
  render: () => {
    const chartConfig = {
      value: {
        label: 'Value',
      },
    } satisfies ChartConfig;

    const customColorData = [
      { name: 'Excellent', value: 85, color: '#22c55e' },
      { name: 'Good', value: 72, color: '#0ec2bc' },
      { name: 'Average', value: 58, color: '#f59e0b' },
      { name: 'Below Average', value: 42, color: '#ef4444' },
      { name: 'Poor', value: 28, color: '#991b1b' },
    ];

    return (
      <div className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={customColorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {customColorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    );
  },
};

/**
 * Time series data with real-world patterns.
 *
 * Demonstrates realistic time-series data with seasonal patterns and trends.
 */
export const TimeSeriesData: Story = {
  render: () => {
    const chartConfig = {
      sales: {
        label: 'Sales',
        color: '#0ec2bc',
      },
      forecast: {
        label: 'Forecast',
        color: '#94a3b8',
      },
    } satisfies ChartConfig;

    const timeSeriesData = [
      { date: '2024-01', sales: 42000, forecast: null },
      { date: '2024-02', sales: 38000, forecast: null },
      { date: '2024-03', sales: 51000, forecast: null },
      { date: '2024-04', sales: 48000, forecast: null },
      { date: '2024-05', sales: 54000, forecast: null },
      { date: '2024-06', sales: 61000, forecast: null },
      { date: '2024-07', sales: 58000, forecast: null },
      { date: '2024-08', sales: 65000, forecast: null },
      { date: '2024-09', sales: 63000, forecast: 64000 },
      { date: '2024-10', sales: null, forecast: 67000 },
      { date: '2024-11', sales: null, forecast: 70000 },
      { date: '2024-12', sales: null, forecast: 78000 },
    ];

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sales Forecast</h3>
        <p className="text-sm text-muted-foreground">
          Actual sales data (solid line) with forecasted values (dashed line)
        </p>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  },
};

/**
 * Comparison chart with positive/negative values.
 *
 * Shows how to visualize data with both positive and negative values.
 */
export const PositiveNegativeComparison: Story = {
  render: () => {
    const chartConfig = {
      change: {
        label: 'Change %',
        color: '#0ec2bc',
      },
    } satisfies ChartConfig;

    const comparisonData = [
      { category: 'Product A', change: 12 },
      { category: 'Product B', change: -8 },
      { category: 'Product C', change: 24 },
      { category: 'Product D', change: -5 },
      { category: 'Product E', change: 18 },
      { category: 'Product F', change: -12 },
    ];

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Year-over-Year Change</h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="change" radius={[4, 4, 4, 4]}>
              {comparisonData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.change >= 0 ? '#22c55e' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    );
  },
};
