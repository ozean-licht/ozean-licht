import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-decorative text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          Profile
        </h1>
        <p className="text-[#C4C8D4] mt-1">
          View and manage your account information
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-[#00111A]/70 backdrop-blur-xl border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary text-2xl font-medium">
            {user.email
              ?.split('@')[0]
              .split('.')
              .map((part) => part[0]?.toUpperCase() || '')
              .join('')
              .slice(0, 2)}
          </div>

          {/* User info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-medium text-white">{user.email}</h2>
              <p className="text-[#C4C8D4] text-sm mt-1">
                {user.adminRole === 'super_admin'
                  ? 'Super Administrator'
                  : user.adminRole === 'entity_admin'
                  ? 'Entity Administrator'
                  : 'Viewer'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-3 text-[#C4C8D4]">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">{user.email}</span>
              </div>

              <div className="flex items-center gap-3 text-[#C4C8D4]">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm capitalize">
                  {user.adminRole?.replace('_', ' ')}
                </span>
              </div>

              {user.entityScope && (
                <div className="flex items-center gap-3 text-[#C4C8D4]">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm capitalize">
                    {user.entityScope.replace('_', ' ')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[#C4C8D4]">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">Active session</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="bg-[#00111A]/50 backdrop-blur-xl border border-primary/10 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-2">Coming Soon</h3>
        <p className="text-[#C4C8D4] text-sm">
          Profile editing, avatar upload, and more account management features will be available here.
        </p>
      </div>
    </div>
  );
}
