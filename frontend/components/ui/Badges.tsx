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
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold select-none', styles[sentiment], className)}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        sentiment === 'Positive' && 'bg-green-600',
        sentiment === 'Negative' && 'bg-red-600',
        sentiment === 'Neutral' && 'bg-gray-600'
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
    New: 'bg-[#6D8196] text-[#FFFFE3] border border-[#7E93A9] shadow-xs',
    'Under Review': 'bg-[#D9A357] text-[#3D2908] border border-[#E8B872] shadow-xs',
    Processed: 'bg-[#537D56] text-[#FFFFE3] border border-[#6B996E] shadow-xs',
    Archived: 'bg-[#7A7A7A] text-[#FFFFE3] border border-[#8C8C8C] shadow-xs'
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider', styles[status], className)}>
      {status}
    </span>
  );
};

export const ThemeBadge: React.FC<{ theme: FeedbackTheme; className?: string }> = ({
  theme,
  className
}) => {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium skeuo-badge-accent border border-[#B0C4D6]', className)}>
      {theme}
    </span>
  );
};
