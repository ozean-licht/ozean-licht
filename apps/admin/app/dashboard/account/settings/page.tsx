import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Settings, Bell, Lock, Palette, Globe } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const settingsSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage email and push notification preferences',
      status: 'Coming soon',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Password, two-factor authentication, and session management',
      status: 'Coming soon',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme, display density, and visual preferences',
      status: 'Coming soon',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Language, timezone, and date format settings',
      status: 'Coming soon',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-decorative text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          Settings
        </h1>
        <p className="text-[#C4C8D4] mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="bg-[#00111A]/70 backdrop-blur-xl border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium">{section.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {section.status}
                  </span>
                </div>
                <p className="text-[#C4C8D4] text-sm">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current settings info */}
      <div className="bg-[#00111A]/70 backdrop-blur-xl border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-white">Current Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-primary/10">
            <span className="text-[#C4C8D4]">Theme</span>
            <span className="text-white">System default</span>
          </div>
          <div className="flex justify-between py-2 border-b border-primary/10">
            <span className="text-[#C4C8D4]">Language</span>
            <span className="text-white">English</span>
          </div>
          <div className="flex justify-between py-2 border-b border-primary/10">
            <span className="text-[#C4C8D4]">Timezone</span>
            <span className="text-white">UTC+1 (Vienna)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-primary/10">
            <span className="text-[#C4C8D4]">Date Format</span>
            <span className="text-white">DD.MM.YYYY</span>
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-2">Settings Management</h3>
        <p className="text-[#C4C8D4] text-sm">
          Full settings management including notification preferences, security options,
          and personalization will be available in a future update.
        </p>
      </div>
    </div>
  );
}
