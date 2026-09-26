import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search customer feedback...',
  className
}) => {
  return (
    <div className={cn('relative flex-1', className)}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface FilterSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono-numbers font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-sans text-neutral-900 cursor-pointer focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  sentimentFilter: string;
  onSentimentChange: (s: string) => void;
  themeFilter: string;
  onThemeChange: (t: string) => void;
  channelFilter: string;
  onChannelChange: (c: string) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sentimentFilter,
  onSentimentChange,
  themeFilter,
  onThemeChange,
  channelFilter,
  onChannelChange,
  onClearFilters
}) => {
  const hasActiveFilters = searchQuery || statusFilter || sentimentFilter || themeFilter || channelFilter;

  return (
    <div className="loop-card p-4 sm:p-5 flex flex-col gap-3.5">
      <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-200">
        <Filter className="w-4 h-4 text-neutral-900" />
        <span className="font-heading font-bold text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
          Filter & Search Intelligence
        </span>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-xs py-1"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-mono-numbers font-semibold uppercase tracking-wider text-neutral-500 mb-1 block">
            Search Text
          </label>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <FilterSelect
          label="Sentiment"
          value={sentimentFilter}
          onChange={onSentimentChange}
          options={[
            { label: 'All Sentiments', value: '' },
            { label: 'Positive', value: 'Positive' },
            { label: 'Negative', value: 'Negative' },
            { label: 'Neutral', value: 'Neutral' }
          ]}
        />

        <FilterSelect
          label="Theme"
          value={themeFilter}
          onChange={onThemeChange}
          options={[
            { label: 'All Themes', value: '' },
            { label: 'UX Performance', value: 'UX Performance' },
            { label: 'Billing & Pricing', value: 'Billing & Pricing' },
            { label: 'Integration Request', value: 'Integration Request' },
            { label: 'Mobile Responsiveness', value: 'Mobile Responsiveness' },
            { label: 'Security & Auth', value: 'Security & Auth' }
          ]}
        />

        <FilterSelect
          label="Channel"
          value={channelFilter}
          onChange={onChannelChange}
          options={[
            { label: 'All Channels', value: '' },
            { label: 'Zendesk', value: 'Zendesk' },
            { label: 'Intercom', value: 'Intercom' },
            { label: 'App Store', value: 'App Store' },
            { label: 'Discourse', value: 'Discourse' },
            { label: 'Email', value: 'Email' },
            { label: 'CSV Import', value: 'CSV Import' }
          ]}
        />
      </div>
    </div>
  );
};
