'use client';

/**
 * Share Dialog Component
 * File sharing with presigned URL generation
 */

import * as React from 'react'
import { Link, Copy, Clock, Check } from 'lucide-react'
import { Dialog, DialogPopup, DialogHeader, DialogTitle } from '../cossui/dialog'
import { Button } from '../cossui/button'
import { Input } from '../cossui/input'
import { Select, SelectPopup, SelectItem, SelectTrigger, SelectValue } from '../cossui/select'
import { cn } from '../utils/cn'
import type { StorageFile } from './types'

export interface ShareDialogProps {
  file: StorageFile
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateUrl?: (file: StorageFile, expirySeconds: number) => Promise<string>
  className?: string
}

const expiryOptions = [
  { label: '1 Hour', value: 3600 },
  { label: '24 Hours', value: 86400 },
  { label: '7 Days', value: 604800 },
  { label: '30 Days', value: 2592000 },
  { label: 'Custom', value: -1 },
]

export function ShareDialog({
  file,
  open,
  onOpenChange,
  onGenerateUrl,
  className,
}: ShareDialogProps) {
  const [expiry, setExpiry] = React.useState(86400) // 24 hours default
  const [customHours, setCustomHours] = React.useState('24')
  const [shareUrl, setShareUrl] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [expiresAt, setExpiresAt] = React.useState<Date | null>(null)

  React.useEffect(() => {
    if (!open) {
      setShareUrl('')
      setExpiry(86400)
      setCustomHours('24')
      setCopied(false)
      setExpiresAt(null)
    }
  }, [open])

  const handleExpiryChange = (value: string) => {
    const numValue = parseInt(value)
    setExpiry(numValue)
    if (numValue === -1) {
      // Custom expiry selected
      setCustomHours('24')
    }
  }

  const handleGenerateUrl = async () => {
    if (!onGenerateUrl) return

    setIsGenerating(true)
    try {
      const expirySeconds = expiry === -1 ? parseInt(customHours) * 3600 : expiry
      const url = await onGenerateUrl(file, expirySeconds)
      setShareUrl(url)
      setExpiresAt(new Date(Date.now() + expirySeconds * 1000))
    } catch (error) {
      console.error('Failed to generate URL:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatTimeRemaining = () => {
    if (!expiresAt) return ''

    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className={cn('max-w-lg glass-card-strong border-primary/30', className)}>
        <DialogHeader>
          <DialogTitle className="font-sans text-lg text-white">Share File</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div className="glass-card rounded-lg p-4 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sans text-sm text-white truncate">{file.name}</h4>
              <p className="text-xs text-[#C4C8D4] mt-1">
                {formatBytes(file.size)} • {file.mimeType}
              </p>
            </div>
          </div>

          {/* Expiry Selection */}
          <div className="space-y-2">
            <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Link Expiry
            </label>
            <div className="flex gap-2">
              <Select value={expiry.toString()} onValueChange={handleExpiryChange}>
                <SelectTrigger className="glass-card border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup className="glass-card-strong border-primary/30">
                  {expiryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>

              {expiry === -1 && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="8760"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-20 glass-card border-primary/30"
                  />
                  <span className="text-sm text-[#C4C8D4]">hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          {!shareUrl && (
            <Button
              onClick={handleGenerateUrl}
              disabled={isGenerating || (expiry === -1 && !customHours)}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {isGenerating ? 'Generating...' : 'Generate Share Link'}
            </Button>
          )}

          {/* Generated URL */}
          {shareUrl && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-[#C4C8D4] uppercase tracking-wide font-alt">
                  Share URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 glass-card border-primary/30 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUrl}
                    className="glass-card border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Expiry Countdown */}
              {expiresAt && (
                <div className="flex items-center justify-between text-sm bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <span className="text-[#C4C8D4]">Link expires:</span>
                  <span className="text-primary font-mono">{formatTimeRemaining()}</span>
                </div>
              )}

              {/* Generate New Link */}
              <Button
                variant="outline"
                onClick={() => {
                  setShareUrl('')
                  setExpiresAt(null)
                }}
                className="w-full glass-card border-primary/30 text-primary hover:bg-primary/10"
              >
                Generate New Link
              </Button>
            </div>
          )}

          {/* Future Features Placeholder */}
          <div className="pt-4 border-t border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4] mb-2">Coming Soon:</p>
            <div className="space-y-1 text-xs text-[#C4C8D4]/70">
              <p>• Email sharing</p>
              <p>• Password protection</p>
              <p>• Custom permissions (view, edit, download)</p>
            </div>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}
