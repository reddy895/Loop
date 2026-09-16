import React from 'react';
import { cn } from '@/lib/utils';
import { SentimentType, FeedbackStatus, FeedbackTheme } from '@/types';

export const SentimentBadge: React.FC<{ sentiment: SentimentType; className?: string }> = ({
  sentiment,
  className
}) => {
  const styles = {
    Positive: 'skeuo-badge-positive',
    Negative: 'skeuo-badge-negative',
    Neutral: 'skeuo-badge-neutral'
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none', styles[sentiment], className)}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        sentiment === 'Positive' && 'bg-emerald-600',
        sentiment === 'Negative' && 'bg-rose-600',
        sentiment === 'Neutral' && 'bg-amber-500'
      )} />
      {sentiment}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: FeedbackStatus; className?: string }> = ({
  status,
  className
}) => {
  const styles = {
    New: 'bg-black text-white border border-black',
    'Under Review': 'bg-neutral-100 text-neutral-800 border border-neutral-300',
    Processed: 'bg-neutral-200 text-neutral-900 border border-neutral-300',
    Archived: 'bg-neutral-50 text-neutral-500 border border-neutral-200'
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider', styles[status], className)}>
      {status}
    </span>
  );
};

export const ThemeBadge: React.FC<{ theme: FeedbackTheme; className?: string }> = ({
  theme,
  className
}) => {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200', className)}>
      {theme}
    </span>
  );
};
