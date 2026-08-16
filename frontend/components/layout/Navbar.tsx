'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WorkspaceSelector } from './WorkspaceSelector';
import { Breadcrumb, BreadcrumbItem, Avatar } from '@/components/ui/MiscUI';
import { SearchBar } from '@/components/ui/SearchFilterBars';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState('');
  const { user } = useAuth();

  // Generate breadcrumb based on pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === '/') return [{ label: 'Dashboard' }];
    if (pathname.startsWith('/inbox')) return [{ label: 'Feedback Inbox' }];
    if (pathname.startsWith('/analytics')) return [{ label: 'Analytics' }];
    if (pathname.startsWith('/themes')) return [{ label: 'Themes & Trends' }];
    if (pathname.startsWith('/ask-loop')) return [{ label: 'Ask LOOP AI' }];
    if (pathname.startsWith('/reports')) return [{ label: 'Voice of Customer Reports' }];
    if (pathname.startsWith('/workspace')) return [{ label: 'Workspace Settings' }];
    if (pathname.startsWith('/settings')) return [{ label: 'Settings & Security' }];
    if (pathname.startsWith('/profile')) return [{ label: 'User Profile' }];
    return [{ label: 'Overview' }];
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFE3]/95 backdrop-blur-xs border-b border-[#4A4A4A]/20 shadow-xs px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded skeuo-button-secondary text-[#4A4A4A]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <WorkspaceSelector />

        <div className="hidden md:block h-5 w-px bg-[#4A4A4A]/20 mx-1" />

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search */}
        <div className="hidden md:block w-56 lg:w-72">
          <SearchBar
            value={searchVal}
            onChange={setSearchVal}
            placeholder="Global search feedback..."
          />
        </div>

        {/* User Profile Avatar Link */}
        <Link href="/settings" className="flex items-center gap-2 group">
          <Avatar name={user?.name || "Praveen Kumar"} size="sm" />
          <span className="hidden xl:inline text-xs font-bold text-[#4A4A4A] group-hover:text-[#6D8196] transition-colors font-sans">
            {user?.name?.split(' ')[0] || "Praveen"}
          </span>
        </Link>
      </div>
    </header>
  );
};
