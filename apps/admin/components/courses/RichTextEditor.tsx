'use client';

import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getEditorExtensions, extractYouTubeId } from '@/lib/tiptap/extensions';
import { MenuBar } from '@/lib/tiptap/menu-bar';
import { sanitizeHtml, isValidExternalUrl } from '@/lib/utils/sanitize';
import {
  CossUIDialog,
  CossUIDialogPopup,
  CossUIDialogHeader,
  CossUIDialogTitle,
  CossUIDialogFooter,
  CossUIDialogClose,
  CossUIButton,
  CossUIInput,
  CossUILabel,
} from '@shared/ui';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your lesson content here...',
  disabled = false,
  className = '',
  error,
}: RichTextEditorProps) {
  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);

  // Dialog input states
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Initialize editor
  const editor = useEditor({
    extensions: getEditorExtensions({ placeholder }),
    content: value,
    editable: !disabled,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Sanitize HTML before passing to parent (SSR-safe)
      const cleanHtml = sanitizeHtml(html);
      onChange(cleanHtml);
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  // Link dialog handlers
  const handleLinkSubmit = useCallback(() => {
    if (!editor || !linkUrl) return;

    // Validate URL to prevent SSRF attacks
    if (!isValidExternalUrl(linkUrl)) {
      alert('Invalid URL. Please use a valid http:// or https:// URL and avoid private/internal addresses.');
      return;
    }

    // If there's selected text, wrap it in a link
    if (linkText) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
        .run();
    } else {
      // Set link on current selection
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl, linkText]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;

    // Get current link if cursor is in one
    const currentLink = editor.getAttributes('link').href || '';
    setLinkUrl(currentLink);

    // Get selected text
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    setLinkText(selectedText);

    setLinkDialogOpen(true);
  }, [editor]);

  // Image dialog handlers
  const handleImageSubmit = useCallback(() => {
    if (!editor || !imageUrl) return;

    // Validate URL to prevent SSRF attacks
    if (!isValidExternalUrl(imageUrl)) {
      alert('Invalid URL. Please use a valid http:// or https:// URL and avoid private/internal addresses.');
      return;
    }

    editor.chain().focus().insertContent({
      type: 'image',
      attrs: {
        src: imageUrl,
        alt: imageAlt || '',
      },
    }).run();

    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  // YouTube dialog handlers
  const handleYouTubeSubmit = useCallback(() => {
    if (!editor || !youtubeUrl) return;

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      return; // Invalid URL
    }

    editor.chain().focus().insertContent({
      type: 'youtube',
      attrs: {
        src: youtubeUrl,
      },
    }).run();

    setYoutubeDialogOpen(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

  return (
    <div className={`rounded-lg border ${error ? 'border-destructive' : 'border-[#0E282E]'} bg-[#00111A] overflow-hidden ${className}`}>
      {/* Toolbar */}
      <MenuBar
        editor={editor}
        onLinkClick={openLinkDialog}
        onImageClick={() => setImageDialogOpen(true)}
        onYouTubeClick={() => setYoutubeDialogOpen(true)}
      />

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none
          prose-headings:text-white prose-headings:font-sans
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:text-[#C4C8D4] prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-em:text-[#C4C8D4]
          prose-code:bg-[#00070F] prose-code:px-1 prose-code:rounded prose-code:text-primary
          prose-pre:bg-[#00070F] prose-pre:border prose-pre:border-[#0E282E]
          prose-blockquote:border-primary/50 prose-blockquote:text-[#C4C8D4]
          prose-ul:text-[#C4C8D4] prose-ol:text-[#C4C8D4]
          prose-li:marker:text-primary
          [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]
          [&_.is-editor-empty:first-child]:before:text-[#C4C8D4]/50
          [&_.is-editor-empty:first-child]:before:float-left
          [&_.is-editor-empty:first-child]:before:h-0
          [&_.is-editor-empty:first-child]:before:pointer-events-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:min-h-[180px]"
      />

      {/* Link Dialog */}
      <CossUIDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <CossUIDialogPopup className="max-w-md">
          <CossUIDialogHeader>
            <CossUIDialogTitle>Insert Link</CossUIDialogTitle>
          </CossUIDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CossUILabel>URL</CossUILabel>
              <CossUIInput
                value={linkUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <CossUILabel>Link Text (optional)</CossUILabel>
              <CossUIInput
                value={linkText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkText(e.target.value)}
                placeholder="Click here"
              />
            </div>
          </div>
          <CossUIDialogFooter>
            <CossUIDialogClose>
              <CossUIButton variant="outline">Cancel</CossUIButton>
            </CossUIDialogClose>
            <CossUIButton onClick={handleLinkSubmit} disabled={!linkUrl}>
              Insert Link
            </CossUIButton>
          </CossUIDialogFooter>
        </CossUIDialogPopup>
      </CossUIDialog>

      {/* Image Dialog */}
      <CossUIDialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <CossUIDialogPopup className="max-w-md">
          <CossUIDialogHeader>
            <CossUIDialogTitle>Insert Image</CossUIDialogTitle>
          </CossUIDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CossUILabel>Image URL</CossUILabel>
              <CossUIInput
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <CossUILabel>Alt Text</CossUILabel>
              <CossUIInput
                value={imageAlt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageAlt(e.target.value)}
                placeholder="Image description"
              />
            </div>
          </div>
          <CossUIDialogFooter>
            <CossUIDialogClose>
              <CossUIButton variant="outline">Cancel</CossUIButton>
            </CossUIDialogClose>
            <CossUIButton onClick={handleImageSubmit} disabled={!imageUrl}>
              Insert Image
            </CossUIButton>
          </CossUIDialogFooter>
        </CossUIDialogPopup>
      </CossUIDialog>

      {/* YouTube Dialog */}
      <CossUIDialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <CossUIDialogPopup className="max-w-md">
          <CossUIDialogHeader>
            <CossUIDialogTitle>Embed YouTube Video</CossUIDialogTitle>
          </CossUIDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CossUILabel>YouTube URL</CossUILabel>
              <CossUIInput
                value={youtubeUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
              <p className="text-xs text-[#C4C8D4]/70">
                Supports youtube.com/watch, youtu.be, and embed URLs
              </p>
            </div>
            {youtubeUrl && extractYouTubeId(youtubeUrl) && (
              <div className="aspect-video bg-[#00070F] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(youtubeUrl)}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
          <CossUIDialogFooter>
            <CossUIDialogClose>
              <CossUIButton variant="outline">Cancel</CossUIButton>
            </CossUIDialogClose>
            <CossUIButton
              onClick={handleYouTubeSubmit}
              disabled={!youtubeUrl || !extractYouTubeId(youtubeUrl)}
            >
              Embed Video
            </CossUIButton>
          </CossUIDialogFooter>
        </CossUIDialogPopup>
      </CossUIDialog>
    </div>
  );
}
