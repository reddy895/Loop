import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoopLogoIcon } from './LoopLogo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-sans text-[#4A4A4A]/70 select-none">
      <Link href="/" className="hover:text-[#4A4A4A] flex items-center gap-1.5 transition-colors">
        <LoopLogoIcon size={16} variant="dark" />
        <span className="font-heading font-bold text-[#4A4A4A]">LOOP</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-[#4A4A4A]/40" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#4A4A4A] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#4A4A4A] font-heading">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  name,
  size = 'md',
  className
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeStyles = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm'
  };

  return (
    <div
      className={cn(
        'rounded-full bg-[#4A4A4A] text-[#FFFFE3] font-bold font-sans flex items-center justify-center border-2 border-[#CBCBCB] shadow-md select-none shrink-0',
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 px-2.5 py-1 text-[11px] font-sans font-medium text-[#FFFFE3] bg-[#4A4A4A] rounded shadow-lg border border-[#CBCBCB]/30 whitespace-nowrap pointer-events-none">
        {content}
      </div>
    </div>
  );
};
