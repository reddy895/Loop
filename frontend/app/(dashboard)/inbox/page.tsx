'use client';

import React, { useState, useMemo, Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import { FilterBar } from '@/components/ui/SearchFilterBars';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, CSVRetrieveCard, LoadingSkeleton } from '@/components/ui/FeedbackStates';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
  Loader2
} from 'lucide-react';

function FeedbackInboxContent() {
  const searchParams = useSearchParams();
  const { isRetrieved, feedbackList, openRetrieveModal, addFeedbackItem, retrieveCSV, isServerMode } = useFeedbackContext();

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Server-side mode state (for large uploaded CSVs)
  const [serverData, setServerData] = useState<any[]>([]);
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

  // Client-side filtering logic
  const filteredData = useMemo(() => {
    if (isServerMode) return serverData;
    return feedbackList.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.feedback.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      const matchesSentiment = sentimentFilter === '' || item.sentiment === sentimentFilter;
      const matchesTheme = themeFilter === '' || item.theme === themeFilter;
      const matchesChannel = channelFilter === '' || item.channel === channelFilter;

      return matchesSearch && matchesStatus && matchesSentiment && matchesTheme && matchesChannel;
    });
  }, [isServerMode, serverData, feedbackList, searchQuery, statusFilter, sentimentFilter, themeFilter, channelFilter]);

  const totalPages = isServerMode ? serverTotalPages : Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (isServerMode) return serverData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [isServerMode, serverData, filteredData, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSentimentFilter('');
    setThemeFilter('');
    setChannelFilter('');
    setCurrentPage(1);
  };

  const handleAddManualFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newFeedback) return;

    const newItem: FeedbackItem = {
      id: `fb_manual_${Date.now()}`,
      customerName: newCustomer,
      customerEmail: newEmail || `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      channel: newChannel,
      feedback: newFeedback,
      sentiment: newSentiment,
      sentimentScore: newSentiment === 'Positive' ? 85 : newSentiment === 'Negative' ? 25 : 55,
      theme: newTheme,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      features: ['Manual Entry']
    };

    addFeedbackItem(newItem);
    setIsManualModalOpen(false);

    // Reset form
    setNewCustomer('');
    setNewEmail('');
    setNewFeedback('');
  };

  const handleSimulateSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
      setImportSuccessMsg('Successfully retrieved & synced 14 new customer tickets from Zendesk & Intercom.');
      setTimeout(() => setImportSuccessMsg(''), 4000);
      setIsImportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Customer Feedback Inbox
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Enterprise feedback stream aggregated with automated sentiment & theme classification.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
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
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsManualModalOpen(true)}
          >
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {importSuccessMsg && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0" />
          <span className="text-xs font-semibold text-neutral-900 font-sans">
            {importSuccessMsg}
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setCurrentPage(1); }}
        sentimentFilter={sentimentFilter}
        onSentimentChange={(s) => { setSentimentFilter(s); setCurrentPage(1); }}
        themeFilter={themeFilter}
        onThemeChange={(t) => { setThemeFilter(t); setCurrentPage(1); }}
        channelFilter={channelFilter}
        onChannelChange={(c) => { setChannelFilter(c); setCurrentPage(1); }}
        onClearFilters={handleClearFilters}
      />

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Feedback Content</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Theme Cluster</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Features</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-xs whitespace-nowrap">
                      <div className="text-neutral-900">{item.customerName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono-numbers">{item.customerEmail}</div>
                    </TableCell>
                    <TableCell className="font-mono-numbers text-xs font-medium whitespace-nowrap text-neutral-700">
                      {item.channel}
                    </TableCell>
                    <TableCell className="max-w-[240px] sm:max-w-[320px] text-xs font-sans text-neutral-800">
                      <p className="line-clamp-2">{item.feedback}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <SentimentBadge sentiment={item.sentiment} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <ThemeBadge theme={item.theme} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="font-mono-numbers text-xs whitespace-nowrap text-neutral-600">
                      {item.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {(item.features || []).map((feat: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] font-mono-numbers rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Manual Entry Form */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Customer Feedback"
        description="Manually insert a single customer feedback item into the workspace stream"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddManualFeedback}>
              Save Feedback Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddManualFeedback} className="space-y-3 font-sans">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Customer Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="eleanor@company.com"
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as FeedbackChannel)}
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="Zendesk">Zendesk</option>
                <option value="Intercom">Intercom</option>
                <option value="App Store">App Store</option>
                <option value="Discourse">Discourse</option>
                <option value="Email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Theme Cluster</label>
              <select
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value as FeedbackTheme)}
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Feedback Content</label>
            <textarea
              required
              rows={3}
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Paste exact customer statement..."
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Assigned Sentiment</label>
            <div className="flex gap-4">
              {(['Positive', 'Negative', 'Neutral'] as SentimentType[]).map((sent) => (
                <label key={sent} className="flex items-center gap-1.5 text-xs cursor-pointer select-none text-neutral-800">
                  <input
                    type="radio"
                    name="sentiment"
                    checked={newSentiment === sent}
                    onChange={() => setNewSentiment(sent)}
                    className="accent-black"
                  />
                  {sent}
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Simulated Channel Import */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Simulate Channel Sync"
        description="Trigger live API webhook import simulation across external integrations"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulateSync}
            disabled={isSimulatingSync}
            icon={isSimulatingSync ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          >
            {isSimulatingSync ? 'Syncing External APIs...' : 'Trigger Sync Now'}
          </Button>
        }
      >
        <div className="space-y-3 font-sans">
          <p className="text-xs text-neutral-600">
            Select integration channels to fetch newly submitted customer support tickets:
          </p>
          <div className="space-y-2">
            {[
              { name: 'Zendesk Support Desk', count: '8 new tickets pending' },
              { name: 'Intercom Live Chat', count: '4 new conversations' },
              { name: 'Apple App Store Reviews', count: '2 new reviews' },
              { name: 'Discourse Forum', count: '0 new threads' }
            ].map((ch, idx) => (
              <label key={idx} className="loop-card p-3 flex items-center justify-between cursor-pointer hover:border-neutral-400 transition-colors">
                <div className="flex items-center gap-2.5">
                  <input type="checkbox" defaultChecked className="accent-black" />
                  <span className="font-semibold text-xs text-neutral-900">{ch.name}</span>
                </div>
                <span className="text-[10px] font-mono-numbers text-neutral-500 font-semibold">
                  {ch.count}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function FeedbackInboxPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={8} />}>
      <FeedbackInboxContent />
    </Suspense>
  );
}
