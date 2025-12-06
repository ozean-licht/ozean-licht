'use client';

/**
 * NotificationCenter Component
 *
 * In-app notification dropdown showing real notifications from the database.
 * Part of Phase 12: Collaboration features.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  AtSign,
  UserPlus,
  MessageCircle,
  CheckSquare,
  Folder,
  Clock,
  AlertCircle,
  ChevronRight,
  Settings,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/types/projects';
import { useUserNotifications, type NotificationData } from '@/hooks/usePusher';

interface NotificationCenterProps {
  initialUnreadCount?: number;
}

const typeIconMap: Record<NotificationType, typeof Bell> = {
  mention: AtSign,
  assignment: UserPlus,
  comment: MessageCircle,
  task_update: CheckSquare,
  project_update: Folder,
  due_date: Clock,
  system: AlertCircle,
};

const typeColorMap: Record<NotificationType, { icon: string; bg: string }> = {
  mention: { icon: 'text-blue-400', bg: 'bg-blue-400/10' },
  assignment: { icon: 'text-green-400', bg: 'bg-green-400/10' },
  comment: { icon: 'text-purple-400', bg: 'bg-purple-400/10' },
  task_update: { icon: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  project_update: { icon: 'text-primary', bg: 'bg-primary/10' },
  due_date: { icon: 'text-orange-400', bg: 'bg-orange-400/10' },
  system: { icon: 'text-gray-400', bg: 'bg-gray-400/10' },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationCenter({ initialUnreadCount = 0 }: NotificationCenterProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/notifications?limit=10');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to real-time notifications via WebSocket
  useUserNotifications(
    session?.user?.id || '',
    useCallback((notification: NotificationData) => {
      // Convert NotificationData to Notification format
      const newNotification: Notification = {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message || undefined,
        link: notification.link || undefined,
        isRead: false,
        createdAt: notification.createdAt,
        entityType: notification.entityType || undefined,
        entityId: notification.entityId || undefined,
        actorId: notification.actorId || undefined,
        metadata: notification.metadata || undefined,
      };

      // Add to the top of the notification list
      setNotifications((prev) => [newNotification, ...prev]);

      // Increment unread count
      setUnreadCount((prev) => prev + 1);
    }, [])
  );

  // Fetch on open
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Poll for new notifications every 5 minutes as fallback (real-time updates handle most cases)
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications?limit=1');
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // Silent fail for background polling
      }
    };

    const interval = setInterval(fetchUnreadCount, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: 'POST',
        });
        setNotifications(
          notifications.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }

    // Navigate to link if provided
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5 text-white/70" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 p-0 bg-[#00111A] border-primary/20 backdrop-blur-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/account/settings');
              }}
              className="p-1 text-white/50 hover:text-white/70 transition-colors"
              aria-label="Notification settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 text-xs text-primary hover:text-primary/80"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-[#C4C8D4]">No notifications yet</p>
              <p className="text-xs text-white/40 mt-1">
                You&apos;ll see activity here
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIconMap[notification.type] || Bell;
              const colors = typeColorMap[notification.type] || typeColorMap.system;

              return (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification)}
                  className={cn(
                    'w-full px-4 py-3 flex items-start gap-3 hover:bg-primary/5 transition-colors text-left border-b border-primary/5 last:border-0',
                    !notification.isRead && 'bg-primary/5'
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      colors.bg
                    )}
                  >
                    <Icon className={cn('w-4 h-4', colors.icon)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm truncate',
                          notification.isRead ? 'text-white/70' : 'text-white font-medium'
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-xs text-[#C4C8D4] line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-white/40">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-primary/10">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/dashboard/account/inbox');
            }}
            className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors py-1"
          >
            View all notifications
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
