'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useFeedbackContext } from '@/context/FeedbackContext';
import {
  FileSpreadsheet,
  DownloadCloud,
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
  Loader2,
  FileText,
  Upload
} from 'lucide-react';

export const RetrieveCSVModal: React.FC = () => {
  const { isRetrieveModalOpen, closeRetrieveModal, retrieveCSV } = useFeedbackContext();

  const [selectedDataset, setSelectedDataset] = useState<'enterprise' | 'appstore' | 'zendesk' | 'custom'>('enterprise');
  const [customCsvContent, setCustomCsvContent] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrievalStep, setRetrievalStep] = useState<number>(0);

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
      subtitle: 'Process your own CSV file or paste raw text payload',
      badge: 'Custom File',
      icon: Upload
    }
  ];

  const handleStartRetrieve = () => {
    setIsRetrieving(true);
    setRetrievalStep(1);

    setTimeout(() => {
      setRetrievalStep(2);
    }, 800);

    setTimeout(() => {
      setRetrievalStep(3);
    }, 1600);

    setTimeout(() => {
      retrieveCSV(selectedDataset, customCsvContent);
      setIsRetrieving(false);
      setRetrievalStep(0);
    }, 2400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomCsvContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal
      isOpen={isRetrieveModalOpen}
      onClose={() => {
        if (!isRetrieving) closeRetrieveModal();
      }}
      title="Retrieve CSV & Generate Dashboards"
      maxWidth="lg"
    >

      <div className="space-y-5 py-1 font-sans">
        {isRetrieving ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-[#6D8196]/20 text-[#6D8196] border border-[#6D8196]/40 shadow-inner animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-[#4A4A4A]">
                Retrieving CSV Dataset & Generating Dashboards...
              </h3>
              <p className="text-xs text-[#4A4A4A]/70">
                LOOP AI feedback engine is parsing customer records and running sentiment classification.
              </p>
            </div>

            {/* Step indicators */}
            <div className="w-full max-w-md space-y-2 pt-4">
              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${retrievalStep >= 1 ? 'bg-[#E2ECD8] border-green-600 text-[#2D4E2A]' : 'bg-[#EAEAEA] border-[#CBCBCB] text-[#7A7A7A]'
                }`}>
                <span className="flex items-center gap-2 font-medium">
                  {retrievalStep > 1 ? <CheckCircle2 className="w-4 h-4 text-green-700" /> : <Loader2 className="w-4 h-4 animate-spin text-[#6D8196]" />}
                  1. Connecting to CSV Data Source & Fetching Records
                </span>
                {retrievalStep >= 1 && <span className="font-mono-numbers text-[10px]">OK</span>}
              </div>

              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${retrievalStep >= 2 ? 'bg-[#E2ECD8] border-green-600 text-[#2D4E2A]' : 'bg-[#EAEAEA] border-[#CBCBCB] text-[#7A7A7A]'
                }`}>
                <span className="flex items-center gap-2 font-medium">
                  {retrievalStep > 2 ? <CheckCircle2 className="w-4 h-4 text-green-700" /> : retrievalStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-[#6D8196]" /> : <div className="w-4 h-4" />}
                  2. Extracting Sentiment Scores & Tagging Themes
                </span>
                {retrievalStep >= 2 && <span className="font-mono-numbers text-[10px]">OK</span>}
              </div>

              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${retrievalStep >= 3 ? 'bg-[#E2ECD8] border-green-600 text-[#2D4E2A]' : 'bg-[#EAEAEA] border-[#CBCBCB] text-[#7A7A7A]'
                }`}>
                <span className="flex items-center gap-2 font-medium">
                  {retrievalStep >= 3 ? <Sparkles className="w-4 h-4 text-[#6D8196]" /> : <div className="w-4 h-4" />}
                  3. Rendering Live Intelligence Dashboards & Analytics
                </span>
                {retrievalStep >= 3 && <span className="font-mono-numbers text-[10px]">Ready</span>}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="skeuo-inset p-4 flex items-start gap-3 bg-[#6D8196]/10 border-l-4 border-l-[#6D8196]">
              <DownloadCloud className="w-5 h-5 text-[#6D8196] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#4A4A4A]">
                  New User / Initialized State Detected
                </p>
                <p className="text-[11px] text-[#4A4A4A]/80 mt-0.5">
                  Select a CSV dataset source below or upload your own file. Clicking <strong>Retrieve CSV</strong> will fetch feedback records and automatically generate all interactive charts, themes, and reports across the website.
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider block">
                Select CSV Dataset Source
              </label>

              {datasetOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedDataset === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedDataset(opt.id as any)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${isSelected
                        ? 'bg-[#FFFFE3] border-[#6D8196] shadow-sm ring-1 ring-[#6D8196]'
                        : 'bg-[#EAEAEA]/60 border-[#CBCBCB] hover:border-[#6D8196]/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${isSelected ? 'bg-[#6D8196] text-[#FFFFE3]' : 'bg-[#CBCBCB] text-[#4A4A4A]'
                        }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#4A4A4A]">
                            {opt.title}
                          </h4>
                          {opt.badge && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#6D8196]/20 text-[#6D8196] border border-[#6D8196]/30">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#4A4A4A]/70 font-sans mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#6D8196] bg-[#6D8196]' : 'border-[#A0A0A0]'
                      }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFE3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom file area if custom selected */}
            {selectedDataset === 'custom' && (
              <div className="skeuo-panel p-3 space-y-2 animate-in fade-in">
                <label className="text-xs font-semibold text-[#4A4A4A] block">
                  Upload CSV File or Paste Raw CSV Text
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-[#4A4A4A] file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#6D8196] file:text-[#FFFFE3] hover:file:bg-[#5A6E83] cursor-pointer"
                />
                <textarea
                  value={customCsvContent}
                  onChange={(e) => setCustomCsvContent(e.target.value)}
                  placeholder="customerName,channel,feedback,sentiment,theme&#10;John Doe,Zendesk,Great app interface!,Positive,UX Performance"
                  rows={3}
                  className="w-full p-2 text-xs font-mono bg-[#FFFFE3] border border-[#A0A0A0] rounded focus:outline-none focus:ring-1 focus:ring-[#6D8196]"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBCBCB]">
              <Button
                variant="secondary"
                size="sm"
                onClick={closeRetrieveModal}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleStartRetrieve}
              >
                Retrieve CSV & Generate Dashboards
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
