'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { mockReports } from '@/lib/mockData';
import { CustomerReport } from '@/types';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Plus,
  FileSpreadsheet,
  DownloadCloud
} from 'lucide-react';

export default function ReportsPage() {
  const { isRetrieved, reportsList, openRetrieveModal } = useFeedbackContext();

  const reportsToDisplay: CustomerReport[] = isRetrieved && reportsList && reportsList.length > 0 ? reportsList : [];

  const [activeTab, setActiveTab] = useState<'All' | 'Weekly' | 'Monthly'>('All');
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(
    reportsToDisplay[0] || null
  );
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('Executive Customer Pulse – Q3 Sprint 4');
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly'>('Weekly');

  const filteredReports: CustomerReport[] = reportsToDisplay.filter((r: CustomerReport) => {
    if (activeTab === 'All') return true;
    return r.type === activeTab;
  });

  const activeReport: CustomerReport | null = selectedReport || filteredReports[0] || reportsToDisplay[0] || null;

  const handleGenerateReport = () => {
    const newReport: CustomerReport = {
      id: `rep_${Date.now()}`,
      title: reportTitle,
      type: reportType,
      generatedDate: new Date().toISOString().split('T')[0],
      author: 'LOOP AI Intelligence Engine',
      totalFeedbackAnalyzed: isRetrieved ? 1482 : 450,
      npsScore: 48,
      keyTakeaways: [
        'Customer satisfaction improved by +5.4% week-over-week following onboarding revamp.',
        'Users praised natural language responses in Ask LOOP AI.',
        'CSV batch uploads experienced latency for datasets over 50,000 rows.'
      ],
      topPositives: [
        'Interactive filtering and responsive UI dashboards praised by customer success teams',
        'Direct quote retrieval simplifies stakeholder presentations'
      ],
      topNegatives: [
        'Billing portal export errors during invoice reconciliation',
        'Mobile navigation menu lag on older tablet viewports'
      ],
      recommendations: [
        'Optimize memory usage on CSV ingestion pipeline',
        'Refactor mobile sidebar animation to 150ms transform for smooth scrolling'
      ]
    };

    setSelectedReport(newReport);
    setIsGenerateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Voice of Customer Reports
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Automated executive synthesis briefs summarizing customer feedback, NPS indices, and key recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRetrieved && (
            <Button
              variant="primary"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={openRetrieveModal}
            >
              Retrieve CSV
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsGenerateModalOpen(true)}
          >
            Generate New Report
          </Button>
        </div>
      </div>

      {!isRetrieved && (
        <div className="loop-card bg-neutral-50 p-4 border-l-4 border-l-black flex items-center justify-between gap-3 font-sans animate-in fade-in">
          <div className="flex items-center gap-3">
            <DownloadCloud className="w-5 h-5 text-neutral-900" />
            <div>
              <p className="text-xs font-bold text-neutral-900">Executive Reports Initialized at 0 (New User Session)</p>
              <p className="text-xs text-neutral-600 mt-0.5">Retrieve a CSV dataset to generate synthesis briefs, NPS analysis, and recommendations.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
            Retrieve CSV Dataset
          </Button>
        </div>
      )}

      {/* Tabs & Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reports List */}
        <div className="space-y-4">
          <div className="loop-card p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(['All', 'Weekly', 'Monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono-numbers text-neutral-500 font-bold px-2">
              {filteredReports.length} Briefs
            </span>
          </div>

          <div className="space-y-3">
            {!isRetrieved || filteredReports.length === 0 ? (
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center text-center font-sans">
                <FileText className="w-8 h-8 text-neutral-400 mb-2" />
                <h4 className="font-heading text-sm font-bold text-neutral-900">No Synthesis Reports</h4>
                <p className="text-xs text-neutral-500 mt-1 mb-3">Retrieve a CSV dataset to view executive briefs.</p>
                <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
                  Retrieve CSV Dataset
                </Button>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isSelected = activeReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-150 font-sans ${
                      isSelected
                        ? 'bg-neutral-900 text-white border border-neutral-900 shadow-md scale-[1.01]'
                        : 'bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-2xs text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded font-mono-numbers ${
                        isSelected ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                      }`}>
                        {report.type} Brief
                      </span>
                      <span className={`text-[10px] font-mono-numbers flex items-center gap-1 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        <Calendar className="w-3 h-3" />
                        {report.generatedDate}
                      </span>
                    </div>

                    <h3 className={`font-heading font-bold text-sm line-clamp-1 ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                      {report.title}
                    </h3>

                    <div className={`flex items-center justify-between text-xs font-mono-numbers mt-3 pt-2 border-t ${
                      isSelected ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-600'
                    }`}>
                      <span>{report.totalFeedbackAnalyzed} tickets</span>
                      <span className="font-bold">NPS: {report.npsScore > 0 ? `+${report.npsScore}` : report.npsScore}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Report Reader View */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <Card variant="panel" className="space-y-6 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[9px] uppercase font-mono-numbers font-bold tracking-widest rounded bg-neutral-900 text-white">
                      {activeReport.type} Executive Synthesis
                    </span>
                    <span className="text-xs font-mono-numbers text-neutral-500">
                      Author: {activeReport.author}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {activeReport.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={<Printer className="w-3.5 h-3.5" />}>
                    Print Brief
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                    PDF
                  </Button>
                </div>
              </div>

              {/* KPI Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-center">
                  <span className="text-[10px] font-mono-numbers uppercase font-bold text-neutral-500 block">Sample Analyzed</span>
                  <span className="font-mono-numbers text-lg font-bold text-neutral-900">
                    {activeReport.totalFeedbackAnalyzed}
                  </span>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-center">
                  <span className="text-[10px] font-mono-numbers uppercase font-bold text-neutral-500 block">NPS Score</span>
                  <span className="font-mono-numbers text-lg font-bold text-neutral-900">
                    +{activeReport.npsScore}
                  </span>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono-numbers uppercase font-bold text-neutral-500 block">Confidence</span>
                  <span className="font-mono-numbers text-lg font-bold text-neutral-900">
                    98.4%
                  </span>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-900" />
                  Executive Key Takeaways
                </h3>
                <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-2 font-sans text-xs">
                  {activeReport.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positives & Negatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="loop-card p-4 border-l-4 border-l-black space-y-2">
                  <h4 className="font-heading font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    Top Delighters & Positives
                  </h4>
                  <ul className="space-y-1.5 text-neutral-700">
                    {activeReport.topPositives.map((pos, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="loop-card p-4 border-2 border-neutral-900 space-y-2">
                  <h4 className="font-heading font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-neutral-900" />
                    Top Pain Points & Friction
                  </h4>
                  <ul className="space-y-1.5 text-neutral-700">
                    {activeReport.topNegatives.map((neg, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{neg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="space-y-2 font-sans">
                <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-neutral-900" />
                  Strategic Product Recommendations
                </h3>
                <div className="loop-card p-4 space-y-2.5 bg-neutral-50/70">
                  {activeReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-neutral-800">
                      <span className="px-2 py-0.5 rounded font-mono-numbers font-bold text-[10px] bg-neutral-900 text-white shrink-0">
                        #{i + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="loop-card p-12 text-center font-sans">
              <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <h3 className="font-heading text-base font-bold text-neutral-900">No Executive Brief Selected</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 mb-4">Click Retrieve CSV to populate executive briefs.</p>
              <Button variant="primary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={openRetrieveModal}>
                Retrieve CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Voice of Customer Report"
        description="Synthesize executive feedback brief from active workspace dataset"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleGenerateReport} icon={<Sparkles className="w-4 h-4" />}>
              Synthesize Brief
            </Button>
          </>
        }
      >
        <div className="space-y-3 font-sans">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Report Cadence</label>
            <div className="flex gap-4">
              {(['Weekly', 'Monthly'] as const).map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer select-none text-neutral-800">
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === t}
                    onChange={() => setReportType(t)}
                    className="accent-black"
                  />
                  {t} Synthesis
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
