'use client';

/**
 * Task Guide Panel Component
 *
 * Display SOP/instructions for task with collapsible panel.
 * Part of Project Management MVP Phase 2
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';

interface TaskGuide {
  id: string;
  name: string;
  content_markdown: string;
  estimated_duration_minutes?: number | null;
}

interface TaskGuidePanelProps {
  guide: TaskGuide;
  collapsed?: boolean;
  onToggle?: () => void;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function TaskGuidePanel({
  guide,
  collapsed: controlledCollapsed,
  onToggle,
}: TaskGuidePanelProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(true);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  const handleToggle = onToggle ?? (() => setInternalCollapsed(!internalCollapsed));

  return (
    <div className="rounded-lg border border-primary/20 bg-card/30 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">{guide.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {guide.estimated_duration_minutes && (
            <span className="flex items-center gap-1 text-xs text-[#C4C8D4]">
              <Clock className="w-3 h-3" />
              {formatDuration(guide.estimated_duration_minutes)}
            </span>
          )}
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-[#C4C8D4]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#C4C8D4]" />
          )}
        </div>
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 pt-0 border-t border-primary/10">
          <div className="space-y-3 text-[#C4C8D4] whitespace-pre-wrap">
            {renderMarkdownSafe(guide.content_markdown)}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Safe markdown renderer using React elements
 * Renders basic markdown formatting without HTML injection risk
 */
function renderMarkdownSafe(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="list-disc pl-4 my-2 space-y-1">
          {currentList.map((item, idx) => (
            <li key={idx}>{processInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Empty lines
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${key++}`} className="text-base mt-4 mb-2 text-white font-medium">
          {processInlineFormatting(line.substring(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${key++}`} className="text-lg mt-4 mb-2 text-white font-medium">
          {processInlineFormatting(line.substring(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${key++}`} className="text-xl mt-4 mb-2 text-white font-medium">
          {processInlineFormatting(line.substring(2))}
        </h1>
      );
      continue;
    }

    // List items
    if (line.match(/^[\-\*] /)) {
      currentList.push(line.substring(2));
      continue;
    }

    // Regular paragraphs
    flushList();
    elements.push(
      <p key={`p-${key++}`} className="my-2">
        {processInlineFormatting(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

/**
 * Process inline markdown formatting (bold, italic, code, links)
 */
function processInlineFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(remaining.substring(0, boldMatch.index));
      }
      parts.push(
        <strong key={`bold-${key++}`} className="text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Code `text`
    const codeMatch = remaining.match(/`(.*?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        parts.push(remaining.substring(0, codeMatch.index));
      }
      parts.push(
        <code key={`code-${key++}`} className="bg-primary/10 text-primary px-1 rounded">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.substring(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // Links [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(remaining.substring(0, linkMatch.index));
      }
      parts.push(
        <a
          key={`link-${key++}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkMatch.index + linkMatch[0].length);
      continue;
    }

    // Italic *text*
    const italicMatch = remaining.match(/\*(.*?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(remaining.substring(0, italicMatch.index));
      }
      parts.push(<em key={`italic-${key++}`}>{italicMatch[1]}</em>);
      remaining = remaining.substring(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // No more matches, add remaining text
    parts.push(remaining);
    break;
  }

  return parts.length === 1 ? parts[0] : parts;
}
