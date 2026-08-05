'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { ChartContainer, ThemeTrendLineChart } from '@/components/charts/FeedbackCharts';
import { mockThemeSummaries, mockFeedbackList, mockThemeTrendLineData } from '@/lib/mockData';
import { FeedbackTheme, ThemeSummary } from '@/types';
import { TrendingUp, MessageSquare, Quote, Layers, ArrowRight } from 'lucide-react';

export default function ThemeDetailsPage() {
  const [selectedTheme, setSelectedTheme] = useState<FeedbackTheme>('UX Performance');

  const activeThemeSummary = mockThemeSummaries.find((t) => t.name === selectedTheme) || mockThemeSummaries[0];
  const associatedFeedback = mockFeedbackList.filter((item) => item.theme === selectedTheme);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="skeuo-panel p-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
          Themes & Topic Clustering
        </h1>
        <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
          Explore AI-extracted theme clusters, feedback volume distribution, and associated quotes.
        </p>
      </div>

      {/* Theme Cards Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {mockThemeSummaries.map((thm) => {
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
                <span>{thm.trendChange}</span>
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
            description="Historical theme comment volume breakdown across weekly cohorts"
            height={280}
          >
            <ThemeTrendLineChart data={mockThemeTrendLineData} />
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]/70 block mb-1">
                  Representative Customer Quotes:
                </span>
                <div className="space-y-1.5">
                  {activeThemeSummary.topQuotes.map((q, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#FFFFE3] border border-[#CBCBCB] text-[11px] font-sans italic text-[#4A4A4A]/90 flex gap-2">
                      <Quote className="w-3.5 h-3.5 text-[#6D8196] shrink-0 mt-0.5" />
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Associated Customer Feedback Table */}
      <div className="skeuo-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#4A4A4A]/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#6D8196]" />
            <h3 className="font-heading font-bold text-base text-[#4A4A4A]">
              Feedback Items Tagged Under "{selectedTheme}" ({associatedFeedback.length})
            </h3>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Feedback Content</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {associatedFeedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-xs">{item.customerName}</TableCell>
                <TableCell className="font-mono-numbers text-xs">{item.channel}</TableCell>
                <TableCell className="max-w-md text-xs font-sans">{item.feedback}</TableCell>
                <TableCell>
                  <SentimentBadge sentiment={item.sentiment} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="font-mono-numbers text-xs">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
