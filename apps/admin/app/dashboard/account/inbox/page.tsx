import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Inbox, Bell, MessageSquare, AlertCircle } from 'lucide-react';

export default async function InboxPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-decorative text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          Inbox
        </h1>
        <p className="text-[#C4C8D4] mt-1">
          View notifications and messages
        </p>
      </div>

      {/* Empty state */}
      <div className="bg-[#00111A]/70 backdrop-blur-xl border border-primary/20 rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">No messages yet</h2>
        <p className="text-[#C4C8D4] max-w-md mx-auto">
          Your inbox is empty. System notifications and messages will appear here.
        </p>
      </div>

      {/* Notification categories placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-white font-medium">Notifications</h3>
          </div>
          <p className="text-[#C4C8D4] text-sm">0 unread</p>
        </div>

        <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-white font-medium">Messages</h3>
          </div>
          <p className="text-[#C4C8D4] text-sm">0 unread</p>
        </div>

        <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="text-white font-medium">Alerts</h3>
          </div>
          <p className="text-[#C4C8D4] text-sm">0 active</p>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-2">Coming Soon</h3>
        <p className="text-[#C4C8D4] text-sm">
          Real-time notifications, system alerts, and team messaging will be available here.
        </p>
      </div>
    </div>
  );
}
