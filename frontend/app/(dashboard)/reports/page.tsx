'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useFeedbackContext } from '@/context/FeedbackContext';
import { CustomerReport } from '@/types';
import {
  FileText,
  Plus,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Printer,
  FileSpreadsheet,
  DownloadCloud
} from 'lucide-react';

export default function ReportsPage() {
  const { isRetrieved, reportsList: contextReports, openRetrieveModal } = useFeedbackContext();
  const [localReports, setLocalReports] = useState<CustomerReport[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Weekly' | 'Monthly'>('All');

  const reportsList = isRetrieved ? (localReports.length > 0 ? localReports : contextReports) : [];
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(reportsList[0] || null);

  // Generate Report Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [reportTitle, setReportTitle] = useState('Voice of Customer Synthesis – Q3');

  const filteredReports = reportsList.filter((r) => {
    if (activeTab === 'All') return true;
    return r.type === activeTab;
  });

  const activeReport = selectedReport || filteredReports[0] || null;

  const handleGenerateReport = () => {
    const newReport: CustomerReport = {
      id: `rep-${Date.now()}`,
      title: reportTitle,
      type: reportType,
      generatedDate: new Date().toISOString().split('T')[0],
      author: 'Praveen Kumar (Enterprise CPO)',
      totalFeedbackAnalyzed: 412,
      npsScore: +45,
      topPositives: [
        'High customer appreciation for Ask LOOP response accuracy and interactive quote citations.',
        'Speedy response on UX bug tickets.'
      ],
      topNegatives: [
        'Stream processing needed for CSV downloads over 5,000 items.'
      ],
      keyTakeaways: [
        'Customer satisfaction index increased by 8% following recent patch updates.',
        'Billing transparency issues are trending down.'
      ],
      recommendations: [
        'Deploy CSV streaming API in August release.',
        'Complete SAML SSO integration for enterprise accounts.'
      ]
    };

    setLocalReports([newReport, ...reportsList]);
    setSelectedReport(newReport);
    setIsGenerateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Voice of Customer Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
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
        <div className="skeuo-panel bg-[#6D8196]/10 p-4 border-l-4 border-l-[#6D8196] flex items-center justify-between gap-3 font-sans animate-in fade-in">
          <div className="flex items-center gap-3">
            <DownloadCloud className="w-5 h-5 text-[#6D8196]" />
            <div>
              <p className="text-xs font-bold text-[#4A4A4A]">Executive Reports Initialized at 0 (New User Session)</p>
              <p className="text-xs text-[#4A4A4A]/80">Retrieve a CSV dataset to generate synthesis briefs, NPS analysis, and recommendations.</p>
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
          <div className="skeuo-panel p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(['All', 'Weekly', 'Monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold font-sans transition-all ${
                    activeTab === tab
                      ? 'bg-[#6D8196] text-[#FFFFE3] shadow-xs'
                      : 'text-[#4A4A4A] hover:bg-[#CBCBCB]/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono-numbers text-[#6D8196] font-bold px-2">
              {filteredReports.length} Briefs
            </span>
          </div>

          <div className="space-y-3">
            {!isRetrieved || filteredReports.length === 0 ? (
              <div className="skeuo-inset p-8 flex flex-col items-center justify-center text-center font-sans">
                <FileText className="w-8 h-8 text-[#4A4A4A]/50 mb-2" />
                <h4 className="font-heading text-sm font-bold text-[#4A4A4A]">No Synthesis Reports</h4>
                <p className="text-xs text-[#4A4A4A]/70 mt-1 mb-3">Retrieve a CSV dataset to view executive briefs.</p>
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
                    className={`cursor-pointer rounded-lg p-4 transition-all duration-150 font-sans ${
                      isSelected
                        ? 'skeuo-panel border-2 border-[#6D8196] shadow-md scale-[1.01]'
                        : 'skeuo-card-cream hover:bg-[#CBCBCB]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-[#6D8196] text-[#FFFFE3]">
                        {report.type} Brief
                      </span>
                      <span className="text-[10px] font-mono-numbers text-[#4A4A4A]/70 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#6D8196]" />
                        {report.generatedDate}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-[#4A4A4A] line-clamp-1">
                      {report.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs font-mono-numbers text-[#4A4A4A]/80 mt-3 pt-2 border-t border-[#4A4A4A]/10">
                      <span>{report.totalFeedbackAnalyzed} tickets</span>
                      <span className="font-bold text-[#6D8196]">NPS: {report.npsScore > 0 ? `+${report.npsScore}` : report.npsScore}</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4A4A4A]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest rounded bg-[#6D8196] text-[#FFFFE3]">
                      {activeReport.type} Executive Synthesis
                    </span>
                    <span className="text-xs font-mono-numbers text-[#4A4A4A]/70">
                      Author: {activeReport.author}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#4A4A4A]">
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
                <div className="skeuo-inset p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block">Sample Analyzed</span>
                  <span className="font-mono-numbers text-lg font-bold text-[#6D8196]">
                    {activeReport.totalFeedbackAnalyzed}
                  </span>
                </div>
                <div className="skeuo-inset p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block">NPS Score</span>
                  <span className="font-mono-numbers text-lg font-bold text-green-700">
                    +{activeReport.npsScore}
                  </span>
                </div>
                <div className="skeuo-inset p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block">Confidence</span>
                  <span className="font-mono-numbers text-lg font-bold text-[#4A4A4A]">
                    98.4%
                  </span>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#4A4A4A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6D8196]" />
                  Executive Key Takeaways
                </h3>
                <div className="skeuo-card-cream p-4 rounded-lg space-y-2 font-sans text-xs">
                  {activeReport.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#4A4A4A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6D8196] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positives & Negatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="skeuo-panel p-4 bg-[#E2ECD8]/50 border-l-4 border-l-green-600 space-y-2">
                  <h4 className="font-heading font-bold text-xs text-[#2D4E2A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                    Top Delighters & Positives
                  </h4>
                  <ul className="space-y-1.5 text-[#2D4E2A]">
                    {activeReport.topPositives.map((pos, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="skeuo-panel p-4 bg-red-50/50 border-l-4 border-l-red-600 space-y-2">
                  <h4 className="font-heading font-bold text-xs text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-700" />
                    Top Pain Points & Friction
                  </h4>
                  <ul className="space-y-1.5 text-red-900">
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
                <h3 className="font-heading font-bold text-sm text-[#4A4A4A] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Strategic Product Recommendations
                </h3>
                <div className="skeuo-panel p-4 space-y-2 bg-[#FFFFE3]">
                  {activeReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-[#4A4A4A]">
                      <span className="px-2 py-0.5 rounded font-mono-numbers font-bold text-[10px] bg-[#6D8196] text-[#FFFFE3]">
                        #{i + 1}
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="skeuo-panel p-12 text-center font-sans">
              <FileText className="w-10 h-10 text-[#4A4A4A]/40 mx-auto mb-2" />
              <h3 className="font-heading text-base font-bold text-[#4A4A4A]">No Executive Brief Selected</h3>
              <p className="text-xs text-[#4A4A4A]/70 max-w-xs mx-auto mt-1 mb-4">Click Retrieve CSV to populate executive briefs.</p>
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
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full skeuo-input px-3 py-1.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Report Cadence</label>
            <div className="flex gap-4">
              {(['Weekly', 'Monthly'] as const).map((t) => (
                <label key={t} className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === t}
                    onChange={() => setReportType(t)}
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
