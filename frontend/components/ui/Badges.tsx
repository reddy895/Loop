import React from 'react';
import { cn } from '@/lib/utils';
import { SentimentType, FeedbackStatus, FeedbackTheme } from '@/types';

export const SentimentBadge: React.FC<{ sentiment: SentimentType; className?: string }> = ({
  sentiment,
  className
}) => {
  const styles = {
    Positive: 'bg-neutral-900 text-white border border-neutral-900',
    Negative: 'bg-white text-neutral-950 border border-neutral-900 font-semibold',
    Neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-300'
  };

  const dotStyles = {
    Positive: 'bg-white',
    Negative: 'bg-neutral-900',
    Neutral: 'bg-neutral-400'
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium select-none shadow-2xs', styles[sentiment], className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', dotStyles[sentiment])} />
      {sentiment}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: FeedbackStatus; className?: string }> = ({
  status,
  className
}) => {
  const styles = {
    New: 'bg-neutral-900 text-white border border-neutral-900',
    'Under Review': 'bg-neutral-100 text-neutral-800 border border-neutral-300',
    Processed: 'bg-neutral-200 text-neutral-900 border border-neutral-300 font-medium',
    Archived: 'bg-neutral-50 text-neutral-500 border border-neutral-200'
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-numbers font-semibold uppercase tracking-wider', styles[status], className)}>
      {status}
    </span>
  );
};

export const ThemeBadge: React.FC<{ theme: FeedbackTheme; className?: string }> = ({
  theme,
  className
}) => {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200/90 font-sans', className)}>
      {theme}
    </span>
  );
};
