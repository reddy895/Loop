'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WorkspaceSelector } from './WorkspaceSelector';
import { Breadcrumb, BreadcrumbItem, Avatar, Tooltip } from '@/components/ui/MiscUI';
import { SearchBar } from '@/components/ui/SearchFilterBars';
import { useTheme } from '@/components/context/ThemeContext';
import { Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState('');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Generate breadcrumb based on pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === '/') return [{ label: 'Dashboard' }];
    if (pathname.startsWith('/inbox')) return [{ label: 'Feedback Inbox' }];
    if (pathname.startsWith('/analytics')) return [{ label: 'Analytics' }];
    if (pathname.startsWith('/themes')) return [{ label: 'Themes & Trends' }];
    if (pathname.startsWith('/ask-loop')) return [{ label: 'Ask LOOP AI' }];
    if (pathname.startsWith('/reports')) return [{ label: 'Voice of Customer Reports' }];
    if (pathname.startsWith('/workspace')) return [{ label: 'Workspace Settings' }];
    if (pathname.startsWith('/profile')) return [{ label: 'User Profile' }];
    return [{ label: 'Overview' }];
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFE3]/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xs border-b border-[#4A4A4A]/20 dark:border-white/10 shadow-xs px-4 py-3 flex items-center justify-between gap-4 transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded skeuo-button-secondary text-[#4A4A4A] dark:text-[#FFFFE3]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <WorkspaceSelector />

        <div className="hidden md:block h-5 w-px bg-[#4A4A4A]/20 dark:bg-white/20 mx-1" />

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

        {/* Theme Toggle Button */}
        <Tooltip content={isDark ? 'Switch to Cream Skeuomorphic' : 'Switch to Dark Skeuomorphic'}>
          <button
            onClick={toggleTheme}
            className="skeuo-button-secondary p-2 text-[#4A4A4A] dark:text-[#FFFFE3]"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D9A357]" /> : <Moon className="w-4 h-4 text-[#6D8196]" />}
          </button>
        </Tooltip>

        {/* User Profile Avatar Link */}
        <Link href="/profile" className="flex items-center gap-2 group">
          <Avatar name="Praveen Kumar" size="sm" />
          <span className="hidden xl:inline text-xs font-bold text-[#4A4A4A] dark:text-[#FFFFE3] group-hover:text-[#6D8196] transition-colors font-sans">
            Praveen
          </span>
        </Link>
      </div>
    </header>
  );
};
