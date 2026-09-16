'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { RetrieveCSVModal } from '@/components/ui/RetrieveCSVModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <FeedbackProvider>
      <div className="min-h-screen flex bg-[#FAFAFA] text-neutral-900 font-sans antialiased">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>

        {/* Global Retrieve CSV Modal */}
        <RetrieveCSVModal />
      </div>
    </FeedbackProvider>
  );
}

