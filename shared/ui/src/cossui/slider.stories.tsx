import type { Meta, StoryObj } from '@storybook/react'
import React, { useState, useCallback } from 'react'
import { Slider, SliderValue } from './slider'
import { Label } from './label'

const meta: Meta<typeof Slider> = {
  title: 'Tier 1: Primitives/CossUI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Slider component from Coss UI adapted for Ozean Licht design system. Interactive range input with glass morphism effects and support for custom ranges, steps, and value display. Built on Base UI with Ozean Licht primary color (#0ec2bc).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Minimum value of the slider',
      defaultValue: 0,
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum value of the slider',
      defaultValue: 100,
    },
    step: {
      control: { type: 'number', min: 1 },
      description: 'Step size for slider increments',
      defaultValue: 1,
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    showValue: {
      control: 'boolean',
      description: 'Display current value, min, and max',
      defaultValue: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

/**
 * Basic slider with default styling (0-100 range)
 */
export const Default: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    'aria-label': 'Default slider',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Slider {...args} />
    </div>
  ),
}

/**
 * Slider with value display showing current value and range
 */
export const WithValueDisplay: Story = {
  render: () => (
    <div className="w-[400px]">
      <Slider defaultValue={50} min={0} max={100}>
        <div className="mb-2 flex items-center justify-between gap-1">
          <Label>Select Value</Label>
          <SliderValue />
        </div>
      </Slider>
    </div>
  ),
}

/**
 * Slider with small range (0-10)
 */
export const SmallRange: Story = {
  render: () => (
    <div className="w-[400px]">
      <Slider defaultValue={5} min={0} max={10}>
        <div className="mb-2 flex items-center justify-between gap-1">
          <Label>Difficulty Level (0-10)</Label>
          <SliderValue />
        </div>
      </Slider>
    </div>
  ),
}

/**
 * Slider with fine-grained control (0-5 with decimal steps)
 */
export const FineGrainedControl: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex justify-between items-center mb-2">
        <Label>Precision Control (0-5)</Label>
      </div>
      <Slider defaultValue={[2.5]} min={0} max={5} step={0.5} showValue />
    </div>
  ),
}

/**
 * Slider with large range (0-1000)
 */
export const LargeRange: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex justify-between items-center mb-2">
        <Label>Maximum Value (0-1000)</Label>
      </div>
      <Slider defaultValue={[500]} min={0} max={1000} step={10} showValue />
    </div>
  ),
}

/**
 * Slider with custom step size (increments by 5)
 */
export const CustomStep: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex justify-between items-center mb-2">
        <Label>Step by 5s</Label>
      </div>
      <Slider defaultValue={[50]} min={0} max={100} step={5} showValue />
    </div>
  ),
}

/**
 * Disabled slider state
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Disabled Slider</Label>
        </div>
        <Slider defaultValue={[50]} min={0} max={100} disabled showValue />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Another Disabled Slider</Label>
        </div>
        <Slider defaultValue={[75]} min={0} max={100} disabled showValue />
      </div>
    </div>
  ),
}

/**
 * Controlled slider component with interactive state management
 */
export const ControlledComponent: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-decorative font-normal text-foreground mb-2">
            Controlled Slider
          </h3>
          <p className="text-sm text-muted-foreground">
            Current value: <span className="text-primary font-medium">{value}</span>
          </p>
        </div>

        <Slider
          value={value}
          min={0}
          max={100}
          onValueChange={setValue}
          showValue
        />

        <div className="flex gap-2">
          <button
            onClick={() => setValue(0)}
            className="flex-1 h-8 px-3 rounded-md bg-primary/80 text-primary-foreground text-sm font-medium transition-all hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reset to 0
          </button>
          <button
            onClick={() => setValue(50)}
            className="flex-1 h-8 px-3 rounded-md bg-primary/80 text-primary-foreground text-sm font-medium transition-all hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Set to 50
          </button>
          <button
            onClick={() => setValue(100)}
            className="flex-1 h-8 px-3 rounded-md bg-primary/80 text-primary-foreground text-sm font-medium transition-all hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Set to 100
          </button>
        </div>
      </div>
    )
  },
}

/**
 * Volume control slider (0-100 with large steps)
 */
export const VolumeControl: Story = {
  render: () => {
    const [volume, setVolume] = useState(70)

    const getVolumeIcon = (vol: number) => {
      if (vol === 0) return '🔇'
      if (vol < 30) return '🔈'
      if (vol < 70) return '🔉'
      return '🔊'
    }

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Volume Control
          </h3>
          <span className="text-2xl">{getVolumeIcon(volume)}</span>
        </div>

        <Slider
          value={volume}
          min={0}
          max={100}
          step={5}
          onValueChange={setVolume}
          showValue
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Mute</span>
          <span className="text-primary font-medium">{volume}%</span>
          <span>Max</span>
        </div>
      </div>
    )
  },
}

/**
 * Price range selector with currency formatting
 */
export const PriceRange: Story = {
  render: () => {
    const [price, setPrice] = useState(50)

    const formatPrice = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-decorative font-normal text-foreground mb-2">
            Price Range
          </h3>
          <p className="text-2xl font-medium text-primary">
            {formatPrice(price)} - {formatPrice(200)}
          </p>
        </div>

        <Slider
          value={price}
          min={0}
          max={200}
          step={5}
          onValueChange={setPrice}
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(200)}</span>
        </div>
      </div>
    )
  },
}

/**
 * Percentage selector for completion or ratio
 */
export const PercentageSelector: Story = {
  render: () => {
    const [percentage, setPercentage] = useState(75)

    const getStatus = (percent: number) => {
      if (percent < 25) return 'Low'
      if (percent < 50) return 'Medium'
      if (percent < 75) return 'High'
      return 'Critical'
    }

    const getStatusColor = (percent: number) => {
      if (percent < 25) return 'text-blue-500'
      if (percent < 50) return 'text-green-500'
      if (percent < 75) return 'text-yellow-500'
      return 'text-red-500'
    }

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Priority Level
          </h3>
          <span className={`text-lg font-medium ${getStatusColor(percentage)}`}>
            {getStatus(percentage)}
          </span>
        </div>

        <Slider
          value={percentage}
          min={0}
          max={100}
          step={5}
          onValueChange={setPercentage}
        />

        <div className="flex justify-between items-end">
          <span className="text-4xl font-bold text-primary">{percentage}%</span>
          <div className="h-2 flex-1 mx-4 bg-card/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Rating slider for 1-5 star ratings
 */
export const RatingSlider: Story = {
  render: () => {
    const [rating, setRating] = useState(3)

    const getStars = (stars: number) => {
      return Array.from({ length: 5 })
        .map((_, i) => (i < stars ? '★' : '☆'))
        .join('')
    }

    const getRatingText = (stars: number) => {
      const texts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      return texts[stars - 1] || 'Rate'
    }

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Rate Your Experience
          </h3>
          <span className="text-2xl text-yellow-500">{getStars(rating)}</span>
        </div>

        <Slider
          value={rating}
          min={1}
          max={5}
          step={1}
          onValueChange={setRating}
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Poor</span>
          <span className="text-lg font-medium text-primary">{getRatingText(rating)}</span>
          <span className="text-sm text-muted-foreground">Excellent</span>
        </div>
      </div>
    )
  },
}

/**
 * Temperature control slider with Celsius scale
 */
export const TemperatureControl: Story = {
  render: () => {
    const [temperature, setTemperature] = useState(20)

    const getTemperatureColor = (temp: number) => {
      if (temp < 0) return 'text-blue-600'
      if (temp < 10) return 'text-cyan-500'
      if (temp < 20) return 'text-emerald-500'
      if (temp < 30) return 'text-orange-500'
      return 'text-red-600'
    }

    const getTemperatureStatus = (temp: number) => {
      if (temp < 0) return 'Freezing'
      if (temp < 10) return 'Cold'
      if (temp < 20) return 'Cool'
      if (temp < 30) return 'Warm'
      return 'Hot'
    }

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Room Temperature
          </h3>
          <span className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
            {temperature}°C
          </span>
        </div>

        <Slider
          value={temperature}
          min={-10}
          max={40}
          step={1}
          onValueChange={setTemperature}
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">-10°C</span>
          <span className={`font-medium ${getTemperatureColor(temperature)}`}>
            {getTemperatureStatus(temperature)}
          </span>
          <span className="text-sm text-muted-foreground">40°C</span>
        </div>
      </div>
    )
  },
}

/**
 * Brightness/Opacity control slider
 */
export const BrightnessControl: Story = {
  render: () => {
    const [brightness, setBrightness] = useState(100)

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Brightness
          </h3>
          <span className="text-sm font-medium text-primary">{brightness}%</span>
        </div>

        <Slider
          value={brightness}
          min={0}
          max={100}
          step={5}
          onValueChange={setBrightness}
        />

        <div
          className="w-full h-32 rounded-lg border border-border transition-opacity duration-200"
          style={{
            backgroundColor: `rgba(14, 194, 188, ${brightness / 100})`,
          }}
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Off</span>
          <span>Full Brightness</span>
        </div>
      </div>
    )
  },
}

/**
 * Zoom level selector (percentage scale)
 */
export const ZoomLevel: Story = {
  render: () => {
    const [zoom, setZoom] = useState(100)

    const zoomPresets = [
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
      { value: 150, label: '150%' },
      { value: 200, label: '200%' },
    ]

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Zoom Level
          </h3>
          <span className="text-xl font-bold text-primary">{zoom}%</span>
        </div>

        <Slider
          value={zoom}
          min={50}
          max={200}
          step={10}
          onValueChange={setZoom}
        />

        <div className="flex gap-2 flex-wrap">
          {zoomPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setZoom(preset.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                zoom === preset.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Form integration with label and description
 */
export const FormIntegration: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-decorative font-normal text-foreground mb-4">
            Form Settings
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="slider-intensity">Intensity Level</Label>
            <span className="text-sm font-medium text-primary">{value}</span>
          </div>
          <Slider
            id="slider-intensity"
            value={value}
            min={0}
            max={100}
            step={5}
            onValueChange={setValue}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the intensity from 0 (minimal) to 100 (maximum)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="slider-timeout">Timeout (minutes)</Label>
            <span className="text-sm font-medium text-primary">
              {Math.round((value[0] / 100) * 60)}
            </span>
          </div>
          <Slider
            id="slider-timeout"
            value={value}
            min={0}
            max={100}
            step={5}
            onValueChange={setValue}
          />
          <p className="text-xs text-muted-foreground">
            Session will timeout after the set duration of inactivity
          </p>
        </div>

        <button className="w-full h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Save Settings
        </button>
      </div>
    )
  },
}

/**
 * Slider with detailed labels and descriptions
 */
export const WithLabelsAndDescriptions: Story = {
  render: () => {
    const [opacity, setOpacity] = useState(85)
    const [saturation, setSaturation] = useState(70)
    const [contrast, setContrast] = useState(100)

    return (
      <div className="w-[450px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-8">
        <h3 className="text-lg font-decorative font-normal text-foreground">
          Image Adjustments
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Label>Opacity</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Controls transparency of the image overlay
              </p>
            </div>
            <span className="text-sm font-medium text-primary">{opacity}%</span>
          </div>
          <Slider
            value={opacity}
            min={0}
            max={100}
            step={5}
            onValueChange={setOpacity}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Label>Saturation</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Increase or decrease color intensity
              </p>
            </div>
            <span className="text-sm font-medium text-primary">{saturation}%</span>
          </div>
          <Slider
            value={saturation}
            min={0}
            max={200}
            step={10}
            onValueChange={setSaturation}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Label>Contrast</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enhance or reduce the difference between light and dark areas
              </p>
            </div>
            <span className="text-sm font-medium text-primary">{contrast}%</span>
          </div>
          <Slider
            value={contrast}
            min={50}
            max={150}
            step={5}
            onValueChange={setContrast}
          />
        </div>
      </div>
    )
  },
}

/**
 * Multiple sliders in a dashboard layout
 */
export const DashboardLayout: Story = {
  render: () => {
    const [values, setValues] = useState({
      cpu: 45,
      memory: 72,
      disk: 58,
      network: 82,
    })

    const handleChange = (key: keyof typeof values) => (newValue: number) => {
      setValues((prev) => ({ ...prev, [key]: newValue }))
    }

    return (
      <div className="w-[500px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-decorative font-normal text-foreground mb-4">
          Server Metrics
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">CPU Usage</span>
              <span className="text-sm font-medium text-primary">{values.cpu}%</span>
            </div>
            <Slider
              value={[values.cpu]}
              min={0}
              max={100}
              onValueChange={handleChange('cpu')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Memory Usage</span>
              <span className="text-sm font-medium text-primary">{values.memory}%</span>
            </div>
            <Slider
              value={[values.memory]}
              min={0}
              max={100}
              onValueChange={handleChange('memory')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Disk Usage</span>
              <span className="text-sm font-medium text-primary">{values.disk}%</span>
            </div>
            <Slider
              value={[values.disk]}
              min={0}
              max={100}
              onValueChange={handleChange('disk')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Network I/O</span>
              <span className="text-sm font-medium text-primary">{values.network}%</span>
            </div>
            <Slider
              value={[values.network]}
              min={0}
              max={100}
              onValueChange={handleChange('network')}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4">
          {Object.entries(values).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xs text-muted-foreground capitalize">{key}</div>
              <div className="text-lg font-bold text-primary mt-1">{value}%</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Glass effect variations with different backdrop blur intensities
 */
export const GlassEffectVariations: Story = {
  render: () => {
    const [value1, setValue1] = useState(50)
    const [value2, setValue2] = useState(50)
    const [value3, setValue3] = useState(50)

    return (
      <div className="space-y-6">
        <div className="w-[400px] bg-gradient-to-br from-background via-card to-primary/10 rounded-lg p-8 space-y-6">
          <div>
            <h3 className="text-lg font-decorative font-normal text-foreground mb-4">
              Glass Subtle
            </h3>
            <Slider
              value={value1}
              min={0}
              max={100}
              onValueChange={setValue1}
              className="glass-subtle"
            />
          </div>
        </div>

        <div className="w-[400px] bg-gradient-to-br from-background via-card to-primary/20 rounded-lg p-8 space-y-6">
          <div>
            <h3 className="text-lg font-decorative font-normal text-foreground mb-4">
              Glass Card
            </h3>
            <Slider
              value={value2}
              min={0}
              max={100}
              onValueChange={setValue2}
              className="glass-card"
            />
          </div>
        </div>

        <div className="w-[400px] bg-gradient-to-br from-background via-card to-primary/30 rounded-lg p-8 space-y-6">
          <div>
            <h3 className="text-lg font-decorative font-normal text-foreground mb-4">
              Glass Strong
            </h3>
            <Slider
              value={value3}
              min={0}
              max={100}
              onValueChange={setValue3}
              className="glass-card-strong"
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Minimal slider without any decorations
 */
export const Minimal: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[25]} min={0} max={100} />
      <Slider defaultValue={[50]} min={0} max={100} />
      <Slider defaultValue={[75]} min={0} max={100} />
    </div>
  ),
}

/**
 * Stacked sliders showing range values
 */
export const RangeComparison: Story = {
  render: () => (
    <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-8">
      <h3 className="text-lg font-decorative font-normal text-foreground">
        Compare Ranges
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Range A</span>
            <span className="text-sm font-medium text-primary">0-100</span>
          </div>
          <Slider defaultValue={[50]} min={0} max={100} showValue />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Range B</span>
            <span className="text-sm font-medium text-primary">0-50</span>
          </div>
          <Slider defaultValue={[25]} min={0} max={50} showValue />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Range C</span>
            <span className="text-sm font-medium text-primary">0-1000</span>
          </div>
          <Slider defaultValue={[500]} min={0} max={1000} step={50} showValue />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Range D</span>
            <span className="text-sm font-medium text-primary">-50 to 50</span>
          </div>
          <Slider defaultValue={0} min={-50} max={50} showValue />
        </div>
      </div>
    </div>
  ),
}

/**
 * Responsive slider that adapts to container width
 */
export const Responsive: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Small container (300px)</p>
        <div className="w-[300px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
          <Slider defaultValue={[50]} min={0} max={100} showValue />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Medium container (400px)</p>
        <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
          <Slider defaultValue={[50]} min={0} max={100} showValue />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Large container (600px)</p>
        <div className="w-[600px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
          <Slider defaultValue={[50]} min={0} max={100} showValue />
        </div>
      </div>
    </div>
  ),
}

/**
 * Audio settings panel with multiple sliders
 */
export const AudioSettings: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      masterVolume: 75,
      bass: 50,
      treble: 50,
      midrange: 50,
    })

    const handleChange = (key: keyof typeof settings) => (newValue: number) => {
      setSettings((prev) => ({ ...prev, [key]: newValue }))
    }

    return (
      <div className="w-[450px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Audio Equalizer
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust audio settings to your preference
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Master Volume</span>
              <span className="text-sm font-medium text-primary">{settings.masterVolume}%</span>
            </div>
            <Slider
              defaultValue={[settings.masterVolume]}
              min={0}
              max={100}
              step={5}
              onValueChange={handleChange('masterVolume')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Bass</span>
              <span className="text-sm font-medium text-primary">{settings.bass}</span>
            </div>
            <Slider
              defaultValue={[settings.bass]}
              min={0}
              max={100}
              step={5}
              onValueChange={handleChange('bass')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Midrange</span>
              <span className="text-sm font-medium text-primary">{settings.midrange}</span>
            </div>
            <Slider
              defaultValue={[settings.midrange]}
              min={0}
              max={100}
              step={5}
              onValueChange={handleChange('midrange')}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Treble</span>
              <span className="text-sm font-medium text-primary">{settings.treble}</span>
            </div>
            <Slider
              defaultValue={[settings.treble]}
              min={0}
              max={100}
              step={5}
              onValueChange={handleChange('treble')}
            />
          </div>
        </div>

        <button className="w-full h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Reset to Default
        </button>
      </div>
    )
  },
}

/**
 * Playback speed control with preset values
 */
export const PlaybackSpeed: Story = {
  render: () => {
    const [speed, setSpeed] = useState(1)

    const speedPresets = [
      { value: 0.5, label: '0.5x' },
      { value: 0.75, label: '0.75x' },
      { value: 1, label: 'Normal' },
      { value: 1.25, label: '1.25x' },
      { value: 1.5, label: '1.5x' },
      { value: 2, label: '2x' },
    ]

    const getSpeedIcon = (s: number) => {
      if (s < 1) return '🐢'
      if (s === 1) return '▶️'
      return '⚡'
    }

    return (
      <div className="w-[450px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-decorative font-normal text-foreground">
            Playback Speed
          </h3>
          <span className="text-2xl">{getSpeedIcon(speed)}</span>
        </div>

        <Slider
          value={speed}
          min={0.5}
          max={2}
          step={0.25}
          onValueChange={setSpeed}
        />

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Slow</span>
          <span className="text-lg font-bold text-primary">{speed.toFixed(2)}x</span>
          <span className="text-sm text-muted-foreground">Fast</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {speedPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setSpeed(preset.value)}
              className={`px-2 py-2 rounded text-xs font-medium transition-all ${
                Math.abs(speed - preset.value) < 0.01
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    )
  },
}
