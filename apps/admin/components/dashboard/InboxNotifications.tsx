'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  Activity,
  FolderKanban,
  AtSign,
  Mail,
  AlertTriangle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'health',
    icon: Activity,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-400/10',
    title: 'System Health Check',
    message: 'All services are running normally. Database response time: 12ms',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'project',
    icon: FolderKanban,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    title: 'Project Updated',
    message: 'Website Redesign moved to "In Progress" by lia@ozean-licht.dev',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'mention',
    icon: AtSign,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    title: 'You were mentioned',
    message: '@super mentioned you in task "Review course content for Q1"',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'alert',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    title: 'Storage Warning',
    message: 'Ozean Cloud storage is at 78% capacity. Consider cleanup.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'email',
    icon: Mail,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    title: 'New Team Message',
    message: 'sarah@ozean-licht.dev sent you a message about the course launch',
    time: '5 hours ago',
    read: true,
  },
];

export function InboxNotifications() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {unreadCount}
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
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <button
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  setIsOpen(false);
                  router.push('/dashboard/account/inbox');
                }}
                className={cn(
                  'w-full px-4 py-3 flex items-start gap-3 hover:bg-primary/5 transition-colors text-left border-b border-primary/5 last:border-0',
                  !notification.read && 'bg-primary/5'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    notification.bgColor
                  )}
                >
                  <Icon className={cn('w-4 h-4', notification.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm truncate',
                        notification.read ? 'text-white/70' : 'text-white font-medium'
                      )}
                    >
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#C4C8D4] line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-white/40">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </div>
                </div>
              </button>
            );
          })}
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
