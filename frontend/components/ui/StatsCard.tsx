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
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  description,
  icon,
  variant = 'panel',
  className
}) => {
  return (
    <div
      className={cn(
        "loop-card p-4 sm:p-5 relative overflow-hidden transition-all duration-150 hover:border-neutral-300 hover:shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-mono-numbers block">
            {title}
          </span>
          <div className="mt-1.5 text-2xl xl:text-3xl font-bold font-mono-numbers text-neutral-900 tracking-tight">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/80 text-neutral-800 shrink-0 ml-2 transition-colors">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold font-mono-numbers px-2 py-0.5 rounded text-[11px] whitespace-nowrap shrink-0',
                trend === 'up' && 'bg-neutral-900 text-white border border-neutral-900',
                trend === 'down' && 'bg-white text-neutral-900 border border-neutral-900 font-bold',
                trend === 'neutral' && 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              )}
            >
              {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />}
              {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5 shrink-0" />}
              <span>{change}</span>
            </span>
          )}
          {description && (
            <span className="text-neutral-500 font-sans text-xs whitespace-nowrap truncate min-w-0">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
