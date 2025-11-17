import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Slider } from './slider';
import { Label } from './label';
import * as React from 'react';

/**
 * Slider component for selecting a value or range from a continuous or discrete set of values.
 * Built on Radix UI Slider primitive.
 *
 * ## Features
 * - Single value selection
 * - Range selection (multiple thumbs)
 * - Horizontal and vertical orientation
 * - Customizable min, max, and step values
 * - Disabled state support
 * - Keyboard accessible (Arrow keys for adjustment)
 * - Focus ring with proper contrast
 * - Smooth dragging interaction
 *
 * ## Keyboard Navigation
 * - Arrow Up/Right: Increase value
 * - Arrow Down/Left: Decrease value
 * - Home: Set to minimum value
 * - End: Set to maximum value
 * - Page Up: Increase by larger step
 * - Page Down: Decrease by larger step
 *
 * ## Accessibility
 * - Use aria-label or aria-labelledby for screen readers
 * - Pair with Label for clear context
 * - Ensure sufficient contrast for track and thumb
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An input where the user selects a value from within a given range.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable slider interaction',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Slider orientation',
    },
    value: {
      control: 'object',
      description: 'Current value(s)',
    },
  },
  args: {
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default slider with single value (0-100 range)
 */
export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

/**
 * Slider with custom min and max values
 */
export const CustomRange: Story = {
  args: {
    defaultValue: [25],
    min: 0,
    max: 50,
    step: 1,
  },
};

/**
 * Slider with step increments
 */
export const WithSteps: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
};

/**
 * Fine-grained slider with small steps
 */
export const FineGrained: Story = {
  args: {
    defaultValue: [0.5],
    min: 0,
    max: 1,
    step: 0.01,
  },
};

/**
 * Slider starting at minimum value
 */
export const AtMinimum: Story = {
  args: {
    defaultValue: [0],
    max: 100,
    step: 1,
  },
};

/**
 * Slider starting at maximum value
 */
export const AtMaximum: Story = {
  args: {
    defaultValue: [100],
    max: 100,
    step: 1,
  },
};

/**
 * Range slider with two thumbs for selecting a range
 */
export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
};

/**
 * Range slider with custom boundaries
 */
export const RangeCustom: Story = {
  args: {
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    step: 5,
  },
};

/**
 * Disabled slider state
 */
export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
};

/**
 * Disabled range slider
 */
export const DisabledRange: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    disabled: true,
  },
};

/**
 * Slider with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-2">
      <Label htmlFor="volume">Volume</Label>
      <Slider
        id="volume"
        defaultValue={[50]}
        max={100}
        step={1}
      />
    </div>
  ),
};

/**
 * Slider with label and value display
 */
export const WithValueDisplay: Story = {
  render: () => {
    const [value, setValue] = React.useState([50]);

    return (
      <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="brightness">Brightness</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider
          id="brightness"
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

/**
 * Range slider with value display
 */
export const RangeWithValueDisplay: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75]);

    return (
      <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="price-range">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${value[0]} - ${value[1]}
          </span>
        </div>
        <Slider
          id="price-range"
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

/**
 * Volume control example with icon
 */
export const VolumeControl: Story = {
  render: () => {
    const [value, setValue] = React.useState([70]);

    return (
      <div className="grid w-full gap-2">
        <Label htmlFor="volume-control">Volume</Label>
        <div className="flex items-center gap-3">
          <span className="text-sm">🔈</span>
          <Slider
            id="volume-control"
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">🔊</span>
          <span className="text-sm font-medium w-10 text-right">{value[0]}%</span>
        </div>
      </div>
    );
  },
};

/**
 * Temperature control with colored track (Ozean Licht turquoise accent)
 */
export const TemperatureControl: Story = {
  render: () => {
    const [value, setValue] = React.useState([22]);

    return (
      <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">Temperature</Label>
          <span className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
            {value[0]}°C
          </span>
        </div>
        <Slider
          id="temperature"
          value={value}
          onValueChange={setValue}
          min={16}
          max={30}
          step={0.5}
          className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>16°C</span>
          <span>30°C</span>
        </div>
      </div>
    );
  },
};

/**
 * Rating selector (discrete steps)
 */
export const RatingSelector: Story = {
  render: () => {
    const [value, setValue] = React.useState([3]);
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    return (
      <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="rating">Rating</Label>
          <span className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
            {ratings[value[0] - 1]}
          </span>
        </div>
        <Slider
          id="rating"
          value={value}
          onValueChange={setValue}
          min={1}
          max={5}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 star</span>
          <span>5 stars</span>
        </div>
      </div>
    );
  },
};

/**
 * Time range picker (24-hour format)
 */
export const TimeRangePicker: Story = {
  render: () => {
    const [value, setValue] = React.useState([9, 17]);

    const formatTime = (hour: number) => {
      return `${hour.toString().padStart(2, '0')}:00`;
    };

    return (
      <div className="grid w-full gap-2">
        <div className="flex justify-between">
          <Label htmlFor="work-hours">Work Hours</Label>
          <span className="text-sm text-muted-foreground">
            {formatTime(value[0])} - {formatTime(value[1])}
          </span>
        </div>
        <Slider
          id="work-hours"
          value={value}
          onValueChange={setValue}
          min={0}
          max={24}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>00:00</span>
          <span>24:00</span>
        </div>
      </div>
    );
  },
};

/**
 * Budget allocator with percentage
 */
export const BudgetAllocator: Story = {
  render: () => {
    const [marketing, setMarketing] = React.useState([30]);
    const [development, setDevelopment] = React.useState([50]);
    const [operations, setOperations] = React.useState([20]);

    const total = marketing[0] + development[0] + operations[0];
    const isValid = total === 100;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="marketing">Marketing</Label>
            <span className="text-sm font-medium">{marketing[0]}%</span>
          </div>
          <Slider
            id="marketing"
            value={marketing}
            onValueChange={setMarketing}
            max={100}
            step={5}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="development">Development</Label>
            <span className="text-sm font-medium">{development[0]}%</span>
          </div>
          <Slider
            id="development"
            value={development}
            onValueChange={setDevelopment}
            max={100}
            step={5}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="operations">Operations</Label>
            <span className="text-sm font-medium">{operations[0]}%</span>
          </div>
          <Slider
            id="operations"
            value={operations}
            onValueChange={setOperations}
            max={100}
            step={5}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Allocation</span>
            <span className={`text-sm font-bold ${isValid ? 'text-[#0ec2bc]' : 'text-red-500'}`}>
              {total}% {isValid ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Vertical slider orientation
 */
export const Vertical: Story = {
  render: () => {
    const [value, setValue] = React.useState([50]);

    return (
      <div className="flex items-center gap-4 h-64">
        <Slider
          orientation="vertical"
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="h-full"
        />
        <div className="flex flex-col gap-2">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
      </div>
    );
  },
};

/**
 * Vertical range slider
 */
export const VerticalRange: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75]);

    return (
      <div className="flex items-center gap-4 h-64">
        <Slider
          orientation="vertical"
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="h-full"
        />
        <div className="flex flex-col gap-2">
          <Label>Range</Label>
          <span className="text-sm text-muted-foreground">
            {value[0]}% - {value[1]}%
          </span>
        </div>
      </div>
    );
  },
};

/**
 * Form example with multiple sliders
 */
export const FormExample: Story = {
  render: () => {
    const [volume, setVolume] = React.useState([70]);
    const [brightness, setBrightness] = React.useState([80]);
    const [contrast, setContrast] = React.useState([50]);
    const [temperature, setTemperature] = React.useState([22]);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Display Settings</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-volume">Volume</Label>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <Slider
              id="form-volume"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-brightness">Brightness</Label>
              <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
            </div>
            <Slider
              id="form-brightness"
              value={brightness}
              onValueChange={setBrightness}
              max={100}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-contrast">Contrast</Label>
              <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
            </div>
            <Slider
              id="form-contrast"
              value={contrast}
              onValueChange={setContrast}
              max={100}
              step={1}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <Label htmlFor="form-temp">Color Temperature</Label>
              <span className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
                {temperature[0]}°C
              </span>
            </div>
            <Slider
              id="form-temp"
              value={temperature}
              onValueChange={setTemperature}
              min={16}
              max={30}
              step={0.5}
              className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Label className="text-base mb-2 block">Single Value (Default)</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">Range (Two Thumbs)</Label>
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">With Steps (Increments of 10)</Label>
        <Slider defaultValue={[50]} max={100} step={10} />
      </div>

      <div>
        <Label className="text-base mb-2 block">At Minimum (0)</Label>
        <Slider defaultValue={[0]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block">At Maximum (100)</Label>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>

      <div>
        <Label className="text-base mb-2 block text-muted-foreground">Disabled</Label>
        <Slider defaultValue={[50]} max={100} step={1} disabled />
      </div>

      <div>
        <Label className="text-base mb-2 block text-muted-foreground">Disabled Range</Label>
        <Slider defaultValue={[25, 75]} max={100} step={1} disabled />
      </div>

      <div>
        <Label className="text-base mb-2 block">Custom Styling (Ozean Licht Turquoise)</Label>
        <Slider
          defaultValue={[60]}
          max={100}
          step={1}
          className="[&_[role=slider]]:border-[#0ec2bc] [&_.bg-primary]:bg-[#0ec2bc]"
        />
      </div>
    </div>
  ),
};
