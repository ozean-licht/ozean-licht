import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTab, TabsPanel } from './tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from './card'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Tabs> = {
  title: 'CossUI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tabs component from Coss UI (Base UI) adapted for Ozean Licht design system. Features glass morphism effects, keyboard navigation, and comprehensive accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

/**
 * Default Tabs Story
 * Basic three-tab layout with simple content
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab-1">
      <TabsList>
        <TabsTab value="tab-1">Tab One</TabsTab>
        <TabsTab value="tab-2">Tab Two</TabsTab>
        <TabsTab value="tab-3">Tab Three</TabsTab>
      </TabsList>
      <TabsPanel value="tab-1">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This is the content for the first tab. Tabs help organize related content
          into a compact, navigable interface.
        </p>
      </TabsPanel>
      <TabsPanel value="tab-2">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This is the content for the second tab. Each tab panel is hidden until
          the corresponding tab is selected.
        </p>
      </TabsPanel>
      <TabsPanel value="tab-3">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This is the content for the third tab. Use tabs to switch between
          different views or sections of information.
        </p>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * Horizontal Layout Story
 * Demonstrates the default horizontal tab arrangement
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="details">Details</TabsTab>
          <TabsTab value="analytics">Analytics</TabsTab>
          <TabsTab value="settings">Settings</TabsTab>
        </TabsList>
        <TabsPanel value="overview">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Project Overview</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Get a quick overview of your project status, recent activities, and key metrics.
            </p>
          </div>
        </TabsPanel>
        <TabsPanel value="details">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Project Details</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              View detailed information about project configuration, resources, and metadata.
            </p>
          </div>
        </TabsPanel>
        <TabsPanel value="analytics">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Analytics</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Analyze project performance with detailed charts and statistics.
            </p>
          </div>
        </TabsPanel>
        <TabsPanel value="settings">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Settings</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Configure project settings and preferences.
            </p>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  ),
}

/**
 * Dashboard Example Story
 * Shows tabs used in a typical dashboard layout
 */
export const DashboardExample: Story = {
  render: () => (
    <Tabs defaultValue="dashboard" className="w-full max-w-4xl">
      <TabsList>
        <TabsTab value="dashboard">Dashboard</TabsTab>
        <TabsTab value="reports">Reports</TabsTab>
        <TabsTab value="activity">Activity</TabsTab>
      </TabsList>
      <TabsPanel value="dashboard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
            <h4 className="font-medium text-primary text-sm">Total Users</h4>
            <p className="text-2xl font-decorative text-foreground mt-2">2,543</p>
            <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
          </div>
          <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
            <h4 className="font-medium text-primary text-sm">Active Sessions</h4>
            <p className="text-2xl font-decorative text-foreground mt-2">1,847</p>
            <p className="text-xs text-green-500 mt-1">↑ 8% from last week</p>
          </div>
          <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
            <h4 className="font-medium text-primary text-sm">Conversion Rate</h4>
            <p className="text-2xl font-decorative text-foreground mt-2">3.24%</p>
            <p className="text-xs text-yellow-500 mt-1">→ Same as last month</p>
          </div>
        </div>
      </TabsPanel>
      <TabsPanel value="reports">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Recent Reports</h3>
          <div className="space-y-2">
            <div className="p-3 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground">Monthly Performance Report</p>
              <p className="text-xs text-[#C4C8D4] mt-1">Generated on Nov 19, 2024</p>
            </div>
            <div className="p-3 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground">User Analytics Summary</p>
              <p className="text-xs text-[#C4C8D4] mt-1">Generated on Nov 18, 2024</p>
            </div>
          </div>
        </div>
      </TabsPanel>
      <TabsPanel value="activity">
        <div className="space-y-3">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">Recent activity log:</p>
          <div className="space-y-2">
            <div className="text-xs text-[#C4C8D4]">
              <span className="text-primary">Admin User</span> updated project settings
            </div>
            <div className="text-xs text-[#C4C8D4]">
              <span className="text-primary">System</span> performed automated backup
            </div>
            <div className="text-xs text-[#C4C8D4]">
              <span className="text-primary">Editor</span> published new content
            </div>
          </div>
        </div>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * Settings Panel Example Story
 * Demonstrates tabs used in a settings/configuration interface
 */
export const SettingsPanelExample: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Manage your application preferences and configuration</CardDescription>
      </CardHeader>
      <CardPanel>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTab value="general">General</TabsTab>
            <TabsTab value="security">Security</TabsTab>
            <TabsTab value="notifications">Notifications</TabsTab>
          </TabsList>
          <TabsPanel value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" type="text" placeholder="My App" size="default" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-url">Application URL</Label>
              <Input
                id="app-url"
                type="url"
                placeholder="https://example.com"
                size="default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" type="text" placeholder="UTC" size="default" />
            </div>
          </TabsPanel>
          <TabsPanel value="security" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                placeholder="30"
                size="default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <div className="flex items-center gap-2">
                <input
                  id="2fa"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="2fa" className="text-sm text-[#C4C8D4]">
                  Enable 2FA for all users
                </label>
              </div>
            </div>
          </TabsPanel>
          <TabsPanel value="notifications" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  id="email-notif"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded"
                  defaultChecked
                />
                <label htmlFor="email-notif" className="text-sm text-[#C4C8D4]">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="push-notif"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded"
                  defaultChecked
                />
                <label htmlFor="push-notif" className="text-sm text-[#C4C8D4]">
                  Push notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="sms-notif"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="sms-notif" className="text-sm text-[#C4C8D4]">
                  SMS notifications
                </label>
              </div>
            </div>
          </TabsPanel>
        </Tabs>
      </CardPanel>
    </Card>
  ),
}

/**
 * Content Switcher Story
 * Simple content switcher for view modes or perspectives
 */
export const ContentSwitcher: Story = {
  render: () => (
    <Tabs defaultValue="grid" className="w-full max-w-2xl">
      <TabsList>
        <TabsTab value="grid">Grid View</TabsTab>
        <TabsTab value="list">List View</TabsTab>
        <TabsTab value="table">Table View</TabsTab>
      </TabsList>
      <TabsPanel value="grid">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-card/50 backdrop-blur-8 rounded-lg border border-border flex items-center justify-center"
            >
              <p className="text-sm text-[#C4C8D4]">Item {i + 1}</p>
            </div>
          ))}
        </div>
      </TabsPanel>
      <TabsPanel value="list">
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-3 bg-card/50 backdrop-blur-8 rounded-lg border border-border flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-xs text-primary">•</span>
              </div>
              <span className="text-sm text-[#C4C8D4]">Item {i + 1}</span>
            </div>
          ))}
        </div>
      </TabsPanel>
      <TabsPanel value="table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-primary text-xs font-medium">Name</th>
                <th className="text-left p-2 text-primary text-xs font-medium">Status</th>
                <th className="text-left p-2 text-primary text-xs font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-2 text-[#C4C8D4]">Item {i + 1}</td>
                  <td className="p-2">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                      Active
                    </span>
                  </td>
                  <td className="p-2 text-[#C4C8D4] text-xs">Nov {19 - i}, 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * With Icons Story
 * Demonstrates tabs with emoji icons for visual distinction
 */
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-full max-w-2xl">
      <TabsList>
        <TabsTab value="profile">👤 Profile</TabsTab>
        <TabsTab value="messages">💬 Messages</TabsTab>
        <TabsTab value="notifications">🔔 Notifications</TabsTab>
        <TabsTab value="settings">⚙️ Settings</TabsTab>
      </TabsList>
      <TabsPanel value="profile">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <p className="font-medium text-foreground">John Doe</p>
              <p className="text-xs text-[#C4C8D4]">john@example.com</p>
            </div>
          </div>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Your profile information is displayed here. You can edit your details and manage
            your account settings.
          </p>
        </div>
      </TabsPanel>
      <TabsPanel value="messages">
        <div className="space-y-2">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">No new messages</p>
          <Button variant="outline" size="sm">
            Start a Conversation
          </Button>
        </div>
      </TabsPanel>
      <TabsPanel value="notifications">
        <div className="space-y-3">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            You have 3 unread notifications
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground">System Update</p>
              <p className="text-xs text-[#C4C8D4] mt-1">Your app was updated to v2.0</p>
            </div>
          </div>
        </div>
      </TabsPanel>
      <TabsPanel value="settings">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          Access all your account settings here.
        </p>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * Disabled Tabs Story
 * Shows how disabled tabs appear and behave
 */
export const DisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="enabled-1">
      <TabsList>
        <TabsTab value="enabled-1">Enabled</TabsTab>
        <TabsTab value="disabled" disabled>
          Disabled
        </TabsTab>
        <TabsTab value="enabled-2">Enabled</TabsTab>
      </TabsList>
      <TabsPanel value="enabled-1">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This tab is enabled and can be clicked to view its content.
        </p>
      </TabsPanel>
      <TabsPanel value="disabled">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This content is hidden because the tab is disabled.
        </p>
      </TabsPanel>
      <TabsPanel value="enabled-2">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This tab is also enabled. The disabled tab in the middle cannot be interacted with.
        </p>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * Controlled Component Story
 * Demonstrates how to control tab state externally
 */
export const ControlledComponent: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab-1')

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Active Tab: {activeTab}</p>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'tab-1' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('tab-1')}
            >
              Tab 1
            </Button>
            <Button
              variant={activeTab === 'tab-2' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('tab-2')}
            >
              Tab 2
            </Button>
            <Button
              variant={activeTab === 'tab-3' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('tab-3')}
            >
              Tab 3
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTab value="tab-1">Tab 1</TabsTab>
            <TabsTab value="tab-2">Tab 2</TabsTab>
            <TabsTab value="tab-3">Tab 3</TabsTab>
          </TabsList>
          <TabsPanel value="tab-1">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Content for Tab 1. Tab state is controlled by external React state.
            </p>
          </TabsPanel>
          <TabsPanel value="tab-2">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Content for Tab 2. You can control which tab is active from outside the component.
            </p>
          </TabsPanel>
          <TabsPanel value="tab-3">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Content for Tab 3. This is useful for syncing tabs with URL routes or other state.
            </p>
          </TabsPanel>
        </Tabs>
      </div>
    )
  },
}

/**
 * Many Tabs Story
 * Demonstrates how tabs handle many items
 */
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab-1" className="w-full max-w-4xl">
      <TabsList className="flex-wrap justify-start h-auto gap-1 p-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <TabsTab key={i} value={`tab-${i + 1}`}>
            {i + 1}
          </TabsTab>
        ))}
      </TabsList>
      {Array.from({ length: 10 }).map((_, i) => (
        <TabsPanel key={i} value={`tab-${i + 1}`}>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            This is the content for tab {i + 1}. When you have many tabs, they wrap to
            multiple lines.
          </p>
        </TabsPanel>
      ))}
    </Tabs>
  ),
}

/**
 * Card Integration Story
 * Shows tabs used within a card component
 */
export const CardIntegration: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>View different aspects of this product</CardDescription>
      </CardHeader>
      <CardPanel>
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTab value="description">Description</TabsTab>
            <TabsTab value="specs">Specifications</TabsTab>
            <TabsTab value="reviews">Reviews</TabsTab>
          </TabsList>
          <TabsPanel value="description" className="space-y-3">
            <h4 className="font-medium text-foreground">About This Product</h4>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This is a high-quality product designed with modern standards and best practices
              in mind. It features glass morphism styling and comprehensive accessibility support.
            </p>
            <ul className="text-sm text-[#C4C8D4] font-sans font-light space-y-1 list-disc list-inside">
              <li>Premium materials</li>
              <li>Ergonomic design</li>
              <li>Long-lasting durability</li>
            </ul>
          </TabsPanel>
          <TabsPanel value="specs" className="space-y-3">
            <h4 className="font-medium text-foreground">Technical Specifications</h4>
            <table className="w-full text-sm">
              <tbody className="text-[#C4C8D4]">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Weight</td>
                  <td className="py-2">2.5 kg</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Dimensions</td>
                  <td className="py-2">30cm × 20cm × 10cm</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Material</td>
                  <td className="py-2">Aluminum Alloy</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-foreground">Warranty</td>
                  <td className="py-2">24 months</td>
                </tr>
              </tbody>
            </table>
          </TabsPanel>
          <TabsPanel value="reviews" className="space-y-3">
            <h4 className="font-medium text-foreground">Customer Reviews</h4>
            <div className="space-y-2">
              <div className="p-3 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground text-sm">Excellent Product</p>
                  <span className="text-primary">★★★★★</span>
                </div>
                <p className="text-xs text-[#C4C8D4]">
                  Exactly as described. Great quality and fast shipping!
                </p>
              </div>
            </div>
          </TabsPanel>
        </Tabs>
      </CardPanel>
    </Card>
  ),
}

/**
 * Form Sections with Tabs Story
 * Demonstrates tabs used to organize form sections
 */
export const FormSectionsWithTabs: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Account</CardTitle>
        <CardDescription>Complete all sections to finish registration</CardDescription>
      </CardHeader>
      <CardPanel>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTab value="personal">Personal Info</TabsTab>
            <TabsTab value="address">Address</TabsTab>
            <TabsTab value="preferences">Preferences</TabsTab>
          </TabsList>
          <TabsPanel value="personal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" type="text" placeholder="John" size="default" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" type="text" placeholder="Doe" size="default" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                size="default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" size="default" />
            </div>
          </TabsPanel>
          <TabsPanel value="address" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" type="text" placeholder="123 Main St" size="default" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" type="text" placeholder="New York" size="default" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" type="text" placeholder="NY" size="default" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" type="text" placeholder="10001" size="default" />
            </div>
          </TabsPanel>
          <TabsPanel value="preferences" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Email Preferences</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="pref-news"
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                    defaultChecked
                  />
                  <label htmlFor="pref-news" className="text-sm text-[#C4C8D4]">
                    Receive newsletters
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="pref-updates"
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                    defaultChecked
                  />
                  <label htmlFor="pref-updates" className="text-sm text-[#C4C8D4]">
                    Receive product updates
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="pref-promo"
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <label htmlFor="pref-promo" className="text-sm text-[#C4C8D4]">
                    Receive promotional offers
                  </label>
                </div>
              </div>
            </div>
          </TabsPanel>
        </Tabs>
      </CardPanel>
    </Card>
  ),
}

/**
 * Nested Tabs Story
 * Demonstrates tabs used within tabs
 */
export const NestedTabs: Story = {
  render: () => (
    <Tabs defaultValue="outer-1" className="w-full max-w-3xl">
      <TabsList>
        <TabsTab value="outer-1">Category A</TabsTab>
        <TabsTab value="outer-2">Category B</TabsTab>
      </TabsList>
      <TabsPanel value="outer-1">
        <Tabs defaultValue="inner-1">
          <TabsList className="mb-4">
            <TabsTab value="inner-1">Sub A1</TabsTab>
            <TabsTab value="inner-2">Sub A2</TabsTab>
          </TabsList>
          <TabsPanel value="inner-1">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This is nested content under Category A, Sub A1. Tabs can be nested for more
              complex information hierarchies.
            </p>
          </TabsPanel>
          <TabsPanel value="inner-2">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This is nested content under Category A, Sub A2.
            </p>
          </TabsPanel>
        </Tabs>
      </TabsPanel>
      <TabsPanel value="outer-2">
        <Tabs defaultValue="inner-3">
          <TabsList className="mb-4">
            <TabsTab value="inner-3">Sub B1</TabsTab>
            <TabsTab value="inner-4">Sub B2</TabsTab>
          </TabsList>
          <TabsPanel value="inner-3">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This is nested content under Category B, Sub B1.
            </p>
          </TabsPanel>
          <TabsPanel value="inner-4">
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This is nested content under Category B, Sub B2.
            </p>
          </TabsPanel>
        </Tabs>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * With Glass Effect Story
 * Demonstrates tabs with enhanced glass morphism styling
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#0ec2bc]/10 rounded-lg">
      <Tabs defaultValue="glass-1">
        <TabsList className="glass-card-strong mb-4">
          <TabsTab value="glass-1" className="glass-hover">
            Glass Tab 1
          </TabsTab>
          <TabsTab value="glass-2" className="glass-hover">
            Glass Tab 2
          </TabsTab>
          <TabsTab value="glass-3" className="glass-hover">
            Glass Tab 3
          </TabsTab>
        </TabsList>
        <TabsPanel value="glass-1">
          <div className="p-6 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50 glass-subtle">
            <h3 className="font-medium text-foreground mb-2">Glass Morphism Effect</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              This tab panel demonstrates enhanced glass morphism with backdrop blur and
              semi-transparent backgrounds for a modern, elegant appearance.
            </p>
          </div>
        </TabsPanel>
        <TabsPanel value="glass-2">
          <div className="p-6 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50 glass-subtle">
            <h3 className="font-medium text-foreground mb-2">Premium Design</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Glass morphism creates depth and visual hierarchy by layering semi-transparent
              elements with blur effects, perfect for the Ozean Licht design system.
            </p>
          </div>
        </TabsPanel>
        <TabsPanel value="glass-3">
          <div className="p-6 bg-card/40 backdrop-blur-12 rounded-lg border border-border/50 glass-subtle">
            <h3 className="font-medium text-foreground mb-2">Modern Aesthetic</h3>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              The combination of glass effects, oceanic colors, and smooth transitions creates
              a contemporary user experience inspired by deep ocean themes.
            </p>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  ),
}

/**
 * Responsive Layout Story
 * Demonstrates how tabs adapt to different screen sizes
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <Tabs defaultValue="responsive-1" className="w-full">
      <TabsList className="flex-wrap justify-start">
        <TabsTab value="responsive-1">Mobile</TabsTab>
        <TabsTab value="responsive-2">Tablet</TabsTab>
        <TabsTab value="responsive-3">Desktop</TabsTab>
      </TabsList>
      <TabsPanel value="responsive-1">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Mobile View</h3>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border"
              >
                <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                <p className="text-xs text-[#C4C8D4] mt-1">Mobile optimized layout</p>
              </div>
            ))}
          </div>
        </div>
      </TabsPanel>
      <TabsPanel value="responsive-2">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Tablet View</h3>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border"
              >
                <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                <p className="text-xs text-[#C4C8D4] mt-1">2-column layout</p>
              </div>
            ))}
          </div>
        </div>
      </TabsPanel>
      <TabsPanel value="responsive-3">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Desktop View</h3>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border"
              >
                <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                <p className="text-xs text-[#C4C8D4] mt-1">3-column layout</p>
              </div>
            ))}
          </div>
        </div>
      </TabsPanel>
    </Tabs>
  ),
}

/**
 * With Descriptions Story
 * Demonstrates tabs with descriptive text under tab names
 */
export const WithDescriptions: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="font-medium text-foreground mb-4">Tabs with Descriptions</h3>
        <Tabs defaultValue="desc-1">
          <TabsList>
            <TabsTab value="desc-1">Overview</TabsTab>
            <TabsTab value="desc-2">Analytics</TabsTab>
            <TabsTab value="desc-3">Export</TabsTab>
          </TabsList>
          <TabsPanel value="desc-1" className="space-y-3">
            <h4 className="font-medium text-foreground">Quick Overview</h4>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Get a quick snapshot of your project status, including key metrics and recent
              updates in one convenient view.
            </p>
          </TabsPanel>
          <TabsPanel value="desc-2" className="space-y-3">
            <h4 className="font-medium text-foreground">Detailed Analytics</h4>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Dive deep into comprehensive analytics with detailed charts, graphs, and
              statistical breakdowns of your data.
            </p>
          </TabsPanel>
          <TabsPanel value="desc-3" className="space-y-3">
            <h4 className="font-medium text-foreground">Export Data</h4>
            <p className="text-sm text-[#C4C8D4] font-sans font-light">
              Export your data in various formats including CSV, JSON, and PDF for integration
              with other tools and systems.
            </p>
          </TabsPanel>
        </Tabs>
      </div>

      <div>
        <p className="text-xs text-[#C4C8D4] italic">
          Descriptions under tabs help users understand what each tab contains before clicking.
        </p>
      </div>
    </div>
  ),
}

/**
 * Tab Navigation Example Story
 * Demonstrates using tabs for primary navigation
 */
export const TabNavigation: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <Tabs defaultValue="nav-home">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent backdrop-blur-0 p-0 h-auto">
          <TabsTab
            value="nav-home"
            className="rounded-none border-b-2 border-transparent data-[selected]:border-primary data-[selected]:bg-transparent px-6"
          >
            Home
          </TabsTab>
          <TabsTab
            value="nav-explore"
            className="rounded-none border-b-2 border-transparent data-[selected]:border-primary data-[selected]:bg-transparent px-6"
          >
            Explore
          </TabsTab>
          <TabsTab
            value="nav-docs"
            className="rounded-none border-b-2 border-transparent data-[selected]:border-primary data-[selected]:bg-transparent px-6"
          >
            Documentation
          </TabsTab>
          <TabsTab
            value="nav-community"
            className="rounded-none border-b-2 border-transparent data-[selected]:border-primary data-[selected]:bg-transparent px-6"
          >
            Community
          </TabsTab>
        </TabsList>
        <TabsPanel value="nav-home" className="mt-6">
          <h3 className="font-medium text-foreground mb-3">Welcome Home</h3>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            This demonstrates using tabs as primary navigation with an underline indicator style.
          </p>
        </TabsPanel>
        <TabsPanel value="nav-explore" className="mt-6">
          <h3 className="font-medium text-foreground mb-3">Explore More</h3>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Discover new features and content in this section.
          </p>
        </TabsPanel>
        <TabsPanel value="nav-docs" className="mt-6">
          <h3 className="font-medium text-foreground mb-3">Documentation</h3>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Read the comprehensive documentation and guides.
          </p>
        </TabsPanel>
        <TabsPanel value="nav-community" className="mt-6">
          <h3 className="font-medium text-foreground mb-3">Community</h3>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Connect with other users and get help from the community.
          </p>
        </TabsPanel>
      </Tabs>
    </div>
  ),
}

/**
 * Keyboard Navigation Story
 * Demonstrates keyboard accessibility features
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-sm font-medium text-foreground">Keyboard Navigation Tips:</p>
        <ul className="text-xs text-[#C4C8D4] list-disc list-inside mt-2 space-y-1">
          <li>Use Tab to focus on the first tab</li>
          <li>Use arrow keys (Left/Right) to navigate between tabs</li>
          <li>Use Enter or Space to activate a tab</li>
          <li>Use Tab to move to the active tab panel content</li>
        </ul>
      </div>
      <Tabs defaultValue="kb-1">
        <TabsList>
          <TabsTab value="kb-1">Tab 1</TabsTab>
          <TabsTab value="kb-2">Tab 2</TabsTab>
          <TabsTab value="kb-3">Tab 3</TabsTab>
        </TabsList>
        <TabsPanel value="kb-1">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Try using your keyboard to navigate these tabs. Arrow keys move between tabs,
            and Enter activates the selected tab.
          </p>
        </TabsPanel>
        <TabsPanel value="kb-2">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Full keyboard accessibility is built-in, making these tabs usable with screen
            readers and keyboard-only navigation.
          </p>
        </TabsPanel>
        <TabsPanel value="kb-3">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            The tabs component follows ARIA standards for proper semantic structure and
            accessibility attributes.
          </p>
        </TabsPanel>
      </Tabs>
    </div>
  ),
}
