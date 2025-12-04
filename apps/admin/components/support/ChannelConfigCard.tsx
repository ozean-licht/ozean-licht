/**
 * ChannelConfigCard Component - Support Management System Phase 5
 *
 * Displays a single channel configuration with enable/disable toggle
 * and configure button.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  MessageSquare,
  Mail,
  Send,
  Settings,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { ChannelConfig, Channel } from '@/types/support';

interface ChannelConfigCardProps {
  channel: ChannelConfig;
  onToggle: (channel: Channel, enabled: boolean) => Promise<void>;
  onConfigure: (channel: ChannelConfig) => void;
}

const channelIcons: Record<Channel, React.ReactNode> = {
  web_widget: <MessageCircle className="h-6 w-6 text-primary" />,
  whatsapp: <MessageSquare className="h-6 w-6 text-green-400" />,
  email: <Mail className="h-6 w-6 text-blue-400" />,
  telegram: <Send className="h-6 w-6 text-sky-400" />,
};

const channelDescriptions: Record<Channel, string> = {
  web_widget: 'Live chat widget for your website',
  whatsapp: 'WhatsApp Business API integration',
  email: 'Email support channel',
  telegram: 'Telegram bot integration',
};

/**
 * ChannelConfigCard displays a single channel configuration card
 *
 * Features:
 * - Enable/disable toggle switch
 * - Channel-specific icon and description
 * - Active/disabled status badge
 * - Configure button to open settings modal
 * - Default team routing display
 *
 * Uses glass morphism styling with channel-specific colors
 *
 * @example
 * ```tsx
 * <ChannelConfigCard
 *   channel={channelConfig}
 *   onToggle={handleToggle}
 *   onConfigure={handleConfigure}
 * />
 * ```
 */
export default function ChannelConfigCard({
  channel,
  onToggle,
  onConfigure,
}: ChannelConfigCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(channel.channel, !channel.isEnabled);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="glass-card hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {channelIcons[channel.channel]}
            <div>
              <CardTitle className="text-lg">{channel.displayName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {channelDescriptions[channel.channel]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {channel.isEnabled ? (
              <Badge className="bg-green-500/20 text-green-400 border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-0">
                <XCircle className="h-3 w-3 mr-1" />
                Disabled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {channel.defaultTeam ? `Routes to: ${channel.defaultTeam}` : 'No default team'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-muted-foreground">
                {channel.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={channel.isEnabled}
                onClick={handleToggle}
                disabled={isToggling}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${channel.isEnabled ? 'bg-primary' : 'bg-gray-600'}
                  ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${channel.isEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(channel)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
