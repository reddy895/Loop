'use client';

import React, { useState } from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
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
import { useFeedbackContext } from '@/context/FeedbackContext';
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Download,
  FileSpreadsheet,
  DownloadCloud,
  Layers
} from 'lucide-react';

export default function AnalyticsPage() {
  const {
    isRetrieved,
    stats,
    channelSentimentData,
    weeklySentimentTrend,
    themeComparisonData,
    sentimentDistributionData,
    channelPerformanceList,
    openRetrieveModal
  } = useFeedbackContext();

  const [timeRange, setTimeRange] = useState('30d');
  const [channel, setChannel] = useState('');
  const [sentiment, setSentiment] = useState('');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Analytics & Deep Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Multi-channel sentiment distribution, 6-week velocity trends, and month-over-month theme comparison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRetrieved && (
            <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
              Retrieve CSV
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export Analytics PDF
          </Button>
        </div>
      </div>

      {!isRetrieved && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex items-center justify-between gap-3 font-sans animate-in fade-in">
          <div className="flex items-center gap-3">
            <DownloadCloud className="w-5 h-5 text-neutral-900" />
            <div>
              <p className="text-xs font-bold text-neutral-900">Analytics Initialized at 0 (New User Session)</p>
              <p className="text-xs text-neutral-600 mt-0.5">Retrieve a CSV dataset to generate multi-channel analytics and CSAT intelligence matrices.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
            Retrieve CSV Dataset
          </Button>
        </div>
      )}

      {/* Analytics Filter Bar */}
      <div className="loop-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
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
          value={isRetrieved ? (stats.csat || "8.4 / 10") : "0.0 / 10"}
          change={isRetrieved ? "+0.6 score improvement" : "0 baseline"}
          trend={isRetrieved ? "up" : "neutral"}
          description={isRetrieved ? `Based on ${stats.totalFeedback.toLocaleString()} reviews` : "No CSV data retrieved"}
          icon={<Zap className="w-5 h-5 text-neutral-900" />}
        />
        <StatsCard
          title="Net Sentiment Score"
          value={isRetrieved ? (stats.nps || "+48.0 NPS") : "0.0 NPS"}
          change={isRetrieved ? "+6.2 vs last month" : "0 baseline"}
          trend={isRetrieved ? "up" : "neutral"}
          description={isRetrieved ? "% Positive minus % Negative" : "No CSV data retrieved"}
          icon={<TrendingUp className="w-5 h-5 text-neutral-900" />}
        />
        <StatsCard
          title="AI Tagging Precision"
          value={isRetrieved ? "96.4%" : "0.0%"}
          change={isRetrieved ? "+1.8% accuracy boost" : "0 baseline"}
          trend={isRetrieved ? "up" : "neutral"}
          description={isRetrieved ? "Automated vector classification" : "No CSV data retrieved"}
          icon={<ShieldCheck className="w-5 h-5 text-neutral-900" />}
        />
        <StatsCard
          title="SLA Resolution Velocity"
          value={isRetrieved ? "3.2 hrs avg" : "0 hrs avg"}
          change={isRetrieved ? "-45 mins faster response" : "0 baseline"}
          trend={isRetrieved ? "up" : "neutral"}
          description={isRetrieved ? "78.5% ticket resolution rate" : "No CSV data retrieved"}
          icon={<Clock className="w-5 h-5 text-neutral-900" />}
        />
      </div>

      {/* Section 1: Channel Breakdown & Sentiment Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Sentiment Breakdown by Channel"
          description={isRetrieved ? "Proportional split of positive, neutral, and negative feedback tickets per source" : "Channel breakdown (0 baseline)"}
          height={320}
        >
          <ChannelSentimentBarChart data={channelSentimentData} />
        </ChartContainer>

        <ChartContainer
          title="6-Week Sentiment Trend Velocity"
          description={isRetrieved ? "Weekly tracking of positive vs negative sentiment percentage trajectory" : "Sentiment velocity (0 baseline)"}
          height={320}
        >
          <SentimentTrendLineChart data={weeklySentimentTrend} />
        </ChartContainer>
      </div>

      {/* Section 2: Theme Comparison & Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Month-over-Month Theme Volume (August vs July)"
          description={isRetrieved ? "Comparative analysis of theme ticket counts across current and previous months" : "Theme comparison (0 baseline)"}
          height={320}
        >
          <ThemeComparisonBarChart data={themeComparisonData} />
        </ChartContainer>

        <ChartContainer
          title="Sentiment Score Spread Distribution (0–100)"
          description={isRetrieved ? "Statistical distribution of extracted sentiment scores across all feedback items" : "Score distribution (0 baseline)"}
          height={320}
        >
          <SentimentDistributionChart data={sentimentDistributionData} />
        </ChartContainer>
      </div>

      {/* Section 3: Channel Performance Matrix Table */}
      <div className="loop-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-900" />
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Channel Performance & CSAT Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-neutral-900 text-white font-bold uppercase tracking-wider">
            {isRetrieved ? "5 Active Connectors" : "0 Connectors Active"}
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
            {channelPerformanceList.map((ch, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold text-xs whitespace-nowrap text-neutral-900">
                  {ch.channel}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs font-semibold whitespace-nowrap text-neutral-800">
                  {ch.total}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-neutral-900 font-bold whitespace-nowrap">
                  {ch.positivePct}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-neutral-900 font-bold whitespace-nowrap">
                  {ch.negativePct}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs font-bold text-neutral-900 whitespace-nowrap">
                  {ch.csat}
                </TableCell>
                <TableCell className="font-mono-numbers text-xs text-neutral-500 whitespace-nowrap">
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
