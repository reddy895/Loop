'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockReports } from '@/lib/mockData';
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
  Printer
} from 'lucide-react';

export default function ReportsPage() {
  const [reportsList, setReportsList] = useState<CustomerReport[]>(mockReports);
  const [activeTab, setActiveTab] = useState<'All' | 'Weekly' | 'Monthly'>('All');
  const [selectedReport, setSelectedReport] = useState<CustomerReport>(mockReports[0]);

  // Generate Report Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [reportTitle, setReportTitle] = useState('Voice of Customer Synthesis – Q3');

  const filteredReports = reportsList.filter((r) => {
    if (activeTab === 'All') return true;
    return r.type === activeTab;
  });

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

    setReportsList([newReport, ...reportsList]);
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

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate New Report
        </Button>
      </div>

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
                      ? 'skeuo-button-primary text-[#FFFFE3]'
                      : 'text-[#4A4A4A] hover:bg-[#FFFFE3]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono-numbers text-[#4A4A4A]/70 px-2 font-bold">
              {filteredReports.length} Reports
            </span>
          </div>

          <div className="space-y-3">
            {filteredReports.map((rep) => {
              const isSelected = selectedReport.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-150 border ${
                    isSelected
                      ? 'skeuo-panel border-2 border-[#6D8196] shadow-md'
                      : 'skeuo-card-cream hover:bg-[#CBCBCB]/30 border-[#CBCBCB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono-numbers bg-[#6D8196] text-[#FFFFE3]">
                      {rep.type} Report
                    </span>
                    <span className="text-[10px] font-mono-numbers text-[#4A4A4A]/70">
                      {rep.generatedDate}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#4A4A4A]">
                    {rep.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#4A4A4A]/70 font-sans">
                    <span>{rep.totalFeedbackAnalyzed} Feedback Analyzed</span>
                    <span className="font-mono-numbers font-bold text-[#6D8196]">NPS: {rep.npsScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Report Viewer */}
        <div className="lg:col-span-2">
          <Card variant="panel" className="p-6 space-y-6">
            {/* Viewer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4A4A4A]/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase font-mono-numbers bg-[#6D8196] text-[#FFFFE3] rounded">
                    {selectedReport.type}
                  </span>
                  <span className="text-xs font-mono-numbers text-[#4A4A4A]/70">
                    Generated: {selectedReport.generatedDate} by {selectedReport.author}
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#4A4A4A]">
                  {selectedReport.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary" size="sm" icon={<Printer className="w-4 h-4" />}>
                  Print
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => alert(`Exporting ${selectedReport.title} as PDF...`)}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="skeuo-inset p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block font-mono-numbers">
                  Analyzed Records
                </span>
                <span className="text-xl font-bold font-mono-numbers text-[#4A4A4A]">
                  {selectedReport.totalFeedbackAnalyzed}
                </span>
              </div>
              <div className="skeuo-inset p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block font-mono-numbers">
                  Net Promoter Score
                </span>
                <span className="text-xl font-bold font-mono-numbers text-green-700">
                  {selectedReport.npsScore}
                </span>
              </div>
              <div className="skeuo-inset p-3 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/70 block font-mono-numbers">
                  Status
                </span>
                <span className="text-xs font-bold text-[#6D8196] block mt-1">
                  Verified Executive Brief
                </span>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-5 font-sans text-xs sm:text-sm text-[#4A4A4A]">
              {/* Executive Key Takeaways */}
              <div>
                <h3 className="font-heading font-bold text-base text-[#4A4A4A] flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#6D8196]" /> Executive Key Takeaways
                </h3>
                <div className="space-y-2">
                  {selectedReport.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="p-3 rounded bg-[#FFFFE3] border border-[#CBCBCB] font-sans">
                      • {takeaway}
                    </div>
                  ))}
                </div>
              </div>

              {/* Positives & Negatives Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#E2ECD8] border border-[#B4CE9F]">
                  <h4 className="font-heading font-bold text-sm text-[#2D4E2A] flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700" /> Major Positive Drivers
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#2D4E2A] list-disc list-inside">
                    {selectedReport.topPositives.map((pos, i) => (
                      <li key={i}>{pos}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#F8E2E2] border border-[#E6B0B0]">
                  <h4 className="font-heading font-bold text-sm text-[#612727] flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-700" /> Key Friction Points
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#612727] list-disc list-inside">
                    {selectedReport.topNegatives.map((neg, i) => (
                      <li key={i}>{neg}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div>
                <h3 className="font-heading font-bold text-base text-[#4A4A4A] flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-[#D9A357]" /> Strategic Product Recommendations
                </h3>
                <div className="space-y-2">
                  {selectedReport.recommendations.map((rec, i) => (
                    <div key={i} className="skeuo-inset p-3 flex items-center gap-2 text-xs font-semibold text-[#4A4A4A]">
                      <span className="w-5 h-5 rounded-full bg-[#6D8196] text-[#FFFFE3] text-[10px] flex items-center justify-center font-mono-numbers shrink-0">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Generate Report Modal Dialog */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Synthesize New Executive Report"
        description="Configure report parameters to run AI feedback aggregation synthesis"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleGenerateReport}>
              Generate Report Now
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full skeuo-input px-3 py-1.5 text-xs font-sans"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Report Frequency</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'Weekly' | 'Monthly')}
                className="w-full skeuo-input px-2 py-1.5 text-xs bg-[#FFFFE3]"
              >
                <option value="Weekly">Weekly Digest</option>
                <option value="Monthly">Monthly Executive Brief</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Theme Filter Scope</label>
              <select className="w-full skeuo-input px-2 py-1.5 text-xs bg-[#FFFFE3]">
                <option value="all">All Feedback Themes</option>
                <option value="ux">UX Performance Only</option>
                <option value="billing">Billing & Pricing Only</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
