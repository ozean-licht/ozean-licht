'use client';

import { Breadcrumb } from './Breadcrumb';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  user: {
    email: string;
    adminRole: string;
    entityScope: string | null;
  };
  onMenuToggle?: () => void;
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-[#00111A] backdrop-blur-xl shadow-lg border-b border-primary/20">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Left side: Mobile menu toggle + Breadcrumbs */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile menu toggle button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 transition-colors rounded-lg"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:block flex-1 min-w-0">
              <Breadcrumb showHomeIcon maxLabelLength={25} />
            </div>
          </div>

          {/* Right side: Theme toggle + User menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </div>

        {/* Mobile breadcrumbs (below the header row) */}
        <div className="sm:hidden mt-2">
          <Breadcrumb showHomeIcon maxLabelLength={20} />
        </div>
      </div>
    </header>
  );
}
