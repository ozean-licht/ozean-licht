'use client';

/**
 * AttachmentPreview Component for Messaging System
 *
 * Displays file attachment previews with support for:
 * - Images: Show thumbnail or URL with img tag
 * - Videos: Show video icon
 * - Audio: Show audio/music icon
 * - Files: Show generic file icon
 *
 * Features:
 * - Removable attachments (optional)
 * - Multiple size variants (sm, md, lg)
 * - Click to open in new tab
 * - File name truncation
 * - File size display
 *
 * Part of the unified messaging system.
 */

import React from 'react';
import {
  X,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Download,
} from 'lucide-react';
import { formatFileSize } from '@/lib/storage/messaging-config';
import type { Attachment } from '@/types/messaging';
import { cn } from '@/lib/utils';

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove?: () => void;
  showRemove?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AttachmentPreview({
  attachment,
  onRemove,
  showRemove = false,
  size = 'md',
}: AttachmentPreviewProps) {
  // Size configuration
  const sizeConfig = {
    sm: {
      container: 'w-16 h-16',
      text: 'text-xs',
      icon: 'w-6 h-6',
      removeButton: 'w-5 h-5',
      removeIcon: 'w-3 h-3',
    },
    md: {
      container: 'w-24 h-24',
      text: 'text-sm',
      icon: 'w-8 h-8',
      removeButton: 'w-6 h-6',
      removeIcon: 'w-4 h-4',
    },
    lg: {
      container: 'w-32 h-32',
      text: 'text-base',
      icon: 'w-10 h-10',
      removeButton: 'w-7 h-7',
      removeIcon: 'w-4 h-4',
    },
  };

  const config = sizeConfig[size];

  // Determine icon based on attachment type
  const getIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <ImageIcon className={cn(config.icon, 'text-blue-400')} />;
      case 'video':
        return <Video className={cn(config.icon, 'text-purple-400')} />;
      case 'audio':
        return <Music className={cn(config.icon, 'text-green-400')} />;
      case 'file':
      default:
        // Check if it's a text/document type by mime type
        if (
          attachment.mimeType.includes('pdf') ||
          attachment.mimeType.includes('document') ||
          attachment.mimeType.includes('text')
        ) {
          return <FileText className={cn(config.icon, 'text-orange-400')} />;
        }
        return <File className={cn(config.icon, 'text-[#C4C8D4]')} />;
    }
  };

  // Truncate file name if too long
  const truncateName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - (extension?.length || 0) - 4);
    return `${truncatedName}...${extension}`;
  };

  const maxNameLength = size === 'sm' ? 10 : size === 'md' ? 15 : 20;
  const displayName = truncateName(attachment.name, maxNameLength);

  // Handle click to open attachment
  const handleClick = (e: React.MouseEvent) => {
    if (showRemove) {
      // Don't open if we're showing the remove button
      return;
    }
    e.preventDefault();
    window.open(attachment.url, '_blank', 'noopener,noreferrer');
  };

  // Handle remove click
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div
      className={cn(
        'relative group',
        config.container,
        'bg-card/70 backdrop-blur-sm',
        'border border-primary/20 rounded-lg',
        'hover:border-primary/40 transition-colors',
        'overflow-hidden',
        !showRemove && 'cursor-pointer'
      )}
      onClick={handleClick}
      role={showRemove ? 'presentation' : 'button'}
      tabIndex={showRemove ? -1 : 0}
    >
      {/* Image preview */}
      {attachment.type === 'image' && (
        <img
          src={attachment.thumbnailUrl || attachment.url}
          alt={`Preview of ${attachment.name}`}
          className="w-full h-full object-cover"
        />
      )}

      {/* Icon for non-image types */}
      {attachment.type !== 'image' && (
        <div
          className="flex flex-col items-center justify-center w-full h-full p-2"
          aria-label={`${attachment.type} file: ${attachment.name}`}
        >
          {getIcon()}
        </div>
      )}

      {/* Overlay with file info */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0',
          'bg-gradient-to-t from-black/80 via-black/60 to-transparent',
          'p-2',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <p className={cn('text-white font-medium truncate', config.text)}>{displayName}</p>
        <p className={cn('text-white/70', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          {formatFileSize(attachment.size)}
        </p>
      </div>

      {/* Remove button */}
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'absolute top-1 right-1',
            'bg-destructive/90 hover:bg-destructive',
            'rounded-full',
            'flex items-center justify-center',
            'transition-colors',
            'opacity-0 group-hover:opacity-100',
            config.removeButton
          )}
          aria-label="Remove attachment"
        >
          <X className={cn('text-white', config.removeIcon)} />
        </button>
      )}

      {/* Download indicator on hover for non-removable */}
      {!showRemove && (
        <div
          className={cn(
            'absolute top-1 right-1',
            'bg-primary/90',
            'rounded-full',
            'flex items-center justify-center',
            'transition-opacity',
            'opacity-0 group-hover:opacity-100',
            config.removeButton
          )}
          aria-label="Click to download"
        >
          <Download className={cn('text-white', config.removeIcon)} />
        </div>
      )}
    </div>
  );
}
