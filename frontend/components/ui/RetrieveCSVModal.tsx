'use client';

import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { UploadProgress } from './UploadProgress';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { uploadCsvInChunks, isLargeFile, type UploadProgressEvent } from '@/lib/streamingCsvUploader';
import { useAuth } from '@/context/AuthContext';
import {
  FileSpreadsheet,
  DownloadCloud,
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
  Loader2,
  FileText,
  Upload,
  Zap
} from 'lucide-react';

export const RetrieveCSVModal: React.FC = () => {
  const { isRetrieveModalOpen, closeRetrieveModal, retrieveCSV } = useFeedbackContext();
  const { token } = useAuth() as any;

  const [selectedDataset, setSelectedDataset] = useState<'enterprise' | 'appstore' | 'zendesk' | 'custom'>('enterprise');
  const [customCsvContent, setCustomCsvContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrievalStep, setRetrievalStep] = useState<number>(0);

  // Streaming upload state
  const [uploadProgress, setUploadProgress] = useState<UploadProgressEvent | null>(null);
  const [isStreamingUpload, setIsStreamingUpload] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const datasetOptions = [
    {
      id: 'enterprise',
      title: 'Enterprise Customer Feedback Dataset (Q3)',
      subtitle: '1,482 records • Zendesk, Intercom, Discourse & App Store',
      badge: 'Recommended',
      icon: Database
    },
    {
      id: 'appstore',
      title: 'App Store Mobile iOS/Android Reviews',
      subtitle: '450 records • iOS 18 performance & UI feedback',
      badge: 'Mobile Focus',
      icon: FileSpreadsheet
    },
    {
      id: 'zendesk',
      title: 'Support Tickets & Live Chat Influx',
      subtitle: '340 records • Support escalations & billing queries',
      badge: 'Support Focus',
      icon: FileText
    },
    {
      id: 'custom',
      title: 'Upload or Paste Custom CSV Content',
      subtitle: 'Process your own CSV file — supports lakhs of rows with streaming upload',
      badge: 'Big Data Ready',
      icon: Upload
    }
  ];

  const handleStartRetrieve = async () => {
    // Large file path — use chunked streaming upload
    if (selectedDataset === 'custom' && selectedFile && isLargeFile(selectedFile)) {
      setIsStreamingUpload(true);
      abortControllerRef.current = new AbortController();

      try {
        await uploadCsvInChunks(
          selectedFile,
          token || '',
          (event) => setUploadProgress(event),
          abortControllerRef.current.signal
        );
        // On success, tell context that data is now in the DB
        retrieveCSV('custom', '__server__');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setUploadProgress({
            phase: 'error',
            processedRows: 0,
            totalRows: 0,
            importedCount: 0,
            failedCount: 0,
            percentage: 0,
            message: 'Upload failed',
            errorMessage: (err as Error).message || 'An unexpected error occurred during upload.',
          });
        }
      }
      return;
    }

    // Small file / text paste / preset datasets — use existing in-memory path
    setIsRetrieving(true);
    setRetrievalStep(1);

    setTimeout(() => setRetrievalStep(2), 800);
    setTimeout(() => setRetrievalStep(3), 1600);
    setTimeout(() => {
      retrieveCSV(selectedDataset, customCsvContent);
      setIsRetrieving(false);
      setRetrievalStep(0);
    }, 2400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    if (!isLargeFile(file)) {
      // Small file — read into textarea for preview
      const reader = new FileReader();
      reader.onload = (event) => setCustomCsvContent(event.target?.result as string || '');
      reader.readAsText(file);
    } else {
      // Large file — don't read into memory, use streaming upload
      setCustomCsvContent(`[Large file selected: ${file.name} — ${(file.size / 1024 / 1024).toFixed(1)} MB — will be uploaded in 500-row chunks]`);
    }
  };

  const handleCancelUpload = () => {
    abortControllerRef.current?.abort();
    setIsStreamingUpload(false);
    setUploadProgress(null);
    setSelectedFile(null);
    setCustomCsvContent('');
  };

  const handleUploadDone = () => {
    closeRetrieveModal();
    setIsStreamingUpload(false);
    setUploadProgress(null);
    setSelectedFile(null);
    setCustomCsvContent('');
  };

  const handleClose = () => {
    if (isRetrieving || isStreamingUpload) return;
    closeRetrieveModal();
    setUploadProgress(null);
    setIsStreamingUpload(false);
  };

  return (
    <Modal
      isOpen={isRetrieveModalOpen}
      onClose={handleClose}
      title="Retrieve CSV & Generate Dashboards"
      maxWidth="lg"
    >
      <div className="space-y-5 py-1 font-sans">

        {/* Streaming upload progress view */}
        {isStreamingUpload ? (
          <UploadProgress
            event={uploadProgress}
            onCancel={handleCancelUpload}
            onDone={uploadProgress?.phase === 'done' ? handleUploadDone : undefined}
          />
        ) : isRetrieving ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-xs animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-neutral-900">
                Retrieving CSV Dataset & Generating Dashboards...
              </h3>
              <p className="text-xs text-neutral-500">
                LOOP AI feedback engine is parsing customer records and running sentiment classification.
              </p>
            </div>

            <div className="w-full max-w-md space-y-2 pt-4">
              {[
                '1. Connecting to CSV Data Source & Fetching Records',
                '2. Extracting Sentiment Scores & Tagging Themes',
                '3. Rendering Live Intelligence Dashboards & Analytics',
              ].map((label, i) => {
                const stepNum = i + 1;
                const active = retrievalStep >= stepNum;
                const done = retrievalStep > stepNum;
                return (
                  <div key={i} className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${active ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-neutral-50 border-neutral-200 text-neutral-400'}`}>
                    <span className="flex items-center gap-2 font-medium">
                      {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : active ? <Loader2 className="w-4 h-4 animate-spin text-neutral-900" /> : <div className="w-4 h-4" />}
                      {label}
                    </span>
                    {active && <span className="font-mono-numbers text-[10px]">{done || retrievalStep === 3 ? 'OK' : '...'}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-lg flex items-start gap-3 bg-neutral-50 border border-neutral-200">
              <DownloadCloud className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  New User / Initialized State Detected
                </p>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Select a CSV dataset source below or upload your own file. Clicking <strong>Retrieve CSV</strong> will fetch feedback records and automatically generate all interactive charts, themes, and reports across the website.
                </p>
              </div>
            </div>

            {/* Big data badge */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700 font-sans">
                <strong>Big Data Ready:</strong> Custom CSV uploads support lakhs (100,000+) of rows via streaming batch upload — no browser freezing.
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                Select CSV Dataset Source
              </label>

              {datasetOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedDataset === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedDataset(opt.id as any)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-50 border-black shadow-xs ring-1 ring-black'
                        : 'bg-white border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${isSelected ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-neutral-900">{opt.title}</h4>
                          {opt.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${
                              opt.badge === 'Big Data Ready'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 font-sans mt-0.5">{opt.subtitle}</p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-black bg-black' : 'border-neutral-300'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom file area if custom selected */}
            {selectedDataset === 'custom' && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2 animate-in fade-in">
                <label className="text-xs font-semibold text-neutral-900 block">
                  Upload CSV File or Paste Raw CSV Text
                </label>

                {/* File drop zone */}
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-neutral-800 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                  />
                  {selectedFile && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600 bg-white border border-neutral-200 rounded px-2.5 py-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono-numbers">{selectedFile.name}</span>
                      <span className="text-neutral-400">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      {isLargeFile(selectedFile) && (
                        <span className="ml-auto px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-bold">STREAM MODE</span>
                      )}
                    </div>
                  )}
                </div>

                <textarea
                  value={customCsvContent}
                  onChange={(e) => { setCustomCsvContent(e.target.value); setSelectedFile(null); }}
                  placeholder={`customerName,channel,feedback,sentiment,theme\nJohn Doe,Zendesk,Great app interface!,Positive,UX Performance`}
                  rows={3}
                  className="w-full p-2 text-xs font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                />

                {selectedFile && isLargeFile(selectedFile) && (
                  <p className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Large file detected — will upload in 500-row chunks (streaming mode). Your browser won't freeze.
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleStartRetrieve}
                disabled={selectedDataset === 'custom' && !customCsvContent && !selectedFile}
              >
                {selectedDataset === 'custom' && selectedFile && isLargeFile(selectedFile)
                  ? 'Upload & Import (Streaming)'
                  : 'Retrieve CSV & Generate Dashboards'
                }
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
