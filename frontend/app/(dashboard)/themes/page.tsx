'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { ChartContainer, ThemeTrendLineChart } from '@/components/charts/FeedbackCharts';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { mockThemeTrendLineData, mockThemeSummaries as defaultSummaries } from '@/lib/mockData';
import { FeedbackTheme, ThemeSummary } from '@/types';
import { TrendingUp, MessageSquare, Quote, Layers, ArrowRight, FileSpreadsheet, DownloadCloud, Inbox } from 'lucide-react';

const zeroThemeTrendLineData = [
  { week: 'Wk 1', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 2', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 3', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 },
  { week: 'Wk 4', UX: 0, Integrations: 0, Billing: 0, Mobile: 0 }
];

export default function ThemeDetailsPage() {
  const { isRetrieved, feedbackList, themeSummaries, openRetrieveModal } = useFeedbackContext();
  const [selectedTheme, setSelectedTheme] = useState<FeedbackTheme>('UX Performance');

  const summariesToUse = isRetrieved && themeSummaries.length > 0 ? themeSummaries : defaultSummaries.map(s => ({
    ...s,
    count: 0,
    sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 },
    topQuotes: []
  }));

  const activeThemeSummary = summariesToUse.find((t) => t.name === selectedTheme) || summariesToUse[0];
  const associatedFeedback = isRetrieved ? feedbackList.filter((item) => item.theme === selectedTheme) : [];
  const trendData = isRetrieved ? mockThemeTrendLineData : zeroThemeTrendLineData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="skeuo-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Themes & Topic Clustering
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
            Explore AI-extracted theme clusters, feedback volume distribution, and associated quotes.
          </p>
        </div>

        {!isRetrieved && (
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
            Retrieve CSV
          </Button>
        )}
      </div>

      {!isRetrieved && (
        <div className="skeuo-panel bg-[#6D8196]/10 p-4 border-l-4 border-l-[#6D8196] flex items-center justify-between gap-3 font-sans animate-in fade-in">
          <div className="flex items-center gap-3">
            <DownloadCloud className="w-5 h-5 text-[#6D8196]" />
            <div>
              <p className="text-xs font-bold text-[#4A4A4A]">Themes Initialized at 0 (New User Session)</p>
              <p className="text-xs text-[#4A4A4A]/80">Retrieve a CSV dataset to trigger automated theme vector clustering and quotes extraction.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
            Retrieve CSV Dataset
          </Button>
        </div>
      )}

      {/* Theme Cards Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {summariesToUse.map((thm) => {
          const isSelected = thm.name === selectedTheme;
          return (
            <div
              key={thm.id}
              onClick={() => setSelectedTheme(thm.name)}
              className={`cursor-pointer transition-all duration-150 rounded-lg p-4 select-none ${
                isSelected
                  ? 'skeuo-panel border-2 border-[#6D8196] shadow-lg scale-[1.02]'
                  : 'skeuo-card-cream hover:bg-[#CBCBCB]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#4A4A4A] truncate">
                  {thm.name}
                </span>
                <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-[#6D8196] text-[#FFFFE3]">
                  {thm.count}
                </span>
              </div>
              <p className="text-[11px] text-[#4A4A4A]/70 line-clamp-2 mb-3">
                {thm.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono-numbers text-[#6D8196]">
                <span>{isRetrieved ? thm.trendChange : '0% trend'}</span>
                <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Details Header & Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title={`Trend Velocity: ${activeThemeSummary.name}`}
            description={isRetrieved ? "Historical theme comment volume breakdown across weekly cohorts" : "Theme comment volume (0 baseline)"}
            height={280}
          >
            <ThemeTrendLineChart data={trendData} />
          </ChartContainer>
        </div>

        {/* Selected Theme Summary Card */}
        <div>
          <Card variant="panel" className="h-full flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{activeThemeSummary.name}</CardTitle>
                <ThemeBadge theme={activeThemeSummary.name} />
              </div>
              <CardDescription>{activeThemeSummary.description}</CardDescription>
            </CardHeader>

            <div className="space-y-3 font-sans text-xs my-2">
              <div className="skeuo-inset p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#4A4A4A]">Total Tickets Tagged:</span>
                  <span className="font-mono-numbers font-bold text-[#6D8196]">{activeThemeSummary.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#4A4A4A]">Positive Ratio:</span>
                  <span className="font-mono-numbers text-green-700 font-bold">{activeThemeSummary.sentimentBreakdown.positive}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#4A4A4A]">Negative Ratio:</span>
                  <span className="font-mono-numbers text-red-700 font-bold">{activeThemeSummary.sentimentBreakdown.negative}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-xs text-[#4A4A4A] mb-1.5 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5 text-[#6D8196]" />
                  Extracted Customer Quotes:
                </h4>
                {activeThemeSummary.topQuotes.length === 0 ? (
                  <p className="text-[11px] text-[#4A4A4A]/60 italic">No quotes extracted. Click "Retrieve CSV" to populate.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {activeThemeSummary.topQuotes.map((q, i) => (
                      <li key={i} className="text-[11px] text-[#4A4A4A]/80 italic border-l-2 border-l-[#6D8196] pl-2 py-0.5">
                        "{q}"
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Associated Customer Feedback Table */}
      <div className="skeuo-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#4A4A4A]/10">
          <h3 className="font-heading font-bold text-base text-[#4A4A4A]">
            Customer Feedback Tagged as "{selectedTheme}"
          </h3>
          <span className="text-xs font-mono-numbers text-[#6D8196] font-bold">
            {associatedFeedback.length} Records
          </span>
        </div>

        {!isRetrieved || associatedFeedback.length === 0 ? (
          <div className="skeuo-inset p-8 flex flex-col items-center justify-center text-center my-2 font-sans">
            <Inbox className="w-8 h-8 text-[#4A4A4A]/50 mb-2" />
            <h4 className="font-heading text-sm font-bold text-[#4A4A4A]">
              No Theme Records Found
            </h4>
            <p className="text-xs text-[#4A4A4A]/70 max-w-sm mt-1 mb-3">
              Website is initialized at 0. Click "Retrieve CSV" to fetch dataset and populate theme records.
            </p>
            <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
              Retrieve CSV Dataset
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Feedback Snippet</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associatedFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-xs whitespace-nowrap">{item.customerName}</TableCell>
                  <TableCell className="font-mono-numbers text-xs whitespace-nowrap">{item.channel}</TableCell>
                  <TableCell className="max-w-[320px] text-xs font-sans truncate">{item.feedback}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <SentimentBadge sentiment={item.sentiment} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="font-mono-numbers text-xs whitespace-nowrap">{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
