'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LanguagePicker,
  type Language,
  type LanguagePickerProps,
} from './language-picker'

/**
 * # LanguagePicker Component
 *
 * A compact language selector component featuring flag icons and language names.
 * Supports custom language lists, default selections, and change callbacks.
 *
 * ## Features
 * - **13 Default Languages**: Deutsch, English, Español, Português, Русский, Ελληνικά, Français, Italiano, Türkçe, 日本語, 中文, العربية, हिन्दी
 * - **Custom Language Sets**: Easily restrict to specific regions
 * - **Flag Icons**: Visual representation via SVG flag images
 * - **Dark Theme**: Matches Ozean Licht design system with dark background
 * - **Compact Design**: 71x32px trigger with dropdown menu
 * - **Accessible**: Built on CossUI Select component with semantic HTML
 * - **Type Safe**: Full TypeScript support with Language interface
 *
 * ## Design System Context
 * - **Active State**: Primary color border on hover
 * - **Background**: Dark (#0A1A1A) with subtle border (#0E282E)
 * - **Dropdown**: Max height 300px with scroll support
 * - **Flag Styling**: 32x24px with rounded corners
 *
 * ## Usage
 *
 * ```tsx
 * // Default all languages
 * <LanguagePicker defaultLanguage="de" onLanguageChange={(code) => console.log(code)} />
 *
 * // Custom language subset
 * const europeanLanguages: Language[] = [
 *   { code: 'de', flag: '/flags/german.svg', name: 'Deutsch' },
 *   { code: 'en', flag: '/flags/united_kingdom.svg', name: 'English' },
 * ]
 * <LanguagePicker languages={europeanLanguages} defaultLanguage="de" />
 * ```
 */
const meta = {
  title: 'Tier 2: Branded/Forms/LanguagePicker',
  component: LanguagePicker,
  parameters: {
    layout: 'centered',
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
          'A compact language selector with flag icons. Supports custom language sets and change callbacks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    languages: {
      description: 'Array of available languages',
      table: {
        type: { summary: 'Language[]' },
      },
    },
    defaultLanguage: {
      control: 'text',
      description: 'Default selected language code',
      table: {
        defaultValue: { summary: 'de' },
      },
    },
    onLanguageChange: {
      description: 'Callback when language is changed',
      table: {
        type: { summary: '(languageCode: string) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguagePicker>

export default meta
type Story = StoryObj<typeof meta>

// Default languages set
const defaultLanguages: Language[] = [
  { code: 'de', flag: '/flags/german.svg', name: 'Deutsch' },
  { code: 'en', flag: '/flags/united_kingdom.svg', name: 'English' },
  { code: 'es', flag: '/flags/spain.svg', name: 'Español' },
  { code: 'pt', flag: '/flags/portugal.svg', name: 'Português' },
  { code: 'ru', flag: '/flags/russia.svg', name: 'Русский' },
  { code: 'el', flag: '/flags/greek.svg', name: 'Ελληνικά' },
  { code: 'fr', flag: '/flags/france.svg', name: 'Français' },
  { code: 'it', flag: '/flags/italy.svg', name: 'Italiano' },
  { code: 'tr', flag: '/flags/turkey.svg', name: 'Türkçe' },
  { code: 'ja', flag: '/flags/japan.svg', name: '日本語' },
  { code: 'zh', flag: '/flags/china.svg', name: '中文' },
  { code: 'ar', flag: '/flags/arab.svg', name: 'العربية' },
  { code: 'hi', flag: '/flags/india.svg', name: 'हिन्दी' },
]

// European languages subset
const europeanLanguages: Language[] = [
  { code: 'de', flag: '/flags/german.svg', name: 'Deutsch' },
  { code: 'en', flag: '/flags/united_kingdom.svg', name: 'English' },
  { code: 'es', flag: '/flags/spain.svg', name: 'Español' },
  { code: 'pt', flag: '/flags/portugal.svg', name: 'Português' },
  { code: 'ru', flag: '/flags/russia.svg', name: 'Русский' },
  { code: 'el', flag: '/flags/greek.svg', name: 'Ελληνικά' },
  { code: 'fr', flag: '/flags/france.svg', name: 'Français' },
  { code: 'it', flag: '/flags/italy.svg', name: 'Italiano' },
  { code: 'tr', flag: '/flags/turkey.svg', name: 'Türkçe' },
]

// Asian languages subset
const asianLanguages: Language[] = [
  { code: 'ja', flag: '/flags/japan.svg', name: '日本語' },
  { code: 'zh', flag: '/flags/china.svg', name: '中文' },
  { code: 'ar', flag: '/flags/arab.svg', name: 'العربية' },
  { code: 'hi', flag: '/flags/india.svg', name: 'हिन्दी' },
]

// Single language (non-interactive)
const singleLanguage: Language[] = [
  { code: 'de', flag: '/flags/german.svg', name: 'Deutsch' },
]

// Placeholder images for custom flag demo
const placeholderFlagUrl = (color: string) =>
  `https://via.placeholder.com/32x24/${color}?text=`

const customFlagLanguages: Language[] = [
  {
    code: 'de',
    flag: placeholderFlagUrl('0066cc'),
    name: 'Deutsch',
  },
  {
    code: 'en',
    flag: placeholderFlagUrl('cc0000'),
    name: 'English',
  },
  {
    code: 'es',
    flag: placeholderFlagUrl('ffcc00'),
    name: 'Español',
  },
  {
    code: 'fr',
    flag: placeholderFlagUrl('0099ff'),
    name: 'Français',
  },
]

/**
 * Default state with all 13 languages available.
 *
 * Shows the picker with the complete language set. German (Deutsch) is selected
 * by default, which is the standard for the Ozean Licht platform.
 * Demonstrates the compact 71x32px design with dark theme styling.
 */
export const Default: Story = {
  args: {
    languages: defaultLanguages,
    defaultLanguage: 'de',
  },
}

/**
 * English as the default language.
 *
 * Same as default but with English (English) selected instead of German.
 * Shows how the default selection can be customized for different users
 * or application instances.
 */
export const EnglishDefault: Story = {
  args: {
    languages: defaultLanguages,
    defaultLanguage: 'en',
  },
}

/**
 * European languages only.
 *
 * Restricted language set containing 9 European languages:
 * Deutsch, English, Español, Português, Русский, Ελληνικά, Français, Italiano, Türkçe.
 *
 * Useful for regional applications focused on European markets.
 */
export const EuropeanLanguages: Story = {
  args: {
    languages: europeanLanguages,
    defaultLanguage: 'de',
  },
}

/**
 * Asian languages only.
 *
 * Restricted language set containing 4 Asian languages:
 * 日本語, 中文, العربية, हिन्दी.
 *
 * Useful for applications targeting Asian markets and regions.
 */
export const AsianLanguages: Story = {
  args: {
    languages: asianLanguages,
    defaultLanguage: 'ja',
  },
}

/**
 * Single language (disabled picker).
 *
 * When only one language is available, the picker becomes effectively
 * a display element rather than an interactive selector. The dropdown
 * contains only one option.
 *
 * Useful for applications that do not yet support multiple languages
 * or for specific regional instances locked to one language.
 */
export const SingleLanguage: Story = {
  args: {
    languages: singleLanguage,
    defaultLanguage: 'de',
  },
  render: (args) => (
    <div className="space-y-8">
      <LanguagePicker {...args} />
      <div className="text-center space-y-3 pt-6 border-t border-[#0E282E]">
        <p className="text-sm text-white/70 font-montserrat">
          Single Language: <span className="text-primary font-semibold">Deutsch</span>
        </p>
        <p className="text-xs text-white/50 max-w-xs mx-auto">
          When only one language is configured, the picker acts as a display element
          rather than an interactive selector.
        </p>
      </div>
    </div>
  ),
}

/**
 * Custom flag URLs with placeholder images.
 *
 * Demonstrates how custom flag images can be used instead of the default SVG files.
 * Uses placeholder.com service for demonstration purposes. In production, these
 * would be actual flag image URLs from your CDN or static assets.
 *
 * Shows how the component is flexible in its image source handling.
 */
export const CustomFlagUrls: Story = {
  args: {
    languages: customFlagLanguages,
    defaultLanguage: 'de',
  },
  render: (args) => (
    <div className="space-y-8">
      <LanguagePicker {...args} />
      <div className="text-center space-y-3 pt-6 border-t border-[#0E282E]">
        <p className="text-sm text-white/70 font-montserrat">
          Custom Flag URLs
        </p>
        <p className="text-xs text-white/50 max-w-xs mx-auto">
          This example uses custom placeholder image URLs instead of SVG files.
          In production, replace with your actual flag image URLs.
        </p>
      </div>
    </div>
  ),
}

/**
 * Interactive language selection with callback feedback.
 *
 * Fully interactive example showing how the component responds to language changes.
 * Displays the currently selected language code and language name in real-time.
 * Demonstrates the onLanguageChange callback functionality.
 *
 * Click on the picker and select different languages to see the displayed
 * information update dynamically.
 */
export const Interactive: Story = {
  render: () => {
    const [selectedLanguage, setSelectedLanguage] = useState('de')

    // Map language codes to names
    const languageNames: Record<string, string> = {
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      pt: 'Português',
      ru: 'Русский',
      el: 'Ελληνικά',
      fr: 'Français',
      it: 'Italiano',
      tr: 'Türkçe',
      ja: '日本語',
      zh: '中文',
      ar: 'العربية',
      hi: 'हिन्दी',
    }

    return (
      <div className="space-y-8 max-w-md">
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-white font-montserrat text-lg">
              Language Selection
            </h3>
            <p className="text-white/60 text-sm">
              Choose your preferred language for the platform
            </p>
          </div>

          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
            onLanguageChange={setSelectedLanguage}
          />

          <div className="space-y-4 pt-4 border-t border-[#0E282E]">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-white/40 text-xs mb-2">Language Code</p>
                <p className="text-primary font-montserrat-alt font-bold text-sm">
                  {selectedLanguage.toUpperCase()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs mb-2">Language Name</p>
                <p className="text-white/80 font-montserrat-alt font-bold text-sm">
                  {languageNames[selectedLanguage] || selectedLanguage}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40 text-center">
            Click the language picker above to change the language and see the
            displayed information update in real-time.
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Interactive playground with extended statistics.
 *
 * Advanced interactive example showcasing the picker with additional
 * information display including change count and timestamp.
 * Demonstrates sophisticated state management and user feedback patterns.
 */
export const InteractivePlayground: Story = {
  render: () => {
    const [selectedLanguage, setSelectedLanguage] = useState('de')
    const [changeCount, setChangeCount] = useState(0)
    const [lastChanged, setLastChanged] = useState<Date | null>(null)

    const languageNames: Record<string, string> = {
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      pt: 'Português',
      ru: 'Русский',
      el: 'Ελληνικά',
      fr: 'Français',
      it: 'Italiano',
      tr: 'Türkçe',
      ja: '日本語',
      zh: '中文',
      ar: 'العربية',
      hi: 'हिन्दी',
    }

    const handleLanguageChange = (code: string) => {
      setSelectedLanguage(code)
      setChangeCount((prev) => prev + 1)
      setLastChanged(new Date())
    }

    return (
      <div className="space-y-8 max-w-md">
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-white font-montserrat text-lg">
              Language Selector Playground
            </h3>
            <p className="text-white/60 text-sm">
              Interactive example with extended statistics and feedback
            </p>
          </div>

          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
            onLanguageChange={handleLanguageChange}
          />

          <div className="space-y-4 pt-4 border-t border-[#0E282E]">
            {/* Primary Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-[#0A1A1A] rounded-lg p-3">
                <p className="text-white/40 text-xs mb-2">Code</p>
                <p className="text-primary font-montserrat-alt font-bold">
                  {selectedLanguage.toUpperCase()}
                </p>
              </div>
              <div className="text-center bg-[#0A1A1A] rounded-lg p-3">
                <p className="text-white/40 text-xs mb-2">Name</p>
                <p className="text-white/80 font-montserrat-alt font-bold text-sm">
                  {languageNames[selectedLanguage]}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-[#0A1A1A] rounded-lg p-3">
                <p className="text-white/40 text-xs mb-2">Changes</p>
                <p className="text-emerald-400 font-montserrat-alt font-bold">
                  {changeCount}
                </p>
              </div>
              <div className="text-center bg-[#0A1A1A] rounded-lg p-3">
                <p className="text-white/40 text-xs mb-2">Last Change</p>
                <p className="text-white/80 font-montserrat-alt font-bold text-xs">
                  {lastChanged ? lastChanged.toLocaleTimeString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40 text-center">
            Select different languages to update the statistics. Each selection
            increments the change counter and updates the timestamp.
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Compact integration in a settings panel.
 *
 * Shows how the LanguagePicker would integrate into a real-world settings panel.
 * Demonstrates the component alongside other settings controls and proper visual
 * hierarchy within a larger interface.
 *
 * Illustrates responsive integration patterns for production applications.
 */
export const CompactIntegration: Story = {
  render: () => (
    <div className="w-96 glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#0E282E]">
        <h2 className="text-white font-montserrat text-lg font-semibold">
          Preferences
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Language Setting */}
        <div className="space-y-3">
          <label className="text-white/70 text-sm font-montserrat-alt uppercase tracking-wider">
            Language
          </label>
          <p className="text-white/50 text-xs">
            Choose your preferred language for the interface
          </p>
          <div className="flex items-center gap-3 pt-2">
            <LanguagePicker
              languages={defaultLanguages}
              defaultLanguage="de"
            />
          </div>
        </div>

        {/* Theme Setting */}
        <div className="space-y-3 pt-6 border-t border-[#0E282E]">
          <label className="text-white/70 text-sm font-montserrat-alt uppercase tracking-wider">
            Theme
          </label>
          <p className="text-white/50 text-xs">
            Select your preferred color theme
          </p>
          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary text-primary text-sm font-montserrat">
              Dark
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-montserrat hover:bg-white/10 transition-colors">
              Light
            </button>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="space-y-3 pt-6 border-t border-[#0E282E]">
          <label className="text-white/70 text-sm font-montserrat-alt uppercase tracking-wider">
            Notifications
          </label>
          <div className="flex items-center justify-between pt-2">
            <span className="text-white/60 text-sm">Email Updates</span>
            <div className="w-12 h-6 bg-primary/30 rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-primary rounded-full absolute right-0.5 top-0.5" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#0E282E] space-y-3">
          <button className="w-full px-4 py-3 bg-primary/20 border border-primary text-primary rounded-lg font-montserrat text-sm hover:bg-primary/30 transition-colors">
            Save Changes
          </button>
          <button className="w-full px-4 py-2 text-white/50 hover:text-white/70 transition-colors font-montserrat text-sm">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  ),
}

/**
 * All language variants comparison.
 *
 * Displays different language configuration variants side by side for
 * easy visual comparison. Useful for design review and understanding
 * the component's appearance across different language sets.
 */
export const LanguageVariants: Story = {
  render: () => (
    <div className="space-y-12 max-w-2xl">
      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          All Languages (13 total)
        </p>
        <div className="glass-card rounded-lg p-4">
          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          European Only (9 languages)
        </p>
        <div className="glass-card rounded-lg p-4">
          <LanguagePicker
            languages={europeanLanguages}
            defaultLanguage="de"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Asian Only (4 languages)
        </p>
        <div className="glass-card rounded-lg p-4">
          <LanguagePicker languages={asianLanguages} defaultLanguage="ja" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Single Language (Read-only)
        </p>
        <div className="glass-card rounded-lg p-4">
          <LanguagePicker
            languages={singleLanguage}
            defaultLanguage="de"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Accessibility and keyboard navigation demo.
 *
 * Demonstrates keyboard navigation support and accessibility features.
 * The component is built on CossUI Select which supports Tab, Enter,
 * Space, and arrow keys for full keyboard accessibility.
 *
 * Focus the component with Tab and use arrow keys to navigate through
 * language options.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div className="space-y-3">
        <h3 className="text-white font-montserrat text-lg">
          Keyboard Navigation
        </h3>
        <p className="text-white/60 text-sm">
          Try using Tab to focus and arrow keys to navigate
        </p>
      </div>

      <LanguagePicker
        languages={defaultLanguages}
        defaultLanguage="de"
      />

      <div className="bg-[#0A1A1A] rounded-lg p-4 space-y-4 border border-[#0E282E]">
        <p className="text-xs uppercase tracking-wider text-white/50 font-montserrat-alt">
          Keyboard Controls
        </p>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="flex gap-3">
            <span className="text-primary min-w-max">Tab</span>
            <span>Focus the language picker</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary min-w-max">Enter / Space</span>
            <span>Open the language dropdown menu</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary min-w-max">Arrow Up / Down</span>
            <span>Navigate through language options</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary min-w-max">Enter</span>
            <span>Select the focused language</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary min-w-max">Esc</span>
            <span>Close the dropdown menu</span>
          </li>
        </ul>
      </div>

      <div className="bg-[#0A1A1A] rounded-lg p-4 space-y-4 border border-[#0E282E]">
        <p className="text-xs uppercase tracking-wider text-white/50 font-montserrat-alt">
          Accessibility Features
        </p>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Full keyboard accessibility</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Semantic HTML with Select/SelectItem</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Focus visible indicators</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>ARIA attributes support</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Clear visual feedback on interaction</span>
          </li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * Theme variation showcase.
 *
 * Demonstrates how the LanguagePicker appears in different background contexts.
 * Shows the component's visual consistency and design robustness when placed
 * on different colored backgrounds.
 */
export const ThemeVariations: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Dark Theme (Default)
        </p>
        <div className="bg-gradient-to-br from-[#00070F] via-[#001a1a] to-[#00070F] p-8 rounded-lg flex justify-center">
          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Light Background
        </p>
        <div className="bg-white p-8 rounded-lg flex justify-center">
          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/70 font-montserrat-alt uppercase tracking-wider">
          Medium Gray Background
        </p>
        <div className="bg-gray-400 p-8 rounded-lg flex justify-center">
          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Responsive layout example.
 *
 * Demonstrates how the LanguagePicker integrates into responsive layouts
 * alongside other UI elements. Shows the component's minimal footprint
 * and how it works in compact spaces.
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      {/* Header with language picker */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-primary/20 to-transparent border-b border-[#0E282E] flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-white font-montserrat text-xl font-semibold">
              Ozean Licht Platform
            </h1>
            <p className="text-white/50 text-sm">Welcome to your learning hub</p>
          </div>
          <LanguagePicker
            languages={defaultLanguages}
            defaultLanguage="de"
          />
        </div>

        {/* Content area */}
        <div className="p-6 space-y-4">
          <p className="text-white/70">
            The language picker is positioned in the top-right corner of the
            header, providing easy access to language selection without taking
            up valuable content space.
          </p>
        </div>
      </div>

      {/* Footer with language picker */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-6 space-y-4 border-t border-[#0E282E]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-montserrat-alt uppercase tracking-wider">
                Change Language
              </p>
            </div>
            <LanguagePicker
              languages={defaultLanguages}
              defaultLanguage="de"
            />
          </div>
          <p className="text-white/50 text-xs">
            Language selection is also commonly placed in the footer for easy
            discoverability by users at the end of their page experience.
          </p>
        </div>
      </div>
    </div>
  ),
}
