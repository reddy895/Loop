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
    <nav className="flex items-center gap-1.5 text-xs font-sans text-neutral-500 select-none">
      <Link href="/" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
        <LoopLogoIcon size={16} variant="dark" />
        <span className="font-heading font-bold text-neutral-900">LOOP</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-neutral-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-neutral-900 font-heading">{item.label}</span>
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
        'rounded-full bg-neutral-900 text-white font-bold font-sans flex items-center justify-center border border-neutral-300 shadow-xs select-none shrink-0',
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
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 px-2.5 py-1 text-[11px] font-sans font-medium text-white bg-neutral-900 rounded-md shadow-md border border-neutral-800 whitespace-nowrap pointer-events-none">
        {content}
      </div>
    </div>
  );
};
