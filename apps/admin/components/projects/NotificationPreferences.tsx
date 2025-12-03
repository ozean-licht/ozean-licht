'use client';

/**
 * NotificationPreferences Component
 *
 * User settings for notification delivery preferences.
 * Part of Phase 12: Collaboration features.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Mail,
  AtSign,
  UserPlus,
  MessageCircle,
  CheckSquare,
  Folder,
  Clock,
  AlertCircle,
  Loader2,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationPreferences as NotificationPreferencesType, EmailDigestFrequency } from '@/types/projects';

interface NotificationPreferencesProps {
  onSave?: (preferences: NotificationPreferencesType) => void;
}

const emailDigestOptions: { value: EmailDigestFrequency; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No email notifications' },
  { value: 'instant', label: 'Instant', description: 'Receive emails immediately' },
  { value: 'daily', label: 'Daily', description: 'Daily digest at 9am' },
  { value: 'weekly', label: 'Weekly', description: 'Weekly summary on Monday' },
];

const notificationTypes = [
  {
    key: 'mentionNotify' as const,
    icon: AtSign,
    label: 'Mentions',
    description: 'When someone @mentions you',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'assignmentNotify' as const,
    icon: UserPlus,
    label: 'Assignments',
    description: 'When a task is assigned to you',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    key: 'commentNotify' as const,
    icon: MessageCircle,
    label: 'Comments',
    description: 'Replies to your comments',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    key: 'taskUpdateNotify' as const,
    icon: CheckSquare,
    label: 'Task Updates',
    description: 'Changes to tasks you follow',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    key: 'projectUpdateNotify' as const,
    icon: Folder,
    label: 'Project Updates',
    description: 'Changes to your projects',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    key: 'dueDateNotify' as const,
    icon: Clock,
    label: 'Due Date Reminders',
    description: 'Upcoming and overdue tasks',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    key: 'systemNotify' as const,
    icon: AlertCircle,
    label: 'System Notifications',
    description: 'Important system updates',
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
  },
];

export default function NotificationPreferences({ onSave }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/notifications/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        const data = await response.json();
        setPreferences(data.preferences);
      } catch (err) {
        console.error('Failed to fetch notification preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (key: keyof NotificationPreferencesType) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: !preferences[key] });
    setHasChanges(true);
  };

  const handleEmailDigestChange = (value: EmailDigestFrequency) => {
    if (!preferences) return;
    setPreferences({ ...preferences, emailDigest: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inApp: preferences.inApp,
          emailDigest: preferences.emailDigest,
          mentionNotify: preferences.mentionNotify,
          assignmentNotify: preferences.assignmentNotify,
          commentNotify: preferences.commentNotify,
          taskUpdateNotify: preferences.taskUpdateNotify,
          projectUpdateNotify: preferences.projectUpdateNotify,
          dueDateNotify: preferences.dueDateNotify,
          systemNotify: preferences.systemNotify,
        }),
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      const data = await response.json();
      setPreferences(data.preferences);
      setHasChanges(false);
      onSave?.(data.preferences);
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#00111A] border-primary/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error && !preferences) {
    return (
      <Card className="bg-[#00111A] border-primary/20">
        <CardContent className="py-12 text-center">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) return null;

  return (
    <Card className="bg-[#00111A] border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-[#C4C8D4]">
          Choose how you want to be notified about activity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* In-App Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#00070F] border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-white font-medium">In-App Notifications</Label>
              <p className="text-xs text-[#C4C8D4] mt-0.5">
                Show notifications in the bell icon
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('inApp')}
            aria-label={`Toggle in-app notifications ${preferences.inApp ? 'off' : 'on'}`}
            role="switch"
            aria-checked={preferences.inApp}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors',
              preferences.inApp ? 'bg-primary' : 'bg-[#0E282E]'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                preferences.inApp ? 'left-6' : 'left-1'
              )}
            />
          </button>
        </div>

        {/* Email Digest */}
        <div className="p-4 rounded-lg bg-[#00070F] border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <Label className="text-white font-medium">Email Digest</Label>
              <p className="text-xs text-[#C4C8D4] mt-0.5">
                How often to send email summaries
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {emailDigestOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleEmailDigestChange(option.value)}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  preferences.emailDigest === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-primary/10 hover:border-primary/30'
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  preferences.emailDigest === option.value ? 'text-primary' : 'text-white'
                )}>
                  {option.label}
                </span>
                <p className="text-xs text-[#C4C8D4] mt-0.5">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-2">
          <Label className="text-white font-medium">Notification Types</Label>
          <p className="text-xs text-[#C4C8D4] mb-3">
            Select which types of notifications you want to receive
          </p>
          <div className="space-y-2">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              const isEnabled = preferences[type.key];

              return (
                <div
                  key={type.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#00070F] border border-primary/10 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', type.bg)}>
                      <Icon className={cn('w-4 h-4', type.color)} />
                    </div>
                    <div>
                      <span className="text-sm text-white">{type.label}</span>
                      <p className="text-xs text-[#C4C8D4]">{type.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(type.key)}
                    aria-label={`Toggle ${type.label} notifications ${isEnabled ? 'off' : 'on'}`}
                    role="switch"
                    aria-checked={isEnabled}
                    className={cn(
                      'relative w-9 h-5 rounded-full transition-colors',
                      isEnabled ? 'bg-primary' : 'bg-[#0E282E]'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                        isEnabled ? 'left-4' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-primary/10">
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
      </CardContent>
    </Card>
  );
}
