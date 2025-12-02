'use client';

/**
 * Content Item Card Component
 *
 * Display-only card for content items (video, blog, course module, etc.).
 * Part of Project Management MVP Phase 2
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FileText, Video, BookOpen, Mic, Send, Mail, Radio, Globe } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  status: string;
  language: string;
  content_type_name?: string;
  content_type_icon?: string;
  workflow_status_name?: string;
  workflow_status_color?: string;
}

interface ContentItemCardProps {
  contentItem: ContentItem;
  compact?: boolean;
  onClick?: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  course: <BookOpen className="w-4 h-4" />,
  meditation: <Mic className="w-4 h-4" />,
  social: <Send className="w-4 h-4" />,
  newsletter: <Mail className="w-4 h-4" />,
  podcast: <Radio className="w-4 h-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'border-gray-500/50 text-gray-400',
  in_production: 'border-yellow-500/50 text-yellow-400',
  ready_for_review: 'border-blue-500/50 text-blue-400',
  approved: 'border-green-500/50 text-green-400',
  scheduled: 'border-purple-500/50 text-purple-400',
  published: 'border-emerald-500/50 text-emerald-400',
};

function getIcon(iconName: string | undefined): React.ReactNode {
  const key = iconName?.toLowerCase() || 'blog';
  return ICON_MAP[key] || <FileText className="w-4 h-4" />;
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ContentItemCard({
  contentItem,
  compact = false,
  onClick,
}: ContentItemCardProps) {
  const statusClass = STATUS_COLORS[contentItem.status] || STATUS_COLORS.draft;

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-2 rounded-lg bg-card/30 border border-primary/10 hover:border-primary/20 transition-colors cursor-pointer"
        onClick={() => onClick?.(contentItem.id)}
      >
        <span className="text-primary flex-shrink-0">
          {getIcon(contentItem.content_type_icon)}
        </span>
        <span className="text-sm text-white truncate flex-1">{contentItem.title}</span>
        <Badge variant="outline" className={`text-xs ${statusClass}`}>
          {contentItem.workflow_status_name || formatStatus(contentItem.status)}
        </Badge>
      </div>
    );
  }

  return (
    <Card
      className="p-4 bg-card/50 border-primary/15 hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => onClick?.(contentItem.id)}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
          <span className="text-primary">{getIcon(contentItem.content_type_icon)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{contentItem.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            {contentItem.content_type_name && (
              <span className="text-xs text-[#C4C8D4]">{contentItem.content_type_name}</span>
            )}
            <span className="flex items-center gap-1 text-xs text-[#C4C8D4]">
              <Globe className="w-3 h-3" />
              {contentItem.language.toUpperCase()}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={statusClass}
          style={
            contentItem.workflow_status_color
              ? { borderColor: `${contentItem.workflow_status_color}80`, color: contentItem.workflow_status_color }
              : undefined
          }
        >
          {contentItem.workflow_status_name || formatStatus(contentItem.status)}
        </Badge>
      </div>
    </Card>
  );
}
