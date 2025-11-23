import type { Meta, StoryObj } from '@storybook/react'
import React, { useState, useEffect } from 'react'
import { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue } from './meter'

const meta: Meta<typeof Meter> = {
  title: 'CossUI/Meter',
  component: Meter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Meter component from Coss UI adapted for Ozean Licht design system. Displays measurements within a known range (e.g., temperature, disk usage, CPU). Uses Base UI Meter primitives with Ozean Licht primary color (#0ec2bc) for the indicator fill.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Current meter value',
      defaultValue: 50,
    },
    min: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Minimum meter value',
      defaultValue: 0,
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum meter value',
      defaultValue: 100,
    },
  },
}

export default meta
type Story = StoryObj<typeof Meter>

/**
 * Basic meter with default styling
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <Meter value={args.value} min={args.min} max={args.max}>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
  args: {
    value: 50,
    min: 0,
    max: 100,
  },
}

/**
 * Meter with label and value display
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px]">
      <Meter value={65} min={0} max={100}>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>CPU Usage</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
}

/**
 * Meter states showing different measurement values
 */
export const MeterStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <Meter value={15} min={0} max={100}>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Low Usage</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>

      <Meter value={50} min={0} max={100}>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Moderate Usage</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>

      <Meter value={75} min={0} max={100}>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>High Usage</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>

      <Meter value={95} min={0} max={100}>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Critical Usage</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
}

/**
 * Real-time meter showing system resource usage
 */
export const SystemResources: Story = {
  render: () => {
    const [cpuUsage, setCpuUsage] = useState(45)
    const [memoryUsage, setMemoryUsage] = useState(62)
    const [diskUsage, setDiskUsage] = useState(78)

    useEffect(() => {
      const interval = setInterval(() => {
        setCpuUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 20)))
        setMemoryUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
        setDiskUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)))
      }, 1000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[450px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-decorative font-semibold text-foreground">
          System Resources
        </h3>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <MeterLabel>CPU Usage</MeterLabel>
            <MeterValue />
          </div>
          <Meter value={Math.round(cpuUsage)} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <MeterLabel>Memory Usage</MeterLabel>
            <MeterValue />
          </div>
          <Meter value={Math.round(memoryUsage)} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <MeterLabel>Disk Usage</MeterLabel>
            <MeterValue />
          </div>
          <Meter value={Math.round(diskUsage)} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
      </div>
    )
  },
}

/**
 * Temperature meter with custom units and range
 */
export const TemperatureMeter: Story = {
  render: () => {
    const [temperature, setTemperature] = useState(68)

    useEffect(() => {
      const interval = setInterval(() => {
        setTemperature((prev) => Math.max(50, Math.min(95, prev + (Math.random() - 0.5) * 3)))
      }, 2000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-4">
        <h4 className="text-sm font-decorative font-semibold text-foreground">
          Room Temperature
        </h4>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Meter value={temperature} min={50} max={95}>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </div>
          <div className="text-center">
            <div className="text-2xl font-decorative font-bold text-primary">
              {Math.round(temperature)}°F
            </div>
            <div className="text-xs text-foreground/60">
              {temperature < 60 ? 'Cold' : temperature < 75 ? 'Comfortable' : 'Warm'}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Battery level meter
 */
export const BatteryLevel: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-alt font-medium text-foreground">Device 1</span>
          <span className="text-xs text-foreground/60">Fully Charged</span>
        </div>
        <Meter value={100} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-alt font-medium text-foreground">Device 2</span>
          <span className="text-xs text-foreground/60">Good</span>
        </div>
        <Meter value={75} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-alt font-medium text-foreground">Device 3</span>
          <span className="text-xs text-foreground/60">Low</span>
        </div>
        <Meter value={25} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-alt font-medium text-foreground">Device 4</span>
          <span className="text-xs text-foreground/60">Critical</span>
        </div>
        <Meter value={5} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>
    </div>
  ),
}

/**
 * Audio level meter with real-time visualization
 */
export const AudioLevel: Story = {
  render: () => {
    const [levels, setLevels] = useState([45, 60, 55])

    useEffect(() => {
      const interval = setInterval(() => {
        setLevels((prev) =>
          prev.map(() => Math.max(0, Math.min(100, 40 + Math.random() * 40)))
        )
      }, 100)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-4">
        <h4 className="text-sm font-decorative font-semibold text-foreground">
          Audio Levels
        </h4>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-foreground/60 mb-1">Left Channel</div>
            <Meter value={Math.round(levels[0])} min={0} max={100}>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </div>
          <div>
            <div className="text-xs text-foreground/60 mb-1">Center Channel</div>
            <Meter value={Math.round(levels[1])} min={0} max={100}>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </div>
          <div>
            <div className="text-xs text-foreground/60 mb-1">Right Channel</div>
            <Meter value={Math.round(levels[2])} min={0} max={100}>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Network signal strength meter
 */
export const NetworkSignal: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
        <div className="flex-1">
          <div className="text-xs font-alt font-medium text-foreground mb-2">Excellent</div>
          <Meter value={95} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
        <span className="text-xs text-primary font-medium">95</span>
      </div>

      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
        <div className="flex-1">
          <div className="text-xs font-alt font-medium text-foreground mb-2">Good</div>
          <Meter value={70} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
        <span className="text-xs text-primary font-medium">70</span>
      </div>

      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
        <div className="flex-1">
          <div className="text-xs font-alt font-medium text-foreground mb-2">Fair</div>
          <Meter value={45} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
        <span className="text-xs text-primary font-medium">45</span>
      </div>

      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4">
        <div className="flex-1">
          <div className="text-xs font-alt font-medium text-foreground mb-2">Weak</div>
          <Meter value={20} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
        <span className="text-xs text-primary font-medium">20</span>
      </div>
    </div>
  ),
}

/**
 * Download/Upload speed meter
 */
export const NetworkSpeed: Story = {
  render: () => {
    const [downloadSpeed, setDownloadSpeed] = useState(65)
    const [uploadSpeed, setUploadSpeed] = useState(45)

    useEffect(() => {
      const interval = setInterval(() => {
        setDownloadSpeed((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 15)))
        setUploadSpeed((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 12)))
      }, 1500)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
        <h4 className="text-sm font-decorative font-semibold text-foreground">
          Network Speed
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <MeterLabel>Download Speed</MeterLabel>
            <span className="text-sm font-sans font-medium text-primary">
              {Math.round((downloadSpeed / 100) * 500)} Mbps
            </span>
          </div>
          <Meter value={Math.round(downloadSpeed)} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <MeterLabel>Upload Speed</MeterLabel>
            <span className="text-sm font-sans font-medium text-primary">
              {Math.round((uploadSpeed / 100) * 300)} Mbps
            </span>
          </div>
          <Meter value={Math.round(uploadSpeed)} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </div>
      </div>
    )
  },
}

/**
 * Custom range meter (0-50 scale)
 */
export const CustomRange: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Server Load (0-50)</MeterLabel>
          <span className="text-sm font-sans font-medium text-primary">35 / 50</span>
        </div>
        <Meter value={35} min={0} max={50}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Quality Score (0-10)</MeterLabel>
          <span className="text-sm font-sans font-medium text-primary">8.5 / 10</span>
        </div>
        <Meter value={8.5} min={0} max={10}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Reliability (0-5)</MeterLabel>
          <span className="text-sm font-sans font-medium text-primary">4.2 / 5</span>
        </div>
        <Meter value={4.2} min={0} max={5}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>
    </div>
  ),
}

/**
 * Minimal meter without labels
 */
export const Minimal: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Meter value={25} min={0} max={100}>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <Meter value={50} min={0} max={100}>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <Meter value={75} min={0} max={100}>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
}

/**
 * Dashboard layout with multiple meters
 */
export const Dashboard: Story = {
  render: () => (
    <div className="w-[500px] bg-background/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-8">
      <div>
        <h3 className="text-lg font-decorative font-semibold text-foreground mb-4">
          Server Dashboard
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-xs font-alt font-medium text-foreground uppercase tracking-wide">
            CPU
          </div>
          <Meter value={62} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
          <div className="text-sm font-sans font-medium text-primary text-right">62%</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-alt font-medium text-foreground uppercase tracking-wide">
            Memory
          </div>
          <Meter value={78} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
          <div className="text-sm font-sans font-medium text-primary text-right">78%</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-alt font-medium text-foreground uppercase tracking-wide">
            Disk
          </div>
          <Meter value={54} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
          <div className="text-sm font-sans font-medium text-primary text-right">54%</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-alt font-medium text-foreground uppercase tracking-wide">
            Network
          </div>
          <Meter value={41} min={0} max={100}>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
          <div className="text-sm font-sans font-medium text-primary text-right">41%</div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Custom value formatting with children function
 */
export const CustomFormatting: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Storage Used</MeterLabel>
          <MeterValue>
            {(formattedValue, value) => {
              const maxStorage = 1000
              const used = (value / 100) * maxStorage
              return `${Math.round(used)} GB of ${maxStorage} GB`
            }}
          </MeterValue>
        </div>
        <Meter value={68} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>Battery Health</MeterLabel>
          <MeterValue>
            {(formattedValue) => {
              const health = parseInt(formattedValue)
              return health > 80 ? '🟢 Good' : health > 50 ? '🟡 Fair' : '🔴 Poor'
            }}
          </MeterValue>
        </div>
        <Meter value={72} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <MeterLabel>API Response Time</MeterLabel>
          <MeterValue>
            {(formattedValue, value) => {
              const responseTime = (value / 100) * 1000
              return `${Math.round(responseTime)} ms`
            }}
          </MeterValue>
        </div>
        <Meter value={35} min={0} max={100}>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>
    </div>
  ),
}
