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
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-sans">
            {title}
          </span>
          <div className="mt-2 text-2xl lg:text-3xl font-bold font-mono-numbers text-neutral-900 tracking-tight">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 pt-2.5 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
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
            <span className="text-neutral-500 font-sans text-xs whitespace-nowrap truncate min-w-0">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
