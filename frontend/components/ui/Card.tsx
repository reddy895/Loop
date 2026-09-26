import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'panel' | 'cream' | 'inset' | 'interactive';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'panel',
  className,
  children,
  onClick
}) => {
  const variantStyles = {
    panel: 'skeuo-panel p-5 sm:p-6',
    cream: 'skeuo-card-cream p-5 sm:p-6',
    inset: 'skeuo-inset p-4 sm:p-5',
    interactive: 'skeuo-panel p-5 sm:p-6 hover:border-neutral-400 hover:shadow-md transition-all duration-150 cursor-pointer'
  };

  return (
    <div
      onClick={onClick}
      className={cn(variantStyles[variant], className)}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('flex flex-col gap-1 mb-4 pb-3 border-b border-neutral-200/80', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={cn('font-heading text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-snug', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <p className={cn('text-xs text-neutral-500 font-sans leading-relaxed', className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('font-sans text-neutral-800 text-sm leading-normal', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs', className)}>
    {children}
  </div>
);
