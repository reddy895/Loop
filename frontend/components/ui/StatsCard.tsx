import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  variant?: 'panel' | 'cream';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  description,
  icon,
  variant = 'panel'
}) => {
  return (
    <Card variant={variant} className="relative overflow-hidden group transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-[#4A4A4A]/70 font-sans">
            {title}
          </span>
          <div className="mt-2 text-2xl lg:text-3xl font-bold font-mono-numbers text-[#4A4A4A] tracking-tight">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-[#4A4A4A]/10 border border-[#FFFFE3]/40 text-[#4A4A4A] shadow-inner shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 pt-2.5 border-t border-[#4A4A4A]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0',
                trend === 'up' && 'skeuo-badge-positive',
                trend === 'down' && 'skeuo-badge-negative',
                trend === 'neutral' && 'skeuo-badge-neutral'
              )}
            >
              {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />}
              {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5 shrink-0" />}
              <span>{change}</span>
            </span>
          )}
          {description && (
            <span className="text-[#4A4A4A]/70 font-sans text-xs whitespace-nowrap truncate min-w-0">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
