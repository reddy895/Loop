'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
import { useAuth } from '@/context/AuthContext';
import { useFeedbackContext } from '@/context/FeedbackContext';
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { stats, isRetrieved } = useFeedbackContext();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Grouped Navigation Sections
  const navSections: NavSection[] = [
    {
      title: 'Workspace',
      items: [
        { label: 'Overview', href: '/', icon: LayoutDashboard, exact: true },
        {
          label: 'Feedback',
          href: '/inbox',
          icon: Inbox,
          badge: isRetrieved ? `${stats.totalFeedback || '1.4k'}` : undefined
        },
        { label: 'Themes', href: '/themes', icon: TrendingUp },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        { label: 'Reports', href: '/reports', icon: FileText }
      ]
    },
    {
      title: 'AI',
      items: [
        { label: 'Ask LOOP', href: '/ask-loop', icon: MessageSquareCode, badge: 'RAG' }
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Members', href: '/workspace?tab=members', icon: Users },
        { label: 'Workspace', href: '/workspace', icon: Building2, exact: true },
        { label: 'Settings', href: '/settings', icon: Settings }
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', href: '/profile', icon: User }
      ]
    }
  ];

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'PK';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const isLinkActive = (item: NavItem) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    if (item.href === '/workspace?tab=members') {
      return pathname === '/workspace' && typeof window !== 'undefined' && window.location.search.includes('tab=members');
    }
    if (item.href === '/workspace') {
      return pathname === '/workspace' && (typeof window === 'undefined' || !window.location.search.includes('tab=members'));
    }
    return pathname.startsWith(item.href);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isLinkActive(item);

    return (
      <div
        key={item.label}
        className="relative group"
        onMouseEnter={() => isCollapsed && setActiveTooltip(item.label)}
        onMouseLeave={() => isCollapsed && setActiveTooltip(null)}
      >
        <Link
          href={item.href}
          onClick={onMobileClose}
          className={cn(
            'flex items-center rounded-xl font-sans text-xs transition-all duration-150 relative select-none',
            isCollapsed
              ? 'justify-center p-2.5 mx-auto w-10 h-10'
              : 'justify-between px-3 py-2.5',
            active
              ? 'bg-neutral-900 text-white font-semibold shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-medium'
          )}
        >
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <Icon
              className={cn(
                'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105',
                active ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-900'
              )}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </div>

          {!isCollapsed && item.badge && (
            <span
              className={cn(
                'px-1.5 py-0.5 text-[9px] font-mono-numbers font-bold rounded shrink-0',
                active
                  ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                  : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
              )}
            >
              {item.badge}
            </span>
          )}

          {active && !isCollapsed && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l" />
          )}
        </Link>

        {/* Collapsed Mode Floating Tooltip */}
        {isCollapsed && activeTooltip === item.label && (
          <div className="fixed left-20 ml-2 px-2.5 py-1.5 bg-neutral-950 text-white text-xs font-sans font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none border border-neutral-800 animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2">
            <span>{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-mono-numbers font-bold px-1 py-0.2 bg-neutral-800 text-neutral-200 rounded">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={cn(
          'bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out',
          // Desktop collapse width
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile drawer positioning
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl translate-x-0'
            : '-translate-x-full lg:translate-x-0 fixed lg:sticky'
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'border-b border-neutral-200 flex items-center shrink-0 h-16',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-3 group select-none overflow-hidden"
          >
            <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 shadow-2xs group-hover:bg-neutral-200 transition-colors flex items-center justify-center shrink-0">
              <LoopLogoIcon size={22} variant="dark" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-heading text-lg font-extrabold tracking-wider text-neutral-950 leading-tight">
                    LOOP
                  </h1>
                  <span className="px-1.5 py-0.2 text-[8px] font-mono-numbers font-bold rounded bg-neutral-900 text-white">
                    SAAS
                  </span>
                </div>
                <span className="text-[9px] uppercase font-mono-numbers text-neutral-400 tracking-wider block">
                  Customer Intelligence
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                'hidden lg:flex p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer',
                isCollapsed && 'absolute right-2 -mr-3 z-50 bg-white shadow-xs'
              )}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Section List */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-5 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed ? (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 font-mono-numbers">
                  {section.title}
                </span>
              ) : idx > 0 ? (
                <div className="w-6 h-px bg-neutral-200 mx-auto my-3" />
              ) : null}

              <div className="space-y-1">
                {section.items.map(renderNavItem)}
              </div>
            </div>
          ))}

          {/* Logout Action */}
          <div className="pt-2 border-t border-neutral-100">
            <button
              onClick={() => {
                if (onMobileClose) onMobileClose();
                logout();
              }}
              className={cn(
                'w-full flex items-center rounded-xl font-sans text-xs transition-all duration-150 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer',
                isCollapsed
                  ? 'justify-center p-2.5 mx-auto w-10 h-10'
                  : 'justify-between px-3 py-2.5'
              )}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
                <LogOut className="w-4 h-4 text-neutral-500 shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Profile Summary Card */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 shrink-0">
          <Link
            href="/profile"
            onClick={onMobileClose}
            className={cn(
              'rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-2xs flex items-center cursor-pointer',
              isCollapsed ? 'p-2 justify-center' : 'p-2.5 gap-2.5'
            )}
            title={isCollapsed ? `${user?.name || 'Praveen Kumar'} (${user?.role || 'ADMIN'})` : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white font-mono-numbers font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-neutral-900 truncate font-sans">
                    {user?.name || 'Praveen Kumar'}
                  </p>
                  <span className="text-[9px] font-mono-numbers font-bold uppercase px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {user?.role || 'ADMIN'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 truncate font-mono-numbers">
                  {user?.email || 'praveen@acmesaas.com'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};
