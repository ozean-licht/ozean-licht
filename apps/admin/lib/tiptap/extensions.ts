/**
 * TipTap Editor Extensions
 *
 * Custom configuration for the WYSIWYG editor used in lesson content.
 * Based on TipTap StarterKit with additional extensions.
 */

import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import type { Extensions } from '@tiptap/react';

/**
 * Default placeholder text for empty editor
 */
export const DEFAULT_PLACEHOLDER = 'Write your lesson content here...';

/**
 * YouTube embed settings
 */
export const YOUTUBE_CONFIG = {
  width: 640,
  height: 360,
  nocookie: true,
  allowFullscreen: true,
  autoplay: false,
};

/**
 * Link settings
 */
export const LINK_CONFIG = {
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
  HTMLAttributes: {
    class: 'text-primary underline hover:text-primary/80',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

/**
 * Get all TipTap extensions with default configuration
 */
export function getEditorExtensions(options?: {
  placeholder?: string;
}): Extensions {
  const placeholder = options?.placeholder ?? DEFAULT_PLACEHOLDER;

  return [
    StarterKit.configure({
      // Configure heading levels (H1-H3)
      heading: {
        levels: [1, 2, 3],
      },
      // Enable code blocks with syntax highlighting placeholder
      codeBlock: {
        HTMLAttributes: {
          class: 'bg-[#00111A] rounded-lg p-4 font-mono text-sm',
        },
      },
      // Configure blockquote styling
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-primary/50 pl-4 italic text-[#C4C8D4]',
        },
      },
      // Configure horizontal rule
      horizontalRule: {
        HTMLAttributes: {
          class: 'border-[#0E282E] my-6',
        },
      },
    }),

    // Link extension with custom styling
    Link.configure(LINK_CONFIG),

    // Image extension for inline images
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4',
      },
    }),

    // YouTube embed extension
    Youtube.configure(YOUTUBE_CONFIG),

    // Placeholder text when editor is empty
    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),

    // Text highlighting
    Highlight.configure({
      multicolor: false,
      HTMLAttributes: {
        class: 'bg-primary/20 px-1 rounded',
      },
    }),

    // Underline text
    Underline,
  ];
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  const pattern = /(?:vimeo\.com\/)(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Check if URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Check if URL is a valid Vimeo URL
 */
export function isVimeoUrl(url: string): boolean {
  return extractVimeoId(url) !== null;
}
