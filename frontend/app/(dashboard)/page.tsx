'use client';

import React from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import {
  ChartContainer,
  FeedbackVolumeChart,
  SentimentPieChart,
  TopThemesBarChart
} from '@/components/charts/FeedbackCharts';
import {
  mockFeedbackList,
  mockVolumeData,
  mockSentimentPieData,
  mockTopThemesBarData
} from '@/lib/mockData';
import {
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Clock,
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const recentFeedback = mockFeedbackList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#6D8196] text-[#FFFFE3] border border-[#7E93A9]">
              Enterprise Workspace
            </span>
            <span className="text-xs font-mono-numbers text-[#4A4A4A]/70">
              Updated 2 mins ago
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Customer Feedback Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
            Real-time synthesis of customer sentiment across Zendesk, Intercom, App Store, and survey channels.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/inbox?modal=upload">
            <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />}>
              Upload CSV
            </Button>
          </Link>
          <Link href="/ask-loop">
            <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
              Ask LOOP AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Feedback"
          value="1,482"
          change="+14% vs last month"
          trend="up"
          description="Across 6 active channels"
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <StatsCard
          title="Negative %"
          value="24.2%"
          change="-3.1% vs last week"
          trend="up"
          description="Mainly UX & Billing"
          icon={<TrendingDown className="w-5 h-5 text-red-700" />}
        />
        <StatsCard
          title="Positive %"
          value="61.8%"
          change="+5.4% vs last week"
          trend="up"
          description="High Ask LOOP satisfaction"
          icon={<TrendingUp className="w-5 h-5 text-green-700" />}
        />
        <StatsCard
          title="New This Week"
          value="342"
          change="+18% volume influx"
          trend="up"
          description="32 pending review"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Feedback Volume Over Time"
            description="Daily influx of customer feedback tickets over the past 7 days"
          >
            <FeedbackVolumeChart data={mockVolumeData} />
          </ChartContainer>
        </div>

        <div>
          <ChartContainer
            title="Sentiment Breakdown"
            description="Proportional share of positive, negative, and neutral feedback"
          >
            <SentimentPieChart data={mockSentimentPieData} />
          </ChartContainer>
        </div>
      </div>

      {/* Secondary Chart & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ChartContainer
            title="Top Feedback Themes"
            description="Volume of feedback tickets tagged by topic cluster"
          >
            <TopThemesBarChart data={mockTopThemesBarData} />
          </ChartContainer>
        </div>

        {/* Recent Feedback Preview Table */}
        <div className="lg:col-span-2">
          <Card variant="panel" className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Customer Feedback</CardTitle>
                <CardDescription>Latest incoming items across integrated channels</CardDescription>
              </div>
              <Link href="/inbox">
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Inbox
                </Button>
              </Link>
            </CardHeader>

            <div className="flex-1 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Feedback Snippet</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Theme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold whitespace-nowrap">{item.customerName}</TableCell>
                      <TableCell className="font-mono-numbers text-xs whitespace-nowrap">{item.channel}</TableCell>
                      <TableCell className="max-w-[180px] sm:max-w-[240px] lg:max-w-[320px] truncate text-xs">{item.feedback}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <SentimentBadge sentiment={item.sentiment} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <ThemeBadge theme={item.theme} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
