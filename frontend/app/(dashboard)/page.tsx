'use client';

import React from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, ThemeBadge } from '@/components/ui/Badges';
import {
  ChartContainer,
  FeedbackVolumeChart,
  SentimentPieChart,
  TopThemesBarChart
} from '@/components/charts/FeedbackCharts';
import { useFeedbackContext } from '@/context/FeedbackContext';
import {
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  RotateCcw,
  DownloadCloud,
  CheckCircle2,
  Inbox
} from 'lucide-react';

export default function DashboardPage() {
  const {
    isRetrieved,
    datasetName,
    feedbackList,
    stats,
    volumeData,
    sentimentPieData,
    topThemesBarData,
    openRetrieveModal,
    resetToZero,
    lastRetrievedTime
  } = useFeedbackContext();


  const recentFeedback = feedbackList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#6D8196] text-[#FFFFE3] border border-[#7E93A9]">
              Enterprise Workspace
            </span>
            {isRetrieved && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#E2ECD8] text-[#2D4E2A] border border-green-600">
                Active Source: {datasetName}
              </span>
            )}
            <span className="text-xs font-mono-numbers text-[#4A4A4A]/70">
              {isRetrieved ? `Retrieved ${lastRetrievedTime || 'just now'}` : 'Initialized at 0 (New User)'}
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
          <Button
            variant="primary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={openRetrieveModal}
          >
            Retrieve CSV
          </Button>

          {isRetrieved && (
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={resetToZero}
            >
              Reset to 0
            </Button>
          )}

          <Link href="/ask-loop">
            <Button variant="outline" size="sm" icon={<Sparkles className="w-4 h-4 text-[#6D8196]" />}>
              Ask LOOP AI
            </Button>
          </Link>
        </div>
      </div>

      {/* New User Alert Banner if 0 state */}
      {!isRetrieved && (
        <div className="skeuo-panel bg-[#6D8196]/10 p-4 border-l-4 border-l-[#6D8196] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#6D8196] text-[#FFFFE3] shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#4A4A4A]">
                Website Initialized to 0 (New User Session)
              </h4>
              <p className="text-xs text-[#4A4A4A]/80 font-sans mt-0.5">
                Dashboards currently display zero feedback records. Click <strong>Retrieve CSV</strong> to fetch customer feedback data and generate all dashboards!
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={openRetrieveModal}
            className="shrink-0"
          >
            Retrieve CSV Data
          </Button>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Feedback"
          value={stats.totalFeedback.toLocaleString()}
          change={isRetrieved ? '+14% vs last month' : '0% initial state'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'Across 6 active channels' : 'No records retrieved yet'}
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <StatsCard
          title="Negative %"
          value={stats.negativePct}
          change={isRetrieved ? '-3.1% vs last week' : '0% baseline'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'Mainly UX & Billing' : 'Awaiting CSV retrieval'}
          icon={<TrendingDown className="w-5 h-5 text-red-700" />}
        />
        <StatsCard
          title="Positive %"
          value={stats.positivePct}
          change={isRetrieved ? '+5.4% vs last week' : '0% baseline'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'High Ask LOOP satisfaction' : 'Awaiting CSV retrieval'}
          icon={<TrendingUp className="w-5 h-5 text-green-700" />}
        />
        <StatsCard
          title="New This Week"
          value={stats.newThisWeek.toLocaleString()}
          change={isRetrieved ? '+18% volume influx' : '0 records'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? '32 pending review' : 'Click Retrieve CSV to populate'}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Feedback Volume Over Time"
            description={isRetrieved ? "Daily influx of customer feedback tickets over the past 7 days" : "Daily feedback volume (0 baseline)"}
          >
            <FeedbackVolumeChart data={volumeData} />
          </ChartContainer>
        </div>

        <div>
          <ChartContainer
            title="Sentiment Breakdown"
            description={isRetrieved ? "Proportional share of positive, negative, and neutral feedback" : "Sentiment distribution (0 baseline)"}
          >
            <SentimentPieChart data={sentimentPieData} />
          </ChartContainer>
        </div>
      </div>

      {/* Secondary Chart & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ChartContainer
            title="Top Feedback Themes"
            description={isRetrieved ? "Volume of feedback tickets tagged by topic cluster" : "Theme cluster volume (0 baseline)"}
          >
            <TopThemesBarChart data={topThemesBarData} />
          </ChartContainer>
        </div>

        {/* Recent Feedback Preview Table */}
        <div className="lg:col-span-2">
          <Card variant="panel" className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Customer Feedback</CardTitle>
                <CardDescription>
                  {isRetrieved ? "Latest incoming items across integrated channels" : "0 customer records retrieved"}
                </CardDescription>
              </div>
              <Link href="/inbox">
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Inbox
                </Button>
              </Link>
            </CardHeader>

            <div className="flex-1 overflow-x-auto min-h-[220px] flex flex-col justify-center">
              {!isRetrieved || recentFeedback.length === 0 ? (
                <div className="skeuo-inset p-8 flex flex-col items-center justify-center text-center my-2">
                  <div className="p-3 bg-[#CBCBCB] rounded-full text-[#4A4A4A] border border-[#A0A0A0] shadow-inner mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#4A4A4A]">
                    No Customer Feedback Records
                  </h4>
                  <p className="text-xs text-[#4A4A4A]/70 font-sans max-w-sm mt-1 mb-4">
                    Website is initialized at 0 for new user. Click "Retrieve CSV" below to fetch customer feedback data and populate recent tickets.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FileSpreadsheet className="w-4 h-4" />}
                    onClick={openRetrieveModal}
                  >
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
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
