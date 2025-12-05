/**
 * WidgetEmbedGenerator Component - Support Management System
 *
 * Generates and customizes widget embed code for different platforms.
 * Allows admins to configure widget appearance and copy embed code.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WidgetEmbedGeneratorProps {
  platform: 'ozean_licht' | 'kids_ascension';
  platformKey: string;
}

/**
 * WidgetEmbedGenerator allows generation and customization of widget embed code
 *
 * Features:
 * - Widget position configuration (left/right)
 * - Primary color customization with color picker
 * - Greeting message customization
 * - Language selection (German/English)
 * - Live preview of widget launcher button
 * - Copy-to-clipboard functionality with toast notification
 *
 * Uses glass morphism styling with turquoise accents
 *
 * @example
 * ```tsx
 * <WidgetEmbedGenerator
 *   platform="ozean_licht"
 *   platformKey="pk_xxxxx"
 * />
 * ```
 */
export function WidgetEmbedGenerator({
  platform,
  platformKey,
}: WidgetEmbedGeneratorProps) {
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const [primaryColor, setPrimaryColor] = useState('#0ec2bc');
  const [greeting, setGreeting] = useState('Hallo! Wie können wir Ihnen helfen?');
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [copied, setCopied] = useState(false);

  /**
   * Generates the embed code with current configuration
   */
  const generateEmbedCode = (): string => {
    return `<script>
  (function(w,d,s,o,f,js,fjs){
    w['OzeanLichtSupport']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id='ozean-support-widget';js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','ozeanSupport','https://admin.ozean-licht.at/widget.js');

  ozeanSupport('init', {
    platformKey: '${platformKey}',
    platform: '${platform}',
    position: '${position}',
    primaryColor: '${primaryColor}',
    greeting: '${greeting}',
    language: '${language}'
  });
</script>`;
  };

  /**
   * Copies embed code to clipboard and shows success notification
   */
  const handleCopyCode = async () => {
    try {
      const code = generateEmbedCode();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Embed code copied to clipboard!');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy embed code');
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Widget Embed Code</CardTitle>
        <CardDescription>
          Customize and generate the embed code for your support widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position Select */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={position}
                onValueChange={(value) => setPosition(value as 'left' | 'right')}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Bottom Right</SelectItem>
                  <SelectItem value="left">Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Select */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as 'de' | 'en')}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Primary Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0ec2bc"
                className="flex-1"
              />
            </div>
          </div>

          {/* Greeting Message */}
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting Message</Label>
            <Input
              id="greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Hallo! Wie können wir Ihnen helfen?"
            />
          </div>
        </div>

        {/* Widget Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative h-[200px] bg-gradient-to-br from-[#00070F] to-[#00111A] rounded-lg overflow-hidden border border-border">
            {/* Mock website background */}
            <div className="p-4 space-y-2">
              <div className="h-3 w-48 bg-white/10 rounded" />
              <div className="h-2 w-full bg-white/5 rounded" />
              <div className="h-2 w-3/4 bg-white/5 rounded" />
              <div className="h-2 w-5/6 bg-white/5 rounded" />
            </div>

            {/* Widget launcher button */}
            <div
              className={`absolute bottom-4 ${
                position === 'right' ? 'right-4' : 'left-4'
              }`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: primaryColor }}
                title={greeting}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="space-y-2">
          <Label>Embed Code</Label>
          <div className="relative">
            <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-[200px] overflow-y-auto">
              <code>{generateEmbedCode()}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Place this code in the <code className="text-primary">&lt;head&gt;</code> or before
            the closing <code className="text-primary">&lt;/body&gt;</code> tag of your website.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
