import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from './StatsCard';
import type { Stat } from '../types';
import { Users, BookOpen, Star, Award, TrendingUp, DollarSign, Clock, Target } from 'lucide-react';

/**
 * StatsCard displays key metrics and statistics with optional trend indicators and icons.
 * Perfect for dashboards, analytics pages, and KPI displays.
 *
 * ## Features
 * - Large, prominent value display with primary color
 * - Descriptive label for context
 * - Optional trend indicators (up/down/neutral) with icons
 * - Optional decorative icon with opacity effect
 * - Percentage/value change display
 * - Glass morphism card with hover effects
 * - Color-coded trends (green=up, red=down, gray=neutral)
 * - Responsive layout optimized for dashboard grids
 * - Supports numeric and text-based values
 *
 * ## Usage
 * ```tsx
 * import { StatsCard } from '@ozean-licht/shared-ui/compositions'
 * import { Users } from 'lucide-react'
 *
 * <StatsCard
 *   stat={{
 *     label: 'Total Students',
 *     value: '12,543',
 *     trend: 'up',
 *     trendValue: '+12.5%',
 *     icon: <Users className="w-12 h-12" />
 *   }}
 *   showTrend={true}
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Cards/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Statistics card composition for displaying metrics, KPIs, and analytics data. Features trend indicators, decorative icons, and glass morphism design optimized for Ozean Licht branding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stat: {
      description: 'Statistics data object with label, value, trend, and optional icon',
      control: 'object',
    },
    className: {
      description: 'Custom className for styling',
      control: 'text',
    },
    showTrend: {
      description: 'Display trend indicator with icon and value',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample statistics data for Ozean Licht and Kids Ascension platforms

const studentsStat: Stat = {
  id: '1',
  label: 'Total Students',
  value: '12,543',
  trend: 'up',
  trendValue: '+12.5%',
  icon: <Users className="w-12 h-12" />,
};

const coursesStat: Stat = {
  id: '2',
  label: 'Active Courses',
  value: '48',
  trend: 'up',
  trendValue: '+8 this month',
  icon: <BookOpen className="w-12 h-12" />,
};

const ratingsStat: Stat = {
  id: '3',
  label: 'Average Rating',
  value: '4.9',
  trend: 'up',
  trendValue: '+0.2',
  icon: <Star className="w-12 h-12" />,
};

const completionStat: Stat = {
  id: '4',
  label: 'Completion Rate',
  value: '87%',
  trend: 'up',
  trendValue: '+5%',
  icon: <Award className="w-12 h-12" />,
};

const revenueStat: Stat = {
  id: '5',
  label: 'Monthly Revenue',
  value: '€24,589',
  trend: 'up',
  trendValue: '+18.2%',
  icon: <DollarSign className="w-12 h-12" />,
};

const watchTimeStat: Stat = {
  id: '6',
  label: 'Total Watch Time',
  value: '3,420h',
  trend: 'up',
  trendValue: '+420h',
  icon: <Clock className="w-12 h-12" />,
};

const enrollmentDeclineStat: Stat = {
  id: '7',
  label: 'Enrollment Rate',
  value: '68%',
  trend: 'down',
  trendValue: '-3.2%',
  icon: <TrendingUp className="w-12 h-12" />,
};

const neutralStat: Stat = {
  id: '8',
  label: 'Active Sessions',
  value: '2,108',
  trend: 'neutral',
  trendValue: '±0%',
  icon: <Target className="w-12 h-12" />,
};

const noIconStat: Stat = {
  id: '9',
  label: 'Community Members',
  value: '8,432',
  trend: 'up',
  trendValue: '+156 today',
};

const noTrendStat: Stat = {
  id: '10',
  label: 'Total Certificates',
  value: '5,823',
  icon: <Award className="w-12 h-12" />,
};

const largeNumberStat: Stat = {
  id: '11',
  label: 'Meditation Minutes',
  value: '1.2M',
  trend: 'up',
  trendValue: '+340K',
  icon: <Clock className="w-12 h-12" />,
};

const smallNumberStat: Stat = {
  id: '12',
  label: 'Premium Courses',
  value: '12',
  trend: 'up',
  trendValue: '+2',
  icon: <BookOpen className="w-12 h-12" />,
};

const textValueStat: Stat = {
  id: '13',
  label: 'Status',
  value: 'Excellent',
  trend: 'up',
  trendValue: 'Improving',
  icon: <Star className="w-12 h-12" />,
};

const longLabelStat: Stat = {
  id: '14',
  label: 'Average Course Completion Time (Days)',
  value: '28',
  trend: 'down',
  trendValue: '-4 days',
  icon: <Clock className="w-12 h-12" />,
};

/**
 * Default stats card with upward trend
 */
export const Default: Story = {
  args: {
    stat: studentsStat,
    showTrend: true,
  },
};

/**
 * Stats card with downward trend (red indicator)
 */
export const DownwardTrend: Story = {
  args: {
    stat: enrollmentDeclineStat,
    showTrend: true,
  },
};

/**
 * Stats card with neutral trend (gray indicator)
 */
export const NeutralTrend: Story = {
  args: {
    stat: neutralStat,
    showTrend: true,
  },
};

/**
 * Stats card without icon
 */
export const NoIcon: Story = {
  args: {
    stat: noIconStat,
    showTrend: true,
  },
};

/**
 * Stats card without trend indicator
 */
export const NoTrend: Story = {
  args: {
    stat: noTrendStat,
    showTrend: false,
  },
};

/**
 * Stats card with trend hidden via prop
 */
export const TrendHidden: Story = {
  args: {
    stat: studentsStat,
    showTrend: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with trend data available but hidden via showTrend=false prop.',
      },
    },
  },
};

/**
 * Course statistics card
 */
export const CourseStats: Story = {
  args: {
    stat: coursesStat,
    showTrend: true,
  },
};

/**
 * Rating statistics card
 */
export const RatingStats: Story = {
  args: {
    stat: ratingsStat,
    showTrend: true,
  },
};

/**
 * Completion rate card
 */
export const CompletionRate: Story = {
  args: {
    stat: completionStat,
    showTrend: true,
  },
};

/**
 * Revenue statistics card
 */
export const RevenueStats: Story = {
  args: {
    stat: revenueStat,
    showTrend: true,
  },
};

/**
 * Watch time statistics card
 */
export const WatchTime: Story = {
  args: {
    stat: watchTimeStat,
    showTrend: true,
  },
};

/**
 * Stats card with large number (millions)
 */
export const LargeNumber: Story = {
  args: {
    stat: largeNumberStat,
    showTrend: true,
  },
};

/**
 * Stats card with small number
 */
export const SmallNumber: Story = {
  args: {
    stat: smallNumberStat,
    showTrend: true,
  },
};

/**
 * Stats card with text value (non-numeric)
 */
export const TextValue: Story = {
  args: {
    stat: textValueStat,
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card displaying text values instead of numbers.',
      },
    },
  },
};

/**
 * Stats card with long label
 */
export const LongLabel: Story = {
  args: {
    stat: longLabelStat,
    showTrend: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with longer label text demonstrating text wrapping.',
      },
    },
  },
};

/**
 * Minimal stats card (no icon, no trend)
 */
export const Minimal: Story = {
  args: {
    stat: {
      label: 'Active Users',
      value: '342',
    },
    showTrend: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal stats card with only label and value.',
      },
    },
  },
};

/**
 * Stats card with custom styling
 */
export const CustomStyling: Story = {
  args: {
    stat: studentsStat,
    showTrend: true,
    className: 'shadow-[0_0_30px_rgba(14,194,188,0.4)] scale-105',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stats card with custom className for enhanced turquoise glow effect.',
      },
    },
  },
};

/**
 * Dashboard grid layout with 2 columns
 */
export const TwoColumnGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Two-column grid layout for side-by-side stat comparison.',
      },
    },
  },
};

/**
 * Dashboard grid layout with 3 columns
 */
export const ThreeColumnGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Three-column responsive grid layout for dashboard KPIs.',
      },
    },
  },
};

/**
 * Dashboard grid layout with 4 columns
 */
export const FourColumnGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
      <StatsCard stat={completionStat} showTrend />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Four-column grid layout for comprehensive dashboard overview.',
      },
    },
  },
};

/**
 * Full dashboard metrics view
 */
export const FullDashboard: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard stat={revenueStat} showTrend />
          <StatsCard stat={watchTimeStat} showTrend />
          <StatsCard stat={enrollmentDeclineStat} showTrend />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Community Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard stat={noIconStat} showTrend />
          <StatsCard stat={neutralStat} showTrend />
          <StatsCard stat={noTrendStat} showTrend={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete dashboard view with multiple stat categories and metrics.',
      },
    },
  },
};

/**
 * All trend types showcase
 */
export const AllTrendTypes: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-5xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Upward Trends (Green)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Downward Trends (Red)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={enrollmentDeclineStat} showTrend />
          <StatsCard stat={longLabelStat} showTrend />
          <StatsCard
            stat={{
              label: 'Response Time',
              value: '2.4s',
              trend: 'down',
              trendValue: '-0.6s',
              icon: <Clock className="w-12 h-12" />,
            }}
            showTrend
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Neutral Trends (Gray)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard stat={neutralStat} showTrend />
          <StatsCard
            stat={{
              label: 'Pending Reviews',
              value: '42',
              trend: 'neutral',
              trendValue: 'Stable',
              icon: <Star className="w-12 h-12" />,
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Server Uptime',
              value: '99.9%',
              trend: 'neutral',
              trendValue: 'No change',
              icon: <Target className="w-12 h-12" />,
            }}
            showTrend
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all trend indicator types with color coding.',
      },
    },
  },
};

/**
 * All variations showcase
 */
export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">With Icons & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend={false} />
          <StatsCard stat={coursesStat} showTrend={false} />
          <StatsCard stat={ratingsStat} showTrend={false} />
          <StatsCard stat={noTrendStat} showTrend={false} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Without Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={noIconStat} showTrend />
          <StatsCard
            stat={{
              label: 'Downloads',
              value: '15.2K',
              trend: 'up',
              trendValue: '+2.1K',
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Subscribers',
              value: '8,945',
              trend: 'up',
              trendValue: '+234',
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Shares',
              value: '1,823',
              trend: 'up',
              trendValue: '+45',
            }}
            showTrend
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Minimal (No Icons, No Trends)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={{ label: 'Views', value: '24.5K' }} showTrend={false} />
          <StatsCard stat={{ label: 'Clicks', value: '8,432' }} showTrend={false} />
          <StatsCard stat={{ label: 'Conversions', value: '342' }} showTrend={false} />
          <StatsCard stat={{ label: 'Impressions', value: '145K' }} showTrend={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete showcase of all stat card variations and combinations.',
      },
    },
  },
};

/**
 * Cosmic dark theme showcase
 */
export const CosmicTheme: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1A] via-[#1a1f2e] to-[#0A0F1A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Platform Analytics</h1>
          <p className="text-[var(--muted-foreground)] text-lg">Real-time metrics from Ozean Licht</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard stat={studentsStat} showTrend />
          <StatsCard stat={coursesStat} showTrend />
          <StatsCard stat={ratingsStat} showTrend />
          <StatsCard stat={completionStat} showTrend />
          <StatsCard stat={revenueStat} showTrend />
          <StatsCard stat={watchTimeStat} showTrend />
          <StatsCard stat={enrollmentDeclineStat} showTrend />
          <StatsCard stat={neutralStat} showTrend />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Stats cards displayed on cosmic dark background with Ozean Licht branding.',
      },
    },
  },
};

/**
 * Mobile view (narrow container)
 */
export const MobileView: Story = {
  args: {
    stat: studentsStat,
    showTrend: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[320px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Stats card optimized for mobile viewports.',
      },
    },
  },
};

/**
 * Stacked mobile layout
 */
export const MobileStacked: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-[360px]">
      <StatsCard stat={studentsStat} showTrend />
      <StatsCard stat={coursesStat} showTrend />
      <StatsCard stat={ratingsStat} showTrend />
      <StatsCard stat={enrollmentDeclineStat} showTrend />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Vertically stacked stats cards for mobile dashboard view.',
      },
    },
  },
};

/**
 * Kids Ascension metrics
 */
export const KidsAscensionMetrics: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Kids Ascension - Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            stat={{
              label: 'Active Kids',
              value: '3,845',
              trend: 'up',
              trendValue: '+234 this week',
              icon: <Users className="w-12 h-12" />,
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Learning Activities',
              value: '127',
              trend: 'up',
              trendValue: '+12 new',
              icon: <BookOpen className="w-12 h-12" />,
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Average Age',
              value: '8.5',
              trend: 'neutral',
              trendValue: 'Stable',
              icon: <Target className="w-12 h-12" />,
            }}
            showTrend
          />
          <StatsCard
            stat={{
              label: 'Parent Satisfaction',
              value: '97%',
              trend: 'up',
              trendValue: '+2%',
              icon: <Star className="w-12 h-12" />,
            }}
            showTrend
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Dashboard metrics specifically for Kids Ascension educational platform.',
      },
    },
  },
};

/**
 * Real-time metrics simulation
 */
export const RealTimeMetrics: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Live Metrics</h2>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Updated in real-time</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          stat={{
            label: 'Online Now',
            value: '1,234',
            trend: 'up',
            trendValue: '+56',
            icon: <Users className="w-12 h-12" />,
          }}
          showTrend
        />
        <StatsCard
          stat={{
            label: 'Active Sessions',
            value: '842',
            trend: 'up',
            trendValue: '+23',
            icon: <Clock className="w-12 h-12" />,
          }}
          showTrend
        />
        <StatsCard
          stat={{
            label: 'Current Revenue',
            value: '€1,245',
            trend: 'up',
            trendValue: '+€89',
            icon: <DollarSign className="w-12 h-12" />,
          }}
          showTrend
        />
        <StatsCard
          stat={{
            label: 'Lessons Started',
            value: '345',
            trend: 'up',
            trendValue: '+12',
            icon: <BookOpen className="w-12 h-12" />,
          }}
          showTrend
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Real-time metrics dashboard with live update indicator.',
      },
    },
  },
};
