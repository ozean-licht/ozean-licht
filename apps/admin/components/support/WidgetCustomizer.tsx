/**
 * WidgetCustomizer Component - Support Management System Phase 5
 *
 * Widget appearance customizer for the web chat widget including
 * colors, positioning, messages, and embed code generation.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Loader2, Eye, MessageCircle } from 'lucide-react';
import type { WidgetSettings, UpdateWidgetSettingsInput } from '@/types/support';

interface WidgetCustomizerProps {
  settings: WidgetSettings;
  embedCode: string;
  onSave: (data: UpdateWidgetSettingsInput) => Promise<void>;
}

/**
 * WidgetCustomizer allows customization of chat widget appearance
 *
 * Features:
 * - Appearance settings (color, position, behavior)
 * - Welcome message customization
 * - Language and reply time configuration
 * - Embed code generation and copying
 * - Live preview of widget appearance
 *
 * Uses glass morphism styling with turquoise accents
 *
 * @example
 * ```tsx
 * <WidgetCustomizer
 *   settings={widgetSettings}
 *   embedCode={generatedEmbedCode}
 *   onSave={handleSave}
 * />
 * ```
 */
export default function WidgetCustomizer({
  settings,
  embedCode,
  onSave,
}: WidgetCustomizerProps) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<UpdateWidgetSettingsInput>({
    primaryColor: settings.primaryColor,
    position: settings.position,
    welcomeTitle: settings.welcomeTitle,
    welcomeSubtitle: settings.welcomeSubtitle,
    replyTime: settings.replyTime,
    language: settings.language,
    hideMessageBubble: settings.hideMessageBubble,
    showPopupOnload: settings.showPopupOnload,
    popupDelaySeconds: settings.popupDelaySeconds,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-4">
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-6">
              {/* Color & Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#0ec2bc"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="position">Widget Position</Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value as 'left' | 'right' })
                    }
                    className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm mt-1"
                  >
                    <option value="right">Bottom Right</option>
                    <option value="left">Bottom Left</option>
                  </select>
                </div>
              </div>

              {/* Behavior */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Behavior</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hide Message Bubble</Label>
                    <p className="text-xs text-muted-foreground">Hide the floating chat bubble</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.hideMessageBubble}
                    onClick={() =>
                      setFormData({ ...formData, hideMessageBubble: !formData.hideMessageBubble })
                    }
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${formData.hideMessageBubble ? 'bg-primary' : 'bg-gray-600'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${formData.hideMessageBubble ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-open on Load</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically open the chat when page loads
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.showPopupOnload}
                    onClick={() =>
                      setFormData({ ...formData, showPopupOnload: !formData.showPopupOnload })
                    }
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${formData.showPopupOnload ? 'bg-primary' : 'bg-gray-600'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${formData.showPopupOnload ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="welcomeTitle">Welcome Title</Label>
                <Input
                  id="welcomeTitle"
                  value={formData.welcomeTitle}
                  onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                  placeholder="Willkommen! 👋"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="welcomeSubtitle">Welcome Subtitle</Label>
                <Textarea
                  id="welcomeSubtitle"
                  value={formData.welcomeSubtitle}
                  onChange={(e) => setFormData({ ...formData, welcomeSubtitle: e.target.value })}
                  placeholder="Wie können wir Ihnen helfen?"
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="replyTime">Reply Time Indicator</Label>
                <select
                  id="replyTime"
                  value={formData.replyTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      replyTime: e.target.value as 'in_a_few_minutes' | 'in_a_few_hours' | 'in_a_day',
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm mt-1"
                >
                  <option value="in_a_few_minutes">In a few minutes</option>
                  <option value="in_a_few_hours">In a few hours</option>
                  <option value="in_a_day">In a day</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm mt-1"
                >
                  <option value="de">German (Deutsch)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Messages
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Embed Code</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add this code to your website to enable the chat widget
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto text-xs text-gray-300">
                  <code>{embedCode}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyEmbedCode}
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
              <p className="text-sm text-muted-foreground">
                Place this code in the <code className="text-primary">&lt;head&gt;</code> or before
                the closing <code className="text-primary">&lt;/body&gt;</code> tag of your website.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Widget Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] bg-gradient-to-br from-[#00070F] to-[#00111A] rounded-lg overflow-hidden border border-border">
            {/* Mock website content */}
            <div className="p-6">
              <div className="h-4 w-48 bg-white/10 rounded mb-4" />
              <div className="h-3 w-full bg-white/5 rounded mb-2" />
              <div className="h-3 w-3/4 bg-white/5 rounded mb-2" />
              <div className="h-3 w-5/6 bg-white/5 rounded" />
            </div>

            {/* Widget bubble */}
            {!formData.hideMessageBubble && (
              <div
                className={`absolute bottom-4 ${
                  formData.position === 'right' ? 'right-4' : 'left-4'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
