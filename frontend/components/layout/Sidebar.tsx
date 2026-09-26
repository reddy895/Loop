'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  TrendingUp,
  MessageSquareCode,
  FileText,
  Building2,
  Users,
  Settings,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mainMenuItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Feedback Inbox', href: '/inbox', icon: Inbox },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Themes & Trends', href: '/themes', icon: TrendingUp },
    { label: 'Ask LOOP', href: '/ask-loop', icon: MessageSquareCode, badge: 'AI' },
    { label: 'Reports', href: '/reports', icon: FileText }
  ];

  const adminMenuItems = [
    { label: 'Workspace', href: '/workspace', icon: Building2 },
    { label: 'Members', href: '/workspace?tab=members', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings }
  ];

  const renderNavLink = (item: { label: string; href: string; icon: any; badge?: string }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={onMobileClose}
        className={cn(
          'flex items-center justify-between px-3 py-2 rounded-lg font-sans text-xs font-medium transition-all duration-150 relative select-none',
          isActive
            ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
        )}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700')} />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className={cn(
            'px-1.5 py-0.5 text-[9px] font-mono-numbers font-bold rounded',
            isActive ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
          )}>
            {item.badge}
          </span>
        )}
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-white rounded-l" />
        )}
      </Link>
    );
  };

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'PK';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-transform duration-200 lg:translate-x-0',
        isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 fixed lg:sticky'
      )}
    >
      {/* Brand Header with LOOP Logo */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 shadow-2xs group-hover:bg-neutral-200 transition-colors flex items-center justify-center">
            <LoopLogoIcon size={24} variant="dark" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-extrabold tracking-wider text-neutral-900">
              LOOP
            </h1>
            <span className="text-[9px] uppercase font-mono-numbers text-neutral-400 tracking-widest block">
              Feedback Engine
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-mono-numbers">
            Core Intelligence
          </span>
          <div className="space-y-1">
            {mainMenuItems.map(renderNavLink)}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-mono-numbers">
            Organization
          </span>
          <div className="space-y-1">
            {adminMenuItems.map(renderNavLink)}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-mono-numbers">
            User Account
          </span>
          <div className="space-y-1">
            <Link
              href="/profile"
              onClick={onMobileClose}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg font-sans text-xs font-medium transition-all duration-150 relative select-none',
                pathname === '/profile'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              )}
            >
              <div className="flex items-center gap-2.5">
                <User className={cn('w-4 h-4', pathname === '/profile' ? 'text-white' : 'text-neutral-400')} />
                <span>Profile</span>
              </div>
              {pathname === '/profile' && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-white rounded-l" />
              )}
            </Link>

            <button
              onClick={() => {
                if (onMobileClose) onMobileClose();
                logout();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-sans text-xs font-medium transition-all duration-150 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-neutral-400" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile Summary */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/70">
        <Link href="/settings" className="bg-white border border-neutral-200 rounded-lg p-2.5 flex items-center gap-2.5 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white font-mono-numbers font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-neutral-900 truncate font-sans">
              {user?.name || 'Praveen Kumar'}
            </p>
            <p className="text-[10px] text-neutral-500 truncate font-mono-numbers uppercase">
              {user?.role || 'Enterprise Admin'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
