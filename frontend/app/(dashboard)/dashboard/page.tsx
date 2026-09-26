'use client';

import React, { useState } from 'react';
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
import { FeedbackDetailDrawer } from '@/components/ui/FeedbackDetailDrawer';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { FeedbackItem } from '@/types';
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
  Inbox,
  Cpu,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Eye
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
    reportsList,
    themeSummaries,
    openRetrieveModal,
    resetToZero,
    lastRetrievedTime
  } = useFeedbackContext();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const recentFeedback = feedbackList.slice(0, 5);

  const handleOpenDetail = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setIsDrawerOpen(true);
  };

  // Recent system activity events
  const systemActivity = [
    {
      id: 'act-1',
      title: 'AI Classification Engine',
      desc: isRetrieved ? `Processed and classified ${stats.totalFeedback} customer records` : 'Engine standby, awaiting dataset ingestion',
      time: isRetrieved ? '2m ago' : 'Standby',
      icon: Cpu
    },
    {
      id: 'act-2',
      title: 'Theme Vector Clustering',
      desc: isRetrieved ? `Grouped feedback into ${topThemesBarData.length} strategic clusters` : 'No active clusters',
      time: isRetrieved ? '15m ago' : 'Standby',
      icon: Layers
    },
    {
      id: 'act-3',
      title: 'RAG Knowledge Index',
      desc: isRetrieved ? 'Vector embeddings updated for Ask LOOP assistant' : 'Index empty',
      time: isRetrieved ? '1h ago' : 'Standby',
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* ============================================================== */}
      {/* TOP: Page Title, Workspace Context, Date/Filter Controls       */}
      {/* ============================================================== */}
      <div className="loop-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neutral-900 text-white font-mono-numbers">
              Enterprise Workspace
            </span>
            {isRetrieved && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-neutral-100 text-neutral-900 border border-neutral-300 font-mono-numbers">
                Active Source: {datasetName}
              </span>
            )}
            <span className="text-xs font-mono-numbers text-neutral-500">
              {isRetrieved ? `Retrieved ${lastRetrievedTime || 'just now'}` : 'Initialized at 0 (New User Session)'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Customer Feedback Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Real-time synthesis of customer sentiment across Zendesk, Intercom, App Store, and survey channels.
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateRange === range
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {range === '7d' ? 'Last 7D' : range === '30d' ? 'Last 30D' : 'All Time'}
              </button>
            ))}
          </div>

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
              title="Reset dashboard to 0 state"
            >
              Reset to 0
            </Button>
          )}

          <Link href="/ask-loop">
            <Button variant="outline" size="sm" icon={<Sparkles className="w-4 h-4 text-neutral-900" />}>
              Ask LOOP
            </Button>
          </Link>
        </div>
      </div>

      {/* New User Alert Banner if 0 state */}
      {!isRetrieved && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-white shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">
                Workspace Initialized to 0 (New User Session)
              </h4>
              <p className="text-xs text-neutral-600 font-sans mt-0.5">
                Dashboards currently display zero feedback records. Click <strong>Retrieve CSV</strong> to fetch customer feedback data and generate all dashboards.
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

      {/* ============================================================== */}
      {/* SECOND ROW: 4 Modular Intelligence KPI Cards                   */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Feedback */}
        <StatsCard
          title="Total Feedback"
          value={stats.totalFeedback.toLocaleString()}
          change={isRetrieved ? '+14% vs last cycle' : '0 records'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'Ingested across 6 channels' : 'No records retrieved yet'}
          icon={<MessageSquare className="w-5 h-5" />}
        />

        {/* Card 2: Average Sentiment */}
        <StatsCard
          title="Average Sentiment"
          value={isRetrieved ? `${stats.positivePct} Pos` : '0%'}
          change={isRetrieved ? `${stats.negativePct} Neg friction` : '0% baseline'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'Calculated via GEMINI-1.5' : 'Awaiting CSV retrieval'}
          icon={<TrendingUp className="w-5 h-5" />}
        />

        {/* Card 3: Active Themes */}
        <StatsCard
          title="Active Themes"
          value={isRetrieved ? `${topThemesBarData.length} Clusters` : '0 Clusters'}
          change={isRetrieved ? 'UX Performance #1' : '0 detected'}
          trend={isRetrieved ? 'neutral' : 'neutral'}
          description={isRetrieved ? 'Vector semantic grouping' : 'Click Retrieve CSV to populate'}
          icon={<Layers className="w-5 h-5" />}
        />

        {/* Card 4: AI Processing Status */}
        <StatsCard
          title="AI Processing"
          value={isRetrieved ? '100% Ingested' : 'Engine Ready'}
          change={isRetrieved ? '0 backlog' : 'Standby'}
          trend={isRetrieved ? 'up' : 'neutral'}
          description={isRetrieved ? 'RAG Assistant online' : 'Ready for ingestion'}
          icon={<Cpu className="w-5 h-5" />}
        />
      </div>

      {/* ============================================================== */}
      {/* MAIN: Feedback Trend, Recent Feedback Table, Theme Overview    */}
      {/* ============================================================== */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Overview Snapshot */}
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
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Customer Feedback</CardTitle>
                <CardDescription>
                  {isRetrieved ? "Latest incoming items with direct slide-over inspect" : "0 customer records retrieved"}
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
                <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 flex flex-col items-center justify-center text-center my-2">
                  <div className="p-3 bg-neutral-100 rounded-full text-neutral-900 border border-neutral-200 mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-neutral-900">
                    No Customer Feedback Records
                  </h4>
                  <p className="text-xs text-neutral-500 font-sans max-w-sm mt-1 mb-4 leading-relaxed">
                    Workspace is initialized at 0. Click "Retrieve CSV" below to fetch customer feedback data and populate recent tickets.
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
                      <TableHead>Ticket & Customer</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Feedback Snippet</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentFeedback.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => handleOpenDetail(item)}
                        className="cursor-pointer group hover:bg-neutral-50/80 transition-colors"
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-numbers text-[10px] font-bold text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">
                              {item.id}
                            </span>
                            <span className="font-semibold text-xs text-neutral-900">{item.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono-numbers text-xs whitespace-nowrap text-neutral-600">
                          {item.channel}
                        </TableCell>
                        <TableCell className="max-w-[200px] sm:max-w-[280px] truncate text-xs text-neutral-900">
                          &ldquo;{item.feedback}&rdquo;
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <SentimentBadge sentiment={item.sentiment} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <ThemeBadge theme={item.theme} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(item);
                            }}
                            className="p-1 rounded text-neutral-400 group-hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="Inspect ticket"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
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

      {/* ============================================================== */}
      {/* BOTTOM: AI Insights, Recent Reports, System Activity Stream     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Insights Synthesis */}
        <div className="loop-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  AI Intelligence Synthesis
                </h3>
              </div>
              <span className="text-[10px] font-mono-numbers font-bold text-neutral-500 uppercase">
                RAG Engine
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Primary Negative Friction
                </span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {isRetrieved
                    ? 'Data Export Timeouts (FB-9021): Enterprise accounts report latency on 5,000+ row exports in Zendesk.'
                    : 'Awaiting dataset ingestion to synthesize friction points.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Customer Delighter
                </span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {isRetrieved
                    ? 'Users express high satisfaction with Ask LOOP natural language precision and responsive UI triage.'
                    : 'Awaiting dataset ingestion to synthesize delighters.'}
                </p>
              </div>
            </div>
          </div>

          <Link href="/ask-loop" className="pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between" icon={<Sparkles className="w-3.5 h-3.5" />}>
              <span>Ask AI Research Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 2: Recent Reports */}
        <div className="loop-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  Recent VoC Reports
                </h3>
              </div>
              <Link href="/reports" className="text-xs font-bold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2 pt-1">
              {!isRetrieved || reportsList.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No executive reports generated yet.
                </div>
              ) : (
                reportsList.slice(0, 2).map((rep) => (
                  <Link
                    key={rep.id}
                    href="/reports"
                    className="block p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-neutral-900 truncate max-w-[170px]">
                        {rep.title}
                      </span>
                      <span className="text-[10px] font-mono-numbers text-neutral-500">
                        {rep.generatedDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono-numbers text-neutral-600">
                      <span>{rep.totalFeedbackAnalyzed} tickets</span>
                      <span className="font-bold text-neutral-900">NPS: +{rep.npsScore}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link href="/reports" className="pt-2">
            <Button variant="secondary" size="sm" className="w-full justify-between" icon={<FileText className="w-3.5 h-3.5" />}>
              <span>Generate New Executive Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 3: System Activity Pipeline */}
        <div className="loop-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  Pipeline & System Activity
                </h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono-numbers text-neutral-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {systemActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 mt-0.5 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-mono-numbers text-neutral-400 shrink-0">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate leading-relaxed">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] font-mono-numbers text-neutral-500">
              Audit log synchronized with multi-tenant storage
            </span>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <FeedbackDetailDrawer
        item={selectedFeedback}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
