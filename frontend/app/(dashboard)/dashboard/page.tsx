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
import { StatsCardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/ui/Skeletons';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { FeedbackItem } from '@/types';
import {
  MessageSquare,
  TrendingUp,
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
  AlertTriangle,
  Eye
} from 'lucide-react';

export default function DashboardPage() {
  const {
    isRetrieved,
    isLoading,
    datasetName,
    feedbackList,
    stats,
    volumeData,
    sentimentPieData,
    topThemesBarData,
    reportsList,
    openRetrieveModal,
    resetToZero,
    lastRetrievedTime,
    activeDatasetType,
    retrieveCSV
  } = useFeedbackContext();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const recentFeedback = feedbackList.slice(0, 6);

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
      {/* 2. ANALYSIS HEADER: Fluid Title, Status, Filters & Actions     */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-neutral-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neutral-900 text-white font-mono-numbers">
              Enterprise Workspace
            </span>
            {isRetrieved && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-neutral-100 text-neutral-800 border border-neutral-200 font-mono-numbers flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Source: {datasetName}
              </span>
            )}
            <span className="text-xs font-mono-numbers text-neutral-500">
              {isRetrieved ? `Synced ${lastRetrievedTime || 'just now'}` : 'Initialized at 0 (Clean Workspace)'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Customer Feedback Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-0.5">
            Cross-channel synthesis across Zendesk, Intercom, App Store reviews, and user surveys.
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Quick Dataset Selector */}
          <div className="hidden sm:flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/80">
            {[
              { id: 'enterprise', label: 'Enterprise Q3' },
              { id: 'appstore', label: 'App Store' },
              { id: 'zendesk', label: 'Zendesk' },
            ].map((ds) => (
              <button
                key={ds.id}
                onClick={() => retrieveCSV(ds.id as any)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeDatasetType === ds.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
                title={`Switch to ${ds.label} dataset`}
              >
                {ds.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/80">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateRange === range
                    ? 'bg-neutral-900 text-white shadow-xs'
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
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
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
            <Button variant="outline" size="sm" icon={<Sparkles className="w-3.5 h-3.5 text-neutral-900" />}>
              Ask LOOP
            </Button>
          </Link>
        </div>
      </div>

      {/* New User Alert Banner if 0 state */}
      {!isRetrieved && (
        <div className="loop-card bg-neutral-50/80 p-4 border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-white shrink-0 shadow-2xs">
              <DownloadCloud className="w-4 h-4" />
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
      {/* SECOND ROW: 4 Modular Intelligence KPI Cards / Skeletons       */}
      {/* ============================================================== */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartSkeleton height={280} />
            </div>
            <div>
              <ChartSkeleton height={280} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ChartSkeleton height={280} />
            </div>
            <div className="lg:col-span-2">
              <TableSkeleton rows={5} />
            </div>
          </div>
        </div>
      ) : (
        <>
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
          <div className="loop-card p-4 sm:p-5 h-full flex flex-col justify-between transition-all duration-150">
            <div className="flex flex-row items-center justify-between pb-2.5 mb-2 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                    Recent Customer Feedback
                  </h3>
                  {isRetrieved && (
                    <span className="font-mono-numbers text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {feedbackList.length} total
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  {isRetrieved
                    ? `Displaying latest verified items across active channels`
                    : '0 customer records retrieved'}
                </p>
              </div>
              <Link href="/inbox">
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Inbox
                </Button>
              </Link>
            </div>

            <div className="flex-1 overflow-x-auto min-h-[220px] flex flex-col justify-center">
              {!isRetrieved || recentFeedback.length === 0 ? (
                <div className="bg-neutral-50/70 rounded-xl border border-neutral-200/70 p-8 flex flex-col items-center justify-center text-center my-2">
                  <div className="p-3 bg-white rounded-full text-neutral-900 border border-neutral-200 shadow-xs mb-3">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-neutral-900">
                    No Customer Feedback Records
                  </h4>
                  <p className="text-xs text-neutral-500 font-sans max-w-sm mt-1 mb-4 leading-relaxed">
                    Workspace is initialized at 0. Retrieve CSV data or import customer tickets to populate live feedback.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
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
                        className="cursor-pointer group hover:bg-neutral-50 transition-colors"
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-numbers text-[10px] font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/80">
                              {item.id}
                            </span>
                            <span className="font-semibold text-xs text-neutral-900">{item.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono-numbers text-xs whitespace-nowrap text-neutral-600">
                          {item.channel}
                        </TableCell>
                        <TableCell className="max-w-[200px] sm:max-w-[320px] truncate text-xs text-neutral-800">
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
                            className="p-1 rounded text-neutral-400 group-hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
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
          </div>
        </div>
      </div>
      </>
      )}

      {/* ============================================================== */}
      {/* 5. DETAILED INTELLIGENCE: AI Synthesis, Reports & Pipeline     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: AI Insights Synthesis */}
        <div className="loop-card p-4 sm:p-5 space-y-3 flex flex-col justify-between transition-all duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  AI Intelligence Synthesis
                </h3>
              </div>
              <span className="text-[10px] font-mono-numbers font-bold text-neutral-400 uppercase tracking-wider">
                RAG Engine
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-lg bg-neutral-50/80 border border-neutral-100 text-xs text-neutral-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-neutral-700" />
                  Primary Friction Area
                </span>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                  {isRetrieved
                    ? 'Data Export Latency (FB-9021): Enterprise users report delays on bulk exports exceeding 5,000 rows.'
                    : 'Awaiting dataset ingestion to extract friction points.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50/80 border border-neutral-100 text-xs text-neutral-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                  Key Customer Delighter
                </span>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                  {isRetrieved
                    ? 'Natural language accuracy in Ask LOOP and responsive filtering receive high user praise.'
                    : 'Awaiting dataset ingestion to synthesize delighters.'}
                </p>
              </div>
            </div>
          </div>

          <Link href="/ask-loop" className="pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between" icon={<Sparkles className="w-3.5 h-3.5 text-neutral-900" />}>
              <span>Ask AI Research Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 2: Recent Reports */}
        <div className="loop-card p-4 sm:p-5 space-y-3 flex flex-col justify-between transition-all duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white shadow-2xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  Recent VoC Reports
                </h3>
              </div>
              <Link href="/reports" className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1">
                <span>All reports</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2 pt-1">
              {!isRetrieved || reportsList.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400 font-sans">
                  No executive reports generated yet.
                </div>
              ) : (
                reportsList.slice(0, 2).map((rep) => (
                  <Link
                    key={rep.id}
                    href="/reports"
                    className="block p-3 rounded-lg bg-neutral-50/80 hover:bg-neutral-100/80 border border-neutral-100 transition-colors"
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
        <div className="loop-card p-4 sm:p-5 space-y-3 flex flex-col justify-between transition-all duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 text-white shadow-2xs">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-neutral-900">
                  Pipeline Activity
                </h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono-numbers text-neutral-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {systemActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="p-1.5 rounded-md bg-neutral-50 text-neutral-800 border border-neutral-200/60 mt-0.5 shrink-0">
                      <Icon className="w-3 h-3" />
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

          <div className="pt-2 text-center border-t border-neutral-100">
            <span className="text-[10px] font-mono-numbers text-neutral-400">
              Audit log synchronized with tenant storage
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
