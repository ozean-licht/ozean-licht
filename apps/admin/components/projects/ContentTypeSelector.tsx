'use client';

/**
 * Content Type Selector Component
 *
 * Simple dropdown to select content type (Video, Blog, Course, etc.).
 * Part of Project Management MVP Phase 2
 */

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Video, BookOpen, Mic, Send, Mail, Radio } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContentType {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface ContentTypeSelectorProps {
  value?: string;
  onChange: (contentTypeId: string) => void;
  disabled?: boolean;
  placeholder?: string;
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

function getIcon(iconName: string | null, slug: string): React.ReactNode {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  if (ICON_MAP[slug]) return ICON_MAP[slug];
  return <FileText className="w-4 h-4" />;
}

export default function ContentTypeSelector({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select content type...',
}: ContentTypeSelectorProps) {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContentTypes() {
      try {
        const res = await fetch('/api/content-types');
        if (res.ok) {
          const data = await res.json();
          setContentTypes(data.contentTypes || []);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load content types. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchContentTypes();
  }, []);

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-card/50 border-primary/20">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {contentTypes.map((ct) => (
          <SelectItem key={ct.id} value={ct.id}>
            <span className="flex items-center gap-2">
              <span className="text-primary">{getIcon(ct.icon, ct.slug)}</span>
              {ct.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
