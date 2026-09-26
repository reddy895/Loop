'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle2,
  Check,
  ExternalLink
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'critical' | 'theme' | 'report' | 'system';
  title: string;
  description: string;
  time: string;
  href: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'critical',
    title: 'Severe Friction Spike Detected',
    description: '8 enterprise customers flagged timeouts on 5,000+ CSV record exports.',
    time: '12m ago',
    href: '/inbox',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'report',
    title: 'Executive VoC Brief Generated',
    description: 'Weekly synthesis for Q3 Sprint 4 is ready with NPS +48.',
    time: '45m ago',
    href: '/reports',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'theme',
    title: 'AI Themes Reclustered',
    description: '148 feedback tickets grouped under "UX Performance" & "Mobile Navigation".',
    time: '2h ago',
    href: '/themes',
    isRead: true
  }
];

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
        aria-label="Platform Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-950 text-white text-[9px] font-mono-numbers font-bold rounded-full flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-300 rounded-2xl shadow-xl z-50 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold text-neutral-900">
                Platform Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono-numbers font-bold rounded bg-neutral-900 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-medium text-neutral-500 hover:text-neutral-950 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No notifications
              </div>
            ) : (
              notifications.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      markItemRead(item.id);
                      setIsOpen(false);
                    }}
                    className={`block p-3.5 hover:bg-neutral-50 transition-colors ${
                      !item.isRead ? 'bg-neutral-50/40' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-900 shrink-0 mt-0.5">
                        {item.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.type === 'report' && <FileText className="w-3.5 h-3.5" />}
                        {item.type === 'theme' && <TrendingUp className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className={`text-xs font-bold truncate ${!item.isRead ? 'text-neutral-950' : 'text-neutral-700'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] font-mono-numbers text-neutral-400 shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-neutral-900 shrink-0 mt-1.5" />
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 text-center">
            <Link
              href="/inbox"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 inline-flex items-center gap-1.5"
            >
              <span>View all triage alerts</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
