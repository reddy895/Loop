'use client';

import React, { useState } from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FilterSelect } from '@/components/ui/SearchFilterBars';
import { Button } from '@/components/ui/Button';
import { ChartContainer } from '@/components/charts/FeedbackCharts';
import {
  ChannelSentimentBarChart,
  SentimentTrendLineChart,
  ThemeComparisonBarChart,
  SentimentDistributionChart
} from '@/components/charts/AnalyticsCharts';
import {
  mockChannelSentimentData,
  mockWeeklySentimentTrend,
  mockThemeComparisonData,
  mockSentimentDistributionData,
  mockChannelPerformanceList
} from '@/lib/mockData';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Download,
  CheckCircle2,
  Layers,
  Clock
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [channel, setChannel] = useState('');
  const [sentiment, setSentiment] = useState('');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Analytics & Deep Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
            Multi-channel sentiment distribution, 6-week velocity trends, and month-over-month theme comparison.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
          Export Analytics PDF
        </Button>
      </div>

      {/* Analytics Filter Bar */}
      <div className="skeuo-panel p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
        <FilterSelect
          label="Time Window"
          value={timeRange}
          onChange={setTimeRange}
          options={[
            { label: 'Past 7 Days', value: '7d' },
            { label: 'Past 30 Days', value: '30d' },
            { label: 'Past Quarter (Q3)', value: 'q3' },
            { label: 'Year to Date (2026)', value: 'ytd' }
          ]}
        />

        <FilterSelect
          label="Channel Segment"
          value={channel}
          onChange={setChannel}
          options={[
            { label: 'All Integrated Channels', value: '' },
            { label: 'Zendesk Support', value: 'Zendesk' },
            { label: 'Intercom Live Chat', value: 'Intercom' },
            { label: 'App Store Reviews', value: 'App Store' }
          ]}
        />

        <FilterSelect
          label="Sentiment Focus"
          value={sentiment}
          onChange={setSentiment}
          options={[
            { label: 'All Sentiments', value: '' },
            { label: 'Positive Share', value: 'Positive' },
            { label: 'Negative Share', value: 'Negative' }
          ]}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTimeRange('30d');
            setChannel('');
            setSentiment('');
          }}
          className="h-[34px]"
        >
          Reset Filters
        </Button>
      </div>

      {/* Unique KPI Stats Row for Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Customer CSAT Index"
          value="8.4 / 10"
          change="+0.6 score improvement"
          trend="up"
          description="Based on 1,482 reviews"
          icon={<Zap className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="Net Sentiment Score"
          value="+48.0 NPS"
          change="+6.2 vs last month"
          trend="up"
          description="% Positive minus % Negative"
          icon={<TrendingUp className="w-5 h-5 text-green-700" />}
        />
        <StatsCard
          title="AI Tagging Precision"
          value="96.4%"
          change="+1.8% accuracy boost"
          trend="up"
          description="Automated vector classification"
          icon={<ShieldCheck className="w-5 h-5 text-blue-700" />}
        />
        <StatsCard
          title="SLA Resolution Velocity"
          value="3.2 hrs avg"
          change="-45 mins faster response"
          trend="up"
          description="78.5% ticket resolution rate"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Section 1: Channel Breakdown & Sentiment Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Sentiment Breakdown by Channel"
          description="Proportional split of positive, neutral, and negative feedback tickets per source"
          height={320}
        >
          <ChannelSentimentBarChart data={mockChannelSentimentData} />
        </ChartContainer>

        <ChartContainer
          title="6-Week Sentiment Trend Velocity"
          description="Weekly tracking of positive vs negative sentiment percentage trajectory"
          height={320}
        >
          <SentimentTrendLineChart data={mockWeeklySentimentTrend} />
        </ChartContainer>
      </div>

      {/* Section 2: Theme Comparison & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Month-over-Month Theme Volume (August vs July)"
          description="Comparative analysis of theme ticket counts across current and previous months"
          height={320}
        >
          <ThemeComparisonBarChart data={mockThemeComparisonData} />
        </ChartContainer>

        <ChartContainer
          title="Sentiment Score Spread Distribution (0–100)"
          description="Statistical distribution of extracted sentiment scores across all feedback items"
          height={320}
        >
          <SentimentDistributionChart data={mockSentimentDistributionData} />
        </ChartContainer>
      </div>

      {/* Section 3: Channel Performance Matrix Table */}
      <div className="skeuo-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#4A4A4A]/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6D8196]" />
            <h3 className="font-heading font-bold text-base text-[#4A4A4A]">
              Channel Performance & CSAT Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-[#6D8196] text-[#FFFFE3]">
            5 Active Connectors
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration Channel</TableHead>
              <TableHead>Total Tickets</TableHead>
              <TableHead>Positive %</TableHead>
              <TableHead>Negative %</TableHead>
              <TableHead>Channel CSAT</TableHead>
              <TableHead>Avg Resolution Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockChannelPerformanceList.map((ch, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold text-xs whitespace-nowrap">
                  {ch.channel}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs font-semibold whitespace-nowrap">
                  {ch.total}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-green-700 font-bold whitespace-nowrap">
                  {ch.positivePct}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-red-700 font-bold whitespace-nowrap">
                  {ch.negativePct}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs font-bold text-[#6D8196] whitespace-nowrap">
                  {ch.csat}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-[#4A4A4A]/80 whitespace-nowrap">
                  {ch.avgRes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
