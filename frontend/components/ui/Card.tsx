import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'panel' | 'cream' | 'inset';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'panel',
  className,
  children
}) => {
  const variantStyles = {
    panel: 'skeuo-panel p-5',
    cream: 'skeuo-card-cream p-5',
    inset: 'skeuo-inset p-4'
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('flex flex-col gap-1 mb-4 pb-3 border-b border-[#4A4A4A]/10', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={cn('font-heading text-lg font-bold text-[#4A4A4A] tracking-tight', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <p className={cn('text-xs text-[#4A4A4A]/75 font-sans', className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('font-sans', className)}>{children}</div>
);
