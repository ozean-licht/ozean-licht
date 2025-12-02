'use client';

/**
 * Storage Stats Widget Component
 * Dashboard widget for storage statistics and trends
 */

import * as React from 'react'
import {
  HardDrive,
  Upload,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { LineChart, Line, BarChart as _BarChart, Bar as _Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '../utils/cn'
import { Button } from '../cossui/button'

export interface StorageStatsData {
  totalFiles: number
  totalSize: number
  recentUploads: number // Last 7 days
  uploadsChange: number // Percentage change
  topFileTypes: Array<{ type: string; count: number; bytes: number }>
  uploadTrend: Array<{ date: string; uploads: number }>
}

export interface StorageStatsWidgetProps {
  data: StorageStatsData
  onNavigate?: () => void
  className?: string
  isLoading?: boolean
  compact?: boolean
}

export function StorageStatsWidget({
  data,
  onNavigate,
  className,
  isLoading = false,
  compact = false,
}: StorageStatsWidgetProps) {
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className={cn('glass-card rounded-lg p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-card/50 rounded w-1/3" />
          <div className="h-32 bg-card/50 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('glass-card rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#0E282E]">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-sans text-base text-white">Storage Overview</h3>
            {!compact && (
              <p className="text-xs text-[#C4C8D4] mt-0.5">Last 7 days activity</p>
            )}
          </div>
        </div>
        {onNavigate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigate}
            className="text-primary hover:bg-primary/10"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-6 pt-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Files */}
          <div className="glass-subtle rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-4 w-4 text-[#C4C8D4]" />
            </div>
            <p className="text-2xl font-sans text-white">{formatNumber(data.totalFiles)}</p>
            <p className="text-xs text-[#C4C8D4] mt-1">Total Files</p>
          </div>

          {/* Total Size */}
          <div className="glass-subtle rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="h-4 w-4 text-[#C4C8D4]" />
            </div>
            <p className="text-2xl font-sans text-white">{formatBytes(data.totalSize)}</p>
            <p className="text-xs text-[#C4C8D4] mt-1">Storage Used</p>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="glass-subtle rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm text-[#C4C8D4]">Recent Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-sans text-white">
                {formatNumber(data.recentUploads)}
              </span>
              {data.uploadsChange !== 0 && (
                <span
                  className={cn(
                    'text-xs flex items-center gap-1',
                    data.uploadsChange > 0 ? 'text-success' : 'text-destructive'
                  )}
                >
                  {data.uploadsChange > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(data.uploadsChange)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upload Trend Chart */}
        {!compact && data.uploadTrend && data.uploadTrend.length > 0 && (
          <div>
            <h4 className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt mb-3">
              Upload Activity
            </h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.uploadTrend}>
                  <XAxis
                    dataKey="date"
                    stroke="#C4C8D4"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="glass-card-strong rounded border border-primary/30 p-2">
                          <p className="text-xs text-white">
                            {payload[0].payload.date}: {payload[0].value} uploads
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="#0ec2bc"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top File Types */}
        {data.topFileTypes && data.topFileTypes.length > 0 && (
          <div>
            <h4 className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt mb-3">
              Top File Types
            </h4>
            <div className="space-y-2">
              {data.topFileTypes.slice(0, compact ? 3 : 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-1 h-8 bg-primary rounded" />
                    <span className="text-white capitalize">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">{item.count}</p>
                    <p className="text-xs text-[#C4C8D4]">{formatBytes(item.bytes)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
