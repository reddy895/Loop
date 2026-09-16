'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  FeedbackItem,
  ThemeSummary,
  CustomerReport
} from '@/types';
import {
  getDatasetBundle,
  parseCustomCsvContent
} from '@/lib/datasetGenerator';

// Zero-state data constants for new user initialization
const zeroVolumeData = [
  { date: 'Jul 29', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Jul 30', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Jul 31', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 01', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 02', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 03', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 04', volume: 0, positive: 0, negative: 0, neutral: 0 }
];

const zeroSentimentPieData = [
  { name: 'Positive', value: 0, color: '#6D8196' },
  { name: 'Negative', value: 0, color: '#4A4A4A' },
  { name: 'Neutral', value: 0, color: '#CBCBCB' }
];

const zeroTopThemesBarData = [
  { theme: 'UX Performance', count: 0 },
  { theme: 'Integration Request', count: 0 },
  { theme: 'Billing & Pricing', count: 0 },
  { theme: 'Mobile Resp.', count: 0 },
  { theme: 'Security & Auth', count: 0 }
];

const zeroChannelSentimentData = [
  { channel: 'Zendesk', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Intercom', positive: 0, neutral: 0, negative: 0 },
  { channel: 'App Store', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Discourse', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Email', positive: 0, neutral: 0, negative: 0 }
];

const zeroWeeklySentimentTrend = [
  { week: 'Wk 27', positivePct: 0, negativePct: 0 },
  { week: 'Wk 28', positivePct: 0, negativePct: 0 },
  { week: 'Wk 29', positivePct: 0, negativePct: 0 },
  { week: 'Wk 30', positivePct: 0, negativePct: 0 },
  { week: 'Wk 31', positivePct: 0, negativePct: 0 },
  { week: 'Wk 32', positivePct: 0, negativePct: 0 }
];

const zeroThemeComparisonData = [
  { theme: 'UX Performance', currentMonth: 0, prevMonth: 0 },
  { theme: 'Integration Request', currentMonth: 0, prevMonth: 0 },
  { theme: 'Billing & Pricing', currentMonth: 0, prevMonth: 0 },
  { theme: 'Mobile Responsiveness', currentMonth: 0, prevMonth: 0 },
  { theme: 'Security & Auth', currentMonth: 0, prevMonth: 0 }
];

const zeroSentimentDistributionData = [
  { range: '0-20 (Critical)', count: 0 },
  { range: '21-40 (Negative)', count: 0 },
  { range: '41-60 (Neutral)', count: 0 },
  { range: '61-80 (Positive)', count: 0 },
  { range: '81-100 (Delighted)', count: 0 }
];

const zeroChannelPerformanceList = [
  { channel: 'Zendesk Support', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Intercom Live Chat', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'App Store Reviews', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Discourse Forum', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Direct Email', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' }
];

export type DatasetType = 'enterprise' | 'appstore' | 'zendesk' | 'custom';

interface FeedbackContextType {
  isRetrieved: boolean;
  isServerMode: boolean; // true when data lives in DB (large CSV uploaded)
  activeDatasetType: DatasetType;
  datasetName: string;
  feedbackList: FeedbackItem[];
  stats: {
    totalFeedback: number;
    negativePct: string;
    positivePct: string;
    newThisWeek: number;
    csat?: string;
    nps?: string;
  };
  volumeData: any[];
  sentimentPieData: any[];
  topThemesBarData: any[];
  channelSentimentData: any[];
  weeklySentimentTrend: any[];
  themeComparisonData: any[];
  sentimentDistributionData: any[];
  channelPerformanceList: any[];
  themeSummaries: ThemeSummary[];
  reportsList: CustomerReport[];
  isRetrieveModalOpen: boolean;
  openRetrieveModal: () => void;
  closeRetrieveModal: () => void;
  retrieveCSV: (datasetType?: DatasetType, customCsvText?: string) => void;
  resetToZero: () => void;
  addFeedbackItem: (item: FeedbackItem) => void;
  lastRetrievedTime: string | null;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRetrieved, setIsRetrieved] = useState<boolean>(false);
  const [isServerMode, setIsServerMode] = useState<boolean>(false); // true = data is in SQLite DB
  const [activeDatasetType, setActiveDatasetType] = useState<DatasetType>('enterprise');
  const [currentBundle, setCurrentBundle] = useState<any>(null);
  const [isRetrieveModalOpen, setIsRetrieveModalOpen] = useState<boolean>(false);
  const [lastRetrievedTime, setLastRetrievedTime] = useState<string | null>(null);
  const [customItemsList, setCustomItemsList] = useState<FeedbackItem[] | null>(null);

  const openRetrieveModal = () => setIsRetrieveModalOpen(true);
  const closeRetrieveModal = () => setIsRetrieveModalOpen(false);

  const retrieveCSV = (datasetType: DatasetType = 'enterprise', customCsvText?: string) => {
    // Special sentinel value '__server__' means the data was streamed to the DB
    if (customCsvText === '__server__') {
      setActiveDatasetType('custom');
      setIsServerMode(true);
      setCurrentBundle(null);
      setCustomItemsList(null);
      setIsRetrieved(true);
      setLastRetrievedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRetrieveModalOpen(false);
      return;
    }

    const bundle = getDatasetBundle(datasetType, customCsvText);
    setActiveDatasetType(datasetType);
    setCurrentBundle(bundle);
    setCustomItemsList(null);
    setIsServerMode(false);
    setIsRetrieved(true);
    setLastRetrievedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsRetrieveModalOpen(false);
  };

  const resetToZero = () => {
    setIsRetrieved(false);
    setIsServerMode(false);
    setActiveDatasetType('enterprise');
    setCurrentBundle(null);
    setCustomItemsList(null);
    setLastRetrievedTime(null);
  };

  const addFeedbackItem = (item: FeedbackItem) => {
    if (!isRetrieved) {
      retrieveCSV('enterprise');
    }
    setCustomItemsList((prev) => [item, ...(prev || currentBundle?.feedbackList || [])]);
  };

  const activeFeedbackList = customItemsList || currentBundle?.feedbackList || [];

  const stats = {
    // In server mode, show a placeholder until the dashboard API returns real counts
    totalFeedback: isServerMode
      ? (currentBundle?.stats?.totalFeedback || 0)
      : isRetrieved
        ? Math.max(currentBundle?.stats?.totalFeedback || 0, activeFeedbackList.length)
        : 0,
    negativePct: isRetrieved ? (currentBundle?.stats?.negativePct || '0.0%') : '0.0%',
    positivePct: isRetrieved ? (currentBundle?.stats?.positivePct || '0.0%') : '0.0%',
    newThisWeek: isRetrieved ? (currentBundle?.stats?.newThisWeek || activeFeedbackList.length) : 0,
    csat: isRetrieved ? (currentBundle?.stats?.csat || '8.4 / 10') : '0.0 / 10',
    nps: isRetrieved ? (currentBundle?.stats?.nps || '+48 NPS') : '0 NPS'
  };

  const datasetName = isServerMode
    ? 'Custom CSV (Server-Side — Big Data Mode)'
    : (currentBundle?.datasetName || 'Enterprise Customer Feedback Dataset (Q3)');

  const volumeData = isRetrieved ? (currentBundle?.volumeData || []) : zeroVolumeData;
  const sentimentPieData = isRetrieved ? (currentBundle?.sentimentPieData || []) : zeroSentimentPieData;
  const topThemesBarData = isRetrieved ? (currentBundle?.topThemesBarData || []) : zeroTopThemesBarData;
  const channelSentimentData = isRetrieved ? (currentBundle?.channelSentimentData || []) : zeroChannelSentimentData;
  const weeklySentimentTrend = isRetrieved ? (currentBundle?.weeklySentimentTrend || []) : zeroWeeklySentimentTrend;
  const themeComparisonData = isRetrieved ? (currentBundle?.themeComparisonData || []) : zeroThemeComparisonData;
  const sentimentDistributionData = isRetrieved ? (currentBundle?.sentimentDistributionData || []) : zeroSentimentDistributionData;
  const channelPerformanceList = isRetrieved ? (currentBundle?.channelPerformanceList || []) : zeroChannelPerformanceList;
  const themeSummaries = isRetrieved ? (currentBundle?.themeSummaries || []) : [];
  const reportsList = isRetrieved ? (currentBundle?.reportsList || []) : [];

  return (
    <FeedbackContext.Provider
      value={{
        isRetrieved,
        isServerMode,
        activeDatasetType,
        datasetName,
        feedbackList: activeFeedbackList,
        stats,
        volumeData,
        sentimentPieData,
        topThemesBarData,
        channelSentimentData,
        weeklySentimentTrend,
        themeComparisonData,
        sentimentDistributionData,
        channelPerformanceList,
        themeSummaries,
        reportsList,
        isRetrieveModalOpen,
        openRetrieveModal,
        closeRetrieveModal,
        retrieveCSV,
        resetToZero,
        addFeedbackItem,
        lastRetrievedTime
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext must be used within a FeedbackProvider');
  }
  return context;
};
