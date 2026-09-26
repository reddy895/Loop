'use client';

import React, { useState, useMemo, Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, CSVRetrieveCard, LoadingSkeleton } from '@/components/ui/FeedbackStates';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FeedbackDetailDrawer } from '@/components/ui/FeedbackDetailDrawer';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { FeedbackItem, FeedbackStatus, SentimentType, FeedbackTheme, FeedbackChannel } from '@/types';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Inbox,
  Database,
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  Eye,
  X
} from 'lucide-react';

function FeedbackInboxContent() {
  const searchParams = useSearchParams();
  const { isRetrieved, feedbackList, openRetrieveModal, addFeedbackItem, isServerMode } = useFeedbackContext();

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'critical' | 'neutral' | 'positive'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'score-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Selected feedback item for detail drawer
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Server-side mode state (for large uploaded CSVs)
  const [serverData, setServerData] = useState<FeedbackItem[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [serverLoading, setServerLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Form states for manual entry
  const [newCustomer, setNewCustomer] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newChannel, setNewChannel] = useState<FeedbackChannel>('Zendesk');
  const [newFeedback, setNewFeedback] = useState('');
  const [newTheme, setNewTheme] = useState<FeedbackTheme>('UX Performance');
  const [newSentiment, setNewSentiment] = useState<SentimentType>('Neutral');

  useEffect(() => {
    if (searchParams.get('modal') === 'upload' || searchParams.get('modal') === 'retrieve') {
      openRetrieveModal();
    }
  }, [searchParams, openRetrieveModal]);

  // Server-side fetch for big data mode (debounced 300ms)
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  useEffect(() => {
    if (!isServerMode) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setServerLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', String(pageSize));
        if (searchQuery) params.set('search', searchQuery);
        if (statusFilter) params.set('status', statusFilter.toUpperCase().replace(' ', '_'));
        if (sentimentFilter) params.set('sentiment', sentimentFilter.toUpperCase());
        if (channelFilter) params.set('channel', channelFilter);
        if (themeFilter) params.set('themeId', themeFilter);
        const res = await fetch(`${BACKEND_URL}/api/feedback?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          const items = (json.data?.items || json.items || []).map((f: any) => ({
            id: f.id,
            customerName: f.customerLabel || 'Customer',
            customerEmail: f.customerEmail || '',
            channel: f.channel,
            feedback: f.content,
            sentiment: f.sentiment ? (f.sentiment.charAt(0).toUpperCase() + f.sentiment.slice(1).toLowerCase()) : 'Neutral',
            sentimentScore: f.sentimentScore || 50,
            theme: f.themeName || 'UX Performance',
            status: f.status ? (f.status.charAt(0).toUpperCase() + f.status.slice(1).toLowerCase().replace('_', ' ')) : 'New',
            date: f.createdAt?.split('T')[0] || '',
            features: []
          }));
          const pagination = json.data?.pagination || json.pagination || {};
          setServerData(items);
          setServerTotal(pagination.totalItems || items.length);
          setServerTotalPages(pagination.totalPages || 1);
        }
      } catch {
        // Fall back to client data on error
      } finally {
        setServerLoading(false);
      }
    }, 300);
  }, [isServerMode, currentPage, pageSize, searchQuery, statusFilter, sentimentFilter, channelFilter, themeFilter, BACKEND_URL]);

  // Client-side filtering & sorting logic
  const filteredAndSortedData = useMemo(() => {
    if (isServerMode) return serverData;

    let result = feedbackList.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      const matchesSentiment = sentimentFilter === '' || item.sentiment === sentimentFilter;
      const matchesTheme = themeFilter === '' || item.theme === themeFilter;
      const matchesChannel = channelFilter === '' || item.channel === channelFilter;

      let matchesScore = true;
      if (scoreFilter === 'critical') matchesScore = item.sentimentScore < 35;
      else if (scoreFilter === 'neutral') matchesScore = item.sentimentScore >= 35 && item.sentimentScore <= 70;
      else if (scoreFilter === 'positive') matchesScore = item.sentimentScore > 70;

      return matchesSearch && matchesStatus && matchesSentiment && matchesTheme && matchesChannel && matchesScore;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'score-desc') return b.sentimentScore - a.sentimentScore;
      if (sortBy === 'score-asc') return a.sentimentScore - b.sentimentScore;
      return 0;
    });

    return result;
  }, [isServerMode, serverData, feedbackList, searchQuery, statusFilter, sentimentFilter, themeFilter, channelFilter, scoreFilter, sortBy]);

  const totalPages = isServerMode ? serverTotalPages : Math.ceil(filteredAndSortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (isServerMode) return serverData;
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [isServerMode, serverData, filteredAndSortedData, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSentimentFilter('');
    setThemeFilter('');
    setChannelFilter('');
    setScoreFilter('all');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  const handleRowClick = (item: FeedbackItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleAddManualFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newFeedback) return;

    const newItem: FeedbackItem = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomer,
      customerEmail: newEmail || `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      channel: newChannel,
      feedback: newFeedback,
      sentiment: newSentiment,
      sentimentScore: newSentiment === 'Positive' ? 88 : newSentiment === 'Negative' ? 22 : 54,
      theme: newTheme,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      features: ['Manual Entry']
    };

    addFeedbackItem(newItem);
    setIsManualModalOpen(false);
    setNewCustomer('');
    setNewEmail('');
    setNewFeedback('');
  };

  const handleSimulateSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
      setImportSuccessMsg('Successfully retrieved & synced incoming feedback tickets.');
      setTimeout(() => setImportSuccessMsg(''), 4000);
      setIsImportModalOpen(false);
    }, 1200);
  };

  const hasActiveFilters = searchQuery || statusFilter || sentimentFilter || themeFilter || channelFilter || scoreFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-neutral-900 text-white font-mono-numbers">
              Intelligence Corpus
            </span>
            <span className="text-xs font-mono-numbers text-neutral-500">
              {filteredAndSortedData.length} records active
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Customer Feedback Inbox
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Enterprise feedback stream with automated sentiment scoring, theme clustering, and deep-dive triage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Sync Channels
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={openRetrieveModal}
          >
            Retrieve CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsManualModalOpen(true)}
          >
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {importSuccessMsg && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0" />
          <span className="text-xs font-semibold text-neutral-900 font-sans">
            {importSuccessMsg}
          </span>
        </div>
      )}

      {/* Server Mode Banner */}
      {isServerMode && (
        <div className="loop-card bg-neutral-50 p-3.5 border-l-4 border-l-black flex items-center gap-3">
          <div className="p-1.5 bg-neutral-900 rounded text-white shrink-0">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-neutral-900">
              High-Scale Mode — Server-Side Filtering
            </p>
            <p className="text-xs text-neutral-600 font-sans">
              {serverLoading ? 'Fetching records from database…' : `${serverTotal.toLocaleString()} total records stored in database. Filters and pagination are processed server-side.`}
            </p>
          </div>
          {serverLoading && <Loader2 className="w-4 h-4 text-neutral-900 animate-spin shrink-0" />}
        </div>
      )}

      {/* Advanced Filter & Search Toolbar */}
      <div className="loop-card p-4 space-y-3 font-sans">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search feedback text, customer, email, or ticket ID..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sentiment */}
            <select
              value={sentimentFilter}
              onChange={(e) => { setSentimentFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer"
            >
              <option value="">Sentiment: All</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>

            {/* Score Range Filter */}
            <select
              value={scoreFilter}
              onChange={(e) => { setScoreFilter(e.target.value as any); setCurrentPage(1); }}
              className="px-2.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer"
            >
              <option value="all">Score: All (0-100)</option>
              <option value="critical">Critical (&lt; 35)</option>
              <option value="neutral">Moderate (35-70)</option>
              <option value="positive">High Delighter (&gt; 70)</option>
            </select>

            {/* Theme Cluster */}
            <select
              value={themeFilter}
              onChange={(e) => { setThemeFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer"
            >
              <option value="">Theme: All</option>
              <option value="UX Performance">UX Performance</option>
              <option value="Billing & Pricing">Billing & Pricing</option>
              <option value="Integration Request">Integration Request</option>
              <option value="Mobile Responsiveness">Mobile Responsiveness</option>
              <option value="Security & Auth">Security & Auth</option>
            </select>

            {/* Ingestion Channel */}
            <select
              value={channelFilter}
              onChange={(e) => { setChannelFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer"
            >
              <option value="">Channel: All</option>
              <option value="Zendesk">Zendesk</option>
              <option value="Intercom">Intercom</option>
              <option value="App Store">App Store</option>
              <option value="Discourse">Discourse</option>
              <option value="Email">Email</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-2.5 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Enterprise Table Container */}
      <div className="loop-card p-4 sm:p-5 space-y-4">
        {!isRetrieved || paginatedData.length === 0 ? (
          <div className="py-6 space-y-6">
            {!isRetrieved ? (
              <CSVRetrieveCard onRetrieveClick={openRetrieveModal} />
            ) : (
              <EmptyState onAction={handleClearFilters} />
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket & Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Customer Feedback & AI Summary</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Theme Cluster</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className="cursor-pointer group hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Ticket & Customer */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-numbers text-[11px] font-bold text-neutral-950 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                            {item.id}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-neutral-900 font-sans">{item.customerName}</div>
                            <div className="text-[10px] text-neutral-500 font-mono-numbers truncate max-w-[130px]">{item.customerEmail}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Channel */}
                      <TableCell className="whitespace-nowrap font-mono-numbers text-xs text-neutral-600">
                        {item.channel}
                      </TableCell>

                      {/* Feedback Snippet */}
                      <TableCell className="max-w-[260px] sm:max-w-[340px] lg:max-w-[420px]">
                        <p className="text-xs text-neutral-900 font-sans line-clamp-2 leading-relaxed">
                          &ldquo;{item.feedback}&rdquo;
                        </p>
                      </TableCell>

                      {/* Sentiment */}
                      <TableCell className="whitespace-nowrap">
                        <SentimentBadge sentiment={item.sentiment} />
                      </TableCell>

                      {/* Score */}
                      <TableCell className="whitespace-nowrap font-mono-numbers text-xs font-bold text-neutral-900">
                        {item.sentimentScore}/100
                      </TableCell>

                      {/* Theme */}
                      <TableCell className="whitespace-nowrap">
                        <ThemeBadge theme={item.theme} />
                      </TableCell>

                      {/* Status */}
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </TableCell>

                      {/* Date */}
                      <TableCell className="whitespace-nowrap font-mono-numbers text-[11px] text-neutral-500">
                        {item.date}
                      </TableCell>

                      {/* Inspect Action */}
                      <TableCell className="whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(item);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-neutral-200 pt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSortedData.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>

      {/* Slide-Over Feedback Detail Drawer */}
      <FeedbackDetailDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Add Customer Feedback Manually"
        description="Ingest individual customer ticket with instant AI sentiment & theme classification."
      >
        <form onSubmit={handleAddManualFeedback} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. elena@acme.com"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as FeedbackChannel)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="Zendesk">Zendesk</option>
                <option value="Intercom">Intercom</option>
                <option value="App Store">App Store</option>
                <option value="Discourse">Discourse</option>
                <option value="Email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Sentiment</label>
              <select
                value={newSentiment}
                onChange={(e) => setNewSentiment(e.target.value as SentimentType)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Theme</label>
              <select
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value as FeedbackTheme)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="UX Performance">UX Performance</option>
                <option value="Billing & Pricing">Billing & Pricing</option>
                <option value="Integration Request">Integration Request</option>
                <option value="Mobile Responsiveness">Mobile Responsiveness</option>
                <option value="Security & Auth">Security & Auth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Feedback Quote</label>
            <textarea
              required
              rows={3}
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Enter exact customer feedback content..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
              Add & Classify
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sync Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Sync Integrated Channels"
        description="Fetch latest customer tickets from connected Zendesk, Intercom, and App Store webhooks."
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 font-sans">
            LOOP will query active integration endpoints and run GEMINI-1.5 PRO auto-tagging on unclassified records.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isSimulatingSync}
              onClick={handleSimulateSync}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Start Sync Pipeline
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function FeedbackInboxPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <FeedbackInboxContent />
    </Suspense>
  );
}
