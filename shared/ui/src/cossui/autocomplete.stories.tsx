/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import React from 'react'
import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteOption,
  AutocompleteGroup,
  AutocompleteSeparator,
} from './autocomplete'
import { Label } from './label'

const meta: Meta = {
  title: 'CossUI/Autocomplete',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Autocomplete component from Coss UI adapted for Ozean Licht design system. Built on Base UI Popover with combobox pattern, supports keyboard navigation (arrow keys, enter, escape), text highlighting, and accessible ARIA attributes.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Basic autocomplete
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AutocompleteRoot>
        <AutocompleteInput placeholder="Type to search..." />
        <AutocompleteList>
          <AutocompleteOption value="apple">Apple</AutocompleteOption>
          <AutocompleteOption value="banana">Banana</AutocompleteOption>
          <AutocompleteOption value="cherry">Cherry</AutocompleteOption>
          <AutocompleteOption value="date">Date</AutocompleteOption>
          <AutocompleteOption value="elderberry">Elderberry</AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// With label
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="fruit-search">Search Fruits</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="fruit-search" placeholder="Start typing fruit name..." />
        <AutocompleteList>
          <AutocompleteOption value="apple">Apple</AutocompleteOption>
          <AutocompleteOption value="apricot">Apricot</AutocompleteOption>
          <AutocompleteOption value="banana">Banana</AutocompleteOption>
          <AutocompleteOption value="blueberry">Blueberry</AutocompleteOption>
          <AutocompleteOption value="cherry">Cherry</AutocompleteOption>
          <AutocompleteOption value="grape">Grape</AutocompleteOption>
          <AutocompleteOption value="mango">Mango</AutocompleteOption>
          <AutocompleteOption value="orange">Orange</AutocompleteOption>
          <AutocompleteOption value="strawberry">Strawberry</AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Email autocomplete
export const EmailAutocomplete: Story = {
  render: () => {
    const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com']
    const [inputValue, setInputValue] = React.useState('')
    const suggestions = inputValue.includes('@')
      ? emailDomains
          .filter((domain) => !inputValue.includes(domain))
          .map((domain) => inputValue.split('@')[0] + domain)
      : []

    return (
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Label htmlFor="email-input">Email Address</Label>
        <AutocompleteRoot>
          <AutocompleteInput
            id="email-input"
            type="email"
            placeholder="name@example.com"
            onInputChange={setInputValue}
          />
          <AutocompleteList emptyMessage="Type @ to see suggestions">
            {suggestions.map((email) => (
              <AutocompleteOption key={email} value={email}>
                {email}
              </AutocompleteOption>
            ))}
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    )
  },
}

// City/Location search
export const CitySearch: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="city-search">City or Location</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="city-search" placeholder="Search cities..." />
        <AutocompleteList>
          <AutocompleteGroup label="Austria">
            <AutocompleteOption value="vienna">Vienna</AutocompleteOption>
            <AutocompleteOption value="salzburg">Salzburg</AutocompleteOption>
            <AutocompleteOption value="innsbruck">Innsbruck</AutocompleteOption>
            <AutocompleteOption value="graz">Graz</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="Germany">
            <AutocompleteOption value="berlin">Berlin</AutocompleteOption>
            <AutocompleteOption value="munich">Munich</AutocompleteOption>
            <AutocompleteOption value="hamburg">Hamburg</AutocompleteOption>
            <AutocompleteOption value="frankfurt">Frankfurt</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="Switzerland">
            <AutocompleteOption value="zurich">Zurich</AutocompleteOption>
            <AutocompleteOption value="geneva">Geneva</AutocompleteOption>
            <AutocompleteOption value="basel">Basel</AutocompleteOption>
            <AutocompleteOption value="bern">Bern</AutocompleteOption>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// User search with avatars
export const UserSearch: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="user-search">Search Users</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="user-search" placeholder="Search by name or email..." />
        <AutocompleteList>
          <AutocompleteOption value="john-doe">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0ec2bc]/20 flex items-center justify-center text-[#0ec2bc] font-medium text-xs">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">john@example.com</span>
              </div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="jane-smith">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0ec2bc]/20 flex items-center justify-center text-[#0ec2bc] font-medium text-xs">
                JS
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Jane Smith</span>
                <span className="text-xs text-muted-foreground">jane@example.com</span>
              </div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="bob-johnson">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0ec2bc]/20 flex items-center justify-center text-[#0ec2bc] font-medium text-xs">
                BJ
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Bob Johnson</span>
                <span className="text-xs text-muted-foreground">bob@example.com</span>
              </div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="alice-williams">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0ec2bc]/20 flex items-center justify-center text-[#0ec2bc] font-medium text-xs">
                AW
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Alice Williams</span>
                <span className="text-xs text-muted-foreground">alice@example.com</span>
              </div>
            </div>
          </AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Framework/Technology search
export const FrameworkSearch: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="framework-search">Framework or Library</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="framework-search" placeholder="Search frameworks..." />
        <AutocompleteList>
          <AutocompleteGroup label="Frontend Frameworks">
            <AutocompleteOption value="react">React</AutocompleteOption>
            <AutocompleteOption value="vue">Vue.js</AutocompleteOption>
            <AutocompleteOption value="angular">Angular</AutocompleteOption>
            <AutocompleteOption value="svelte">Svelte</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="Backend Frameworks">
            <AutocompleteOption value="nextjs">Next.js</AutocompleteOption>
            <AutocompleteOption value="express">Express.js</AutocompleteOption>
            <AutocompleteOption value="nestjs">NestJS</AutocompleteOption>
            <AutocompleteOption value="django">Django</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="UI Libraries">
            <AutocompleteOption value="mui">Material-UI</AutocompleteOption>
            <AutocompleteOption value="chakra">Chakra UI</AutocompleteOption>
            <AutocompleteOption value="tailwind">Tailwind CSS</AutocompleteOption>
            <AutocompleteOption value="baseui">Base UI</AutocompleteOption>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Command palette style
export const CommandPalette: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-lg">
      <AutocompleteRoot>
        <AutocompleteInput
          placeholder="Type a command or search..."
          className="h-12 text-base"
        />
        <AutocompleteList>
          <AutocompleteGroup label="Actions">
            <AutocompleteOption value="new-file">
              <div className="flex items-center gap-3">
                <span className="text-[#0ec2bc]">📄</span>
                <div className="flex flex-col">
                  <span className="text-sm">New File</span>
                  <span className="text-xs text-muted-foreground">Create a new file</span>
                </div>
              </div>
            </AutocompleteOption>
            <AutocompleteOption value="new-folder">
              <div className="flex items-center gap-3">
                <span className="text-[#0ec2bc]">📁</span>
                <div className="flex flex-col">
                  <span className="text-sm">New Folder</span>
                  <span className="text-xs text-muted-foreground">Create a new folder</span>
                </div>
              </div>
            </AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="Navigation">
            <AutocompleteOption value="go-home">
              <div className="flex items-center gap-3">
                <span className="text-[#0ec2bc]">🏠</span>
                <span className="text-sm">Go to Home</span>
              </div>
            </AutocompleteOption>
            <AutocompleteOption value="go-settings">
              <div className="flex items-center gap-3">
                <span className="text-[#0ec2bc]">⚙️</span>
                <span className="text-sm">Go to Settings</span>
              </div>
            </AutocompleteOption>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Multi-column results
export const MultiColumnResults: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="product-search">Search Products</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="product-search" placeholder="Search products..." />
        <AutocompleteList>
          <AutocompleteOption value="laptop-pro">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">MacBook Pro 16"</span>
                <span className="text-xs text-muted-foreground">M3 Max, 36GB RAM</span>
              </div>
              <div className="text-sm text-[#0ec2bc]">In Stock</div>
              <div className="text-sm font-medium text-foreground">$3,499</div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="laptop-air">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">MacBook Air 13"</span>
                <span className="text-xs text-muted-foreground">M2, 16GB RAM</span>
              </div>
              <div className="text-sm text-[#0ec2bc]">In Stock</div>
              <div className="text-sm font-medium text-foreground">$1,299</div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="ipad-pro">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">iPad Pro 12.9"</span>
                <span className="text-xs text-muted-foreground">M2, 256GB</span>
              </div>
              <div className="text-sm text-muted-foreground">Out of Stock</div>
              <div className="text-sm font-medium text-foreground">$1,099</div>
            </div>
          </AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// With categories/sections
export const WithCategories: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="doc-search">Search Documentation</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="doc-search" placeholder="Search docs..." />
        <AutocompleteList>
          <AutocompleteGroup label="Getting Started">
            <AutocompleteOption value="intro">Introduction</AutocompleteOption>
            <AutocompleteOption value="install">Installation</AutocompleteOption>
            <AutocompleteOption value="quickstart">Quick Start Guide</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="Components">
            <AutocompleteOption value="button">Button</AutocompleteOption>
            <AutocompleteOption value="input">Input</AutocompleteOption>
            <AutocompleteOption value="select">Select</AutocompleteOption>
            <AutocompleteOption value="autocomplete">Autocomplete</AutocompleteOption>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteGroup label="API Reference">
            <AutocompleteOption value="api-auth">Authentication</AutocompleteOption>
            <AutocompleteOption value="api-users">Users API</AutocompleteOption>
            <AutocompleteOption value="api-data">Data API</AutocompleteOption>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Async search with loading
export const AsyncSearch: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false)
    const [results, setResults] = React.useState<string[]>([])

    const handleInputChange = (value: string) => {
      if (value.length === 0) {
        setResults([])
        return
      }

      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockResults = [
          'Result 1 for ' + value,
          'Result 2 for ' + value,
          'Result 3 for ' + value,
          'Result 4 for ' + value,
        ]
        setResults(mockResults)
        setLoading(false)
      }, 500)
    }

    return (
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Label htmlFor="async-search">Async Search</Label>
        <AutocompleteRoot>
          <AutocompleteInput
            id="async-search"
            placeholder="Type to search..."
            onInputChange={handleInputChange}
          />
          <AutocompleteList emptyMessage={loading ? 'Loading...' : 'No results found'}>
            {results.map((result, index) => (
              <AutocompleteOption key={index} value={result}>
                {result}
              </AutocompleteOption>
            ))}
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    )
  },
}

// No results state
export const NoResults: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="empty-search">Search (try typing something)</Label>
      <AutocompleteRoot defaultOpen={true}>
        <AutocompleteInput id="empty-search" placeholder="Search..." defaultValue="xyz123" />
        <AutocompleteList emptyMessage="No matches found. Try a different search term.">
          <AutocompleteOption value="apple">Apple</AutocompleteOption>
          <AutocompleteOption value="banana">Banana</AutocompleteOption>
          <AutocompleteOption value="cherry">Cherry</AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Recent searches
export const RecentSearches: Story = {
  render: () => {
    const [recentSearches, setRecentSearches] = React.useState([
      'Vienna',
      'Salzburg',
      'Munich',
    ])

    return (
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Label htmlFor="recent-search">City Search</Label>
        <AutocompleteRoot>
          <AutocompleteInput id="recent-search" placeholder="Search cities..." />
          <AutocompleteList>
            {recentSearches.length > 0 && (
              <>
                <AutocompleteGroup label="Recent Searches">
                  {recentSearches.map((search) => (
                    <AutocompleteOption key={search} value={search}>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🕐</span>
                        <span>{search}</span>
                      </div>
                    </AutocompleteOption>
                  ))}
                </AutocompleteGroup>
                <AutocompleteSeparator />
              </>
            )}
            <AutocompleteGroup label="All Cities">
              <AutocompleteOption value="vienna">Vienna</AutocompleteOption>
              <AutocompleteOption value="salzburg">Salzburg</AutocompleteOption>
              <AutocompleteOption value="munich">Munich</AutocompleteOption>
              <AutocompleteOption value="berlin">Berlin</AutocompleteOption>
              <AutocompleteOption value="zurich">Zurich</AutocompleteOption>
            </AutocompleteGroup>
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    )
  },
}

// Highlighted matching text
export const HighlightedText: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="highlight-search">Search with Highlighting</Label>
      <p className="text-xs text-muted-foreground mb-2">
        Type to see matching text highlighted in cyan
      </p>
      <AutocompleteRoot>
        <AutocompleteInput id="highlight-search" placeholder="Type 'java' or 'script'..." />
        <AutocompleteList>
          <AutocompleteOption value="javascript">JavaScript</AutocompleteOption>
          <AutocompleteOption value="typescript">TypeScript</AutocompleteOption>
          <AutocompleteOption value="java">Java</AutocompleteOption>
          <AutocompleteOption value="python">Python</AutocompleteOption>
          <AutocompleteOption value="ruby">Ruby</AutocompleteOption>
          <AutocompleteOption value="rust">Rust</AutocompleteOption>
          <AutocompleteOption value="go">Go</AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Custom rendering
export const CustomRendering: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="custom-search">Repository Search</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="custom-search" placeholder="Search repositories..." />
        <AutocompleteList>
          <AutocompleteOption value="ozean-licht-ecosystem">
            <div className="flex items-start gap-3 py-1">
              <div className="text-2xl">📦</div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    ozean-licht-ecosystem
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0ec2bc]/20 text-[#0ec2bc]">
                    Public
                  </span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  Monorepo for Austrian associations: Kids Ascension and Ozean Licht platforms
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">⭐ 42</span>
                  <span className="text-xs text-muted-foreground">TypeScript</span>
                </div>
              </div>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="kids-ascension">
            <div className="flex items-start gap-3 py-1">
              <div className="text-2xl">📚</div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    kids-ascension
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0ec2bc]/20 text-[#0ec2bc]">
                    Public
                  </span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  Educational platform for children with interactive learning modules
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">⭐ 28</span>
                  <span className="text-xs text-muted-foreground">React</span>
                </div>
              </div>
            </div>
          </AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Glass effect variants
export const GlassEffectVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6 min-w-md">
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Standard Glass</Label>
        <AutocompleteRoot>
          <AutocompleteInput placeholder="Search..." className="glass-card" />
          <AutocompleteList>
            <AutocompleteOption value="option1">Option 1</AutocompleteOption>
            <AutocompleteOption value="option2">Option 2</AutocompleteOption>
            <AutocompleteOption value="option3">Option 3</AutocompleteOption>
          </AutocompleteList>
        </AutocompleteRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Strong Glass</Label>
        <AutocompleteRoot>
          <AutocompleteInput placeholder="Search..." className="glass-card-strong" />
          <AutocompleteList>
            <AutocompleteOption value="option1">Option 1</AutocompleteOption>
            <AutocompleteOption value="option2">Option 2</AutocompleteOption>
            <AutocompleteOption value="option3">Option 3</AutocompleteOption>
          </AutocompleteList>
        </AutocompleteRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Subtle Glass</Label>
        <AutocompleteRoot>
          <AutocompleteInput placeholder="Search..." className="glass-subtle" />
          <AutocompleteList>
            <AutocompleteOption value="option1">Option 1</AutocompleteOption>
            <AutocompleteOption value="option2">Option 2</AutocompleteOption>
            <AutocompleteOption value="option3">Option 3</AutocompleteOption>
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    </div>
  ),
}

// Keyboard navigation example
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <Label htmlFor="keyboard-search">Keyboard Navigation Demo</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Use ↑↓ arrow keys to navigate, Enter to select, Escape to close
        </p>
      </div>
      <AutocompleteRoot>
        <AutocompleteInput id="keyboard-search" placeholder="Try keyboard navigation..." />
        <AutocompleteList>
          <AutocompleteOption value="option-1">
            Press ↓ to highlight me
          </AutocompleteOption>
          <AutocompleteOption value="option-2">
            Use ↑↓ to navigate
          </AutocompleteOption>
          <AutocompleteOption value="option-3">
            Press Enter to select
          </AutocompleteOption>
          <AutocompleteOption value="option-4">
            Press Escape to close
          </AutocompleteOption>
          <AutocompleteOption value="option-5">
            Type to filter results
          </AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Disabled options
export const DisabledOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="disabled-search">With Disabled Options</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="disabled-search" placeholder="Search..." />
        <AutocompleteList>
          <AutocompleteOption value="available-1">Available Option 1</AutocompleteOption>
          <AutocompleteOption value="unavailable" disabled>
            Unavailable (Disabled)
          </AutocompleteOption>
          <AutocompleteOption value="available-2">Available Option 2</AutocompleteOption>
          <AutocompleteOption value="coming-soon" disabled>
            Coming Soon (Disabled)
          </AutocompleteOption>
          <AutocompleteOption value="available-3">Available Option 3</AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Programming language search
export const ProgrammingLanguages: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="lang-search">Programming Language</Label>
      <AutocompleteRoot>
        <AutocompleteInput id="lang-search" placeholder="Search languages..." />
        <AutocompleteList>
          <AutocompleteOption value="javascript">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center text-xs">
                JS
              </div>
              <span>JavaScript</span>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="typescript">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-xs">
                TS
              </div>
              <span>TypeScript</span>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="python">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-xs">
                PY
              </div>
              <span>Python</span>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="rust">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-xs">
                RS
              </div>
              <span>Rust</span>
            </div>
          </AutocompleteOption>
          <AutocompleteOption value="go">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center text-xs">
                GO
              </div>
              <span>Go</span>
            </div>
          </AutocompleteOption>
        </AutocompleteList>
      </AutocompleteRoot>
    </div>
  ),
}

// Tag/Label search
export const TagSearch: Story = {
  render: () => {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div>
          <Label htmlFor="tag-search">Add Tags</Label>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-md bg-[#0ec2bc]/20 text-[#0ec2bc] border border-[#0ec2bc]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <AutocompleteRoot>
          <AutocompleteInput id="tag-search" placeholder="Search tags..." />
          <AutocompleteList>
            <AutocompleteGroup label="Popular">
              <AutocompleteOption value="react">react</AutocompleteOption>
              <AutocompleteOption value="typescript">typescript</AutocompleteOption>
              <AutocompleteOption value="javascript">javascript</AutocompleteOption>
            </AutocompleteGroup>
            <AutocompleteSeparator />
            <AutocompleteGroup label="Categories">
              <AutocompleteOption value="frontend">frontend</AutocompleteOption>
              <AutocompleteOption value="backend">backend</AutocompleteOption>
              <AutocompleteOption value="fullstack">fullstack</AutocompleteOption>
              <AutocompleteOption value="design">design</AutocompleteOption>
            </AutocompleteGroup>
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    )
  },
}

// Accessibility example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Accessible Autocomplete
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          With proper ARIA attributes and keyboard support
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-search" className="flex items-center gap-1">
          Search Countries <span className="text-red-500">*</span>
        </Label>
        <AutocompleteRoot>
          <AutocompleteInput
            id="accessible-search"
            placeholder="Type to search countries..."
            aria-label="Search for a country"
            aria-required="true"
            aria-describedby="search-description"
          />
          <AutocompleteList>
            <AutocompleteOption value="austria">Austria</AutocompleteOption>
            <AutocompleteOption value="germany">Germany</AutocompleteOption>
            <AutocompleteOption value="switzerland">Switzerland</AutocompleteOption>
            <AutocompleteOption value="france">France</AutocompleteOption>
            <AutocompleteOption value="italy">Italy</AutocompleteOption>
          </AutocompleteList>
        </AutocompleteRoot>
        <p id="search-description" className="text-xs text-muted-foreground">
          Select your country. Use arrow keys to navigate, Enter to select.
        </p>
      </div>
    </div>
  ),
}

// Long list with scrolling
export const LongList: Story = {
  render: () => {
    const countries = [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
      'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
      'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Norway',
    ]

    return (
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Label htmlFor="country-search">European Countries</Label>
        <AutocompleteRoot>
          <AutocompleteInput id="country-search" placeholder="Search countries..." />
          <AutocompleteList>
            {countries.map((country) => (
              <AutocompleteOption key={country} value={country}>
                {country}
              </AutocompleteOption>
            ))}
          </AutocompleteList>
        </AutocompleteRoot>
      </div>
    )
  },
}

// Controlled component
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const [inputValue, setInputValue] = React.useState('')

    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="controlled-search">Controlled Autocomplete</Label>
          <AutocompleteRoot value={value} onValueChange={setValue}>
            <AutocompleteInput
              id="controlled-search"
              placeholder="Type to search..."
              onInputChange={setInputValue}
            />
            <AutocompleteList>
              <AutocompleteOption value="option-1">Option 1</AutocompleteOption>
              <AutocompleteOption value="option-2">Option 2</AutocompleteOption>
              <AutocompleteOption value="option-3">Option 3</AutocompleteOption>
              <AutocompleteOption value="option-4">Option 4</AutocompleteOption>
            </AutocompleteList>
          </AutocompleteRoot>
        </div>

        {(value || inputValue) && (
          <div className="p-4 rounded-lg bg-card/50 border border-border">
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">Selected Value:</span>{' '}
                <span className="font-medium text-[#0ec2bc]">{value || 'None'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Input Value:</span>{' '}
                <span className="font-medium text-foreground">{inputValue || 'None'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
}
