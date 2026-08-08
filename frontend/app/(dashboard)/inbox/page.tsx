'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
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
  Inbox
} from 'lucide-react';

function FeedbackInboxContent() {
  const searchParams = useSearchParams();
  const { isRetrieved, feedbackList, openRetrieveModal, addFeedbackItem, retrieveCSV } = useFeedbackContext();

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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

  // Filtered dataset calculation
  const filteredData = useMemo(() => {
    return feedbackList.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.customerName.toLowerCase().includes(q) ||
          item.feedback.toLowerCase().includes(q) ||
          item.customerEmail.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (statusFilter && item.status !== statusFilter) return false;
      if (sentimentFilter && item.sentiment !== sentimentFilter) return false;
      if (themeFilter && item.theme !== themeFilter) return false;
      if (channelFilter && item.channel !== channelFilter) return false;
      if (dateFilter && item.date !== dateFilter) return false;
      return true;
    });
  }, [feedbackList, searchQuery, statusFilter, sentimentFilter, themeFilter, channelFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSentimentFilter('');
    setThemeFilter('');
    setChannelFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const handleAddManualFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newFeedback) return;

    const newItem: FeedbackItem = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomer,
      customerEmail: newEmail || 'customer@company.com',
      channel: newChannel,
      feedback: newFeedback,
      sentiment: newSentiment,
      sentimentScore: newSentiment === 'Positive' ? 90 : newSentiment === 'Negative' ? 20 : 50,
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
      retrieveCSV();
      setImportSuccessMsg('Successfully retrieved & synced 14 new customer tickets from Zendesk & Intercom!');
      setTimeout(() => setImportSuccessMsg(''), 4000);
      setIsImportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Customer Feedback Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
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
        <div className="skeuo-panel bg-[#E2ECD8] p-4 border-l-4 border-l-green-600 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
          <span className="text-xs font-semibold text-[#2D4E2A] font-sans">
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

      {/* Main Enterprise Table Container */}
      <div className="skeuo-panel p-4 space-y-4">
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
                      <div>{item.customerName}</div>
                      <div className="text-[10px] text-[#4A4A4A]/60 font-mono-numbers">{item.customerEmail}</div>
                    </TableCell>
                    <TableCell className="font-mono-numbers text-xs font-medium whitespace-nowrap">
                      {item.channel}
                    </TableCell>
                    <TableCell className="max-w-[240px] sm:max-w-[320px] text-xs font-sans">
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
                    <TableCell className="font-mono-numbers text-xs whitespace-nowrap">
                      {item.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {item.features.map((feat, i) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] rounded bg-[#CBCBCB] text-[#4A4A4A] border border-[#A0A0A0]">
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
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full skeuo-input px-3 py-1.5 text-xs font-sans"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Customer Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="eleanor@company.com"
              className="w-full skeuo-input px-3 py-1.5 text-xs font-sans"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as FeedbackChannel)}
                className="w-full skeuo-input px-2 py-1.5 text-xs bg-[#FFFFE3]"
              >
                <option value="Zendesk">Zendesk</option>
                <option value="Intercom">Intercom</option>
                <option value="App Store">App Store</option>
                <option value="Discourse">Discourse</option>
                <option value="Email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Theme Cluster</label>
              <select
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value as FeedbackTheme)}
                className="w-full skeuo-input px-2 py-1.5 text-xs bg-[#FFFFE3]"
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
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Feedback Content</label>
            <textarea
              required
              rows={3}
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Paste exact customer statement..."
              className="w-full skeuo-input p-2 text-xs font-sans"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Assigned Sentiment</label>
            <div className="flex gap-4">
              {(['Positive', 'Negative', 'Neutral'] as SentimentType[]).map((sent) => (
                <label key={sent} className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="sentiment"
                    checked={newSentiment === sent}
                    onChange={() => setNewSentiment(sent)}
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
          <p className="text-xs text-[#4A4A4A]/80">
            Select integration channels to fetch newly submitted customer support tickets:
          </p>
          <div className="space-y-2">
            {[
              { name: 'Zendesk Support Desk', count: '8 new tickets pending' },
              { name: 'Intercom Live Chat', count: '4 new conversations' },
              { name: 'Apple App Store Reviews', count: '2 new reviews' },
              { name: 'Discourse Forum', count: '0 new threads' }
            ].map((ch, idx) => (
              <label key={idx} className="skeuo-card-cream p-3 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#6D8196]" />
                  <span className="font-semibold text-xs text-[#4A4A4A]">{ch.name}</span>
                </div>
                <span className="text-[10px] font-mono-numbers text-[#6D8196] font-bold">
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
