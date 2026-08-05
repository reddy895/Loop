import React from 'react';
import { LoopBrand } from '@/components/ui/LoopLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFFE3] text-[#4A4A4A] flex flex-col items-center justify-center p-4">
      {/* Brand Header with New LOOP Logo */}
      <div className="mb-6 flex items-center justify-center">
        <LoopBrand variant="dark" showTagline={true} />
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs font-sans text-[#4A4A4A]/60">
        © 2026 LOOP Platform. All Rights Reserved.
      </footer>
    </div>
  );
}
