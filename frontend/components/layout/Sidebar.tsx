'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
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
    { label: 'Settings', href: '/profile?tab=settings', icon: Settings }
  ];

  const userMenuItems = [
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Logout', href: '/login', icon: LogOut }
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
          'flex items-center justify-between px-3 py-2 rounded-md font-sans text-xs font-medium transition-all duration-150 relative',
          isActive ? 'skeuo-nav-active' : 'skeuo-nav-inactive'
        )}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn('w-4 h-4', isActive ? 'text-[#FFFFE3]' : 'text-[#CBCBCB]')} />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#6D8196] text-[#FFFFE3] border border-[#7E93A9] shadow-xs">
            {item.badge}
          </span>
        )}
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#6D8196] rounded-l" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'w-64 skeuo-sidebar flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-transform duration-200 lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 fixed lg:sticky'
      )}
    >
      {/* Brand Header with New LOOP Logo */}
      <div className="p-4 border-b border-[#3A3A3A] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="p-2 rounded-xl bg-[#3A3A3A] border border-[#5A5A5A] text-[#FFFFE3] shadow-inner group-hover:bg-[#6D8196] transition-colors flex items-center justify-center">
            <LoopLogoIcon size={26} variant="light" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-extrabold tracking-wider text-[#FFFFE3]">
              LOOP
            </h1>
            <span className="text-[9px] uppercase font-mono-numbers text-[#CBCBCB]/70 tracking-widest block">
              Feedback Engine
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#CBCBCB]/60 block mb-2 font-mono-numbers">
            Core Intelligence
          </span>
          <div className="space-y-1">
            {mainMenuItems.map(renderNavLink)}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#CBCBCB]/60 block mb-2 font-mono-numbers">
            Organization
          </span>
          <div className="space-y-1">
            {adminMenuItems.map(renderNavLink)}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#CBCBCB]/60 block mb-2 font-mono-numbers">
            User Account
          </span>
          <div className="space-y-1">
            {userMenuItems.map(renderNavLink)}
          </div>
        </div>
      </div>

      {/* Bottom Profile Summary */}
      <div className="p-3 border-t border-[#3A3A3A] bg-[#3D3D3D]">
        <div className="skeuo-inset-gray p-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#6D8196] text-[#FFFFE3] font-bold text-xs flex items-center justify-center border border-[#7E93A9]">
            PK
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#FFFFE3] truncate font-sans">
              Praveen Kumar
            </p>
            <p className="text-[10px] text-[#CBCBCB] truncate font-mono-numbers">
              Enterprise Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
