'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WorkspaceSelector } from './WorkspaceSelector';
import { NotificationsPopover } from './NotificationsPopover';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Command
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  onOpenCommandPalette
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute context-aware page title & category
  const getPageInfo = () => {
    if (pathname === '/dashboard' || pathname === '/') return { title: 'Overview', category: 'Workspace' };
    if (pathname.startsWith('/inbox')) return { title: 'Feedback Inbox', category: 'Intelligence' };
    if (pathname.startsWith('/themes')) return { title: 'Themes & Clustering', category: 'AI Intelligence' };
    if (pathname.startsWith('/analytics')) return { title: 'Analytics', category: 'Reporting' };
    if (pathname.startsWith('/reports')) return { title: 'VoC Reports', category: 'Executive Briefs' };
    if (pathname.startsWith('/ask-loop')) return { title: 'Ask LOOP (RAG)', category: 'AI Assistant' };
    if (pathname.startsWith('/workspace')) return { title: 'Workspace', category: 'Management' };
    if (pathname.startsWith('/settings')) return { title: 'Settings', category: 'System' };
    if (pathname.startsWith('/profile')) return { title: 'User Profile', category: 'Account' };
    return { title: 'Workspace', category: 'Intelligence' };
  };

  const pageInfo = getPageInfo();

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'PK';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 font-sans select-none">
      {/* Left Area: Mobile Menu + Workspace + Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 transition-colors cursor-pointer shadow-2xs"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <WorkspaceSelector />

        <div className="hidden md:block h-4 w-px bg-neutral-200 mx-1" />

        {/* Dynamic Context Page Title */}
        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono-numbers uppercase tracking-wider text-neutral-400 font-semibold truncate">
            {pageInfo.category}
          </span>
          <span className="text-neutral-300">/</span>
          <h2 className="font-heading text-xs sm:text-sm font-bold text-neutral-900 truncate">
            {pageInfo.title}
          </h2>
        </div>
      </div>

      {/* Center Area: Quick Command Search Trigger Button */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2">
        <button
          onClick={onOpenCommandPalette}
          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50/80 hover:bg-white hover:border-neutral-300 text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-between gap-2 text-xs shadow-2xs cursor-pointer group"
          title="Open Command Palette (Cmd + K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" />
            <span className="truncate text-neutral-500 group-hover:text-neutral-800 font-medium">
              Search intelligence, tickets, commands...
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono-numbers font-bold text-neutral-500 bg-white border border-neutral-200 rounded shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Area: System Pulse + Notifications + Role Badge + User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Real-time System Pulse Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-full text-[11px] font-mono-numbers text-neutral-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900" />
          </span>
          <span className="font-semibold text-neutral-800">Engine Synced</span>
        </div>

        {/* Notifications Popover */}
        <NotificationsPopover />

        {/* User Profile & Role Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs"
          >
            {/* Role Chip */}
            <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono-numbers font-bold uppercase rounded bg-neutral-100 text-neutral-900 border border-neutral-200">
              {user?.role || 'ADMIN'}
            </span>

            {/* User Avatar */}
            <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white font-mono-numbers font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-300 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-neutral-100">
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {user?.name || 'Praveen Kumar'}
                </p>
                <p className="text-[10px] text-neutral-500 font-mono-numbers truncate">
                  {user?.email || 'praveen@acmesaas.com'}
                </p>
              </div>

              <div className="space-y-0.5 pt-1">
                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                >
                  <User className="w-4 h-4 text-neutral-500" />
                  <span>Profile Overview</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-neutral-500" />
                  <span>Platform Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenCommandPalette) onOpenCommandPalette();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-xs text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Command className="w-4 h-4 text-neutral-500" />
                    <span>Command Palette</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono-numbers font-bold bg-neutral-100 text-neutral-500 border border-neutral-200 rounded">
                    ⌘K
                  </kbd>
                </button>
              </div>

              <div className="border-t border-neutral-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-neutral-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
