/**
 * ChannelSettingsModal Component - Support Management System Phase 5
 *
 * Modal for editing channel-specific configuration settings including
 * connection details, routing rules, and automation settings.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2 } from 'lucide-react';
import type {
  ChannelConfig,
  Channel,
  Team,
  UpdateChannelConfigInput,
  WebWidgetConfig,
  WhatsAppConfig,
  TelegramConfig,
  EmailConfig,
} from '@/types/support';

interface ChannelSettingsModalProps {
  channel: ChannelConfig | null;
  open: boolean;
  onClose: () => void;
  onSave: (channel: Channel, data: UpdateChannelConfigInput) => Promise<void>;
}

/**
 * ChannelSettingsModal allows editing channel configuration
 *
 * Features:
 * - Tabbed interface: Connection, Routing, Automation
 * - Channel-specific configuration fields
 * - Default team assignment for routing
 * - Auto-response message configuration
 * - Form validation and error handling
 *
 * Uses glass morphism styling consistent with admin UI
 *
 * @example
 * ```tsx
 * <ChannelSettingsModal
 *   channel={selectedChannel}
 *   open={isOpen}
 *   onClose={handleClose}
 *   onSave={handleSave}
 * />
 * ```
 */
export default function ChannelSettingsModal({
  channel,
  open,
  onClose,
  onSave,
}: ChannelSettingsModalProps) {
  const [saving, setSaving] = useState(false);
  // Use Record<string, unknown> instead of any for better type safety
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [defaultTeam, setDefaultTeam] = useState<Team | ''>('');
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false);
  const [autoResponseMessage, setAutoResponseMessage] = useState('');

  // Initialize state when channel changes
  useEffect(() => {
    if (channel) {
      // Cast to Record for state management - validation happens in API layer
      setConfig((channel.config as Record<string, unknown>) || {});
      setDefaultTeam(channel.defaultTeam || '');
      setAutoResponseEnabled(channel.autoResponseEnabled);
      setAutoResponseMessage(channel.autoResponseMessage || '');
    }
  }, [channel]);

  const handleSave = async () => {
    if (!channel) return;
    setSaving(true);
    try {
      await onSave(channel.channel, {
        config,
        defaultTeam: defaultTeam || undefined,
        autoResponseEnabled,
        autoResponseMessage,
      });
      onClose();
    } catch (error) {
      // TODO: Replace with structured client-side logging (e.g., Sentry, LogRocket)
      console.error('Failed to save channel config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!channel) return null;

  const renderConfigFields = () => {
    switch (channel.channel) {
      case 'web_widget':
        const webConfig = config as WebWidgetConfig;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="websiteToken">Website Token</Label>
              <Input
                id="websiteToken"
                value={webConfig.websiteToken || ''}
                onChange={(e) => setConfig({ ...config, websiteToken: e.target.value })}
                placeholder="From Chatwoot inbox settings"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Found in Chatwoot → Settings → Inboxes → Web Widget
              </p>
            </div>
            <div>
              <Label htmlFor="allowedDomains">Allowed Domains (comma-separated)</Label>
              <Input
                id="allowedDomains"
                value={Array.isArray(webConfig.allowedDomains) ? webConfig.allowedDomains.join(', ') : ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    allowedDomains: e.target.value
                      .split(',')
                      .map((d) => d.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="ozean-licht.at, www.ozean-licht.at"
              />
            </div>
          </div>
        );

      case 'whatsapp':
        const whatsappConfig = config as WhatsAppConfig;
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">WhatsApp Business API Required</p>
                  <p className="mt-1 text-yellow-200/70">
                    You need a verified WhatsApp Business account and API access to use this
                    channel. Contact support for setup assistance.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={whatsappConfig.phoneNumber || ''}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                placeholder="+43 123 456789"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="businessId">Business ID</Label>
              <Input
                id="businessId"
                value={whatsappConfig.businessId || ''}
                onChange={(e) => setConfig({ ...config, businessId: e.target.value })}
                placeholder="Meta Business ID"
                disabled
              />
            </div>
          </div>
        );

      case 'telegram':
        const telegramConfig = config as TelegramConfig;
        return (
          <div className="space-y-4">
            <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />
                <div className="text-sm text-sky-200">
                  <p className="font-medium">Telegram Bot Setup</p>
                  <p className="mt-1 text-sky-200/70">
                    Create a bot via @BotFather on Telegram to get your bot token. Configuration
                    will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="botUsername">Bot Username</Label>
              <Input
                id="botUsername"
                value={telegramConfig.botUsername || ''}
                onChange={(e) => setConfig({ ...config, botUsername: e.target.value })}
                placeholder="@OzeanLichtBot"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="botToken">Bot Token</Label>
              <Input
                id="botToken"
                type="password"
                value={telegramConfig.botToken || ''}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                placeholder="123456:ABC-DEF..."
                disabled
              />
            </div>
          </div>
        );

      case 'email':
        const emailConfig = config as EmailConfig;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={emailConfig.email || ''}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                placeholder="support@ozean-licht.at"
              />
            </div>
            <div>
              <Label htmlFor="imapAddress">IMAP Server</Label>
              <Input
                id="imapAddress"
                value={emailConfig.imapAddress || ''}
                onChange={(e) => setConfig({ ...config, imapAddress: e.target.value })}
                placeholder="imap.example.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpAddress">SMTP Server</Label>
              <Input
                id="smtpAddress"
                value={emailConfig.smtpAddress || ''}
                onChange={(e) => setConfig({ ...config, smtpAddress: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{channel.displayName} Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="connection" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="mt-4">
            {renderConfigFields()}
          </TabsContent>

          <TabsContent value="routing" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="defaultTeam">Default Team Assignment</Label>
              <select
                id="defaultTeam"
                value={defaultTeam}
                onChange={(e) => setDefaultTeam(e.target.value as Team)}
                className="w-full h-10 px-3 rounded-md bg-input border border-input text-white text-sm mt-1"
              >
                <option value="">No default team</option>
                <option value="general">General Support</option>
                <option value="tech">Technical Support</option>
                <option value="sales">Sales</option>
                <option value="spiritual">Spiritual Guidance</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                New conversations will be automatically assigned to this team
              </p>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Response</Label>
                <p className="text-xs text-muted-foreground">
                  Send an automatic reply when a new conversation starts
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoResponseEnabled}
                onClick={() => setAutoResponseEnabled(!autoResponseEnabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${autoResponseEnabled ? 'bg-primary' : 'bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${autoResponseEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {autoResponseEnabled && (
              <div>
                <Label htmlFor="autoResponseMessage">Auto-Response Message</Label>
                <Textarea
                  id="autoResponseMessage"
                  value={autoResponseMessage}
                  onChange={(e) => setAutoResponseMessage(e.target.value)}
                  placeholder="Vielen Dank für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen."
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
