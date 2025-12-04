/**
 * Support Settings Page
 *
 * Channel configuration and widget customization for support system.
 * Admin-only access required for modifications.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, MessageCircle, Palette, AlertTriangle } from 'lucide-react';
import {
  ChannelConfigCard,
  ChannelSettingsModal,
  WidgetCustomizer,
} from '@/components/support';
import type {
  ChannelConfig,
  WidgetSettings,
  Channel,
  Platform,
  UpdateChannelConfigInput,
  UpdateWidgetSettingsInput,
} from '@/types/support';

export default function SupportSettingsPage() {
  const { data: session } = useSession();
  const [channels, setChannels] = useState<ChannelConfig[]>([]);
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings[]>([]);
  const [embedCode, setEmbedCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected platform for widget customization
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('ozean_licht');

  // Check if user is admin
  const isAdmin = session?.user?.adminRole &&
    ['super_admin', 'ol_admin'].includes(session.user.adminRole);

  // Fetch channel configurations
  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/support/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channel configurations');
      }

      const data = await response.json();
      setChannels(data.channels || []);
      setWidgetSettings(data.widgetSettings || []);
    } catch (err) {
      // TODO: Replace with structured client-side logging (e.g., Sentry, LogRocket)
      console.error('Error fetching channels:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch widget embed code
  const fetchEmbedCode = useCallback(async (platform: Platform) => {
    try {
      const response = await fetch(`/api/support/widget/${platform}`);
      if (response.ok) {
        const data = await response.json();
        setEmbedCode(data.embedCode || '');
      }
    } catch (err) {
      // TODO: Replace with structured client-side logging (e.g., Sentry, LogRocket)
      console.error('Error fetching embed code:', err);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    fetchEmbedCode(selectedPlatform);
  }, [selectedPlatform, fetchEmbedCode]);

  // Handle channel toggle
  const handleChannelToggle = async (channel: Channel, enabled: boolean) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`/api/support/channels/${channel}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: enabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update channel');
      }

      // Refresh channels
      await fetchChannels();
    } catch (err) {
      // TODO: Replace with structured client-side logging (e.g., Sentry, LogRocket)
      console.error('Error toggling channel:', err);
    }
  };

  // Handle channel configuration save
  const handleChannelSave = async (channel: Channel, data: UpdateChannelConfigInput) => {
    if (!isAdmin) return;

    const response = await fetch(`/api/support/channels/${channel}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save channel configuration');
    }

    await fetchChannels();
  };

  // Handle widget settings save
  const handleWidgetSave = async (data: UpdateWidgetSettingsInput) => {
    if (!isAdmin) return;

    const response = await fetch(`/api/support/widget/${selectedPlatform}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save widget settings');
    }

    await fetchChannels();
    await fetchEmbedCode(selectedPlatform);
  };

  // Get current widget settings for selected platform
  const currentWidgetSettings = widgetSettings.find(w => w.platform === selectedPlatform);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-decorative text-white mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure support channels and widget</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-decorative text-white mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure support channels and customize the chat widget
        </p>
      </div>

      {/* Admin Warning */}
      {!isAdmin && (
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
              <div>
                <p className="font-medium text-yellow-200">Read-Only Mode</p>
                <p className="text-sm text-yellow-200/70 mt-1">
                  You don&apos;t have permission to modify channel settings.
                  Contact an administrator for changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="channels">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="widget" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Widget
          </TabsTrigger>
        </TabsList>

        {/* Channels Tab */}
        <TabsContent value="channels" className="mt-6 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Communication Channels
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enable or disable support channels and configure their settings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels.map((channel) => (
                <ChannelConfigCard
                  key={channel.id}
                  channel={channel}
                  onToggle={handleChannelToggle}
                  onConfigure={(ch) => {
                    setSelectedChannel(ch);
                    setIsModalOpen(true);
                  }}
                />
              ))}

              {channels.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No channel configurations found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widget Tab */}
        <TabsContent value="widget" className="mt-6">
          <div className="mb-4">
            <label className="text-sm text-muted-foreground">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
              className="w-full md:w-64 h-10 px-3 rounded-md bg-input border border-input text-white text-sm mt-1"
            >
              <option value="ozean_licht">Ozean Licht Akademie</option>
              <option value="kids_ascension">Kids Ascension</option>
            </select>
          </div>

          {currentWidgetSettings ? (
            <WidgetCustomizer
              settings={currentWidgetSettings}
              embedCode={embedCode}
              onSave={handleWidgetSave}
            />
          ) : (
            <Card className="glass-card">
              <CardContent className="py-12 text-center text-muted-foreground">
                No widget settings found for {selectedPlatform}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Channel Settings Modal */}
      <ChannelSettingsModal
        channel={selectedChannel}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChannel(null);
        }}
        onSave={handleChannelSave}
      />
    </div>
  );
}
