'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { RetrieveCSVModal } from '@/components/ui/RetrieveCSVModal';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
