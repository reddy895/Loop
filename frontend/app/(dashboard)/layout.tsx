'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { RetrieveCSVModal } from '@/components/ui/RetrieveCSVModal';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useAuth } from '@/context/AuthContext';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Authentication & Protected Route Enforcement
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Restore sidebar collapsed preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('loop_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('loop_sidebar_collapsed', String(next));
      } catch (e) {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  // Global shortcut for Command Palette (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Premium loading state while validating session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans space-y-4">
        <div className="p-3.5 rounded-2xl bg-neutral-900 text-white shadow-xl animate-pulse">
          <LoopLogoIcon size={32} variant="light" />
        </div>
        <div className="space-y-1 text-center">
          <span className="text-[10px] uppercase font-mono-numbers tracking-widest font-bold text-neutral-400">
            SESSION VALIDATION
          </span>
          <h2 className="font-heading text-sm font-bold text-neutral-900">
            Preparing your workspace...
          </h2>
        </div>
        <div className="w-48 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-neutral-900 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // Prevent flash of private content if unauthenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <FeedbackProvider>
      <div className="min-h-screen flex bg-[#FAFAFA] text-neutral-900 font-sans antialiased">
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          {/* Top Header */}
          <Navbar
            onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Dynamic Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>

        {/* Global Modal Ingestion */}
        <RetrieveCSVModal />

        {/* Global Enterprise Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </div>
    </FeedbackProvider>
  );
}
