'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { SentimentBadge, StatusBadge, ThemeBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { FeedbackItem } from '@/types';
import {
  X,
  Sparkles,
  User,
  Mail,
  Calendar,
  Layers,
  MessageSquare,
  Bot,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface FeedbackDetailDrawerProps {
  item: FeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: any) => void;
}

export const FeedbackDetailDrawer: React.FC<FeedbackDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${item.feedback}" — ${item.customerName} (${item.channel})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic AI summary from feedback
  const generateAiSummary = (text: string, theme: string, sentiment: string) => {
    if (sentiment === 'Negative') {
      return `User encounters high friction regarding ${theme.toLowerCase()}. Requires engineering attention to optimize latency or improve UI guidance.`;
    } else if (sentiment === 'Positive') {
      return `Customer expresses high delight with ${theme.toLowerCase()}. Recommends using this testimonial for case study materials.`;
    }
    return `Balanced user observation regarding ${theme.toLowerCase()}. Indicates potential usability refinement.`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-3xl bg-white border-l border-neutral-300 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded font-mono-numbers font-bold text-xs bg-neutral-900 text-white">
                {item.id}
              </span>
              <span className="text-xs text-neutral-500 font-mono-numbers">
                Workspace Ingestion
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Copy feedback quote"
              >
                {copied ? <Check className="w-4 h-4 text-neutral-950" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body: 2-Column Intelligence Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT / MAIN (7 Cols): Original Feedback & Customer Context */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-xs font-mono-numbers uppercase tracking-wider font-bold text-neutral-400 mb-2">
                    Original Customer Voice
                  </h3>
                  <div className="loop-card p-5 bg-neutral-50/60 border-l-4 border-l-black">
                    <p className="text-sm sm:text-base text-neutral-900 leading-relaxed font-sans font-medium italic">
                      &ldquo;{item.feedback}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Customer Metadata Card */}
                <div className="loop-card p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 font-sans flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-700" />
                    Customer & Origin Metadata
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">
                        Customer Name
                      </span>
                      <span className="font-bold text-neutral-900">{item.customerName}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">
                        Email Address
                      </span>
                      <span className="font-mono-numbers text-neutral-700 truncate block">
                        {item.customerEmail || 'anonymous@domain.com'}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">
                        Ingestion Channel
                      </span>
                      <span className="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                        <Layers className="w-3.5 h-3.5 text-neutral-500" />
                        {item.channel}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">
                        Received Date
                      </span>
                      <span className="font-mono-numbers text-neutral-700 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features & Tags */}
                {item.features && item.features.length > 0 && (
                  <div className="loop-card p-4 space-y-2">
                    <h4 className="text-xs font-bold text-neutral-900 font-sans">
                      Detected Feature Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-neutral-100 text-neutral-800 border border-neutral-300"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT / AI ANALYSIS (5 Cols): Machine Intelligence */}
              <div className="lg:col-span-5 space-y-5">
                <div className="loop-card p-4 space-y-4 bg-neutral-50/50">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-neutral-900 text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-neutral-900 font-heading">
                        AI Classification
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-numbers text-neutral-500">
                      GEMINI-1.5 PRO
                    </span>
                  </div>

                  {/* Sentiment & Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Sentiment:</span>
                      <SentimentBadge sentiment={item.sentiment} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Sentiment Score:</span>
                      <span className="font-mono-numbers font-bold text-neutral-900">
                        {item.sentimentScore}/100
                      </span>
                    </div>

                    {/* Controlled sentiment visual bar */}
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.sentiment === 'Positive'
                            ? 'bg-[#10B981]'
                            : item.sentiment === 'Negative'
                            ? 'bg-[#EF4444]'
                            : 'bg-[#F59E0B]'
                        }`}
                        style={{ width: `${item.sentimentScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Theme Classification */}
                  <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400 block">
                      Primary Theme Cluster
                    </span>
                    <ThemeBadge theme={item.theme} />
                  </div>

                  {/* AI Generated Summary */}
                  <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400 block">
                      AI Executive Summary
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed font-sans bg-white p-2.5 rounded-lg border border-neutral-200">
                      {generateAiSummary(item.feedback, item.theme, item.sentiment)}
                    </p>
                  </div>

                  {/* Triage Status */}
                  <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400 block">
                      Workflow Status
                    </span>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} />
                      {onStatusChange && (
                        <select
                          value={item.status}
                          onChange={(e) => onStatusChange(item.id, e.target.value)}
                          className="text-[11px] font-sans border border-neutral-300 rounded px-2 py-1 bg-white text-neutral-800"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Processed">Processed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link
                    href={`/ask-loop?query=${encodeURIComponent(
                      `What are customers saying regarding "${item.theme}" like ticket ${item.id}?`
                    )}`}
                    onClick={onClose}
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center"
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      Research in Ask LOOP
                    </Button>
                  </Link>

                  <Link
                    href={`/themes`}
                    onClick={onClose}
                    className="w-full"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center"
                      icon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      View Theme Cluster
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500 font-mono-numbers shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              Verified Multi-Tenant Workspace Record
            </span>
            <button
              onClick={onClose}
              className="font-semibold text-neutral-800 hover:text-neutral-950 hover:underline cursor-pointer"
            >
              Done (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
