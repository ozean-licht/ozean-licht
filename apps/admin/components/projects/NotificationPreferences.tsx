'use client';

/**
 * NotificationPreferences Component
 *
 * Manages notification preferences for the messaging system.
 * Features:
 * - Push notification toggle
 * - Sound notifications toggle
 * - Quiet hours configuration (start time, end time, timezone)
 * - Per-notification-type preferences (push, email, in-app)
 *
 * Part of the unified messaging and support system.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, Moon, Mail, Smartphone, Volume2, VolumeX, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

interface NotificationTypeSettings {
  push: boolean;
  email: boolean;
  inApp: boolean;
}

interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  soundEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  quietHoursTimezone: string;
  typeSettings: {
    new_message: NotificationTypeSettings;
    mention: NotificationTypeSettings;
    assignment: NotificationTypeSettings;
    ticket_update: NotificationTypeSettings;
    reply_to_thread: NotificationTypeSettings;
  };
}

interface NotificationPreferencesProps {
  userId: string;
}

// ============================================================================
// Constants
// ============================================================================

const notificationTypes = [
  {
    key: 'new_message' as const,
    label: 'New Messages',
    description: 'When someone sends you a message',
    icon: Mail,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'mention' as const,
    label: 'Mentions',
    description: 'When someone @mentions you',
    icon: Bell,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    key: 'assignment' as const,
    label: 'Assignments',
    description: 'When you are assigned to a ticket',
    icon: Smartphone,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    key: 'ticket_update' as const,
    label: 'Status Changes',
    description: 'When ticket status changes',
    icon: CheckCircle2,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    key: 'reply_to_thread' as const,
    label: 'Thread Replies',
    description: 'When someone replies to your thread',
    icon: Mail,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const commonTimezones = [
  { value: 'Europe/Vienna', label: 'Europe/Vienna (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  userId: '',
  pushEnabled: true,
  soundEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  quietHoursTimezone: 'Europe/Vienna',
  typeSettings: {
    new_message: { push: true, email: false, inApp: true },
    mention: { push: true, email: true, inApp: true },
    assignment: { push: true, email: true, inApp: true },
    ticket_update: { push: false, email: true, inApp: true },
    reply_to_thread: { push: true, email: false, inApp: true },
  },
};

// ============================================================================
// Component
// ============================================================================

export function NotificationPreferences({ userId }: NotificationPreferencesProps) {
  // State
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ============================================================================
  // Effects
  // ============================================================================

  // Fetch current preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/notifications/preferences');

        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }

        const data = await response.json();
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...data.preferences,
          userId,
        });
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error);
        toast.error('Failed to load preferences', {
          description: 'Using default settings. Please try refreshing the page.',
        });
        // Set default preferences on error
        setPreferences({ ...DEFAULT_PREFERENCES, userId });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  // Clear save success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [saveSuccess]);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleToggleGlobal = (key: 'pushEnabled' | 'soundEnabled' | 'quietHoursEnabled') => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: !preferences[key] });
    setHasChanges(true);
  };

  const handleQuietHoursChange = (field: 'quietHoursStart' | 'quietHoursEnd' | 'quietHoursTimezone', value: string) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [field]: value });
    setHasChanges(true);
  };

  const handleTypeSettingToggle = (
    type: keyof NotificationPreferences['typeSettings'],
    channel: keyof NotificationTypeSettings
  ) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      typeSettings: {
        ...preferences.typeSettings,
        [type]: {
          ...preferences.typeSettings[type],
          [channel]: !preferences.typeSettings[type][channel],
        },
      },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushEnabled: preferences.pushEnabled,
          soundEnabled: preferences.soundEnabled,
          quietHoursEnabled: preferences.quietHoursEnabled,
          quietHoursStart: preferences.quietHoursStart,
          quietHoursEnd: preferences.quietHoursEnd,
          quietHoursTimezone: preferences.quietHoursTimezone,
          typeSettings: preferences.typeSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      const data = await response.json();
      setPreferences({ ...preferences, ...data.preferences });
      setHasChanges(false);
      setSaveSuccess(true);

      toast.success('Preferences saved', {
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast.error('Failed to save preferences', {
        description: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderSwitch = (checked: boolean, onChange: () => void, label: string) => (
    <button
      onClick={onChange}
      aria-label={label}
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-[#0E282E]'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
          checked ? 'left-6' : 'left-1'
        )}
      />
    </button>
  );

  const renderChannelToggle = (
    enabled: boolean,
    onChange: () => void,
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      onClick={onChange}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
        enabled
          ? 'bg-primary/20 text-primary border border-primary/40'
          : 'bg-[#0E282E] text-muted-foreground border border-primary/10'
      )}
      title={`${label}: ${enabled ? 'Enabled' : 'Disabled'}`}
    >
      {icon}
    </button>
  );

  // ============================================================================
  // Render
  // ============================================================================

  if (isLoading) {
    return (
      <Card className="bg-[#00111A] border-primary/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card className="bg-[#00111A] border-primary/20">
        <CardContent className="py-12 text-center">
          <p className="text-red-400">Failed to load preferences</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card className="bg-[#00111A] border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription className="text-[#C4C8D4]">
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#00070F] border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-white font-medium">Push Notifications</Label>
                <p className="text-xs text-[#C4C8D4] mt-0.5">
                  Receive browser push notifications
                </p>
              </div>
            </div>
            {renderSwitch(
              preferences.pushEnabled,
              () => handleToggleGlobal('pushEnabled'),
              'Toggle push notifications'
            )}
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#00070F] border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
                {preferences.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <Label className="text-white font-medium">Sound</Label>
                <p className="text-xs text-[#C4C8D4] mt-0.5">
                  Play sound for notifications
                </p>
              </div>
            </div>
            {renderSwitch(
              preferences.soundEnabled,
              () => handleToggleGlobal('soundEnabled'),
              'Toggle notification sounds'
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="bg-[#00111A] border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Quiet Hours
          </CardTitle>
          <CardDescription className="text-[#C4C8D4]">
            Silence push notifications during specific hours
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Enable Quiet Hours */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#00070F] border border-primary/10">
            <div>
              <Label className="text-white font-medium">Enable Quiet Hours</Label>
              <p className="text-xs text-[#C4C8D4] mt-0.5">
                No push notifications during this time
              </p>
            </div>
            {renderSwitch(
              preferences.quietHoursEnabled,
              () => handleToggleGlobal('quietHoursEnabled'),
              'Toggle quiet hours'
            )}
          </div>

          {/* Quiet Hours Configuration */}
          {preferences.quietHoursEnabled && (
            <div className="p-4 rounded-lg bg-[#00070F] border border-primary/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <Label className="text-white text-sm mb-2 block">Start Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursStart || '22:00'}
                    onChange={(e) => handleQuietHoursChange('quietHoursStart', e.target.value)}
                    className="bg-[#00111A] border-primary/20"
                  />
                </div>

                {/* End Time */}
                <div>
                  <Label className="text-white text-sm mb-2 block">End Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursEnd || '08:00'}
                    onChange={(e) => handleQuietHoursChange('quietHoursEnd', e.target.value)}
                    className="bg-[#00111A] border-primary/20"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <Label className="text-white text-sm mb-2 block">Timezone</Label>
                <Select
                  value={preferences.quietHoursTimezone}
                  onValueChange={(value) => handleQuietHoursChange('quietHoursTimezone', value)}
                >
                  <SelectTrigger className="bg-[#00111A] border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTimezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-Type Settings */}
      <Card className="bg-[#00111A] border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Types
          </CardTitle>
          <CardDescription className="text-[#C4C8D4]">
            Choose delivery channels for each notification type
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Header Row */}
            <div className="grid grid-cols-[1fr_auto] gap-4 pb-2 border-b border-primary/10">
              <div className="text-sm text-[#C4C8D4] font-medium">Notification Type</div>
              <div className="flex gap-2 text-xs text-[#C4C8D4] font-medium">
                <span className="w-8 text-center">Push</span>
                <span className="w-8 text-center">Email</span>
                <span className="w-8 text-center">App</span>
              </div>
            </div>

            {/* Type Rows */}
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              const settings = preferences.typeSettings[type.key];

              return (
                <div
                  key={type.key}
                  className="grid grid-cols-[1fr_auto] gap-4 p-3 rounded-lg bg-[#00070F] border border-primary/10 hover:border-primary/20 transition-colors"
                >
                  {/* Type Info */}
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', type.bg)}>
                      <Icon className={cn('w-4 h-4', type.color)} />
                    </div>
                    <div>
                      <span className="text-sm text-white font-medium">{type.label}</span>
                      <p className="text-xs text-[#C4C8D4]">{type.description}</p>
                    </div>
                  </div>

                  {/* Channel Toggles */}
                  <div className="flex gap-2">
                    {renderChannelToggle(
                      settings.push,
                      () => handleTypeSettingToggle(type.key, 'push'),
                      <Smartphone className="w-4 h-4" />,
                      'Push'
                    )}
                    {renderChannelToggle(
                      settings.email,
                      () => handleTypeSettingToggle(type.key, 'email'),
                      <Mail className="w-4 h-4" />,
                      'Email'
                    )}
                    {renderChannelToggle(
                      settings.inApp,
                      () => handleTypeSettingToggle(type.key, 'inApp'),
                      <Bell className="w-4 h-4" />,
                      'In-App'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {saveSuccess && (
          <p className="text-sm text-green-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Preferences saved successfully
          </p>
        )}
        <div className="flex-1" />
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
