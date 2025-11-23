/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  User,
  Folder,
  Eye,
  Zap,
  FilePlus,
  FolderPlus,
  Save,
  Download,
  Upload,
  Search,
  Tag,
  Star,
  Globe,
  Palette,
  Settings,
  BarChart3,
  Filter,
  FileEdit,
  Bell,
  PenLine,
  Sparkles,
} from 'lucide-react'
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubPopup,
  MenuGroup,
  MenuGroupLabel,
} from './menu'

const meta: Meta = {
  title: 'CossUI/Menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Menu component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, supports groups, separators, checkboxes, radio items, and submenus. Provides fully composable dropdown menu experience with smooth animations and Ozean Licht oceanic cyan color scheme.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/**
 * Default Menu
 * A simple menu with basic items demonstrating the foundational menu component.
 */
export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Menu</MenuTrigger>
      <MenuPopup>
        <MenuItem>New File</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Save</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * With Separators
 * Menu items organized with visual separators for logical grouping.
 */
export const WithSeparators: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>File Menu</MenuTrigger>
      <MenuPopup>
        <MenuItem>New</MenuItem>
        <MenuItem>Open...</MenuItem>
        <MenuItem>Recent</MenuItem>
        <MenuSeparator />
        <MenuItem>Save</MenuItem>
        <MenuItem>Save As...</MenuItem>
        <MenuSeparator />
        <MenuItem className="text-red-500">Exit</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * With Groups and Labels
 * Menu items organized into labeled groups for better navigation.
 */
export const WithGroupsAndLabels: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Edit Menu</MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Editing</MenuGroupLabel>
          <MenuItem>Undo</MenuItem>
          <MenuItem>Redo</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Clipboard</MenuGroupLabel>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Selection</MenuGroupLabel>
          <MenuItem>Select All</MenuItem>
          <MenuItem>Deselect All</MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * With Checkbox Items
 * Menu items with checkbox functionality for toggling options.
 */
export const WithCheckboxItems: Story = {
  render: () => {
    const [showGrid, setShowGrid] = useState(false)
    const [showRulers, setShowRulers] = useState(true)
    const [showGuides, setShowGuides] = useState(false)

    return (
      <Menu>
        <MenuTrigger>View Options</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Display</MenuGroupLabel>
            <MenuCheckboxItem
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            >
              Show Grid
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={showRulers}
              onChange={(e) => setShowRulers(e.target.checked)}
            >
              Show Rulers
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={showGuides}
              onChange={(e) => setShowGuides(e.target.checked)}
            >
              Show Guides
            </MenuCheckboxItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * With Radio Items
 * Menu items with radio button selection for mutually exclusive options.
 */
export const WithRadioItems: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState('name')

    return (
      <Menu>
        <MenuTrigger>Sort By</MenuTrigger>
        <MenuPopup>
          <MenuRadioGroup value={sortBy} onValueChange={setSortBy}>
            <MenuRadioItem value="name">Name</MenuRadioItem>
            <MenuRadioItem value="date">Date Modified</MenuRadioItem>
            <MenuRadioItem value="size">File Size</MenuRadioItem>
            <MenuRadioItem value="type">File Type</MenuRadioItem>
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * With Submenu
 * Nested menu structure with submenu support for complex hierarchies.
 */
export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Tools</MenuTrigger>
      <MenuPopup>
        <MenuItem>Calculator</MenuItem>
        <MenuItem>Terminal</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Development</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Debug Mode</MenuItem>
            <MenuItem>Console</MenuItem>
            <MenuItem>Network Inspector</MenuItem>
            <MenuSeparator />
            <MenuSub>
              <MenuSubTrigger>Code Formatting</MenuSubTrigger>
              <MenuSubPopup>
                <MenuItem>Beautify</MenuItem>
                <MenuItem>Minify</MenuItem>
                <MenuItem>Format JSON</MenuItem>
              </MenuSubPopup>
            </MenuSub>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * User Menu
 * A typical user profile menu with account options and actions.
 */
export const UserMenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger><User className="w-4 h-4 text-primary" />Account</MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>User Profile</MenuGroupLabel>
          <MenuItem>My Profile</MenuItem>
          <MenuItem>Account Settings</MenuItem>
          <MenuItem>Billing & Plans</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Preferences</MenuGroupLabel>
          <MenuItem>Theme Settings</MenuItem>
          <MenuItem>Notifications</MenuItem>
          <MenuItem>Privacy & Security</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem className="text-red-500">Logout</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * File Operations Menu
 * A menu for file-related operations demonstrating common actions.
 */
export const FileOperationsMenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger><Folder className="w-4 h-4 text-primary" />File</MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>File Actions</MenuGroupLabel>
          <MenuItem>New Project</MenuItem>
          <MenuItem>Open File...</MenuItem>
          <MenuItem>Open Recent</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Save</MenuGroupLabel>
          <MenuItem>Save</MenuItem>
          <MenuItem>Save As...</MenuItem>
          <MenuItem>Export As...</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>Close Tab</MenuItem>
        <MenuItem>Close All</MenuItem>
        <MenuSeparator />
        <MenuItem className="text-red-500">Exit</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Edit Operations Menu
 * A menu showcasing typical edit operations with clipboard actions.
 */
export const EditOperationsMenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger><PenLine className="w-4 h-4 text-primary" />Edit</MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Undo/Redo</MenuGroupLabel>
          <MenuItem>Undo</MenuItem>
          <MenuItem>Redo</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Clipboard</MenuGroupLabel>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Selection</MenuGroupLabel>
          <MenuItem>Select All</MenuItem>
          <MenuItem>Deselect All</MenuItem>
          <MenuItem>Invert Selection</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>Find & Replace...</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * View Menu
 * A menu for toggling various view options and display settings.
 */
export const ViewMenu: Story = {
  render: () => {
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const [fullscreen, setFullscreen] = useState(false)
    const [zoomLevel, setZoomLevel] = useState('100')

    return (
      <Menu>
        <MenuTrigger><Eye className="w-4 h-4 text-primary" />View</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Display</MenuGroupLabel>
            <MenuCheckboxItem
              checked={sidebarVisible}
              onChange={(e) => setSidebarVisible(e.target.checked)}
            >
              Sidebar
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={fullscreen}
              onChange={(e) => setFullscreen(e.target.checked)}
            >
              Fullscreen
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Zoom Level</MenuGroupLabel>
            <MenuRadioGroup value={zoomLevel} onValueChange={setZoomLevel}>
              <MenuRadioItem value="75">75%</MenuRadioItem>
              <MenuRadioItem value="100">100%</MenuRadioItem>
              <MenuRadioItem value="125">125%</MenuRadioItem>
              <MenuRadioItem value="150">150%</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Sort Menu with Radio Items
 * A practical sorting menu demonstrating radio item selection.
 */
export const SortMenu: Story = {
  render: () => {
    const [sortOrder, setSortOrder] = useState('asc')

    return (
      <Menu>
        <MenuTrigger>Sort</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Sort By Name</MenuGroupLabel>
            <MenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
              <MenuRadioItem value="asc">Ascending (A-Z)</MenuRadioItem>
              <MenuRadioItem value="desc">Descending (Z-A)</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Additional Options</MenuGroupLabel>
            <MenuRadioGroup value="case" onValueChange={() => {}}>
              <MenuRadioItem value="sensitive">Case Sensitive</MenuRadioItem>
              <MenuRadioItem value="insensitive">Case Insensitive</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Settings Menu with Checkboxes
 * A settings menu demonstrating multiple toggle options.
 */
export const SettingsMenu: Story = {
  render: () => {
    const [autoSave, setAutoSave] = useState(true)
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(true)
    const [analytics, setAnalytics] = useState(false)

    return (
      <Menu>
        <MenuTrigger><Settings className="w-4 h-4 text-primary" />Settings</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Application</MenuGroupLabel>
            <MenuCheckboxItem
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
            >
              Auto-save
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            >
              Enable Notifications
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            >
              Dark Mode
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Privacy & Data</MenuGroupLabel>
            <MenuCheckboxItem
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            >
              Share Analytics
            </MenuCheckboxItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Disabled Items
 * Menu demonstrating disabled menu items in various contexts.
 */
export const DisabledItems: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuPopup>
        <MenuItem>Available Action 1</MenuItem>
        <MenuItem disabled>Unavailable Action</MenuItem>
        <MenuItem>Available Action 2</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Disabled Option</MenuItem>
        <MenuItem>Available Action 3</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * With Icons (Emoji)
 * Menu items with emoji icons for visual clarity.
 */
export const WithIcons: Story = {
  render: () => (
    <Menu>
      <MenuTrigger><Zap className="w-4 h-4 text-primary" />Quick Actions</MenuTrigger>
      <MenuPopup>
        <MenuItem><FilePlus className="w-4 h-4 text-primary" />New Document</MenuItem>
        <MenuItem><FolderPlus className="w-4 h-4 text-primary" />New Folder</MenuItem>
        <MenuSeparator />
        <MenuItem><Save className="w-4 h-4 text-primary" />Save</MenuItem>
        <MenuItem><Download className="w-4 h-4 text-primary" />Import</MenuItem>
        <MenuItem><Upload className="w-4 h-4 text-primary" />Export</MenuItem>
        <MenuSeparator />
        <MenuItem><Search className="w-4 h-4 text-primary" />Search</MenuItem>
        <MenuItem><Tag className="w-4 h-4 text-primary" />Tags</MenuItem>
        <MenuItem><Star className="w-4 h-4 text-primary" />Favorites</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Context Menu Style
 * A menu styled like a context menu with right-click actions.
 */
export const ContextMenuStyle: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Right-Click Menu</MenuTrigger>
      <MenuPopup>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuSeparator />
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Create Link</MenuItem>
        <MenuSeparator />
        <MenuItem>Move to Trash</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Language/Locale Selection
 * A menu for selecting language or locale preferences.
 */
export const LanguageSelection: Story = {
  render: () => {
    const [language, setLanguage] = useState('en')

    return (
      <Menu>
        <MenuTrigger><Globe className="w-4 h-4 text-primary" />Language</MenuTrigger>
        <MenuPopup>
          <MenuRadioGroup value={language} onValueChange={setLanguage}>
            <MenuRadioItem value="en">English</MenuRadioItem>
            <MenuRadioItem value="de">Deutsch</MenuRadioItem>
            <MenuRadioItem value="fr">Français</MenuRadioItem>
            <MenuRadioItem value="es">Español</MenuRadioItem>
            <MenuRadioItem value="it">Italiano</MenuRadioItem>
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Theme/Appearance Menu
 * A menu for selecting visual appearance options.
 */
export const ThemeMenu: Story = {
  render: () => {
    const [theme, setTheme] = useState('dark')
    const [accentColor, setAccentColor] = useState('cyan')

    return (
      <Menu>
        <MenuTrigger><Palette className="w-4 h-4 text-primary" />Appearance</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Theme</MenuGroupLabel>
            <MenuRadioGroup value={theme} onValueChange={setTheme}>
              <MenuRadioItem value="light">Light</MenuRadioItem>
              <MenuRadioItem value="dark">Dark</MenuRadioItem>
              <MenuRadioItem value="auto">Auto (System)</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Accent Color</MenuGroupLabel>
            <MenuRadioGroup value={accentColor} onValueChange={setAccentColor}>
              <MenuRadioItem value="cyan">Oceanic Cyan (#0ec2bc)</MenuRadioItem>
              <MenuRadioItem value="blue">Ocean Blue</MenuRadioItem>
              <MenuRadioItem value="teal">Deep Teal</MenuRadioItem>
              <MenuRadioItem value="purple">Purple</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Complex Nested Submenus
 * A menu with multiple levels of nesting for complex hierarchies.
 */
export const ComplexNestedSubmenus: Story = {
  render: () => (
    <Menu>
      <MenuTrigger><Settings className="w-4 h-4 text-primary" />Advanced Tools</MenuTrigger>
      <MenuPopup>
        <MenuSub>
          <MenuSubTrigger>Development</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Console</MenuItem>
            <MenuItem>Debugger</MenuItem>
            <MenuSeparator />
            <MenuSub>
              <MenuSubTrigger>Code Generators</MenuSubTrigger>
              <MenuSubPopup>
                <MenuItem>Component Generator</MenuItem>
                <MenuItem>API Schema Generator</MenuItem>
                <MenuItem>Type Definitions</MenuItem>
              </MenuSubPopup>
            </MenuSub>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Analysis</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Performance Profile</MenuItem>
            <MenuItem>Memory Usage</MenuItem>
            <MenuSeparator />
            <MenuSub>
              <MenuSubTrigger>Reports</MenuSubTrigger>
              <MenuSubPopup>
                <MenuItem>Generate Report</MenuItem>
                <MenuItem>Export Data</MenuItem>
                <MenuItem>Schedule Reports</MenuItem>
              </MenuSubPopup>
            </MenuSub>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Clear Cache</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Accessibility-Focused Menu
 * A menu with proper ARIA labels and semantic structure.
 */
export const AccessibilityFocused: Story = {
  render: () => (
    <Menu>
      <MenuTrigger aria-label="Open main application menu">
        Menu
      </MenuTrigger>
      <MenuPopup role="menu">
        <MenuGroup>
          <MenuGroupLabel id="file-group">File Operations</MenuGroupLabel>
          <MenuItem role="menuitem" aria-label="Create a new file">
            New
          </MenuItem>
          <MenuItem role="menuitem" aria-label="Open an existing file">
            Open
          </MenuItem>
          <MenuItem role="menuitem" aria-label="Save the current file">
            Save
          </MenuItem>
        </MenuGroup>
        <MenuSeparator role="separator" />
        <MenuGroup>
          <MenuGroupLabel id="edit-group">Edit Operations</MenuGroupLabel>
          <MenuItem role="menuitem">Undo</MenuItem>
          <MenuItem role="menuitem">Redo</MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Glass Effect Menu
 * Menu with enhanced glass morphism effects.
 */
export const GlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg">
      <Menu>
        <MenuTrigger><Sparkles className="w-4 h-4 text-primary" />Glassmorphic Menu</MenuTrigger>
        <MenuPopup className="glass-card-strong">
          <MenuGroup>
            <MenuGroupLabel>Appearance</MenuGroupLabel>
            <MenuItem>Theme Settings</MenuItem>
            <MenuItem>Color Scheme</MenuItem>
            <MenuItem>Transparency Level</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Effects</MenuGroupLabel>
            <MenuItem>Blur Amount</MenuItem>
            <MenuItem>Glassmorphism Style</MenuItem>
            <MenuItem>Shadow Depth</MenuItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </div>
  ),
}

/**
 * Long Menu Items
 * A menu with items containing longer text to show overflow handling.
 */
export const LongMenuItems: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Documentation</MenuTrigger>
      <MenuPopup className="min-w-[18rem]">
        <MenuItem>Getting Started with Ozean Licht Design System</MenuItem>
        <MenuItem>Understanding Glass Morphism Effects</MenuItem>
        <MenuItem>Component API Reference and Examples</MenuItem>
        <MenuSeparator />
        <MenuItem>Best Practices for Accessibility</MenuItem>
        <MenuItem>Performance Optimization Guidelines</MenuItem>
      </MenuPopup>
    </Menu>
  ),
}

/**
 * Menu with Mixed Content
 * A menu combining various item types, separators, and groups.
 */
export const MixedContent: Story = {
  render: () => {
    const [showNotifications, setShowNotifications] = useState(true)
    const [viewMode, setViewMode] = useState('list')

    return (
      <Menu>
        <MenuTrigger><BarChart3 className="w-4 h-4 text-primary" />Dashboard</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Display Options</MenuGroupLabel>
            <MenuRadioGroup value={viewMode} onValueChange={setViewMode}>
              <MenuRadioItem value="list">List View</MenuRadioItem>
              <MenuRadioItem value="grid">Grid View</MenuRadioItem>
              <MenuRadioItem value="table">Table View</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Notifications</MenuGroupLabel>
            <MenuCheckboxItem
              checked={showNotifications}
              onChange={(e) => setShowNotifications(e.target.checked)}
            >
              Show Notifications
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem>Refresh Data</MenuItem>
          <MenuItem>Export to CSV</MenuItem>
          <MenuSeparator />
          <MenuItem>Help & Support</MenuItem>
      </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Responsive Menu Trigger
 * A menu with a responsive trigger button demonstrating different sizes.
 */
export const ResponsiveMenu: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center">
      <Menu>
        <MenuTrigger className="px-2 py-1 text-xs">Compact</MenuTrigger>
        <MenuPopup className="min-w-[10rem]">
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
          <MenuItem>Option 3</MenuItem>
        </MenuPopup>
      </Menu>

      <Menu>
        <MenuTrigger>Default</MenuTrigger>
        <MenuPopup>
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
          <MenuItem>Option 3</MenuItem>
        </MenuPopup>
      </Menu>

      <Menu>
        <MenuTrigger className="px-6 py-3 text-base">Large</MenuTrigger>
        <MenuPopup className="min-w-[14rem]">
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
          <MenuItem>Option 3</MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  ),
}

/**
 * Real-World E-commerce Menu
 * A practical e-commerce product menu with categories and filters.
 */
export const EcommerceMenu: Story = {
  render: () => {
    const [priceRange, setPriceRange] = useState('all')
    const [inStock, setInStock] = useState(true)

    return (
      <Menu>
        <MenuTrigger><Filter className="w-4 h-4 text-primary" />Filter & Sort</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Sort By</MenuGroupLabel>
            <MenuRadioGroup value="popular" onValueChange={() => {}}>
              <MenuRadioItem value="popular">Most Popular</MenuRadioItem>
              <MenuRadioItem value="newest">Newest</MenuRadioItem>
              <MenuRadioItem value="price-low">Price: Low to High</MenuRadioItem>
              <MenuRadioItem value="price-high">Price: High to Low</MenuRadioItem>
              <MenuRadioItem value="rating">Highest Rated</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Price Range</MenuGroupLabel>
            <MenuRadioGroup value={priceRange} onValueChange={setPriceRange}>
              <MenuRadioItem value="all">All Prices</MenuRadioItem>
              <MenuRadioItem value="0-50">Under $50</MenuRadioItem>
              <MenuRadioItem value="50-100">$50 - $100</MenuRadioItem>
              <MenuRadioItem value="100-500">$100 - $500</MenuRadioItem>
              <MenuRadioItem value="500+">$500+</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuCheckboxItem checked={inStock} onChange={(e) => setInStock(e.target.checked)}>
            In Stock Only
          </MenuCheckboxItem>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Markdown/Text Editor Menu
 * A practical menu for a text or markdown editor with formatting options.
 */
export const MarkdownEditorMenu: Story = {
  render: () => {
    const [syntaxHighlight, setSyntaxHighlight] = useState(true)
    const [lineNumbers, setLineNumbers] = useState(true)
    const [wordWrap, setWordWrap] = useState(false)

    return (
      <Menu>
        <MenuTrigger><FileEdit className="w-4 h-4 text-primary" />Editor Options</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Text Formatting</MenuGroupLabel>
            <MenuItem>Make Bold</MenuItem>
            <MenuItem>Make Italic</MenuItem>
            <MenuItem>Add Code Block</MenuItem>
            <MenuItem>Add Link</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Display Settings</MenuGroupLabel>
            <MenuCheckboxItem checked={syntaxHighlight} onChange={(e) => setSyntaxHighlight(e.target.checked)}>
              Syntax Highlighting
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={lineNumbers} onChange={(e) => setLineNumbers(e.target.checked)}>
              Show Line Numbers
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)}>
              Word Wrap
            </MenuCheckboxItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
}

/**
 * Multiple Independent Menus
 * Several menus working independently in the same space.
 */
export const MultipleMenus: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center">
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuPopup className="min-w-[10rem]">
          <MenuItem>New</MenuItem>
          <MenuItem>Open</MenuItem>
          <MenuItem>Save</MenuItem>
        </MenuPopup>
      </Menu>

      <Menu>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuPopup className="min-w-[10rem]">
          <MenuItem>Undo</MenuItem>
          <MenuItem>Redo</MenuItem>
          <MenuSeparator />
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuPopup>
      </Menu>

      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuPopup className="min-w-[10rem]">
          <MenuItem>Zoom In</MenuItem>
          <MenuItem>Zoom Out</MenuItem>
          <MenuItem>Reset Zoom</MenuItem>
        </MenuPopup>
      </Menu>

      <Menu>
        <MenuTrigger>Help</MenuTrigger>
        <MenuPopup className="min-w-[10rem]">
          <MenuItem>Documentation</MenuItem>
          <MenuItem>Report Issue</MenuItem>
          <MenuItem>About</MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  ),
}

/**
 * Notification/Status Menu
 * A menu displaying status-related options and notifications.
 */
export const NotificationMenu: Story = {
  render: () => {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [status, setStatus] = useState('available')

    return (
      <Menu>
        <MenuTrigger><Bell className="w-4 h-4 text-primary" />Notifications</MenuTrigger>
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Status</MenuGroupLabel>
            <MenuRadioGroup value={status} onValueChange={setStatus}>
              <MenuRadioItem value="available">Available</MenuRadioItem>
              <MenuRadioItem value="busy">Busy</MenuRadioItem>
              <MenuRadioItem value="away">Away</MenuRadioItem>
              <MenuRadioItem value="offline">Offline</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Notification Channels</MenuGroupLabel>
            <MenuCheckboxItem
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            >
              Email Notifications
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
            >
              Push Notifications
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem>Mark All as Read</MenuItem>
          <MenuItem>Notification Settings</MenuItem>
        </MenuPopup>
      </Menu>
    )
  },
}
