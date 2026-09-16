import React from 'react';
import { LoopBrand } from '@/components/ui/LoopLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-4">
      {/* Brand Header with New LOOP Logo */}
      <div className="mb-6 flex items-center justify-center">
        <LoopBrand variant="dark" showTagline={true} />
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs font-sans text-neutral-500">
        © 2026 LOOP Platform. All Rights Reserved.
      </footer>
    </div>
  );
}
