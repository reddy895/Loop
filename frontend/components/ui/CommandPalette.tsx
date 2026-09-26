'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFeedbackContext } from '@/context/FeedbackContext';
import {
  Search,
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
  FileSpreadsheet,
  ArrowRight,
  CornerDownLeft,
  X,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Feedback';
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { openRetrieveModal, feedbackList } = useFeedbackContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const defaultNavigationItems: CommandItem[] = [
    {
      id: 'nav-overview',
      category: 'Navigation',
      title: 'Dashboard Overview',
      subtitle: 'Executive KPIs, sentiment snapshot, and volume trajectory',
      icon: LayoutDashboard,
      action: () => {
        router.push('/');
        onClose();
      }
    },
    {
      id: 'nav-inbox',
      category: 'Navigation',
      title: 'Feedback Inbox',
      subtitle: 'Browse, filter, and triage all customer feedback items',
      icon: Inbox,
      badge: '1.4k tickets',
      action: () => {
        router.push('/inbox');
        onClose();
      }
    },
    {
      id: 'nav-themes',
      category: 'Navigation',
      title: 'Themes & Clustering',
      subtitle: 'AI-clustered feedback themes and friction points',
      icon: TrendingUp,
      action: () => {
        router.push('/themes');
        onClose();
      }
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      title: 'Intelligence Analytics',
      subtitle: 'Multi-channel sentiment breakdown, trends, and distributions',
      icon: BarChart3,
      action: () => {
        router.push('/analytics');
        onClose();
      }
    },
    {
      id: 'nav-reports',
      category: 'Navigation',
      title: 'Voice of Customer Reports',
      subtitle: 'Executive synthesis briefs, NPS scores, and recommendations',
      icon: FileText,
      action: () => {
        router.push('/reports');
        onClose();
      }
    },
    {
      id: 'nav-ask-loop',
      category: 'Navigation',
      title: 'Ask LOOP (RAG Intelligence)',
      subtitle: 'Ask natural-language questions with verified customer citations',
      icon: MessageSquareCode,
      badge: 'AI',
      action: () => {
        router.push('/ask-loop');
        onClose();
      }
    },
    {
      id: 'nav-members',
      category: 'Navigation',
      title: 'Workspace Members & Roles',
      subtitle: 'Manage RBAC permissions and team access',
      icon: Users,
      action: () => {
        router.push('/workspace?tab=members');
        onClose();
      }
    },
    {
      id: 'nav-workspace',
      category: 'Navigation',
      title: 'Workspace Configuration',
      subtitle: 'General workspace metadata and ingestion configuration',
      icon: Building2,
      action: () => {
        router.push('/workspace');
        onClose();
      }
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      title: 'Platform & Security Settings',
      subtitle: 'API keys, notifications, audit logs, and account security',
      icon: Settings,
      action: () => {
        router.push('/settings');
        onClose();
      }
    },
    {
      id: 'nav-profile',
      category: 'Navigation',
      title: 'User Profile',
      subtitle: 'Personal details and credentials',
      icon: User,
      action: () => {
        router.push('/profile');
        onClose();
      }
    }
  ];

  const defaultActionItems: CommandItem[] = [
    {
      id: 'act-retrieve',
      category: 'Actions',
      title: 'Retrieve CSV Dataset',
      subtitle: 'Ingest sample Enterprise, Zendesk, or custom customer CSV datasets',
      icon: FileSpreadsheet,
      badge: 'Dataset',
      action: () => {
        onClose();
        openRetrieveModal();
      }
    },
    {
      id: 'act-ask',
      category: 'Actions',
      title: 'Query RAG Intelligence Engine',
      subtitle: 'Open Ask LOOP assistant to synthesize customer queries',
      icon: Sparkles,
      badge: 'RAG',
      action: () => {
        router.push('/ask-loop');
        onClose();
      }
    }
  ];

  // Dynamic feedback matches if query has >= 2 characters
  const feedbackItems: CommandItem[] = query.trim().length >= 2
    ? feedbackList
        .filter((fb) =>
          fb.feedback.toLowerCase().includes(query.toLowerCase()) ||
          fb.customerName.toLowerCase().includes(query.toLowerCase()) ||
          fb.theme.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
        .map((fb) => ({
          id: `fb-${fb.id}`,
          category: 'Feedback' as const,
          title: `"${fb.feedback.slice(0, 65)}..."`,
          subtitle: `${fb.customerName} • ${fb.channel} • ${fb.theme} [${fb.sentiment}]`,
          icon: Inbox,
          badge: fb.id,
          action: () => {
            router.push(`/inbox?search=${encodeURIComponent(fb.id)}`);
            onClose();
          }
        }))
    : [];

  const allFilteredItems = [
    ...defaultNavigationItems.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.subtitle && i.subtitle.toLowerCase().includes(query.toLowerCase()))
    ),
    ...defaultActionItems.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.subtitle && i.subtitle.toLowerCase().includes(query.toLowerCase()))
    ),
    ...feedbackItems
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < allFilteredItems.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : allFilteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allFilteredItems[selectedIndex]) {
          allFilteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allFilteredItems]);

  // Ensure selected item is scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 font-sans animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-neutral-300 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 gap-3 bg-neutral-50/50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, navigate, or search customer feedback..."
            className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-neutral-200 rounded-md text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono-numbers uppercase tracking-wider font-bold bg-neutral-100 text-neutral-500 border border-neutral-300 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allFilteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-700">No matching commands or feedback found</p>
              <p className="text-[11px] text-neutral-400 mt-1">Try typing &apos;inbox&apos;, &apos;themes&apos;, &apos;reports&apos;, or &apos;export&apos;</p>
            </div>
          ) : (
            allFilteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-neutral-800 text-white'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-sans truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-mono-numbers font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-neutral-800 text-neutral-300'
                              : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-neutral-300 animate-in fade-in" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded font-bold text-[10px] text-neutral-700">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded font-bold text-[10px] text-neutral-700">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded font-bold text-[10px] text-neutral-700">
              ESC
            </kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
};
