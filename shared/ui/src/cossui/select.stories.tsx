/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from "@storybook/react";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "./select";
import { Label } from "./label";

const meta: Meta = {
  title: "CossUI/Select",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Select component from Coss UI adapted for Ozean Licht design system. Built on Base UI with glass morphism effects, supports grouping, and provides accessible dropdown selections with customizable items and styling.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Basic default select
export const Default: Story = {
  render: () => (
    <Select defaultValue="option-1">
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectPopup>
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </SelectPopup>
    </Select>
  ),
};

// Select with placeholder
export const WithPlaceholder: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-placeholder">Choose an item</Label>
      <Select>
        <SelectTrigger id="select-placeholder">
          <SelectValue placeholder="Click to select..." />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Select with grouped items
export const WithGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-groups">Select a language</Label>
      <Select>
        <SelectTrigger id="select-groups">
          <SelectValue placeholder="Choose a language" />
        </SelectTrigger>

        <SelectPopup>
          <SelectGroup>
            <SelectLabel>Programming Languages</SelectLabel>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Markup Languages</SelectLabel>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
          </SelectGroup>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Select with separators
export const WithSeparators: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-separators">Select action</Label>
      <Select>
        <SelectTrigger id="select-separators">
          <SelectValue placeholder="Choose an action" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="create">Create New</SelectItem>
          <SelectItem value="edit">Edit</SelectItem>
          <SelectItem value="view">View</SelectItem>
          <SelectSeparator />
          <SelectItem value="duplicate">Duplicate</SelectItem>
          <SelectItem value="export">Export</SelectItem>
          <SelectSeparator />
          <SelectItem value="delete" className="text-red-500">
            Delete
          </SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Disabled select
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-disabled">Disabled Select</Label>
      <Select defaultValue="option-1" disabled>
        <SelectTrigger id="select-disabled" disabled>
          <SelectValue placeholder="Cannot select" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="option-1">Option 1</SelectItem>
          <SelectItem value="option-2">Option 2</SelectItem>
          <SelectItem value="option-3">Option 3</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Disabled individual items
export const DisabledItems: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-disabled-items">Select with disabled items</Label>
      <Select>
        <SelectTrigger id="select-disabled-items">
          <SelectValue placeholder="Some options are unavailable" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="available">Available Option</SelectItem>
          <SelectItem value="disabled-1" disabled>
            Unavailable (Disabled)
          </SelectItem>
          <SelectItem value="available-2">Another Available</SelectItem>
          <SelectItem value="disabled-2" disabled>
            Also Disabled
          </SelectItem>
          <SelectItem value="available-3">Third Option</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Framework/Technology picker
export const FrameworkPicker: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="framework-select">Choose your framework</Label>
      <Select defaultValue="react">
        <SelectTrigger id="framework-select">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>

        <SelectPopup>
          <SelectGroup>
            <SelectLabel>Frontend Frameworks</SelectLabel>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Backend Frameworks</SelectLabel>
            <SelectItem value="nextjs">Next.js</SelectItem>
            <SelectItem value="express">Express.js</SelectItem>
            <SelectItem value="django">Django</SelectItem>
            <SelectItem value="rails">Ruby on Rails</SelectItem>
          </SelectGroup>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Select with long option list
export const LongOptionList: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-long">Select a country</Label>
      <Select>
        <SelectTrigger id="select-long">
          <SelectValue placeholder="Choose a country" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="nz">New Zealand</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="be">Belgium</SelectItem>
          <SelectItem value="ch">Switzerland</SelectItem>
          <SelectItem value="se">Sweden</SelectItem>
          <SelectItem value="no">Norway</SelectItem>
          <SelectItem value="dk">Denmark</SelectItem>
          <SelectItem value="fi">Finland</SelectItem>
          <SelectItem value="at">Austria</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="cn">China</SelectItem>
          <SelectItem value="in">India</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Select with icon indicators (emoji as placeholders)
export const WithIconIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-icons">Select a difficulty level</Label>
      <Select>
        <SelectTrigger id="select-icons">
          <SelectValue placeholder="Choose difficulty" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="beginner">📚 Beginner</SelectItem>
          <SelectItem value="intermediate">📖 Intermediate</SelectItem>
          <SelectItem value="advanced">🚀 Advanced</SelectItem>
          <SelectItem value="expert">⭐ Expert</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Multi-section select with categories
export const MultiSection: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-multi">Select a product category</Label>
      <Select>
        <SelectTrigger id="select-multi">
          <SelectValue placeholder="Browse categories" />
        </SelectTrigger>

        <SelectPopup>
          <SelectGroup>
            <SelectLabel>Electronics</SelectLabel>
            <SelectItem value="laptops">Laptops</SelectItem>
            <SelectItem value="phones">Phones</SelectItem>
            <SelectItem value="tablets">Tablets</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Clothing</SelectLabel>
            <SelectItem value="mens">Men's</SelectItem>
            <SelectItem value="womens">Women's</SelectItem>
            <SelectItem value="kids">Kids</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Home & Garden</SelectLabel>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="decor">Decor</SelectItem>
            <SelectItem value="appliances">Appliances</SelectItem>
          </SelectGroup>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Select with custom value display
export const WithValueDisplay: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>("");
    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="select-display">Select an item</Label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger id="select-display">
              <SelectValue placeholder="Choose an item" />
            </SelectTrigger>

            <SelectPopup>
              <SelectItem value="item-1">Item 1</SelectItem>
              <SelectItem value="item-2">Item 2</SelectItem>
              <SelectItem value="item-3">Item 3</SelectItem>
              <SelectItem value="item-4">Item 4</SelectItem>
            </SelectPopup>
          </Select>
        </div>
        {value && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Selected:{" "}
              <span className="font-medium text-primary">{value}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Select with help text
export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="select-helper">Select a priority level</Label>
      <Select>
        <SelectTrigger id="select-helper">
          <SelectValue placeholder="Choose priority" />
        </SelectTrigger>

        <SelectPopup>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectPopup>
      </Select>
      <p className="text-xs text-muted-foreground">
        Select the priority level for this task. Critical items will be
        escalated.
      </p>
    </div>
  ),
};

// Size variant comparison (using width variations)
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label>Small (max-w-xs)</Label>
        <Select>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Small select" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectPopup>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Default (max-w-md)</Label>
        <Select>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Default select" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectPopup>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large (max-w-lg)</Label>
        <Select>
          <SelectTrigger className="max-w-lg">
            <SelectValue placeholder="Large select" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectPopup>
        </Select>
      </div>
    </div>
  ),
};

// Form integration example
export const FormIntegration: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          User Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your account settings
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-theme">Theme</Label>
        <Select defaultValue="auto">
          <SelectTrigger id="form-theme">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="auto">System (Auto)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-lang">Language</Label>
        <Select defaultValue="en">
          <SelectTrigger id="form-lang">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="form-timezone">Timezone</Label>
        <Select defaultValue="utc">
          <SelectTrigger id="form-timezone">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="cet">CET (Central European)</SelectItem>
            <SelectItem value="pst">PST (Pacific)</SelectItem>
            <SelectItem value="est">EST (Eastern)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <button className="mt-2 w-full h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Save Preferences
      </button>
    </div>
  ),
};

// Status/Priority picker
export const StatusPicker: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Label htmlFor="status-select">Project Status</Label>
      <Select defaultValue="active">
        <SelectTrigger id="status-select">
          <SelectValue />
        </SelectTrigger>

        <SelectPopup>
          <SelectGroup>
            <SelectLabel>Development</SelectLabel>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Completion</SelectLabel>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Inactive</SelectLabel>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectGroup>
        </SelectPopup>
      </Select>
    </div>
  ),
};

// Date range selector
export const DateRangeSelector: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="start-month">Start Month</Label>
        <Select defaultValue="jan">
          <SelectTrigger id="start-month">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="jan">January</SelectItem>
            <SelectItem value="feb">February</SelectItem>
            <SelectItem value="mar">March</SelectItem>
            <SelectItem value="apr">April</SelectItem>
            <SelectItem value="may">May</SelectItem>
            <SelectItem value="jun">June</SelectItem>
            <SelectItem value="jul">July</SelectItem>
            <SelectItem value="aug">August</SelectItem>
            <SelectItem value="sep">September</SelectItem>
            <SelectItem value="oct">October</SelectItem>
            <SelectItem value="nov">November</SelectItem>
            <SelectItem value="dec">December</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="start-year">Start Year</Label>
        <Select defaultValue="2024">
          <SelectTrigger id="start-year">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectPopup>
        </Select>
      </div>
    </div>
  ),
};

// Multiple selects comparison
export const MultipleSelects: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="select-1">First Selection</Label>
        <Select defaultValue="option-a">
          <SelectTrigger id="select-1">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="option-a">Option A</SelectItem>
            <SelectItem value="option-b">Option B</SelectItem>
            <SelectItem value="option-c">Option C</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="select-2">Second Selection</Label>
        <Select defaultValue="option-x">
          <SelectTrigger id="select-2">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="option-x">Option X</SelectItem>
            <SelectItem value="option-y">Option Y</SelectItem>
            <SelectItem value="option-z">Option Z</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="select-3">Third Selection</Label>
        <Select defaultValue="default">
          <SelectTrigger id="select-3">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="opt1">First Option</SelectItem>
            <SelectItem value="opt2">Second Option</SelectItem>
            <SelectItem value="opt3">Third Option</SelectItem>
          </SelectPopup>
        </Select>
      </div>
    </div>
  ),
};

// Right-aligned popup (sideOffset variation)
export const AlignmentVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label>Left Aligned (Default)</Label>
        <Select>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Default alignment" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
            <SelectItem value="opt3">Option 3</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Label>Right-side Select</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Right positioned" />
            </SelectTrigger>

            <SelectPopup>
              <SelectItem value="opt1">Option 1</SelectItem>
              <SelectItem value="opt2">Option 2</SelectItem>
              <SelectItem value="opt3">Option 3</SelectItem>
            </SelectPopup>
          </Select>
        </div>
      </div>
    </div>
  ),
};

// With glass morphism background
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6 min-w-md">
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Theme Selection</Label>
        <Select defaultValue="dark">
          <SelectTrigger className="glass-card">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="light">Light Mode</SelectItem>
            <SelectItem value="dark">Dark Mode</SelectItem>
            <SelectItem value="auto">Auto (System)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Accent Color</Label>
        <Select defaultValue="cyan">
          <SelectTrigger className="glass-card-strong">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="cyan">Oceanic Cyan (#0ec2bc)</SelectItem>
            <SelectItem value="blue">Ocean Blue</SelectItem>
            <SelectItem value="teal">Deep Teal</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Transparency Level</Label>
        <Select defaultValue="medium">
          <SelectTrigger className="glass-subtle">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="transparent">Transparent</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="heavy">Heavy</SelectItem>
          </SelectPopup>
        </Select>
      </div>
    </div>
  ),
};

// Accessibility-focused example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">
          Accessible Select Example
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          With proper ARIA labels and descriptions
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-select" className="flex items-center gap-1">
          Notification Preference <span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger
            id="accessible-select"
            aria-label="Select your notification preference"
            aria-required="true"
            aria-describedby="select-description"
          >
            <SelectValue placeholder="Choose preference" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="important">Important Only</SelectItem>
            <SelectItem value="none">No Notifications</SelectItem>
          </SelectPopup>
        </Select>
        <p id="select-description" className="text-xs text-muted-foreground">
          Choose how frequently you'd like to receive notifications from us.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="accessible-select-2"
          className="flex items-center gap-1"
        >
          Account Type{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Select>
          <SelectTrigger
            id="accessible-select-2"
            aria-label="Select your account type"
            aria-describedby="account-type-description"
          >
            <SelectValue placeholder="Choose account type" />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectPopup>
        </Select>
        <p
          id="account-type-description"
          className="text-xs text-muted-foreground"
        >
          This helps us customize your experience. You can change this later.
        </p>
      </div>

      <button className="w-full h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Continue
      </button>
    </div>
  ),
};

// Color scheme selector
export const ColorSchemeSelector: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <h3 className="text-base font-alt font-medium text-foreground">
        Design System Colors
      </h3>

      <div className="flex flex-col gap-2">
        <Label htmlFor="primary-color">Primary Color</Label>
        <Select defaultValue="cyan">
          <SelectTrigger id="primary-color">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="cyan">Oceanic Cyan (#0ec2bc)</SelectItem>
            <SelectItem value="blue">Ocean Blue (#0ea6c1)</SelectItem>
            <SelectItem value="teal">Deep Teal (#00a896)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="background-color">Background</Label>
        <Select defaultValue="dark">
          <SelectTrigger id="background-color">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="dark">Deep Ocean Dark (#00070F)</SelectItem>
            <SelectItem value="darkgray">Dark Gray (#0A0E27)</SelectItem>
            <SelectItem value="lightdark">Light Dark (#1a1f3a)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accent-color">Accent Color</Label>
        <Select defaultValue="primary">
          <SelectTrigger id="accent-color">
            <SelectValue />
          </SelectTrigger>

          <SelectPopup>
            <SelectItem value="primary">Primary (Cyan)</SelectItem>
            <SelectItem value="secondary">Secondary (Blue)</SelectItem>
            <SelectItem value="muted">Muted (Gray)</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <button className="mt-4 w-full h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
        Apply Theme
      </button>
    </div>
  ),
};
