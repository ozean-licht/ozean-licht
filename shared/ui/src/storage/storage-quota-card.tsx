/**
 * Storage Quota Card Component
 * Usage visualization with breakdown by file type
 */

import * as React from 'react'
import { HardDrive, TrendingUp, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { cn } from '../utils/cn'
import { Button } from '../cossui/button'
import { Progress } from '../cossui/progress'
import { ChartContainer, ChartTooltipContent } from '../ui/chart'

export interface FileTypeBreakdown {
  type: string
  bytes: number
  color?: string
}

export interface StorageQuotaCardProps {
  usedBytes: number
  totalBytes: number
  fileTypeBreakdown?: FileTypeBreakdown[]
  onManageStorage?: () => void
  className?: string
  showChart?: boolean
  showRecentActivity?: boolean
  recentUploads?: number
  uploadsChange?: number // Percentage change from previous period
}

export function StorageQuotaCard({
  usedBytes,
  totalBytes,
  fileTypeBreakdown = [],
  onManageStorage,
  className,
  showChart = true,
  showRecentActivity = false,
  recentUploads = 0,
  uploadsChange = 0,
}: StorageQuotaCardProps) {
  const percentage = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0
  const remainingBytes = totalBytes - usedBytes

  // Color coding based on usage
  const getStatusColor = () => {
    if (percentage >= 90) return 'text-destructive'
    if (percentage >= 70) return 'text-warning'
    return 'text-success'
  }

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-destructive'
    if (percentage >= 70) return 'bg-warning'
    return 'bg-success'
  }

  // Format bytes to human-readable
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  }

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!fileTypeBreakdown.length) return []

    // Default colors for file types
    const defaultColors: Record<string, string> = {
      images: '#0ec2bc',
      videos: '#3B82F6',
      documents: '#10B981',
      archives: '#F59E0B',
      audio: '#8B5CF6',
      code: '#EC4899',
      other: '#6B7280',
    }

    return fileTypeBreakdown.map((item) => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: item.bytes,
      color: item.color || defaultColors[item.type.toLowerCase()] || '#6B7280',
      percentage: totalBytes > 0 ? ((item.bytes / usedBytes) * 100).toFixed(1) : '0',
    }))
  }, [fileTypeBreakdown, usedBytes, totalBytes])

  return (
    <div className={cn('glass-card rounded-lg p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-sans text-base text-white">Storage Usage</h3>
            <p className="text-sm text-[#C4C8D4]">
              {formatBytes(usedBytes)} of {formatBytes(totalBytes)} used
            </p>
          </div>
        </div>
        {onManageStorage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onManageStorage}
            className="text-primary hover:bg-primary/10"
          >
            Manage
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className={cn('font-mono font-medium', getStatusColor())}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-[#C4C8D4]">{formatBytes(remainingBytes)} remaining</span>
        </div>
        <Progress value={percentage} className="h-2" indicatorClassName={getProgressColor()} />
      </div>

      {/* Warning Message */}
      {percentage >= 80 && (
        <div
          className={cn(
            'flex items-start gap-2 rounded-lg p-3 text-sm',
            percentage >= 90 ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
          )}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">
              {percentage >= 90 ? 'Storage Almost Full' : 'Storage Running Low'}
            </p>
            <p className="text-xs opacity-90 mt-1">
              {percentage >= 90
                ? 'Consider deleting unused files or upgrading your storage plan.'
                : 'You may want to review your files soon.'}
            </p>
          </div>
        </div>
      )}

      {/* File Type Breakdown Chart */}
      {showChart && chartData.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-sans text-sm text-white">Storage by Type</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const data = payload[0].payload
                    return (
                      <div className="glass-card-strong rounded-lg border border-primary/30 p-3">
                        <p className="text-sm text-white font-medium">{data.name}</p>
                        <p className="text-xs text-[#C4C8D4] mt-1">
                          {formatBytes(data.value)} ({data.percentage}%)
                        </p>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#C4C8D4] truncate">{item.name}</span>
                <span className="text-white ml-auto font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {showRecentActivity && (
        <div className="pt-4 border-t border-[#0E282E] space-y-2">
          <h4 className="font-sans text-sm text-white">Recent Activity</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#C4C8D4]">Uploads (Last 7 days)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-mono">{recentUploads}</span>
              {uploadsChange !== 0 && (
                <span
                  className={cn(
                    'text-xs flex items-center gap-1',
                    uploadsChange > 0 ? 'text-success' : 'text-destructive'
                  )}
                >
                  <TrendingUp
                    className={cn(
                      'h-3 w-3',
                      uploadsChange < 0 && 'rotate-180'
                    )}
                  />
                  {Math.abs(uploadsChange)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
