'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { AppLayout } from './app-layout'
import { Badge } from '../../cossui/badge'
import { Card } from '../../cossui/card'
import { Button } from '../../cossui/button'
import {
  Home,
  BookOpen,
  Sparkles,
  Moon,
  Compass,
  Sun,
  ArrowRight,
  Settings,
  Bell,
  Search,
} from 'lucide-react'

/**
 * # AppLayout Component
 *
 * The main application layout component for the Ozean Licht platform.
 * Combines a fixed header with a collapsible sidebar and flexible content area.
 *
 * ## Features
 *
 * - **Fixed Header (57px)** - Contains logo, breadcrumbs, search, notifications, and user menu
 * - **Collapsible Sidebar** - Expands to 256px (w-64) or collapses to 64px (w-16)
 * - **Content Area** - Adjusts margin based on sidebar state with smooth transitions
 * - **Breadcrumb Navigation** - Optional breadcrumb trails for page hierarchy
 * - **Responsive Design** - Works seamlessly across different viewport sizes
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │         Fixed Header (57px)             │
 * ├─────────┬──────────────────────────────┤
 * │         │                              │
 * │ Sidebar │      Content Area            │
 * │ (64px   │      (ml-16 or ml-64)        │
 * │ or 256px)                              │
 * │         │                              │
 * └─────────┴──────────────────────────────┘
 * ```
 */
const meta = {
  title: 'Branded/Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Main application layout combining a fixed header, collapsible sidebar, and flexible content area. Designed for the Ozean Licht platform with responsive spacing and smooth transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Main content to display in the layout',
    },
    breadcrumbs: {
      description: 'Array of breadcrumb items for navigation context',
      control: 'object',
    },
    className: {
      description: 'Additional CSS classes for the main content area',
      control: 'text',
    },
    showSidebarToggle: {
      description: 'Whether to show the sidebar toggle button in the header',
      control: 'boolean',
    },
    initialSidebarOpen: {
      description: 'Initial state of the sidebar (open or closed)',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Layout - Complete application layout with sample content
 *
 * Shows the typical layout structure with:
 * - Header with logo and basic navigation
 * - Open sidebar with navigation items
 * - Content area with sample dashboard content
 */
export const Default: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Ozean Licht workspace</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {[
            { label: 'Kurse', value: '12', icon: BookOpen },
            { label: 'Fortschritt', value: '67%', icon: Sparkles },
            { label: 'Transmissions', value: '8', icon: Moon },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card
                key={i}
                className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Sample Content */}
        <div className="max-w-6xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-6">
            <div className="space-y-4">
              {['Kurs "Energetische Transformation" gestartet', 'Transmission "Galaktische Weisheit" abgeschlossen', 'Neuer Kurs "Portal der Erleuchtung" verfügbar'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#0E282E] last:border-0">
                  <span className="text-white/80">{item}</span>
                  <span className="text-xs text-muted-foreground">vor 2 Tagen</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    ),
  },
}

/**
 * With Breadcrumbs - Layout displaying breadcrumb navigation
 *
 * Shows how breadcrumbs appear in the header to provide context
 * about the current page location in the hierarchy
 */
export const WithBreadcrumbs: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Kurse', href: '/courses' },
      { label: 'Energetische Transformation' },
    ],
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-2">Energetische Transformation</h1>
          <p className="text-muted-foreground">
            Lerne die fundamentalen Techniken der energetischen Umwandlung
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8">
              <div className="space-y-4">
                <Badge className="w-fit">In Progress</Badge>
                <h2 className="text-2xl font-bold text-white">Modul 1: Grundlagen</h2>
                <div className="w-full bg-[#0E282E] rounded-full h-2 mt-4">
                  <div className="bg-primary h-2 rounded-full w-2/3 transition-all" />
                </div>
                <p className="text-muted-foreground text-sm">67% abgeschlossen</p>
                <p className="text-white/80 mt-4">
                  In diesem Modul werden Sie die Grundlagen der energetischen Arbeit erlernen,
                  einschließlich der sieben Hauptenergiezentren und ihrer Funktionen.
                </p>
                <Button className="mt-6 gap-2">
                  Weiterlesen <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Kursinformationen</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Dauer</p>
                  <p className="text-white">8 Wochen</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Level</p>
                  <p className="text-white">Anfänger</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Lektionen</p>
                  <p className="text-white">24</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
}

/**
 * Sidebar Closed - Layout with collapsed sidebar
 *
 * Shows the layout with the sidebar in its collapsed state,
 * revealing only the icon buttons for quick navigation.
 * Content area has reduced left margin (ml-16 instead of ml-64)
 */
export const SidebarClosed: Story = {
  args: {
    initialSidebarOpen: false,
    showSidebarToggle: true,
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold text-white mb-2">Übersicht</h1>
          <p className="text-muted-foreground">Mit geschlossener Seitenleiste haben Sie mehr Platz für Inhalte</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { name: 'Bibliothek', icon: BookOpen },
            { name: 'Kurse', icon: Sparkles },
            { name: 'Transmissions', icon: Moon },
            { name: 'Portal', icon: Compass },
            { name: 'Chronik', icon: Sun },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <Card
                key={i}
                className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 text-center hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-white text-sm font-medium">{item.name}</p>
              </Card>
            )
          })}
        </div>

        <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Mehr Bildschirmplatz</h2>
          <p className="text-white/80 mb-6">
            Wenn Sie die Seitenleiste schließen, gewinnt der Inhaltsbereich mehr horizontalen Platz.
            Dies ist ideal, wenn Sie lange Textinhalte oder breitere Layouts benötigen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#0E282E]/50 rounded p-4 h-24 flex items-center justify-center text-muted-foreground">
                Inhaltsblöcke
              </div>
            ))}
          </div>
        </Card>
      </div>
    ),
  },
}

/**
 * Custom Content - Layout with rich content and cards
 *
 * Demonstrates the layout with various content types including:
 * - Multiple cards with different styles
 * - Tabbed sections
 * - Complex layouts
 * - Action buttons
 */
export const CustomContent: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Einstellungen' },
    ],
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihr Profil und Ihre Präferenzen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl">
          {/* Settings Menu */}
          <div className="space-y-2">
            {[
              { label: 'Profil', icon: 'user' },
              { label: 'Sicherheit', icon: 'lock' },
              { label: 'Benachrichtigungen', icon: 'bell' },
              { label: 'Datenschutz', icon: 'shield' },
              { label: 'Abrechnung', icon: 'card' },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  i === 0
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-white/80 hover:bg-[#0E282E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Section */}
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8">
              <h2 className="text-xl font-bold text-white mb-6">Profilinformationen</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Vorname</label>
                    <input
                      type="text"
                      placeholder="Maria"
                      className="w-full bg-[#0E282E] border border-[#0E282E] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Nachname</label>
                    <input
                      type="text"
                      placeholder="Schmidt"
                      className="w-full bg-[#0E282E] border border-[#0E282E] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">E-Mail</label>
                  <input
                    type="email"
                    placeholder="maria@ozean-licht.de"
                    className="w-full bg-[#0E282E] border border-[#0E282E] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button className="bg-primary text-white hover:bg-primary/80">Änderungen speichern</Button>
                <Button variant="outline">Abbrechen</Button>
              </div>
            </Card>

            {/* Preferences Section */}
            <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8">
              <h2 className="text-xl font-bold text-white mb-6">Einstellungen</h2>
              <div className="space-y-4">
                {[
                  { label: 'E-Mail-Benachrichtigungen aktivieren', enabled: true },
                  { label: 'Marketing-E-Mails erhalten', enabled: false },
                  { label: 'Daten analytics zustimmen', enabled: true },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#0E282E] last:border-0">
                    <label className="text-white cursor-pointer">{setting.label}</label>
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="w-5 h-5 rounded border-[#0E282E] bg-[#0E282E] accent-primary cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
}

/**
 * No Padding - Layout with custom className for flush content
 *
 * Shows how to use custom className prop to override padding
 * or create full-bleed layouts without default spacing
 */
export const NoPadding: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    className: 'p-0',
    children: (
      <div className="min-h-screen bg-gradient-to-b from-[#001a1a] to-[#00070F]">
        {/* Full-bleed Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-primary/20 to-primary/5 border-b border-[#0E282E] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative text-center max-w-2xl px-8">
            <h1 className="text-5xl font-bold text-white mb-4">Spirituelle Transformation</h1>
            <p className="text-primary/80 text-lg mb-8">
              Entdecken Sie die tiefsten Wahrheiten der Existenz
            </p>
            <Button className="gap-2 bg-primary text-white hover:bg-primary/80">
              Jetzt beginnen <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {[
            { title: 'Energie-Management', desc: 'Meistern Sie Ihre eigene Energie' },
            { title: 'Bewusstseins-Expansion', desc: 'Erweitern Sie Ihre Wahrnehmung' },
            { title: 'Spirituelles Wachstum', desc: 'Entwickeln Sie sich weiter' },
            { title: 'Heilung & Balance', desc: 'Finden Sie innere Harmonie' },
            { title: 'Manifestation', desc: 'Kreieren Sie Ihre Realität' },
            { title: 'Kosmische Verbindung', desc: 'Verbinden Sie sich mit dem Universum' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-12 border-r border-b border-[#0E282E] last:border-r-0 hover:bg-primary/5 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Full-width CTA Section */}
        <div className="bg-primary/10 border-t border-[#0E282E] px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Bereit für deine Transformation?</h2>
            <p className="text-primary/80 mb-8">
              Tausende von Menschen haben bereits ihre spirituelle Reise begonnen. Es ist deine Zeit zu strahlen.
            </p>
            <Button className="gap-2 bg-primary text-white hover:bg-primary/80 px-8 py-3">
              Kostenlos Starten <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    ),
  },
}

/**
 * Without Sidebar Toggle - Layout without the sidebar toggle button
 *
 * Useful for applications where the sidebar should always be visible
 * or where you want a permanent layout without navigation toggle
 */
export const WithoutSidebarToggle: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: false,
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-2">Administration Panel</h1>
          <p className="text-muted-foreground">Sidebar toggle is hidden - always visible navigation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          {[
            { label: 'Benutzer', value: '2,543', change: '+12%' },
            { label: 'Aktive Kurse', value: '48', change: '+5%' },
            { label: 'Engagement', value: '87%', change: '+8%' },
            { label: 'Umsatz', value: '€45,210', change: '+23%' },
          ].map((metric, i) => (
            <Card
              key={i}
              className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 hover:border-primary/30 transition-colors"
            >
              <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className="text-green-400 text-sm">{metric.change}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
}

/**
 * With Custom Header Props - Layout with customized header
 *
 * Demonstrates how to pass custom props to the header component
 * such as custom logo URL and app name
 */
export const WithCustomHeaderProps: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    headerProps: {
      appName: 'Akademie',
      logoUrl: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png',
    },
    breadcrumbs: [
      { label: 'Akademie', href: '/' },
      { label: 'Meine Kurse' },
    ],
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-2">Meine Kurse</h1>
          <p className="text-muted-foreground">Ihre aktiven Kurse und Fortschritt</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
          {[
            {
              title: 'Energetische Transformation',
              progress: 67,
              lessons: '12 / 18',
              category: 'Anfänger',
            },
            {
              title: 'Erweiterte Bewusstseinsfähigkeiten',
              progress: 45,
              lessons: '9 / 20',
              category: 'Fortgeschritten',
            },
            {
              title: 'Manifestation & Kreativität',
              progress: 82,
              lessons: '16 / 16',
              category: 'Anfänger',
            },
            {
              title: 'Kosmische Verbindung',
              progress: 28,
              lessons: '5 / 18',
              category: 'Fortgeschritten',
            },
          ].map((course, i) => (
            <Card
              key={i}
              className="bg-[#0A1A1A]/50 border-[#0E282E] p-6 hover:border-primary/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <Badge variant="outline" className="mt-2">{course.category}</Badge>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Fortschritt</span>
                  <span className="text-primary font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-[#0E282E] rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">{course.lessons} Lektionen</p>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
}

/**
 * Responsive Demonstration - Shows layout behavior across sizes
 *
 * This story demonstrates how the layout adapts to different screen sizes
 * and sidebar states. Content is responsive and scales appropriately.
 */
export const ResponsiveDemo: Story = {
  args: {
    initialSidebarOpen: true,
    showSidebarToggle: true,
    children: (
      <div className="p-8 min-h-screen space-y-8">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold text-white mb-2">Responsive Layout Demo</h1>
          <p className="text-muted-foreground mb-4">
            Versuchen Sie, die Seitenleiste zu schließen oder die Bildschirmgröße zu ändern
          </p>
        </div>

        {/* Info Box */}
        <Card className="bg-primary/5 border border-primary/30 p-6 max-w-full">
          <p className="text-white">
            Die Seitenleiste wechselt zwischen <code className="bg-[#0E282E] px-2 py-1 rounded">ml-64</code> (offen) und{' '}
            <code className="bg-[#0E282E] px-2 py-1 rounded">ml-16</code> (geschlossen) mit Smooth Transitions.
          </p>
        </Card>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card
              key={i}
              className="bg-[#0A1A1A]/50 border-[#0E282E] p-8 flex items-center justify-center min-h-48"
            >
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Element {i + 1}</p>
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto" />
              </div>
            </Card>
          ))}
        </div>

        {/* Layout Info */}
        <Card className="bg-[#0A1A1A]/50 border-[#0E282E] p-8 max-w-full">
          <h2 className="text-xl font-bold text-white mb-4">Layout Struktur</h2>
          <div className="space-y-3 text-sm text-white/80">
            <p>• Header: Feste Höhe von 57px (pt-[57px] auf Flex-Container)</p>
            <p>• Sidebar offen: Hauptinhalt erhält ml-64 (256px Margin)</p>
            <p>• Sidebar geschlossen: Hauptinhalt erhält ml-16 (64px Margin)</p>
            <p>• Transition: 300ms Ease-in-out für sanfte Übergänge</p>
            <p>• Z-Index: Header 50, Sidebar 40, Main 10 für korrekte Schichtung</p>
          </div>
        </Card>
      </div>
    ),
  },
}
