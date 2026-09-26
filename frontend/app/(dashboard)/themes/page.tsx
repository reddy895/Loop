'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { SentimentBadge, ThemeBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { ChartContainer, ThemeTrendLineChart } from '@/components/charts/FeedbackCharts';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { mockThemeTrendLineData, mockThemeSummaries as defaultSummaries } from '@/lib/mockData';
import { FeedbackTheme, ThemeSummary } from '@/types';
import {
  Quote,
  ArrowRight,
  FileSpreadsheet,
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

const zeroThemeTrendLineData = [
  { week: 'Wk 1', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 2', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 3', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 4', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 }
];

export default function ThemeClusteringPage() {
  const { isRetrieved, feedbackList, themeSummaries, openRetrieveModal } = useFeedbackContext();
  const [expandedThemeIds, setExpandedThemeIds] = useState<Record<string, boolean>>({
    'theme-1': true // First theme expanded by default
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [trendFilter, setTrendFilter] = useState<'all' | 'up' | 'down' | 'stable'>('all');

  const summariesToUse: ThemeSummary[] = isRetrieved && themeSummaries.length > 0
    ? themeSummaries
    : defaultSummaries.map((s) => ({
        ...s,
        count: 0,
        sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 },
        topQuotes: []
      }));

  const toggleExpand = (id: string) => {
    setExpandedThemeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    summariesToUse.forEach((s) => (allExpanded[s.id] = true));
    setExpandedThemeIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedThemeIds({});
  };

  const filteredThemes = summariesToUse.filter((thm) => {
    const matchesSearch =
      searchQuery === '' ||
      thm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thm.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTrend = true;
    if (trendFilter === 'up') matchesTrend = thm.trendChange.includes('+');
    else if (trendFilter === 'down') matchesTrend = thm.trendChange.includes('-');
    else if (trendFilter === 'stable') matchesTrend = thm.trendChange.toLowerCase().includes('stable') || thm.trendChange.includes('0%');

    return matchesSearch && matchesTrend;
  });

  const trendData = isRetrieved ? mockThemeTrendLineData : zeroThemeTrendLineData;

  // AI Root Cause Explanation generator for themes
  const getAiRootCause = (themeName: string) => {
    switch (themeName) {
      case 'UX Performance':
        return 'Vector clustering detected heavy concentration around bulk CSV downloads exceeding 5,000 items and client-side table rendering bottlenecks. Primary root cause is memory allocation in pagination components.';
      case 'Billing & Pricing':
        return 'Enterprise renewals highlight a perceived opacity during invoice audits and request for custom executive spend breakdown widgets.';
      case 'Integration Request':
        return 'Strong demand for bi-directional Jira Cloud sync and Salesforce CRM customer telemetry connectors to eliminate manual data entry.';
      case 'Mobile Responsiveness':
        return 'Mobile viewport users report navigation menu lag and filtering sheet overflow on older iPad and iOS 18 viewports.';
      case 'Security & Auth':
        return 'Enterprise InfoSec teams request SAML 2.0 SCIM automated role de-provisioning and IP allowlisting.';
      default:
        return 'AI semantic clustering detected consistent terminology patterns across incoming customer tickets.';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neutral-900 text-white font-mono-numbers">
              AI Semantic Clustering
            </span>
            <span className="text-xs font-mono-numbers text-neutral-500">
              {summariesToUse.length} Theme Clusters Identified
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Themes & Topic Clustering
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Explore AI-extracted theme clusters, sentiment distributions, customer quotes, and strategic recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRetrieved && (
            <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
              Retrieve CSV
            </Button>
          )}

          {isRetrieved && (
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="secondary" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 0 State Alert */}
      {!isRetrieved && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex items-center justify-between gap-3 font-sans animate-in fade-in">
          <div className="flex items-center gap-3">
            <DownloadCloud className="w-5 h-5 text-neutral-900" />
            <div>
              <p className="text-xs font-bold text-neutral-900">Themes Initialized at 0 (New User Session)</p>
              <p className="text-xs text-neutral-600 mt-0.5">Retrieve a CSV dataset to trigger automated theme vector clustering and quotes extraction.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
            Retrieve CSV Dataset
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="loop-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search theme clusters or descriptions..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">Trend:</span>
          {(['all', 'up', 'down', 'stable'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTrendFilter(t)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                trendFilter === t
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Theme Intelligence Cards List */}
      <div className="space-y-4">
        {filteredThemes.map((thm) => {
          const isExpanded = !!expandedThemeIds[thm.id];
          const totalBreakdown =
            (thm.sentimentBreakdown.positive || 0) +
            (thm.sentimentBreakdown.negative || 0) +
            (thm.sentimentBreakdown.neutral || 0) || 1;

          const posPct = Math.round(((thm.sentimentBreakdown.positive || 0) / totalBreakdown) * 100);
          const negPct = Math.round(((thm.sentimentBreakdown.negative || 0) / totalBreakdown) * 100);
          const neuPct = Math.round(((thm.sentimentBreakdown.neutral || 0) / totalBreakdown) * 100);

          const associatedQuotes = isRetrieved
            ? feedbackList.filter((fb) => fb.theme === thm.name).slice(0, 3)
            : [];

          return (
            <div
              key={thm.id}
              className="loop-card transition-all duration-200 overflow-hidden border border-neutral-200 hover:border-neutral-300"
            >
              {/* Theme Card Header Bar (Clickable) */}
              <div
                onClick={() => toggleExpand(thm.id)}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer bg-white hover:bg-neutral-50/50 transition-colors select-none"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-base font-bold text-neutral-900">
                        {thm.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded font-mono-numbers text-[10px] font-bold bg-neutral-900 text-white">
                        {thm.count} items
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono-numbers text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center gap-1">
                        {thm.trendChange.includes('+') ? (
                          <TrendingUp className="w-3 h-3 text-neutral-900" />
                        ) : thm.trendChange.includes('-') ? (
                          <TrendingDown className="w-3 h-3 text-neutral-900" />
                        ) : (
                          <Minus className="w-3 h-3 text-neutral-500" />
                        )}
                        {isRetrieved ? thm.trendChange : '0% baseline'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 font-sans mt-0.5 line-clamp-1">
                      {thm.description}
                    </p>
                  </div>
                </div>

                {/* Sentiment Distribution Visual Bar & Expand Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Controlled Analytics Color Bar */}
                  <div className="w-40 sm:w-52 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono-numbers text-neutral-500 font-bold">
                      <span>{posPct}% Pos</span>
                      <span>{negPct}% Neg</span>
                      <span>{neuPct}% Neu</span>
                    </div>

                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden flex">
                      <div style={{ width: `${posPct}%` }} className="bg-[#10B981] h-full" title={`Positive: ${posPct}%`} />
                      <div style={{ width: `${neuPct}%` }} className="bg-[#F59E0B] h-full" title={`Neutral: ${neuPct}%`} />
                      <div style={{ width: `${negPct}%` }} className="bg-[#EF4444] h-full" title={`Negative: ${negPct}%`} />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(thm.id);
                    }}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
                    aria-label="Toggle theme details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Intelligence Drawer Section */}
              {isExpanded && (
                <div className="p-5 border-t border-neutral-200 bg-neutral-50/40 space-y-5 animate-in fade-in duration-150">
                  {/* AI Generated Root Cause Explanation */}
                  <div className="loop-card p-4 bg-white space-y-2 border-l-4 border-l-black">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-neutral-900" />
                      <h4 className="text-xs font-bold font-heading text-neutral-900 uppercase tracking-wider">
                        AI Cluster Synthesis & Root Cause
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-700 font-sans leading-relaxed">
                      {getAiRootCause(thm.name)}
                    </p>
                  </div>

                  {/* Customer Voice & Quotes */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold font-heading text-neutral-900 flex items-center gap-2">
                      <Quote className="w-3.5 h-3.5 text-neutral-700" />
                      Representative Customer Feedback
                    </h4>

                    {associatedQuotes.length === 0 ? (
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center text-xs text-neutral-400">
                        {isRetrieved ? 'No specific quotes logged under this theme.' : 'Retrieve a CSV dataset to extract customer quotes.'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {associatedQuotes.map((q) => (
                          <div
                            key={q.id}
                            className="bg-white p-3.5 rounded-xl border border-neutral-200 flex flex-col justify-between space-y-3"
                          >
                            <p className="text-xs text-neutral-800 italic leading-relaxed">
                              &ldquo;{q.feedback}&rdquo;
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono-numbers pt-2 border-t border-neutral-100">
                              <span className="font-bold text-neutral-900">{q.customerName}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-neutral-500">{q.channel}</span>
                                <SentimentBadge sentiment={q.sentiment} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] font-mono-numbers text-neutral-500">
                      Cluster vector distance: 0.18 • High semantic coherence
                    </span>

                    <div className="flex items-center gap-2">
                      <Link href={`/inbox?theme=${encodeURIComponent(thm.name)}`}>
                        <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                          View in Inbox
                        </Button>
                      </Link>

                      <Link href={`/ask-loop?query=${encodeURIComponent(`What is customer feedback regarding ${thm.name}?`)}`}>
                        <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                          Ask LOOP About This Theme
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Historical Theme Trend Chart */}
      <div className="pt-2">
        <ChartContainer
          title="Theme Volume Trajectory (Weekly)"
          description={isRetrieved ? "Trajectory of feedback cluster volume over 4 consecutive weekly sprints" : "Weekly theme volume trajectory (0 baseline)"}
        >
          <ThemeTrendLineChart data={trendData} />
        </ChartContainer>
      </div>
    </div>
  );
}
